// 🔍 DEBUG DEL SISTEMA DE HOVER DE SÍMBOLOS - ENERO 2025
// Copiar y pegar este código en la consola del navegador

console.log('🔍 DIAGNÓSTICO DEL HOVER DE SÍMBOLOS - ENERO 2025');
console.log('============================================================');

// Verificar que tenemos acceso a las variables globales
if (typeof window.ALL_PARTS === 'undefined') {
  console.log('❌ ALL_PARTS no disponible. Asegúrate de que la app esté cargada.');
  console.log('Intenta abrir la app primero y luego ejecuta este script.');
} else {
  console.log('✅ ALL_PARTS disponible con', window.ALL_PARTS.length, 'partes');
  
  // Verificar símbolos disponibles
  const symbolParts = window.ALL_PARTS.filter(p => p.category === 'SYMBOL');
  console.log('✅ Símbolos encontrados:', symbolParts.length);
  
  // Verificar símbolos por torso
  const torsoIds = ['strong_torso_01', 'strong_torso_02', 'strong_torso_03', 'strong_torso_04', 'strong_torso_05'];
  
  torsoIds.forEach(torsoId => {
    const compatibleSymbols = symbolParts.filter(symbol => symbol.compatible.includes(torsoId));
    console.log(`   ${torsoId}: ${compatibleSymbols.length} símbolos compatibles`);
    
    if (compatibleSymbols.length > 0) {
      compatibleSymbols.forEach(symbol => {
        console.log(`     - ${symbol.id} (${symbol.name})`);
      });
    }
  });
}

// Función para simular hover de símbolos
function simulateSymbolHover(symbolId) {
  console.log(`\n🎯 Simulando hover para: ${symbolId}`);
  
  const symbol = window.ALL_PARTS?.find(p => p.id === symbolId);
  if (!symbol) {
    console.log('❌ Símbolo no encontrado');
    return;
  }
  
  console.log('✅ Símbolo encontrado:', symbol);
  
  // Simular llamada a hover
  if (window.handleHoverPreview) {
    window.handleHoverPreview(symbol);
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
    
    const selectedSymbol = window.selectedParts.SYMBOL;
    if (selectedSymbol) {
      console.log('✅ Símbolo seleccionado:', selectedSymbol.id);
    } else {
      console.log('❌ No hay símbolo seleccionado');
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

// Función para listar todos los símbolos
function listSymbolParts() {
  console.log('\n📋 TODOS LOS SÍMBOLOS DISPONIBLES:');
  console.log('-----------------------------------');
  
  const symbolParts = window.ALL_PARTS?.filter(p => p.category === 'SYMBOL') || [];
  
  symbolParts.forEach(symbol => {
    console.log(`   ${symbol.id}: ${symbol.name} - Compatible con: ${symbol.compatible.join(', ')}`);
  });
}

// Función para verificar compatibilidad
function checkSymbolCompatibility(torsoId) {
  console.log(`\n🔗 COMPATIBILIDAD PARA ${torsoId}:`);
  console.log('--------------------------------');
  
  const symbolParts = window.ALL_PARTS?.filter(p => p.category === 'SYMBOL') || [];
  const compatibleSymbols = symbolParts.filter(symbol => symbol.compatible.includes(torsoId));
  
  console.log(`✅ Símbolos compatibles: ${compatibleSymbols.length}`);
  compatibleSymbols.forEach(symbol => {
    console.log(`   - ${symbol.id} (${symbol.name})`);
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

// Función para forzar activación de símbolos
function forceSymbolActivation() {
  console.log('\n🔧 FORZANDO ACTIVACIÓN DE SÍMBOLOS:');
  console.log('-----------------------------------');
  
  // Simular selección de torso si no hay uno
  if (!window.selectedParts?.TORSO && !window.selectedParts?.SUIT_TORSO) {
    const torso01 = window.ALL_PARTS?.find(p => p.id === 'strong_torso_01');
    if (torso01) {
      console.log('✅ Forzando selección de torso 01');
      // Esto debería activar los símbolos compatibles
    }
  }
  
  // Verificar que la categoría SYMBOL esté activa
  if (window.activeCategory !== 'SYMBOL') {
    console.log('❌ Categoría SYMBOL no está activa. Haz clic en el botón SYMBOL.');
  } else {
    console.log('✅ Categoría SYMBOL está activa');
  }
}

// Función para probar hover en todos los símbolos
function testAllSymbolHovers() {
  console.log('\n🧪 PROBANDO HOVER EN TODOS LOS SÍMBOLOS:');
  console.log('----------------------------------------');
  
  const symbolParts = window.ALL_PARTS?.filter(p => p.category === 'SYMBOL') || [];
  
  symbolParts.forEach((symbol, index) => {
    setTimeout(() => {
      console.log(`🎯 Probando hover en: ${symbol.id}`);
      simulateSymbolHover(symbol);
    }, index * 1000); // Probar cada símbolo con 1 segundo de diferencia
  });
}

// Función para probar adaptación de símbolos al cambiar torso
function testSymbolAdaptation() {
  console.log('\n🔄 PROBANDO ADAPTACIÓN DE SÍMBOLOS AL CAMBIAR TORSO:');
  console.log('---------------------------------------------------');
  
  const symbolParts = window.ALL_PARTS?.filter(p => p.category === 'SYMBOL') || [];
  const torsoParts = window.ALL_PARTS?.filter(p => p.category === 'TORSO') || [];
  
  console.log(`📊 Símbolos disponibles: ${symbolParts.length}`);
  console.log(`📊 Torsos disponibles: ${torsoParts.length}`);
  
  // Probar con diferentes torsos
  torsoParts.forEach(torso => {
    const compatibleSymbols = symbolParts.filter(symbol => symbol.compatible.includes(torso.id));
    console.log(`\n🎯 ${torso.id}: ${compatibleSymbols.length} símbolos compatibles`);
    
    compatibleSymbols.forEach(symbol => {
      console.log(`   - ${symbol.id} (${symbol.name})`);
    });
  });
}

// Mostrar funciones disponibles
console.log('\n🛠️ FUNCIONES DISPONIBLES:');
console.log('-------------------------');
console.log('checkCurrentState() - Verificar estado actual');
console.log('listSymbolParts() - Listar todos los símbolos');
console.log('checkSymbolCompatibility(torsoId) - Verificar compatibilidad');
console.log('simulateSymbolHover(symbolId) - Simular hover en un símbolo');
console.log('checkHoverEvents() - Verificar eventos de hover');
console.log('forceSymbolActivation() - Forzar activación de símbolos');
console.log('testAllSymbolHovers() - Probar hover en todos los símbolos');
console.log('testSymbolAdaptation() - Probar adaptación al cambiar torso');

// Ejecutar verificación inicial
checkCurrentState();
listSymbolParts(); 