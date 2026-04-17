import React from 'react';
import { PartCategory, Part, ArchetypeId } from '../types';
import { useLang, t } from '../lib/i18n';
import { ALL_PARTS } from '../constants';
import { CharacterViewerRef } from './CharacterViewer';

interface LowerBodySubmenuProps {
  onSelectCategory: (category: PartCategory) => void;
  activeCategory: PartCategory | null;
  isExpanded: boolean;
  onToggle: () => void;
  submenuPosition: { top: number; left: number };
  characterViewerRef: React.RefObject<CharacterViewerRef>; // NEW: Reference to the CharacterViewer
  selectedArchetype: ArchetypeId; // NEW: Currently selected archetype
  onPartHover: (part: Part) => void; // NEW: Function to handle part hover
  onPartUnhover: () => void; // NEW: Function to handle part unhover
}

const LowerBodySubmenu: React.FC<LowerBodySubmenuProps> = ({
  onSelectCategory,
  activeCategory,
  isExpanded,
  submenuPosition,
  selectedArchetype, // Destructure new prop
  onPartHover,       // Destructure new prop
  onPartUnhover      // Destructure new prop
}) => {
  const { lang } = useLang();
  const submenuCategories = [
    { category: PartCategory.LOWER_BODY, label: t('sub.legs', lang), icon: '🦵' },
    { category: PartCategory.BOOTS, label: t('sub.boots', lang), icon: '👢' },
  ];

  // Variable para determinar si el lower body está activo (no utilizada pero mantenida para consistencia)
  // const isLowerBodyActive = activeCategory === PartCategory.LOWER_BODY ||
  //   submenuCategories.some(item => item.category === activeCategory);

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
        zIndex: 150, /* --z-submenu */
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
            onMouseEnter={() => {
              const part = ALL_PARTS.find(p => p.category === category && p.archetype === selectedArchetype);
              if (part) {
                onPartHover(part);
              }
            }}
            onMouseLeave={onPartUnhover}
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

export default LowerBodySubmenu;
