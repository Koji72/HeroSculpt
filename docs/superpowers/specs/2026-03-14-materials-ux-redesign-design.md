# Hero Builder — Materials & UX Redesign Spec
**Date:** 2026-03-14
**Branch:** feat/dark-comics-redesign

---

## Context

The Hero Builder is a 3D miniature customizer for **tabletop RPG and board game players**. Users design a superhero miniature and download it as:
- **STL** — for 3D printing a physical miniature
- **GLB/VTT** — for digital platforms (Roll20, Foundry VTT, Tabletop Simulator)

The primary customer journey is:
1. **Choose archetype** (character class: Justiciero, Strong, Speedster, Mystic, etc.)
2. **Build the hero** (select parts, then style with color + material)
3. **Review RPG sheet** (stats, abilities, price summary)
4. **Purchase and download** (STL for print or GLB for VTT)

---

## Problem Statement

The current Materials UI has a confusing nested structure:
- MATERIALS tab → sub-tabs: PARTS / MAT / LIGHT / EXPORT
- Users don't understand the relationship between sub-tabs
- Skins and materials are separate, disconnected flows
- No clear archetype identity visible during customization

---

## Data Shapes

```ts
interface Archetype {
  id: string;           // e.g. "justiciero"
  name: string;         // e.g. "JUSTICIERO"
  emoji: string;        // e.g. "⚔️"
  tagline: string;      // e.g. "THE VIGILANTE"
  description: string;  // short blurb
  examples: string[];   // famous heroes: ["Batman", "Daredevil"]
  stats: { power: number; defense: number; speed: number }; // 0–100
  hasGLB: boolean;      // true only for STRONG and JUSTICIERO currently
}

interface PartEntry {
  id: string;           // e.g. "torso", "legs", "head"
  label: string;        // e.g. "TORSO"
  color: string;        // hex, e.g. "#1d4ed8"
  material: 'FABRIC' | 'METAL' | 'PLASTIC' | 'CHROME';
}
```

---

## Design Decisions

### 1. Archetype Switcher — Inline Topbar Chips

**Where:** Always visible in the topbar, between the logo and right-side action buttons.

**Props:**
```ts
interface ArchetypeSwitcherProps {
  archetypes: Archetype[];
  activeArchetypeId: string;
  hasUnsavedParts: boolean;       // true if user has selected any parts
  onSelect: (id: string) => void;
}
```

**Behavior:**
- Active archetype: filled amber chip with ACTIVE badge
- Other archetypes: muted outline chips (up to 4 visible, then "··· MORE")
- **Overflow:** "··· MORE" chip opens a **dropdown** (not a modal) positioned below the chip. Dropdown lists remaining archetypes. Dismisses on outside click or Escape.
- **Hover** on any chip → `ArchetypeTooltip` renders below: emoji, name, tagline, examples, mini stat bars (POWER/DEFENSE/SPEED 0–100), "SELECT" button
- **Click chip / SELECT button:** if `hasUnsavedParts === true`, show inline confirmation ("Changing archetype will clear selected parts. Continue?"). On confirm, call `onSelect(id)`. On cancel, dismiss.
- **Archetype switch effect:** for archetypes with `hasGLB: true`, swap the 3D GLB model. For all others, keep base model and update archetype metadata (stats, filtered parts list). Show a spinner overlay on the 3D viewer for max 2s; on load error, show an amber toast "Model unavailable, using base model" and continue.

**Rationale:** Recurring users switch in 1 click. New users explore via hover without leaving the builder.

### 2. Unified STYLE Panel (replaces MATERIALS sub-tab structure)

**Opened by:** STYLE icon in sidebar (see §3), or clicking any part in the 3D viewer.

**Default state:** TORSO is pre-selected when panel opens.

**Props:**
```ts
interface StylePanelProps {
  parts: PartEntry[];
  activePart: string;                   // part id
  onPartSelect: (id: string) => void;
  onColorChange: (partId: string, color: string) => void;
  onMaterialChange: (partId: string, material: PartEntry['material']) => void;
  onApplyToAll: (color: string, material: PartEntry['material']) => void;
  onClose: () => void;
}
```

**Layout:** Fixed-width panel (360px), right side of viewport.
- **Left column (105px, fixed):** vertical list of all `PartEntry` items as clickable rows; active row highlighted amber. List is scrollable if parts exceed panel height.
- **Right column (flex):** editor for the active part:
  - 6 preset color swatches + `<input type="color">` for custom
  - Material type toggle: FABRIC / METAL / PLASTIC / CHROME (single-select)
  - "APPLY TO THIS PART" button → calls `onColorChange` + `onMaterialChange` for active part
  - "APPLY TO ALL" button → calls `onApplyToAll` with current color + material

**Color/material propagation:** Both handlers call through to the existing `MaterialConfigurator` logic that applies changes to `THREE.MeshPhysicalMaterial` in the scene. `StylePanel` is a new UI layer on top of existing Three.js material logic — it does not replace it.

**No nested sub-tabs.** LIGHTING is moved to its own sidebar entry (§3).

### 3. Left Sidebar — Part Categories + Style Shortcuts

**Top section (unchanged):** Part category icons (UPPER, BELT, LOWER, BACK).

**Bottom section (new icons):**
- 🎨 STYLE → opens `StylePanel`
- ✨ SKINS → opens `SkinsPanel`
- 💡 LIGHTS → opens `LightingPanel` (existing AO + environment presets)

Only one panel open at a time. Clicking an active icon closes its panel.

### 4. Bottom Bar — Always-Visible Export Actions

The bottom bar (existing `.app-bottom`, 56px height) gains two permanent export buttons on the right side:
- **🖨️ STL** — calls existing STL export handler
- **🎮 GLB** — calls existing GLB/VTT export handler

These buttons are always rendered. No sub-menu or tab required to reach them.

---

## Component Changes

### `components/ArchetypeSwitcher.tsx` (new)
- Renders chip list + overflow dropdown
- Contains `ArchetypeTooltip` as internal sub-component
- Contains inline confirmation dialog (not a modal — renders in the topbar row)
- Reads archetype data from existing `ARCHETYPES` array in `lib/archetypes.ts` (or wherever it lives)

### `components/StylePanel.tsx` (new)
- 2-column layout as described in §2
- Receives props from App.tsx; delegates color/material changes to MaterialConfigurator logic
- Does NOT own Three.js state — that remains in `MaterialConfigurator.tsx` or `CharacterViewer.tsx`

### `App.tsx` / Sidebar section
- Add STYLE / SKINS / LIGHTS icons to bottom of left sidebar
- Track open panel state: `activeSidePanel: 'style' | 'skins' | 'lights' | null`
- Pass `StylePanel` props wired to existing `materialConfigurator` ref or callbacks

### Bottom bar (App.tsx or dedicated component)
- Add STL and GLB buttons alongside existing pose nav
- Reuse existing export handler functions

---

## Out of Scope

- RPG Character Sheet export (PDF) — future
- "Library of saved heroes" — future
- Full archetype 3D swap for archetypes without GLB assets (metadata-only update for those)
- Mobile/responsive layout — desktop-first; no responsive breakpoints in this spec
- Keyboard navigation within dropdown/tooltip (future accessibility pass)

---

## Design System

All new components use the Dark Comics token set:
- `--color-bg`, `--color-surface`, `--color-surface-2`
- `--color-accent: #f59e0b` (amber)
- `--color-border`, `--color-border-strong`
- `--font-comic: 'Bangers', cursive` — headers only
- `--radius: 2px` — all borders
- Dark-mode only; no light theme needed
- No shadcn components. No `bg-purple-50`, `bg-green-50`, `bg-white`, or light-mode Tailwind color classes.

---

## Success Criteria

1. Archetype chips visible in topbar at all times during customization
2. Switching archetype updates the 3D viewer and RPG stats without navigating away
3. Color and material for any part reachable in ≤2 clicks from the default builder state (sidebar STYLE icon → part row)
4. STL and GLB export buttons visible in the bottom bar without opening any sub-menu
5. Skins panel accessible via sidebar SKINS icon without nested tabs
6. No light-mode Tailwind classes (`bg-white`, `bg-purple-50`, `bg-green-50`, `border-gray-200`, etc.) anywhere in the materials/skins/style flow
