#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 VERIFICACIÓN REAL - Filtrado de Manos por Torso');
console.log('==================================================\n');

// 1. Verificar que el código de filtrado está presente
console.log('1️⃣ Verificando código de filtrado en PartSelectorPanel...');
try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Buscar el código específico que agregamos
  const handFilterCode = `
    // Caso especial para MANOS - verificar compatibilidad con torso
    if (part.category === PartCategory.HAND_LEFT || part.category === PartCategory.HAND_RIGHT) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      if (!selectedTorso) return true; // Si no hay torso, mostrar todas las manos
      return part.compatible.includes(selectedTorso.id);
    }`;
  
  const hasHandFilter = partSelectorContent.includes('Caso especial para MANOS') && 
                       partSelectorContent.includes('HAND_LEFT') && 
                       partSelectorContent.includes('HAND_RIGHT') &&
                       partSelectorContent.includes('compatible.includes');
  
  console.log(`   ${hasHandFilter ? '✅' : '❌'} Código de filtrado de manos presente`);
  
  if (!hasHandFilter) {
    console.log('   ❌ El código de filtrado de manos NO está presente');
    console.log('   📝 Código esperado:');
    console.log(handFilterCode);
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo PartSelectorPanel:', error.message);
}

// 2. Verificar datos de compatibilidad
console.log('\n2️⃣ Verificando datos de compatibilidad...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Buscar torsos disponibles
  const torsoMatches = constantsContent.match(/id:\s*'strong_torso_\d+'/g) || [];
  const torsoIds = torsoMatches.map(match => match.match(/'([^']+)'/)[1]);
  
  console.log(`   📊 Torsos disponibles: ${torsoIds.join(', ')}`);
  
  // Buscar manos y sus compatibilidades
  const handMatches = constantsContent.match(/id:\s*'strong_hands_[^']*'.*?compatible:\s*\[([^\]]*)\]/gs) || [];
  
  console.log(`   📊 Total de manos con compatibilidad: ${handMatches.length}`);
  
  // Analizar compatibilidades por torso
  const compatibilityByTorso = {};
  torsoIds.forEach(torsoId => {
    compatibilityByTorso[torsoId] = [];
  });
  
  handMatches.forEach(match => {
    const idMatch = match.match(/id:\s*'([^']+)'/);
    const compatibleMatch = match.match(/compatible:\s*\[([^\]]*)\]/);
    
    if (idMatch && compatibleMatch) {
      const handId = idMatch[1];
      const compatible = compatibleMatch[1].split(',').map(s => s.trim().replace(/'/g, '')).filter(s => s);
      
      compatible.forEach(torsoId => {
        if (compatibilityByTorso[torsoId]) {
          compatibilityByTorso[torsoId].push(handId);
        }
      });
    }
  });
  
  console.log('   📋 Manos compatibles por torso:');
  Object.keys(compatibilityByTorso).forEach(torsoId => {
    const hands = compatibilityByTorso[torsoId];
    console.log(`      - ${torsoId}: ${hands.length} manos`);
  });
  
} catch (error) {
  console.log('   ❌ Error verificando datos:', error.message);
}

// 3. Verificar que el filtrado se ejecuta correctamente
console.log('\n3️⃣ Verificando lógica de filtrado...');
try {
  const partSelectorContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Buscar la función de filtrado
  const filterFunctionMatch = partSelectorContent.match(/const availableParts = [^;]+;/s);
  
  if (filterFunctionMatch) {
    const filterCode = filterFunctionMatch[0];
    console.log('   ✅ Función de filtrado encontrada');
    
    // Verificar que incluye la lógica de manos
    const hasHandLogic = filterCode.includes('HAND_LEFT') || filterCode.includes('HAND_RIGHT');
    console.log(`   ${hasHandLogic ? '✅' : '❌'} Lógica específica para manos presente`);
    
    // Verificar que usa selectedParts
    const usesSelectedParts = filterCode.includes('selectedParts');
    console.log(`   ${usesSelectedParts ? '✅' : '❌'} Usa selectedParts para filtrado`);
    
    // Verificar que verifica compatibilidad
    const checksCompatibility = filterCode.includes('compatible.includes');
    console.log(`   ${checksCompatibility ? '✅' : '❌'} Verifica compatibilidad`);
    
  } else {
    console.log('   ❌ No se encontró la función de filtrado');
  }
  
} catch (error) {
  console.log('   ❌ Error verificando lógica:', error.message);
}

// 4. Verificar que el componente recibe las props correctas
console.log('\n4️⃣ Verificando props del componente...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Buscar donde se renderiza PartSelectorPanel
  const partSelectorRenderMatch = appContent.match(/<PartSelectorPanel[^>]*>/g);
  
  if (partSelectorRenderMatch) {
    console.log('   ✅ PartSelectorPanel se renderiza en App.tsx');
    
    // Verificar que recibe selectedParts
    const receivesSelectedParts = appContent.includes('selectedParts={selectedParts}') || 
                                 appContent.includes('selectedParts={selectedParts}');
    console.log(`   ${receivesSelectedParts ? '✅' : '❌'} Recibe selectedParts como prop`);
    
  } else {
    console.log('   ❌ No se encontró PartSelectorPanel en App.tsx');
  }
  
} catch (error) {
  console.log('   ❌ Error verificando props:', error.message);
}

console.log('\n📋 RESUMEN:');
console.log('============');
console.log('Si el problema persiste, verifica:');
console.log('1. Que el navegador esté usando la versión actualizada');
console.log('2. Que no haya cache del navegador');
console.log('3. Que el servidor de desarrollo esté corriendo');
console.log('4. Que no haya errores en la consola del navegador');
console.log('');
console.log('🧪 Para debuggear:');
console.log('1. Abre las herramientas de desarrollador');
console.log('2. Ve a la pestaña Console');
console.log('3. Busca errores relacionados con el filtrado');
console.log('4. Verifica que selectedParts tenga el torso correcto');

process.exit(0); 