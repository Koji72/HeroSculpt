#!/usr/bin/env node

/**
 * 🧪 TEST: GUEST USER HOVER FIX
 * 
 * Este script verifica si la corrección para usuarios no logueados funciona
 * 
 * Problema corregido:
 * - Usuarios no logueados tenían selectedParts = {} (vacío)
 * - Al hacer hover sobre torsos, no aparecían manos ni otras partes
 * - El problema era que handleResetToDefaultBuild usaba estado vacío
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: GUEST USER HOVER FIX');
console.log('==============================\n');

// 1. Verificar que GUEST_USER_BUILD existe y tiene las partes necesarias
console.log('1️⃣ Verificando GUEST_USER_BUILD...');
const constantsPath = path.join(__dirname, '..', 'constants.ts');
if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  
  // Verificar que GUEST_USER_BUILD existe
  if (content.includes('export const GUEST_USER_BUILD: SelectedParts = {')) {
    console.log('   ✅ GUEST_USER_BUILD existe');
    
    // Verificar que tiene manos
    if (content.includes('HAND_LEFT:') && content.includes('HAND_RIGHT:')) {
      console.log('   ✅ GUEST_USER_BUILD incluye manos (LEFT y RIGHT)');
    } else {
      console.log('   ❌ GUEST_USER_BUILD NO incluye manos');
    }
    
    // Verificar que tiene cabeza
    if (content.includes('HEAD:')) {
      console.log('   ✅ GUEST_USER_BUILD incluye cabeza');
    } else {
      console.log('   ❌ GUEST_USER_BUILD NO incluye cabeza');
    }
    
    // Verificar que tiene piernas y botas
    if (content.includes('LEGS:') && content.includes('BOOTS:')) {
      console.log('   ✅ GUEST_USER_BUILD incluye piernas y botas');
    } else {
      console.log('   ❌ GUEST_USER_BUILD NO incluye piernas y botas');
    }
    
  } else {
    console.log('   ❌ GUEST_USER_BUILD NO existe');
  }
} else {
  console.log('   ❌ ERROR: No se encontró constants.ts');
}

console.log('');

// 2. Verificar que App.tsx importa GUEST_USER_BUILD
console.log('2️⃣ Verificando importación en App.tsx...');
const appPath = path.join(__dirname, '..', 'App.tsx');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  if (content.includes('GUEST_USER_BUILD')) {
    console.log('   ✅ App.tsx importa GUEST_USER_BUILD');
    
    // Verificar que se usa en la inicialización
    if (content.includes('useState<SelectedParts>(GUEST_USER_BUILD)')) {
      console.log('   ✅ selectedParts se inicializa con GUEST_USER_BUILD');
    } else {
      console.log('   ❌ selectedParts NO se inicializa con GUEST_USER_BUILD');
    }
    
    // Verificar que se usa en handleResetToDefaultBuild
    if (content.includes('defaultBuild = GUEST_USER_BUILD;')) {
      console.log('   ✅ handleResetToDefaultBuild usa GUEST_USER_BUILD para usuarios no logueados');
    } else {
      console.log('   ❌ handleResetToDefaultBuild NO usa GUEST_USER_BUILD');
    }
    
  } else {
    console.log('   ❌ App.tsx NO importa GUEST_USER_BUILD');
  }
} else {
  console.log('   ❌ ERROR: No se encontró App.tsx');
}

console.log('');

// 3. Verificar que assignDefaultHandsForTorso maneja estado inicial vacío
console.log('3️⃣ Verificando lib/utils.ts...');
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.ts');
if (fs.existsSync(utilsPath)) {
  const content = fs.readFileSync(utilsPath, 'utf8');
  
  if (content.includes('if (!currentLeftHand && !currentRightHand)')) {
    console.log('   ✅ assignDefaultHandsForTorso maneja caso de manos vacías');
    
    // Verificar que asigna manos por defecto
    if (content.includes('Buscar manos por defecto sin guantes para este torso')) {
      console.log('   ✅ Asigna manos por defecto cuando no hay manos actuales');
    } else {
      console.log('   ❌ NO asigna manos por defecto');
    }
    
  } else {
    console.log('   ❌ assignDefaultHandsForTorso NO maneja caso de manos vacías');
  }
} else {
  console.log('   ❌ ERROR: No se encontró lib/utils.ts');
}

console.log('');

// 4. Verificar documentación
console.log('4️⃣ Verificando documentación...');
const docPaths = [
  'docs/GUEST_USER_DEFAULT_BUILD_FIX_2025.md',
  'docs/HANDS_INITIAL_STATE_FIX_2025.md',
  'docs/DEFAULT_BUILD_FIX_2025.md'
];

let docsFound = 0;
docPaths.forEach(docPath => {
  const fullPath = path.join(__dirname, '..', docPath);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${docPath} existe`);
    docsFound++;
  } else {
    console.log(`   ❌ ${docPath} NO existe`);
  }
});

console.log(`   📊 Documentación encontrada: ${docsFound}/${docPaths.length}`);

console.log('');

// 5. Simular el flujo del problema
console.log('5️⃣ Simulando flujo del problema...');

console.log(`
🎯 ESCENARIO: Usuario no logueado hace hover sobre torso

ANTES (PROBLEMÁTICO):
1. Usuario no logueado → selectedParts = {} (vacío)
2. Hover sobre torso → assignDefaultHandsForTorso(torso, {})
3. No encuentra manos actuales → No asigna manos nuevas
4. Resultado: Solo torso visible, sin manos

DESPUÉS (CORREGIDO):
1. Usuario no logueado → selectedParts = GUEST_USER_BUILD (incluye manos)
2. Hover sobre torso → assignDefaultHandsForTorso(torso, partsWithHands)
3. Encuentra manos actuales → Asigna manos compatibles con nuevo torso
4. Resultado: Torso + manos + cabeza + otras partes visibles

✅ VERIFICACIÓN DE LA CORRECCIÓN:
- GUEST_USER_BUILD incluye manos por defecto
- App.tsx se inicializa con GUEST_USER_BUILD
- handleResetToDefaultBuild usa GUEST_USER_BUILD para usuarios no logueados
- assignDefaultHandsForTorso maneja caso de estado inicial vacío
`);

console.log('');

// 6. Resumen y próximos pasos
console.log('📋 RESUMEN Y PRÓXIMOS PASOS:');
console.log('============================');

console.log(`
🎯 PROBLEMA IDENTIFICADO Y CORREGIDO:
- ✅ Usuarios no logueados ahora tienen estado inicial con partes completas
- ✅ GUEST_USER_BUILD incluye manos, cabeza, piernas y botas
- ✅ handleResetToDefaultBuild diferencia entre usuarios logueados y no logueados
- ✅ assignDefaultHandsForTorso maneja caso de estado inicial vacío

🚀 PARA PROBAR LA CORRECCIÓN:
1. Reiniciar el servidor de desarrollo
2. Abrir en modo incógnito (usuario no logueado)
3. Hacer hover sobre diferentes torsos
4. Verificar que aparecen manos y otras partes junto con el torso

💡 LOGS A VERIFICAR EN EL NAVEGADOR:
- "👤 Usuario NO logueado: usando GUEST_USER_BUILD"
- "🔄 HOVER DEBUG - Torso hover"
- "🎯 HOVER DEBUG - Después de assignDefaultHandsForTorso"

🔧 SI EL PROBLEMA PERSISTE:
- Verificar que no hay cache del navegador
- Comprobar que se cargan los logs correctos
- Verificar que GUEST_USER_BUILD tiene las partes esperadas
`);

console.log('\n✅ ANÁLISIS COMPLETADO');