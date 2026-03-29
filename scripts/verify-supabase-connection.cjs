#!/usr/bin/env node

/**
 * 🔍 VERIFY: SUPABASE CONNECTION
 * 
 * Este script verifica la conexión a Supabase y la configuración
 * para diagnosticar el error "Database error saving new user".
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFY: SUPABASE CONNECTION');
console.log('==============================');

// Función para leer variables de entorno
function getEnvVar(varName) {
  const envFiles = ['.env', '.env.local', '.env.example'];
  
  for (const file of envFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        if (line.startsWith(varName + '=')) {
          return line.split('=')[1].trim();
        }
      }
    }
  }
  return null;
}

// Verificar variables de entorno
console.log('\n📋 Verificando variables de entorno:');

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (supabaseUrl) {
  console.log(`   ✅ VITE_SUPABASE_URL: ${supabaseUrl.substring(0, 30)}...`);
} else {
  console.log('   ❌ VITE_SUPABASE_URL: NO ENCONTRADO');
}

if (supabaseKey) {
  console.log(`   ✅ VITE_SUPABASE_ANON_KEY: ${supabaseKey.substring(0, 20)}...`);
} else {
  console.log('   ❌ VITE_SUPABASE_ANON_KEY: NO ENCONTRADO');
}

// Verificar formato de URL
if (supabaseUrl) {
  if (supabaseUrl.includes('supabase.co')) {
    console.log('   ✅ Formato de URL válido');
  } else {
    console.log('   ⚠️  Formato de URL puede ser incorrecto');
  }
}

// Verificar formato de key
if (supabaseKey) {
  if (supabaseKey.length > 50 && supabaseKey.startsWith('eyJ')) {
    console.log('   ✅ Formato de key válido (JWT)');
  } else {
    console.log('   ⚠️  Formato de key puede ser incorrecto');
  }
}

// Verificar archivo de configuración
console.log('\n🔧 Verificando configuración de Supabase:');

const supabaseConfigPath = path.join(__dirname, '../lib/supabase.ts');
if (fs.existsSync(supabaseConfigPath)) {
  const content = fs.readFileSync(supabaseConfigPath, 'utf8');
  
  if (content.includes('createClient')) {
    console.log('   ✅ Cliente Supabase configurado correctamente');
  } else {
    console.log('   ❌ Cliente Supabase NO configurado');
  }
  
  if (content.includes('VITE_SUPABASE_URL')) {
    console.log('   ✅ Variables de entorno referenciadas');
  } else {
    console.log('   ❌ Variables de entorno NO referenciadas');
  }
} else {
  console.log('   ❌ lib/supabase.ts NO ENCONTRADO');
}

// Verificar script SQL
console.log('\n📊 Verificando script de base de datos:');

const sqlScriptPath = path.join(__dirname, '../supabase-setup-clean.sql');
if (fs.existsSync(sqlScriptPath)) {
  const content = fs.readFileSync(sqlScriptPath, 'utf8');
  
  if (content.includes('CREATE TABLE')) {
    console.log('   ✅ Script SQL contiene creación de tablas');
  } else {
    console.log('   ❌ Script SQL NO contiene creación de tablas');
  }
  
  if (content.includes('RLS')) {
    console.log('   ✅ Script SQL contiene políticas RLS');
  } else {
    console.log('   ❌ Script SQL NO contiene políticas RLS');
  }
  
  if (content.includes('user_configurations')) {
    console.log('   ✅ Script SQL contiene tabla user_configurations');
  } else {
    console.log('   ❌ Script SQL NO contiene tabla user_configurations');
  }
} else {
  console.log('   ❌ supabase-setup-clean.sql NO ENCONTRADO');
}

// Verificar AuthModal
console.log('\n🎨 Verificando configuración de AuthModal:');

const authModalPath = path.join(__dirname, '../components/AuthModal.tsx');
if (fs.existsSync(authModalPath)) {
  const content = fs.readFileSync(authModalPath, 'utf8');
  
  if (content.includes('@supabase/auth-ui-react')) {
    console.log('   ✅ Auth UI React importado');
  } else {
    console.log('   ❌ Auth UI React NO importado');
  }
  
  if (content.includes('supabase.auth.onAuthStateChange')) {
    console.log('   ✅ Listener de auth configurado');
  } else {
    console.log('   ❌ Listener de auth NO configurado');
  }
  
  if (content.includes('SIGN_UP_ERROR')) {
    console.log('   ✅ Manejo de errores de registro configurado');
  } else {
    console.log('   ❌ Manejo de errores de registro NO configurado');
  }
} else {
  console.log('   ❌ AuthModal.tsx NO ENCONTRADO');
}

// Resumen y recomendaciones
console.log('\n📊 RESUMEN:');

const issues = [];

if (!supabaseUrl) issues.push('VITE_SUPABASE_URL no encontrado');
if (!supabaseKey) issues.push('VITE_SUPABASE_ANON_KEY no encontrado');
if (!fs.existsSync(supabaseConfigPath)) issues.push('lib/supabase.ts no encontrado');
if (!fs.existsSync(sqlScriptPath)) issues.push('supabase-setup-clean.sql no encontrado');

if (issues.length === 0) {
  console.log('   ✅ Configuración básica correcta');
  console.log('   ⚠️  El problema puede estar en Supabase Cloud');
} else {
  console.log('   ❌ Problemas encontrados:');
  issues.forEach(issue => console.log(`      - ${issue}`));
}

console.log('\n🛠️ PRÓXIMOS PASOS:');

if (issues.length > 0) {
  console.log('1. 🔧 Corregir problemas de configuración local');
  console.log('2. 📋 Verificar variables de entorno');
  console.log('3. 🔧 Revisar archivos de configuración');
} else {
  console.log('1. 🌐 Ir a https://supabase.com');
  console.log('2. 📊 Verificar que el proyecto esté activo');
  console.log('3. 🗄️  Ejecutar script SQL en SQL Editor');
  console.log('4. 🔐 Verificar políticas RLS');
  console.log('5. ⚙️  Configurar autenticación');
}

console.log('\n🔍 PARA DEBUGGING:');
console.log('1. Abrir consola del navegador (F12)');
console.log('2. Intentar registrar un usuario');
console.log('3. Revisar errores en la consola');
console.log('4. Verificar logs de Supabase Dashboard');

console.log('\n📞 SOPORTE:');
console.log('Si el problema persiste:');
console.log('1. Verificar logs en Supabase Dashboard > Logs');
console.log('2. Revisar políticas en Authentication > Policies');
console.log('3. Verificar configuración en Settings > API');

console.log('\n🎉 Verificación completada!'); 