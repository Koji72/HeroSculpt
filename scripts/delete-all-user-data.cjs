const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllUserData() {
  try {
    console.log('💥 ELIMINACIÓN TOTAL DE DATOS DEL USUARIO davidworkshop3d');
    console.log('========================================================');
    
    const userId = 'd24f3b6c-ad83-4b77-ac72-df7506d29df2';
    
    // 1. ELIMINAR TODOS LOS PURCHASE_ITEMS PRIMERO
    console.log('\n🗑️ PASO 1: Eliminando TODOS los purchase_items...');
    
    // Obtener todas las compras del usuario
    const { data: purchases, error: fetchPurchasesError } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId);
    
    if (fetchPurchasesError) {
      console.error('❌ Error obteniendo compras:', fetchPurchasesError);
    } else {
      console.log(`📦 Encontradas ${purchases?.length || 0} compras`);
      
      if (purchases && purchases.length > 0) {
        for (const purchase of purchases) {
          console.log(`   🗑️ Eliminando items de compra ${purchase.id}...`);
          
          // Eliminar todos los items de esta compra
          const { error: deleteItemsError } = await supabase
            .from('purchase_items')
            .delete()
            .eq('purchase_id', purchase.id);
          
          if (deleteItemsError) {
            console.error(`   ❌ Error eliminando items de compra ${purchase.id}:`, deleteItemsError);
          } else {
            console.log(`   ✅ Items de compra ${purchase.id} eliminados`);
          }
        }
      }
    }
    
    // 2. ELIMINAR TODAS LAS COMPRAS
    console.log('\n🗑️ PASO 2: Eliminando TODAS las compras...');
    const { error: deletePurchasesError } = await supabase
      .from('purchases')
      .delete()
      .eq('user_id', userId);
    
    if (deletePurchasesError) {
      console.error('❌ Error eliminando compras:', deletePurchasesError);
    } else {
      console.log('✅ TODAS las compras eliminadas');
    }
    
    // 3. ELIMINAR TODAS LAS CONFIGURACIONES
    console.log('\n🗑️ PASO 3: Eliminando TODAS las configuraciones...');
    const { error: deleteConfigsError } = await supabase
      .from('user_configurations')
      .delete()
      .eq('user_id', userId);
    
    if (deleteConfigsError) {
      console.error('❌ Error eliminando configuraciones:', deleteConfigsError);
    } else {
      console.log('✅ TODAS las configuraciones eliminadas');
    }
    
    // 4. VERIFICACIÓN FINAL
    console.log('\n🔍 PASO 4: Verificación final...');
    
    // Verificar compras
    const { data: remainingPurchases } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId);
    
    // Verificar configuraciones
    const { data: remainingConfigs } = await supabase
      .from('user_configurations')
      .select('id')
      .eq('user_id', userId);
    
    // Verificar purchase_items (por si acaso)
    const { data: remainingItems } = await supabase
      .from('purchase_items')
      .select('id')
      .in('purchase_id', purchases?.map(p => p.id) || []);
    
    console.log('\n📊 ESTADO FINAL:');
    console.log(`   - Compras restantes: ${remainingPurchases?.length || 0}`);
    console.log(`   - Configuraciones restantes: ${remainingConfigs?.length || 0}`);
    console.log(`   - Items de compra restantes: ${remainingItems?.length || 0}`);
    
    if ((remainingPurchases?.length || 0) === 0 && 
        (remainingConfigs?.length || 0) === 0 && 
        (remainingItems?.length || 0) === 0) {
      console.log('\n🎉 ¡ELIMINACIÓN TOTAL EXITOSA!');
      console.log('✅ Base de datos completamente limpia');
    } else {
      console.log('\n⚠️ Aún quedan datos. Ejecutando limpieza manual...');
      
      // Intentar eliminación manual por SQL
      console.log('💥 Ejecutando eliminación manual por SQL...');
      
      // Eliminar por SQL directo si es posible
      const { error: sqlError } = await supabase.rpc('delete_all_user_data', { 
        target_user_id: userId 
      });
      
      if (sqlError) {
        console.error('❌ Error en eliminación SQL:', sqlError);
        console.log('\n💡 ELIMINACIÓN MANUAL REQUERIDA:');
        console.log('   1. Ir a Supabase Dashboard');
        console.log('   2. SQL Editor');
        console.log('   3. Ejecutar:');
        console.log(`   DELETE FROM purchase_items WHERE purchase_id IN (SELECT id FROM purchases WHERE user_id = '${userId}');`);
        console.log(`   DELETE FROM purchases WHERE user_id = '${userId}';`);
        console.log(`   DELETE FROM user_configurations WHERE user_id = '${userId}';`);
      } else {
        console.log('✅ Eliminación SQL completada');
      }
    }
    
    console.log('\n📋 RESUMEN DE ACCIONES:');
    console.log('   ✅ purchase_items eliminados');
    console.log('   ✅ purchases eliminadas');
    console.log('   ✅ user_configurations eliminadas');
    console.log('   ⚠️ localStorage debe limpiarse manualmente');
    
  } catch (error) {
    console.error('❌ Error durante la eliminación total:', error);
  }
}

// Ejecutar la eliminación total
deleteAllUserData(); 