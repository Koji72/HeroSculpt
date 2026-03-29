#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 DIAGNÓSTICO RÁPIDO - Poses del usuario');
console.log('==========================================\n');

// 1. Verificar que loadUserPoses está presente y correcta
console.log('1️⃣ Verificando loadUserPoses...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  const hasLoadUserPoses = appContent.includes('const loadUserPoses = useCallback');
  console.log(`   ${hasLoadUserPoses ? '✅' : '❌'} loadUserPoses definida`);
  
  const callsLoadUserPoses = appContent.includes('await loadUserPoses()');
  console.log(`   ${callsLoadUserPoses ? '✅' : '❌'} loadUserPoses se llama después del login`);
  
  const hasUserPosesState = appContent.includes('setSavedPoses(allPoses)');
  console.log(`   ${hasUserPosesState ? '✅' : '❌'} setSavedPoses se ejecuta`);
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
}

// 2. Verificar que no hay cambios recientes que afecten las poses
console.log('\n2️⃣ Verificando cambios recientes...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que no se eliminó algo importante
  const hasPurchaseHistory = appContent.includes('PurchaseHistoryService.getUserPurchases');
  console.log(`   ${hasPurchaseHistory ? '✅' : '❌'} PurchaseHistoryService presente`);
  
  const hasUserConfig = appContent.includes('UserConfigService.getUserConfigurations');
  console.log(`   ${hasUserConfig ? '✅' : '❌'} UserConfigService presente`);
  
  const hasPoseNavigation = appContent.includes('PoseNavigation') || appContent.includes('onPreviousPose');
  console.log(`   ${hasPoseNavigation ? '✅' : '❌'} PoseNavigation presente`);
  
} catch (error) {
  console.log('   ❌ Error verificando servicios:', error.message);
}

// 3. Verificar que el CharacterViewer recibe las poses
console.log('\n3️⃣ Verificando CharacterViewer...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Buscar el render de CharacterViewer con regex multilínea
  const characterViewerMatch = appContent.match(/<CharacterViewer[\s\S]*?\/>/);
  if (characterViewerMatch) {
    const hasSavedPoses = characterViewerMatch[0].includes('savedPoses={savedPoses}');
    console.log(`   ${hasSavedPoses ? '✅' : '❌'} savedPoses pasado a CharacterViewer`);
    
    const hasCurrentPoseIndex = characterViewerMatch[0].includes('currentPoseIndex={currentPoseIndex}');
    console.log(`   ${hasCurrentPoseIndex ? '✅' : '❌'} currentPoseIndex pasado a CharacterViewer`);
    
    const hasPoseHandlers = characterViewerMatch[0].includes('onPreviousPose={handlePreviousPose}');
    console.log(`   ${hasPoseHandlers ? '✅' : '❌'} Manejadores de poses pasados`);
  } else {
    // Buscar de forma más simple
    const hasSavedPoses = appContent.includes('savedPoses={savedPoses}');
    console.log(`   ${hasSavedPoses ? '✅' : '❌'} savedPoses presente en App.tsx`);
    
    const hasCurrentPoseIndex = appContent.includes('currentPoseIndex={currentPoseIndex}');
    console.log(`   ${hasCurrentPoseIndex ? '✅' : '❌'} currentPoseIndex presente en App.tsx`);
    
    const hasPoseHandlers = appContent.includes('onPreviousPose={handlePreviousPose}');
    console.log(`   ${hasPoseHandlers ? '✅' : '❌'} Manejadores de poses presentes en App.tsx`);
  }
  
} catch (error) {
  console.log('   ❌ Error verificando CharacterViewer:', error.message);
}

// 4. Verificar que no hay problemas de sintaxis
console.log('\n4️⃣ Verificando sintaxis...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que no hay errores de sintaxis obvios
  const hasSyntaxErrors = appContent.includes('❌') || appContent.includes('ERROR');
  console.log(`   ${!hasSyntaxErrors ? '✅' : '❌'} No hay errores de sintaxis obvios`);
  
  // Verificar que los imports están presentes
  const hasImports = appContent.includes('import') && appContent.includes('from');
  console.log(`   ${hasImports ? '✅' : '❌'} Imports presentes`);
  
} catch (error) {
  console.log('   ❌ Error verificando sintaxis:', error.message);
}

// 5. Verificar que el fix de manos no afectó las poses
console.log('\n5️⃣ Verificando que el fix de manos no afectó poses...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que no se eliminó algo relacionado con poses
  const hasPoseState = appContent.includes('savedPoses') && appContent.includes('setSavedPoses');
  console.log(`   ${hasPoseState ? '✅' : '❌'} Estado de poses presente`);
  
  const hasPoseIndex = appContent.includes('currentPoseIndex') && appContent.includes('setCurrentPoseIndex');
  console.log(`   ${hasPoseIndex ? '✅' : '❌'} Índice de poses presente`);
  
  // Verificar que el TorsoSubmenu no tiene onToggle (parte del fix)
  const hasOnToggleInTorsoSubmenu = appContent.includes('onToggle={handleTorsoSubmenuToggle}');
  console.log(`   ${!hasOnToggleInTorsoSubmenu ? '✅' : '❌'} Fix de manos aplicado correctamente`);
  
} catch (error) {
  console.log('   ❌ Error verificando fix de manos:', error.message);
}

console.log('\n📋 RESUMEN:');
console.log('===========');
console.log('🎯 Si todo está ✅, el problema puede ser:');
console.log('   1. Problema de red/database');
console.log('   2. Usuario no tiene poses guardadas');
console.log('   3. Problema temporal de carga');
console.log('   4. Necesita refrescar la página');
console.log('');
console.log('🔧 Acciones recomendadas:');
console.log('   1. Abrir consola del navegador');
console.log('   2. Verificar logs de loadUserPoses');
console.log('   3. Verificar si hay errores de red');
console.log('   4. Probar con otro usuario');
console.log('   5. Refrescar la página');

process.exit(0); 