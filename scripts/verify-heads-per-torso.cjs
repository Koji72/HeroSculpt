const fs = require('fs');

console.log('🔍 VERIFICACIÓN DE CABEZAS POR TORSO');
console.log('=====================================\n');

// Leer archivos de partes de cabezas
const headFiles = ['src/parts/normalHeadParts.ts', 'src/parts/strongHeadParts.ts'];

headFiles.forEach(filePath => {
  console.log(`📁 Verificando: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extraer todas las cabezas del array
    const headMatches = content.match(/\{[^}]*id: ['"]([^'"]+)['"][^}]*compatible: \[([^\]]+)\][^}]*\}/g);
    
    if (headMatches) {
      console.log(`   ✅ Encontradas ${headMatches.length} cabezas`);
      
      // Agrupar por torso usando el patrón compatible
      const headsByTorso = {};
      
      headMatches.forEach(headMatch => {
        // Extraer el ID de la cabeza
        const headIdMatch = headMatch.match(/id: ['"]([^'"]+)['"]/);
        // Extraer el array compatible
        const compatibleMatch = headMatch.match(/compatible: \[([^\]]+)\]/);
        
        if (headIdMatch && compatibleMatch) {
          const headId = headIdMatch[1];
          const compatibleTorsos = compatibleMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
          
          compatibleTorsos.forEach(torsoId => {
            if (!headsByTorso[torsoId]) {
              headsByTorso[torsoId] = [];
            }
            headsByTorso[torsoId].push(headId);
          });
        }
      });
      
      // Mostrar resultados por torso
      console.log('\n   📊 CABEZAS POR TORSO:');
      Object.keys(headsByTorso).sort().forEach(torsoId => {
        const headCount = headsByTorso[torsoId].length;
        const status = headCount === 4 ? '✅' : headCount > 4 ? '⚠️' : '❌';
        console.log(`      ${status} ${torsoId}: ${headCount} cabezas`);
        
        if (headCount !== 4) {
          console.log(`         ${headsByTorso[torsoId].join(', ')}`);
        }
      });
      
      // Verificar torsos que no tienen 4 cabezas
      const problematicTorsos = Object.keys(headsByTorso).filter(torsoId => headsByTorso[torsoId].length !== 4);
      if (problematicTorsos.length > 0) {
        console.log(`\n   ⚠️  TORSOS CON PROBLEMAS (no tienen 4 cabezas):`);
        problematicTorsos.forEach(torsoId => {
          console.log(`      - ${torsoId}: ${headsByTorso[torsoId].length} cabezas`);
        });
      } else {
        console.log(`\n   ✅ TODOS LOS TORSOS TIENEN EXACTAMENTE 4 CABEZAS`);
      }
      
      // Verificar que no haya cabezas duplicadas
      const allHeadIds = [];
      Object.values(headsByTorso).forEach(heads => {
        heads.forEach(headId => allHeadIds.push(headId));
      });
      
      const uniqueHeadIds = [...new Set(allHeadIds)];
      if (allHeadIds.length !== uniqueHeadIds.length) {
        console.log(`\n   ⚠️  CABEZAS DUPLICADAS DETECTADAS:`);
        console.log(`      Total: ${allHeadIds.length}, Únicas: ${uniqueHeadIds.length}`);
      } else {
        console.log(`\n   ✅ NO HAY CABEZAS DUPLICADAS`);
      }
      
    } else {
      console.log('   ❌ No se encontraron cabezas en el archivo');
    }
    
  } catch (error) {
    console.log(`   ❌ Error leyendo ${filePath}:`, error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
});

// Verificar también en constants.ts para builds por defecto
console.log('🔍 VERIFICANDO BUILDS POR DEFECTO...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Buscar builds por defecto
  const defaultBuilds = constantsContent.match(/DEFAULT_[A-Z_]+_BUILD[\s\S]*?\{[\s\S]*?\}/g);
  
  if (defaultBuilds) {
    console.log(`   ✅ Encontrados ${defaultBuilds.length} builds por defecto`);
    
    defaultBuilds.forEach(buildMatch => {
      const buildNameMatch = buildMatch.match(/(DEFAULT_[A-Z_]+_BUILD)/);
      const headMatch = buildMatch.match(/HEAD: ['"]([^'"]+)['"]/);
      
      if (buildNameMatch && headMatch) {
        console.log(`      ${buildNameMatch[1]}: ${headMatch[1]}`);
      }
    });
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo constants.ts:', error.message);
}

console.log('\n🎯 RESUMEN:');
console.log('- Verificar que cada torso tenga exactamente 4 cabezas compatibles');
console.log('- Asegurar que los builds por defecto usen cabezas válidas');
console.log('- Confirmar que no haya cabezas duplicadas o faltantes'); 