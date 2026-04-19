import React from 'react';
import { useLang, t } from '../lib/i18n';

interface PowerEffectsPanelProps {
  onClose?: () => void;
}

export default function PowerEffectsPanel({ onClose }: PowerEffectsPanelProps) {
  const { lang } = useLang();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="panel-header">
        <span>{t('power_effects.title', lang)}</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}
        >✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-comic)', fontSize: 16, color: 'var(--color-text-muted)', letterSpacing: 2 }}>
          {t('power_effects.coming_soon', lang)}
        </span>
      </div>
    </div>
  );
}
