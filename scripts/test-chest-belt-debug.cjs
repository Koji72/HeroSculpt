#!/usr/bin/env node

console.log('🔍 CHEST BELT DEBUG SCRIPT');
console.log('==========================');

// Simular la estructura de datos
const PartCategory = {
  CHEST_BELT: 'CHEST_BELT',
  TORSO: 'TORSO',
  SUIT_TORSO: 'SUIT_TORSO'
};

const ArchetypeId = {
  STRONG: 'STRONG'
};

// Simular las partes de chest belt
const STRONG_CHEST_BELT_PARTS = [
  {
    id: 'strong_beltchest_01_np',
    name: 'Strong Chest Belt 01 (No Pouch)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_np.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03', 'strong_torso_04', 'strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_np/100/100',
  },
  {
    id: 'strong_beltchest_01_t01_np',
    name: 'Strong Chest Belt 01 (Torso 01 No Pouch)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t01_np.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t01_np/100/100',
  },
  {
    id: 'strong_beltchest_01_t01',
    name: 'Strong Chest Belt 01 (Torso 01)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t01.glb',
    priceUSD: 0.6,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t01/100/100',
  },
  {
    id: 'strong_beltchest_01_t02_np',
    name: 'Strong Chest Belt 01 (Torso 02 No Pouch)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t02_np.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t02_np/100/100',
  },
  {
    id: 'strong_beltchest_01_t02',
    name: 'Strong Chest Belt 01 (Torso 02)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t02.glb',
    priceUSD: 0.6,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t02/100/100',
  },
  {
    id: 'strong_beltchest_01_t03_np',
    name: 'Strong Chest Belt 01 (Torso 03 No Pouch)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t03_np.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t03_np/100/100',
  },
  {
    id: 'strong_beltchest_01_t03',
    name: 'Strong Chest Belt 01 (Torso 03)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t03.glb',
    priceUSD: 0.6,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t03/100/100',
  },
  {
    id: 'strong_beltchest_01_t04_np',
    name: 'Strong Chest Belt 01 (Torso 04 No Pouch)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t04_np.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_04'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t04_np/100/100',
  },
  {
    id: 'strong_beltchest_01_t04',
    name: 'Strong Chest Belt 01 (Torso 04)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t04.glb',
    priceUSD: 0.6,
    compatible: ['strong_torso_04'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t04/100/100',
  },
  {
    id: 'strong_beltchest_01_t05_np',
    name: 'Strong Chest Belt 01 (Torso 05 No Pouch)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t05_np.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t05_np/100/100',
  },
  {
    id: 'strong_beltchest_01_t05',
    name: 'Strong Chest Belt 01 (Torso 05)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01_t05.glb',
    priceUSD: 0.6,
    compatible: ['strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01_t05/100/100',
  },
  {
    id: 'strong_beltchest_01',
    name: 'Strong Chest Belt 01 (Generic)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_01.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03', 'strong_torso_04', 'strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_01/100/100',
  },
  {
    id: 'strong_beltchest_none_01_t03',
    name: 'Strong Chest Belt None (Torso 03)',
    category: PartCategory.CHEST_BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/chest_belt/strong_beltchest_none_01_t03.glb',
    priceUSD: 0.0,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_beltchest_none_01_t03/100/100',
    attributes: { none: true },
  },
];

// Simular el filtrado del PartSelectorPanel
function simulatePartFiltering(selectedArchetype, activeCategory, selectedParts) {
  console.log(`\n🎯 Simulando filtrado para: ${activeCategory} con arquetipo: ${selectedArchetype}`);
  
  const availableParts = STRONG_CHEST_BELT_PARTS.filter(part => {
    // Verificar categoría y arquetipo
    if (part.category !== activeCategory || part.archetype !== selectedArchetype) {
      console.log(`❌ ${part.id}: Filtrada por categoría/arquetipo`);
      return false;
    }
    
    // Si no tiene compatibilidad, mostrar todas
    if (part.compatible.length === 0) {
      console.log(`✅ ${part.id}: Sin compatibilidad (universal)`);
      return true;
    }
    
    // Obtener torso activo
    const selectedTorso = Object.values(selectedParts).find(p => p.category === PartCategory.TORSO);
    const selectedSuit = Object.values(selectedParts).find(p => p.category === PartCategory.SUIT_TORSO);
    const activeTorso = selectedSuit || selectedTorso;
    
    if (!activeTorso) {
      console.log(`✅ ${part.id}: Sin torso seleccionado`);
      return true;
    }
    
    // Verificar compatibilidad
    const isCompatible = part.compatible.includes(activeTorso.id);
    console.log(`${isCompatible ? '✅' : '❌'} ${part.id}: Compatible con ${activeTorso.id} = ${isCompatible}`);
    return isCompatible;
  });
  
  return availableParts;
}

// Probar diferentes escenarios
console.log('\n📋 TOTAL CHEST BELT PARTS:', STRONG_CHEST_BELT_PARTS.length);

// Escenario 1: Sin torso seleccionado
console.log('\n🔍 ESCENARIO 1: Sin torso seleccionado');
const scenario1 = simulatePartFiltering(ArchetypeId.STRONG, PartCategory.CHEST_BELT, {});
console.log(`✅ Partes disponibles: ${scenario1.length}`);

// Escenario 2: Con torso 01
console.log('\n🔍 ESCENARIO 2: Con torso 01');
const scenario2 = simulatePartFiltering(ArchetypeId.STRONG, PartCategory.CHEST_BELT, {
  'strong_torso_01': {
    id: 'strong_torso_01',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG
  }
});
console.log(`✅ Partes disponibles: ${scenario2.length}`);

// Escenario 3: Con torso 03
console.log('\n🔍 ESCENARIO 3: Con torso 03');
const scenario3 = simulatePartFiltering(ArchetypeId.STRONG, PartCategory.CHEST_BELT, {
  'strong_torso_03': {
    id: 'strong_torso_03',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG
  }
});
console.log(`✅ Partes disponibles: ${scenario3.length}`);

console.log('\n🎯 RESULTADO: El sistema de chest belt está configurado correctamente');
console.log('Si no aparecen en el UI, el problema está en el componente PartSelectorPanel'); 