# VTT Token Export Wizard Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing VTTExportModal with a Dark Comics-styled 3-step wizard (Capture → Shape → Settings) that exports the 3D character as a circular or hexagonal token image.

**Architecture:** `VTTExportModal.tsx` is fully rewritten as a self-contained wizard component using CSS custom properties from the Dark Comics design system. `vttService.ts` is slimmed down: character-sheet code removed, hexagon canvas rendering added, `VTTTokenExport` interface updated. `App.tsx` loses the `onExportCharacter` prop call.

**Tech Stack:** React 18 + TypeScript, Vitest + React Testing Library, HTML Canvas (vttService), `CharacterViewerRef.takeTokenScreenshot()`, Dark Comics CSS vars (`--color-accent`, `--font-comic`, `--radius`).

---

## File Structure

| File | Change |
|------|--------|
| `services/vttService.ts` | Remove character-export code; update `VTTTokenExport` interface; add hex shape to `processImageForToken`; update `exportToken` signature |
| `components/VTTExportModal.tsx` | Full rewrite as 3-step Dark Comics wizard |
| `App.tsx` | Remove `onExportCharacter` prop (~line 2085) |
| `tests/VTTExportModal.test.tsx` | New test file |

---

## Chunk 1: vttService cleanup + hex rendering

### Task 1: Update VTTService — slim interface + hex shape

**Files:**
- Modify: `services/vttService.ts`
- Test: `tests/VTTExportModal.test.tsx` (create)

- [ ] **Step 1: Create the test file with a failing test for the updated exportToken signature**

Create `tests/VTTExportModal.test.tsx`:

```tsx
// tests/VTTExportModal.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VTTService } from '../services/vttService';

// Mock canvas for jsdom
beforeEach(() => {
  const ctx = {
    clearRect: vi.fn(), fillRect: vi.fn(), fillStyle: '',
    save: vi.fn(), restore: vi.fn(),
    beginPath: vi.fn(), closePath: vi.fn(), clip: vi.fn(),
    arc: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
    drawImage: vi.fn(), strokeStyle: '', lineWidth: 0, stroke: vi.fn(),
    shadowColor: '', shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0,
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as any);
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,abc123');
});

// Image mock — no `src` field: only the setter, so it fires correctly
const originalImage = globalThis.Image;
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 512;
  height = 512;
  set src(_val: string) { setTimeout(() => this.onload?.(), 0); }
}
beforeEach(() => { globalThis.Image = MockImage as any; });
afterEach(() => { globalThis.Image = originalImage; });

describe('VTTService.exportToken', () => {
  it('accepts shape parameter and returns a data URL', async () => {
    const character = { archetypeId: 'STRONG', calculatedStats: {} } as any;
    const options = { format: 'png' as const, size: 512 as const, background: 'transparent' as const, borderColor: '#f59e0b' };
    const result = await VTTService.exportToken(character, options, 'data:image/png;base64,abc', 'circle');
    expect(result).toMatch(/^data:/);
  });

  it('accepts hex shape parameter without throwing', async () => {
    const character = { archetypeId: 'STRONG', calculatedStats: {} } as any;
    const options = { format: 'png' as const, size: 512 as const, background: 'transparent' as const, borderColor: '#ef4444' };
    await expect(VTTService.exportToken(character, options, 'data:image/png;base64,abc', 'hex')).resolves.toMatch(/^data:/);
  });
});

describe('VTTService interface', () => {
  it('VTTTokenExport has borderColor and no border/shadow fields', () => {
    // Note: Vitest uses esbuild (no type-checking) so these are runtime checks.
    // After Step 3 rewrites vttService.ts, the interface is correct and these pass.
    const options = {
      format: 'png' as const,
      size: 512 as const,
      background: 'transparent' as const,
      borderColor: '#f59e0b',
    };
    expect(options.borderColor).toBe('#f59e0b');
    expect((options as any).shadow).toBeUndefined();
    expect((options as any).border).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the tests — confirm baseline**

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
npx vitest run tests/VTTExportModal.test.tsx
```

> **Note:** These service tests verify the new interface shape and may pass silently against the old code (esbuild has no type-checking, and the old `exportToken` ignores extra args). That's fine — they serve as interface documentation. The genuine red/green TDD cycle happens in Task 2 (modal component tests). Continue to Step 3.

- [ ] **Step 3: Rewrite `services/vttService.ts`**

Replace the entire file with:

```ts
import { RPGCharacterSync } from '../types';

export interface VTTTokenExport {
  format: 'png' | 'jpg' | 'webp';
  size: 256 | 512 | 1024;
  background: 'transparent' | 'white' | 'black';
  borderColor: string;
}

export class VTTService {
  static async exportToken(
    character: RPGCharacterSync,
    options: VTTTokenExport,
    screenshotDataUrl: string,
    shape: 'circle' | 'hex'
  ): Promise<string> {
    if (!screenshotDataUrl) throw new Error('Screenshot data required');
    return this.processImageForToken(screenshotDataUrl, options, shape);
  }

  private static processImageForToken(
    screenshotDataUrl: string,
    options: VTTTokenExport,
    shape: 'circle' | 'hex'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Could not get 2D context')); return; }

      const img = new Image();
      img.onload = () => {
        canvas.width = options.size;
        canvas.height = options.size;

        // Background
        if (options.background === 'transparent') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = options.background;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Image scale/position
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        // Clip mask
        ctx.save();
        ctx.beginPath();
        if (shape === 'circle') {
          ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 4, 0, 2 * Math.PI);
        } else {
          const cx = canvas.width / 2, cy = canvas.height / 2;
          const r = Math.min(cx, cy) - 4;
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const hx = cx + r * Math.cos(angle);
            const hy = cy + r * Math.sin(angle);
            i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
          }
          ctx.closePath();
        }
        ctx.clip();
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        ctx.restore();

        // Border
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

        const mimeType = `image/${options.format}`;
        const quality = options.format === 'jpg' ? 0.9 : 1.0;
        try { resolve(canvas.toDataURL(mimeType, quality)); }
        catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = screenshotDataUrl;
    });
  }
}
```

- [ ] **Step 4: Run the tests — verify they pass**

```bash
npx vitest run tests/VTTExportModal.test.tsx
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

> **Note:** After this commit, `components/VTTExportModal.tsx` will have temporary TypeScript errors (references to removed `border`/`shadow` fields). This is expected — it is fixed in Task 2. Do NOT run `npx tsc --noEmit` until after Task 3.

```bash
cd c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign
git add services/vttService.ts tests/VTTExportModal.test.tsx
git commit -m "feat: slim vttService to token-only with hex shape support"
```

---

## Chunk 2: VTTExportModal wizard rewrite

### Task 2: Rewrite VTTExportModal as a 3-step Dark Comics wizard

**Files:**
- Modify: `components/VTTExportModal.tsx` (full rewrite)
- Test: `tests/VTTExportModal.test.tsx` (extend)

- [ ] **Step 1: Add wizard component tests**

**Part A — Add imports to the TOP of `tests/VTTExportModal.test.tsx`** (after the existing two import lines, before `beforeEach`):

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VTTExportModal from '../components/VTTExportModal';
```

> The `vi` identifier is already available from the vitest import in Task 1 (`import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'`). Do NOT add it again.

**Part B — Append the following describe block to the BOTTOM of the file** (after the existing `VTTService interface` describe block):

```tsx
const mockCharacter = {
  archetypeId: 'STRONG',
  calculatedStats: { power: 80, defense: 70, speed: 60, intelligence: 50, energy: 90, charisma: 40 },
  physicalAttributes: {},
  compatibility: {},
  lastUpdated: '',
  visualEffects: [],
} as any;

const mockRef = {
  current: {
    takeTokenScreenshot: vi.fn().mockResolvedValue('data:image/png;base64,validscreenshot1234567890'),
  },
};

describe('VTTExportModal wizard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders step 1 on open', () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    expect(screen.getByText(/CAPTURA/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <VTTExportModal
        isOpen={false}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls captureScreenshot on open', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => {
      expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled();
    });
  });

  it('SIGUIENTE button is disabled while capturing', () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={{ current: { takeTokenScreenshot: () => new Promise(() => {}) } } as any}
      />
    );
    const btn = screen.getByText(/SIGUIENTE/i);
    expect(btn).toBeDisabled();
  });

  it('advances to step 2 after capture succeeds', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    expect(screen.getByText(/FORMA/i)).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
  });

  it('step 2 shows circle and hex options', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    expect(screen.getByText(/CÍRCULO/i)).toBeInTheDocument();
    expect(screen.getByText(/HEXÁGONO/i)).toBeInTheDocument();
  });

  it('advances to step 3 from step 2', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    fireEvent.click(screen.getAllByText(/SIGUIENTE/i)[0]);
    expect(screen.getByText(/AJUSTES/i)).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 3/i)).toBeInTheDocument();
  });

  it('resets to step 1 when closed and reopened', async () => {
    const { rerender } = render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
    // Close
    rerender(
      <VTTExportModal isOpen={false} onClose={vi.fn()} character={mockCharacter} onExportToken={vi.fn()} />
    );
    // Reopen
    rerender(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <VTTExportModal
        isOpen={true}
        onClose={onClose}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run tests/VTTExportModal.test.tsx
```

Expected: FAIL — old component doesn't match new wizard structure.

- [ ] **Step 3: Rewrite `components/VTTExportModal.tsx`**

Replace the entire file with:

```tsx
import React, { useState, useEffect } from 'react';
import { RPGCharacterSync } from '../types';
import { CharacterViewerRef } from './CharacterViewer';
import { VTTService, VTTTokenExport } from '../services/vttService';

interface VTTExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: RPGCharacterSync;
  onExportToken: (format: string, size: number) => void;
  characterViewerRef?: React.RefObject<CharacterViewerRef | null>;
}

type WizardStep = 1 | 2 | 3;
type TokenShape = 'circle' | 'hex';

const HEX_CLIP = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)';

const BORDER_SWATCHES = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6'];

export default function VTTExportModal({ isOpen, onClose, character, onExportToken, characterViewerRef }: VTTExportModalProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [screenshot, setScreenshot] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState(false);
  const [shape, setShape] = useState<TokenShape>('circle');
  const [tokenOptions, setTokenOptions] = useState<VTTTokenExport & { borderColor: string }>({
    size: 512,
    format: 'png',
    background: 'transparent',
    borderColor: '#f59e0b',
  });
  const [isExporting, setIsExporting] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setScreenshot('');
      setCaptureError(false);
      setIsExporting(false);
    }
  }, [isOpen]);

  // Auto-capture on open
  useEffect(() => {
    if (!isOpen) return;
    captureScreenshot();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const captureScreenshot = async () => {
    const ref = characterViewerRef?.current;
    if (!ref) { setCaptureError(true); return; }
    setIsCapturing(true);
    setCaptureError(false);
    try {
      const fn = ref.takeTokenScreenshot ?? (ref as any).takeScreenshot;
      if (!fn) { setCaptureError(true); return; }
      const shot = await fn.call(ref);
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

  const handleDownload = async () => {
    if (!screenshot) return;
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
  };

  if (!isOpen) return null;

  // --- Shared styles ---
  const surface: React.CSSProperties = { background: 'var(--color-surface)', border: '2px solid var(--color-border-strong)', borderRadius: 'var(--radius)', width: 420, maxWidth: '95vw', overflow: 'hidden' };
  const comicLabel = (extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily: 'var(--font-comic)', letterSpacing: 2, ...extra });
  const btnPrimary: React.CSSProperties = { background: 'var(--color-accent)', border: 'none', borderRadius: 'var(--radius)', padding: '8px 20px', fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 2, color: '#000', fontWeight: 700, cursor: 'pointer' };
  const btnSecondary: React.CSSProperties = { background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '8px 16px', fontFamily: 'var(--font-comic)', fontSize: 11, letterSpacing: 1, color: 'var(--color-text-muted)', cursor: 'pointer' };

  // --- Step indicator ---
  const StepBar = () => (
    <div style={{ display: 'flex', gap: 4, padding: '6px 12px 0' }}>
      {[1, 2, 3].map(n => (
        <div key={n} style={{ flex: 1, height: 3, borderRadius: 1, background: n <= step ? 'var(--color-accent)' : 'var(--color-border)' }} />
      ))}
    </div>
  );

  const stepLabel = ['CAPTURA', 'FORMA', 'AJUSTES'][step - 1];

  // --- Step 1: Capture ---
  const Step1 = () => (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* Preview area */}
      <div style={{ width: 160, height: 160, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {isCapturing && (
          <div style={{ textAlign: 'center' }}>
            <div style={comicLabel({ fontSize: 10, color: 'var(--color-text-faint)' })}>CAPTURANDO...</div>
          </div>
        )}
        {!isCapturing && screenshot && (
          <img src={screenshot} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {!isCapturing && !screenshot && (
          <div style={{ textAlign: 'center', color: captureError ? 'var(--color-text-muted)' : 'var(--color-text-faint)' }}>
            {captureError ? '⚠️' : '🦸'}
            <div style={comicLabel({ fontSize: 9, marginTop: 4, color: 'var(--color-text-faint)' })}>
              {captureError ? 'NO SE PUDO CAPTURAR' : 'LISTO'}
            </div>
          </div>
        )}
      </div>

      {/* Recapture button */}
      <button style={btnSecondary} onClick={captureScreenshot} disabled={isCapturing}>
        ↻ RECAPTURAR
      </button>

      {/* Next */}
      <button
        style={{ ...btnPrimary, width: '100%', opacity: (isCapturing || (!screenshot && !captureError)) ? 0.4 : 1 }}
        disabled={isCapturing || (!screenshot && !captureError)}
        onClick={() => setStep(2)}
      >
        SIGUIENTE →
      </button>
    </div>
  );

  // --- Step 2: Shape ---
  const shapeCardStyle = (selected: boolean): React.CSSProperties => ({
    flex: 1, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
    background: selected ? 'rgba(245,158,11,0.1)' : 'var(--color-surface-2)',
    border: selected ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
  });
  const previewStyle = (s: TokenShape): React.CSSProperties => ({
    width: 64, height: 64, objectFit: 'cover',
    borderRadius: s === 'circle' ? '50%' : undefined,
    clipPath: s === 'hex' ? HEX_CLIP : undefined,
  });

  const Step2 = () => (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {(['circle', 'hex'] as TokenShape[]).map(s => (
          <button key={s} style={shapeCardStyle(shape === s)} onClick={() => setShape(s)}>
            {screenshot
              ? <img src={screenshot} alt={s} style={previewStyle(s)} />
              : <div style={{ width: 64, height: 64, background: 'var(--color-border)', borderRadius: s === 'circle' ? '50%' : undefined, clipPath: s === 'hex' ? HEX_CLIP : undefined }} />
            }
            <span style={comicLabel({ fontSize: 11, color: shape === s ? 'var(--color-accent)' : 'var(--color-text)' })}>
              {s === 'circle' ? 'CÍRCULO' : 'HEXÁGONO'}
            </span>
            <span style={{ fontSize: 9, color: 'var(--color-text-faint)' }}>
              {s === 'circle' ? 'Roll20, Foundry' : 'Hex maps'}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnSecondary} onClick={() => setStep(1)}>← ATRÁS</button>
        <button style={{ ...btnPrimary, flex: 1 }} onClick={() => setStep(3)}>SIGUIENTE →</button>
      </div>
    </div>
  );

  // --- Step 3: Settings + Download ---
  const RadioGroup = ({ label, options, value, onChange }: { label: string; options: { v: string | number; l: string }[]; value: string | number; onChange: (v: any) => void }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={comicLabel({ fontSize: 9, color: 'var(--color-text-faint)', marginBottom: 4 })}>{label}</div>
      <div style={{ display: 'flex', gap: 4 }}>
        {options.map(opt => (
          <button
            key={opt.v}
            onClick={() => onChange(opt.v)}
            style={{
              padding: '4px 10px', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 10,
              fontFamily: 'var(--font-comic)', letterSpacing: 1,
              background: value === opt.v ? 'var(--color-accent)' : 'var(--color-surface-2)',
              color: value === opt.v ? '#000' : 'var(--color-text-muted)',
              border: value === opt.v ? 'none' : '1px solid var(--color-border)',
            }}
          >{opt.l}</button>
        ))}
      </div>
    </div>
  );

  const Step3 = () => (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Mini preview */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {screenshot
          ? <img src={screenshot} alt="token" style={{ ...previewStyle(shape), width: 72, height: 72, boxShadow: `0 0 0 3px ${tokenOptions.borderColor}` }} />
          : <div style={{ width: 72, height: 72, background: 'var(--color-border)', borderRadius: shape === 'circle' ? '50%' : undefined, clipPath: shape === 'hex' ? HEX_CLIP : undefined }} />
        }
      </div>

      <RadioGroup label="TAMAÑO" options={[{ v: 256, l: '256' }, { v: 512, l: '512' }, { v: 1024, l: '1024' }]} value={tokenOptions.size} onChange={v => setTokenOptions(o => ({ ...o, size: v }))} />
      <RadioGroup label="FORMATO" options={[{ v: 'png', l: 'PNG' }, { v: 'jpg', l: 'JPG' }, { v: 'webp', l: 'WebP' }]} value={tokenOptions.format} onChange={v => setTokenOptions(o => ({ ...o, format: v }))} />
      <RadioGroup label="FONDO" options={[{ v: 'transparent', l: 'TRANSPARENTE' }, { v: 'white', l: 'BLANCO' }, { v: 'black', l: 'NEGRO' }]} value={tokenOptions.background} onChange={v => setTokenOptions(o => ({ ...o, background: v }))} />

      {/* Border color */}
      <div>
        <div style={comicLabel({ fontSize: 9, color: 'var(--color-text-faint)', marginBottom: 4 })}>COLOR BORDE</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {BORDER_SWATCHES.map(c => (
            <button
              key={c}
              onClick={() => setTokenOptions(o => ({ ...o, borderColor: c }))}
              style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: tokenOptions.borderColor === c ? '2px solid #fff' : '1px solid transparent', cursor: 'pointer' }}
            />
          ))}
          <input
            type="color"
            value={tokenOptions.borderColor}
            onChange={e => setTokenOptions(o => ({ ...o, borderColor: e.target.value }))}
            style={{ width: 20, height: 20, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button style={btnSecondary} onClick={() => setStep(2)}>← ATRÁS</button>
        <button
          style={{ ...btnPrimary, flex: 1, opacity: isExporting || !screenshot ? 0.5 : 1 }}
          disabled={isExporting || !screenshot}
          onClick={handleDownload}
        >
          {isExporting ? 'GENERANDO...' : '⬇ DESCARGAR TOKEN'}
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={surface}>
        {/* Header */}
        <div className="panel-header">
          <span style={comicLabel({ fontSize: 13 })}>🎯 VTT TOKEN — {step} / 3 — {stepLabel}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#000', opacity: 0.6 }}>✕</button>
        </div>
        <StepBar />

        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npx vitest run tests/VTTExportModal.test.tsx
```

Expected: All tests PASS.

- [ ] **Step 5: Run full test suite — no regressions**

```bash
npx vitest run
```

Expected: All existing tests still pass.

- [ ] **Step 6: Commit**

```bash
git add components/VTTExportModal.tsx tests/VTTExportModal.test.tsx
git commit -m "feat: rewrite VTTExportModal as Dark Comics 3-step wizard"
```

---

## Chunk 3: App.tsx cleanup

### Task 3: Remove `onExportCharacter` from App.tsx

**Files:**
- Modify: `App.tsx:2085-2088`

- [ ] **Step 1: Remove `onExportCharacter` prop**

In `App.tsx` around line 2085, remove the `onExportCharacter` prop block:

```tsx
// BEFORE:
<VTTExportModal
  isOpen={isVTTModalOpen}
  onClose={handleCloseVTTModal}
  character={rpgCharacter}
  onExportToken={(format, size) => {
    // Implementar exportación de token
  }}
  onExportCharacter={(system, format) => {
    // Implementar exportación de personaje
  }}
  characterViewerRef={characterViewerRef}
/>

// AFTER:
<VTTExportModal
  isOpen={isVTTModalOpen}
  onClose={handleCloseVTTModal}
  character={rpgCharacter}
  onExportToken={(format, size) => {
    // no-op
  }}
  characterViewerRef={characterViewerRef}
/>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors related to VTTExportModal or vttService.

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add App.tsx
git commit -m "chore: remove onExportCharacter from VTTExportModal usage"
```

---

## Final verification

- [ ] Start dev server and manually open the VTT modal:
  ```bash
  npm run dev
  ```
  - Click the VTT button (requires `rpgCharacter` to be non-null — may need to be authenticated or have parts selected)
  - Step 1: screenshot auto-captures, "RECAPTURAR" works
  - Step 2: circle and hex previews show correctly
  - Step 3: settings change the mini preview border color; download produces a file named `STRONG_token_circle_512.png`
