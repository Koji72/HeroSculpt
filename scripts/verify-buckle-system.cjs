console.log('🔍 Verificando el sistema de buckle...');

console.log('\n📋 INSTRUCCIONES:');
console.log('1. Abre el navegador en http://localhost:5180');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña Console');
console.log('4. Ejecuta los siguientes comandos:');

console.log('\n🔍 COMANDOS PARA VERIFICAR EL SISTEMA:');

console.log('\n1. Verificar el build por defecto:');
console.log('console.log("DEFAULT_STRONG_BUILD:", DEFAULT_STRONG_BUILD);');
console.log('console.log("Belt en default:", DEFAULT_STRONG_BUILD.BELT?.id);');
console.log('console.log("Buckle en default:", DEFAULT_STRONG_BUILD.BUCKLE?.id);');

console.log('\n2. Verificar el estado actual:');
console.log('console.log("Estado actual:", window.selectedParts);');
console.log('console.log("Belt actual:", window.selectedParts?.BELT?.id);');
console.log('console.log("Buckle actual:", window.selectedParts?.BUCKLE?.id);');

console.log('\n3. Verificar si el buckle está en la escena:');
console.log('const scene = window.characterViewerRef?.current?.getScene?.();');
console.log('if (scene) {');
console.log('  const buckleModels = scene.children.filter(child => child.userData?.category === "BUCKLE");');
console.log('  console.log("Buckle models in scene:", buckleModels.length);');
console.log('  buckleModels.forEach((model, index) => {');
console.log('    console.log(`Buckle ${index}:`, model.name || model.userData);');
console.log('    console.log(`  - Position:`, model.position);');
console.log('    console.log(`  - Scale:`, model.scale);');
console.log('    console.log(`  - Visible:`, model.visible);');
console.log('  });');
console.log('}');

console.log('\n4. Verificar compatibilidad:');
console.log('if (window.selectedParts?.BUCKLE) {');
console.log('  console.log("Buckle compatible con:", window.selectedParts.BUCKLE.compatible);');
console.log('  console.log("Belt actual:", window.selectedParts.BELT?.id);');
console.log('  const isCompatible = window.selectedParts.BUCKLE.compatible.includes(window.selectedParts.BELT?.id);');
console.log('  console.log("¿Es compatible?:", isCompatible);');
console.log('}');

console.log('\n5. Si no hay buckle, forzar asignación:');
console.log('if (!window.selectedParts?.BUCKLE) {');
console.log('  console.log("No hay buckle, asignando uno...");');
console.log('  window.selectedParts.BUCKLE = ALL_PARTS.find(p => p.id === "strong_buckle_01");');
console.log('  console.log("Buckle asignado:", window.selectedParts.BUCKLE);');
console.log('  // Forzar recarga');
console.log('  if (window.characterViewerRef?.current?.resetState) {');
console.log('    window.characterViewerRef.current.resetState();');
console.log('  }');
console.log('}');

console.log('\n✅ Script completado'); 