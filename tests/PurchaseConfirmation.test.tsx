import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PurchaseConfirmation from '../components/PurchaseConfirmation';
import { PartCategory, ArchetypeId } from '../types';

// Mock ARCHETYPE_DATA — use string key to avoid hoisting issues with ArchetypeId enum
vi.mock('../lib/archetypeData', () => ({
  ARCHETYPE_DATA: {
    STRONG: { title: 'THE POWERHOUSE', name: 'STRONG' },
  },
}));

const makePart = (id: string) => ({
  id, name: `Part ${id}`, category: PartCategory.TORSO,
  priceUSD: 0, compatible: [], attributes: {},
});

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  purchasedParts: [makePart('p1'), makePart('p2')],
  modelName: 'Mi Héroe',
  archetypeId: ArchetypeId.STRONG,
};

describe('PurchaseConfirmation', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders the HÉROE GUARDADO header', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.getByText(/HÉROE GUARDADO/i)).toBeInTheDocument();
  });

  it('shows the hero name in an editable input', () => {
    render(<PurchaseConfirmation {...defaultProps} modelName="Batman Pro" />);
    const input = screen.getByDisplayValue('Batman Pro');
    expect(input.tagName).toBe('INPUT');
  });

  it('calls onModelNameChange on blur', () => {
    const onModelNameChange = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onModelNameChange={onModelNameChange} />);
    const input = screen.getByDisplayValue('Mi Héroe');
    fireEvent.change(input, { target: { value: 'Nuevo Nombre' } });
    fireEvent.blur(input);
    expect(onModelNameChange).toHaveBeenCalledWith('Nuevo Nombre');
  });

  it('shows archetype title from ARCHETYPE_DATA', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.getByText(/THE POWERHOUSE/i)).toBeInTheDocument();
  });

  it('lists all purchased parts with GUARDADO label', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.getByText(/Part p1/i)).toBeInTheDocument();
    expect(screen.getByText(/Part p2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/GUARDADO/i).length).toBeGreaterThanOrEqual(2);
  });

  it('shows DESCARGAR GLB button when onExportGLB provided', () => {
    const onExportGLB = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onExportGLB={onExportGLB} />);
    const btn = screen.getByText(/DESCARGAR GLB/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onExportGLB).toHaveBeenCalled();
  });

  it('hides DESCARGAR GLB when onExportGLB not provided', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.queryByText(/DESCARGAR GLB/i)).not.toBeInTheDocument();
  });

  it('calls onClose when SEGUIR PERSONALIZANDO clicked', () => {
    const onClose = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText(/SEGUIR PERSONALIZANDO/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onOpenLibrary (but not onClose) when VER EN BIBLIOTECA clicked', () => {
    const onClose = vi.fn();
    const onOpenLibrary = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onClose={onClose} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByText(/VER EN BIBLIOTECA/i));
    expect(onOpenLibrary).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<PurchaseConfirmation {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/HÉROE GUARDADO/i)).not.toBeInTheDocument();
  });
});
