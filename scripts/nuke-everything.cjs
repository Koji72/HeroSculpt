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

async function nukeEverything() {
  try {
    console.log('💥 NUCLEAR: ELIMINANDO TODOS LOS DATOS DE TODOS LOS USUARIOS');
    console.log('================================================================');
    
    // 1. ELIMINAR TODOS LOS PURCHASE_ITEMS
    console.log('\n🗑️ PASO 1: Eliminando TODOS los purchase_items...');
    const { data: allItems, error: itemsError } = await supabase
      .from('purchase_items')
      .select('id');

    if (allItems && allItems.length > 0) {
      const { error: deleteItemsError } = await supabase
        .from('purchase_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos excepto un ID imposible
      
      if (deleteItemsError) {
        console.error('❌ Error eliminando purchase_items:', deleteItemsError);
      } else {
        console.log(`✅ ${allItems.length} purchase_items eliminados`);
      }
    } else {
      console.log('✅ No hay purchase_items para eliminar');
    }

    // 2. ELIMINAR TODAS LAS COMPRAS
    console.log('\n🗑️ PASO 2: Eliminando TODAS las purchases...');
    const { data: allPurchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('id');

    if (allPurchases && allPurchases.length > 0) {
      const { error: deletePurchasesError } = await supabase
        .from('purchases')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos excepto un ID imposible
      
      if (deletePurchasesError) {
        console.error('❌ Error eliminando purchases:', deletePurchasesError);
      } else {
        console.log(`✅ ${allPurchases.length} purchases eliminados`);
      }
    } else {
      console.log('✅ No hay purchases para eliminar');
    }

    // 3. ELIMINAR TODAS LAS CONFIGURACIONES
    console.log('\n🗑️ PASO 3: Eliminando TODAS las user_configurations...');
    const { data: allConfigs, error: configError } = await supabase
      .from('user_configurations')
      .select('id');

    if (allConfigs && allConfigs.length > 0) {
      const { error: deleteConfigError } = await supabase
        .from('user_configurations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos excepto un ID imposible
      
      if (deleteConfigError) {
        console.error('❌ Error eliminando user_configurations:', deleteConfigError);
      } else {
        console.log(`✅ ${allConfigs.length} user_configurations eliminados`);
      }
    } else {
      console.log('✅ No hay user_configurations para eliminar');
    }

    // 4. VERIFICAR QUE TODO ESTÉ LIMPIO
    console.log('\n🔍 PASO 4: Verificando limpieza total...');
    
    const { data: remainingPurchases } = await supabase
      .from('purchases')
      .select('id');
    
    const { data: remainingConfigs } = await supabase
      .from('user_configurations')
      .select('id');
    
    const { data: remainingItems } = await supabase
      .from('purchase_items')
      .select('id');

    console.log(`📊 Estado final:`);
    console.log(`   - Purchases restantes: ${remainingPurchases?.length || 0}`);
    console.log(`   - Configurations restantes: ${remainingConfigs?.length || 0}`);
    console.log(`   - Purchase items restantes: ${remainingItems?.length || 0}`);

    if ((remainingPurchases?.length || 0) === 0 && 
        (remainingConfigs?.length || 0) === 0 && 
        (remainingItems?.length || 0) === 0) {
      console.log('\n🎉 ¡NUCLEAR COMPLETA EXITOSA!');
      console.log('✅ TODA la base de datos está limpia');
      console.log('✅ TODOS los usuarios empiezan desde cero');
    } else {
      console.log('\n⚠️ Algunos datos aún permanecen');
    }

  } catch (error) {
    console.error('❌ Error en eliminación nuclear:', error);
  }
}

nukeEverything(); 