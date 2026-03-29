#!/usr/bin/env node

console.log('🧪 PRUEBA DE ADAPTACIÓN DE CAPAS AL CAMBIAR TORSO');
console.log('==================================================');

// Definir constantes manualmente
const PartCategory = {
  CAPE: 'CAPE',
  TORSO: 'TORSO'
};

const ArchetypeId = {
  STRONG: 'STRONG'
};

// Simular ALL_PARTS con capas y torsos
const ALL_PARTS = [
  // Torsos
  {
    id: 'strong_torso_01',
    name: 'Strong Torso 01',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/torso/strong_torso_01.glb',
    priceUSD: 1.5,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_torso_01/100/100',
  },
  {
    id: 'strong_torso_02',
    name: 'Strong Torso 02',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/torso/strong_torso_02.glb',
    priceUSD: 1.5,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_torso_02/100/100',
  },
  {
    id: 'strong_torso_03',
    name: 'Strong Torso 03',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/torso/strong_torso_03.glb',
    priceUSD: 1.5,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_torso_03/100/100',
  },
  // Capas
  {
    id: 'strong_cape_01_t01',
    name: 'Classic Cape (Torso 01)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_01_t01.glb',
    priceUSD: 0.35,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_01_t01/100/100',
  },
  {
    id: 'strong_cape_01_t02',
    name: 'Classic Cape (Torso 02)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_01_t02.glb',
    priceUSD: 0.35,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_01_t02/100/100',
  },
  {
    id: 'strong_cape_01_t03',
    name: 'Classic Cape (Torso 03)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_01_t03.glb',
    priceUSD: 0.35,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_01_t03/100/100',
  },
  {
    id: 'strong_cape_02_t01',
    name: 'Heroic Cape (Torso 01)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_02_t01.glb',
    priceUSD: 0.4,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_02_t01/100/100',
  },
  {
    id: 'strong_cape_02_t02',
    name: 'Heroic Cape (Torso 02)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_02_t02.glb',
    priceUSD: 0.4,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_02_t02/100/100',
  },
  {
    id: 'strong_cape_02_t03',
    name: 'Heroic Cape (Torso 03)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_02_t03.glb',
    priceUSD: 0.4,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_02_t03/100/100',
  }
];

// Simular la función assignAdaptiveCapeForTorso
function assignAdaptiveCapeForTorso(newTorso, currentParts, originalParts) {
  console.log('🔍 assignAdaptiveCapeForTorso called with:', { 
    newTorsoId: newTorso.id, 
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });
  
  let newParts = { ...currentParts };
  
  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  console.log('🔍 Parts to check for current cape:', Object.keys(partsToCheck));
  const currentCape = Object.values(partsToCheck).find(p => p.category === PartCategory.CAPE);
  console.log('🔍 Current cape found:', currentCape?.id || 'none');

  // Buscar todas las capas compatibles con el nuevo torso
  const compatibleCapes = ALL_PARTS.filter(p => 
    p.category === PartCategory.CAPE && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  console.log('✅ Compatible capes found:', compatibleCapes.length, 'capes for torso:', newTorso.id);
  console.log('✅ Compatible capes IDs:', compatibleCapes.map(c => c.id));

  // Si no hay capa actual, usar la primera compatible
  if (!currentCape) {
    if (compatibleCapes.length > 0) {
      console.log('📌 No current cape, using first compatible:', compatibleCapes[0].id);
      newParts[PartCategory.CAPE] = compatibleCapes[0];
    }
    return newParts;
  }

  // Verificar si la capa actual es compatible con el nuevo torso
  const isCurrentCapeCompatible = currentCape.compatible.includes(newTorso.id);
  
  if (isCurrentCapeCompatible) {
    console.log('✅ Current cape is compatible, keeping:', currentCape.id);
    // No hacer nada, mantener la capa actual
    return newParts;
  }

  // La capa actual no es compatible, buscar una del mismo tipo
  let currentType = null;
  const capeMatch = currentCape.id.match(/strong_cape_(\d+)_t\d+/);
  if (capeMatch) {
    currentType = capeMatch[1];
  }
  
  console.log('🎯 Current cape info:', { currentCapeId: currentCape.id, currentType, capeMatch: capeMatch ? capeMatch[0] : 'no match' });

  // Buscar una capa del mismo tipo que sea compatible
  if (currentType) {
    console.log('🔍 Looking for cape type:', currentType);
    const matchingCape = compatibleCapes.find(p => p.id.includes(`strong_cape_${currentType}_`));
    if (matchingCape) {
      console.log('🎯 Found matching cape type:', matchingCape.id);
      newParts[PartCategory.CAPE] = matchingCape;
      return newParts;
    } else {
      console.log('❌ No matching cape type found for type:', currentType);
    }
  }

  // Si no encuentra del mismo tipo, usar la primera compatible
  if (compatibleCapes.length > 0) {
    console.log('📌 No matching type found, using first compatible:', compatibleCapes[0].id);
    newParts[PartCategory.CAPE] = compatibleCapes[0];
  } else {
    console.log('❌ No compatible capes found for torso:', newTorso.id);
    // Limpiar capa si no hay compatibles
    delete newParts[PartCategory.CAPE];
  }

  return newParts;
}

// Función para probar adaptación de capas
function testCapeAdaptation() {
  console.log('\n🧪 PROBANDO ADAPTACIÓN DE CAPAS:');
  console.log('================================');
  
  // Caso 1: Cambiar de torso 01 a torso 02 con capa tipo 01
  console.log('\n📋 CASO 1: Torso 01 -> Torso 02 (Capa tipo 01)');
  console.log('------------------------------------------------');
  
  const torso01 = ALL_PARTS.find(p => p.id === 'strong_torso_01');
  const torso02 = ALL_PARTS.find(p => p.id === 'strong_torso_02');
  const cape01_t01 = ALL_PARTS.find(p => p.id === 'strong_cape_01_t01');
  
  const currentParts = {
    [PartCategory.TORSO]: torso01,
    [PartCategory.CAPE]: cape01_t01
  };
  
  console.log('Estado inicial:', {
    torso: currentParts[PartCategory.TORSO]?.id,
    cape: currentParts[PartCategory.CAPE]?.id
  });
  
  const adaptedParts = assignAdaptiveCapeForTorso(torso02, currentParts);
  
  console.log('Estado después de adaptación:', {
    torso: adaptedParts[PartCategory.TORSO]?.id,
    cape: adaptedParts[PartCategory.CAPE]?.id
  });
  
  // Caso 2: Cambiar de torso 02 a torso 03 con capa tipo 02
  console.log('\n📋 CASO 2: Torso 02 -> Torso 03 (Capa tipo 02)');
  console.log('------------------------------------------------');
  
  const cape02_t02 = ALL_PARTS.find(p => p.id === 'strong_cape_02_t02');
  const torso03 = ALL_PARTS.find(p => p.id === 'strong_torso_03');
  
  const currentParts2 = {
    [PartCategory.TORSO]: torso02,
    [PartCategory.CAPE]: cape02_t02
  };
  
  console.log('Estado inicial:', {
    torso: currentParts2[PartCategory.TORSO]?.id,
    cape: currentParts2[PartCategory.CAPE]?.id
  });
  
  const adaptedParts2 = assignAdaptiveCapeForTorso(torso03, currentParts2);
  
  console.log('Estado después de adaptación:', {
    torso: adaptedParts2[PartCategory.TORSO]?.id,
    cape: adaptedParts2[PartCategory.CAPE]?.id
  });
  
  // Caso 3: Cambiar de torso 01 a torso 03 con capa tipo 01
  console.log('\n📋 CASO 3: Torso 01 -> Torso 03 (Capa tipo 01)');
  console.log('------------------------------------------------');
  
  const currentParts3 = {
    [PartCategory.TORSO]: torso01,
    [PartCategory.CAPE]: cape01_t01
  };
  
  console.log('Estado inicial:', {
    torso: currentParts3[PartCategory.TORSO]?.id,
    cape: currentParts3[PartCategory.CAPE]?.id
  });
  
  const adaptedParts3 = assignAdaptiveCapeForTorso(torso03, currentParts3);
  
  console.log('Estado después de adaptación:', {
    torso: adaptedParts3[PartCategory.TORSO]?.id,
    cape: adaptedParts3[PartCategory.CAPE]?.id
  });
}

// Ejecutar pruebas
testCapeAdaptation();

console.log('\n🎊 PRUEBAS COMPLETADAS'); 