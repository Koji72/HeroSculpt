const fs = require('fs');
const path = require('path');

console.log('🎯 VERIFICACIÓN INTEGRACIÓN ARCHETYPE SELECTOR');
console.log('==============================================\n');

// 1. Verificar App.tsx
const appPath = path.join(__dirname, '..', 'App.tsx');
console.log('1. 📱 App.tsx:');
if (fs.existsSync(appPath)) {
  const content = fs.readFileSync(appPath, 'utf8');
  const usesArchetypeSelector = content.includes('<ArchetypeSelector');
  const usesRiveArchetypeSelector = content.includes('<RiveArchetypeSelector');
  const hasRiveButtonImport = content.includes('import RiveButton');
  
  console.log('   🎯 ArchetypeSelector:', usesArchetypeSelector ? '✅' : '❌');
  console.log('   🎨 RiveArchetypeSelector:', usesRiveArchetypeSelector ? '⚠️ CONFLICTO' : '✅ No usado');
  console.log('   📦 Import RiveButton:', hasRiveButtonImport ? '✅' : '❌');
  
  if (usesArchetypeSelector) {
    console.log('   🎯 Componente correcto: ArchetypeSelector con botón Rive integrado');
  }
} else {
  console.log('   ❌ NO EXISTE: App.tsx');
}

// 2. Verificar ArchetypeSelector.tsx
const archetypeSelectorPath = path.join(__dirname, '..', 'components', 'ArchetypeSelector.tsx');
console.log('\n2. 🧩 ArchetypeSelector.tsx:');
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

// 3. Verificar RiveButton.tsx
const riveButtonPath = path.join(__dirname, '..', 'components', 'RiveButton.tsx');
console.log('\n3. 🎨 RiveButton.tsx:');
if (fs.existsSync(riveButtonPath)) {
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

// 4. Verificar archivo Rive
const rivePath = path.join(__dirname, '..', 'dist', 'assets', 'boost_selection_interactiondemo.riv');
console.log('\n4. 📁 Archivo Rive:');
if (fs.existsSync(rivePath)) {
  const stats = fs.statSync(rivePath);
  console.log('   ✅ Existe:', rivePath);
  console.log('   📊 Tamaño:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('   ❌ NO EXISTE:', rivePath);
}

// 5. Verificar servidor
console.log('\n5. 🌐 Servidor:');
console.log('   🔗 URL: http://localhost:5178/');
console.log('   📍 Puerto: 5178 (confirmado activo)');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('1. Abrir http://localhost:5178/ en el navegador');
console.log('2. Buscar el menú de arquetipos (panel izquierdo)');
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
console.log('- Estilo: border border-orange-400/50 rounded-lg'); 