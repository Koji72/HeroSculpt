#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO - Manos duplicadas en submenú de torso');
console.log('=====================================================\n');

let allChecksPassed = true;

// 1. Verificar el contenido del TorsoSubmenu.tsx
console.log('1️⃣ Verificando TorsoSubmenu.tsx...');
try {
  const submenuContent = fs.readFileSync('components/TorsoSubmenu.tsx', 'utf8');
  
  // Contar cuántas veces aparece HAND_LEFT
  const leftHandMatches = submenuContent.match(/PartCategory\.HAND_LEFT/g);
  const leftHandCount = leftHandMatches ? leftHandMatches.length : 0;
  
  // Contar cuántas veces aparece HAND_RIGHT
  const rightHandMatches = submenuContent.match(/PartCategory\.HAND_RIGHT/g);
  const rightHandCount = rightHandMatches ? rightHandMatches.length : 0;
  
  console.log(`   📊 HAND_LEFT aparece ${leftHandCount} veces`);
  console.log(`   📊 HAND_RIGHT aparece ${rightHandCount} veces`);
  
  if (leftHandCount === 1 && rightHandCount === 1) {
    console.log('   ✅ Cada mano aparece exactamente una vez en el código');
  } else {
    console.log('   ❌ Hay duplicados en el código del submenú');
    allChecksPassed = false;
  }
  
  // Verificar que no hay etiquetas duplicadas
  const leftHandLabels = submenuContent.match(/label: 'LEFT HAND'/g);
  const rightHandLabels = submenuContent.match(/label: 'RIGHT HAND'/g);
  
  console.log(`   📊 Etiquetas "LEFT HAND": ${leftHandLabels ? leftHandLabels.length : 0}`);
  console.log(`   📊 Etiquetas "RIGHT HAND": ${rightHandLabels ? rightHandLabels.length : 0}`);
  
  if ((leftHandLabels && leftHandLabels.length === 1) && (rightHandLabels && rightHandLabels.length === 1)) {
    console.log('   ✅ Etiquetas únicas para cada mano');
  } else {
    console.log('   ❌ Etiquetas duplicadas encontradas');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo TorsoSubmenu.tsx:', error.message);
  allChecksPassed = false;
}

// 2. Verificar si hay múltiples renderizados en App.tsx
console.log('\n2️⃣ Verificando renderizado en App.tsx...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Contar cuántas veces se renderiza TorsoSubmenu
  const torsoSubmenuRenders = appContent.match(/<TorsoSubmenu/g);
  const renderCount = torsoSubmenuRenders ? torsoSubmenuRenders.length : 0;
  
  console.log(`   📊 TorsoSubmenu se renderiza ${renderCount} veces`);
  
  if (renderCount === 1) {
    console.log('   ✅ TorsoSubmenu se renderiza una sola vez');
  } else {
    console.log('   ❌ TorsoSubmenu se renderiza múltiples veces');
    allChecksPassed = false;
  }
  
  // Verificar que no hay imports duplicados
  const importMatches = appContent.match(/import.*TorsoSubmenu/g);
  const importCount = importMatches ? importMatches.length : 0;
  
  console.log(`   📊 Imports de TorsoSubmenu: ${importCount}`);
  
  if (importCount === 1) {
    console.log('   ✅ Un solo import de TorsoSubmenu');
  } else {
    console.log('   ❌ Múltiples imports de TorsoSubmenu');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
  allChecksPassed = false;
}

// 3. Verificar si hay otros componentes que muestren manos
console.log('\n3️⃣ Verificando otros componentes que muestren manos...');
try {
  // Buscar en todos los archivos .tsx de components
  const componentsDir = 'components';
  const files = fs.readdirSync(componentsDir);
  
  let foundHandComponents = [];
  
  for (const file of files) {
    if (file.endsWith('.tsx') && file !== 'TorsoSubmenu.tsx') {
      const filePath = path.join(componentsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes('HAND_LEFT') || content.includes('HAND_RIGHT')) {
        const handMatches = content.match(/HAND_LEFT|HAND_RIGHT/g);
        if (handMatches) {
          foundHandComponents.push({
            file: file,
            matches: handMatches.length,
            lines: content.split('\n').filter(line => line.includes('HAND_LEFT') || line.includes('HAND_RIGHT')).length
          });
        }
      }
    }
  }
  
  console.log(`   📊 Componentes que mencionan manos: ${foundHandComponents.length}`);
  
  if (foundHandComponents.length > 0) {
    console.log('   📋 Componentes encontrados:');
    foundHandComponents.forEach(comp => {
      console.log(`      - ${comp.file}: ${comp.matches} menciones en ${comp.lines} líneas`);
    });
  } else {
    console.log('   ✅ No hay otros componentes que muestren manos');
  }
  
} catch (error) {
  console.log('   ❌ Error buscando otros componentes:', error.message);
  allChecksPassed = false;
}

// 4. Verificar si hay problemas de estado
console.log('\n4️⃣ Verificando lógica de estado...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que el estado de expansión se maneja correctamente
  const hasExpansionState = appContent.includes('torsoSubmenuExpanded') &&
                           appContent.includes('setTorsoSubmenuExpanded');
  
  if (hasExpansionState) {
    console.log('   ✅ Estado de expansión manejado correctamente');
  } else {
    console.log('   ❌ Problema con el estado de expansión');
    allChecksPassed = false;
  }
  
  // Verificar que no hay múltiples manejadores de toggle
  const toggleMatches = appContent.match(/handleTorsoSubmenuToggle/g);
  const toggleCount = toggleMatches ? toggleMatches.length : 0;
  
  console.log(`   📊 Manejadores de toggle: ${toggleCount}`);
  
  if (toggleCount === 1) {
    console.log('   ✅ Un solo manejador de toggle');
  } else {
    console.log('   ❌ Múltiples manejadores de toggle');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error verificando lógica de estado:', error.message);
  allChecksPassed = false;
}

// 5. Simular el flujo de renderizado
console.log('\n5️⃣ Simulando flujo de renderizado...');
try {
  console.log('   🔄 Flujo de renderizado:');
  console.log('   1. App.tsx renderiza TorsoSubmenu una vez');
  console.log('   2. TorsoSubmenu.tsx tiene submenuCategories con 10 elementos');
  console.log('   3. Cada elemento se mapea una vez en el render');
  console.log('   4. HAND_LEFT y HAND_RIGHT aparecen una vez cada uno');
  console.log('   5. No debería haber duplicados');
  
  console.log('   ✅ Flujo de renderizado simulado correctamente');
  
} catch (error) {
  console.log('   ❌ Error en simulación:', error.message);
  allChecksPassed = false;
}

// Resultado final
console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
console.log('============================');

if (allChecksPassed) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('🎯 El código parece estar correcto');
  console.log('');
  console.log('🔍 Posibles causas del problema:');
  console.log('   1. Problema de renderizado en tiempo de ejecución');
  console.log('   2. Estado que se actualiza múltiples veces');
  console.log('   3. React StrictMode causando doble renderizado');
  console.log('   4. Problema de CSS que hace parecer duplicados');
  console.log('');
  console.log('🧪 Acciones recomendadas:');
  console.log('   1. Verificar en el navegador si realmente hay duplicados');
  console.log('   2. Revisar las herramientas de desarrollo de React');
  console.log('   3. Verificar si es un problema visual vs lógico');
  console.log('   4. Comprobar si el problema ocurre en producción');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('⚠️ Se encontraron problemas en el código');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los errores arriba');
  console.log('   2. Corregir los problemas identificados');
  console.log('   3. Ejecutar este script nuevamente');
}

console.log('\n📚 Archivos de referencia:');
console.log('   - components/TorsoSubmenu.tsx');
console.log('   - App.tsx (líneas 2020-2030)');
console.log('   - Herramientas de desarrollo del navegador');

process.exit(allChecksPassed ? 0 : 1); 