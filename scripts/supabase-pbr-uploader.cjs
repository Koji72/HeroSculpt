#!/usr/bin/env node

/**
 * ☁️ Uploader de Texturas PBR para Supabase Storage
 * 
 * Este script sube las texturas PBR generadas por IA a Supabase Storage
 * y actualiza la base de datos con los metadatos de los materiales.
 */

const fs = require('fs');
const path = require('path');

// Configuración de Supabase (reemplazar con valores reales)
const SUPABASE_CONFIG = {
  url: process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  key: process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  storage: {
    bucket: 'pbr-textures',
    folder: 'materials'
  }
};

// Función para leer el JSON maestro de materiales
function loadMasterJSON(filePath = 'pbr-materials-master.json') {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo no encontrado: ${filePath}`);
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error cargando JSON maestro: ${error.message}`);
    return null;
  }
}

// Función para simular subida a Supabase Storage
function uploadToSupabaseStorage(localPath, storagePath) {
  return new Promise((resolve, reject) => {
    // Simulación de subida (reemplazar con implementación real)
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% de éxito
      
      if (success) {
        const url = `${SUPABASE_CONFIG.url}/storage/v1/object/public/${SUPABASE_CONFIG.storage.bucket}/${storagePath}`;
        resolve(url);
      } else {
        reject(new Error(`Error subiendo: ${localPath}`));
      }
    }, 100 + Math.random() * 200); // Simular tiempo de subida
  });
}

// Función para actualizar URLs en el JSON de materiales
function updateMaterialURLs(material, uploadedTextures) {
  const updatedMaterial = { ...material };
  
  // Actualizar URLs con las URLs de Supabase Storage
  if (uploadedTextures[updatedMaterial.map]) {
    updatedMaterial.map = uploadedTextures[updatedMaterial.map];
  }
  if (uploadedTextures[updatedMaterial.metalnessMap]) {
    updatedMaterial.metalnessMap = uploadedTextures[updatedMaterial.metalnessMap];
  }
  if (uploadedTextures[updatedMaterial.roughnessMap]) {
    updatedMaterial.roughnessMap = uploadedTextures[updatedMaterial.roughnessMap];
  }
  if (uploadedTextures[updatedMaterial.normalMap]) {
    updatedMaterial.normalMap = uploadedTextures[updatedMaterial.normalMap];
  }
  if (updatedMaterial.emissiveMap && uploadedTextures[updatedMaterial.emissiveMap]) {
    updatedMaterial.emissiveMap = uploadedTextures[updatedMaterial.emissiveMap];
  }
  if (updatedMaterial.aoMap && uploadedTextures[updatedMaterial.aoMap]) {
    updatedMaterial.aoMap = uploadedTextures[updatedMaterial.aoMap];
  }
  
  return updatedMaterial;
}

// Función para insertar material en la base de datos
function insertMaterialToDatabase(material) {
  return new Promise((resolve, reject) => {
    // Simulación de inserción en base de datos (reemplazar con implementación real)
    setTimeout(() => {
      const success = Math.random() > 0.05; // 95% de éxito
      
      if (success) {
        const dbRecord = {
          id: `mat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: material.name,
          variant: material.variant,
          archetype: material.archetype,
          map_url: material.map,
          metalness_map_url: material.metalnessMap,
          roughness_map_url: material.roughnessMap,
          normal_map_url: material.normalMap,
          emissive_map_url: material.emissiveMap || null,
          ao_map_url: material.aoMap || null,
          alpha_test: material.alphaTest,
          side: material.side,
          max_anisotropy: material.maxAnisotropy,
          encoding: material.encoding,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        resolve(dbRecord);
      } else {
        reject(new Error(`Error insertando material: ${material.name}`));
      }
    }, 50 + Math.random() * 100);
  });
}

// Función principal para procesar y subir materiales
async function processAndUploadMaterials() {
  console.log('☁️ Iniciando Upload de Texturas PBR a Supabase...\n');
  
  // Cargar JSON maestro
  const masterJSON = loadMasterJSON();
  if (!masterJSON) {
    console.error('❌ No se pudo cargar el JSON maestro');
    return;
  }
  
  console.log(`📁 Materiales a procesar: ${masterJSON.materials.length}`);
  console.log(`📊 Archivos de entrada: ${masterJSON.files.length}`);
  
  const uploadedTextures = {};
  const uploadedMaterials = [];
  const errors = [];
  
  // Procesar cada material
  for (let i = 0; i < masterJSON.materials.length; i++) {
    const material = masterJSON.materials[i];
    console.log(`\n🔄 Procesando material ${i + 1}/${masterJSON.materials.length}: ${material.name}`);
    
    try {
      // Simular subida de texturas
      const texturePaths = [
        material.map,
        material.metalnessMap,
        material.roughnessMap,
        material.normalMap
      ];
      
      if (material.emissiveMap) texturePaths.push(material.emissiveMap);
      if (material.aoMap) texturePaths.push(material.aoMap);
      
      // Subir texturas
      for (const texturePath of texturePaths) {
        if (!uploadedTextures[texturePath]) {
          const storagePath = `${SUPABASE_CONFIG.storage.folder}/${texturePath}`;
          const localPath = `textures/${texturePath}`; // Simular ruta local
          
          try {
            const url = await uploadToSupabaseStorage(localPath, storagePath);
            uploadedTextures[texturePath] = url;
            console.log(`   ✅ Subida: ${path.basename(texturePath)}`);
          } catch (error) {
            console.log(`   ⚠️  Error subiendo: ${path.basename(texturePath)}`);
            errors.push(`Error subiendo textura: ${texturePath} - ${error.message}`);
          }
        }
      }
      
      // Actualizar URLs del material
      const updatedMaterial = updateMaterialURLs(material, uploadedTextures);
      
      // Insertar en base de datos
      const dbRecord = await insertMaterialToDatabase(updatedMaterial);
      uploadedMaterials.push(dbRecord);
      
      console.log(`   ✅ Material procesado: ${material.name}`);
      
    } catch (error) {
      console.error(`   ❌ Error procesando material: ${material.name} - ${error.message}`);
      errors.push(`Error procesando material: ${material.name} - ${error.message}`);
    }
  }
  
  // Guardar resultados
  const results = {
    metadata: {
      processed: new Date().toISOString(),
      totalMaterials: masterJSON.materials.length,
      uploadedMaterials: uploadedMaterials.length,
      errors: errors.length,
      supabaseConfig: {
        url: SUPABASE_CONFIG.url,
        bucket: SUPABASE_CONFIG.storage.bucket
      }
    },
    materials: uploadedMaterials,
    errors: errors
  };
  
  fs.writeFileSync('supabase-upload-results.json', JSON.stringify(results, null, 2));
  
  // Resumen
  console.log('\n📊 RESUMEN DE UPLOAD');
  console.log('====================');
  console.log(`📁 Materiales procesados: ${masterJSON.materials.length}`);
  console.log(`✅ Materiales subidos: ${uploadedMaterials.length}`);
  console.log(`🖼️  Texturas subidas: ${Object.keys(uploadedTextures).length}`);
  console.log(`❌ Errores: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\n⚠️  ERRORES:');
    errors.slice(0, 5).forEach(error => {
      console.log(`   • ${error}`);
    });
    if (errors.length > 5) {
      console.log(`   ... y ${errors.length - 5} errores más`);
    }
  }
  
  console.log('\n📋 MATERIALES SUBIDOS:');
  uploadedMaterials.slice(0, 10).forEach(material => {
    console.log(`   • ${material.name} (${material.archetype})`);
  });
  if (uploadedMaterials.length > 10) {
    console.log(`   ... y ${uploadedMaterials.length - 10} materiales más`);
  }
  
  console.log('\n💡 PRÓXIMOS PASOS:');
  console.log('1. Revisar resultados en supabase-upload-results.json');
  console.log('2. Verificar materiales en Supabase Dashboard');
  console.log('3. Integrar materiales en el customizador');
  console.log('4. Probar carga de texturas PBR');
  
  console.log('\n🎯 ¡Upload completado!');
  console.log(`   Resultados guardados en: supabase-upload-results.json`);
}

// Función para generar script de integración
function generateIntegrationScript() {
  const script = `
// Script de integración para el customizador
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  '${SUPABASE_CONFIG.url}',
  '${SUPABASE_CONFIG.key}'
);

// Función para cargar materiales PBR desde Supabase
export async function loadPBRMaterials() {
  const { data, error } = await supabase
    .from('pbr_materials')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error cargando materiales PBR:', error);
    return [];
  }
  
  return data;
}

// Función para obtener material por nombre y variante
export async function getPBRMaterial(name, variant) {
  const { data, error } = await supabase
    .from('pbr_materials')
    .select('*')
    .eq('name', name)
    .eq('variant', variant)
    .single();
    
  if (error) {
    console.error('Error obteniendo material PBR:', error);
    return null;
  }
  
  return data;
}
`;

  fs.writeFileSync('supabase-pbr-integration.js', script);
  console.log('📝 Script de integración generado: supabase-pbr-integration.js');
}

// Ejecutar
if (require.main === module) {
  processAndUploadMaterials().then(() => {
    generateIntegrationScript();
  }).catch(error => {
    console.error('❌ Error en el proceso:', error);
  });
}

module.exports = {
  processAndUploadMaterials,
  generateIntegrationScript,
  SUPABASE_CONFIG
}; 