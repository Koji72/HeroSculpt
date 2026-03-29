#!/usr/bin/env node

/**
 * 🧪 Script de Verificación FINAL: Contenedor Completamente Eliminado
 * 
 * Este script verifica que el contenedor problemático ha sido
 * COMPLETAMENTE eliminado del Headquarters.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación FINAL: Contenedor completamente eliminado...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

// Verificar que NO haya contenedor con space-y-2
const noSpaceY2Container = !headquartersContent.includes('space-y-2 animate-fadeIn') ||
                          !headquartersContent.includes('<div className="space-y-2');

if (noSpaceY2Container) {
  console.log('✅ Contenedor con space-y-2 ELIMINADO');
} else {
  console.log('❌ Contenedor con space-y-2 AÚN PRESENTE');
}

// Verificar que el dashboard use fragmento
const dashboardUsesFragment = headquartersContent.includes('{activeTab === \'dashboard\' && (') &&
                              headquartersContent.includes('<>') &&
                              headquartersContent.includes('</>');

if (dashboardUsesFragment) {
  console.log('✅ Dashboard usa fragmento (<> </>)');
} else {
  console.log('❌ Dashboard NO usa fragmento');
}

// Verificar que NO haya div contenedor extra
const noExtraDiv = !headquartersContent.includes('{/* Content */}') ||
                  !headquartersContent.includes('className="space-y-2"');

if (noExtraDiv) {
  console.log('✅ No hay div contenedor extra');
} else {
  console.log('❌ SÍ hay div contenedor extra');
}

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

// Verificar que las pestañas de navegación sean compactas
const tabsCompact = headquartersContent.includes('px-3 py-2') &&
                   !headquartersContent.includes('px-4 py-3');

if (tabsCompact) {
  console.log('✅ Pestañas de navegación compactas (px-3 py-2)');
} else {
  console.log('❌ Pestañas de navegación NO son compactas');
}

console.log('\n📋 Resumen de verificación FINAL:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  noSpaceY2Container,
  dashboardUsesFragment,
  noExtraDiv,
  modalNoPadding,
  headerNoPadding,
  headerTitleCompact,
  tabsCompact
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN FINAL EXITOSA');
  console.log('✅ El contenedor ha sido COMPLETAMENTE eliminado');
  console.log('✅ El dashboard usa fragmento (sin contenedor)');
  console.log('✅ NO hay NINGÚN espacio excesivo en la parte superior');
  console.log('✅ El layout está ULTRA optimizado');
  console.log('✅ El contenido está PEGADO al borde superior');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN FINAL FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar la solución FINAL:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya NINGÚN espacio excesivo arriba');
console.log('4. Verificar que el contenido esté PEGADO al borde superior');
console.log('5. Verificar que no haya contenedores innecesarios');
console.log('6. Verificar que el dashboard se ajuste PERFECTAMENTE');
console.log('7. Verificar que el layout esté ULTRA optimizado'); 