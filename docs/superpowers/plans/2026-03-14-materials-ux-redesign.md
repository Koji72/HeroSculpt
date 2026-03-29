# Hero Builder Materials & UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the confusing nested MATERIALS tab structure with an archetype switcher in the topbar, a unified STYLE panel, and sidebar icons for STYLE/SKINS/LIGHTS — making the hero-building flow obvious for tabletop RPG players.

**Architecture:** `ArchetypeSwitcher` is a pure presentational component placed in the topbar (replacing the 5-tab nav). `StylePanel` is a new 2-column panel wired to existing `MaterialConfigurator` callbacks. `PartCategoryToolbar` gains three new icon buttons at the bottom that toggle `activeSidePanel` state in App.tsx.

**Tech Stack:** React 18 + TypeScript, Tailwind CSS v4, Three.js (via CharacterViewer ref), Vitest + React Testing Library, existing Dark Comics CSS tokens (`--color-accent`, `--color-surface-2`, `--radius`, `--font-comic`).

**Worktree root:** `c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/`

---

## Chunk 1: ArchetypeSwitcher Component

### Task 1: ArchetypeSwitcher — tests

**Files:**
- Create: `tests/ArchetypeSwitcher.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/ArchetypeSwitcher.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ArchetypeSwitcher from '../components/ArchetypeSwitcher';
import { ARCHETYPES_LIST } from '../lib/archetypeData';

const defaultProps = {
  archetypes: ARCHETYPES_LIST.slice(0, 5),
  activeArchetypeId: 'STRONG',
  hasUnsavedParts: false,
  onSelect: vi.fn(),
};

describe('ArchetypeSwitcher', () => {
  it('renders the active archetype chip with ACTIVE badge', () => {
    render(<ArchetypeSwitcher {...defaultProps} />);
    expect(screen.getByText('STRONG')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('calls onSelect immediately when hasUnsavedParts is false', () => {
    const onSelect = vi.fn();
    render(<ArchetypeSwitcher {...defaultProps} onSelect={onSelect} />);
    const chip = screen.getByText(defaultProps.archetypes[1].name);
    fireEvent.click(chip);
    expect(onSelect).toHaveBeenCalledWith(defaultProps.archetypes[1].id);
  });

  it('shows confirmation dialog when hasUnsavedParts is true', () => {
    render(<ArchetypeSwitcher {...defaultProps} hasUnsavedParts={true} />);
    const chip = screen.getByText(defaultProps.archetypes[1].name);
    fireEvent.click(chip);
    expect(screen.getByText(/clear selected parts/i)).toBeInTheDocument();
    expect(defaultProps.onSelect).not.toHaveBeenCalled();
  });

  it('calls onSelect after confirming dialog', () => {
    const onSelect = vi.fn();
    render(<ArchetypeSwitcher {...defaultProps} hasUnsavedParts={true} onSelect={onSelect} />);
    fireEvent.click(screen.getByText(defaultProps.archetypes[1].name));
    fireEvent.click(screen.getByText(/confirm/i));
    expect(onSelect).toHaveBeenCalledWith(defaultProps.archetypes[1].id);
  });

  it('renders MORE chip when archetypes exceed 4', () => {
    render(<ArchetypeSwitcher {...defaultProps} archetypes={ARCHETYPES_LIST} />);
    expect(screen.getByText(/more/i)).toBeInTheDocument();
  });

  it('closes MORE dropdown on Escape key', () => {
    render(<ArchetypeSwitcher {...defaultProps} archetypes={ARCHETYPES_LIST} />);
    fireEvent.click(screen.getByText(/more/i));
    // Dropdown items should be visible
    expect(screen.getAllByRole('button').length).toBeGreaterThan(6);
    fireEvent.keyDown(document, { key: 'Escape' });
    // After Escape, overflow items should be gone (only visible chips + MORE remain)
    expect(screen.getAllByRole('button').length).toBeLessThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL (component doesn't exist yet)**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx vitest run tests/ArchetypeSwitcher.test.tsx
```

Expected: `Cannot find module '../components/ArchetypeSwitcher'`

---

### Task 2: ArchetypeSwitcher — implementation

**Files:**
- Create: `components/ArchetypeSwitcher.tsx`

**Context:**
- `ARCHETYPES_LIST` is in `lib/archetypeData.ts` — it's the array of all `ArchetypeInfo` objects.
- `ArchetypeInfo` has: `id`, `name`, `icon` (emoji), `title` (tagline), `description`, `famousExamples[]`, `stats: { power, defense, speed, ... }`
- Use Dark Comics tokens inline (no Tailwind color classes). Key tokens: `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-accent` (#f59e0b), `--color-border`, `--color-border-strong`, `--radius` (2px), `--font-comic`.

- [ ] **Step 3: Create ArchetypeSwitcher.tsx**

```tsx
// components/ArchetypeSwitcher.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { ArchetypeInfo } from '../lib/archetypeData';

export interface ArchetypeSwitcherProps {
  archetypes: ArchetypeInfo[];
  activeArchetypeId: string;
  hasUnsavedParts: boolean;
  onSelect: (id: string) => void;
}

const MAX_VISIBLE = 4;

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
    <span style={{ width: 36, fontSize: 8, color: 'var(--color-text-muted, #6b7280)', fontFamily: 'monospace' }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 4, background: 'var(--color-surface-2)', borderRadius: 'var(--radius)' }}>
      <div style={{ width: `${value}%`, height: '100%', background: 'var(--color-accent)', borderRadius: 'var(--radius)' }} />
    </div>
    <span style={{ width: 22, fontSize: 8, color: '#9ca3af', textAlign: 'right', fontFamily: 'monospace' }}>
      {value}
    </span>
  </div>
);

const ArchetypeTooltip = ({
  archetype,
  onConfirmSelect,
}: {
  archetype: ArchetypeInfo;
  onConfirmSelect: () => void;
}) => (
  <div style={{
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 6,
    width: 220,
    background: 'var(--color-surface)',
    border: '2px solid var(--color-accent)',
    borderRadius: 'var(--radius)',
    padding: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
    zIndex: 1000,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 24 }}>{archetype.icon}</span>
      <div>
        <div style={{ color: 'var(--color-accent)', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, fontFamily: 'var(--font-comic)' }}>
          {archetype.name}
        </div>
        <div style={{ color: '#9ca3af', fontSize: 9 }}>{archetype.title}</div>
      </div>
    </div>
    <div style={{ fontSize: 9, color: '#9ca3af', marginBottom: 8, lineHeight: 1.5 }}>
      {archetype.famousExamples?.slice(0, 3).join(', ')}.
    </div>
    <StatBar label="POW" value={archetype.stats.power} />
    <StatBar label="DEF" value={archetype.stats.defense} />
    <StatBar label="SPD" value={archetype.stats.speed} />
    <button
      onClick={onConfirmSelect}
      style={{
        marginTop: 8,
        width: '100%',
        padding: '5px',
        background: 'var(--color-accent)',
        color: '#000',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        cursor: 'pointer',
        fontFamily: 'var(--font-comic)',
      }}
    >
      ⚡ SELECT {archetype.name}
    </button>
  </div>
);

const ArchetypeSwitcher: React.FC<ArchetypeSwitcherProps> = ({
  archetypes,
  activeArchetypeId,
  hasUnsavedParts,
  onSelect,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null); // awaiting confirmation
  const moreRef = useRef<HTMLDivElement>(null);

  const visible = archetypes.slice(0, MAX_VISIBLE);
  const overflow = archetypes.slice(MAX_VISIBLE);

  // Close more dropdown on outside click or Escape
  useEffect(() => {
    if (!showMore) return;
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMore(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showMore]);

  const handleChipClick = (id: string) => {
    if (id === activeArchetypeId) return;
    if (hasUnsavedParts) {
      setPendingId(id);
    } else {
      onSelect(id);
    }
  };

  const handleConfirm = () => {
    if (pendingId) onSelect(pendingId);
    setPendingId(null);
    setShowMore(false);
  };

  const chipStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    background: isActive ? 'var(--color-accent)' : 'var(--color-surface-2)',
    color: isActive ? '#000' : '#9ca3af',
    border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius)',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    cursor: isActive ? 'default' : 'pointer',
    flexShrink: 0,
    position: 'relative' as const,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, overflow: 'hidden', position: 'relative' }}>
      {/* Confirmation dialog */}
      {pendingId && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 6,
          background: 'var(--color-surface)',
          border: '2px solid var(--color-accent)',
          borderRadius: 'var(--radius)',
          padding: '10px 14px',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
        }}>
          <span style={{ fontSize: 11, color: '#e2e8f0' }}>Changing archetype will clear selected parts. Continue?</span>
          <button
            onClick={handleConfirm}
            style={{ padding: '3px 10px', background: 'var(--color-accent)', color: '#000', border: 'none', borderRadius: 'var(--radius)', fontSize: 10, fontWeight: 'bold', cursor: 'pointer' }}
          >
            CONFIRM
          </button>
          <button
            onClick={() => setPendingId(null)}
            style={{ padding: '3px 10px', background: 'transparent', color: '#9ca3af', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: 10, cursor: 'pointer' }}
          >
            CANCEL
          </button>
        </div>
      )}

      {/* Visible chips */}
      {visible.map((a) => (
        <div
          key={a.id}
          style={{ position: 'relative' }}
          onMouseEnter={() => setHoveredId(a.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div style={chipStyle(a.id === activeArchetypeId)} onClick={() => handleChipClick(a.id)}>
            <span>{a.icon}</span>
            <span>{a.name}</span>
            {a.id === activeArchetypeId && (
              <span style={{ fontSize: 8, background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 2 }}>ACTIVE</span>
            )}
          </div>
          {hoveredId === a.id && (
            <ArchetypeTooltip
              archetype={a}
              onConfirmSelect={() => handleChipClick(a.id)}
            />
          )}
        </div>
      ))}

      {/* MORE overflow */}
      {overflow.length > 0 && (
        <div ref={moreRef} style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              ...chipStyle(false),
              border: '1px dashed var(--color-border)',
              color: '#6b7280',
            }}
            onClick={() => setShowMore((v) => !v)}
          >
            ••• MORE
          </div>
          {showMore && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 6,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-border-strong)',
              borderRadius: 'var(--radius)',
              padding: 6,
              zIndex: 1000,
              minWidth: 160,
              boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            }}>
              {overflow.map((a) => (
                <div
                  key={a.id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    onClick={() => { handleChipClick(a.id); setShowMore(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      color: a.id === activeArchetypeId ? 'var(--color-accent)' : '#9ca3af',
                      fontSize: 11,
                      letterSpacing: 1,
                      fontWeight: 'bold',
                      background: hoveredId === a.id ? 'var(--color-surface-2)' : 'transparent',
                    }}
                  >
                    <span>{a.icon}</span>
                    <span>{a.name}</span>
                  </div>
                  {hoveredId === a.id && (
                    <ArchetypeTooltip
                      archetype={a}
                      onConfirmSelect={() => { handleChipClick(a.id); setShowMore(false); }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArchetypeSwitcher;
```

- [ ] **Step 4: Check that `lib/archetypeData.ts` exports `ARCHETYPES_LIST`**

```bash
grep -n "ARCHETYPES_LIST\|export.*Archetype" c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/lib/archetypeData.ts | head -20
```

If `ARCHETYPES_LIST` doesn't exist, find the exported array name and update the import in both the component and the test.

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx vitest run tests/ArchetypeSwitcher.test.tsx
```

Expected: All 5 tests pass.

- [ ] **Step 6: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add components/ArchetypeSwitcher.tsx tests/ArchetypeSwitcher.test.tsx
git commit -m "feat: add ArchetypeSwitcher component with tooltip and confirmation"
```

---

## Chunk 2: StylePanel Component

### Task 3: StylePanel — tests

**Files:**
- Create: `tests/StylePanel.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/StylePanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StylePanel from '../components/StylePanel';

const mockParts = [
  { id: 'torso', label: 'TORSO', color: '#1d4ed8', material: 'FABRIC' as const },
  { id: 'legs', label: 'LEGS', color: '#dc2626', material: 'METAL' as const },
  { id: 'head', label: 'HEAD', color: '#16a34a', material: 'PLASTIC' as const },
];

const defaultProps = {
  parts: mockParts,
  activePart: 'torso',
  onPartSelect: vi.fn(),
  onColorChange: vi.fn(),
  onMaterialChange: vi.fn(),
  onApplyToAll: vi.fn(),
  onClose: vi.fn(),
};

describe('StylePanel', () => {
  it('renders all parts in the left column', () => {
    render(<StylePanel {...defaultProps} />);
    expect(screen.getByText('TORSO')).toBeInTheDocument();
    expect(screen.getByText('LEGS')).toBeInTheDocument();
    expect(screen.getByText('HEAD')).toBeInTheDocument();
  });

  it('highlights the active part', () => {
    render(<StylePanel {...defaultProps} />);
    // The active part row should have a distinct style — we verify via aria or text presence
    // Implementation test: clicking a different part calls onPartSelect
    fireEvent.click(screen.getByText('LEGS'));
    expect(defaultProps.onPartSelect).toHaveBeenCalledWith('legs');
  });

  it('calls onColorChange when a color swatch is clicked (immediate preview)', () => {
    const onColorChange = vi.fn();
    render(<StylePanel {...defaultProps} onColorChange={onColorChange} />);
    const swatches = screen.getAllByRole('button', { name: /color/i });
    fireEvent.click(swatches[0]);
    expect(onColorChange).toHaveBeenCalledWith('torso', expect.any(String));
  });

  it('calls onMaterialChange when a material button is clicked (immediate preview)', () => {
    const onMaterialChange = vi.fn();
    render(<StylePanel {...defaultProps} onMaterialChange={onMaterialChange} />);
    fireEvent.click(screen.getByText('METAL'));
    expect(onMaterialChange).toHaveBeenCalledWith('torso', 'METAL');
  });

  it('APPLY TO THIS PART calls both onColorChange and onMaterialChange for active part', () => {
    const onColorChange = vi.fn();
    const onMaterialChange = vi.fn();
    render(<StylePanel {...defaultProps} onColorChange={onColorChange} onMaterialChange={onMaterialChange} />);
    fireEvent.click(screen.getByText('APPLY TO THIS PART'));
    expect(onColorChange).toHaveBeenCalledWith('torso', expect.any(String));
    expect(onMaterialChange).toHaveBeenCalledWith('torso', expect.any(String));
  });

  it('calls onApplyToAll when APPLY TO ALL is clicked', () => {
    render(<StylePanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/apply to all/i));
    expect(defaultProps.onApplyToAll).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
  });

  it('calls onClose when close button is clicked', () => {
    render(<StylePanel {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx vitest run tests/StylePanel.test.tsx
```

Expected: `Cannot find module '../components/StylePanel'`

---

### Task 4: StylePanel — implementation

**Files:**
- Create: `components/StylePanel.tsx`

**Context:**
- `PartEntry` type: `{ id: string; label: string; color: string; material: 'FABRIC' | 'METAL' | 'PLASTIC' | 'CHROME' }`
- Color presets to show: `['#1d4ed8','#dc2626','#16a34a','#7c3aed','#f59e0b','#e2e8f0']` (blue, red, green, purple, amber, white)
- "Apply to this part" fires `onColorChange(activePart, color)` + `onMaterialChange(activePart, material)`
- "Apply to all" fires `onApplyToAll(color, material)`
- Panel is 360px wide, fixed right side; the left column is 105px fixed.

- [ ] **Step 3: Create StylePanel.tsx**

```tsx
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
}

const COLOR_PRESETS = ['#1d4ed8', '#dc2626', '#16a34a', '#7c3aed', '#f59e0b', '#e2e8f0'];
const MATERIALS: MaterialType[] = ['FABRIC', 'METAL', 'PLASTIC', 'CHROME'];

const StylePanel: React.FC<StylePanelProps> = ({
  parts,
  activePart,
  onPartSelect,
  onColorChange,
  onMaterialChange,
  onApplyToAll,
  onClose,
}) => {
  const active = parts.find((p) => p.id === activePart) ?? parts[0];
  const [localColor, setLocalColor] = useState(active?.color ?? '#1d4ed8');
  const [localMaterial, setLocalMaterial] = useState<MaterialType>(active?.material ?? 'FABRIC');

  // Sync local state when active part changes
  useEffect(() => {
    if (active) {
      setLocalColor(active.color);
      setLocalMaterial(active.material);
    }
  }, [activePart, active?.color, active?.material]);

  return (
    <div style={{
      width: 360,
      background: 'var(--color-surface)',
      borderLeft: '2px solid var(--color-border-strong)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
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
      </div>

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
              }}
            >
              {/* Color dot indicator */}
              <span style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: p.color,
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.2)',
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      aria-label={`color ${c}`}
                      onClick={() => { setLocalColor(c); onColorChange(activePart, c); }}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: c,
                        border: `2px solid ${localColor === c ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)'}`,
                        cursor: 'pointer',
                        flexShrink: 0,
                        padding: 0,
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
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {MATERIALS.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setLocalMaterial(m); onMaterialChange(activePart, m); }}
                      style={{
                        padding: '4px 8px',
                        background: localMaterial === m ? 'var(--color-accent)' : 'var(--color-surface-2)',
                        color: localMaterial === m ? '#000' : '#9ca3af',
                        border: `1.5px solid ${localMaterial === m ? 'var(--color-accent)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius)',
                        fontSize: 9,
                        fontWeight: 'bold',
                        letterSpacing: 1,
                        cursor: 'pointer',
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
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
                  }}
                >
                  APPLY TO THIS PART
                </button>
                <button
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
                  }}
                >
                  APPLY TO ALL PARTS
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
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx vitest run tests/StylePanel.test.tsx
```

Expected: All 6 tests pass.

- [ ] **Step 5: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add components/StylePanel.tsx tests/StylePanel.test.tsx
git commit -m "feat: add StylePanel 2-column color/material editor"
```

---

## Chunk 3: Sidebar Icons + App.tsx Integration

### Task 5a: PartCategoryToolbar sidebar icons — tests

**Files:**
- Create: `tests/PartCategoryToolbarSideIcons.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// tests/PartCategoryToolbarSideIcons.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PartCategoryToolbar from '../components/PartCategoryToolbar';

// Minimal props — find the full required props by reading PartCategoryToolbar interface
// and pass vi.fn() for all handlers, null/undefined for optional ones.
// The test only cares about the new activeSidePanel / onSidePanelToggle props.
const baseProps = {
  // Add required props here after reading the PartCategoryToolbar interface:
  // e.g. activeCategory: null, onTorsoToggle: vi.fn(), ...
  activeSidePanel: null as 'style' | 'skins' | 'lights' | null,
  onSidePanelToggle: vi.fn(),
};

describe('PartCategoryToolbar — side panel icons', () => {
  it('renders STYLE, SKINS, LIGHTS buttons', () => {
    render(<PartCategoryToolbar {...baseProps as any} />);
    expect(screen.getByText('STYLE')).toBeInTheDocument();
    expect(screen.getByText('SKINS')).toBeInTheDocument();
    expect(screen.getByText('LIGHTS')).toBeInTheDocument();
  });

  it('calls onSidePanelToggle with "style" when STYLE is clicked', () => {
    const onSidePanelToggle = vi.fn();
    render(<PartCategoryToolbar {...baseProps as any} onSidePanelToggle={onSidePanelToggle} />);
    fireEvent.click(screen.getByText('STYLE'));
    expect(onSidePanelToggle).toHaveBeenCalledWith('style');
  });

  it('highlights the active side panel button', () => {
    render(<PartCategoryToolbar {...baseProps as any} activeSidePanel="skins" />);
    const skinsBtn = screen.getByText('SKINS').closest('button');
    // Active button has amber border color via inline style
    expect(skinsBtn).toHaveStyle('border-color: var(--color-accent)');
  });
});
```

**Note:** Before running this test, read `PartCategoryToolbar.tsx` to find all required props and fill in `baseProps` with `vi.fn()` stubs. The test file shows `as any` as a safety valve — remove it once baseProps is complete.

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx vitest run tests/PartCategoryToolbarSideIcons.test.tsx
```

Expected: FAIL (new props not yet added to component)

---

### Task 5: Add STYLE/SKINS/LIGHTS icons to PartCategoryToolbar

**Files:**
- Modify: `components/PartCategoryToolbar.tsx`

**Context:** `PartCategoryToolbar.tsx` currently renders UPPER/BELT/LOWER category buttons. We add three icon buttons at the bottom. These are style shortcuts that open panels managed in App.tsx.

The new props to add to `PartCategoryToolbarProps`:
```ts
activeSidePanel?: 'style' | 'skins' | 'lights' | null;
onSidePanelToggle?: (panel: 'style' | 'skins' | 'lights') => void;
```

- [ ] **Step 1: Read current PartCategoryToolbar props interface**

```bash
grep -n "interface\|Props\|activeSidePanel\|onStyle\|onSkins\|onLights" c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/components/PartCategoryToolbar.tsx | head -30
```

Note the exact interface name and where it ends (line number) — you'll need to add the two new props.

- [ ] **Step 2: Add new props to the interface**

Using the Edit tool, add to the PartCategoryToolbarProps interface:
```ts
  activeSidePanel?: 'style' | 'skins' | 'lights' | null;
  onSidePanelToggle?: (panel: 'style' | 'skins' | 'lights') => void;
```

- [ ] **Step 3: Destructure the new props in the component function signature**

Find the destructuring line in the component function and add:
```ts
activeSidePanel,
onSidePanelToggle,
```

- [ ] **Step 4: Add the three icon buttons at the bottom of the sidebar JSX**

Find the end of the sidebar's returned JSX (just before the closing `</div>` of the main container) and add a separator + three buttons:

```tsx
{/* Style shortcuts — bottom of sidebar */}
{onSidePanelToggle && (
  <>
    <div style={{ flex: 1 }} /> {/* spacer to push to bottom */}
    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
      {([
        { key: 'style', icon: '🎨', label: 'STYLE' },
        { key: 'skins', icon: '✨', label: 'SKINS' },
        { key: 'lights', icon: '💡', label: 'LIGHTS' },
      ] as const).map(({ key, icon, label }) => {
        const isActive = activeSidePanel === key;
        return (
          <button
            key={key}
            onClick={() => onSidePanelToggle(key)}
            style={{
              width: '60px',
              padding: '8px 4px',
              background: isActive ? 'var(--color-accent-dim, rgba(245,158,11,0.15))' : 'transparent',
              border: `1.5px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            <span style={{ fontSize: 7, color: isActive ? 'var(--color-accent)' : '#6b7280', letterSpacing: 1 }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </>
)}
```

- [ ] **Step 5: TypeScript check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx tsc --noEmit 2>&1 | head -30
```

Fix any errors before continuing.

- [ ] **Step 6: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add components/PartCategoryToolbar.tsx tests/PartCategoryToolbarSideIcons.test.tsx
git commit -m "feat: add STYLE/SKINS/LIGHTS shortcut icons to sidebar"
```

---

### Task 5b: Bottom bar STL/GLB export buttons

**Files:**
- Modify: `components/App.tsx` (bottom bar section)

**Context:** The bottom bar (`.app-bottom`) already exists. It may already have EXPORT GLB and EXPORT STL buttons — check first. If they exist but are styled with old classes, restyle them. If they are missing, add them.

- [ ] **Step 1: Check current bottom bar**

```bash
grep -n "EXPORT\|STL\|GLB\|exportSTL\|exportModel\|app-bottom" c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/components/App.tsx | head -20
```

If both buttons exist and are already Dark Comics styled (no light Tailwind classes), this task is **done — skip to commit**.

- [ ] **Step 2: Restyle or add STL/GLB buttons in the bottom bar**

Find the export buttons section in the bottom bar and ensure they match Dark Comics style. They should look like this:

```tsx
<div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
  <button
    onClick={() => characterViewerRef.current?.exportSTL?.()}
    style={{
      padding: '5px 12px',
      background: 'transparent',
      border: '2px solid var(--color-border)',
      borderRadius: 'var(--radius)',
      color: '#9ca3af',
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 1,
      cursor: 'pointer',
      fontFamily: 'var(--font-comic)',
    }}
  >
    🖨️ STL
  </button>
  <button
    onClick={() => characterViewerRef.current?.exportModel?.()}
    style={{
      padding: '5px 12px',
      background: 'transparent',
      border: '2px solid var(--color-border)',
      borderRadius: 'var(--radius)',
      color: '#9ca3af',
      fontSize: 10,
      fontWeight: 'bold',
      letterSpacing: 1,
      cursor: 'pointer',
      fontFamily: 'var(--font-comic)',
    }}
  >
    🎮 GLB
  </button>
</div>
```

- [ ] **Step 3: Verify no light-mode classes on export buttons**

```bash
grep -n "bg-white\|bg-gray\|bg-green\|bg-purple\|border-gray-200" c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/components/App.tsx | grep -i "stl\|glb\|export" | head -10
```

Expected: no matches.

- [ ] **Step 4: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add components/App.tsx
git commit -m "feat: ensure STL and GLB export buttons visible in bottom bar"
```

---

### Task 6: Wire ArchetypeSwitcher into App.tsx topbar

**Files:**
- Modify: `components/App.tsx`

**Context:**
- Current topbar has 5 nav tabs: `parts | materials | skins | effects | lighting`
- These are controlled by `activeTab` state
- We replace the tab bar with `ArchetypeSwitcher` chips
- The right-side action buttons (SAVE/CART/CHECKOUT) remain unchanged
- `selectedArchetype` state already exists: `useState<ArchetypeId | null>(ArchetypeId.STRONG)`
- `hasUnsavedParts` = `Object.keys(selectedParts).length > 0`

- [ ] **Step 1: Read the topbar section of App.tsx**

```bash
sed -n '1514,1623p' c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/components/App.tsx
```

Note the exact lines of the tab bar so you can replace only that section.

- [ ] **Step 2: Add ArchetypeSwitcher import at top of App.tsx**

```tsx
import ArchetypeSwitcher from './ArchetypeSwitcher';
```

Also import the archetypes list:
```tsx
import { ARCHETYPES_LIST } from '../lib/archetypeData'; // adjust if named differently
```

- [ ] **Step 3: Add `handleArchetypeSelect` handler**

Add spinner state near other state declarations:
```tsx
const [archetypeLoading, setArchetypeLoading] = useState(false);
```

Add the handler near existing `selectedArchetype` state:
```tsx
const handleArchetypeSelect = (id: string) => {
  setSelectedArchetype(id as ArchetypeId);
  // Reset selected parts when changing archetype
  if (isAuthenticated) {
    setUserSelectedParts({});
  } else {
    setGuestSelectedParts(GUEST_USER_BUILD);
  }
  // For archetypes with a GLB model, trigger remount with spinner
  const archetype = ARCHETYPES_LIST.find((a) => a.id === id);
  if (archetype?.hasGLB) {
    setArchetypeLoading(true);
    setCharacterViewerKey((k: number) => k + 1); // remount CharacterViewer with new archetype
    // Hide spinner after 2s max (CharacterViewer fires its own ready event if supported)
    setTimeout(() => setArchetypeLoading(false), 2000);
  }
};
```

Add a loading overlay near the CharacterViewer in the JSX (inside `.app-viewer`):
```tsx
{archetypeLoading && (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(10,10,15,0.65)',
    zIndex: 50,
    pointerEvents: 'none',
  }}>
    <div style={{
      color: 'var(--color-accent)',
      fontFamily: 'var(--font-comic)',
      fontSize: 18,
      letterSpacing: 4,
    }}>
      LOADING…
    </div>
  </div>
)}
```

Check if `characterViewerKey` state already exists:
```bash
grep -n "characterViewerKey\|setCharacterViewerKey" c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/components/App.tsx | head -5
```
If it doesn't exist, add it: `const [characterViewerKey, setCharacterViewerKey] = useState(0);` and use it as `key={characterViewerKey}` on the `<CharacterViewer>` element.

- [ ] **Step 4: Replace the 5-tab nav in the topbar with ArchetypeSwitcher**

Find the JSX block that renders the 5 tab buttons (parts/materials/skins/effects/lighting) inside `<header className="app-topbar">` and replace it with:

```tsx
<ArchetypeSwitcher
  archetypes={ARCHETYPES_LIST}
  activeArchetypeId={selectedArchetype ?? ArchetypeId.STRONG}
  hasUnsavedParts={Object.keys(selectedParts).length > 0}
  onSelect={handleArchetypeSelect}
/>
```

Keep the logo block and the right-side action buttons — only remove/replace the tab nav section.

- [ ] **Step 5: TypeScript check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx tsc --noEmit 2>&1 | head -30
```

Fix errors. Common issue: `ARCHETYPES_LIST` may be exported differently — check with `grep -n "export" lib/archetypeData.ts`.

- [ ] **Step 6: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add components/App.tsx
git commit -m "feat: replace topbar nav tabs with ArchetypeSwitcher chips"
```

---

### Task 7: Wire StylePanel + sidebar panel toggle in App.tsx

**Files:**
- Modify: `components/App.tsx`

**Context:**
- Add `activeSidePanel: 'style' | 'skins' | 'lights' | null` state (alongside existing `activeTab`)
- Wire `onSidePanelToggle` to PartCategoryToolbar
- Render StylePanel in the right panel area when `activeSidePanel === 'style'`
- Keep existing SkinsPanel and LightsPanel but route them through `activeSidePanel`
- `StylePanel` needs `parts` as `PartEntry[]`. Build this from `selectedParts` and `currentColors` (which MaterialConfigurator already manages)

- [ ] **Step 1: Add imports**

```tsx
import StylePanel, { type PartEntry, type MaterialType } from './StylePanel';
```

- [ ] **Step 2: Add activeSidePanel state**

```tsx
const [activeSidePanel, setActiveSidePanel] = useState<'style' | 'skins' | 'lights' | null>(null);
```

- [ ] **Step 3: Add toggle handler**

First verify whether `setIsPanelOpen` exists:
```bash
grep -n "isPanelOpen\|setIsPanelOpen" c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign/components/App.tsx | head -10
```

If it exists, use it. If not, omit it:
```tsx
const handleSidePanelToggle = (panel: 'style' | 'skins' | 'lights') => {
  setActiveSidePanel((current) => current === panel ? null : panel);
  // Only call setIsPanelOpen if it exists in this file
  // setIsPanelOpen?.(true);
};
```

- [ ] **Step 4: Build `stylePanelParts` from current state**

```tsx
// Derive PartEntry[] for StylePanel from selectedParts + currentColors
const STYLE_PART_LABELS: Record<string, string> = {
  torso: 'TORSO', legs: 'LEGS', head: 'HEAD', hand_left: 'L.HAND',
  hand_right: 'R.HAND', cape: 'CAPE', boots: 'BOOTS', belt: 'BELT',
  chest_belt: 'CHEST', symbol: 'SYMBOL',
};
const [stylePanelParts, setStylePanelParts] = useState<PartEntry[]>(
  Object.keys(STYLE_PART_LABELS).map((id) => ({
    id,
    label: STYLE_PART_LABELS[id],
    color: '#9ca3af',
    material: 'FABRIC' as MaterialType,
  }))
);
const [activePanelPart, setActivePanelPart] = useState('torso');
```

- [ ] **Step 5: Add StylePanel color/material handlers**

```tsx
const handleStylePanelColorChange = (partId: string, color: string) => {
  // Convert hex to THREE number and call existing onColorChange
  const colorNum = parseInt(color.replace('#', ''), 16);
  onColorChange?.('palette', 'primary', colorNum, partId as PartCategory);
  setStylePanelParts((prev) =>
    prev.map((p) => p.id === partId ? { ...p, color } : p)
  );
};

const handleStylePanelMaterialChange = (partId: string, material: MaterialType) => {
  // Map material name to existing MaterialConfigurator preset names
  const MATERIAL_MAP: Record<MaterialType, string> = {
    FABRIC: 'Soft Suit',
    METAL: 'Brilliant Metal',
    PLASTIC: 'Plastic Hero',
    CHROME: 'Chrome Legend',
  };
  // Apply via characterViewerRef if the method exists
  characterViewerRef.current?.applyMaterialPreset?.(partId, MATERIAL_MAP[material]);
  setStylePanelParts((prev) =>
    prev.map((p) => p.id === partId ? { ...p, material } : p)
  );
};

const handleApplyToAll = (color: string, material: MaterialType) => {
  stylePanelParts.forEach((p) => {
    handleStylePanelColorChange(p.id, color);
    handleStylePanelMaterialChange(p.id, material);
  });
};
```

- [ ] **Step 6: Add StylePanel to right panel area**

In the right panel JSX (where `activeTab === 'materials'` rendered `MaterialPanel`), add:

```tsx
{activeSidePanel === 'style' && (
  <StylePanel
    parts={stylePanelParts}
    activePart={activePanelPart}
    onPartSelect={setActivePanelPart}
    onColorChange={handleStylePanelColorChange}
    onMaterialChange={handleStylePanelMaterialChange}
    onApplyToAll={handleApplyToAll}
    onClose={() => setActiveSidePanel(null)}
  />
)}
{activeSidePanel === 'skins' && (
  <SkinsPanel apiRef={characterViewerRef} onClose={() => setActiveSidePanel(null)} />
)}
{activeSidePanel === 'lights' && (
  <LightsPanel onClose={() => setActiveSidePanel(null)} />
)}
```

- [ ] **Step 7: Pass activeSidePanel + toggle to PartCategoryToolbar**

Find the `<PartCategoryToolbar` JSX in App.tsx and add:
```tsx
activeSidePanel={activeSidePanel}
onSidePanelToggle={handleSidePanelToggle}
```

- [ ] **Step 8: TypeScript check + dev server smoke test**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx tsc --noEmit 2>&1 | head -40
```

Then:
```bash
npm run dev
```

Open browser, verify: archetype chips appear in topbar, STYLE/SKINS/LIGHTS icons appear at bottom of sidebar, clicking STYLE opens the 2-column panel.

- [ ] **Step 9: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add components/App.tsx
git commit -m "feat: wire StylePanel and activeSidePanel into App.tsx"
```

---

### Task 8: Verify success criteria

- [ ] **Step 1: Run all tests**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx vitest run
```

Expected: All tests pass (no regressions).

- [ ] **Step 2: Verify success criteria checklist**

| # | Criterion | How to verify |
|---|-----------|---------------|
| 1 | Archetype chips visible in topbar at all times | Open app, scroll/interact — chips always present |
| 2 | Switching archetype updates 3D viewer + stats | Click a different chip, verify model/stats change |
| 3 | Color/material in ≤2 clicks from default state | Click sidebar STYLE icon (click 1) → part row already selected (0 more) = 1 click total |
| 4 | STL/GLB visible in bottom bar without submenu | `grep -n "STL\|GLB\|exportSTL\|exportModel" components/App.tsx \| grep -i "app-bottom\|bottom bar\|bottom"` — expect matches inside the bottom bar section |
| 5 | Skins accessible via sidebar SKINS icon | Click SKINS icon → SkinsPanel opens |
| 6 | No light-mode classes | `grep -rn "bg-purple-50\|bg-green-50\|bg-white\|border-gray-200" components/StylePanel.tsx components/ArchetypeSwitcher.tsx` — expect no matches |

- [ ] **Step 3: Final commit if any fixes needed**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add -A
git commit -m "fix: address any issues found during success criteria verification"
```

---

## Notes for implementer

**Finding the archetype list:** Run `grep -n "export\|ARCHETYPES\|archetypeList\|allArchetypes" lib/archetypeData.ts` to find the exact export name. If it's not `ARCHETYPES_LIST`, update the imports accordingly.

**If `applyMaterialPreset` doesn't exist on CharacterViewerRef:** Check `components/CharacterViewer.tsx` for what methods are exposed via `useImperativeHandle`. You may need to route material application through `onMaterialChange` callback in MaterialConfigurator instead.

**If `LightsPanel` doesn't accept `onClose`:** Read its current props and either add the prop or wrap it.

**Tab state vs activeSidePanel:** The old `activeTab` state can remain for any parts of the app still using it. Don't delete it until you confirm nothing else reads it.
