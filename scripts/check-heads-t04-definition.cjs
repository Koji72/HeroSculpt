const fs = require('fs');

const headsToCheck = [
  'strong_head_01_t04',
  'strong_head_02_t04',
  'strong_head_03_t04',
  'strong_head_04_t04',
];

console.log('🔍 Verificando definición de cabezas para strong_torso_04 en src/parts/strongHeadParts.ts...\n');

const content = fs.readFileSync('src/parts/strongHeadParts.ts', 'utf8');
const headMatches = content.match(/\{[^}]*id: ['"]([^'"]+)['"][^}]*category: PartCategory\.HEAD[^}]*archetype: ArchetypeId\.STRONG[^}]*compatible: \[([^\]]+)\][^}]*\}/g);

let allOk = true;

headsToCheck.forEach(headId => {
  const match = headMatches && headMatches.find(h => h.includes(`id: '${headId}'`));
  if (!match) {
    console.log(`❌ NO ENCONTRADA: ${headId}`);
    allOk = false;
    return;
  }
  // Verificar compatible
  const compatibleMatch = match.match(/compatible: \[([^\]]+)\]/);
  const compatible = compatibleMatch ? compatibleMatch[1].replace(/['"\s]/g, '') : '';
  if (compatible !== 'strong_torso_04') {
    console.log(`⚠️  Problema en ${headId}: compatible=[${compatible}]`);
    allOk = false;
  } else {
    console.log(`✅ OK: ${headId}`);
  }
});

if (allOk) {
  console.log('\n🎉 Todas las cabezas de strong_torso_04 están presentes y correctas en src/parts/strongHeadParts.ts.');
} else {
  console.log('\n❗ Hay cabezas faltantes o con problemas. Revisa los mensajes arriba.');
} 