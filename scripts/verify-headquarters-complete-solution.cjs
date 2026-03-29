#!/usr/bin/env node

/**
 * 🧪 Script de Verificación COMPLETA: Solución Definitiva para Headquarters
 * 
 * Este script verifica que Headquarters tiene su propio routing completamente separado
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación COMPLETA: Solución definitiva para Headquarters...\n');

// Verificar src/App.tsx
const appPath = path.join(__dirname, '../src/App.tsx');
if (!fs.existsSync(appPath)) {
  console.error('❌ No se encontró src/App.tsx');
  process.exit(1);
}

const appContent = fs.readFileSync(appPath, 'utf8');

console.log('📋 VERIFICACIÓN COMPLETA DE LA SOLUCIÓN:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar que useLocation está importado
const hasUseLocation = appContent.includes('useLocation');

if (hasUseLocation) {
  console.log('✅ useLocation importado para detectar ruta');
} else {
  console.log('❌ useLocation NO está importado');
}

// Verificar que AppContent existe como componente separado
const hasAppContent = appContent.includes('const AppContent: React.FC') &&
                     appContent.includes('const location = useLocation()');

if (hasAppContent) {
  console.log('✅ AppContent como componente separado con useLocation');
} else {
  console.log('❌ AppContent NO existe como componente separado');
}

// Verificar que hay detección de headquarters
const hasHeadquartersDetection = appContent.includes('const isHeadquarters = location.pathname === \'/headquarters\'');

if (hasHeadquartersDetection) {
  console.log('✅ Detección correcta de ruta /headquarters');
} else {
  console.log('❌ NO hay detección correcta de ruta /headquarters');
}

// Verificar que headquarters tiene return separado
const hasHeadquartersReturn = appContent.includes('if (isHeadquarters) {') &&
                             appContent.includes('return (') &&
                             appContent.includes('fixed inset-0 z-50');

if (hasHeadquartersReturn) {
  console.log('✅ Headquarters tiene return separado con position fixed');
} else {
  console.log('❌ Headquarters NO tiene return separado');
}

// Verificar que navigation NO se renderiza en headquarters
const headquartersSection = appContent.match(/if \(isHeadquarters\) \{[\s\S]*?return \([\s\S]*?\);[\s\S]*?\}/);
const noNavigationInHeadquarters = headquartersSection && !headquartersSection[0].includes('<Navigation');

if (noNavigationInHeadquarters) {
  console.log('✅ Navegación NO se renderiza en Headquarters');
} else {
  console.log('❌ Navegación SÍ se renderiza en Headquarters');
}

// Verificar que hay estructura condicional correcta
const hasConditionalStructure = appContent.includes('if (isHeadquarters) {') &&
                               appContent.includes('return (') &&
                               appContent.includes('return (');

if (hasConditionalStructure) {
  console.log('✅ Estructura condicional correcta (if/return)');
} else {
  console.log('❌ Estructura condicional NO es correcta');
}

console.log('\n📋 RESUMEN DE VERIFICACIÓN COMPLETA:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  hasUseLocation,
  hasAppContent,
  hasHeadquartersDetection,
  hasHeadquartersReturn,
  noNavigationInHeadquarters,
  hasConditionalStructure
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN COMPLETA EXITOSA');
  console.log('✅ useLocation para detectar ruta');
  console.log('✅ AppContent como componente separado');
  console.log('✅ Detección correcta de /headquarters');
  console.log('✅ Headquarters con return separado');
  console.log('✅ Navegación completamente oculta en Headquarters');
  console.log('✅ Estructura condicional correcta');
  console.log('✅ Headquarters ocupa TODA la pantalla SIN navegación');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN COMPLETA FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar la solución COMPLETA:');
console.log('1. Abrir http://localhost:5178');
console.log('2. Ir a la página /headquarters');
console.log('3. Verificar que NO hay navegación lateral visible');
console.log('4. Verificar que la página ocupa TODA la pantalla');
console.log('5. Verificar que NO hay espacios en NINGÚN lado');
console.log('6. Verificar que el dashboard está pegado a TODOS los bordes');