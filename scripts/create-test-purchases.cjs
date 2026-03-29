#!/usr/bin/env node

/**
 * 🧪 CREAR COMPRAS DE PRUEBA
 * Inserta datos de prueba para verificar el almacenamiento de fechas
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://arhcbrvdtehxyeuplvpt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyaGNicnZkdGVoeHlldXBsdnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjI4NDAsImV4cCI6MjA2NjA5ODg0MH0.Nn_e5206_CWaFJh8xdnhrcnJJfF43fCaeFJGO0ByrDo';

console.log('🧪 CREAR COMPRAS DE PRUEBA');
console.log('==========================\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestPurchases() {
  try {
    console.log('🔍 Verificando conexión a Supabase...');
    
    // Verificar conexión
    const { data: testData, error: testError } = await supabase
      .from('purchases')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Error de conexión:', testError.message);
      return;
    }

    console.log('✅ Conexión exitosa\n');

    // Crear compras de prueba con diferentes fechas
    const testPurchases = [
      {
        configuration_name: 'Superhéroe Test 1 - Fecha Actual',
        total_price: 29.99,
        items_count: 1,
        status: 'completed',
        purchase_date: new Date().toISOString(),
        // created_at y updated_at se generan automáticamente
      },
      {
        configuration_name: 'Superhéroe Test 2 - Fecha Pasada',
        total_price: 19.99,
        items_count: 2,
        status: 'completed',
        purchase_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
      },
      {
        configuration_name: 'Superhéroe Test 3 - Sin purchase_date',
        total_price: 39.99,
        items_count: 1,
        status: 'completed',
        // Sin purchase_date para probar fallback
      },
      {
        configuration_name: 'Superhéroe Test 4 - Fecha Futura',
        total_price: 49.99,
        items_count: 3,
        status: 'pending',
        purchase_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 día adelante
      }
    ];

    console.log('📝 Insertando compras de prueba...\n');

    for (let i = 0; i < testPurchases.length; i++) {
      const purchase = testPurchases[i];
      console.log(`🔧 Insertando: ${purchase.configuration_name}`);
      console.log(`   Precio: $${purchase.total_price}`);
      console.log(`   Fecha: ${purchase.purchase_date || 'NULL (usará created_at)'}`);
      
      const { data, error } = await supabase
        .from('purchases')
        .insert(purchase)
        .select();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
      } else {
        console.log(`   ✅ Insertado con ID: ${data[0].id}`);
        console.log(`   📅 created_at: ${data[0].created_at}`);
        console.log(`   🔄 updated_at: ${data[0].updated_at}`);
      }
      console.log('');
    }

    console.log('🔍 Verificando compras insertadas...\n');

    // Consultar todas las compras para verificar
    const { data: allPurchases, error: queryError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (queryError) {
      console.log('❌ Error consultando compras:', queryError.message);
      return;
    }

    console.log(`✅ Total de compras en BD: ${allPurchases.length}\n`);

    console.log('📊 RESUMEN DE FECHAS:');
    console.log('=====================');

    allPurchases.forEach((purchase, index) => {
      console.log(`\n🔍 Compra ${index + 1}: ${purchase.configuration_name}`);
      console.log(`   ID: ${purchase.id}`);
      console.log(`   Status: ${purchase.status}`);
      console.log(`   Precio: $${purchase.total_price}`);
      
      if (purchase.purchase_date) {
        const purchaseDate = new Date(purchase.purchase_date);
        console.log(`   📅 purchase_date: ${purchase.purchase_date}`);
        console.log(`      Formateado: ${purchaseDate.toLocaleDateString('es-ES')}`);
      } else {
        console.log(`   📅 purchase_date: ❌ NULL`);
      }

      if (purchase.created_at) {
        const createdAt = new Date(purchase.created_at);
        console.log(`   🕐 created_at: ${purchase.created_at}`);
        console.log(`      Formateado: ${createdAt.toLocaleDateString('es-ES')}`);
      }

      if (purchase.updated_at) {
        const updatedAt = new Date(purchase.updated_at);
        console.log(`   🔄 updated_at: ${purchase.updated_at}`);
        console.log(`      Formateado: ${updatedAt.toLocaleDateString('es-ES')}`);
      }
    });

    console.log('\n🎯 PRUEBAS CREADAS:');
    console.log('==================');
    console.log('✅ Compra con fecha actual');
    console.log('✅ Compra con fecha pasada');
    console.log('✅ Compra sin purchase_date (fallback)');
    console.log('✅ Compra con fecha futura');
    console.log('✅ Diferentes estados (completed/pending)');

    console.log('\n💡 PRÓXIMOS PASOS:');
    console.log('==================');
    console.log('1. Ejecutar: node scripts/diagnose-supabase-dates.cjs');
    console.log('2. Probar la interfaz de usuario');
    console.log('3. Verificar que las fechas se muestren correctamente');

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Ejecutar creación de pruebas
createTestPurchases().then(() => {
  console.log('\n✅ Compras de prueba creadas exitosamente');
  process.exit(0);
}).catch(error => {
  console.log('❌ Error fatal:', error.message);
  process.exit(1);
}); 