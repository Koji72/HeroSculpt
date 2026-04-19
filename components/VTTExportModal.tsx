import React, { useState, useEffect } from 'react';
import { RPGCharacterSync } from '../types';
import { CharacterViewerRef } from './CharacterViewer';
import { VTTService, VTTTokenExport } from '../services/vttService';
import { useLang, t } from '../lib/i18n';

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
  const { lang } = useLang();
  const [step, setStep] = useState<WizardStep>(1);
  const [screenshot, setScreenshot] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState(false);
  const [shape, setShape] = useState<TokenShape>('circle');
  const [tokenOptions, setTokenOptions] = useState<VTTTokenExport>({
    size: 512,
    format: 'png',
    background: 'transparent',
    borderColor: '#f59e0b',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setScreenshot('');
      setCaptureError(false);
      setIsExporting(false);
      setExportError(false);
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
      let shot = '';
      if (ref.takeTokenScreenshot) {
        shot = await ref.takeTokenScreenshot();
      }
      // Fallback to generic screenshot if token screenshot returns empty
      if ((!shot || shot.length <= 1000) && (ref as unknown as { takeScreenshot: () => Promise<string> }).takeScreenshot) {
        shot = await (ref as unknown as { takeScreenshot: () => Promise<string> }).takeScreenshot();
      }
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
    setExportError(false);
    try {
      const tokenImage = await VTTService.exportToken(character, tokenOptions, screenshot, shape);
      const link = document.createElement('a');
      link.href = tokenImage;
      link.download = `${character.archetypeId}_token_${shape}_${tokenOptions.size}.${tokenOptions.format}`;
      link.click();
      onExportToken(tokenOptions.format, tokenOptions.size);
    } catch {
      setExportError(true);
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

  const stepLabel = [t('vtt.step_capture', lang), t('vtt.step_shape', lang), t('vtt.step_settings', lang)][step - 1];

  // --- Step 1: Capture ---
  const Step1 = () => (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      {/* Preview area */}
      <div style={{ width: 160, height: 160, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {isCapturing && (
          <div style={{ textAlign: 'center' }}>
            <div style={comicLabel({ fontSize: 10, color: 'var(--color-text-faint)' })}>{t('vtt.capturing', lang)}</div>
          </div>
        )}
        {!isCapturing && screenshot && (
          <img src={screenshot} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        {!isCapturing && !screenshot && (
          <div style={{ textAlign: 'center', color: captureError ? 'var(--color-text-muted)' : 'var(--color-text-faint)' }}>
            {captureError ? '⚠️' : '🦸'}
            <div style={comicLabel({ fontSize: 9, marginTop: 4, color: 'var(--color-text-faint)' })}>
              {captureError ? t('vtt.capture_error', lang) : t('vtt.ready', lang)}
            </div>
          </div>
        )}
      </div>

      {/* Recapture button */}
      <button style={btnSecondary} onClick={captureScreenshot} disabled={isCapturing}>
        {t('vtt.recapture', lang)}
      </button>

      {/* Next */}
      <button
        style={{ ...btnPrimary, width: '100%', opacity: (isCapturing || !screenshot || captureError) ? 0.4 : 1 }}
        disabled={isCapturing || !screenshot || captureError}
        onClick={() => setStep(2)}
      >
        {t('vtt.next', lang)}
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
              {s === 'circle' ? t('vtt.circle', lang) : t('vtt.hex', lang)}
            </span>
            <span style={{ fontSize: 9, color: 'var(--color-text-faint)' }}>
              {s === 'circle' ? 'Roll20, Foundry' : 'Hex maps'}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={btnSecondary} onClick={() => setStep(1)}>{t('vtt.back', lang)}</button>
        <button style={{ ...btnPrimary, flex: 1 }} onClick={() => setStep(3)}>{t('vtt.next', lang)}</button>
      </div>
    </div>
  );

  // --- Step 3: Settings + Download ---
  const RadioGroup = ({ label, options, value, onChange }: { label: string; options: { v: string | number; l: string }[]; value: string | number; onChange: (v: string | number) => void }) => (
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

      <RadioGroup label={t('vtt.size_label', lang)} options={[{ v: 256, l: '256' }, { v: 512, l: '512' }, { v: 1024, l: '1024' }]} value={tokenOptions.size} onChange={v => setTokenOptions(o => ({ ...o, size: v }))} />
      <RadioGroup label={t('vtt.format_label', lang)} options={[{ v: 'png', l: 'PNG' }, { v: 'jpg', l: 'JPG' }, { v: 'webp', l: 'WebP' }]} value={tokenOptions.format} onChange={v => setTokenOptions(o => ({ ...o, format: v }))} />
      <RadioGroup label={t('vtt.bg_label', lang)} options={[{ v: 'transparent', l: t('vtt.bg_transparent', lang) }, { v: 'white', l: t('vtt.bg_white', lang) }, { v: 'black', l: t('vtt.bg_black', lang) }]} value={tokenOptions.background} onChange={v => setTokenOptions(o => ({ ...o, background: v }))} />

      {/* Border color */}
      <div>
        <div style={comicLabel({ fontSize: 9, color: 'var(--color-text-faint)', marginBottom: 4 })}>{t('vtt.border_color', lang)}</div>
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
        <button style={btnSecondary} onClick={() => setStep(2)}>{t('vtt.back', lang)}</button>
        <button
          style={{ ...btnPrimary, flex: 1, opacity: isExporting || !screenshot ? 0.5 : 1 }}
          disabled={isExporting || !screenshot}
          onClick={handleDownload}
        >
          {isExporting ? t('vtt.generating', lang) : t('vtt.download_token', lang)}
        </button>
      </div>
      {exportError && (
        <div style={{ color: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-comic)', letterSpacing: 1, textAlign: 'center' }}>
          {t('vtt.export_error', lang)}
        </div>
      )}
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
