import React, { useEffect, useState } from 'react';
import type { ArchetypeInfo } from '../lib/archetypeData';
import { useLang, t } from '../lib/i18n';

interface WelcomeScreenProps {
  isOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onOpenLibrary: () => void;
  archetypes?: ArchetypeInfo[];
  activeArchetypeId?: string;
  onSelectArchetype?: (id: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  isOpen, userEmail, onClose, onOpenLibrary,
  archetypes = [], activeArchetypeId, onSelectArchetype,
}) => {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [pickedId, setPickedId] = useState<string | null>(activeArchetypeId ?? null);

  useEffect(() => {
    if (isOpen) {
      setPickedId(activeArchetypeId ?? null);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen, activeArchetypeId]);

  if (!isOpen) return null;

  const displayArchetypes = archetypes.slice(0, 6);
  const showArchetypes = displayArchetypes.length > 0;

  const handleStart = () => {
    if (pickedId && onSelectArchetype) onSelectArchetype(pickedId);
    onClose();
  };

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
        width: showArchetypes ? 420 : 360,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 0 60px rgba(216,162,58,0.12), 0 24px 60px rgba(0,0,0,0.7)',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        overflow: 'hidden',
      }}>

        {/* Hero header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(216,162,58,0.15) 0%, rgba(9,9,15,0) 60%)',
          borderBottom: '1px solid rgba(216,162,58,0.18)',
          padding: '24px 24px 16px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-comic, Bangers, sans-serif)',
            fontSize: 11, letterSpacing: 4,
            color: 'var(--color-accent)', marginBottom: 6,
            textTransform: 'uppercase',
          }}>
            HERO BUILDER
          </div>
          <div style={{
            fontFamily: 'var(--font-comic, Bangers, sans-serif)',
            fontSize: 30, letterSpacing: 4,
            color: '#fff', lineHeight: 1,
            textShadow: '0 0 40px rgba(216,162,58,0.4)',
          }}>
            ¡BIENVENIDO!
          </div>
          {userEmail && (
            <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.6)', marginTop: 6 }}>
              {userEmail}
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14 }}>
            {[{ value: '300+', label: t('welcome.parts', lang) }, { value: '6', label: t('welcome.archetypes', lang) }, { value: '3', label: t('welcome.exports', lang) }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 18, color: 'var(--color-accent)', letterSpacing: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: 1.5, color: 'rgba(100,116,139,0.9)', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Archetype picker */}
        {showArchetypes && (
          <div style={{ padding: '16px 20px 8px' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: 2, color: 'var(--color-text-faint)', textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' }}>
              {t('welcome.pick', lang)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {displayArchetypes.map(a => {
                const isSelected = pickedId === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setPickedId(a.id)}
                    style={{
                      background: isSelected ? 'rgba(216,162,58,0.14)' : 'rgba(15,23,42,0.7)',
                      border: `1px solid ${isSelected ? 'rgba(216,162,58,0.6)' : 'rgba(71,85,105,0.35)'}`,
                      borderRadius: 8,
                      padding: '10px 6px',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      transition: 'background 0.12s, border-color 0.12s, transform 0.1s',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      outline: 'none',
                    }}
                    onMouseOver={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(216,162,58,0.3)'; }}
                    onMouseOut={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(71,85,105,0.35)'; }}
                  >
                    <span style={{ fontSize: 22 }}>{a.icon}</span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 800,
                      letterSpacing: 0.8, color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2,
                    }}>
                      {a.name}
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: 7, color: 'var(--color-accent)', fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: 1 }}>
                        {t('welcome.picked', lang)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Library feature row */}
        <div style={{ padding: showArchetypes ? '8px 20px 4px' : '16px 20px 4px' }}>
          <div
            style={{
              background: 'var(--color-surface, #0f172a)',
              border: '1px solid rgba(71,85,105,0.4)',
              borderLeft: '3px solid var(--color-accent)',
              padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderRadius: 2,
              cursor: 'pointer',
            }}
            onClick={() => { onOpenLibrary(); onClose(); }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>📚</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-comic, Bangers, sans-serif)', fontSize: 12, letterSpacing: 1.5, color: 'var(--color-accent)' }}>
                {t('welcome.library', lang)}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(100,116,139,0.9)', marginTop: 2 }}>
                {lang === 'en' ? 'Save and load unlimited builds' : 'Guarda y carga builds ilimitadas'}
              </div>
            </div>
            <span style={{ color: 'var(--color-accent)', fontSize: 12, flexShrink: 0 }}>{t('welcome.library.open', lang)}</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '12px 20px 20px' }}>
          <button
            onClick={handleStart}
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
            {pickedId ? `${t('welcome.start.with', lang)} ${pickedId.toUpperCase()} →` : t('welcome.start', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
