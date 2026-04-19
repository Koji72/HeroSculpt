import React, { useState } from 'react';
import { useLang, t, TransKey } from '../lib/i18n';

interface ScaleOption {
  label: string;
  descKey: TransKey;
  scaleFactor: number;
  recommended?: boolean;
}

const SCALE_OPTIONS: ScaleOption[] = [
  { label: '28mm', descKey: 'stl.desc.28mm', scaleFactor: 1, recommended: false },
  { label: '32mm', descKey: 'stl.desc.32mm', scaleFactor: 32 / 28, recommended: true },
  { label: '32mm Heroic', descKey: 'stl.desc.32mm_heroic', scaleFactor: 1.2 },
  { label: '54mm Display', descKey: 'stl.desc.54mm', scaleFactor: 54 / 28 },
];

interface STLScaleModalProps {
  onConfirm: (scaleFactor: number) => void;
  onCancel: () => void;
}

export default function STLScaleModal({ onConfirm, onCancel }: STLScaleModalProps) {
  const { lang } = useLang();
  const [selected, setSelected] = useState<number>(32 / 28);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.72)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{
        background: 'var(--color-surface)',
        border: '2px solid var(--color-border-strong)',
        borderRadius: 'var(--radius)',
        width: 320,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--color-accent)',
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2, color: '#000' }}>
            {t('stl.title', lang)}
          </span>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#000', opacity: 0.6, lineHeight: 1 }}
          >✕</button>
        </div>

        {/* Scale options */}
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SCALE_OPTIONS.map((opt) => {
            const isSelected = selected === opt.scaleFactor;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setSelected(opt.scaleFactor)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: isSelected ? 'rgba(245,158,11,0.12)' : 'var(--color-surface-2)',
                  border: isSelected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                  border: isSelected ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                  background: isSelected ? 'var(--color-accent)' : 'transparent',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-comic)', fontSize: 13, letterSpacing: 1, color: 'var(--color-text)' }}>
                      {opt.label}
                    </span>
                    {opt.recommended && (
                      <span style={{
                        fontSize: 8, fontFamily: 'var(--font-comic)', letterSpacing: 1,
                        background: 'var(--color-accent)', color: '#000',
                        padding: '1px 4px', borderRadius: 2,
                      }}>{t('stl.recommended', lang)}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 1 }}>
                    {t(opt.descKey, lang)} · ×{opt.scaleFactor.toFixed(2)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ padding: '0 12px 12px', display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1, padding: '8px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)', cursor: 'pointer',
              fontFamily: 'var(--font-comic)', fontSize: 11, letterSpacing: 1,
              color: 'var(--color-text-muted)',
            }}
          >{t('stl.cancel', lang)}</button>
          <button
            type="button"
            onClick={() => onConfirm(selected)}
            style={{
              flex: 2, padding: '8px',
              background: 'var(--color-accent)',
              border: 'none',
              borderRadius: 'var(--radius)', cursor: 'pointer',
              fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 2,
              color: '#000', fontWeight: 700,
            }}
          >{t('stl.download', lang)}</button>
        </div>
      </div>
    </div>
  );
}
