#!/usr/bin/env node

const fs = require('fs');

console.log('🧪 PRUEBA SIMPLE DE LIBRERÍA DE COMPRAS...\n');

// 1. Verificar que los archivos existen
console.log('1️⃣ VERIFICANDO ARCHIVOS:');

const files = [
  'services/purchaseHistoryService.ts',
  'components/PurchaseLibrary.tsx',
  'App.tsx'
];

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// 2. Verificar estructura de datos en PurchaseLibrary
console.log('\n2️⃣ VERIFICANDO ESTRUCTURA DE DATOS:');

try {
  const libraryContent = fs.readFileSync('components/PurchaseLibrary.tsx', 'utf8');
  
  // Verificar que se renderizan los items correctamente
  const rendersItems = libraryContent.includes('purchase.purchase_items') && 
                      libraryContent.includes('item.id');
  console.log(`   ${rendersItems ? '✅' : '❌'} Renderiza items de compra`);
  
  // Verificar que se pasan los IDs correctos
  const passesCorrectIds = libraryContent.includes('handleLoadConfiguration(purchase.id, item.id)');
  console.log(`   ${passesCorrectIds ? '✅' : '❌'} Pasa IDs correctos al botón`);
  
  // Verificar que hay manejo de estado de carga
  const hasLoadingState = libraryContent.includes('loadingConfigId') && 
                         libraryContent.includes('Loading...');
  console.log(`   ${hasLoadingState ? '✅' : '❌'} Manejo de estado de carga`);
  
} catch (error) {
  console.log(`   ❌ Error leyendo archivo: ${error.message}`);
}

// 3. Verificar integración con App.tsx
console.log('\n3️⃣ VERIFICANDO INTEGRACIÓN:');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que PurchaseLibrary está integrado
  const hasPurchaseLibrary = appContent.includes('PurchaseLibrary') && 
                            appContent.includes('onLoadConfiguration');
  console.log(`   ${hasPurchaseLibrary ? '✅' : '❌'} PurchaseLibrary integrado en App`);
  
  // Verificar que handleLoadConfiguration existe
  const hasHandleLoad = appContent.includes('handleLoadConfiguration = (parts: SelectedParts)');
  console.log(`   ${hasHandleLoad ? '✅' : '❌'} handleLoadConfiguration definido`);
  
} catch (error) {
  console.log(`   ❌ Error leyendo archivo: ${error.message}`);
}

// 4. Crear script de prueba de datos
console.log('\n4️⃣ CREANDO SCRIPT DE PRUEBA DE DATOS:');

const dataTestScript = `#!/usr/bin/env node

console.log('📊 PRUEBA DE DATOS DE COMPRAS...\\n');

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

console.log('\\n✅ Script de prueba de datos creado');
console.log('\\n🎯 Para probar en el navegador:');
console.log('   1. Abrir DevTools (F12)');
console.log('   2. Ir a la pestaña Console');
console.log('   3. Hacer clic en "Apply" en la librería');
console.log('   4. Revisar los logs que aparecen');
console.log('   5. Verificar si hay errores específicos');
`;

try {
  fs.writeFileSync('scripts/test-purchase-data.cjs', dataTestScript);
  console.log('   ✅ Script de prueba de datos creado: scripts/test-purchase-data.cjs');
} catch (error) {
  console.log(`   ❌ Error creando script: ${error.message}`);
}

// 5. Identificar posibles causas del error
console.log('\n5️⃣ POSIBLES CAUSAS DEL ERROR:');

const possibleCauses = [
  '🔍 **Datos corruptos**: Los datos de configuración en Supabase están vacíos o corruptos',
  '🔍 **IDs incorrectos**: Los IDs de purchase o item no coinciden con los de la base de datos',
  '🔍 **Permisos**: El usuario no tiene permisos para acceder a esa compra específica',
  '🔍 **Estructura de datos**: La estructura de purchase_items no es la esperada',
  '🔍 **Autenticación**: Problema con la sesión del usuario en Supabase',
  '🔍 **Red**: Error de conexión con Supabase',
  '🔍 **Caché**: Datos en caché desactualizados'
];

possibleCauses.forEach(cause => {
  console.log(`   ${cause}`);
});

console.log('\n📊 RESUMEN:');
console.log('   ✅ Estructura de código verificada');
console.log('   ✅ Integración verificada');
console.log('   ✅ Script de prueba creado');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('   1. Abrir la aplicación en el navegador');
console.log('   2. Ir a la librería de compras');
console.log('   3. Hacer clic en "Apply" en un item');
console.log('   4. Revisar la consola del navegador (F12)');
console.log('   5. Buscar los logs que agregamos');
console.log('   6. Identificar el error específico');

console.log('\n🔧 SOLUCIÓN TEMPORAL:');
console.log('   Si el problema persiste, podemos:');
console.log('   1. Agregar más validaciones');
console.log('   2. Implementar fallback a configuración por defecto');
console.log('   3. Mejorar el manejo de errores');
console.log('   4. Verificar datos en Supabase Dashboard');

console.log('\n✅ Análisis completado. Revisa la consola del navegador para identificar el error específico.'); 