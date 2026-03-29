// 🔍 CHEST BELT HOVER DEBUG SCRIPT
// Copiar y pegar este código en la consola del navegador

console.log('🔍 CHEST BELT HOVER DEBUG');
console.log('==========================');

// Función para simular hover en una parte específica
function simulateChestBeltHover(partId) {
  console.log(`🔄 Simulando hover en chest belt: ${partId}`);
  
  // Buscar la parte en ALL_PARTS
  const part = ALL_PARTS.find(p => p.id === partId && p.category === 'CHEST_BELT');
  
  if (!part) {
    console.log(`❌ Parte ${partId} no encontrada en ALL_PARTS`);
    return;
  }
  
  console.log(`✅ Parte encontrada:`, {
    id: part.id,
    name: part.name,
    category: part.category,
    compatible: part.compatible
  });
  
  // Verificar compatibilidad con torso actual
  const selectedTorso = Object.values(selectedParts || {}).find(p => p.category === 'TORSO');
  const selectedSuit = Object.values(selectedParts || {}).find(p => p.category === 'SUIT_TORSO');
  const activeTorso = selectedSuit || selectedTorso;
  
  console.log(`🎯 Torso activo: ${activeTorso?.id || 'ninguno'}`);
  
  // Verificar si es compatible
  let isCompatible = false;
  if (part.compatible.length === 0) {
    isCompatible = true;
    console.log(`✅ ${partId}: Compatible (sin restricciones)`);
  } else if (!activeTorso) {
    isCompatible = true;
    console.log(`✅ ${partId}: Compatible (sin torso)`);
  } else {
    isCompatible = part.compatible.includes(activeTorso.id);
    console.log(`${isCompatible ? '✅' : '❌'} ${partId}: Compatible con ${activeTorso.id} = ${isCompatible}`);
  }
  
  if (!isCompatible) {
    console.log(`❌ ${partId} no es compatible con el torso actual`);
    return;
  }
  
  // Simular el hover preview
  console.log(`🔄 Simulando hover preview para ${partId}...`);
  
  // Crear el estado de preview como lo hace el componente
  const hoverPreviewParts = { ...selectedParts, CHEST_BELT: part };
  
  console.log(`📋 Estado de preview creado:`, {
    originalParts: Object.keys(selectedParts || {}),
    previewParts: Object.keys(hoverPreviewParts),
    chestBeltInPreview: hoverPreviewParts.CHEST_BELT?.id
  });
  
  // Verificar si onPreviewChange está disponible
  if (typeof onPreviewChange === 'function') {
    console.log(`✅ onPreviewChange disponible, enviando preview...`);
    onPreviewChange(hoverPreviewParts);
  } else {
    console.log(`❌ onPreviewChange no está disponible`);
  }
}

// Función para listar todas las partes de chest belt disponibles
function listChestBeltParts() {
  console.log('📋 LISTANDO TODAS LAS PARTES DE CHEST BELT:');
  
  const chestBeltParts = ALL_PARTS.filter(part => part.category === 'CHEST_BELT');
  
  if (chestBeltParts.length === 0) {
    console.log('❌ No se encontraron partes de chest belt');
    return;
  }
  
  console.log(`✅ Encontradas ${chestBeltParts.length} partes de chest belt:`);
  
  chestBeltParts.forEach((part, index) => {
    console.log(`${index + 1}. ${part.id} - ${part.name}`);
    console.log(`   Compatible: [${part.compatible.join(', ')}]`);
  });
  
  return chestBeltParts;
}

// Función para verificar el estado actual
function checkCurrentState() {
  console.log('🔍 VERIFICANDO ESTADO ACTUAL:');
  
  // Verificar variables globales
  const globals = {
    ALL_PARTS: typeof ALL_PARTS !== 'undefined',
    selectedParts: typeof selectedParts !== 'undefined',
    activeCategory: typeof activeCategory !== 'undefined',
    selectedArchetype: typeof selectedArchetype !== 'undefined',
    onPreviewChange: typeof onPreviewChange === 'function'
  };
  
  console.log('🌐 Variables globales:', globals);
  
  // Verificar partes seleccionadas
  if (selectedParts) {
    console.log('📋 Partes seleccionadas actualmente:');
    Object.entries(selectedParts).forEach(([category, part]) => {
      console.log(`   ${category}: ${part?.id || 'ninguna'}`);
    });
  }
  
  // Verificar categoría activa
  console.log('🎛️ Categoría activa:', activeCategory);
  
  // Verificar arquetipo
  console.log('🏗️ Arquetipo seleccionado:', selectedArchetype);
}

// Función para probar hover en todas las partes compatibles
function testAllCompatibleChestBelts() {
  console.log('🧪 PROBANDO HOVER EN TODAS LAS PARTES COMPATIBLES:');
  
  const chestBeltParts = ALL_PARTS.filter(part => part.category === 'CHEST_BELT');
  const selectedTorso = Object.values(selectedParts || {}).find(p => p.category === 'TORSO');
  const selectedSuit = Object.values(selectedParts || {}).find(p => p.category === 'SUIT_TORSO');
  const activeTorso = selectedSuit || selectedTorso;
  
  console.log(`🎯 Torso activo: ${activeTorso?.id || 'ninguno'}`);
  
  const compatibleParts = chestBeltParts.filter(part => {
    if (part.compatible.length === 0) return true;
    if (!activeTorso) return true;
    return part.compatible.includes(activeTorso.id);
  });
  
  console.log(`✅ Partes compatibles encontradas: ${compatibleParts.length}`);
  
  compatibleParts.forEach((part, index) => {
    console.log(`${index + 1}. ${part.id} - ${part.name}`);
  });
  
  return compatibleParts;
}

// Ejecutar verificaciones iniciales
checkCurrentState();
listChestBeltParts();

console.log('\n💡 COMANDOS DISPONIBLES:');
console.log('   - simulateChestBeltHover("strong_beltchest_01_t01")');
console.log('   - testAllCompatibleChestBelts()');
console.log('   - checkCurrentState()');
console.log('   - listChestBeltParts()'); 