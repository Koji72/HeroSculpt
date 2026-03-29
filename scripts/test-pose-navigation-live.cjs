#!/usr/bin/env node

/**
 * Script para probar la navegación de poses en vivo
 * 
 * Este script proporciona instrucciones para probar la funcionalidad
 * y verificar que los logs de debugging funcionan correctamente
 */

console.log('🧪 TEST EN VIVO: Navegación de poses después de modificaciones');
console.log('=' .repeat(60));

console.log('\n📋 INSTRUCCIONES DE PRUEBA:');
console.log('1. Abre la aplicación en el navegador (http://localhost:5173)');
console.log('2. Abre las DevTools (F12) y ve a la pestaña Console');
console.log('3. Asegúrate de que hay poses cargadas (deberías ver las flechas verdes)');
console.log('4. Modifica una pose añadiendo algún componente');
console.log('5. Usa las flechas verdes para navegar');
console.log('6. Observa los logs en la consola');

console.log('\n🔍 LOGS A BUSCAR:');
console.log('✅ "DEBUG - handlePreviousPose llamado" o "DEBUG - handleNextPose llamado"');
console.log('✅ "savedPoses.length: X" (debe ser > 0)');
console.log('✅ "currentPoseIndex: X" (debe ser un número válido)');
console.log('✅ "newIndex calculado: X"');
console.log('✅ "nueva pose encontrada: [nombre]"');
console.log('✅ "configuración de la nueva pose: [keys]"');
console.log('✅ "handlePreviousPose/handleNextPose completado"');

console.log('\n⚠️ LOGS DE ERROR A BUSCAR:');
console.log('❌ "No hay poses guardadas, saliendo"');
console.log('❌ "Condiciones no cumplidas para actualizar pose"');
console.log('❌ "Error updating pose configuration in database"');

console.log('\n🎯 COMPORTAMIENTO ESPERADO:');
console.log('• Al hacer click en las flechas verdes, deberías ver los logs de debug');
console.log('• El personaje debería cambiar a la pose correspondiente');
console.log('• Al volver a la pose modificada, debería mantener los cambios');
console.log('• No debería haber errores en la consola');

console.log('\n🔧 SI NO FUNCIONA:');
console.log('1. Verifica que el servidor esté corriendo: npm run dev');
console.log('2. Verifica que hay poses cargadas (flechas verdes visibles)');
console.log('3. Verifica que no hay errores en la consola');
console.log('4. Verifica que las funciones de navegación se están llamando');
console.log('5. Verifica que savedPoses.length > 0');

console.log('\n📝 COMANDOS ÚTILES:');
console.log('• Para ver el estado actual: console.log(window.appState)');
console.log('• Para forzar recarga: window.location.reload()');
console.log('• Para limpiar consola: console.clear()');

console.log('\n✨ Listo para probar! Abre la aplicación y sigue las instrucciones.'); 