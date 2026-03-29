#!/usr/bin/env node

/**
 * 🔍 DEBUG: Authentication Timing Issue
 * 
 * Este script diagnostica específicamente el problema de timing entre
 * la autenticación y la carga del modelo básico.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO: Authentication Timing Issue\n');

// 1. Verificar el flujo de autenticación
console.log('📋 1. FLUJO DE AUTENTICACIÓN:');
console.log('   - useAuth hook detecta cambios de sesión');
console.log('   - isAuthenticated se actualiza en App.tsx');
console.log('   - CharacterViewer recibe isAuthenticated como prop');
console.log('   - useEffect en CharacterViewer se ejecuta cuando cambia isAuthenticated');

// 2. Verificar el problema específico
console.log('\n🔍 2. PROBLEMA ESPECÍFICO:');
console.log('   - El modelo básico aparece junto con el modelo del usuario');
console.log('   - Esto sugiere que se están cargando AMBOS modelos');
console.log('   - Posible causa: Múltiples ejecuciones de performModelLoad');

// 3. Verificar el código actual
console.log('\n🔧 3. VERIFICANDO CÓDIGO ACTUAL:');

const characterViewerPath = path.join(__dirname, '..', 'components', 'CharacterViewer.tsx');
if (fs.existsSync(characterViewerPath)) {
  const content = fs.readFileSync(characterViewerPath, 'utf8');
  
  // Verificar si isAuthenticated está en las dependencias del useEffect
  const useEffectPattern = /useEffect\(\(\) => \{[\s\S]*?\}, \[([^\]]+)\]\);/g;
  const useEffectMatches = content.match(useEffectPattern);
  
  if (useEffectMatches) {
    console.log('   ✅ useEffect encontrado');
    useEffectMatches.forEach((match, index) => {
      const depsMatch = match.match(/\[([^\]]+)\]/);
      if (depsMatch) {
        const deps = depsMatch[1];
        if (deps.includes('isAuthenticated')) {
          console.log(`   ✅ useEffect ${index + 1}: isAuthenticated está en dependencias`);
        } else {
          console.log(`   ❌ useEffect ${index + 1}: isAuthenticated NO está en dependencias`);
        }
      }
    });
  } else {
    console.log('   ❌ No se encontraron useEffect');
  }
  
  // Verificar la lógica de carga del modelo básico
  const baseModelLogic = content.includes('if (!isAuthenticated) {');
  if (baseModelLogic) {
    console.log('   ✅ Lógica de modelo básico condicionada por isAuthenticated');
  } else {
    console.log('   ❌ Lógica de modelo básico NO está condicionada por isAuthenticated');
  }
  
  // Verificar logs de debug
  const debugLogs = content.includes('console.log(\'🔐 Estado de autenticación:\'');
  if (debugLogs) {
    console.log('   ✅ Logs de debug de autenticación agregados');
  } else {
    console.log('   ❌ Logs de debug de autenticación NO encontrados');
  }
  
} else {
  console.log('   ❌ No se pudo leer CharacterViewer.tsx');
}

// 4. Posibles soluciones
console.log('\n💡 4. POSIBLES SOLUCIONES:');

console.log('\n   A) Forzar limpieza completa:');
console.log('      - Limpiar modelGroup completamente antes de cada carga');
console.log('      - Limpiar caché del modelo básico');
console.log('      - Forzar re-render del CharacterViewer');

console.log('\n   B) Mejorar el timing:');
console.log('      - Usar useLayoutEffect en lugar de useEffect');
console.log('      - Agregar delay antes de cargar modelos');
console.log('      - Verificar que isAuthenticated esté estable antes de cargar');

console.log('\n   C) Lógica más estricta:');
console.log('      - Solo cargar modelo básico si selectedParts está vacío Y !isAuthenticated');
console.log('      - No cargar modelo básico si hay cualquier parte seleccionada');
console.log('      - Limpiar modelo básico cuando el usuario se autentica');

console.log('\n   D) Debug en tiempo real:');
console.log('      - Agregar más logs para rastrear el flujo');
console.log('      - Verificar el orden de ejecución');
console.log('      - Identificar cuándo se carga cada modelo');

// 5. Próximos pasos
console.log('\n🎯 5. PRÓXIMOS PASOS:');
console.log('   1. Agregar logs más detallados en performModelLoad');
console.log('   2. Verificar si hay múltiples ejecuciones');
console.log('   3. Implementar limpieza más agresiva del modelGroup');
console.log('   4. Probar con useLayoutEffect en lugar de useEffect');
console.log('   5. Verificar el caché del modelo básico');

console.log('\n✅ DIAGNÓSTICO COMPLETADO'); 