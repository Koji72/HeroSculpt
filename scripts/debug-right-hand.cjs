const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUGGING MANO DERECHA');

// Simular la lógica de assignDefaultHandsForTorso
function debugRightHand() {
  // Simular partes actuales con una mano derecha específica
  const currentParts = {
    'HAND_LEFT': {
      id: 'strong_hands_fist_01_t01_l_ng',
      name: 'Left Fist (Ungloved) (Torso 01)',
      category: 'HAND_LEFT',
      archetype: 'STRONG',
      gltfPath: 'assets/strong/hands/strong_hands_fist_01_t01_l_ng.glb',
      priceUSD: 0.5,
      compatible: ['strong_torso_01'],
      thumbnail: 'https://picsum.photos/seed/strong_hands_fist_01_t01_l_ng/100/100',
      attributes: {
        "side": "left",
        "glove": false,
        "weapon": "fist"
      }
    },
    'HAND_RIGHT': {
      id: 'strong_hands_fist_01_t01_r_ng',
      name: 'Right Fist (Ungloved) (Torso 01)',
      category: 'HAND_RIGHT',
      archetype: 'STRONG',
      gltfPath: 'assets/strong/hands/strong_hands_fist_01_t01_r_ng.glb',
      priceUSD: 0.5,
      compatible: ['strong_torso_01'],
      thumbnail: 'https://picsum.photos/seed/strong_hands_fist_01_t01_r_ng/100/100',
      attributes: {
        "side": "right",
        "glove": false,
        "weapon": "fist"
      }
    }
  };

  // Simular nuevo torso
  const newTorso = {
    id: 'strong_torso_02',
    name: 'Strong Torso 02',
    category: 'TORSO',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/torso/strong_torso_02.glb',
    priceUSD: 2.0,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_torso_02/100/100',
    attributes: {}
  };

  console.log('🎯 Estado inicial:');
  console.log('  - Mano izquierda actual:', currentParts['HAND_LEFT'].id);
  console.log('  - Mano derecha actual:', currentParts['HAND_RIGHT'].id);
  console.log('  - Cambiando a torso:', newTorso.id);

  // Simular la lógica de getHandType
  const getHandType = (handId) => {
    const match = handId.match(/hands_([a-z]+)_\d+_t\d+_[lr]/);
    if (match) return match[1];
    const fallback = handId.match(/hands_([a-z]+)_\d+/);
    if (fallback) return fallback[1];
    if (handId.includes('_pistol_')) return 'pistol';
    if (handId.includes('_hammer_')) return 'hammer';
    if (handId.includes('_fist_')) return 'fist';
    if (handId.includes('_noweapon_')) return 'noweapon';
    if (handId.includes('_bands_')) return 'bands';
    return null;
  };

  // Simular la lógica de getGloveStatus
  const getGloveStatus = (hand) => {
    return hand.attributes?.glove || false;
  };

  const currentRightHand = currentParts['HAND_RIGHT'];
  const currentRightType = getHandType(currentRightHand.id);
  const currentRightGlove = getGloveStatus(currentRightHand);

  console.log('🔍 Análisis de mano derecha actual:');
  console.log('  - ID:', currentRightHand.id);
  console.log('  - Tipo detectado:', currentRightType);
  console.log('  - Con guante:', currentRightGlove);
  console.log('  - Atributos:', JSON.stringify(currentRightHand.attributes, null, 2));

  // Simular manos compatibles para torso 02
  const compatibleRightHands = [
    {
      id: 'strong_hands_fist_01_t02_r_g',
      name: 'Right Fist (Gloved) (Torso 02)',
      category: 'HAND_RIGHT',
      archetype: 'STRONG',
      gltfPath: 'assets/strong/hands/strong_hands_fist_01_t02_r_g.glb',
      priceUSD: 0.6,
      compatible: ['strong_torso_02'],
      thumbnail: 'https://picsum.photos/seed/strong_hands_fist_01_t02_r_g/100/100',
      attributes: {
        "side": "right",
        "glove": true,
        "weapon": "fist"
      }
    },
    {
      id: 'strong_hands_fist_01_t02_r_ng',
      name: 'Right Fist (Ungloved) (Torso 02)',
      category: 'HAND_RIGHT',
      archetype: 'STRONG',
      gltfPath: 'assets/strong/hands/strong_hands_fist_01_t02_r_ng.glb',
      priceUSD: 0.5,
      compatible: ['strong_torso_02'],
      thumbnail: 'https://picsum.photos/seed/strong_hands_fist_01_t02_r_ng/100/100',
      attributes: {
        "side": "right",
        "glove": false,
        "weapon": "fist"
      }
    }
  ];

  console.log('📋 Manos derechas compatibles con torso 02:');
  compatibleRightHands.forEach(hand => {
    console.log(`  - ${hand.id} (tipo: ${getHandType(hand.id)}, guante: ${getGloveStatus(hand)})`);
  });

  // Simular findMatchingHand
  const findMatchingHand = (hands, targetType, targetGlove) => {
    console.log(`🔍 Buscando mano tipo "${targetType}" con guante: ${targetGlove}`);
    
    if (!targetType) {
      const result = hands.find(p => !p.attributes?.glove) || hands[0];
      console.log(`  - Sin tipo específico, usando primera sin guante: ${result?.id}`);
      return result;
    }
    
    let matchingHand = hands.find(p => {
      const handType = getHandType(p.id);
      const handGlove = p.attributes?.glove || false;
      const matches = handType === targetType && handGlove === targetGlove;
      console.log(`  - Probando ${p.id}: tipo=${handType}, guante=${handGlove}, coincide=${matches}`);
      return matches;
    });
    
    if (!matchingHand) {
      console.log(`  - No se encontró coincidencia exacta, buscando solo por tipo...`);
      matchingHand = hands.find(p => {
        const handType = getHandType(p.id);
        const matches = handType === targetType;
        console.log(`  - Probando ${p.id}: tipo=${handType}, coincide=${matches}`);
        return matches;
      });
    }
    
    if (!matchingHand) {
      console.log(`  - No se encontró por tipo, usando primera sin guante...`);
      matchingHand = hands.find(p => !p.attributes?.glove) || hands[0];
    }
    
    console.log(`  - Mano seleccionada: ${matchingHand?.id}`);
    return matchingHand;
  };

  const selectedRightHand = findMatchingHand(compatibleRightHands, currentRightType, currentRightGlove);
  
  console.log('\n🎯 RESULTADO FINAL:');
  console.log(`  - Mano derecha original: ${currentRightHand.id}`);
  console.log(`  - Mano derecha seleccionada: ${selectedRightHand?.id}`);
  console.log(`  - ¿Mantiene el tipo? ${getHandType(currentRightHand.id) === getHandType(selectedRightHand?.id)}`);
  console.log(`  - ¿Mantiene el estado de guante? ${getGloveStatus(currentRightHand) === getGloveStatus(selectedRightHand)}`);
}

debugRightHand(); 