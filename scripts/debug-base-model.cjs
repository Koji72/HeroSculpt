#!/usr/bin/env node

/**
 * 🔍 Script de diagnóstico para el modelo base
 * Verifica por qué el modelo base no aparece después del sign out
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico del modelo base...\n');

// Verificar archivos del modelo base
const baseModelPath = './public/assets/strong/Base/strong_base_01.glb';
const justicieroBasePath = './public/assets/justiciero/Base/justiciero_base_01.glb';

console.log('📁 Verificando archivos del modelo base:');
console.log(`   STRONG: ${baseModelPath} - ${fs.existsSync(baseModelPath) ? '✅ EXISTE' : '❌ NO EXISTE'}`);
console.log(`   JUSTICIERO: ${justicieroBasePath} - ${fs.existsSync(justicieroBasePath) ? '✅ EXISTE' : '❌ NO EXISTE'}`);

// Verificar estructura de directorios
console.log('\n📂 Estructura de directorios:');
const strongDir = './public/assets/strong';
const justicieroDir = './public/assets/justiciero';

if (fs.existsSync(strongDir)) {
  console.log('   STRONG directory:');
  fs.readdirSync(strongDir).forEach(item => {
    const itemPath = path.join(strongDir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      console.log(`     📁 ${item}/`);
      if (fs.existsSync(path.join(itemPath))) {
        fs.readdirSync(itemPath).forEach(subItem => {
          console.log(`       📄 ${subItem}`);
        });
      }
    } else {
      console.log(`     📄 ${item}`);
    }
  });
}

if (fs.existsSync(justicieroDir)) {
  console.log('   JUSTICIERO directory:');
  fs.readdirSync(justicieroDir).forEach(item => {
    const itemPath = path.join(justicieroDir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      console.log(`     📁 ${item}/`);
      if (fs.existsSync(path.join(itemPath))) {
        fs.readdirSync(itemPath).forEach(subItem => {
          console.log(`       📄 ${subItem}`);
        });
      }
    } else {
      console.log(`     📄 ${item}`);
    }
  });
}

// Verificar App.tsx
console.log('\n🔍 Verificando App.tsx:');
const appTsxPath = './App.tsx';
if (fs.existsSync(appTsxPath)) {
  const appContent = fs.readFileSync(appTsxPath, 'utf8');
  
  // Buscar inicialización de selectedParts
  const selectedPartsMatch = appContent.match(/const \[selectedParts, setSelectedParts\] = useState<SelectedParts>\(([^)]+)\)/);
  if (selectedPartsMatch) {
    console.log(`   ✅ selectedParts inicializado con: ${selectedPartsMatch[1]}`);
  } else {
    console.log('   ❌ No se encontró inicialización de selectedParts');
  }
  
  // Buscar handleSignOut
  const signOutMatch = appContent.match(/const handleSignOut = async \(\) => \{[\s\S]*?\};/);
  if (signOutMatch) {
    console.log('   ✅ handleSignOut encontrado');
    
    // Verificar si usa getDefaultBuildForArchetype
    if (signOutMatch[0].includes('getDefaultBuildForArchetype')) {
      console.log('   ✅ Usa getDefaultBuildForArchetype');
    } else {
      console.log('   ❌ NO usa getDefaultBuildForArchetype');
    }
  } else {
    console.log('   ❌ handleSignOut no encontrado');
  }
  
  // Buscar handleArchetypeChange
  const archetypeChangeMatch = appContent.match(/const handleArchetypeChange = \(archetype: ArchetypeId\) => \{[\s\S]*?\};/);
  if (archetypeChangeMatch) {
    console.log('   ✅ handleArchetypeChange encontrado');
    
    // Verificar si usa getDefaultBuildForArchetype
    if (archetypeChangeMatch[0].includes('getDefaultBuildForArchetype')) {
      console.log('   ✅ Usa getDefaultBuildForArchetype');
    } else {
      console.log('   ❌ NO usa getDefaultBuildForArchetype');
    }
  } else {
    console.log('   ❌ handleArchetypeChange no encontrado');
  }
} else {
  console.log('   ❌ App.tsx no encontrado');
}

// Verificar constants.ts
console.log('\n🔍 Verificando constants.ts:');
const constantsPath = './constants.ts';
if (fs.existsSync(constantsPath)) {
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  // Buscar funciones de build por defecto
  const functions = [
    'getDefaultBuildForArchetype',
    'getDefaultStrongBuild',
    'getDefaultJusticieroBuild'
  ];
  
  functions.forEach(func => {
    if (constantsContent.includes(`export const ${func}`)) {
      console.log(`   ✅ ${func} encontrada`);
    } else {
      console.log(`   ❌ ${func} NO encontrada`);
    }
  });
  
  // Verificar builds por defecto
  const defaultBuilds = [
    'DEFAULT_STRONG_BUILD',
    'DEFAULT_JUSTICIERO_BUILD'
  ];
  
  defaultBuilds.forEach(build => {
    if (constantsContent.includes(`export const ${build}`)) {
      console.log(`   ✅ ${build} encontrado`);
      
      // Verificar si está vacío
      const buildMatch = constantsContent.match(new RegExp(`export const ${build}: SelectedParts = \\{([^}]*)\\}`));
      if (buildMatch) {
        const content = buildMatch[1].trim();
        if (content === '' || content.includes('//')) {
          console.log(`   ℹ️  ${build} está vacío (correcto)`);
        } else {
          console.log(`   ⚠️  ${build} NO está vacío`);
        }
      }
    } else {
      console.log(`   ❌ ${build} NO encontrado`);
    }
  });
} else {
  console.log('   ❌ constants.ts no encontrado');
}

// Verificar CharacterViewer.tsx
console.log('\n🔍 Verificando CharacterViewer.tsx:');
const viewerPath = './components/CharacterViewer.tsx';
if (fs.existsSync(viewerPath)) {
  const viewerContent = fs.readFileSync(viewerPath, 'utf8');
  
  // Buscar carga del modelo base
  if (viewerContent.includes('strong_base_01.glb')) {
    console.log('   ✅ Carga strong_base_01.glb');
  } else {
    console.log('   ❌ NO carga strong_base_01.glb');
  }
  
  if (viewerContent.includes('justiciero_base_01.glb')) {
    console.log('   ✅ Carga justiciero_base_01.glb');
  } else {
    console.log('   ❌ NO carga justiciero_base_01.glb');
  }
  
  // Buscar performModelLoad
  if (viewerContent.includes('performModelLoad')) {
    console.log('   ✅ performModelLoad encontrado');
  } else {
    console.log('   ❌ performModelLoad NO encontrado');
  }
  
  // Buscar limpieza del modelo
  if (viewerContent.includes('modelGroup.children')) {
    console.log('   ✅ Limpieza del modelo encontrada');
  } else {
    console.log('   ❌ Limpieza del modelo NO encontrada');
  }
} else {
  console.log('   ❌ CharacterViewer.tsx no encontrado');
}

console.log('\n🎯 DIAGNÓSTICO COMPLETADO');
console.log('\n💡 POSIBLES CAUSAS:');
console.log('1. El modelo base no se carga correctamente');
console.log('2. La limpieza del modelo elimina el modelo base');
console.log('3. El arquetipo no se detecta correctamente');
console.log('4. Las partes por defecto no se asignan correctamente');
console.log('5. El CharacterViewer no se re-renderiza después del sign out'); 