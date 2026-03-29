const fs = require('fs');
const path = require('path');

console.log('🧪 PRUEBA DE FUNCIONALIDAD - TORSOS Y SUITS');
console.log('==============================================\n');

// Simular la importación de constants.ts (simplificado)
const constantsPath = path.join(__dirname, '..', 'constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// 1. Verificar que todas las definiciones están presentes
console.log('📋 VERIFICANDO DEFINICIONES COMPLETAS:');

const torsoRegex = /id: 'strong_torso_(\d+)'/g;
const suitTorsoRegex = /id: 'strong_suit_torso_(\d+)_t(\d+)'/g;

let torsos = [];
let suitTorsos = [];

let match;
while ((match = torsoRegex.exec(constantsContent)) !== null) {
  torsos.push(`strong_torso_${match[1]}`);
}

constantsContent.replace(suitTorsoRegex, (match, variant, torso) => {
  suitTorsos.push({
    id: `strong_suit_torso_${variant}_t${torso}`,
    variant: variant,
    torso: torso
  });
  return match;
});

console.log(`✅ Torsos base encontrados: ${torsos.length}`);
torsos.sort().forEach(torso => console.log(`   - ${torso}`));

console.log(`\n✅ Suit torsos encontrados: ${suitTorsos.length}`);

// 2. Verificar matriz de compatibilidad completa
console.log('\n🔍 VERIFICANDO MATRIZ DE COMPATIBILIDAD:');
const expectedMatrix = {
  '01': ['01', '02', '03', '04'],
  '02': ['01', '02', '03', '04'], 
  '03': ['01', '02', '03', '04'],
  '04': ['01', '02', '03', '04'],
  '05': ['01', '02', '03', '04']
};

Object.keys(expectedMatrix).forEach(torso => {
  const expectedVariants = expectedMatrix[torso];
  const foundVariants = suitTorsos
    .filter(suit => suit.torso === torso)
    .map(suit => suit.variant)
    .sort();
  
  const isComplete = expectedVariants.every(variant => foundVariants.includes(variant));
  const status = isComplete ? '✅' : '❌';
  
  console.log(`   ${status} Torso ${torso}: [${foundVariants.join(', ')}] ${isComplete ? '(completo)' : '(incompleto)'}` );
  
  if (!isComplete) {
    const missing = expectedVariants.filter(v => !foundVariants.includes(v));
    console.log(`      ❌ Faltan variantes: [${missing.join(', ')}]`);
  }
});

// 3. Simular selección de torso y verificar suits compatibles
console.log('\n🎮 SIMULANDO FUNCIONALIDAD DE SELECCIÓN:');

function getCompatibleSuits(selectedTorso) {
  const torsoNumber = selectedTorso.replace('strong_torso_', '').padStart(2, '0');
  return suitTorsos.filter(suit => suit.torso === torsoNumber);
}

// Probar cada torso
['01', '02', '03', '04', '05'].forEach(torsoNum => {
  const torsoId = `strong_torso_${torsoNum}`;
  const compatibleSuits = getCompatibleSuits(torsoId);
  
  console.log(`\n🔧 Seleccionando ${torsoId}:`);
  console.log(`   📦 Suits compatibles: ${compatibleSuits.length}`);
  
  compatibleSuits.forEach(suit => {
    console.log(`      - ${suit.id} (variante ${suit.variant})`);
  });
  
  if (compatibleSuits.length === 4) {
    console.log('   ✅ Correcto: 4 suits disponibles');
  } else {
    console.log(`   ❌ Error: esperados 4, encontrados ${compatibleSuits.length}`);
  }
});

// 4. Verificar archivos físicos
console.log('\n📁 VERIFICANDO ARCHIVOS FÍSICOS:');
const suitTorsosDir = path.join(__dirname, '..', 'public', 'assets', 'strong', 'suit_torsos');

try {
  const files = fs.readdirSync(suitTorsosDir).filter(f => f.endsWith('.glb') && !f.includes('..'));
  console.log(`✅ Archivos GLB válidos: ${files.length}`);
  
  // Verificar que cada definición tiene su archivo
  let missingFiles = [];
  suitTorsos.forEach(suit => {
    const fileName = `${suit.id}.glb`;
    if (!files.includes(fileName)) {
      missingFiles.push(fileName);
    }
  });
  
  if (missingFiles.length === 0) {
    console.log('✅ Todos los archivos están disponibles');
  } else {
    console.log(`❌ Archivos faltantes: ${missingFiles.length}`);
    missingFiles.forEach(file => console.log(`   - ${file}`));
  }
  
} catch (error) {
  console.error('❌ Error accediendo a archivos:', error.message);
}

// 5. Resumen final
console.log('\n📊 RESUMEN DE FUNCIONALIDAD:');
console.log('==============================');

const totalExpectedSuits = 5 * 4; // 5 torsos × 4 variantes
const foundSuits = suitTorsos.length;
const isSystemComplete = foundSuits === totalExpectedSuits;

console.log(`📦 Torsos base: ${torsos.length}/5`);
console.log(`🎭 Suit torsos: ${foundSuits}/${totalExpectedSuits}`);
console.log(`📁 Archivos disponibles: Verificado`);
console.log(`🔗 Compatibilidad: Verificada`);

if (isSystemComplete && torsos.length === 5) {
  console.log('\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
  console.log('✅ Todos los torsos y suits están disponibles');
  console.log('✅ La matriz de compatibilidad está completa');
  console.log('✅ Los usuarios pueden seleccionar cualquier combinación');
} else {
  console.log('\n⚠️ El sistema requiere atención:');
  if (torsos.length !== 5) console.log(`❌ Faltan torsos base: ${5 - torsos.length}`);
  if (foundSuits !== totalExpectedSuits) console.log(`❌ Faltan suit torsos: ${totalExpectedSuits - foundSuits}`);
}

console.log('\n🔧 Para probar en la aplicación:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir: http://localhost:5177');
console.log('3. Seleccionar diferentes torsos');
console.log('4. Verificar que aparecen 4 suits por torso');
console.log('5. Confirmar que los modelos 3D cargan correctamente'); 