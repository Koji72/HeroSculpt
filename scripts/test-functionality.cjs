const fs = require('fs');
const path = require('path');

console.log('🧪 Pruebas de Funcionalidades Básicas');
console.log('=====================================\n');

let tests = [];
let passed = 0;
let failed = 0;

// Función helper para tests
function test(name, testFn) {
  tests.push({ name, testFn });
}

function runTests() {
  console.log('🚀 Ejecutando pruebas...\n');
  
  tests.forEach((test, index) => {
    try {
      test.testFn();
      console.log(`✅ [${index + 1}/${tests.length}] ${test.name}`);
      passed++;
    } catch (error) {
      console.log(`❌ [${index + 1}/${tests.length}] ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  });
  
  console.log('\n📊 RESULTADOS:');
  console.log(`✅ Pasadas: ${passed}`);
  console.log(`❌ Fallidas: ${failed}`);
  console.log(`📈 Total: ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 ¡Todas las pruebas pasaron!');
    console.log('✅ El sistema está funcionando correctamente');
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron');
    console.log('🔧 Revisa los errores antes de continuar');
  }
}

// Test 1: Verificar archivos críticos
test('Archivos críticos del sistema', () => {
  const criticalFiles = [
    'App.tsx',
    'types.ts',
    'constants.ts',
    'components/CharacterViewer.tsx',
    'components/ShoppingCart.tsx',
    'services/stripeService.ts',
    'lib/supabase.ts'
  ];
  
  criticalFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      throw new Error(`Archivo crítico faltante: ${file}`);
    }
  });
});

// Test 2: Verificar modelos 3D
test('Modelos 3D disponibles', () => {
  const modelsPath = 'public/assets/strong';
  if (!fs.existsSync(modelsPath)) {
    throw new Error('Carpeta de modelos no encontrada');
  }
  
  const modelFiles = fs.readdirSync(modelsPath, { recursive: true });
  const glbFiles = modelFiles.filter(file => file.endsWith('.glb'));
  
  if (glbFiles.length < 100) {
    throw new Error(`Pocos modelos encontrados: ${glbFiles.length}`);
  }
});

// Test 3: Verificar configuración de tipos
test('Configuración de tipos TypeScript', () => {
  const typesContent = fs.readFileSync('types.ts', 'utf8');
  
  // Verificar que SelectedParts esté definido correctamente
  if (!typesContent.includes('export type SelectedParts')) {
    throw new Error('Tipo SelectedParts no encontrado');
  }
  
  // Verificar que PartCategory esté definido
  if (!typesContent.includes('export enum PartCategory')) {
    throw new Error('Enum PartCategory no encontrado');
  }
});

// Test 4: Verificar constantes de partes
test('Constantes de partes definidas', () => {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  // Verificar que ALL_PARTS esté definido
  if (!constantsContent.includes('export const ALL_PARTS')) {
    throw new Error('Constante ALL_PARTS no encontrada');
  }
  
  // Verificar que ARCHETYPES esté definido
  if (!constantsContent.includes('export const ARCHETYPES')) {
    throw new Error('Constante ARCHETYPES no encontrada');
  }
});

// Test 5: Verificar componentes React
test('Componentes React principales', () => {
  const components = [
    'components/CharacterViewer.tsx',
    'components/ShoppingCart.tsx',
    'components/PartSelectorPanel.tsx',
    'components/MaterialConfigurator.tsx'
  ];
  
  components.forEach(component => {
    if (!fs.existsSync(component)) {
      throw new Error(`Componente faltante: ${component}`);
    }
    
    const content = fs.readFileSync(component, 'utf8');
    if (!content.includes('React.FC') && !content.includes('function') && !content.includes('forwardRef')) {
      throw new Error(`Componente ${component} no parece ser un componente React válido`);
    }
  });
});

// Test 6: Verificar servicios
test('Servicios del sistema', () => {
  const services = [
    'services/stripeService.ts',
    'services/purchaseHistoryService.ts',
    'services/emailService.ts'
  ];
  
  services.forEach(service => {
    if (!fs.existsSync(service)) {
      throw new Error(`Servicio faltante: ${service}`);
    }
  });
});

// Test 7: Verificar configuración de build
test('Configuración de build', () => {
  const configFiles = [
    'vite.config.ts',
    'tailwind.config.js',
    'tsconfig.json',
    'package.json'
  ];
  
  configFiles.forEach(config => {
    if (!fs.existsSync(config)) {
      throw new Error(`Archivo de configuración faltante: ${config}`);
    }
  });
  
  // Verificar que package.json tenga scripts necesarios
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'build', 'preview'];
  
  requiredScripts.forEach(script => {
    if (!packageJson.scripts[script]) {
      throw new Error(`Script faltante en package.json: ${script}`);
    }
  });
});

// Test 8: Verificar assets de UI
test('Assets de UI disponibles', () => {
  const uiAssets = [
    'public/assets/ui/RefrigeratorDeluxeHeavy_0b54d629.ttf',
    'public/assets/ui/RefrigeratorDeluxeBold_30fce753.ttf',
    'public/assets/ui/RefrigeratorDeluxeExtrabold_fd7fc0ff.ttf'
  ];
  
  uiAssets.forEach(asset => {
    if (!fs.existsSync(asset)) {
      throw new Error(`Asset de UI faltante: ${asset}`);
    }
  });
});

// Test 9: Verificar documentación
test('Documentación del sistema', () => {
  const docsPath = 'docs';
  if (!fs.existsSync(docsPath)) {
    throw new Error('Carpeta de documentación no encontrada');
  }
  
  const docFiles = fs.readdirSync(docsPath);
  if (docFiles.length < 10) {
    throw new Error(`Poca documentación encontrada: ${docFiles.length} archivos`);
  }
});

// Test 10: Verificar estructura de carpetas
test('Estructura de carpetas correcta', () => {
  const requiredFolders = [
    'components',
    'services',
    'lib',
    'public/assets',
    'docs',
    'scripts'
  ];
  
  requiredFolders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      throw new Error(`Carpeta requerida faltante: ${folder}`);
    }
  });
});

// Ejecutar todas las pruebas
runTests();

console.log('\n📋 PRÓXIMOS PASOS:');
if (failed === 0) {
  console.log('1. 🌐 Abrir http://localhost:5177 en el navegador');
  console.log('2. 🎨 Probar customización de personajes');
  console.log('3. 🛒 Probar carrito de compras');
  console.log('4. 📥 Probar exportación STL/GLB');
  console.log('5. 💳 Configurar pagos reales');
} else {
  console.log('1. 🔧 Arreglar problemas identificados');
  console.log('2. 🧪 Volver a ejecutar las pruebas');
  console.log('3. 🌐 Probar en navegador cuando todo esté bien');
}

console.log('\n🔗 COMANDOS ÚTILES:');
console.log('- npm run dev          # Iniciar desarrollo');
console.log('- node scripts/health-check.cjs  # Health check completo');
console.log('- npm run build        # Build de producción'); 