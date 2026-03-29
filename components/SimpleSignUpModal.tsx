import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getSignUpConfig, logEmailRedirectInfo } from '../lib/emailRedirectConfig';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface SimpleSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess?: () => void;
}

const SimpleSignUpModal: React.FC<SimpleSignUpModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Log de información de debug
      logEmailRedirectInfo();

      // TEMPORAL: Deshabilitar confirmación de email mientras solucionamos el problema
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...getSignUpConfig(),
          emailConfirm: false // TEMPORAL: No requerir confirmación de email
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        if (onSignInSuccess) {
          onSignInSuccess();
        }
      }
    } catch (err) {
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel-box" style={{ width: 420, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="panel-header">
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>CREATE ACCOUNT</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
        </div>
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1, background: 'var(--color-surface)' }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: 12, color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                ⚠️ TEMPORAL: Email confirmation disabled
              </div>
              <p style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)', marginBottom: 16, fontSize: 15 }}>
                Account created successfully! You can now sign in.
              </p>
              <button
                onClick={onClose}
                className="btn-comic btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: 16, letterSpacing: 2, marginTop: 12 }}
              >
                CLOSE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignUp}>
              <div style={{ background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: 12, color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                ⚠️ TEMPORAL: Email confirmation is disabled due to email service issues.
              </div>

              {error && (
                <div style={{ background: 'var(--color-surface-2)', border: '1.5px solid #ef4444', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: 12, color: '#ef4444', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="signup-email" style={{ display: 'block', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text)', marginBottom: 6, fontWeight: 600 }}>
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="signup-password" style={{ display: 'block', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text)', marginBottom: 6, fontWeight: 600 }}>
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
                  placeholder="Minimum 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-comic btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: 16, letterSpacing: 2, marginTop: 12 }}
              >
                {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
              </button>

              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', textAlign: 'center', marginTop: 12 }}>
                By creating an account, you agree to our terms of service.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleSignUpModal;
