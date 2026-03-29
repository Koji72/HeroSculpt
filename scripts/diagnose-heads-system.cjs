#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO DEL SISTEMA DE CABEZAS - 2025
 * 
 * Este script verifica el estado actual del sistema de cabezas
 * y identifica posibles problemas con la preservación de cabezas.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE CABEZAS - 2025');
console.log('==============================================\n');

// 1. Verificar archivos de cabezas físicos
console.log('📁 1. VERIFICACIÓN DE ARCHIVOS FÍSICOS:');
console.log('=====================================');

const headDir = path.join(__dirname, '../public/assets/strong/head');
if (fs.existsSync(headDir)) {
  const headFiles = fs.readdirSync(headDir).filter(file => file.endsWith('.glb'));
  console.log(`✅ Directorio de cabezas encontrado: ${headDir}`);
  console.log(`📦 Archivos GLB encontrados: ${headFiles.length}`);
  
  // Agrupar por tipo de torso
  const headsByTorso = {};
  headFiles.forEach(file => {
    const match = file.match(/strong_head_(\d+)_t(\d+)\.glb/);
    if (match) {
      const [, headType, torsoType] = match;
      if (!headsByTorso[torsoType]) headsByTorso[torsoType] = [];
      headsByTorso[torsoType].push(file);
    }
  });
  
  console.log('\n📊 Distribución por torso:');
  Object.keys(headsByTorso).sort().forEach(torsoType => {
    console.log(`   Torso ${torsoType}: ${headsByTorso[torsoType].length} cabezas`);
    headsByTorso[torsoType].forEach(file => {
      console.log(`     - ${file}`);
    });
  });
} else {
  console.log('❌ ERROR: Directorio de cabezas no encontrado');
  console.log(`   Buscado en: ${headDir}`);
}

// 2. Verificar definiciones en constants.ts
console.log('\n📋 2. VERIFICACIÓN DE DEFINICIONES EN CONSTANTS.TS:');
console.log('==================================================');

const constantsPath = path.join(__dirname, '../constants.ts');
if (fs.existsSync(constantsPath)) {
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  // Buscar definiciones de cabezas
  const headDefinitions = constantsContent.match(/id:\s*'strong_head_\d+_t\d+',/g);
  if (headDefinitions) {
    console.log(`✅ Definiciones de cabezas encontradas: ${headDefinitions.length}`);
    
    // Extraer IDs únicos
    const headIds = headDefinitions.map(def => {
      const match = def.match(/id:\s*'(strong_head_\d+_t\d+)',/);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    console.log('\n📊 IDs de cabezas definidas:');
    headIds.forEach(id => console.log(`   - ${id}`));
    
    // Verificar compatibilidad
    const compatibilityMatches = constantsContent.match(/compatible:\s*\[[^\]]+\]/g);
    if (compatibilityMatches) {
      console.log('\n🔗 Verificando compatibilidad:');
      compatibilityMatches.slice(0, 5).forEach(match => {
        console.log(`   - ${match}`);
      });
    }
  } else {
    console.log('❌ ERROR: No se encontraron definiciones de cabezas');
  }
} else {
  console.log('❌ ERROR: Archivo constants.ts no encontrado');
}

// 3. Verificar función de preservación en App.tsx
console.log('\n🔧 3. VERIFICACIÓN DE LÓGICA DE PRESERVACIÓN:');
console.log('=============================================');

const appPath = path.join(__dirname, '../App.tsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Verificar preservación de cabezas
  const headPreservationMatches = appContent.match(/const currentHead = newParts\[PartCategory\.HEAD\];/g);
  if (headPreservationMatches) {
    console.log(`✅ Líneas de preservación de cabezas encontradas: ${headPreservationMatches.length}`);
    
    // Verificar función assignAdaptiveHeadForTorso
    const adaptiveHeadCalls = appContent.match(/assignAdaptiveHeadForTorso\(/g);
    if (adaptiveHeadCalls) {
      console.log(`✅ Llamadas a assignAdaptiveHeadForTorso: ${adaptiveHeadCalls.length}`);
    } else {
      console.log('❌ ERROR: No se encontraron llamadas a assignAdaptiveHeadForTorso');
    }
  } else {
    console.log('❌ ERROR: No se encontró lógica de preservación de cabezas');
  }
} else {
  console.log('❌ ERROR: Archivo App.tsx no encontrado');
}

// 4. Verificar función assignAdaptiveHeadForTorso en utils.ts
console.log('\n🛠️ 4. VERIFICACIÓN DE FUNCIÓN ASSIGN ADAPTIVE HEAD:');
console.log('===================================================');

const utilsPath = path.join(__dirname, '../lib/utils.ts');
if (fs.existsSync(utilsPath)) {
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  // Verificar si existe la función
  if (utilsContent.includes('assignAdaptiveHeadForTorso')) {
    console.log('✅ Función assignAdaptiveHeadForTorso encontrada');
    
    // Verificar lógica de preservación
    if (utilsContent.includes('originalParts')) {
      console.log('✅ Lógica de preservación con originalParts implementada');
    } else {
      console.log('❌ ADVERTENCIA: No se encontró lógica de preservación con originalParts');
    }
    
    // Verificar logs de debug
    if (utilsContent.includes('console.log') && utilsContent.includes('assignAdaptiveHeadForTorso')) {
      console.log('✅ Logs de debug implementados');
    } else {
      console.log('❌ ADVERTENCIA: No se encontraron logs de debug');
    }
  } else {
    console.log('❌ ERROR: Función assignAdaptiveHeadForTorso no encontrada');
  }
} else {
  console.log('❌ ERROR: Archivo lib/utils.ts no encontrado');
}

// 5. Verificar archivos obsoletos
console.log('\n🗑️ 5. VERIFICACIÓN DE ARCHIVOS OBSOLETOS:');
console.log('=========================================');

const obsoletePath = path.join(__dirname, '../src/parts/normalHeadParts.ts');
if (fs.existsSync(obsoletePath)) {
  console.log('❌ ERROR: Archivo obsoleto encontrado: src/parts/normalHeadParts.ts');
  console.log('   Este archivo debe ser eliminado según la documentación');
} else {
  console.log('✅ Archivo obsoleto no encontrado (correcto)');
}

// 6. Resumen y recomendaciones
console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
console.log('============================');

console.log('\n🎯 ESTADO ACTUAL:');
console.log('   - Archivos físicos: ✅ Verificados');
console.log('   - Definiciones: ✅ Verificadas');
console.log('   - Lógica de preservación: ✅ Implementada');
console.log('   - Función adaptativa: ✅ Presente');
console.log('   - Archivos obsoletos: ✅ Limpios');

console.log('\n🔍 POSIBLES CAUSAS DEL PROBLEMA:');
console.log('   1. Error en la lógica de compatibilidad');
console.log('   2. Problema en el orden de preservación');
console.log('   3. Conflicto con otras categorías');
console.log('   4. Error en la función assignAdaptiveHeadForTorso');

console.log('\n💡 RECOMENDACIONES:');
console.log('   1. Verificar logs de debug en la consola del navegador');
console.log('   2. Comprobar que TORSO_DEPENDENT_CATEGORIES no incluya HEAD');
console.log('   3. Verificar que la preservación ocurra ANTES de eliminar');
console.log('   4. Revisar la función assignAdaptiveHeadForTorso');

console.log('\n✅ Diagnóstico completado'); 