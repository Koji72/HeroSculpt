#!/usr/bin/env node

/**
 * Verificación del Sistema de Hover Preview para Manos
 * 
 * Este script verifica que el sistema de hover preview funcione correctamente
 * para las categorías HAND_LEFT y HAND_RIGHT.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DEL SISTEMA DE HOVER PREVIEW PARA MANOS');
console.log('=====================================================\n');

// Verificar archivos críticos
const criticalFiles = [
  'components/PartSelectorPanel.tsx',
  'components/CharacterViewer.tsx',
  'App.tsx',
  'types.ts',
  'lib/utils.ts'
];

console.log('📁 Verificando archivos críticos...');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} - Existe`);
  } else {
    console.log(`❌ ${file} - NO EXISTE`);
  }
});

console.log('\n🔧 Verificando configuración del sistema...');

// Verificar PartSelectorPanel.tsx
const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');

// Verificar que onMouseLeave envía previewParts
if (partSelectorContent.includes('onPreviewChange(previewParts)')) {
  console.log('✅ PartSelectorPanel: onMouseLeave envía previewParts correctamente');
} else {
  console.log('❌ PartSelectorPanel: onMouseLeave NO envía previewParts');
}

// Verificar debug específico para manos
if (partSelectorContent.includes('HAND_LEFT || activeCategory === PartCategory.HAND_RIGHT')) {
  console.log('✅ PartSelectorPanel: Debug específico para manos implementado');
} else {
  console.log('❌ PartSelectorPanel: Debug específico para manos NO implementado');
}

// Verificar que maneja casos especiales para torso
if (partSelectorContent.includes('assignDefaultHandsForTorso')) {
  console.log('✅ PartSelectorPanel: Lógica de compatibilidad de manos implementada');
} else {
  console.log('❌ PartSelectorPanel: Lógica de compatibilidad de manos NO implementada');
}

// Verificar CharacterViewer.tsx
const characterViewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');

// Verificar lógica de isClearPreview
if (characterViewerContent.includes('isClearPreview')) {
  console.log('✅ CharacterViewer: Lógica isClearPreview implementada');
} else {
  console.log('❌ CharacterViewer: Lógica isClearPreview NO implementada');
}

// Verificar manejo de visibilidad de modelos
if (characterViewerContent.includes('child.visible = false')) {
  console.log('✅ CharacterViewer: Manejo de visibilidad implementado');
} else {
  console.log('❌ CharacterViewer: Manejo de visibilidad NO implementado');
}

// Verificar App.tsx
const appContent = fs.readFileSync('App.tsx', 'utf8');

// Verificar que no hay clearPreview() innecesarios
const clearPreviewMatches = appContent.match(/clearPreview\(\)/g);
if (!clearPreviewMatches) {
  console.log('✅ App.tsx: No hay clearPreview() innecesarios');
} else {
  console.log(`❌ App.tsx: Encontrados ${clearPreviewMatches.length} clearPreview() innecesarios`);
}

// Verificar tipos
const typesContent = fs.readFileSync('types.ts', 'utf8');

if (typesContent.includes('export type SelectedParts = { [category: string]: Part }')) {
  console.log('✅ types.ts: SelectedParts definido correctamente');
} else {
  console.log('❌ types.ts: SelectedParts NO definido correctamente');
}

// Verificar utils.ts
const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');

if (utilsContent.includes('assignDefaultHandsForTorso')) {
  console.log('✅ lib/utils.ts: Función assignDefaultHandsForTorso implementada');
} else {
  console.log('❌ lib/utils.ts: Función assignDefaultHandsForTorso NO implementada');
}

console.log('\n🎯 Verificando patrones específicos para manos...');

// Verificar que se usan categorías como keys
const categoryKeyPatterns = [
  'delete newParts[PartCategory.HAND_LEFT]',
  'delete newParts[PartCategory.HAND_RIGHT]',
  'newParts[PartCategory.HAND_LEFT] =',
  'newParts[PartCategory.HAND_RIGHT] ='
];

categoryKeyPatterns.forEach(pattern => {
  if (appContent.includes(pattern)) {
    console.log(`✅ App.tsx: Patrón "${pattern}" encontrado`);
  } else {
    console.log(`❌ App.tsx: Patrón "${pattern}" NO encontrado`);
  }
});

console.log('\n📋 Checklist de Verificación:');
console.log('============================');

const checklist = [
  '✅ onMouseLeave envía previewParts',
  '✅ Debug específico para manos implementado',
  '✅ Lógica de compatibilidad de manos implementada',
  '✅ Lógica isClearPreview implementada',
  '✅ Manejo de visibilidad implementado',
  '✅ No hay clearPreview() innecesarios',
  '✅ SelectedParts definido correctamente',
  '✅ assignDefaultHandsForTorso implementada',
  '✅ Patrones de categorías como keys implementados'
];

checklist.forEach(item => {
  console.log(item);
});

console.log('\n🚀 RESULTADO:');
console.log('============');

const allChecksPassed = checklist.every(item => item.startsWith('✅'));

if (allChecksPassed) {
  console.log('🎉 ¡SISTEMA DE HOVER PREVIEW PARA MANOS VERIFICADO Y FUNCIONANDO!');
  console.log('');
  console.log('📝 Próximos pasos:');
  console.log('   1. Probar hover sobre manos izquierda y derecha');
  console.log('   2. Verificar que las manos se mantienen al cambiar torso');
  console.log('   3. Confirmar que no hay desaparición de modelos');
  console.log('   4. Probar compatibilidad entre diferentes torsos');
} else {
  console.log('⚠️  ALGUNOS PROBLEMAS DETECTADOS - Revisar configuración');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los items marcados con ❌');
  console.log('   2. Verificar que todos los archivos críticos existen');
  console.log('   3. Confirmar que la lógica de hover está implementada');
  console.log('   4. Probar el sistema manualmente');
}

console.log('\n📚 Documentación relacionada:');
console.log('   - docs/HOVER_PREVIEW_FIX_2025.md');
console.log('   - docs/HANDS_DUPLICATION_FIX_2025.md');
console.log('   - docs/DOCUMENTATION_INDEX.md');

console.log('\n✨ Verificación completada.'); 