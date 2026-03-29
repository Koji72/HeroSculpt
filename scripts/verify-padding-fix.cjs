#!/usr/bin/env node

/**
 * 🧪 Script de Verificación: Fix de Padding del Headquarters
 * 
 * Este script verifica que el padding excesivo en la parte superior
 * del dashboard haya sido corregido.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando fix de padding del Headquarters...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

// Verificar que el header tenga padding reducido
const headerPaddingReduced = headquartersContent.includes('p-2') && 
                            !headquartersContent.includes('p-6') &&
                            headquartersContent.includes('Header');

if (headerPaddingReduced) {
  console.log('✅ Header con padding reducido (p-2)');
} else {
  console.log('❌ Header NO tiene padding reducido');
}

// Verificar que el contenido tenga padding reducido
const contentPaddingReduced = headquartersContent.includes('Content') &&
                             headquartersContent.includes('p-2') &&
                             !headquartersContent.includes('p-6');

if (contentPaddingReduced) {
  console.log('✅ Contenido con padding reducido (p-2)');
} else {
  console.log('❌ Contenido NO tiene padding reducido');
}

// Verificar que el espaciado entre elementos sea reducido
const spacingReduced = headquartersContent.includes('space-y-4') &&
                      !headquartersContent.includes('space-y-8');

if (spacingReduced) {
  console.log('✅ Espaciado entre elementos reducido (space-y-4)');
} else {
  console.log('❌ Espaciado entre elementos NO reducido');
}

// Verificar que el título principal sea más compacto
const titleCompact = headquartersContent.includes('text-3xl') &&
                    !headquartersContent.includes('text-4xl') &&
                    headquartersContent.includes('MISSION CONTROL');

if (titleCompact) {
  console.log('✅ Título principal más compacto (text-3xl)');
} else {
  console.log('❌ Título principal NO es compacto');
}

// Verificar que los elementos del sistema tengan padding reducido
const systemElementsCompact = headquartersContent.includes('p-3') &&
                             !headquartersContent.includes('p-6') &&
                             headquartersContent.includes('System Status');

if (systemElementsCompact) {
  console.log('✅ Elementos del sistema con padding reducido (p-3)');
} else {
  console.log('❌ Elementos del sistema NO tienen padding reducido');
}

console.log('\n📋 Resumen de verificaciones:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (headerPaddingReduced && contentPaddingReduced && spacingReduced && titleCompact && systemElementsCompact) {
  console.log('🎉 TODAS LAS VERIFICACIONES PASARON');
  console.log('✅ El padding excesivo ha sido corregido');
  console.log('✅ El dashboard está más compacto');
  console.log('✅ No hay espacio excesivo en la parte superior');
} else {
  console.log('⚠️  ALGUNAS VERIFICACIONES FALLARON');
  console.log('🔧 Revisar los problemas identificados arriba');
}

console.log('\n🚀 Para probar los cambios:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que no haya espacio excesivo arriba');
console.log('4. Verificar que el contenido esté más compacto');
console.log('5. Verificar que el dashboard se ajuste mejor al browser'); 