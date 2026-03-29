# UI/UX Redesign — Dark Comics Studio
**Date:** 2026-03-13
**Status:** Approved
**Project:** 3D Superhero Character Customizer (`3dcustomicerdefinitvo`)

---

## 1. Vision

Replace the current amateur-feeling hybrid UI with a bold, cohesive **Dark Comics Studio** aesthetic. The redesign targets every visible surface of the app — layout, typography, color, components, animations — without touching Three.js rendering internals or business logic (cart state, auth flows, pose management, model loading).

**Personality:** Editorial comic book meets premium product configurator. Like the character creation screen from a AAA superhero game, designed by a comic book art director.

---

## 2. Design System

### 2.1 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0a0a0f` | App background, topbar |
| `--color-surface` | `#0c0c14` | Panels, cards |
| `--color-surface-2` | `#13131f` | Part cards, inputs |
| `--color-border` | `#1f2937` | Subtle dividers |
| `--color-border-strong` | `#374151` | Panel borders |
| `--color-accent` | `#f59e0b` | Primary accent — amber/gold |
| `--color-accent-dim` | `rgba(245,158,11,0.13)` | Accent backgrounds |
| `--color-accent-mid` | `rgba(245,158,11,0.4)` | Accent borders |
| `--color-text` | `#e2e8f0` | Primary text |
| `--color-text-muted` | `#9ca3af` | Secondary text |
| `--color-text-faint` | `#6b7280` | Disabled / placeholder |
| `--color-danger` | `#ef4444` | Destructive actions |
| `--color-success` | `#22c55e` | Confirmations |

> **MIGRATION NOTE:** The existing codebase uses `#fbbf24` (Tailwind amber-400) and `#f97316` (Tailwind orange-500) as accent colors in `index.css`, `marvel-panel-box.css`, and inline styles. Every occurrence of `#fbbf24` and `#f97316` used as an accent must be replaced with `#f59e0b`. The old `.btn-primary` definition in `index.css` (line ~258, orange `#f97316`, `border-radius: 0.5rem`) must be **deleted** before the new `.btn-primary` token is defined; leaving both creates a cascade collision.

### 2.2 Typography

| Role | Font | Size | Weight | Letter-spacing |
|------|------|------|--------|----------------|
| Logo | Bangers | 22px | 400 | 2px |
| Panel headers | Bangers | 18–20px | 400 | 3px |
| Category labels | Bangers | 10px | 400 | 1.5px |
| Nav buttons | Bangers | 14px | 400 | 1.5px |
| Action buttons (primary) | Bangers | 16px | 400 | 2px |
| Small buttons / labels | Bangers | 11px | 400 | 1px |
| Body / prices / descriptions | Inter | 12–14px | 400–600 | 0 |

**Font loading** — Add to `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;600;700&display=swap');
```
For offline/self-hosted fallback: download `Bangers-Regular.ttf` and `Inter` subset to `/public/fonts/` and use `@font-face`. The Google Fonts import is sufficient for production use.

Remove all `RefrigeratorDeluxeHeavy` and `RefrigeratorDeluxeBold` `@font-face` declarations and references.

### 2.3 Shape Language

- Border radius: **2px** everywhere (sharp, editorial — not rounded-modern)
- Primary panel borders: **3px solid** accent color
- Secondary element borders: **1.5–2px solid** border colors
- No box shadows with blur > 20px; glow only: `box-shadow: 0 0 Xpx rgba(245,158,11,Y)`
- Comic accent bars: single thick border on one side to mimic panel frame

### 2.4 Halftone Background

The 3D viewer container `<div>` (in `App.tsx`, wrapping `<CharacterViewer>`) receives this background treatment:
```css
background:
  radial-gradient(ellipse at 50% 70%, #2a1f0a, transparent 60%),
  radial-gradient(ellipse at 50% 60%, #1a1520, #0a0a0f 70%),
  radial-gradient(circle, rgba(245,158,11,0.04) 1px, transparent 1px) 0 0 / 28px 28px;
```
The `<CharacterViewer>` canvas itself remains unchanged (transparent background, alpha: true). **Do not touch `CharacterViewer.tsx` internals.**

---

## 3. Layout Architecture

### 3.1 Current → New Layout Migration

**Current structure** (`index.css`): CSS grid `.layout-grid` with `grid-template-columns: minmax(180px,220px) 1fr` and `padding-top: 110px`. This must be **replaced**.

**New structure**: All panels are `position: absolute` overlays on top of a full-screen `position: fixed; inset: 0` viewer container. The layout shell lives in `App.tsx` directly (no separate layout component needed since App.tsx is already the root renderer).

**Migration steps for `index.css`:**
1. Delete the `.layout-grid`, `.container-archetypes`, `.container-3dviewer`, `.container-3dviewer-box` rules
2. Add the new layout primitives (see Section 3.2–3.5)
3. The `#root` / `body` styles remain `height: 100vh; overflow: hidden`

### 3.2 Layout Overview

```
┌──────────────────────────────────────────────────────┐
│  TOPBAR (52px, fixed, z-100)                         │
│  [HERO BUILDER logo] [PARTS|MATERIALS|SKINS|EFFECTS] │
│                              [SAVE] [CART(n)] [→BUY] │
├──────────────────────────────────────────────────────┤
│                                                      │
│   3D VIEWER — position: absolute; inset: 0           │
│   (fills entire window behind all overlays)          │
│                                                      │
│  LEFT SIDEBAR     │    RIGHT PANEL (300px)           │
│  (72px, abs left) │    (abs right, slides in/out)    │
│                                                      │
│  BOTTOM BAR (56px, abs bottom)                       │
└──────────────────────────────────────────────────────┘
```

### 3.3 Topbar

```css
.topbar {
  position: fixed; top: 0; left: 0; right: 0; height: 52px; z-index: 100;
  background: #0a0a0f;
  border-bottom: 3px solid var(--color-accent);
  display: flex; align-items: stretch;
}
```

- **Logo block:** `background: var(--color-accent); color: #000` — "HERO BUILDER" in Bangers 22px
- **Nav tabs** (PARTS / MATERIALS / SKINS / EFFECTS / LIGHTING): Bangers 14px, `color: var(--color-text-faint)`, active → `color: var(--color-accent); border-bottom: 3px solid var(--color-accent)`
- **Right actions:** SAVE (outline amber), CART (outline amber + red badge count), CHECKOUT (solid amber)

### 3.4 Left Sidebar (Category Nav)

Replaces `components/PartCategoryToolbar.tsx` and `components/CategoryNavigation.tsx` — both are updated to match.

```css
.left-sidebar {
  position: fixed; top: 52px; left: 0; bottom: 56px; width: 72px; z-index: 50;
  background: rgba(10,10,15,0.92);
  border-right: 3px solid var(--color-border);
}
```

- Category buttons: 60px wide, icon (28×28) + Bangers 10px label
- Active: `border: 1.5px solid var(--color-accent); background: var(--color-accent-dim); color: var(--color-accent)`
- Groups separated by 1px `--color-border` dividers: HEAD/TORSO/CAPE | BELT/LEGS/BOOTS | HANDS/SYMBOL

When active tab ≠ PARTS, left sidebar is hidden (`display: none`).

### 3.5 Right Panel (Part Selector / Content Panel)

```css
.right-panel {
  position: fixed; top: 52px; right: 0; bottom: 56px; width: 300px; z-index: 50;
  background: var(--color-surface);
  border-left: 3px solid var(--color-accent);
  transform: translateX(100%);
  transition: transform 200ms ease;
}
.right-panel.open { transform: translateX(0); }
```

> **NOTE:** Current `PartSelectorPanel.tsx` is `w-[400px] xl:w-[450px]`. This is reduced to 300px. The 3-column part card grid at 300px uses ~88px cards, which is workable. The `xl:w-[450px]` responsive expansion is removed.

- **Panel header:** `background: var(--color-accent); color: #000` — Bangers 20px title + ✕ close button
- **Part grid:** 3 columns, part cards (aspect-ratio 1:1), thumbnail + Bangers name + Inter price
- **Selected card:** 2px amber border + `var(--color-accent-dim)` bg + ✓ top-right
- **Footer:** full-width "APPLY SELECTION" — Bangers 16px, solid amber button

### 3.6 Bottom Bar

```css
.bottom-bar {
  position: fixed; bottom: 0; left: 72px; right: 300px; height: 56px; z-index: 50;
  background: rgba(10,10,15,0.92);
  border-top: 3px solid var(--color-border);
}
```

- Pose nav: ◀ POSE N/M ▶ in Bangers
- View presets: FRONT / SIDE / 3/4 / BACK
- Export: EXPORT GLB / EXPORT STL
- Sections divided by 1px vertical dividers

When right panel is closed, bottom bar expands to `right: 0`. Mechanism: add `.panel-open` class to `<body>` (or a root wrapper) when the right panel is open; CSS sibling/descendant rule drives the bottom bar offset:
```css
.bottom-bar { right: 0; transition: right 200ms ease; }
body.panel-open .bottom-bar { right: 300px; }
```
This keeps the bottom bar in sync with the panel slide animation without JS style manipulation.

---

## 4. Panel System (Tab Navigation)

| Tab | Left Sidebar | Right Panel Content |
|-----|-------------|---------------------|
| PARTS | Visible (category nav) | Part Selector (PartSelectorPanel) |
| MATERIALS | Hidden | MaterialConfigurator (PBR sliders, colors) — includes textures |
| SKINS | Hidden | SkinsPanel (material preset grid) |
| EFFECTS | Hidden | PowerEffectsPanel |
| LIGHTING | Hidden | LightsPanel |

**MaterialPanel decomposition:** The current `MaterialPanel.tsx` is a monolithic component with its own internal tab system (skins/materials/lights/textures/effects/powers/save). For this redesign, `MaterialPanel.tsx` becomes the MATERIALS tab content only (PBR sliders + textures — the existing `textures` tab is merged into MATERIALS since they are closely related). `SkinsPanel`, `LightsPanel`, and `PowerEffectsPanel` are promoted to be direct tab-content children in the topbar. The `save` (material combos) sub-tab is included at the bottom of the MATERIALS panel. This requires removing MaterialPanel's internal tab switcher and exposing its sub-panels via the topbar tab system.

---

## 5. Component Redesign Targets

### 5.1 Part Cards (`PartItemCard.tsx`)
- Remove all `.marvel-part-card`, `.card-glow`, `.selected-glow` styles
- New: 2px radius, 1.5px `--color-border` border, hover → amber border, selected → amber dim bg + 2px amber border + ✓ corner
- Price: Inter 11px `--color-text-faint`, bottom-right
- Name: Bangers 9px uppercase, centered bottom

> **Pre-existing bug:** `PartSelectorPanel.tsx` has undeclared `setHoveredPartName` (line 741, used as `onHoverName` prop value) and `hoveredPartName` (lines 756–757, read in footer JSX). These three references must all be removed together — remove the `onHoverName` prop call on line 741, the `hoveredPartName` read on lines 756–757, and any related footer JSX that renders the hovered name. Do not remove only the setter and leave the read reference, or TypeScript will still error.

### 5.2 Buttons (all)
| Type | Style |
|------|-------|
| Primary | `background: var(--color-accent); color: #000; font-family: var(--font-comic); border: none; border-radius: var(--radius)` |
| Outline | `background: transparent; border: 2px solid var(--color-accent); color: var(--color-accent)` |
| Danger | `background: var(--color-danger); color: #fff` |
| Ghost | `background: transparent; border: 1.5px solid var(--color-border-strong); color: var(--color-text-muted)` |

Remove `.btn-primary` (old orange), `.marvel-button`, `.glass` usage in buttons.

`.glass` class: used in ~15 components as a blur-background effect. Replace with `background: rgba(10,10,15,0.85)` (no blur needed in new design). Global search-replace: remove `className="glass"` or replace with new `.panel-surface` class.

### 5.3 Modals — Full List
All modals use the same amber-header pattern:
- Header bar: `background: var(--color-accent); color: #000; font-family: var(--font-comic); padding: 10px 14px`
- Body: `background: var(--color-surface); border: 3px solid var(--color-accent); border-radius: var(--radius)`
- Close: ✕ Bangers top-right

**Modals in scope:**
- `AuthModal.tsx` — wrapper shell restyled; Supabase Auth UI interior uses inline CSS class overrides already present in the component (keep existing `appearance` override structure, update colors to `#f59e0b` / `#0c0c14`)
- `SimpleSignUpModal.tsx` — full restyling
- `TestSignUpModal.tsx` — full restyling
- `GuestEmailModal.tsx` — full restyling
- `PurchaseConfirmation.tsx` — full restyling
- `VTTExportModal.tsx` — full restyling
- `AiDesignerModal.tsx` — full restyling

### 5.4 Shopping Cart (`StandardShoppingCart.tsx`)
- Slides from right, z-index above right panel
- Header: amber bar "CART" + item count
- Line items: Bangers part name + Inter price + quantity ± buttons
- Total: large Bangers text, amber color
- Checkout CTA: full-width amber solid button

### 5.5 Submenu Components
`BeltSubmenu.tsx`, `TorsoSubmenu.tsx`, `LowerBodySubmenu.tsx`, `LeftHandSubmenu.tsx`, `RightHandSubmenu.tsx` — all restyled:
- Background: `var(--color-surface)`, border: `2px solid var(--color-accent)`, radius: `var(--radius)`
- Labels: Bangers, amber active state
- Remove all `RefrigeratorDeluxe` and `#fbbf24` references

### 5.6 `Header.tsx`
**Decision:** Delete `components/Header.tsx`. The topbar is implemented directly in `App.tsx`. Remove the `<Header>` import and JSX usage from `App.tsx`.

### 5.7 `HeaderDropdown.tsx`
- `background: var(--color-surface)`, `border: 2px solid var(--color-border-strong)`, radius: `var(--radius)`
- Menu items: Inter 14px, hover → amber text
- No rounded corners

### 5.8 `CategoryNavigation.tsx` and `PartCategoryToolbar.tsx`
**Decision:** These are NOT equivalent. `PartCategoryToolbar.tsx` is the authoritative component — it is actively wired into `App.tsx` with submenu toggle callbacks, button refs, and submenu state. **`CategoryNavigation.tsx` is deleted** (it uses `GlassPanel`/`GamingButton` and is not connected to any submenu logic).

`PartCategoryToolbar.tsx` is restyled to become the new left sidebar (Section 3.4). Its submenu anchor logic (currently based on button bounding rect) is preserved and verified to work correctly in the new `position: fixed` sidebar context.

---

## 6. CSS Architecture Changes

### 6.1 CSS Variables — Add to `:root` in `index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;600;700&display=swap');

:root {
  --color-bg: #0a0a0f;
  --color-surface: #0c0c14;
  --color-surface-2: #13131f;
  --color-border: #1f2937;
  --color-border-strong: #374151;
  --color-accent: #f59e0b;
  --color-accent-dim: rgba(245,158,11,0.13);
  --color-accent-mid: rgba(245,158,11,0.4);
  --color-text: #e2e8f0;
  --color-text-muted: #9ca3af;
  --color-text-faint: #6b7280;
  --color-danger: #ef4444;
  --color-success: #22c55e;
  --font-comic: 'Bangers', system-ui;
  --font-body: 'Inter', 'Segoe UI', system-ui;
  --radius: 2px;
  --border-strong: 3px;
  --border-normal: 2px;
  --border-subtle: 1.5px;
}
```

### 6.2 New Utility Classes (in `@layer components` for Tailwind v4 specificity)
```css
@layer components {
  .comic-title { font-family: var(--font-comic); letter-spacing: 2px; }
  .panel-header { background: var(--color-accent); color: #000; font-family: var(--font-comic); padding: 10px 14px; }
  .panel-box { background: var(--color-surface); border: var(--border-strong) solid var(--color-accent); border-radius: var(--radius); }
  .panel-surface { background: rgba(10,10,15,0.85); }
  .btn-comic { font-family: var(--font-comic); letter-spacing: 2px; border-radius: var(--radius); cursor: pointer; }
  .btn-primary { background: var(--color-accent); color: #000; border: none; }
  .btn-outline { background: transparent; border: var(--border-normal) solid var(--color-accent); color: var(--color-accent); }
  .btn-ghost { background: transparent; border: var(--border-subtle) solid var(--color-border-strong); color: var(--color-text-muted); }
}
```

### 6.3 Files to Delete / Consolidate

| File | Action |
|------|--------|
| `marvel-panel-box.css` | **Delete** — replace with new `.panel-box` utility |
| `PartSelectorPanel.css` | **Delete** — inline the `slideInRight` animation into `index.css`; delete `@keyframes scan` |
| `customizer-wrapper.css` | **Audit then delete** — the wildcard `max-width: 100% !important` and `position: absolute !important` rules conflict with new fixed-width panels. Migrate only the rules that still apply in the new layout |
| `laboratory-wrapper.css` | **Audit then delete** — contains the same critical rules as `customizer-wrapper.css`: wildcard `* { max-width: 100% !important }` (line 68), `position: absolute !important` on `.fixed` (line 13), and `transform: scale(0.85)` (line 112). All three rules conflict with the new fixed-width overlay layout and must be removed. Retain only rules that remain applicable after layout migration. |
| `headquarters-override.css` | **Delete** — targets `.marvel-panel-box` which is being removed; all overrides become dead code |

### 6.4 Explicit Deletions in `index.css`

- Old `.btn-primary` definition (orange `#f97316`)
- `@keyframes scan` (scan line animation, line ~317)
- `@keyframes pulse-glow` (line ~185) + `.pulse-glow` class (line ~197)
- `.glass` class definition (replaced by `.panel-surface`)
- `@font-face` declarations for `RefrigeratorDeluxeHeavy`, `RefrigeratorDeluxeBold`
- `.layout-grid`, `.container-archetypes`, `.container-3dviewer`, `.container-3dviewer-box`

### 6.5 Responsive / Mobile

The app is primarily a desktop tool. For the redesign:
- Left sidebar collapses to 52px on `max-width: 768px`
- Right panel reduces to 260px on `max-width: 768px`
- Topbar nav tabs collapse to icons-only on `max-width: 768px`
- Bottom bar stacks to 72px height on `max-width: 480px`
- The existing mobile breakpoints in `index.css` (480px, 768px, 1024px) are preserved and updated

---

## 7. Animations

| Interaction | Animation |
|-------------|-----------|
| Right panel open/close | `transform: translateX(100%)` ↔ 0, 200ms ease |
| Part card hover | `border-color` transition 100ms |
| Part card select | `background + border-color` transition 100ms |
| Tab switch (right panel content) | `opacity: 0→1` crossfade 150ms |
| Speech bubble appear | `scaleY(0)→1` from bottom, 150ms |
| Topbar active tab underline | slide 150ms |
| Submenu open | `transform: translateY(-8px)→0 + opacity:0→1`, 150ms |
| Cart slide in | `transform: translateX(100%)→0`, 250ms ease |

**Removed animations:** scan lines, particle effects, holographic shimmer, `.pulse-glow` animations from panel chrome. Three.js effects (glow, bloom, SSAO) remain untouched inside the viewer canvas.

---

## 8. Scope

### In Scope (Files)
- `index.css` — full restructure (CSS vars, layout, utility classes, font imports)
- `App.tsx` — topbar, layout shell (absolute positioning), viewer container background
- `components/PartSelectorPanel.tsx` — panel + grid (fix pre-existing `setHoveredPartName` bug)
- `components/PartItemCard.tsx` — card visual
- `components/PartCategoryToolbar.tsx` — left sidebar restyling
- `components/CategoryNavigation.tsx` — left sidebar restyling (consolidate with above if equivalent)
- `components/MaterialPanel.tsx` — remove internal tabs, expose as MATERIALS tab content
- `components/LightsPanel.tsx` — restyled as LIGHTING tab content
- `components/materials/SkinsPanel.tsx` — restyled as SKINS tab content
- `components/PowerEffectsPanel.tsx` — restyled as EFFECTS tab content
- `components/StandardShoppingCart.tsx` — cart panel redesign
- `components/TorsoSubmenu.tsx` — restyled
- `components/BeltSubmenu.tsx` — restyled
- `components/LowerBodySubmenu.tsx` — restyled (if exists)
- `components/LeftHandSubmenu.tsx` — restyled (if exists)
- `components/RightHandSubmenu.tsx` — restyled (if exists)
- `components/AuthModal.tsx` — wrapper shell + Supabase appearance color update
- `components/SimpleSignUpModal.tsx` — full restyling
- `components/TestSignUpModal.tsx` — full restyling
- `components/GuestEmailModal.tsx` — full restyling
- `components/PurchaseConfirmation.tsx` — full restyling
- `components/VTTExportModal.tsx` — full restyling
- `components/AiDesignerModal.tsx` — full restyling
- `components/HeaderDropdown.tsx` — restyled
- `components/Header.tsx` — **deleted**, topbar moved inline to App.tsx
- `components/PurchaseLibrary.tsx` — restyled
- `components/UserProfile.tsx` — restyled
- CSS override files — deleted (see Section 6.3)

### Out of Scope (Do NOT Touch)
- `CharacterViewer.tsx` Three.js internals (renderer, camera, model loading, post-processing)
- All business logic (auth state, cart state, pose management, purchase flows, Supabase calls)
- All `lib/` files
- All `hooks/` files
- Backend / Supabase / Stripe integrations
- Export functionality logic
- 3D model files (`/public/models/`)
