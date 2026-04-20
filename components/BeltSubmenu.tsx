import React, { useState } from 'react';
import { PartCategory, ArchetypeId } from '../types';
import { useLang, t } from '../lib/i18n';

interface BeltSubmenuProps {
  onSelectCategory: (category: PartCategory) => void;
  activeCategory: PartCategory | null;
  isExpanded: boolean;
  onToggle: () => void;
  submenuPosition: { top: number; left: number };
  selectedArchetype: ArchetypeId;
  onPartHover?: (part: never) => void;
  onPartUnhover?: () => void;
}

const BeltSubmenu: React.FC<BeltSubmenuProps> = ({
  onSelectCategory,
  activeCategory,
  isExpanded,
  submenuPosition,
  selectedArchetype,
}) => {
  const { lang } = useLang();
  const [hoveredCategory, setHoveredCategory] = useState<PartCategory | null>(null);

  const submenuCategories = [
    { category: PartCategory.BELT,   label: t('sub.belt', lang),   icon: '🪖' },
    { category: PartCategory.POUCH,  label: t('sub.pouch', lang),  icon: '🎒' },
    { category: PartCategory.BUCKLE, label: t('sub.buckle', lang), icon: '🔗' },
  ];

  if (!isExpanded) return null;

  return (
    <div
      data-submenu="belt"
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
        maxHeight: 'calc(100vh - 16px)',
        overflowY: 'auto',

        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
    >
      {submenuCategories.map(({ category, label, icon }) => {
        const isActive = activeCategory === category;
        const isHovered = hoveredCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            onMouseEnter={() => setHoveredCategory(category)}
            onMouseLeave={() => setHoveredCategory(null)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: isActive || isHovered ? 'var(--color-accent-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-comic)',
              fontSize: 12,
              letterSpacing: '1px',
              color: isActive || isHovered ? 'var(--color-accent)' : 'var(--color-text-muted)',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background 0.1s, color 0.1s',
              display: 'block',
            }}
          >
            <span style={{ marginRight: 6 }}>{icon}</span>{label}
          </button>
        );
      })}
    </div>
  );
};

export default BeltSubmenu;
