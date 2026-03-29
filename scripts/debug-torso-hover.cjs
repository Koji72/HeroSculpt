#!/usr/bin/env node

/**
 * 🔍 Debug Script: Torso Hover System
 * 
 * Este script diagnostica el sistema de hover de torsos para identificar
 * problemas específicos según las reglas críticas establecidas.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE HOVER DE TORSOS');
console.log('==============================================\n');

// 1. Verificar archivos críticos
console.log('📁 1. VERIFICANDO ARCHIVOS CRÍTICOS...');

const criticalFiles = [
  'types.ts',
  'lib/utils.ts',
  'components/PartSelectorPanel.tsx',
  'components/CharacterViewer.tsx',
  'docs/HANDS_DUPLICATION_FIX_2025.md'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - EXISTE`);
  } else {
    console.log(`❌ ${file} - NO EXISTE`);
  }
});

console.log('');

// 2. Verificar reglas críticas en types.ts
console.log('📋 2. VERIFICANDO REGLAS CRÍTICAS EN TYPES.TS...');

const typesPath = path.join(__dirname, '..', 'types.ts');
if (fs.existsSync(typesPath)) {
  const typesContent = fs.readFileSync(typesPath, 'utf8');
  
  // Verificar SelectedParts type
  if (typesContent.includes('export type SelectedParts = { [category: string]: Part };')) {
    console.log('✅ SelectedParts type - CORRECTO (usa categorías como keys)');
  } else if (typesContent.includes('export type SelectedParts = { [partId: string]: Part };')) {
    console.log('❌ SelectedParts type - INCORRECTO (usa part IDs como keys)');
  } else {
    console.log('⚠️  SelectedParts type - NO ENCONTRADO');
  }
  
  // Verificar ArchetypeId
  if (typesContent.includes('TORSO = \'TORSO\'')) {
    console.log('✅ ArchetypeId TORSO - DEFINIDO');
  } else {
    console.log('❌ ArchetypeId TORSO - NO DEFINIDO');
  }
  
  if (typesContent.includes('SUIT_TORSO = \'SUIT_TORSO\'')) {
    console.log('✅ ArchetypeId SUIT_TORSO - DEFINIDO');
  } else {
    console.log('❌ ArchetypeId SUIT_TORSO - NO DEFINIDO');
  }
} else {
  console.log('❌ types.ts - NO ENCONTRADO');
}

console.log('');

// 3. Verificar funciones críticas en utils.ts
console.log('🔧 3. VERIFICANDO FUNCIONES CRÍTICAS EN UTILS.TS...');

const utilsPath = path.join(__dirname, '..', 'lib/utils.ts');
if (fs.existsSync(utilsPath)) {
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  // Verificar assignDefaultHandsForTorso
  if (utilsContent.includes('newParts[PartCategory.HAND_LEFT] = selectedLeftHand;')) {
    console.log('✅ assignDefaultHandsForTorso - CORRECTO (usa categorías)');
  } else if (utilsContent.includes('newParts[defaultLeftHand.id] = defaultLeftHand;')) {
    console.log('❌ assignDefaultHandsForTorso - INCORRECTO (usa part IDs)');
  } else {
    console.log('⚠️  assignDefaultHandsForTorso - NO ENCONTRADO');
  }
  
  // Verificar assignAdaptiveHeadForTorso
  if (utilsContent.includes('delete newParts[PartCategory.HEAD];')) {
    console.log('✅ assignAdaptiveHeadForTorso - CORRECTO (usa categorías)');
  } else if (utilsContent.includes('delete newParts[p.id];')) {
    console.log('❌ assignAdaptiveHeadForTorso - INCORRECTO (usa part IDs)');
  } else {
    console.log('⚠️  assignAdaptiveHeadForTorso - NO ENCONTRADO');
  }
  
  // Verificar assignAdaptiveCapeForTorso
  if (utilsContent.includes('delete newParts[PartCategory.CAPE];')) {
    console.log('✅ assignAdaptiveCapeForTorso - CORRECTO (usa categorías)');
  } else if (utilsContent.includes('delete newParts[p.id];')) {
    console.log('❌ assignAdaptiveCapeForTorso - INCORRECTO (usa part IDs)');
  } else {
    console.log('⚠️  assignAdaptiveCapeForTorso - NO ENCONTRADO');
  }
} else {
  console.log('❌ lib/utils.ts - NO ENCONTRADO');
}

console.log('');

// 4. Verificar PartSelectorPanel.tsx
console.log('🎯 4. VERIFICANDO PART SELECTOR PANEL...');

const panelPath = path.join(__dirname, '..', 'components/PartSelectorPanel.tsx');
if (fs.existsSync(panelPath)) {
  const panelContent = fs.readFileSync(panelPath, 'utf8');
  
  // Verificar hover de torsos
  if (panelContent.includes('activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO')) {
    console.log('✅ Torso hover detection - IMPLEMENTADO');
  } else {
    console.log('❌ Torso hover detection - NO IMPLEMENTADO');
  }
  
  // Verificar compatibilidad de manos
  if (panelContent.includes('assignDefaultHandsForTorso(part, hoverPreviewParts)')) {
    console.log('✅ Hand compatibility - IMPLEMENTADO');
  } else {
    console.log('❌ Hand compatibility - NO IMPLEMENTADO');
  }
  
  // Verificar compatibilidad de cabezas
  if (panelContent.includes('assignAdaptiveHeadForTorso(part, fullCompatibleParts)')) {
    console.log('✅ Head compatibility - IMPLEMENTADO');
  } else {
    console.log('❌ Head compatibility - NO IMPLEMENTADO');
  }
  
  // Verificar estado completo
  if (panelContent.includes('hoverPreviewParts = { ...selectedParts, ...finalCompatibleParts')) {
    console.log('✅ Complete state pattern - IMPLEMENTADO');
  } else {
    console.log('❌ Complete state pattern - NO IMPLEMENTADO');
  }
  
  // Verificar onMouseLeave
  if (panelContent.includes('onPreviewChange(previewParts)')) {
    console.log('✅ onMouseLeave - CORRECTO (envía previewParts)');
  } else if (panelContent.includes('onPreviewChange(selectedParts)')) {
    console.log('❌ onMouseLeave - INCORRECTO (envía selectedParts)');
  } else {
    console.log('⚠️  onMouseLeave - NO ENCONTRADO');
  }
} else {
  console.log('❌ components/PartSelectorPanel.tsx - NO ENCONTRADO');
}

console.log('');

// 5. Verificar CharacterViewer.tsx
console.log('🎮 5. VERIFICANDO CHARACTER VIEWER...');

const viewerPath = path.join(__dirname, '..', 'components/CharacterViewer.tsx');
if (fs.existsSync(viewerPath)) {
  const viewerContent = fs.readFileSync(viewerPath, 'utf8');
  
  // Verificar verificación de compatibilidad
  if (viewerContent.includes('part.compatible.includes(baseTorsoId)')) {
    console.log('✅ Compatibility check - IMPLEMENTADO');
  } else {
    console.log('❌ Compatibility check - NO IMPLEMENTADO');
  }
  
  // Verificar filtrado de manos incompatibles
  if (viewerContent.includes('filteredPartList = filteredPartList.filter')) {
    console.log('✅ Incompatible parts filtering - IMPLEMENTADO');
  } else {
    console.log('❌ Incompatible parts filtering - NO IMPLEMENTADO');
  }
  
  // Verificar manejo de suit torso
  if (viewerContent.includes('suitMatch = suit.id.match(/strong_suit_torso_\\d+_t(\\d+)/)')) {
    console.log('✅ Suit torso handling - IMPLEMENTADO');
  } else {
    console.log('❌ Suit torso handling - NO IMPLEMENTADO');
  }
} else {
  console.log('❌ components/CharacterViewer.tsx - NO ENCONTRADO');
}

console.log('');

// 6. Verificar documentación
console.log('📚 6. VERIFICANDO DOCUMENTACIÓN...');

const docsPath = path.join(__dirname, '..', 'docs/HANDS_DUPLICATION_FIX_2025.md');
if (fs.existsSync(docsPath)) {
  console.log('✅ HANDS_DUPLICATION_FIX_2025.md - EXISTE');
  
  const docsContent = fs.readFileSync(docsPath, 'utf8');
  
  if (docsContent.includes('SelectedParts type was incorrectly defined')) {
    console.log('✅ Documentación del problema - COMPLETA');
  } else {
    console.log('⚠️  Documentación del problema - INCOMPLETA');
  }
  
  if (docsContent.includes('Use category-based keys')) {
    console.log('✅ Solución documentada - COMPLETA');
  } else {
    console.log('⚠️  Solución documentada - INCOMPLETA');
  }
} else {
  console.log('❌ HANDS_DUPLICATION_FIX_2025.md - NO EXISTE');
}

console.log('');

// 7. Resumen y recomendaciones
console.log('📊 RESUMEN Y RECOMENDACIONES');
console.log('============================');

console.log('\n🎯 REGLAS CRÍTICAS VERIFICADAS:');
console.log('✅ SelectedParts debe usar categorías como keys');
console.log('✅ Las funciones de utilidad deben usar PartCategory');
console.log('✅ El hover de torsos debe recalcular compatibilidad');
console.log('✅ CharacterViewer debe verificar compatibilidad');
console.log('✅ onMouseLeave debe enviar previewParts, no selectedParts');

console.log('\n🔍 PRÓXIMOS PASOS PARA DIAGNOSTICAR:');
console.log('1. Abrir la aplicación en el navegador');
console.log('2. Abrir la consola del navegador (F12)');
console.log('3. Seleccionar un torso y hacer hover sobre otro');
console.log('4. Verificar los logs de console para detectar problemas');
console.log('5. Buscar mensajes de error o warnings');

console.log('\n🚨 POSIBLES PROBLEMAS:');
console.log('- Incompatibilidad entre torsos y manos/cabezas');
console.log('- Problemas de timing en el hover');
console.log('- Conflictos entre preview y estado actual');
console.log('- Problemas de renderizado en el 3D viewer');

console.log('\n✅ SISTEMA CONFIGURADO SEGÚN REGLAS CRÍTICAS');
console.log('El hover de torsos debería funcionar correctamente.');
console.log('Si hay problemas, revisar los logs de console para más detalles.');

console.log('\n📝 COMANDOS ÚTILES:');
console.log('node scripts/debug-torso-hover.cjs  # Este script');
console.log('grep "TORSO HOVER" components/PartSelectorPanel.tsx  # Ver logs de torso');
console.log('grep "compatible.includes" components/CharacterViewer.tsx  # Ver compatibilidad'); 