import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface ResetPasswordModalProps {
  onClose: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return; }
    if (!supabase) { setError('Servicio no disponible'); return; }
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) { setError(err.message); return; }
      setDone(true);
      window.location.hash = '';
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px',
    background: 'var(--color-surface, #0f172a)',
    border: '1px solid var(--color-border, #334155)',
    color: 'var(--color-text, #e2e8f0)',
    fontFamily: 'inherit', fontSize: 13, boxSizing: 'border-box', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-comic, Bangers, sans-serif)',
    fontSize: 10, letterSpacing: '0.1em',
    color: 'var(--color-text-muted, #64748b)', marginBottom: 4, textTransform: 'uppercase',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--color-surface-2, #1e293b)', border: '1px solid var(--color-border, #334155)', width: 320, padding: 28, position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--color-text-muted, #64748b)', lineHeight: 1 }}
          aria-label="Cerrar"
        >✕</button>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 22, letterSpacing: 3, color: 'var(--color-accent, #f59e0b)' }}>
            NUEVA CONTRASEÑA
          </div>
        </div>

        {done ? (
          <>
            <p style={{ color: 'var(--color-text, #e2e8f0)', fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
              Contraseña actualizada. Ya puedes iniciar sesión.
            </p>
            <button
              onClick={onClose}
              style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: 'pointer' }}
            >
              ENTRAR →
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Nueva contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required autoComplete="new-password" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={inputStyle} required autoComplete="new-password" />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '...' : 'GUARDAR →'}
            </button>
            {error && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-accent, #f59e0b)', textAlign: 'center' }}>{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
