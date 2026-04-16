// tests/VTTExportModal.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VTTService } from '../services/vttService';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VTTExportModal from '../components/VTTExportModal';

// Mock canvas for jsdom
beforeEach(() => {
  const gradient = {
    addColorStop: vi.fn(),
  };
  const ctx = {
    clearRect: vi.fn(), fillRect: vi.fn(), fillStyle: '',
    save: vi.fn(), restore: vi.fn(),
    beginPath: vi.fn(), closePath: vi.fn(), clip: vi.fn(),
    arc: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(),
    drawImage: vi.fn(), strokeStyle: '', lineWidth: 0, stroke: vi.fn(),
    fill: vi.fn(), fillText: vi.fn(), font: '', textAlign: 'left', textBaseline: 'alphabetic',
    createLinearGradient: vi.fn(() => gradient),
    shadowColor: '', shadowBlur: 0, shadowOffsetX: 0, shadowOffsetY: 0,
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as any);
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,abc123');
});

// Image mock — no `src` field: only the setter, so it fires correctly
const originalImage = globalThis.Image;
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 512;
  height = 512;
  set src(_val: string) { setTimeout(() => this.onload?.(), 0); }
}
beforeEach(() => { globalThis.Image = MockImage as any; });
afterEach(() => { globalThis.Image = originalImage; });

describe('VTTService.exportToken', () => {
  it('accepts shape parameter and returns a data URL', async () => {
    const character = { archetypeId: 'STRONG', calculatedStats: {} } as any;
    const options = { format: 'png' as const, size: 512 as const, background: 'transparent' as const, borderColor: '#f59e0b' };
    const result = await VTTService.exportToken(character, options, 'data:image/png;base64,abc', 'circle');
    expect(result).toMatch(/^data:/);
  });

  it('accepts hex shape parameter without throwing', async () => {
    const character = { archetypeId: 'STRONG', calculatedStats: {} } as any;
    const options = { format: 'png' as const, size: 512 as const, background: 'transparent' as const, borderColor: '#ef4444' };
    await expect(VTTService.exportToken(character, options, 'data:image/png;base64,abc', 'hex')).resolves.toMatch(/^data:/);
  });
});

describe('VTTService interface', () => {
  it('VTTTokenExport has borderColor and no border/shadow fields', () => {
    const options = {
      format: 'png' as const,
      size: 512 as const,
      background: 'transparent' as const,
      borderColor: '#f59e0b',
    };
    expect(options.borderColor).toBe('#f59e0b');
    expect((options as any).shadow).toBeUndefined();
    expect((options as any).border).toBeUndefined();
  });
});

const mockCharacter = {
  archetypeId: 'STRONG',
  calculatedStats: { power: 80, defense: 70, speed: 60, intelligence: 50, energy: 90, charisma: 40 },
  physicalAttributes: {},
  compatibility: {},
  lastUpdated: '',
  visualEffects: [],
} as any;

const mockRef = {
  current: {
    takeTokenScreenshot: vi.fn().mockResolvedValue('data:image/png;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'),
  },
};

describe('VTTExportModal wizard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders step 1 on open', () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    expect(screen.getByText(/VTT TOKEN/i)).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <VTTExportModal
        isOpen={false}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls captureScreenshot on open', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => {
      expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled();
    });
  });

  it('SIGUIENTE button is disabled while capturing', () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={{ current: { takeTokenScreenshot: () => new Promise(() => {}) } } as any}
      />
    );
    const btn = screen.getByText(/SIGUIENTE/i);
    expect(btn).toBeDisabled();
  });

  it('advances to step 2 after capture succeeds', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    expect(screen.getByText(/FORMA/i)).toBeInTheDocument();
    expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
  });

  it('step 2 shows circle and hex options', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    expect(screen.getByText(/CÍRCULO/i)).toBeInTheDocument();
    expect(screen.getByText(/HEXÁGONO/i)).toBeInTheDocument();
  });

  it('advances to step 3 from step 2', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    fireEvent.click(screen.getAllByText(/SIGUIENTE/i)[0]);
    expect(screen.getByText(/AJUSTES/i)).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 3/i)).toBeInTheDocument();
  });

  it('resets to step 1 when closed and reopened', async () => {
    const { rerender } = render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    expect(screen.getByText(/2 \/ 3/i)).toBeInTheDocument();
    // Close
    rerender(
      <VTTExportModal isOpen={false} onClose={vi.fn()} character={mockCharacter} onExportToken={vi.fn()} />
    );
    // Reopen
    rerender(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <VTTExportModal
        isOpen={true}
        onClose={onClose}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    fireEvent.click(container.firstChild as Element);
    expect(onClose).toHaveBeenCalled();
  });

  it('download button is disabled without a screenshot', async () => {
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={{ current: { takeTokenScreenshot: vi.fn().mockResolvedValue(null) } } as any}
      />
    );
    // advance past capture error to step 3
    await waitFor(() => screen.getByText(/RECAPTURAR/i));
    // captureError true, so SIGUIENTE is enabled
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    fireEvent.click(screen.getAllByText(/SIGUIENTE/i)[0]);
    const downloadBtn = screen.getByText(/DESCARGAR TOKEN/i);
    expect(downloadBtn).toBeDisabled();
  });

  it('calls onExportToken after successful download', async () => {
    const onExportToken = vi.fn();
    const exportTokenSpy = vi.spyOn(VTTService, 'exportToken').mockResolvedValue('data:image/png;base64,result');
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={onExportToken}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    fireEvent.click(screen.getAllByText(/SIGUIENTE/i)[0]);
    fireEvent.click(screen.getByText(/DESCARGAR TOKEN/i));
    await waitFor(() => expect(onExportToken).toHaveBeenCalledWith('png', 512));
    exportTokenSpy.mockRestore();
  });

  it('shows export error when VTTService.exportToken rejects', async () => {
    const exportTokenSpy = vi.spyOn(VTTService, 'exportToken').mockRejectedValue(new Error('canvas error'));
    render(
      <VTTExportModal
        isOpen={true}
        onClose={vi.fn()}
        character={mockCharacter}
        onExportToken={vi.fn()}
        characterViewerRef={mockRef as any}
      />
    );
    await waitFor(() => expect(mockRef.current.takeTokenScreenshot).toHaveBeenCalled());
    fireEvent.click(screen.getByText(/SIGUIENTE/i));
    fireEvent.click(screen.getAllByText(/SIGUIENTE/i)[0]);
    fireEvent.click(screen.getByText(/DESCARGAR TOKEN/i));
    await waitFor(() => expect(screen.getByText(/Error al generar/i)).toBeInTheDocument());
    exportTokenSpy.mockRestore();
  });
});
