#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO REAL: PRESERVACIÓN DE CABEZA');
console.log('=============================================\n');

// Simular el flujo real de App.tsx
try {
  // 1. Cargar las constantes
  const constantsPath = path.join(__dirname, '..', 'constants.ts');
  const constantsContent = fs.readFileSync(constantsPath, 'utf8');
  
  // Extraer ALL_PARTS usando regex
  const allPartsMatch = constantsContent.match(/export const ALL_PARTS: Part\[\] = (\[[\s\S]*?\]);/);
  if (!allPartsMatch) {
    console.log('❌ No se pudo extraer ALL_PARTS de constants.ts');
    process.exit(1);
  }
  
  // Evaluar ALL_PARTS (simplificado)
  const allPartsStr = allPartsMatch[1].replace(/PartCategory\./g, '"').replace(/ArchetypeId\./g, '"');
  const ALL_PARTS = eval(allPartsStr);
  
  // 2. Simular el estado inicial
  const initialState = {
    TORSO: ALL_PARTS.find(p => p.id === 'strong_torso_01'),
    HEAD: ALL_PARTS.find(p => p.id === 'strong_head_03_t01') // Cabeza tipo 03
  };
  
  console.log('🎯 ESTADO INICIAL:');
  console.log('   Torso:', initialState.TORSO?.id);
  console.log('   Cabeza:', initialState.HEAD?.id);
  console.log('');
  
  // 3. Simular cambio de torso a strong_torso_02
  console.log('🔄 CAMBIO DE TORSO: strong_torso_01 → strong_torso_02');
  console.log('==================================================');
  
  const newTorso = ALL_PARTS.find(p => p.id === 'strong_torso_02');
  console.log('   Nuevo torso:', newTorso?.id);
  
  // Simular la lógica de App.tsx
  let newParts = { ...initialState };
  
  // Eliminar partes dependientes del torso
  delete newParts.HEAD;
  delete newParts.HAND_LEFT;
  delete newParts.HAND_RIGHT;
  delete newParts.CAPE;
  delete newParts.SUIT_TORSO;
  
  // Agregar nuevo torso
  newParts.TORSO = newTorso;
  
  console.log('   Partes después de limpiar:', Object.keys(newParts));
  
  // 4. Simular assignAdaptiveHeadForTorso
  console.log('\n🔍 EJECUTANDO assignAdaptiveHeadForTorso...');
  
  const currentHead = initialState.HEAD;
  console.log('   Cabeza actual:', currentHead?.id);
  
  if (!currentHead) {
    console.log('   ❌ No hay cabeza actual');
    process.exit(1);
  }
  
  // Verificar compatibilidad
  const isCurrentHeadCompatible = currentHead.compatible.includes(newTorso.id);
  console.log('   ¿Cabeza actual compatible?', isCurrentHeadCompatible);
  
  if (isCurrentHeadCompatible) {
    console.log('   ✅ Cabeza actual es compatible, manteniendo:', currentHead.id);
    newParts.HEAD = currentHead;
  } else {
    console.log('   ❌ Cabeza actual NO es compatible, buscando del mismo tipo...');
    
    // Extraer tipo de cabeza actual
    const headMatch = currentHead.id.match(/strong_head_(\d+)_t\d+/);
    const currentType = headMatch ? headMatch[1] : null;
    console.log('   Tipo de cabeza actual:', currentType);
    
    // Buscar cabezas compatibles
    const compatibleHeads = ALL_PARTS.filter(p => 
      p.category === 'HEAD' && 
      p.archetype === newTorso.archetype &&
      p.compatible.includes(newTorso.id)
    );
    
    console.log('   Cabezas compatibles encontradas:', compatibleHeads.length);
    console.log('   IDs de cabezas compatibles:', compatibleHeads.map(h => h.id));
    
    // Buscar cabeza del mismo tipo
    if (currentType) {
      const matchingHead = compatibleHeads.find(p => p.id.includes(`strong_head_${currentType}_`));
      if (matchingHead) {
        console.log('   ✅ Encontrada cabeza del mismo tipo:', matchingHead.id);
        newParts.HEAD = matchingHead;
      } else {
        console.log('   ❌ No se encontró cabeza del mismo tipo');
        if (compatibleHeads.length > 0) {
          console.log('   📌 Usando primera cabeza compatible:', compatibleHeads[0].id);
          newParts.HEAD = compatibleHeads[0];
        }
      }
    } else {
      if (compatibleHeads.length > 0) {
        console.log('   📌 No se pudo determinar tipo, usando primera compatible:', compatibleHeads[0].id);
        newParts.HEAD = compatibleHeads[0];
      }
    }
  }
  
  console.log('\n🎯 RESULTADO FINAL:');
  console.log('   Torso:', newParts.TORSO?.id);
  console.log('   Cabeza:', newParts.HEAD?.id);
  
  // 5. Verificar si se preservó el tipo
  const originalType = initialState.HEAD?.id.match(/strong_head_(\d+)_t\d+/)?.[1];
  const finalType = newParts.HEAD?.id.match(/strong_head_(\d+)_t\d+/)?.[1];
  
  console.log('\n🔍 VERIFICACIÓN DE PRESERVACIÓN:');
  console.log('   Tipo original:', originalType);
  console.log('   Tipo final:', finalType);
  console.log('   ¿Se preservó el tipo?', originalType === finalType ? '✅ SÍ' : '❌ NO');
  
  if (originalType !== finalType) {
    console.log('\n🚨 PROBLEMA DETECTADO:');
    console.log('   La cabeza cambió de tipo al cambiar de torso');
    console.log('   Esto indica que hay un problema en la lógica de preservación');
  } else {
    console.log('\n✅ RESULTADO CORRECTO:');
    console.log('   El tipo de cabeza se preservó correctamente');
  }
  
} catch (error) {
  console.error('❌ Error durante el diagnóstico:', error.message);
  process.exit(1);
} 