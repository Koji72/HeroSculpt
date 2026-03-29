import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PartItemCard from '../components/PartItemCard';
import { PartCategory } from '../types';

const makePart = (overrides = {}) => ({
  id: 'part-1',
  name: 'Alpha Torso',
  category: PartCategory.TORSO,
  priceUSD: 0,
  thumbnail: '',
  compatible: [],
  attributes: {},
  ...overrides,
});

const defaultProps = {
  part: makePart(),
  isSelected: false,
  onSelect: () => {},
};

describe('PartItemCard — premium indicators', () => {
  it('shows FREE badge for priceUSD === 0', () => {
    render(<PartItemCard {...defaultProps} part={makePart({ priceUSD: 0 })} />);
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('does not show lock overlay for free parts', () => {
    render(<PartItemCard {...defaultProps} part={makePart({ priceUSD: 0 })} />);
    expect(screen.queryByText('🔒')).not.toBeInTheDocument();
  });

  it('shows PREMIUM badge and lock for paid unowned parts', () => {
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ priceUSD: 4.99 })}
        ownedPartIds={new Set()}
      />
    );
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('$4.99')).toBeInTheDocument();
  });

  it('shows OWNED badge when part is in ownedPartIds', () => {
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ id: 'part-1', priceUSD: 4.99 })}
        ownedPartIds={new Set(['part-1'])}
      />
    );
    expect(screen.getByText('✓ MÍO')).toBeInTheDocument();
    expect(screen.getByText('YA COMPRADO')).toBeInTheDocument();
    expect(screen.queryByText('🔒')).not.toBeInTheDocument();
  });

  it('shows PREMIUM when ownedPartIds not provided for paid part', () => {
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ priceUSD: 9.99 })}
        // ownedPartIds not passed — defaults to empty Set
      />
    );
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
  });

  it('shows PREMIUM during loading (ownedPartIds empty set)', () => {
    // During ownedPartIdsLoading, parent passes empty Set temporarily
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ id: 'part-1', priceUSD: 4.99 })}
        ownedPartIds={new Set()} // not yet loaded
      />
    );
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
    expect(screen.queryByText('✓ MÍO')).not.toBeInTheDocument();
  });
});
