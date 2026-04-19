// 🎯 Configuración de Sistema de Pagos
// Este archivo controla si el sistema está en modo GRATIS o PAGOS REALES

export const PAYMENT_CONFIG = {
  // 🎁 MODO GRATIS (actualmente activo)
  FREE_MODE: {
    enabled: true,
    description: 'Todos los modelos son gratuitos',
    userMessage: '🎁 ¡Descarga gratuita para usuarios registrados!',
    guestMessage: '📧 ¡Descarga gratuita enviada por email!',
    buttonText: '🎁 Obtener GRATIS',
    priceDisplay: '🎁 GRATIS'
  },

  // 💳 MODO PAGOS (preparado para futuro)
  PAID_MODE: {
    enabled: false, // Cambiar a true para activar pagos
    description: 'Modelos con precio real',
    userMessage: '💳 Procesando pago con Stripe...',
    guestMessage: '💳 Procesando pago como invitado...',
    buttonText: '💳 Comprar Ahora',
    priceDisplay: '$$' // Mostrar precio real
  },

  // 🔧 Configuración de Stripe (siempre preparado)
  STRIPE: {
    enabled: true, // Stripe siempre configurado
    testMode: true, // Usar modo de prueba
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
  }
};

// 🎯 Función para verificar el modo actual
export const getPaymentMode = () => {
  return PAYMENT_CONFIG.FREE_MODE.enabled ? 'FREE' : 'PAID';
};

// 🎯 Función para obtener mensaje según el modo
export const getPaymentMessage = (isAuthenticated: boolean) => {
  const mode = getPaymentMode();
  
  if (mode === 'FREE') {
    return isAuthenticated 
      ? PAYMENT_CONFIG.FREE_MODE.userMessage
      : PAYMENT_CONFIG.FREE_MODE.guestMessage;
  } else {
    return isAuthenticated
      ? PAYMENT_CONFIG.PAID_MODE.userMessage
      : PAYMENT_CONFIG.PAID_MODE.guestMessage;
  }
};

// 🎯 Function to get button text
export const getButtonText = () => {
  const mode = getPaymentMode();
  return mode === 'FREE' 
    ? PAYMENT_CONFIG.FREE_MODE.buttonText
    : PAYMENT_CONFIG.PAID_MODE.buttonText;
};

// 🎯 Función para mostrar precio
export const getPriceDisplay = (price: number) => {
  const mode = getPaymentMode();
  return mode === 'FREE' 
    ? PAYMENT_CONFIG.FREE_MODE.priceDisplay
    : `$${price.toFixed(2)}`;
};

// 🎯 Función para activar pagos reales (para futuro)
export const enablePaidMode = () => {
  PAYMENT_CONFIG.FREE_MODE.enabled = false;
  PAYMENT_CONFIG.PAID_MODE.enabled = true;
  if (import.meta.env.DEV) console.log('💳 Modo de pagos activado');
};

// 🎯 Función para activar modo gratis
export const enableFreeMode = () => {
  PAYMENT_CONFIG.FREE_MODE.enabled = true;
  PAYMENT_CONFIG.PAID_MODE.enabled = false;
  if (import.meta.env.DEV) console.log('🎁 Modo gratis activado');
};

// 🎯 Función para verificar si Stripe está configurado
export const isStripeConfigured = () => {
  return PAYMENT_CONFIG.STRIPE.enabled && 
         PAYMENT_CONFIG.STRIPE.publishableKey !== '';
};

export default PAYMENT_CONFIG; 
