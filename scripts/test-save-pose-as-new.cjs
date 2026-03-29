#!/usr/bin/env node

/**
 * Script para probar la funcionalidad de guardar pose como nueva
 * 
 * Este script verifica que puedes convertir una pose de compra en una pose guardada
 * y luego modificarla sin problemas
 */

console.log('🧪 TEST: Guardar pose como nueva');
console.log('=' .repeat(40));

console.log('\n📋 ESCENARIO DE PRUEBA:');
console.log('1. Tienes una pose de compra con un martillo');
console.log('2. Haces click en el botón "💾 Guardar"');
console.log('3. Se crea una nueva pose guardada');
console.log('4. Modificas la nueva pose (cambias martillo por pistola)');
console.log('5. Navegas con las flechas verdes');
console.log('6. Vuelves a la pose modificada');
console.log('7. Verificas que mantiene la pistola');

console.log('\n🔍 LOGS A BUSCAR EN LA CONSOLA:');
console.log('✅ "DEBUG - handleSaveCurrentPoseAsNew llamado"');
console.log('✅ "Nueva configuración creada: [ID]"');
console.log('✅ "Pose convertida a guardada"');
console.log('✅ "DEBUG - loadUserPoses llamado" (después de guardar)');
console.log('✅ "Poses guardadas: X" (debe ser > 0)');
console.log('✅ "configuración detectada como cambiada, actualizando..."');
console.log('✅ "pose actualizada en base de datos"');

console.log('\n⚠️ LOGS DE PROBLEMA A BUSCAR:');
console.log('❌ "Usuario no autenticado"');
console.log('❌ "Error saving current pose as new"');
console.log('❌ "Poses guardadas: 0" (después de guardar)');

console.log('\n🎯 COMPORTAMIENTO ESPERADO:');
console.log('• Deberías ver el botón "💾 Guardar" en poses de compra');
console.log('• Al hacer click, debería crear una nueva pose guardada');
console.log('• La nueva pose debería aparecer en la lista');
console.log('• Deberías poder modificar la nueva pose');
console.log('• Los cambios deberían persistir al navegar');

console.log('\n🔧 PASOS DE PRUEBA:');
console.log('1. Abre la aplicación (http://localhost:5178)');
console.log('2. Abre DevTools (F12) y ve a Console');
console.log('3. Navega a una pose de compra (deberías ver el botón "💾 Guardar")');
console.log('4. Haz click en "💾 Guardar"');
console.log('5. Verifica los logs de creación');
console.log('6. Modifica la nueva pose (cambia un componente)');
console.log('7. Navega con las flechas y vuelve');
console.log('8. Verifica que mantiene los cambios');

console.log('\n📝 VERIFICACIONES ADICIONALES:');
console.log('• Verifica que el botón solo aparece en poses de compra');
console.log('• Verifica que la nueva pose aparece en la biblioteca del usuario');
console.log('• Verifica que puedes renombrar la nueva pose');
console.log('• Verifica que los cambios se guardan en la base de datos');

console.log('\n🚀 SI NO FUNCIONA:');
console.log('1. Verifica que el usuario está autenticado');
console.log('2. Verifica que no hay errores en la consola');
console.log('3. Verifica que la base de datos está funcionando');
console.log('4. Verifica que el botón aparece en poses de compra');

console.log('\n✨ Listo para probar! Sigue los pasos y verifica los logs.'); 