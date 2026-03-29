import React from 'react';

interface PowerEffectsPanelProps {
  onClose?: () => void;
}

export default function PowerEffectsPanel({ onClose }: PowerEffectsPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="panel-header">
        <span>EFFECTS</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}
        >✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-comic)', fontSize: 16, color: 'var(--color-text-muted)', letterSpacing: 2 }}>
          COMING SOON
        </span>
      </div>
    </div>
  );
}
