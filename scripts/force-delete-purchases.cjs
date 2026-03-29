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

async function forceDeletePurchases() {
  try {
    console.log('🗑️ FORZANDO ELIMINACIÓN DE TODAS LAS COMPRAS...');
    
    const userId = 'd24f3b6c-ad83-4b77-ac72-df7506d29df2';
    
    // 1. Primero eliminar purchase_items (por foreign key constraint)
    console.log('🗑️ Eliminando purchase_items...');
    const { data: purchases, error: fetchError } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId);
    
    if (fetchError) {
      console.error('❌ Error obteniendo compras:', fetchError);
    } else {
      console.log(`📦 Encontradas ${purchases?.length || 0} compras`);
      
      if (purchases && purchases.length > 0) {
        for (const purchase of purchases) {
          console.log(`🗑️ Eliminando items de compra ${purchase.id}...`);
          const { error: itemsError } = await supabase
            .from('purchase_items')
            .delete()
            .eq('purchase_id', purchase.id);
          
          if (itemsError) {
            console.error(`❌ Error eliminando items de compra ${purchase.id}:`, itemsError);
          } else {
            console.log(`✅ Items de compra ${purchase.id} eliminados`);
          }
        }
      }
    }
    
    // 2. Ahora eliminar las compras
    console.log('🗑️ Eliminando compras...');
    const { error: purchaseError } = await supabase
      .from('purchases')
      .delete()
      .eq('user_id', userId);

    if (purchaseError) {
      console.error('❌ Error eliminando compras:', purchaseError);
    } else {
      console.log('✅ Compras eliminadas');
    }
    
    // 3. Eliminar configuraciones
    console.log('🗑️ Eliminando configuraciones...');
    const { error: configError } = await supabase
      .from('user_configurations')
      .delete()
      .eq('user_id', userId);

    if (configError) {
      console.error('❌ Error eliminando configuraciones:', configError);
    } else {
      console.log('✅ Configuraciones eliminadas');
    }
    
    // 4. Verificar que todo esté limpio
    console.log('🔍 Verificando limpieza...');
    const { data: remainingPurchases } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId);
    
    const { data: remainingConfigs } = await supabase
      .from('user_configurations')
      .select('id')
      .eq('user_id', userId);
    
    console.log(`📊 Estado final:`);
    console.log(`   - Compras restantes: ${remainingPurchases?.length || 0}`);
    console.log(`   - Configuraciones restantes: ${remainingConfigs?.length || 0}`);
    
    if ((remainingPurchases?.length || 0) === 0 && (remainingConfigs?.length || 0) === 0) {
      console.log('🎉 ¡ELIMINACIÓN COMPLETA EXITOSA!');
    } else {
      console.log('⚠️ Aún quedan datos. Intentando eliminación directa...');
      
      // Eliminación directa por SQL si es posible
      console.log('💥 Ejecutando eliminación directa...');
      const { error: directError } = await supabase.rpc('delete_user_data', { user_uuid: userId });
      
      if (directError) {
        console.error('❌ Error en eliminación directa:', directError);
        console.log('💡 Debes eliminar manualmente desde Supabase Dashboard');
      } else {
        console.log('✅ Eliminación directa completada');
      }
    }
    
  } catch (error) {
    console.error('❌ Error durante la eliminación forzada:', error);
  }
}

// Ejecutar la eliminación forzada
forceDeletePurchases(); 