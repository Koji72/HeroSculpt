#!/usr/bin/env node

/**
 * 🔍 Script de Análisis HTML: Buscar Causa del Espacio Excesivo
 * 
 * Este script analiza el HTML real generado para encontrar
 * exactamente qué está causando el espacio excesivo.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Analizando HTML para encontrar causa del espacio excesivo...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

const headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

console.log('📋 ANÁLISIS DEL CÓDIGO REACT:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Buscar todos los divs que podrían tener padding/margin
const divMatches = headquartersContent.match(/<div[^>]*>/g) || [];
console.log(`🔍 Encontrados ${divMatches.length} elementos div`);

// Buscar elementos con padding
const paddingElements = headquartersContent.match(/className="[^"]*p-[^"]*"/g) || [];
console.log(`🔍 Encontrados ${paddingElements.length} elementos con padding:`);
paddingElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

// Buscar elementos con margin
const marginElements = headquartersContent.match(/className="[^"]*m-[^"]*"/g) || [];
console.log(`🔍 Encontrados ${marginElements.length} elementos con margin:`);
marginElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

// Buscar elementos con space-y
const spaceYElements = headquartersContent.match(/className="[^"]*space-y-[^"]*"/g) || [];
console.log(`🔍 Encontrados ${spaceYElements.length} elementos con space-y:`);
spaceYElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

// Buscar elementos con gap
const gapElements = headquartersContent.match(/className="[^"]*gap-[^"]*"/g) || [];
console.log(`🔍 Encontrados ${gapElements.length} elementos con gap:`);
gapElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

// Buscar elementos con flex
const flexElements = headquartersContent.match(/className="[^"]*flex[^"]*"/g) || [];
console.log(`🔍 Encontrados ${flexElements.length} elementos con flex:`);
flexElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

// Buscar elementos con items-center
const itemsCenterElements = headquartersContent.match(/className="[^"]*items-center[^"]*"/g) || [];
console.log(`🔍 Encontrados ${itemsCenterElements.length} elementos con items-center:`);
itemsCenterElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

// Buscar elementos con justify-center
const justifyCenterElements = headquartersContent.match(/className="[^"]*justify-center[^"]*"/g) || [];
console.log(`🔍 Encontrados ${justifyCenterElements.length} elementos con justify-center:`);
justifyCenterElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

// Buscar elementos con style inline
const styleElements = headquartersContent.match(/style=\{[^}]*\}/g) || [];
console.log(`🔍 Encontrados ${styleElements.length} elementos con style inline:`);
styleElements.forEach((match, index) => {
  console.log(`  ${index + 1}. ${match}`);
});

console.log('\n📋 POSIBLES CAUSAS DEL ESPACIO EXCESIVO:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar si hay elementos con items-center que podrían estar centrando
if (itemsCenterElements.length > 0) {
  console.log('⚠️  POSIBLE CAUSA: Elementos con items-center pueden estar centrando verticalmente');
}

// Verificar si hay elementos con justify-center que podrían estar centrando
if (justifyCenterElements.length > 0) {
  console.log('⚠️  POSIBLE CAUSA: Elementos con justify-center pueden estar centrando horizontalmente');
}

// Verificar si hay elementos con flex que podrían estar causando problemas
if (flexElements.length > 0) {
  console.log('⚠️  POSIBLE CAUSA: Elementos con flex pueden estar causando problemas de layout');
}

// Verificar si hay elementos con space-y que podrían estar agregando espacio
if (spaceYElements.length > 0) {
  console.log('⚠️  POSIBLE CAUSA: Elementos con space-y pueden estar agregando espacio vertical');
}

// Verificar si hay elementos con gap que podrían estar agregando espacio
if (gapElements.length > 0) {
  console.log('⚠️  POSIBLE CAUSA: Elementos con gap pueden estar agregando espacio entre elementos');
}

console.log('\n🔧 RECOMENDACIONES PARA ELIMINAR EL ESPACIO:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('1. Eliminar TODOS los elementos con items-center');
console.log('2. Eliminar TODOS los elementos con justify-center');
console.log('3. Eliminar TODOS los elementos con space-y');
console.log('4. Eliminar TODOS los elementos con gap');
console.log('5. Usar solo elementos con position: absolute o fixed');
console.log('6. Aplicar style={{ margin: 0, padding: 0 }} a TODOS los elementos');
console.log('7. Usar height: 100vh y width: 100vw en el contenedor principal');

console.log('\n🚀 Para aplicar la solución:');
console.log('1. Abrir el navegador en http://localhost:5173');
console.log('2. Abrir las herramientas de desarrollador (F12)');
console.log('3. Inspeccionar el elemento del Cuartel General');
console.log('4. Verificar qué CSS está causando el espacio');
console.log('5. Aplicar los cambios necesarios en el código'); 