import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShoppingCart from '../components/ShoppingCart';
import { PartCategory } from '../types';

const makePart = (id: string, priceUSD = 0) => ({
  id, name: id, category: PartCategory.TORSO,
  priceUSD, compatible: [], attributes: {},
});

const makeCartItem = (id: string) => ({
  id, name: `Item ${id}`, category: 'TORSO',
  price: 4.99, thumbnail: '', quantity: 1,
  configuration: {}, archetype: 'STRONG',
});

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  cartItems: [],
  onRemoveItem: vi.fn(),
  onUpdateQuantity: vi.fn(),
  onClearCart: vi.fn(),
  onCheckout: vi.fn(),
  onAddCurrentConfig: vi.fn(),
  currentConfiguration: {},
  isAuthenticated: false,
};

describe('ShoppingCart', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders the panel-header with MI HÉROE title', () => {
    render(<ShoppingCart {...defaultProps} />);
    expect(screen.getByText(/MI HÉROE/i)).toBeInTheDocument();
  });

  it('shows CONFIGURACIÓN and CARRITO tabs', () => {
    render(<ShoppingCart {...defaultProps} />);
    expect(screen.getByText(/CONFIGURACIÓN/i)).toBeInTheDocument();
    expect(screen.getByText(/CARRITO/i)).toBeInTheDocument();
  });

  it('shows YA TIENES for owned parts in config tab', () => {
    const config = { TORSO: makePart('part-1', 4.99) };
    render(
      <ShoppingCart
        {...defaultProps}
        currentConfiguration={config as any}
        ownedPartIds={new Set(['part-1'])}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText(/YA TIENES/i)).toBeInTheDocument();
  });

  it('shows price and NUEVO for unowned paid parts', () => {
    const config = { TORSO: makePart('part-2', 4.99) };
    render(
      <ShoppingCart
        {...defaultProps}
        currentConfiguration={config as any}
        ownedPartIds={new Set()}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText('$4.99')).toBeInTheDocument();
    expect(screen.getByText('NUEVO')).toBeInTheDocument();
  });

  it('shows GUARDAR EN BIBLIOTECA for authenticated users', () => {
    render(<ShoppingCart {...defaultProps} isAuthenticated={true} />);
    expect(screen.getByText(/GUARDAR EN BIBLIOTECA/i)).toBeInTheDocument();
  });

  it('shows REGISTRARSE PARA GUARDAR for unauthenticated users', () => {
    render(<ShoppingCart {...defaultProps} isAuthenticated={false} />);
    expect(screen.getByText(/REGISTRARSE PARA GUARDAR/i)).toBeInTheDocument();
  });

  it('calls onCheckout with cartItems when CTA clicked (authenticated)', () => {
    const onCheckout = vi.fn();
    const items = [makeCartItem('item-1')];
    render(
      <ShoppingCart
        {...defaultProps}
        cartItems={items}
        onCheckout={onCheckout}
        isAuthenticated={true}
      />
    );
    fireEvent.click(screen.getByText(/GUARDAR EN BIBLIOTECA/i));
    expect(onCheckout).toHaveBeenCalledWith(items);
  });

  it('does not render when isOpen is false', () => {
    render(<ShoppingCart {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/MI HÉROE/i)).not.toBeInTheDocument();
  });
});
