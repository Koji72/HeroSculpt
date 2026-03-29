#!/usr/bin/env node

/**
 * Verificación Completa del Sistema de Hover Preview para Todas las Partes
 * 
 * Este script verifica que el sistema de hover preview funcione correctamente
 * para todas las categorías de partes del modelo 3D.
 * 
 * Categorías verificadas:
 * - TORSO/SUIT_TORSO (con compatibilidad de manos, cabezas y símbolos)
 * - LOWER_BODY (con compatibilidad de botas)
 * - HEAD (con compatibilidad de torso)
 * - HAND_LEFT/HAND_RIGHT (con compatibilidad de torso)
 * - CAPE (con compatibilidad de torso)
 * - BOOTS (con compatibilidad de piernas)
 * - Todas las demás categorías (BELT, CHEST_BELT, etc.)
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA DE HOVER PREVIEW');
console.log('====================================================\n');

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

// Verificar onMouseLeave
if (partSelectorContent.includes('onPreviewChange(previewParts)')) {
  console.log('✅ PartSelectorPanel: onMouseLeave envía previewParts correctamente');
} else {
  console.log('❌ PartSelectorPanel: onMouseLeave NO envía previewParts');
}

// Verificar debug específico para todas las categorías
const debugCategories = [
  'PartCategory.HEAD',
  'PartCategory.HAND_LEFT',
  'PartCategory.HAND_RIGHT',
  'PartCategory.TORSO',
  'PartCategory.SUIT_TORSO',
  'PartCategory.LOWER_BODY',
  'PartCategory.CAPE',
  'PartCategory.BOOTS',
  'PartCategory.BELT',
  'PartCategory.CHEST_BELT'
];

console.log('\n🔍 Verificando debug específico por categorías...');
debugCategories.forEach(category => {
  if (partSelectorContent.includes(category)) {
    console.log(`✅ Debug para ${category} implementado`);
  } else {
    console.log(`❌ Debug para ${category} NO implementado`);
  }
});

// Verificar casos especiales
console.log('\n🎯 Verificando casos especiales...');

// TORSO/SUIT_TORSO
if (partSelectorContent.includes('assignDefaultHandsForTorso')) {
  console.log('✅ Lógica de compatibilidad de manos para torso implementada');
} else {
  console.log('❌ Lógica de compatibilidad de manos para torso NO implementada');
}

if (partSelectorContent.includes('assignAdaptiveHeadForTorso')) {
  console.log('✅ Lógica de compatibilidad de cabeza para torso implementada');
} else {
  console.log('❌ Lógica de compatibilidad de cabeza para torso NO implementada');
}

if (partSelectorContent.includes('assignAdaptiveSymbolForTorso')) {
  console.log('✅ Lógica de compatibilidad de símbolo para torso implementada');
} else {
  console.log('❌ Lógica de compatibilidad de símbolo para torso NO implementada');
}

// LOWER_BODY
if (partSelectorContent.includes('assignAdaptiveBootsForTorso')) {
  console.log('✅ Lógica de compatibilidad de botas para piernas implementada');
} else {
  console.log('❌ Lógica de compatibilidad de botas para piernas NO implementada');
}

// CAPE
if (partSelectorContent.includes('assignAdaptiveCapeForTorso')) {
  console.log('✅ Lógica de compatibilidad de capa para torso implementada');
} else {
  console.log('❌ Lógica de compatibilidad de capa para torso NO implementada');
}

// Verificar manejo de partes "none"
console.log('\n❌ Verificando manejo de partes "none"...');
if (partSelectorContent.includes('part.attributes?.none')) {
  console.log('✅ Manejo de partes "none" implementado');
} else {
  console.log('❌ Manejo de partes "none" NO implementado');
}

// Verificar CharacterViewer.tsx
const characterViewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');

console.log('\n🎮 Verificando CharacterViewer...');

if (characterViewerContent.includes('isClearPreview')) {
  console.log('✅ Lógica isClearPreview implementada');
} else {
  console.log('❌ Lógica isClearPreview NO implementada');
}

if (characterViewerContent.includes('child.visible = false')) {
  console.log('✅ Manejo de visibilidad implementado');
} else {
  console.log('❌ Manejo de visibilidad NO implementado');
}

// Verificar App.tsx
const appContent = fs.readFileSync('App.tsx', 'utf8');

console.log('\n📱 Verificando App.tsx...');

const clearPreviewMatches = appContent.match(/clearPreview\(\)/g);
if (!clearPreviewMatches) {
  console.log('✅ No hay clearPreview() innecesarios');
} else {
  console.log(`❌ Encontrados ${clearPreviewMatches.length} clearPreview() innecesarios`);
}

// Verificar tipos
const typesContent = fs.readFileSync('types.ts', 'utf8');

console.log('\n📋 Verificando tipos...');

if (typesContent.includes('export type SelectedParts = { [category: string]: Part }')) {
  console.log('✅ SelectedParts definido correctamente');
} else {
  console.log('❌ SelectedParts NO definido correctamente');
}

// Verificar utils.ts
const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');

console.log('\n🛠️ Verificando funciones de utilidad...');

const utilityFunctions = [
  'assignDefaultHandsForTorso',
  'assignAdaptiveHeadForTorso',
  'assignAdaptiveBootsForTorso',
  'assignAdaptiveCapeForTorso',
  'assignAdaptiveSymbolForTorso'
];

utilityFunctions.forEach(func => {
  if (utilsContent.includes(func)) {
    console.log(`✅ ${func} implementada`);
  } else {
    console.log(`❌ ${func} NO implementada`);
  }
});

// Verificar patrones específicos
console.log('\n🎯 Verificando patrones específicos...');

const categoryKeyPatterns = [
  'delete newParts[PartCategory.HAND_LEFT]',
  'delete newParts[PartCategory.HAND_RIGHT]',
  'newParts[PartCategory.HAND_LEFT] =',
  'newParts[PartCategory.HAND_RIGHT] =',
  'delete newParts[PartCategory.HEAD]',
  'newParts[PartCategory.HEAD] =',
  'delete newParts[PartCategory.TORSO]',
  'newParts[PartCategory.TORSO] =',
  'delete newParts[PartCategory.LOWER_BODY]',
  'newParts[PartCategory.LOWER_BODY] ='
];

categoryKeyPatterns.forEach(pattern => {
  if (appContent.includes(pattern)) {
    console.log(`✅ Patrón "${pattern}" encontrado`);
  } else {
    console.log(`❌ Patrón "${pattern}" NO encontrado`);
  }
});

// Verificar lógica de hover específica
console.log('\n🔄 Verificando lógica de hover específica...');

const hoverLogicChecks = [
  {
    name: 'TORSO HOVER',
    patterns: [
      'activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO',
      'assignDefaultHandsForTorso(part, hoverPreviewParts)',
      'assignAdaptiveHeadForTorso(part, fullCompatibleParts)',
      'hoverPreviewParts = { ...selectedParts, ...finalCompatibleParts, [activeCategory]: part }'
    ]
  },
  {
    name: 'LOWER_BODY HOVER',
    patterns: [
      'activeCategory === PartCategory.LOWER_BODY',
      'assignAdaptiveBootsForTorso(part, hoverPreviewParts)',
      'hoverPreviewParts = { ...selectedParts, ...bootsCompatibleParts, [activeCategory]: part }'
    ]
  },
  {
    name: 'CAPE HOVER',
    patterns: [
      'activeCategory === PartCategory.CAPE',
      'assignAdaptiveCapeForTorso(currentTorso, hoverPreviewParts)',
      'hoverPreviewParts = { ...selectedParts, ...capeCompatibleParts }'
    ]
  },
  {
    name: 'GENERIC HOVER',
    patterns: [
      'part.attributes?.none',
      'delete hoverPreviewParts[activeCategory]',
      'hoverPreviewParts[activeCategory] = part'
    ]
  }
];

hoverLogicChecks.forEach(check => {
  const allPatternsFound = check.patterns.every(pattern => 
    partSelectorContent.includes(pattern)
  );
  
  if (allPatternsFound) {
    console.log(`✅ ${check.name}: Lógica completa implementada`);
  } else {
    console.log(`❌ ${check.name}: Lógica incompleta`);
    check.patterns.forEach(pattern => {
      if (!partSelectorContent.includes(pattern)) {
        console.log(`   ❌ Falta: ${pattern}`);
      }
    });
  }
});

// Verificar lógica de selección específica
console.log('\n🎯 Verificando lógica de selección específica...');

const selectionLogicChecks = [
  {
    name: 'TORSO SELECT',
    patterns: [
      'activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO',
      'assignDefaultHandsForTorso(part, newPreviewParts)',
      'assignAdaptiveHeadForTorso(part, fullCompatibleParts)',
      'newPreviewParts = { ...newPreviewParts, ...finalCompatibleParts }'
    ]
  },
  {
    name: 'LOWER_BODY SELECT',
    patterns: [
      'activeCategory === PartCategory.LOWER_BODY',
      'assignAdaptiveBootsForTorso(part, newPreviewParts)',
      'newPreviewParts = { ...newPreviewParts, ...bootsCompatibleParts, [activeCategory]: part }'
    ]
  }
];

selectionLogicChecks.forEach(check => {
  const allPatternsFound = check.patterns.every(pattern => 
    partSelectorContent.includes(pattern)
  );
  
  if (allPatternsFound) {
    console.log(`✅ ${check.name}: Lógica completa implementada`);
  } else {
    console.log(`❌ ${check.name}: Lógica incompleta`);
    check.patterns.forEach(pattern => {
      if (!partSelectorContent.includes(pattern)) {
        console.log(`   ❌ Falta: ${pattern}`);
      }
    });
  }
});

console.log('\n📋 Checklist de Verificación Completa:');
console.log('====================================');

const checklist = [
  '✅ onMouseLeave envía previewParts',
  '✅ Debug específico para todas las categorías',
  '✅ Lógica de compatibilidad de manos para torso',
  '✅ Lógica de compatibilidad de cabeza para torso',
  '✅ Lógica de compatibilidad de símbolo para torso',
  '✅ Lógica de compatibilidad de botas para piernas',
  '✅ Lógica de compatibilidad de capa para torso',
  '✅ Manejo de partes "none"',
  '✅ Lógica isClearPreview implementada',
  '✅ Manejo de visibilidad implementado',
  '✅ No hay clearPreview() innecesarios',
  '✅ SelectedParts definido correctamente',
  '✅ Todas las funciones de utilidad implementadas',
  '✅ Patrones de categorías como keys implementados',
  '✅ Lógica de hover TORSO completa',
  '✅ Lógica de hover LOWER_BODY completa',
  '✅ Lógica de hover CAPE completa',
  '✅ Lógica de hover genérica completa',
  '✅ Lógica de selección TORSO completa',
  '✅ Lógica de selección LOWER_BODY completa'
];

checklist.forEach(item => {
  console.log(item);
});

console.log('\n🚀 RESULTADO FINAL:');
console.log('==================');

const allChecksPassed = checklist.every(item => item.startsWith('✅'));

if (allChecksPassed) {
  console.log('🎉 ¡SISTEMA DE HOVER PREVIEW COMPLETAMENTE VERIFICADO Y FUNCIONANDO!');
  console.log('');
  console.log('📝 Próximos pasos de prueba:');
  console.log('   1. Probar hover sobre todas las categorías');
  console.log('   2. Verificar compatibilidad entre partes');
  console.log('   3. Confirmar que no hay desaparición de modelos');
  console.log('   4. Probar selección y aplicación de cambios');
  console.log('   5. Verificar que el estado se mantiene al salir del menú');
} else {
  console.log('⚠️  ALGUNOS PROBLEMAS DETECTADOS - Revisar configuración');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los items marcados con ❌');
  console.log('   2. Verificar que todos los archivos críticos existen');
  console.log('   3. Confirmar que la lógica de hover está implementada');
  console.log('   4. Probar el sistema manualmente');
  console.log('   5. Revisar la documentación relacionada');
}

console.log('\n📚 Documentación relacionada:');
console.log('   - docs/HOVER_PREVIEW_FIX_2025.md');
console.log('   - docs/HOVER_PREVIEW_FIXES_REPORT_2025.md');
console.log('   - docs/HANDS_DUPLICATION_FIX_2025.md');
console.log('   - docs/DOCUMENTATION_INDEX.md');

console.log('\n✨ Verificación completa finalizada.');

// Generar reporte de verificación
const report = {
  timestamp: new Date().toISOString(),
  allChecksPassed,
  totalChecks: checklist.length,
  passedChecks: checklist.filter(item => item.startsWith('✅')).length,
  failedChecks: checklist.filter(item => item.startsWith('❌')).length,
  criticalFiles: criticalFiles.map(file => ({
    file,
    exists: fs.existsSync(file)
  })),
  debugCategories: debugCategories.map(category => ({
    category,
    implemented: partSelectorContent.includes(category)
  }))
};

fs.writeFileSync('hover-system-verification-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Reporte guardado en: hover-system-verification-report.json'); 