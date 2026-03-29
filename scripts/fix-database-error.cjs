#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🔧 FIXING: Database Error Saving New User');
console.log('==========================================\n');

// Verificar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  console.error('   - VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   - SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅' : '❌');
  console.error('\n📋 Asegúrate de tener un archivo .env con estas variables');
  process.exit(1);
}

// Crear cliente con service key para permisos administrativos
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Script SQL para crear la tabla y políticas
const setupSQL = `
-- ================================================================================
-- 🚨 QUICK FIX: Configuración mínima para resolver "Database error saving new user"
-- ================================================================================

-- Crear tabla user_configurations si no existe
CREATE TABLE IF NOT EXISTS user_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    archetype VARCHAR(100) NOT NULL,
    selected_parts JSONB NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE user_configurations ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can insert own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can update own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can delete own configurations" ON user_configurations;

-- Crear políticas básicas
CREATE POLICY "Users can view own configurations" ON user_configurations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configurations" ON user_configurations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configurations" ON user_configurations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configurations" ON user_configurations
    FOR DELETE USING (auth.uid() = user_id);

-- Crear índice para rendimiento
CREATE INDEX IF NOT EXISTS idx_user_configurations_user_id ON user_configurations(user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_user_configurations_updated_at ON user_configurations;
CREATE TRIGGER update_user_configurations_updated_at 
    BEFORE UPDATE ON user_configurations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de confirmación
SELECT 'Database setup completed successfully!' as status;
`;

async function fixDatabase() {
  try {
    console.log('📊 Ejecutando script de configuración de base de datos...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: setupSQL });
    
    if (error) {
      // Si el RPC no funciona, intentar con query directa
      console.log('⚠️  RPC no disponible, intentando query directa...');
      
      const { data: result, error: queryError } = await supabase
        .from('user_configurations')
        .select('*')
        .limit(1);
      
      if (queryError && queryError.code === '42P01') {
        // Tabla no existe, necesitamos ejecutar el SQL manualmente
        console.log('❌ La tabla user_configurations no existe');
        console.log('📋 Necesitas ejecutar el SQL manualmente en Supabase Dashboard');
        console.log('\n🔗 Pasos:');
        console.log('1. Ve a https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto');
        console.log('3. Ve a SQL Editor');
        console.log('4. Copia y pega el siguiente SQL:');
        console.log('\n' + '='.repeat(80));
        console.log(setupSQL);
        console.log('='.repeat(80));
        return;
      }
    }
    
    console.log('✅ Script ejecutado correctamente');
    
    // Verificar que la tabla existe
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_configurations')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Error verificando tabla:', tableError.message);
    } else {
      console.log('✅ Tabla user_configurations verificada correctamente');
    }
    
    // Verificar políticas RLS
    console.log('\n🔐 Verificando políticas RLS...');
    const { data: policies, error: policiesError } = await supabase
      .from('user_configurations')
      .select('*')
      .limit(1);
    
    if (policiesError && policiesError.code === '42501') {
      console.log('✅ Políticas RLS funcionando correctamente (acceso denegado sin autenticación)');
    } else if (policiesError) {
      console.log('⚠️  Error verificando políticas:', policiesError.message);
    } else {
      console.log('⚠️  Las políticas RLS pueden no estar configuradas correctamente');
    }
    
  } catch (err) {
    console.error('❌ Error ejecutando script:', err.message);
    console.log('\n📋 Solución manual:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a SQL Editor');
    console.log('4. Copia y pega el SQL de arriba');
  }
}

// Función para verificar el estado actual
async function checkCurrentState() {
  console.log('🔍 Verificando estado actual de la base de datos...\n');
  
  try {
    // Verificar si la tabla existe
    const { data, error } = await supabase
      .from('user_configurations')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('❌ Tabla user_configurations NO EXISTE');
      console.log('   Este es el problema principal');
      return false;
    } else if (error) {
      console.log('⚠️  Error verificando tabla:', error.message);
      return false;
    } else {
      console.log('✅ Tabla user_configurations EXISTE');
    }
    
    // Verificar RLS
    const { data: rlsCheck, error: rlsError } = await supabase
      .from('user_configurations')
      .select('*')
      .limit(1);
    
    if (rlsError && rlsError.code === '42501') {
      console.log('✅ RLS está habilitado y funcionando');
    } else {
      console.log('⚠️  RLS puede no estar configurado correctamente');
    }
    
    return true;
    
  } catch (err) {
    console.error('❌ Error verificando estado:', err.message);
    return false;
  }
}

// Función principal
async function main() {
  console.log('📋 Variables de entorno:');
  console.log(`   ✅ VITE_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
  console.log(`   ✅ SUPABASE_SERVICE_KEY: ${supabaseServiceKey.substring(0, 30)}...`);
  console.log('');
  
  const tableExists = await checkCurrentState();
  
  if (!tableExists) {
    console.log('\n🛠️  Ejecutando fix automático...');
    await fixDatabase();
  } else {
    console.log('\n✅ La base de datos parece estar configurada correctamente');
    console.log('🔍 El problema puede estar en otro lugar');
  }
  
  console.log('\n🎉 Proceso completado!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Intenta registrar un usuario nuevamente');
  console.log('2. Si persiste el error, revisa la consola del navegador');
  console.log('3. Verifica los logs en Supabase Dashboard > Logs');
}

main().catch(console.error); 