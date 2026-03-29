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

async function deleteAllUserDataFinal() {
  try {
    console.log('💥 ELIMINACIÓN TOTAL Y DEFINITIVA DE DATOS DEL USUARIO davidworkshop3d');
    console.log('=====================================================================');
    
    const userId = 'd24f3b6c-ad83-4b77-ac72-df7506d29df2';
    
    // 1. ELIMINAR TODOS LOS PURCHASE_ITEMS PRIMERO
    console.log('\n🗑️ PASO 1: Eliminando purchase_items...');
    const { data: purchaseItems, error: itemsError } = await supabase
      .from('purchase_items')
      .select('id')
      .eq('purchase_id', (await supabase.from('purchases').select('id').eq('user_id', userId)).data?.map(p => p.id) || []);

    if (purchaseItems && purchaseItems.length > 0) {
      const { error: deleteItemsError } = await supabase
        .from('purchase_items')
        .delete()
        .in('id', purchaseItems.map(item => item.id));
      
      if (deleteItemsError) {
        console.error('❌ Error eliminando purchase_items:', deleteItemsError);
      } else {
        console.log(`✅ ${purchaseItems.length} purchase_items eliminados`);
      }
    } else {
      console.log('✅ No hay purchase_items para eliminar');
    }

    // 2. ELIMINAR TODAS LAS COMPRAS
    console.log('\n🗑️ PASO 2: Eliminando purchases...');
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId);

    if (purchases && purchases.length > 0) {
      const { error: deletePurchasesError } = await supabase
        .from('purchases')
        .delete()
        .eq('user_id', userId);
      
      if (deletePurchasesError) {
        console.error('❌ Error eliminando purchases:', deletePurchasesError);
      } else {
        console.log(`✅ ${purchases.length} purchases eliminados`);
      }
    } else {
      console.log('✅ No hay purchases para eliminar');
    }

    // 3. ELIMINAR TODAS LAS CONFIGURACIONES
    console.log('\n🗑️ PASO 3: Eliminando user_configurations...');
    const { data: configurations, error: configError } = await supabase
      .from('user_configurations')
      .select('id')
      .eq('user_id', userId);

    if (configurations && configurations.length > 0) {
      const { error: deleteConfigError } = await supabase
        .from('user_configurations')
        .delete()
        .eq('user_id', userId);
      
      if (deleteConfigError) {
        console.error('❌ Error eliminando user_configurations:', deleteConfigError);
      } else {
        console.log(`✅ ${configurations.length} user_configurations eliminados`);
      }
    } else {
      console.log('✅ No hay user_configurations para eliminar');
    }

    // 4. VERIFICAR QUE TODO ESTÉ LIMPIO
    console.log('\n🔍 PASO 4: Verificando limpieza...');
    
    const { data: remainingPurchases } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId);
    
    const { data: remainingConfigs } = await supabase
      .from('user_configurations')
      .select('id')
      .eq('user_id', userId);
    
    const { data: remainingItems } = await supabase
      .from('purchase_items')
      .select('id')
      .eq('purchase_id', (await supabase.from('purchases').select('id').eq('user_id', userId)).data?.map(p => p.id) || []);

    console.log(`📊 Estado final:`);
    console.log(`   - Purchases restantes: ${remainingPurchases?.length || 0}`);
    console.log(`   - Configurations restantes: ${remainingConfigs?.length || 0}`);
    console.log(`   - Purchase items restantes: ${remainingItems?.length || 0}`);

    if ((remainingPurchases?.length || 0) === 0 && 
        (remainingConfigs?.length || 0) === 0 && 
        (remainingItems?.length || 0) === 0) {
      console.log('\n🎉 ¡ELIMINACIÓN COMPLETA EXITOSA!');
      console.log('✅ Usuario davidworkshop3d completamente limpio');
      console.log('✅ Puedes empezar desde cero');
    } else {
      console.log('\n⚠️ Algunos datos aún permanecen');
    }

  } catch (error) {
    console.error('❌ Error en eliminación:', error);
  }
}

deleteAllUserDataFinal(); 