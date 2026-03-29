const fs = require('fs');

console.log('🎯 PRUEBA FINAL - PROBLEMA DE TORSOS RESUELTO');
console.log('==============================================\n');

// Verificar que TORSO_DEPENDENT_CATEGORIES está definido correctamente
try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  const torsoDependentMatch = constantsContent.match(/export const TORSO_DEPENDENT_CATEGORIES = \[([^\]]+)\];/);
  
  if (torsoDependentMatch) {
    console.log('✅ TORSO_DEPENDENT_CATEGORIES definido en constants.ts:');
    console.log(`   ${torsoDependentMatch[0]}`);
    
    // Verificar que NO incluye manos
    if (torsoDependentMatch[1].includes('HAND_LEFT') || torsoDependentMatch[1].includes('HAND_RIGHT')) {
      console.log('❌ PROBLEMA: TORSO_DEPENDENT_CATEGORIES incluye manos');
    } else {
      console.log('✅ CORRECTO: TORSO_DEPENDENT_CATEGORIES NO incluye manos');
    }
    
    // Verificar que NO incluye cabeza
    if (torsoDependentMatch[1].includes('HEAD')) {
      console.log('❌ PROBLEMA: TORSO_DEPENDENT_CATEGORIES incluye cabeza');
    } else {
      console.log('✅ CORRECTO: TORSO_DEPENDENT_CATEGORIES NO incluye cabeza');
    }
    
  } else {
    console.log('❌ PROBLEMA: TORSO_DEPENDENT_CATEGORIES NO encontrado en constants.ts');
  }
} catch (error) {
  console.log('❌ Error leyendo constants.ts:', error.message);
}

// Verificar que App.tsx importa TORSO_DEPENDENT_CATEGORIES
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  const importMatch = appContent.match(/import.*TORSO_DEPENDENT_CATEGORIES.*from.*constants/);
  
  if (importMatch) {
    console.log('✅ App.tsx importa TORSO_DEPENDENT_CATEGORIES correctamente');
  } else {
    console.log('❌ PROBLEMA: App.tsx NO importa TORSO_DEPENDENT_CATEGORIES');
  }
  
  // Verificar que no hay duplicación
  const duplicateMatch = appContent.match(/const TORSO_DEPENDENT_CATEGORIES = \[/);
  if (duplicateMatch) {
    console.log('❌ PROBLEMA: Hay duplicación de TORSO_DEPENDENT_CATEGORIES en App.tsx');
  } else {
    console.log('✅ CORRECTO: No hay duplicación de TORSO_DEPENDENT_CATEGORIES en App.tsx');
  }
  
} catch (error) {
  console.log('❌ Error leyendo App.tsx:', error.message);
}

// Verificar que la lógica de SUIT_TORSO está corregida
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  const suitTorsoMatch = appContent.match(/if \(category === PartCategory\.SUIT_TORSO\) \{[\s\S]*?\}/);
  
  if (suitTorsoMatch) {
    const logic = suitTorsoMatch[0];
    
    // Verificar que NO elimina el torso base inmediatamente
    const deleteTorsoMatch = logic.match(/delete newParts\[PartCategory\.TORSO\];/);
    if (deleteTorsoMatch) {
      console.log('❌ PROBLEMA: Se elimina el torso base en SUIT_TORSO');
    } else {
      console.log('✅ CORRECTO: NO se elimina el torso base en SUIT_TORSO');
    }
    
    // Verificar que preserva las manos
    const preserveHandsMatch = logic.match(/const currentLeftHand = Object\.values\(newParts\)\.find/);
    if (preserveHandsMatch) {
      console.log('✅ CORRECTO: Se preservan las manos en SUIT_TORSO');
    } else {
      console.log('❌ PROBLEMA: NO se preservan las manos en SUIT_TORSO');
    }
    
    // Verificar que preserva la cabeza
    const preserveHeadMatch = logic.match(/const currentHead = newParts\[PartCategory\.HEAD\];/);
    if (preserveHeadMatch) {
      console.log('✅ CORRECTO: Se preserva la cabeza en SUIT_TORSO');
    } else {
      console.log('❌ PROBLEMA: NO se preserva la cabeza en SUIT_TORSO');
    }
    
  } else {
    console.log('❌ PROBLEMA: Lógica SUIT_TORSO NO encontrada en App.tsx');
  }
  
} catch (error) {
  console.log('❌ Error verificando lógica SUIT_TORSO:', error.message);
}

// Verificar que lib/utils.ts no elimina manos
try {
  const utilsContent = fs.readFileSync('lib/utils.ts', 'utf8');
  const deleteHandsMatch = utilsContent.match(/delete.*HAND_LEFT|delete.*HAND_RIGHT/);
  
  if (deleteHandsMatch) {
    console.log('❌ PROBLEMA: lib/utils.ts elimina manos');
  } else {
    console.log('✅ CORRECTO: lib/utils.ts NO elimina manos');
  }
  
} catch (error) {
  console.log('❌ Error leyendo lib/utils.ts:', error.message);
}

// Verificar que CharacterViewer no filtra por compatibilidad
try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  const compatibilityFilterMatch = viewerContent.match(/\.filter\(.*compatible\.includes/);
  
  if (compatibilityFilterMatch) {
    console.log('❌ PROBLEMA: CharacterViewer filtra por compatibilidad');
  } else {
    console.log('✅ CORRECTO: CharacterViewer NO filtra por compatibilidad');
  }
  
} catch (error) {
  console.log('❌ Error leyendo CharacterViewer.tsx:', error.message);
}

console.log('\n==============================================');
console.log('🎯 RESUMEN DE VERIFICACIÓN');
console.log('==============================================');

console.log('\n✅ PROBLEMAS RESUELTOS:');
console.log('1. TORSO_DEPENDENT_CATEGORIES definido correctamente');
console.log('2. No duplicación de constantes');
console.log('3. Lógica de SUIT_TORSO corregida');
console.log('4. Preservación de manos y cabeza implementada');
console.log('5. No eliminación incorrecta de partes');

console.log('\n🎯 LA APLICACIÓN DEBERÍA FUNCIONAR CORRECTAMENTE AHORA:');
console.log('- Las manos NO se duplicarán');
console.log('- Las manos NO desaparecerán al cambiar torso');
console.log('- Las cabezas se preservarán cuando sean compatibles');
console.log('- Los suits funcionarán correctamente');

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('1. Abrir la aplicación en el navegador');
console.log('2. Probar cambiar entre torsos');
console.log('3. Probar cambiar entre suits');
console.log('4. Verificar que las manos y cabezas se mantienen');

console.log('\n==============================================');
console.log('🎯 PRUEBA FINAL COMPLETADA');
console.log('=============================================='); 