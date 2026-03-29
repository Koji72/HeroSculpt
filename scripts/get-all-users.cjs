const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno VITE_SUPABASE_URL y SUPABASE_SERVICE_KEY no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllUsers() {
  try {
    console.log('🔍 Obteniendo todos los usuarios registrados...');
    
    // Consultar la tabla auth.users para obtener todos los usuarios
    const { data, error } = await supabase.auth.admin.listUsers();
    const users = data?.users || [];

    if (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return;
    }

    console.log('📊 Respuesta de Supabase:', JSON.stringify({ users, error }, null, 2));
    
    if (!users || users.length === 0) {
      console.log('📭 No hay usuarios registrados en el sistema');
      return;
    }

    console.log(`\n📊 USUARIOS REGISTRADOS (${users.length} total):`);
    console.log('=' .repeat(80));
    
    users.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📅 Registro: ${new Date(user.created_at).toLocaleString('es-ES')}`);
      console.log(`   🔐 Último acceso: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('es-ES') : 'Nunca'}`);
    });

    console.log('\n' + '=' .repeat(80));
    console.log(`✅ Total de usuarios: ${users.length}`);
    
    // Mostrar solo emails para copiar fácilmente
    console.log('\n📧 LISTA DE EMAILS:');
    console.log('-' .repeat(40));
    users.forEach(user => {
      console.log(user.email);
    });

  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Ejecutar el script
getAllUsers(); 