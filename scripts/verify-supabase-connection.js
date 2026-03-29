#!/usr/bin/env node

/**
 * 🔍 Script de Verificación de Supabase
 * Verifica que la conexión con Supabase funcione y que las tablas necesarias existan.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Verificando Conexión con Supabase...\n');

// Verificar variables de entorno
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  console.log('   Asegúrate de que el archivo .env contenga:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('✅ Variables de entorno encontradas');
console.log(`📡 URL: ${supabaseUrl}`);
console.log(`🔑 Key: ${supabaseKey.substring(0, 20)}...`);

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  try {
    console.log('\n🔍 Verificando conexión...');
    
    // Test básico de conexión
    const { data, error } = await supabase.from('purchases').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('relation "purchases" does not exist')) {
        console.log('⚠️  Tabla "purchases" no existe - necesitas ejecutar el script SQL');
        return false;
      } else {
        console.error('❌ Error de conexión:', error.message);
        return false;
      }
    }
    
    console.log('✅ Conexión exitosa con Supabase');
    return true;
    
  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    return false;
  }
}

async function verifyTables() {
  try {
    console.log('\n📋 Verificando tablas necesarias...');
    
    const tables = ['purchases', 'purchase_items', 'user_configurations'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count').limit(1);
        
        if (error) {
          if (error.message.includes('does not exist')) {
            results[table] = 'NO EXISTE';
          } else {
            results[table] = `ERROR: ${error.message}`;
          }
        } else {
          results[table] = 'OK';
        }
      } catch (err) {
        results[table] = `ERROR: ${err.message}`;
      }
    }
    
    // Mostrar resultados
    console.log('\n📊 Estado de las tablas:');
    for (const [table, status] of Object.entries(results)) {
      const icon = status === 'OK' ? '✅' : status === 'NO EXISTE' ? '❌' : '⚠️';
      console.log(`   ${icon} ${table}: ${status}`);
    }
    
    const allOk = Object.values(results).every(status => status === 'OK');
    
    if (!allOk) {
      console.log('\n🔧 Para crear las tablas faltantes:');
      console.log('   1. Ve a tu proyecto en supabase.com');
      console.log('   2. Abre el SQL Editor');
      console.log('   3. Ejecuta el script completo del archivo:');
      console.log('      supabase-setup-instructions.md');
      return false;
    }
    
    console.log('\n🎉 Todas las tablas están creadas correctamente');
    return true;
    
  } catch (error) {
    console.error('❌ Error verificando tablas:', error.message);
    return false;
  }
}

async function testPurchaseSystem() {
  try {
    console.log('\n🛒 Probando sistema de compras...');
    
    // Verificar que podemos hacer una consulta básica
    const { data, error, count } = await supabase
      .from('purchases')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('❌ Error consultando compras:', error.message);
      return false;
    }
    
    console.log(`✅ Sistema de compras funcionando`);
    console.log(`📊 Compras en la base de datos: ${count || 0}`);
    
    if (data && data.length > 0) {
      console.log('📝 Últimas compras:');
      data.slice(0, 3).forEach((purchase, index) => {
        console.log(`   ${index + 1}. ${purchase.configuration_name} - $${purchase.total_price}`);
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error probando sistema:', error.message);
    return false;
  }
}

// Función principal
async function main() {
  let allOk = true;
  
  // Verificar conexión
  const connectionOk = await verifyConnection();
  if (!connectionOk) {
    allOk = false;
  }
  
  // Verificar tablas
  const tablesOk = await verifyTables();
  if (!tablesOk) {
    allOk = false;
  }
  
  // Probar sistema si todo está bien
  if (connectionOk && tablesOk) {
    const systemOk = await testPurchaseSystem();
    if (!systemOk) {
      allOk = false;
    }
  }
  
  // Resultado final
  console.log('\n' + '='.repeat(50));
  if (allOk) {
    console.log('🎉 ¡TODO ESTÁ FUNCIONANDO CORRECTAMENTE!');
    console.log('   La biblioteca de compras está lista para usar.');
    console.log('   Los usuarios podrán:');
    console.log('   - ✅ Realizar compras');
    console.log('   - ✅ Ver historial en su perfil');
    console.log('   - ✅ Recargar configuraciones compradas');
    console.log('   - ✅ Exportar modelos después de comprar');
  } else {
    console.log('⚠️  Hay problemas que necesitan ser resueltos');
    console.log('   Revisa los errores arriba y configura Supabase');
  }
  console.log('='.repeat(50));
  
  process.exit(allOk ? 0 : 1);
}

// Ejecutar verificación
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
}); 