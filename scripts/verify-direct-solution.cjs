#!/usr/bin/env node

/**
 * 🧪 Script de Verificación DIRECTA: Solución Simple
 * 
 * Este script verifica que se aplicó la solución directa
 * sin contenedores innecesarios.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación DIRECTA: Solución simple...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

console.log('📋 VERIFICACIÓN DIRECTA:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar que NO haya contenedor interno
const noInnerContainer = !headquartersContent.includes('bg-slate-900 w-full h-full overflow-y-auto border border-slate-700') &&
                        headquartersContent.includes('fixed top-0 left-0 right-0 bottom-0 bg-slate-900');

if (noInnerContainer) {
  console.log('✅ NO hay contenedor interno innecesario');
} else {
  console.log('❌ SÍ hay contenedor interno innecesario');
}

// Verificar que el modal principal ocupe todo el viewport
const modalFullViewport = headquartersContent.includes('width: \'100vw\'') &&
                         headquartersContent.includes('height: \'100vh\'') &&
                         headquartersContent.includes('fixed top-0 left-0 right-0 bottom-0');

if (modalFullViewport) {
  console.log('✅ Modal principal ocupa todo el viewport');
} else {
  console.log('❌ Modal principal NO ocupa todo el viewport');
}

// Verificar que el header esté pegado al borde superior
const headerSticky = headquartersContent.includes('Header') &&
                    headquartersContent.includes('margin: 0, padding: 0') &&
                    headquartersContent.includes('width: \'100%\'');

if (headerSticky) {
  console.log('✅ Header pegado al borde superior');
} else {
  console.log('❌ Header NO está pegado al borde superior');
}

// Verificar que no haya padding excesivo
const paddingElements = (headquartersContent.match(/p-[0-9]/g) || []).length;
const paddingMinimal = paddingElements <= 20;

if (paddingMinimal) {
  console.log(`✅ Padding mínimo (${paddingElements} elementos)`);
} else {
  console.log(`❌ Padding excesivo (${paddingElements} elementos)`);
}

console.log('\n📋 RESUMEN DE VERIFICACIÓN DIRECTA:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  noInnerContainer,
  modalFullViewport,
  headerSticky,
  paddingMinimal
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN DIRECTA EXITOSA');
  console.log('✅ Se eliminó el contenedor innecesario');
  console.log('✅ El modal ocupa todo el viewport');
  console.log('✅ El header está pegado al borde superior');
  console.log('✅ NO debería haber espacio excesivo');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN DIRECTA FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar la solución DIRECTA:');
console.log('1. Abrir http://localhost:5178');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya espacio excesivo arriba');
console.log('4. Verificar que el contenido esté pegado al borde superior');
console.log('5. Verificar que el modal ocupe toda la pantalla'); 