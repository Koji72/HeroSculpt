#!/usr/bin/env node

/**
 * 🐛 DEBUG: GUEST LEGS HOVER
 * 
 * Script para debuggear específicamente el hover de piernas en el guest
 * 
 * Problema reportado: Las piernas no desaparecen cuando se hace hover sobre "none"
 */

const fs = require('fs');
const path = require('path');

console.log('🐛 DEBUG: GUEST LEGS HOVER');
console.log('==========================\n');

// 1. Verificar GUEST_USER_BUILD
console.log('1️⃣ Verificando GUEST_USER_BUILD...');
const constantsPath = path.join(__dirname, '..', 'constants.ts');
if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  
  // Buscar GUEST_USER_BUILD
  const guestBuildMatch = content.match(/export const GUEST_USER_BUILD: SelectedParts = \{([\s\S]*?)\};/);
  if (guestBuildMatch) {
    const guestBuildContent = guestBuildMatch[1];
    
    console.log('   📋 GUEST_USER_BUILD contiene:');
    
    // Verificar cada parte
    const parts = {
      'HEAD': guestBuildContent.includes('HEAD:'),
      'HAND_LEFT': guestBuildContent.includes('HAND_LEFT:'),
      'HAND_RIGHT': guestBuildContent.includes('HAND_RIGHT:'),
      'LEGS': guestBuildContent.includes('LEGS:'),
      'BOOTS': guestBuildContent.includes('BOOTS:')
    };
    
    Object.entries(parts).forEach(([part, exists]) => {
      console.log(`   ${exists ? '✅' : '❌'} ${part}: ${exists ? 'PRESENTE' : 'AUSENTE'}`);
    });
    
    // Verificar IDs específicos
    if (guestBuildContent.includes('strong_legs_01')) {
      console.log('   ✅ LEGS ID: strong_legs_01');
    } else {
      console.log('   ❌ LEGS ID: NO ENCONTRADO');
    }
    
    if (guestBuildContent.includes('strong_boots_01_l0')) {
      console.log('   ✅ BOOTS ID: strong_boots_01_l0');
    } else {
      console.log('   ❌ BOOTS ID: NO ENCONTRADO');
    }
    
  } else {
    console.log('   ❌ ERROR: No se encontró GUEST_USER_BUILD');
  }
} else {
  console.log('   ❌ ERROR: No se encontró constants.ts');
}

console.log('');

// 2. Verificar lógica de hover en PartSelectorPanel
console.log('2️⃣ Verificando lógica de hover en PartSelectorPanel...');
const partSelectorPath = path.join(__dirname, '..', 'components', 'PartSelectorPanel.tsx');
if (fs.existsSync(partSelectorPath)) {
  const content = fs.readFileSync(partSelectorPath, 'utf8');
  
  // Buscar la lógica de LOWER_BODY hover
  const lowerBodyHoverMatch = content.match(/else if \(activeCategory === PartCategory\.LOWER_BODY\) \{([\s\S]*?)\}/);
  if (lowerBodyHoverMatch) {
    const hoverLogic = lowerBodyHoverMatch[1];
    
    console.log('   📋 Lógica de hover encontrada:');
    
    // Verificar elementos clave
    const checks = {
      'partsWithoutCurrentLegs': hoverLogic.includes('partsWithoutCurrentLegs'),
      'assignAdaptiveBootsForTorso': hoverLogic.includes('assignAdaptiveBootsForTorso'),
      'hoverPreviewParts = {': hoverLogic.includes('hoverPreviewParts = {'),
      'delete hoverPreviewParts[PartCategory.LOWER_BODY]': hoverLogic.includes('delete hoverPreviewParts[PartCategory.LOWER_BODY]'),
      'delete hoverPreviewParts[PartCategory.BOOTS]': hoverLogic.includes('delete hoverPreviewParts[PartCategory.BOOTS]'),
      'console.log': hoverLogic.includes('console.log')
    };
    
    Object.entries(checks).forEach(([check, exists]) => {
      console.log(`   ${exists ? '✅' : '❌'} ${check}: ${exists ? 'PRESENTE' : 'AUSENTE'}`);
    });
    
    // Verificar el caso "none" específicamente
    const noneCaseMatch = hoverLogic.match(/} else \{([\s\S]*?)\}/);
    if (noneCaseMatch) {
      const noneCase = noneCaseMatch[1];
      console.log('   📋 Caso "none" encontrado:');
      console.log(`   ${noneCase.includes('hoverPreviewParts = { ...partsWithoutCurrentLegs }') ? '✅' : '❌'} Inicialización correcta`);
      console.log(`   ${noneCase.includes('delete hoverPreviewParts[PartCategory.LOWER_BODY]') ? '✅' : '❌'} Eliminación de LOWER_BODY`);
      console.log(`   ${noneCase.includes('delete hoverPreviewParts[PartCategory.BOOTS]') ? '✅' : '❌'} Eliminación de BOOTS`);
    } else {
      console.log('   ❌ ERROR: No se encontró el caso "none"');
    }
    
  } else {
    console.log('   ❌ ERROR: No se encontró lógica de hover para LOWER_BODY');
  }
} else {
  console.log('   ❌ ERROR: No se encontró PartSelectorPanel.tsx');
}

console.log('');

// 3. Verificar función assignAdaptiveBootsForTorso
console.log('3️⃣ Verificando assignAdaptiveBootsForTorso...');
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.ts');
if (fs.existsSync(utilsPath)) {
  const content = fs.readFileSync(utilsPath, 'utf8');
  
  // Buscar la función
  const functionMatch = content.match(/export function assignAdaptiveBootsForTorso\(([\s\S]*?)\}/);
  if (functionMatch) {
    const functionContent = functionMatch[0];
    
    console.log('   📋 Función encontrada:');
    
    const checks = {
      'newLegs: Part': functionContent.includes('newLegs: Part'),
      'currentParts: SelectedParts': functionContent.includes('currentParts: SelectedParts'),
      'compatible.includes': functionContent.includes('compatible.includes'),
      'return newParts': functionContent.includes('return newParts'),
      'delete newParts[PartCategory.BOOTS]': functionContent.includes('delete newParts[PartCategory.BOOTS]')
    };
    
    Object.entries(checks).forEach(([check, exists]) => {
      console.log(`   ${exists ? '✅' : '❌'} ${check}: ${exists ? 'PRESENTE' : 'AUSENTE'}`);
    });
    
  } else {
    console.log('   ❌ ERROR: No se encontró assignAdaptiveBootsForTorso');
  }
} else {
  console.log('   ❌ ERROR: No se encontró lib/utils.ts');
}

console.log('');

// 4. Simular flujo de debug
console.log('4️⃣ Simulando flujo de debug...');

console.log(`
🎯 FLUJO DE DEBUG PARA GUEST LEGS HOVER:

👤 ESTADO INICIAL DEL GUEST:
- selectedParts = GUEST_USER_BUILD
- Incluye: HEAD, HAND_LEFT, HAND_RIGHT, LEGS, BOOTS

🦵 HOVER SOBRE "NONE" (PIERNAS):
1. Usuario hace hover sobre "none" en LOWER_BODY
2. handleHoverPreview se ejecuta con:
   - activeCategory = LOWER_BODY
   - partToDisplay = null (none)
3. Se crea partsWithoutCurrentLegs = { HEAD, HAND_LEFT, HAND_RIGHT, BOOTS }
4. Como partToDisplay es null, entra en el else
5. hoverPreviewParts = { ...partsWithoutCurrentLegs }
6. delete hoverPreviewParts[PartCategory.LOWER_BODY] → ❌ PROBLEMA AQUÍ
7. delete hoverPreviewParts[PartCategory.BOOTS] → ❌ PROBLEMA AQUÍ

🔍 POSIBLES PROBLEMAS:
- ❌ LOWER_BODY no existe en partsWithoutCurrentLegs (ya se eliminó)
- ❌ BOOTS no existe en partsWithoutCurrentLegs (ya se eliminó)
- ❌ CharacterViewer no recibe el preview correcto
- ❌ Los logs no se están mostrando

💡 SOLUCIÓN:
- Verificar que los logs aparecen en consola
- Verificar que hoverPreviewParts se envía correctamente
- Verificar que CharacterViewer recibe el preview
- Verificar que los modelos se ocultan correctamente
`);

console.log('');

// 5. Instrucciones de debug
console.log('5️⃣ Instrucciones de debug:');
console.log('==========================');

console.log(`
🚀 PARA DEBUGGEAR EN VIVO:

1. Abrir http://localhost:5179/ (como guest)
2. Abrir DevTools (F12) → Console
3. Hacer click en LOWER BODY
4. Buscar estos logs:
   - "🔄 LEGS HOVER: Recalculando botas compatibles para piernas: none"
   - "✅ LEGS HOVER: Enviando estado de preview (siguiendo reglas críticas)"
5. Hacer hover sobre "none" (primera opción)
6. Verificar que aparecen los logs
7. Verificar que las piernas desaparecen

🔍 LOGS ESPERADOS:
- "🔄 LEGS HOVER: Recalculando botas compatibles para piernas: none"
- "✅ LEGS HOVER: Enviando estado de preview (siguiendo reglas críticas): { allParts: [...], legs: 'removed', boots: 'removed' }"
- "CharacterViewer: Preview parts changed: { ... }"
- "👁️ HOVER: Hiding original model: strong_legs_01"
- "👁️ HOVER: Hiding original model: strong_boots_01_l0"

❌ SI NO APARECEN LOS LOGS:
- El hover no se está ejecutando
- Hay un error en la lógica de hover
- El PartSelectorPanel no está recibiendo el evento

❌ SI APARECEN LOS LOGS PERO NO DESAPARECEN LAS PIERNAS:
- CharacterViewer no está procesando el preview
- Los modelos no se están ocultando correctamente
- Hay un problema con la visibilidad de los modelos
`);

console.log('\n✅ ANÁLISIS DE DEBUG COMPLETADO'); 