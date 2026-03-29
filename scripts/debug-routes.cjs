#!/usr/bin/env node

/**
 * 🔍 DEBUG RUTAS: Verificar cada ruta una por una
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG DE RUTAS - VERIFICACIÓN UNA POR UNA\n');

// 1. Verificar App.tsx
console.log('1️⃣ VERIFICANDO src/App.tsx:');
const appPath = path.join(__dirname, '../src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

const hasUseLocation = appContent.includes('useLocation');
const hasHeadquartersCheck = appContent.includes('location.pathname === \'/headquarters\'');
const hasLaboratoryRoute = appContent.includes('path="/laboratory"');
const hasCustomizerWrapperRoute = appContent.includes('path="/"');

console.log(`   ✅ useLocation importado: ${hasUseLocation}`);
console.log(`   ✅ Verificación headquarters: ${hasHeadquartersCheck}`);
console.log(`   ✅ Ruta /laboratory: ${hasLaboratoryRoute}`);
console.log(`   ✅ Ruta / (inicio): ${hasCustomizerWrapperRoute}`);

// 2. Verificar Laboratory.tsx
console.log('\n2️⃣ VERIFICANDO src/pages/Laboratory.tsx:');
const labPath = path.join(__dirname, '../src/pages/Laboratory.tsx');
const labContent = fs.readFileSync(labPath, 'utf8');

const labImportsCustomizer = labContent.includes('MainCustomizer');
const labRendersCustomizer = labContent.includes('<MainCustomizer />');
const labIsSimple = labContent.split('\n').length < 30;

console.log(`   ✅ Importa MainCustomizer: ${labImportsCustomizer}`);
console.log(`   ✅ Renderiza MainCustomizer: ${labRendersCustomizer}`);
console.log(`   ✅ Es simple (< 30 líneas): ${labIsSimple}`);

// 3. Verificar Headquarters.tsx
console.log('\n3️⃣ VERIFICANDO src/pages/Headquarters.tsx:');
const hqPath = path.join(__dirname, '../src/pages/Headquarters.tsx');
const hqContent = fs.readFileSync(hqPath, 'utf8');

const hqHasDashboard = hqContent.includes('SUPERHERO HQ') || hqContent.includes('M&M DASHBOARD');
const hqIsLarge = hqContent.split('\n').length > 100;

console.log(`   ✅ Contiene dashboard: ${hqHasDashboard}`);
console.log(`   ✅ Es archivo grande (> 100 líneas): ${hqIsLarge}`);

// 4. Verificar imports en App.tsx
console.log('\n4️⃣ VERIFICANDO IMPORTS EN src/App.tsx:');
const hasLabImport = appContent.includes('import Laboratory from');
const hasHqImport = appContent.includes('import HeadquartersPage from');

console.log(`   ✅ Importa Laboratory: ${hasLabImport}`);
console.log(`   ✅ Importa HeadquartersPage: ${hasHqImport}`);

// 5. Verificar navegación
console.log('\n5️⃣ VERIFICANDO NAVEGACIÓN:');
const navPath = path.join(__dirname, '../src/components/Navigation.tsx');
if (fs.existsSync(navPath)) {
  const navContent = fs.readFileSync(navPath, 'utf8');
  const hasLabLink = navContent.includes('/laboratory') || navContent.includes('Laboratory');
  console.log(`   ✅ Navigation tiene link a Laboratory: ${hasLabLink}`);
} else {
  console.log(`   ❌ Navigation.tsx no encontrado`);
}

console.log('\n📋 RESUMEN DE DEBUG:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const allChecks = [
  hasUseLocation,
  hasHeadquartersCheck,
  hasLaboratoryRoute,
  hasCustomizerWrapperRoute,
  labImportsCustomizer,
  labRendersCustomizer,
  hasLabImport,
  hasHqImport
];

const passedChecks = allChecks.filter(check => check).length;

console.log(`✅ Verificaciones exitosas: ${passedChecks}/${allChecks.length}`);

if (passedChecks === allChecks.length) {
  console.log('\n🎯 DIAGNÓSTICO: La configuración parece correcta');
  console.log('💡 PROBLEMA POSIBLE: Hay un bug en la lógica de routing');
  console.log('🔧 SOLUCIÓN: Revisar la lógica condicional en AppContent');
} else {
  console.log('\n⚠️ DIAGNÓSTICO: Hay problemas de configuración');
  console.log('🔧 SOLUCIÓN: Corregir los checks que fallaron');
}

console.log('\n🌐 RUTAS PARA PROBAR:');
console.log('🏠 Inicio: http://localhost:5178/');
console.log('🧪 Laboratory: http://localhost:5178/laboratory');
console.log('🏛️ Headquarters: http://localhost:5178/headquarters');
console.log('\n💡 CONSEJO: Abre DevTools y revisa los console.log para ver qué ruta se detecta');