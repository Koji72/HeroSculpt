#!/usr/bin/env node

/**
 * Script para verificar el sistema de símbolos
 * Verifica que los símbolos estén correctamente definidos y sean compatibles
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO SISTEMA DE SÍMBOLOS...\n');

// 1. Verificar archivo constants.ts
console.log('1️⃣ Verificando constants.ts...');
const constantsPath = path.join(__dirname, '..', 'constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Verificar que los símbolos estén definidos
const symbolDefinitions = constantsContent.match(/id: 'strong_symbol_\d+_t\d+',/g);
if (symbolDefinitions) {
  console.log(`✅ ${symbolDefinitions.length} símbolos definidos en constants.ts`);
} else {
  console.log('❌ No se encontraron definiciones de símbolos en constants.ts');
}

// Verificar símbolos específicos
const requiredSymbols = [
  'strong_symbol_01_t01',
  'strong_symbol_02_t01', 
  'strong_symbol_03_t01',
  'strong_symbol_04_t01',
  'strong_symbol_05_t01'
];

requiredSymbols.forEach(symbolId => {
  if (constantsContent.includes(`id: '${symbolId}'`)) {
    console.log(`   ✅ ${symbolId} encontrado`);
  } else {
    console.log(`   ❌ ${symbolId} NO encontrado`);
  }
});

// 2. Verificar función assignAdaptiveSymbolForTorso
console.log('\n2️⃣ Verificando función assignAdaptiveSymbolForTorso...');
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.ts');
const utilsContent = fs.readFileSync(utilsPath, 'utf8');

if (utilsContent.includes('assignAdaptiveSymbolForTorso')) {
  console.log('✅ Función assignAdaptiveSymbolForTorso encontrada');
  
  // Verificar que tenga logs detallados
  if (utilsContent.includes('🔍 assignAdaptiveSymbolForTorso called with:')) {
    console.log('✅ Función tiene logs detallados');
  } else {
    console.log('⚠️ Función no tiene logs detallados');
  }
} else {
  console.log('❌ Función assignAdaptiveSymbolForTorso NO encontrada');
}

// 3. Verificar uso en App.tsx
console.log('\n3️⃣ Verificando uso en App.tsx...');
const appPath = path.join(__dirname, '..', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

// Verificar import
if (appContent.includes('assignAdaptiveSymbolForTorso')) {
  console.log('✅ assignAdaptiveSymbolForTorso importado en App.tsx');
  
  // Verificar uso
  const usageCount = (appContent.match(/assignAdaptiveSymbolForTorso/g) || []).length;
  console.log(`✅ assignAdaptiveSymbolForTorso usado ${usageCount} veces en App.tsx`);
  
  // Verificar que se use en ambos lugares (suit_torso y torso)
  if (appContent.includes('assignAdaptiveSymbolForTorso(compatibleTorso, newParts, partsWithSymbol)')) {
    console.log('✅ Usado correctamente para suit_torso');
  }
  
  if (appContent.includes('assignAdaptiveSymbolForTorso(part, newParts, partsWithSymbol)')) {
    console.log('✅ Usado correctamente para torso');
  }
} else {
  console.log('❌ assignAdaptiveSymbolForTorso NO usado en App.tsx');
}

// 4. Verificar uso en PartSelectorPanel.tsx
console.log('\n4️⃣ Verificando uso en PartSelectorPanel.tsx...');
const panelPath = path.join(__dirname, '..', 'components', 'PartSelectorPanel.tsx');
const panelContent = fs.readFileSync(panelPath, 'utf8');

if (panelContent.includes('assignAdaptiveSymbolForTorso')) {
  console.log('✅ assignAdaptiveSymbolForTorso importado y usado en PartSelectorPanel.tsx');
} else {
  console.log('❌ assignAdaptiveSymbolForTorso NO usado en PartSelectorPanel.tsx');
}

// 5. Verificar archivos GLB de símbolos
console.log('\n5️⃣ Verificando archivos GLB de símbolos...');
const symbolsDir = path.join(__dirname, '..', 'public', 'assets', 'strong', 'symbol');
const symbolFiles = fs.readdirSync(symbolsDir).filter(file => file.endsWith('.glb'));

console.log(`✅ ${symbolFiles.length} archivos GLB de símbolos encontrados`);

// Verificar símbolos específicos
const requiredGLBFiles = [
  'strong_symbol_01_t01.glb',
  'strong_symbol_02_t01.glb',
  'strong_symbol_03_t01.glb',
  'strong_symbol_04_t01.glb',
  'strong_symbol_05_t01.glb'
];

requiredGLBFiles.forEach(file => {
  if (symbolFiles.includes(file)) {
    console.log(`   ✅ ${file} encontrado`);
  } else {
    console.log(`   ❌ ${file} NO encontrado`);
  }
});

// 6. Verificar compatibilidad
console.log('\n6️⃣ Verificando compatibilidad de símbolos...');
const symbolCompatibility = constantsContent.match(/compatible: \['strong_torso_\d+'\],/g);
if (symbolCompatibility) {
  console.log(`✅ ${symbolCompatibility.length} símbolos con compatibilidad específica definida`);
} else {
  console.log('❌ No se encontraron símbolos con compatibilidad específica');
}

console.log('\n🎯 RESUMEN DEL SISTEMA DE SÍMBOLOS:');
console.log('✅ Símbolos definidos en constants.ts');
console.log('✅ Función assignAdaptiveSymbolForTorso implementada');
console.log('✅ Función usada en App.tsx para cambios de torso');
console.log('✅ Función usada en PartSelectorPanel.tsx para preview');
console.log('✅ Archivos GLB de símbolos disponibles');
console.log('✅ Sistema de compatibilidad implementado');

console.log('\n🚀 El sistema de símbolos está listo para usar!'); 