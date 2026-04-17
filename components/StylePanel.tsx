// components/StylePanel.tsx
import React, { useState, useEffect } from 'react';

export type MaterialType = 'FABRIC' | 'METAL' | 'PLASTIC' | 'CHROME';

export interface PartEntry {
  id: string;
  label: string;
  color: string;
  material: MaterialType;
}

export interface StylePanelProps {
  parts: PartEntry[];
  activePart: string;
  onPartSelect: (id: string) => void;
  onColorChange: (partId: string, color: string) => void;
  onMaterialChange: (partId: string, material: MaterialType) => void;
  onApplyToAll: (color: string, material: MaterialType) => void;
  onClose: () => void;
  embedded?: boolean;
}

const COLOR_PRESETS = [
  '#1d4ed8', '#2563eb', '#0ea5e9', '#06b6d4',  // Blues
  '#dc2626', '#f97316', '#f59e0b', '#eab308',  // Reds/Oranges
  '#16a34a', '#7c3aed', '#ec4899', '#e2e8f0',  // Green/Purple/Pink/White
  '#111827', '#1e293b', '#b45309', '#d4af37',  // Black/Dark/Bronze/Gold
];
const MATERIAL_META: Record<MaterialType, { icon: string; desc: string }> = {
  FABRIC:  { icon: '🧵', desc: 'Suave, mate' },
  METAL:   { icon: '⚙️', desc: 'Metálico brillante' },
  PLASTIC: { icon: '🔷', desc: 'Liso, duro' },
  CHROME:  { icon: '✨', desc: 'Espejo reflectante' },
};
const MATERIALS: MaterialType[] = ['FABRIC', 'METAL', 'PLASTIC', 'CHROME'];

const StylePanel: React.FC<StylePanelProps> = ({
  parts,
  activePart,
  onPartSelect,
  onColorChange,
  onMaterialChange,
  onApplyToAll,
  onClose,
  embedded = false,
}) => {
  const active = parts.find((p) => p.id === activePart) ?? parts[0];
  const [localColor, setLocalColor] = useState(active?.color ?? '#1d4ed8');
  const [localMaterial, setLocalMaterial] = useState<MaterialType>(active?.material ?? 'FABRIC');

  useEffect(() => {
    if (active) {
      setLocalColor(active.color);
      setLocalMaterial(active.material);
    }
  }, [active?.id, active?.color, active?.material]);

  return (
    <div style={{
      width: embedded ? '100%' : 360,
      background: 'var(--color-surface)',
      borderLeft: embedded ? 'none' : '2px solid var(--color-border-strong)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Header */}
      {!embedded && <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 12px',
        borderBottom: '2px solid var(--color-border)',
        background: 'var(--color-surface-2)',
      }}>
        <span style={{ fontFamily: 'var(--font-comic)', fontSize: 14, color: 'var(--color-accent)', letterSpacing: 2 }}>
          🎨 STYLE
        </span>
        <button
          aria-label="close"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            color: '#9ca3af',
            borderRadius: 'var(--radius)',
            padding: '2px 8px',
            cursor: 'pointer',
            fontSize: 11,
          }}
        >
          ✕
        </button>
      </div>}

      {/* 2-column body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Part list */}
        <div style={{
          width: 105,
          borderRight: '1px solid var(--color-border)',
          overflowY: 'auto',
          padding: '6px 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}>
          {parts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPartSelect(p.id)}
              style={{
                width: '100%',
                padding: '7px 8px',
                textAlign: 'left',
                background: p.id === activePart ? 'rgba(245,158,11,0.15)' : 'transparent',
                border: `1.5px solid ${p.id === activePart ? 'var(--color-accent)' : 'transparent'}`,
                borderRadius: 'var(--radius)',
                color: p.id === activePart ? 'var(--color-accent)' : '#9ca3af',
                fontSize: 10,
                fontWeight: 'bold',
                letterSpacing: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                outline: 'none',
              }}
            >
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: p.color,
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'inline-block',
              }} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Right: Color + Material editor */}
        <div style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {active && (
            <>
              <div style={{ color: 'var(--color-accent)', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10, fontFamily: 'var(--font-comic)' }}>
                {active.label}
              </div>

              {/* Color section */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1, marginBottom: 6 }}>COLOR</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, marginBottom: 8 }}>
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`color ${c}`}
                      onClick={() => { setLocalColor(c); onColorChange(activePart, c); }}
                      style={{
                        width: '100%', aspectRatio: '1',
                        borderRadius: 4,
                        background: c,
                        border: `2px solid ${localColor === c ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)'}`,
                        cursor: 'pointer', padding: 0, outline: 'none',
                        transform: localColor === c ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.1s',
                        boxShadow: localColor === c ? '0 0 6px rgba(216,162,58,0.6)' : 'none',
                      }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={localColor}
                  onChange={(e) => { setLocalColor(e.target.value); onColorChange(activePart, e.target.value); }}
                  style={{
                    width: '100%',
                    height: 28,
                    border: '2px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                />
              </div>

              {/* Material section */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: '#6b7280', letterSpacing: 1, marginBottom: 6 }}>MATERIAL</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                  {MATERIALS.map((m) => {
                    const meta = MATERIAL_META[m];
                    const isActive = localMaterial === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setLocalMaterial(m); onMaterialChange(activePart, m); }}
                        style={{
                          padding: '6px 8px',
                          background: isActive ? 'rgba(216,162,58,0.15)' : 'var(--color-surface-2)',
                          color: isActive ? 'var(--color-accent)' : '#9ca3af',
                          border: `1.5px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
                          borderRadius: 'var(--radius)',
                          fontSize: 9, fontWeight: 'bold', letterSpacing: 0.8,
                          cursor: 'pointer', outline: 'none', textAlign: 'left',
                        }}
                      >
                        <div>{meta.icon} {m}</div>
                        <div style={{ fontSize: 8, opacity: 0.7, fontWeight: 400, letterSpacing: 0 }}>{meta.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Apply buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => { onColorChange(activePart, localColor); onMaterialChange(activePart, localMaterial); }}
                  style={{
                    padding: '7px',
                    background: 'var(--color-accent)',
                    color: '#000',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    fontSize: 10,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-comic)',
                    outline: 'none',
                  }}
                >
                  ✓ APLICAR A ESTA PARTE
                </button>
                <button
                  type="button"
                  onClick={() => onApplyToAll(localColor, localMaterial)}
                  style={{
                    padding: '7px',
                    background: 'transparent',
                    color: '#9ca3af',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    fontSize: 10,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  APLICAR A TODAS LAS PARTES
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StylePanel;
