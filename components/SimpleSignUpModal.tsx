import React, { useState } from 'react';
import { getSignUpConfig, logEmailRedirectInfo } from '../lib/emailRedirectConfig';
import { supabase } from '../lib/supabase';
import { useLang, t } from '../lib/i18n';

interface SimpleSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess?: () => void;
}

const SimpleSignUpModal: React.FC<SimpleSignUpModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
}) => {
  const { lang } = useLang();
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
      if (!supabase) {
        setError(t('common.service_unavailable', lang));
        return;
      }

      logEmailRedirectInfo();

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: getSignUpConfig(),
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess(true);
        onSignInSuccess?.();
      }
    } catch {
      setError(t('common.service_unavailable', lang));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel-box" style={{ width: 420, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="panel-header">
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>{t('signup.title', lang)}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>X</button>
        </div>
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1, background: 'var(--color-surface)' }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-body)', marginBottom: 16, fontSize: 15 }}>
                {t('signup.success', lang)}
              </p>
              <button
                onClick={onClose}
                className="btn-comic btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: 16, letterSpacing: 2, marginTop: 12 }}
              >
                {t('signup.close', lang)}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignUp}>
              {error && (
                <div style={{ background: 'var(--color-surface-2)', border: '1.5px solid #ef4444', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: 12, color: '#ef4444', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="signup-email" style={{ display: 'block', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text)', marginBottom: 6, fontWeight: 600 }}>
                  {t('common.email_label', lang)}
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
                  placeholder={t('signup.email_placeholder', lang)}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label htmlFor="signup-password" style={{ display: 'block', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text)', marginBottom: 6, fontWeight: 600 }}>
                  {t('signup.password_label', lang)}
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
                  placeholder={t('signup.password_hint', lang)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-comic btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: 16, letterSpacing: 2, marginTop: 12 }}
              >
                {loading ? t('signup.submitting', lang) : t('signup.submit', lang)}
              </button>

              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', textAlign: 'center', marginTop: 12 }}>
                {t('signup.terms', lang)}
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleSignUpModal;
