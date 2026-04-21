import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { LangProvider } from './lib/i18n';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LangProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </LangProvider>
  </React.StrictMode>
); 