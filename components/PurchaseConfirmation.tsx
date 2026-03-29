import React, { useState, useEffect } from 'react';
import { Part, ArchetypeId } from '../types';
import { ARCHETYPE_DATA } from '../lib/archetypeData';

interface PurchaseConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedParts: Part[];
  modelName: string;
  onModelNameChange?: (name: string) => void;
  archetypeId: ArchetypeId;
  onExportGLB?: () => void;
  onOpenLibrary?: () => void;
}

const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  isOpen,
  onClose,
  purchasedParts,
  modelName,
  onModelNameChange,
  archetypeId,
  onExportGLB,
  onOpenLibrary,
}) => {
  const [name, setName] = useState(modelName);
  useEffect(() => { setName(modelName); }, [modelName]);

  if (!isOpen) return null;

  const archetypeTitle =
    ARCHETYPE_DATA[archetypeId]?.title?.toUpperCase() ?? archetypeId.toUpperCase();

  const getCategoryLabel = (category: string) =>
    category.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

  const handleBlur = () => {
    onModelNameChange?.(name);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)', zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: 400, maxHeight: '85vh',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-accent)',
        borderRadius: 'var(--radius)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 16, letterSpacing: 2 }}>
            🎯 ¡HÉROE GUARDADO!
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#111', opacity: 0.7 }}
          >✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero preview */}
          <div style={{
            padding: '20px 16px 12px',
            background: 'var(--color-surface-2)',
            borderBottom: '1px solid var(--color-border)',
            textAlign: 'center',
            position: 'relative',
          }}>
            {/* Radial glow */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse, rgba(245,158,11,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Sparkles */}
            {(['✦', '★', '✦', '★'] as const).map((s, i) => (
              <span key={i} style={{
                position: 'absolute',
                fontSize: 12, opacity: 0.6,
                top: (['12%', '18%', '65%', '70%'] as const)[i],
                left: (['12%', '78%', '8%', '80%'] as const)[i],
                animation: `float-spark-${i % 2} 2s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}>{s}</span>
            ))}

            {/* Silhouette */}
            <div style={{
              width: 80, height: 110,
              background: 'linear-gradient(180deg, var(--color-border-strong), var(--color-surface))',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius)',
              margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem',
            }}>🦸</div>

            {/* Editable name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              onBlur={handleBlur}
              maxLength={40}
              style={{
                fontFamily: 'var(--font-comic)', fontSize: 20, letterSpacing: 2,
                color: 'var(--color-accent)',
                background: 'transparent', border: 'none', outline: 'none',
                textAlign: 'center', width: '100%',
                cursor: 'text',
              }}
            />

            {/* Subtitle */}
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
              {archetypeTitle} · {purchasedParts.length} PARTES
            </div>
          </div>

          {/* Parts list */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
              PARTES GUARDADAS
            </div>
            <div style={{ maxHeight: 180, overflowY: 'auto' }}>
              {purchasedParts.map((part) => (
                <div key={part.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--color-text)' }}>{part.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {getCategoryLabel(part.category)}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>✓ GUARDADO</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {onExportGLB && (
            <button
              onClick={onExportGLB}
              style={{
                width: '100%', padding: '10px',
                background: 'var(--color-accent)', border: 'none',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2,
                color: '#111', cursor: 'pointer',
              }}
            >⬇ DESCARGAR GLB</button>
          )}
          <button
            onClick={() => { onOpenLibrary?.(); }}
            style={{
              width: '100%', padding: '7px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1,
              color: 'var(--color-text-muted)', cursor: 'pointer',
            }}
          >📚 VER EN BIBLIOTECA</button>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '7px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1,
              color: 'var(--color-text-muted)', cursor: 'pointer',
            }}
          >🎲 SEGUIR PERSONALIZANDO</button>
        </div>


      </div>
    </div>
  );
};

export default PurchaseConfirmation;
