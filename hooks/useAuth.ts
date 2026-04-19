import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  // Supabase v2 fires SIGNED_IN immediately after PASSWORD_RECOVERY — this ref
  // prevents that SIGNED_IN from clearing the recovery flag before the modal opens.
  const recoveryInProgress = useRef(false);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    if (event === 'PASSWORD_RECOVERY') {
      recoveryInProgress.current = true;
      setSession(session);
      setUser(session?.user ?? null);
      setIsPasswordRecovery(true);
      setLoading(false);
      return;
    }

    if (event === 'USER_UPDATED') {
      // Password was updated — clear recovery state so the modal can close normally.
      recoveryInProgress.current = false;
      setIsPasswordRecovery(false);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      return;
    }

    if (event === 'SIGNED_IN' && recoveryInProgress.current) {
      // This SIGNED_IN is the automatic sign-in from the recovery link — keep modal open.
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      return;
    }

    recoveryInProgress.current = false;
    setIsPasswordRecovery(false);
    setSession(session);
    setUser(session?.user ?? null);
    setError(null);
    setLoading(false);
  }, []);

  const clearPasswordRecovery = useCallback(() => {
    recoveryInProgress.current = false;
    setIsPasswordRecovery(false);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      setError('Sign out unavailable — Supabase not configured');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (import.meta.env.DEV) console.error('useAuth: Error signing out:', error.message);
        setError(error.message);
        // Force local cleanup even if the server call failed
        setUser(null);
        setSession(null);
      } else {
        setError(null);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('useAuth: Unexpected error during sign out:', err);
      setError('Unexpected error during sign out');
      // Force local cleanup even on exception
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      if (import.meta.env.DEV) console.warn('useAuth: Supabase client is not available');
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
