#!/usr/bin/env node

/**
 * 🎯 Script para Activar Pagos Reales
 * 
 * Este script activa el modo de pagos reales en el sistema.
 * Ejecutar cuando quieras cambiar de modo GRATIS a PAGOS.
 */

const fs = require('fs');
const path = require('path');

console.log('🎯 Activando Modo de Pagos Reales...\n');

// 1. Actualizar configuración de pagos
const paymentConfigPath = path.join(__dirname, '../config/payment-config.ts');
let paymentConfig = fs.readFileSync(paymentConfigPath, 'utf8');

// Cambiar modo gratis a false y pagos a true
paymentConfig = paymentConfig.replace(
  /FREE_MODE: \{\s*enabled: true,/,
  'FREE_MODE: {\n    enabled: false,'
);

paymentConfig = paymentConfig.replace(
  /PAID_MODE: \{\s*enabled: false,/,
  'PAID_MODE: {\n    enabled: true,'
);

fs.writeFileSync(paymentConfigPath, paymentConfig);
console.log('✅ Configuración de pagos actualizada');

// 2. Descomentar Stripe en App.tsx
const appPath = path.join(__dirname, '../App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Buscar y descomentar la sección de Stripe
const stripeSection = `    // 💳 STRIPE PREPARADO PARA FUTURO (comentado por ahora)
    /*
    try {
      const sessionId = await createStripeCheckoutSession(
        cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        user?.email || undefined
      );
      await redirectToCheckout(sessionId);
    } catch (error) {
      alert('Error al procesar el pago: ' + (error instanceof Error ? error.message : error));
    }
    */`;

const activeStripeSection = `    // 💳 STRIPE ACTIVO - Procesando pagos reales
    try {
      const sessionId = await createStripeCheckoutSession(
        cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        user?.email || undefined
      );
      await redirectToCheckout(sessionId);
    } catch (error) {
      alert('Error al procesar el pago: ' + (error instanceof Error ? error.message : error));
    }`;

appContent = appContent.replace(stripeSection, activeStripeSection);
fs.writeFileSync(appPath, appContent);
console.log('✅ Stripe activado en App.tsx');

// 3. Actualizar botones en ShoppingCart
const shoppingCartPath = path.join(__dirname, '../components/ShoppingCart.tsx');
let shoppingCartContent = fs.readFileSync(shoppingCartPath, 'utf8');

// Cambiar texto de botones
shoppingCartContent = shoppingCartContent.replace(
  /🎁 Obtener GRATIS/g,
  '💳 Comprar Ahora'
);

shoppingCartContent = shoppingCartContent.replace(
  /🎁 Descargar GRATIS/g,
  '💳 Comprar y Descargar'
);

shoppingCartContent = shoppingCartContent.replace(
  /🎁 GRATIS/g,
  '$$'
);

fs.writeFileSync(shoppingCartPath, shoppingCartContent);
console.log('✅ Botones actualizados en ShoppingCart');

// 4. Verificar variables de entorno
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (!envContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
    console.log('⚠️  ADVERTENCIA: VITE_STRIPE_PUBLISHABLE_KEY no encontrada en .env');
    console.log('   Configura tu clave pública de Stripe antes de activar pagos');
  }
  
  if (!envContent.includes('STRIPE_SECRET_KEY')) {
    console.log('⚠️  ADVERTENCIA: STRIPE_SECRET_KEY no encontrada en .env');
    console.log('   Configura tu clave secreta de Stripe antes de activar pagos');
  }
} else {
  console.log('⚠️  ADVERTENCIA: Archivo .env no encontrado');
  console.log('   Crea un archivo .env con las claves de Stripe');
}

console.log('\n🎉 ¡Modo de Pagos Activado!');
console.log('\n📋 Próximos pasos:');
console.log('1. Configura las claves de Stripe en .env');
console.log('2. Prueba el flujo de pagos en modo de desarrollo');
console.log('3. Configura webhooks de Stripe para producción');
console.log('4. Actualiza las URLs de éxito/cancelación');

console.log('\n🔄 Para volver al modo gratis, ejecuta:');
console.log('   node scripts/activate-free-mode.js'); 