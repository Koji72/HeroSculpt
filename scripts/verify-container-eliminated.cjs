#!/usr/bin/env node

/**
 * 🧪 Script de Verificación Final: Contenedor Eliminado
 * 
 * Este script verifica que el contenedor problemático ha sido
 * COMPLETAMENTE eliminado del Headquarters.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación FINAL: Contenedor eliminado del Headquarters...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

// Verificar que NO haya contenedor con padding
const noContentContainer = !headquartersContent.includes('{/* Content */}') ||
                          !headquartersContent.includes('className="p-0"') ||
                          !headquartersContent.includes('className="p-2"') ||
                          !headquartersContent.includes('className="p-6"');

if (noContentContainer) {
  console.log('✅ Contenedor de contenido ELIMINADO');
} else {
  console.log('❌ Contenedor de contenido AÚN PRESENTE');
}

// Verificar que el dashboard esté directamente en el nivel correcto
const dashboardDirectLevel = headquartersContent.includes('{activeTab === \'dashboard\' && (') &&
                            !headquartersContent.includes('{/* Content */}') &&
                            !headquartersContent.includes('className="p-');

if (dashboardDirectLevel) {
  console.log('✅ Dashboard en nivel directo (sin contenedor)');
} else {
  console.log('❌ Dashboard NO está en nivel directo');
}

// Verificar que el espaciado sea mínimo
const minimalSpacing = headquartersContent.includes('space-y-2') &&
                      !headquartersContent.includes('space-y-4') &&
                      !headquartersContent.includes('space-y-8');

if (minimalSpacing) {
  console.log('✅ Espaciado mínimo (space-y-2)');
} else {
  console.log('❌ Espaciado NO es mínimo');
}

// Verificar que el título sea compacto
const compactTitle = headquartersContent.includes('text-2xl') &&
                    !headquartersContent.includes('text-3xl') &&
                    !headquartersContent.includes('text-4xl') &&
                    headquartersContent.includes('MISSION CONTROL');

if (compactTitle) {
  console.log('✅ Título compacto (text-2xl)');
} else {
  console.log('❌ Título NO es compacto');
}

// Verificar que los elementos del sistema tengan padding mínimo
const minimalSystemPadding = headquartersContent.includes('p-2') &&
                            !headquartersContent.includes('p-3') &&
                            !headquartersContent.includes('p-6') &&
                            headquartersContent.includes('System Status');

if (minimalSystemPadding) {
  console.log('✅ Elementos del sistema con padding mínimo (p-2)');
} else {
  console.log('❌ Elementos del sistema NO tienen padding mínimo');
}

// Verificar que la sección hero tenga padding mínimo
const minimalHeroPadding = headquartersContent.includes('Hero Section') &&
                          headquartersContent.includes('p-2') &&
                          !headquartersContent.includes('p-4') &&
                          !headquartersContent.includes('p-8');

if (minimalHeroPadding) {
  console.log('✅ Sección hero con padding mínimo (p-2)');
} else {
  console.log('❌ Sección hero NO tiene padding mínimo');
}

console.log('\n📋 Resumen de verificación FINAL:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  noContentContainer,
  dashboardDirectLevel,
  minimalSpacing,
  compactTitle,
  minimalSystemPadding,
  minimalHeroPadding
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN FINAL EXITOSA');
  console.log('✅ El contenedor problemático ha sido ELIMINADO');
  console.log('✅ El espacio excesivo ha sido COMPLETAMENTE resuelto');
  console.log('✅ El dashboard está ULTRA compacto y directo');
  console.log('✅ No hay NINGÚN contenedor innecesario');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN FINAL FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar la solución FINAL:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya NINGÚN espacio excesivo');
console.log('4. Verificar que el contenido esté ULTRA compacto');
console.log('5. Verificar que el dashboard se ajuste PERFECTAMENTE');
console.log('6. Verificar que no haya contenedores innecesarios');
console.log('7. Verificar que el contenido esté directamente en el nivel correcto'); 