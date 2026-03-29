
// SCRIPT DE DEBUG PARA CHEST-BELT - Ejecutar en consola del navegador
console.log('🔍 DEBUG CHEST-BELT EN NAVEGADOR');

// Verificar estado actual
function debugChestBeltState() {
    console.log('📊 Estado del chest-belt:');
    console.log('1. Arquetipo seleccionado:', window.selectedArchetype || 'No disponible');
    console.log('2. Partes seleccionadas:', window.selectedParts || 'No disponible');
    console.log('3. Categoría activa:', window.activeCategory || 'No disponible');
    
    // Verificar si hay torso seleccionado
    const selectedParts = window.selectedParts || {};
    const torso = Object.values(selectedParts).find(p => p.category === 'TORSO');
    console.log('4. Torso seleccionado:', torso ? torso.id : 'Ninguno');
    
    // Verificar partes de chest-belt disponibles
    const chestBelts = window.ALL_PARTS?.filter(p => p.category === 'CHEST_BELT') || [];
    console.log('5. Chest-belts definidos:', chestBelts.length);
    
    if (torso) {
        const compatibleChestBelts = chestBelts.filter(cb => cb.compatible.includes(torso.id));
        console.log('6. Chest-belts compatibles con torso actual:', compatibleChestBelts.length);
        compatibleChestBelts.forEach(cb => console.log(`   - ${cb.id}`));
    }
}

// Simular hover de chest-belt
function simulateChestBeltHover(chestBeltId) {
    console.log(`🎯 Simulando hover para: ${chestBeltId}`);
    
    const part = window.ALL_PARTS?.find(p => p.id === chestBeltId);
    if (!part) {
        console.log('❌ Parte no encontrada');
        return;
    }
    
    console.log('✅ Parte encontrada:', part);
    
    // Simular llamada a hover
    if (window.handleHoverPreview) {
        window.handleHoverPreview(part);
        console.log('✅ Hover simulado');
    } else {
        console.log('❌ handleHoverPreview no disponible');
    }
}

// Probar carga de chest-belt
function testChestBeltLoad() {
    console.log('🧪 Probando carga de chest-belt...');
    
    // Seleccionar torso si no hay uno
    const selectedParts = window.selectedParts || {};
    const torso = Object.values(selectedParts).find(p => p.category === 'TORSO');
    
    if (!torso) {
        console.log('⚠️ No hay torso seleccionado. Selecciona uno primero.');
        return;
    }
    
    console.log('✅ Torso seleccionado:', torso.id);
    
    // Encontrar chest-belt compatible
    const chestBelts = window.ALL_PARTS?.filter(p => p.category === 'CHEST_BELT') || [];
    const compatibleChestBelt = chestBelts.find(cb => cb.compatible.includes(torso.id));
    
    if (compatibleChestBelt) {
        console.log('✅ Chest-belt compatible encontrado:', compatibleChestBelt.id);
        
        // Intentar aplicar
        if (window.handleSelectPart) {
            window.handleSelectPart('CHEST_BELT', compatibleChestBelt);
            console.log('✅ Chest-belt aplicado');
        } else {
            console.log('❌ handleSelectPart no disponible');
        }
    } else {
        console.log('❌ No se encontró chest-belt compatible');
    }
}

// Funciones disponibles:
console.log('📋 Funciones disponibles:');
console.log('- debugChestBeltState()');
console.log('- simulateChestBeltHover("chest_belt_id")');
console.log('- testChestBeltLoad()');
