// 🔍 CHEST BELT SUBMENU DEBUG SCRIPT
// Copiar y pegar este código en la consola del navegador

console.log('🔍 CHEST BELT SUBMENU DEBUG');
console.log('============================');

// Función para verificar qué partes aparecen en el submenú
function checkChestBeltSubmenu() {
  console.log('🔍 VERIFICANDO SUBMENÚ DE CHEST BELT:');
  
  // Verificar que la categoría esté activa
  if (activeCategory !== 'CHEST_BELT') {
    console.log('❌ Categoría CHEST_BELT no está activa');
    console.log('   Categoría actual:', activeCategory);
    console.log('   💡 Haz clic en el botón "CHEST_BELT" primero');
    return;
  }
  
  console.log('✅ Categoría CHEST_BELT está activa');
  
  // Buscar el panel de selección de partes
  const partSelectorPanel = document.querySelector('[id*="part-selector"]') || 
                           document.querySelector('.part-selector-panel') ||
                           document.querySelector('[data-testid="part-selector-panel"]');
  
  if (!partSelectorPanel) {
    console.log('❌ Panel de selección de partes no encontrado');
    return;
  }
  
  console.log('✅ Panel de selección de partes encontrado');
  
  // Buscar todas las tarjetas de partes
  const partCards = partSelectorPanel.querySelectorAll('[class*="part"], [class*="card"], button');
  
  console.log(`📋 Tarjetas de partes encontradas: ${partCards.length}`);
  
  // Analizar cada tarjeta
  const foundParts = [];
  partCards.forEach((card, index) => {
    // Buscar información de la parte
    const partName = card.querySelector('h4, .part-name, [title]')?.textContent?.trim();
    const partId = card.getAttribute('data-part-id') || 
                   card.getAttribute('id') || 
                   card.querySelector('[data-id]')?.getAttribute('data-id');
    
    if (partName || partId) {
      foundParts.push({
        index,
        name: partName || 'Sin nombre',
        id: partId || 'Sin ID',
        element: card
      });
    }
  });
  
  console.log('📋 PARTES ENCONTRADAS EN EL SUBMENÚ:');
  if (foundParts.length === 0) {
    console.log('   ❌ No se encontraron partes en el submenú');
  } else {
    foundParts.forEach((part, index) => {
      console.log(`   ${index + 1}. ${part.name} (ID: ${part.id})`);
    });
  }
  
  // Comparar con las partes definidas
  const allChestBeltParts = ALL_PARTS.filter(part => part.category === 'CHEST_BELT');
  console.log(`\n📋 PARTES DEFINIDAS EN ALL_PARTS: ${allChestBeltParts.length}`);
  
  const definedPartIds = allChestBeltParts.map(p => p.id);
  const foundPartIds = foundParts.map(p => p.id);
  
  console.log('🔍 COMPARACIÓN:');
  console.log('   Partes definidas:', definedPartIds);
  console.log('   Partes en submenú:', foundPartIds);
  
  // Verificar qué partes definidas NO están en el submenú
  const missingInSubmenu = definedPartIds.filter(id => !foundPartIds.includes(id));
  if (missingInSubmenu.length > 0) {
    console.log('❌ PARTES DEFINIDAS QUE NO APARECEN EN EL SUBMENÚ:');
    missingInSubmenu.forEach(id => {
      const part = allChestBeltParts.find(p => p.id === id);
      console.log(`   - ${id}: ${part?.name || 'Sin nombre'}`);
    });
  } else {
    console.log('✅ Todas las partes definidas aparecen en el submenú');
  }
  
  // Verificar compatibilidad
  const selectedTorso = Object.values(selectedParts || {}).find(p => p.category === 'TORSO');
  const selectedSuit = Object.values(selectedParts || {}).find(p => p.category === 'SUIT_TORSO');
  const activeTorso = selectedSuit || selectedTorso;
  
  console.log(`\n🎯 TORSO ACTIVO: ${activeTorso?.id || 'ninguno'}`);
  
  // Verificar qué partes deberían ser compatibles
  const compatibleParts = allChestBeltParts.filter(part => {
    if (part.compatible.length === 0) return true;
    if (!activeTorso) return true;
    return part.compatible.includes(activeTorso.id);
  });
  
  console.log(`✅ PARTES COMPATIBLES CON ${activeTorso?.id || 'ningún torso'}: ${compatibleParts.length}`);
  compatibleParts.forEach(part => {
    const isInSubmenu = foundPartIds.includes(part.id);
    console.log(`   ${isInSubmenu ? '✅' : '❌'} ${part.id}: ${part.name}`);
  });
  
  return {
    foundParts,
    allChestBeltParts,
    compatibleParts,
    activeTorso: activeTorso?.id
  };
}

// Función para forzar la activación de chest belt
function forceChestBeltActivation() {
  console.log('🔧 FORZANDO ACTIVACIÓN DE CHEST BELT...');
  
  // Buscar el botón de chest belt
  const chestBeltButton = document.querySelector('[id*="CHEST_BELT"]') || 
                         document.querySelector('button:contains("CHEST_BELT")') ||
                         Array.from(document.querySelectorAll('button')).find(btn => 
                           btn.textContent.includes('CHEST_BELT') || 
                           btn.id.includes('CHEST_BELT')
                         );
  
  if (chestBeltButton) {
    console.log('✅ Botón de chest belt encontrado, haciendo clic...');
    chestBeltButton.click();
    
    // Esperar un momento y verificar el submenú
    setTimeout(() => {
      console.log('🔄 Verificando submenú después del clic...');
      checkChestBeltSubmenu();
    }, 500);
  } else {
    console.log('❌ Botón de chest belt no encontrado');
    
    // Listar todos los botones disponibles
    const allButtons = document.querySelectorAll('button');
    console.log('📋 Botones disponibles:');
    allButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const id = btn.id;
      if (text || id) {
        console.log(`   ${index + 1}. "${text}" (ID: ${id})`);
      }
    });
  }
}

// Función para verificar el estado completo
function checkCompleteState() {
  console.log('🔍 VERIFICACIÓN COMPLETA DEL ESTADO:');
  
  // Verificar variables globales
  const globals = {
    ALL_PARTS: typeof ALL_PARTS !== 'undefined',
    selectedParts: typeof selectedParts !== 'undefined',
    activeCategory: typeof activeCategory !== 'undefined',
    selectedArchetype: typeof selectedArchetype !== 'undefined'
  };
  
  console.log('🌐 Variables globales:', globals);
  
  // Verificar arquetipo
  console.log('🏗️ Arquetipo seleccionado:', selectedArchetype);
  
  // Verificar partes seleccionadas
  if (selectedParts) {
    console.log('📋 Partes seleccionadas:');
    Object.entries(selectedParts).forEach(([category, part]) => {
      console.log(`   ${category}: ${part?.id || 'ninguna'}`);
    });
  }
  
  // Verificar categoría activa
  console.log('🎛️ Categoría activa:', activeCategory);
  
  // Verificar partes de chest belt en ALL_PARTS
  if (typeof ALL_PARTS !== 'undefined') {
    const chestBeltParts = ALL_PARTS.filter(part => part.category === 'CHEST_BELT');
    console.log(`📋 Partes de chest belt en ALL_PARTS: ${chestBeltParts.length}`);
  }
}

// Ejecutar verificaciones iniciales
checkCompleteState();

console.log('\n💡 COMANDOS DISPONIBLES:');
console.log('   - checkChestBeltSubmenu()');
console.log('   - forceChestBeltActivation()');
console.log('   - checkCompleteState()'); 