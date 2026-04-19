import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    if (event === 'PASSWORD_RECOVERY') {
      // Don't treat recovery as a normal sign-in — just surface the flag so
      // the app can open the reset-password modal instead of the main UI.
      setSession(session);
      setUser(session?.user ?? null);
      setIsPasswordRecovery(true);
      setLoading(false);
      return;
    }

    setIsPasswordRecovery(false);
    setSession(session);
    setUser(session?.user ?? null);
    setError(null);
    setLoading(false);
  }, []);

  const clearPasswordRecovery = useCallback(() => setIsPasswordRecovery(false), []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      setError('Sign out unavailable — Supabase not configured');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useAuth: Error signing out:', error.message);
        setError(error.message);
        // Force local cleanup even if the server call failed
        setUser(null);
        setSession(null);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('useAuth: Unexpected error during sign out:', err);
      setError('Unexpected error during sign out');
      // Force local cleanup even on exception
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      console.warn('useAuth: Supabase client is not available');
      setLoading(false);
      return;
    }

    // onAuthStateChange fires INITIAL_SESSION immediately in Supabase v2,
    // so getSession() is redundant and creates a double-write race.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Safety net: if INITIAL_SESSION never fires (e.g. network error at startup),
    // clear the loading spinner after 8 seconds so the UI is not blocked forever.
    const fallbackTimer = setTimeout(() => {
      setLoading((prev) => {
        if (prev) console.warn('useAuth: INITIAL_SESSION never fired — clearing loading state');
        return false;
      });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, [handleAuthStateChange]);

  return useMemo(() => ({
    user,
    session,
    loading,
    error,
    signOut,
    isAuthenticated,
    isPasswordRecovery,
    clearPasswordRecovery,
  }), [user, session, loading, error, signOut, isAuthenticated, isPasswordRecovery, clearPasswordRecovery]);
}
