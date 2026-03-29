#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🧪 TESTING: User Registration Process');
console.log('=====================================\n');

// Verificar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

// Crear cliente con anon key (como el frontend)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUserRegistration() {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  
  console.log('📧 Email de prueba:', testEmail);
  console.log('🔑 Contraseña de prueba:', testPassword);
  console.log('');
  
  try {
    // Paso 1: Intentar registro
    console.log('1️⃣ Intentando registro de usuario...');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'http://localhost:5178/'
      }
    });
    
    if (error) {
      console.log('❌ Error en registro:', error.message);
      console.log('   Código:', error.status);
      console.log('   Detalles:', error);
      return;
    }
    
    console.log('✅ Registro exitoso');
    console.log('   Usuario ID:', data.user?.id);
    console.log('   Email confirmado:', data.user?.email_confirmed_at ? 'Sí' : 'No');
    console.log('');
    
    // Paso 2: Verificar si el usuario puede acceder a la tabla
    if (data.user?.id) {
      console.log('2️⃣ Probando acceso a user_configurations...');
      
      const { data: configData, error: configError } = await supabase
        .from('user_configurations')
        .insert({
          user_id: data.user.id,
          name: 'Test Configuration',
          archetype: 'STRONG',
          selected_parts: {},
          total_price: 0.00
        })
        .select();
      
      if (configError) {
        console.log('❌ Error insertando configuración:', configError.message);
        console.log('   Código:', configError.code);
        console.log('   Detalles:', configError);
        
        // Verificar si es un problema de RLS
        if (configError.code === '42501') {
          console.log('🔐 Error de permisos RLS - El usuario no puede insertar');
        } else if (configError.code === '42P01') {
          console.log('🗄️ Error de tabla - La tabla user_configurations no existe');
        } else if (configError.code === '23503') {
          console.log('🔗 Error de clave foránea - Problema con user_id');
        }
      } else {
        console.log('✅ Configuración insertada correctamente');
        console.log('   Config ID:', configData[0]?.id);
        
        // Limpiar la configuración de prueba
        await supabase
          .from('user_configurations')
          .delete()
          .eq('id', configData[0].id);
        console.log('🧹 Configuración de prueba eliminada');
      }
    }
    
    // Paso 3: Limpiar usuario de prueba
    console.log('\n3️⃣ Limpiando usuario de prueba...');
    if (supabaseServiceKey) {
      const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Eliminar configuraciones del usuario
      await adminSupabase
        .from('user_configurations')
        .delete()
        .eq('user_id', data.user?.id);
      
      // Eliminar el usuario
      const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(data.user?.id);
      
      if (deleteError) {
        console.log('⚠️ No se pudo eliminar el usuario de prueba:', deleteError.message);
      } else {
        console.log('✅ Usuario de prueba eliminado');
      }
    } else {
      console.log('⚠️ No se pudo limpiar el usuario (falta SUPABASE_SERVICE_KEY)');
    }
    
  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
  }
}

async function testExistingUser() {
  console.log('\n🔍 Probando con usuario existente...');
  
  try {
    // Intentar obtener la sesión actual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Error obteniendo sesión:', sessionError.message);
      return;
    }
    
    if (session?.user) {
      console.log('✅ Usuario autenticado encontrado:', session.user.email);
      
      // Probar inserción de configuración
      const { data, error } = await supabase
        .from('user_configurations')
        .insert({
          user_id: session.user.id,
          name: 'Test Existing User Config',
          archetype: 'STRONG',
          selected_parts: {},
          total_price: 0.00
        })
        .select();
      
      if (error) {
        console.log('❌ Error insertando configuración:', error.message);
        console.log('   Código:', error.code);
      } else {
        console.log('✅ Configuración insertada correctamente');
        
        // Limpiar
        await supabase
          .from('user_configurations')
          .delete()
          .eq('id', data[0].id);
      }
    } else {
      console.log('ℹ️ No hay usuario autenticado');
    }
    
  } catch (err) {
    console.error('❌ Error probando usuario existente:', err.message);
  }
}

async function main() {
  console.log('📋 Variables de entorno:');
  console.log(`   ✅ VITE_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
  console.log(`   ✅ VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 30)}...`);
  console.log(`   ${supabaseServiceKey ? '✅' : '❌'} SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? supabaseServiceKey.substring(0, 30) + '...' : 'No configurado'}`);
  console.log('');
  
  await testUserRegistration();
  await testExistingUser();
  
  console.log('\n🎉 Pruebas completadas!');
  console.log('\n📋 Resumen:');
  console.log('- Si el registro falla, el problema está en Supabase Auth');
  console.log('- Si el registro funciona pero la inserción falla, el problema está en RLS');
  console.log('- Si todo funciona, el problema está en el código del frontend');
}

main().catch(console.error); 