// tests/ArchetypeSwitcher.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ArchetypeSwitcher from '../components/ArchetypeSwitcher';
import { ARCHETYPES_LIST } from '../lib/archetypeData';

const defaultProps = {
  archetypes: ARCHETYPES_LIST.slice(0, 5),
  activeArchetypeId: 'STRONG',
  hasUnsavedParts: false,
  onSelect: vi.fn(),
};

describe('ArchetypeSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the active archetype chip with ACTIVE badge', () => {
    render(<ArchetypeSwitcher {...defaultProps} />);
    expect(screen.getByText('STRONG')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('calls onSelect immediately when hasUnsavedParts is false', () => {
    const onSelect = vi.fn();
    render(<ArchetypeSwitcher {...defaultProps} onSelect={onSelect} />);
    const chip = screen.getByText(defaultProps.archetypes[1].name);
    fireEvent.click(chip);
    expect(onSelect).toHaveBeenCalledWith(defaultProps.archetypes[1].id);
  });

  it('shows confirmation dialog when hasUnsavedParts is true', () => {
    render(<ArchetypeSwitcher {...defaultProps} hasUnsavedParts={true} />);
    const chip = screen.getByText(defaultProps.archetypes[1].name);
    fireEvent.click(chip);
    expect(screen.getByText(/clear selected parts/i)).toBeInTheDocument();
    expect(defaultProps.onSelect).not.toHaveBeenCalled();
  });

  it('calls onSelect after confirming dialog', () => {
    const onSelect = vi.fn();
    render(<ArchetypeSwitcher {...defaultProps} hasUnsavedParts={true} onSelect={onSelect} />);
    fireEvent.click(screen.getByText(defaultProps.archetypes[1].name));
    fireEvent.click(screen.getByText(/confirm/i));
    expect(onSelect).toHaveBeenCalledWith(defaultProps.archetypes[1].id);
  });

  it('renders MORE chip when archetypes exceed 4', () => {
    render(<ArchetypeSwitcher {...defaultProps} archetypes={ARCHETYPES_LIST} />);
    expect(screen.getByText(/more/i)).toBeInTheDocument();
  });

  it('closes MORE dropdown on Escape key', () => {
    render(<ArchetypeSwitcher {...defaultProps} archetypes={ARCHETYPES_LIST} />);
    fireEvent.click(screen.getByText(/more/i));
    expect(screen.getAllByRole('button').length).toBeGreaterThan(6);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.getAllByRole('button').length).toBeLessThanOrEqual(6);
  });
});
