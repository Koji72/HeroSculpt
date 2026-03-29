# UI/UX Redesign — Dark Comics Studio Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing amateur-looking hybrid UI with a cohesive Dark Comics Studio aesthetic (black + amber, Bangers font, editorial bold borders, full-screen 3D viewer with overlay panels).

**Architecture:** Full-screen `position:fixed` 3D viewer as background layer with all UI panels as absolute/fixed overlays. CSS custom properties for the entire design system. Layout shell lives in App.tsx directly. No new component files — only restyling of existing ones and deletion of outdated ones.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v4, Three.js, Vite, Supabase. Dev server: `cd c:/Users/david/3dcustomicerdefinitvo && npm run dev`.

**Spec:** `docs/superpowers/specs/2026-03-13-ui-ux-redesign-design.md`

---

## Chunk 1: Foundation — CSS Design System

### Task 1: Delete obsolete CSS files and `CategoryNavigation` component

**Files:**
- Delete: `marvel-panel-box.css`
- Delete: `PartSelectorPanel.css`
- Delete: `customizer-wrapper.css` (after audit)
- Delete: `laboratory-wrapper.css` (after audit)
- Delete: `headquarters-override.css`
- Delete: `components/CategoryNavigation.tsx`

- [ ] **Step 1.1: Audit wrapper CSS files for any rules still needed**

Run grep to find any layout rules in these files that are NOT the problematic wildcard/position overrides:

```bash
cd c:/Users/david/3dcustomicerdefinitvo
grep -n "max-width\|position: absolute !important\|transform: scale\|border-radius\|font-size\|color:" customizer-wrapper.css laboratory-wrapper.css
```

Expected: Find mostly the wildcard rules (`max-width: 100% !important`, `position: absolute !important`, `transform: scale(0.85)`) and perhaps a few innocuous font/color rules. Note any rules NOT in these categories — they may need migrating to `index.css`. In practice, all rules in these files are either made obsolete by the new layout or are harmful overrides that must go.

- [ ] **Step 1.2: Remove imports of deleted CSS files from `main.tsx` or `App.tsx`**

```bash
grep -rn "marvel-panel-box\|PartSelectorPanel.css\|customizer-wrapper\|laboratory-wrapper\|headquarters-override" src/ *.tsx *.ts 2>/dev/null
grep -rn "marvel-panel-box\|PartSelectorPanel.css\|customizer-wrapper\|laboratory-wrapper\|headquarters-override" .
```

For each file found, remove the import line. Typical locations: `main.tsx`, `App.tsx`, `components/PartSelectorPanel.tsx`.

- [ ] **Step 1.3: Remove import of `CategoryNavigation` from `App.tsx`**

```bash
grep -n "CategoryNavigation" App.tsx
```

Remove the import line and any `<CategoryNavigation ... />` JSX usage found.

- [ ] **Step 1.4: Delete the files**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
rm marvel-panel-box.css PartSelectorPanel.css customizer-wrapper.css laboratory-wrapper.css headquarters-override.css
rm components/CategoryNavigation.tsx
```

- [ ] **Step 1.5: Verify TypeScript compiles**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -30
```

Expected: No errors related to deleted files. If errors appear for missing imports, fix them before continuing.

- [ ] **Step 1.6: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add -A
git commit -m "chore: delete obsolete CSS files and CategoryNavigation component"
```

---

### Task 2: Rewrite `index.css` foundation — variables, fonts, resets, layout primitives

**Files:**
- Modify: `index.css` (major restructure of top ~250 lines)

- [ ] **Step 2.1: Read current `index.css` top section to understand what to preserve**

Read lines 1–100 of `index.css` to identify:
- Tailwind import (preserve as-is)
- Font face declarations (remove RefrigeratorDeluxe, keep nothing else)
- `:root` or `*` resets (preserve box-sizing, remove others that conflict)

- [ ] **Step 2.2: Replace the top section of `index.css` with the new foundation**

Replace everything from line 1 up to (and including) the old `.layout-grid` block with:

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Inter:wght@400;600;700&display=swap');

/* ═══════════════════════════════════════════════
   DESIGN SYSTEM TOKENS
   ═══════════════════════════════════════════════ */
:root {
  --color-bg: #0a0a0f;
  --color-surface: #0c0c14;
  --color-surface-2: #13131f;
  --color-border: #1f2937;
  --color-border-strong: #374151;
  --color-accent: #f59e0b;
  --color-accent-dim: rgba(245, 158, 11, 0.13);
  --color-accent-mid: rgba(245, 158, 11, 0.4);
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

/* ═══════════════════════════════════════════════
   GLOBAL RESETS
   ═══════════════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; }

html, body {
  height: 100%;
  overflow: hidden;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

#root {
  height: 100%;
  overflow: hidden;
}

/* ═══════════════════════════════════════════════
   LAYOUT SHELL
   ═══════════════════════════════════════════════ */

/* Full-screen viewer sits behind all UI */
.app-viewer {
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 50% 70%, #2a1f0a, transparent 60%),
    radial-gradient(ellipse at 50% 60%, #1a1520, var(--color-bg) 70%),
    radial-gradient(circle, rgba(245, 158, 11, 0.04) 1px, transparent 1px) 0 0 / 28px 28px;
  background-color: var(--color-bg);
}

/* Topbar */
.app-topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 52px;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: var(--border-strong) solid var(--color-accent);
  display: flex;
  align-items: stretch;
}

/* Left sidebar */
.app-sidebar {
  position: fixed;
  top: 52px; left: 0; bottom: 56px;
  width: 72px;
  z-index: 50;
  background: rgba(10, 10, 15, 0.92);
  border-right: var(--border-strong) solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 8px 6px;
  gap: 4px;
  overflow-y: auto;
}

/* Right panel */
.app-panel {
  position: fixed;
  top: 52px; right: 0; bottom: 56px;
  width: 300px;
  z-index: 50;
  background: var(--color-surface);
  border-left: var(--border-strong) solid var(--color-accent);
  transform: translateX(100%);
  transition: transform 200ms ease;
  display: flex;
  flex-direction: column;
}
.app-panel.open {
  transform: translateX(0);
}

/* Bottom bar */
.app-bottom {
  position: fixed;
  bottom: 0; left: 72px; right: 0;
  height: 56px;
  z-index: 50;
  background: rgba(10, 10, 15, 0.92);
  border-top: var(--border-strong) solid var(--color-border);
  transition: right 200ms ease;
}
body.panel-open .app-bottom {
  right: 300px;
}
```

- [ ] **Step 2.3: Delete obsolete rules from `index.css`**

After the new foundation block, find and delete (use search/replace or manual edit):
- Old `.layout-grid`, `.container-archetypes`, `.container-3dviewer`, `.container-3dviewer-box` rules
- `@font-face` declarations for `RefrigeratorDeluxeHeavy`, `RefrigeratorDeluxeBold`
- Old `.btn-primary` definition (the orange `#f97316` one)
- `@keyframes scan` and `@keyframes pulse-glow`
- `.pulse-glow` class
- `.glass` class (will replace usage with `.panel-surface` in later tasks)

Verify each deletion with:
```bash
grep -n "RefrigeratorDeluxe\|container-3dviewer\|layout-grid\|pulse-glow\|@keyframes scan\|\.glass\s*{" c:/Users/david/3dcustomicerdefinitvo/index.css
```
Expected: No matches remaining.

- [ ] **Step 2.4: Add utility classes in `@layer components` at end of `index.css`**

Append to the end of `index.css`:

```css
/* ═══════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════ */
@layer components {
  /* Typography */
  .comic-title {
    font-family: var(--font-comic);
    letter-spacing: 2px;
  }

  /* Panels */
  .panel-header {
    background: var(--color-accent);
    color: #000;
    font-family: var(--font-comic);
    font-size: 20px;
    letter-spacing: 3px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .panel-box {
    background: var(--color-surface);
    border: var(--border-strong) solid var(--color-accent);
    border-radius: var(--radius);
  }
  .panel-surface {
    background: rgba(10, 10, 15, 0.85);
  }

  /* Buttons */
  .btn-comic {
    font-family: var(--font-comic);
    letter-spacing: 2px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: opacity 0.1s, background 0.1s;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 16px;
  }
  .btn-primary {
    background: var(--color-accent);
    color: #000;
  }
  .btn-primary:hover { opacity: 0.9; }
  .btn-outline {
    background: transparent;
    border: var(--border-normal) solid var(--color-accent);
    color: var(--color-accent);
  }
  .btn-outline:hover {
    background: var(--color-accent-dim);
  }
  .btn-ghost {
    background: transparent;
    border: var(--border-subtle) solid var(--color-border-strong);
    color: var(--color-text-muted);
  }
  .btn-ghost:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
  .btn-danger {
    background: var(--color-danger);
    color: #fff;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--color-bg); }
  ::-webkit-scrollbar-thumb { background: var(--color-accent-mid); border-radius: 2px; }
}
```

- [ ] **Step 2.5: Build check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 TypeScript errors (CSS changes don't affect TypeScript).

- [ ] **Step 2.6: Visual check — start dev server**

```bash
# If not already running:
cd c:/Users/david/3dcustomicerdefinitvo && npm run dev
```

Open http://localhost:5180 (or current port). Expected: App still renders. Visual style will look broken at this point — that's fine. No white screen of death. No console errors about missing files.

- [ ] **Step 2.7: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add index.css
git commit -m "feat: add Dark Comics design system tokens and layout CSS"
```

---

## Chunk 2: Layout Shell — App.tsx Topbar, Viewer, Bottom Bar

### Task 3: Restructure `App.tsx` layout — topbar + viewer container + bottom bar

**Files:**
- Modify: `App.tsx` (JSX layout sections only — do NOT touch state, hooks, or business logic)

- [ ] **Step 3.1: Read the current App.tsx JSX return structure**

Read `App.tsx` to find the current return JSX. Identify:
1. Where `<Header>` is rendered (to replace with new topbar)
2. Where `<CharacterViewer>` is rendered (to wrap with `.app-viewer`)
3. Where bottom controls / pose navigation are rendered

Do NOT read the full component — just scan the return statement structure.

- [ ] **Step 3.2: Read current CharacterViewer usage in App.tsx to identify its props**

```bash
grep -n "CharacterViewer\|characterViewerRef\|selectedParts\|selectedArchetype\|savedPoses\|currentPoseIndex\|onPreviousPose\|onNextPose\|onSelectPose\|onRenamePose\|onSaveAsNew\|characterName\|onCharacterNameChange\|isAuthenticated" c:/Users/david/3dcustomicerdefinitvo/App.tsx | head -30
```

Note the exact prop names and variable names used in the current `<CharacterViewer ... />` JSX — you will need these exact names in the next step. Do NOT modify CharacterViewer.tsx internals.

- [ ] **Step 3.3: Replace the outer layout wrapper in App.tsx return**

The top of the JSX return should become a single `<div className="relative w-full h-full">` with the viewer as the first child:

Replace the outermost layout div (and `<Header />`) so the structure becomes (using the actual prop names identified in Step 3.2):

```tsx
return (
  <div className="relative w-full h-full" style={{ background: 'var(--color-bg)' }}>
    {/* ── 3D VIEWER (full-screen background) ── */}
    <div className="app-viewer">
      <CharacterViewer
        ref={characterViewerRef}
        selectedParts={selectedParts}
        selectedArchetype={selectedArchetype}
        {/* ... keep all existing props unchanged ... */}
      />
    </div>

    {/* ── TOPBAR ── */}
    <header className="app-topbar">
      {/* Task 4 fills this in */}
    </header>

    {/* ── LEFT SIDEBAR ── */}
    <aside className="app-sidebar">
      {/* Task 6 fills this in */}
    </aside>

    {/* ── RIGHT PANEL ── */}
    <div className={`app-panel ${isPanelOpen ? 'open' : ''}`}>
      {/* Task 7 fills this in */}
    </div>

    {/* ── BOTTOM BAR ── */}
    <div className="app-bottom">
      {/* Task 5 fills this in */}
    </div>

    {/* ── MODALS (keep ALL existing modal JSX here — <AuthModal>, <StandardShoppingCart>,
         <PurchaseConfirmation>, <GuestEmailModal>, <VTTExportModal>, <AiDesignerModal>,
         <UserProfile>, <PurchaseLibrary> — with ALL their existing props unchanged.
         Do NOT remove any modal component. Only the outer layout div changes.) ── */}
  </div>
);
```

Note: Keep ALL existing modal JSX in place with their existing props and conditional rendering logic. These will be restyled in Chunk 5 but their positioning and logic stays the same. Add `isPanelOpen` state if it doesn't exist:
```tsx
const [isPanelOpen, setIsPanelOpen] = useState(false);
const [activeTab, setActiveTab] = useState<'parts' | 'materials' | 'skins' | 'effects' | 'lighting'>('parts');
```

Also add `body.panel-open` class management:
```tsx
useEffect(() => {
  document.body.classList.toggle('panel-open', isPanelOpen);
  return () => document.body.classList.remove('panel-open');
}, [isPanelOpen]);
```

- [ ] **Step 3.4: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -30
```

Fix any errors before proceeding.

- [ ] **Step 3.5: Visual check**

Open http://localhost:5180. Expected: 3D viewer fills the screen. Old header is gone. Panels may be invisible/broken — that's fine at this stage. No layout grid lines visible.

- [ ] **Step 3.6: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add App.tsx
git commit -m "feat: restructure App.tsx layout to full-screen viewer with overlay panels"
```

---

### Task 4: Build the topbar in App.tsx

**Files:**
- Modify: `App.tsx` (topbar JSX only)
- Delete: `components/Header.tsx` (after removing its usage)

- [ ] **Step 4.1: Remove `<Header />` import and usage from App.tsx**

```bash
grep -n "Header\|header" c:/Users/david/3dcustomicerdefinitvo/App.tsx | head -10
```

Remove the `import Header from './components/Header'` line and replace `<Header />` usage with the new topbar JSX below.

- [ ] **Step 4.2: Delete `components/Header.tsx`**

```bash
rm c:/Users/david/3dcustomicerdefinitvo/components/Header.tsx
```

- [ ] **Step 4.3: Identify actual save handler and cart handler names in App.tsx**

```bash
grep -n "save\|cart\|Cart\|isCart\|setIsCart\|handleSave\|onSave" c:/Users/david/3dcustomicerdefinitvo/App.tsx | head -20
```

Note the exact function/state names for: (1) save action, (2) cart open state setter. Use these in the JSX below.

- [ ] **Step 4.5: Fill in the topbar JSX in App.tsx**

Replace the empty `<header className="app-topbar">` placeholder with:

```tsx
<header className="app-topbar">
  {/* Logo */}
  <div style={{
    background: 'var(--color-accent)',
    padding: '0 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  }}>
    <span style={{ fontFamily: 'var(--font-comic)', fontSize: '22px', letterSpacing: '2px', color: '#000', lineHeight: 1 }}>
      HERO BUILDER
    </span>
  </div>

  {/* Nav tabs */}
  <nav style={{ display: 'flex', alignItems: 'center', padding: '0 12px', gap: '2px', flex: 1 }}>
    {(['parts', 'materials', 'skins', 'effects', 'lighting'] as const).map((tab) => (
      <button
        key={tab}
        onClick={() => { setActiveTab(tab); setIsPanelOpen(true); }}
        style={{
          padding: '0 14px',
          height: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: activeTab === tab && isPanelOpen ? '3px solid var(--color-accent)' : '3px solid transparent',
          fontFamily: 'var(--font-comic)',
          fontSize: '14px',
          letterSpacing: '1.5px',
          color: activeTab === tab && isPanelOpen ? 'var(--color-accent)' : 'var(--color-text-faint)',
          cursor: 'pointer',
          textTransform: 'uppercase',
          transition: 'color 0.1s, border-color 0.1s',
        }}
      >
        {tab}
      </button>
    ))}
  </nav>

  {/* Right actions */}
  <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', gap: '8px', flexShrink: 0 }}>
    <button
      className="btn-comic btn-outline"
      style={{ fontSize: '13px', padding: '5px 14px' }}
      onClick={handleSave}  {/* replace handleSave with the real save handler identified in Step 4.3 */}
    >
      SAVE
    </button>
    <button
      className="btn-comic btn-outline"
      style={{ fontSize: '13px', padding: '5px 14px', position: 'relative' }}
      onClick={() => setIsCartOpen(true)}  {/* replace setIsCartOpen with the real state setter identified in Step 4.3 */}
    >
      CART
      {cartItemCount > 0 && (
        <span style={{
          position: 'absolute', top: -4, right: -4,
          background: 'var(--color-danger)', color: '#fff',
          fontSize: '9px', fontWeight: 700,
          width: 14, height: 14, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {cartItemCount}
        </span>
      )}
    </button>
    <button
      className="btn-comic btn-primary"
      style={{ fontSize: '14px', padding: '5px 16px' }}
      onClick={() => setIsCartOpen(true)}  {/* same handler */}
    >
      CHECKOUT →
    </button>
    {/* Keep existing user/auth button */}
    <HeaderDropdown />
  </div>
</header>
```

Note: Wire `cartItemCount` to the existing cart state variable in App.tsx. Replace `setIsCartOpen?.(true)` with the actual cart open handler. Keep `<HeaderDropdown />` in place — it will be restyled in Chunk 5.

- [ ] **Step 4.6: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 4.7: Visual check**

Open http://localhost:5180. Expected: Black topbar with `HERO BUILDER` in amber yellow, tab buttons visible, SAVE/CART/CHECKOUT buttons on right.

- [ ] **Step 4.8: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add App.tsx
git rm components/Header.tsx
git commit -m "feat: implement comics-style topbar in App.tsx, delete Header component"
```

---

### Task 5: Build the bottom bar in App.tsx

**Files:**
- Modify: `App.tsx` (bottom bar JSX)

- [ ] **Step 5.1: Find existing pose navigation and view controls in App.tsx**

```bash
grep -n "previousPose\|nextPose\|PreviousPose\|NextPose\|poseIndex\|savedPoses\|setViewAngle\|exportModel\|exportSTL\|handleExport" c:/Users/david/3dcustomicerdefinitvo/App.tsx | head -20
```

Note the exact variable/function names for: (1) go-to-previous-pose handler, (2) go-to-next-pose handler, (3) current pose index state, (4) saved poses array. You will substitute these into the code in Step 5.2.

- [ ] **Step 5.2: Fill in the bottom bar JSX in App.tsx**

Using the variable names identified in Step 5.1, replace the empty `.app-bottom` placeholder. The template below uses placeholder names — substitute the real ones before pasting:

```tsx
<div className="app-bottom" style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
  {/* Pose navigation */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
    <button className="btn-comic btn-ghost" style={{ width: 28, height: 28, padding: 0, fontSize: 12 }}
      onClick={PREV_POSE_HANDLER}>◀</button>
    <span style={{ fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
      POSE {(CURRENT_POSE_INDEX ?? 0) + 1} / {SAVED_POSES_ARRAY?.length ?? 1}
    </span>
    <button className="btn-comic btn-ghost" style={{ width: 28, height: 28, padding: 0, fontSize: 12 }}
      onClick={NEXT_POSE_HANDLER}>▶</button>
  </div>

  <div style={{ width: 1, height: 28, background: 'var(--color-border)' }} />

  {/* View presets */}
  <div style={{ display: 'flex', gap: 4 }}>
    {(['FRONT', 'SIDE', '3/4', 'BACK'] as const).map((label, i) => {
      const angles = [0.5, 0.25, 0.375, 0];
      return (
        <button
          key={label}
          className="btn-comic btn-ghost"
          style={{ fontSize: 11, padding: '3px 8px', letterSpacing: 1 }}
          onClick={() => characterViewerRef.current?.setViewAngle(angles[i])}
        >
          {label}
        </button>
      );
    })}
  </div>

  <div style={{ width: 1, height: 28, background: 'var(--color-border)' }} />

  {/* Export */}
  <div style={{ display: 'flex', gap: 4 }}>
    <button className="btn-comic btn-ghost" style={{ fontSize: 11, padding: '3px 10px', letterSpacing: 1 }}
      onClick={() => characterViewerRef.current?.exportModel()}>
      EXPORT GLB
    </button>
    <button className="btn-comic btn-ghost" style={{ fontSize: 11, padding: '3px 10px', letterSpacing: 1 }}
      onClick={() => characterViewerRef.current?.exportSTL()}>
      EXPORT STL
    </button>
  </div>
</div>
```

- [ ] **Step 5.3: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -30
```

- [ ] **Step 5.4: Visual check**

Open http://localhost:5180. Expected: Bottom bar visible with pose navigation, view buttons, export buttons. The bar expands/contracts correctly when the right panel is opened (test by calling `setIsPanelOpen(true)` via a tab click).

- [ ] **Step 5.5: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add App.tsx
git commit -m "feat: implement comics-style bottom bar with pose nav, view presets, export"
```

---

## Chunk 3: Left Sidebar and Part Cards

### Task 6: Restyle `PartCategoryToolbar.tsx` as the left sidebar

**Files:**
- Modify: `components/PartCategoryToolbar.tsx`

- [ ] **Step 6.1: Read the current `PartCategoryToolbar.tsx`**

Read the full file. Note:
- What props it receives (toggle callbacks, active category, button refs)
- How submenus are anchored (likely via `getBoundingClientRect()` on button refs)
- Current CSS classes used

- [ ] **Step 6.2: Restyle the outer container**

Replace whatever top-level wrapper div/aside the component renders with:

```tsx
<aside className="app-sidebar">
  {/* content — see step 6.3 */}
</aside>
```

Remove any old class names like `part-category-toolbar`, `category-nav`, `glass`, etc. from the wrapper.

- [ ] **Step 6.3: Restyle each category button**

For each category button in the component, replace its className/style with:

```tsx
// Category button — active state driven by existing `activeCategory === cat.id` logic
<button
  key={cat.id}
  ref={buttonRefs?.[cat.id]}
  onClick={() => onCategorySelect(cat.id)}
  style={{
    width: '60px',
    padding: '8px 4px',
    background: activeCategory === cat.id ? 'var(--color-accent-dim)' : 'transparent',
    border: `1.5px solid ${activeCategory === cat.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    transition: 'background 0.1s, border-color 0.1s',
  }}
>
  {/* Icon — preserve whatever icon/image element currently renders in the existing button.
       If the current PartCategoryToolbar already renders an <img>, emoji, or SVG icon
       per category, keep it inside this wrapper div. If there is no icon yet, use a
       colored placeholder div as shown. */}
  <div style={{
    width: 28, height: 28,
    background: activeCategory === cat.id ? 'var(--color-accent-dim)' : 'var(--color-border)',
    borderRadius: 2,
    border: activeCategory === cat.id ? `1px solid var(--color-accent-mid)` : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  }}>
    {/* existing icon/img/svg from original component goes here */}
  </div>
  <span style={{
    fontFamily: 'var(--font-comic)',
    fontSize: 9,
    letterSpacing: '1.5px',
    color: activeCategory === cat.id ? 'var(--color-accent)' : 'var(--color-text-faint)',
    textAlign: 'center',
    textTransform: 'uppercase',
  }}>
    {cat.label || cat.id}
  </span>
</button>
```

Add dividers between category groups (HEAD/TORSO/CAPE | BELT/LEGS/BOOTS | HANDS/SYMBOL):

```tsx
<div style={{ width: '100%', height: 1, background: 'var(--color-border)', margin: '2px 0' }} />
```

- [ ] **Step 6.4: Verify submenu positioning still works**

The submenu components (TorsoSubmenu, BeltSubmenu, etc.) anchor to the button ref positions. Since the sidebar is now `position: fixed`, the `getBoundingClientRect()` values are viewport-relative — this should work correctly. No logic changes needed, just visual verification.

- [ ] **Step 6.5: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6.6: Visual check**

Expected: Left sidebar visible with amber-accented active button, faint border on inactive buttons, Bangers labels.

- [ ] **Step 6.7: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/PartCategoryToolbar.tsx
git commit -m "feat: restyle PartCategoryToolbar as comics left sidebar"
```

---

### Task 7: Wire up left sidebar in App.tsx + build right panel shell

**Files:**
- Modify: `App.tsx` (sidebar + panel wiring)

- [ ] **Step 7.1: Replace sidebar placeholder in App.tsx**

Replace the empty `<aside className="app-sidebar">` with:

```tsx
<aside className="app-sidebar" style={{ display: activeTab === 'parts' ? 'flex' : 'none' }}>
  <PartCategoryToolbar
    {/* ... keep all existing props ... */}
    onCategorySelect={(cat) => {
      setSelectedCategory(cat); // existing handler
      setIsPanelOpen(true);
    }}
  />
</aside>
```

- [ ] **Step 7.2: Identify each panel component's prop signature**

```bash
grep -n "interface.*Props\|Props = {" c:/Users/david/3dcustomicerdefinitvo/components/PartSelectorPanel.tsx c:/Users/david/3dcustomicerdefinitvo/components/MaterialPanel.tsx c:/Users/david/3dcustomicerdefinitvo/components/materials/SkinsPanel.tsx c:/Users/david/3dcustomicerdefinitvo/components/PowerEffectsPanel.tsx c:/Users/david/3dcustomicerdefinitvo/components/LightsPanel.tsx | head -30
```

Then for each component, read its Props type to understand required vs optional props. You will use the exact required prop names in Step 7.3.

Also identify from App.tsx the existing variables/handlers that are currently passed to these components:
```bash
grep -n "PartSelectorPanel\|MaterialPanel\|SkinsPanel\|PowerEffectsPanel\|LightsPanel" c:/Users/david/3dcustomicerdefinitvo/App.tsx | head -20
```

- [ ] **Step 7.3: Build right panel shell in App.tsx**

Replace the empty `.app-panel` placeholder with a panel that switches content by active tab. Use the actual prop names identified in Step 7.2 — do not use placeholder comments for required props:

```tsx
<div className={`app-panel ${isPanelOpen ? 'open' : ''}`}>
  {activeTab === 'parts' && (
    <PartSelectorPanel
      {/* ... keep all existing props ... */}
      onClose={() => setIsPanelOpen(false)}
    />
  )}
  {activeTab === 'materials' && (
    <MaterialPanel
      {/* ... keep all existing props ... */}
      onClose={() => setIsPanelOpen(false)}
    />
  )}
  {activeTab === 'skins' && (
    <SkinsPanel
      {/* ... keep all existing props ... */}
      onClose={() => setIsPanelOpen(false)}
    />
  )}
  {activeTab === 'effects' && (
    <PowerEffectsPanel
      {/* ... keep all existing props ... */}
      onClose={() => setIsPanelOpen(false)}
    />
  )}
  {activeTab === 'lighting' && (
    <LightsPanel
      {/* ... keep all existing props ... */}
      onClose={() => setIsPanelOpen(false)}
    />
  )}
</div>
```

Add necessary imports for any panels not yet imported.

- [ ] **Step 7.3: TypeScript compile check + visual check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -30
```

Open http://localhost:5180. Click a tab in the topbar. Expected: Panel slides in from right. Click another tab. Expected: Panel content changes.

- [ ] **Step 7.4: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add App.tsx
git commit -m "feat: wire sidebar and panel tab system in App.tsx"
```

---

### Task 8: Restyle `PartSelectorPanel.tsx` — panel header, grid, footer

**Files:**
- Modify: `components/PartSelectorPanel.tsx`

- [ ] **Step 8.1: Fix pre-existing TypeScript bugs**

Find and fix the undeclared `setHoveredPartName` / `hoveredPartName` references:

```bash
grep -n "setHoveredPartName\|hoveredPartName\|onHoverName" c:/Users/david/3dcustomicerdefinitvo/components/PartSelectorPanel.tsx
```

For each match:
- Line with `onHoverName={setHoveredPartName}` — remove this prop entirely from the JSX
- Lines reading `hoveredPartName` in JSX — remove the JSX block that renders this value

Verify fix:
```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | grep -i "hovered\|onHoverName"
```
Expected: No errors for these names.

- [ ] **Step 8.2: Find and remove the panel's own wrapper/container styles**

```bash
grep -n "fixed\|absolute\|w-\[400px\]\|w-\[450px\]\|z-\[5\|z-50\|z-40\|glass\|marvel-part\|marvel-panel" c:/Users/david/3dcustomicerdefinitvo/components/PartSelectorPanel.tsx | head -20
```

Remove from the panel's root div:
- Any `position: fixed/absolute` on the panel's root div (line numbers shown by grep above)
- Any `w-[400px]` or `xl:w-[450px]` Tailwind classes
- Any `z-index` classes
- Any `.marvel-part-card`, `.glass`, or `marvel-panel` class references

The panel's root div becomes:
```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
```

- [ ] **Step 8.3: Restyle the panel header**

Find the current panel header (title + close button area) and replace with:

```tsx
<div className="panel-header">
  <span style={{ fontFamily: 'var(--font-comic)', fontSize: 20, letterSpacing: 3 }}>
    {categoryTitle.toUpperCase()}
  </span>
  <button
    onClick={onClose}
    style={{
      background: 'none', border: 'none', cursor: 'pointer',
      fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6,
    }}
  >
    ✕
  </button>
</div>
```

- [ ] **Step 8.4: Restyle the parts grid container**

The grid scroll area:
```tsx
<div style={{
  flex: 1,
  overflowY: 'auto',
  padding: '12px',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '6px',
  alignContent: 'start',
}}>
  {/* PartItemCard components — restyled in Task 9 */}
</div>
```

- [ ] **Step 8.5: Identify the apply/confirm handler and restyle the footer**

```bash
grep -n "onConfirm\|onApply\|onPartSelect\|handleApply\|handleConfirm\|APPLY\|Apply" c:/Users/david/3dcustomicerdefinitvo/components/PartSelectorPanel.tsx | head -10
```

Note the actual prop/handler name used for confirming part selection. Replace in the JSX below accordingly.

Find the current Apply/Confirm button area and replace with:

```tsx
<div style={{ padding: '10px 12px', borderTop: '2px solid var(--color-border)', background: 'var(--color-bg)', flexShrink: 0 }}>
  <button
    className="btn-comic btn-primary"
    style={{ width: '100%', padding: '10px', fontSize: 18, letterSpacing: 3 }}
    onClick={ON_APPLY_HANDLER}  {/* substitute with real handler name from Step 8.5 grep */}
  >
    APPLY SELECTION
  </button>
</div>
```

- [ ] **Step 8.6: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 8.7: Visual check**

Click a category in the topbar. Expected: Panel slides in with amber header showing category name, 3-column grid, amber APPLY button at bottom.

- [ ] **Step 8.8: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/PartSelectorPanel.tsx
git commit -m "feat: restyle PartSelectorPanel with comics aesthetic"
```

---

### Task 9: Restyle `PartItemCard.tsx`

**Files:**
- Modify: `components/PartItemCard.tsx`

- [ ] **Step 9.1: Read the current PartItemCard.tsx**

Identify: current class names, selected/hover states, thumbnail rendering, name/price display location.

- [ ] **Step 9.2: Restyle the card root element**

Replace the card's root div and all class names:

```tsx
<div
  onClick={onClick}
  onMouseEnter={onHover}
  onMouseLeave={onHoverEnd}
  style={{
    aspectRatio: '1',
    background: isSelected ? 'var(--color-accent-dim)' : 'var(--color-surface-2)',
    border: `${isSelected ? 2 : 1.5}px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '4px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.1s, background 0.1s',
  }}
  onMouseOver={(e) => {
    if (!isSelected) {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-accent)';
    }
  }}
  onMouseOut={(e) => {
    if (!isSelected) {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
    }
  }}
>
  {/* Selected checkmark */}
  {isSelected && (
    <span style={{
      position: 'absolute', top: 3, right: 5,
      fontFamily: 'var(--font-comic)', fontSize: 10,
      color: 'var(--color-accent)', fontWeight: 700,
    }}>✓</span>
  )}

  {/* Thumbnail */}
  <div style={{
    width: '100%',
    flex: 1,
    background: isSelected ? 'rgba(245,158,11,0.1)' : 'var(--color-border)',
    borderRadius: 1,
    marginBottom: 4,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {thumbnailUrl ? (
      <img src={thumbnailUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : null}
  </div>

  {/* Name */}
  <span style={{
    fontFamily: 'var(--font-comic)',
    fontSize: 9,
    letterSpacing: '1px',
    color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  }}>
    {name}
  </span>

  {/* Price */}
  {price && (
    <span style={{
      fontFamily: 'var(--font-body)',
      fontSize: 8,
      color: 'var(--color-text-faint)',
      marginTop: 2,
    }}>
      {price}
    </span>
  )}
</div>
```

Note: Replace `isSelected`, `onClick`, `onHover`, `onHoverEnd`, `thumbnailUrl`, `name`, `price` with the actual prop names used in the component.

- [ ] **Step 9.3: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 9.4: Visual check**

Expected: Part cards in the grid show thumbnail + Bangers name + price, with amber border on selected and hover states.

- [ ] **Step 9.5: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/PartItemCard.tsx
git commit -m "feat: restyle PartItemCard with comics aesthetic"
```

---

## Chunk 4: Content Panels

### Task 10: Restyle `MaterialPanel.tsx` — remove internal tab system, expose as MATERIALS content

**Files:**
- Modify: `components/MaterialPanel.tsx`

- [ ] **Step 10.1: Read `MaterialPanel.tsx` structure**

Identify:
- The internal tab state and tab switcher JSX
- Which JSX block corresponds to the "materials" tab (PBR sliders, color pickers, textures)
- The wrapping container classes

- [ ] **Step 10.2: Remove the internal tab switcher**

Delete the tab navigation UI (the buttons/tabs that switch between skins/materials/lights/effects/powers/save). Keep only the "materials" + "textures" + "save" content blocks. The other tabs (skins, lights, effects, powers) are now rendered by their own components in the topbar tab system.

- [ ] **Step 10.3: Apply panel wrapper styling**

The component's root div:
```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
  <div className="panel-header">
    <span>MATERIALS</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
  </div>
  <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
    {/* keep existing PBR controls, color pickers, texture controls, save/load */}
  </div>
</div>
```

- [ ] **Step 10.4: Restyle internal controls to match design system**

Within the kept content:
- Replace `#fbbf24` with `var(--color-accent)`
- Replace `.glass` classes with `.panel-surface`
- Replace rounded buttons with `.btn-comic` classes
- Replace `RefrigeratorDeluxe` font references with `var(--font-comic)`
- Replace any `marvel-*` class names with design system equivalents

Run:
```bash
grep -n "fbbf24\|RefrigeratorDeluxe\|marvel-\|\.glass" c:/Users/david/3dcustomicerdefinitvo/components/MaterialPanel.tsx
```
Fix all matches.

- [ ] **Step 10.5: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 10.6: Visual check**

Click MATERIALS tab in topbar. Expected: Panel slides in with amber header "MATERIALS", PBR controls visible, no internal tabs.

- [ ] **Step 10.7: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/MaterialPanel.tsx
git commit -m "feat: restyle MaterialPanel, remove internal tabs, expose as MATERIALS tab"
```

---

### Task 11: Restyle `SkinsPanel.tsx`, `LightsPanel.tsx`, `PowerEffectsPanel.tsx`

**Files:**
- Modify: `components/materials/SkinsPanel.tsx`
- Modify: `components/LightsPanel.tsx`
- Modify: `components/PowerEffectsPanel.tsx`

Each panel gets the same treatment: panel-header + scrollable content + design system colors.

- [ ] **Step 11.1: Restyle `SkinsPanel.tsx`**

First, audit old-style references:
```bash
grep -n "fbbf24\|RefrigeratorDeluxe\|marvel-\|\.glass\b\|rounded-\|#f97316" c:/Users/david/3dcustomicerdefinitvo/components/materials/SkinsPanel.tsx
```

Apply panel wrapper pattern:
```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <div className="panel-header">
    <span>SKINS</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
  </div>
  <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
    {/* existing skin preset grid — restyle cards to match PartItemCard pattern */}
  </div>
</div>
```

Replace `#fbbf24` → `var(--color-accent)`, `.glass` → `.panel-surface`, rounded corners → `var(--radius)`.

- [ ] **Step 11.2: Restyle `LightsPanel.tsx`**

First, audit:
```bash
grep -n "fbbf24\|RefrigeratorDeluxe\|marvel-\|\.glass\b\|rounded-\|#f97316" c:/Users/david/3dcustomicerdefinitvo/components/LightsPanel.tsx
```

Same pattern with title "LIGHTING". Keep existing lighting preset logic, just restyle containers and buttons.

- [ ] **Step 11.3: Restyle `PowerEffectsPanel.tsx`**

First, audit:
```bash
grep -n "fbbf24\|RefrigeratorDeluxe\|marvel-\|\.glass\b\|rounded-\|#f97316" c:/Users/david/3dcustomicerdefinitvo/components/PowerEffectsPanel.tsx
```

Same pattern with title "EFFECTS". Keep existing effects logic, just restyle.

- [ ] **Step 11.4: TypeScript compile check for all three**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 11.5: Visual check all three tabs**

Click SKINS, EFFECTS, LIGHTING tabs. Each should show amber header + content.

- [ ] **Step 11.6: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/materials/SkinsPanel.tsx components/LightsPanel.tsx components/PowerEffectsPanel.tsx
git commit -m "feat: restyle SkinsPanel, LightsPanel, PowerEffectsPanel with comics aesthetic"
```

---

## Chunk 5: Modals, Cart, and Secondary Components

### Task 12: Restyle `StandardShoppingCart.tsx`

**Files:**
- Modify: `components/StandardShoppingCart.tsx`

- [ ] **Step 12.1: Read current cart component structure**

Identify: open/close mechanism, line items rendering, total, checkout button.

- [ ] **Step 12.2: Restyle cart wrapper**

The cart slides in from the right over everything. Its container:
```tsx
<div style={{
  position: 'fixed',
  top: 0, right: 0, bottom: 0,
  width: 340,
  background: 'var(--color-surface)',
  borderLeft: '3px solid var(--color-accent)',
  transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
  transition: 'transform 250ms ease',
  zIndex: 200,
  display: 'flex',
  flexDirection: 'column',
}}>
  <div className="panel-header">
    <span>CART ({itemCount})</span>
    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
  </div>
  {/* line items */}
  <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
    {/* keep existing line item rendering, update styles */}
  </div>
  {/* total + checkout */}
  <div style={{ padding: '12px', borderTop: '2px solid var(--color-border)' }}>
    <div style={{ fontFamily: 'var(--font-comic)', fontSize: 20, letterSpacing: 2, color: 'var(--color-accent)', marginBottom: 10 }}>
      TOTAL: ${total.toFixed(2)}
    </div>
    <button className="btn-comic btn-primary" style={{ width: '100%', padding: '12px', fontSize: 18, letterSpacing: 3 }}>
      CHECKOUT →
    </button>
  </div>
</div>
```

- [ ] **Step 12.3: TypeScript compile check + visual check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

Open cart. Expected: Slides in from right, amber header "CART (N)", amber total, amber checkout button.

- [ ] **Step 12.4: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/StandardShoppingCart.tsx
git commit -m "feat: restyle StandardShoppingCart with comics aesthetic"
```

---

### Task 13: Restyle all modals — shared pattern

**Files:**
- Modify: `components/AuthModal.tsx`
- Modify: `components/SimpleSignUpModal.tsx`
- Modify: `components/GuestEmailModal.tsx`
- Modify: `components/PurchaseConfirmation.tsx`
- Modify: `components/VTTExportModal.tsx`
- Modify: `components/AiDesignerModal.tsx`
- Modify: `components/UserProfile.tsx`
- Modify: `components/PurchaseLibrary.tsx`

All modals use the same outer shell pattern. Apply to each:

- [ ] **Step 13.1: Create the shared modal shell pattern**

Every modal's outer wrapper becomes:
```tsx
{/* Backdrop */}
<div
  style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  onClick={(e) => e.target === e.currentTarget && onClose()}
>
  {/* Modal box */}
  <div className="panel-box" style={{ width: 420, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 301 }}>
    <div className="panel-header">
      <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>MODAL_TITLE</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
    </div>
    <div style={{ padding: '16px', overflowY: 'auto', flex: 1, background: 'var(--color-surface)' }}>
      {/* modal content */}
    </div>
  </div>
</div>
```

- [ ] **Step 13.2: Apply to `GuestEmailModal.tsx`** (simplest modal, start here)

Replace outer wrapper with the pattern above (title: "ADD EMAIL"). Keep form content, update form inputs and button:
```tsx
<input style={{ width: '100%', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)' }} ... />
<button className="btn-comic btn-primary" style={{ width: '100%', padding: '10px', fontSize: 16, letterSpacing: 2, marginTop: 12 }}>CONTINUE</button>
```

- [ ] **Step 13.3: Apply to `SimpleSignUpModal.tsx`**

Title: "CREATE ACCOUNT". Same input/button pattern. Keep all form validation logic.

- [ ] **Step 13.3b: Apply to `TestSignUpModal.tsx`**

Title: "TEST SIGNUP". Same shell pattern. Keep all existing logic.

- [ ] **Step 13.4: Apply to `AuthModal.tsx`**

Title: "SIGN IN". For the Supabase Auth UI interior, update the `appearance` prop colors:
```tsx
appearance={{
  theme: ThemeSupa,
  variables: {
    default: {
      colors: {
        brand: '#f59e0b',
        brandAccent: '#d97706',
        inputBackground: '#13131f',
        inputBorder: '#374151',
        inputText: '#e2e8f0',
        inputPlaceholder: '#6b7280',
        messageText: '#9ca3af',
        anchorTextColor: '#f59e0b',
        defaultButtonBackground: '#13131f',
        defaultButtonBackgroundHover: '#1f2937',
      }
    }
  }
}}
```

- [ ] **Step 13.5: Apply to `PurchaseConfirmation.tsx` and `VTTExportModal.tsx`**

Same shell pattern. Titles: "ORDER CONFIRMED" and "VTT EXPORT". Keep all business logic untouched.

- [ ] **Step 13.5b: Read and apply to `AiDesignerModal.tsx`**

This modal may be more complex. Read it first:
```bash
wc -l c:/Users/david/3dcustomicerdefinitvo/components/AiDesignerModal.tsx
grep -n "function\|return\|className\|style=" c:/Users/david/3dcustomicerdefinitvo/components/AiDesignerModal.tsx | head -30
```

Apply the same amber-header shell. Title: "AI DESIGNER". Keep all AI/generation logic. Update only the visual wrapper, inputs, and buttons to match the design system.

- [ ] **Step 13.6: Apply to `UserProfile.tsx` and `PurchaseLibrary.tsx`**

Same shell pattern for the user-facing panels. These may be wider (500–600px) — adjust width as needed.

- [ ] **Step 13.7: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -30
```

Fix all errors.

- [ ] **Step 13.8: Visual check — open each modal**

Verify each modal has amber header, dark body, consistent styling.

- [ ] **Step 13.9: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/AuthModal.tsx components/SimpleSignUpModal.tsx components/TestSignUpModal.tsx components/GuestEmailModal.tsx components/PurchaseConfirmation.tsx components/VTTExportModal.tsx components/AiDesignerModal.tsx components/UserProfile.tsx components/PurchaseLibrary.tsx
git commit -m "feat: restyle all modals with comics amber-header pattern"
```

---

### Task 14: Restyle `HeaderDropdown.tsx`

**Files:**
- Modify: `components/HeaderDropdown.tsx`

- [ ] **Step 14.1: Read and restyle the dropdown**

```bash
cat c:/Users/david/3dcustomicerdefinitvo/components/HeaderDropdown.tsx
```

Replace dropdown container:
```tsx
<div style={{
  position: 'absolute',
  top: '100%',
  right: 0,
  background: 'var(--color-surface)',
  border: '2px solid var(--color-border-strong)',
  borderRadius: 'var(--radius)',
  minWidth: 180,
  zIndex: 200,
  overflow: 'hidden',
}}>
```

Menu items:
```tsx
<button style={{
  width: '100%',
  padding: '10px 14px',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  textAlign: 'left',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  transition: 'color 0.1s',
}}
onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
>
```

- [ ] **Step 14.2: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

Fix any errors before proceeding.

- [ ] **Step 14.3: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/HeaderDropdown.tsx
git commit -m "feat: restyle HeaderDropdown with comics aesthetic"
```

---

## Chunk 6: Submenus and Polish

### Task 15: Restyle all submenu components

**Files:**
- Modify: `components/TorsoSubmenu.tsx`
- Modify: `components/BeltSubmenu.tsx`
- Modify: `components/LowerBodySubmenu.tsx` (if exists)
- Modify: `components/LeftHandSubmenu.tsx` (if exists)
- Modify: `components/RightHandSubmenu.tsx` (if exists)

- [ ] **Step 15.1: Check which submenu files exist**

```bash
ls c:/Users/david/3dcustomicerdefinitvo/components/*Submenu* c:/Users/david/3dcustomicerdefinitvo/components/*submenu* 2>/dev/null
```

- [ ] **Step 15.2: Apply shared submenu restyle pattern to each**

Each submenu popup:
```tsx
<div style={{
  position: 'fixed', // keep existing positioning logic
  background: 'var(--color-surface)',
  border: '2px solid var(--color-accent)',
  borderRadius: 'var(--radius)',
  padding: '8px',
  zIndex: 150,
  minWidth: 140,
  animation: 'submenuAppear 150ms ease',
}}>
  {/* Sub-category buttons */}
  <button style={{
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
  }}>
    {label}
  </button>
</div>
```

Add to `index.css`:
```css
@keyframes submenuAppear {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Remove all `#fbbf24`, `RefrigeratorDeluxe`, and `marvel-*` class references from each submenu file.

- [ ] **Step 15.3: TypeScript compile check**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 15.4: Visual check — test each submenu**

Click category buttons that have submenus (Torso, Belt, Hands). Expected: Small amber-bordered popup appears with Bangers labels.

- [ ] **Step 15.5: Commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add components/TorsoSubmenu.tsx components/BeltSubmenu.tsx
git add components/*Submenu*.tsx 2>/dev/null || true
git commit -m "feat: restyle all submenu components with comics aesthetic"
```

---

### Task 16: Global cleanup — replace remaining `glass`, `#fbbf24`, `RefrigeratorDeluxe` references

**Files:**
- Search all `.tsx` files

- [ ] **Step 16.1: Find all remaining old-style references**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
grep -rn "fbbf24\|RefrigeratorDeluxe\|marvel-\|\.glass\b\|pulse-glow\|f97316" components/ App.tsx --include="*.tsx" --include="*.ts" --include="*.css"
```

- [ ] **Step 16.2: Fix each reference**

For each match:
- `#fbbf24` → `var(--color-accent)` (or `#f59e0b` in inline styles)
- `RefrigeratorDeluxe` font → `var(--font-comic)`
- `className="glass"` → `className="panel-surface"`
- `marvel-*` class → remove or replace with design system class
- `pulse-glow` → remove

- [ ] **Step 16.3: Final TypeScript build**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npx tsc --noEmit 2>&1
```

Expected: 0 errors.

- [ ] **Step 16.4: Full production build**

```bash
cd c:/Users/david/3dcustomicerdefinitvo && npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no errors. Bundle size similar to before.

- [ ] **Step 16.5: Final visual walkthrough**

Open http://localhost:5180. Check:
- [ ] Topbar: black + amber logo, tabs, buttons
- [ ] 3D viewer: fills full screen, halftone dot background visible
- [ ] Left sidebar: amber active state on selected category
- [ ] Right panel: slides in with amber header, 3-column part grid
- [ ] Part cards: sharp 2px corners, amber selected state
- [ ] Bottom bar: pose nav + view buttons + export
- [ ] Cart: slides from right, amber header
- [ ] Sign in modal: amber header, dark form, amber Supabase colors
- [ ] Submenus: amber-bordered popup with Bangers labels
- [ ] No `.glass` blur artifacts
- [ ] No Refrigerator font visible anywhere
- [ ] No orange `#f97316` accent color visible anywhere

- [ ] **Step 16.6: Final commit**

```bash
cd c:/Users/david/3dcustomicerdefinitvo
git add -A
git commit -m "feat: complete Dark Comics Studio UI/UX redesign

- Full design system with CSS custom properties
- Comics aesthetic: black + amber, Bangers font, sharp 2px borders
- Full-screen 3D viewer with overlay panels
- Topbar with tab navigation
- Left sidebar with category icons
- Sliding right panel system (300px)
- Restyled all part cards, panels, modals, cart, submenus
- Removed obsolete CSS files and CategoryNavigation"
```
