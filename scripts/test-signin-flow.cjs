#!/usr/bin/env node

/**
 * 🧪 TEST: SIGN IN FLOW
 * 
 * Script para verificar el flujo de sign in después del sign out
 * 
 * Problema: Sign out funciona pero sign in no vuelve al USER
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: SIGN IN FLOW');
console.log('=====================\n');

// Verificar que los logs de debug están activos
const appPath = path.join(__dirname, '..', 'App.tsx');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  console.log('📋 Verificando logs de debug para sign in:');
  
  const checks = {
    'ESTADO ACTIVO debug': content.includes('🔍 ESTADO ACTIVO:'),
    'loadUserPoses debug': content.includes('🔍 DEBUG - loadUserPoses llamado'),
    'setUserSelectedParts debug': content.includes('setUserSelectedParts llamado con configuración'),
    'loadSessionOnAuthChange': content.includes('loadSessionOnAuthChange')
  };
  
  Object.entries(checks).forEach(([check, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} ${check}`);
  });
  
  if (checks['ESTADO ACTIVO debug'] && checks['loadUserPoses debug']) {
    console.log('\n✅ LOGS DE DEBUG ACTIVOS');
    console.log('\n🚀 PARA PROBAR:');
    console.log('1. Abrir http://localhost:5179/ (como guest)');
    console.log('2. Abrir DevTools (F12) → Console');
    console.log('3. Hacer sign in con un usuario');
    console.log('4. Verificar logs en consola:');
    console.log('   - "🔍 ESTADO ACTIVO: { isAuthenticated: true, ... }"');
    console.log('   - "🔍 DEBUG - loadUserPoses llamado"');
    console.log('   - "✅ setUserSelectedParts llamado con configuración"');
    console.log('5. Verificar que se muestra el personaje del usuario');
    console.log('6. Hacer sign out');
    console.log('7. Verificar que vuelve al guest');
    console.log('8. Hacer sign in nuevamente');
    console.log('9. Verificar que vuelve al usuario correctamente');
  } else {
    console.log('\n❌ PROBLEMA: Logs de debug no están activos');
  }
  
} else {
  console.log('❌ ERROR: No se encontró App.tsx');
}

console.log('\n✅ TEST COMPLETADO'); 