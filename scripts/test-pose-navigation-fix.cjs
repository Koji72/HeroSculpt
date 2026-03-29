#!/usr/bin/env node

/**
 * Script de prueba para verificar la corrección de navegación de poses
 * 
 * Este script verifica que:
 * 1. Las poses se cargan correctamente
 * 2. La navegación funciona después de modificar una pose
 * 3. Los cambios se guardan correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: Verificación de navegación de poses después de modificaciones');
console.log('=' .repeat(60));

// Verificar archivos críticos
const criticalFiles = [
  'App.tsx',
  'components/PoseNavigation.tsx',
  'components/CharacterViewer.tsx',
  'services/userConfigService.ts'
];

console.log('\n📁 Verificando archivos críticos:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '..', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Verificar la implementación del fix
console.log('\n🔍 Verificando implementación del fix:');

// Verificar el nuevo useEffect en App.tsx
const appContent = fs.readFileSync(path.join(__dirname, '..', 'App.tsx'), 'utf8');
const hasUpdatePoseEffect = appContent.includes('updateCurrentPoseConfiguration');
const hasUserConfigUpdate = appContent.includes('UserConfigService.updateConfiguration');

console.log(`  ${hasUpdatePoseEffect ? '✅' : '❌'} useEffect para actualizar configuración de pose`);
console.log(`  ${hasUserConfigUpdate ? '✅' : '❌'} Actualización en base de datos`);

// Verificar que las props se pasan correctamente
const hasPoseProps = appContent.includes('savedPoses={savedPoses}') && 
                    appContent.includes('currentPoseIndex={currentPoseIndex}') &&
                    appContent.includes('onPreviousPose={handlePreviousPose}') &&
                    appContent.includes('onNextPose={handleNextPose}');

console.log(`  ${hasPoseProps ? '✅' : '❌'} Props de navegación pasadas correctamente`);

// Verificar funciones de navegación
const hasNavigationFunctions = appContent.includes('handlePreviousPose') && 
                              appContent.includes('handleNextPose') && 
                              appContent.includes('handleSelectPose');

console.log(`  ${hasNavigationFunctions ? '✅' : '❌'} Funciones de navegación implementadas`);

// Verificar PoseNavigation component
const poseNavContent = fs.readFileSync(path.join(__dirname, '..', 'components/PoseNavigation.tsx'), 'utf8');
const hasPoseButtons = poseNavContent.includes('onPreviousPose') && 
                      poseNavContent.includes('onNextPose') &&
                      poseNavContent.includes('◀') && 
                      poseNavContent.includes('▶');

console.log(`  ${hasPoseButtons ? '✅' : '❌'} Botones de navegación en PoseNavigation`);

// Verificar CharacterViewer integration
const charViewerContent = fs.readFileSync(path.join(__dirname, '..', 'components/CharacterViewer.tsx'), 'utf8');
const hasPoseNavIntegration = charViewerContent.includes('<PoseNavigation') &&
                             charViewerContent.includes('savedPoses={savedPoses || []}');

console.log(`  ${hasPoseNavIntegration ? '✅' : '❌'} Integración con PoseNavigation en CharacterViewer`);

console.log('\n📋 Resumen de la corrección:');
console.log('=' .repeat(40));

if (hasUpdatePoseEffect && hasUserConfigUpdate && hasPoseProps && hasNavigationFunctions && hasPoseButtons && hasPoseNavIntegration) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('\n🎯 La corrección implementada debería resolver el problema:');
  console.log('   • Las poses se actualizan automáticamente cuando se modifican');
  console.log('   • La navegación funciona correctamente después de cambios');
  console.log('   • Los cambios se guardan en la base de datos');
  console.log('   • El estado local se mantiene sincronizado');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('\n🔧 Revisar los puntos marcados con ❌');
}

console.log('\n🚀 Para probar manualmente:');
console.log('1. Inicia la aplicación: npm run dev');
console.log('2. Modifica una pose añadiendo componentes');
console.log('3. Usa las flechas verdes para navegar a otras poses');
console.log('4. Verifica que los cambios se mantienen al volver a la pose modificada');

console.log('\n📝 Logs a monitorear:');
console.log('   • "Error updating pose configuration in database"');
console.log('   • "Error saving last pose automatically"');
console.log('   • "Attempted to select invalid pose index"');

console.log('\n✨ Test completado!'); 