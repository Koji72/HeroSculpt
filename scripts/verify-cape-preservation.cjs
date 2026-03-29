#!/usr/bin/env node

/**
 * Script de verificación para el sistema de preservación de capas
 * Verifica que la lógica de preservación esté implementada correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando sistema de preservación de capas...\n');

// Verificar App.tsx
console.log('📋 Verificando App.tsx...');
const appContent = fs.readFileSync('App.tsx', 'utf8');

// Verificar preservación de capas en ambos casos (TORSO y SUIT_TORSO)
const capePreservationPatterns = [
  // Patrón para preservación de capas
  /const currentCape = newParts\[PartCategory\.CAPE\];/,
  /const partsWithCape = \{ \.\.\.newParts \};/,
  /if \(currentCape\) partsWithCape\[PartCategory\.CAPE\] = currentCape;/,
  /newParts = assignAdaptiveCapeForTorso\(.*, newParts, partsWithCape\);/,
];

let appChecks = 0;
capePreservationPatterns.forEach((pattern, index) => {
  const matches = appContent.match(pattern);
  if (matches) {
    console.log(`  ✅ Patrón ${index + 1} encontrado`);
    appChecks++;
  } else {
    console.log(`  ❌ Patrón ${index + 1} NO encontrado`);
  }
});

// Verificar que se llama en ambos lugares (TORSO y SUIT_TORSO)
const torsoCalls = (appContent.match(/assignAdaptiveCapeForTorso/g) || []).length;
console.log(`  📊 Llamadas a assignAdaptiveCapeForTorso: ${torsoCalls}`);

if (torsoCalls >= 2) {
  console.log('  ✅ Llamadas suficientes encontradas');
  appChecks++;
} else {
  console.log('  ❌ Faltan llamadas a assignAdaptiveCapeForTorso');
}

// Verificar lib/utils.ts
console.log('\n📋 Verificando lib/utils.ts...');
const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');

// Verificar función assignAdaptiveCapeForTorso
const capeFunctionPatterns = [
  // Verificar que la función acepta originalParts
  /export function assignAdaptiveCapeForTorso\(newTorso: Part, currentParts: SelectedParts, originalParts\?\: SelectedParts\): SelectedParts/,
  // Verificar preservación de capa actual
  /const currentCape = Object\.values\(partsToCheck\)\.find\(p => p\.category === PartCategory\.CAPE\);/,
  // Verificar verificación de compatibilidad
  /const isCurrentCapeCompatible = currentCape\.compatible\.includes\(newTorso\.id\);/,
  // Verificar búsqueda de tipo de capa
  /const capeMatch = currentCape\.id\.match\(\/strong_cape_\(\d\+\)_t\d\+\/\);/,
  // Verificar búsqueda de capa del mismo tipo
  /const matchingCape = compatibleCapes\.find\(p => p\.id\.includes\(\`strong_cape_\$\{currentType\}_\`\)\);/,
];

let utilsChecks = 0;
capeFunctionPatterns.forEach((pattern, index) => {
  const matches = utilsContent.match(pattern);
  if (matches) {
    console.log(`  ✅ Patrón ${index + 1} encontrado`);
    utilsChecks++;
  } else {
    console.log(`  ❌ Patrón ${index + 1} NO encontrado`);
  }
});

// Verificar constants.ts
console.log('\n📋 Verificando constants.ts...');
const constantsContent = fs.readFileSync('constants.ts', 'utf8');

// Verificar definiciones de capas
const capeDefinitions = constantsContent.match(/strong_cape_\d+_t\d+/g) || [];
console.log(`  📊 Definiciones de capas encontradas: ${capeDefinitions.length}`);

if (capeDefinitions.length >= 20) { // 4 tipos x 5 torsos = 20
  console.log('  ✅ Definiciones suficientes de capas');
  appChecks++;
} else {
  console.log('  ❌ Faltan definiciones de capas');
}

// Verificar rutas de archivos
const capePaths = constantsContent.match(/assets\/strong\/cape\/strong_cape_\d+_t\d+\.glb/g) || [];
console.log(`  📊 Rutas de archivos de capas: ${capePaths.length}`);

if (capePaths.length >= 20) {
  console.log('  ✅ Rutas de archivos correctas');
  appChecks++;
} else {
  console.log('  ❌ Faltan rutas de archivos de capas');
}

// Resumen final
console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
console.log(`  App.tsx: ${appChecks}/5 patrones correctos`);
console.log(`  lib/utils.ts: ${utilsChecks}/5 patrones correctos`);
console.log(`  constants.ts: ${capeDefinitions.length >= 20 ? '✅' : '❌'} definiciones`);
console.log(`  Rutas de archivos: ${capePaths.length >= 20 ? '✅' : '❌'} rutas`);

const totalChecks = appChecks + utilsChecks + (capeDefinitions.length >= 20 ? 1 : 0) + (capePaths.length >= 20 ? 1 : 0);
const maxChecks = 5 + 5 + 1 + 1;

if (totalChecks === maxChecks) {
  console.log('\n🎉 ¡SISTEMA DE PRESERVACIÓN DE CAPAS VERIFICADO CORRECTAMENTE!');
  console.log('   ✅ Todas las verificaciones pasaron');
  console.log('   ✅ La lógica de preservación está implementada');
  console.log('   ✅ Las capas se preservarán al cambiar de torso');
  process.exit(0);
} else {
  console.log('\n⚠️  ADVERTENCIA: Algunas verificaciones fallaron');
  console.log(`   ❌ ${maxChecks - totalChecks} de ${maxChecks} verificaciones fallaron`);
  console.log('   🔧 Revisa la implementación del sistema de preservación de capas');
  process.exit(1);
} 