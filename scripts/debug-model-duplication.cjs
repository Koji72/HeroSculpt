#!/usr/bin/env node

/**
 * 🔍 DEBUG: Model Duplication Issue
 * 
 * Este script diagnostica por qué el modelo básico aparece junto con el modelo del usuario
 * cuando el usuario está autenticado.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO: Model Duplication Issue\n');

// 1. Verificar la lógica actual en CharacterViewer.tsx
console.log('📋 1. REVISANDO LÓGICA ACTUAL EN CharacterViewer.tsx:');
console.log('   - ✅ Se agregó isAuthenticated prop');
console.log('   - ✅ Se modificó la lógica de carga de modelo básico');
console.log('   - ✅ Solo se carga modelo básico si !isAuthenticated');
console.log('   - ❌ PROBLEMA: El modelo básico sigue apareciendo');

// 2. Verificar posibles causas
console.log('\n🔍 2. POSIBLES CAUSAS DEL PROBLEMA:');

console.log('\n   A) Lógica de limpieza insuficiente:');
console.log('      - El modelGroup se limpia antes de cargar nuevas partes');
console.log('      - Pero el modelo básico se carga DESPUÉS de la limpieza');
console.log('      - Si el usuario está autenticado, NO debería cargarse el básico');

console.log('\n   B) Timing de la autenticación:');
console.log('      - isAuthenticated puede cambiar después de que se inicie la carga');
console.log('      - El useEffect puede ejecutarse antes de que isAuthenticated esté actualizado');

console.log('\n   C) Caché del modelo básico:');
console.log('      - El modelo básico puede estar en caché y no se está limpiando correctamente');
console.log('      - modelCache.getModel() puede estar retornando un modelo ya cargado');

console.log('\n   D) Múltiples llamadas a performModelLoad:');
console.log('      - Puede haber múltiples ejecuciones de performModelLoad');
console.log('      - Una con isAuthenticated=false y otra con isAuthenticated=true');

// 3. Verificar el flujo de datos
console.log('\n📊 3. FLUJO DE DATOS ESPERADO:');

console.log('\n   Usuario NO autenticado:');
console.log('   1. selectedParts = {} (vacío)');
console.log('   2. isAuthenticated = false');
console.log('   3. Cargar modelo básico (strong_base_01.glb)');
console.log('   4. Cargar partes por defecto del arquetipo');
console.log('   5. Resultado: Modelo básico + partes por defecto');

console.log('\n   Usuario autenticado:');
console.log('   1. selectedParts = {} (inicialmente vacío)');
console.log('   2. isAuthenticated = true');
console.log('   3. NO cargar modelo básico');
console.log('   4. NO cargar partes por defecto');
console.log('   5. Cargar solo las partes del usuario cuando lleguen');
console.log('   6. Resultado: Solo modelo del usuario');

// 4. Verificar el código actual
console.log('\n🔧 4. CÓDIGO ACTUAL RELEVANTE:');

const characterViewerPath = path.join(__dirname, '..', 'components', 'CharacterViewer.tsx');
if (fs.existsSync(characterViewerPath)) {
  const content = fs.readFileSync(characterViewerPath, 'utf8');
  
  // Buscar la lógica de carga del modelo básico
  const baseModelPattern = /\/\/ \✅ NUEVO: Solo cargar modelo base si el usuario NO está autenticado[\s\S]*?} else \{[\s\S]*?console\.log\('👤 Usuario autenticado - NO cargando modelo base'\);/;
  const baseModelMatch = content.match(baseModelPattern);
  
  if (baseModelMatch) {
    console.log('   ✅ Lógica de modelo básico encontrada y parece correcta');
  } else {
    console.log('   ❌ Lógica de modelo básico NO encontrada o modificada');
  }
  
  // Buscar la lógica de partes por defecto
  const defaultPartsPattern = /\/\/ \✅ NUEVO: Si selectedParts está vacío Y el usuario NO está autenticado[\s\S]*?} else if \(Object\.keys\(selectedParts\)\.length === 0 && isAuthenticated\) \{[\s\S]*?console\.log\('👤 Usuario autenticado con selectedParts vacío - NO cargando modelo básico'\);/;
  const defaultPartsMatch = content.match(defaultPartsPattern);
  
  if (defaultPartsMatch) {
    console.log('   ✅ Lógica de partes por defecto encontrada y parece correcta');
  } else {
    console.log('   ❌ Lógica de partes por defecto NO encontrada o modificada');
  }
} else {
  console.log('   ❌ No se pudo leer CharacterViewer.tsx');
}

// 5. Recomendaciones
console.log('\n💡 5. RECOMENDACIONES PARA SOLUCIONAR:');

console.log('\n   A) Agregar logs detallados:');
console.log('      - Log cuando isAuthenticated cambia');
console.log('      - Log del estado de selectedParts en cada render');
console.log('      - Log de cuándo se ejecuta performModelLoad');

console.log('\n   B) Verificar timing:');
console.log('      - Asegurar que isAuthenticated se actualiza antes de performModelLoad');
console.log('      - Usar useEffect con dependencias correctas');

console.log('\n   C) Limpieza adicional:');
console.log('      - Limpiar el caché del modelo básico cuando el usuario se autentica');
console.log('      - Forzar re-render del CharacterViewer cuando cambia isAuthenticated');

console.log('\n   D) Debug en tiempo real:');
console.log('      - Agregar console.log en el navegador para ver el flujo real');
console.log('      - Verificar que isAuthenticated tiene el valor correcto');

console.log('\n🎯 6. PRÓXIMOS PASOS:');
console.log('   1. Agregar logs detallados en CharacterViewer.tsx');
console.log('   2. Verificar el timing de isAuthenticated');
console.log('   3. Probar la aplicación y revisar logs en consola');
console.log('   4. Identificar exactamente cuándo se carga el modelo básico');

console.log('\n✅ DIAGNÓSTICO COMPLETADO'); 