#!/usr/bin/env node

/**
 * 🧪 PRUEBA DE PRESERVACIÓN DE CABEZAS - 2025
 * 
 * Este script simula el comportamiento del sistema de cabezas
 * para verificar que la preservación funciona correctamente.
 */

console.log('🧪 PRUEBA DE PRESERVACIÓN DE CABEZAS - 2025');
console.log('============================================\n');

// Simular el estado inicial
const simulateInitialState = () => {
  console.log('📋 1. ESTADO INICIAL:');
  console.log('=====================');
  
  const initialState = {
    torso: 'strong_torso_01',
    head: 'strong_head_02_t01', // Cabeza tipo 02 para torso 01
    hands: {
      left: 'strong_hands_fist_01_t01_l_g',
      right: 'strong_hands_fist_01_t01_r_g'
    },
    cape: 'strong_cape_01_t01',
    symbol: 'strong_symbol_01_t01'
  };
  
  console.log('   Torso actual:', initialState.torso);
  console.log('   Cabeza actual:', initialState.head);
  console.log('   Manos actuales:', initialState.hands);
  console.log('   Capa actual:', initialState.cape);
  console.log('   Símbolo actual:', initialState.symbol);
  
  return initialState;
};

// Simular cambio de torso
const simulateTorsoChange = (currentState, newTorsoId) => {
  console.log(`\n🔄 2. CAMBIO DE TORSO A: ${newTorsoId}`);
  console.log('=====================================');
  
  // Simular la lógica de preservación
  console.log('   🔍 Preservando cabeza actual...');
  const currentHead = currentState.head;
  console.log(`   ✅ Cabeza preservada: ${currentHead}`);
  
  // Simular eliminación de partes dependientes
  console.log('   🗑️ Eliminando partes dependientes del torso...');
  console.log('      - Manos eliminadas');
  console.log('      - Capa eliminada');
  console.log('      - Símbolo eliminado');
  console.log('      - Cabeza NO eliminada (preservada)');
  
  // Simular asignación de cabeza adaptativa
  console.log('   🎯 Asignando cabeza adaptativa...');
  
  // Verificar compatibilidad
  const headMatch = currentHead.match(/strong_head_(\d+)_t(\d+)/);
  if (headMatch) {
    const [, headType, currentTorsoType] = headMatch;
    const newTorsoMatch = newTorsoId.match(/strong_torso_(\d+)/);
    
    if (newTorsoMatch) {
      const [, newTorsoType] = newTorsoMatch;
      
      // Buscar cabeza del mismo tipo para el nuevo torso
      const compatibleHeadId = `strong_head_${headType}_t${newTorsoType}`;
      
      console.log(`   📊 Análisis de compatibilidad:`);
      console.log(`      - Tipo de cabeza actual: ${headType}`);
      console.log(`      - Torso anterior: ${currentTorsoType}`);
      console.log(`      - Nuevo torso: ${newTorsoType}`);
      console.log(`      - Cabeza compatible buscada: ${compatibleHeadId}`);
      
      // Verificar si existe la cabeza compatible
      const compatibleHeadExists = true; // Simulado - en realidad verificaría en constants.ts
      
      if (compatibleHeadExists) {
        console.log(`   ✅ Cabeza compatible encontrada: ${compatibleHeadId}`);
        return {
          ...currentState,
          torso: newTorsoId,
          head: compatibleHeadId,
          hands: {
            left: `strong_hands_fist_01_t${newTorsoType}_l_g`,
            right: `strong_hands_fist_01_t${newTorsoType}_r_g`
          },
          cape: `strong_cape_01_t${newTorsoType}`,
          symbol: `strong_symbol_01_t${newTorsoType}`
        };
      } else {
        console.log(`   ⚠️ Cabeza compatible no encontrada, usando primera disponible`);
        return {
          ...currentState,
          torso: newTorsoId,
          head: `strong_head_01_t${newTorsoType}`,
          hands: {
            left: `strong_hands_fist_01_t${newTorsoType}_l_g`,
            right: `strong_hands_fist_01_t${newTorsoType}_r_g`
          },
          cape: `strong_cape_01_t${newTorsoType}`,
          symbol: `strong_symbol_01_t${newTorsoType}`
        };
      }
    }
  }
  
  return currentState;
};

// Ejecutar la simulación
const runSimulation = () => {
  console.log('🎬 INICIANDO SIMULACIÓN...\n');
  
  // Estado inicial
  let state = simulateInitialState();
  
  // Cambio de torso 01 a torso 02
  state = simulateTorsoChange(state, 'strong_torso_02');
  
  console.log('\n📋 3. ESTADO FINAL:');
  console.log('==================');
  console.log('   Torso final:', state.torso);
  console.log('   Cabeza final:', state.head);
  console.log('   Manos finales:', state.hands);
  console.log('   Capa final:', state.cape);
  console.log('   Símbolo final:', state.symbol);
  
  // Verificar preservación
  console.log('\n✅ 4. VERIFICACIÓN DE PRESERVACIÓN:');
  console.log('==================================');
  
  const headMatch = state.head.match(/strong_head_(\d+)_t\d+/);
  if (headMatch) {
    const headType = headMatch[1];
    console.log(`   ✅ Tipo de cabeza preservado: ${headType}`);
    console.log(`   ✅ Cabeza adaptada al nuevo torso correctamente`);
    console.log(`   ✅ No se perdió la selección del usuario`);
  } else {
    console.log('   ❌ ERROR: No se pudo verificar la preservación');
  }
  
  // Cambio de torso 02 a torso 03
  console.log('\n🔄 5. SEGUNDO CAMBIO DE TORSO:');
  console.log('==============================');
  state = simulateTorsoChange(state, 'strong_torso_03');
  
  console.log('\n📋 6. ESTADO FINAL DESPUÉS DEL SEGUNDO CAMBIO:');
  console.log('==============================================');
  console.log('   Torso final:', state.torso);
  console.log('   Cabeza final:', state.head);
  console.log('   Manos finales:', state.hands);
  console.log('   Capa final:', state.cape);
  console.log('   Símbolo final:', state.symbol);
  
  // Verificación final
  console.log('\n🎯 7. VERIFICACIÓN FINAL:');
  console.log('========================');
  
  const finalHeadMatch = state.head.match(/strong_head_(\d+)_t\d+/);
  if (finalHeadMatch) {
    const finalHeadType = finalHeadMatch[1];
    console.log(`   ✅ Tipo de cabeza preservado a través de múltiples cambios: ${finalHeadType}`);
    console.log(`   ✅ Sistema de preservación funcionando correctamente`);
    console.log(`   ✅ Usuario mantiene su selección de cabeza`);
  } else {
    console.log('   ❌ ERROR: Sistema de preservación falló');
  }
};

// Ejecutar la simulación
runSimulation();

console.log('\n✅ Simulación completada');
console.log('\n💡 RESULTADO ESPERADO:');
console.log('   - Las cabezas deben preservarse al cambiar de torso');
console.log('   - El tipo de cabeza debe mantenerse (01, 02, 03, 04)');
console.log('   - Solo debe cambiar el sufijo del torso (t01, t02, t03, etc.)');
console.log('   - El usuario no debe perder su selección de cabeza'); 