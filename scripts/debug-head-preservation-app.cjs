const fs = require('fs');

console.log('🔍 DIAGNÓSTICO: PRESERVACIÓN DE CABEZA EN APP.TSX');
console.log('==================================================\n');

// Simular la función assignAdaptiveHeadForTorso
function assignAdaptiveHeadForTorso(newTorso, currentParts) {
  console.log('🔍 assignAdaptiveHeadForTorso called with:', { 
    newTorsoId: newTorso.id, 
    currentParts: Object.keys(currentParts) 
  });
  
  let newParts = { ...currentParts };
  // Limpiar cabeza existente usando categoría
  delete newParts['HEAD'];
  
  const currentHead = Object.values(currentParts).find(p => p.category === 'HEAD');
  let currentType = null;
  if (currentHead) {
    const headMatch = currentHead.id.match(/strong_head_(\d+)_t\d+/);
    if (headMatch) {
      currentType = headMatch[1];
    }
  }
  
  console.log('🎯 Current head info:', { currentHeadId: currentHead?.id, currentType });
  
  // Simular ALL_PARTS.filter para cabezas
  const allHeadParts = [
    { id: 'strong_head_01_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
    { id: 'strong_head_01_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
    { id: 'strong_head_01_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] },
    { id: 'strong_head_01_t04', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_04'] },
    { id: 'strong_head_01_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] },
    { id: 'strong_head_02_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
    { id: 'strong_head_02_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
    { id: 'strong_head_02_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] },
    { id: 'strong_head_02_t04', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_04'] },
    { id: 'strong_head_02_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] },
    { id: 'strong_head_03_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
    { id: 'strong_head_03_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
    { id: 'strong_head_03_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] },
    { id: 'strong_head_03_t04', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_04'] },
    { id: 'strong_head_03_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] },
    { id: 'strong_head_04_t01', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_01'] },
    { id: 'strong_head_04_t02', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_02'] },
    { id: 'strong_head_04_t03', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_03'] },
    { id: 'strong_head_04_t04', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_04'] },
    { id: 'strong_head_04_t05', category: 'HEAD', archetype: 'STRONG', compatible: ['strong_torso_05'] }
  ];
  
  const compatibleHeads = allHeadParts.filter(p => 
    p.category === 'HEAD' && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  console.log('✅ Compatible heads found:', compatibleHeads.length, 'heads for torso:', newTorso.id);
  
  if (currentType) {
    const matchingHead = compatibleHeads.find(p => p.id.includes(`strong_head_${currentType}_`));
    if (matchingHead) {
      console.log('🎯 Found matching head type:', matchingHead.id);
      newParts['HEAD'] = matchingHead;
      return newParts;
    }
  }
  
  if (compatibleHeads.length > 0) {
    console.log('📌 Using first compatible head:', compatibleHeads[0].id);
    newParts['HEAD'] = compatibleHeads[0];
  } else {
    console.log('❌ No compatible heads found for torso:', newTorso.id);
  }
  
  return newParts;
}

// Simular la lógica de App.tsx para cambio de torso
function simulateTorsoChange(currentParts, newTorsoId) {
  console.log(`🎯 Simulando cambio de torso a: ${newTorsoId}`);
  console.log(`   Partes actuales:`, Object.keys(currentParts));
  
  let newParts = { ...currentParts };
  
  // Eliminar torso actual
  delete newParts['TORSO'];
  delete newParts['SUIT_TORSO'];
  
  // Agregar nuevo torso
  newParts['TORSO'] = { 
    id: newTorsoId, 
    category: 'TORSO', 
    archetype: 'STRONG' 
  };
  
  console.log('✅ Nuevo torso agregado:', newTorsoId);
  
  // Llamar a assignAdaptiveHeadForTorso (como en App.tsx línea 165)
  newParts = assignAdaptiveHeadForTorso(newParts['TORSO'], newParts);
  
  return newParts;
}

// Probar diferentes escenarios
console.log('📋 ESCENARIOS DE PRUEBA:\n');

// Escenario 1: Cambiar de torso 01 a torso 02 con cabeza 03
console.log('1️⃣ ESCENARIO 1: Torso 01 → Torso 02 (cabeza 03)');
const currentParts1 = {
  'TORSO': { id: 'strong_torso_01', category: 'TORSO', archetype: 'STRONG' },
  'HEAD': { id: 'strong_head_03_t01', category: 'HEAD', archetype: 'STRONG' }
};

const result1 = simulateTorsoChange(currentParts1, 'strong_torso_02');
console.log(`   Resultado: ${result1['HEAD']?.id || 'NO HEAD'}\n`);

// Escenario 2: Cambiar de torso 02 a torso 03 con cabeza 02
console.log('2️⃣ ESCENARIO 2: Torso 02 → Torso 03 (cabeza 02)');
const currentParts2 = {
  'TORSO': { id: 'strong_torso_02', category: 'TORSO', archetype: 'STRONG' },
  'HEAD': { id: 'strong_head_02_t02', category: 'HEAD', archetype: 'STRONG' }
};

const result2 = simulateTorsoChange(currentParts2, 'strong_torso_03');
console.log(`   Resultado: ${result2['HEAD']?.id || 'NO HEAD'}\n`);

// Escenario 3: Cambiar de torso 03 a torso 04 con cabeza 04
console.log('3️⃣ ESCENARIO 3: Torso 03 → Torso 04 (cabeza 04)');
const currentParts3 = {
  'TORSO': { id: 'strong_torso_03', category: 'TORSO', archetype: 'STRONG' },
  'HEAD': { id: 'strong_head_04_t03', category: 'HEAD', archetype: 'STRONG' }
};

const result3 = simulateTorsoChange(currentParts3, 'strong_torso_04');
console.log(`   Resultado: ${result3['HEAD']?.id || 'NO HEAD'}\n`);

// Escenario 4: Sin cabeza actual (debería usar la primera)
console.log('4️⃣ ESCENARIO 4: Sin cabeza actual (debería usar primera)');
const currentParts4 = {
  'TORSO': { id: 'strong_torso_01', category: 'TORSO', archetype: 'STRONG' }
};

const result4 = simulateTorsoChange(currentParts4, 'strong_torso_03');
console.log(`   Resultado: ${result4['HEAD']?.id || 'NO HEAD'}\n`);

console.log('🎯 DIAGNÓSTICO COMPLETADO');
console.log('Si los escenarios 1-3 no preservan el tipo de cabeza, hay un problema en la lógica');
console.log('Si el escenario 4 no asigna una cabeza, hay un problema con la asignación por defecto'); 