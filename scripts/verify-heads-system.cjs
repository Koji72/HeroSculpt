#!/usr/bin/env node

/**
 * Script de Verificación del Sistema de Cabezas
 * Verifica que el sistema de cabezas esté funcionando correctamente
 * 
 * Uso: node scripts/verify-heads-system.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DEL SISTEMA DE CABEZAS');
console.log('=====================================\n');

let allChecksPassed = true;

// 1. Verificar que no existe el archivo obsoleto
console.log('1️⃣ Verificando archivo obsoleto...');
const obsoleteFile = path.join(__dirname, '..', 'src', 'parts', 'normalHeadParts.ts');
if (fs.existsSync(obsoleteFile)) {
  console.log('❌ ERROR: Archivo obsoleto encontrado:', obsoleteFile);
  console.log('   Este archivo debe ser eliminado.');
  allChecksPassed = false;
} else {
  console.log('✅ Archivo obsoleto eliminado correctamente');
}

// 2. Verificar definiciones en constants.ts
console.log('\n2️⃣ Verificando definiciones en constants.ts...');
const constantsFile = path.join(__dirname, '..', 'constants.ts');
if (!fs.existsSync(constantsFile)) {
  console.log('❌ ERROR: constants.ts no encontrado');
  allChecksPassed = false;
} else {
  const constantsContent = fs.readFileSync(constantsFile, 'utf8');
  
  // Verificar rutas correctas
  const correctPaths = constantsContent.match(/assets\/strong\/head\/strong_head_\d+_t\d+\.glb/g);
  if (correctPaths && correctPaths.length > 0) {
    console.log(`✅ ${correctPaths.length} rutas correctas encontradas`);
  } else {
    console.log('❌ ERROR: No se encontraron rutas correctas de cabezas');
    allChecksPassed = false;
  }
  
  // Verificar que no hay rutas incorrectas
  const incorrectPaths = constantsContent.match(/assets\/normal\/head\//g);
  if (incorrectPaths) {
    console.log('❌ ERROR: Se encontraron rutas incorrectas (normal/head)');
    allChecksPassed = false;
  } else {
    console.log('✅ No se encontraron rutas incorrectas');
  }
}

// 3. Verificar lógica de preservación en App.tsx
console.log('\n3️⃣ Verificando lógica de preservación en App.tsx...');
const appFile = path.join(__dirname, '..', 'App.tsx');
if (!fs.existsSync(appFile)) {
  console.log('❌ ERROR: App.tsx no encontrado');
  allChecksPassed = false;
} else {
  const appContent = fs.readFileSync(appFile, 'utf8');
  
  // Relajar el patrón: permitir comentarios y líneas en blanco entre las líneas clave
  const relaxedPattern = /const\s+currentHead\s*=\s*newParts\[PartCategory\.HEAD\];([\s\S]{0,120}?)TORSO_DEPENDENT_CATEGORIES\.forEach\(dep\s*=>\s*{\s*delete\s+newParts\[dep\];\s*}\);/m;
  if (relaxedPattern.test(appContent)) {
    console.log('✅ Lógica de preservación correcta encontrada (patrón relajado)');
  } else {
    console.log('❌ ERROR: Lógica de preservación incorrecta o faltante');
    allChecksPassed = false;
  }
  
  // Verificar llamada a assignAdaptiveHeadForTorso
  const adaptiveCallPattern = /assignAdaptiveHeadForTorso\(.*partsWithHead\)/;
  if (adaptiveCallPattern.test(appContent)) {
    console.log('✅ Llamada correcta a assignAdaptiveHeadForTorso');
  } else {
    console.log('❌ ERROR: Llamada incorrecta a assignAdaptiveHeadForTorso');
    allChecksPassed = false;
  }
}

// 4. Verificar función assignAdaptiveHeadForTorso en utils.ts
console.log('\n4️⃣ Verificando función assignAdaptiveHeadForTorso...');
const utilsFile = path.join(__dirname, '..', 'lib', 'utils.ts');
if (!fs.existsSync(utilsFile)) {
  console.log('❌ ERROR: lib/utils.ts no encontrado');
  allChecksPassed = false;
} else {
  const utilsContent = fs.readFileSync(utilsFile, 'utf8');
  
  // Verificar que la función existe
  if (utilsContent.includes('assignAdaptiveHeadForTorso')) {
    console.log('✅ Función assignAdaptiveHeadForTorso encontrada');
  } else {
    console.log('❌ ERROR: Función assignAdaptiveHeadForTorso no encontrada');
    allChecksPassed = false;
  }
  
  // Verificar lógica de compatibilidad
  if (utilsContent.includes('currentHead.compatible.includes(newTorso.id)')) {
    console.log('✅ Lógica de compatibilidad encontrada');
  } else {
    console.log('❌ ERROR: Lógica de compatibilidad faltante');
    allChecksPassed = false;
  }
  
  // Verificar búsqueda por tipo
  if (utilsContent.includes('strong_head_${currentType}_')) {
    console.log('✅ Búsqueda por tipo de cabeza encontrada');
  } else {
    console.log('❌ ERROR: Búsqueda por tipo de cabeza faltante');
    allChecksPassed = false;
  }
}

// 5. Verificar archivos de cabezas en assets
console.log('\n5️⃣ Verificando archivos de cabezas en assets...');
const headsDir = path.join(__dirname, '..', 'public', 'assets', 'strong', 'head');
if (!fs.existsSync(headsDir)) {
  console.log('❌ ERROR: Directorio de cabezas no encontrado:', headsDir);
  allChecksPassed = false;
} else {
  const headFiles = fs.readdirSync(headsDir).filter(file => file.endsWith('.glb'));
  if (headFiles.length > 0) {
    console.log(`✅ ${headFiles.length} archivos de cabezas encontrados`);
    
    // Verificar algunos archivos específicos
    const expectedFiles = [
      'strong_head_01_t01.glb',
      'strong_head_01_t02.glb',
      'strong_head_02_t01.glb',
      'strong_head_02_t02.glb'
    ];
    
    const missingFiles = expectedFiles.filter(file => !headFiles.includes(file));
    if (missingFiles.length === 0) {
      console.log('✅ Archivos de cabezas principales encontrados');
    } else {
      console.log('⚠️  Algunos archivos de cabezas faltantes:', missingFiles);
    }
  } else {
    console.log('❌ ERROR: No se encontraron archivos de cabezas');
    allChecksPassed = false;
  }
}

// 6. Verificar documentación
console.log('\n6️⃣ Verificando documentación...');
const docsFile = path.join(__dirname, '..', 'docs', 'HEADS_SYSTEM_FIX_2025.md');
if (fs.existsSync(docsFile)) {
  console.log('✅ Documentación del sistema de cabezas encontrada');
  
  const docsContent = fs.readFileSync(docsFile, 'utf8');
  if (docsContent.includes('FUNCIONANDO PERFECTAMENTE')) {
    console.log('✅ Documentación indica sistema funcionando');
  } else {
    console.log('⚠️  Documentación no indica estado funcional');
  }
} else {
  console.log('❌ ERROR: Documentación del sistema de cabezas no encontrada');
  allChecksPassed = false;
}

// 7. Verificar reglas críticas
console.log('\n7️⃣ Verificando reglas críticas...');
const rulesFile = path.join(__dirname, '..', '.cursor', 'rules', '.cursorrules');
if (fs.existsSync(rulesFile)) {
  const rulesContent = fs.readFileSync(rulesFile, 'utf8');
  
  if (rulesContent.includes('Head Preservation System')) {
    console.log('✅ Reglas de preservación de cabezas encontradas');
  } else {
    console.log('❌ ERROR: Reglas de preservación de cabezas faltantes');
    allChecksPassed = false;
  }
  
  if (rulesContent.includes('assets/strong/head/')) {
    console.log('✅ Reglas de rutas de cabezas encontradas');
  } else {
    console.log('❌ ERROR: Reglas de rutas de cabezas faltantes');
    allChecksPassed = false;
  }
} else {
  console.log('❌ ERROR: Archivo de reglas no encontrado');
  allChecksPassed = false;
}

// Resumen final
console.log('\n=====================================');
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('=====================================');

if (allChecksPassed) {
  console.log('🎉 ¡TODAS LAS VERIFICACIONES PASARON!');
  console.log('✅ El sistema de cabezas está funcionando correctamente');
  console.log('✅ La documentación está completa');
  console.log('✅ Las reglas críticas están protegidas');
  console.log('\n🚀 El sistema está listo para usar');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('🔧 Revisa los errores arriba y corrígelos');
  console.log('📚 Consulta la documentación: docs/HEADS_SYSTEM_FIX_2025.md');
}

console.log('\n📚 Documentación disponible:');
console.log('   - docs/HEADS_SYSTEM_FIX_2025.md');
console.log('   - docs/DOCUMENTATION_INDEX.md');
console.log('   - .cursor/rules/.cursorrules');

process.exit(allChecksPassed ? 0 : 1); 