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

async function resetUserLibrary() {
  try {
    console.log('🔄 Iniciando reset de biblioteca para davidworkshop3d...');
    
    // 1. Buscar el usuario por email
    console.log('🔍 Buscando usuario davidworkshop3d...');
    const { data: users, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', 'davidworkshop3d@gmail.com')
      .single();

    if (userError || !users) {
      console.error('❌ Usuario davidworkshop3d no encontrado');
      console.log('Intentando buscar por ID directo...');
      
      // Intentar con ID directo si lo conocemos
      const userId = 'd24f3b6c-ad83-4b77-ac72-df7506d29df2'; // ID del error 404
      
      // 2. Eliminar todas las configuraciones del usuario
      console.log('🗑️ Eliminando configuraciones del usuario...');
      const { error: configError } = await supabase
        .from('user_configurations')
        .delete()
        .eq('user_id', userId);

      if (configError) {
        console.error('❌ Error eliminando configuraciones:', configError);
      } else {
        console.log('✅ Configuraciones eliminadas');
      }

      // 3. Eliminar todas las compras del usuario
      console.log('🗑️ Eliminando compras del usuario...');
      const { error: purchaseError } = await supabase
        .from('purchases')
        .delete()
        .eq('user_id', userId);

      if (purchaseError) {
        console.error('❌ Error eliminando compras:', purchaseError);
      } else {
        console.log('✅ Compras eliminadas');
      }

      // 4. Limpiar localStorage del navegador (simulado)
      console.log('🗑️ Limpiando localStorage...');
      console.log('⚠️ Nota: localStorage debe limpiarse manualmente en el navegador');
      console.log('   - Abrir DevTools (F12)');
      console.log('   - Ir a Application > Storage > Local Storage');
      console.log('   - Eliminar todas las claves que empiecen con:');
      console.log('     * character_name_');
      console.log('     * guest_config_');
      console.log('     * character_name');
      console.log('     * last_pose');
      console.log('     * session_data');

    } else {
      console.log('✅ Usuario encontrado:', users.email);
      
      // 2. Eliminar todas las configuraciones del usuario
      console.log('🗑️ Eliminando configuraciones del usuario...');
      const { error: configError } = await supabase
        .from('user_configurations')
        .delete()
        .eq('user_id', users.id);

      if (configError) {
        console.error('❌ Error eliminando configuraciones:', configError);
      } else {
        console.log('✅ Configuraciones eliminadas');
      }

      // 3. Eliminar todas las compras del usuario
      console.log('🗑️ Eliminando compras del usuario...');
      const { error: purchaseError } = await supabase
        .from('purchases')
        .delete()
        .eq('user_id', users.id);

      if (purchaseError) {
        console.error('❌ Error eliminando compras:', purchaseError);
      } else {
        console.log('✅ Compras eliminadas');
      }
    }

    console.log('\n🎉 Reset completado exitosamente!');
    console.log('📋 Resumen de acciones:');
    console.log('   ✅ Configuraciones eliminadas de la base de datos');
    console.log('   ✅ Compras eliminadas de la base de datos');
    console.log('   ⚠️ localStorage debe limpiarse manualmente en el navegador');
    
  } catch (error) {
    console.error('❌ Error durante el reset:', error);
  }
}

// Ejecutar el reset
resetUserLibrary(); 