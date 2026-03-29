const fs = require('fs');

console.log('🧪 PRUEBA DE LOGICA DE SUIT TORSO CORREGIDA');
console.log('============================================\n');

// Simular el estado exacto del navegador
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

// Simular partes reales del sistema
const ALL_PARTS = [
  // Torsos base
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
  // Suits
  {
    id: 'strong_suit_torso_01_t01',
    name: 'Strong Suit Alpha (Torso 01)',
    category: PartCategory.SUIT_TORSO,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01']
  },
  {
    id: 'strong_suit_torso_02_t01',
    name: 'Strong Suit Beta (Torso 01)',
    category: PartCategory.SUIT_TORSO,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01']
  },
  // Cabezas
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
  // Manos izquierdas
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
  // Manos derechas
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

// Simular estado inicial con torso base y suit
const initialState = {
  [PartCategory.TORSO]: ALL_PARTS.find(p => p.id === 'strong_torso_01'),
  [PartCategory.SUIT_TORSO]: ALL_PARTS.find(p => p.id === 'strong_suit_torso_01_t01'),
  [PartCategory.HEAD]: ALL_PARTS.find(p => p.id === 'strong_head_01_t01'),
  [PartCategory.HAND_LEFT]: ALL_PARTS.find(p => p.id === 'strong_hands_fist_01_t01_l_g'),
  [PartCategory.HAND_RIGHT]: ALL_PARTS.find(p => p.id === 'strong_hands_fist_01_t01_r_g')
};

console.log('📋 ESTADO INICIAL (con torso base y suit):');
Object.entries(initialState).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

// Simular el cambio de suit (como en el navegador)
const newSuit = ALL_PARTS.find(p => p.id === 'strong_suit_torso_02_t01');
console.log(`\n🔄 CAMBIANDO A SUIT: ${newSuit?.id}`);

// Simular exactamente la lógica corregida de App.tsx
let newParts = { ...initialState };

console.log('\n🔍 PASO 1: Preservar partes antes de eliminar');
const currentLeftHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_LEFT);
const currentRightHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_RIGHT);
const currentHead = newParts[PartCategory.HEAD];
const currentCape = newParts[PartCategory.CAPE];
const currentSymbol = newParts[PartCategory.SYMBOL];

console.log(`   Mano izquierda preservada: ${currentLeftHand?.id || 'ninguna'}`);
console.log(`   Mano derecha preservada: ${currentRightHand?.id || 'ninguna'}`);
console.log(`   Cabeza preservada: ${currentHead?.id || 'ninguna'}`);

console.log('\n🔍 PASO 2: Obtener torso compatible ANTES de eliminar');
const compatibleTorsoId = newSuit.compatible?.[0];
console.log(`   Torso compatible ID: ${compatibleTorsoId || 'ninguno'}`);

const compatibleTorso = ALL_PARTS.find(p => p.id === compatibleTorsoId && p.category === PartCategory.TORSO);
console.log(`   Torso compatible encontrado: ${compatibleTorso?.id || 'ninguno'}`);

if (!compatibleTorso) {
  console.log('❌ ERROR: No se encontró torso compatible');
  process.exit(1);
}

console.log('\n🔍 PASO 3: Eliminar solo el suit actual, mantener torso base');
console.log(`   Estado antes de eliminar:`);
Object.entries(newParts).forEach(([category, part]) => {
  console.log(`     ${category}: ${part?.id || 'ninguna'}`);
});

delete newParts[PartCategory.SUIT_TORSO]; // Solo eliminar el suit actual
newParts[PartCategory.TORSO] = compatibleTorso; // Asignar el torso compatible

console.log(`   Estado después de eliminar suit:`);
Object.entries(newParts).forEach(([category, part]) => {
  console.log(`     ${category}: ${part?.id || 'ninguna'}`);
});

console.log('\n🔍 PASO 4: Crear tempParts con manos preservadas');
const tempParts = { ...newParts };
if (currentLeftHand) tempParts[PartCategory.HAND_LEFT] = currentLeftHand;
if (currentRightHand) tempParts[PartCategory.HAND_RIGHT] = currentRightHand;

console.log('   Estado de tempParts:');
Object.entries(tempParts).forEach(([category, part]) => {
  console.log(`     ${category}: ${part?.id || 'ninguna'}`);
});

// Simular assignDefaultHandsForTorso (versión corregida)
function assignDefaultHandsForTorso(newTorso, currentParts) {
  console.log('\n🔍 assignDefaultHandsForTorso - INICIO');
  let newParts = { ...currentParts };
  
  // ✅ CORREGIDO: NO eliminar manos existentes
  console.log('   ✅ NO eliminando manos existentes');
  
  const currentLeftHand = Object.values(currentParts).find(p => p.category === PartCategory.HAND_LEFT);
  const currentRightHand = Object.values(currentParts).find(p => p.category === PartCategory.HAND_RIGHT);
  
  console.log(`   Mano izquierda actual: ${currentLeftHand?.id || 'ninguna'}`);
  console.log(`   Mano derecha actual: ${currentRightHand?.id || 'ninguna'}`);
  
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
  
  console.log(`   Manos izquierdas compatibles: ${compatibleLeftHands.length}`);
  console.log(`   Manos derechas compatibles: ${compatibleRightHands.length}`);
  
  // Si las manos actuales son compatibles, mantenerlas
  if (currentLeftHand && currentLeftHand.compatible.includes(newTorso.id)) {
    console.log(`   ✅ Manteniendo mano izquierda compatible: ${currentLeftHand.id}`);
    newParts[PartCategory.HAND_LEFT] = currentLeftHand;
  } else if (compatibleLeftHands.length > 0) {
    console.log(`   📌 Asignando nueva mano izquierda: ${compatibleLeftHands[0].id}`);
    newParts[PartCategory.HAND_LEFT] = compatibleLeftHands[0];
  }
  
  if (currentRightHand && currentRightHand.compatible.includes(newTorso.id)) {
    console.log(`   ✅ Manteniendo mano derecha compatible: ${currentRightHand.id}`);
    newParts[PartCategory.HAND_RIGHT] = currentRightHand;
  } else if (compatibleRightHands.length > 0) {
    console.log(`   📌 Asignando nueva mano derecha: ${compatibleRightHands[0].id}`);
    newParts[PartCategory.HAND_RIGHT] = compatibleRightHands[0];
  }
  
  console.log('🔍 assignDefaultHandsForTorso - FINAL');
  Object.entries(newParts).forEach(([category, part]) => {
    console.log(`     ${category}: ${part?.id || 'ninguna'}`);
  });
  
  return newParts;
}

// Simular assignAdaptiveHeadForTorso
function assignAdaptiveHeadForTorso(newTorso, currentParts, originalParts) {
  console.log('\n🔍 assignAdaptiveHeadForTorso - INICIO');
  let newParts = { ...currentParts };
  
  const partsToCheck = originalParts || currentParts;
  const currentHead = Object.values(partsToCheck).find(p => p.category === PartCategory.HEAD);
  
  console.log(`   Cabeza actual: ${currentHead?.id || 'ninguna'}`);
  
  if (!currentHead) {
    const compatibleHeads = ALL_PARTS.filter(p => 
      p.category === PartCategory.HEAD && 
      p.archetype === newTorso.archetype &&
      p.compatible.includes(newTorso.id)
    );
    
    if (compatibleHeads.length > 0) {
      console.log(`   📌 Asignando primera cabeza compatible: ${compatibleHeads[0].id}`);
      newParts[PartCategory.HEAD] = compatibleHeads[0];
    }
    return newParts;
  }
  
  const isCurrentHeadCompatible = currentHead.compatible.includes(newTorso.id);
  
  if (isCurrentHeadCompatible) {
    console.log(`   ✅ Cabeza actual es compatible, manteniendo: ${currentHead.id}`);
    return newParts;
  }
  
  const compatibleHeads = ALL_PARTS.filter(p => 
    p.category === PartCategory.HEAD && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  if (compatibleHeads.length > 0) {
    console.log(`   📌 Asignando nueva cabeza compatible: ${compatibleHeads[0].id}`);
    newParts[PartCategory.HEAD] = compatibleHeads[0];
  } else {
    console.log(`   ❌ No hay cabezas compatibles, eliminando cabeza`);
    delete newParts[PartCategory.HEAD];
  }
  
  console.log('🔍 assignAdaptiveHeadForTorso - FINAL');
  Object.entries(newParts).forEach(([category, part]) => {
    console.log(`     ${category}: ${part?.id || 'ninguna'}`);
  });
  
  return newParts;
}

// Aplicar las funciones
console.log('\n🔍 PASO 5: Aplicar assignDefaultHandsForTorso');
newParts = assignDefaultHandsForTorso(compatibleTorso, tempParts);

console.log('\n🔍 PASO 6: Aplicar assignAdaptiveHeadForTorso');
const partsWithHead = { ...newParts };
if (currentHead) partsWithHead[PartCategory.HEAD] = currentHead;
newParts = assignAdaptiveHeadForTorso(compatibleTorso, newParts, partsWithHead);

console.log('\n🔍 PASO 7: Asignar el nuevo suit');
newParts[PartCategory.SUIT_TORSO] = newSuit;

console.log('\n✅ ESTADO FINAL DESPUÉS DEL CAMBIO DE SUIT:');
Object.entries(newParts).forEach(([category, part]) => {
  console.log(`   ${category}: ${part?.id || 'ninguna'}`);
});

console.log('\n🎯 VERIFICACIÓN FINAL:');
console.log(`   ✅ Manos preservadas: ${newParts[PartCategory.HAND_LEFT]?.id && newParts[PartCategory.HAND_RIGHT]?.id ? 'SÍ' : 'NO'}`);
console.log(`   ✅ Cabeza preservada: ${newParts[PartCategory.HEAD]?.id ? 'SÍ' : 'NO'}`);
console.log(`   ✅ Torso base correcto: ${newParts[PartCategory.TORSO]?.id === compatibleTorso.id ? 'SÍ' : 'NO'}`);
console.log(`   ✅ Suit asignado: ${newParts[PartCategory.SUIT_TORSO]?.id === newSuit.id ? 'SÍ' : 'NO'}`);

console.log('\n============================================');
console.log('🧪 PRUEBA COMPLETADA');
console.log('============================================'); 