const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Configurando UI Mejorada...\n');

// Verificar que los archivos necesarios existan
const requiredFiles = [
  'components/parts/EnhancedPartSelector.tsx',
  'components/parts/PartsFilter.tsx',
  'components/parts/PartsGrid.tsx',
  'hooks/usePartsFilter.ts',
  'App-demo-enhanced-ui.tsx'
];

console.log('📁 Verificando archivos necesarios...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Faltan archivos necesarios. Ejecuta primero la creación de componentes.');
  process.exit(1);
}

// Verificar dependencias
console.log('\n📦 Verificando dependencias...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = ['lucide-react'];
const missingDeps = [];

requiredDeps.forEach(dep => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    missingDeps.push(dep);
  }
});

if (missingDeps.length > 0) {
  console.log(`⚠️  Dependencias faltantes: ${missingDeps.join(', ')}`);
  console.log('💡 Instalando dependencias...');
  
  try {
    execSync(`npm install ${missingDeps.join(' ')}`, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    console.log('✅ Dependencias instaladas');
  } catch (error) {
    console.log('❌ Error instalando dependencias');
    console.log('💡 Instala manualmente: npm install lucide-react');
  }
} else {
  console.log('✅ Todas las dependencias están instaladas');
}

// Verificar que el directorio components/parts existe
const partsDir = path.join(__dirname, '..', 'components', 'parts');
if (!fs.existsSync(partsDir)) {
  console.log('\n📁 Creando directorio components/parts...');
  fs.mkdirSync(partsDir, { recursive: true });
  console.log('✅ Directorio creado');
}

// Verificar que el directorio hooks existe
const hooksDir = path.join(__dirname, '..', 'hooks');
if (!fs.existsSync(hooksDir)) {
  console.log('\n📁 Creando directorio hooks...');
  fs.mkdirSync(hooksDir, { recursive: true });
  console.log('✅ Directorio creado');
}

// Verificar tipos TypeScript
console.log('\n🔍 Verificando tipos TypeScript...');
const typesPath = path.join(__dirname, '..', 'types.ts');
const typesContent = fs.readFileSync(typesPath, 'utf8');

if (typesContent.includes('compatible: string[]')) {
  console.log('✅ Tipo Part tiene propiedad compatible');
} else {
  console.log('❌ Tipo Part no tiene propiedad compatible');
  console.log('💡 Asegúrate de que el tipo Part incluya: compatible: string[]');
}

// Mostrar instrucciones
console.log('\n🎉 Configuración completada!');
console.log('\n📋 Para ver la UI mejorada:');
console.log('1. Ejecuta: node scripts/switch-to-enhanced-ui-demo.js demo');
console.log('2. Ejecuta: npm start');
console.log('3. Abre: http://localhost:3000');
console.log('\n📋 Para volver al modo normal:');
console.log('node scripts/switch-to-enhanced-ui-demo.js restore');
console.log('\n📚 Documentación: docs/ENHANCED_UI_DEMO_GUIDE.md'); 