const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO COMPLETITUD DE CABEZAS');

// Leer el archivo constants.ts
const constantsPath = path.join(__dirname, '../constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Extraer todas las definiciones de cabezas
const headMatches = constantsContent.match(/id: 'strong_head_\d+_t\d+'/g);
const heads = headMatches ? headMatches.map(match => match.replace("id: '", '').replace("'", '')) : [];

console.log(`📊 Total de cabezas encontradas: ${heads.length}`);

// Organizar por torso
const headsByTorso = {
  't01': [],
  't02': [],
  't03': [],
  't04': [],
  't05': []
};

heads.forEach(head => {
  const torsoMatch = head.match(/t(\d+)/);
  if (torsoMatch) {
    const torsoType = `t${torsoMatch[1]}`;
    headsByTorso[torsoType].push(head);
  }
});

// Verificar completitud
let allComplete = true;
const expectedHeadTypes = ['01', '02', '03', '04'];

Object.keys(headsByTorso).forEach(torsoType => {
  const headsForTorso = headsByTorso[torsoType];
  console.log(`\n🎯 Torso ${torsoType}:`);
  console.log(`   Cabezas encontradas: ${headsForTorso.length}`);
  
  // Verificar que tengamos las 4 cabezas esperadas
  const foundHeadTypes = headsForTorso.map(head => {
    const match = head.match(/strong_head_(\d+)_/);
    return match ? match[1] : null;
  }).filter(Boolean);
  
  const missingHeadTypes = expectedHeadTypes.filter(type => !foundHeadTypes.includes(type));
  
  if (missingHeadTypes.length === 0) {
    console.log(`   ✅ COMPLETO - Todas las 4 cabezas presentes`);
    headsForTorso.forEach(head => {
      const headType = head.match(/strong_head_(\d+)_/)[1];
      console.log(`      - Cabeza ${headType}: ${head}`);
    });
  } else {
    console.log(`   ❌ INCOMPLETO - Faltan: ${missingHeadTypes.join(', ')}`);
    allComplete = false;
  }
});

// Verificar archivos GLB
console.log('\n🗂️ VERIFICANDO ARCHIVOS GLB:');
const headsDir = path.join(__dirname, '../public/assets/strong/head');

if (fs.existsSync(headsDir)) {
  const glbFiles = fs.readdirSync(headsDir).filter(file => file.endsWith('.glb'));
  console.log(`   Archivos GLB encontrados: ${glbFiles.length}`);
  
  // Verificar que cada cabeza definida tenga su archivo GLB
  let missingFiles = 0;
  heads.forEach(head => {
    const expectedFile = `${head}.glb`;
    if (!glbFiles.includes(expectedFile)) {
      console.log(`   ❌ Archivo faltante: ${expectedFile}`);
      missingFiles++;
    }
  });
  
  if (missingFiles === 0) {
    console.log(`   ✅ Todos los archivos GLB están presentes`);
  } else {
    console.log(`   ❌ Faltan ${missingFiles} archivos GLB`);
    allComplete = false;
  }
} else {
  console.log(`   ❌ Directorio de cabezas no encontrado: ${headsDir}`);
  allComplete = false;
}

// Resultado final
console.log('\n' + '='.repeat(50));
if (allComplete) {
  console.log('🎉 ¡VERIFICACIÓN EXITOSA!');
  console.log('✅ Todas las cabezas están completas (4 por torso)');
  console.log('✅ Todos los archivos GLB están presentes');
  console.log('✅ El sistema de cabezas debería funcionar correctamente');
} else {
  console.log('❌ VERIFICACIÓN FALLIDA');
  console.log('⚠️  Hay problemas que deben ser corregidos');
}

console.log('\n📋 RESUMEN:');
console.log(`   - Total cabezas: ${heads.length}`);
console.log(`   - Torsos: 5 (t01, t02, t03, t04, t05)`);
console.log(`   - Esperado: 20 cabezas (4 por torso)`);
console.log(`   - Estado: ${allComplete ? 'COMPLETO' : 'INCOMPLETO'}`); 