#!/usr/bin/env node

/**
 * 🎁 Script para Activar Modo Gratis
 * 
 * Este script activa el modo gratis en el sistema.
 * Ejecutar cuando quieras cambiar de modo PAGOS a GRATIS.
 */

const fs = require('fs');
const path = require('path');

console.log('🎁 Activando Modo Gratis...\n');

// 1. Actualizar configuración de pagos
const paymentConfigPath = path.join(__dirname, '../config/payment-config.ts');
let paymentConfig = fs.readFileSync(paymentConfigPath, 'utf8');

// Cambiar modo pagos a false y gratis a true
paymentConfig = paymentConfig.replace(
  /FREE_MODE: \{\s*enabled: false,/,
  'FREE_MODE: {\n    enabled: true,'
);

paymentConfig = paymentConfig.replace(
  /PAID_MODE: \{\s*enabled: true,/,
  'PAID_MODE: {\n    enabled: false,'
);

fs.writeFileSync(paymentConfigPath, paymentConfig);
console.log('✅ Configuración de modo gratis actualizada');

// 2. Comentar Stripe en App.tsx
const appPath = path.join(__dirname, '../App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Buscar y comentar la sección de Stripe
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

const commentedStripeSection = `    // 💳 STRIPE PREPARADO PARA FUTURO (comentado por ahora)
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

appContent = appContent.replace(activeStripeSection, commentedStripeSection);
fs.writeFileSync(appPath, appContent);
console.log('✅ Stripe comentado en App.tsx');

// 3. Actualizar botones en ShoppingCart
const shoppingCartPath = path.join(__dirname, '../components/ShoppingCart.tsx');
let shoppingCartContent = fs.readFileSync(shoppingCartPath, 'utf8');

// Cambiar texto de botones
shoppingCartContent = shoppingCartContent.replace(
  /💳 Comprar Ahora/g,
  '🎁 Obtener GRATIS'
);

shoppingCartContent = shoppingCartContent.replace(
  /💳 Comprar y Descargar/g,
  '🎁 Descargar GRATIS'
);

shoppingCartContent = shoppingCartContent.replace(
  /\$\$/g,
  '🎁 GRATIS'
);

fs.writeFileSync(shoppingCartPath, shoppingCartContent);
console.log('✅ Botones actualizados en ShoppingCart');

console.log('\n🎉 ¡Modo Gratis Activado!');
console.log('\n📋 Estado actual:');
console.log('✅ Todos los modelos son gratuitos');
console.log('✅ Usuarios registrados: Descarga directa');
console.log('✅ Usuarios invitados: Descarga por email');
console.log('✅ Stripe configurado pero desactivado');

console.log('\n🔄 Para activar pagos reales, ejecuta:');
console.log('   node scripts/activate-payments.js'); 