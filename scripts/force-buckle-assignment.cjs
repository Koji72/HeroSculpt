console.log('🔍 Script para forzar la asignación de buckle...');

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Abre el navegador en http://localhost:5180');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Ejecuta los siguientes comandos:');

console.log('\n🔍 COMANDOS PARA FORZAR LA ASIGNACIÓN DE BUCKLE:');

console.log('\n1. Verificar el estado actual:');
console.log('console.log("Estado actual:", window.selectedParts);');

console.log('\n2. Si no hay belt, asignar uno:');
console.log('if (!window.selectedParts?.BELT) {');
console.log('  console.log("No hay belt, asignando uno...");');
console.log('  window.selectedParts = window.selectedParts || {};');
console.log('  window.selectedParts.BELT = { id: "strong_belt_01", category: "BELT", archetype: "STRONG", gltfPath: "assets/strong/belt/strong_belt_01.glb" };');
console.log('  console.log("Belt asignado:", window.selectedParts.BELT);');
console.log('}');

console.log('\n3. Si no hay buckle, asignar uno:');
console.log('if (!window.selectedParts?.BUCKLE) {');
console.log('  console.log("No hay buckle, asignando uno...");');
console.log('  window.selectedParts.BUCKLE = { id: "strong_buckle_01", category: "BUCKLE", archetype: "STRONG", gltfPath: "assets/strong/buckle/strong_buckle_01.glb" };');
console.log('  console.log("Buckle asignado:", window.selectedParts.BUCKLE);');
console.log('}');

console.log('\n4. Forzar la recarga del modelo:');
console.log('if (window.characterViewerRef?.current?.resetState) {');
console.log('  console.log("Forzando recarga del modelo...");');
console.log('  window.characterViewerRef.current.resetState();');
console.log('}');

console.log('\n5. Verificar el resultado:');
console.log('console.log("Estado final:", window.selectedParts);');
console.log('console.log("Belt:", window.selectedParts.BELT?.id);');
console.log('console.log("Buckle:", window.selectedParts.BUCKLE?.id);');

console.log('\n✅ Script completado'); 