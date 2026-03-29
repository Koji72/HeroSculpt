console.log('🔍 Debugging buckle state in current browser (port 5180)...');

console.log('\n📋 INSTRUCCIONES PARA VERIFICAR EL BUCKLE:');
console.log('1. Abre el navegador en http://localhost:5180');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Ejecuta los siguientes comandos uno por uno:');

console.log('\n🔍 COMANDOS PARA EJECUTAR EN LA CONSOLA:');

console.log('\n1. Verificar si hay buckle en el estado actual:');
console.log('console.log("Estado actual:", window.selectedParts);');
console.log('console.log("Buckle en estado:", window.selectedParts?.BUCKLE);');

console.log('\n2. Verificar si hay buckle en localStorage:');
console.log('const saved = localStorage.getItem("selectedParts");');
console.log('if (saved) { const parts = JSON.parse(saved); console.log("Buckle en localStorage:", parts.BUCKLE); } else { console.log("No hay datos guardados"); }');

console.log('\n3. Verificar si el buckle se está cargando en la escena:');
console.log('console.log("Modelos en escena:", window.characterViewerRef?.current?.getScene?.()?.children?.length || "No disponible");');

console.log('\n4. Verificar si hay errores de carga:');
console.log('console.log("Errores en consola:", document.querySelector(".error-message") || "No hay errores visibles");');

console.log('\n5. Verificar el filtrado de buckles:');
console.log('console.log("ALL_PARTS disponible:", typeof ALL_PARTS !== "undefined");');
console.log('if (typeof ALL_PARTS !== "undefined") { console.log("Buckles disponibles:", ALL_PARTS.filter(p => p.category === "BUCKLE").map(p => p.id)); }');

console.log('\n6. Forzar la carga del buckle si no está:');
console.log('if (!window.selectedParts?.BUCKLE) { console.log("No hay buckle, intentando asignar uno..."); }');

console.log('\n7. Verificar la categoría Buckle en el menú:');
console.log('console.log("Categorías disponibles:", document.querySelectorAll("[data-category]")?.length || "No encontradas");');

console.log('\n✅ Script de verificación completado'); 