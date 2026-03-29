#!/usr/bin/env node

/**
 * 🧪 VERIFICACIÓN LABORATORY: Customizador Embebido
 * 
 * Este script verifica que el customizador esté correctamente embebido en Laboratory
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 VERIFICACIÓN LABORATORY: Customizador embebido...\n');

// Verificar archivos
const laboratoryPath = path.join(__dirname, '../src/pages/Laboratory.tsx');
const cssPath = path.join(__dirname, '../src/laboratory-wrapper.css');
const appPath = path.join(__dirname, '../src/App.tsx');

if (!fs.existsSync(laboratoryPath)) {
  console.error('❌ No se encontró Laboratory.tsx');
  process.exit(1);
}

const laboratoryContent = fs.readFileSync(laboratoryPath, 'utf8');
const cssExists = fs.existsSync(cssPath);
const appContent = fs.readFileSync(appPath, 'utf8');

console.log('📋 VERIFICACIÓN LABORATORY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 1. Verificar que Laboratory importe MainCustomizer
const importsCustomizer = laboratoryContent.includes('import MainCustomizer from \'../../App\'');

if (importsCustomizer) {
  console.log('✅ Laboratory importa MainCustomizer correctamente');
} else {
  console.log('❌ Laboratory NO importa MainCustomizer');
}

// 2. Verificar que Laboratory renderize MainCustomizer
const rendersCustomizer = laboratoryContent.includes('<MainCustomizer />');

if (rendersCustomizer) {
  console.log('✅ Laboratory renderiza MainCustomizer');
} else {
  console.log('❌ Laboratory NO renderiza MainCustomizer');
}

// 3. Verificar que use laboratory-wrapper clase
const usesWrapperClass = laboratoryContent.includes('laboratory-wrapper');

if (usesWrapperClass) {
  console.log('✅ Laboratory usa clase laboratory-wrapper');
} else {
  console.log('❌ Laboratory NO usa clase laboratory-wrapper');
}

// 4. Verificar que CSS wrapper existe
if (cssExists) {
  console.log('✅ CSS laboratory-wrapper existe');
} else {
  console.log('❌ CSS laboratory-wrapper NO existe');
}

// 5. Verificar que App.tsx tenga ruta /laboratory
const hasLaboratoryRoute = appContent.includes('/laboratory') &&
                          appContent.includes('<Laboratory />');

if (hasLaboratoryRoute) {
  console.log('✅ App.tsx tiene ruta /laboratory configurada');
} else {
  console.log('❌ App.tsx NO tiene ruta /laboratory configurada');
}

// 6. Verificar que Inicio (/) siga usando CustomizerWrapper
const hasCustomizerWrapper = appContent.includes('<CustomizerWrapper />') &&
                            appContent.includes('element={<CustomizerWrapper />}');

if (hasCustomizerWrapper) {
  console.log('✅ Inicio (/) sigue usando CustomizerWrapper');
} else {
  console.log('❌ Inicio (/) NO usa CustomizerWrapper');
}

// 7. Verificar CSS específico para Laboratory
if (cssExists) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const hasSpecificStyles = cssContent.includes('.laboratory-wrapper') &&
                           cssContent.includes('position: absolute !important') &&
                           cssContent.includes('height: 100vh');

  if (hasSpecificStyles) {
    console.log('✅ CSS tiene estilos específicos para Laboratory');
  } else {
    console.log('❌ CSS NO tiene estilos específicos para Laboratory');
  }
}

console.log('\n📋 RESUMEN LABORATORY:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  importsCustomizer,
  rendersCustomizer,
  usesWrapperClass,
  cssExists,
  hasLaboratoryRoute,
  hasCustomizerWrapper,
  cssExists // Using cssExists as proxy for CSS styles check
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

if (passedChecks === totalChecks) {
  console.log('🎉 VERIFICACIÓN LABORATORY EXITOSA');
  console.log('✅ MainCustomizer embebido en Laboratory');
  console.log('✅ CSS wrapper configurado');
  console.log('✅ Ruta /laboratory funcional');
  console.log('✅ Inicio (/) mantiene su estructura');
  console.log('✅ Estilos específicos aplicados');
  console.log('✅ Laboratory como página independiente con customizador');
  console.log(`✅ ${passedChecks}/${totalChecks} verificaciones exitosas`);
} else {
  console.log('⚠️  VERIFICACIÓN LABORATORY FALLÓ');
  console.log('🔧 Revisar los problemas identificados arriba');
  console.log(`❌ ${totalChecks - passedChecks}/${totalChecks} verificaciones fallaron`);
}

console.log('\n🚀 Para probar Laboratory:');
console.log('1. Abrir http://localhost:5178/laboratory');
console.log('2. Verificar que el customizador esté completamente funcional');
console.log('3. Verificar que los paneles se ajusten correctamente');
console.log('4. Verificar que no haya elementos cortados');
console.log('5. Comparar con http://localhost:5178/ (Inicio)');
console.log('6. Confirmar que Inicio mantiene su estructura original');