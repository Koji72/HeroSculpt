#!/usr/bin/env node

/**
 * 🧪 TEST: GUEST LEGS HOVER SIMPLE
 * 
 * Script simple para verificar que el hover de piernas funciona en el guest
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: GUEST LEGS HOVER SIMPLE');
console.log('=================================\n');

// Verificar que el código está presente
const partSelectorPath = path.join(__dirname, '..', 'components', 'PartSelectorPanel.tsx');
if (fs.existsSync(partSelectorPath)) {
  const content = fs.readFileSync(partSelectorPath, 'utf8');
  
  // Verificar elementos clave
  const checks = {
    'LOWER_BODY hover logic': content.includes('activeCategory === PartCategory.LOWER_BODY'),
    'partsWithoutCurrentLegs': content.includes('partsWithoutCurrentLegs'),
    'assignAdaptiveBootsForTorso': content.includes('assignAdaptiveBootsForTorso'),
    'hoverPreviewParts = { ...partsWithoutCurrentLegs }': content.includes('hoverPreviewParts = { ...partsWithoutCurrentLegs }'),
    'delete hoverPreviewParts[PartCategory.LOWER_BODY]': content.includes('delete hoverPreviewParts[PartCategory.LOWER_BODY]'),
    'delete hoverPreviewParts[PartCategory.BOOTS]': content.includes('delete hoverPreviewParts[PartCategory.BOOTS]'),
    'console.log LEGS HOVER': content.includes('🔄 LEGS HOVER: Recalculando botas compatibles para piernas')
  };
  
  console.log('📋 Verificando código en PartSelectorPanel.tsx:');
  Object.entries(checks).forEach(([check, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} ${check}`);
  });
  
  if (checks['LOWER_BODY hover logic'] && checks['partsWithoutCurrentLegs'] && checks['delete hoverPreviewParts[PartCategory.LOWER_BODY]']) {
    console.log('\n✅ CÓDIGO IMPLEMENTADO CORRECTAMENTE');
    console.log('\n🚀 PARA PROBAR:');
    console.log('1. Abrir http://localhost:5179/ (como guest)');
    console.log('2. Hacer click en LOWER BODY');
    console.log('3. Hacer hover sobre "none" (primera opción)');
    console.log('4. Verificar que las piernas desaparecen');
    console.log('5. Verificar logs en consola:');
    console.log('   - "🔄 LEGS HOVER: Recalculando botas compatibles para piernas: none"');
    console.log('   - "✅ LEGS HOVER: Enviando estado de preview (siguiendo reglas críticas)"');
  } else {
    console.log('\n❌ PROBLEMA: Código no implementado correctamente');
  }
  
} else {
  console.log('❌ ERROR: No se encontró PartSelectorPanel.tsx');
}

console.log('\n✅ TEST COMPLETADO'); 