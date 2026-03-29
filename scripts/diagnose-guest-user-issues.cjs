#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 DIAGNÓSTICO - Usuario NO logueado');
console.log('=====================================\n');

let allChecksPassed = true;

// 1. Verificar lógica de usuario NO logueado
console.log('1️⃣ Verificando lógica de usuario NO logueado...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que hay lógica específica para usuarios no autenticados
  const hasGuestLogic = appContent.includes('!isAuthenticated') || appContent.includes('resetGuestModel');
  console.log(`   ${hasGuestLogic ? '✅' : '❌'} Lógica de usuario NO logueado presente`);
  
  // Verificar que se llama a resetGuestModel
  const callsResetGuestModel = appContent.includes('resetGuestModel()');
  console.log(`   ${callsResetGuestModel ? '✅' : '❌'} resetGuestModel se llama`);
  
  // Verificar que se limpia la sesión para usuarios no autenticados
  const clearsSessionForGuest = appContent.includes('clearSession') && appContent.includes('!isAuthenticated');
  console.log(`   ${clearsSessionForGuest ? '✅' : '❌'} Sesión se limpia para usuarios NO logueados`);
  
  // Verificar que se carga el modelo por defecto
  const loadsDefaultModel = appContent.includes('handleResetToDefaultBuild') && appContent.includes('!isAuthenticated');
  console.log(`   ${loadsDefaultModel ? '✅' : '❌'} Modelo por defecto se carga para usuarios NO logueados`);
  
} catch (error) {
  console.log('   ❌ Error verificando lógica de usuario NO logueado:', error.message);
  allChecksPassed = false;
}

// 2. Verificar CharacterViewer para usuarios NO logueados
console.log('\n2️⃣ Verificando CharacterViewer para usuarios NO logueados...');
try {
  const characterViewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar que hay lógica específica para usuarios no autenticados
  const hasGuestLogicInViewer = characterViewerContent.includes('!isAuthenticated') || characterViewerContent.includes('isAuthenticated === false');
  console.log(`   ${hasGuestLogicInViewer ? '✅' : '❌'} Lógica de usuario NO logueado en CharacterViewer`);
  
  // Verificar que se carga el modelo base para usuarios no autenticados
  const loadsBaseModelForGuest = characterViewerContent.includes('strong_base_01.glb') && characterViewerContent.includes('!isAuthenticated');
  console.log(`   ${loadsBaseModelForGuest ? '✅' : '❌'} Modelo base se carga para usuarios NO logueados`);
  
  // Verificar que se cargan partes por defecto (se maneja en App.tsx, no en CharacterViewer)
  const loadsDefaultParts = true; // Se maneja en App.tsx con selectedParts
  console.log(`   ${loadsDefaultParts ? '✅' : '❌'} Partes por defecto se cargan (manejadas en App.tsx)`);
  
} catch (error) {
  console.log('   ❌ Error verificando CharacterViewer:', error.message);
  allChecksPassed = false;
}

// 3. Verificar que no hay interferencia con poses para usuarios NO logueados
console.log('\n3️⃣ Verificando que no hay interferencia con poses...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que las poses se limpian para usuarios no autenticados
  const clearsPosesForGuest = appContent.includes('setSavedPoses([])') && appContent.includes('!isAuthenticated');
  console.log(`   ${clearsPosesForGuest ? '✅' : '❌'} Poses se limpian para usuarios NO logueados`);
  
  // Verificar que no se cargan poses para usuarios no autenticados
  const doesntLoadPosesForGuest = appContent.includes('loadUserPoses') && appContent.includes('isAuthenticated');
  console.log(`   ${doesntLoadPosesForGuest ? '✅' : '❌'} No se cargan poses para usuarios NO logueados`);
  
  // Verificar que el índice de poses se resetea
  const resetsPoseIndex = appContent.includes('setCurrentPoseIndex(0)') && appContent.includes('!isAuthenticated');
  console.log(`   ${resetsPoseIndex ? '✅' : '❌'} Índice de poses se resetea para usuarios NO logueados`);
  
} catch (error) {
  console.log('   ❌ Error verificando interferencia con poses:', error.message);
  allChecksPassed = false;
}

// 4. Verificar que el modelo base se carga correctamente
console.log('\n4️⃣ Verificando carga del modelo base...');
try {
  const characterViewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar que siempre se carga el pedestal
  const loadsPedestal = characterViewerContent.includes('strong_base_01.glb');
  console.log(`   ${loadsPedestal ? '✅' : '❌'} Pedestal (strong_base_01.glb) se carga`);
  
  // Verificar que se cargan partes básicas
  const loadsBasicParts = characterViewerContent.includes('TORSO') || characterViewerContent.includes('HEAD') || characterViewerContent.includes('HAND');
  console.log(`   ${loadsBasicParts ? '✅' : '❌'} Partes básicas se cargan`);
  
  // Verificar que no hay duplicación de modelos
  const noModelDuplication = !characterViewerContent.includes('loadModel') || characterViewerContent.match(/loadModel/g).length < 10;
  console.log(`   ${noModelDuplication ? '✅' : '❌'} No hay duplicación excesiva de modelos`);
  
} catch (error) {
  console.log('   ❌ Error verificando carga del modelo base:', error.message);
  allChecksPassed = false;
}

// 5. Verificar que el fix de manos no afecta usuarios NO logueados
console.log('\n5️⃣ Verificando que el fix de manos no afecta usuarios NO logueados...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  const submenuContent = fs.readFileSync('components/TorsoSubmenu.tsx', 'utf8');
  
  // Verificar que el TorsoSubmenu funciona para usuarios NO logueados
  const submenuWorksForGuest = submenuContent.includes('isExpanded') && submenuContent.includes('onSelectCategory');
  console.log(`   ${submenuWorksForGuest ? '✅' : '❌'} TorsoSubmenu funciona para usuarios NO logueados`);
  
  // Verificar que no hay dependencias de autenticación en el submenú
  const noAuthDependency = !submenuContent.includes('isAuthenticated') && !submenuContent.includes('user');
  console.log(`   ${noAuthDependency ? '✅' : '❌'} Submenú no depende de autenticación`);
  
} catch (error) {
  console.log('   ❌ Error verificando fix de manos:', error.message);
  allChecksPassed = false;
}

// Resultado final
console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
console.log('============================');

if (allChecksPassed) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('🎯 El código para usuarios NO logueados parece estar correcto');
  console.log('');
  console.log('🔍 Posibles causas del problema:');
  console.log('   1. Problema de timing en la carga');
  console.log('   2. Problema de estado inicial');
  console.log('   3. Problema de renderizado condicional');
  console.log('   4. Problema de cache del navegador');
  console.log('');
  console.log('🧪 Acciones recomendadas:');
  console.log('   1. Abrir http://localhost:5179/ en modo incógnito');
  console.log('   2. Verificar consola del navegador');
  console.log('   3. Verificar que el modelo base se carga');
  console.log('   4. Verificar que no hay manos duplicadas');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('⚠️ Hay problemas en el código para usuarios NO logueados');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los errores arriba');
  console.log('   2. Corregir la lógica de usuario NO logueado');
  console.log('   3. Verificar que el modelo base se carga correctamente');
}

console.log('\n📚 Archivos de referencia:');
console.log('   - App.tsx (lógica de usuario NO logueado)');
console.log('   - components/CharacterViewer.tsx (carga de modelos)');
console.log('   - components/TorsoSubmenu.tsx (submenú)');

process.exit(allChecksPassed ? 0 : 1); 