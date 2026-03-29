console.log('🔍 Verificando el modelo del buckle...');

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Abre el navegador en http://localhost:5180');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Ejecuta los siguientes comandos:');

console.log('\n🔍 COMANDOS PARA VERIFICAR EL MODELO DEL BUCKLE:');

console.log('\n1. Verificar si el modelo se está cargando:');
console.log('console.log("Modelos en escena:", window.characterViewerRef?.current?.getScene?.()?.children?.length || "No disponible");');

console.log('\n2. Verificar si hay errores de carga:');
console.log('console.log("Errores en consola:", document.querySelector(".error-message") || "No hay errores visibles");');

console.log('\n3. Verificar si el buckle está en la escena:');
console.log('const scene = window.characterViewerRef?.current?.getScene?.();');
console.log('if (scene) {');
console.log('  const buckleModels = scene.children.filter(child => child.userData?.category === "BUCKLE");');
console.log('  console.log("Buckle models in scene:", buckleModels.length);');
console.log('  buckleModels.forEach((model, index) => {');
console.log('    console.log(`Buckle ${index}:`, model.userData);');
console.log('    console.log(`  - Position:`, model.position);');
console.log('    console.log(`  - Scale:`, model.scale);');
console.log('    console.log(`  - Visible:`, model.visible);');
console.log('    console.log(`  - Children:`, model.children.length);');
console.log('  });');
console.log('}');

console.log('\n4. Verificar si el buckle está siendo filtrado:');
console.log('console.log("ALL_PARTS disponible:", typeof ALL_PARTS !== "undefined");');
console.log('if (typeof ALL_PARTS !== "undefined") {');
console.log('  const buckles = ALL_PARTS.filter(p => p.category === "BUCKLE");');
console.log('  console.log("Buckles en ALL_PARTS:", buckles.length);');
console.log('  buckles.forEach(b => console.log(`  - ${b.id}: ${b.name}`));');
console.log('}');

console.log('\n5. Verificar si el buckle está en el estado:');
console.log('console.log("Buckle en estado:", window.selectedParts?.BUCKLE);');
console.log('if (window.selectedParts?.BUCKLE) {');
console.log('  console.log("  - ID:", window.selectedParts.BUCKLE.id);');
console.log('  console.log("  - Path:", window.selectedParts.BUCKLE.gltfPath);');
console.log('  console.log("  - Compatible:", window.selectedParts.BUCKLE.compatible);');
console.log('}');

console.log('\n6. Verificar si el belt está en el estado:');
console.log('console.log("Belt en estado:", window.selectedParts?.BELT);');
console.log('if (window.selectedParts?.BELT) {');
console.log('  console.log("  - ID:", window.selectedParts.BELT.id);');
console.log('  console.log("  - Path:", window.selectedParts.BELT.gltfPath);');
console.log('}');

console.log('\n✅ Script completado'); 