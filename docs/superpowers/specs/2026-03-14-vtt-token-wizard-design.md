# VTT Token Export Wizard — Design Spec

**Goal:** Replace the existing `VTTExportModal` with a focused 3-step wizard that exports the 3D character as a VTT token image (circle or hexagon), styled entirely with the Dark Comics design system.

**Architecture:** A single `VTTExportModal` component rewritten as a self-contained wizard. `vttService.ts` gains a hexagon rendering path and loses all character-sheet code. No new files needed.

**Tech Stack:** React 18 + TypeScript, Dark Comics CSS custom properties, HTML Canvas (existing vttService pattern), `CharacterViewerRef.takeTokenScreenshot()`.

---

## Scope

**In scope:**
- Full rewrite of `VTTExportModal.tsx` as a 3-step Dark Comics wizard
- Add hexagon mask to `VTTService.processImageForToken`
- Remove `VTTCharacterExport` tab and all character-sheet logic from the modal
- Remove `Card` and `Button` UI component imports (replace with inline Dark Comics styles)
- Fix screenshot capture: auto-capture on open, single "Recapturar" button, no debug button

**Out of scope:**
- Character sheet / stat export
- New VTT systems
- Zoom/pan in preview (removed for simplicity)
- Shapes: square, shield (future)

---

## Component: VTTExportModal

### Props
```ts
interface VTTExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: RPGCharacterSync;
  onExportToken: (format: string, size: number) => void;
  characterViewerRef?: React.RefObject<CharacterViewerRef | null>; // was `any`, now typed correctly
}
```
`onExportCharacter` prop is removed (character sheet gone). `onExportToken` is kept but its App.tsx implementation is a no-op — the spec just requires calling it after a successful download.

### Wizard State
```ts
type WizardStep = 1 | 2 | 3;

const [step, setStep] = useState<WizardStep>(1);
const [screenshot, setScreenshot] = useState<string>('');
const [isCapturing, setIsCapturing] = useState(false);
const [captureError, setCaptureError] = useState(false);
const [shape, setShape] = useState<'circle' | 'hex'>('circle');
const [tokenOptions, setTokenOptions] = useState({
  size: 512 as 256 | 512 | 1024,
  format: 'png' as 'png' | 'jpg' | 'webp',
  background: 'transparent' as 'transparent' | 'white' | 'black',
  borderColor: '#f59e0b',
});
const [isExporting, setIsExporting] = useState(false);
```

**Reset on close:** When `isOpen` becomes `false`, reset `step` to 1 and clear `screenshot`, `captureError`, `isExporting`.

```ts
useEffect(() => {
  if (!isOpen) {
    setStep(1);
    setScreenshot('');
    setCaptureError(false);
    setIsExporting(false);
  }
}, [isOpen]);
```

### Step 1 — Captura

**Auto-capture pattern** (no setTimeout, no double-fire):
```ts
useEffect(() => {
  if (!isOpen) return;
  captureScreenshot();
}, [isOpen]); // only re-runs when isOpen changes
```

`captureScreenshot` implementation:
```ts
const captureScreenshot = async () => {
  if (!characterViewerRef?.current) { setCaptureError(true); return; }
  setIsCapturing(true);
  setCaptureError(false);
  try {
    const fn = characterViewerRef.current.takeTokenScreenshot
      ?? characterViewerRef.current.takeScreenshot;
    const shot = await fn();
    if (shot && shot.length > 1000 && !shot.includes('data:image/svg+xml')) {
      setScreenshot(shot);
    } else {
      setCaptureError(true);
    }
  } catch {
    setCaptureError(true);
  } finally {
    setIsCapturing(false);
  }
};
```

**UI:**
- While capturing: spinner + "CAPTURANDO..." text
- On success: `<img>` with the screenshot, rounded to match chosen shape preview
- On error: dark panel with ⚠️ icon and "No se pudo capturar el modelo"
- "↻ RECAPTURAR" button always visible
- "SIGUIENTE →" disabled while `isCapturing || (!screenshot && !captureError)` — allow proceeding even on error so user isn't stuck

### Step 2 — Forma

Two selectable cards (full width, side by side):

**Circle card:** preview `<img>` with `border-radius: 50%`
**Hex card:** preview `<img>` with:
```css
clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)
```
This pointy-top hexagon matches the canvas rendering math (`Math.PI / 3 * i - Math.PI / 6`).

Selected card: `border: 2px solid var(--color-accent)`, background `rgba(245,158,11,0.1)`.
Unselected card: `border: 1px solid var(--color-border)`.

"← ATRÁS" and "SIGUIENTE →" buttons.

### Step 3 — Ajustes + Descarga

**Mini preview** (64×64 `<img>`):
- Circle: `border-radius: 50%`
- Hex: `clip-path: polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)`
- Border rendered via `box-shadow: 0 0 0 3px ${tokenOptions.borderColor}`

**Settings (inline radio-style buttons, Dark Comics):**

Tamaño:
```
[ 256 ] [ 512 ✓ ] [ 1024 ]
```

Formato:
```
[ PNG ✓ ] [ JPG ] [ WebP ]
```

Fondo:
```
[ Transparente ✓ ] [ Blanco ] [ Negro ]
```

Color borde — 5 swatches + custom:
- `#f59e0b` (yellow, default), `#ef4444` (red), `#3b82f6` (blue), `#10b981` (green), `#8b5cf6` (purple)
- `<input type="color">` for custom color

**Download button:**
- Label: `⬇ DESCARGAR TOKEN`
- While `isExporting`: disabled + label `GENERANDO...`
- On click:
  ```ts
  setIsExporting(true);
  try {
    const tokenImage = await VTTService.exportToken(character, tokenOptions, screenshot, shape);
    const link = document.createElement('a');
    link.href = tokenImage;
    link.download = `${character.archetypeId}_token_${shape}_${tokenOptions.size}.${tokenOptions.format}`;
    link.click();
    onExportToken(tokenOptions.format, tokenOptions.size);
  } finally {
    setIsExporting(false);
  }
  ```

"← ATRÁS" button.

### Step Indicator (all steps)

Header area for all 3 steps:
```
[═══════════════════════] ← yellow bar (panel-header class)
[██] [▒▒] [  ]           ← 3 progress segments, filled up to current step
 1 / 3 — CAPTURA         ← step label
```

Progress segment filled = `background: var(--color-accent)`, unfilled = `background: var(--color-border)`.

---

## Service: vttService.ts

### Updated `VTTTokenExport` interface
```ts
export interface VTTTokenExport {
  format: 'png' | 'jpg' | 'webp';
  size: 256 | 512 | 1024;
  background: 'transparent' | 'white' | 'black';
  borderColor: string; // replaces `border: boolean` and removes `shadow: boolean`
}
```
`shadow` field is removed. The canvas rendering no longer applies a drop shadow.

### Updated `exportToken` signature
```ts
static async exportToken(
  character: RPGCharacterSync,
  options: VTTTokenExport,
  screenshotDataUrl: string,
  shape: 'circle' | 'hex'
): Promise<string>
```
The `transform?: VTTPreviewTransform` parameter is removed along with `processImageWithZoom`.

### Updated `processImageForToken` signature
```ts
private static async processImageForToken(
  screenshotDataUrl: string,
  options: VTTTokenExport,
  shape: 'circle' | 'hex'
): Promise<string>
```

**Circle path** (existing, unchanged except remove shadow block):
```ts
ctx.save();
ctx.beginPath();
ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 4, 0, 2 * Math.PI);
ctx.clip();
ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
ctx.restore();
```

**Hex path** (new):
```ts
ctx.save();
ctx.beginPath();
const cx = canvas.width / 2, cy = canvas.height / 2;
const r = Math.min(cx, cy) - 4;
for (let i = 0; i < 6; i++) {
  const angle = (Math.PI / 3) * i - Math.PI / 6;
  const hx = cx + r * Math.cos(angle);
  const hy = cy + r * Math.sin(angle);
  i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
}
ctx.closePath();
ctx.clip();
ctx.drawImage(img, x, y, scaledWidth, scaledHeight); // x, y from outer scope (image positioning)
ctx.restore();
```

**Border rendering** (both shapes, after restore):
```ts
if (options.borderColor) {
  ctx.strokeStyle = options.borderColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 2, 0, 2 * Math.PI);
  } else {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const r = Math.min(cx, cy) - 2;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const bx = cx + r * Math.cos(angle);
      const by = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(bx, by) : ctx.lineTo(bx, by);
    }
    ctx.closePath();
  }
  ctx.stroke();
}
```

### Methods to remove
- `VTTCharacterExport` interface
- `exportCharacter`
- `generateCharacterData`
- `generateRoll20Attributes`
- `generateRoll20Abilities`
- `generateRoll20Equipment`
- `generateFoundryData`
- `generateFoundryItems`
- `generateFoundryFlags`
- `generateFantasyGroundsXML`
- `getSupportedSystems`
- `processImageWithZoom`
- `VTTPreviewTransform` interface
- `getSupportedTokenFormats` — remove (Step 3 uses hardcoded radio buttons)
- `getSupportedTokenSizes` — remove (Step 3 uses hardcoded radio buttons)

---

## Dark Comics Styling Rules

All styles use inline style objects with CSS custom properties:
- Surfaces: `var(--color-surface)`, `var(--color-surface-2)`
- Borders: `var(--color-border)`, `var(--color-border-strong)`
- Accent: `var(--color-accent)` = `#f59e0b`
- Text: `var(--color-text)`, `var(--color-text-muted)`, `var(--color-text-faint)`
- Font: `var(--font-comic)` = Bangers for labels/headers; system font for body text
- Radius: `var(--radius)` = 2px
- No Tailwind classes (`bg-slate-*`, `text-white`, `rounded-lg`, etc.)
- No `Card` or `Button` component imports

---

## App.tsx Changes

In the `<VTTExportModal>` render (around line 2077):
- Remove `onExportCharacter` prop
- `onExportToken` stays but its callback body remains a no-op comment

---

## File Summary

| File | Action |
|------|--------|
| `components/VTTExportModal.tsx` | Full rewrite |
| `services/vttService.ts` | Remove character export + helpers; add hex shape; update interfaces |
| `App.tsx` | Remove `onExportCharacter` prop from VTTExportModal usage |
