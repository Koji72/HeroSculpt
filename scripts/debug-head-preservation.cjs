const fs = require('fs');

console.log('🔍 DIAGNÓSTICO: PRESERVACIÓN DE TIPO DE CABEZA');
console.log('===============================================\n');

// Simular el comportamiento de assignAdaptiveHeadForTorso
function simulateHeadPreservation(currentHeadId, newTorsoId) {
  console.log(`🎯 Simulando cambio de torso:`);
  console.log(`   Cabeza actual: ${currentHeadId}`);
  console.log(`   Nuevo torso: ${newTorsoId}`);
  
  // Extraer tipo de cabeza actual
  const headMatch = currentHeadId.match(/strong_head_(\d+)_t\d+/);
  if (!headMatch) {
    console.log('   ❌ No se pudo extraer tipo de cabeza');
    return null;
  }
  
  const currentType = headMatch[1];
  console.log(`   Tipo de cabeza actual: ${currentType}`);
  
  // Buscar cabeza compatible del mismo tipo
  const expectedHeadId = `strong_head_${currentType}_${newTorsoId.replace('strong_torso_', 't')}`;
  console.log(`   Cabeza esperada: ${expectedHeadId}`);
  
  // Verificar si existe en los datos
  try {
    const headPartsContent = fs.readFileSync('src/parts/strongHeadParts.ts', 'utf8');
    const headExists = headPartsContent.includes(`id: '${expectedHeadId}'`);
    
    if (headExists) {
      console.log(`   ✅ Cabeza compatible encontrada`);
      return expectedHeadId;
    } else {
      console.log(`   ❌ Cabeza compatible NO encontrada`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Error verificando datos: ${error.message}`);
    return null;
  }
}

// Probar diferentes escenarios
console.log('📋 ESCENARIOS DE PRUEBA:\n');

// Escenario 1: Cambiar de torso 01 a torso 02 con cabeza 03
console.log('1️⃣ ESCENARIO 1: Torso 01 → Torso 02 (cabeza 03)');
const result1 = simulateHeadPreservation('strong_head_03_t01', 'strong_torso_02');
console.log(`   Resultado: ${result1 || 'FALLÓ'}\n`);

// Escenario 2: Cambiar de torso 02 a torso 03 con cabeza 02
console.log('2️⃣ ESCENARIO 2: Torso 02 → Torso 03 (cabeza 02)');
const result2 = simulateHeadPreservation('strong_head_02_t02', 'strong_torso_03');
console.log(`   Resultado: ${result2 || 'FALLÓ'}\n`);

// Escenario 3: Cambiar de torso 03 a torso 04 con cabeza 04
console.log('3️⃣ ESCENARIO 3: Torso 03 → Torso 04 (cabeza 04)');
const result3 = simulateHeadPreservation('strong_head_04_t03', 'strong_torso_04');
console.log(`   Resultado: ${result3 || 'FALLÓ'}\n`);

// Verificar todas las cabezas disponibles por torso
console.log('📊 VERIFICACIÓN COMPLETA DE CABEZAS POR TORSO:\n');

try {
  const headPartsContent = fs.readFileSync('src/parts/strongHeadParts.ts', 'utf8');
  const headMatches = headPartsContent.match(/\{[^}]*id: ['"]([^'"]+)['"][^}]*compatible: \[([^\]]+)\][^}]*\}/g);
  
  if (headMatches) {
    const headsByTorso = {};
    
    headMatches.forEach(headMatch => {
      const headIdMatch = headMatch.match(/id: ['"]([^'"]+)['"]/);
      const compatibleMatch = headMatch.match(/compatible: \[([^\]]+)\]/);
      
      if (headIdMatch && compatibleMatch) {
        const headId = headIdMatch[1];
        const compatibleTorsos = compatibleMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
        
        compatibleTorsos.forEach(torsoId => {
          if (!headsByTorso[torsoId]) headsByTorso[torsoId] = [];
          headsByTorso[torsoId].push(headId);
        });
      }
    });
    
    Object.keys(headsByTorso).sort().forEach(torsoId => {
      const heads = headsByTorso[torsoId];
      console.log(`${torsoId}:`);
      heads.forEach(headId => {
        console.log(`   - ${headId}`);
      });
      console.log('');
    });
  }
} catch (error) {
  console.log(`❌ Error leyendo datos: ${error.message}`);
}

console.log('🎯 DIAGNÓSTICO COMPLETADO');
console.log('Si todos los escenarios fallan, el problema está en la lógica de preservación');
console.log('Si algunos escenarios funcionan, el problema está en los datos específicos'); 