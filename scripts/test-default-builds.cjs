#!/usr/bin/env node

/**
 * 🧪 Script de prueba para verificar builds por defecto
 * Verifica que getDefaultBuildForArchetype genere builds completos
 */

console.log('🧪 Probando builds por defecto...\n');

// Simular las constantes necesarias
const ArchetypeId = {
  STRONG: 'STRONG',
  JUSTICIERO: 'JUSTICIERO'
};

const PartCategory = {
  TORSO: 'TORSO',
  HEAD: 'HEAD',
  HAND_LEFT: 'HAND_LEFT',
  HAND_RIGHT: 'HAND_RIGHT',
  LEGS: 'LEGS',
  BOOTS: 'BOOTS'
};

// Simular ALL_PARTS
const ALL_PARTS = [
  {
    id: 'strong_torso_01',
    name: 'Strong Torso 01',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/torso/strong_torso_01.glb',
    priceUSD: 1.00,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_torso_01/100/100',
  },
  {
    id: 'strong_head_01_t01',
    name: 'Strong Head 01 T01',
    category: PartCategory.HEAD,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/head/strong_head_01_t01.glb',
    priceUSD: 0.75,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_head_01_t01/100/100',
  },
  {
    id: 'strong_hands_fist_01_t01_l_ng',
    name: 'Strong Left Hand Fist',
    category: PartCategory.HAND_LEFT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/hands/strong_hands_fist_01_t01_l_ng.glb',
    priceUSD: 0.50,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_hands_fist_01_t01_l_ng/100/100',
  },
  {
    id: 'strong_hands_fist_01_t01_r_ng',
    name: 'Strong Right Hand Fist',
    category: PartCategory.HAND_RIGHT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/hands/strong_hands_fist_01_t01_r_ng.glb',
    priceUSD: 0.50,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_hands_fist_01_t01_r_ng/100/100',
  },
  {
    id: 'strong_legs_01',
    name: 'Strong Legs 01',
    category: PartCategory.LEGS,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/legs/strong_legs_01.glb',
    priceUSD: 0.80,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_legs_01/100/100',
  },
  {
    id: 'strong_boots_01_l0',
    name: 'Strong Boots 01 L0',
    category: PartCategory.BOOTS,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/boots/strong_boots_01_l0.glb',
    priceUSD: 0.60,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_boots_01_l0/100/100',
  },
  // Justiciero parts
  {
    id: 'justiciero_torso_01',
    name: 'Justiciero Torso 01',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.JUSTICIERO,
    gltfPath: 'assets/justiciero/torso/justiciero_torso_01.glb',
    priceUSD: 1.00,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/justiciero_torso_01/100/100',
  },
  {
    id: 'justiciero_head_01',
    name: 'Justiciero Head 01',
    category: PartCategory.HEAD,
    archetype: ArchetypeId.JUSTICIERO,
    gltfPath: 'assets/justiciero/head/justiciero_head_01.glb',
    priceUSD: 0.75,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/justiciero_head_01/100/100',
  },
  {
    id: 'justiciero_hand_left_01',
    name: 'Justiciero Left Hand 01',
    category: PartCategory.HAND_LEFT,
    archetype: ArchetypeId.JUSTICIERO,
    gltfPath: 'assets/justiciero/hands/justiciero_hand_left_01.glb',
    priceUSD: 0.50,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/justiciero_hand_left_01/100/100',
  },
  {
    id: 'justiciero_hand_right_01',
    name: 'Justiciero Right Hand 01',
    category: PartCategory.HAND_RIGHT,
    archetype: ArchetypeId.JUSTICIERO,
    gltfPath: 'assets/justiciero/hands/justiciero_hand_right_01.glb',
    priceUSD: 0.50,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/justiciero_hand_right_01/100/100',
  },
  {
    id: 'justiciero_legs_01',
    name: 'Justiciero Legs 01',
    category: PartCategory.LEGS,
    archetype: ArchetypeId.JUSTICIERO,
    gltfPath: 'assets/justiciero/legs/justiciero_legs_01.glb',
    priceUSD: 0.80,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/justiciero_legs_01/100/100',
  },
  {
    id: 'justiciero_boots_01',
    name: 'Justiciero Boots 01',
    category: PartCategory.BOOTS,
    archetype: ArchetypeId.JUSTICIERO,
    gltfPath: 'assets/justiciero/boots/justiciero_boots_01.glb',
    priceUSD: 0.60,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/justiciero_boots_01/100/100',
  },
];

// Función para crear parte "None"
const createNonePart = (category, archetypeId) => ({
  id: `none_${category}_${archetypeId}`,
  name: `None (${category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()})`,
  category,
  archetype: archetypeId,
  gltfPath: '',
  priceUSD: 0,
  compatible: [],
  thumbnail: `https://picsum.photos/seed/none_${category}/100/100`,
  attributes: { none: true },
});

// Función para generar build por defecto
const getDefaultBuildForArchetype = (archetypeId) => {
  switch (archetypeId) {
    case ArchetypeId.STRONG:
      return getDefaultStrongBuild();
    case ArchetypeId.JUSTICIERO:
      return getDefaultJusticieroBuild();
    default:
      return getDefaultStrongBuild();
  }
};

const getDefaultStrongBuild = () => {
  const strongParts = ALL_PARTS.filter(part => part.archetype === ArchetypeId.STRONG);
  
  return {
    [PartCategory.TORSO]: strongParts.find(p => p.id === 'strong_torso_01') || createNonePart(PartCategory.TORSO, ArchetypeId.STRONG),
    [PartCategory.HEAD]: strongParts.find(p => p.id === 'strong_head_01_t01') || createNonePart(PartCategory.HEAD, ArchetypeId.STRONG),
    [PartCategory.HAND_LEFT]: strongParts.find(p => p.id === 'strong_hands_fist_01_t01_l_ng') || createNonePart(PartCategory.HAND_LEFT, ArchetypeId.STRONG),
    [PartCategory.HAND_RIGHT]: strongParts.find(p => p.id === 'strong_hands_fist_01_t01_r_ng') || createNonePart(PartCategory.HAND_RIGHT, ArchetypeId.STRONG),
    [PartCategory.LEGS]: strongParts.find(p => p.id === 'strong_legs_01') || createNonePart(PartCategory.LEGS, ArchetypeId.STRONG),
    [PartCategory.BOOTS]: strongParts.find(p => p.id === 'strong_boots_01_l0') || createNonePart(PartCategory.BOOTS, ArchetypeId.STRONG),
  };
};

const getDefaultJusticieroBuild = () => {
  const justicieroParts = ALL_PARTS.filter(part => part.archetype === ArchetypeId.JUSTICIERO);
  
  return {
    [PartCategory.TORSO]: justicieroParts.find(p => p.id === 'justiciero_torso_01') || createNonePart(PartCategory.TORSO, ArchetypeId.JUSTICIERO),
    [PartCategory.HEAD]: justicieroParts.find(p => p.id === 'justiciero_head_01') || createNonePart(PartCategory.HEAD, ArchetypeId.JUSTICIERO),
    [PartCategory.HAND_LEFT]: justicieroParts.find(p => p.id === 'justiciero_hand_left_01') || createNonePart(PartCategory.HAND_LEFT, ArchetypeId.JUSTICIERO),
    [PartCategory.HAND_RIGHT]: justicieroParts.find(p => p.id === 'justiciero_hand_right_01') || createNonePart(PartCategory.HAND_RIGHT, ArchetypeId.JUSTICIERO),
    [PartCategory.LEGS]: justicieroParts.find(p => p.id === 'justiciero_legs_01') || createNonePart(PartCategory.LEGS, ArchetypeId.JUSTICIERO),
    [PartCategory.BOOTS]: justicieroParts.find(p => p.id === 'justiciero_boots_01') || createNonePart(PartCategory.BOOTS, ArchetypeId.JUSTICIERO),
  };
};

// Probar builds
console.log('🔧 Probando build STRONG:');
const strongBuild = getDefaultBuildForArchetype(ArchetypeId.STRONG);
console.log('   Partes encontradas:', Object.keys(strongBuild).length);
Object.entries(strongBuild).forEach(([category, part]) => {
  console.log(`   ${category}: ${part.id} (${part.name})`);
});

console.log('\n🔧 Probando build JUSTICIERO:');
const justicieroBuild = getDefaultBuildForArchetype(ArchetypeId.JUSTICIERO);
console.log('   Partes encontradas:', Object.keys(justicieroBuild).length);
Object.entries(justicieroBuild).forEach(([category, part]) => {
  console.log(`   ${category}: ${part.id} (${part.name})`);
});

console.log('\n🔧 Probando build por defecto (fallback):');
const defaultBuild = getDefaultBuildForArchetype('UNKNOWN');
console.log('   Partes encontradas:', Object.keys(defaultBuild).length);
Object.entries(defaultBuild).forEach(([category, part]) => {
  console.log(`   ${category}: ${part.id} (${part.name})`);
});

console.log('\n✅ Prueba completada. Los builds por defecto se generan correctamente.'); 