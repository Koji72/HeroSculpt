#!/usr/bin/env node

/**
 * 🔍 Diagnóstico de Problemas: Sign Out y Duplicación de Modelos
 * 
 * Este script analiza el código para identificar problemas con:
 * 1. Sign out que no funciona correctamente
 * 2. Duplicación de modelos base al cargar configuraciones de usuario
 */

const fs = require('fs');
const path = require('path');

// Configuración
const TARGET_DIR = '.';
const PROBLEMS = {
  signOut: [],
  duplication: [],
  defaultBuilds: []
};

// Función para analizar archivos
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Análisis de sign out
  if (filePath.includes('App.tsx') || filePath.includes('useAuth')) {
    lines.forEach((line, index) => {
      // Buscar problemas con sign out
      if (line.includes('handleSignOut') && line.includes('async')) {
        PROBLEMS.signOut.push({
          file: filePath,
          line: index + 1,
          issue: 'handleSignOut encontrado',
          code: line.trim()
        });
      }
      
      if (line.includes('signOut()') && !line.includes('await')) {
        PROBLEMS.signOut.push({
          file: filePath,
          line: index + 1,
          issue: 'signOut() sin await - puede causar problemas',
          code: line.trim()
        });
      }
      
      if (line.includes('DEFAULT_STRONG_BUILD') || line.includes('DEFAULT_JUSTICIERO_BUILD')) {
        PROBLEMS.defaultBuilds.push({
          file: filePath,
          line: index + 1,
          issue: 'Uso de builds por defecto',
          code: line.trim()
        });
      }
    });
  }
  
  // Análisis de duplicación
  if (filePath.includes('CharacterViewer') || filePath.includes('App.tsx')) {
    lines.forEach((line, index) => {
      if (line.includes('setSelectedParts') && line.includes('...')) {
        PROBLEMS.duplication.push({
          file: filePath,
          line: index + 1,
          issue: 'Posible duplicación con spread operator',
          code: line.trim()
        });
      }
      
      if (line.includes('clearPreview') || line.includes('resetState')) {
        PROBLEMS.duplication.push({
          file: filePath,
          line: index + 1,
          issue: 'Limpieza de estado del viewer',
          code: line.trim()
        });
      }
    });
  }
}

// Función para escanear archivos
function scanFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanFiles(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      analyzeFile(filePath);
    }
  });
}

// Función para verificar constants.ts
function checkConstants() {
  const constantsPath = path.join(TARGET_DIR, 'constants.ts');
  if (fs.existsSync(constantsPath)) {
    const content = fs.readFileSync(constantsPath, 'utf8');
    
    // Verificar builds por defecto
    const defaultBuildMatch = content.match(/export const DEFAULT_\w+_BUILD: SelectedParts = \{([^}]*)\}/g);
    if (defaultBuildMatch) {
      defaultBuildMatch.forEach((match, index) => {
        if (match.includes('// ✅ VACÍO')) {
          console.log(`✅ Build por defecto ${index + 1}: VACÍO (correcto)`);
        } else {
          console.log(`❌ Build por defecto ${index + 1}: NO VACÍO (puede causar duplicación)`);
          PROBLEMS.defaultBuilds.push({
            file: 'constants.ts',
            line: 'N/A',
            issue: 'Build por defecto no vacío',
            code: match
          });
        }
      });
    }
  }
}

// Función principal
function main() {
  console.log('🔍 Iniciando diagnóstico de problemas...\n');
  
  // Escanear archivos
  scanFiles(TARGET_DIR);
  
  // Verificar constants.ts
  checkConstants();
  
  // Mostrar resultados
  console.log('📊 RESULTADOS DEL DIAGNÓSTICO');
  console.log('==============================\n');
  
  console.log('🚪 PROBLEMAS DE SIGN OUT:');
  if (PROBLEMS.signOut.length === 0) {
    console.log('✅ No se encontraron problemas evidentes con sign out');
  } else {
    PROBLEMS.signOut.forEach(problem => {
      console.log(`❌ ${problem.file}:${problem.line} - ${problem.issue}`);
      console.log(`   ${problem.code}`);
    });
  }
  
  console.log('\n🔄 PROBLEMAS DE DUPLICACIÓN:');
  if (PROBLEMS.duplication.length === 0) {
    console.log('✅ No se encontraron problemas evidentes de duplicación');
  } else {
    PROBLEMS.duplication.forEach(problem => {
      console.log(`❌ ${problem.file}:${problem.line} - ${problem.issue}`);
      console.log(`   ${problem.code}`);
    });
  }
  
  console.log('\n📦 BUILDS POR DEFECTO:');
  if (PROBLEMS.defaultBuilds.length === 0) {
    console.log('✅ No se encontraron problemas con builds por defecto');
  } else {
    PROBLEMS.defaultBuilds.forEach(problem => {
      console.log(`❌ ${problem.file}:${problem.line} - ${problem.issue}`);
      console.log(`   ${problem.code}`);
    });
  }
  
  console.log('\n💡 RECOMENDACIONES:');
  console.log('1. Verificar que signOut() se llame con await');
  console.log('2. Asegurar que clearPreview() y resetState() se ejecuten antes de cargar nuevas partes');
  console.log('3. Confirmar que los builds por defecto estén vacíos en constants.ts');
  console.log('4. Verificar que no haya event listeners que interfieran con el sign out');
  
  console.log('\n🎯 DIAGNÓSTICO COMPLETADO');
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { analyzeFile, checkConstants }; 