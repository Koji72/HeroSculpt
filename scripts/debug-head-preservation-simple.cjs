#!/usr/bin/env node

console.log('🔍 DIAGNÓSTICO SIMPLE: PRESERVACIÓN DE CABEZA');
console.log('=============================================\n');

// Simular datos de prueba
const ALL_PARTS = [
  // Torsos
  { id: 'strong_torso_01', category: 'TORSO', archetype: 'STRONG', compatible: [] },
  { id: 'strong_torso_02', category: 'TORSO', archetype: 'STRONG', compatible: [] },
  { id: 'strong_torso_03', category: 'TORSO', archetype: 'STRONG', compatible: [] },
  
  // Cabezas tipo 01
  { id: 'strong_head_01_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  { id: 'strong_head_01_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
  { id: 'strong_head_01_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] },
  
  // Cabezas tipo 02
  { id: 'strong_head_02_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  { id: 'strong_head_02_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
  { id: 'strong_head_02_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] },
  
  // Cabezas tipo 03
  { id: 'strong_head_03_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  { id: 'strong_head_03_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
  { id: 'strong_head_03_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] },
  
  // Cabezas tipo 04
  { id: 'strong_head_04_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  { id: 'strong_head_04_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
  { id: 'strong_head_04_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] }
];

// Función simulada de assignAdaptiveHeadForTorso
function assignAdaptiveHeadForTorso(newTorso, currentParts) {
  console.log('🔍 assignAdaptiveHeadForTorso called with:', { 
    newTorsoId: newTorso.id, 
    currentParts: Object.keys(currentParts)
  });
  
  let newParts = { ...currentParts };
  
  const currentHead = Object.values(currentParts).find(p => p.category === 'HEAD');
  console.log('🔍 Current head found:', currentHead?.id || 'none');
  
  if (!currentHead) {
    const compatibleHeads = ALL_PARTS.filter(p => 
      p.category === 'HEAD' && 
      p.archetype === newTorso.archetype &&
      p.compatible.includes(newTorso.id)
    );
    
    if (compatibleHeads.length > 0) {
      console.log('📌 No current head, using first compatible:', compatibleHeads[0].id);
      newParts.HEAD = compatibleHeads[0];
    }
    return newParts;
  }
  
  const isCurrentHeadCompatible = currentHead.compatible.includes(newTorso.id);
  
  if (isCurrentHeadCompatible) {
    console.log('✅ Current head is compatible, keeping:', currentHead.id);
    return newParts;
  }
  
  let currentType = null;
  const headMatch = currentHead.id.match(/strong_head_(\d+)_t\d+/);
  if (headMatch) {
    currentType = headMatch[1];
  }
  
  console.log('🎯 Current head info:', { currentHeadId: currentHead.id, currentType });
  
  const compatibleHeads = ALL_PARTS.filter(p => 
    p.category === 'HEAD' && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  console.log('✅ Compatible heads found:', compatibleHeads.length, 'heads for torso:', newTorso.id);
  console.log('✅ Compatible heads IDs:', compatibleHeads.map(h => h.id));
  
  if (currentType) {
    console.log('🔍 Looking for head type:', currentType);
    const matchingHead = compatibleHeads.find(p => p.id.includes(`strong_head_${currentType}_`));
    if (matchingHead) {
      console.log('🎯 Found matching head type:', matchingHead.id);
      newParts.HEAD = matchingHead;
      return newParts;
    } else {
      console.log('❌ No matching head type found for type:', currentType);
    }
  }
  
  if (compatibleHeads.length > 0) {
    console.log('📌 No matching type found, using first compatible:', compatibleHeads[0].id);
    newParts.HEAD = compatibleHeads[0];
  } else {
    console.log('❌ No compatible heads found for torso:', newTorso.id);
    delete newParts.HEAD;
  }
  
  return newParts;
}

// Simular el flujo real
console.log('🎯 SIMULANDO FLUJO REAL...\n');

// Estado inicial
const initialState = {
  TORSO: ALL_PARTS.find(p => p.id === 'strong_torso_01'),
  HEAD: ALL_PARTS.find(p => p.id === 'strong_head_03_t01') // Cabeza tipo 03
};

console.log('1️⃣ ESTADO INICIAL:');
console.log('   Torso:', initialState.TORSO?.id);
console.log('   Cabeza:', initialState.HEAD?.id);
console.log('');

// Cambio de torso
const newTorso = ALL_PARTS.find(p => p.id === 'strong_torso_02');
console.log('2️⃣ CAMBIO DE TORSO: strong_torso_01 → strong_torso_02');

let newParts = { ...initialState };
delete newParts.HEAD;
newParts.TORSO = newTorso;

console.log('3️⃣ EJECUTANDO assignAdaptiveHeadForTorso...');
const result = assignAdaptiveHeadForTorso(newTorso, newParts);

console.log('\n4️⃣ RESULTADO:');
console.log('   Torso:', result.TORSO?.id);
console.log('   Cabeza:', result.HEAD?.id);

// Verificar preservación
const originalType = initialState.HEAD?.id.match(/strong_head_(\d+)_t\d+/)?.[1];
const finalType = result.HEAD?.id.match(/strong_head_(\d+)_t\d+/)?.[1];

console.log('\n5️⃣ VERIFICACIÓN:');
console.log('   Tipo original:', originalType);
console.log('   Tipo final:', finalType);
console.log('   ¿Se preservó el tipo?', originalType === finalType ? '✅ SÍ' : '❌ NO');

if (originalType !== finalType) {
  console.log('\n🚨 PROBLEMA DETECTADO:');
  console.log('   La cabeza cambió de tipo al cambiar de torso');
} else {
  console.log('\n✅ RESULTADO CORRECTO:');
  console.log('   El tipo de cabeza se preservó correctamente');
} 