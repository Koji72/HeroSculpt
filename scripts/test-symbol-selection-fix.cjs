#!/usr/bin/env node

/**
 * Script de prueba para verificar la lógica de selección de símbolos
 * Verifica que los símbolos se adapten correctamente al cambiar torso
 */

console.log('🧪 TESTING SYMBOL SELECTION LOGIC');
console.log('=====================================\n');

// Simular las constantes necesarias
const PartCategory = {
  TORSO: 'TORSO',
  SUIT_TORSO: 'SUIT_TORSO',
  SYMBOL: 'SYMBOL'
};

const ArchetypeId = {
  STRONG: 'STRONG'
};

// Simular ALL_PARTS con símbolos
const ALL_PARTS = [
  // Torsos
  {
    id: 'strong_torso_01',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01']
  },
  {
    id: 'strong_torso_02',
    category: PartCategory.TORSO,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_02']
  },
  // Símbolos para torso 01
  {
    id: 'strong_symbol_01_t01',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01']
  },
  {
    id: 'strong_symbol_02_t01',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_01']
  },
  // Símbolos para torso 02
  {
    id: 'strong_symbol_01_t02',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_02']
  },
  {
    id: 'strong_symbol_02_t02',
    category: PartCategory.SYMBOL,
    archetype: ArchetypeId.STRONG,
    compatible: ['strong_torso_02']
  }
];

// Simular la lógica de selección de símbolos
function testSymbolSelection(symbolId, currentTorsoId) {
  console.log(`🔍 Testing symbol selection: ${symbolId} with torso: ${currentTorsoId}`);
  
  const selectedSymbol = ALL_PARTS.find(p => p.id === symbolId);
  const currentTorso = ALL_PARTS.find(p => p.id === currentTorsoId);
  
  if (!selectedSymbol || !currentTorso) {
    console.log('❌ Symbol or torso not found');
    return null;
  }
  
  // Check if the selected symbol is compatible with current torso
  const isCompatible = selectedSymbol.compatible.includes(currentTorso.id);
  
  if (isCompatible) {
    console.log('✅ Symbol is compatible with current torso');
    return selectedSymbol;
  } else {
    console.log('⚠️ Symbol not compatible, finding compatible alternative');
    
    // Find compatible symbol of the same type
    const currentType = selectedSymbol.id.match(/strong_symbol_(\d+)_t\d+/)?.[1];
    let compatibleSymbol = null;
    
    if (currentType) {
      compatibleSymbol = ALL_PARTS.find(p => 
        p.category === PartCategory.SYMBOL &&
        p.archetype === currentTorso.archetype &&
        p.compatible.includes(currentTorso.id) &&
        p.id.includes(`strong_symbol_${currentType}_`)
      );
    }
    
    if (compatibleSymbol) {
      console.log(`✅ Found compatible symbol of same type: ${compatibleSymbol.id}`);
      return compatibleSymbol;
    } else {
      // Use first compatible symbol
      const firstCompatible = ALL_PARTS.find(p => 
        p.category === PartCategory.SYMBOL &&
        p.archetype === currentTorso.archetype &&
        p.compatible.includes(currentTorso.id)
      );
      
      if (firstCompatible) {
        console.log(`✅ Using first compatible symbol: ${firstCompatible.id}`);
        return firstCompatible;
      } else {
        console.log('❌ No compatible symbols found');
        return null;
      }
    }
  }
}

// Ejecutar pruebas
console.log('📋 TEST CASES:');
console.log('---------------');

// Test 1: Símbolo compatible
console.log('\n🧪 Test 1: Symbol compatible with current torso');
testSymbolSelection('strong_symbol_01_t01', 'strong_torso_01');

// Test 2: Símbolo incompatible - mismo tipo
console.log('\n🧪 Test 2: Symbol incompatible - same type available');
testSymbolSelection('strong_symbol_01_t01', 'strong_torso_02');

// Test 3: Símbolo incompatible - tipo diferente
console.log('\n🧪 Test 3: Symbol incompatible - different type');
testSymbolSelection('strong_symbol_02_t01', 'strong_torso_02');

// Test 4: Sin símbolos compatibles
console.log('\n🧪 Test 4: No compatible symbols');
testSymbolSelection('strong_symbol_01_t01', 'strong_torso_03');

console.log('\n✅ Symbol selection logic test completed!');
