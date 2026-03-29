import React, { useEffect, useRef } from 'react';
import { PartCategory } from '../types';

interface PartCategoryToolbarProps {
  onSelectCategory: (category: PartCategory) => void;
  activeCategory: PartCategory | null;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
  // Props para el submenu del Torso
  onTorsoToggle: () => void;
  getTorsoButtonRef: (ref: HTMLButtonElement | null) => void;
  isTorsoSubmenuExpanded: boolean;
  // Props para el submenu del Belt
  onBeltToggle: () => void;
  getBeltButtonRef: (ref: HTMLButtonElement | null) => void;
  isBeltSubmenuExpanded: boolean;
  // Props para el submenu del Lower Body
  onLowerBodyToggle: () => void;
  getLowerBodyButtonRef: (ref: HTMLButtonElement | null) => void;
  isLowerBodySubmenuExpanded: boolean;
  // Props para los iconos de panel lateral
  activeSidePanel?: 'style' | 'skins' | 'lights' | null;
  onSidePanelToggle?: (panel: 'style' | 'skins' | 'lights') => void;
}

const PartCategoryToolbar: React.FC<PartCategoryToolbarProps> = ({
  onSelectCategory,
  activeCategory,
  id,
  registerElement,
  onTorsoToggle,
  getTorsoButtonRef,
  isTorsoSubmenuExpanded,
  onBeltToggle,
  getBeltButtonRef,
  isBeltSubmenuExpanded,
  onLowerBodyToggle,
  getLowerBodyButtonRef,
  isLowerBodySubmenuExpanded,
  activeSidePanel,
  onSidePanelToggle,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const torsoButtonRef = useRef<HTMLButtonElement>(null);
  const beltButtonRef = useRef<HTMLButtonElement>(null);
  const lowerBodyButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerElement(id, ref.current);
  }, [id, registerElement]);

  useEffect(() => {
    getTorsoButtonRef(torsoButtonRef.current);
  }, [getTorsoButtonRef]);

  useEffect(() => {
    getBeltButtonRef(beltButtonRef.current);
  }, [getBeltButtonRef]);

  useEffect(() => {
    getLowerBodyButtonRef(lowerBodyButtonRef.current);
  }, [getLowerBodyButtonRef]);

  useEffect(() => {
    // console.log('PartCategoryToolbar rendered with:', { activeCategory });
  }, [activeCategory]);

  // Categorías que NO están en ningún submenú
  const mainCategories = [
    PartCategory.BACKPACK,
  ];

  // Determinar si el upper body o sus subcategorías están activas
  const isTorsoOrSubActive = activeCategory === PartCategory.TORSO ||
    (activeCategory && [PartCategory.HEAD, PartCategory.SUIT_TORSO, PartCategory.CAPE, PartCategory.SYMBOL, PartCategory.CHEST_BELT, PartCategory.SHOULDERS, PartCategory.FOREARMS, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT].includes(activeCategory));

  // Determinar si el belt o sus subcategorías están activas
  const isBeltOrSubActive = activeCategory === PartCategory.BELT ||
    (activeCategory && [PartCategory.POUCH, PartCategory.BUCKLE].includes(activeCategory));

  // Determinar si el lower body o sus subcategorías están activas
  const isLowerBodyOrSubActive = activeCategory === PartCategory.LOWER_BODY ||
    (activeCategory && [PartCategory.BOOTS].includes(activeCategory));

  const sidebarBtnStyle = (isActive: boolean | null | undefined): React.CSSProperties => ({
    width: '60px',
    padding: '8px 4px',
    background: isActive ? 'var(--color-accent-dim)' : 'transparent',
    border: `1.5px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    transition: 'background 0.1s, border-color 0.1s',
  });

  const iconBoxStyle = (isActive: boolean | null | undefined): React.CSSProperties => ({
    width: 28,
    height: 28,
    background: isActive ? 'var(--color-accent-dim)' : 'var(--color-border)',
    borderRadius: 2,
    border: isActive ? '1px solid var(--color-accent-mid)' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  });

  const labelStyle = (isActive: boolean | null | undefined): React.CSSProperties => ({
    fontFamily: 'var(--font-comic)',
    fontSize: 9,
    letterSpacing: '1.5px',
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-faint)',
    textAlign: 'center',
    textTransform: 'uppercase',
  });

  return (
    <div
      id="category-toolbar"
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        paddingTop: 8,
        width: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* UPPER BODY button */}
      <button
        ref={torsoButtonRef}
        onClick={onTorsoToggle}
        style={sidebarBtnStyle(isTorsoOrSubActive)}
      >
        <div style={iconBoxStyle(isTorsoOrSubActive)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isTorsoOrSubActive ? 'var(--color-accent)' : 'var(--color-text-faint)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7H4l2 13h12l2-13z" />
            <path d="M12 7V4" />
            <circle cx="12" cy="3" r="1" />
          </svg>
        </div>
        <span style={labelStyle(isTorsoOrSubActive)}>
          UPPER{'\u00A0'}
          <svg
            style={{ display: 'inline', verticalAlign: 'middle', transform: isTorsoSubmenuExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {/* BELT button */}
      <button
        ref={beltButtonRef}
        onClick={onBeltToggle}
        style={sidebarBtnStyle(isBeltOrSubActive)}
      >
        <div style={iconBoxStyle(isBeltOrSubActive)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isBeltOrSubActive ? 'var(--color-accent)' : 'var(--color-text-faint)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="9" width="20" height="6" rx="2" />
            <rect x="10" y="10" width="4" height="4" rx="1" />
          </svg>
        </div>
        <span style={labelStyle(isBeltOrSubActive)}>
          BELT{'\u00A0'}
          <svg
            style={{ display: 'inline', verticalAlign: 'middle', transform: isBeltSubmenuExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {/* LOWER BODY button */}
      <button
        ref={lowerBodyButtonRef}
        onClick={onLowerBodyToggle}
        style={sidebarBtnStyle(isLowerBodyOrSubActive)}
      >
        <div style={iconBoxStyle(isLowerBodyOrSubActive)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isLowerBodyOrSubActive ? 'var(--color-accent)' : 'var(--color-text-faint)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h12l1 8H5L6 4z" />
            <path d="M8 12v8M16 12v8" />
          </svg>
        </div>
        <span style={labelStyle(isLowerBodyOrSubActive)}>
          LOWER{'\u00A0'}
          <svg
            style={{ display: 'inline', verticalAlign: 'middle', transform: isLowerBodySubmenuExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
            width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {/* Main Categories (e.g. BACKPACK) */}
      {mainCategories.map(category => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            id={`category-toolbar-item-${category}`}
            onClick={() => onSelectCategory(category)}
            style={sidebarBtnStyle(isActive)}
          >
            <div style={iconBoxStyle(isActive)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isActive ? 'var(--color-accent)' : 'var(--color-text-faint)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 4h6a2 2 0 012 2v1H7V6a2 2 0 012-2z" />
                <rect x="3" y="7" width="18" height="14" rx="2" />
                <path d="M9 11h6" />
              </svg>
            </div>
            <span style={labelStyle(isActive)}>
              {String(category).substring(0, 6)}
            </span>
          </button>
        );
      })}

      {/* Style shortcuts — bottom of sidebar */}
    </div>
  );
};

export default PartCategoryToolbar;
