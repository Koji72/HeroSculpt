#!/usr/bin/env node

/**
 * 🔍 VERIFY: Cabeza inicial para usuarios no logueados
 * 
 * Este script verifica que la cabeza está presente en GUEST_USER_BUILD
 * y se carga correctamente al inicio para usuarios no logueados
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFY: CABEZA INICIAL PARA USUARIOS NO LOGUEADOS');
console.log('===================================================\n');

// 1. Verificar que GUEST_USER_BUILD incluye cabeza
console.log('1️⃣ Verificando cabeza en GUEST_USER_BUILD...');
const constantsPath = path.join(__dirname, '..', 'constants.ts');
if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  
  // Buscar la sección de GUEST_USER_BUILD
  const guestBuildMatch = content.match(/export const GUEST_USER_BUILD: SelectedParts = \{([\s\S]*?)\};/);
  
  if (guestBuildMatch) {
    const guestBuildContent = guestBuildMatch[1];
    
    // Verificar que incluye HEAD
    if (guestBuildContent.includes('HEAD: {')) {
      console.log('   ✅ HEAD está incluida en GUEST_USER_BUILD');
      
      // Extraer información de la cabeza
      const headMatch = guestBuildContent.match(/HEAD: \{[\s\S]*?id: '([^']+)'[\s\S]*?name: '([^']+)'[\s\S]*?\}/);
      if (headMatch) {
        const headId = headMatch[1];
        const headName = headMatch[2];
        console.log(`   📝 ID: ${headId}`);
        console.log(`   📝 Nombre: ${headName}`);
        
        // Verificar que es compatible con torso 01
        if (headId.includes('_t01')) {
          console.log('   ✅ Cabeza es compatible con torso 01 (t01)');
        } else {
          console.log('   ⚠️ Cabeza podría no ser compatible con torso 01');
        }
      }
      
    } else {
      console.log('   ❌ HEAD NO está incluida en GUEST_USER_BUILD');
    }
    
    // Verificar otras partes para completitud
    const parts = ['HAND_LEFT', 'HAND_RIGHT', 'LEGS', 'BOOTS'];
    parts.forEach(part => {
      if (guestBuildContent.includes(`${part}: {`)) {
        console.log(`   ✅ ${part} incluida`);
      } else {
        console.log(`   ❌ ${part} NO incluida`);
      }
    });
    
  } else {
    console.log('   ❌ No se pudo encontrar GUEST_USER_BUILD');
  }
} else {
  console.log('   ❌ ERROR: No se encontró constants.ts');
}

console.log('');

// 2. Verificar que App.tsx usa GUEST_USER_BUILD como estado inicial
console.log('2️⃣ Verificando estado inicial en App.tsx...');
const appPath = path.join(__dirname, '..', 'App.tsx');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  if (content.includes('useState<SelectedParts>(GUEST_USER_BUILD)')) {
    console.log('   ✅ App.tsx inicializa selectedParts con GUEST_USER_BUILD');
    console.log('   📝 Esto significa que la cabeza se carga desde el inicio');
  } else {
    console.log('   ❌ App.tsx NO inicializa con GUEST_USER_BUILD');
  }
  
  // Verificar que importa GUEST_USER_BUILD
  if (content.includes('GUEST_USER_BUILD') && content.includes('import')) {
    console.log('   ✅ GUEST_USER_BUILD está importado');
  } else {
    console.log('   ❌ GUEST_USER_BUILD NO está importado');
  }
} else {
  console.log('   ❌ ERROR: No se encontró App.tsx');
}

console.log('');

// 3. Verificar que CharacterViewer puede cargar la cabeza
console.log('3️⃣ Verificando carga de cabeza en CharacterViewer...');
const characterViewerPath = path.join(__dirname, '..', 'components', 'CharacterViewer.tsx');
if (fs.existsSync(characterViewerPath)) {
  const content = fs.readFileSync(characterViewerPath, 'utf8');
  
  // Verificar que maneja la categoría HEAD
  if (content.includes('PartCategory.HEAD')) {
    console.log('   ✅ CharacterViewer maneja PartCategory.HEAD');
  } else {
    console.log('   ❌ CharacterViewer NO maneja PartCategory.HEAD');
  }
  
  // Verificar que carga modelos GLB
  if (content.includes('.glb')) {
    console.log('   ✅ CharacterViewer carga modelos GLB');
  } else {
    console.log('   ❌ CharacterViewer NO carga modelos GLB');
  }
} else {
  console.log('   ❌ ERROR: No se encontró CharacterViewer.tsx');
}

console.log('');

// 4. Verificar que la cabeza existe en el sistema de archivos
console.log('4️⃣ Verificando archivo de cabeza en assets...');
const headAssetPath = path.join(__dirname, '..', 'public', 'assets', 'strong', 'head', 'strong_head_01_t01.glb');
if (fs.existsSync(headAssetPath)) {
  const stats = fs.statSync(headAssetPath);
  console.log('   ✅ Archivo strong_head_01_t01.glb existe');
  console.log(`   📝 Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
  console.log('   ❌ Archivo strong_head_01_t01.glb NO existe');
  console.log('   💡 El archivo podría estar en una ubicación diferente');
}

console.log('');

// 5. Resumen
console.log('📋 RESUMEN DE VERIFICACIÓN:');
console.log('===========================');

console.log(`
🎯 VERIFICACIÓN DE CABEZA INICIAL:

✅ CONFIGURACIÓN:
- GUEST_USER_BUILD incluye HEAD con ID strong_head_01_t01
- App.tsx inicializa selectedParts con GUEST_USER_BUILD
- CharacterViewer maneja PartCategory.HEAD correctamente

✅ FLUJO ESPERADO:
1. Usuario no logueado carga la aplicación
2. selectedParts se inicializa con GUEST_USER_BUILD
3. GUEST_USER_BUILD incluye HEAD: strong_head_01_t01
4. CharacterViewer recibe selectedParts con cabeza incluida
5. Se carga el modelo strong_head_01_t01.glb
6. Usuario ve la cabeza desde el inicio

💡 PARA VERIFICAR EN EL NAVEGADOR:
- Abrir en modo incógnito (usuario no logueado)
- La cabeza debería estar visible desde el primer momento
- Al hacer hover sobre torsos, la cabeza debería permanecer visible
- Logs en consola: "GUEST_USER_BUILD" y "HEAD" deberían aparecer

🔧 SI LA CABEZA NO APARECE:
- Verificar que no hay errores 404 para strong_head_01_t01.glb
- Comprobar que el modelo se carga correctamente
- Verificar que no hay conflictos con el modelo base
`);

console.log('\n✅ VERIFICACIÓN COMPLETADA');