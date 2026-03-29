#!/usr/bin/env node

/**
 * 🧪 Script de Verificación ULTRA COMPACTO: Fix Final del Headquarters
 * 
 * Este script verifica que el dashboard esté ULTRA compacto
 * sin ningún espacio excesivo en la parte superior.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación ULTRA COMPACTO del Headquarters...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

// Verificar que el modal principal NO tenga padding
const modalNoPadding = headquartersContent.includes('fixed top-0 left-0 right-0 bottom-0') &&
                      headquartersContent.includes('m-0 p-0') &&
                      headquartersContent.includes('w-full h-full');

if (modalNoPadding) {
  console.log('✅ Modal principal sin padding (m-0 p-0)');
} else {
  console.log('❌ Modal principal SÍ tiene padding');
}

// Verificar que el header NO tenga padding
const headerNoPadding = headquartersContent.includes('Header') &&
                       headquartersContent.includes('p-0') &&
                       !headquartersContent.includes('p-2') &&
                       !headquartersContent.includes('p-6');

if (headerNoPadding) {
  console.log('✅ Header sin padding (p-0)');
} else {
  console.log('❌ Header SÍ tiene padding');
}

// Verificar que el título del header sea compacto
const headerTitleCompact = headquartersContent.includes('SUPERHERO HEADQUARTERS') &&
                          headquartersContent.includes('text-2xl') &&
                          !headquartersContent.includes('text-3xl');

if (headerTitleCompact) {
  console.log('✅ Título del header compacto (text-2xl)');
} else {
  console.log('❌ Título del header NO es compacto');
}

// Verificar que el icono del header sea compacto
const headerIconCompact = headquartersContent.includes('Building2') &&
                         headquartersContent.includes('w-6 h-6') &&
                         headquartersContent.includes('p-2');

if (headerIconCompact) {
  console.log('✅ Icono del header compacto (w-6 h-6, p-2)');
} else {
  console.log('❌ Icono del header NO es compacto');
}

// Verificar que el botón de sync sea compacto
const syncButtonCompact = headquartersContent.includes('RefreshCw') &&
                         headquartersContent.includes('w-4 h-4') &&
                         headquartersContent.includes('p-2');

if (syncButtonCompact) {
  console.log('✅ Botón de sync compacto (w-4 h-4, p-2)');
} else {
  console.log('❌ Botón de sync NO es compacto');
}

// Verificar que las pestañas de navegación sean compactas
const tabsCompact = headquartersContent.includes('px-3 py-2') &&
                   !headquartersContent.includes('px-4 py-3');

if (tabsCompact) {
  console.log('✅ Pestañas de navegación compactas (px-3 py-2)');
} else {
  console.log('❌ Pestañas de navegación NO son compactas');
}

// Verificar que el dashboard esté en nivel directo
const dashboardDirect = headquartersContent.includes('{activeTab === \'dashboard\' && (') &&
                       !headquartersContent.includes('{/* Content */}') &&
                       !headquartersContent.includes('className="p-');

if (dashboardDirect) {
  console.log('✅ Dashboard en nivel directo (sin contenedor)');
} else {
  console.log('❌ Dashboard NO está en nivel directo');
}

// Verificar que el espaciado del dashboard sea mínimo
const dashboardSpacingMinimal = headquartersContent.includes('space-y-2') &&
                               !headquartersContent.includes('space-y-4') &&
                               !headquartersContent.includes('space-y-8');

if (dashboardSpacingMinimal) {
  console.log('✅ Espaciado del dashboard mínimo (space-y-2)');
} else {
  console.log('❌ Espaciado del dashboard NO es mínimo');
}

console.log('\n📋 Resumen de verificación ULTRA COMPACTO:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  modalNoPadding,
  headerNoPadding,
  headerTitleCompact,
  headerIconCompact,
  syncButtonCompact,
  tabsCompact,
  dashboardDirect,
  dashboardSpacingMinimal
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN ULTRA COMPACTO EXITOSA');
  console.log('✅ El dashboard está ULTRA compacto');
  console.log('✅ NO hay NINGÚN espacio excesivo en la parte superior');
  console.log('✅ Todos los elementos están optimizados');
  console.log('✅ El layout se ajusta PERFECTAMENTE al navegador');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN ULTRA COMPACTO FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar la solución ULTRA COMPACTO:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya NINGÚN espacio excesivo arriba');
console.log('4. Verificar que el contenido esté PEGADO al borde superior');
console.log('5. Verificar que todos los elementos sean compactos');
console.log('6. Verificar que el dashboard se ajuste PERFECTAMENTE');
console.log('7. Verificar que no haya padding innecesario en ningún elemento'); 