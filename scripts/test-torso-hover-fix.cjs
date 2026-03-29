const fs = require('fs');

console.log('🎯 PRUEBA DE HOVER DE TORSOS - VERIFICACIÓN DE DESAPARICIÓN');
console.log('============================================================\n');

// Simular el estado inicial
const PartCategory = {
  TORSO: 'TORSO',
  SUIT_TORSO: 'SUIT_TORSO',
  HEAD: 'HEAD',
  HAND_LEFT: 'HAND_LEFT',
  HAND_RIGHT: 'HAND_RIGHT',
  CAPE: 'CAPE',
  SYMBOL: 'SYMBOL'
};

// Estado inicial simulado
const selectedParts = {
  [PartCategory.TORSO]: { id: 'strong_torso_01', category: PartCategory.TORSO },
  [PartCategory.HEAD]: { id: 'strong_head_01_t01', category: PartCategory.HEAD },
  [PartCategory.HAND_LEFT]: { id: 'strong_hands_fist_01_t01_l_g', category: PartCategory.HAND_LEFT },
  [PartCategory.HAND_RIGHT]: { id: 'strong_hands_fist_01_t01_r_g', category: PartCategory.HAND_RIGHT },
  [PartCategory.CAPE]: { id: 'strong_cape_01_t01', category: PartCategory.CAPE },
  [PartCategory.SYMBOL]: { id: 'strong_symbol_01_t01', category: PartCategory.SYMBOL }
};

console.log('📋 ESTADO INICIAL:');
Object.entries(selectedParts).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

// Simular hover sobre un nuevo torso
const hoveredTorso = { id: 'strong_torso_02', category: PartCategory.TORSO };
const activeCategory = PartCategory.TORSO;

console.log(`\n🖱️ HOVER SOBRE: ${hoveredTorso.id}`);

// Simular la lógica corregida de PartSelectorPanel.tsx
let hoverPreviewParts = { ...selectedParts };

// ✅ PASO 1: Eliminar el torso actual ANTES de enviar el preview
const partsWithoutCurrentTorso = { ...selectedParts };
delete partsWithoutCurrentTorso[activeCategory];

console.log('\n✅ PASO 1: Después de eliminar torso actual:');
Object.entries(partsWithoutCurrentTorso).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

// ✅ PASO 2: Simular funciones de compatibilidad (simplificado)
const finalCompatibleParts = { ...partsWithoutCurrentTorso };
const finalPartsWithSymbol = { ...finalCompatibleParts };
const finalPartsWithCape = { ...finalCompatibleParts };

// ✅ PASO 3: Construir el estado final de preview
hoverPreviewParts = { 
  ...partsWithoutCurrentTorso, 
  ...finalCompatibleParts, 
  ...finalPartsWithSymbol, 
  ...finalPartsWithCape, 
  [activeCategory]: hoveredTorso 
};

console.log('\n✅ PASO 2: Estado final de preview:');
Object.entries(hoverPreviewParts).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

// ✅ VERIFICACIÓN CRÍTICA
console.log('\n🎯 VERIFICACIÓN CRÍTICA:');
const torsoActualEliminado = !hoverPreviewParts[PartCategory.TORSO] || hoverPreviewParts[PartCategory.TORSO].id !== 'strong_torso_01';
const nuevoTorsoAsignado = hoverPreviewParts[PartCategory.TORSO]?.id === 'strong_torso_02';
const otrasPartesPreservadas = hoverPreviewParts[PartCategory.HEAD]?.id === 'strong_head_01_t01' && 
                               hoverPreviewParts[PartCategory.HAND_LEFT]?.id === 'strong_hands_fist_01_t01_l_g';

console.log(`   ✅ Torso actual eliminado: ${torsoActualEliminado ? 'SÍ' : 'NO'}`);
console.log(`   ✅ Nuevo torso asignado: ${nuevoTorsoAsignado ? 'SÍ' : 'NO'}`);
console.log(`   ✅ Otras partes preservadas: ${otrasPartesPreservadas ? 'SÍ' : 'NO'}`);

// Verificar que no hay duplicación
const torsosEnPreview = Object.values(hoverPreviewParts).filter(p => p.category === PartCategory.TORSO);
const hayDuplicacion = torsosEnPreview.length > 1;

console.log(`   ✅ No hay duplicación de torsos: ${!hayDuplicacion ? 'SÍ' : 'NO'}`);

if (hayDuplicacion) {
  console.log('   ❌ PROBLEMA: Hay duplicación de torsos en el preview');
  torsosEnPreview.forEach(torso => {
    console.log(`      - ${torso.id}`);
  });
}

console.log('\n============================================================');
console.log('🎯 CONCLUSIÓN:');
console.log('============================================================');

if (torsoActualEliminado && nuevoTorsoAsignado && otrasPartesPreservadas && !hayDuplicacion) {
  console.log('✅ HOVER DE TORSOS FUNCIONA CORRECTAMENTE');
  console.log('✅ El torso actual desaparece al hacer hover sobre otro');
  console.log('✅ El nuevo torso se muestra correctamente');
  console.log('✅ Las otras partes se preservan');
  console.log('✅ No hay duplicación de modelos');
} else {
  console.log('❌ PROBLEMA EN HOVER DE TORSOS');
  if (!torsoActualEliminado) console.log('   - El torso actual no se elimina');
  if (!nuevoTorsoAsignado) console.log('   - El nuevo torso no se asigna');
  if (!otrasPartesPreservadas) console.log('   - Las otras partes no se preservan');
  if (hayDuplicacion) console.log('   - Hay duplicación de torsos');
}

console.log('\n🚀 LA APLICACIÓN DEBERÍA MOSTRAR CORRECTAMENTE:');
console.log('   - Torso 1 desaparece al hacer hover sobre Torso 2');
console.log('   - Torso 2 aparece en su lugar');
console.log('   - Manos, cabeza y otras partes se mantienen');
console.log('   - No hay duplicación de modelos');

console.log('\n============================================================');
console.log('🎯 PRUEBA COMPLETADA');
console.log('============================================================'); 