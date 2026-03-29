console.log('🔍 Checking buckle state in browser...');

// Instrucciones para el usuario
console.log('\n📋 INSTRUCCIONES:');
console.log('1. Abre el navegador en http://localhost:5177');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Ejecuta los siguientes comandos:');

console.log('\n🔍 COMANDOS PARA EJECUTAR EN LA CONSOLA DEL NAVEGADOR:');

console.log('\n1. Verificar si hay buckle en el estado:');
console.log('console.log("Buckle en estado:", window.selectedParts?.BUCKLE);');

console.log('\n2. Verificar si hay buckle en localStorage:');
console.log('console.log("Buckle en localStorage:", JSON.parse(localStorage.getItem("selectedParts"))?.BUCKLE);');

console.log('\n3. Verificar si el buckle se está cargando:');
console.log('console.log("Modelos en escena:", window.characterViewerRef?.current?.getSceneInfo?.());');

console.log('\n4. Forzar la carga del buckle:');
console.log('if (window.selectedParts?.BUCKLE) { console.log("Buckle encontrado:", window.selectedParts.BUCKLE); } else { console.log("No hay buckle seleccionado"); }');

console.log('\n5. Verificar si hay errores de carga:');
console.log('console.log("Errores en consola:", document.querySelector(".error-message"));');

console.log('\n6. Verificar el filtrado de buckles:');
console.log('console.log("Buckles disponibles:", ALL_PARTS.filter(p => p.category === "BUCKLE").map(p => p.id));');

console.log('\n✅ Script de verificación completado'); 