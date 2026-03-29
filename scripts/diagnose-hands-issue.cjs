#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico del Problema de Manos para Usuarios No Logueados');
console.log('=' .repeat(60));

// 1. Verificar el estado inicial para usuarios no logueados
console.log('\n1️⃣ Verificando estado inicial para usuarios no logueados...');

try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Buscar DEFAULT_STRONG_BUILD
  const defaultBuildMatch = constantsContent.match(/export const DEFAULT_STRONG_BUILD: SelectedParts = ({[^}]*})/);
  
  if (defaultBuildMatch) {
    console.log('   📋 DEFAULT_STRONG_BUILD encontrado:', defaultBuildMatch[1]);
    
    if (defaultBuildMatch[1].includes('{}') || defaultBuildMatch[1].trim() === '') {
      console.log('   ⚠️  PROBLEMA: DEFAULT_STRONG_BUILD está vacío - esto causa el problema');
      console.log('   💡 SOLUCIÓN: Necesitamos definir un build por defecto con manos');
    } else {
      console.log('   ✅ DEFAULT_STRONG_BUILD tiene contenido');
    }
  } else {
    console.log('   ❌ DEFAULT_STRONG_BUILD no encontrado');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo constants.ts:', error.message);
}

// 2. Verificar la lógica de filtrado de manos
console.log('\n2️⃣ Verificando lógica de filtrado de manos...');

try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Buscar el código de filtrado de manos
  const handFilterPattern = /\/\/ Caso especial para MANOS.*?return part\.compatible\.includes\(selectedTorso\.id\);/s;
  const handFilterMatch = partSelectorContent.match(handFilterPattern);
  
  if (handFilterMatch) {
    console.log('   ✅ Código de filtrado de manos presente');
    console.log('   📝 Lógica encontrada:');
    console.log('      - Verifica si hay torso seleccionado');
    console.log('      - Si no hay torso, muestra todas las manos');
    console.log('      - Si hay torso, filtra por compatibilidad');
  } else {
    console.log('   ❌ Código de filtrado de manos NO encontrado');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo PartSelectorPanel.tsx:', error.message);
}

// 3. Verificar datos de compatibilidad de manos
console.log('\n3️⃣ Verificando datos de compatibilidad de manos...');

try {
  const handsContent = fs.readFileSync('src/parts/strongHandsParts.ts', 'utf8');
  
  // Contar manos por torso
  const torso01Hands = (handsContent.match(/compatible: \['strong_torso_01'\]/g) || []).length;
  const torso02Hands = (handsContent.match(/compatible: \['strong_torso_02'\]/g) || []).length;
  const torso03Hands = (handsContent.match(/compatible: \['strong_torso_03'\]/g) || []).length;
  const torso04Hands = (handsContent.match(/compatible: \['strong_torso_04'\]/g) || []).length;
  const torso05Hands = (handsContent.match(/compatible: \['strong_torso_05'\]/g) || []).length;
  
  console.log('   📊 Manos por torso:');
  console.log(`      Torso 01: ${torso01Hands} manos`);
  console.log(`      Torso 02: ${torso02Hands} manos`);
  console.log(`      Torso 03: ${torso03Hands} manos`);
  console.log(`      Torso 04: ${torso04Hands} manos`);
  console.log(`      Torso 05: ${torso05Hands} manos`);
  
  // Verificar si hay manos sin compatibilidad específica
  const genericHands = handsContent.match(/compatible: \[\]/g);
  if (genericHands) {
    console.log(`   ⚠️  ADVERTENCIA: ${genericHands.length} manos sin compatibilidad específica`);
  } else {
    console.log('   ✅ Todas las manos tienen compatibilidad específica');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo strongHandsParts.ts:', error.message);
}

// 4. Verificar la función assignDefaultHandsForTorso
console.log('\n4️⃣ Verificando función assignDefaultHandsForTorso...');

try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  
  // Buscar la función
  const functionPattern = /export function assignDefaultHandsForTorso.*?}/s;
  const functionMatch = utilsContent.match(functionPattern);
  
  if (functionMatch) {
    console.log('   ✅ Función assignDefaultHandsForTorso encontrada');
    
    // Verificar si maneja el caso de estado vacío
    if (functionMatch[0].includes('!currentLeftHand && !currentRightHand')) {
      console.log('   ✅ Maneja caso de estado vacío (usuarios no logueados)');
    } else {
      console.log('   ❌ NO maneja caso de estado vacío');
    }
    
    // Verificar si filtra por compatibilidad
    if (functionMatch[0].includes('p.compatible.includes(newTorso.id)')) {
      console.log('   ✅ Filtra manos por compatibilidad con torso');
    } else {
      console.log('   ❌ NO filtra manos por compatibilidad');
    }
    
  } else {
    console.log('   ❌ Función assignDefaultHandsForTorso NO encontrada');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo lib/utils.ts:', error.message);
}

// 5. Simular el flujo problemático
console.log('\n5️⃣ Simulando flujo problemático...');

console.log('   🔄 Escenario: Usuario no logueado selecciona manos');
console.log('   📋 Estado inicial: selectedParts = {}');
console.log('   🎯 Torso actual: strong_torso_01');
console.log('   🔍 Manos disponibles para strong_torso_01:');

try {
  const handsContent = fs.readFileSync('src/parts/strongHandsParts.ts', 'utf8');
  
  // Extraer manos compatibles con torso_01
  const torso01Pattern = /id: '([^']+)'.*?compatible: \['strong_torso_01'\],/gs;
  let match;
  const compatibleHands = [];
  
  while ((match = torso01Pattern.exec(handsContent)) !== null) {
    compatibleHands.push(match[1]);
  }
  
  console.log(`   📊 ${compatibleHands.length} manos compatibles con strong_torso_01:`);
  compatibleHands.slice(0, 10).forEach(hand => {
    console.log(`      - ${hand}`);
  });
  
  if (compatibleHands.length > 10) {
    console.log(`      ... y ${compatibleHands.length - 10} más`);
  }
  
} catch (error) {
  console.log('   ❌ Error simulando flujo:', error.message);
}

// 6. Recomendaciones
console.log('\n6️⃣ Recomendaciones para solucionar el problema...');

console.log('   🎯 POSIBLES CAUSAS:');
console.log('      1. DEFAULT_STRONG_BUILD está vacío');
console.log('      2. Filtro de manos no funciona correctamente');
console.log('      3. Lógica de compatibilidad falla en estado inicial');
console.log('      4. Función assignDefaultHandsForTorso no maneja estado vacío');

console.log('\n   💡 SOLUCIONES SUGERIDAS:');
console.log('      1. Definir un DEFAULT_STRONG_BUILD con manos por defecto');
console.log('      2. Mejorar el filtro de manos en PartSelectorPanel');
console.log('      3. Asegurar que assignDefaultHandsForTorso maneje estado vacío');
console.log('      4. Agregar logs de debugging para rastrear el problema');

console.log('\n' + '=' .repeat(60));
console.log('🔍 Diagnóstico completado'); 