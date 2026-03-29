import React, { useState } from 'react';
import { EmailService } from '../services/emailService';

interface GuestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmitted: (email: string) => void;
  totalPrice: number;
  isLoading?: boolean;
}

const GuestEmailModal: React.FC<GuestEmailModalProps> = ({
  isOpen,
  onClose,
  onEmailSubmitted,
  totalPrice,
  isLoading = false
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Limpiar error si el email es válido
    if (emailError && EmailService.isValidEmail(newEmail)) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }

    if (!EmailService.isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);
    setEmailError('');

    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      onEmailSubmitted(email);
    } catch (error) {
      setEmailError('Error processing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isLoading) {
      setEmail('');
      setEmailError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="panel-box" style={{ width: 420, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="panel-header">
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>ADD EMAIL</span>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
        </div>
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1, background: 'var(--color-surface)' }}>
          {/* Info Section */}
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 8 }}>
              Guest User? No problem — we'll send your configuration by email.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>${totalPrice.toFixed(2)} USD</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
              <span>Includes:</span>
              <span>Download links (7 days)</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="guest-email" style={{ display: 'block', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text)', marginBottom: 6, fontWeight: 600 }}>
              Your Email
            </label>
            <div style={{ position: 'relative', marginBottom: emailError ? 24 : 12 }}>
              <input
                id="guest-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@email.com"
                style={{ width: '100%', background: 'var(--color-surface-2)', border: `1.5px solid ${emailError ? '#ef4444' : 'var(--color-border-strong)'}`, borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
                disabled={isSubmitting || isLoading}
                autoComplete="email"
                autoFocus
              />
              {emailError && (
                <div style={{ position: 'absolute', bottom: -20, left: 0, fontSize: 12, color: '#ef4444', fontFamily: 'var(--font-body)' }}>
                  {emailError}
                </div>
              )}
            </div>

            {/* Benefits */}
            <div style={{ background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: 12, marginTop: 8 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: 6 }}>You'll receive by email:</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
                <li style={{ marginBottom: 3 }}>• Complete superhero configuration</li>
                <li style={{ marginBottom: 3 }}>• Direct download links (GLB/STL)</li>
                <li style={{ marginBottom: 3 }}>• 7-day access to re-download</li>
                <li>• Invitation to create free account</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting || isLoading}
                style={{ flex: 1, padding: '10px', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer', opacity: isSubmitting || isLoading ? 0.5 : 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isLoading || !email.trim()}
                className="btn-comic btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: 14, letterSpacing: 2 }}
              >
                {isSubmitting || isLoading ? 'Sending...' : 'SEND EMAIL'}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)' }}>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
              Tip: Create a free account to permanently save your configurations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestEmailModal;
