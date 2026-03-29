const { ALL_PARTS } = require('../constants');

const headsToCheck = [
  'strong_head_01_t04',
  'strong_head_02_t04',
  'strong_head_03_t04',
  'strong_head_04_t04',
];

console.log('🔍 Verificando cabezas para strong_torso_04 en ALL_PARTS...\n');

let allOk = true;

headsToCheck.forEach(headId => {
  const part = ALL_PARTS.find(p => p.id === headId);
  if (!part) {
    console.log(`❌ NO ENCONTRADA: ${headId}`);
    allOk = false;
    return;
  }
  const problems = [];
  if (part.category !== 'HEAD') problems.push(`category=${part.category}`);
  if (part.archetype !== 'STRONG') problems.push(`archetype=${part.archetype}`);
  if (!Array.isArray(part.compatible) || part.compatible[0] !== 'strong_torso_04') problems.push(`compatible=${JSON.stringify(part.compatible)}`);
  if (problems.length > 0) {
    console.log(`⚠️  Problemas en ${headId}: ${problems.join(', ')}`);
    allOk = false;
  } else {
    console.log(`✅ OK: ${headId}`);
  }
});

if (allOk) {
  console.log('\n🎉 Todas las cabezas de strong_torso_04 están presentes y correctas en ALL_PARTS.');
} else {
  console.log('\n❗ Hay cabezas faltantes o con problemas. Revisa los mensajes arriba.');
} 