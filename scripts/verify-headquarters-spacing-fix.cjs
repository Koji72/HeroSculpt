#!/usr/bin/env node

/**
 * 🧪 Script de Verificación: Espaciado del Cuartel General
 * 
 * Este script verifica que el Cuartel General ocupe toda la pantalla
 * sin espacios no deseados en la parte superior.
 * 
 * ✅ Verificaciones:
 * - Modal ocupa toda la pantalla (top-0, left-0, right-0, bottom-0)
 * - No hay padding o margin no deseado
 * - CSS global correcto para html, body y #root
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando espaciado del Cuartel General...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

// Verificar que el modal ocupe toda la pantalla
const fullScreenModal = headquartersContent.includes('fixed top-0 left-0 right-0 bottom-0') &&
                       headquartersContent.includes('m-0 p-0') &&
                       headquartersContent.includes('w-full h-full');

if (fullScreenModal) {
  console.log('✅ Modal del Headquarters ocupa toda la pantalla');
} else {
  console.log('❌ Modal del Headquarters NO ocupa toda la pantalla');
}

// Verificar que no haya centrado problemático
const noCentering = !headquartersContent.includes('items-center justify-center') &&
                   !headquartersContent.includes('p-4');

if (noCentering) {
  console.log('✅ No hay centrado problemático en el modal');
} else {
  console.log('❌ Hay centrado problemático en el modal');
}

// Verificar index.html
const indexPath = path.join(__dirname, '../public/index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Verificar CSS global
  const globalCSS = indexContent.includes('html, body {') &&
                   indexContent.includes('margin: 0;') &&
                   indexContent.includes('padding: 0;') &&
                   indexContent.includes('height: 100%;') &&
                   indexContent.includes('#root {') &&
                   indexContent.includes('height: 100vh;') &&
                   indexContent.includes('width: 100vw;');

  if (globalCSS) {
    console.log('✅ CSS global correcto para eliminar espacios');
  } else {
    console.log('❌ CSS global NO está configurado correctamente');
  }
} else {
  console.log('❌ No se encontró index.html');
}

// Verificar que no haya min-h-screen problemático
const noMinHeight = !headquartersContent.includes('min-h-screen');

if (noMinHeight) {
  console.log('✅ No hay min-h-screen problemático');
} else {
  console.log('❌ Hay min-h-screen que puede causar problemas');
}

console.log('\n📋 Resumen de verificaciones:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (fullScreenModal && noCentering && noMinHeight) {
  console.log('🎉 TODAS LAS VERIFICACIONES PASARON');
  console.log('✅ El espaciado del Cuartel General está corregido');
  console.log('✅ El modal ocupa toda la pantalla sin espacios');
  console.log('✅ No hay centrado problemático');
} else {
  console.log('⚠️  ALGUNAS VERIFICACIONES FALLARON');
  console.log('🔧 Revisar los problemas identificados arriba');
}

console.log('\n🚀 Para probar los cambios:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que no haya espacio en la parte superior');
console.log('4. Verificar que el modal ocupe toda la pantalla');
console.log('5. Verificar que el contenido esté ajustado al browser');

console.log('\n📚 Documentación relacionada:');
console.log('- docs/HEADQUARTERS_LAYOUT_FIX_FINAL_2025.md');
console.log('- docs/HEADQUARTERS_IMPROVEMENTS_2025.md');
console.log('- docs/MNM_HQ_FINAL_SUMMARY_2025.md'); 