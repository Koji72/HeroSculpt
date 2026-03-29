const fs = require('fs');
const path = require('path');

console.log('🧪 PRUEBA DEL SISTEMA DE BOTAS');
console.log('===============================\n');

// Leer constants.ts para obtener las partes
const constantsPath = path.join(__dirname, '..', 'constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extraer partes usando regex multilinea robusto
function extractParts() {
  const parts = [];

  // Piernas
  const legsRegex = /{\s*id: 'strong_legs_(\d+)',[\s\S]*?category: PartCategory.LOWER_BODY[\s\S]*?}/g;
  let match;
  while ((match = legsRegex.exec(constantsContent)) !== null) {
    parts.push({
      id: `strong_legs_${match[1]}`,
      category: 'LOWER_BODY'
    });
  }

  // Botas
  const bootsRegex = /{\s*id: 'strong_boots_(\d+)_l(\d+)',[\s\S]*?category: PartCategory.BOOTS[\s\S]*?}/g;
  while ((match = bootsRegex.exec(constantsContent)) !== null) {
    parts.push({
      id: `strong_boots_${match[1]}_l${match[2]}`,
      category: 'BOOTS',
      bootType: match[1],
      legCompatible: match[2]
    });
  }

  return parts;
}

function testAssignAdaptiveBootsForTorso(newLegs, currentParts, originalParts) {
  console.log(`🔍 Probando cambio de piernas a: ${newLegs.id}`);
  console.log(`   - Botas actuales: ${currentParts.BOOTS?.id || 'ninguna'}`);

  const legsMatch = newLegs.id.match(/strong_legs_(\d+)/);
  if (!legsMatch) {
    console.log('❌ No se pudo extraer el número de las piernas');
    return null;
  }
  const legsNumber = legsMatch[1];
  console.log(`📊 Número de piernas: ${legsNumber}`);

  const allParts = extractParts();
  const compatibleBoots = allParts.filter(part =>
    part.category === 'BOOTS' && part.legCompatible === legsNumber
  );
  console.log(`✅ Botas compatibles encontradas: ${compatibleBoots.length}`);
  compatibleBoots.forEach(boot => console.log(`   - ${boot.id}`));

  const currentBoots = currentParts.BOOTS;
  if (currentBoots) {
    const currentBootMatch = currentBoots.id.match(/strong_boots_(\d+)_l(\d+)/);
    if (currentBootMatch) {
      const currentBootType = currentBootMatch[1];
      console.log(`🔍 Buscando botas del mismo tipo: ${currentBootType}`);
      const sameTypeBoots = compatibleBoots.filter(boot => boot.bootType === currentBootType);
      if (sameTypeBoots.length > 0) {
        console.log(`✅ Encontradas botas del mismo tipo: ${sameTypeBoots[0].id}`);
        return sameTypeBoots[0];
      } else {
        console.log(`❌ No se encontraron botas del tipo ${currentBootType} para piernas ${legsNumber}`);
      }
    }
  }
  if (compatibleBoots.length > 0) {
    console.log(`📌 Usando la primera bota compatible: ${compatibleBoots[0].id}`);
    return compatibleBoots[0];
  }
  console.log(`❌ No hay botas compatibles para piernas ${legsNumber}`);
  return null;
}

function runTestCase(desc, currentParts, newLegs) {
  console.log(`\n📋 ${desc}`);
  const result = testAssignAdaptiveBootsForTorso(newLegs, currentParts, currentParts);
  console.log(`🎯 Resultado final: ${result?.id || 'sin botas'}\n`);
}

console.log('🧪 CASOS DE PRUEBA:\n');

// Caso 1: Cambiar de piernas 1 a piernas 5 con botas tipo 3
runTestCase(
  'CASO 1: Piernas 1 → Piernas 5 (con botas tipo 3)',
  { BOOTS: { id: 'strong_boots_03_l01', category: 'BOOTS' }, LOWER_BODY: { id: 'strong_legs_01', category: 'LOWER_BODY' } },
  { id: 'strong_legs_05', category: 'LOWER_BODY' }
);

// Caso 2: Cambiar de piernas 2 a piernas 3 con botas tipo 1
runTestCase(
  'CASO 2: Piernas 2 → Piernas 3 (con botas tipo 1)',
  { BOOTS: { id: 'strong_boots_01_l02', category: 'BOOTS' }, LOWER_BODY: { id: 'strong_legs_02', category: 'LOWER_BODY' } },
  { id: 'strong_legs_03', category: 'LOWER_BODY' }
);

// Caso 3: Cambiar de piernas 1 a piernas 4 sin botas actuales
runTestCase(
  'CASO 3: Piernas 1 → Piernas 4 (sin botas actuales)',
  { LOWER_BODY: { id: 'strong_legs_01', category: 'LOWER_BODY' } },
  { id: 'strong_legs_04', category: 'LOWER_BODY' }
);

console.log('✅ Prueba del sistema de botas completada'); 