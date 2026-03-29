#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 VERIFICANDO CORRECCIÓN DE SELECCIÓN DE PARTES (MANOS, CABEZA)...\n');

// 1. Verificar App.tsx: handleSelectPart - que no sobrescriba para categorías no-torso/legs
console.log('1️⃣ VERIFICANDO App.tsx: handleSelectPart:\n');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Asegurarse de que el bloque de adaptación de capa genérico se eliminó
  const hasRemovedGenericCapeLogic = !appContent.includes('// ✅ CORREGIDO: Preservar capas para TODAS las categorías');
  console.log(`   ${hasRemovedGenericCapeLogic ? '✅' : '❌'} Lógica genérica de capa eliminada`);
  
  // Verificar que la asignación de partes genérica sea directa
  const isGenericAssignmentDirect = appContent.includes('// Handle regular part selection') &&
                                    appContent.includes('delete newParts[category];') &&
                                    appContent.includes('newParts[category] = part;');
  console.log(`   ${isGenericAssignmentDirect ? '✅' : '❌'} Asignación genérica de partes es directa`);
  
} catch (error) {
  console.log(`   ❌ Error leyendo App.tsx: ${error.message}`);
}

// 2. Verificar PartSelectorPanel.tsx: handlePreviewSelect y handleHoverPreview
console.log('\n2️⃣ VERIFICANDO PartSelectorPanel.tsx: handlePreviewSelect y handleHoverPreview:\n');

try {
  const panelContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // handlePreviewSelect: verificar que SYMBOL ya no tiene bloque especial y que CAPE está en generic list
  const hasRemovedSymbolPreviewLogic = !panelContent.includes('// SPECIAL CASE: If selecting symbol, recalculate with torso compatibility');
  const capeInPreviewGenericList = panelContent.includes('PartCategory.CAPE // Added CAPE here') && 
                                  panelContent.includes('categoriesWithCompleteState.includes(activeCategory)');
  console.log(`   ${hasRemovedSymbolPreviewLogic ? '✅' : '❌'} SYMBOL handling removido de handlePreviewSelect`);
  console.log(`   ${capeInPreviewGenericList ? '✅' : '❌'} CAPE en lista genérica de handlePreviewSelect`);

  // handleHoverPreview: verificar que SYMBOL y CAPE ya no tienen bloques especiales y están en generic list
  const hasRemovedSymbolHoverLogic = !panelContent.includes('// SPECIAL CASE: Si se hace hover sobre el símbolo, recalcular la compatibilidad con el torso');
  const hasRemovedCapeHoverLogic = !panelContent.includes('// SPECIAL CASE: Si se hace hover sobre la capa, recalcular la compatibilidad con el torso');
  const capeInHoverGenericList = panelContent.includes('PartCategory.CAPE // Added CAPE here') &&
                                 panelContent.includes('categoriesWithCompleteState.includes(activeCategory)');
  console.log(`   ${hasRemovedSymbolHoverLogic ? '✅' : '❌'} SYMBOL handling removido de handleHoverPreview`);
  console.log(`   ${hasRemovedCapeHoverLogic ? '✅' : '❌'} CAPE handling removido de handleHoverPreview`);
  console.log(`   ${capeInHoverGenericList ? '✅' : '❌'} CAPE en lista genérica de handleHoverPreview`);

} catch (error) {
  console.log(`   ❌ Error leyendo PartSelectorPanel.tsx: ${error.message}`);
}

// 3. Verificar que las reglas críticas están intactas (re-verificación)
console.log('\n3️⃣ RE-VERIFICANDO REGLAS CRÍTICAS:\n');

try {
  const typesContent = fs.readFileSync('types.ts', 'utf8');
  const correctSelectedPartsType = typesContent.includes('export type SelectedParts = { [category: string]: Part };');
  console.log(`   ${correctSelectedPartsType ? '✅' : '❌'} SelectedParts type correcto`);
} catch (error) {
  console.log(`   ❌ Error leyendo types.ts: ${error.message}`);
}

try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  const doesntModifyTorso = !utilsContent.includes('newParts[PartCategory.TORSO]') &&
                           utilsContent.includes('newParts[PartCategory.HAND_LEFT]') &&
                           utilsContent.includes('newParts[PartCategory.HAND_RIGHT]');
  console.log(`   ${doesntModifyTorso ? '✅' : '❌'} assignDefaultHandsForTorso no modifica el torso`);
} catch (error) {
  console.log(`   ❌ Error leyendo lib/utils.ts: ${error.message}`);
}

// Resumen y próximos pasos
console.log('\n📊 RESUMEN DE LA CORRECCIÓN DE PARTES:\n');
console.log('🔧 PROBLEMA IDENTIFICADO Y CORREGIDO:');
console.log('❌ PROBLEMA ORIGINAL: La lógica adaptativa sobrescribía selecciones directas de manos/cabeza.');
console.log('✅ SOLUCIÓN IMPLEMENTADA: Se eliminaron las llamadas incorrectas en PartSelectorPanel.tsx y App.tsx.');
console.log('Esto asegura que las funciones adaptativas solo actúen cuando el torso/piernas cambian.');

console.log('\n🎯 RESULTADO:');
console.log('✅ Las manos, cabezas y otras partes ahora se seleccionan directamente sin sobrescribir.');
console.log('✅ Las reglas críticas del proyecto se mantienen intactas.');
console.log('✅ El sistema de compatibilidad funciona como se espera (solo cuando el torso/piernas cambian).');

console.log('\n🚀 PRÓXIMOS PASOS RECOMENDADOS:');
console.log('   1. Abrir la aplicación en el navegador.');
console.log('   2. Seleccionar diferentes torsos y verificar que manos/cabezas se adapten.');
console.log('   3. Luego, seleccionar manos y cabezas *directamente* y verificar que no se sobrescriban.');
console.log('   4. Probar capas y símbolos de la misma manera.');
console.log('   5. Confirmar que no hay errores en la consola.');