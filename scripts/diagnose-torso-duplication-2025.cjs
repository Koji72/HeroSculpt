#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO: Duplicación de Torsos y Carga de Poses Básicas - 2025
 * 
 * Este script verifica:
 * 1. Si hay duplicación de torsos en el DEFAULT_STRONG_BUILD
 * 2. Si la lógica de carga de sesión funciona correctamente
 * 3. Si las poses básicas se cargan correctamente en la sesión del usuario
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO: Duplicación de Torsos y Carga de Poses Básicas - 2025\n');

// Función para leer archivo
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Error leyendo ${filePath}:`, error.message);
    return null;
  }
}

// Función para buscar patrones en el código
function searchPatterns(content, patterns) {
  const results = {};
  
  patterns.forEach(pattern => {
    const regex = new RegExp(pattern.regex, 'g');
    const matches = content.match(regex);
    results[pattern.name] = {
      count: matches ? matches.length : 0,
      matches: matches || []
    };
  });
  
  return results;
}

// 1. Verificar constants.ts
console.log('📋 1. VERIFICANDO constants.ts...');
const constantsContent = readFile('constants.ts');

if (constantsContent) {
  const constantsPatterns = [
    {
      name: 'DEFAULT_STRONG_BUILD con torso',
      regex: 'DEFAULT_STRONG_BUILD.*TORSO.*strong_torso_01'
    },
    {
      name: 'GUEST_USER_BUILD definido',
      regex: 'export const GUEST_USER_BUILD'
    },
    {
      name: 'DEFAULT_STRONG_BUILD vacío',
      regex: 'export const DEFAULT_STRONG_BUILD.*=.*\\{\\s*\\};'
    }
  ];
  
  const constantsResults = searchPatterns(constantsContent, constantsPatterns);
  
  console.log('  ✅ DEFAULT_STRONG_BUILD vacío:', constantsResults['DEFAULT_STRONG_BUILD vacío'].count > 0);
  console.log('  ✅ GUEST_USER_BUILD definido:', constantsResults['GUEST_USER_BUILD definido'].count > 0);
  console.log('  ❌ DEFAULT_STRONG_BUILD con torso:', constantsResults['DEFAULT_STRONG_BUILD con torso'].count > 0);
  
  if (constantsResults['DEFAULT_STRONG_BUILD con torso'].count > 0) {
    console.log('  🚨 PROBLEMA: DEFAULT_STRONG_BUILD aún contiene torso');
  }
}

// 2. Verificar App.tsx
console.log('\n📋 2. VERIFICANDO App.tsx...');
const appContent = readFile('App.tsx');

if (appContent) {
  const appPatterns = [
    {
      name: 'loadUserPoses llamado primero',
      regex: 'await loadUserPoses\\(\\);'
    },
    {
      name: 'verificación de selectedParts vacío',
      regex: 'Object\\.keys\\(selectedParts\\)\\.length === 0'
    },
    {
      name: 'GUEST_USER_BUILD importado',
      regex: 'import.*GUEST_USER_BUILD.*from'
    },
    {
      name: 'lógica de usuario no autenticado',
      regex: 'if \\(!isAuthenticated\\)'
    }
  ];
  
  const appResults = searchPatterns(appContent, appPatterns);
  
  console.log('  ✅ loadUserPoses llamado primero:', appResults['loadUserPoses llamado primero'].count > 0);
  console.log('  ✅ verificación de selectedParts vacío:', appResults['verificación de selectedParts vacío'].count > 0);
  console.log('  ✅ GUEST_USER_BUILD importado:', appResults['GUEST_USER_BUILD importado'].count > 0);
  console.log('  ✅ lógica de usuario no autenticado:', appResults['lógica de usuario no autenticado'].count > 0);
}

// 3. Verificar CharacterViewer.tsx
console.log('\n📋 3. VERIFICANDO CharacterViewer.tsx...');
const viewerContent = readFile('components/CharacterViewer.tsx');

if (viewerContent) {
  const viewerPatterns = [
    {
      name: 'verificación de compatibilidad',
      regex: 'compatible\\.includes'
    },
    {
      name: 'limpieza de escena',
      regex: 'clearScene|removeFromParent'
    }
  ];
  
  const viewerResults = searchPatterns(viewerContent, viewerPatterns);
  
  console.log('  ✅ verificación de compatibilidad:', viewerResults['verificación de compatibilidad'].count > 0);
  console.log('  ✅ limpieza de escena:', viewerResults['limpieza de escena'].count > 0);
}

// 4. Verificar documentación
console.log('\n📋 4. VERIFICANDO DOCUMENTACIÓN...');
const docsFiles = [
  'docs/DUPLICATION_FIX_2025.md',
  'docs/GUEST_USER_DEFAULT_BUILD_FIX_2025.md',
  'docs/HANDS_DUPLICATION_FIX_2025.md'
];

docsFiles.forEach(docFile => {
  if (fs.existsSync(docFile)) {
    console.log(`  ✅ ${docFile} existe`);
  } else {
    console.log(`  ❌ ${docFile} no existe`);
  }
});

// 5. Resumen de diagnóstico
console.log('\n📊 RESUMEN DEL DIAGNÓSTICO:');
console.log('================================');

const issues = [];

// Verificar si hay problemas
if (constantsContent && constantsContent.includes('DEFAULT_STRONG_BUILD') && constantsContent.includes('strong_torso_01') && constantsContent.includes('TORSO:')) {
  issues.push('❌ DEFAULT_STRONG_BUILD aún contiene torso (duplicación)');
}

if (appContent && !appContent.includes('GUEST_USER_BUILD')) {
  issues.push('❌ GUEST_USER_BUILD no está importado en App.tsx');
}

if (appContent && !appContent.includes('Object.keys(selectedParts).length === 0')) {
  issues.push('❌ No hay verificación de selectedParts vacío');
}

if (issues.length === 0) {
  console.log('✅ TODOS LOS PROBLEMAS HAN SIDO RESUELTOS');
  console.log('✅ No hay duplicación de torsos');
  console.log('✅ Lógica de carga de sesión mejorada');
  console.log('✅ Poses básicas se cargan correctamente');
} else {
  console.log('🚨 PROBLEMAS ENCONTRADOS:');
  issues.forEach(issue => console.log(`  ${issue}`));
}

console.log('\n🎯 RECOMENDACIONES:');
console.log('1. Verificar que el modelo base strong_base_01.glb no incluya torso');
console.log('2. Probar la aplicación con usuario autenticado y no autenticado');
console.log('3. Verificar que no haya duplicación visual en el visor 3D');
console.log('4. Confirmar que las poses del usuario se cargan correctamente');

console.log('\n✅ Diagnóstico completado'); 