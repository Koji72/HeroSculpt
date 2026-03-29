const fs = require('fs');

console.log('🎮 PRUEBA EN VIVO DEL SISTEMA DE CABEZAS');
console.log('=========================================\n');

// Simular el estado inicial (como en constants.ts)
const DEFAULT_STRONG_BUILD = {
  'TORSO': { id: 'strong_torso_01', category: 'TORSO', archetype: 'STRONG' },
  'HEAD': { id: 'strong_head_01_t01', category: 'HEAD', archetype: 'STRONG' },
  'HAND_LEFT': { id: 'strong_hands_fist_01_t01_l_ng', category: 'HAND_LEFT', archetype: 'STRONG' },
  'HAND_RIGHT': { id: 'strong_hands_fist_01_t01_r_ng', category: 'HAND_RIGHT', archetype: 'STRONG' }
};

console.log('🏁 ESTADO INICIAL (Build por defecto):');
console.log(`   Torso: ${DEFAULT_STRONG_BUILD['TORSO'].id}`);
console.log(`   Cabeza: ${DEFAULT_STRONG_BUILD['HEAD'].id}`);
console.log(`   Mano izquierda: ${DEFAULT_STRONG_BUILD['HAND_LEFT'].id}`);
console.log(`   Mano derecha: ${DEFAULT_STRONG_BUILD['HAND_RIGHT'].id}\n`);

// Simular la función assignAdaptiveHeadForTorso
function assignAdaptiveHeadForTorso(newTorso, currentParts) {
  console.log(`🔄 assignAdaptiveHeadForTorso: ${newTorso.id}`);
  
  let newParts = { ...currentParts };
  delete newParts['HEAD'];
  
  const currentHead = Object.values(currentParts).find(p => p.category === 'HEAD');
  let currentType = null;
  if (currentHead) {
    const headMatch = currentHead.id.match(/strong_head_(\d+)_t\d+/);
    if (headMatch) {
      currentType = headMatch[1];
    }
  }
  
  console.log(`   Cabeza actual: ${currentHead?.id || 'NONE'}`);
  console.log(`   Tipo de cabeza: ${currentType || 'NONE'}`);
  
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
  
  console.log(`   Cabezas compatibles: ${compatibleHeads.length}`);
  
  if (currentType) {
    const matchingHead = compatibleHeads.find(p => p.id.includes(`strong_head_${currentType}_`));
    if (matchingHead) {
      console.log(`   ✅ Preservando tipo ${currentType}: ${matchingHead.id}`);
      newParts['HEAD'] = matchingHead;
      return newParts;
    }
  }
  
  if (compatibleHeads.length > 0) {
    console.log(`   📌 Usando primera cabeza: ${compatibleHeads[0].id}`);
    newParts['HEAD'] = compatibleHeads[0];
  }
  
  return newParts;
}

// Simular la lógica de App.tsx para cambio de torso
function simulateTorsoChange(currentParts, newTorsoId) {
  console.log(`\n🎯 CAMBIO DE TORSO: ${newTorsoId}`);
  console.log('─'.repeat(50));
  
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
  
  // Llamar a assignAdaptiveHeadForTorso
  newParts = assignAdaptiveHeadForTorso(newParts['TORSO'], newParts);
  
  console.log(`\n✅ RESULTADO FINAL:`);
  console.log(`   Torso: ${newParts['TORSO'].id}`);
  console.log(`   Cabeza: ${newParts['HEAD'].id}`);
  
  return newParts;
}

// Simular la lógica de PartSelectorPanel para mostrar cabezas disponibles
function simulatePartSelectorFiltering(selectedParts, allHeadParts) {
  const selectedTorso = Object.values(selectedParts).find(p => p.category === 'TORSO');
  const selectedSuit = Object.values(selectedParts).find(p => p.category === 'SUIT_TORSO');
  const activeTorso = selectedSuit || selectedTorso;
  
  console.log(`\n📋 CABEZAS DISPONIBLES EN PANEL:`);
  console.log(`   Torso activo: ${activeTorso?.id || 'NONE'}`);
  
  if (!activeTorso) {
    console.log(`   ⚠️ No hay torso, mostrando todas las cabezas`);
    return allHeadParts;
  }
  
  let underlyingTorsoId = activeTorso.id;
  if (selectedSuit) {
    const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
    if (suitMatch) {
      const torsoNumber = suitMatch[1];
      underlyingTorsoId = `strong_torso_${torsoNumber}`;
      console.log(`   Torso subyacente: ${underlyingTorsoId}`);
    }
  }
  
  const availableHeads = allHeadParts.filter(p => p.compatible.includes(underlyingTorsoId));
  console.log(`   Cabezas disponibles: ${availableHeads.length}`);
  availableHeads.forEach(head => console.log(`   - ${head.id}`));
  
  return availableHeads;
}

// Ejecutar secuencia de pruebas
let currentState = { ...DEFAULT_STRONG_BUILD };

// Definir todas las cabezas para el filtrado
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

// Mostrar cabezas disponibles en estado inicial
simulatePartSelectorFiltering(currentState, allHeadParts);

// Prueba 1: Cambiar a torso 02
currentState = simulateTorsoChange(currentState, 'strong_torso_02');
simulatePartSelectorFiltering(currentState, allHeadParts);

// Prueba 2: Cambiar a torso 03
currentState = simulateTorsoChange(currentState, 'strong_torso_03');
simulatePartSelectorFiltering(currentState, allHeadParts);

// Prueba 3: Cambiar a torso 04
currentState = simulateTorsoChange(currentState, 'strong_torso_04');
simulatePartSelectorFiltering(currentState, allHeadParts);

// Prueba 4: Cambiar a torso 05
currentState = simulateTorsoChange(currentState, 'strong_torso_05');
simulatePartSelectorFiltering(currentState, allHeadParts);

console.log('\n🎯 ANÁLISIS FINAL:');
console.log('Si siempre ves la cabeza 01, el problema puede ser:');
console.log('1. El estado se está reiniciando al build por defecto');
console.log('2. La interfaz no está mostrando las cabezas correctas');
console.log('3. Hay un problema en la renderización del panel'); 