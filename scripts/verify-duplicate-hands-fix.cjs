#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('✅ VERIFICACIÓN FINAL - Fix de manos duplicadas en submenú');
console.log('==========================================================\n');

let allChecksPassed = true;

// 1. Verificar que TorsoSubmenu no tiene onToggle
console.log('1️⃣ Verificando que TorsoSubmenu no tiene onToggle...');
try {
  const submenuContent = fs.readFileSync('components/TorsoSubmenu.tsx', 'utf8');
  
  // Verificar que no hay onToggle en la interfaz
  const hasOnToggleInInterface = submenuContent.includes('onToggle: () => void');
  if (!hasOnToggleInInterface) {
    console.log('   ✅ onToggle eliminado de la interfaz');
  } else {
    console.log('   ❌ onToggle aún presente en la interfaz');
    allChecksPassed = false;
  }
  
  // Verificar que no hay onToggle en props
  const hasOnToggleInProps = submenuContent.includes('onToggle,');
  if (!hasOnToggleInProps) {
    console.log('   ✅ onToggle eliminado de props');
  } else {
    console.log('   ❌ onToggle aún presente en props');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo TorsoSubmenu.tsx:', error.message);
  allChecksPassed = false;
}

// 2. Verificar que App.tsx no pasa onToggle a TorsoSubmenu
console.log('\n2️⃣ Verificando que App.tsx no pasa onToggle...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que no hay onToggle en el render de TorsoSubmenu
  const hasOnToggleInRender = appContent.includes('onToggle={handleTorsoSubmenuToggle}');
  if (!hasOnToggleInRender) {
    console.log('   ✅ onToggle eliminado del render');
  } else {
    console.log('   ❌ onToggle aún presente en el render');
    allChecksPassed = false;
  }
  
  // Verificar que solo hay un uso activo del manejador
  const activeUses = appContent.match(/onTorsoToggle={handleTorsoSubmenuToggle}/g);
  const activeUseCount = activeUses ? activeUses.length : 0;
  
  if (activeUseCount === 1) {
    console.log('   ✅ Solo un uso activo del manejador (en PartCategoryToolbar)');
  } else {
    console.log(`   ❌ ${activeUseCount} usos activos del manejador (debería ser 1)`);
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
  allChecksPassed = false;
}

// 3. Verificar que las manos aparecen una sola vez
console.log('\n3️⃣ Verificando que las manos aparecen una sola vez...');
try {
  const submenuContent = fs.readFileSync('components/TorsoSubmenu.tsx', 'utf8');
  
  // Contar apariciones de cada mano
  const leftHandCount = (submenuContent.match(/PartCategory\.HAND_LEFT/g) || []).length;
  const rightHandCount = (submenuContent.match(/PartCategory\.HAND_RIGHT/g) || []).length;
  
  console.log(`   📊 HAND_LEFT: ${leftHandCount} apariciones`);
  console.log(`   📊 HAND_RIGHT: ${rightHandCount} apariciones`);
  
  if (leftHandCount === 1 && rightHandCount === 1) {
    console.log('   ✅ Cada mano aparece exactamente una vez');
  } else {
    console.log('   ❌ Hay duplicados en el código');
    allChecksPassed = false;
  }
  
  // Verificar etiquetas únicas
  const leftHandLabels = (submenuContent.match(/label: 'LEFT HAND'/g) || []).length;
  const rightHandLabels = (submenuContent.match(/label: 'RIGHT HAND'/g) || []).length;
  
  if (leftHandLabels === 1 && rightHandLabels === 1) {
    console.log('   ✅ Etiquetas únicas para cada mano');
  } else {
    console.log('   ❌ Etiquetas duplicadas');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error verificando manos:', error.message);
  allChecksPassed = false;
}

// 4. Verificar documentación del fix
console.log('\n4️⃣ Verificando documentación del fix...');
try {
  const fixDoc = fs.readFileSync('docs/TORSO_SUBMENU_DUPLICATE_HANDS_FIX_2025.md', 'utf8');
  
  if (fixDoc.length > 500) {
    console.log('   ✅ Documentación del fix presente');
  } else {
    console.log('   ❌ Documentación del fix incompleta');
    allChecksPassed = false;
  }
  
  // Verificar que documenta el problema correctamente
  const documentsProblem = fixDoc.includes('duplicate hand options') &&
                          fixDoc.includes('multiple toggle handlers');
  if (documentsProblem) {
    console.log('   ✅ Problema documentado correctamente');
  } else {
    console.log('   ❌ Problema NO documentado correctamente');
    allChecksPassed = false;
  }
  
  // Verificar que documenta la solución
  const documentsSolution = fixDoc.includes('Removed duplicate toggle handler') &&
                           fixDoc.includes('Single source of truth');
  if (documentsSolution) {
    console.log('   ✅ Solución documentada correctamente');
  } else {
    console.log('   ❌ Solución NO documentada correctamente');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo documentación:', error.message);
  allChecksPassed = false;
}

// 5. Verificar que el índice está actualizado
console.log('\n5️⃣ Verificando índice de documentación...');
try {
  const indexDoc = fs.readFileSync('docs/DOCUMENTATION_INDEX.md', 'utf8');
  
  const hasDuplicateFix = indexDoc.includes('TORSO_SUBMENU_DUPLICATE_HANDS_FIX_2025.md') &&
                         indexDoc.includes('Fix de manos duplicadas en submenú de torso');
  if (hasDuplicateFix) {
    console.log('   ✅ Fix documentado en índice');
  } else {
    console.log('   ❌ Fix NO documentado en índice');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo índice:', error.message);
  allChecksPassed = false;
}

// Resultado final
console.log('\n📋 RESUMEN DE VERIFICACIÓN FINAL:');
console.log('==================================');

if (allChecksPassed) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('🎯 Fix de manos duplicadas IMPLEMENTADO CORRECTAMENTE');
  console.log('');
  console.log('🎯 Estado del fix:');
  console.log('   - onToggle eliminado: ✅ COMPLETADO');
  console.log('   - Manejador único: ✅ IMPLEMENTADO');
  console.log('   - Manos únicas: ✅ VERIFICADO');
  console.log('   - Documentación: ✅ COMPLETA');
  console.log('   - Índice actualizado: ✅ PRESENTE');
  console.log('');
  console.log('🚀 El fix está listo para usar');
  console.log('');
  console.log('🧪 Para probar el fix:');
  console.log('   1. Abrir el submenú de torso');
  console.log('   2. Verificar que cada mano aparece una sola vez');
  console.log('   3. Verificar que no hay duplicados');
  console.log('   4. Confirmar que el toggle funciona correctamente');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('⚠️ El fix NO está completamente implementado');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los errores arriba');
  console.log('   2. Implementar las correcciones necesarias');
  console.log('   3. Ejecutar este script nuevamente');
}

console.log('\n📚 Archivos de referencia:');
console.log('   - docs/TORSO_SUBMENU_DUPLICATE_HANDS_FIX_2025.md');
console.log('   - components/TorsoSubmenu.tsx');
console.log('   - App.tsx (líneas 2020-2030)');

process.exit(allChecksPassed ? 0 : 1); 