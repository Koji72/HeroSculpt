#!/usr/bin/env node

/**
 * 🧪 VERIFICACIÓN RADICAL: Solución Extrema para Headquarters
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN RADICAL: Solución extrema...\n');

// Verificar HeadquartersPage
const headquartersPath = path.join(__dirname, '../src/pages/Headquarters.tsx');
const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

// Verificar CSS force fullscreen
const cssPath = path.join(__dirname, '../src/headquarters-force-fullscreen.css');
const cssExists = fs.existsSync(cssPath);

console.log('📋 VERIFICACIÓN RADICAL:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar position fixed en HeadquartersPage
const hasPositionFixed = headquartersContent.includes('position: \'fixed\'') &&
                         headquartersContent.includes('top: 0') &&
                         headquartersContent.includes('width: \'100vw\'') &&
                         headquartersContent.includes('height: \'100vh\'') &&
                         headquartersContent.includes('zIndex: 9999');

if (hasPositionFixed) {
  console.log('✅ HeadquartersPage tiene position fixed con 100vw/100vh');
} else {
  console.log('❌ HeadquartersPage NO tiene position fixed correcto');
}

// Verificar clase headquarters-container
const hasHeadquartersContainer = headquartersContent.includes('headquarters-container');

if (hasHeadquartersContainer) {
  console.log('✅ HeadquartersPage tiene clase headquarters-container');
} else {
  console.log('❌ HeadquartersPage NO tiene clase headquarters-container');
}

// Verificar CSS force fullscreen existe
if (cssExists) {
  console.log('✅ CSS force fullscreen existe');
} else {
  console.log('❌ CSS force fullscreen NO existe');
}

// Verificar header sin padding
const hasHeaderNoPadding = headquartersContent.includes('style={{ margin: 0, padding: 0 }}') &&
                          headquartersContent.includes('Header Superheróico');

if (hasHeaderNoPadding) {
  console.log('✅ Header sin padding');
} else {
  console.log('❌ Header SÍ tiene padding');
}

console.log('\n📋 RESUMEN RADICAL:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [hasPositionFixed, hasHeadquartersContainer, cssExists, hasHeaderNoPadding];
const passedChecks = allChecks.filter(check => check).length;

if (passedChecks === allChecks.length) {
  console.log('🎉 VERIFICACIÓN RADICAL EXITOSA');
  console.log('✅ Position fixed con zIndex 9999');
  console.log('✅ Clase headquarters-container');
  console.log('✅ CSS force fullscreen');
  console.log('✅ Header sin padding');
  console.log('✅ DEBERÍA ocupar TODA la pantalla SIN ESPACIOS');
} else {
  console.log('⚠️  VERIFICACIÓN RADICAL FALLÓ');
  console.log(`❌ ${allChecks.length - passedChecks}/4 verificaciones fallaron`);
}

console.log('\n🚀 SOLUCIÓN RADICAL aplicada:');
console.log('1. Position fixed con zIndex 9999');
console.log('2. CSS forzado para fullscreen');
console.log('3. Header sin padding');
console.log('4. Clase headquarters-container');
console.log('5. DEBERÍA estar pegado a TODOS los bordes');