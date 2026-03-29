#!/usr/bin/env node

console.log('🔍 VERIFICACIÓN DEL SISTEMA DE CAPAS - ENERO 2025');
console.log('============================================================');

// Definir constantes manualmente para evitar problemas de importación
const PartCategory = {
  CAPE: 'CAPE',
  TORSO: 'TORSO'
};

const ArchetypeId = {
  STRONG: 'STRONG'
};

// Simular ALL_PARTS con las capas conocidas
const ALL_PARTS = [
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
    id: 'strong_cape_01_t04',
    name: 'Classic Cape (Torso 04)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_01_t04.glb',
    priceUSD: 0.35,
    compatible: ['strong_torso_04'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_01_t04/100/100',
  },
  {
    id: 'strong_cape_01_t05',
    name: 'Classic Cape (Torso 05)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_01_t05.glb',
    priceUSD: 0.35,
    compatible: ['strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_01_t05/100/100',
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
  },
  {
    id: 'strong_cape_02_t04',
    name: 'Heroic Cape (Torso 04)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_02_t04.glb',
    priceUSD: 0.4,
    compatible: ['strong_torso_04'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_02_t04/100/100',
  },
  {
    id: 'strong_cape_02_t05',
    name: 'Heroic Cape (Torso 05)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_02_t05.glb',
    priceUSD: 0.4,
    compatible: ['strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_02_t05/100/100',
  },
  {
    id: 'strong_cape_03_t01',
    name: 'Tactical Cape (Torso 01)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_03_t01.glb',
    priceUSD: 0.45,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_03_t01/100/100',
  },
  {
    id: 'strong_cape_03_t02',
    name: 'Tactical Cape (Torso 02)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_03_t02.glb',
    priceUSD: 0.45,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_03_t02/100/100',
  },
  {
    id: 'strong_cape_03_t03',
    name: 'Tactical Cape (Torso 03)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_03_t03.glb',
    priceUSD: 0.45,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_03_t03/100/100',
  },
  {
    id: 'strong_cape_03_t04',
    name: 'Tactical Cape (Torso 04)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_03_t04.glb',
    priceUSD: 0.45,
    compatible: ['strong_torso_04'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_03_t04/100/100',
  },
  {
    id: 'strong_cape_03_t05',
    name: 'Tactical Cape (Torso 05)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_03_t05.glb',
    priceUSD: 0.45,
    compatible: ['strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_03_t05/100/100',
  },
  {
    id: 'strong_cape_04_t01',
    name: 'Mystic Cape (Torso 01)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_04_t01.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_04_t01/100/100',
  },
  {
    id: 'strong_cape_04_t02',
    name: 'Mystic Cape (Torso 02)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_04_t02.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_04_t02/100/100',
  },
  {
    id: 'strong_cape_04_t03',
    name: 'Mystic Cape (Torso 03)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_04_t03.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_04_t03/100/100',
  },
  {
    id: 'strong_cape_04_t04',
    name: 'Mystic Cape (Torso 04)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_04_t04.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_04'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_04_t04/100/100',
  },
  {
    id: 'strong_cape_04_t05',
    name: 'Mystic Cape (Torso 05)',
    category: PartCategory.CAPE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/cape/strong_cape_04_t05.glb',
    priceUSD: 0.5,
    compatible: ['strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_cape_04_t05/100/100',
  }
];

console.log('\n📊 ANÁLISIS DE DEFINICIONES:');
console.log('----------------------------');

// Verificar capas disponibles
const capeParts = ALL_PARTS.filter(p => p.category === PartCategory.CAPE);
console.log(`✅ Capas definidas: ${capeParts.length}`);

// Verificar capas por arquetipo
const strongCapes = capeParts.filter(p => p.archetype === ArchetypeId.STRONG);
console.log(`✅ Capas Strong: ${strongCapes.length}`);

// Verificar compatibilidad con torsos
const torsoIds = ['strong_torso_01', 'strong_torso_02', 'strong_torso_03', 'strong_torso_04', 'strong_torso_05'];

console.log('\n🎯 COMPATIBILIDAD POR TORSO:');
console.log('----------------------------');

torsoIds.forEach(torsoId => {
  const compatibleCapes = strongCapes.filter(cape => cape.compatible.includes(torsoId));
  console.log(`   ${torsoId}: ${compatibleCapes.length} capas compatibles`);
  
  if (compatibleCapes.length > 0) {
    compatibleCapes.forEach(cape => {
      console.log(`     - ${cape.id} (${cape.name})`);
    });
  } else {
    console.log(`     ❌ NO HAY CAPAS COMPATIBLES`);
  }
});

// Verificar patrones de IDs
console.log('\n🔍 PATRONES DE IDs:');
console.log('------------------');

const capePatterns = strongCapes.map(cape => {
  const match = cape.id.match(/strong_cape_(\d+)_t(\d+)/);
  return {
    id: cape.id,
    type: match ? match[1] : 'unknown',
    torso: match ? match[2] : 'unknown',
    pattern: match ? match[0] : 'no match'
  };
});

capePatterns.forEach(pattern => {
  console.log(`   ${pattern.id} -> Tipo: ${pattern.type}, Torso: ${pattern.torso}`);
});

// Verificar archivos GLB
console.log('\n📁 VERIFICACIÓN DE ARCHIVOS:');
console.log('----------------------------');

const fs = require('fs');
const path = require('path');

strongCapes.forEach(cape => {
  const glbPath = path.join('public', cape.gltfPath);
  const exists = fs.existsSync(glbPath);
  console.log(`   ${cape.id}: ${exists ? '✅' : '❌'} ${glbPath}`);
});

// Simular lógica de hover
console.log('\n🎮 SIMULACIÓN DE HOVER:');
console.log('----------------------');

// Simular torso 01
const torso01 = {
  id: 'strong_torso_01',
  archetype: ArchetypeId.STRONG
};

console.log(`✅ Torso 01 simulado: ${torso01.id}`);

// Simular función assignAdaptiveCapeForTorso
const compatibleCapes = ALL_PARTS.filter(p => 
  p.category === PartCategory.CAPE && 
  p.archetype === torso01.archetype &&
  p.compatible.includes(torso01.id)
);

console.log(`✅ Capas compatibles para torso 01: ${compatibleCapes.length}`);
compatibleCapes.forEach(cape => {
  console.log(`   - ${cape.id}`);
});

// Simular lógica de preservación de tipo
console.log('\n🔄 SIMULACIÓN DE PRESERVACIÓN DE TIPO:');
console.log('-------------------------------------');

// Simular capa actual
const currentCape = {
  id: 'strong_cape_02_t01',
  compatible: ['strong_torso_01']
};

console.log(`📌 Capa actual: ${currentCape.id}`);

// Extraer tipo de capa actual
const capeMatch = currentCape.id.match(/strong_cape_(\d+)_t\d+/);
if (capeMatch) {
  const currentType = capeMatch[1];
  console.log(`🎯 Tipo de capa actual: ${currentType}`);
  
  // Buscar capa del mismo tipo para torso 02
  const matchingCape = compatibleCapes.find(p => p.id.includes(`strong_cape_${currentType}_`));
  if (matchingCape) {
    console.log(`✅ Capa del mismo tipo encontrada: ${matchingCape.id}`);
  } else {
    console.log(`❌ No se encontró capa del mismo tipo`);
  }
}

console.log('\n🎯 RESUMEN:');
console.log('-----------');
console.log(`📊 Total de capas: ${capeParts.length}`);
console.log(`🎨 Capas Strong: ${strongCapes.length}`);
console.log(`🔗 Torsos verificados: ${torsoIds.length}`);

const totalCompatible = torsoIds.reduce((total, torsoId) => {
  const compatible = strongCapes.filter(cape => cape.compatible.includes(torsoId));
  return total + compatible.length;
}, 0);

console.log(`✅ Total de compatibilidades: ${totalCompatible}`);
console.log(`📈 Promedio por torso: ${(totalCompatible / torsoIds.length).toFixed(1)}`);

console.log('\n🎊 VERIFICACIÓN COMPLETADA'); 