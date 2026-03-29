#!/usr/bin/env node

/**
 * 🎨 DEBUG: LEGS MATERIALS ISSUE
 * 
 * Este script ayuda a diagnosticar por qué los materiales de las piernas (LOWER_BODY)
 * no se están aplicando correctamente en el 3D Customizer.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG: LEGS MATERIALS ISSUE');
console.log('================================');

// Verificar archivos de materiales
const materialsDir = path.join(__dirname, '../components/materials');
const materialFiles = [
  'MI_1021500_Legs.json',
  'materials.ts',
  'pbr-materials-index.json'
];

console.log('\n📁 Verificando archivos de materiales:');
materialFiles.forEach(file => {
  const filePath = path.join(materialsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NO ENCONTRADO`);
  }
});

// Verificar configuración en MaterialConfigurator
const materialConfigPath = path.join(__dirname, '../components/MaterialConfigurator.tsx');
if (fs.existsSync(materialConfigPath)) {
  const content = fs.readFileSync(materialConfigPath, 'utf8');
  
  console.log('\n🎨 Verificando configuración en MaterialConfigurator:');
  
  // Verificar si LOWER_BODY está en materialPresets
  if (content.includes('LOWER_BODY: [')) {
    console.log('   ✅ LOWER_BODY configurado en materialPresets');
  } else {
    console.log('   ❌ LOWER_BODY NO configurado en materialPresets');
  }
  
  // Verificar si LOWER_BODY está en availableCategories
  if (content.includes("'LOWER_BODY'")) {
    console.log('   ✅ LOWER_BODY incluido en availableCategories');
  } else {
    console.log('   ❌ LOWER_BODY NO incluido en availableCategories');
  }
  
  // Verificar si applyMaterialPreset llama a onMaterialChange
  if (content.includes('onMaterialChange(material, selectedPart)')) {
    console.log('   ✅ applyMaterialPreset llama a onMaterialChange');
  } else {
    console.log('   ❌ applyMaterialPreset NO llama a onMaterialChange');
  }
} else {
  console.log('   ❌ MaterialConfigurator.tsx NO ENCONTRADO');
}

// Verificar configuración en CharacterViewer
const characterViewerPath = path.join(__dirname, '../components/CharacterViewer.tsx');
if (fs.existsSync(characterViewerPath)) {
  const content = fs.readFileSync(characterViewerPath, 'utf8');
  
  console.log('\n🎯 Verificando configuración en CharacterViewer:');
  
  // Verificar si applyMaterialToPart existe
  if (content.includes('applyMaterialToPart: (material: THREE.Material, partType: string)')) {
    console.log('   ✅ applyMaterialToPart definido');
  } else {
    console.log('   ❌ applyMaterialToPart NO definido');
  }
  
  // Verificar si usa userData.category
  if (content.includes('child.userData.category === partType')) {
    console.log('   ✅ Usa userData.category para matching');
  } else {
    console.log('   ❌ NO usa userData.category para matching');
  }
} else {
  console.log('   ❌ CharacterViewer.tsx NO ENCONTRADO');
}

// Verificar tipos
const typesPath = path.join(__dirname, '../types.ts');
if (fs.existsSync(typesPath)) {
  const content = fs.readFileSync(typesPath, 'utf8');
  
  console.log('\n📋 Verificando tipos:');
  
  // Verificar si LOWER_BODY está en PartCategory
  if (content.includes('LOWER_BODY =')) {
    console.log('   ✅ LOWER_BODY definido en PartCategory');
  } else {
    console.log('   ❌ LOWER_BODY NO definido en PartCategory');
  }
} else {
  console.log('   ❌ types.ts NO ENCONTRADO');
}

console.log('\n🔧 POSIBLES SOLUCIONES:');
console.log('1. Verificar que los meshes de piernas tengan userData.category = "LOWER_BODY"');
console.log('2. Verificar que el mapeo de categorías sea correcto');
console.log('3. Verificar que los materiales se apliquen inmediatamente');
console.log('4. Verificar que no haya conflictos de nombres');

console.log('\n📝 PRÓXIMOS PASOS:');
console.log('1. Abrir http://localhost:5178/');
console.log('2. Ir al menú de materiales');
console.log('3. Seleccionar "Legs"');
console.log('4. Aplicar un material');
console.log('5. Revisar la consola del navegador para logs de debug');

console.log('\n🎉 Debug completado!'); 