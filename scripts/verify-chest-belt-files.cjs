#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE CORRESPONDENCIA CHEST BELT');
console.log('=============================================');

// Definiciones de partes (copiadas del archivo TypeScript)
const DEFINED_PARTS = [
  'strong_beltchest_01_np',
  'strong_beltchest_01_t01_np',
  'strong_beltchest_01_t01',
  'strong_beltchest_01_t02_np',
  'strong_beltchest_01_t02',
  'strong_beltchest_01_t03_np',
  'strong_beltchest_01_t03',
  'strong_beltchest_01_t04_np',
  'strong_beltchest_01_t04',
  'strong_beltchest_01_t05_np',
  'strong_beltchest_01_t05',
  'strong_beltchest_01',
  'strong_beltchest_none_01_t03'
];

// Archivos GLB encontrados en el directorio
const GLB_FILES = [
  'strong_beltchest_01.glb',
  'strong_beltchest_01_t02.glb',
  'strong_beltchest_01_t05.glb',
  'strong_beltchest_01_t01.glb',
  'strong_beltchest_none_01_t03.glb',
  'strong_beltchest_01_t04.glb',
  'strong_beltchest_01_t03.glb',
  'strong_beltchest_01_t05_np.glb',
  'strong_beltchest_01_t02_np.glb',
  'strong_beltchest_01_t01_np.glb',
  'strong_beltchest_01_t03_np.glb',
  'strong_beltchest_01_t04_np.glb',
  'strong_beltchest_01_np.glb'
];

console.log(`📋 PARTES DEFINIDAS: ${DEFINED_PARTS.length}`);
console.log(`📁 ARCHIVOS GLB: ${GLB_FILES.length}`);

// Convertir archivos GLB a IDs (remover .glb)
const GLB_IDS = GLB_FILES.map(file => file.replace('.glb', ''));

console.log('\n🔍 VERIFICACIÓN DETALLADA:');

// Verificar que cada parte definida tenga su archivo GLB
console.log('\n✅ PARTES DEFINIDAS CON ARCHIVO GLB:');
let missingFiles = 0;
DEFINED_PARTS.forEach(partId => {
  const hasFile = GLB_IDS.includes(partId);
  console.log(`   ${hasFile ? '✅' : '❌'} ${partId}`);
  if (!hasFile) missingFiles++;
});

// Verificar que cada archivo GLB tenga su definición
console.log('\n✅ ARCHIVOS GLB CON DEFINICIÓN:');
let orphanFiles = 0;
GLB_IDS.forEach(fileId => {
  const hasDefinition = DEFINED_PARTS.includes(fileId);
  console.log(`   ${hasDefinition ? '✅' : '❌'} ${fileId}`);
  if (!hasDefinition) orphanFiles++;
});

// Resumen
console.log('\n📊 RESUMEN:');
console.log(`   Partes definidas: ${DEFINED_PARTS.length}`);
console.log(`   Archivos GLB: ${GLB_FILES.length}`);
console.log(`   Archivos faltantes: ${missingFiles}`);
console.log(`   Archivos huérfanos: ${orphanFiles}`);

if (missingFiles === 0 && orphanFiles === 0) {
  console.log('\n🎯 RESULTADO: ✅ CORRESPONDENCIA PERFECTA');
  console.log('   Todos los archivos GLB tienen su definición y viceversa.');
} else {
  console.log('\n⚠️ RESULTADO: ❌ PROBLEMAS ENCONTRADOS');
  
  if (missingFiles > 0) {
    console.log(`   - ${missingFiles} partes definidas sin archivo GLB`);
  }
  
  if (orphanFiles > 0) {
    console.log(`   - ${orphanFiles} archivos GLB sin definición`);
  }
}

// Verificar rutas específicas
console.log('\n🔍 VERIFICACIÓN DE RUTAS:');
DEFINED_PARTS.forEach(partId => {
  const expectedPath = `assets/strong/chest_belt/${partId}.glb`;
  const hasFile = GLB_IDS.includes(partId);
  console.log(`   ${hasFile ? '✅' : '❌'} ${expectedPath}`);
});

console.log('\n💡 RECOMENDACIONES:');
if (missingFiles === 0 && orphanFiles === 0) {
  console.log('   ✅ El sistema está perfectamente sincronizado');
  console.log('   ✅ No se requieren cambios en las definiciones');
} else {
  console.log('   🔧 Se requieren ajustes en las definiciones de partes');
  console.log('   🔧 Verificar que todos los archivos GLB estén incluidos');
} 