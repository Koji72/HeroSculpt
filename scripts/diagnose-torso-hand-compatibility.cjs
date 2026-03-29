#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 DIAGNÓSTICO - Compatibilidad Torso-Manos');
console.log('============================================\n');

let allChecksPassed = true;

// 1. Verificar sistema de compatibilidad en constants.ts
console.log('1️⃣ Verificando sistema de compatibilidad en constants.ts...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Buscar torsos y sus manos compatibles
  const torsoRegex = /id:\s*'strong_torso_\d+'/g;
  const torsoMatches = constantsContent.match(torsoRegex) || [];
  
  console.log(`   📊 Torsos STRONG encontrados: ${torsoMatches.length}`);
  
  // Buscar manos y sus compatibilidades
  const handRegex = /id:\s*'strong_hands_[^']*'.*?compatible:\s*\[([^\]]*)\]/gs;
  const handMatches = constantsContent.match(handRegex) || [];
  
  console.log(`   📊 Manos con compatibilidad definida: ${handMatches.length}`);
  
  // Analizar compatibilidades
  const compatibilityMap = {};
  const handsWithoutCompatibility = [];
  
  handMatches.forEach(match => {
    const idMatch = match.match(/id:\s*'([^']+)'/);
    const compatibleMatch = match.match(/compatible:\s*\[([^\]]*)\]/);
    
    if (idMatch && compatibleMatch) {
      const handId = idMatch[1];
      const compatible = compatibleMatch[1].split(',').map(s => s.trim().replace(/'/g, '')).filter(s => s);
      
      if (compatible.length > 0) {
        compatible.forEach(torsoId => {
          if (!compatibilityMap[torsoId]) {
            compatibilityMap[torsoId] = [];
          }
          compatibilityMap[torsoId].push(handId);
        });
      } else {
        handsWithoutCompatibility.push(handId);
      }
    }
  });
  
  console.log(`   📊 Manos sin compatibilidad definida: ${handsWithoutCompatibility.length}`);
  
  // Mostrar compatibilidades por torso
  console.log('   📋 Compatibilidades por torso:');
  Object.keys(compatibilityMap).forEach(torsoId => {
    const hands = compatibilityMap[torsoId];
    console.log(`      - ${torsoId}: ${hands.length} manos compatibles`);
    hands.slice(0, 3).forEach(hand => console.log(`        * ${hand}`));
    if (hands.length > 3) {
      console.log(`        ... y ${hands.length - 3} más`);
    }
  });
  
  if (handsWithoutCompatibility.length > 0) {
    console.log('   ⚠️ Manos sin compatibilidad:');
    handsWithoutCompatibility.slice(0, 5).forEach(hand => console.log(`      - ${hand}`));
    if (handsWithoutCompatibility.length > 5) {
      console.log(`      ... y ${handsWithoutCompatibility.length - 5} más`);
    }
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error verificando constants.ts:', error.message);
  allChecksPassed = false;
}

// 2. Verificar filtrado por compatibilidad en PartSelectorPanel
console.log('\n2️⃣ Verificando filtrado por compatibilidad en PartSelectorPanel...');
try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Verificar si hay filtrado por compatibilidad
  const hasCompatibilityFilter = partSelectorContent.includes('compatible') && partSelectorContent.includes('filter');
  console.log(`   ${hasCompatibilityFilter ? '✅' : '❌'} Filtrado por compatibilidad presente`);
  
  // Verificar si se usa el torso seleccionado para filtrar
  const usesSelectedTorso = partSelectorContent.includes('selectedParts') && partSelectorContent.includes('TORSO');
  console.log(`   ${usesSelectedTorso ? '✅' : '❌'} Usa torso seleccionado para filtrar`);
  
  // Verificar si hay lógica de filtrado específica
  const hasFilteringLogic = partSelectorContent.includes('filter(') || partSelectorContent.includes('includes(');
  console.log(`   ${hasFilteringLogic ? '✅' : '❌'} Lógica de filtrado presente`);
  
  // Buscar posibles problemas
  const filterProblems = [];
  if (partSelectorContent.includes('ALL_PARTS') && !partSelectorContent.includes('compatible')) {
    filterProblems.push('Usa ALL_PARTS sin filtrar por compatibilidad');
  }
  if (partSelectorContent.includes('category') && !partSelectorContent.includes('compatible')) {
    filterProblems.push('Filtra por categoría pero no por compatibilidad');
  }
  
  if (filterProblems.length > 0) {
    console.log('   ⚠️ Posibles problemas de filtrado:');
    filterProblems.forEach(problem => console.log(`      - ${problem}`));
    allChecksPassed = false;
  } else {
    console.log('   ✅ No se detectaron problemas obvios de filtrado');
  }
  
} catch (error) {
  console.log('   ❌ Error verificando PartSelectorPanel:', error.message);
  allChecksPassed = false;
}

// 3. Verificar lógica de selección de torso
console.log('\n3️⃣ Verificando lógica de selección de torso...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar si se actualiza el estado cuando cambia el torso
  const updatesOnTorsoChange = appContent.includes('TORSO') && appContent.includes('setSelectedParts');
  console.log(`   ${updatesOnTorsoChange ? '✅' : '❌'} Actualiza estado al cambiar torso`);
  
  // Verificar si hay lógica de compatibilidad
  const hasCompatibilityLogic = appContent.includes('compatible') && appContent.includes('filter');
  console.log(`   ${hasCompatibilityLogic ? '✅' : '❌'} Lógica de compatibilidad presente`);
  
  // Verificar si se pasa el torso seleccionado al selector
  const passesSelectedTorso = appContent.includes('selectedParts') && appContent.includes('PartSelectorPanel');
  console.log(`   ${passesSelectedTorso ? '✅' : '❌'} Pasa torso seleccionado al selector`);
  
} catch (error) {
  console.log('   ❌ Error verificando App.tsx:', error.message);
  allChecksPassed = false;
}

// 4. Verificar estructura de datos de compatibilidad
console.log('\n4️⃣ Verificando estructura de datos de compatibilidad...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Verificar que las manos tienen array de compatibilidad
  const handsWithCompatibleArray = (constantsContent.match(/compatible:\s*\[/g) || []).length;
  console.log(`   📊 Manos con array de compatibilidad: ${handsWithCompatibleArray}`);
  
  // Verificar que los torsos tienen IDs únicos
  const torsoIds = constantsContent.match(/id:\s*'strong_torso_\d+'/g) || [];
  const uniqueTorsoIds = [...new Set(torsoIds.map(match => match.match(/'([^']+)'/)[1]))];
  console.log(`   📊 Torsos únicos: ${uniqueTorsoIds.length}`);
  
  // Verificar que las manos referencian torsos válidos
  const allTorsoReferences = constantsContent.match(/compatible:\s*\[([^\]]*)\]/g) || [];
  const invalidReferences = [];
  
  allTorsoReferences.forEach(ref => {
    const torsoIds = ref.match(/compatible:\s*\[([^\]]*)\]/)[1]
      .split(',')
      .map(s => s.trim().replace(/'/g, ''))
      .filter(s => s);
    
    torsoIds.forEach(torsoId => {
      if (!uniqueTorsoIds.includes(torsoId)) {
        invalidReferences.push(torsoId);
      }
    });
  });
  
  if (invalidReferences.length > 0) {
    console.log('   ❌ Referencias inválidas a torsos:');
    [...new Set(invalidReferences)].forEach(ref => console.log(`      - ${ref}`));
    allChecksPassed = false;
  } else {
    console.log('   ✅ Todas las referencias a torsos son válidas');
  }
  
} catch (error) {
  console.log('   ❌ Error verificando estructura de datos:', error.message);
  allChecksPassed = false;
}

// Resultado final
console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
console.log('============================');

if (allChecksPassed) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('🎯 El sistema de compatibilidad parece estar correcto');
  console.log('');
  console.log('🔍 Posibles causas del problema:');
  console.log('   1. Problema de filtrado en tiempo de ejecución');
  console.log('   2. Problema de estado de React');
  console.log('   3. Problema de timing en la actualización');
  console.log('   4. Problema de cache del navegador');
  console.log('');
  console.log('🧪 Acciones recomendadas:');
  console.log('   1. Verificar consola del navegador');
  console.log('   2. Verificar que el filtrado se ejecuta correctamente');
  console.log('   3. Verificar que el torso seleccionado se pasa correctamente');
  console.log('   4. Verificar que las manos se filtran por compatibilidad');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('⚠️ Hay problemas en el sistema de compatibilidad');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los errores arriba');
  console.log('   2. Corregir el sistema de compatibilidad');
  console.log('   3. Implementar filtrado por compatibilidad');
  console.log('   4. Verificar que las manos se filtran correctamente');
}

console.log('\n📚 Archivos de referencia:');
console.log('   - constants.ts (datos de compatibilidad)');
console.log('   - components/PartSelectorPanel.tsx (filtrado)');
console.log('   - App.tsx (lógica de selección)');

process.exit(allChecksPassed ? 0 : 1); 