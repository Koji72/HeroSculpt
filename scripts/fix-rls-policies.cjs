#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔐 FIXING: RLS Policies for User Registration');
console.log('==============================================\n');

// Verificar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  process.exit(1);
}

// Crear cliente con service key para permisos administrativos
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Script SQL para arreglar políticas RLS
const fixRLSSQL = `
-- ================================================================================
-- 🔐 FIX: Políticas RLS para resolver "Database error saving new user"
-- ================================================================================

-- Habilitar RLS en la tabla
ALTER TABLE user_configurations ENABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Users can view own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can insert own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can update own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can delete own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_configurations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_configurations;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_configurations;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_configurations;

-- Crear políticas básicas y seguras
CREATE POLICY "Users can view own configurations" ON user_configurations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configurations" ON user_configurations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configurations" ON user_configurations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configurations" ON user_configurations
    FOR DELETE USING (auth.uid() = user_id);

-- Verificar que las políticas se crearon
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_configurations';

-- Verificar RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'user_configurations';
`;

async function checkAndFixRLS() {
  try {
    console.log('🔍 Verificando políticas RLS actuales...');
    
    // Verificar si RLS está habilitado
    const { data: rlsCheck, error: rlsError } = await supabase
      .from('user_configurations')
      .select('*')
      .limit(1);
    
    if (rlsError && rlsError.code === '42501') {
      console.log('✅ RLS está habilitado (acceso denegado sin autenticación)');
    } else if (rlsError) {
      console.log('⚠️  Error verificando RLS:', rlsError.message);
    } else {
      console.log('❌ RLS NO está configurado correctamente (acceso permitido sin autenticación)');
    }
    
    // Intentar ejecutar el SQL de fix
    console.log('\n🛠️  Aplicando fix de políticas RLS...');
    
    // Como no podemos ejecutar SQL directamente, vamos a verificar las políticas
    // y proporcionar instrucciones manuales
    console.log('\n📋 El fix requiere ejecución manual en Supabase Dashboard');
    console.log('\n🔗 Pasos para arreglar:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a SQL Editor');
    console.log('4. Copia y pega el siguiente SQL:');
    console.log('\n' + '='.repeat(80));
    console.log(fixRLSSQL);
    console.log('='.repeat(80));
    
    // Verificar si hay datos en la tabla
    const { data: dataCheck, error: dataError } = await supabase
      .from('user_configurations')
      .select('count')
      .limit(1);
    
    if (dataError && dataError.code === '42501') {
      console.log('\n✅ Las políticas RLS están funcionando correctamente');
    } else if (dataError) {
      console.log('\n⚠️  Error verificando datos:', dataError.message);
    } else {
      console.log('\n❌ Las políticas RLS no están bloqueando el acceso correctamente');
    }
    
  } catch (err) {
    console.error('❌ Error verificando RLS:', err.message);
  }
}

async function testUserRegistration() {
  console.log('\n🧪 Probando registro de usuario...');
  
  try {
    // Crear un cliente con anon key para simular el frontend
    const anonSupabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);
    
    // Intentar insertar una configuración sin autenticación
    const { data, error } = await anonSupabase
      .from('user_configurations')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // UUID falso
        name: 'Test Configuration',
        archetype: 'STRONG',
        selected_parts: {},
        total_price: 0.00
      })
      .select();
    
    if (error && error.code === '42501') {
      console.log('✅ RLS está funcionando correctamente (inserción bloqueada sin auth)');
    } else if (error) {
      console.log('⚠️  Error inesperado:', error.message);
    } else {
      console.log('❌ RLS NO está funcionando (inserción permitida sin auth)');
    }
    
  } catch (err) {
    console.error('❌ Error en prueba:', err.message);
  }
}

async function main() {
  console.log('📋 Variables de entorno:');
  console.log(`   ✅ VITE_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
  console.log(`   ✅ SUPABASE_SERVICE_KEY: ${supabaseServiceKey.substring(0, 30)}...`);
  console.log('');
  
  await checkAndFixRLS();
  await testUserRegistration();
  
  console.log('\n🎉 Diagnóstico completado!');
  console.log('\n📋 Resumen:');
  console.log('- Si RLS está funcionando correctamente, el problema puede estar en el código');
  console.log('- Si RLS no está funcionando, ejecuta el SQL manualmente');
  console.log('- Verifica los logs en Supabase Dashboard > Logs para más detalles');
}

main().catch(console.error); 