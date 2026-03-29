const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE PROBLEMA DE TORSOS');
console.log('=====================================\n');

// Verificar archivos críticos
const criticalFiles = [
  'App.tsx',
  'lib/utils.ts',
  'constants.ts',
  'types.ts'
];

console.log('📋 VERIFICACIÓN DE ARCHIVOS CRÍTICOS:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar constantes críticas
console.log('\n🔍 VERIFICACIÓN DE CONSTANTES:');

try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Verificar TORSO_DEPENDENT_CATEGORIES
  const torsoDependentMatch = constantsContent.match(/TORSO_DEPENDENT_CATEGORIES\s*=\s*\[([^\]]+)\]/);
  if (torsoDependentMatch) {
    console.log('✅ TORSO_DEPENDENT_CATEGORIES encontrado:');
    console.log(`   ${torsoDependentMatch[0]}`);
  } else {
    console.log('❌ TORSO_DEPENDENT_CATEGORIES NO encontrado');
  }
  
  // Verificar ALL_PARTS
  const allPartsMatch = constantsContent.match(/export const ALL_PARTS: Part\[\] = \[/);
  if (allPartsMatch) {
    console.log('✅ ALL_PARTS encontrado');
  } else {
    console.log('❌ ALL_PARTS NO encontrado');
  }
  
  // Contar torsos y suits
  const torsoMatches = constantsContent.match(/strong_torso_\d+/g);
  const suitMatches = constantsContent.match(/strong_suit_torso_\d+_t\d+/g);
  
  console.log(`   Torsos encontrados: ${torsoMatches ? torsoMatches.length : 0}`);
  console.log(`   Suits encontrados: ${suitMatches ? suitMatches.length : 0}`);
  
} catch (error) {
  console.log('❌ Error leyendo constants.ts:', error.message);
}

// Verificar App.tsx
console.log('\n🔍 VERIFICACIÓN DE App.tsx:');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar handleSelectPart para SUIT_TORSO
  const suitTorsoMatch = appContent.match(/if \(category === PartCategory\.SUIT_TORSO\) \{[\s\S]*?\}/);
  if (suitTorsoMatch) {
    console.log('✅ Lógica SUIT_TORSO encontrada');
    
    // Verificar si hay eliminación incorrecta del torso base
    const deleteTorsoMatch = suitTorsoMatch[0].match(/delete newParts\[PartCategory\.TORSO\];/);
    if (deleteTorsoMatch) {
      console.log('❌ PROBLEMA: Se está eliminando el torso base en SUIT_TORSO');
    } else {
      console.log('✅ CORRECTO: No se elimina el torso base en SUIT_TORSO');
    }
    
    // Verificar preservación de manos
    const preserveHandsMatch = suitTorsoMatch[0].match(/const currentLeftHand = Object\.values\(newParts\)\.find/);
    if (preserveHandsMatch) {
      console.log('✅ Preservación de manos implementada');
    } else {
      console.log('❌ PROBLEMA: No se preservan las manos');
    }
    
  } else {
    console.log('❌ Lógica SUIT_TORSO NO encontrada');
  }
  
  // Verificar handleSelectPart para TORSO
  const torsoMatch = appContent.match(/if \(category === PartCategory\.TORSO\) \{[\s\S]*?\}/);
  if (torsoMatch) {
    console.log('✅ Lógica TORSO encontrada');
    
    // Verificar TORSO_DEPENDENT_CATEGORIES
    const dependentCategoriesMatch = torsoMatch[0].match(/TORSO_DEPENDENT_CATEGORIES\.forEach/);
    if (dependentCategoriesMatch) {
      console.log('✅ TORSO_DEPENDENT_CATEGORIES usado en TORSO');
    } else {
      console.log('❌ PROBLEMA: TORSO_DEPENDENT_CATEGORIES no usado en TORSO');
    }
    
  } else {
    console.log('❌ Lógica TORSO NO encontrada');
  }
  
} catch (error) {
  console.log('❌ Error leyendo App.tsx:', error.message);
}

// Verificar lib/utils.ts
console.log('\n🔍 VERIFICACIÓN DE lib/utils.ts:');

try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  
  // Verificar assignDefaultHandsForTorso
  const assignHandsMatch = utilsContent.match(/export function assignDefaultHandsForTorso/);
  if (assignHandsMatch) {
    console.log('✅ assignDefaultHandsForTorso encontrado');
    
    // Verificar si elimina manos
    const deleteHandsMatch = utilsContent.match(/delete.*HAND_LEFT|delete.*HAND_RIGHT/);
    if (deleteHandsMatch) {
      console.log('❌ PROBLEMA: Se eliminan manos en assignDefaultHandsForTorso');
    } else {
      console.log('✅ CORRECTO: No se eliminan manos en assignDefaultHandsForTorso');
    }
    
  } else {
    console.log('❌ assignDefaultHandsForTorso NO encontrado');
  }
  
  // Verificar assignAdaptiveHeadForTorso
  const assignHeadMatch = utilsContent.match(/export function assignAdaptiveHeadForTorso/);
  if (assignHeadMatch) {
    console.log('✅ assignAdaptiveHeadForTorso encontrado');
  } else {
    console.log('❌ assignAdaptiveHeadForTorso NO encontrado');
  }
  
} catch (error) {
  console.log('❌ Error leyendo lib/utils.ts:', error.message);
}

// Verificar types.ts
console.log('\n🔍 VERIFICACIÓN DE types.ts:');

try {
  const typesContent = fs.readFileSync('types.ts', 'utf8');
  
  // Verificar SelectedParts
  const selectedPartsMatch = typesContent.match(/export type SelectedParts = \{ \[category: string\]: Part \};/);
  if (selectedPartsMatch) {
    console.log('✅ SelectedParts definido correctamente (usando categorías)');
  } else {
    console.log('❌ PROBLEMA: SelectedParts no definido correctamente');
  }
  
  // Verificar PartCategory
  const partCategoryMatch = typesContent.match(/enum PartCategory/);
  if (partCategoryMatch) {
    console.log('✅ PartCategory enum encontrado');
  } else {
    console.log('❌ PartCategory enum NO encontrado');
  }
  
} catch (error) {
  console.log('❌ Error leyendo types.ts:', error.message);
}

// Verificar CharacterViewer.tsx
console.log('\n🔍 VERIFICACIÓN DE CharacterViewer.tsx:');

try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar si hay filtrado de compatibilidad
  const compatibilityFilterMatch = viewerContent.match(/\.filter\(.*compatible\.includes/);
  if (compatibilityFilterMatch) {
    console.log('❌ PROBLEMA: Hay filtrado de compatibilidad en CharacterViewer');
    console.log('   Esto puede causar que las partes desaparezcan');
  } else {
    console.log('✅ CORRECTO: No hay filtrado de compatibilidad en CharacterViewer');
  }
  
} catch (error) {
  console.log('❌ Error leyendo CharacterViewer.tsx:', error.message);
}

console.log('\n=====================================');
console.log('🔍 DIAGNÓSTICO COMPLETADO');
console.log('=====================================');

// Verificar si hay errores de sintaxis
console.log('\n🔍 VERIFICACIÓN DE SINTAXIS:');

try {
  const { execSync } = require('child_process');
  
  console.log('Verificando TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript sin errores');
  
} catch (error) {
  console.log('❌ Errores de TypeScript:');
  console.log(error.stdout?.toString() || error.message);
}

console.log('\n🎯 RECOMENDACIONES:');
console.log('1. Verifica la consola del navegador para errores JavaScript');
console.log('2. Verifica que TORSO_DEPENDENT_CATEGORIES no incluya manos');
console.log('3. Verifica que no se elimine el torso base en SUIT_TORSO');
console.log('4. Verifica que CharacterViewer no filtre por compatibilidad');
console.log('5. Verifica que las funciones de preservación funcionen correctamente'); 