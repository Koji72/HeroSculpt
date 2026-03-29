import React from 'react';
import { Part } from '../types';
import { X } from 'lucide-react';

interface PartItemCardProps {
  part: Part;
  isSelected: boolean;
  onSelect: (part: Part) => void;
  onHover?: (part: Part | null) => void;
  ownedPartIds?: Set<string>;
}

const PartItemCard: React.FC<PartItemCardProps> = ({
  part, isSelected, onSelect, onHover,
  ownedPartIds = new Set(),
}) => {
  const isNonePart = part.attributes?.none === true;
  const isTorso = part.category === 'TORSO' || part.category === 'SUIT_TORSO';

  const isFree   = !isNonePart && part.priceUSD === 0;
  const isOwned  = !isNonePart && part.priceUSD > 0 && ownedPartIds.has(part.id);
  const isPremium = !isNonePart && part.priceUSD > 0 && !isOwned;
  const premiumLabel = `$${part.priceUSD.toFixed(2)}`;

  const handleClick = () => {
    onSelect(part);
  };

  const handleMouseEnter = () => {
    if (onHover) {
      onHover(part);
    }
  };

  const handleMouseLeave = () => {
    // Don't clear hover when moving between parts to prevent model disappearing
    // The container will handle clearing when mouse leaves the entire panel
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={
        isNonePart ? 'Remove part' :
        isPremium ? `${part.name} — $${part.priceUSD.toFixed(2)} · Añadir al carrito para descargar` :
        `${part.name} - Click to apply`
      }
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
          position: 'absolute', top: 3, left: 5,
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
        position: 'relative',
      }}>
        {isNonePart ? (
          <X style={{ width: 24, height: 24, color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)', opacity: 0.7 }} />
        ) : part.thumbnail ? (
          <img
            src={part.thumbnail}
            alt={part.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/100/1e293b/f97316?text=Error';
              e.currentTarget.alt = 'Error loading image';
            }}
          />
        ) : null}

        {/* PREMIUM lock overlay — rendered inside the thumbnail div */}
        {isPremium && !isNonePart && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 1,
          }}>
            <span style={{ fontSize: 14 }}>🔒</span>
          </div>
        )}
      </div>

      {/* State badge — top-right corner */}
      {!isNonePart && (
        <>
          {isFree && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              fontFamily: 'var(--font-comic)', fontSize: 7, letterSpacing: '0.5px',
              background: 'rgba(59,130,246,0.25)', color: '#60a5fa',
              border: '1px solid rgba(59,130,246,0.4)',
              padding: '1px 3px', borderRadius: 'var(--radius)',
            }}>FREE</span>
          )}
          {isOwned && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              fontFamily: 'var(--font-comic)', fontSize: 7, letterSpacing: '0.5px',
              background: 'rgba(34,197,94,0.2)', color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.4)',
              padding: '1px 3px', borderRadius: 'var(--radius)',
            }}>✓ MÍO</span>
          )}
          {isPremium && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              fontFamily: 'var(--font-comic)', fontSize: 7, letterSpacing: '0.5px',
              background: 'rgba(245,158,11,0.25)', color: 'var(--color-accent)',
              border: '1px solid rgba(245,158,11,0.4)',
              padding: '1px 3px', borderRadius: 'var(--radius)',
            }}>{premiumLabel}</span>
          )}
        </>
      )}

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
        {isNonePart ? 'None' : part.name}
      </span>

      {/* State sub-label below name */}
      {!isNonePart && (
        <>
          {isPremium && (
            <span style={{
              fontFamily: 'var(--font-comic)', fontSize: 7,
              color: 'var(--color-accent)', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginTop: 1,
            }}>PREMIUM</span>
          )}
          {isOwned && (
            <span style={{
              fontFamily: 'var(--font-comic)', fontSize: 7,
              color: '#22c55e', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginTop: 1,
            }}>YA COMPRADO</span>
          )}
        </>
      )}

      {/* Torso indicator (preserved extra badge) */}
      {isTorso && (
        <span style={{
          position: 'absolute', bottom: 3, left: 4,
          fontFamily: 'var(--font-comic)', fontSize: 7,
          color: 'var(--color-text-faint)', letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>TORSO</span>
      )}
    </div>
  );
};

export default PartItemCard;
