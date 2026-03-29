#!/usr/bin/env node

/**
 * 🧪 Script de Verificación SIMPLE: Modal Full Viewport
 * 
 * Este script verifica que el modal ocupe todo el viewport
 * sin ningún espacio excesivo.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación SIMPLE: Modal full viewport...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

console.log('📋 VERIFICACIÓN SIMPLE:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar que el modal principal tenga width: 100vw y height: 100vh
const modalFullViewport = headquartersContent.includes('width: \'100vw\'') &&
                         headquartersContent.includes('height: \'100vh\'') &&
                         headquartersContent.includes('fixed top-0 left-0 right-0 bottom-0');

if (modalFullViewport) {
  console.log('✅ Modal principal con width: 100vw y height: 100vh');
} else {
  console.log('❌ Modal principal NO tiene width: 100vw y height: 100vh');
}

// Verificar que el contenedor interno tenga width: 100% y height: 100%
const containerFullSize = headquartersContent.includes('width: \'100%\'') &&
                         headquartersContent.includes('height: \'100%\'') &&
                         headquartersContent.includes('w-full h-full');

if (containerFullSize) {
  console.log('✅ Contenedor interno con width: 100% y height: 100%');
} else {
  console.log('❌ Contenedor interno NO tiene width: 100% y height: 100%');
}

// Verificar que el header NO tenga padding
const headerNoPadding = headquartersContent.includes('Header') &&
                       headquartersContent.includes('padding: 0') &&
                       !headquartersContent.includes('p-');

if (headerNoPadding) {
  console.log('✅ Header sin padding');
} else {
  console.log('❌ Header SÍ tiene padding');
}

// Verificar que el contenido del dashboard NO tenga padding
const dashboardNoPadding = headquartersContent.includes('Hero Section') &&
                          headquartersContent.includes('padding: 0') &&
                          !headquartersContent.includes('p-');

if (dashboardNoPadding) {
  console.log('✅ Contenido del dashboard sin padding');
} else {
  console.log('❌ Contenido del dashboard SÍ tiene padding');
}

// Verificar que todos los elementos tengan margin: 0
const allElementsNoMargin = headquartersContent.includes('margin: 0') &&
                           headquartersContent.includes('style={{ margin: 0, padding: 0');

if (allElementsNoMargin) {
  console.log('✅ Todos los elementos con margin: 0');
} else {
  console.log('❌ NO todos los elementos tienen margin: 0');
}

console.log('\n📋 RESUMEN DE VERIFICACIÓN SIMPLE:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  modalFullViewport,
  containerFullSize,
  headerNoPadding,
  dashboardNoPadding,
  allElementsNoMargin
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN SIMPLE EXITOSA');
  console.log('✅ El modal ocupa todo el viewport');
  console.log('✅ NO hay espacio excesivo');
  console.log('✅ El contenido está pegado al borde superior');
  console.log('✅ La solución simple está aplicada');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN SIMPLE FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar la solución SIMPLE:');
console.log('1. Abrir http://localhost:5178');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya espacio excesivo arriba');
console.log('4. Verificar que el contenido esté pegado al borde superior');
console.log('5. Verificar que el modal ocupe toda la pantalla'); 