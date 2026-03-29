#!/usr/bin/env node

console.log('📊 PRUEBA DE DATOS DE COMPRAS...\n');

// Simular datos de prueba
const mockPurchase = {
  id: 'test-purchase-id',
  user_id: 'test-user-id',
  purchase_date: new Date().toISOString(),
  total_price: 29.99,
  status: 'completed'
};

const mockItem = {
  id: 'test-item-id',
  purchase_id: 'test-purchase-id',
  item_name: 'Test Configuration',
  item_price: 29.99,
  quantity: 1,
  configuration_data: {
    'TORSO': { id: 'torso-1', name: 'Test Torso', priceUSD: 29.99 },
    'HEAD': { id: 'head-1', name: 'Test Head', priceUSD: 19.99 }
  }
};

console.log('📦 Datos de prueba creados:');
console.log('   - Purchase ID:', mockPurchase.id);
console.log('   - Item ID:', mockItem.id);
console.log('   - User ID:', mockPurchase.user_id);
console.log('   - Configuration parts:', Object.keys(mockItem.configuration_data).length);

console.log('\n✅ Script de prueba de datos creado');
console.log('\n🎯 Para probar en el navegador:');
console.log('   1. Abrir DevTools (F12)');
console.log('   2. Ir a la pestaña Console');
console.log('   3. Hacer clic en "Apply" en la librería');
console.log('   4. Revisar los logs que aparecen');
console.log('   5. Verificar si hay errores específicos');
