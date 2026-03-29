#!/usr/bin/env node

/**
 * 🧪 TEST: GUEST LEGS HOVER LOGS
 * 
 * Script para verificar que los logs de debug están activos
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST: GUEST LEGS HOVER LOGS');
console.log('===============================\n');

// Verificar que los logs están activos
const partSelectorPath = path.join(__dirname, '..', 'components', 'PartSelectorPanel.tsx');
if (fs.existsSync(partSelectorPath)) {
  const content = fs.readFileSync(partSelectorPath, 'utf8');
  
  console.log('📋 Verificando logs de debug:');
  
  const logs = {
    'HOVER PREVIEW recibiendo part': content.includes('🔍 [HOVER PREVIEW] Recibiendo part:'),
    'ENTRANDO AL BLOQUE LOWER_BODY HOVER': content.includes('🎯 ENTRANDO AL BLOQUE LOWER_BODY HOVER'),
    'LEGS HOVER recalculando': content.includes('🔄 LEGS HOVER: Recalculando botas compatibles para piernas:'),
    'LEGS HOVER enviando preview': content.includes('✅ LEGS HOVER: Enviando estado de preview (siguiendo reglas críticas):'),
    'ENVIANDO PREVIEW': content.includes('📤 ENVIANDO PREVIEW:')
  };
  
  Object.entries(logs).forEach(([log, exists]) => {
    console.log(`   ${exists ? '✅' : '❌'} ${log}`);
  });
  
  if (logs['HOVER PREVIEW recibiendo part'] && logs['ENTRANDO AL BLOQUE LOWER_BODY HOVER'] && logs['ENVIANDO PREVIEW']) {
    console.log('\n✅ LOGS DE DEBUG ACTIVOS');
    console.log('\n🚀 PARA PROBAR:');
    console.log('1. Abrir http://localhost:5179/ (como guest)');
    console.log('2. Abrir DevTools (F12) → Console');
    console.log('3. Hacer click en LOWER BODY');
    console.log('4. Hacer hover sobre "none"');
    console.log('5. Buscar estos logs en consola:');
    console.log('   - "🔍 [HOVER PREVIEW] Recibiendo part: null para categoría: LOWER_BODY"');
    console.log('   - "🎯 ENTRANDO AL BLOQUE LOWER_BODY HOVER"');
    console.log('   - "🔄 LEGS HOVER: Recalculando botas compatibles para piernas: none"');
    console.log('   - "✅ LEGS HOVER: Enviando estado de preview (siguiendo reglas críticas)"');
    console.log('   - "📤 ENVIANDO PREVIEW: { ... }"');
  } else {
    console.log('\n❌ PROBLEMA: Logs de debug no están activos');
  }
  
} else {
  console.log('❌ ERROR: No se encontró PartSelectorPanel.tsx');
}

console.log('\n✅ TEST COMPLETADO'); 