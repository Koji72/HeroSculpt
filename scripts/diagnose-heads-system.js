#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function diagnoseHeadsSystem() {
  console.log('🔍 Diagnóstico del Sistema de Cabezas\n');

  // 1. Verificar archivos de cabezas
console.log('📋 1. Verificando archivos de cabezas...');
const headFiles = [
  'src/parts/strongHeadParts.ts',
  'src/parts/justicieroHeadParts.ts'
];

headFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} NO existe`);
  }
});

// 2. Verificar configuración de compatibilidad
console.log('\n📋 2. Verificando configuración de compatibilidad...');
try {
  const strongHeads = await import('../src/parts/strongHeadParts.ts');
  console.log(`✅ strongHeadParts.ts cargado correctamente`);
  console.log(`   - Total de cabezas: ${strongHeads.STRONG_HEAD_PARTS.length}`);
  
  // Verificar que todas las cabezas tienen compatibilidad
  const headsWithoutCompatibility = strongHeads.STRONG_HEAD_PARTS.filter(head => 
    !head.compatible || head.compatible.length === 0
  );
  
  if (headsWithoutCompatibility.length === 0) {
    console.log(`✅ Todas las cabezas tienen configuración de compatibilidad`);
  } else {
    console.log(`❌ ${headsWithoutCompatibility.length} cabezas sin compatibilidad:`);
    headsWithoutCompatibility.forEach(head => {
      console.log(`   - ${head.id}`);
    });
  }
  
  // Mostrar ejemplos de compatibilidad
  console.log('\n📋 Ejemplos de compatibilidad:');
  strongHeads.STRONG_HEAD_PARTS.slice(0, 3).forEach(head => {
    console.log(`   - ${head.id}: compatible con ${head.compatible.join(', ')}`);
  });
  
} catch (error) {
  console.log(`❌ Error cargando strongHeadParts.ts: ${error.message}`);
}

// 3. Verificar torsos disponibles
console.log('\n📋 3. Verificando torsos disponibles...');
try {
  const strongTorsos = await import('../src/parts/strongTorsoParts.ts');
  console.log(`✅ strongTorsoParts.ts cargado correctamente`);
  console.log(`   - Total de torsos: ${strongTorsos.STRONG_TORSO_PARTS.length}`);
  
  // Mostrar IDs de torsos
  const torsoIds = strongTorsos.STRONG_TORSO_PARTS.map(torso => torso.id);
  console.log(`   - IDs de torsos: ${torsoIds.join(', ')}`);
  
} catch (error) {
  console.log(`❌ Error cargando strongTorsoParts.ts: ${error.message}`);
}

// 4. Verificar lógica de filtrado en CharacterViewer
console.log('\n📋 4. Verificando lógica de filtrado...');
try {
  const characterViewerPath = 'components/CharacterViewer.tsx';
  const characterViewerContent = fs.readFileSync(characterViewerPath, 'utf8');
  
  // Verificar que existe el filtrado de cabezas
  if (characterViewerContent.includes('FILTRADO DE CABEZA COMPATIBLE')) {
    console.log(`✅ Filtrado de cabezas implementado en CharacterViewer.tsx`);
  } else {
    console.log(`❌ Filtrado de cabezas NO encontrado en CharacterViewer.tsx`);
  }
  
  // Verificar fallback para cuando no hay torso
  if (characterViewerContent.includes('No torso base found, keeping head')) {
    console.log(`✅ Fallback implementado para cabezas sin torso base`);
  } else {
    console.log(`❌ Fallback NO encontrado para cabezas sin torso base`);
  }
  
} catch (error) {
  console.log(`❌ Error leyendo CharacterViewer.tsx: ${error.message}`);
}

// 5. Verificar función de asignación adaptativa
console.log('\n📋 5. Verificando función de asignación adaptativa...');
try {
  const utilsPath = 'lib/utils.ts';
  const utilsContent = fs.readFileSync(utilsPath, 'utf8');
  
  if (utilsContent.includes('assignAdaptiveHeadForTorso')) {
    console.log(`✅ Función assignAdaptiveHeadForTorso encontrada`);
  } else {
    console.log(`❌ Función assignAdaptiveHeadForTorso NO encontrada`);
  }
  
} catch (error) {
  console.log(`❌ Error leyendo lib/utils.ts: ${error.message}`);
}

// 6. Verificar uso en App.tsx
console.log('\n📋 6. Verificando uso en App.tsx...');
try {
  const appPath = 'App.tsx';
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  const assignAdaptiveHeadCount = (appContent.match(/assignAdaptiveHeadForTorso/g) || []).length;
  console.log(`✅ assignAdaptiveHeadForTorso usado ${assignAdaptiveHeadCount} veces en App.tsx`);
  
} catch (error) {
  console.log(`❌ Error leyendo App.tsx: ${error.message}`);
}

console.log('\n🎯 RESUMEN DEL DIAGNÓSTICO');
console.log('========================');
console.log('✅ Verifica que todos los archivos existen');
console.log('✅ Verifica que la compatibilidad está configurada');
console.log('✅ Verifica que el filtrado está implementado');
console.log('✅ Verifica que el fallback funciona');
console.log('✅ Verifica que las funciones están siendo llamadas');

console.log('\n💡 PRÓXIMOS PASOS:');
console.log('1. Abre la aplicación en http://localhost:5177');
console.log('2. Selecciona un torso');
console.log('3. Intenta cambiar las cabezas');
console.log('4. Verifica que solo aparecen cabezas compatibles');
console.log('5. Verifica que las cabezas se cargan correctamente');

console.log('\n🔧 Si hay problemas:');
console.log('- Revisa la consola del navegador para errores');
console.log('- Verifica que los archivos GLB existen en public/assets/');
console.log('- Confirma que las rutas de archivos son correctas');
}

// Ejecutar el diagnóstico
diagnoseHeadsSystem().catch(console.error); 