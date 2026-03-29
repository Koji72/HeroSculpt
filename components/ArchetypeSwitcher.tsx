import React, { useState, useRef, useEffect } from 'react';
import type { ArchetypeInfo } from '../lib/archetypeData'; // re-exported from types
import { type ArchetypeId } from '../types';

export interface ArchetypeSwitcherProps {
  archetypes: ArchetypeInfo[];
  activeArchetypeId: ArchetypeId;
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
  isActive,
}: {
  archetype: ArchetypeInfo;
  onConfirmSelect: () => void;
  isActive?: boolean;
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
      {archetype.famousExamples?.length ? archetype.famousExamples.slice(0, 3).join(', ') + '.' : ''}
    </div>
    <StatBar label="POWER" value={archetype.stats.power} />
    <StatBar label="DEFENSE" value={archetype.stats.defense} />
    <StatBar label="SPEED" value={archetype.stats.speed} />
    {!isActive && (
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
    )}
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
  const [pendingId, setPendingId] = useState<string | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const visible = archetypes.slice(0, MAX_VISIBLE);
  const overflow = archetypes.slice(MAX_VISIBLE);

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

  useEffect(() => {
    if (!pendingId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPendingId(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [pendingId]);

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
    outline: 'none',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, overflow: 'hidden', position: 'relative' }}>
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

      {visible.map((a) => (
        <div
          key={a.id}
          style={{ position: 'relative' }}
          onMouseEnter={() => setHoveredId(a.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <button type="button" style={chipStyle(a.id === activeArchetypeId)} onClick={() => handleChipClick(a.id)}>
            <span>{a.icon}</span>
            <span>{a.name}</span>
            {a.id === activeArchetypeId && (
              <span style={{ fontSize: 8, background: 'rgba(0,0,0,0.3)', padding: '1px 4px', borderRadius: 2 }}>ACTIVE</span>
            )}
          </button>
          {hoveredId === a.id && (
            <ArchetypeTooltip
              archetype={a}
              onConfirmSelect={() => handleChipClick(a.id)}
              isActive={a.id === activeArchetypeId}
            />
          )}
        </div>
      ))}

      {overflow.length > 0 && (
        <div ref={moreRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            style={{ ...chipStyle(false), border: '1px dashed var(--color-border)', color: '#6b7280', background: 'var(--color-surface-2)' }}
            onClick={() => setShowMore((v) => !v)}
          >
            ••• MORE
          </button>
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
                  <button
                    onClick={() => { handleChipClick(a.id); setShowMore(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
                      borderRadius: 'var(--radius)', cursor: 'pointer',
                      color: a.id === activeArchetypeId ? 'var(--color-accent)' : '#9ca3af',
                      fontSize: 11, letterSpacing: 1, fontWeight: 'bold',
                      background: hoveredId === a.id ? 'var(--color-surface-2)' : 'transparent',
                      border: 'none', width: '100%', textAlign: 'left',
                    }}
                  >
                    <span>{a.icon}</span>
                    <span>{a.name}</span>
                  </button>
                  {hoveredId === a.id && (
                    <ArchetypeTooltip
                      archetype={a}
                      onConfirmSelect={() => { handleChipClick(a.id); setShowMore(false); }}
                      isActive={a.id === activeArchetypeId}
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
