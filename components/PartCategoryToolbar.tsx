import React, { useEffect, useRef, useState } from 'react';
import { PartCategory } from '../types';

interface PartCategoryToolbarProps {
  onSelectCategory: (category: PartCategory) => void;
  activeCategory: PartCategory | null;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
  onTorsoToggle: () => void;
  getTorsoButtonRef: (ref: HTMLButtonElement | null) => void;
  isTorsoSubmenuExpanded: boolean;
  onBeltToggle: () => void;
  getBeltButtonRef: (ref: HTMLButtonElement | null) => void;
  isBeltSubmenuExpanded: boolean;
  onLowerBodyToggle: () => void;
  getLowerBodyButtonRef: (ref: HTMLButtonElement | null) => void;
  isLowerBodySubmenuExpanded: boolean;
  activeSidePanel?: 'style' | 'skins' | 'lights' | null;
  onSidePanelToggle?: (panel: 'style' | 'skins' | 'lights') => void;
  categoryCounts?: { upper: number; belt: number; lower: number; backpack: number };
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
  categoryCounts,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const torsoButtonRef = useRef<HTMLButtonElement>(null);
  const beltButtonRef = useRef<HTMLButtonElement>(null);
  const lowerBodyButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltip, setTooltip] = useState<{ label: string; y: number } | null>(null);

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

  const mainCategories = [PartCategory.BACKPACK];

  const isTorsoOrSubActive =
    activeCategory === PartCategory.TORSO ||
    (activeCategory &&
      [
        PartCategory.HEAD,
        PartCategory.SUIT_TORSO,
        PartCategory.CAPE,
        PartCategory.SYMBOL,
        PartCategory.CHEST_BELT,
        PartCategory.SHOULDERS,
        PartCategory.FOREARMS,
        PartCategory.HAND_LEFT,
        PartCategory.HAND_RIGHT,
      ].includes(activeCategory));

  const isBeltOrSubActive =
    activeCategory === PartCategory.BELT ||
    (activeCategory && [PartCategory.POUCH, PartCategory.BUCKLE].includes(activeCategory));

  const isLowerBodyOrSubActive =
    activeCategory === PartCategory.LOWER_BODY ||
    (activeCategory && [PartCategory.BOOTS].includes(activeCategory));

  const sidebarBtnStyle = (isActive: boolean | null | undefined): React.CSSProperties => ({
    width: '60px',
    padding: '8px 4px 9px',
    background: isActive ? 'rgba(216, 162, 58, 0.08)' : 'rgba(19, 19, 31, 0.58)',
    border: `1px solid ${isActive ? 'rgba(216, 162, 58, 0.42)' : 'rgba(71, 85, 105, 0.46)'}`,
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    transition: 'background 0.12s, border-color 0.12s, transform 0.12s',
    boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,0.04)' : 'none',
  });

  const iconBoxStyle = (isActive: boolean | null | undefined): React.CSSProperties => ({
    width: 28,
    height: 28,
    background: isActive ? 'rgba(216, 162, 58, 0.12)' : 'rgba(30, 41, 59, 0.9)',
    borderRadius: 6,
    border: isActive ? '1px solid rgba(216, 162, 58, 0.24)' : '1px solid rgba(71, 85, 105, 0.28)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  });

  const labelStyle = (isActive: boolean | null | undefined): React.CSSProperties => ({
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: 9,
    letterSpacing: '1px',
    color: isActive ? 'var(--color-accent)' : 'var(--color-text-faint)',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 1.15,
  });

  const sidePanelButtons: Array<{ key: 'style' | 'skins' | 'lights'; label: string }> = [
    { key: 'style', label: 'STYLE' },
    { key: 'skins', label: 'SKINS' },
    { key: 'lights', label: 'LIGHTS' },
  ];

  const showTooltip = (e: React.MouseEvent<HTMLButtonElement>, label: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ label, y: rect.top + rect.height / 2 });
  };

  const Tooltip = tooltip ? (
    <div style={{
      position: 'fixed',
      left: 76,
      top: tooltip.y,
      transform: 'translateY(-50%)',
      background: 'rgba(15,23,42,0.97)',
      border: '1px solid rgba(216,162,58,0.3)',
      color: '#e2e8f0',
      fontFamily: 'var(--font-body)',
      fontSize: 10, fontWeight: 700, letterSpacing: 1,
      padding: '5px 10px',
      borderRadius: 4,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      zIndex: 500,
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    }}>
      {tooltip.label}
    </div>
  ) : null;

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
        position: 'relative',
      }}
    >
      <button
        ref={torsoButtonRef}
        onClick={onTorsoToggle}
        onMouseEnter={e => showTooltip(e, 'CUERPO SUPERIOR [1]')}
        onMouseLeave={() => setTooltip(null)}
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
          <svg style={{ display: 'inline', verticalAlign: 'middle', transform: isTorsoSubmenuExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </span>
        {categoryCounts && categoryCounts.upper > 0 && (
          <span style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(216,162,58,0.18)', color: 'var(--color-accent)', fontFamily: 'var(--font-body)', fontSize: 7, fontWeight: 800, padding: '0px 3px', borderRadius: 3, letterSpacing: 0 }}>
            {categoryCounts.upper}
          </span>
        )}
      </button>

      <button
        ref={beltButtonRef}
        onClick={onBeltToggle}
        onMouseEnter={e => showTooltip(e, 'CINTURÓN Y ACCESORIOS [2]')}
        onMouseLeave={() => setTooltip(null)}
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
          <svg style={{ display: 'inline', verticalAlign: 'middle', transform: isBeltSubmenuExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </span>
        {categoryCounts && categoryCounts.belt > 0 && (
          <span style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(216,162,58,0.18)', color: 'var(--color-accent)', fontFamily: 'var(--font-body)', fontSize: 7, fontWeight: 800, padding: '0px 3px', borderRadius: 3, letterSpacing: 0 }}>
            {categoryCounts.belt}
          </span>
        )}
      </button>

      <button
        ref={lowerBodyButtonRef}
        onClick={onLowerBodyToggle}
        onMouseEnter={e => showTooltip(e, 'CUERPO INFERIOR [3]')}
        onMouseLeave={() => setTooltip(null)}
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
          <svg style={{ display: 'inline', verticalAlign: 'middle', transform: isLowerBodySubmenuExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
        </span>
        {categoryCounts && categoryCounts.lower > 0 && (
          <span style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(216,162,58,0.18)', color: 'var(--color-accent)', fontFamily: 'var(--font-body)', fontSize: 7, fontWeight: 800, padding: '0px 3px', borderRadius: 3, letterSpacing: 0 }}>
            {categoryCounts.lower}
          </span>
        )}
      </button>

      {mainCategories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            id={`category-toolbar-item-${category}`}
            onClick={() => onSelectCategory(category)}
            onMouseEnter={e => showTooltip(e, 'MOCHILA Y EXTRAS')}
            onMouseLeave={() => setTooltip(null)}
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
              MOCHILA
            </span>
          </button>
        );
      })}

      {Tooltip}

      {onSidePanelToggle && (
        <>
          <div style={{ width: '70%', height: 1, background: 'rgba(71, 85, 105, 0.48)', margin: '10px 0 4px' }} />
          {sidePanelButtons.map(({ key, label }) => {
            const isActive = activeSidePanel === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSidePanelToggle(key)}
                onMouseEnter={e => showTooltip(e, label === 'STYLE' ? 'COLORES Y MATERIALES' : label === 'SKINS' ? 'TEXTURAS Y SKINS' : 'ILUMINACIÓN')}
                onMouseLeave={() => setTooltip(null)}
                style={sidebarBtnStyle(isActive)}
              >
                <div style={iconBoxStyle(isActive)}>
              <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      letterSpacing: 0.8,
                      fontWeight: 700,
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-faint)',
                    }}
                  >
                    {label.slice(0, 2)}
                  </span>
                </div>
                <span style={labelStyle(isActive)}>{label}</span>
              </button>
            );
          })}
        </>
      )}
    </div>
  );
};

export default PartCategoryToolbar;
