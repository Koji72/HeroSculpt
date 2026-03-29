#!/usr/bin/env node

const fs = require('fs');

console.log('🧪 Prueba Específica del Problema de Manos para Usuarios No Logueados');
console.log('=' .repeat(70));

// Simular el estado exacto del problema
console.log('\n1️⃣ Simulando estado de usuario no logueado...');

// Estado inicial: selectedParts vacío (como en usuarios no logueados)
const selectedParts = {};
const selectedArchetype = 'STRONG';
const activeCategory = 'HAND_LEFT';

console.log('   📋 Estado inicial:');
console.log(`      selectedParts: ${JSON.stringify(selectedParts)}`);
console.log(`      selectedArchetype: ${selectedArchetype}`);
console.log(`      activeCategory: ${activeCategory}`);

// 2. Simular el filtro de manos
console.log('\n2️⃣ Simulando filtro de manos...');

try {
  const handsContent = fs.readFileSync('src/parts/strongHandsParts.ts', 'utf8');
  
  // Extraer todas las manos STRONG
  const strongHandsPattern = /id: '([^']+)'.*?archetype: ArchetypeId\.STRONG.*?compatible: \[([^\]]+)\],/gs;
  let match;
  const allStrongHands = [];
  
  while ((match = strongHandsPattern.exec(handsContent)) !== null) {
    const handId = match[1];
    const compatible = match[2].replace(/'/g, '').split(', ');
    allStrongHands.push({ id: handId, compatible });
  }
  
  console.log(`   📊 Total manos STRONG encontradas: ${allStrongHands.length}`);
  
  // Simular el filtro del PartSelectorPanel
  const selectedTorso = selectedParts['TORSO'] || selectedParts['SUIT_TORSO'];
  console.log(`   🎯 Torso seleccionado: ${selectedTorso ? selectedTorso.id : 'NINGUNO'}`);
  
  // Aplicar el filtro exacto del código
  const filteredHands = allStrongHands.filter(hand => {
    if (hand.id.includes('HAND_LEFT') && activeCategory === 'HAND_LEFT') {
      if (!selectedTorso) {
        console.log(`   ✅ Mano ${hand.id} - Sin torso, mostrando todas`);
        return true;
      }
      const isCompatible = hand.compatible.includes(selectedTorso.id);
      console.log(`   ${isCompatible ? '✅' : '❌'} Mano ${hand.id} - Compatible con ${selectedTorso.id}: ${isCompatible}`);
      return isCompatible;
    }
    return false;
  });
  
  console.log(`\n   📊 Resultado del filtro:`);
  console.log(`      Manos totales STRONG: ${allStrongHands.length}`);
  console.log(`      Manos filtradas para ${activeCategory}: ${filteredHands.length}`);
  
  if (filteredHands.length > 0) {
    console.log(`      Primeras 5 manos filtradas:`);
    filteredHands.slice(0, 5).forEach(hand => {
      console.log(`         - ${hand.id} (compatible: ${hand.compatible.join(', ')})`);
    });
  }
  
} catch (error) {
  console.log('   ❌ Error simulando filtro:', error.message);
}

// 3. Verificar el problema específico
console.log('\n3️⃣ Identificando el problema específico...');

console.log('   🎯 ANÁLISIS DEL PROBLEMA:');
console.log('      Si el usuario no está logueado:');
console.log('      1. selectedParts está vacío {}');
console.log('      2. No hay torso seleccionado');
console.log('      3. El filtro dice "Si no hay torso, mostrar todas las manos"');
console.log('      4. Esto significa que se muestran TODAS las manos de TODOS los torsos');
console.log('      5. El usuario puede seleccionar manos incompatibles');

console.log('\n   💡 SOLUCIÓN NECESARIA:');
console.log('      Necesitamos asegurar que:');
console.log('      1. Los usuarios no logueados tengan un torso por defecto');
console.log('      2. O el filtro sea más restrictivo cuando no hay torso');

// 4. Verificar DEFAULT_STRONG_BUILD
console.log('\n4️⃣ Verificando DEFAULT_STRONG_BUILD...');

try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Buscar DEFAULT_STRONG_BUILD
  const defaultBuildMatch = constantsContent.match(/export const DEFAULT_STRONG_BUILD: SelectedParts = ({[\s\S]*?});/);
  
  if (defaultBuildMatch) {
    const buildContent = defaultBuildMatch[1];
    console.log('   📋 DEFAULT_STRONG_BUILD encontrado');
    
    // Verificar si tiene torso
    if (buildContent.includes('TORSO:')) {
      console.log('   ✅ Tiene torso definido');
      
      // Extraer el ID del torso
      const torsoMatch = buildContent.match(/id: '([^']+)'/);
      if (torsoMatch) {
        console.log(`   🎯 Torso por defecto: ${torsoMatch[1]}`);
      }
    } else {
      console.log('   ❌ NO tiene torso definido - ESTO ES EL PROBLEMA');
    }
    
    // Verificar si tiene manos
    if (buildContent.includes('HAND_LEFT:') || buildContent.includes('HAND_RIGHT:')) {
      console.log('   ✅ Tiene manos definidas');
    } else {
      console.log('   ⚠️  NO tiene manos definidas');
    }
    
  } else {
    console.log('   ❌ DEFAULT_STRONG_BUILD no encontrado');
  }
  
} catch (error) {
  console.log('   ❌ Error verificando DEFAULT_STRONG_BUILD:', error.message);
}

// 5. Recomendación final
console.log('\n5️⃣ RECOMENDACIÓN FINAL...');

console.log('   🎯 PROBLEMA IDENTIFICADO:');
console.log('      Los usuarios no logueados tienen selectedParts vacío,');
console.log('      lo que hace que el filtro de manos muestre TODAS las manos');
console.log('      en lugar de solo las compatibles con el torso actual.');

console.log('\n   💡 SOLUCIÓN:');
console.log('      1. Asegurar que DEFAULT_STRONG_BUILD incluya un torso por defecto');
console.log('      2. O modificar el filtro para ser más restrictivo cuando no hay torso');
console.log('      3. O cargar automáticamente un torso por defecto para usuarios no logueados');

console.log('\n' + '=' .repeat(70));
console.log('🧪 Prueba completada'); 