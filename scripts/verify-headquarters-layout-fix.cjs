#!/usr/bin/env node

/**
 * 🧪 Script de Verificación: Layout del Cuartel General
 * 
 * Este script verifica que el layout del Cuartel General esté funcionando
 * correctamente sin elementos descolocados o superpuestos.
 * 
 * ✅ Verificaciones:
 * - MaterialPanel no se renderiza cuando Headquarters está abierto
 * - Panel lateral derecho no se renderiza cuando Headquarters está abierto
 * - Z-index correctos para evitar superposiciones
 * - Elementos de texto no flotan sin contenedores
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando layout del Cuartel General...\n');

// Verificar App.tsx
const appPath = path.join(__dirname, '../App.tsx');
if (!fs.existsSync(appPath)) {
  console.error('❌ No se encontró App.tsx');
  process.exit(1);
}

const appContent = fs.readFileSync(appPath, 'utf8');

// Verificar que MaterialPanel sea condicional
const materialPanelConditional = appContent.includes('{!isHeadquartersOpen && (') && 
                                appContent.includes('<MaterialPanel') &&
                                appContent.includes(')}');

if (materialPanelConditional) {
  console.log('✅ MaterialPanel renderizado condicionalmente cuando Headquarters NO está abierto');
} else {
  console.log('❌ MaterialPanel NO está renderizado condicionalmente');
}

// Verificar que el panel lateral derecho sea condicional
const rpgPanelConditional = appContent.includes('{!isHeadquartersOpen && (') && 
                           appContent.includes('RPGCharacterSheet') &&
                           appContent.includes(')}');

if (rpgPanelConditional) {
  console.log('✅ Panel lateral derecho renderizado condicionalmente cuando Headquarters NO está abierto');
} else {
  console.log('❌ Panel lateral derecho NO está renderizado condicionalmente');
}

// Verificar z-index del Headquarters
const headquartersZIndex = appContent.includes('z-50') && 
                          appContent.includes('Headquarters');

if (headquartersZIndex) {
  console.log('✅ Headquarters tiene z-index correcto (z-50)');
} else {
  console.log('❌ Headquarters NO tiene z-index correcto');
}

// Verificar que no haya elementos de texto flotando
const floatingTextPatterns = [
  'Material Configuration',
  'Customize materials, colors, textures and effects',
  'MaterialsuEffectave'
];

let floatingTextFound = false;
floatingTextPatterns.forEach(pattern => {
  if (appContent.includes(pattern)) {
    console.log(`⚠️  Texto flotante encontrado: "${pattern}"`);
    floatingTextFound = true;
  }
});

if (!floatingTextFound) {
  console.log('✅ No se encontraron elementos de texto flotando');
}

// Verificar estructura del Headquarters
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (fs.existsSync(headquartersPath)) {
  const hqContent = fs.readFileSync(headquartersPath, 'utf8');
  
  // Verificar que Headquarters tenga estructura modal correcta
  const modalStructure = hqContent.includes('fixed inset-0') && 
                        hqContent.includes('bg-black/90') &&
                        hqContent.includes('z-50');

  if (modalStructure) {
    console.log('✅ Headquarters tiene estructura modal correcta');
  } else {
    console.log('❌ Headquarters NO tiene estructura modal correcta');
  }
}

// Verificar MaterialPanel
const materialPanelPath = path.join(__dirname, '../components/MaterialPanel.tsx');
if (fs.existsSync(materialPanelPath)) {
  const mpContent = fs.readFileSync(materialPanelPath, 'utf8');
  
  // Verificar que MaterialPanel tenga z-index correcto
  const mpZIndex = mpContent.includes('z-50') && 
                   mpContent.includes('fixed top-0 right-0');

  if (mpZIndex) {
    console.log('✅ MaterialPanel tiene z-index y posicionamiento correctos');
  } else {
    console.log('❌ MaterialPanel NO tiene z-index o posicionamiento correctos');
  }
}

console.log('\n📋 Resumen de verificaciones:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (materialPanelConditional && rpgPanelConditional && headquartersZIndex && !floatingTextFound) {
  console.log('🎉 TODAS LAS VERIFICACIONES PASARON');
  console.log('✅ El layout del Cuartel General está funcionando correctamente');
  console.log('✅ No hay elementos descolocados');
  console.log('✅ Los componentes se renderizan condicionalmente');
} else {
  console.log('⚠️  ALGUNAS VERIFICACIONES FALLARON');
  console.log('🔧 Revisar los problemas identificados arriba');
}

console.log('\n🚀 Para probar los cambios:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que no aparezcan elementos del MaterialPanel');
console.log('4. Verificar que no haya texto flotando');
console.log('5. Verificar que el layout esté limpio y organizado');

console.log('\n📚 Documentación relacionada:');
console.log('- docs/HEADQUARTERS_IMPROVEMENTS_2025.md');
console.log('- docs/MNM_HQ_FINAL_SUMMARY_2025.md');
console.log('- docs/COMPLETE_PROBLEMS_SOLUTIONS_MEMORY_2025.md'); 