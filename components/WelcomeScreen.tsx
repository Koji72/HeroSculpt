import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  isOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onOpenLibrary: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isOpen, userEmail, onClose, onOpenLibrary }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const stats = [
    { value: '300+', label: 'PARTS' },
    { value: '6', label: 'ARCHETYPES' },
    { value: '3', label: 'EXPORT FORMATS' },
  ];

  const features = [
    { icon: '📚', title: 'HERO LIBRARY', subtitle: 'Save & load unlimited builds', color: 'var(--color-accent)', action: () => { onOpenLibrary(); onClose(); }, cta: 'OPEN →' },
    { icon: '🎭', title: 'POSE STUDIO', subtitle: 'Save poses for your characters', color: '#22c55e', action: null, cta: null },
    { icon: '☁️', title: 'CLOUD SYNC', subtitle: 'Your heroes, everywhere', color: '#3b82f6', action: null, cta: null },
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 0.2s',
        opacity: visible ? 1 : 0,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--color-surface-2, #1e293b)',
        border: '1px solid rgba(216,162,58,0.3)',
        width: 360,
        boxShadow: '0 0 60px rgba(216,162,58,0.12), 0 24px 60px rgba(0,0,0,0.7)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
      }}>

        {/* Hero header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(216,162,58,0.15) 0%, rgba(9,9,15,0) 60%)',
          borderBottom: '1px solid rgba(216,162,58,0.18)',
          padding: '28px 28px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-comic, Bangers, sans-serif)',
            fontSize: 11, letterSpacing: 4,
            color: 'var(--color-accent)', marginBottom: 8,
            textTransform: 'uppercase',
          }}>
            HERO BUILDER
          </div>
          <div style={{
            fontFamily: 'var(--font-comic, Bangers, sans-serif)',
            fontSize: 32, letterSpacing: 4,
            color: '#fff', lineHeight: 1,
            textShadow: '0 0 40px rgba(216,162,58,0.4)',
          }}>
            ¡BIENVENIDO!
          </div>
          <div style={{ fontSize: 11, color: 'rgba(148,163,184,0.7)', marginTop: 8 }}>
            {userEmail}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 20, color: 'var(--color-accent)', letterSpacing: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: 1.5, color: 'rgba(100,116,139,0.9)', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: 'var(--color-surface, #0f172a)',
                border: '1px solid rgba(71,85,105,0.4)',
                borderLeft: `3px solid ${f.color}`,
                padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                borderRadius: 2,
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 12, letterSpacing: 1.5, color: f.color }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(100,116,139,0.9)', marginTop: 2 }}>
                  {f.subtitle}
                </div>
              </div>
              {f.action && f.cta && (
                <button
                  onClick={f.action}
                  style={{
                    background: f.color, color: '#000', border: 'none',
                    padding: '5px 12px', fontFamily: 'var(--font-comic, Bangers, sans-serif)',
                    fontSize: 10, letterSpacing: 1, cursor: 'pointer', flexShrink: 0,
                    borderRadius: 2,
                  }}
                >
                  {f.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: '0 20px 20px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '12px',
              background: 'var(--color-accent)', color: '#09090f',
              fontFamily: 'var(--font-comic, Bangers, sans-serif)',
              fontSize: 16, letterSpacing: 3, border: 'none', cursor: 'pointer',
              borderRadius: 2,
              transition: 'filter 0.1s',
            }}
            onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseOut={e => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            EMPEZAR A CREAR →
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
