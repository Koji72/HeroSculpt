/**
 * Configuración robusta para redirección de email
 * Maneja diferentes entornos y dominios de manera específica
 */

// Detectar el entorno actual
const isDevelopment = import.meta.env.DEV;
const isVercel = window.location.hostname.includes('vercel.app');

// URLs específicas para cada entorno
const REDIRECT_URLS = {
  development: 'http://localhost:5177',
  production: 'https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app',
  // Agregar más dominios de producción si es necesario
  vercel: 'https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app'
};

/**
 * Obtiene la URL de redirección correcta para el entorno actual
 */
export function getEmailRedirectUrl(): string {
  // Si estamos en desarrollo
  if (isDevelopment) {
    return REDIRECT_URLS.development;
  }
  
  // Si estamos en Vercel
  if (isVercel) {
    return REDIRECT_URLS.vercel;
  }
  
  // Para otros entornos de producción, usar la URL de Vercel como fallback
  return REDIRECT_URLS.production;
}

/**
 * Obtiene la configuración completa para signUp
 */
export function getSignUpConfig() {
  return {
    emailRedirectTo: getEmailRedirectUrl()
  };
}

/**
 * Verifica si la configuración es correcta
 */
export function validateEmailRedirectConfig(): boolean {
  const redirectUrl = getEmailRedirectUrl();
  
  // Verificar que la URL sea válida
  if (!redirectUrl || redirectUrl === '') {
    console.error('❌ Email redirect URL is empty or invalid');
    return false;
  }
  
  // Verificar que sea una URL válida
  try {
    new URL(redirectUrl);
  } catch (error) {
    console.error('❌ Email redirect URL is not a valid URL:', redirectUrl);
    return false;
  }
  
  console.log('✅ Email redirect URL is valid:', redirectUrl);
  return true;
}

/**
 * Log de información de debug
 */
export function logEmailRedirectInfo(): void {
  console.log('🔧 Email Redirect Configuration:');
  console.log('  - Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('  - Hostname:', window.location.hostname);
  console.log('  - Is Vercel:', isVercel);
  console.log('  - Redirect URL:', getEmailRedirectUrl());
  console.log('  - Current Origin:', window.location.origin);
}
