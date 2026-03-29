#!/usr/bin/env node

/**
 * 🧪 TEST: SUBMENU FILTERING
 * 
 * Script para verificar que el filtrado de submenús está funcionando correctamente
 * 
 * Problema: Los submenús HEAD, CAPE, SYMBOL muestran todas las partes sin filtrar por torso
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: SUBMENU FILTERING');
console.log('==========================\n');

// Verificar que el filtrado está implementado correctamente
const partSelectorPath = path.join(__dirname, '..', 'components', 'PartSelectorPanel.tsx');
if (fs.existsSync(partSelectorPath)) {
  const content = fs.readFileSync(partSelectorPath, 'utf8');
  
  console.log('📋 Verificando filtrado de compatibilidad:');
  
  const checks = {
    'CAPE filtering': content.includes('part.category === PartCategory.CAPE') && content.includes('part.compatible.includes'),
    'SYMBOL filtering': content.includes('part.category === PartCategory.SYMBOL') && content.includes('part.compatible.includes'),
    'HEAD filtering': content.includes('part.category === PartCategory.HEAD') && content.includes('part.compatible.includes'),
    'Fallback to strong_torso_01': content.includes('strong_torso_01') && content.includes('fallback'),
    'Debug logs active': content.includes('DEBUG FILTRADO - PartSelectorPanel')
  };
  
  Object.entries(checks).forEach(([check, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} ${check}`);
  });
  
  if (checks['CAPE filtering'] && checks['SYMBOL filtering'] && checks['Fallback to strong_torso_01']) {
    console.log('\n✅ FILTRADO IMPLEMENTADO CORRECTAMENTE');
    console.log('\n🚀 PARA PROBAR:');
    console.log('1. Abrir http://localhost:5179/ (como guest)');
    console.log('2. Abrir DevTools (F12) → Console');
    console.log('3. Hacer click en UPPER BODY');
    console.log('4. Hacer click en HEAD');
    console.log('5. Verificar que solo se muestran cabezas compatibles con strong_torso_01');
    console.log('6. Hacer click en CAPE');
    console.log('7. Verificar que solo se muestran capas compatibles con strong_torso_01');
    console.log('8. Hacer click en SYMBOL');
    console.log('9. Verificar que solo se muestran símbolos compatibles con strong_torso_01');
    console.log('\n🔍 LOGS ESPERADOS:');
    console.log('- "🔍 DEBUG FILTRADO - PartSelectorPanel: { ... }"');
    console.log('- "🔍 CAPE: No hay torso seleccionado, usando torso por defecto para filtrar: ..."');
    console.log('- "🔍 SYMBOL: No hay torso seleccionado, usando torso por defecto para filtrar: ..."');
  } else {
    console.log('\n❌ PROBLEMA: Filtrado no implementado correctamente');
  }
  
} else {
  console.log('❌ ERROR: No se encontró PartSelectorPanel.tsx');
}

console.log('\n✅ TEST COMPLETADO'); 