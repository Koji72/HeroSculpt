#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO: ¿Por qué el modelo no cambia al navegar entre poses?');
console.log('===============================================================\n');

// 1. Verificar la lógica de updateCurrentPoseConfiguration
console.log('1️⃣ ANALIZANDO updateCurrentPoseConfiguration...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Buscar la función updateCurrentPoseConfiguration
  const updateConfigMatch = appContent.match(/const updateCurrentPoseConfiguration = async \(\) => \{([\s\S]*?)\};/);
  
  if (updateConfigMatch) {
    const updateConfigFunction = updateConfigMatch[1];
    
    // Verificar si tiene la lógica problemática
    const hasProblematicLogic = updateConfigFunction.includes('JSON.stringify(currentConfig) !== JSON.stringify(selectedParts)');
    console.log(`   ${hasProblematicLogic ? '❌' : '✅'} Lógica problemática encontrada`);
    
    if (hasProblematicLogic) {
      console.log('   🔍 PROBLEMA: La función compara la configuración de la pose con selectedParts');
      console.log('   🔍 CUANDO: handleNextPose actualiza selectedParts');
      console.log('   🔍 DESPUÉS: updateCurrentPoseConfiguration se ejecuta');
      console.log('   🔍 RESULTADO: Dice "no cambió" porque es la misma configuración');
    }
  } else {
    console.log('   ❌ No se encontró updateCurrentPoseConfiguration');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
}

// 2. Verificar el useEffect que ejecuta updateCurrentPoseConfiguration
console.log('\n2️⃣ ANALIZANDO useEffect de updateCurrentPoseConfiguration...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Buscar el useEffect que llama a updateCurrentPoseConfiguration
  const useEffectMatch = appContent.match(/useEffect\(\(\) => \{([\s\S]*?)updateCurrentPoseConfiguration([\s\S]*?)\}, \[([\s\S]*?)\]\);/);
  
  if (useEffectMatch) {
    const useEffectBody = useEffectMatch[1] + 'updateCurrentPoseConfiguration' + useEffectMatch[2];
    const dependencies = useEffectMatch[3];
    
    console.log('   - Dependencias del useEffect:', dependencies);
    
    // Verificar si selectedParts está en las dependencias
    const hasSelectedPartsDependency = dependencies.includes('selectedParts');
    console.log(`   ${hasSelectedPartsDependency ? '❌' : '✅'} selectedParts en dependencias`);
    
    if (hasSelectedPartsDependency) {
      console.log('   🔍 PROBLEMA: El useEffect se ejecuta cada vez que cambian selectedParts');
      console.log('   🔍 INCLUYENDO: Cuando handleNextPose actualiza selectedParts');
    }
  } else {
    console.log('   ❌ No se encontró el useEffect de updateCurrentPoseConfiguration');
  }
  
} catch (error) {
  console.log('   ❌ Error analizando useEffect:', error.message);
}

// 3. Verificar la lógica de handleNextPose
console.log('\n3️⃣ ANALIZANDO handleNextPose...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Buscar handleNextPose
  const handleNextPoseMatch = appContent.match(/const handleNextPose = \(\) => \{([\s\S]*?)\};/);
  
  if (handleNextPoseMatch) {
    const handleNextPoseFunction = handleNextPoseMatch[1];
    
    // Verificar si actualiza selectedParts
    const updatesSelectedParts = handleNextPoseFunction.includes('setSelectedParts');
    console.log(`   ${updatesSelectedParts ? '✅' : '❌'} Actualiza selectedParts`);
    
    if (updatesSelectedParts) {
      console.log('   🔍 FLUJO: handleNextPose → setSelectedParts → useEffect → updateCurrentPoseConfiguration');
    }
  } else {
    console.log('   ❌ No se encontró handleNextPose');
  }
  
} catch (error) {
  console.log('   ❌ Error analizando handleNextPose:', error.message);
}

// 4. Verificar CharacterViewer useEffect
console.log('\n4️⃣ ANALIZANDO CharacterViewer useEffect...');
try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Buscar el useEffect principal
  const useEffectMatch = viewerContent.match(/useEffect\(\(\) => \{([\s\S]*?)performModelLoad\(\)([\s\S]*?)\}, \[([\s\S]*?)\]\);/);
  
  if (useEffectMatch) {
    const dependencies = useEffectMatch[3];
    console.log('   - Dependencias del CharacterViewer useEffect:', dependencies);
    
    // Verificar si selectedParts está en las dependencias
    const hasSelectedPartsDependency = dependencies.includes('selectedParts');
    console.log(`   ${hasSelectedPartsDependency ? '✅' : '❌'} selectedParts en dependencias`);
    
    if (hasSelectedPartsDependency) {
      console.log('   🔍 FLUJO: selectedParts cambia → CharacterViewer useEffect → performModelLoad');
    }
  } else {
    console.log('   ❌ No se encontró el useEffect principal del CharacterViewer');
  }
  
} catch (error) {
  console.log('   ❌ Error analizando CharacterViewer:', error.message);
}

console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
console.log('==========================');
console.log('✅ FLUJO CORRECTO:');
console.log('   1. handleNextPose actualiza selectedParts');
console.log('   2. CharacterViewer useEffect detecta cambio');
console.log('   3. performModelLoad actualiza el modelo 3D');
console.log('');
console.log('❌ PROBLEMA IDENTIFICADO:');
console.log('   1. handleNextPose actualiza selectedParts');
console.log('   2. updateCurrentPoseConfiguration useEffect se ejecuta');
console.log('   3. updateCurrentPoseConfiguration dice "no cambió"');
console.log('   4. CharacterViewer useEffect se ejecuta');
console.log('   5. performModelLoad se ejecuta pero puede estar interfiriendo');
console.log('');
console.log('🔧 SOLUCIÓN SUGERIDA:');
console.log('   - updateCurrentPoseConfiguration NO debería ejecutarse al navegar');
console.log('   - Solo debería ejecutarse cuando el usuario modifica manualmente');
console.log('   - O agregar una condición para distinguir navegación vs modificación manual'); 