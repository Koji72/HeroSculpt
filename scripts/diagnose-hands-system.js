const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE MANOS');
console.log('=====================================\n');

// 1. Verificar tipos
console.log('1️⃣ VERIFICANDO TIPOS...');
try {
  const typesContent = fs.readFileSync('types.ts', 'utf8');
  const selectedPartsMatch = typesContent.match(/export type SelectedParts = \{ \[([^\]]+)\]: Part \};/);
  
  if (selectedPartsMatch) {
    const keyType = selectedPartsMatch[1];
    console.log(`   ✅ SelectedParts usa: ${keyType}`);
    if (keyType === 'category: string') {
      console.log('   ✅ CORRECTO: Usando categorías como keys');
    } else {
      console.log('   ❌ INCORRECTO: Debería usar categorías');
    }
  } else {
    console.log('   ❌ No se pudo encontrar la definición de SelectedParts');
  }
} catch (error) {
  console.log('   ❌ Error leyendo types.ts:', error.message);
}

// 2. Verificar patrones en App.tsx
console.log('\n2️⃣ VERIFICANDO PATRONES EN App.tsx...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar uso de categorías
  const categoryDeletes = appContent.match(/delete newParts\[PartCategory\.[A-Z_]+\]/g);
  const idDeletes = appContent.match(/delete newParts\[[^P][^a][^r][^t][^C][^a][^t][^e][^g][^o][^r][^y][^\]]+\]/g);
  
  console.log(`   ✅ Eliminaciones por categoría: ${categoryDeletes ? categoryDeletes.length : 0}`);
  console.log(`   ❌ Eliminaciones por ID: ${idDeletes ? idDeletes.length : 0}`);
  
  if (categoryDeletes && categoryDeletes.length > 0) {
    console.log('   ✅ Patrón correcto detectado');
  } else {
    console.log('   ❌ No se encontraron eliminaciones por categoría');
  }
  
  // Verificar asignaciones
  const categoryAssignments = appContent.match(/newParts\[PartCategory\.[A-Z_]+\] = [^;]+/g);
  console.log(`   ✅ Asignaciones por categoría: ${categoryAssignments ? categoryAssignments.length : 0}`);
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
}

// 3. Verificar utils.ts
console.log('\n3️⃣ VERIFICANDO lib/utils.ts...');
try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  
  // Verificar función assignDefaultHandsForTorso
  const handsFunction = utilsContent.match(/export function assignDefaultHandsForTorso[\s\S]*?}/);
  if (handsFunction) {
    const functionContent = handsFunction[0];
    
    // Verificar eliminaciones
    const deleteLeft = functionContent.includes('delete newParts[PartCategory.HAND_LEFT]');
    const deleteRight = functionContent.includes('delete newParts[PartCategory.HAND_RIGHT]');
    
    console.log(`   ✅ Eliminación mano izquierda: ${deleteLeft ? 'CORRECTO' : 'INCORRECTO'}`);
    console.log(`   ✅ Eliminación mano derecha: ${deleteRight ? 'CORRECTO' : 'INCORRECTO'}`);
    
    // Verificar asignaciones
    const assignLeft = functionContent.includes('newParts[PartCategory.HAND_LEFT] =');
    const assignRight = functionContent.includes('newParts[PartCategory.HAND_RIGHT] =');
    
    console.log(`   ✅ Asignación mano izquierda: ${assignLeft ? 'CORRECTO' : 'INCORRECTO'}`);
    console.log(`   ✅ Asignación mano derecha: ${assignRight ? 'CORRECTO' : 'INCORRECTO'}`);
    
  } else {
    console.log('   ❌ No se encontró la función assignDefaultHandsForTorso');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo lib/utils.ts:', error.message);
}

// 4. Verificar CharacterViewer.tsx
console.log('\n4️⃣ VERIFICANDO components/CharacterViewer.tsx...');
try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar compatibilidad
  const compatibilityCheck = viewerContent.includes('compatible.includes(baseTorsoId)');
  const handFiltering = viewerContent.includes('part.category === PartCategory.HAND_LEFT') || 
                       viewerContent.includes('part.category === PartCategory.HAND_RIGHT');
  
  console.log(`   ✅ Verificación de compatibilidad: ${compatibilityCheck ? 'PRESENTE' : 'AUSENTE'}`);
  console.log(`   ✅ Filtrado de manos: ${handFiltering ? 'PRESENTE' : 'AUSENTE'}`);
  
  if (compatibilityCheck && handFiltering) {
    console.log('   ✅ Sistema de compatibilidad implementado correctamente');
  } else {
    console.log('   ❌ Falta implementación de compatibilidad');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo components/CharacterViewer.tsx:', error.message);
}

// 5. Verificar constantes
console.log('\n5️⃣ VERIFICANDO constants.ts...');
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Verificar builds por defecto
  const defaultBuilds = constantsContent.match(/DEFAULT_[A-Z_]+_BUILD/g);
  console.log(`   ✅ Builds por defecto encontrados: ${defaultBuilds ? defaultBuilds.length : 0}`);
  
  if (defaultBuilds) {
    defaultBuilds.forEach(build => {
      console.log(`      - ${build}`);
    });
  }
  
  // Verificar que las manos estén en los builds por defecto
  const handsInDefaults = constantsContent.includes('HAND_LEFT') && constantsContent.includes('HAND_RIGHT');
  console.log(`   ✅ Manos en builds por defecto: ${handsInDefaults ? 'PRESENTES' : 'AUSENTES'}`);
  
} catch (error) {
  console.log('   ❌ Error leyendo constants.ts:', error.message);
}

// 6. Verificar archivos de partes
console.log('\n6️⃣ VERIFICANDO ARCHIVOS DE PARTES...');
try {
  const partsDir = 'src/parts';
  if (fs.existsSync(partsDir)) {
    const files = fs.readdirSync(partsDir);
    const handFiles = files.filter(f => f.includes('Hand'));
    console.log(`   ✅ Archivos de manos encontrados: ${handFiles.length}`);
    handFiles.forEach(file => console.log(`      - ${file}`));
  } else {
    console.log('   ❌ Directorio src/parts no encontrado');
  }
} catch (error) {
  console.log('   ❌ Error verificando archivos de partes:', error.message);
}

console.log('\n=====================================');
console.log('🎯 RESUMEN DEL DIAGNÓSTICO');
console.log('=====================================');

// Resumen final
console.log('\n📋 RECOMENDACIONES:');
console.log('1. Verifica que estés usando categorías como keys en SelectedParts');
console.log('2. Asegúrate de que las funciones de utils.ts usen PartCategory');
console.log('3. Confirma que CharacterViewer filtre manos incompatibles');
console.log('4. Verifica que los builds por defecto incluyan manos válidas');
console.log('\n🔧 Si hay problemas, revisa los logs del navegador para errores específicos'); 