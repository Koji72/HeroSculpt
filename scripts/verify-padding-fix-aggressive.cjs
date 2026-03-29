#!/usr/bin/env node

/**
 * 🧪 Script de Verificación Agresiva: Fix de Padding del Headquarters
 * 
 * Este script verifica que el padding excesivo en la parte superior
 * del dashboard haya sido COMPLETAMENTE eliminado.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación AGRESIVA del fix de padding del Headquarters...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

// Verificar que el header tenga padding mínimo
const headerPaddingMinimal = headquartersContent.includes('p-2') && 
                            !headquartersContent.includes('p-6') &&
                            headquartersContent.includes('Header');

if (headerPaddingMinimal) {
  console.log('✅ Header con padding mínimo (p-2)');
} else {
  console.log('❌ Header NO tiene padding mínimo');
}

// Verificar que el contenido NO tenga padding
const contentNoPadding = headquartersContent.includes('Content') &&
                        headquartersContent.includes('p-0') &&
                        !headquartersContent.includes('p-2') &&
                        !headquartersContent.includes('p-6');

if (contentNoPadding) {
  console.log('✅ Contenido SIN padding (p-0)');
} else {
  console.log('❌ Contenido SÍ tiene padding');
}

// Verificar que el espaciado entre elementos sea mínimo
const spacingMinimal = headquartersContent.includes('space-y-2') &&
                      !headquartersContent.includes('space-y-4') &&
                      !headquartersContent.includes('space-y-8');

if (spacingMinimal) {
  console.log('✅ Espaciado entre elementos mínimo (space-y-2)');
} else {
  console.log('❌ Espaciado entre elementos NO es mínimo');
}

// Verificar que el título principal sea muy compacto
const titleVeryCompact = headquartersContent.includes('text-2xl') &&
                        !headquartersContent.includes('text-3xl') &&
                        !headquartersContent.includes('text-4xl') &&
                        headquartersContent.includes('MISSION CONTROL');

if (titleVeryCompact) {
  console.log('✅ Título principal muy compacto (text-2xl)');
} else {
  console.log('❌ Título principal NO es muy compacto');
}

// Verificar que los elementos del sistema tengan padding mínimo
const systemElementsMinimal = headquartersContent.includes('p-2') &&
                             !headquartersContent.includes('p-3') &&
                             !headquartersContent.includes('p-6') &&
                             headquartersContent.includes('System Status');

if (systemElementsMinimal) {
  console.log('✅ Elementos del sistema con padding mínimo (p-2)');
} else {
  console.log('❌ Elementos del sistema NO tienen padding mínimo');
}

// Verificar que la sección hero tenga padding mínimo
const heroSectionMinimal = headquartersContent.includes('Hero Section') &&
                          headquartersContent.includes('p-2') &&
                          !headquartersContent.includes('p-4') &&
                          !headquartersContent.includes('p-8');

if (heroSectionMinimal) {
  console.log('✅ Sección hero con padding mínimo (p-2)');
} else {
  console.log('❌ Sección hero NO tiene padding mínimo');
}

// Verificar que las estadísticas tengan padding reducido
const statsPaddingReduced = headquartersContent.includes('HQ Statistics') &&
                           headquartersContent.includes('p-4') &&
                           !headquartersContent.includes('p-8');

if (statsPaddingReduced) {
  console.log('✅ Estadísticas con padding reducido (p-4)');
} else {
  console.log('❌ Estadísticas NO tienen padding reducido');
}

// Verificar que el gap entre estadísticas sea reducido
const statsGapReduced = headquartersContent.includes('gap-4') &&
                       !headquartersContent.includes('gap-8');

if (statsGapReduced) {
  console.log('✅ Gap entre estadísticas reducido (gap-4)');
} else {
  console.log('❌ Gap entre estadísticas NO reducido');
}

console.log('\n📋 Resumen de verificaciones AGRESIVAS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  headerPaddingMinimal,
  contentNoPadding,
  spacingMinimal,
  titleVeryCompact,
  systemElementsMinimal,
  heroSectionMinimal,
  statsPaddingReduced,
  statsGapReduced
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 TODAS LAS VERIFICACIONES AGRESIVAS PASARON');
  console.log('✅ El padding excesivo ha sido COMPLETAMENTE eliminado');
  console.log('✅ El dashboard está ULTRA compacto');
  console.log('✅ No hay NINGÚN espacio excesivo en la parte superior');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  ALGUNAS VERIFICACIONES AGRESIVAS FALLARON');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar los cambios ULTRA compactos:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya NINGÚN espacio excesivo arriba');
console.log('4. Verificar que el contenido esté ULTRA compacto');
console.log('5. Verificar que el dashboard se ajuste PERFECTAMENTE al browser');
console.log('6. Verificar que no haya padding innecesario en ninguna sección'); 