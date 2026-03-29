import React, { Component, ReactNode } from 'react';
import { XMarkIcon, ArrowPathIcon } from './icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-red-500/10 rounded-full animate-ping"></div>
              <div className="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center relative z-10">
                <XMarkIcon className="w-12 h-12 text-red-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-red-400 mb-3 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              Something went wrong
            </h2>
            
            <p className="text-slate-400 mb-6 font-medium">
              An unexpected error occurred while loading this component.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-red-500/30 text-left">
                <summary className="text-red-400 font-bold cursor-pointer mb-2">
                  Error Details (Development)
                </summary>
                <div className="text-xs text-slate-300 font-mono">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 text-xs overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-sm uppercase tracking-wider rounded-md relative overflow-hidden group mx-auto"
              style={{ 
                fontFamily: 'var(--font-comic), system-ui',
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                transition: 'background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
                willChange: 'background, transform, box-shadow'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, rgb(239 68 68), rgb(248 113 113))';
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(239 68 68, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, rgb(220 38 38), rgb(239 68 68))';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-200" />
              <ArrowPathIcon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 