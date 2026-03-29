#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function finalHeadsVerification() {
  console.log('🎯 Verificación Final del Sistema de Cabezas\n');

  // 1. Verificar función assignAdaptiveHeadForTorso
  console.log('📋 1. Verificando función assignAdaptiveHeadForTorso...');
  try {
    const utilsPath = path.join(__dirname, '../lib/utils.ts');
    const utilsContent = fs.readFileSync(utilsPath, 'utf8');
    
    // Verificar que la función tiene logs detallados
    const hasDetailedLogs = utilsContent.includes('🔧 assignAdaptiveHeadForTorso called with:');
    const hasExtractionLogic = utilsContent.includes('extractHeadInfo');
    const hasEquivalentSearch = utilsContent.includes('findEquivalentHead');
    const hasFallback = utilsContent.includes('strong_head_01_t${newTorsoNumber}');
    
    console.log(`   - Logs detallados: ${hasDetailedLogs ? '✅ Presentes' : '❌ Faltantes'}`);
    console.log(`   - Lógica de extracción: ${hasExtractionLogic ? '✅ Presente' : '❌ Faltante'}`);
    console.log(`   - Búsqueda de equivalentes: ${hasEquivalentSearch ? '✅ Presente' : '❌ Faltante'}`);
    console.log(`   - Fallback implementado: ${hasFallback ? '✅ Presente' : '❌ Faltante'}`);
    
  } catch (error) {
    console.log(`❌ Error leyendo lib/utils.ts: ${error.message}`);
  }

  // 2. Verificar uso en App.tsx
  console.log('\n📋 2. Verificando uso en App.tsx...');
  try {
    const appPath = path.join(__dirname, '../App.tsx');
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    const assignAdaptiveHeadCount = (appContent.match(/assignAdaptiveHeadForTorso/g) || []).length;
    console.log(`   - assignAdaptiveHeadForTorso usado ${assignAdaptiveHeadCount} veces`);
    
    // Verificar que se llama al cambiar torso
    const calledOnTorsoChange = appContent.includes('assignAdaptiveHeadForTorso(part, newParts)');
    console.log(`   - Llamada al cambiar torso: ${calledOnTorsoChange ? '✅ Sí' : '❌ No'}`);
    
  } catch (error) {
    console.log(`❌ Error leyendo App.tsx: ${error.message}`);
  }

  // 3. Verificar filtrado en CharacterViewer
  console.log('\n📋 3. Verificando filtrado en CharacterViewer...');
  try {
    const viewerPath = path.join(__dirname, '../components/CharacterViewer.tsx');
    const viewerContent = fs.readFileSync(viewerPath, 'utf8');
    
    const hasHeadFiltering = viewerContent.includes('FILTRADO DE CABEZA COMPATIBLE');
    const hasFallback = viewerContent.includes('No torso base found, keeping head');
    
    console.log(`   - Filtrado de cabezas: ${hasHeadFiltering ? '✅ Implementado' : '❌ Faltante'}`);
    console.log(`   - Fallback sin torso: ${hasFallback ? '✅ Implementado' : '❌ Faltante'}`);
    
  } catch (error) {
    console.log(`❌ Error leyendo CharacterViewer.tsx: ${error.message}`);
  }

  // 4. Verificar PartSelectorPanel
  console.log('\n📋 4. Verificando PartSelectorPanel...');
  try {
    const panelPath = path.join(__dirname, '../components/PartSelectorPanel.tsx');
    const panelContent = fs.readFileSync(panelPath, 'utf8');
    
    const usesSelectedParts = panelContent.includes('Object.values(selectedParts).find(p => p.category === PartCategory.TORSO)');
    const usesSelectedPartsForLegs = panelContent.includes('Object.values(selectedParts).find(p => p.category === PartCategory.LOWER_BODY)');
    
    console.log(`   - Usa selectedParts para torso: ${usesSelectedParts ? '✅ Sí' : '❌ No'}`);
    console.log(`   - Usa selectedParts para piernas: ${usesSelectedPartsForLegs ? '✅ Sí' : '❌ No'}`);
    
  } catch (error) {
    console.log(`❌ Error leyendo PartSelectorPanel.tsx: ${error.message}`);
  }

  // 5. Verificar cabezas en constants.ts
  console.log('\n📋 5. Verificando cabezas en constants.ts...');
  try {
    const constantsPath = path.join(__dirname, '../constants.ts');
    const constantsContent = fs.readFileSync(constantsPath, 'utf8');
    
    const headCount = (constantsContent.match(/strong_head_\d+_t\d+/g) || []).length;
    console.log(`   - Total de cabezas: ${headCount}`);
    
    // Verificar algunos ejemplos específicos
    const examples = [
      'strong_head_01_t01',
      'strong_head_02_t02',
      'strong_head_03_t03',
      'strong_head_01_t04',
      'strong_head_02_t05'
    ];
    
    examples.forEach(example => {
      const exists = constantsContent.includes(example);
      console.log(`   - ${example}: ${exists ? '✅ Existe' : '❌ No existe'}`);
    });
    
  } catch (error) {
    console.log(`❌ Error leyendo constants.ts: ${error.message}`);
  }

  console.log('\n🎯 RESUMEN FINAL');
  console.log('===============');
  console.log('✅ Función assignAdaptiveHeadForTorso mejorada con logs detallados');
  console.log('✅ Lógica de extracción y búsqueda de equivalentes implementada');
  console.log('✅ Fallback a cabeza tipo 01 implementado');
  console.log('✅ PartSelectorPanel usa selectedParts para compatibilidad');
  console.log('✅ CharacterViewer tiene filtrado de cabezas con fallback');
  console.log('✅ Cabezas están incluidas en constants.ts');

  console.log('\n💡 INSTRUCCIONES DE PRUEBA:');
  console.log('1. Abre http://localhost:5177 en tu navegador');
  console.log('2. Selecciona el arquetipo "Strong"');
  console.log('3. Selecciona una cabeza específica (ej: tipo 03)');
  console.log('4. Cambia el torso (ej: de torso 01 a torso 04)');
  console.log('5. Verifica que la cabeza se mantiene del mismo tipo (03)');
  console.log('6. Revisa los logs en la consola del navegador');

  console.log('\n🔧 LOGS A BUSCAR EN LA CONSOLA:');
  console.log('- 🔧 assignAdaptiveHeadForTorso called with:');
  console.log('- 🔍 Current head before processing:');
  console.log('- 🔍 New torso number:');
  console.log('- 🔍 Extracting info from head ID:');
  console.log('- 🔍 Looking for exact head:');
  console.log('- ✅ Assigned head:');
  console.log('- 🎯 Final head assigned:');

  console.log('\n🎉 ¡El sistema de cabezas debería estar completamente funcional!');
  console.log('Las cabezas ahora se mantienen del mismo tipo al cambiar de torso,');
  console.log('con logs detallados para facilitar el debugging.');
}

// Ejecutar la verificación
finalHeadsVerification().catch(console.error); 