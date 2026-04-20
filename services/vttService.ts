import { RPGCharacterSync, ArchetypeStats } from '../types';

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
    shape: 'circle' | 'hex',
    heroName?: string,
    calculatedStats?: ArchetypeStats
  ): Promise<string> {
    if (!screenshotDataUrl) throw new Error('Screenshot data required');
    const displayName = heroName && heroName.trim() ? heroName.trim() : character.archetypeId;
    return this.processImageForToken(screenshotDataUrl, options, shape, displayName, calculatedStats ?? character.calculatedStats);
  }

  private static processImageForToken(
    screenshotDataUrl: string,
    options: VTTTokenExport,
    shape: 'circle' | 'hex',
    characterName: string,
    stats: ArchetypeStats
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

        // --- Portrait clipped to inner shape (shifted up 8% to center character better) ---
        const scale = Math.max(innerR * 2 / img.width, innerR * 2 / img.height);
        const sw = img.width * scale;
        const sh = img.height * scale;
        const sx = cx - sw / 2;
        const sy = cy - sh / 2 - Math.round(S * 0.08);

        ctx.save();
        ctx.beginPath();
        this.innerPath(ctx, shape, cx, cy, innerR);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh);
        ctx.restore();

        // --- Name banner (dark strip at bottom, clipped to inner shape) ---
        const bannerH = Math.round(S * 0.22);
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
            [0.25, 'rgba(0,0,0,0.88)'],
            [1, 'rgba(0,0,0,0.97)'],
          ],
          'rgba(0,0,0,0.95)'
        );
        ctx.fillStyle = bannerGrad;
        ctx.fillRect(cx - innerR, bannerY, innerR * 2, bannerH + 10);

        // Auto-shrink name font to fit within the inner chord width at banner height
        const maxNameW = innerR * 1.7;
        let fontSize = Math.round(S * 0.072);
        const minFontSize = Math.max(8, Math.round(S * 0.035));
        ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
        // Shrink until fits
        while (fontSize > minFontSize && ctx.measureText(characterName).width > maxNameW) {
          fontSize -= 1;
          ctx.font = `900 ${fontSize}px 'Arial Black', Arial, sans-serif`;
        }
        // Truncate with ellipsis if still too wide
        let displayName = characterName;
        if (ctx.measureText(displayName).width > maxNameW) {
          while (displayName.length > 1 && ctx.measureText(displayName + '…').width > maxNameW) {
            displayName = displayName.slice(0, -1);
          }
          displayName = displayName + '…';
        }
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayName, cx, bannerY + bannerH * 0.60);
        ctx.restore();

        // --- Stats badges (Power, Defense, Speed) ---
        ctx.save();
        ctx.beginPath();
        this.innerPath(ctx, shape, cx, cy, innerR);
        ctx.clip();

        const badgeStats: Array<{ label: string; value: number; color: string }> = [
          { label: 'PWR', value: stats.power,   color: '#f59e0b' },
          { label: 'DEF', value: stats.defense, color: '#3b82f6' },
          { label: 'SPD', value: stats.speed,   color: '#10b981' },
        ];
        const badgeFontSize = Math.max(8, Math.round(S * 0.044));
        const badgeH = Math.round(badgeFontSize * 1.6);
        const badgeGap = Math.round(S * 0.018);
        const badgeW = Math.round(innerR * 0.50);
        const totalBadgesW = badgeStats.length * badgeW + (badgeStats.length - 1) * badgeGap;
        const badgeY = bannerY - badgeH - Math.round(S * 0.02);
        let badgeX = cx - totalBadgesW / 2;

        for (const badge of badgeStats) {
          const r2 = badgeH / 2;
          // Draw pill path helper
          const drawPill = () => {
            ctx.beginPath();
            ctx.moveTo(badgeX + r2, badgeY);
            ctx.lineTo(badgeX + badgeW - r2, badgeY);
            ctx.arc(badgeX + badgeW - r2, badgeY + r2, r2, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(badgeX + r2, badgeY + badgeH);
            ctx.arc(badgeX + r2, badgeY + r2, r2, Math.PI / 2, -Math.PI / 2);
            ctx.closePath();
          };

          // Dark background
          drawPill();
          ctx.fillStyle = 'rgba(5,8,20,0.82)';
          ctx.fill();

          // Colored top border (1.5px stroke, clipped to top half)
          drawPill();
          ctx.strokeStyle = badge.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Colored label
          ctx.font = `700 ${badgeFontSize}px 'Arial Black', Arial, sans-serif`;
          ctx.fillStyle = badge.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${badge.label} ${badge.value}`, badgeX + badgeW / 2, badgeY + badgeH / 2);

          badgeX += badgeW + badgeGap;
        }
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
        let dataUrl: string;
        try { dataUrl = canvas.toDataURL(mimeType, quality); }
        catch (e) {
          canvas.width = 0; canvas.height = 0; img.src = '';
          reject(e); return;
        }
        canvas.width = 0; canvas.height = 0; img.src = '';
        resolve(dataUrl);
      };
      img.onerror = () => {
        canvas.width = 0; canvas.height = 0; img.src = '';
        reject(new Error('Failed to load image'));
      };
      img.src = screenshotDataUrl;
    });
  }

  static generateFoundryJSON(
    character: RPGCharacterSync,
    heroName: string,
    tokenFilename: string
  ): string {
    const name = heroName.trim() || character.archetypeId;
    const stats = character.calculatedStats;

    // Primary stat = highest value
    const statEntries = Object.entries(stats) as Array<[keyof ArchetypeStats, number]>;
    const primaryStat = statEntries.reduce((a, b) => b[1] > a[1] ? b : a)[0];

    const manifest = {
      name,
      img: tokenFilename,
      width: character.physicalAttributes.build === 'heavy' ? 2 : 1,
      height: character.physicalAttributes.height === 'giant' ? 2 : 1,
      displayName: 30,   // HOVER
      disposition: 1,    // FRIENDLY
      displayBars: 20,   // OWNER_ONLY
      bar1: { attribute: primaryStat },
      bar2: { attribute: 'defense' },
      actorData: {
        type: 'character',
        system: {
          attributes: Object.fromEntries(
            statEntries.map(([k, v]) => [k, { value: v, max: 100 }])
          ),
          details: {
            archetype: character.archetypeId,
            build: character.physicalAttributes.build,
            height: character.physicalAttributes.height,
          },
        },
      },
      flags: {
        herosculpt: {
          version: '1.0',
          generatedAt: new Date().toISOString(),
        },
      },
    };

    return JSON.stringify(manifest, null, 2);
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
