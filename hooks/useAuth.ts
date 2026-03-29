import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔧 OPTIMIZADO: Memoizar el estado de autenticación para evitar re-cálculos
  const isAuthenticated = useMemo(() => !!user, [user]);

  // 🔧 OPTIMIZADO: Usar useCallback para evitar re-creaciones de funciones
  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('useAuth: Auth state changed:', event, session?.user?.email);
    }
    
    setSession(session);
    setUser(session?.user ?? null);
    setError(null); // Limpiar errores cuando hay cambios de estado
    setLoading(false);
  }, []);

  // 🔧 OPTIMIZADO: Usar useCallback para la función de logout
  const signOut = useCallback(async () => {
    if (!supabase) {
      console.warn('useAuth: Supabase not available for sign out');
      setError('No se puede cerrar sesión - Supabase no disponible');
      return;
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useAuth: Error signing out:', error.message);
        setError(error.message);
        // ✅ CRITICAL FIX: FORZAR LIMPIEZA LOCAL SIEMPRE
        console.log('useAuth: Forzando limpieza local después de error en signOut');
        setUser(null);
        setSession(null);
      } else {
        setError(null);
        if (process.env.NODE_ENV === 'development') {
          console.log('useAuth: User signed out successfully');
        }
      }
    } catch (err) {
      console.error('useAuth: Unexpected error during sign out:', err);
      setError('Error inesperado al cerrar sesión');
      // ✅ CRITICAL FIX: FORZAR LIMPIEZA LOCAL SIEMPRE
      console.log('useAuth: Forzando limpieza local después de error inesperado');
      setUser(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    // Si Supabase no está disponible, marcar como no autenticado
    if (!supabase) {
      console.warn('useAuth: Supabase client is not available');
      setError('Supabase no está configurado');
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      
      if (error) {
        console.error('useAuth: Error getting session:', error);
        setError(error.message);
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        if (process.env.NODE_ENV === 'development') {
          console.log('useAuth: Session loaded:', session?.user?.email);
        }
      }
      setLoading(false);
    }).catch((error: any) => {
      if (!isMounted) return;
      
      console.error('useAuth: Unexpected error getting session:', error);
      setError('Error inesperado al cargar la sesión');
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  // 🔧 OPTIMIZADO: Retornar objeto memoizado para evitar re-renders innecesarios
  return useMemo(() => ({
    user,
    session,
    loading,
    error,
    signOut,
    isAuthenticated,
  }), [user, session, loading, error, signOut, isAuthenticated]);
} 