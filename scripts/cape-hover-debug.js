// 🔍 DEBUG DEL SISTEMA DE HOVER DE CAPAS - ENERO 2025
// Copiar y pegar este código en la consola del navegador

console.log('🔍 DIAGNÓSTICO DEL HOVER DE CAPAS - ENERO 2025');
console.log('============================================================');

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

// Función para verificar estado actual
function checkCurrentState() {
  console.log('\n📊 ESTADO ACTUAL:');
  console.log('------------------');
  
  if (window.selectedParts) {
    console.log('✅ Partes seleccionadas:', Object.keys(window.selectedParts));
    
    const selectedTorso = window.selectedParts.TORSO || window.selectedParts.SUIT_TORSO;
    if (selectedTorso) {
      console.log('✅ Torso seleccionado:', selectedTorso.id);
    } else {
      console.log('❌ No hay torso seleccionado');
    }
    
    const selectedCape = window.selectedParts.CAPE;
    if (selectedCape) {
      console.log('✅ Capa seleccionada:', selectedCape.id);
    } else {
      console.log('❌ No hay capa seleccionada');
    }
  } else {
    console.log('❌ selectedParts no disponible');
  }
  
  if (window.activeCategory) {
    console.log('✅ Categoría activa:', window.activeCategory);
  } else {
    console.log('❌ No hay categoría activa');
  }
}

// Función para listar todas las capas
function listCapeParts() {
  console.log('\n📋 TODAS LAS CAPAS DISPONIBLES:');
  console.log('--------------------------------');
  
  const capeparts = window.ALL_PARTS?.filter(p => p.category === 'CAPE') || [];
  
  capeparts.forEach(cape => {
    console.log(`   ${cape.id}: ${cape.name} - Compatible con: ${cape.compatible.join(', ')}`);
  });
}

// Función para verificar compatibilidad
function checkCapeCompatibility(torsoId) {
  console.log(`\n🔗 COMPATIBILIDAD PARA ${torsoId}:`);
  console.log('--------------------------------');
  
  const capeparts = window.ALL_PARTS?.filter(p => p.category === 'CAPE') || [];
  const compatibleCapes = capeparts.filter(cape => cape.compatible.includes(torsoId));
  
  console.log(`✅ Capas compatibles: ${compatibleCapes.length}`);
  compatibleCapes.forEach(cape => {
    console.log(`   - ${cape.id} (${cape.name})`);
  });
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

// Función para forzar activación de capas
function forceCapeActivation() {
  console.log('\n🔧 FORZANDO ACTIVACIÓN DE CAPAS:');
  console.log('--------------------------------');
  
  // Simular selección de torso si no hay uno
  if (!window.selectedParts?.TORSO && !window.selectedParts?.SUIT_TORSO) {
    const torso01 = window.ALL_PARTS?.find(p => p.id === 'strong_torso_01');
    if (torso01) {
      console.log('✅ Forzando selección de torso 01');
      // Esto debería activar las capas compatibles
    }
  }
  
  // Verificar que la categoría CAPE esté activa
  if (window.activeCategory !== 'CAPE') {
    console.log('❌ Categoría CAPE no está activa. Haz clic en el botón CAPE.');
  } else {
    console.log('✅ Categoría CAPE está activa');
  }
}

// Función para probar hover en todas las capas
function testAllCapeHovers() {
  console.log('\n🧪 PROBANDO HOVER EN TODAS LAS CAPAS:');
  console.log('-------------------------------------');
  
  const capeparts = window.ALL_PARTS?.filter(p => p.category === 'CAPE') || [];
  
  capeparts.forEach((cape, index) => {
    setTimeout(() => {
      console.log(`🎯 Probando hover en: ${cape.id}`);
      simulateCapeHover(cape);
    }, index * 1000); // Probar cada capa con 1 segundo de diferencia
  });
}

// Mostrar funciones disponibles
console.log('\n🛠️ FUNCIONES DISPONIBLES:');
console.log('-------------------------');
console.log('checkCurrentState() - Verificar estado actual');
console.log('listCapeParts() - Listar todas las capas');
console.log('checkCapeCompatibility(torsoId) - Verificar compatibilidad');
console.log('simulateCapeHover(capeId) - Simular hover en una capa');
console.log('checkHoverEvents() - Verificar eventos de hover');
console.log('forceCapeActivation() - Forzar activación de capas');
console.log('testAllCapeHovers() - Probar hover en todas las capas');

// Ejecutar verificación inicial
checkCurrentState();
listCapeParts(); 