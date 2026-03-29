#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE MATERIALES PBR');
console.log('=====================================\n');

const materialsDir = path.join(__dirname, '..', 'components', 'materials');
const indexFile = path.join(materialsDir, 'pbr-materials-index.json');

// Verificar que el directorio existe
if (!fs.existsSync(materialsDir)) {
  console.log('❌ ERROR: Directorio de materiales no encontrado');
  process.exit(1);
}

// Verificar archivo de índice
if (!fs.existsSync(indexFile)) {
  console.log('❌ ERROR: Archivo de índice de materiales no encontrado');
  process.exit(1);
}

// Leer el índice
let index;
try {
  index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
  console.log('✅ Archivo de índice cargado correctamente');
} catch (error) {
  console.log('❌ ERROR: No se pudo parsear el archivo de índice:', error.message);
  process.exit(1);
}

// Verificar materiales
console.log('\n📋 Verificando materiales individuales:');
let totalMaterials = 0;
let validMaterials = 0;
let missingMaterials = [];

for (const [materialName, materialInfo] of Object.entries(index.materials)) {
  totalMaterials++;
  const materialFile = path.join(materialsDir, materialInfo.file);
  
  if (fs.existsSync(materialFile)) {
    try {
      const materialData = JSON.parse(fs.readFileSync(materialFile, 'utf8'));
      
      // Verificar estructura básica (nueva estructura PBR)
      const hasNewStructure = materialData.BaseTint && 
                             materialData.RoughnessPower && 
                             materialData.SpecularMultiplier;
      
      // Verificar estructura existente (con texturas y parámetros)
      const hasExistingStructure = materialData.Textures && 
                                  materialData.Parameters && 
                                  materialData.Parameters.Colors;
      
      const hasRequiredFields = hasNewStructure || hasExistingStructure;
      
      if (hasRequiredFields) {
        console.log(`   ✅ ${materialName}: ${materialInfo.description}`);
        validMaterials++;
      } else {
        console.log(`   ⚠️  ${materialName}: Estructura incompleta`);
        missingMaterials.push(materialName);
      }
    } catch (error) {
      console.log(`   ❌ ${materialName}: Error al parsear JSON`);
      missingMaterials.push(materialName);
    }
  } else {
    console.log(`   ❌ ${materialName}: Archivo no encontrado (${materialInfo.file})`);
    missingMaterials.push(materialName);
  }
}

// Verificar mapeo de categorías
console.log('\n🎯 Verificando mapeo de categorías:');
const categories = Object.keys(index.category_mapping);
console.log(`   📊 Categorías cubiertas: ${categories.length}`);
categories.forEach(category => {
  const materials = index.category_mapping[category];
  console.log(`   ✅ ${category}: ${materials.join(', ')}`);
});

// Verificar archivo materials.ts
console.log('\n🔧 Verificando integración con materials.ts:');
const materialsTsFile = path.join(materialsDir, 'materials.ts');
if (fs.existsSync(materialsTsFile)) {
  const materialsTsContent = fs.readFileSync(materialsTsFile, 'utf8');
  
  // Verificar que las funciones principales existen
  const checks = {
    'getMaterialForPath': materialsTsContent.includes('getMaterialForPath'),
    'createCustomMaterial': materialsTsContent.includes('createCustomMaterial'),
    'applyColorPalette': materialsTsContent.includes('applyColorPalette'),
    'getColorableParts': materialsTsContent.includes('getColorableParts'),
    'isPartColorable': materialsTsContent.includes('isPartColorable')
  };
  
  Object.entries(checks).forEach(([functionName, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} Función ${functionName}`);
  });
  
  // Verificar materiales específicos
  const materialChecks = {
    'headMaterial': materialsTsContent.includes('headMaterial'),
    'bodyMaterial': materialsTsContent.includes('bodyMaterial'),
    'capeMaterial': materialsTsContent.includes('capeMaterial'),
    'bootsMaterial': materialsTsContent.includes('bootsMaterial'),
    'symbolMaterial': materialsTsContent.includes('symbolMaterial'),
    'beltMaterial': materialsTsContent.includes('beltMaterial'),
    'pouchMaterial': materialsTsContent.includes('pouchMaterial')
  };
  
  console.log('\n   📦 Materiales en materials.ts:');
  Object.entries(materialChecks).forEach(([materialName, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} ${materialName}`);
  });
} else {
  console.log('   ❌ Archivo materials.ts no encontrado');
}

// Resumen final
console.log('\n=====================================');
console.log('📊 RESUMEN FINAL');
console.log('=====================================');
console.log(`✅ Materiales válidos: ${validMaterials}/${totalMaterials}`);
console.log(`📁 Total de archivos: ${totalMaterials}`);
console.log(`🎯 Categorías cubiertas: ${categories.length}`);

if (missingMaterials.length > 0) {
  console.log(`❌ Materiales faltantes: ${missingMaterials.join(', ')}`);
} else {
  console.log('🎉 ¡Todos los materiales están configurados correctamente!');
}

console.log('\n🚀 Sistema de materiales PBR listo para usar');
console.log('📖 Consulta pbr-materials-index.json para más detalles'); 