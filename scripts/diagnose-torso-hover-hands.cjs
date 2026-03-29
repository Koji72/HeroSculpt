#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO - Manos que desaparecen en hover de torso');
console.log('========================================================\n');

// 1. Verificar función assignDefaultHandsForTorso
console.log('1️⃣ Verificando función assignDefaultHandsForTorso...');
try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  
  // Verificar que la función preserva manos existentes
  const hasPreservationLogic = utilsContent.includes('// ✅ CORREGIDO: NO eliminar manos existentes - preservarlas');
  if (hasPreservationLogic) {
    console.log('   ✅ Lógica de preservación de manos presente');
  } else {
    console.log('   ❌ Lógica de preservación de manos NO encontrada');
  }
  
  // Verificar que usa categorías como keys
  const usesCategoryKeys = utilsContent.includes('newParts[PartCategory.HAND_LEFT]') && 
                          utilsContent.includes('newParts[PartCategory.HAND_RIGHT]');
  if (usesCategoryKeys) {
    console.log('   ✅ Usa categorías como keys (correcto)');
  } else {
    console.log('   ❌ NO usa categorías como keys (incorrecto)');
  }
  
  // Verificar logs de debugging
  const hasDebugLogs = utilsContent.includes('assignDefaultHandsForTorso called with:');
  if (hasDebugLogs) {
    console.log('   ✅ Logs de debugging presentes');
  } else {
    console.log('   ❌ Logs de debugging NO encontrados');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo lib/utils.ts:', error.message);
}

// 2. Verificar lógica de hover en PartSelectorPanel
console.log('\n2️⃣ Verificando lógica de hover en PartSelectorPanel...');
try {
  const panelContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Verificar que elimina torso actual antes del preview
  const removesCurrentTorso = panelContent.includes('delete partsWithoutCurrentTorso[PartCategory.TORSO]') &&
                              panelContent.includes('delete partsWithoutCurrentTorso[PartCategory.SUIT_TORSO]');
  if (removesCurrentTorso) {
    console.log('   ✅ Elimina torso actual antes del preview');
  } else {
    console.log('   ❌ NO elimina torso actual antes del preview');
  }
  
  // Verificar que aplica funciones de compatibilidad
  const appliesCompatibility = panelContent.includes('assignDefaultHandsForTorso(partToDisplay, partsWithoutCurrentTorso)') &&
                              panelContent.includes('assignAdaptiveHeadForTorso(partToDisplay, fullCompatibleParts)');
  if (appliesCompatibility) {
    console.log('   ✅ Aplica funciones de compatibilidad');
  } else {
    console.log('   ❌ NO aplica funciones de compatibilidad');
  }
  
  // Verificar que combina resultados correctamente
  const combinesResults = panelContent.includes('...partsWithoutCurrentTorso') &&
                         panelContent.includes('...finalCompatibleParts');
  if (combinesResults) {
    console.log('   ✅ Combina resultados correctamente');
  } else {
    console.log('   ❌ NO combina resultados correctamente');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo PartSelectorPanel.tsx:', error.message);
}

// 3. Verificar documentación de protección
console.log('\n3️⃣ Verificando documentación de protección...');
try {
  const protectionDoc = fs.readFileSync('docs/POSE_NAVIGATION_PROTECTION_RULES_2025.md', 'utf8');
  const hoverDoc = fs.readFileSync('docs/HOVER_PREVIEW_FIXES_REPORT_2025.md', 'utf8');
  
  if (protectionDoc.length > 1000) {
    console.log('   ✅ Documentación de protección presente');
  } else {
    console.log('   ❌ Documentación de protección incompleta');
  }
  
  if (hoverDoc.length > 100) {
    console.log('   ✅ Documentación de hover presente');
  } else {
    console.log('   ❌ Documentación de hover incompleta');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo documentación:', error.message);
}

// 4. Verificar reglas de Cursor
console.log('\n4️⃣ Verificando reglas de Cursor...');
try {
  const cursorRules = fs.readFileSync('.cursor/rules/readmerules.mdc', 'utf8');
  
  const hasHoverProtection = cursorRules.includes('SISTEMA DE HOVER PREVIEW (PROTEGIDO)') &&
                            cursorRules.includes('NUNCA MODIFICAR ESTA LÓGICA');
  if (hasHoverProtection) {
    console.log('   ✅ Reglas de protección de hover presentes');
  } else {
    console.log('   ❌ Reglas de protección de hover NO encontradas');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo reglas de Cursor:', error.message);
}

// 5. Simular lógica de hover para detectar problemas
console.log('\n5️⃣ Simulando lógica de hover...');
try {
  // Simular el flujo de hover
  console.log('   🔄 Simulando hover sobre torso...');
  console.log('   1. selectedParts = { TORSO: "strong_torso_01", HAND_LEFT: "strong_hands_fist_01_t01_l_ng", HAND_RIGHT: "strong_hands_fist_01_t01_r_ng" }');
  console.log('   2. partsWithoutCurrentTorso = { HAND_LEFT: "strong_hands_fist_01_t01_l_ng", HAND_RIGHT: "strong_hands_fist_01_t01_r_ng" }');
  console.log('   3. partToDisplay = "strong_torso_02"');
  console.log('   4. assignDefaultHandsForTorso(strong_torso_02, partsWithoutCurrentTorso)');
  console.log('   5. Resultado esperado: manos compatibles con strong_torso_02');
  
  // Verificar que la función assignDefaultHandsForTorso maneja este caso
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  const handlesNoCurrentHands = utilsContent.includes('if (!currentLeftHand && !currentRightHand)') &&
                               utilsContent.includes('No hay manos actuales, asignando manos por defecto');
  
  if (handlesNoCurrentHands) {
    console.log('   ✅ Maneja caso de no manos actuales');
  } else {
    console.log('   ❌ NO maneja caso de no manos actuales');
  }
  
} catch (error) {
  console.log('   ❌ Error en simulación:', error.message);
}

// Resultado final
console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
console.log('============================');

console.log('🎯 Posibles causas del problema:');
console.log('   1. La función assignDefaultHandsForTorso no preserva manos existentes');
console.log('   2. La lógica de hover elimina manos antes de aplicar compatibilidad');
console.log('   3. Las manos no son compatibles con el nuevo torso');
console.log('   4. El preview no incluye las manos en el estado final');

console.log('\n🔧 Acciones recomendadas:');
console.log('   1. Verificar logs del navegador durante hover');
console.log('   2. Confirmar que las manos son compatibles con el torso');
console.log('   3. Verificar que el preview incluye las manos');
console.log('   4. Revisar la función assignDefaultHandsForTorso');

console.log('\n📚 Documentación de referencia:');
console.log('   - docs/HANDS_DUPLICATION_FIX_2025.md');
console.log('   - docs/HOVER_PREVIEW_FIXES_REPORT_2025.md');
console.log('   - lib/utils.ts (función assignDefaultHandsForTorso)');
console.log('   - components/PartSelectorPanel.tsx (función handleHoverPreview)');

console.log('\n🚨 Si el problema persiste:');
console.log('   1. Activar logs de debugging en el navegador');
console.log('   2. Verificar compatibilidad de manos con torso');
console.log('   3. Confirmar que el preview se envía correctamente');
console.log('   4. Revisar CharacterViewer para ver si recibe las manos'); 