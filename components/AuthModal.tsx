import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signup' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { setError('Servicio no disponible'); return; }
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) { setError(err.message); return; }
        sessionStorage.setItem('just_registered', '1');
        setSignupSuccess(true);
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) { setError(err.message); return; }
        // Modal stays open — App.tsx useEffect will close it via onAuthStateChange
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--color-surface, #0f172a)',
    border: '1px solid var(--color-border, #334155)',
    color: 'var(--color-text, #e2e8f0)',
    fontFamily: 'inherit',
    fontSize: 13,
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-comic, Bangers, sans-serif)',
    fontSize: 10,
    letterSpacing: '0.1em',
    color: 'var(--color-text-muted, #64748b)',
    marginBottom: 4,
    textTransform: 'uppercase',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--color-surface-2, #1e293b)', border: '1px solid var(--color-border, #334155)', width: 320, padding: 28, position: 'relative' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', color: 'var(--color-text-muted, #64748b)', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}
          aria-label="Cerrar"
        >✕</button>

        {signupSuccess ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 22, letterSpacing: 3, color: 'var(--color-accent, #f59e0b)' }}>
                ¡CUENTA CREADA!
              </div>
            </div>
            <p style={{ color: 'var(--color-text, #e2e8f0)', fontFamily: 'inherit', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
              Revisa tu email para confirmar la cuenta y luego inicia sesión.
            </p>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: 'pointer' }}
            >
              CERRAR
            </button>
          </>
        ) : (
          <>
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 22, letterSpacing: 3, color: 'var(--color-accent, #f59e0b)' }}>
                {mode === 'signup' ? 'ÚNETE AL ESCUADRÓN' : 'BIENVENIDO DE VUELTA'}
              </div>
              {mode === 'signup' && (
                <div style={{ fontSize: 10, color: 'var(--color-text-muted, #64748b)', letterSpacing: 1, marginTop: 2 }}>
                  CREA TU CUENTA GRATUITA
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete="email"
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Contraseña</label>
                <input
                  type="password"
                  placeholder="contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '...' : mode === 'signup' ? 'CREAR CUENTA →' : 'ENTRAR →'}
              </button>

              {error && (
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-accent, #f59e0b)', textAlign: 'center' }}>
                  {error}
                </div>
              )}
            </form>

            {/* Mode toggle */}
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--color-text-muted, #64748b)' }}>
              {mode === 'signup' ? (
                <>¿Ya tienes cuenta?{' '}
                  <button onClick={() => { setMode('signin'); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-accent, #f59e0b)', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: 0 }}>
                    INICIAR SESIÓN
                  </button>
                </>
              ) : (
                <>¿Nuevo aquí?{' '}
                  <button onClick={() => { setMode('signup'); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-accent, #f59e0b)', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: 0 }}>
                    ÚNETE GRATIS
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
