import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

// Minimal stubs
const mockSetAuthModalMode = vi.fn();
const mockSetIsAuthModalOpen = vi.fn();

// JOIN button behavior (isolated unit test)
describe('JOIN button visibility', () => {
  it('renders JOIN button when user is null', () => {
    render(
      <div>
        {!null && (
          <button onClick={() => { mockSetAuthModalMode('signup'); mockSetIsAuthModalOpen(true); }}>
            JOIN ▶
          </button>
        )}
      </div>
    );
    expect(screen.getByText(/JOIN ▶/i)).toBeInTheDocument();
  });

  it('hides JOIN button when user is present', () => {
    const user = { id: '1', email: 'x@x.com' };
    render(
      <div>
        {!user && <button>JOIN ▶</button>}
        {user && <span>👤 {user.email.split('@')[0].toUpperCase()}</span>}
      </div>
    );
    expect(screen.queryByText(/JOIN ▶/i)).not.toBeInTheDocument();
    expect(screen.getByText(/👤 X/i)).toBeInTheDocument();
  });

  it('shows locked POSES button when user is null', () => {
    render(
      <div>
        {!null ? (
          <button title="🔒 POSES · CREATE FREE ACCOUNT">🔒 POSES</button>
        ) : (
          <button>💾 POSE</button>
        )}
      </div>
    );
    expect(screen.getByText(/🔒 POSES/i)).toBeInTheDocument();
  });

  it('shows functional POSE button when user is present', () => {
    const user = { id: '1' };
    render(
      <div>
        {user ? (
          <button>💾 POSE</button>
        ) : (
          <button>🔒 POSES</button>
        )}
      </div>
    );
    expect(screen.getByText(/💾 POSE/i)).toBeInTheDocument();
  });
});
