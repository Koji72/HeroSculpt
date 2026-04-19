import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getSignUpConfig, getEmailRedirectUrl } from '../lib/emailRedirectConfig';
import { useLang, t } from '../lib/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signup' }) => {
  const { lang } = useLang();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setSignupSuccess(false);
      setForgotSent(false);
      setError(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) { setError(t('common.service_unavailable', lang)); return; }
    setError(null);
    setLoading(true);
    try {
      if (mode === 'forgot') {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: getEmailRedirectUrl(),
        });
        if (err) { setError(err.message); return; }
        setForgotSent(true);
      } else if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({ email, password, options: getSignUpConfig() });
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
          aria-label={t('common.close', lang)}
        >✕</button>

        {forgotSent ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 22, letterSpacing: 3, color: 'var(--color-accent, #f59e0b)' }}>
                {t('auth.email_sent', lang)}
              </div>
            </div>
            <p style={{ color: 'var(--color-text, #e2e8f0)', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
              {t('auth.email_sent_body', lang)}
            </p>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: 'pointer' }}
            >
              {t('auth.close_btn', lang)}
            </button>
          </>
        ) : signupSuccess ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 22, letterSpacing: 3, color: 'var(--color-accent, #f59e0b)' }}>
                {t('auth.account_created', lang)}
              </div>
            </div>
            <p style={{ color: 'var(--color-text, #e2e8f0)', fontFamily: 'inherit', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
              {t('auth.account_created_body', lang)}
            </p>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: 'pointer' }}
            >
              {t('auth.close_btn', lang)}
            </button>
          </>
        ) : (
          <>
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 22, letterSpacing: 3, color: 'var(--color-accent, #f59e0b)' }}>
                {mode === 'signup' ? t('auth.title.signup', lang) : mode === 'forgot' ? t('auth.title.forgot', lang) : t('auth.title.signin', lang)}
              </div>
              {mode === 'signup' && (
                <div style={{ fontSize: 10, color: 'var(--color-text-muted, #64748b)', letterSpacing: 1, marginTop: 2 }}>
                  {t('auth.signup_subtitle', lang)}
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: mode === 'forgot' ? 20 : 14 }}>
                <label style={labelStyle}>{t('common.email_label', lang)}</label>
                <input
                  type="email"
                  name="email"
                  placeholder={t('auth.email_placeholder', lang)}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  required
                  autoComplete="email"
                />
              </div>
              {mode !== 'forgot' && (
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>{t('auth.password_label', lang)}</label>
                  <input
                    type="password"
                    name="password"
                    placeholder={t('auth.password_placeholder', lang)}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={inputStyle}
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '...' : mode === 'signup' ? t('auth.submit.signup', lang) : mode === 'forgot' ? t('auth.submit.forgot', lang) : t('auth.submit.signin', lang)}
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
                <>{t('auth.have_account', lang)}{' '}
                  <button onClick={() => { setMode('signin'); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-accent, #f59e0b)', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: 0 }}>
                    {t('auth.signin_link', lang)}
                  </button>
                </>
              ) : mode === 'forgot' ? (
                <button onClick={() => { setMode('signin'); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-accent, #f59e0b)', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: 0 }}>
                  {t('auth.back', lang)}
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                  <span>{t('auth.new_here', lang)}{' '}
                    <button onClick={() => { setMode('signup'); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-accent, #f59e0b)', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: 0 }}>
                      {t('auth.join_free', lang)}
                    </button>
                  </span>
                  <button onClick={() => { setMode('forgot'); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted, #64748b)', cursor: 'pointer', fontSize: 11, padding: 0, textDecoration: 'underline' }}>
                    {t('auth.forgot_link', lang)}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
