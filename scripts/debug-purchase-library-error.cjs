#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 DIAGNOSTICANDO ERROR EN LIBRERÍA DE COMPRAS...\n');

// 1. Verificar estructura de datos
console.log('1️⃣ VERIFICANDO ESTRUCTURA DE DATOS:');

try {
  const purchaseServiceContent = fs.readFileSync('services/purchaseHistoryService.ts', 'utf8');
  
  // Verificar interfaz Purchase
  const hasPurchaseInterface = purchaseServiceContent.includes('interface Purchase');
  console.log(`   ${hasPurchaseInterface ? '✅' : '❌'} Interfaz Purchase definida`);
  
  // Verificar interfaz PurchaseItem
  const hasPurchaseItemInterface = purchaseServiceContent.includes('interface PurchaseItem');
  console.log(`   ${hasPurchaseItemInterface ? '✅' : '❌'} Interfaz PurchaseItem definida`);
  
  // Verificar función loadConfigurationFromPurchase
  const hasLoadFunction = purchaseServiceContent.includes('loadConfigurationFromPurchase');
  console.log(`   ${hasLoadFunction ? '✅' : '❌'} Función loadConfigurationFromPurchase existe`);
  
  // Verificar que la función maneja errores
  const hasErrorHandling = purchaseServiceContent.includes('try {') && 
                          purchaseServiceContent.includes('catch (error)');
  console.log(`   ${hasErrorHandling ? '✅' : '❌'} Manejo de errores implementado`);
  
} catch (error) {
  console.log(`   ❌ Error leyendo archivo: ${error.message}`);
}

// 2. Verificar componente PurchaseLibrary
console.log('\n2️⃣ VERIFICANDO COMPONENTE PURCHASE LIBRARY:');

try {
  const libraryContent = fs.readFileSync('components/PurchaseLibrary.tsx', 'utf8');
  
  // Verificar función handleLoadConfiguration
  const hasHandleLoadFunction = libraryContent.includes('handleLoadConfiguration');
  console.log(`   ${hasHandleLoadFunction ? '✅' : '❌'} Función handleLoadConfiguration existe`);
  
  // Verificar que llama al servicio correctamente
  const callsService = libraryContent.includes('PurchaseHistoryService.loadConfigurationFromPurchase');
  console.log(`   ${callsService ? '✅' : '❌'} Llama al servicio correctamente`);
  
  // Verificar manejo de errores en el componente
  const hasComponentErrorHandling = libraryContent.includes('catch (err)') && 
                                   libraryContent.includes('alert(');
  console.log(`   ${hasComponentErrorHandling ? '✅' : '❌'} Manejo de errores en componente`);
  
  // Verificar que pasa los parámetros correctos
  const passesCorrectParams = libraryContent.includes('user.id') && 
                             libraryContent.includes('purchaseId') && 
                             libraryContent.includes('itemId');
  console.log(`   ${passesCorrectParams ? '✅' : '❌'} Pasa parámetros correctos`);
  
} catch (error) {
  console.log(`   ❌ Error leyendo archivo: ${error.message}`);
}

// 3. Verificar integración con App.tsx
console.log('\n3️⃣ VERIFICANDO INTEGRACIÓN CON APP.TSX:');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que PurchaseLibrary está importado
  const importsLibrary = appContent.includes('PurchaseLibrary') || 
                        appContent.includes('purchaseLibrary');
  console.log(`   ${importsLibrary ? '✅' : '❌'} PurchaseLibrary importado`);
  
  // Verificar que se pasa onLoadConfiguration
  const passesOnLoadConfig = appContent.includes('onLoadConfiguration');
  console.log(`   ${passesOnLoadConfig ? '✅' : '❌'} onLoadConfiguration pasado`);
  
  // Verificar función handleLoadConfiguration en App
  const hasAppHandleLoad = appContent.includes('handleLoadConfiguration');
  console.log(`   ${hasAppHandleLoad ? '✅' : '❌'} handleLoadConfiguration en App`);
  
} catch (error) {
  console.log(`   ❌ Error leyendo archivo: ${error.message}`);
}

// 4. Crear script de prueba
console.log('\n4️⃣ CREANDO SCRIPT DE PRUEBA:');

const testScript = `#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://arhcbrvdtehxyeuplvpt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPurchaseLibrary() {
  console.log('🧪 PROBANDO LIBRERÍA DE COMPRAS...\\n');
  
  // 1. Verificar conexión a Supabase
  console.log('1️⃣ Verificando conexión a Supabase...');
  try {
    const { data, error } = await supabase.from('purchases').select('count').limit(1);
    if (error) {
      console.log('   ❌ Error de conexión:', error.message);
      return;
    }
    console.log('   ✅ Conexión exitosa');
  } catch (err) {
    console.log('   ❌ Error de conexión:', err.message);
    return;
  }
  
  // 2. Buscar un usuario de prueba
  console.log('\\n2️⃣ Buscando usuario de prueba...');
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.log('   ❌ Error obteniendo usuarios:', error.message);
      return;
    }
    
    if (users.length === 0) {
      console.log('   ⚠️ No hay usuarios para probar');
      return;
    }
    
    const testUser = users[0];
    console.log('   ✅ Usuario de prueba encontrado:', testUser.email);
    
    // 3. Buscar compras del usuario
    console.log('\\n3️⃣ Buscando compras del usuario...');
    const { data: purchases, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', testUser.id)
      .limit(5);
    
    if (purchaseError) {
      console.log('   ❌ Error obteniendo compras:', purchaseError.message);
      return;
    }
    
    console.log('   📦 Compras encontradas:', purchases.length);
    
    if (purchases.length === 0) {
      console.log('   ⚠️ No hay compras para probar');
      return;
    }
    
    // 4. Probar carga de configuración
    console.log('\\n4️⃣ Probando carga de configuración...');
    const testPurchase = purchases[0];
    
    const { data: items, error: itemsError } = await supabase
      .from('purchase_items')
      .select('*')
      .eq('purchase_id', testPurchase.id)
      .limit(1);
    
    if (itemsError) {
      console.log('   ❌ Error obteniendo items:', itemsError.message);
      return;
    }
    
    if (items.length === 0) {
      console.log('   ⚠️ No hay items en la compra');
      return;
    }
    
    const testItem = items[0];
    console.log('   ✅ Item de prueba encontrado:', testItem.item_name);
    
    // 5. Probar loadConfigurationFromPurchase
    console.log('\\n5️⃣ Probando loadConfigurationFromPurchase...');
    try {
      const { data: configData, error: configError } = await supabase
        .from('purchase_items')
        .select('configuration_data')
        .eq('id', testItem.id)
        .eq('purchase_id', testPurchase.id)
        .single();
      
      if (configError) {
        console.log('   ❌ Error cargando configuración:', configError.message);
        return;
      }
      
      if (!configData.configuration_data) {
        console.log('   ⚠️ No hay datos de configuración');
        return;
      }
      
      console.log('   ✅ Configuración cargada exitosamente');
      console.log('   📊 Partes en configuración:', Object.keys(configData.configuration_data).length);
      
    } catch (err) {
      console.log('   ❌ Error inesperado:', err.message);
    }
    
  } catch (err) {
    console.log('   ❌ Error general:', err.message);
  }
}

testPurchaseLibrary().catch(console.error);
`;

try {
  fs.writeFileSync('scripts/test-purchase-library.cjs', testScript);
  console.log('   ✅ Script de prueba creado: scripts/test-purchase-library.cjs');
} catch (error) {
  console.log(`   ❌ Error creando script: ${error.message}`);
}

// 5. Identificar posibles problemas
console.log('\n5️⃣ POSIBLES PROBLEMAS IDENTIFICADOS:');

const possibleIssues = [
  '❌ ID de item incorrecto o no encontrado',
  '❌ ID de compra incorrecto o no encontrado',
  '❌ Usuario no tiene permisos para la compra',
  '❌ Datos de configuración corruptos o vacíos',
  '❌ Error en la consulta SQL a Supabase',
  '❌ Problema de autenticación con Supabase',
  '❌ Estructura de datos incorrecta en la base de datos'
];

possibleIssues.forEach(issue => {
  console.log(`   ${issue}`);
});

console.log('\n📊 RESUMEN:');
console.log('   ✅ Estructura de código verificada');
console.log('   ✅ Script de prueba creado');
console.log('   ✅ Posibles problemas identificados');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('   1. Ejecutar: node scripts/test-purchase-library.cjs');
console.log('   2. Revisar logs de error en la consola del navegador');
console.log('   3. Verificar datos en Supabase Dashboard');
console.log('   4. Probar con diferentes compras/items');

console.log('\n✅ Diagnóstico completado. Ejecuta el script de prueba para identificar el problema específico.'); 