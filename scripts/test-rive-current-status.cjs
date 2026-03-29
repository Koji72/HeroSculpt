const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO RIVE - ESTADO ACTUAL');
console.log('=====================================\n');

// 1. Verificar archivo Rive
const rivePath = path.join(__dirname, '..', 'dist', 'assets', 'boost_selection_interactiondemo.riv');
console.log('1. 📁 Archivo Rive:');
if (fs.existsSync(rivePath)) {
  console.log('   ✅ Existe:', rivePath);
  const stats = fs.statSync(rivePath);
  console.log('   📊 Tamaño:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('   ❌ NO EXISTE:', rivePath);
}

// 2. Verificar componentes Rive
const components = [
  'components/SimpleRiveTest.tsx',
  'components/RiveArchetypeSelector.tsx',
  'components/RiveArchetypeTest.tsx'
];

console.log('\n2. 🧩 Componentes Rive:');
components.forEach(comp => {
  const compPath = path.join(__dirname, '..', comp);
  if (fs.existsSync(compPath)) {
    console.log('   ✅ Existe:', comp);
  } else {
    console.log('   ❌ NO EXISTE:', comp);
  }
});

// 3. Verificar App.tsx
const appPath = path.join(__dirname, '..', 'App.tsx');
console.log('\n3. 📱 App.tsx:');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  const hasRiveTest = appContent.includes('RiveArchetypeTest');
  const hasSimpleTest = appContent.includes('SimpleRiveTest');
  const hasRiveButton = appContent.includes('🎨 Rive Test');
  
  console.log('   ✅ Archivo existe');
  console.log('   🎨 RiveArchetypeTest:', hasRiveTest ? '✅' : '❌');
  console.log('   🧪 SimpleRiveTest:', hasSimpleTest ? '✅' : '❌');
  console.log('   🔘 Botón Rive:', hasRiveButton ? '✅' : '❌');
} else {
  console.log('   ❌ NO EXISTE App.tsx');
}

// 4. Verificar package.json
const packagePath = path.join(__dirname, '..', 'package.json');
console.log('\n4. 📦 Dependencias:');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const hasRiveCanvas = packageContent.dependencies && packageContent.dependencies['@rive-app/canvas'];
  const hasRiveReact = packageContent.dependencies && packageContent.dependencies['@rive-app/react-canvas'];
  
  console.log('   🎨 @rive-app/canvas:', hasRiveCanvas ? `✅ ${hasRiveCanvas}` : '❌');
  console.log('   ⚛️ @rive-app/react-canvas:', hasRiveReact ? `⚠️ ${hasRiveReact} (CONFLICTO)` : '✅ No instalado');
} else {
  console.log('   ❌ NO EXISTE package.json');
}

// 5. Verificar node_modules
const riveModulePath = path.join(__dirname, '..', 'node_modules', '@rive-app', 'canvas');
console.log('\n5. 📚 node_modules:');
if (fs.existsSync(riveModulePath)) {
  console.log('   ✅ @rive-app/canvas instalado');
  const files = fs.readdirSync(riveModulePath);
  console.log('   📄 Archivos:', files.slice(0, 5).join(', '), files.length > 5 ? '...' : '');
} else {
  console.log('   ❌ @rive-app/canvas NO instalado');
}

// 6. Verificar dist/assets
const distAssetsPath = path.join(__dirname, '..', 'dist', 'assets');
console.log('\n6. 🗂️ dist/assets:');
if (fs.existsSync(distAssetsPath)) {
  const assets = fs.readdirSync(distAssetsPath);
  const riveFiles = assets.filter(f => f.endsWith('.riv'));
  console.log('   📁 Directorio existe');
  console.log('   🎨 Archivos .riv:', riveFiles.length);
  riveFiles.forEach(file => {
    const filePath = path.join(distAssetsPath, file);
    const stats = fs.statSync(filePath);
    console.log(`      - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
} else {
  console.log('   ❌ Directorio dist/assets NO existe');
}

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('1. Abrir http://localhost:5177 en el navegador');
console.log('2. Hacer clic en "🎨 Rive Test" en el header');
console.log('3. Seleccionar "Simple Test" o "Archetype Selector"');
console.log('4. Verificar consola del navegador para errores');
console.log('5. Comprobar si la animación se carga y reproduce');

console.log('\n🔧 SI NO FUNCIONA:');
console.log('- Verificar que el servidor esté corriendo en puerto 5177');
console.log('- Revisar la consola del navegador para errores específicos');
console.log('- Verificar que el archivo .riv esté en dist/assets/');
console.log('- Comprobar que @rive-app/canvas esté correctamente importado'); 