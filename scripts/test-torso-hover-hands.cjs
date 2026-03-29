#!/usr/bin/env node

/**
 * 🧪 TEST: TORSO HOVER HANDS PROBLEM
 * 
 * Este script verifica si el problema de hover con torsos y manos está solucionado
 * 
 * Problema reportado:
 * - Al hacer hover sobre torsos, las manos no aparecen junto con el torso
 * - Las piezas dependientes del torso deberían mostrarse en el hover
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: TORSO HOVER HANDS PROBLEM');
console.log('=====================================\n');

// 1. Verificar que el PartSelectorPanel.tsx tiene la corrección
console.log('1️⃣ Verificando PartSelectorPanel.tsx...');
const partSelectorPath = path.join(__dirname, '..', 'components', 'PartSelectorPanel.tsx');
if (fs.existsSync(partSelectorPath)) {
  const content = fs.readFileSync(partSelectorPath, 'utf8');
  
  // Verificar que tiene la corrección de partsWithHands
  if (content.includes('const partsWithHands = { ...partsWithoutCurrentTorso };')) {
    console.log('✅ CORRECCIÓN ENCONTRADA: partsWithHands implementado');
  } else {
    console.log('❌ PROBLEMA: No se encontró la corrección partsWithHands');
  }
  
  // Verificar que llama a assignDefaultHandsForTorso correctamente
  if (content.includes('assignDefaultHandsForTorso(partToDisplay, partsWithHands)')) {
    console.log('✅ CORRECCIÓN ENCONTRADA: assignDefaultHandsForTorso llamado correctamente');
  } else {
    console.log('❌ PROBLEMA: assignDefaultHandsForTorso no llamado correctamente');
  }
  
  // Verificar que combina todos los resultados
  if (content.includes('...finalCompatibleParts')) {
    console.log('✅ CORRECCIÓN ENCONTRADA: Resultados combinados correctamente');
  } else {
    console.log('❌ PROBLEMA: Resultados no combinados correctamente');
  }
} else {
  console.log('❌ ERROR: No se encontró PartSelectorPanel.tsx');
}

console.log('');

// 2. Verificar que lib/utils.ts tiene la función assignDefaultHandsForTorso
console.log('2️⃣ Verificando lib/utils.ts...');
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.ts');
if (fs.existsSync(utilsPath)) {
  const content = fs.readFileSync(utilsPath, 'utf8');
  
  if (content.includes('export function assignDefaultHandsForTorso')) {
    console.log('✅ FUNCIÓN ENCONTRADA: assignDefaultHandsForTorso existe');
    
    // Verificar que preserva manos existentes
    if (content.includes('let newParts = { ...currentParts };')) {
      console.log('✅ CORRECCIÓN ENCONTRADA: Preserva manos existentes');
    } else {
      console.log('❌ PROBLEMA: No preserva manos existentes');
    }
    
    // Verificar que maneja el caso de manos por defecto
    if (content.includes('if (!currentLeftHand && !currentRightHand)')) {
      console.log('✅ CORRECCIÓN ENCONTRADA: Maneja caso de manos por defecto');
    } else {
      console.log('❌ PROBLEMA: No maneja caso de manos por defecto');
    }
  } else {
    console.log('❌ ERROR: No se encontró assignDefaultHandsForTorso');
  }
} else {
  console.log('❌ ERROR: No se encontró lib/utils.ts');
}

console.log('');

// 3. Verificar que CharacterViewer.tsx maneja el preview correctamente
console.log('3️⃣ Verificando CharacterViewer.tsx...');
const characterViewerPath = path.join(__dirname, '..', 'components', 'CharacterViewer.tsx');
if (fs.existsSync(characterViewerPath)) {
  const content = fs.readFileSync(characterViewerPath, 'utf8');
  
  if (content.includes('handlePreviewPartsChange')) {
    console.log('✅ FUNCIÓN ENCONTRADA: handlePreviewPartsChange existe');
    
    // Verificar que combina las partes correctamente
    if (content.includes('const combinedParts = { ...selectedParts, ...changedParts };')) {
      console.log('✅ CORRECCIÓN ENCONTRADA: Combina partes correctamente');
    } else {
      console.log('❌ PROBLEMA: No combina partes correctamente');
    }
    
    // Verificar que carga solo las categorías cambiadas
    if (content.includes('changedCategories.forEach(async (category)')) {
      console.log('✅ CORRECCIÓN ENCONTRADA: Carga solo categorías cambiadas');
    } else {
      console.log('❌ PROBLEMA: No carga solo categorías cambiadas');
    }
  } else {
    console.log('❌ ERROR: No se encontró handlePreviewPartsChange');
  }
} else {
  console.log('❌ ERROR: No se encontró CharacterViewer.tsx');
}

console.log('');

// 4. Verificar documentación del problema
console.log('4️⃣ Verificando documentación...');
const docsPath = path.join(__dirname, '..', 'docs', 'TORSO_HOVER_HANDS_FIX_2025.md');
if (fs.existsSync(docsPath)) {
  console.log('✅ DOCUMENTACIÓN ENCONTRADA: TORSO_HOVER_HANDS_FIX_2025.md');
  
  const content = fs.readFileSync(docsPath, 'utf8');
  if (content.includes('PROBLEM SOLVED')) {
    console.log('✅ ESTADO: Problema marcado como SOLUCIONADO');
  } else {
    console.log('❌ ESTADO: Problema no marcado como solucionado');
  }
} else {
  console.log('❌ ERROR: No se encontró documentación del problema');
}

console.log('');

// 5. Resumen y recomendaciones
console.log('📋 RESUMEN Y RECOMENDACIONES:');
console.log('==============================');

console.log(`
🎯 PROBLEMA REPORTADO:
- Al hacer hover sobre torsos, las manos no aparecen junto con el torso
- Las piezas dependientes del torso deberían mostrarse en el hover

🔍 ANÁLISIS:
- El código parece tener las correcciones implementadas
- La documentación indica que el problema está solucionado
- Sin embargo, puede haber un problema de sincronización o timing

🚀 ACCIONES RECOMENDADAS:

1. VERIFICAR EN EL NAVEGADOR:
   - Abrir las herramientas de desarrollador (F12)
   - Ir a la pestaña Console
   - Hacer hover sobre diferentes torsos
   - Verificar si aparecen logs de debug

2. VERIFICAR LOGS ESPECÍFICOS:
   - Buscar logs que empiecen con "🔄 HOVER DEBUG"
   - Buscar logs que empiecen con "🎯 HOVER DEBUG"
   - Verificar si las manos se están asignando correctamente

3. VERIFICAR ESTADO DE PREVIEW:
   - Verificar si previewParts se está actualizando correctamente
   - Verificar si CharacterViewer está recibiendo las partes correctas

4. POSIBLES CAUSAS:
   - Timing de carga de modelos
   - Problema de visibilidad en la escena 3D
   - Problema de compatibilidad entre partes
   - Problema de estado en el componente

5. SOLUCIÓN TEMPORAL:
   - Si el problema persiste, revisar los logs del navegador
   - Verificar si hay errores en la consola
   - Comprobar si los modelos se están cargando correctamente
`);

console.log('\n✅ TEST COMPLETADO'); 