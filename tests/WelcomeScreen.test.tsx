import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import WelcomeScreen from '../components/WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders nothing when isOpen=false', () => {
    const { container } = render(
      <WelcomeScreen isOpen={false} userEmail="x@x.com" onClose={vi.fn()} onOpenLibrary={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows user email when open', () => {
    render(<WelcomeScreen isOpen={true} userEmail="hero@mail.com" onClose={vi.fn()} onOpenLibrary={vi.fn()} />);
    expect(screen.getByText(/hero@mail.com/i)).toBeInTheDocument();
  });

  it('shows 3 feature cards', () => {
    render(<WelcomeScreen isOpen={true} userEmail="x@x.com" onClose={vi.fn()} onOpenLibrary={vi.fn()} />);
    expect(screen.getByText(/LIBRERÍA DESBLOQUEADA/i)).toBeInTheDocument();
    expect(screen.getByText(/POSES DESBLOQUEADAS/i)).toBeInTheDocument();
    expect(screen.getByText(/GUARDAR CONFIGURACIONES/i)).toBeInTheDocument();
  });

  it('calls onClose when CONTINUAR is clicked', () => {
    const onClose = vi.fn();
    render(<WelcomeScreen isOpen={true} userEmail="x@x.com" onClose={onClose} onOpenLibrary={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /CONTINUAR/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenLibrary and onClose when VER is clicked', () => {
    const onClose = vi.fn();
    const onOpenLibrary = vi.fn();
    render(<WelcomeScreen isOpen={true} userEmail="x@x.com" onClose={onClose} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByRole('button', { name: /VER →/i }));
    expect(onOpenLibrary).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<WelcomeScreen isOpen={true} userEmail="x@x.com" onClose={onClose} onOpenLibrary={vi.fn()} />);
    const backdrop = screen.getByTestId('welcome-backdrop');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
