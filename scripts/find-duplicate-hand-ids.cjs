#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 BUSCANDO IDs DUPLICADOS DE MANOS');
console.log('===================================\n');

try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Buscar todas las manos del arquetipo STRONG
  const strongHandsRegex = /id:\s*'strong_hands_[^']*'/g;
  const strongHandsMatches = constantsContent.match(strongHandsRegex) || [];
  
  // Extraer los IDs
  const handIds = strongHandsMatches.map(match => match.match(/'([^']+)'/)[1]);
  
  console.log(`📊 Total de manos encontradas: ${handIds.length}`);
  
  // Encontrar duplicados
  const duplicates = [];
  const seen = new Set();
  
  handIds.forEach(id => {
    if (seen.has(id)) {
      duplicates.push(id);
    } else {
      seen.add(id);
    }
  });
  
  if (duplicates.length > 0) {
    console.log(`❌ IDs DUPLICADOS ENCONTRADOS: ${duplicates.length}`);
    console.log('📋 IDs duplicados:');
    duplicates.forEach(id => {
      console.log(`   - ${id}`);
      
      // Encontrar las líneas donde aparece este ID
      const lines = constantsContent.split('\n');
      const lineNumbers = [];
      
      lines.forEach((line, index) => {
        if (line.includes(`id: '${id}'`)) {
          lineNumbers.push(index + 1);
        }
      });
      
      console.log(`     Aparece en líneas: ${lineNumbers.join(', ')}`);
    });
  } else {
    console.log('✅ No se encontraron IDs duplicados');
  }
  
  // Mostrar estadísticas
  const uniqueIds = [...new Set(handIds)];
  console.log(`\n📊 Estadísticas:`);
  console.log(`   - Total de IDs: ${handIds.length}`);
  console.log(`   - IDs únicos: ${uniqueIds.length}`);
  console.log(`   - Duplicados: ${handIds.length - uniqueIds.length}`);
  
  // Contar por categoría
  const leftHands = handIds.filter(id => id.includes('_l_'));
  const rightHands = handIds.filter(id => id.includes('_r_'));
  
  console.log(`\n📊 Por categoría:`);
  console.log(`   - Manos izquierdas: ${leftHands.length}`);
  console.log(`   - Manos derechas: ${rightHands.length}`);
  
  // Mostrar algunos ejemplos de IDs únicos
  console.log(`\n📋 Ejemplos de IDs únicos (primeros 10):`);
  uniqueIds.slice(0, 10).forEach(id => {
    const isLeft = id.includes('_l_');
    const isRight = id.includes('_r_');
    const handType = isLeft ? 'IZQUIERDA' : isRight ? 'DERECHA' : 'DESCONOCIDA';
    console.log(`   - ${id} (${handType})`);
  });
  
} catch (error) {
  console.log('❌ Error:', error.message);
}

process.exit(0); 