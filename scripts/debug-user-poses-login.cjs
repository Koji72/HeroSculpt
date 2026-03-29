#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG: Verificando poses del usuario después del login...\n');

// Simular la lógica de loadSessionOnAuthChange
console.log('📋 Simulación de loadSessionOnAuthChange:');
console.log('1. Usuario se autentica');
console.log('2. Se carga arquetipo de sesión guardada');
console.log('3. Se llama a loadUserPoses()');
console.log('4. loadUserPoses debería cargar poses del usuario\n');

// Simular la lógica de loadUserPoses
console.log('📋 Simulación de loadUserPoses:');
console.log('- Verificar si usuario está autenticado');
console.log('- Cargar compras del usuario desde PurchaseHistoryService');
console.log('- Cargar configuraciones guardadas desde UserConfigService');
console.log('- Combinar poses de compras y configuraciones');
console.log('- Aplicar última pose del usuario\n');

// Verificar servicios
console.log('🔍 Verificando servicios:');

// Verificar PurchaseHistoryService
const purchaseHistoryPath = path.join(__dirname, '..', 'services', 'purchaseHistoryService.ts');
console.log('📁 PurchaseHistoryService existe:', fs.existsSync(purchaseHistoryPath) ? '✅' : '❌');

// Verificar UserConfigService
const userConfigPath = path.join(__dirname, '..', 'services', 'userConfigService.ts');
console.log('📁 UserConfigService existe:', fs.existsSync(userConfigPath) ? '✅' : '❌');

// Verificar SessionStorageService
const sessionStoragePath = path.join(__dirname, '..', 'services', 'sessionStorageService.ts');
console.log('📁 SessionStorageService existe:', fs.existsSync(sessionStoragePath) ? '✅' : '❌');

console.log('\n🔍 Verificando lógica de loadUserPoses en App.tsx:');

// Leer App.tsx para verificar la lógica
const appPath = path.join(__dirname, '..', 'App.tsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  
  // Buscar loadUserPoses
  const loadUserPosesMatch = appContent.match(/const loadUserPoses = useCallback\(async \(\) => \{[\s\S]*?\}, \[.*?\]\);/);
  if (loadUserPosesMatch) {
    console.log('✅ Función loadUserPoses encontrada');
    
    // Verificar si llama a PurchaseHistoryService
    const hasPurchaseHistory = loadUserPosesMatch[0].includes('PurchaseHistoryService.getUserPurchases');
    console.log('✅ Llama a PurchaseHistoryService:', hasPurchaseHistory ? '✅' : '❌');
    
    // Verificar si llama a UserConfigService
    const hasUserConfig = loadUserPosesMatch[0].includes('UserConfigService.getUserConfigurations');
    console.log('✅ Llama a UserConfigService:', hasUserConfig ? '✅' : '❌');
    
    // Verificar si aplica la última pose
    const hasLastPose = loadUserPosesMatch[0].includes('getUserLastPose');
    console.log('✅ Aplica última pose del usuario:', hasLastPose ? '✅' : '❌');
    
  } else {
    console.log('❌ Función loadUserPoses NO encontrada');
  }
  
  // Buscar loadSessionOnAuthChange
  const loadSessionMatch = appContent.match(/const loadSessionOnAuthChange = async \(\) => \{[\s\S]*?\};/);
  if (loadSessionMatch) {
    console.log('✅ Función loadSessionOnAuthChange encontrada');
    
    // Verificar si llama a loadUserPoses
    const callsLoadUserPoses = loadSessionMatch[0].includes('loadUserPoses()');
    console.log('✅ Llama a loadUserPoses:', callsLoadUserPoses ? '✅' : '❌');
    
    // Verificar si carga partes de la sesión
    const loadsSessionParts = loadSessionMatch[0].includes('setSelectedParts(savedSession.selectedParts)');
    console.log('❌ Carga partes de sesión (debería ser NO):', loadsSessionParts ? '❌' : '✅');
    
  } else {
    console.log('❌ Función loadSessionOnAuthChange NO encontrada');
  }
  
} else {
  console.log('❌ App.tsx no encontrado');
}

console.log('\n🎯 Posibles problemas:');
console.log('1. ❌ loadUserPoses no se está ejecutando');
console.log('2. ❌ Los servicios no están devolviendo datos');
console.log('3. ❌ La última pose no se está aplicando correctamente');
console.log('4. ❌ Hay un error en la lógica de combinación de poses');
console.log('5. ❌ El estado no se está actualizando correctamente');

console.log('\n🔧 Soluciones a verificar:');
console.log('1. Abrir consola del navegador y verificar logs de loadUserPoses');
console.log('2. Verificar que los servicios devuelven datos correctamente');
console.log('3. Verificar que la última pose se aplica sin errores');
console.log('4. Verificar que el estado se actualiza correctamente'); 