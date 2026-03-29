// Script para debug del hover de capas - ejecutar en la consola del navegador
// Copia y pega este código en la consola del navegador mientras tienes la app abierta

console.log('🔍 DIAGNÓSTICO DEL HOVER DE CAPAS - ENERO 2025');
console.log('=' .repeat(60));

// Verificar que tenemos acceso a las variables globales
if (typeof window.ALL_PARTS === 'undefined') {
  console.log('❌ ALL_PARTS no disponible. Asegúrate de que la app esté cargada.');
  console.log('Intenta abrir la app primero y luego ejecuta este script.');
} else {
  console.log('✅ ALL_PARTS disponible con', window.ALL_PARTS.length, 'partes');
  
  // Verificar capas disponibles
  const capeparts = window.ALL_PARTS.filter(p => p.category === 'CAPE');
  console.log('✅ Capas encontradas:', capeparts.length);
  
  // Verificar capas por torso
  const torsoIds = ['strong_torso_01', 'strong_torso_02', 'strong_torso_03', 'strong_torso_04', 'strong_torso_05'];
  
  torsoIds.forEach(torsoId => {
    const compatibleCapes = capeparts.filter(cape => cape.compatible.includes(torsoId));
    console.log(`   ${torsoId}: ${compatibleCapes.length} capas compatibles`);
    
    if (compatibleCapes.length > 0) {
      compatibleCapes.forEach(cape => {
        console.log(`     - ${cape.id} (${cape.name})`);
      });
    }
  });
}

// Función para simular hover de capas
function simulateCapeHover(capeId) {
  console.log(`\n🎯 Simulando hover para: ${capeId}`);
  
  const cape = window.ALL_PARTS?.find(p => p.id === capeId);
  if (!cape) {
    console.log('❌ Capa no encontrada');
    return;
  }
  
  console.log('✅ Capa encontrada:', cape);
  
  // Simular llamada a hover
  if (window.handleHoverPreview) {
    window.handleHoverPreview(cape);
    console.log('✅ Hover simulado');
  } else {
    console.log('❌ handleHoverPreview no disponible');
  }
}

// Función para verificar el estado actual del personaje
function checkCurrentCharacterState() {
  console.log('\n📋 ESTADO ACTUAL DEL PERSONAJE:');
  
  // Intentar obtener el estado desde diferentes fuentes
  if (window.selectedParts) {
    console.log('✅ selectedParts disponible:', window.selectedParts);
  } else {
    console.log('❌ selectedParts no disponible');
  }
  
  // Verificar si hay un panel de selección abierto
  const panel = document.getElementById('part-selector-panel');
  if (panel) {
    console.log('✅ Panel de selección encontrado');
  } else {
    console.log('❌ Panel de selección no encontrado');
  }
  
  // Verificar si hay un visor 3D
  const viewer = document.querySelector('canvas');
  if (viewer) {
    console.log('✅ Visor 3D encontrado');
  } else {
    console.log('❌ Visor 3D no encontrado');
  }
}

// Función para verificar la categoría activa
function checkActiveCategory() {
  console.log('\n🎯 VERIFICANDO CATEGORÍA ACTIVA:');
  
  // Buscar botones de categoría activos
  const activeButtons = document.querySelectorAll('[class*="active"], [class*="selected"]');
  console.log('Botones activos encontrados:', activeButtons.length);
  
  activeButtons.forEach((button, index) => {
    console.log(`   ${index + 1}. ${button.textContent || button.className}`);
  });
  
  // Verificar si CAPE está seleccionado
  const capeButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent?.includes('CAPE') || btn.textContent?.includes('cape')
  );
  
  if (capeButton) {
    console.log('✅ Botón de CAPE encontrado:', capeButton.textContent);
    console.log('   - Clases:', capeButton.className);
    console.log('   - Activo:', capeButton.className.includes('active') || capeButton.className.includes('selected'));
  } else {
    console.log('❌ Botón de CAPE no encontrado');
  }
}

// Función para verificar eventos de hover
function checkHoverEvents() {
  console.log('\n🖱️ VERIFICANDO EVENTOS DE HOVER:');
  
  // Buscar elementos que tengan eventos de hover
  const hoverElements = document.querySelectorAll('[onmouseenter], [onmouseleave]');
  console.log('Elementos con eventos de hover:', hoverElements.length);
  
  // Buscar elementos de partes
  const partElements = document.querySelectorAll('[class*="part"], [class*="item"], [class*="card"]');
  console.log('Elementos de partes encontrados:', partElements.length);
  
  if (partElements.length > 0) {
    console.log('✅ Elementos de partes encontrados. Intenta hacer hover en uno de ellos.');
  } else {
    console.log('❌ No se encontraron elementos de partes. ¿Está abierto el panel de selección?');
  }
}

// Ejecutar todas las verificaciones
checkCurrentCharacterState();
checkActiveCategory();
checkHoverEvents();

console.log('\n🎯 INSTRUCCIONES PARA DEBUG:');
console.log('1. Abre el panel de selección de partes');
console.log('2. Selecciona la categoría CAPE');
console.log('3. Haz hover sobre una capa');
console.log('4. Observa los logs en la consola');
console.log('5. Si no funciona, ejecuta: simulateCapeHover("strong_cape_01_t01")');

// Hacer las funciones disponibles globalmente
window.simulateCapeHover = simulateCapeHover;
window.checkCurrentCharacterState = checkCurrentCharacterState;
window.checkActiveCategory = checkActiveCategory;
window.checkHoverEvents = checkHoverEvents;

console.log('\n✅ Funciones de debug disponibles:');
console.log('- simulateCapeHover(capeId)');
console.log('- checkCurrentCharacterState()');
console.log('- checkActiveCategory()');
console.log('- checkHoverEvents()'); 