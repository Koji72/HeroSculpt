// tests/StylePanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StylePanel from '../components/StylePanel';

const mockParts = [
  { id: 'torso', label: 'TORSO', color: '#1d4ed8', material: 'FABRIC' as const },
  { id: 'legs', label: 'LEGS', color: '#dc2626', material: 'METAL' as const },
  { id: 'head', label: 'HEAD', color: '#16a34a', material: 'PLASTIC' as const },
];

const defaultProps = {
  parts: mockParts,
  activePart: 'torso',
  onPartSelect: vi.fn(),
  onColorChange: vi.fn(),
  onMaterialChange: vi.fn(),
  onApplyToAll: vi.fn(),
  onClose: vi.fn(),
};

describe('StylePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all parts in the left column', () => {
    render(<StylePanel {...defaultProps} />);
    expect(screen.getAllByText('TORSO').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('LEGS')).toBeInTheDocument();
    expect(screen.getByText('HEAD')).toBeInTheDocument();
  });

  it('calls onPartSelect when a different part is clicked', () => {
    render(<StylePanel {...defaultProps} />);
    fireEvent.click(screen.getByText('LEGS'));
    expect(defaultProps.onPartSelect).toHaveBeenCalledWith('legs');
  });

  it('calls onColorChange when a color swatch is clicked (immediate preview)', () => {
    const onColorChange = vi.fn();
    render(<StylePanel {...defaultProps} onColorChange={onColorChange} />);
    const swatches = screen.getAllByRole('button', { name: /color/i });
    fireEvent.click(swatches[0]);
    expect(onColorChange).toHaveBeenCalledWith('torso', expect.any(String));
  });

  it('calls onMaterialChange when a material button is clicked (immediate preview)', () => {
    const onMaterialChange = vi.fn();
    render(<StylePanel {...defaultProps} onMaterialChange={onMaterialChange} />);
    fireEvent.click(screen.getByText('METAL'));
    expect(onMaterialChange).toHaveBeenCalledWith('torso', 'METAL');
  });

  it('APPLY TO THIS PART calls both onColorChange and onMaterialChange for active part', () => {
    const onColorChange = vi.fn();
    const onMaterialChange = vi.fn();
    render(<StylePanel {...defaultProps} onColorChange={onColorChange} onMaterialChange={onMaterialChange} />);
    fireEvent.click(screen.getByText('APPLY TO THIS PART'));
    expect(onColorChange).toHaveBeenCalledWith('torso', expect.any(String));
    expect(onMaterialChange).toHaveBeenCalledWith('torso', expect.any(String));
  });

  it('calls onApplyToAll when APPLY TO ALL PARTS is clicked', () => {
    render(<StylePanel {...defaultProps} />);
    fireEvent.click(screen.getByText(/apply to all/i));
    expect(defaultProps.onApplyToAll).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
  });

  it('calls onClose when close button is clicked', () => {
    render(<StylePanel {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
