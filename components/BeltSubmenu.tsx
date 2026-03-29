import React from 'react';
import { PartCategory } from '../types';

interface BeltSubmenuProps {
  onSelectCategory: (category: PartCategory) => void;
  activeCategory: PartCategory | null;
  isExpanded: boolean;
  onToggle: () => void;
  submenuPosition: { top: number; left: number };
}

const BeltSubmenu: React.FC<BeltSubmenuProps> = ({
  onSelectCategory,
  activeCategory,
  isExpanded,
  onToggle,
  submenuPosition
}) => {
  // Removed debug log

  const submenuCategories = [
    { category: PartCategory.BELT, label: 'BELT', icon: '🪖' },
    { category: PartCategory.POUCH, label: 'POUCH', icon: '🎒' },
    { category: PartCategory.BUCKLE, label: 'BUCKLE', icon: '🔗' },
  ];

  const isBeltActive = activeCategory === PartCategory.BELT ||
    submenuCategories.some(item => item.category === activeCategory);

  // Si no está expandido, no renderizar nada
  if (!isExpanded) {
    return null;
  }

  return (
    <div
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
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default BeltSubmenu;
