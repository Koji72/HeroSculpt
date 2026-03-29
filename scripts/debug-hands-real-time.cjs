#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 Debug en Tiempo Real - Estado de Manos');
console.log('=' .repeat(50));

// 1. Verificar el estado actual del filtro
console.log('\n1️⃣ Verificando filtro actual en PartSelectorPanel.tsx...');

try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Buscar el código del filtro de manos
  const handFilterSection = partSelectorContent.match(/\/\/ Caso especial para MANOS[\s\S]*?return part\.compatible\.includes\(baseTorsoId\);/s);
  
  if (handFilterSection) {
    console.log('   ✅ Filtro corregido encontrado');
    console.log('   📝 Código del filtro:');
    console.log(handFilterSection[0]);
  } else {
    console.log('   ❌ Filtro corregido NO encontrado');
    
    // Buscar el filtro anterior
    const oldFilter = partSelectorContent.match(/\/\/ Caso especial para MANOS[\s\S]*?return part\.compatible\.includes\(selectedTorso\.id\);/s);
    if (oldFilter) {
      console.log('   ⚠️  Filtro anterior encontrado (PROBLEMA):');
      console.log(oldFilter[0]);
    }
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo PartSelectorPanel.tsx:', error.message);
}

// 2. Verificar datos de manos
console.log('\n2️⃣ Verificando datos de manos...');

try {
  const handsContent = fs.readFileSync('src/parts/strongHandsParts.ts', 'utf8');
  
  // Contar manos por torso
  const torso01Hands = (handsContent.match(/compatible: \['strong_torso_01'\]/g) || []).length;
  const torso02Hands = (handsContent.match(/compatible: \['strong_torso_02'\]/g) || []).length;
  const torso03Hands = (handsContent.match(/compatible: \['strong_torso_03'\]/g) || []).length;
  const torso04Hands = (handsContent.match(/compatible: \['strong_torso_04'\]/g) || []).length;
  const torso05Hands = (handsContent.match(/compatible: \['strong_torso_05'\]/g) || []).length;
  
  console.log('   📊 Manos por torso:');
  console.log(`      Torso 01: ${torso01Hands} manos`);
  console.log(`      Torso 02: ${torso02Hands} manos`);
  console.log(`      Torso 03: ${torso03Hands} manos`);
  console.log(`      Torso 04: ${torso04Hands} manos`);
  console.log(`      Torso 05: ${torso05Hands} manos`);
  
  // Verificar si hay manos con múltiples compatibilidades
  const multiCompatibleHands = handsContent.match(/compatible: \[[^\]]*strong_torso_01[^\]]*strong_torso_0[2-5][^\]]*\]/g);
  if (multiCompatibleHands) {
    console.log(`   ⚠️  ADVERTENCIA: ${multiCompatibleHands.length} manos compatibles con múltiples torsos`);
    multiCompatibleHands.slice(0, 3).forEach(hand => {
      console.log(`      - ${hand}`);
    });
  } else {
    console.log('   ✅ No hay manos con múltiples compatibilidades');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo strongHandsParts.ts:', error.message);
}

// 3. Simular el problema específico
console.log('\n3️⃣ Simulando el problema específico...');

// Simular el estado que podría estar causando el problema
const possibleStates = [
  { name: 'Estado vacío', selectedParts: {} },
  { name: 'Solo torso', selectedParts: { TORSO: { id: 'strong_torso_01' } } },
  { name: 'Con suit torso', selectedParts: { SUIT_TORSO: { id: 'strong_suit_torso_01_t01' } } },
  { name: 'Estado completo', selectedParts: { 
    TORSO: { id: 'strong_torso_01' }, 
    HAND_LEFT: { id: 'strong_hands_fist_01_t01_l_ng' },
    HAND_RIGHT: { id: 'strong_hands_fist_01_t01_r_ng' }
  }}
];

possibleStates.forEach(state => {
  console.log(`\n   🔍 Probando: ${state.name}`);
  console.log(`      selectedParts: ${JSON.stringify(Object.keys(state.selectedParts))}`);
  
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
    
    // Aplicar filtro
    const selectedTorso = state.selectedParts.TORSO;
    const selectedSuit = state.selectedParts.SUIT_TORSO;
    const activeTorso = selectedSuit || selectedTorso;
    
    if (!activeTorso) {
      console.log(`      ❌ Sin torso - mostraría ${allStrongHands.filter(h => h.id.includes('_l')).length} manos izquierdas`);
      return;
    }
    
    let baseTorsoId = activeTorso.id;
    if (selectedSuit) {
      const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
      if (suitMatch) {
        const torsoNumber = suitMatch[1];
        baseTorsoId = `strong_torso_${torsoNumber}`;
      }
    }
    
    const filteredHands = allStrongHands.filter(hand => {
      if (hand.id.includes('_l')) {
        return hand.compatible.includes(baseTorsoId);
      }
      return false;
    });
    
    console.log(`      🎯 Torso base: ${baseTorsoId}`);
    console.log(`      📊 Manos filtradas: ${filteredHands.length}`);
    
    // Verificar si hay manos de otros torsos
    const otherTorsoHands = filteredHands.filter(hand => 
      !hand.compatible.includes(baseTorsoId)
    );
    
    if (otherTorsoHands.length > 0) {
      console.log(`      ❌ PROBLEMA: ${otherTorsoHands.length} manos de otros torsos`);
    } else {
      console.log(`      ✅ CORRECTO: Solo manos compatibles`);
    }
    
  } catch (error) {
    console.log(`      ❌ Error: ${error.message}`);
  }
});

// 4. Verificar si hay algún problema con la compilación
console.log('\n4️⃣ Verificando si los cambios se aplicaron...');

try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Verificar que DEFAULT_STRONG_BUILD tiene manos
  const hasHands = constantsContent.includes('HAND_LEFT:') && constantsContent.includes('HAND_RIGHT:');
  console.log(`   ${hasHands ? '✅' : '❌'} DEFAULT_STRONG_BUILD tiene manos definidas`);
  
  if (hasHands) {
    const handLeftMatch = constantsContent.match(/HAND_LEFT:[\s\S]*?id: '([^']+)'/);
    const handRightMatch = constantsContent.match(/HAND_RIGHT:[\s\S]*?id: '([^']+)'/);
    
    if (handLeftMatch && handRightMatch) {
      console.log(`   🎯 Manos por defecto:`);
      console.log(`      Izquierda: ${handLeftMatch[1]}`);
      console.log(`      Derecha: ${handRightMatch[1]}`);
    }
  }
  
} catch (error) {
  console.log('   ❌ Error verificando constants.ts:', error.message);
}

console.log('\n' + '=' .repeat(50));
console.log('🔍 Debug completado'); 