import React, { useState } from 'react';
import { SparklesIcon } from './icons';

interface AiDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => Promise<void>;
}

const AiDesignerModal: React.FC<AiDesignerModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateClick = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await onGenerate(prompt.trim());
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerateClick();
    }
  };

  const examplePrompts = [
    "A dark, intimidating knight with heavy armor",
    "Speedy, agile hero with light armor",
    "A royal guard with golden armor and cape",
    "A rugged space pirate without a cape",
    "A mystical warrior with glowing elements",
    "A stealthy ninja with dark colors",
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel-box" style={{ width: 560, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="panel-header">
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>AI DESIGNER</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
        </div>
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1, background: 'var(--color-surface)' }}>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="ai-prompt" style={{ display: 'block', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-text)', marginBottom: 6, fontWeight: 600 }}>
              Character Description
            </label>
            <textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="e.g., 'Create a dark, intimidating knight with heavy armor and a tattered cape...'"
              style={{ width: '100%', background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '8px 12px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', outline: 'none', resize: 'none', height: 112, boxSizing: 'border-box' }}
              disabled={isLoading}
            />
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
              Press Ctrl+Enter (or Cmd+Enter) to generate
            </p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', marginBottom: 8 }}>Or try an example:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {examplePrompts.map((examplePrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(examplePrompt)}
                  disabled={isLoading}
                  style={{ fontSize: 12, background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-strong)', borderRadius: 'var(--radius)', padding: '4px 10px', color: 'var(--color-text)', fontFamily: 'var(--font-body)', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1 }}
                >
                  {examplePrompt}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--color-surface-2)', border: '1.5px solid #ef4444', borderRadius: 'var(--radius)', padding: '8px 12px', color: '#ef4444', fontFamily: 'var(--font-body)', fontSize: 13, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerateClick}
            disabled={!prompt.trim() || isLoading}
            className="btn-comic btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: 16, letterSpacing: 2, marginTop: 12 }}
          >
            {isLoading ? (
              'Generating...'
            ) : (
              'GENERATE BUILD'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiDesignerModal;
