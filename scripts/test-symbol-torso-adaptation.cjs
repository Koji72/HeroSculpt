#!/usr/bin/env node

console.log('🧪 PRUEBA DE ADAPTACIÓN DE SÍMBOLOS AL CAMBIAR TORSO');
console.log('====================================================');

// Definir constantes manualmente
const PartCategory = {
  SYMBOL: 'SYMBOL',
  TORSO: 'TORSO'
};

const ArchetypeId = {
  STRONG: 'STRONG'
};

// Simular ALL_PARTS con símbolos y torsos
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
  // Símbolos
  {
    id: 'strong_symbol_01_t01',
    name: 'Classic Symbol (Torso 01)',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/symbol/strong_symbol_01_t01.glb',
    priceUSD: 0.25,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_symbol_01_t01/100/100',
  },
  {
    id: 'strong_symbol_01_t02',
    name: 'Classic Symbol (Torso 02)',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/symbol/strong_symbol_01_t02.glb',
    priceUSD: 0.25,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_symbol_01_t02/100/100',
  },
  {
    id: 'strong_symbol_01_t03',
    name: 'Classic Symbol (Torso 03)',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/symbol/strong_symbol_01_t03.glb',
    priceUSD: 0.25,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_symbol_01_t03/100/100',
  },
  {
    id: 'strong_symbol_02_t01',
    name: 'Heroic Symbol (Torso 01)',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/symbol/strong_symbol_02_t01.glb',
    priceUSD: 0.3,
    compatible: ['strong_torso_01'],
    thumbnail: 'https://picsum.photos/seed/strong_symbol_02_t01/100/100',
  },
  {
    id: 'strong_symbol_02_t02',
    name: 'Heroic Symbol (Torso 02)',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/symbol/strong_symbol_02_t02.glb',
    priceUSD: 0.3,
    compatible: ['strong_torso_02'],
    thumbnail: 'https://picsum.photos/seed/strong_symbol_02_t02/100/100',
  },
  {
    id: 'strong_symbol_02_t03',
    name: 'Heroic Symbol (Torso 03)',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/symbol/strong_symbol_02_t03.glb',
    priceUSD: 0.3,
    compatible: ['strong_torso_03'],
    thumbnail: 'https://picsum.photos/seed/strong_symbol_02_t03/100/100',
  }
];

// Simular la función assignAdaptiveSymbolForTorso
function assignAdaptiveSymbolForTorso(newTorso, currentParts, originalParts) {
  console.log('🔍 assignAdaptiveSymbolForTorso called with:', { 
    newTorsoId: newTorso.id, 
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });
  
  let newParts = { ...currentParts };
  
  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  console.log('🔍 Parts to check for current symbol:', Object.keys(partsToCheck));
  const currentSymbol = Object.values(partsToCheck).find(p => p.category === PartCategory.SYMBOL);
  console.log('🔍 Current symbol found:', currentSymbol?.id || 'none');
  
  // Si no hay símbolo actual, usar el primero compatible
  if (!currentSymbol) {
    const compatibleSymbols = ALL_PARTS.filter(p => 
      p.category === PartCategory.SYMBOL && 
      p.archetype === newTorso.archetype &&
      p.compatible.includes(newTorso.id)
    );
    
    if (compatibleSymbols.length > 0) {
      console.log('📌 No current symbol, using first compatible:', compatibleSymbols[0].id);
      newParts[PartCategory.SYMBOL] = compatibleSymbols[0];
    }
    return newParts;
  }
  
  // Verificar si el símbolo actual es compatible con el nuevo torso
  const isCurrentSymbolCompatible = currentSymbol.compatible.includes(newTorso.id);
  
  if (isCurrentSymbolCompatible) {
    console.log('✅ Current symbol is compatible, keeping:', currentSymbol.id);
    // No hacer nada, mantener el símbolo actual
    return newParts;
  }
  
  // El símbolo actual no es compatible, buscar uno del mismo tipo
  let currentType = null;
  const symbolMatch = currentSymbol.id.match(/strong_symbol_(\d+)_t\d+/);
  if (symbolMatch) {
    currentType = symbolMatch[1];
  }
  
  console.log('🎯 Current symbol info:', { currentSymbolId: currentSymbol.id, currentType, symbolMatch: symbolMatch ? symbolMatch[0] : 'no match' });
  
  const compatibleSymbols = ALL_PARTS.filter(p => 
    p.category === PartCategory.SYMBOL && 
    p.archetype === newTorso.archetype &&
    p.compatible.includes(newTorso.id)
  );
  
  console.log('✅ Compatible symbols found:', compatibleSymbols.length, 'symbols for torso:', newTorso.id);
  console.log('✅ Compatible symbols IDs:', compatibleSymbols.map(s => s.id));
  
  // Buscar un símbolo del mismo tipo
  if (currentType) {
    console.log('🔍 Looking for symbol type:', currentType);
    const matchingSymbol = compatibleSymbols.find(p => p.id.includes(`strong_symbol_${currentType}_`));
    if (matchingSymbol) {
      console.log('🎯 Found matching symbol type:', matchingSymbol.id);
      newParts[PartCategory.SYMBOL] = matchingSymbol;
      return newParts;
    } else {
      console.log('❌ No matching symbol type found for type:', currentType);
    }
  }
  
  // Si no encuentra del mismo tipo, usar el primero compatible
  if (compatibleSymbols.length > 0) {
    console.log('📌 No matching type found, using first compatible:', compatibleSymbols[0].id);
    newParts[PartCategory.SYMBOL] = compatibleSymbols[0];
  } else {
    console.log('❌ No compatible symbols found for torso:', newTorso.id);
    // Limpiar símbolo si no hay compatibles
    delete newParts[PartCategory.SYMBOL];
  }
  
  return newParts;
}

// Función para probar adaptación de símbolos
function testSymbolAdaptation() {
  console.log('\n🧪 PROBANDO ADAPTACIÓN DE SÍMBOLOS:');
  console.log('===================================');
  
  // Caso 1: Cambiar de torso 01 a torso 02 con símbolo tipo 01
  console.log('\n📋 CASO 1: Torso 01 -> Torso 02 (Símbolo tipo 01)');
  console.log('--------------------------------------------------');
  
  const torso01 = ALL_PARTS.find(p => p.id === 'strong_torso_01');
  const torso02 = ALL_PARTS.find(p => p.id === 'strong_torso_02');
  const symbol01_t01 = ALL_PARTS.find(p => p.id === 'strong_symbol_01_t01');
  
  const currentParts = {
    [PartCategory.TORSO]: torso01,
    [PartCategory.SYMBOL]: symbol01_t01
  };
  
  console.log('Estado inicial:', {
    torso: currentParts[PartCategory.TORSO]?.id,
    symbol: currentParts[PartCategory.SYMBOL]?.id
  });
  
  const adaptedParts = assignAdaptiveSymbolForTorso(torso02, currentParts);
  
  console.log('Estado después de adaptación:', {
    torso: adaptedParts[PartCategory.TORSO]?.id,
    symbol: adaptedParts[PartCategory.SYMBOL]?.id
  });
  
  // Caso 2: Cambiar de torso 02 a torso 03 con símbolo tipo 02
  console.log('\n📋 CASO 2: Torso 02 -> Torso 03 (Símbolo tipo 02)');
  console.log('--------------------------------------------------');
  
  const symbol02_t02 = ALL_PARTS.find(p => p.id === 'strong_symbol_02_t02');
  const torso03 = ALL_PARTS.find(p => p.id === 'strong_torso_03');
  
  const currentParts2 = {
    [PartCategory.TORSO]: torso02,
    [PartCategory.SYMBOL]: symbol02_t02
  };
  
  console.log('Estado inicial:', {
    torso: currentParts2[PartCategory.TORSO]?.id,
    symbol: currentParts2[PartCategory.SYMBOL]?.id
  });
  
  const adaptedParts2 = assignAdaptiveSymbolForTorso(torso03, currentParts2);
  
  console.log('Estado después de adaptación:', {
    torso: adaptedParts2[PartCategory.TORSO]?.id,
    symbol: adaptedParts2[PartCategory.SYMBOL]?.id
  });
  
  // Caso 3: Cambiar de torso 01 a torso 03 con símbolo tipo 01
  console.log('\n📋 CASO 3: Torso 01 -> Torso 03 (Símbolo tipo 01)');
  console.log('--------------------------------------------------');
  
  const currentParts3 = {
    [PartCategory.TORSO]: torso01,
    [PartCategory.SYMBOL]: symbol01_t01
  };
  
  console.log('Estado inicial:', {
    torso: currentParts3[PartCategory.TORSO]?.id,
    symbol: currentParts3[PartCategory.SYMBOL]?.id
  });
  
  const adaptedParts3 = assignAdaptiveSymbolForTorso(torso03, currentParts3);
  
  console.log('Estado después de adaptación:', {
    torso: adaptedParts3[PartCategory.TORSO]?.id,
    symbol: adaptedParts3[PartCategory.SYMBOL]?.id
  });
}

// Ejecutar pruebas
testSymbolAdaptation();

console.log('\n🎊 PRUEBAS COMPLETADAS'); 