import React, { useState } from 'react';
import { CharacterViewerRef } from './CharacterViewer';
import { LIGHTING_PRESETS, LightingPreset } from '../lib/lightingPresets';

interface LightsPanelProps {
  apiRef: React.RefObject<CharacterViewerRef | null>;
  onClose?: () => void;
}

const ACTIVE_KEY = '__activeLightingPreset';

function hexToCSS(hex: number): string {
  return `#${hex.toString(16).padStart(6, '0')}`;
}

function LightDots({ preset }: { preset: LightingPreset }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[
        { color: preset.keyLight.color, label: 'K' },
        { color: preset.fillLight.color, label: 'F' },
        { color: preset.rimLight.color, label: 'R' },
      ].map(({ color, label }) => (
        <div
          key={label}
          title={label}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: hexToCSS(color),
            border: '1px solid rgba(255,255,255,0.15)',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

export default function LightsPanel({ apiRef, onClose }: LightsPanelProps) {
  const [activePresetName, setActivePresetName] = useState<string>(() => {
    try { return localStorage.getItem(ACTIVE_KEY) ?? ''; } catch { return ''; }
  });

  const applyPreset = (preset: LightingPreset) => {
    if (!apiRef.current) return;
    apiRef.current.applyLightingPreset(preset);
    setActivePresetName(preset.name);
    try { localStorage.setItem(ACTIVE_KEY, preset.name); } catch {}
  };

  const activePreset = LIGHTING_PRESETS.find((p) => p.name === activePresetName);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="panel-header">
        <span>LIGHTING</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}
        >✕</button>
      </div>

      {/* Active preset indicator */}
      <div style={{
        padding: '6px 12px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface-2)',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, color: 'var(--color-text-faint)', fontFamily: 'var(--font-comic)', letterSpacing: 1 }}>ACTIVE:</span>
        {activePreset ? (
          <>
            <span style={{ fontSize: 11, color: 'var(--color-accent)', fontFamily: 'var(--font-comic)', letterSpacing: 1 }}>
              {activePreset.icon ?? '💡'} {activePreset.name}
            </span>
            <LightDots preset={activePreset} />
          </>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-comic)', letterSpacing: 1 }}>NONE</span>
        )}
      </div>

      {/* 2-column grid of preset cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {LIGHTING_PRESETS.map((preset) => {
            const isActive = activePresetName === preset.name;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                title={preset.description}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  padding: '10px 6px 8px',
                  background: isActive ? 'var(--color-accent)' : 'var(--color-surface-2)',
                  border: isActive ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Light color preview bar */}
                <div style={{ display: 'flex', width: '100%', height: 6, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ flex: preset.keyLight.intensity, background: hexToCSS(preset.keyLight.color) }} />
                  <div style={{ flex: preset.fillLight.intensity, background: hexToCSS(preset.fillLight.color) }} />
                  <div style={{ flex: preset.rimLight.intensity, background: hexToCSS(preset.rimLight.color) }} />
                </div>

                <span style={{ fontSize: 20 }}>{preset.icon ?? '💡'}</span>

                <span style={{
                  fontFamily: 'var(--font-comic)',
                  fontSize: 9,
                  letterSpacing: 1,
                  color: isActive ? '#000' : 'var(--color-text)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                  wordBreak: 'break-word',
                }}>
                  {preset.name.toUpperCase()}
                </span>

                {isActive && (
                  <div style={{
                    position: 'absolute', top: 3, right: 4,
                    fontSize: 8, fontFamily: 'var(--font-comic)', color: '#000', letterSpacing: 1,
                  }}>ON</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
