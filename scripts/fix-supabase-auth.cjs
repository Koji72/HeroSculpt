#!/usr/bin/env node

/**
 * 🔧 FIX: SUPABASE AUTHENTICATION DATABASE ERROR
 * 
 * Este script diagnostica y soluciona el error "Database error saving new user"
 * que aparece durante el registro de usuarios en el 3D Customizer.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIX: SUPABASE AUTHENTICATION DATABASE ERROR');
console.log('==============================================');

// Verificar archivos de configuración
const configFiles = [
  '.env',
  '.env.local',
  '.env.example'
];

console.log('\n📁 Verificando archivos de configuración:');
configFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasSupabaseUrl = content.includes('VITE_SUPABASE_URL');
    const hasSupabaseKey = content.includes('VITE_SUPABASE_ANON_KEY');
    
    console.log(`   📄 ${file}:`);
    console.log(`      ${hasSupabaseUrl ? '✅' : '❌'} VITE_SUPABASE_URL`);
    console.log(`      ${hasSupabaseKey ? '✅' : '❌'} VITE_SUPABASE_ANON_KEY`);
  } else {
    console.log(`   ❌ ${file} - NO ENCONTRADO`);
  }
});

// Verificar archivos de Supabase
const supabaseFiles = [
  'lib/supabase.ts',
  'supabase-setup-clean.sql'
];

console.log('\n🔧 Verificando archivos de Supabase:');
supabaseFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NO ENCONTRADO`);
  }
});

// Verificar configuración en AuthModal
const authModalPath = path.join(__dirname, '../components/AuthModal.tsx');
if (fs.existsSync(authModalPath)) {
  const content = fs.readFileSync(authModalPath, 'utf8');
  
  console.log('\n🎨 Verificando configuración en AuthModal:');
  
  // Verificar manejo de errores
  if (content.includes('SIGN_UP_ERROR')) {
    console.log('   ✅ Manejo de errores de registro configurado');
  } else {
    console.log('   ❌ NO hay manejo de errores de registro');
  }
  
  // Verificar configuración de Supabase
  if (content.includes('supabase.auth.onAuthStateChange')) {
    console.log('   ✅ Listener de cambios de auth configurado');
  } else {
    console.log('   ❌ NO hay listener de cambios de auth');
  }
} else {
  console.log('   ❌ AuthModal.tsx NO ENCONTRADO');
}

console.log('\n🔍 DIAGNÓSTICO DEL PROBLEMA:');
console.log('El error "Database error saving new user" puede ser causado por:');
console.log('');
console.log('1. ❌ Tablas de base de datos no creadas en Supabase');
console.log('2. ❌ Políticas RLS (Row Level Security) no configuradas');
console.log('3. ❌ Variables de entorno incorrectas');
console.log('4. ❌ Configuración de autenticación incompleta');
console.log('5. ❌ Permisos insuficientes en la base de datos');

console.log('\n🛠️ SOLUCIONES:');

console.log('\n📋 PASO 1: Verificar configuración de Supabase');
console.log('1. Ir a https://supabase.com');
console.log('2. Seleccionar tu proyecto');
console.log('3. Ir a Settings > API');
console.log('4. Copiar URL y anon key');
console.log('5. Verificar que estén en el archivo .env');

console.log('\n📋 PASO 2: Configurar la base de datos');
console.log('1. En Supabase, ir a SQL Editor');
console.log('2. Copiar y ejecutar el contenido de supabase-setup-clean.sql');
console.log('3. Verificar que las tablas se crearon correctamente');

console.log('\n📋 PASO 3: Configurar autenticación');
console.log('1. En Supabase, ir a Authentication > Settings');
console.log('2. Configurar Site URL: http://localhost:5178');
console.log('3. Habilitar Email/Password provider');
console.log('4. Configurar redirect URLs');

console.log('\n📋 PASO 4: Verificar políticas RLS');
console.log('1. En Supabase, ir a Authentication > Policies');
console.log('2. Verificar que las políticas estén habilitadas');
console.log('3. Si no existen, ejecutar el script SQL nuevamente');

console.log('\n📋 PASO 5: Mejorar manejo de errores');
console.log('1. Modificar AuthModal.tsx para manejar errores específicos');
console.log('2. Agregar logs de debug para identificar el problema exacto');
console.log('3. Implementar fallback para cuando Supabase no esté disponible');

console.log('\n🔧 SCRIPT DE VERIFICACIÓN RÁPIDA:');
console.log('Ejecuta este comando para verificar la conexión:');
console.log('node scripts/verify-supabase-connection.cjs');

console.log('\n📝 PRÓXIMOS PASOS:');
console.log('1. Verificar que las variables de entorno estén correctas');
console.log('2. Ejecutar el script SQL en Supabase');
console.log('3. Probar el registro de usuarios');
console.log('4. Revisar logs de la consola del navegador');

console.log('\n🎉 Diagnóstico completado!'); 