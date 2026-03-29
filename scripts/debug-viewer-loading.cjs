#!/usr/bin/env node

/**
 * 🔍 Script de diagnóstico para el problema de carga del modelo
 * Verifica por qué solo aparece una parte del modelo después del sign out
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Diagnóstico del problema de carga del modelo...\n');

// Verificar CharacterViewer.tsx
console.log('🔍 Verificando CharacterViewer.tsx:');
const viewerPath = './components/CharacterViewer.tsx';
if (fs.existsSync(viewerPath)) {
  const viewerContent = fs.readFileSync(viewerPath, 'utf8');
  
  // Buscar la función performModelLoad
  const performModelLoadMatch = viewerContent.match(/const performModelLoad = async \(\) => \{[\s\S]*?\};/);
  if (performModelLoadMatch) {
    console.log('   ✅ performModelLoad encontrado');
    
    const performModelLoadContent = performModelLoadMatch[0];
    
    // Verificar si carga el modelo base
    if (performModelLoadContent.includes('strong_base_01.glb')) {
      console.log('   ✅ Carga strong_base_01.glb');
    } else {
      console.log('   ❌ NO carga strong_base_01.glb');
    }
    
    // Verificar si hay limpieza del modelo
    if (performModelLoadContent.includes('modelGroup.children')) {
      console.log('   ✅ Limpieza del modelo encontrada');
    } else {
      console.log('   ❌ Limpieza del modelo NO encontrada');
    }
    
    // Verificar si hay manejo de errores
    if (performModelLoadContent.includes('catch (error)')) {
      console.log('   ✅ Manejo de errores encontrado');
    } else {
      console.log('   ❌ Manejo de errores NO encontrado');
    }
    
    // Verificar si hay logs de debug
    if (performModelLoadContent.includes('console.log')) {
      console.log('   ✅ Logs de debug encontrados');
    } else {
      console.log('   ❌ Logs de debug NO encontrados');
    }
    
    // Verificar si hay verificación de Three.js ready
    if (performModelLoadContent.includes('isThreeJSReady')) {
      console.log('   ✅ Verificación de Three.js ready encontrada');
    } else {
      console.log('   ❌ Verificación de Three.js ready NO encontrada');
    }
    
    // Verificar si hay verificación de refs
    if (performModelLoadContent.includes('modelGroup') && performModelLoadContent.includes('camera') && performModelLoadContent.includes('controls')) {
      console.log('   ✅ Verificación de refs encontrada');
    } else {
      console.log('   ❌ Verificación de refs NO encontrada');
    }
    
  } else {
    console.log('   ❌ performModelLoad NO encontrado');
  }
  
  // Buscar la función clearPreview
  if (viewerContent.includes('clearPreview')) {
    console.log('   ✅ clearPreview encontrado');
  } else {
    console.log('   ❌ clearPreview NO encontrado');
  }
  
  // Buscar la función resetState
  if (viewerContent.includes('resetState')) {
    console.log('   ✅ resetState encontrado');
  } else {
    console.log('   ❌ resetState NO encontrado');
  }
  
  // Buscar useEffect que llama a performModelLoad
  const useEffectMatch = viewerContent.match(/useEffect\(\(\) => \{[\s\S]*?performModelLoad[\s\S]*?\}, \[.*?\]\)/);
  if (useEffectMatch) {
    console.log('   ✅ useEffect que llama a performModelLoad encontrado');
  } else {
    console.log('   ❌ useEffect que llama a performModelLoad NO encontrado');
  }
  
} else {
  console.log('   ❌ CharacterViewer.tsx no encontrado');
}

// Verificar App.tsx
console.log('\n🔍 Verificando App.tsx:');
const appPath = './App.tsx';
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Buscar handleSignOut
  const signOutMatch = appContent.match(/const handleSignOut = async \(\) => \{[\s\S]*?\};/);
  if (signOutMatch) {
    console.log('   ✅ handleSignOut encontrado');
    
    const signOutContent = signOutMatch[0];
    
    // Verificar si llama a clearPreview
    if (signOutContent.includes('clearPreview')) {
      console.log('   ✅ Llama a clearPreview');
    } else {
      console.log('   ❌ NO llama a clearPreview');
    }
    
    // Verificar si llama a resetState
    if (signOutContent.includes('resetState')) {
      console.log('   ✅ Llama a resetState');
    } else {
      console.log('   ❌ NO llama a resetState');
    }
    
    // Verificar si incrementa characterViewerKey
    if (signOutContent.includes('setCharacterViewerKey')) {
      console.log('   ✅ Incrementa characterViewerKey');
    } else {
      console.log('   ❌ NO incrementa characterViewerKey');
    }
    
    // Verificar si asigna DEFAULT_STRONG_BUILD
    if (signOutContent.includes('DEFAULT_STRONG_BUILD')) {
      console.log('   ✅ Asigna DEFAULT_STRONG_BUILD');
    } else {
      console.log('   ❌ NO asigna DEFAULT_STRONG_BUILD');
    }
    
  } else {
    console.log('   ❌ handleSignOut NO encontrado');
  }
  
  // Buscar inicialización de selectedParts
  const selectedPartsMatch = appContent.match(/const \[selectedParts, setSelectedParts\] = useState<SelectedParts>\(([^)]+)\)/);
  if (selectedPartsMatch) {
    console.log(`   ✅ selectedParts inicializado con: ${selectedPartsMatch[1]}`);
  } else {
    console.log('   ❌ No se encontró inicialización de selectedParts');
  }
  
} else {
  console.log('   ❌ App.tsx no encontrado');
}

// Verificar constants.ts
console.log('\n🔍 Verificando constants.ts:');
const constantsPath = './constants.ts';
if (fs.existsSync(constantsPath)) {
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  // Verificar DEFAULT_STRONG_BUILD
  const strongBuildMatch = constantsContent.match(/export const DEFAULT_STRONG_BUILD: SelectedParts = \{([^}]*)\}/);
  if (strongBuildMatch) {
    const content = strongBuildMatch[1].trim();
    if (content === '' || content.includes('//')) {
      console.log('   ✅ DEFAULT_STRONG_BUILD está vacío (correcto)');
    } else {
      console.log('   ❌ DEFAULT_STRONG_BUILD NO está vacío');
      console.log(`      Contenido: ${content}`);
    }
  } else {
    console.log('   ❌ DEFAULT_STRONG_BUILD NO encontrado');
  }
  
  // Verificar DEFAULT_JUSTICIERO_BUILD
  const justicieroBuildMatch = constantsContent.match(/export const DEFAULT_JUSTICIERO_BUILD: SelectedParts = \{([^}]*)\}/);
  if (justicieroBuildMatch) {
    const content = justicieroBuildMatch[1].trim();
    if (content === '' || content.includes('//')) {
      console.log('   ✅ DEFAULT_JUSTICIERO_BUILD está vacío (correcto)');
    } else {
      console.log('   ❌ DEFAULT_JUSTICIERO_BUILD NO está vacío');
      console.log(`      Contenido: ${content}`);
    }
  } else {
    console.log('   ❌ DEFAULT_JUSTICIERO_BUILD NO encontrado');
  }
  
} else {
  console.log('   ❌ constants.ts no encontrado');
}

console.log('\n🎯 DIAGNÓSTICO COMPLETADO');
console.log('\n💡 POSIBLES CAUSAS DEL PROBLEMA:');
console.log('1. El modelo base se carga pero no se renderiza correctamente');
console.log('2. La cámara no está posicionada correctamente');
console.log('3. El modelo se carga pero está fuera de vista');
console.log('4. Hay un problema con la limpieza del modelo');
console.log('5. El CharacterViewer no se re-renderiza correctamente');
console.log('6. El modelo base está corrupto o incompleto');
console.log('\n🔧 PRÓXIMOS PASOS:');
console.log('1. Verificar en la consola del navegador si hay errores');
console.log('2. Verificar si el modelo base se carga completamente');
console.log('3. Verificar si la cámara está posicionada correctamente');
console.log('4. Verificar si hay problemas de renderizado'); 