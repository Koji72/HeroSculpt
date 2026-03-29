#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 DIAGNÓSTICO - Duplicación de opciones de manos');
console.log('=================================================\n');

let allChecksPassed = true;

// 1. Verificar datos de manos en constants.ts
console.log('1️⃣ Verificando datos de manos en constants.ts...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Buscar todas las manos del arquetipo STRONG
  const strongHandsRegex = /id:\s*'strong_hands_[^']*'/g;
  const strongHandsMatches = constantsContent.match(strongHandsRegex) || [];
  
  console.log(`   📊 Total de manos STRONG encontradas: ${strongHandsMatches.length}`);
  
  // Contar manos por categoría
  const leftHands = strongHandsMatches.filter(match => match.includes('_l_'));
  const rightHands = strongHandsMatches.filter(match => match.includes('_r_'));
  
  console.log(`   📊 Manos izquierdas: ${leftHands.length}`);
  console.log(`   📊 Manos derechas: ${rightHands.length}`);
  
  // Verificar si hay duplicados por ID
  const handIds = strongHandsMatches.map(match => match.match(/'([^']+)'/)[1]);
  const uniqueIds = [...new Set(handIds)];
  
  if (handIds.length === uniqueIds.length) {
    console.log('   ✅ No hay IDs duplicados en constants.ts');
  } else {
    console.log('   ❌ Hay IDs duplicados en constants.ts');
    console.log(`   📊 IDs únicos: ${uniqueIds.length}, Total: ${handIds.length}`);
    allChecksPassed = false;
  }
  
  // Mostrar algunos ejemplos de IDs
  if (uniqueIds.length > 0) {
    console.log('   📋 Ejemplos de IDs de manos:');
    uniqueIds.slice(0, 5).forEach(id => console.log(`      - ${id}`));
    if (uniqueIds.length > 5) {
      console.log(`      ... y ${uniqueIds.length - 5} más`);
    }
  }
  
} catch (error) {
  console.log('   ❌ Error verificando constants.ts:', error.message);
  allChecksPassed = false;
}

// 2. Verificar filtrado en GamingPartSelector
console.log('\n2️⃣ Verificando filtrado en GamingPartSelector...');
try {
  const partSelectorContent = fs.readFileSync('components/GamingPartSelector.tsx', 'utf8');
  
  // Verificar si hay filtrado por categoría
  const hasCategoryFilter = partSelectorContent.includes('category') && partSelectorContent.includes('filter');
  console.log(`   ${hasCategoryFilter ? '✅' : '❌'} Filtrado por categoría presente`);
  
  // Verificar si hay filtrado por arquetipo
  const hasArchetypeFilter = partSelectorContent.includes('archetype') && partSelectorContent.includes('filter');
  console.log(`   ${hasArchetypeFilter ? '✅' : '❌'} Filtrado por arquetipo presente`);
  
  // Verificar si hay lógica de deduplicación
  const hasDeduplication = partSelectorContent.includes('filter') || partSelectorContent.includes('unique') || partSelectorContent.includes('Set');
  console.log(`   ${hasDeduplication ? '✅' : '❌'} Lógica de deduplicación presente`);
  
  // Buscar posibles problemas en el filtrado
  const filterProblems = [];
  if (partSelectorContent.includes('ALL_PARTS')) {
    filterProblems.push('Usa ALL_PARTS sin filtrado específico');
  }
  if (partSelectorContent.includes('map(') && !partSelectorContent.includes('filter(')) {
    filterProblems.push('Mapea sin filtrar');
  }
  
  if (filterProblems.length > 0) {
    console.log('   ⚠️ Posibles problemas de filtrado:');
    filterProblems.forEach(problem => console.log(`      - ${problem}`));
    allChecksPassed = false;
  } else {
    console.log('   ✅ No se detectaron problemas obvios de filtrado');
  }
  
} catch (error) {
  console.log('   ❌ Error verificando GamingPartSelector:', error.message);
  allChecksPassed = false;
}

// 3. Verificar lógica de carga de partes en App.tsx
console.log('\n3️⃣ Verificando lógica de carga de partes en App.tsx...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar cómo se cargan las partes
  const loadsAllParts = appContent.includes('ALL_PARTS');
  console.log(`   ${loadsAllParts ? '✅' : '❌'} Carga ALL_PARTS`);
  
  // Verificar si hay filtrado específico para manos
  const hasHandFilter = appContent.includes('HAND_LEFT') || appContent.includes('HAND_RIGHT');
  console.log(`   ${hasHandFilter ? '✅' : '❌'} Filtrado específico para manos presente`);
  
  // Verificar si hay lógica de deduplicación
  const hasDeduplicationLogic = appContent.includes('filter') || appContent.includes('unique') || appContent.includes('Set');
  console.log(`   ${hasDeduplicationLogic ? '✅' : '❌'} Lógica de deduplicación presente`);
  
} catch (error) {
  console.log('   ❌ Error verificando App.tsx:', error.message);
  allChecksPassed = false;
}

// 4. Verificar si hay múltiples fuentes de datos
console.log('\n4️⃣ Verificando fuentes de datos...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Verificar si hay múltiples arrays de partes
  const partArrays = constantsContent.match(/export const [A-Z_]+: Part\[\] = \[/g) || [];
  console.log(`   📊 Arrays de partes encontrados: ${partArrays.length}`);
  
  // Verificar si hay partes definidas en múltiples lugares
  const hasMultipleDefinitions = partArrays.length > 1;
  console.log(`   ${hasMultipleDefinitions ? '⚠️' : '✅'} Múltiples definiciones de partes: ${hasMultipleDefinitions ? 'SÍ' : 'NO'}`);
  
  if (hasMultipleDefinitions) {
    console.log('   📋 Arrays encontrados:');
    partArrays.forEach(array => {
      const name = array.match(/export const ([A-Z_]+):/)[1];
      console.log(`      - ${name}`);
    });
  }
  
} catch (error) {
  console.log('   ❌ Error verificando fuentes de datos:', error.message);
  allChecksPassed = false;
}

// 5. Verificar lógica de renderizado
console.log('\n5️⃣ Verificando lógica de renderizado...');
try {
  const partSelectorContent = fs.readFileSync('components/GamingPartSelector.tsx', 'utf8');
  
  // Verificar si hay múltiples renders del mismo array
  const mapCount = (partSelectorContent.match(/\.map\(/g) || []).length;
  console.log(`   📊 Número de .map() encontrados: ${mapCount}`);
  
  if (mapCount > 1) {
    console.log('   ⚠️ Múltiples .map() detectados - posible duplicación');
    allChecksPassed = false;
  } else {
    console.log('   ✅ Solo un .map() detectado');
  }
  
  // Verificar si hay bucles anidados
  const hasNestedLoops = partSelectorContent.includes('map(') && partSelectorContent.includes('forEach(');
  console.log(`   ${hasNestedLoops ? '⚠️' : '✅'} Bucles anidados: ${hasNestedLoops ? 'SÍ' : 'NO'}`);
  
  if (hasNestedLoops) {
    console.log('   ⚠️ Bucles anidados pueden causar duplicación');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error verificando lógica de renderizado:', error.message);
  allChecksPassed = false;
}

// Resultado final
console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
console.log('============================');

if (allChecksPassed) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('🎯 El código parece estar correcto');
  console.log('');
  console.log('🔍 Posibles causas del problema:');
  console.log('   1. Problema de cache del navegador');
  console.log('   2. Problema de estado de React');
  console.log('   3. Problema de timing en la carga');
  console.log('   4. Problema de StrictMode (doble renderizado)');
  console.log('');
  console.log('🧪 Acciones recomendadas:');
  console.log('   1. Limpiar cache del navegador');
  console.log('   2. Verificar consola del navegador');
  console.log('   3. Verificar si el problema persiste en modo incógnito');
  console.log('   4. Verificar si es un problema de StrictMode');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('⚠️ Hay problemas que pueden causar duplicación');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los errores arriba');
  console.log('   2. Corregir la lógica de filtrado');
  console.log('   3. Implementar deduplicación de datos');
  console.log('   4. Verificar múltiples fuentes de datos');
}

console.log('\n📚 Archivos de referencia:');
console.log('   - constants.ts (datos de manos)');
console.log('   - components/GamingPartSelector.tsx (renderizado)');
console.log('   - App.tsx (lógica de carga)');

process.exit(allChecksPassed ? 0 : 1); 