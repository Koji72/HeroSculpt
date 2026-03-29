const fs = require('fs');

console.log('🔍 DIAGNÓSTICO: FILTRADO DE CABEZAS EN PART SELECTOR');
console.log('=====================================================\n');

// Simular la lógica de filtrado de PartSelectorPanel
function simulatePartSelectorFiltering(activeCategory, selectedArchetype, selectedParts, allParts) {
  console.log(`🎯 Simulando filtrado para categoría: ${activeCategory}`);
  console.log(`   Arquetipo: ${selectedArchetype}`);
  console.log(`   Partes seleccionadas:`, Object.keys(selectedParts));
  
  const availableParts = allParts.filter(part => {
    // Verificar categoría y arquetipo
    if (part.category !== activeCategory || part.archetype !== selectedArchetype) {
      return false;
    }
    
    // Si no tiene compatibilidad, mostrar todas
    if (part.compatible.length === 0) {
      return true;
    }
    
    // Para cabezas, usar lógica de torso-dependiente
    const selectedTorso = Object.values(selectedParts).find(p => p.category === 'TORSO');
    const selectedSuit = Object.values(selectedParts).find(p => p.category === 'SUIT_TORSO');
    const activeTorso = selectedSuit || selectedTorso;
    
    console.log(`   Torso base: ${selectedTorso?.id || 'NONE'}`);
    console.log(`   Suit torso: ${selectedSuit?.id || 'NONE'}`);
    console.log(`   Torso activo: ${activeTorso?.id || 'NONE'}`);
    
    if (!activeTorso) {
      console.log(`   ⚠️ No hay torso activo, mostrando todas las cabezas`);
      return true;
    }
    
    // Si hay suit torso, extraer el torso base
    if (selectedSuit) {
      const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
      if (suitMatch) {
        const torsoNumber = suitMatch[1];
        const underlyingTorsoId = `strong_torso_${torsoNumber}`;
        console.log(`   Torso subyacente extraído: ${underlyingTorsoId}`);
        
        const isCompatible = part.compatible.includes(underlyingTorsoId);
        console.log(`   ${part.id} compatible con ${underlyingTorsoId}: ${isCompatible}`);
        return isCompatible;
      }
    }
    
    // Para torso normal
    const isCompatible = part.compatible.includes(activeTorso.id);
    console.log(`   ${part.id} compatible con ${activeTorso.id}: ${isCompatible}`);
    return isCompatible;
  });
  
  return availableParts;
}

// Cargar datos de cabezas
try {
  const headPartsContent = fs.readFileSync('src/parts/strongHeadParts.ts', 'utf8');
  const headMatches = headPartsContent.match(/\{[^}]*id: ['"]([^'"]+)['"][^}]*compatible: \[([^\]]+)\][^}]*\}/g);
  
  if (headMatches) {
    const allHeadParts = [];
    
    headMatches.forEach(headMatch => {
      const headIdMatch = headMatch.match(/id: ['"]([^'"]+)['"]/);
      const compatibleMatch = headMatch.match(/compatible: \[([^\]]+)\]/);
      
      if (headIdMatch && compatibleMatch) {
        const headId = headIdMatch[1];
        const compatibleTorsos = compatibleMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
        
        allHeadParts.push({
          id: headId,
          category: 'HEAD',
          archetype: 'STRONG',
          compatible: compatibleTorsos
        });
      }
    });
    
    console.log(`✅ Cargadas ${allHeadParts.length} cabezas\n`);
    
    // Probar diferentes escenarios
    console.log('📋 ESCENARIOS DE PRUEBA:\n');
    
    // Escenario 1: Solo torso base
    console.log('1️⃣ ESCENARIO 1: Solo torso base (strong_torso_03)');
    const selectedParts1 = {
      'TORSO': { id: 'strong_torso_03', category: 'TORSO', archetype: 'STRONG' }
    };
    
    const available1 = simulatePartSelectorFiltering('HEAD', 'STRONG', selectedParts1, allHeadParts);
    console.log(`   Cabezas disponibles: ${available1.length}`);
    available1.forEach(head => console.log(`   - ${head.id}`));
    console.log('');
    
    // Escenario 2: Con suit torso
    console.log('2️⃣ ESCENARIO 2: Con suit torso (strong_suit_torso_01_t03)');
    const selectedParts2 = {
      'TORSO': { id: 'strong_torso_03', category: 'TORSO', archetype: 'STRONG' },
      'SUIT_TORSO': { id: 'strong_suit_torso_01_t03', category: 'SUIT_TORSO', archetype: 'STRONG' }
    };
    
    const available2 = simulatePartSelectorFiltering('HEAD', 'STRONG', selectedParts2, allHeadParts);
    console.log(`   Cabezas disponibles: ${available2.length}`);
    available2.forEach(head => console.log(`   - ${head.id}`));
    console.log('');
    
    // Escenario 3: Sin torso
    console.log('3️⃣ ESCENARIO 3: Sin torso seleccionado');
    const selectedParts3 = {};
    
    const available3 = simulatePartSelectorFiltering('HEAD', 'STRONG', selectedParts3, allHeadParts);
    console.log(`   Cabezas disponibles: ${available3.length}`);
    console.log('');
    
  } else {
    console.log('❌ No se encontraron cabezas en el archivo');
  }
  
} catch (error) {
  console.log(`❌ Error leyendo datos: ${error.message}`);
}

console.log('🎯 DIAGNÓSTICO COMPLETADO');
console.log('Si el escenario 2 muestra menos cabezas que el escenario 1, hay un problema con la lógica de suit torso'); 