import { RPGCharacterSync } from '../types';

export interface VTTTokenExport {
  format: 'png' | 'jpg' | 'webp';
  size: 256 | 512 | 1024;
  background: 'transparent' | 'white' | 'black';
  borderColor: string;
}

export class VTTService {
  private static createGradient(
    ctx: CanvasRenderingContext2D,
    args: [number, number, number, number],
    stops: Array<[number, string]>,
    fallback: string
  ): CanvasGradient | string {
    if (typeof ctx.createLinearGradient !== 'function') {
      return fallback;
    }

    const gradient = ctx.createLinearGradient(...args);
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    return gradient;
  }

  static async exportToken(
    character: RPGCharacterSync,
    options: VTTTokenExport,
    screenshotDataUrl: string,
    shape: 'circle' | 'hex'
  ): Promise<string> {
    if (!screenshotDataUrl) throw new Error('Screenshot data required');
    return this.processImageForToken(screenshotDataUrl, options, shape, character.archetypeId);
  }

  private static processImageForToken(
    screenshotDataUrl: string,
    options: VTTTokenExport,
    shape: 'circle' | 'hex',
    characterName: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Could not get 2D context')); return; }

      const img = new Image();
      img.onload = () => {
        const S = options.size;
        canvas.width = S;
        canvas.height = S;

        const cx = S / 2, cy = S / 2;
        const ringWidth = Math.round(S * 0.10);   // 10% = thick decorative ring
        const outerR = S / 2 - 2;
        const innerR = outerR - ringWidth;

        // --- Background ---
        if (options.background === 'transparent') {
          ctx.clearRect(0, 0, S, S);
        } else {
          ctx.fillStyle = options.background;
          ctx.fillRect(0, 0, S, S);
        }

        // --- Portrait clipped to inner shape ---
        const scale = Math.max(innerR * 2 / img.width, innerR * 2 / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        const sx = cx - sw / 2;
        const sy = cy - sh / 2;

        ctx.save();
        ctx.beginPath();
        this.innerPath(ctx, shape, cx, cy, innerR);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh);
        ctx.restore();

        // --- Name banner (dark strip at bottom, clipped to inner shape) ---
        const bannerH = Math.round(S * 0.20);
        const bannerY = cy + innerR - bannerH;
        ctx.save();
        ctx.beginPath();
        this.innerPath(ctx, shape, cx, cy, innerR);
        ctx.clip();
        const bannerGrad = this.createGradient(
          ctx,
          [0, bannerY, 0, cy + innerR],
          [
            [0, 'rgba(0,0,0,0)'],
            [0.3, 'rgba(0,0,0,0.82)'],
            [1, 'rgba(0,0,0,0.92)'],
          ],
          'rgba(0,0,0,0.92)'
        );
        ctx.fillStyle = bannerGrad;
        ctx.fillRect(cx - innerR, bannerY, innerR * 2, bannerH + 10);

        const fontSize = Math.round(S * 0.072);
        ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(characterName, cx, bannerY + bannerH * 0.58);
        ctx.restore();

        // --- Decorative ring ---
        ctx.save();
        // Main ring fill (solid color)
        ctx.beginPath();
        this.outerPath(ctx, shape, cx, cy, outerR);
        this.innerPath(ctx, shape, cx, cy, innerR);
        ctx.fillStyle = options.borderColor;
        ctx.fill('evenodd');

        // Bevel highlight: top-left lighter
        const highlightGrad = this.createGradient(
          ctx,
          [cx - outerR, cy - outerR, cx + outerR, cy + outerR],
          [
            [0, 'rgba(255,255,255,0.35)'],
            [0.5, 'rgba(255,255,255,0.0)'],
            [1, 'rgba(0,0,0,0.30)'],
          ],
          'rgba(255,255,255,0.15)'
        );
        ctx.beginPath();
        this.outerPath(ctx, shape, cx, cy, outerR);
        this.innerPath(ctx, shape, cx, cy, innerR);
        ctx.fillStyle = highlightGrad;
        ctx.fill('evenodd');

        // Outer edge (dark stroke)
        ctx.beginPath();
        this.outerPath(ctx, shape, cx, cy, outerR);
        ctx.strokeStyle = 'rgba(0,0,0,0.55)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner edge (bright stroke for depth)
        ctx.beginPath();
        this.innerPath(ctx, shape, cx, cy, innerR);
        ctx.strokeStyle = 'rgba(255,255,255,0.30)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        const mimeType = `image/${options.format}`;
        const quality = options.format === 'jpg' ? 0.9 : 1.0;
        try { resolve(canvas.toDataURL(mimeType, quality)); }
        catch (e) { reject(e); }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = screenshotDataUrl;
    });
  }

  private static innerPath(ctx: CanvasRenderingContext2D, shape: 'circle' | 'hex', cx: number, cy: number, r: number) {
    if (shape === 'circle') {
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    } else {
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = cx + r * Math.cos(angle);
        const hy = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    }
  }

  private static outerPath(ctx: CanvasRenderingContext2D, shape: 'circle' | 'hex', cx: number, cy: number, r: number) {
    if (shape === 'circle') {
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    } else {
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = cx + r * Math.cos(angle);
        const hy = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    }
  }
}
