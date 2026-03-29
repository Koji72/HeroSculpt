#!/usr/bin/env node

/**
 * 🎨 Generador de Texturas PBR para Superhero 3D Customizer Pro
 * 
 * Este script implementa el sistema de generación automática de texturas PBR
 * compatibles con Three.js y el workflow Metallic-Roughness.
 * 
 * Basado en el prompt optimizado para IA generativa.
 */

const fs = require('fs');
const path = require('path');

// Configuración del sistema
const CONFIG = {
  maxTextureSize: 1024, // 512 para low-res, 1024 para high-res
  supportedFormats: ['.glb', '.gltf', '.stl', '.obj'],
  outputFormats: ['png'],
  pbrWorkflow: 'metallic-roughness', // Three.js MeshStandardMaterial
  anisotropy: 4,
  encoding: 'sRGB'
};

// Paletas de colores por arquetipo (basadas en el proyecto real)
const ARCHETYPE_PALETTES = {
  STRONG: {
    primary: '#8B4513', // Marrón oscuro
    secondary: '#D2691E', // Marrón claro
    accent: '#FFD700', // Dorado
    metal: '#C0C0C0', // Plateado
    roughness: 0.7
  },
  JUSTICIERO: {
    primary: '#000080', // Azul marino
    secondary: '#4169E1', // Azul real
    accent: '#FFD700', // Dorado
    metal: '#B8860B', // Dorado oscuro
    roughness: 0.3
  },
  SPEEDSTER: {
    primary: '#FFD700', // Amarillo dorado
    secondary: '#FFA500', // Naranja
    accent: '#FF4500', // Rojo naranja
    metal: '#FFD700', // Dorado
    roughness: 0.2
  },
  MYSTIC: {
    primary: '#8A2BE2', // Azul violeta
    secondary: '#9370DB', // Violeta medio
    accent: '#FF69B4', // Rosa caliente
    metal: '#C0C0C0', // Plateado
    roughness: 0.4
  },
  TECH: {
    primary: '#00CED1', // Turquesa oscuro
    secondary: '#20B2AA', // Mar verde claro
    accent: '#00FFFF', // Cian
    metal: '#708090', // Gris pizarra
    roughness: 0.1
  },
  BaseVariant: {
    primary: '#808080', // Gris neutro
    secondary: '#A9A9A9', // Gris oscuro
    accent: '#C0C0C0', // Plateado
    metal: '#D3D3D3', // Gris claro
    roughness: 0.6
  }
};

// Mapeo de categorías a carpetas de Supabase Storage (basado en PartCategory del proyecto)
const CATEGORY_MAPPING = {
  torso: 'TorsoParts',
  suit_torso: 'SuitTorsoParts',
  lower_body: 'LowerBodyParts',
  head: 'HeadParts',
  hand_left: 'HandLeftParts',
  hand_right: 'HandRightParts',
  cape: 'CapeParts',
  backpack: 'BackpackParts',
  chest_belt: 'ChestBeltParts',
  belt: 'BeltParts',
  buckle: 'BuckleParts',
  pouch: 'PouchParts',
  shoulders: 'ShouldersParts',
  forearms: 'ForearmsParts',
  boots: 'BootsParts',
  symbol: 'SymbolParts'
};

// Función para determinar categoría basada en nombre de archivo (basada en PartCategory del proyecto)
function determineCategory(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('torso') && !name.includes('suit')) return 'torso';
  if (name.includes('suit_torso') || (name.includes('suit') && name.includes('torso'))) return 'suit_torso';
  if (name.includes('lower_body') || name.includes('legs')) return 'lower_body';
  if (name.includes('head')) return 'head';
  if (name.includes('hand_left') || (name.includes('hand') && name.includes('left'))) return 'hand_left';
  if (name.includes('hand_right') || (name.includes('hand') && name.includes('right'))) return 'hand_right';
  if (name.includes('cape')) return 'cape';
  if (name.includes('backpack')) return 'backpack';
  if (name.includes('chest_belt') || (name.includes('chest') && name.includes('belt'))) return 'chest_belt';
  if (name.includes('belt') && !name.includes('chest')) return 'belt';
  if (name.includes('buckle')) return 'buckle';
  if (name.includes('pouch')) return 'pouch';
  if (name.includes('shoulders')) return 'shoulders';
  if (name.includes('forearms')) return 'forearms';
  if (name.includes('boots')) return 'boots';
  if (name.includes('symbol')) return 'symbol';
  
  return 'otros'; // Categoría por defecto
}

// Función para generar textura PBR
function generatePBRTexture(baseName, variant, category, archetype = null) {
  const palette = archetype ? ARCHETYPE_PALETTES[archetype] : ARCHETYPE_PALETTES.BaseVariant;
  
  return {
    variant: variant,
    albedo: `${category}/${baseName}/${variant}/albedo.png`,
    normal: `${category}/${baseName}/${variant}/normal.png`,
    metal_roughness: `${category}/${baseName}/${variant}/metal_roughness.png`,
    emissive: variant !== 'BaseVariant' ? `${category}/${baseName}/${variant}/emissive.png` : null,
    ambientOcclusion: `${category}/${baseName}/${variant}/ambientOcclusion.png`
  };
}

// Función para crear objeto de material Three.js
function createMaterialObject(filename, variant, texturePaths, archetype = null) {
  const baseName = path.parse(filename).name;
  
  return {
    name: `${baseName}_${variant}`,
    variant: variant,
    map: `storage://${texturePaths.albedo}`,
    metalnessMap: `storage://${texturePaths.metal_roughness}`,
    roughnessMap: `storage://${texturePaths.metal_roughness}`,
    normalMap: `storage://${texturePaths.normal}`,
    emissiveMap: texturePaths.emissive ? `storage://${texturePaths.emissive}` : null,
    aoMap: `storage://${texturePaths.ambientOcclusion}`,
    alphaTest: 0.5,
    side: 'FrontSide',
    archetype: archetype || 'BaseVariant',
    maxAnisotropy: CONFIG.anisotropy,
    encoding: CONFIG.encoding
  };
}

// Función para procesar un archivo 3D
function process3DFile(filename, archetypes) {
  const category = determineCategory(filename);
  const baseName = path.parse(filename).name;
  const outputFolder = CATEGORY_MAPPING[category] || category;
  
  const variants = [];
  const materialObjects = [];
  
  // Generar variante base
  const baseVariant = generatePBRTexture(baseName, 'BaseVariant', outputFolder);
  variants.push(baseVariant);
  materialObjects.push(createMaterialObject(filename, 'BaseVariant', baseVariant));
  
  // Generar variantes por arquetipo
  archetypes.forEach(archetype => {
    const archetypeVariant = generatePBRTexture(baseName, `${archetype}Variant`, outputFolder, archetype);
    variants.push(archetypeVariant);
    materialObjects.push(createMaterialObject(filename, `${archetype}Variant`, archetypeVariant, archetype));
  });
  
  return {
    file: filename,
    output_folder: `${outputFolder}/${baseName}`,
    variants: variants,
    materialObjects: materialObjects
  };
}

// Función para generar el JSON maestro
function generateMasterJSON(processedFiles) {
  const masterJSON = {
    metadata: {
      generated: new Date().toISOString(),
      version: '1.0.0',
      workflow: CONFIG.pbrWorkflow,
      maxTextureSize: CONFIG.maxTextureSize,
      encoding: CONFIG.encoding
    },
    materials: [],
    files: processedFiles
  };
  
  // Agregar todos los materiales
  processedFiles.forEach(fileData => {
    fileData.materialObjects.forEach(material => {
      masterJSON.materials.push(material);
    });
  });
  
  return masterJSON;
}

// Función para crear estructura de carpetas
function createFolderStructure(processedFiles) {
  const folders = new Set();
  
  processedFiles.forEach(fileData => {
    fileData.variants.forEach(variant => {
      const variantPath = path.dirname(variant.albedo);
      folders.add(variantPath);
    });
  });
  
  return Array.from(folders);
}

// Función principal
function main() {
  console.log('🎨 Iniciando Generador de Texturas PBR...\n');
  
  // Configuración de ejemplo (reemplazar con valores reales)
  const fileList = [
    'strong_torso_01.glb',
    'justiciero_cape_01.glb',
    'speedster_head_01.glb',
    'strong_boots_01.glb',
    'justiciero_belt_01.glb'
  ];
  
  const archetypes = ['STRONG', 'JUSTICIERO', 'SPEEDSTER', 'MYSTIC', 'TECH'];
  
  console.log('📁 Archivos a procesar:', fileList.length);
  console.log('🎭 Arquetipos:', archetypes.join(', '));
  console.log('📏 Tamaño máximo de textura:', CONFIG.maxTextureSize);
  
  // Procesar archivos
  const processedFiles = [];
  const warnings = [];
  
  fileList.forEach(filename => {
    try {
      const result = process3DFile(filename, archetypes);
      processedFiles.push(result);
      console.log(`✅ Procesado: ${filename} → ${result.output_folder}`);
    } catch (error) {
      warnings.push(`Error procesando ${filename}: ${error.message}`);
      console.error(`❌ Error: ${filename} - ${error.message}`);
    }
  });
  
  // Generar JSON maestro
  const masterJSON = generateMasterJSON(processedFiles);
  
  // Crear estructura de carpetas
  const folders = createFolderStructure(processedFiles);
  
  // Guardar JSON maestro
  const outputPath = 'pbr-materials-master.json';
  fs.writeFileSync(outputPath, JSON.stringify(masterJSON, null, 2));
  
  // Resumen
  console.log('\n📊 RESUMEN DE GENERACIÓN');
  console.log('========================');
  console.log(`📁 Archivos procesados: ${processedFiles.length}`);
  console.log(`🎨 Variantes generadas: ${processedFiles.length * (archetypes.length + 1)}`);
  console.log(`📦 Materiales totales: ${masterJSON.materials.length}`);
  console.log(`📂 Carpetas creadas: ${folders.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  console.log('\n📋 ESTRUCTURA DE CARPETAS:');
  folders.forEach(folder => {
    console.log(`   📁 ${folder}/`);
    console.log(`      • albedo.png`);
    console.log(`      • normal.png`);
    console.log(`      • metal_roughness.png`);
    console.log(`      • ambientOcclusion.png`);
    console.log(`      • emissive.png (opcional)`);
  });
  
  console.log('\n💡 PRÓXIMOS PASOS:');
  console.log('1. Revisar el JSON generado en pbr-materials-master.json');
  console.log('2. Generar las texturas PNG usando IA (Stable Diffusion, Midjourney, etc.)');
  console.log('3. Subir texturas a Supabase Storage');
  console.log('4. Integrar materiales en el customizador');
  
  console.log('\n🎯 ¡Generación completada!');
  console.log(`   JSON maestro guardado en: ${outputPath}`);
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = {
  process3DFile,
  generateMasterJSON,
  CONFIG,
  ARCHETYPE_PALETTES,
  CATEGORY_MAPPING
}; 