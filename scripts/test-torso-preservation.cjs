const fs = require('fs');

console.log('🧪 PRUEBA DE PRESERVACIÓN DE MANOS Y CABEZAS');
console.log('=============================================\n');

// Simular datos de prueba
const PartCategory = {
  TORSO: 'TORSO',
  SUIT_TORSO: 'SUIT_TORSO',
  HEAD: 'HEAD',
  HAND_LEFT: 'HAND_LEFT',
  HAND_RIGHT: 'HAND_RIGHT',
  CAPE: 'CAPE',
  SYMBOL: 'SYMBOL'
};

const ArchetypeId = {
  STRONG: 'STRONG'
};

// Simular partes de prueba
const ALL_PARTS = [
  {
    id: 'strong_torso_01',
    name: 'Strong Torso Alpha',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    compatible: []
  },
  {
    id: 'strong_torso_02',
    name: 'Strong Torso Beta',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    compatible: []
  },
  {
    id: 'strong_head_01_t01',
    name: 'Strong Head Alpha',
    category: PartCategory.HEAD,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01']
  },
  {
    id: 'strong_head_01_t02',
    name: 'Strong Head Alpha',
    category: PartCategory.HEAD,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_02']
  },
  {
    id: 'strong_hands_fist_01_t01_l_g',
    name: 'Strong Fist Left Gloved',
    category: PartCategory.HAND_LEFT,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01'],
    attributes: { glove: true }
  },
  {
    id: 'strong_hands_fist_01_t02_l_g',
    name: 'Strong Fist Left Gloved',
    category: PartCategory.HAND_LEFT,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_02'],
    attributes: { glove: true }
  },
  {
    id: 'strong_hands_fist_01_t01_r_g',
    name: 'Strong Fist Right Gloved',
    category: PartCategory.HAND_RIGHT,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01'],
    attributes: { glove: true }
  },
  {
    id: 'strong_hands_fist_01_t02_r_g',
    name: 'Strong Fist Right Gloved',
    category: PartCategory.HAND_RIGHT,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_02'],
    attributes: { glove: true }
  }
];

// Simular estado inicial
const initialState = {
  [PartCategory.TORSO]: ALL_PARTS.find(p => p.id === 'strong_torso_01'),
  [PartCategory.HEAD]: ALL_PARTS.find(p => p.id === 'strong_head_01_t01'),
  [PartCategory.HAND_LEFT]: ALL_PARTS.find(p => p.id === 'strong_hands_fist_01_t01_l_g'),
  [PartCategory.HAND_RIGHT]: ALL_PARTS.find(p => p.id === 'strong_hands_fist_01_t01_r_g')
};

console.log('📋 Estado inicial:');
Object.entries(initialState).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

// Simular cambio de torso
const newTorso = ALL_PARTS.find(p => p.id === 'strong_torso_02');
console.log(`\n🔄 Cambiando a torso: ${newTorso?.id}`);

// Simular la lógica de App.tsx
let newParts = { ...initialState };

// ✅ REGLA CRÍTICA: PRESERVAR TODAS LAS PARTES ANTES DE ELIMINAR
const currentLeftHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_LEFT);
const currentRightHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_RIGHT);
const currentHead = newParts[PartCategory.HEAD];

console.log('\n🔍 Partes preservadas:');
console.log(`   Mano izquierda: ${currentLeftHand?.id || 'ninguna'}`);
console.log(`   Mano derecha: ${currentRightHand?.id || 'ninguna'}`);
console.log(`   Cabeza: ${currentHead?.id || 'ninguna'}`);

// ✅ ELIMINAR DESPUÉS DE PRESERVAR (solo SUIT_TORSO)
const TORSO_DEPENDENT_CATEGORIES = [PartCategory.SUIT_TORSO];
TORSO_DEPENDENT_CATEGORIES.forEach(dep => {
  delete newParts[dep];
});

// Asignar nuevo torso
newParts[PartCategory.TORSO] = newTorso;

// Crear un objeto temporal con las manos actuales
const tempParts = { ...newParts };
if (currentLeftHand) tempParts[PartCategory.HAND_LEFT] = currentLeftHand;
if (currentRightHand) tempParts[PartCategory.HAND_RIGHT] = currentRightHand;

console.log('\n🔍 Estado después de preservar:');
Object.entries(tempParts).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

// Simular assignDefaultHandsForTorso
function assignDefaultHandsForTorso(newTorso, currentParts) {
  let newParts = { ...currentParts };
  // ✅ CORREGIDO: NO eliminar manos existentes - preservarlas
  
  const currentLeftHand = Object.values(currentParts).find(p => p.category === PartCategory.HAND_LEFT);
  const currentRightHand = Object.values(currentParts).find(p => p.category === PartCategory.HAND_RIGHT);
  
  const compatibleLeftHands = ALL_PARTS.filter(p => 
    p.category === PartCategory.HAND_LEFT && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  const compatibleRightHands = ALL_PARTS.filter(p => 
    p.category === PartCategory.HAND_RIGHT && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  // Si las manos actuales son compatibles, mantenerlas
  if (currentLeftHand && currentLeftHand.compatible.includes(newTorso.id)) {
    newParts[PartCategory.HAND_LEFT] = currentLeftHand;
  } else if (compatibleLeftHands.length > 0) {
    newParts[PartCategory.HAND_LEFT] = compatibleLeftHands[0];
  }
  
  if (currentRightHand && currentRightHand.compatible.includes(newTorso.id)) {
    newParts[PartCategory.HAND_RIGHT] = currentRightHand;
  } else if (compatibleRightHands.length > 0) {
    newParts[PartCategory.HAND_RIGHT] = compatibleRightHands[0];
  }
  
  return newParts;
}

// Simular assignAdaptiveHeadForTorso
function assignAdaptiveHeadForTorso(newTorso, currentParts, originalParts) {
  let newParts = { ...currentParts };
  
  const partsToCheck = originalParts || currentParts;
  const currentHead = Object.values(partsToCheck).find(p => p.category === PartCategory.HEAD);
  
  if (!currentHead) {
    const compatibleHeads = ALL_PARTS.filter(p => 
      p.category === PartCategory.HEAD && 
      p.archetype === newTorso.archetype &&
      p.compatible.includes(newTorso.id)
    );
    
    if (compatibleHeads.length > 0) {
      newParts[PartCategory.HEAD] = compatibleHeads[0];
    }
    return newParts;
  }
  
  // Verificar si la cabeza actual es compatible
  const isCurrentHeadCompatible = currentHead.compatible.includes(newTorso.id);
  
  if (isCurrentHeadCompatible) {
    // Mantener la cabeza actual
    return newParts;
  }
  
  // Buscar una cabeza compatible del mismo tipo
  const compatibleHeads = ALL_PARTS.filter(p => 
    p.category === PartCategory.HEAD && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  if (compatibleHeads.length > 0) {
    newParts[PartCategory.HEAD] = compatibleHeads[0];
  } else {
    delete newParts[PartCategory.HEAD];
  }
  
  return newParts;
}

// Aplicar las funciones
newParts = assignDefaultHandsForTorso(newTorso, tempParts);

const partsWithHead = { ...newParts };
if (currentHead) partsWithHead[PartCategory.HEAD] = currentHead;
newParts = assignAdaptiveHeadForTorso(newTorso, newParts, partsWithHead);

console.log('\n✅ Estado final después del cambio:');
Object.entries(newParts).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

console.log('\n🎯 Verificación:');
console.log(`   ✅ Manos preservadas: ${newParts[PartCategory.HAND_LEFT]?.id && newParts[PartCategory.HAND_RIGHT]?.id ? 'SÍ' : 'NO'}`);
console.log(`   ✅ Cabeza preservada: ${newParts[PartCategory.HEAD]?.id ? 'SÍ' : 'NO'}`);
console.log(`   ✅ Torso cambiado: ${newParts[PartCategory.TORSO]?.id === newTorso.id ? 'SÍ' : 'NO'}`);

console.log('\n=============================================');
console.log('🧪 PRUEBA COMPLETADA');
console.log('============================================='); 