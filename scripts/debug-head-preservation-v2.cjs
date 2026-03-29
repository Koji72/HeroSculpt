#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simular las constantes necesarias
const PartCategory = {
  HEAD: 'HEAD',
  TORSO: 'TORSO',
  HAND_LEFT: 'HAND_LEFT',
  HAND_RIGHT: 'HAND_RIGHT',
  CAPE: 'CAPE'
};

// Simular ALL_PARTS con datos reales
const ALL_PARTS = [
  // Torso 01
  { id: 'strong_torso_01', category: 'TORSO', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  
  // Torso 05
  { id: 'strong_torso_05', category: 'TORSO', archetype: 'STRONG', compatible: ['strong_torso_05'] },
  
  // Cabezas para torso 01
  { id: 'strong_head_01_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  { id: 'strong_head_02_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  { id: 'strong_head_03_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  { id: 'strong_head_04_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
  
  // Cabezas para torso 05
  { id: 'strong_head_01_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] },
  { id: 'strong_head_02_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] },
  { id: 'strong_head_03_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] },
  { id: 'strong_head_04_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] },
];

function assignAdaptiveHeadForTorso(newTorso, currentParts, originalParts) {
  console.log('🔍 assignAdaptiveHeadForTorso called with:', { 
    newTorsoId: newTorso.id, 
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });
  
  let newParts = { ...currentParts };
  
  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  console.log('🔍 Parts to check for current head:', Object.keys(partsToCheck));
  const currentHead = Object.values(partsToCheck).find(p => p.category === PartCategory.HEAD);
  console.log('🔍 Current head found:', currentHead?.id || 'none');
  
  // Si no hay cabeza actual, usar la primera compatible
  if (!currentHead) {
    const compatibleHeads = ALL_PARTS.filter(p => 
      p.category === PartCategory.HEAD && 
      p.archetype === newTorso.archetype &&
      p.compatible.includes(newTorso.id)
    );
    
    if (compatibleHeads.length > 0) {
      console.log('📌 No current head, using first compatible:', compatibleHeads[0].id);
      newParts[PartCategory.HEAD] = compatibleHeads[0];
    }
    return newParts;
  }
  
  // Verificar si la cabeza actual es compatible con el nuevo torso
  const isCurrentHeadCompatible = currentHead.compatible.includes(newTorso.id);
  
  if (isCurrentHeadCompatible) {
    console.log('✅ Current head is compatible, keeping:', currentHead.id);
    // No hacer nada, mantener la cabeza actual
    return newParts;
  }
  
  // La cabeza actual no es compatible, buscar una del mismo tipo
  let currentType = null;
  const headMatch = currentHead.id.match(/strong_head_(\d+)_t\d+/);
  if (headMatch) {
    currentType = headMatch[1];
  }
  
  console.log('🎯 Current head info:', { currentHeadId: currentHead.id, currentType, headMatch: headMatch ? headMatch[0] : 'no match' });
  
  const compatibleHeads = ALL_PARTS.filter(p => 
    p.category === PartCategory.HEAD && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  console.log('✅ Compatible heads found:', compatibleHeads.length, 'heads for torso:', newTorso.id);
  console.log('✅ Compatible heads IDs:', compatibleHeads.map(h => h.id));
  
  // Buscar una cabeza del mismo tipo
  if (currentType) {
    console.log('🔍 Looking for head type:', currentType);
    const matchingHead = compatibleHeads.find(p => p.id.includes(`strong_head_${currentType}_`));
    if (matchingHead) {
      console.log('🎯 Found matching head type:', matchingHead.id);
      newParts[PartCategory.HEAD] = matchingHead;
      return newParts;
    } else {
      console.log('❌ No matching head type found for type:', currentType);
    }
  }
  
  // Si no encuentra del mismo tipo, usar la primera compatible
  if (compatibleHeads.length > 0) {
    console.log('📌 No matching type found, using first compatible:', compatibleHeads[0].id);
    newParts[PartCategory.HEAD] = compatibleHeads[0];
  } else {
    console.log('❌ No compatible heads found for torso:', newTorso.id);
    // Limpiar cabeza si no hay compatibles
    delete newParts[PartCategory.HEAD];
  }
  
  return newParts;
}

// Simular el flujo de App.tsx
function simulateTorsoChange() {
  console.log('\n🎯 === SIMULACIÓN DE CAMBIO DE TORSO ===\n');
  
  // Estado inicial con cabeza 04 del torso 01
  const initialState = {
    [PartCategory.TORSO]: ALL_PARTS.find(p => p.id === 'strong_torso_01'),
    [PartCategory.HEAD]: ALL_PARTS.find(p => p.id === 'strong_head_04_t01'),
    [PartCategory.HAND_LEFT]: { id: 'strong_hands_fist_01_t01_l_ng', category: 'HAND_LEFT' },
    [PartCategory.HAND_RIGHT]: { id: 'strong_hands_fist_01_t01_r_ng', category: 'HAND_RIGHT' }
  };
  
  console.log('📋 Estado inicial:');
  console.log('   - Torso:', initialState[PartCategory.TORSO].id);
  console.log('   - Cabeza:', initialState[PartCategory.HEAD].id);
  console.log('   - Mano izquierda:', initialState[PartCategory.HAND_LEFT].id);
  console.log('   - Mano derecha:', initialState[PartCategory.HAND_RIGHT].id);
  
  // Nuevo torso
  const newTorso = ALL_PARTS.find(p => p.id === 'strong_torso_05');
  console.log('\n🔄 Cambiando a torso:', newTorso.id);
  
  // Simular el flujo de App.tsx
  let newParts = { ...initialState };
  
  // Preservar la cabeza actual antes de cambiar el torso
  const currentHead = newParts[PartCategory.HEAD];
  console.log('\n💾 Cabeza preservada:', currentHead.id);
  
  // Cambiar el torso
  newParts[PartCategory.TORSO] = newTorso;
  console.log('✅ Torso cambiado a:', newParts[PartCategory.TORSO].id);
  
  // Crear objeto temporal con la cabeza preservada
  const partsWithHead = { ...newParts };
  if (currentHead) partsWithHead[PartCategory.HEAD] = currentHead;
  console.log('\n📦 Objeto con cabeza preservada:', Object.keys(partsWithHead));
  
  // Llamar a assignAdaptiveHeadForTorso
  console.log('\n🔧 Llamando a assignAdaptiveHeadForTorso...');
  newParts = assignAdaptiveHeadForTorso(newTorso, newParts, partsWithHead);
  
  console.log('\n📋 Estado final:');
  console.log('   - Torso:', newParts[PartCategory.TORSO].id);
  console.log('   - Cabeza:', newParts[PartCategory.HEAD]?.id || 'ninguna');
  console.log('   - Mano izquierda:', newParts[PartCategory.HAND_LEFT]?.id || 'ninguna');
  console.log('   - Mano derecha:', newParts[PartCategory.HAND_RIGHT]?.id || 'ninguna');
  
  console.log('\n🎯 === RESULTADO ===');
  if (newParts[PartCategory.HEAD]?.id === 'strong_head_04_t05') {
    console.log('✅ ÉXITO: La cabeza se preservó correctamente (04 → 04)');
  } else {
    console.log('❌ FALLO: La cabeza no se preservó correctamente');
    console.log('   Esperado: strong_head_04_t05');
    console.log('   Obtenido:', newParts[PartCategory.HEAD]?.id || 'ninguna');
  }
}

// Ejecutar la simulación
simulateTorsoChange(); 