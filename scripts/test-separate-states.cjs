#!/usr/bin/env node

/**
 * 🧪 TEST: SEPARATE STATES
 * 
 * Script para verificar que los estados guest y user están completamente separados
 * 
 * Problema: Cuando se modifica algo del guest, el user hereda esos cambios
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: SEPARATE STATES');
console.log('=========================\n');

// Verificar que los estados están separados correctamente
const appPath = path.join(__dirname, '..', 'App.tsx');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  console.log('📋 Verificando separación de estados:');
  
  const checks = {
    'guestSelectedParts state': content.includes('guestSelectedParts, setGuestSelectedParts'),
    'userSelectedParts state': content.includes('userSelectedParts, setUserSelectedParts'),
    'selectedParts dynamic': content.includes('selectedParts = isAuthenticated ? userSelectedParts : guestSelectedParts'),
    'setSelectedParts callback': content.includes('setSelectedParts = useCallback'),
    'userSelectedParts cleanup': content.includes('limpiando userSelectedParts'),
    'setSelectedParts debug logs': content.includes('setSelectedParts llamado:')
  };
  
  Object.entries(checks).forEach(([check, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} ${check}`);
  });
  
  if (checks['guestSelectedParts state'] && checks['userSelectedParts state'] && checks['selectedParts dynamic']) {
    console.log('\n✅ ESTADOS SEPARADOS IMPLEMENTADOS');
    console.log('\n🚀 PARA PROBAR:');
    console.log('1. Abrir http://localhost:5179/ (como guest)');
    console.log('2. Abrir DevTools (F12) → Console');
    console.log('3. Modificar algo del personaje (cambiar torso, cabeza, etc.)');
    console.log('4. Verificar logs: "👥 Modificando guestSelectedParts"');
    console.log('5. Hacer sign in con un usuario');
    console.log('6. Verificar que el personaje del usuario NO tiene los cambios del guest');
    console.log('7. Verificar logs: "👤 Modificando userSelectedParts"');
    console.log('8. Modificar algo del personaje del usuario');
    console.log('9. Hacer sign out');
    console.log('10. Verificar que el guest NO tiene los cambios del usuario');
  } else {
    console.log('\n❌ PROBLEMA: Estados no están separados correctamente');
  }
  
} else {
  console.log('❌ ERROR: No se encontró App.tsx');
}

console.log('\n✅ TEST COMPLETADO'); 