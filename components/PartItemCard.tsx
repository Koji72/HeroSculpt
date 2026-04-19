import React, { useState } from 'react';
import { Part } from '../types';
import { X } from 'lucide-react';
import { useLang, t } from '../lib/i18n';

interface PartItemCardProps {
  part: Part;
  isSelected: boolean;
  onSelect: (part: Part) => void;
  onHover?: (part: Part | null) => void;
  ownedPartIds?: Set<string>;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (partId: string) => void;
}

const PartItemCard: React.FC<PartItemCardProps> = ({
  part, isSelected, onSelect, onHover,
  ownedPartIds = new Set(),
  favoriteIds = new Set(),
  onToggleFavorite,
}) => {
  const { lang } = useLang();
  const [hovered, setHovered] = useState(false);
  const isNonePart = part.attributes?.none === true;
  const isTorso = part.category === 'TORSO' || part.category === 'SUIT_TORSO';

  const isFree   = !isNonePart && part.priceUSD === 0;
  const isOwned  = !isNonePart && part.priceUSD > 0 && ownedPartIds.has(part.id);
  const isPremium = !isNonePart && part.priceUSD > 0 && !isOwned;
  const premiumLabel = part.priceUSD != null ? `$${part.priceUSD.toFixed(2)}` : '';
  const isFavorite = !isNonePart && favoriteIds.has(part.id);

  const handleMouseEnter = () => {
    setHovered(true);
    if (onHover) onHover(part);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (onHover) onHover(null);
  };

  return (
    <div
      onClick={() => onSelect(part)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        aspectRatio: '1',
        background: isSelected ? 'var(--color-accent-dim)' : hovered ? 'rgba(30,41,59,0.95)' : 'var(--color-surface-2)',
        border: `${isSelected ? 2 : 1.5}px solid ${isSelected ? 'var(--color-accent)' : hovered ? 'var(--color-accent)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '4px',
        position: 'relative',
        overflow: 'visible',
        transform: hovered && !isSelected ? 'scale(1.06)' : 'scale(1)',
        transition: 'border-color 0.1s, background 0.1s, transform 0.12s, box-shadow 0.12s',
        boxShadow: hovered ? '0 0 12px rgba(216,162,58,0.25), 0 4px 12px rgba(0,0,0,0.4)' : 'none',
        zIndex: hovered ? 2 : 1,
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

      {/* Favorite button */}
      {!isNonePart && onToggleFavorite && (isFavorite || hovered) && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(part.id); }}
          style={{
            position: 'absolute', top: 2, left: isSelected ? 18 : 2,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 10, lineHeight: 1, padding: 2,
            color: isFavorite ? '#f43f5e' : 'rgba(148,163,184,0.6)',
            transition: 'color 0.1s, transform 0.1s',
            transform: isFavorite ? 'scale(1.2)' : 'scale(1)',
          }}
          title={isFavorite ? t('part.remove_fav', lang) : t('part.add_fav', lang)}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
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
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}

        {/* PREMIUM overlay */}
        {isPremium && !isNonePart && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 1,
          }}>
            <span style={{
              fontFamily: 'var(--font-comic)', fontSize: 8, letterSpacing: 0.5,
              color: 'var(--color-accent)', fontWeight: 700,
            }}>{premiumLabel}</span>
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {hovered && !isNonePart && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15,23,42,0.97)',
          border: '1px solid rgba(216,162,58,0.35)',
          padding: '6px 10px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          <div style={{ fontFamily: 'var(--font-comic)', fontSize: 10, letterSpacing: 1, color: '#e2e8f0', fontWeight: 700 }}>
            {part.name}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: isFree ? '#60a5fa' : isOwned ? '#22c55e' : 'var(--color-accent)', marginTop: 2 }}>
            {isFree ? t('part.free', lang) : isOwned ? t('cart.owned', lang) : premiumLabel + ' · ' + t('part.premium', lang)}
          </div>
        </div>
      )}

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
            }}>{t('part.free', lang)}</span>
          )}
          {isOwned && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              fontFamily: 'var(--font-comic)', fontSize: 7, letterSpacing: '0.5px',
              background: 'rgba(34,197,94,0.2)', color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.4)',
              padding: '1px 3px', borderRadius: 'var(--radius)',
            }}>{t('part.owned', lang)}</span>
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
        {isNonePart ? t('part.none', lang) : part.name}
      </span>

      {/* State sub-label below name */}
      {!isNonePart && (
        <>
          {isPremium && (
            <span style={{
              fontFamily: 'var(--font-comic)', fontSize: 7,
              color: 'var(--color-accent)', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginTop: 1,
            }}>{t('part.premium', lang)}</span>
          )}
          {isOwned && (
            <span style={{
              fontFamily: 'var(--font-comic)', fontSize: 7,
              color: '#22c55e', letterSpacing: '0.5px',
              textTransform: 'uppercase', marginTop: 1,
            }}>{t('part.owned_sub', lang)}</span>
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
        }}>{t('part.torso_badge', lang)}</span>
      )}
    </div>
  );
};

export default PartItemCard;
