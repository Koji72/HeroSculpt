#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 DEBUG - Ejecución del Filtrado de Manos');
console.log('==========================================\n');

// 1. Verificar que el código esté en el lugar correcto
console.log('1️⃣ Verificando ubicación del código de filtrado...');
try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Buscar la función de filtrado completa
  const filterMatch = partSelectorContent.match(/const availableParts = ALL_PARTS\.filter\(part => \{([\s\S]*?)\}\);?/);
  
  if (filterMatch) {
    const filterFunction = filterMatch[1];
    console.log('   ✅ Función de filtrado encontrada');
    
    // Buscar el código específico de manos
    const handFilterCode = filterFunction.match(/\/\/ Caso especial para MANOS[\s\S]*?return part\.compatible\.includes\(selectedTorso\.id\);/);
    
    if (handFilterCode) {
      console.log('   ✅ Código de filtrado de manos encontrado en la función');
      console.log('   📝 Código encontrado:');
      console.log(handFilterCode[0]);
    } else {
      console.log('   ❌ Código de filtrado de manos NO encontrado en la función');
      
      // Buscar si está en otro lugar
      const handFilterAnywhere = partSelectorContent.match(/\/\/ Caso especial para MANOS[\s\S]*?return part\.compatible\.includes\(selectedTorso\.id\);/);
      if (handFilterAnywhere) {
        console.log('   ⚠️ Código encontrado pero FUERA de la función de filtrado');
        console.log('   📍 Esto explica por qué no se ejecuta');
      }
    }
    
    // Verificar la estructura de la función
    const lines = filterFunction.split('\n');
    const handFilterLineIndex = lines.findIndex(line => line.includes('Caso especial para MANOS'));
    
    if (handFilterLineIndex !== -1) {
      console.log(`   📍 Línea del filtro de manos en la función: ${handFilterLineIndex + 1}`);
      
      // Verificar que esté antes del return final
      const finalReturnIndex = lines.findIndex(line => line.includes('return part.compatible.includes'));
      if (finalReturnIndex !== -1 && handFilterLineIndex < finalReturnIndex) {
        console.log('   ✅ Código de manos está antes del return final');
      } else {
        console.log('   ❌ Código de manos está DESPUÉS del return final (no se ejecuta)');
      }
    }
    
  } else {
    console.log('   ❌ No se encontró la función de filtrado');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo archivo:', error.message);
}

// 2. Verificar que no haya problemas de sintaxis
console.log('\n2️⃣ Verificando sintaxis del código...');
try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Buscar posibles problemas de sintaxis alrededor del código de manos
  const handFilterSection = partSelectorContent.match(/\/\/ Caso especial para MANOS[\s\S]*?return part\.compatible\.includes\(selectedTorso\.id\);/);
  
  if (handFilterSection) {
    const code = handFilterSection[0];
    
    // Verificar que tenga la estructura correcta
    const hasCorrectStructure = code.includes('if (part.category === PartCategory.HAND_LEFT') &&
                               code.includes('|| part.category === PartCategory.HAND_RIGHT') &&
                               code.includes('selectedParts[PartCategory.TORSO]') &&
                               code.includes('compatible.includes');
    
    console.log(`   ${hasCorrectStructure ? '✅' : '❌'} Estructura del código correcta`);
    
    if (!hasCorrectStructure) {
      console.log('   📝 Código actual:');
      console.log(code);
    }
  }
  
} catch (error) {
  console.log('   ❌ Error verificando sintaxis:', error.message);
}

// 3. Verificar que el código esté en el orden correcto
console.log('\n3️⃣ Verificando orden de ejecución...');
try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Buscar todos los casos especiales en orden
  const specialCases = [
    'LOWER_BODY',
    'BOOTS', 
    'BUCKLE',
    'CAPE',
    'SYMBOL',
    'CHEST_BELT',
    'MANOS'
  ];
  
  const filterMatch = partSelectorContent.match(/const availableParts = ALL_PARTS\.filter\(part => \{([\s\S]*?)\}\);?/);
  
  if (filterMatch) {
    const filterFunction = filterMatch[1];
    
    console.log('   📋 Orden de casos especiales en el filtro:');
    specialCases.forEach(caseName => {
      const hasCase = filterFunction.includes(`Caso especial para ${caseName}`);
      console.log(`      ${hasCase ? '✅' : '❌'} ${caseName}`);
    });
    
    // Verificar que MANOS esté antes del return final
    const lines = filterFunction.split('\n');
    const manosIndex = lines.findIndex(line => line.includes('Caso especial para MANOS'));
    const finalReturnIndex = lines.findIndex(line => line.includes('return part.compatible.includes(activeTorso.id)'));
    
    if (manosIndex !== -1 && finalReturnIndex !== -1) {
      console.log(`   📍 MANOS en línea ${manosIndex + 1}, return final en línea ${finalReturnIndex + 1}`);
      console.log(`   ${manosIndex < finalReturnIndex ? '✅' : '❌'} MANOS está antes del return final`);
    }
  }
  
} catch (error) {
  console.log('   ❌ Error verificando orden:', error.message);
}

console.log('\n📋 RESUMEN:');
console.log('============');
console.log('Si el código está presente pero no funciona:');
console.log('1. Verifica que esté en el orden correcto');
console.log('2. Verifica que no haya errores de sintaxis');
console.log('3. Verifica que el navegador esté usando la versión actualizada');
console.log('4. Verifica la consola del navegador para errores');

process.exit(0); 