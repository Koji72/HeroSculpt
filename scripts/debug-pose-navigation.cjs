#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE NAVEGACIÓN DE POSES');
console.log('=====================================\n');

// 1. Verificar App.tsx - Funciones de navegación
console.log('1️⃣ VERIFICANDO funciones de navegación en App.tsx...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar handleNextPose
  const hasHandleNextPose = appContent.includes('const handleNextPose = () => {');
  console.log(`   ${hasHandleNextPose ? '✅' : '❌'} handleNextPose definida`);
  
  // Verificar handlePreviousPose
  const hasHandlePreviousPose = appContent.includes('const handlePreviousPose = () => {');
  console.log(`   ${hasHandlePreviousPose ? '✅' : '❌'} handlePreviousPose definida`);
  
  // Verificar handleSelectPose
  const hasHandleSelectPose = appContent.includes('const handleSelectPose = (index: number) => {');
  console.log(`   ${hasHandleSelectPose ? '✅' : '❌'} handleSelectPose definida`);
  
  // Verificar que se pasan las props al CharacterViewer
  const passesPoseProps = appContent.includes('onPreviousPose={handlePreviousPose}') && 
                         appContent.includes('onNextPose={handleNextPose}') &&
                         appContent.includes('onSelectPose={handleSelectPose}');
  console.log(`   ${passesPoseProps ? '✅' : '❌'} Props pasadas al CharacterViewer`);
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
}

// 2. Verificar CharacterViewer.tsx - Integración de PoseNavigation
console.log('\n2️⃣ VERIFICANDO integración en CharacterViewer.tsx...');
try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar que PoseNavigation se renderiza
  const hasPoseNavigation = viewerContent.includes('<PoseNavigation');
  console.log(`   ${hasPoseNavigation ? '✅' : '❌'} PoseNavigation renderizado`);
  
  // Verificar que se pasan las props correctamente
  const passesProps = viewerContent.includes('onPreviousPose={onPreviousPose') &&
                     viewerContent.includes('onNextPose={onNextPose') &&
                     viewerContent.includes('onSelectPose={onSelectPose');
  console.log(`   ${passesProps ? '✅' : '❌'} Props pasadas a PoseNavigation`);
  
  // Verificar useEffect para selectedParts
  const hasSelectedPartsEffect = viewerContent.includes('useEffect(() => {') && 
                                viewerContent.includes('selectedParts') &&
                                viewerContent.includes('performModelLoad');
  console.log(`   ${hasSelectedPartsEffect ? '✅' : '❌'} useEffect para selectedParts`);
  
} catch (error) {
  console.log('   ❌ Error leyendo CharacterViewer.tsx:', error.message);
}

// 3. Verificar PoseNavigation.tsx - Botones de navegación
console.log('\n3️⃣ VERIFICANDO PoseNavigation.tsx...');
try {
  const navigationContent = fs.readFileSync('components/PoseNavigation.tsx', 'utf8');
  
  // Verificar botón anterior
  const hasPreviousButton = navigationContent.includes('onClick={onPreviousPose}');
  console.log(`   ${hasPreviousButton ? '✅' : '❌'} Botón anterior configurado`);
  
  // Verificar botón siguiente
  const hasNextButton = navigationContent.includes('onClick={onNextPose}');
  console.log(`   ${hasNextButton ? '✅' : '❌'} Botón siguiente configurado`);
  
  // Verificar contador clickable
  const hasCounterButton = navigationContent.includes('onClick={handleCounterClick}');
  console.log(`   ${hasCounterButton ? '✅' : '❌'} Contador clickable configurado`);
  
} catch (error) {
  console.log('   ❌ Error leyendo PoseNavigation.tsx:', error.message);
}

// 4. Verificar lógica de carga de poses
console.log('\n4️⃣ VERIFICANDO lógica de carga de poses...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar loadUserPoses
  const hasLoadUserPoses = appContent.includes('const loadUserPoses = async () => {');
  console.log(`   ${hasLoadUserPoses ? '✅' : '❌'} loadUserPoses definida`);
  
  // Verificar que se llama después del login
  const callsLoadUserPoses = appContent.includes('await loadUserPoses()');
  console.log(`   ${callsLoadUserPoses ? '✅' : '❌'} loadUserPoses se llama después del login`);
  
  // Verificar que se aplica la última pose
  const appliesLastPose = appContent.includes('setSelectedParts(allPoses[lastPoseIndex].configuration)');
  console.log(`   ${appliesLastPose ? '✅' : '❌'} Se aplica la configuración de la pose`);
  
} catch (error) {
  console.log('   ❌ Error verificando lógica de poses:', error.message);
}

// 5. Verificar servicios de poses
console.log('\n5️⃣ VERIFICANDO servicios de poses...');
try {
  const servicesDir = 'services';
  const files = fs.readdirSync(servicesDir);
  
  const hasPurchaseService = files.includes('purchaseAnalysisService.ts');
  console.log(`   ${hasPurchaseService ? '✅' : '❌'} PurchaseHistoryService existe`);
  
  const hasUserConfigService = files.includes('userConfigService.ts');
  console.log(`   ${hasUserConfigService ? '✅' : '❌'} UserConfigService existe`);
  
} catch (error) {
  console.log('   ❌ Error verificando servicios:', error.message);
}

console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
console.log('==========================');
console.log('✅ Si todos los checks están verdes, el problema puede ser:');
console.log('   1. Las poses no se están cargando correctamente de la BD');
console.log('   2. El CharacterViewer no está detectando cambios en selectedParts');
console.log('   3. Hay un problema de timing entre la navegación y la actualización del modelo');
console.log('   4. Las configuraciones de las poses están vacías o corruptas');
console.log('\n🔧 PRÓXIMOS PASOS:');
console.log('   1. Verificar en la consola del navegador si las poses se cargan');
console.log('   2. Verificar si selectedParts cambia cuando se navega');
console.log('   3. Verificar si performModelLoad se ejecuta al cambiar poses');
console.log('   4. Verificar el contenido de las configuraciones de las poses'); 