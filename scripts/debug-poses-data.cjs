const fs = require('fs');

console.log('🔍 DIAGNÓSTICO DE DATOS DE POSES');
console.log('================================\n');

// Verificar archivos de configuración
console.log('📁 VERIFICACIÓN DE ARCHIVOS:');
const filesToCheck = [
  'services/purchaseHistoryService.ts',
  'services/userConfigService.ts',
  'services/sessionStorageService.ts',
  'App.tsx'
];

filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Simular datos de prueba para verificar el flujo
console.log('\n🧪 SIMULACIÓN DE DATOS DE PRUEBA:');

// Simular compras
const mockPurchases = [
  {
    id: 'purchase-1',
    user_id: 'test-user-1',
    purchase_date: '2025-01-15T10:30:00Z',
    purchase_items: [
      {
        id: 'item-1',
        item_name: 'Superhéroe Básico',
        configuration_data: {
          TORSO: { id: 'strong_torso_01', name: 'Torso Básico', priceUSD: 5.99 },
          HEAD: { id: 'strong_head_01_t01', name: 'Cabeza Básica', priceUSD: 3.99 }
        }
      },
      {
        id: 'item-2',
        item_name: 'Villano Oscuro',
        configuration_data: {
          TORSO: { id: 'strong_torso_02', name: 'Torso Oscuro', priceUSD: 7.99 },
          CAPE: { id: 'strong_cape_01_t01', name: 'Capa Negra', priceUSD: 4.99 }
        }
      }
    ]
  },
  {
    id: 'purchase-2',
    user_id: 'test-user-1',
    purchase_date: '2025-01-14T15:45:00Z',
    purchase_items: [
      {
        id: 'item-3',
        item_name: 'Protector de la Ciudad',
        configuration_data: {
          TORSO: { id: 'strong_torso_03', name: 'Torso Protector', priceUSD: 9.99 },
          SYMBOL: { id: 'strong_symbol_01_t01', name: 'Símbolo Protector', priceUSD: 2.99 }
        }
      }
    ]
  }
];

// Simular configuraciones guardadas
const mockConfigurations = [
  {
    id: 'config-1',
    user_id: 'test-user-1',
    configuration_name: 'Mi Superhéroe Personalizado',
    configuration_data: {
      TORSO: { id: 'strong_torso_01', name: 'Torso Personalizado', priceUSD: 0 },
      HEAD: { id: 'strong_head_01_t02', name: 'Cabeza Personalizada', priceUSD: 0 },
      HANDS: { id: 'strong_hands_open_01_t01_l_g', name: 'Manos Abiertas', priceUSD: 0 }
    },
    created_at: '2025-01-13T09:20:00Z'
  },
  {
    id: 'config-2',
    user_id: 'test-user-1',
    configuration_name: 'Villano Final',
    configuration_data: {
      TORSO: { id: 'strong_torso_02', name: 'Torso Villano', priceUSD: 0 },
      CAPE: { id: 'strong_cape_01_t02', name: 'Capa Villana', priceUSD: 0 },
      SYMBOL: { id: 'strong_symbol_01_t02', name: 'Símbolo Malvado', priceUSD: 0 }
    },
    created_at: '2025-01-12T14:15:00Z'
  }
];

console.log('\n📦 COMPRAS SIMULADAS:');
mockPurchases.forEach((purchase, index) => {
  console.log(`   Compra ${index + 1}: ${purchase.id}`);
  console.log(`   - Fecha: ${purchase.purchase_date}`);
  console.log(`   - Items: ${purchase.purchase_items.length}`);
  purchase.purchase_items.forEach((item, itemIndex) => {
    console.log(`     ${itemIndex + 1}. ${item.item_name}`);
    console.log(`        Configuración: ${Object.keys(item.configuration_data).join(', ')}`);
  });
});

console.log('\n💾 CONFIGURACIONES GUARDADAS:');
mockConfigurations.forEach((config, index) => {
  console.log(`   Config ${index + 1}: ${config.configuration_name}`);
  console.log(`   - Fecha: ${config.created_at}`);
  console.log(`   - Partes: ${Object.keys(config.configuration_data).join(', ')}`);
});

// Simular proceso de carga de poses
console.log('\n🔄 PROCESO DE CARGA DE POSES:');

// Combinar poses de compras y configuraciones
const allPoses = [];

// Agregar poses de compras
let purchasePoseCount = 0;
mockPurchases.forEach((purchase, purchaseIndex) => {
  console.log(`🛒 Procesando compra ${purchaseIndex + 1}: ${purchase.id}`);
  purchase.purchase_items.forEach((item, index) => {
    if (item.configuration_data) {
      purchasePoseCount++;
      const poseName = `${item.item_name} (Compra ${purchaseIndex + 1})`;
      console.log(`   - Agregando pose ${purchasePoseCount}: ${poseName}`);
      allPoses.push({
        id: `purchase-${purchase.id}-${index}`,
        name: poseName,
        configuration: item.configuration_data,
        source: 'purchase',
        date: purchase.purchase_date
      });
    }
  });
});

// Agregar configuraciones guardadas
let savedPoseCount = 0;
mockConfigurations.forEach((config, index) => {
  savedPoseCount++;
  console.log(`💾 Agregando pose guardada ${savedPoseCount}: ${config.configuration_name}`);
  allPoses.push({
    id: `saved-${config.id}`,
    name: `${config.configuration_name} (Guardado)`,
    configuration: config.configuration_data,
    source: 'saved',
    date: config.created_at
  });
});

// Ordenar por fecha
allPoses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log(`\n✅ TOTAL DE POSES CARGADAS: ${allPoses.length}`);
console.log(`   - ${purchasePoseCount} de compras`);
console.log(`   - ${savedPoseCount} de configuraciones guardadas`);

console.log('\n📋 LISTA COMPLETA DE POSES:');
allPoses.forEach((pose, index) => {
  console.log(`   ${index + 1}. ${pose.name} (${pose.source})`);
  console.log(`      Fecha: ${pose.date}`);
  console.log(`      Partes: ${Object.keys(pose.configuration).join(', ')}`);
});

// Verificar el problema potencial
console.log('\n🔍 DIAGNÓSTICO DE PROBLEMAS:');

const potentialIssues = [
  'Usuario no autenticado',
  'No hay compras en la base de datos',
  'No hay configuraciones guardadas',
  'Error en la conexión a Supabase',
  'Datos no se están cargando correctamente',
  'Filtro de limpieza eliminando todas las poses'
];

console.log('Posibles causas del problema:');
potentialIssues.forEach((issue, index) => {
  console.log(`   ${index + 1}. ${issue}`);
});

// Crear datos de prueba para forzar la carga
console.log('\n🎯 SOLUCIÓN: CREAR DATOS DE PRUEBA');

const testPoses = [
  {
    id: 'test-pose-1',
    name: 'Superhéroe de Prueba (Compra)',
    configuration: {
      TORSO: { id: 'strong_torso_01', name: 'Torso de Prueba', priceUSD: 5.99 }
    },
    source: 'purchase',
    date: new Date().toISOString()
  },
  {
    id: 'test-pose-2',
    name: 'Configuración de Prueba (Guardado)',
    configuration: {
      TORSO: { id: 'strong_torso_02', name: 'Torso Guardado', priceUSD: 0 },
      HEAD: { id: 'strong_head_01_t01', name: 'Cabeza de Prueba', priceUSD: 0 }
    },
    source: 'saved',
    date: new Date().toISOString()
  }
];

console.log('Datos de prueba creados:');
testPoses.forEach((pose, index) => {
  console.log(`   ${index + 1}. ${pose.name} (${pose.source})`);
});

console.log('\n================================');
console.log('🔍 DIAGNÓSTICO COMPLETADO');
console.log('================================');

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Verificar si el usuario está autenticado');
console.log('2. Revisar logs de carga de poses en la consola del navegador');
console.log('3. Verificar conexión a Supabase');
console.log('4. Crear datos de prueba si no hay datos reales');
console.log('5. Forzar recarga de poses');

console.log('\n🚀 COMANDOS PARA EJECUTAR:');
console.log('1. Abrir consola del navegador (F12)');
console.log('2. Buscar logs que empiecen con "🎨 Loading user poses..."');
console.log('3. Verificar si hay errores de conexión');
console.log('4. Ejecutar: loadUserPoses() en la consola para forzar recarga'); 