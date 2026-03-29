const fs = require('fs');

console.log('🔍 DIAGNÓSTICO COMPLETO DEL SISTEMA DE CABEZAS');
console.log('================================================\n');

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
  
  // Verificar uso de categorías para cabezas
  const headCategoryDeletes = appContent.match(/delete newParts\[PartCategory\.HEAD\]/g);
  const headCategoryAssignments = appContent.match(/newParts\[PartCategory\.HEAD\] = [^;]+/g);
  
  console.log(`   ✅ Eliminaciones de cabeza por categoría: ${headCategoryDeletes ? headCategoryDeletes.length : 0}`);
  console.log(`   ✅ Asignaciones de cabeza por categoría: ${headCategoryAssignments ? headCategoryAssignments.length : 0}`);
  
  // Verificar función assignAdaptiveHeadForTorso
  const adaptiveHeadFunction = appContent.includes('assignAdaptiveHeadForTorso');
  console.log(`   ✅ Función assignAdaptiveHeadForTorso: ${adaptiveHeadFunction ? 'PRESENTE' : 'AUSENTE'}`);
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
}

// 3. Verificar utils.ts
console.log('\n3️⃣ VERIFICANDO lib/utils.ts...');
try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  
  // Verificar función assignAdaptiveHeadForTorso
  const headFunction = utilsContent.match(/export function assignAdaptiveHeadForTorso[\s\S]*?}/);
  if (headFunction) {
    const functionContent = headFunction[0];
    
    // Verificar eliminaciones
    const deleteHead = functionContent.includes('delete newParts[PartCategory.HEAD]');
    console.log(`   ✅ Eliminación de cabeza: ${deleteHead ? 'CORRECTO' : 'INCORRECTO'}`);
    
    // Verificar asignaciones
    const assignHead = functionContent.includes('newParts[PartCategory.HEAD] =');
    console.log(`   ✅ Asignación de cabeza: ${assignHead ? 'CORRECTO' : 'INCORRECTO'}`);
    
    // Verificar compatibilidad
    const compatibilityCheck = functionContent.includes('compatible.includes(newTorso.id)');
    console.log(`   ✅ Verificación de compatibilidad: ${compatibilityCheck ? 'PRESENTE' : 'AUSENTE'}`);
    
    // Verificar preservación de tipo
    const typePreservation = functionContent.includes('currentType') || functionContent.includes('matchingHead');
    console.log(`   ✅ Preservación de tipo: ${typePreservation ? 'PRESENTE' : 'AUSENTE'}`);
    
  } else {
    console.log('   ❌ No se encontró la función assignAdaptiveHeadForTorso');
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo lib/utils.ts:', error.message);
}

// 4. Verificar CharacterViewer.tsx
console.log('\n4️⃣ VERIFICANDO components/CharacterViewer.tsx...');
try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar compatibilidad de cabezas
  const headCompatibilityCheck = viewerContent.includes('part.category === PartCategory.HEAD');
  const headFiltering = viewerContent.includes('compatible.includes(baseTorsoId)');
  
  console.log(`   ✅ Verificación de compatibilidad de cabezas: ${headCompatibilityCheck ? 'PRESENTE' : 'AUSENTE'}`);
  console.log(`   ✅ Filtrado de cabezas: ${headFiltering ? 'PRESENTE' : 'AUSENTE'}`);
  
  if (headCompatibilityCheck && headFiltering) {
    console.log('   ✅ Sistema de compatibilidad de cabezas implementado correctamente');
  } else {
    console.log('   ❌ Falta implementación de compatibilidad de cabezas');
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
  
  // Verificar que las cabezas estén en los builds por defecto
  const headsInDefaults = constantsContent.includes('HEAD');
  console.log(`   ✅ Cabezas en builds por defecto: ${headsInDefaults ? 'PRESENTES' : 'AUSENTES'}`);
  
} catch (error) {
  console.log('   ❌ Error leyendo constants.ts:', error.message);
}

// 6. Verificar archivos de partes de cabezas
console.log('\n6️⃣ VERIFICANDO ARCHIVOS DE PARTES DE CABEZAS...');
try {
  const partsDir = 'src/parts';
  if (fs.existsSync(partsDir)) {
    const files = fs.readdirSync(partsDir);
    const headFiles = files.filter(f => f.includes('Head'));
    console.log(`   ✅ Archivos de cabezas encontrados: ${headFiles.length}`);
    headFiles.forEach(file => console.log(`      - ${file}`));
    
    // Verificar contenido de archivos de cabezas
    headFiles.forEach(file => {
      try {
        const fileContent = fs.readFileSync(`src/parts/${file}`, 'utf8');
        const headCount = (fileContent.match(/category: PartCategory\.HEAD/g) || []).length;
        console.log(`         ${file}: ${headCount} cabezas definidas`);
      } catch (err) {
        console.log(`         ${file}: Error leyendo archivo`);
      }
    });
  } else {
    console.log('   ❌ Directorio src/parts no encontrado');
  }
} catch (error) {
  console.log('   ❌ Error verificando archivos de partes:', error.message);
}

// 7. Verificar assets de cabezas
console.log('\n7️⃣ VERIFICANDO ASSETS DE CABEZAS...');
try {
  const assetsDir = 'public/assets/strong/head';
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const glbFiles = files.filter(f => f.endsWith('.glb'));
    console.log(`   ✅ Archivos GLB de cabezas encontrados: ${glbFiles.length}`);
    
    // Mostrar algunos ejemplos
    glbFiles.slice(0, 5).forEach(file => console.log(`      - ${file}`));
    if (glbFiles.length > 5) {
      console.log(`      ... y ${glbFiles.length - 5} más`);
    }
  } else {
    console.log('   ❌ Directorio de assets de cabezas no encontrado');
  }
} catch (error) {
  console.log('   ❌ Error verificando assets de cabezas:', error.message);
}

// 8. Verificar PartSelectorPanel para cabezas
console.log('\n8️⃣ VERIFICANDO PartSelectorPanel PARA CABEZAS...');
try {
  const panelContent = fs.readFileSync('components/PartSelectorPanel.tsx', 'utf8');
  
  // Verificar filtrado de cabezas
  const headFiltering = panelContent.includes('PartCategory.HEAD');
  const headCompatibility = panelContent.includes('compatible.includes');
  
  console.log(`   ✅ Filtrado de cabezas en panel: ${headFiltering ? 'PRESENTE' : 'AUSENTE'}`);
  console.log(`   ✅ Verificación de compatibilidad: ${headCompatibility ? 'PRESENTE' : 'AUSENTE'}`);
  
} catch (error) {
  console.log('   ❌ Error leyendo PartSelectorPanel.tsx:', error.message);
}

console.log('\n================================================');
console.log('🎯 RESUMEN DEL DIAGNÓSTICO DE CABEZAS');
console.log('================================================');

// Resumen final
console.log('\n📋 RECOMENDACIONES:');
console.log('1. Verificar que se usen categorías como keys para cabezas');
console.log('2. Asegurar que assignAdaptiveHeadForTorso funcione correctamente');
console.log('3. Confirmar que CharacterViewer filtre cabezas incompatibles');
console.log('4. Verificar que los builds por defecto incluyan cabezas válidas');
console.log('5. Comprobar que PartSelectorPanel maneje cabezas correctamente');
console.log('\n🔧 Si hay problemas, revisar los logs del navegador para errores específicos');

// Verificar si hay problemas específicos conocidos
console.log('\n🔍 PROBLEMAS CONOCIDOS A VERIFICAR:');
console.log('- Duplicación de cabezas en escena 3D');
console.log('- Cabezas incompatibles visibles');
console.log('- Estado inconsistente entre UI y escena');
console.log('- Preservación de tipo de cabeza al cambiar torso');
console.log('- Filtrado incorrecto en PartSelectorPanel'); 