/**
 * Email redirect configuration for auth flows.
 * Always uses window.location.origin so the redirect works on any domain
 * (localhost, staging, production) without hardcoded URLs.
 */

/**
 * Returns the redirect URL for the current environment.
 */
export function getEmailRedirectUrl(): string {
  return window.location.origin;
}

/**
 * Obtiene la configuración completa para signUp
 */
export function getSignUpConfig() {
  return {
    emailRedirectTo: getEmailRedirectUrl()
  };
}

/** @deprecated No longer needed — redirect URL is always window.location.origin. */
export function logEmailRedirectInfo(): void {
  if (import.meta.env.DEV) {
    console.log('Email redirect URL:', getEmailRedirectUrl());
  }
}
