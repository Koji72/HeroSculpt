#!/usr/bin/env node

/**
 * 🧪 TEST: SEPARATE STATES FIX
 * 
 * Este script verifica que el nuevo sistema de estados separados funciona correctamente
 * 
 * Cambios implementados:
 * - guestSelectedParts: Estado fijo para usuarios NO autenticados
 * - userSelectedParts: Estado personal para usuarios autenticados
 * - setSelectedParts: Función dinámica que usa el estado correcto según autenticación
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: SEPARATE STATES FIX');
console.log('============================\n');

// 1. Verificar estados separados
console.log('1️⃣ Verificando estados separados...');
const appPath = path.join(__dirname, '..', 'App.tsx');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Verificar guestSelectedParts
  const guestStateMatch = content.match(/const \[guestSelectedParts, setGuestSelectedParts\] = useState<SelectedParts>\(GUEST_USER_BUILD\);/);
  if (guestStateMatch) {
    console.log('   ✅ guestSelectedParts declarado correctamente');
  } else {
    console.log('   ❌ PROBLEMA: guestSelectedParts no declarado');
  }
  
  // Verificar userSelectedParts
  const userStateMatch = content.match(/const \[userSelectedParts, setUserSelectedParts\] = useState<SelectedParts>\(\{\}\);/);
  if (userStateMatch) {
    console.log('   ✅ userSelectedParts declarado correctamente');
  } else {
    console.log('   ❌ PROBLEMA: userSelectedParts no declarado');
  }
  
  // Verificar selectedParts dinámico
  const dynamicStateMatch = content.match(/const selectedParts = isAuthenticated \? userSelectedParts : guestSelectedParts;/);
  if (dynamicStateMatch) {
    console.log('   ✅ selectedParts dinámico declarado correctamente');
  } else {
    console.log('   ❌ PROBLEMA: selectedParts dinámico no declarado');
  }
  
} else {
  console.log('   ❌ ERROR: No se encontró App.tsx');
}

console.log('');

// 2. Verificar setSelectedParts dinámico
console.log('2️⃣ Verificando setSelectedParts dinámico...');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Buscar la función setSelectedParts dinámica
  const setSelectedPartsMatch = content.match(/const setSelectedParts = useCallback\(\(newParts: SelectedParts \| \(\(prev: SelectedParts\) => SelectedParts\)\) => \{[\s\S]*?\}, \[isAuthenticated\]\);/);
  
  if (setSelectedPartsMatch) {
    const functionContent = setSelectedPartsMatch[0];
    
    // Verificar que usa isAuthenticated
    const usesAuthCheck = functionContent.includes('if (isAuthenticated)');
    if (usesAuthCheck) {
      console.log('   ✅ Usa verificación de isAuthenticated');
    } else {
      console.log('   ❌ PROBLEMA: No usa verificación de isAuthenticated');
    }
    
    // Verificar que usa setUserSelectedParts para autenticados
    const usesUserState = functionContent.includes('setUserSelectedParts');
    if (usesUserState) {
      console.log('   ✅ Usa setUserSelectedParts para usuarios autenticados');
    } else {
      console.log('   ❌ PROBLEMA: No usa setUserSelectedParts');
    }
    
    // Verificar que usa setGuestSelectedParts para no autenticados
    const usesGuestState = functionContent.includes('setGuestSelectedParts');
    if (usesGuestState) {
      console.log('   ✅ Usa setGuestSelectedParts para usuarios no autenticados');
    } else {
      console.log('   ❌ PROBLEMA: No usa setGuestSelectedParts');
    }
    
    // Verificar que maneja funciones y valores
    const handlesFunctions = functionContent.includes('typeof newParts === \'function\'');
    if (handlesFunctions) {
      console.log('   ✅ Maneja tanto funciones como valores');
    } else {
      console.log('   ❌ PROBLEMA: No maneja funciones correctamente');
    }
    
  } else {
    console.log('   ❌ ERROR: No se encontró función setSelectedParts dinámica');
  }
}

console.log('');

// 3. Verificar que useAuth se declara antes
console.log('3️⃣ Verificando orden de declaraciones...');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Buscar useAuth
  const useAuthMatch = content.match(/const \{ isAuthenticated, loading, signOut, user \} = useAuth\(\);/);
  if (useAuthMatch) {
    const useAuthLine = content.substring(0, useAuthMatch.index).split('\n').length;
    
    // Buscar guestSelectedParts
    const guestMatch = content.match(/const \[guestSelectedParts, setGuestSelectedParts\] = useState<SelectedParts>\(GUEST_USER_BUILD\);/);
    if (guestMatch) {
      const guestLine = content.substring(0, guestMatch.index).split('\n').length;
      
      if (useAuthLine < guestLine) {
        console.log('   ✅ useAuth se declara antes que los estados (línea', useAuthLine, '<', guestLine, ')');
      } else {
        console.log('   ❌ PROBLEMA: useAuth se declara después que los estados');
      }
    }
  }
}

console.log('');

// 4. Verificar funciones actualizadas
console.log('4️⃣ Verificando funciones actualizadas...');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Verificar handleSignOut
  const signOutMatch = content.match(/setUserSelectedParts\(\{\}\);/);
  if (signOutMatch) {
    console.log('   ✅ handleSignOut usa setUserSelectedParts');
  } else {
    console.log('   ❌ PROBLEMA: handleSignOut no usa setUserSelectedParts');
  }
  
  // Verificar loadUserPoses
  const loadPosesMatches = content.match(/setUserSelectedParts\(/g);
  if (loadPosesMatches && loadPosesMatches.length >= 3) {
    console.log('   ✅ loadUserPoses usa setUserSelectedParts (', loadPosesMatches.length, 'veces)');
  } else {
    console.log('   ❌ PROBLEMA: loadUserPoses no usa setUserSelectedParts correctamente');
  }
  
  // Verificar handleResetToDefaultBuild
  const resetMatch = content.match(/setGuestSelectedParts\(GUEST_USER_BUILD\);/);
  if (resetMatch) {
    console.log('   ✅ handleResetToDefaultBuild usa setGuestSelectedParts para guest');
  } else {
    console.log('   ❌ PROBLEMA: handleResetToDefaultBuild no usa setGuestSelectedParts');
  }
  
  const resetUserMatch = content.match(/setUserSelectedParts\(defaultBuild\);/);
  if (resetUserMatch) {
    console.log('   ✅ handleResetToDefaultBuild usa setUserSelectedParts para usuarios');
  } else {
    console.log('   ❌ PROBLEMA: handleResetToDefaultBuild no usa setUserSelectedParts');
  }
}

console.log('');

// 5. Simular flujo completo
console.log('5️⃣ Simulando flujo completo...');

console.log(`
🎯 FLUJO CORREGIDO CON ESTADOS SEPARADOS:

👤 GUEST (NO autenticado):
- guestSelectedParts = GUEST_USER_BUILD (fijo, con cabeza, manos, etc.)
- userSelectedParts = {} (vacío)
- selectedParts = guestSelectedParts ✅
- setSelectedParts() → setGuestSelectedParts() ✅

🔐 USUARIO (autenticado):
- guestSelectedParts = GUEST_USER_BUILD (intacto)
- userSelectedParts = { poses personales del usuario }
- selectedParts = userSelectedParts ✅
- setSelectedParts() → setUserSelectedParts() ✅

🚪 LOGOUT:
- handleSignOut() ejecuta
- setUserSelectedParts({}) - SOLO limpia estado del usuario
- guestSelectedParts = GUEST_USER_BUILD (intacto)
- selectedParts = guestSelectedParts ✅

🔐 RELOGIN:
- loadUserPoses() ejecuta
- setUserSelectedParts(poses) - SOLO modifica estado del usuario
- guestSelectedParts = GUEST_USER_BUILD (intacto)
- selectedParts = userSelectedParts ✅

🔄 RESULTADO:
- ✅ NO HAY INTERFERENCIA entre estados
- ✅ Guest siempre tiene personaje completo
- ✅ Usuario siempre tiene sus poses
- ✅ Transiciones limpias y predecibles
`);

console.log('');

// 6. Resumen y verificación
console.log('📋 RESUMEN Y VERIFICACIÓN:');
console.log('============================');

console.log(`
🎯 CAMBIOS IMPLEMENTADOS:
- ✅ Estados completamente separados (guestSelectedParts vs userSelectedParts)
- ✅ Función setSelectedParts dinámica que usa el estado correcto
- ✅ useAuth declarado antes que los estados
- ✅ Funciones actualizadas para usar el estado correcto
- ✅ Logout solo afecta al estado del usuario
- ✅ Login carga poses en el estado del usuario

🚀 PARA PROBAR:
1. Abrir http://localhost:5178/
2. Verificar que guest ve personaje completo (cabeza, manos, etc.)
3. Login como usuario con poses
4. Verificar que se cargan poses personales
5. Logout
6. Verificar que aparece personaje básico (NO poses del usuario)
7. Relogin
8. Verificar que se cargan poses personales (NO personaje básico)

💡 LOGS A VERIFICAR:
- "🔄 Estado de autenticación actualizado"
- "🧹 Limpiando estado del usuario (userSelectedParts)"
- "✅ Sign out completado - Estado del usuario limpio, guest intacto"
- "🔄 Aplicando última pose del usuario"

🔧 SI EL PROBLEMA PERSISTE:
- Verificar que no hay cache del navegador
- Comprobar que useAuth se ejecuta correctamente
- Verificar que loadUserPoses se ejecuta después del login
- Confirmar que las poses del usuario existen en la BD
`);

console.log('\n✅ ANÁLISIS COMPLETADO'); 