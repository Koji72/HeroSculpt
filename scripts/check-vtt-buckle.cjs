console.log('🔍 Verificando el buckle en el modal VTT...');

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Abre el navegador en http://localhost:5180');
console.log('2. Abre el modal VTT Export (botón 🎲 VTT Export)');
console.log('3. Abre las herramientas de desarrollador (F12)');
console.log('4. Ve a la pestaña Console');
console.log('5. Ejecuta los siguientes comandos:');

console.log('\n🔍 COMANDOS PARA VERIFICAR EL BUCKLE EN VTT:');

console.log('\n1. Verificar si el buckle está en el estado:');
console.log('console.log("Buckle en estado:", window.selectedParts?.BUCKLE);');

console.log('\n2. Verificar si el buckle está en la escena del VTT:');
console.log('const vttScene = document.querySelector("[data-vtt-preview]")?.querySelector("canvas")?.__r3f?.getRootState()?.scene;');
console.log('if (vttScene) {');
console.log('  const buckleModels = vttScene.children.filter(child => child.userData?.category === "BUCKLE" || child.name?.includes("buckle"));');
console.log('  console.log("Buckle models in VTT scene:", buckleModels.length);');
console.log('  buckleModels.forEach((model, index) => {');
console.log('    console.log(`Buckle ${index}:`, model.name || model.userData);');
console.log('    console.log(`  - Position:`, model.position);');
console.log('    console.log(`  - Scale:`, model.scale);');
console.log('    console.log(`  - Visible:`, model.visible);');
console.log('  });');
console.log('} else {');
console.log('  console.log("No se encontró la escena VTT");');
console.log('}');

console.log('\n3. Verificar si hay errores de carga:');
console.log('console.log("Errores en consola:", document.querySelector(".error-message") || "No hay errores visibles");');

console.log('\n4. Forzar la asignación de buckle si no está:');
console.log('if (!window.selectedParts?.BUCKLE) {');
console.log('  console.log("No hay buckle, asignando uno...");');
console.log('  window.selectedParts.BUCKLE = { id: "strong_buckle_01", category: "BUCKLE", archetype: "STRONG", gltfPath: "assets/strong/buckle/strong_buckle_01.glb" };');
console.log('  console.log("Buckle asignado:", window.selectedParts.BUCKLE);');
console.log('  // Forzar recarga del preview');
console.log('  const updateButton = document.querySelector("[data-vtt-update]");');
console.log('  if (updateButton) updateButton.click();');
console.log('}');

console.log('\n5. Verificar si el belt está en el estado:');
console.log('console.log("Belt en estado:", window.selectedParts?.BELT);');

console.log('\n✅ Script completado'); 