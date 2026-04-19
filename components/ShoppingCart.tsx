import React, { useState, useEffect } from 'react';
import { SelectedParts, Part, PartCategory, CartItem } from '../types';
import { useLang, t } from '../lib/i18n';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClearCart: () => void;
  onCheckout: (items: CartItem[]) => Promise<void>;
  onAddCurrentConfig: () => void;
  currentConfiguration: SelectedParts;
  onEditCategory?: (category: PartCategory) => void;
  user?: { id: string; email?: string } | null;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
  ownedPartIds?: Set<string>;
  ownedPartIdsLoading?: boolean;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  onAddCurrentConfig,
  currentConfiguration,
  onEditCategory,
  user,
  isAuthenticated = false,
  onAuthRequired,
  ownedPartIds = new Set(),
  ownedPartIdsLoading = false,
}) => {
  const { lang } = useLang();
  const [activeTab, setActiveTab] = useState<'config' | 'cart'>('config');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const configParts = Object.values(currentConfiguration).filter(
    (p): p is Part => !!p && !p.attributes?.hidden
  );

  const ownedCount = configParts.filter(
    (p) => p.priceUSD > 0 && ownedPartIds.has(p.id)
  ).length;

  const newTotal = configParts
    .filter((p) => p.priceUSD > 0 && !ownedPartIds.has(p.id))
    .reduce((sum, p) => sum + p.priceUSD, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) { onAuthRequired?.(); return; }
    setCheckoutError(null);
    setIsProcessing(true);
    try {
      const items: CartItem[] = cartItems.length > 0 ? cartItems : [{
        id: crypto.randomUUID(),
        name: t('cart.hero_name', lang),
        category: 'hero',
        price: newTotal,
        thumbnail: configParts[0]?.thumbnail ?? '',
        quantity: 1,
        configuration: currentConfiguration,
        archetype: '',
      }];
      await onCheckout(items);
    } catch (error) {
      setCheckoutError(t('cart.checkout_error', lang));
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryLabel = (category: string) =>
    category.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: 420, maxHeight: '85vh',
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border-strong)',
        borderRadius: 'var(--radius)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 16, letterSpacing: 2 }}>
            {t('cart.title', lang)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-comic)', fontSize: 11, letterSpacing: 1,
              background: 'rgba(0,0,0,0.3)', color: '#111',
              padding: '2px 6px', borderRadius: 'var(--radius)',
            }}>
              {configParts.length} {t('cart.parts', lang)}
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#111', opacity: 0.7 }}
            >✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--color-accent)' }}>
          {(['config', 'cart'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '8px 4px',
                fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1,
                background: activeTab === tab ? 'var(--color-surface-2)' : 'var(--color-surface)',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
                marginBottom: -2,
                color: activeTab === tab ? 'var(--color-accent)' : 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >
              {tab === 'config' ? t('cart.tab.config', lang) : (
                <>{t('cart.tab.cart', lang)} {cartItems.length > 0 && <span style={{ color: 'var(--color-accent)' }}>●</span>}</>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {activeTab === 'config' ? (
            <>
              {configParts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 12px' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🦸</div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                    {t('cart.empty.title', lang)}
                  </p>
                  <p style={{ color: 'var(--color-text-faint)', fontSize: 11, lineHeight: 1.5, margin: 0 }}>
                    {t('cart.empty.hint', lang)}
                  </p>
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>←</span>
                    <span style={{ color: 'var(--color-accent)', fontSize: 10, fontFamily: 'var(--font-body)', fontWeight: 800, letterSpacing: 1.2 }}>{t('cart.parts_panel', lang)}</span>
                  </div>
                </div>
              ) : (
                configParts.map((part) => {
                  const isOwned = part.priceUSD > 0 && ownedPartIds.has(part.id);
                  const isNew = part.priceUSD > 0 && !ownedPartIds.has(part.id);

                  return (
                    <div key={part.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      padding: '6px 8px', marginBottom: 6,
                      background: 'var(--color-surface-2)',
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        background: 'var(--color-border)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {part.thumbnail ? (
                          <img src={part.thumbnail} alt={part.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 18 }}>🦸</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 0.5,
                          color: 'var(--color-text)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {part.name.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {getCategoryLabel(part.category)}
                        </div>
                      </div>

                      {/* Price status */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {isOwned && (
                          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>{t('cart.owned', lang)}</span>
                        )}
                        {isNew && (
                          <>
                            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 700 }}>
                              ${part.priceUSD.toFixed(2)}
                            </div>
                            <div style={{ fontSize: 9, color: 'var(--color-text-faint)', textTransform: 'uppercase' }}>
                              {t('cart.new_badge', lang)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Summary */}
              {configParts.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 4 }}>
                  {ownedCount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('cart.in_library', lang)}</span>
                      <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>{ownedCount} {ownedCount === 1 ? t('cart.part_singular', lang) : t('cart.part_plural', lang)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('cart.total_new', lang)}</span>
                    <span style={{ fontFamily: 'var(--font-comic)', fontSize: 14, color: 'var(--color-accent)', letterSpacing: 1 }}>
                      {t('cart.total_label', lang)} ${newTotal.toFixed(2)}
                    </span>
                  </div>
                  {isAuthenticated && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('cart.discount', lang)}</span>
                      <span style={{ fontFamily: 'var(--font-comic)', fontSize: 14, color: '#22c55e', letterSpacing: 1 }}>{t('cart.free', lang)}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Cart tab */
            <>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 12px' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>🛒</div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: 1, margin: '0 0 6px' }}>
                    {t('cart.empty_cart', lang)}
                  </p>
                  <p style={{ color: 'var(--color-text-faint)', fontSize: 10, lineHeight: 1.5, margin: 0 }}>
                    {t('cart.empty_cart_hint', lang)}
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    padding: '6px 8px', marginBottom: 6,
                    background: 'var(--color-surface-2)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-comic)', fontSize: 12, color: 'var(--color-text)' }}>
                        {item.name.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{item.category}</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 700 }}>
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14 }}
                    >✕</button>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer CTAs */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)' }}>
          {configParts.length > 0 && (
            <button
              onClick={onAddCurrentConfig}
              style={{
                width: '100%', padding: '8px',
                background: 'rgba(216,162,58,0.12)',
                border: '1.5px solid var(--color-accent)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1.5,
                color: 'var(--color-accent)', cursor: 'pointer',
                marginBottom: 6,
              }}
            >
              {t('cart.add_build', lang)}
            </button>
          )}
          {checkoutError && (
            <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--color-error, #ef4444)', textAlign: 'center' }}>
              {checkoutError}
            </div>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              style={{
                width: '100%', padding: '10px',
                background: isProcessing ? 'var(--color-border)' : 'var(--color-accent)',
                border: 'none', borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2,
                color: '#111', cursor: isProcessing ? 'not-allowed' : 'pointer',
                marginBottom: 6,
              }}
            >
              {isProcessing ? t('cart.saving', lang) : t('cart.save', lang)}
            </button>
          ) : (
            <button
              onClick={onAuthRequired}
              style={{
                width: '100%', padding: '10px',
                background: 'var(--color-accent)',
                border: 'none', borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2,
                color: '#111', cursor: 'pointer',
                marginBottom: 6,
              }}
            >
              {t('cart.register_save', lang)}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '6px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text-muted)', fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {t('cart.back_edit', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
