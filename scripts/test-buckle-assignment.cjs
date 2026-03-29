console.log('🔍 Testing buckle assignment logic...');

// Simular las constantes necesarias
const PartCategory = {
  BELT: 'BELT',
  BUCKLE: 'BUCKLE'
};

const ArchetypeId = {
  STRONG: 'STRONG'
};

// Simular ALL_PARTS con buckles
const ALL_PARTS = [
  {
    id: 'strong_belt_01',
    name: 'Strong Belt Alpha',
    category: PartCategory.BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/belt/strong_belt_01.glb',
    priceUSD: 0.30,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_belt_01/100/100',
  },
  {
    id: 'strong_belt_02',
    name: 'Strong Belt Beta',
    category: PartCategory.BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/belt/strong_belt_02.glb',
    priceUSD: 0.35,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_belt_02/100/100',
  },
  {
    id: 'strong_buckle_01',
    name: 'Classic Buckle',
    category: PartCategory.BUCKLE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/buckle/strong_buckle_01.glb',
    priceUSD: 0.10,
    compatible: ['strong_belt_01', 'strong_belt_02'],
    thumbnail: 'https://picsum.photos/seed/strong_buckle_01/100/100',
  },
  {
    id: 'strong_buckle_02',
    name: 'Heroic Buckle',
    category: PartCategory.BUCKLE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/buckle/strong_buckle_02.glb',
    priceUSD: 0.12,
    compatible: ['strong_belt_01', 'strong_belt_02'],
    thumbnail: 'https://picsum.photos/seed/strong_buckle_02/100/100',
  },
  {
    id: 'strong_buckle_03',
    name: 'Tactical Buckle',
    category: PartCategory.BUCKLE,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/buckle/strong_buckle_03.glb',
    priceUSD: 0.15,
    compatible: ['strong_belt_01', 'strong_belt_02'],
    thumbnail: 'https://picsum.photos/seed/strong_buckle_03/100/100',
  }
];

// Simular la función assignAdaptiveBuckleForBelt
function assignAdaptiveBuckleForBelt(newBelt, currentParts, originalParts) {
  console.log('🔍 assignAdaptiveBuckleForBelt called with:', { 
    newBeltId: newBelt.id, 
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });
  
  let newParts = { ...currentParts };
  
  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  console.log('🔍 Parts to check for current buckle:', Object.keys(partsToCheck));
  const currentBuckle = Object.values(partsToCheck).find(p => p.category === PartCategory.BUCKLE);
  console.log('🔍 Current buckle found:', currentBuckle?.id || 'none');
  
  // Si no hay buckle actual, usar el primero compatible
  if (!currentBuckle) {
    const compatibleBuckles = ALL_PARTS.filter(p => 
      p.category === PartCategory.BUCKLE && 
      p.archetype === newBelt.archetype &&
      p.compatible.includes(newBelt.id)
    );
    
    if (compatibleBuckles.length > 0) {
      console.log('📌 No current buckle, using first compatible:', compatibleBuckles[0].id);
      newParts[PartCategory.BUCKLE] = compatibleBuckles[0];
    }
    return newParts;
  }
  
  // Verificar si el buckle actual es compatible con el nuevo belt
  const isCurrentBuckleCompatible = currentBuckle.compatible.includes(newBelt.id);
  
  if (isCurrentBuckleCompatible) {
    console.log('✅ Current buckle is compatible, keeping:', currentBuckle.id);
    // No hacer nada, mantener el buckle actual
    return newParts;
  }
  
  // El buckle actual no es compatible, buscar uno del mismo tipo
  let currentType = null;
  const buckleMatch = currentBuckle.id.match(/strong_buckle_(\d+)/);
  if (buckleMatch) {
    currentType = buckleMatch[1];
  }
  
  console.log('🎯 Current buckle info:', { 
    currentBuckleId: currentBuckle.id, 
    currentType, 
    buckleMatch: buckleMatch ? buckleMatch[0] : 'no match' 
  });
  
  const compatibleBuckles = ALL_PARTS.filter(p => 
    p.category === PartCategory.BUCKLE && 
    p.archetype === newBelt.archetype &&
    p.compatible.includes(newBelt.id)
  );
  
  console.log('✅ Compatible buckles found:', compatibleBuckles.length, 'buckles for belt:', newBelt.id);
  console.log('✅ Compatible buckles IDs:', compatibleBuckles.map(b => b.id));
  
  // Buscar un buckle del mismo tipo
  if (currentType) {
    console.log('🔍 Looking for buckle type:', currentType);
    const matchingBuckle = compatibleBuckles.find(p => p.id.includes(`strong_buckle_${currentType}`));
    if (matchingBuckle) {
      console.log('🎯 Found matching buckle type:', matchingBuckle.id);
      newParts[PartCategory.BUCKLE] = matchingBuckle;
      return newParts;
    } else {
      console.log('❌ No matching buckle type found for type:', currentType);
    }
  }
  
  // Si no encuentra del mismo tipo, usar el primero compatible
  if (compatibleBuckles.length > 0) {
    console.log('📌 No matching type found, using first compatible:', compatibleBuckles[0].id);
    newParts[PartCategory.BUCKLE] = compatibleBuckles[0];
  } else {
    console.log('❌ No compatible buckles found for belt:', newBelt.id);
    // Limpiar buckle si no hay compatibles
    delete newParts[PartCategory.BUCKLE];
  }
  
  return newParts;
}

// Test 1: Sin buckle actual, seleccionar belt
console.log('\n🧪 TEST 1: Sin buckle actual, seleccionar belt');
const test1Parts = {};
const test1Belt = ALL_PARTS.find(p => p.id === 'strong_belt_01');
const result1 = assignAdaptiveBuckleForBelt(test1Belt, test1Parts);
console.log('Result:', result1);

// Test 2: Con buckle compatible, cambiar belt
console.log('\n🧪 TEST 2: Con buckle compatible, cambiar belt');
const test2Parts = {
  [PartCategory.BUCKLE]: ALL_PARTS.find(p => p.id === 'strong_buckle_01'),
  [PartCategory.BELT]: ALL_PARTS.find(p => p.id === 'strong_belt_01')
};
const test2Belt = ALL_PARTS.find(p => p.id === 'strong_belt_02');
const result2 = assignAdaptiveBuckleForBelt(test2Belt, test2Parts);
console.log('Result:', result2);

// Test 3: Con buckle incompatible, cambiar belt
console.log('\n🧪 TEST 3: Con buckle incompatible, cambiar belt');
const test3Parts = {
  [PartCategory.BUCKLE]: ALL_PARTS.find(p => p.id === 'strong_buckle_01'),
  [PartCategory.BELT]: ALL_PARTS.find(p => p.id === 'strong_belt_01')
};
const test3Belt = ALL_PARTS.find(p => p.id === 'strong_belt_02');
const result3 = assignAdaptiveBuckleForBelt(test3Belt, test3Parts);
console.log('Result:', result3);

console.log('\n✅ Buckle assignment test completed'); 