const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE CARGA DE LA APLICACIÓN');
console.log('==========================================\n');

// 1. Verificar archivos críticos
console.log('1️⃣ VERIFICANDO ARCHIVOS CRÍTICOS...');

const criticalFiles = [
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'constants.ts',
  'vite.config.ts',
  'tsconfig.json',
  'package.json'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} - PRESENTE`);
  } else {
    console.log(`   ❌ ${file} - AUSENTE`);
  }
});

// 2. Verificar dependencias
console.log('\n2️⃣ VERIFICANDO DEPENDENCIAS...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules - PRESENTE');
  
  // Verificar dependencias críticas
  const criticalDeps = [
    'react',
    'react-dom',
    'vite',
    '@vitejs/plugin-react',
    'typescript'
  ];
  
  criticalDeps.forEach(dep => {
    const depPath = path.join('node_modules', dep);
    if (fs.existsSync(depPath)) {
      console.log(`   ✅ ${dep} - INSTALADO`);
    } else {
      console.log(`   ❌ ${dep} - NO INSTALADO`);
    }
  });
} else {
  console.log('   ❌ node_modules - AUSENTE (ejecuta npm install)');
}

// 3. Verificar configuración de Vite
console.log('\n3️⃣ VERIFICANDO CONFIGURACIÓN DE VITE...');
try {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  if (viteConfig.includes('defineConfig')) {
    console.log('   ✅ Vite config - VÁLIDO');
  } else {
    console.log('   ❌ Vite config - INVÁLIDO');
  }
} catch (error) {
  console.log('   ❌ Error leyendo vite.config.ts:', error.message);
}

// 4. Verificar TypeScript
console.log('\n4️⃣ VERIFICANDO CONFIGURACIÓN DE TYPESCRIPT...');
try {
  const tsConfig = fs.readFileSync('tsconfig.json', 'utf8');
  const config = JSON.parse(tsConfig);
  
  if (config.compilerOptions && config.compilerOptions.jsx) {
    console.log('   ✅ TypeScript config - VÁLIDO');
    console.log(`   ✅ JSX mode: ${config.compilerOptions.jsx}`);
  } else {
    console.log('   ❌ TypeScript config - INVÁLIDO');
  }
} catch (error) {
  console.log('   ❌ Error leyendo tsconfig.json:', error.message);
}

// 5. Verificar imports críticos
console.log('\n5️⃣ VERIFICANDO IMPORTS CRÍTICOS...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  const criticalImports = [
    'import React',
    'import { ArchetypeId, PartCategory, SelectedParts, Part }',
    'import { ALL_PARTS, DEFAULT_STRONG_BUILD',
    'import CharacterViewer'
  ];
  
  criticalImports.forEach(importStatement => {
    if (appContent.includes(importStatement)) {
      console.log(`   ✅ ${importStatement} - PRESENTE`);
    } else {
      console.log(`   ❌ ${importStatement} - AUSENTE`);
    }
  });
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
}

// 6. Verificar tipos
console.log('\n6️⃣ VERIFICANDO DEFINICIÓN DE TIPOS...');
try {
  const typesContent = fs.readFileSync('types.ts', 'utf8');
  
  const criticalTypes = [
    'export enum ArchetypeId',
    'export enum PartCategory',
    'export interface Part',
    'export type SelectedParts'
  ];
  
  criticalTypes.forEach(typeDef => {
    if (typesContent.includes(typeDef)) {
      console.log(`   ✅ ${typeDef} - PRESENTE`);
    } else {
      console.log(`   ❌ ${typeDef} - AUSENTE`);
    }
  });
} catch (error) {
  console.log('   ❌ Error leyendo types.ts:', error.message);
}

// 7. Verificar constantes
console.log('\n7️⃣ VERIFICANDO CONSTANTES...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  const criticalConstants = [
    'export const ARCHETYPES',
    'export const ALL_PARTS',
    'export const DEFAULT_STRONG_BUILD',
    'export const DEFAULT_JUSTICIERO_BUILD'
  ];
  
  criticalConstants.forEach(constant => {
    if (constantsContent.includes(constant)) {
      console.log(`   ✅ ${constant} - PRESENTE`);
    } else {
      console.log(`   ❌ ${constant} - AUSENTE`);
    }
  });
} catch (error) {
  console.log('   ❌ Error leyendo constants.ts:', error.message);
}

console.log('\n==========================================');
console.log('🎯 RESUMEN DE VERIFICACIÓN');
console.log('==========================================');

console.log('\n📋 INSTRUCCIONES SI LA APP NO CARGA:');
console.log('1. Abre http://localhost:5178/ en el navegador');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console para ver errores');
console.log('4. Ve a la pestaña Network para ver si hay fallos de carga');
console.log('5. Si hay errores, compártelos para diagnóstico');

console.log('\n🔧 COMANDOS ÚTILES:');
console.log('- npm run dev (iniciar servidor)');
console.log('- npm run build (construir para producción)');
console.log('- npm install (instalar dependencias)');
console.log('- npm run preview (previsualizar build)'); 