#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testHeadsCompatibility() {
  console.log('🧪 Prueba de Compatibilidad de Cabezas\n');

  // Simular la lógica del PartSelectorPanel
  console.log('📋 Simulando lógica del PartSelectorPanel...\n');

  // 1. Verificar que las cabezas existen en ALL_PARTS
  console.log('1. Verificando cabezas en ALL_PARTS...');
  
  try {
    // Leer el archivo constants.ts para ver ALL_PARTS
    const constantsPath = path.join(__dirname, '../constants.ts');
    const constantsContent = fs.readFileSync(constantsPath, 'utf8');
    
    // Buscar referencias a cabezas
    const headReferences = constantsContent.match(/strongHeadParts|justicieroHeadParts/g);
    if (headReferences) {
      console.log(`✅ Referencias a cabezas encontradas: ${headReferences.join(', ')}`);
    } else {
      console.log('❌ No se encontraron referencias a cabezas en constants.ts');
    }
    
    // Verificar que STRONG_HEAD_PARTS está incluido
    if (constantsContent.includes('STRONG_HEAD_PARTS')) {
      console.log('✅ STRONG_HEAD_PARTS está incluido en constants.ts');
    } else {
      console.log('❌ STRONG_HEAD_PARTS NO está incluido en constants.ts');
    }
    
  } catch (error) {
    console.log(`❌ Error leyendo constants.ts: ${error.message}`);
  }

  // 2. Simular la lógica de filtrado
  console.log('\n2. Simulando lógica de filtrado...');
  
  // Simular partes seleccionadas (sin torso)
  const selectedParts = {};
  const previewParts = {};
  
  console.log('📋 Estado simulado:');
  console.log(`   - selectedParts: ${Object.keys(selectedParts).length} partes`);
  console.log(`   - previewParts: ${Object.keys(previewParts).length} partes`);
  
  // Simular la lógica de filtrado del PartSelectorPanel
  const activeCategory = 'HEAD';
  const selectedArchetype = 'STRONG';
  
  console.log(`\n📋 Filtrado para categoría: ${activeCategory}, Arquetipo: ${selectedArchetype}`);
  
  // Verificar si hay torso activo
  const selectedTorso = Object.values(previewParts).find(p => p.category === 'TORSO');
  const selectedSuit = Object.values(previewParts).find(p => p.category === 'SUIT_TORSO');
  const activeTorso = selectedSuit || selectedTorso;
  
  console.log(`   - Torso seleccionado: ${selectedTorso ? selectedTorso.id : 'Ninguno'}`);
  console.log(`   - Traje seleccionado: ${selectedSuit ? selectedSuit.id : 'Ninguno'}`);
  console.log(`   - Torso activo: ${activeTorso ? activeTorso.id : 'Ninguno'}`);
  
  if (!activeTorso) {
    console.log('⚠️ No hay torso activo - esto puede causar que las cabezas no aparezcan');
    console.log('💡 Las cabezas requieren un torso para mostrar compatibilidad');
  }

  // 3. Verificar archivos de cabezas
  console.log('\n3. Verificando archivos de cabezas...');
  
  const headFiles = [
    'src/parts/strongHeadParts.ts',
    'src/parts/justicieroHeadParts.ts'
  ];
  
  headFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const headCount = (content.match(/id:\s*'[^']*head[^']*'/gi) || []).length;
      console.log(`✅ ${file} existe con ${headCount} cabezas`);
    } else {
      console.log(`❌ ${file} NO existe`);
    }
  });

  // 4. Verificar que las cabezas están en constants.ts
  console.log('\n4. Verificando inclusión en constants.ts...');
  
  try {
    const constantsPath = path.join(__dirname, '../constants.ts');
    const constantsContent = fs.readFileSync(constantsPath, 'utf8');
    
    // Buscar importaciones de cabezas
    const headImports = constantsContent.match(/import.*Head.*from/g);
    if (headImports) {
      console.log('✅ Importaciones de cabezas encontradas:');
      headImports.forEach(imp => console.log(`   - ${imp}`));
    } else {
      console.log('❌ No se encontraron importaciones de cabezas');
    }
    
    // Buscar inclusión en ALL_PARTS
    const allPartsMatch = constantsContent.match(/ALL_PARTS\s*=\s*\[([\s\S]*?)\]/);
    if (allPartsMatch) {
      const allPartsContent = allPartsMatch[1];
      if (allPartsContent.includes('STRONG_HEAD_PARTS')) {
        console.log('✅ STRONG_HEAD_PARTS incluido en ALL_PARTS');
      } else {
        console.log('❌ STRONG_HEAD_PARTS NO incluido en ALL_PARTS');
      }
    } else {
      console.log('❌ No se pudo encontrar ALL_PARTS en constants.ts');
    }
    
  } catch (error) {
    console.log(`❌ Error analizando constants.ts: ${error.message}`);
  }

  console.log('\n🎯 DIAGNÓSTICO COMPLETO');
  console.log('========================');
  console.log('✅ Verifica que las cabezas están en constants.ts');
  console.log('✅ Verifica que hay un torso seleccionado');
  console.log('✅ Verifica que la compatibilidad está configurada');
  console.log('✅ Verifica que el filtrado funciona correctamente');

  console.log('\n💡 SOLUCIONES POSIBLES:');
  console.log('1. Si no hay torso: Selecciona un torso primero');
  console.log('2. Si las cabezas no están en constants.ts: Añádelas');
  console.log('3. Si hay error de compatibilidad: Verifica la configuración');
  console.log('4. Si hay error de carga: Verifica las rutas de archivos GLB');
}

// Ejecutar la prueba
testHeadsCompatibility().catch(console.error); 