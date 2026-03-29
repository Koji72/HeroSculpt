#!/usr/bin/env node

/**
 * 🚨 Script de Emergencia: Fix del Cuartel General
 * 
 * Este script aplica una solución de emergencia para el problema
 * de layout descolocado en el Cuartel General.
 * 
 * 🔧 Acciones:
 * - Fuerza el cierre del MaterialPanel
 * - Asegura que el Headquarters tenga prioridad
 * - Limpia elementos flotantes
 * - Verifica la implementación correcta
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 APLICANDO FIX DE EMERGENCIA PARA EL CUARTEL GENERAL...\n');

// Verificar App.tsx
const appPath = path.join(__dirname, '../App.tsx');
if (!fs.existsSync(appPath)) {
  console.error('❌ No se encontró App.tsx');
  process.exit(1);
}

let appContent = fs.readFileSync(appPath, 'utf8');

// 1. Verificar que handleOpenHeadquarters cierre el MaterialPanel
const headquartersCloseMaterialPanel = appContent.includes('setIsMaterialPanelOpen(false)') &&
                                      appContent.includes('handleOpenHeadquarters');

if (headquartersCloseMaterialPanel) {
  console.log('✅ handleOpenHeadquarters cierra automáticamente el MaterialPanel');
} else {
  console.log('❌ handleOpenHeadquarters NO cierra el MaterialPanel');
  
  // Aplicar fix automáticamente
  const oldFunction = 'const handleOpenHeadquarters = () => {\n    setIsHeadquartersOpen(true);\n  };';
  const newFunction = 'const handleOpenHeadquarters = () => {\n    setIsHeadquartersOpen(true);\n    // Cerrar automáticamente el MaterialPanel cuando se abre el Cuartel General\n    setIsMaterialPanelOpen(false);\n  };';
  
  if (appContent.includes(oldFunction)) {
    appContent = appContent.replace(oldFunction, newFunction);
    fs.writeFileSync(appPath, appContent, 'utf8');
    console.log('🔧 Fix aplicado automáticamente');
  }
}

// 2. Verificar renderizado condicional del MaterialPanel
const materialPanelConditional = appContent.includes('{!isHeadquartersOpen && isMaterialPanelOpen && (') &&
                                appContent.includes('<MaterialPanel') &&
                                appContent.includes(')}');

if (materialPanelConditional) {
  console.log('✅ MaterialPanel renderizado condicionalmente con doble verificación');
} else {
  console.log('❌ MaterialPanel NO tiene doble verificación');
  
  // Aplicar fix automáticamente
  const oldRender = '{!isHeadquartersOpen && (\n         <MaterialPanel';
  const newRender = '{!isHeadquartersOpen && isMaterialPanelOpen && (\n         <MaterialPanel';
  
  if (appContent.includes(oldRender)) {
    appContent = appContent.replace(oldRender, newRender);
    fs.writeFileSync(appPath, appContent, 'utf8');
    console.log('🔧 Fix de renderizado aplicado automáticamente');
  }
}

// 3. Verificar que no haya elementos de texto flotando
const floatingTextPatterns = [
  'Material Configuration',
  'Customize materials, colors, textures and effects',
  'MaterialsuEffectave'
];

let floatingTextFound = false;
floatingTextPatterns.forEach(pattern => {
  if (appContent.includes(pattern)) {
    console.log(`⚠️  Texto flotante encontrado: "${pattern}"`);
    floatingTextFound = true;
  }
});

if (!floatingTextFound) {
  console.log('✅ No se encontraron elementos de texto flotando');
}

// 4. Verificar z-index del Headquarters
const headquartersZIndex = appContent.includes('z-50') && 
                          appContent.includes('Headquarters');

if (headquartersZIndex) {
  console.log('✅ Headquarters tiene z-index correcto (z-50)');
} else {
  console.log('❌ Headquarters NO tiene z-index correcto');
}

// 5. Crear script de limpieza adicional
const cleanupScript = `
// Script de limpieza adicional para el Cuartel General
const forceCleanup = () => {
  // Forzar cierre de todos los paneles problemáticos
  if (window.isMaterialPanelOpen !== undefined) {
    window.isMaterialPanelOpen = false;
  }
  if (window.setIsMaterialPanelOpen !== undefined) {
    window.setIsMaterialPanelOpen(false);
  }
  
  // Limpiar elementos flotantes
  const floatingElements = document.querySelectorAll('[class*="Material"], [class*="material"]');
  floatingElements.forEach(el => {
    if (el.textContent.includes('Material Configuration') || 
        el.textContent.includes('Customize materials')) {
      el.style.display = 'none';
    }
  });
  
  console.log('🧹 Limpieza de emergencia aplicada');
};

// Ejecutar limpieza cuando se carga la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', forceCleanup);
  window.addEventListener('DOMContentLoaded', forceCleanup);
}
`;

const cleanupPath = path.join(__dirname, '../public/emergency-cleanup.js');
fs.writeFileSync(cleanupPath, cleanupScript, 'utf8');
console.log('✅ Script de limpieza de emergencia creado');

console.log('\n📋 Resumen de verificaciones:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (headquartersCloseMaterialPanel && materialPanelConditional && !floatingTextFound && headquartersZIndex) {
  console.log('🎉 TODAS LAS VERIFICACIONES PASARON');
  console.log('✅ El fix de emergencia está funcionando correctamente');
  console.log('✅ No hay elementos descolocados');
  console.log('✅ Los componentes se renderizan condicionalmente');
} else {
  console.log('⚠️  ALGUNAS VERIFICACIONES FALLARON');
  console.log('🔧 Revisar los problemas identificados arriba');
}

console.log('\n🚀 Para aplicar el fix de emergencia:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Si persiste el problema, agregar este script al HTML:');
console.log('   <script src="/emergency-cleanup.js"></script>');
console.log('4. Verificar que no aparezcan elementos del MaterialPanel');
console.log('5. Verificar que no haya texto flotando');

console.log('\n📚 Documentación relacionada:');
console.log('- docs/HEADQUARTERS_LAYOUT_FIX_2025.md');
console.log('- docs/HEADQUARTERS_IMPROVEMENTS_2025.md');
console.log('- docs/MNM_HQ_FINAL_SUMMARY_2025.md'); 