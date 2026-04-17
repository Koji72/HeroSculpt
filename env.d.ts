/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
  readonly VITE_BACKEND_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const gtag:
  | ((command: 'event', event: string, data?: Record<string, any>) => void)
  | undefined;
declare const mixpanel:
  | { track: (event: string, data?: Record<string, any>) => void }
  | undefined;
declare const amplitude:
  | { getInstance: () => { logEvent: (event: string, data?: Record<string, any>) => void } }
  | undefined;

declare module "*.png"; 
