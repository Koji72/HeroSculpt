// 🔍 CHEST BELT BROWSER DEBUG SCRIPT
// Copiar y pegar este código en la consola del navegador

console.log('🔍 CHEST BELT BROWSER DEBUG');
console.log('============================');

// Verificar que ALL_PARTS existe
if (typeof ALL_PARTS === 'undefined') {
  console.log('❌ ALL_PARTS no está definido');
} else {
  console.log('✅ ALL_PARTS está definido');
  
  // Filtrar partes de chest belt
  const chestBeltParts = ALL_PARTS.filter(part => part.category === 'CHEST_BELT');
  console.log(`📋 CHEST_BELT parts encontradas: ${chestBeltParts.length}`);
  
  if (chestBeltParts.length > 0) {
    console.log('📋 IDs de chest belt:');
    chestBeltParts.forEach(part => {
      console.log(`   - ${part.id} (${part.name})`);
    });
    
    // Verificar compatibilidad con torso actual
    const selectedTorso = Object.values(selectedParts || {}).find(p => p.category === 'TORSO');
    const selectedSuit = Object.values(selectedParts || {}).find(p => p.category === 'SUIT_TORSO');
    const activeTorso = selectedSuit || selectedTorso;
    
    console.log(`🎯 Torso activo: ${activeTorso?.id || 'ninguno'}`);
    
    // Verificar compatibilidad
    const compatibleParts = chestBeltParts.filter(part => {
      if (part.compatible.length === 0) return true;
      if (!activeTorso) return true;
      return part.compatible.includes(activeTorso.id);
    });
    
    console.log(`✅ Partes compatibles: ${compatibleParts.length}`);
    compatibleParts.forEach(part => {
      console.log(`   - ${part.id}`);
    });
    
    // Verificar si el PartSelectorPanel está mostrando
    const partSelectorPanel = document.querySelector('[data-testid="part-selector-panel"]') || 
                             document.querySelector('.part-selector-panel') ||
                             document.querySelector('[id*="part-selector"]');
    
    if (partSelectorPanel) {
      console.log('✅ PartSelectorPanel está en el DOM');
    } else {
      console.log('❌ PartSelectorPanel NO está en el DOM');
    }
    
    // Verificar categoría activa
    console.log('🎛️ Categoría activa:', activeCategory);
    
    // Verificar arquetipo seleccionado
    console.log('🏗️ Arquetipo seleccionado:', selectedArchetype);
    
  } else {
    console.log('❌ No se encontraron partes de chest belt en ALL_PARTS');
  }
}

// Función para forzar la activación de chest belt
function forceChestBeltActivation() {
  console.log('🔧 Forzando activación de chest belt...');
  
  // Simular clic en el botón de chest belt
  const chestBeltButton = document.querySelector('[id*="CHEST_BELT"]') || 
                         document.querySelector('button:contains("CHEST_BELT")');
  
  if (chestBeltButton) {
    console.log('✅ Botón de chest belt encontrado, haciendo clic...');
    chestBeltButton.click();
  } else {
    console.log('❌ Botón de chest belt no encontrado');
    
    // Listar todos los botones de categoría
    const categoryButtons = document.querySelectorAll('button[id*="category"]');
    console.log('📋 Botones de categoría encontrados:');
    categoryButtons.forEach(btn => {
      console.log(`   - ${btn.id}: "${btn.textContent}"`);
    });
  }
}

// Función para verificar el estado del componente
function checkComponentState() {
  console.log('🔍 Verificando estado del componente...');
  
  // Verificar variables globales
  const globals = {
    ALL_PARTS: typeof ALL_PARTS !== 'undefined',
    selectedParts: typeof selectedParts !== 'undefined',
    activeCategory: typeof activeCategory !== 'undefined',
    selectedArchetype: typeof selectedArchetype !== 'undefined'
  };
  
  console.log('🌐 Variables globales:', globals);
  
  // Verificar elementos del DOM
  const elements = {
    categoryToolbar: !!document.querySelector('[id*="category-toolbar"]'),
    partSelectorPanel: !!document.querySelector('[id*="part-selector"]'),
    chestBeltButton: !!document.querySelector('[id*="CHEST_BELT"]')
  };
  
  console.log('🏗️ Elementos del DOM:', elements);
}

// Ejecutar verificaciones
checkComponentState();

console.log('\n💡 Para forzar la activación de chest belt, ejecuta: forceChestBeltActivation()'); 