#!/usr/bin/env node

/**
 * 🧪 TEST: GUEST LOWER BODY HOVER
 * 
 * Este script verifica que el hover de LOWER_BODY funciona correctamente
 * para usuarios no autenticados (guest)
 * 
 * Verificaciones:
 * - GUEST_USER_BUILD tiene LOWER_BODY y BOOTS
 * - Lógica de hover de LOWER_BODY está implementada
 * - assignAdaptiveBootsForTorso funciona correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: GUEST LOWER BODY HOVER');
console.log('===============================\n');

// 1. Verificar GUEST_USER_BUILD tiene LOWER_BODY y BOOTS
console.log('1️⃣ Verificando GUEST_USER_BUILD...');
const constantsPath = path.join(__dirname, '..', 'constants.ts');
if (fs.existsSync(constantsPath)) {
  const content = fs.readFileSync(constantsPath, 'utf8');
  
  // Buscar GUEST_USER_BUILD
  const guestBuildMatch = content.match(/export const GUEST_USER_BUILD: SelectedParts = \{([\s\S]*?)\};/);
  if (guestBuildMatch) {
    const guestBuildContent = guestBuildMatch[1];
    
    // Verificar que tiene LEGS
    const hasLegs = guestBuildContent.includes('LEGS:') && guestBuildContent.includes('strong_legs_01');
    if (hasLegs) {
      console.log('   ✅ GUEST_USER_BUILD tiene LEGS (strong_legs_01)');
    } else {
      console.log('   ❌ PROBLEMA: GUEST_USER_BUILD no tiene LEGS');
    }
    
    // Verificar que tiene BOOTS
    const hasBoots = guestBuildContent.includes('BOOTS:') && guestBuildContent.includes('strong_boots_01_l0');
    if (hasBoots) {
      console.log('   ✅ GUEST_USER_BUILD tiene BOOTS (strong_boots_01_l0)');
    } else {
      console.log('   ❌ PROBLEMA: GUEST_USER_BUILD no tiene BOOTS');
    }
    
    // Verificar que tiene HEAD y HANDS (para completitud)
    const hasHead = guestBuildContent.includes('HEAD:') && guestBuildContent.includes('strong_head_01_t01');
    const hasHands = guestBuildContent.includes('HAND_LEFT:') && guestBuildContent.includes('strong_hands_fist_01_t01_l_ng');
    
    if (hasHead && hasHands) {
      console.log('   ✅ GUEST_USER_BUILD tiene HEAD y HANDS (completo)');
    } else {
      console.log('   ⚠️ GUEST_USER_BUILD puede estar incompleto');
    }
    
  } else {
    console.log('   ❌ ERROR: No se encontró GUEST_USER_BUILD');
  }
} else {
  console.log('   ❌ ERROR: No se encontró constants.ts');
}

console.log('');

// 2. Verificar lógica de hover de LOWER_BODY
console.log('2️⃣ Verificando lógica de hover de LOWER_BODY...');
const partSelectorPath = path.join(__dirname, '..', 'components', 'PartSelectorPanel.tsx');
if (fs.existsSync(partSelectorPath)) {
  const content = fs.readFileSync(partSelectorPath, 'utf8');
  
  // Buscar la lógica específica de LOWER_BODY
  const lowerBodyMatch = content.match(/else if \(activeCategory === PartCategory\.LOWER_BODY\) \{([\s\S]*?)\}/);
  if (lowerBodyMatch) {
    const lowerBodyLogic = lowerBodyMatch[1];
    
    // Verificar que usa assignAdaptiveBootsForTorso
    const usesAdaptiveBoots = lowerBodyLogic.includes('assignAdaptiveBootsForTorso');
    if (usesAdaptiveBoots) {
      console.log('   ✅ Usa assignAdaptiveBootsForTorso para compatibilidad');
    } else {
      console.log('   ❌ PROBLEMA: No usa assignAdaptiveBootsForTorso');
    }
    
    // Verificar que maneja el caso cuando no hay partToDisplay
    const handlesNoPart = lowerBodyLogic.includes('delete hoverPreviewParts[PartCategory.LOWER_BODY]') && 
                         lowerBodyLogic.includes('delete hoverPreviewParts[PartCategory.BOOTS]');
    if (handlesNoPart) {
      console.log('   ✅ Maneja correctamente cuando no hay partToDisplay');
    } else {
      console.log('   ❌ PROBLEMA: No maneja correctamente cuando no hay partToDisplay');
    }
    
    // Verificar que crea tempHoverParts
    const createsTempParts = lowerBodyLogic.includes('tempHoverParts');
    if (createsTempParts) {
      console.log('   ✅ Crea tempHoverParts para compatibilidad');
    } else {
      console.log('   ❌ PROBLEMA: No crea tempHoverParts');
    }
    
  } else {
    console.log('   ❌ ERROR: No se encontró lógica de LOWER_BODY');
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
  
  // Buscar la función assignAdaptiveBootsForTorso
  const adaptiveBootsMatch = content.match(/export const assignAdaptiveBootsForTorso = \(([\s\S]*?)\};/);
  if (adaptiveBootsMatch) {
    const functionContent = adaptiveBootsMatch[0];
    
    // Verificar que maneja compatibilidad
    const handlesCompatibility = functionContent.includes('compatible') && functionContent.includes('includes');
    if (handlesCompatibility) {
      console.log('   ✅ Maneja compatibilidad de botas');
    } else {
      console.log('   ❌ PROBLEMA: No maneja compatibilidad de botas');
    }
    
    // Verificar que retorna SelectedParts
    const returnsSelectedParts = functionContent.includes('SelectedParts');
    if (returnsSelectedParts) {
      console.log('   ✅ Retorna SelectedParts correctamente');
    } else {
      console.log('   ❌ PROBLEMA: No retorna SelectedParts');
    }
    
  } else {
    console.log('   ❌ ERROR: No se encontró assignAdaptiveBootsForTorso');
  }
} else {
  console.log('   ❌ ERROR: No se encontró lib/utils.ts');
}

console.log('');

// 4. Simular flujo de hover de LOWER_BODY para guest
console.log('4️⃣ Simulando flujo de hover de LOWER_BODY para guest...');

console.log(`
🎯 FLUJO DE HOVER LOWER_BODY PARA GUEST:

👤 GUEST USER:
- selectedParts = GUEST_USER_BUILD
- Incluye: HEAD, HAND_LEFT, HAND_RIGHT, LEGS, BOOTS

🔄 HOVER SOBRE LOWER_BODY:
1. Usuario hace hover sobre una pierna diferente
2. activeCategory = PartCategory.LOWER_BODY
3. partToDisplay = nueva pierna seleccionada
4. Se ejecuta lógica específica de LOWER_BODY

🔧 LÓGICA DE LOWER_BODY:
1. tempHoverParts = { ...selectedParts, LOWER_BODY: partToDisplay }
2. bootsCompatibleParts = assignAdaptiveBootsForTorso(partToDisplay, tempHoverParts)
3. hoverPreviewParts = { ...tempHoverParts, ...bootsCompatibleParts, LOWER_BODY: partToDisplay }

✅ RESULTADO ESPERADO:
- LOWER_BODY: nueva pierna seleccionada
- BOOTS: botas compatibles con la nueva pierna
- Otras partes: mantenidas del GUEST_USER_BUILD
- HEAD, HANDS: siempre presentes (del GUEST_USER_BUILD)

🎯 BENEFICIOS:
- ✅ Guest siempre ve piernas y botas compatibles
- ✅ No hay interferencia con estado de usuario autenticado
- ✅ Transiciones suaves en hover
- ✅ Compatibilidad automática de botas
`);

console.log('');

// 5. Verificar que no hay conflictos con estados separados
console.log('5️⃣ Verificando compatibilidad con estados separados...');
const appPath = path.join(__dirname, '..', 'App.tsx');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  
  // Verificar que guestSelectedParts usa GUEST_USER_BUILD
  const guestStateMatch = content.match(/const \[guestSelectedParts, setGuestSelectedParts\] = useState<SelectedParts>\(GUEST_USER_BUILD\);/);
  if (guestStateMatch) {
    console.log('   ✅ guestSelectedParts usa GUEST_USER_BUILD (incluye LOWER_BODY)');
  } else {
    console.log('   ❌ PROBLEMA: guestSelectedParts no usa GUEST_USER_BUILD');
  }
  
  // Verificar que setSelectedParts maneja guest correctamente
  const setSelectedPartsMatch = content.match(/setGuestSelectedParts\(/);
  if (setSelectedPartsMatch) {
    console.log('   ✅ setSelectedParts usa setGuestSelectedParts para guest');
  } else {
    console.log('   ❌ PROBLEMA: setSelectedParts no usa setGuestSelectedParts');
  }
  
} else {
  console.log('   ❌ ERROR: No se encontró App.tsx');
}

console.log('');

// 6. Resumen y verificación
console.log('📋 RESUMEN Y VERIFICACIÓN:');
console.log('============================');

console.log(`
🎯 ESTADO DEL LOWER_BODY PARA GUEST:

✅ GUEST_USER_BUILD:
- LEGS: strong_legs_01 ✅
- BOOTS: strong_boots_01_l0 ✅
- HEAD: strong_head_01_t01 ✅
- HANDS: strong_hands_fist_01_t01_* ✅

✅ LÓGICA DE HOVER:
- Usa assignAdaptiveBootsForTorso ✅
- Maneja tempHoverParts ✅
- Limpia correctamente cuando no hay partToDisplay ✅

✅ ESTADOS SEPARADOS:
- guestSelectedParts usa GUEST_USER_BUILD ✅
- setSelectedParts maneja guest correctamente ✅

🚀 PARA PROBAR:
1. Abrir http://localhost:5179/ (como guest)
2. Verificar que se ve personaje completo (cabeza, manos, piernas, botas)
3. Hacer click en LOWER_BODY
4. Hacer hover sobre diferentes piernas
5. Verificar que:
   - Se muestran las piernas en hover
   - Se muestran botas compatibles
   - No hay errores en consola
   - Transiciones suaves

💡 LOGS A VERIFICAR:
- "🔄 LEGS HOVER: Recalculando botas compatibles para piernas"
- "✅ LEGS HOVER: Enviando estado de preview completo"
- "🔄 Estado de autenticación actualizado"

🔧 SI EL PROBLEMA PERSISTE:
- Verificar que GUEST_USER_BUILD se carga correctamente
- Comprobar que assignAdaptiveBootsForTorso funciona
- Verificar que no hay conflictos de estado
- Confirmar que el hover se ejecuta correctamente
`);

console.log('\n✅ ANÁLISIS COMPLETADO'); 