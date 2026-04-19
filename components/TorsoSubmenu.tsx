import React from 'react';
import { PartCategory } from '../types';
import { useLang, t } from '../lib/i18n';

interface TorsoSubmenuProps {
  onSelectCategory: (category: PartCategory) => void;
  activeCategory: PartCategory | null;
  isExpanded: boolean;
  onToggle: () => void;
  submenuPosition: { top: number; left: number };
}

const TorsoSubmenu: React.FC<TorsoSubmenuProps> = ({
  onSelectCategory,
  activeCategory,
  isExpanded,
  submenuPosition
}) => {
  const { lang } = useLang();
  const submenuCategories = [
    { category: PartCategory.TORSO, label: t('sub.torso', lang), icon: '🦾' },
    { category: PartCategory.HEAD, label: t('sub.head', lang), icon: '👤' },
    { category: PartCategory.SUIT_TORSO, label: t('sub.suit', lang), icon: '👕' },
    { category: PartCategory.CAPE, label: t('sub.cape', lang), icon: '🦇' },
    { category: PartCategory.SYMBOL, label: t('sub.symbol', lang), icon: '⭐' },
    { category: PartCategory.CHEST_BELT, label: t('sub.chest', lang), icon: '🛡️' },
    { category: PartCategory.SHOULDERS, label: t('sub.shoulders', lang), icon: '💪' },
    { category: PartCategory.FOREARMS, label: t('sub.forearms', lang), icon: '🦾' },
    { category: PartCategory.HAND_LEFT, label: t('sub.hand_left', lang), icon: '✋' },
    { category: PartCategory.HAND_RIGHT, label: t('sub.hand_right', lang), icon: '✋' },
  ];

  const isTorsoActive = activeCategory === PartCategory.TORSO ||
    submenuCategories.some(item => item.category === activeCategory);

  // Si no está expandido, no renderizar nada
  if (!isExpanded) {
    return null;
  }

  return (
    <div
      data-submenu="torso"
      style={{
        position: 'fixed',
        top: submenuPosition.top,
        left: submenuPosition.left,
        background: 'var(--color-surface)',
        border: '2px solid var(--color-accent)',
        borderRadius: 'var(--radius)',
        padding: '8px',
        zIndex: 150,
        minWidth: 140,
        animation: 'submenuAppear 150ms ease',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
    >
      {submenuCategories.map(({ category, label, icon }) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: isActive ? 'var(--color-accent-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-comic)',
              fontSize: 12,
              letterSpacing: '1px',
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.1s',
              display: 'block',
            }}
            onMouseOver={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--color-accent)';
                e.currentTarget.style.background = 'var(--color-accent-dim)';
              }
            }}
            onMouseOut={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span style={{ marginRight: 6 }}>{icon}</span>{label}
          </button>
        );
      })}
    </div>
  );
};

export default TorsoSubmenu;
