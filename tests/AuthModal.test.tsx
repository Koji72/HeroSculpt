import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthModal from '../components/AuthModal';

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
  },
}));

import { supabase } from '../lib/supabase';

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('renders signup mode by default', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText(/ÚNETE AL ESCUADRÓN/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CREAR CUENTA/i })).toBeInTheDocument();
  });

  it('renders signin mode when initialMode="signin"', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} initialMode="signin" />);
    expect(screen.getByText(/BIENVENIDO DE VUELTA/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ENTRAR/i })).toBeInTheDocument();
  });

  it('toggles from signup to signin via link', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText(/INICIAR SESIÓN/i));
    expect(screen.getByText(/BIENVENIDO DE VUELTA/i)).toBeInTheDocument();
  });

  it('sets sessionStorage just_registered on successful signup', async () => {
    (supabase!.auth.signUp as any).mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /CREAR CUENTA/i }));
    await waitFor(() => {
      expect(sessionStorage.getItem('just_registered')).toBe('1');
    });
  });

  it('does NOT set sessionStorage on signin', async () => {
    (supabase!.auth.signInWithPassword as any).mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    render(<AuthModal isOpen={true} onClose={vi.fn()} initialMode="signin" />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /ENTRAR/i }));
    await waitFor(() => {
      expect(supabase!.auth.signInWithPassword).toHaveBeenCalled();
    });
    expect(sessionStorage.getItem('just_registered')).toBeNull();
  });

  it('shows inline error on failed signup', async () => {
    (supabase!.auth.signUp as any).mockResolvedValue({ data: null, error: { message: 'Email already in use' } });
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /CREAR CUENTA/i }));
    await waitFor(() => {
      expect(screen.getByText(/Email already in use/i)).toBeInTheDocument();
    });
  });

  it('does NOT call onClose after successful auth', async () => {
    (supabase!.auth.signUp as any).mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    const onClose = vi.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /CREAR CUENTA/i }));
    await waitFor(() => {
      expect(supabase!.auth.signUp).toHaveBeenCalled();
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
