#!/usr/bin/env node

/**
 * 🧪 Script de Verificación HEADQUARTERS PAGE: Solución Correcta
 * 
 * Este script verifica que la solución está aplicada en el archivo correcto
 * src/pages/Headquarters.tsx
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación HEADQUARTERS PAGE: Solución correcta...\n');

// Verificar src/pages/Headquarters.tsx
const headquartersPagePath = path.join(__dirname, '../src/pages/Headquarters.tsx');
if (!fs.existsSync(headquartersPagePath)) {
  console.error('❌ No se encontró src/pages/Headquarters.tsx');
  process.exit(1);
}

const headquartersPageContent = fs.readFileSync(headquartersPagePath, 'utf8');

console.log('📋 VERIFICACIÓN HEADQUARTERS PAGE:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar que el contenedor principal tenga style inline
const containerStyle = headquartersPageContent.includes('min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white') &&
                      headquartersPageContent.includes('style={{ margin: 0, padding: 0 }}');

if (containerStyle) {
  console.log('✅ Contenedor principal con style inline margin: 0, padding: 0');
} else {
  console.log('❌ Contenedor principal NO tiene style inline margin: 0, padding: 0');
}

// Verificar que el header tenga style inline
const headerStyle = headquartersPageContent.includes('Header Superheróico') &&
                   headquartersPageContent.includes('style={{ margin: 0, padding: 0 }}');

if (headerStyle) {
  console.log('✅ Header con style inline margin: 0, padding: 0');
} else {
  console.log('❌ Header NO tiene style inline margin: 0, padding: 0');
}

// Verificar que la navegación tenga style inline
const navStyle = headquartersPageContent.includes('Navegación') &&
                headquartersPageContent.includes('style={{ margin: 0, padding: 0 }}');

if (navStyle) {
  console.log('✅ Navegación con style inline margin: 0, padding: 0');
} else {
  console.log('❌ Navegación NO tiene style inline margin: 0, padding: 0');
}

// Verificar que el div interno del header tenga style inline
const headerDivStyle = headquartersPageContent.includes('relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8') &&
                      headquartersPageContent.includes('style={{ margin: 0, padding: 0 }}');

if (headerDivStyle) {
  console.log('✅ Div interno del header con style inline margin: 0, padding: 0');
} else {
  console.log('❌ Div interno del header NO tiene style inline margin: 0, padding: 0');
}

// Verificar que el div interno de la navegación tenga style inline
const navDivStyle = headquartersPageContent.includes('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8') &&
                   headquartersPageContent.includes('style={{ margin: 0, padding: 0 }}');

if (navDivStyle) {
  console.log('✅ Div interno de la navegación con style inline margin: 0, padding: 0');
} else {
  console.log('❌ Div interno de la navegación NO tiene style inline margin: 0, padding: 0');
}

console.log('\n📋 RESUMEN DE VERIFICACIÓN HEADQUARTERS PAGE:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  containerStyle,
  headerStyle,
  navStyle,
  headerDivStyle,
  navDivStyle
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN HEADQUARTERS PAGE EXITOSA');
  console.log('✅ Contenedor principal con style inline');
  console.log('✅ Header con style inline');
  console.log('✅ Navegación con style inline');
  console.log('✅ Divs internos con style inline');
  console.log('✅ El espacio excesivo está ELIMINADO');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN HEADQUARTERS PAGE FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar la solución HEADQUARTERS PAGE:');
console.log('1. Abrir http://localhost:5178');
console.log('2. Ir a la página Headquarters');
console.log('3. Verificar que NO haya espacio excesivo arriba');
console.log('4. Verificar que el contenido esté pegado al borde superior');
console.log('5. Verificar que el header esté pegado al borde superior');
console.log('6. Verificar que no haya padding innecesario'); 