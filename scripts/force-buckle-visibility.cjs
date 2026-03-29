console.log('🔍 Forzando la visibilidad del buckle...');

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Abre el navegador en http://localhost:5180');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Ejecuta los siguientes comandos uno por uno:');

console.log('\n🔍 COMANDOS PARA FORZAR LA VISIBILIDAD DEL BUCKLE:');

console.log('\n1. Verificar el estado actual:');
console.log('console.log("Estado actual:", window.selectedParts);');

console.log('\n2. Asignar belt si no existe:');
console.log('if (!window.selectedParts?.BELT) {');
console.log('  console.log("Asignando belt...");');
console.log('  window.selectedParts = window.selectedParts || {};');
console.log('  window.selectedParts.BELT = {');
console.log('    id: "strong_belt_01",');
console.log('    name: "Strong Belt Alpha",');
console.log('    category: "BELT",');
console.log('    archetype: "STRONG",');
console.log('    gltfPath: "assets/strong/belt/strong_belt_01.glb",');
console.log('    priceUSD: 0.30,');
console.log('    compatible: [],');
console.log('    thumbnail: "https://picsum.photos/seed/strong_belt_01/100/100"');
console.log('  };');
console.log('  console.log("Belt asignado:", window.selectedParts.BELT);');
console.log('}');

console.log('\n3. Asignar buckle si no existe:');
console.log('if (!window.selectedParts?.BUCKLE) {');
console.log('  console.log("Asignando buckle...");');
console.log('  window.selectedParts.BUCKLE = {');
console.log('    id: "strong_buckle_01",');
console.log('    name: "Classic Buckle",');
console.log('    category: "BUCKLE",');
console.log('    archetype: "STRONG",');
console.log('    gltfPath: "assets/strong/buckle/strong_buckle_01.glb",');
console.log('    priceUSD: 0.10,');
console.log('    compatible: ["strong_belt_01", "strong_belt_02"],');
console.log('    thumbnail: "https://picsum.photos/seed/strong_buckle_01/100/100"');
console.log('  };');
console.log('  console.log("Buckle asignado:", window.selectedParts.BUCKLE);');
console.log('}');

console.log('\n4. Forzar recarga del modelo:');
console.log('if (window.characterViewerRef?.current?.resetState) {');
console.log('  console.log("Forzando recarga del modelo...");');
console.log('  window.characterViewerRef.current.resetState();');
console.log('}');

console.log('\n5. Verificar el resultado:');
console.log('console.log("Estado final:", window.selectedParts);');
console.log('console.log("Belt:", window.selectedParts.BELT?.id);');
console.log('console.log("Buckle:", window.selectedParts.BUCKLE?.id);');

console.log('\n6. Verificar si el buckle está en la escena:');
console.log('setTimeout(() => {');
console.log('  const scene = window.characterViewerRef?.current?.getScene?.();');
console.log('  if (scene) {');
console.log('    const buckleModels = scene.children.filter(child => child.userData?.category === "BUCKLE" || child.name?.includes("buckle"));');
console.log('    console.log("Buckle models in scene:", buckleModels.length);');
console.log('    buckleModels.forEach((model, index) => {');
console.log('      console.log(`Buckle ${index}:`, model.name || model.userData);');
console.log('      console.log(`  - Position:`, model.position);');
console.log('      console.log(`  - Scale:`, model.scale);');
console.log('      console.log(`  - Visible:`, model.visible);');
console.log('    });');
console.log('  }');
console.log('}, 2000);');

console.log('\n✅ Script completado'); 