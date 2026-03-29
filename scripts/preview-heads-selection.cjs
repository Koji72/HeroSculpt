const fs = require('fs');

console.log('🔍 PREVISUALIZACIÓN: PRIMERAS 4 CABEZAS POR TORSO');
console.log('==================================================\n');

const headFiles = ['src/parts/normalHeadParts.ts', 'src/parts/strongHeadParts.ts'];

headFiles.forEach(filePath => {
  console.log(`📁 Archivo: ${filePath}`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const headMatches = content.match(/\{[^}]*id: ['"]([^'"]+)['"][^}]*compatible: \[([^\]]+)\][^}]*\}/g);
    if (headMatches) {
      // Agrupar por torso
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
      // Mostrar las primeras 4 cabezas por torso
      Object.keys(headsByTorso).sort().forEach(torsoId => {
        const heads = headsByTorso[torsoId];
        const preview = heads.slice(0, 4);
        console.log(`   ${torsoId}:`);
        preview.forEach(h => console.log(`      - ${h}`));
        if (heads.length > 4) {
          console.log(`      ... (${heads.length - 4} cabezas más serán eliminadas)`);
        }
      });
    } else {
      console.log('   ❌ No se encontraron cabezas en el archivo');
    }
  } catch (error) {
    console.log(`   ❌ Error leyendo ${filePath}:`, error.message);
  }
  console.log('\n' + '='.repeat(50) + '\n');
}); 