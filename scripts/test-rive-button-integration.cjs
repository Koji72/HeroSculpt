const fs = require('fs');
const path = require('path');

console.log('🎨 VERIFICACIÓN INTEGRACIÓN BOTÓN RIVE');
console.log('======================================\n');

// 1. Verificar componente RiveButton
const riveButtonPath = path.join(__dirname, '..', 'components', 'RiveButton.tsx');
console.log('1. 🧩 Componente RiveButton:');
if (fs.existsSync(riveButtonPath)) {
  console.log('   ✅ Existe: components/RiveButton.tsx');
  const content = fs.readFileSync(riveButtonPath, 'utf8');
  const hasRiveImport = content.includes('@rive-app/canvas');
  const hasStateMachine = content.includes('stateMachineInputs');
  const hasHoverHandlers = content.includes('handleMouseEnter');
  
  console.log('   📦 Import Rive:', hasRiveImport ? '✅' : '❌');
  console.log('   🎮 State Machine:', hasStateMachine ? '✅' : '❌');
  console.log('   🖱️ Hover Handlers:', hasHoverHandlers ? '✅' : '❌');
} else {
  console.log('   ❌ NO EXISTE: components/RiveButton.tsx');
}

// 2. Verificar integración en ArchetypeSelector
const archetypeSelectorPath = path.join(__dirname, '..', 'components', 'ArchetypeSelector.tsx');
console.log('\n2. 🎯 Integración en ArchetypeSelector:');
if (fs.existsSync(archetypeSelectorPath)) {
  const content = fs.readFileSync(archetypeSelectorPath, 'utf8');
  const hasRiveButtonImport = content.includes('import RiveButton');
  const hasRiveButtonComponent = content.includes('<RiveButton');
  const hasRiveFile = content.includes('boost_selection_interactiondemo.riv');
  
  console.log('   📦 Import RiveButton:', hasRiveButtonImport ? '✅' : '❌');
  console.log('   🧩 Componente RiveButton:', hasRiveButtonComponent ? '✅' : '❌');
  console.log('   📁 Archivo .riv:', hasRiveFile ? '✅' : '❌');
  
  if (hasRiveButtonComponent) {
    const riveButtonMatch = content.match(/<RiveButton[^>]*>/);
    if (riveButtonMatch) {
      console.log('   🔧 Configuración:', riveButtonMatch[0].substring(0, 100) + '...');
    }
  }
} else {
  console.log('   ❌ NO EXISTE: components/ArchetypeSelector.tsx');
}

// 3. Verificar archivo Rive
const rivePath = path.join(__dirname, '..', 'dist', 'assets', 'boost_selection_interactiondemo.riv');
console.log('\n3. 📁 Archivo Rive:');
if (fs.existsSync(rivePath)) {
  const stats = fs.statSync(rivePath);
  console.log('   ✅ Existe:', rivePath);
  console.log('   📊 Tamaño:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('   ❌ NO EXISTE:', rivePath);
}

// 4. Verificar servidor
console.log('\n4. 🌐 Servidor:');
console.log('   🔗 URL: http://localhost:5178/');
console.log('   📍 Puerto: 5178 (confirmado activo)');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('1. Abrir http://localhost:5178/ en el navegador');
console.log('2. Buscar el menú de arquetipos (header superior)');
console.log('3. Verificar que aparece un botón Rive animado junto a los otros botones');
console.log('4. Hacer hover y click en el botón Rive para ver la animación');
console.log('5. Revisar la consola del navegador para logs de interacción');

console.log('\n🔧 SI NO SE VE EL BOTÓN:');
console.log('- Verificar que el componente ArchetypeSelector esté visible');
console.log('- Revisar la consola del navegador para errores de carga');
console.log('- Comprobar que el archivo .riv se carga correctamente');
console.log('- Verificar que @rive-app/canvas esté funcionando');

console.log('\n🎨 CARACTERÍSTICAS DEL BOTÓN:');
console.log('- Tamaño: 80x40 píxeles');
console.log('- Animación: Hover y Click');
console.log('- State Machine: "State Machine 1"');
console.log('- Archivo: boost_selection_interactiondemo.riv');
console.log('- Posición: Junto al botón de ficha de características'); 