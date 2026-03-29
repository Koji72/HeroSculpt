import React from 'react';

interface WelcomeScreenProps {
  isOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onOpenLibrary: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ isOpen, userEmail, onClose, onOpenLibrary }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: '📚',
      title: 'LIBRERÍA DESBLOQUEADA',
      subtitle: 'Guarda y gestiona tus héroes',
      color: 'var(--color-accent, #f59e0b)',
      cta: { label: 'VER →', action: () => { onOpenLibrary(); onClose(); } },
    },
    {
      icon: '🎭',
      title: 'POSES DESBLOQUEADAS',
      subtitle: 'Guarda poses de tu héroe',
      color: '#22c55e',
      cta: null,
    },
    {
      icon: '💾',
      title: 'GUARDAR CONFIGURACIONES',
      subtitle: 'Sincronizado en la nube',
      color: '#3b82f6',
      cta: null,
    },
  ];

  return (
    <div
      data-testid="welcome-backdrop"
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--color-surface-2, #1e293b)', border: '1px solid var(--color-border, #334155)', width: 340, padding: 28 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 24, letterSpacing: 3, color: 'var(--color-accent, #f59e0b)' }}>
            ¡BIENVENIDO!
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted, #64748b)', marginTop: 4 }}>
            {userEmail}
          </div>
        </div>

        {/* Feature cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{ background: 'var(--color-surface, #0f172a)', border: '1px solid var(--color-border, #334155)', borderLeft: `3px solid ${f.color}`, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 11, letterSpacing: 1, color: f.color }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--color-text-muted, #64748b)', marginTop: 2 }}>
                  {f.subtitle}
                </div>
              </div>
              {f.cta && (
                <button
                  onClick={f.cta.action}
                  style={{ background: f.color, color: '#000', border: 'none', padding: '4px 10px', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 10, letterSpacing: 1, cursor: 'pointer', flexShrink: 0 }}
                >
                  {f.cta.label}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          style={{ width: '100%', padding: '10px', background: 'var(--color-accent, #f59e0b)', color: '#000', fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 14, letterSpacing: 2, border: 'none', cursor: 'pointer' }}
        >
          CONTINUAR →
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
