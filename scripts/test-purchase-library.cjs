#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://arhcbrvdtehxyeuplvpt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPurchaseLibrary() {
  console.log('🧪 PROBANDO LIBRERÍA DE COMPRAS...\n');
  
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
  console.log('\n2️⃣ Buscando usuario de prueba...');
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
    console.log('\n3️⃣ Buscando compras del usuario...');
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
    console.log('\n4️⃣ Probando carga de configuración...');
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
    console.log('\n5️⃣ Probando loadConfigurationFromPurchase...');
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
