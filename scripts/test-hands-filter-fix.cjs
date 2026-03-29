#!/usr/bin/env node

const fs = require('fs');

console.log('🧪 Prueba del Filtro de Manos Corregido');
console.log('=' .repeat(50));

// Simular el estado con torso 01
console.log('\n1️⃣ Simulando estado con strong_torso_01...');

const selectedParts = {
  TORSO: { id: 'strong_torso_01' },
  HAND_LEFT: { id: 'strong_hands_fist_01_t01_l_ng' },
  HAND_RIGHT: { id: 'strong_hands_fist_01_t01_r_ng' }
};

const activeCategory = 'HAND_LEFT';

console.log('   📋 Estado:');
console.log(`      Torso: ${selectedParts.TORSO.id}`);
console.log(`      Categoría activa: ${activeCategory}`);

// 2. Aplicar el filtro corregido
console.log('\n2️⃣ Aplicando filtro corregido...');

try {
  const handsContent = fs.readFileSync('src/parts/strongHandsParts.ts', 'utf8');
  
  // Extraer todas las manos STRONG
  const strongHandsPattern = /id: '([^']+)'.*?archetype: ArchetypeId\.STRONG.*?compatible: \[([^\]]+)\],/gs;
  let match;
  const allStrongHands = [];
  
  while ((match = strongHandsPattern.exec(handsContent)) !== null) {
    const handId = match[1];
    const compatible = match[2].replace(/'/g, '').split(', ');
    allStrongHands.push({ id: handId, compatible });
  }
  
  console.log(`   📊 Total manos STRONG: ${allStrongHands.length}`);
  
  // Aplicar el filtro corregido
  const selectedTorso = selectedParts.TORSO;
  const selectedSuit = selectedParts.SUIT_TORSO;
  const activeTorso = selectedSuit || selectedTorso;
  
  console.log(`   🎯 Torso activo: ${activeTorso.id}`);
  
  // Para suit torsos, extraer el torso base
  let baseTorsoId = activeTorso.id;
  if (selectedSuit) {
    const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
    if (suitMatch) {
      const torsoNumber = suitMatch[1];
      baseTorsoId = `strong_torso_${torsoNumber}`;
      console.log(`   🔄 Suit detectado, torso base: ${baseTorsoId}`);
    }
  }
  
  console.log(`   🎯 Torso base para compatibilidad: ${baseTorsoId}`);
  
  // Filtrar manos izquierdas compatibles
  const filteredHands = allStrongHands.filter(hand => {
    if (hand.id.includes('_l') && activeCategory === 'HAND_LEFT') {
      const isCompatible = hand.compatible.includes(baseTorsoId);
      return isCompatible;
    }
    return false;
  });
  
  console.log(`\n   📊 Resultado del filtro:`);
  console.log(`      Manos izquierdas compatibles con ${baseTorsoId}: ${filteredHands.length}`);
  
  // Agrupar por torso para verificar
  const handsByTorso = {};
  filteredHands.forEach(hand => {
    hand.compatible.forEach(torso => {
      if (!handsByTorso[torso]) handsByTorso[torso] = [];
      handsByTorso[torso].push(hand.id);
    });
  });
  
  console.log(`\n   📋 Manos por torso compatible:`);
  Object.keys(handsByTorso).forEach(torso => {
    console.log(`      ${torso}: ${handsByTorso[torso].length} manos`);
  });
  
  // Verificar que solo hay manos del torso 01
  const nonTorso01Hands = filteredHands.filter(hand => 
    !hand.compatible.includes('strong_torso_01')
  );
  
  if (nonTorso01Hands.length > 0) {
    console.log(`\n   ❌ PROBLEMA: ${nonTorso01Hands.length} manos de otros torsos:`);
    nonTorso01Hands.forEach(hand => {
      console.log(`      - ${hand.id} (compatible: ${hand.compatible.join(', ')})`);
    });
  } else {
    console.log(`\n   ✅ CORRECTO: Solo manos compatibles con strong_torso_01`);
  }
  
} catch (error) {
  console.log('   ❌ Error aplicando filtro:', error.message);
}

// 3. Probar con suit torso
console.log('\n3️⃣ Probando con suit torso...');

const selectedPartsWithSuit = {
  SUIT_TORSO: { id: 'strong_suit_torso_01_t01' },
  HAND_LEFT: { id: 'strong_hands_fist_01_t01_l_ng' },
  HAND_RIGHT: { id: 'strong_hands_fist_01_t01_r_ng' }
};

console.log('   📋 Estado con suit:');
console.log(`      Suit: ${selectedPartsWithSuit.SUIT_TORSO.id}`);

try {
  const handsContent = fs.readFileSync('src/parts/strongHandsParts.ts', 'utf8');
  
  // Extraer manos STRONG
  const strongHandsPattern = /id: '([^']+)'.*?archetype: ArchetypeId\.STRONG.*?compatible: \[([^\]]+)\],/gs;
  let match;
  const allStrongHands = [];
  
  while ((match = strongHandsPattern.exec(handsContent)) !== null) {
    const handId = match[1];
    const compatible = match[2].replace(/'/g, '').split(', ');
    allStrongHands.push({ id: handId, compatible });
  }
  
  // Aplicar filtro con suit
  const selectedTorso = selectedPartsWithSuit.TORSO;
  const selectedSuit = selectedPartsWithSuit.SUIT_TORSO;
  const activeTorso = selectedSuit || selectedTorso;
  
  let baseTorsoId = activeTorso.id;
  if (selectedSuit) {
    const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
    if (suitMatch) {
      const torsoNumber = suitMatch[1];
      baseTorsoId = `strong_torso_${torsoNumber}`;
    }
  }
  
  console.log(`   🎯 Torso base extraído: ${baseTorsoId}`);
  
  const filteredHands = allStrongHands.filter(hand => {
    if (hand.id.includes('_l')) {
      return hand.compatible.includes(baseTorsoId);
    }
    return false;
  });
  
  console.log(`   📊 Manos izquierdas compatibles: ${filteredHands.length}`);
  
} catch (error) {
  console.log('   ❌ Error probando suit:', error.message);
}

console.log('\n' + '=' .repeat(50));
console.log('🧪 Prueba completada'); 