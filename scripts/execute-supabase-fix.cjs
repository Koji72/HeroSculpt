#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('🚨 EXECUTING: Supabase Database Fix');
console.log('===================================\n');

// Verificar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  console.error('   - VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('   - SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

// Crear cliente con service key para permisos administrativos
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL para arreglar la base de datos
const fixSQL = `
-- ================================================================================
-- 🚨 CRITICAL FIX: Resolver "Database error saving new user"
-- ================================================================================

-- 1. Verificar si la tabla existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_configurations') THEN
        -- Crear tabla user_configurations
        CREATE TABLE user_configurations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            archetype VARCHAR(100) NOT NULL,
            selected_parts JSONB NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Tabla user_configurations creada';
    ELSE
        RAISE NOTICE 'Tabla user_configurations ya existe';
    END IF;
END $$;

-- 2. Habilitar RLS
ALTER TABLE user_configurations ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes que puedan causar conflictos
DROP POLICY IF EXISTS "Users can view own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can insert own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can update own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can delete own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_configurations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_configurations;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_configurations;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON user_configurations;

-- 4. Crear políticas básicas y seguras
CREATE POLICY "Users can view own configurations" ON user_configurations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configurations" ON user_configurations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configurations" ON user_configurations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configurations" ON user_configurations
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Crear índice para rendimiento
CREATE INDEX IF NOT EXISTS idx_user_configurations_user_id ON user_configurations(user_id);

-- 6. Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_user_configurations_updated_at ON user_configurations;
CREATE TRIGGER update_user_configurations_updated_at 
    BEFORE UPDATE ON user_configurations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Verificar configuración
SELECT 
    'Database setup completed successfully!' as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_name = 'user_configurations';
`;

async function executeFix() {
  try {
    console.log('📊 Ejecutando fix de base de datos...');
    
    // Intentar ejecutar el SQL usando la API REST de Supabase
    const { data, error } = await supabase.rpc('exec_sql', { sql: fixSQL });
    
    if (error) {
      console.log('⚠️ RPC no disponible, intentando método alternativo...');
      
      // Verificar si la tabla existe
      const { data: tableCheck, error: tableError } = await supabase
        .from('user_configurations')
        .select('*')
        .limit(1);
      
      if (tableError && tableError.code === '42P01') {
        console.log('❌ La tabla user_configurations no existe');
        console.log('📋 Necesitas ejecutar el SQL manualmente en Supabase Dashboard');
        console.log('\n🔗 Pasos:');
        console.log('1. Ve a https://supabase.com/dashboard');
        console.log('2. Selecciona tu proyecto');
        console.log('3. Ve a SQL Editor');
        console.log('4. Copia y pega el siguiente SQL:');
        console.log('\n' + '='.repeat(80));
        console.log(fixSQL);
        console.log('='.repeat(80));
        return;
      } else if (tableError) {
        console.log('⚠️ Error verificando tabla:', tableError.message);
      } else {
        console.log('✅ La tabla user_configurations existe');
      }
      
      // Verificar RLS
      const { data: rlsCheck, error: rlsError } = await supabase
        .from('user_configurations')
        .select('*')
        .limit(1);
      
      if (rlsError && rlsError.code === '42501') {
        console.log('✅ RLS está habilitado y funcionando');
      } else if (rlsError) {
        console.log('⚠️ Error verificando RLS:', rlsError.message);
      } else {
        console.log('❌ RLS no está configurado correctamente');
        console.log('📋 Necesitas ejecutar el SQL manualmente');
      }
      
    } else {
      console.log('✅ SQL ejecutado correctamente');
      console.log('Resultado:', data);
    }
    
  } catch (err) {
    console.error('❌ Error ejecutando fix:', err.message);
    console.log('\n📋 Solución manual requerida:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a SQL Editor');
    console.log('4. Copia y pega el SQL de arriba');
  }
}

async function verifyFix() {
  console.log('\n🔍 Verificando que el fix funcionó...');
  
  try {
    // Probar inserción con service key
    const { data, error } = await supabase
      .from('user_configurations')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // UUID de prueba
        name: 'Test Fix Verification',
        archetype: 'STRONG',
        selected_parts: {},
        total_price: 0.00
      })
      .select();
    
    if (error) {
      console.log('❌ Error en verificación:', error.message);
    } else {
      console.log('✅ Verificación exitosa - Configuración insertada');
      
      // Limpiar
      await supabase
        .from('user_configurations')
        .delete()
        .eq('id', data[0].id);
      console.log('🧹 Configuración de prueba eliminada');
    }
    
  } catch (err) {
    console.error('❌ Error en verificación:', err.message);
  }
}

async function main() {
  console.log('📋 Variables de entorno:');
  console.log(`   ✅ VITE_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
  console.log(`   ✅ SUPABASE_SERVICE_KEY: ${supabaseServiceKey.substring(0, 30)}...`);
  console.log('');
  
  await executeFix();
  await verifyFix();
  
  console.log('\n🎉 Proceso completado!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Si el fix se ejecutó correctamente, prueba registrar un usuario');
  console.log('2. Si no, ejecuta el SQL manualmente en Supabase Dashboard');
  console.log('3. Verifica los logs en Supabase Dashboard > Logs');
}

main().catch(console.error); 