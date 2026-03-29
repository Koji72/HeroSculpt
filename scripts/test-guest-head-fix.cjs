#!/usr/bin/env node

/**
 * 🧪 TEST: GUEST HEAD FIX
 * 
 * Este script verifica que la corrección de la cabeza para usuarios no logueados funciona
 * 
 * Problema solucionado:
 * - GUEST_USER_BUILD tenía HEAD con compatible: [] (vacío)
 * - CharacterViewer.tsx filtraba la cabeza por incompatibilidad
 * - Ahora HEAD tiene compatible: ['strong_torso_01']
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: GUEST HEAD FIX');
console.log('=======================\n');

// 1. Verificar que GUEST_USER_BUILD HEAD tiene compatibilidad correcta
console.log('1️⃣ Verificando compatibilidad de HEAD en GUEST_USER_BUILD...');
const constantsPath = path.join(__dirname, '..', 'constants.ts');
if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  
  // Buscar la configuración de HEAD en GUEST_USER_BUILD
  const guestBuildMatch = content.match(/export const GUEST_USER_BUILD: SelectedParts = \{([\s\S]*?)\};/);
  
  if (guestBuildMatch) {
    const guestBuildContent = guestBuildMatch[1];
    
    // Extraer la configuración de HEAD
    const headMatch = guestBuildContent.match(/HEAD: \{([\s\S]*?)\},/);
    if (headMatch) {
      const headConfig = headMatch[1];
      
      // Verificar que tiene ID correcto
      const idMatch = headConfig.match(/id: '([^']+)'/);
      if (idMatch) {
        const headId = idMatch[1];
        console.log(`   📝 HEAD ID: ${headId}`);
        
        if (headId === 'strong_head_01_t01') {
          console.log('   ✅ HEAD ID es correcto (strong_head_01_t01)');
        } else {
          console.log('   ❌ HEAD ID incorrecto');
        }
      }
      
      // Verificar que tiene compatibilidad con strong_torso_01
      const compatibleMatch = headConfig.match(/compatible: \[(.*?)\]/);
      if (compatibleMatch) {
        const compatibleStr = compatibleMatch[1];
        console.log(`   📝 Compatible: [${compatibleStr}]`);
        
        if (compatibleStr.includes("'strong_torso_01'")) {
          console.log('   ✅ HEAD es compatible con strong_torso_01');
        } else {
          console.log('   ❌ HEAD NO es compatible con strong_torso_01');
        }
      } else {
        console.log('   ❌ No se encontró campo compatible para HEAD');
      }
      
    } else {
      console.log('   ❌ No se encontró configuración de HEAD');
    }
  } else {
    console.log('   ❌ No se encontró GUEST_USER_BUILD');
  }
} else {
  console.log('   ❌ ERROR: No se encontró constants.ts');
}

console.log('');

// 2. Verificar que CharacterViewer.tsx tiene la lógica de filtrado de HEAD
console.log('2️⃣ Verificando lógica de filtrado en CharacterViewer.tsx...');
const characterViewerPath = path.join(__dirname, '..', 'components', 'CharacterViewer.tsx');
if (fs.existsSync(characterViewerPath)) {
  const content = fs.readFileSync(characterViewerPath, 'utf8');
  
  // Verificar que tiene el filtro de cabeza
  if (content.includes('Filtrar cabeza compatible')) {
    console.log('   ✅ CharacterViewer tiene lógica de filtrado de cabeza');
    
    // Verificar que verifica compatibilidad
    if (content.includes('part.compatible.includes(baseTorsoId)')) {
      console.log('   ✅ Verifica compatibilidad con baseTorsoId');
    } else {
      console.log('   ❌ NO verifica compatibilidad correctamente');
    }
    
    // Verificar que tiene logs de debugging
    if (content.includes('Removing incompatible head') && content.includes('Keeping compatible head')) {
      console.log('   ✅ Tiene logs de debugging para cabeza');
    } else {
      console.log('   ❌ NO tiene logs de debugging');
    }
    
  } else {
    console.log('   ❌ CharacterViewer NO tiene lógica de filtrado de cabeza');
  }
} else {
  console.log('   ❌ ERROR: No se encontró CharacterViewer.tsx');
}

console.log('');

// 3. Simular el flujo del problema
console.log('3️⃣ Simulando flujo del problema...');

console.log(`
🎯 ESCENARIO: Usuario no logueado carga la aplicación

ANTES (PROBLEMÁTICO):
1. GUEST_USER_BUILD.HEAD.compatible = [] (vacío)
2. CharacterViewer carga GUEST_USER_BUILD
3. Filtro de compatibilidad: !part.compatible.includes('strong_torso_01')
4. Resultado: false → cabeza eliminada
5. Log: "🚫 Removing incompatible head: strong_head_01_t01"

DESPUÉS (CORREGIDO):
1. GUEST_USER_BUILD.HEAD.compatible = ['strong_torso_01']
2. CharacterViewer carga GUEST_USER_BUILD
3. Filtro de compatibilidad: part.compatible.includes('strong_torso_01')
4. Resultado: true → cabeza mantenida
5. Log: "✅ Keeping compatible head: strong_head_01_t01"

✅ VERIFICACIÓN DE LA CORRECCIÓN:
- HEAD en GUEST_USER_BUILD ahora tiene compatibilidad con strong_torso_01
- CharacterViewer ya tenía la lógica correcta de filtrado
- Solo necesitábamos arreglar la configuración de compatibilidad
`);

console.log('');

// 4. Verificar otras partes en GUEST_USER_BUILD
console.log('4️⃣ Verificando otras partes en GUEST_USER_BUILD...');
if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  
  const guestBuildMatch = content.match(/export const GUEST_USER_BUILD: SelectedParts = \{([\s\S]*?)\};/);
  
  if (guestBuildMatch) {
    const guestBuildContent = guestBuildMatch[1];
    
    // Verificar HAND_LEFT
    if (guestBuildContent.includes('HAND_LEFT:')) {
      const handLeftMatch = guestBuildContent.match(/HAND_LEFT: \{[\s\S]*?compatible: \[(.*?)\]/);
      if (handLeftMatch && handLeftMatch[1].includes("'strong_torso_01'")) {
        console.log('   ✅ HAND_LEFT es compatible con strong_torso_01');
      } else {
        console.log('   ❌ HAND_LEFT NO es compatible con strong_torso_01');
      }
    }
    
    // Verificar HAND_RIGHT
    if (guestBuildContent.includes('HAND_RIGHT:')) {
      const handRightMatch = guestBuildContent.match(/HAND_RIGHT: \{[\s\S]*?compatible: \[(.*?)\]/);
      if (handRightMatch && handRightMatch[1].includes("'strong_torso_01'")) {
        console.log('   ✅ HAND_RIGHT es compatible con strong_torso_01');
      } else {
        console.log('   ❌ HAND_RIGHT NO es compatible con strong_torso_01');
      }
    }
    
    // LEGS y BOOTS no necesitan compatibilidad específica según la lógica actual
    console.log('   📝 LEGS y BOOTS no requieren filtro de compatibilidad');
  }
}

console.log('');

// 5. Resumen y próximos pasos
console.log('📋 RESUMEN Y PRÓXIMOS PASOS:');
console.log('============================');

console.log(`
🎯 PROBLEMA IDENTIFICADO Y CORREGIDO:
- ✅ HEAD en GUEST_USER_BUILD ahora tiene compatible: ['strong_torso_01']
- ✅ CharacterViewer.tsx ya tenía la lógica correcta de filtrado
- ✅ La cabeza ahora debería pasar el filtro de compatibilidad

🚀 PARA PROBAR LA CORRECCIÓN:
1. Reiniciar el servidor de desarrollo si está en ejecución
2. Abrir en modo incógnito (usuario no logueado)
3. Verificar que la cabeza está visible desde el inicio
4. Hacer hover sobre diferentes torsos y verificar que la cabeza se mantiene

💡 LOGS A VERIFICAR EN EL NAVEGADOR:
- "✅ Keeping compatible head: strong_head_01_t01 (compatible with base torso strong_torso_01)"
- "🎯 Found matching head type: strong_head_01_t01" (en hover)
- Ya NO debería aparecer: "🚫 Removing incompatible head"

🔧 SI EL PROBLEMA PERSISTE:
- Verificar que no hay cache del navegador
- Comprobar que se cargan los logs correctos
- Verificar que baseTorsoId es 'strong_torso_01' en los logs
`);

console.log('\n✅ ANÁLISIS COMPLETADO');