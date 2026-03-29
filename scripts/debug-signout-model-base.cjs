#!/usr/bin/env node

/**
 * 🔍 Diagnóstico Específico: Sign Out y Modelo Base
 * 
 * Este script analiza específicamente el problema de que no aparece el modelo base
 * después del sign out.
 */

const fs = require('fs');
const path = require('path');

// Configuración
const TARGET_DIR = '.';
const ISSUES = {
  signOutLogic: [],
  defaultBuilds: [],
  modelLoading: [],
  stateManagement: []
};

// Función para analizar App.tsx específicamente
function analyzeAppTsx() {
  const appPath = path.join(TARGET_DIR, 'App.tsx');
  if (!fs.existsSync(appPath)) {
    console.log('❌ App.tsx no encontrado');
    return;
  }

  const content = fs.readFileSync(appPath, 'utf8');
  const lines = content.split('\n');

  console.log('🔍 ANALIZANDO App.tsx...\n');

  // Buscar handleSignOut
  let signOutFound = false;
  lines.forEach((line, index) => {
    if (line.includes('handleSignOut')) {
      signOutFound = true;
      console.log(`📍 handleSignOut encontrado en línea ${index + 1}`);
      
      // Analizar las siguientes líneas para ver la lógica
      for (let i = index; i < Math.min(index + 30, lines.length); i++) {
        const currentLine = lines[i];
        if (currentLine.includes('setSelectedParts')) {
          console.log(`   📝 setSelectedParts en línea ${i + 1}: ${currentLine.trim()}`);
        }
        if (currentLine.includes('DEFAULT_')) {
          console.log(`   🏗️  Build por defecto en línea ${i + 1}: ${currentLine.trim()}`);
        }
        if (currentLine.includes('signOut()')) {
          console.log(`   🚪 signOut() en línea ${i + 1}: ${currentLine.trim()}`);
        }
      }
    }
  });

  if (!signOutFound) {
    console.log('❌ handleSignOut no encontrado en App.tsx');
  }

  // Buscar estado inicial
  lines.forEach((line, index) => {
    if (line.includes('useState<SelectedParts>')) {
      console.log(`📍 Estado inicial en línea ${index + 1}: ${line.trim()}`);
    }
  });

  // Buscar imports
  lines.forEach((line, index) => {
    if (line.includes('import') && line.includes('DEFAULT_')) {
      console.log(`📍 Import de builds por defecto en línea ${index + 1}: ${line.trim()}`);
    }
  });
}

// Función para verificar constants.ts
function checkConstants() {
  const constantsPath = path.join(TARGET_DIR, 'constants.ts');
  if (!fs.existsSync(constantsPath)) {
    console.log('❌ constants.ts no encontrado');
    return;
  }

  const content = fs.readFileSync(constantsPath, 'utf8');
  
  console.log('\n🔍 ANALIZANDO constants.ts...\n');

  // Buscar builds por defecto
  const defaultBuildMatches = content.match(/export const DEFAULT_\w+_BUILD: SelectedParts = \{([^}]*)\}/g);
  if (defaultBuildMatches) {
    defaultBuildMatches.forEach((match, index) => {
      console.log(`📍 Build por defecto ${index + 1}:`);
      console.log(`   ${match}`);
      
      // Verificar si está vacío
      if (match.includes('// ✅ MODELO BASE') || match.includes('// ✅ VACÍO')) {
        console.log('   ✅ Comentario indica que debe estar vacío');
      } else {
        console.log('   ❌ No tiene comentario de modelo base');
      }
    });
  } else {
    console.log('❌ No se encontraron builds por defecto');
  }
}

// Función para verificar CharacterViewer
function checkCharacterViewer() {
  const viewerPath = path.join(TARGET_DIR, 'components', 'CharacterViewer.tsx');
  if (!fs.existsSync(viewerPath)) {
    console.log('❌ CharacterViewer.tsx no encontrado');
    return;
  }

  const content = fs.readFileSync(viewerPath, 'utf8');
  
  console.log('\n🔍 ANALIZANDO CharacterViewer.tsx...\n');

  // Buscar métodos de limpieza
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('clearPreview') || line.includes('resetState')) {
      console.log(`📍 Método de limpieza en línea ${index + 1}: ${line.trim()}`);
    }
  });

  // Buscar lógica de carga de modelos
  lines.forEach((line, index) => {
    if (line.includes('loadModel') || line.includes('GLTFLoader')) {
      console.log(`📍 Carga de modelo en línea ${index + 1}: ${line.trim()}`);
    }
  });
}

// Función para verificar el modelo base
function checkBaseModels() {
  const publicPath = path.join(TARGET_DIR, 'public', 'assets');
  if (!fs.existsSync(publicPath)) {
    console.log('❌ Directorio public/assets no encontrado');
    return;
  }

  console.log('\n🔍 VERIFICANDO MODELOS BASE...\n');

  // Buscar modelos base
  const strongPath = path.join(publicPath, 'strong', 'Base');
  const justicieroPath = path.join(publicPath, 'justiciero', 'Base');

  if (fs.existsSync(strongPath)) {
    const strongFiles = fs.readdirSync(strongPath);
    console.log(`📍 Modelos base STRONG: ${strongFiles.join(', ')}`);
  } else {
    console.log('❌ No se encontró directorio strong/Base');
  }

  if (fs.existsSync(justicieroPath)) {
    const justicieroFiles = fs.readdirSync(justicieroPath);
    console.log(`📍 Modelos base JUSTICIERO: ${justicieroFiles.join(', ')}`);
  } else {
    console.log('❌ No se encontró directorio justiciero/Base');
  }
}

// Función principal
function main() {
  console.log('🔍 DIAGNÓSTICO ESPECÍFICO: SIGN OUT Y MODELO BASE');
  console.log('================================================\n');

  analyzeAppTsx();
  checkConstants();
  checkCharacterViewer();
  checkBaseModels();

  console.log('\n💡 RECOMENDACIONES ESPECÍFICAS:');
  console.log('1. Verificar que el modelo base se cargue automáticamente');
  console.log('2. Confirmar que clearPreview() no elimine el modelo base');
  console.log('3. Verificar que el estado inicial incluya el modelo base');
  console.log('4. Comprobar que los builds por defecto estén correctamente definidos');
  
  console.log('\n🎯 DIAGNÓSTICO COMPLETADO');
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { analyzeAppTsx, checkConstants, checkCharacterViewer, checkBaseModels }; 