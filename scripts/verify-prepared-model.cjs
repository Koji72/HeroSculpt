#!/usr/bin/env node

/**
 * 🔍 Verificador Post-Preparación
 * 
 * Ejecutar después de preparar el modelo para verificar
 * que está listo para deformación.
 */

const fs = require('fs');
const path = require('path');

const MODEL_PATH = 'public/assets/strong/torso/strong_torso_02.glb';

function verifyPreparedModel() {
  console.log('🔍 Verificando modelo preparado...\n');
  
  if (!fs.existsSync(MODEL_PATH)) {
    console.log('❌ Modelo no encontrado');
    return;
  }
  
  const stats = fs.statSync(MODEL_PATH);
  console.log(`📊 Tamaño: ${(stats.size / 1024).toFixed(1)} KB`);
  
  // Aquí agregarías verificación real con gltf-transform
  console.log('✅ Verificación básica completada');
  console.log('💡 Para verificación completa, usar:');
  console.log('   node scripts/verify-mesh-deformation-ready.cjs');
}

verifyPreparedModel();
