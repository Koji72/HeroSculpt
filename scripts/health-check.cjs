const fs = require('fs');
const path = require('path');

console.log('🏥 Health Check del Sistema');
console.log('===========================\n');

let issues = [];
let warnings = [];

// 1. Verificar archivo .env
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  issues.push('❌ Archivo .env no encontrado');
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  // Verificar si hay valores placeholder
  lines.forEach(line => {
    if (line.includes('placeholder') || line.includes('your_')) {
      warnings.push(`⚠️ Variable con valor placeholder: ${line.split('=')[0]}`);
    }
  });
  
  console.log('✅ Archivo .env encontrado');
}

// 2. Verificar fuentes
const fontPath = path.join(process.cwd(), 'public/assets/ui/RefrigeratorDeluxeHeavy_0b54d629.ttf');
if (!fs.existsSync(fontPath)) {
  issues.push('❌ Fuente RefrigeratorDeluxeHeavy no encontrada');
} else {
  console.log('✅ Fuentes encontradas');
}

// 3. Verificar modelos 3D
const modelsPath = path.join(process.cwd(), 'public/assets/strong');
if (!fs.existsSync(modelsPath)) {
  issues.push('❌ Carpeta de modelos 3D no encontrada');
} else {
  const modelFiles = fs.readdirSync(modelsPath, { recursive: true });
  const glbFiles = modelFiles.filter(file => file.endsWith('.glb'));
  console.log(`✅ Modelos 3D encontrados: ${glbFiles.length} archivos GLB`);
}

// 4. Verificar dependencias críticas
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const criticalDeps = ['react', 'three', '@supabase/supabase-js', '@stripe/stripe-js'];
criticalDeps.forEach(dep => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    issues.push(`❌ Dependencia crítica faltante: ${dep}`);
  }
});
console.log('✅ Dependencias críticas verificadas');

// 5. Verificar archivos de configuración
const configFiles = ['vite.config.ts', 'tailwind.config.js', 'tsconfig.json'];
configFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    issues.push(`❌ Archivo de configuración faltante: ${file}`);
  }
});
console.log('✅ Archivos de configuración verificados');

// 6. Verificar scripts importantes
const scripts = ['stripe-server.cjs', 'complete-server.cjs'];
scripts.forEach(script => {
  if (!fs.existsSync(script)) {
    warnings.push(`⚠️ Script faltante: ${script}`);
  }
});

// 7. Verificar documentación
const docsPath = path.join(process.cwd(), 'docs');
if (fs.existsSync(docsPath)) {
  const docFiles = fs.readdirSync(docsPath);
  console.log(`✅ Documentación encontrada: ${docFiles.length} archivos`);
}

// Reporte final
console.log('\n📊 REPORTE FINAL');
console.log('================');

if (issues.length === 0 && warnings.length === 0) {
  console.log('🎉 ¡Sistema en perfecto estado!');
  console.log('✅ No se encontraron problemas críticos');
  console.log('✅ No se encontraron advertencias');
} else {
  if (issues.length > 0) {
    console.log('\n🚨 PROBLEMAS CRÍTICOS:');
    issues.forEach(issue => console.log(issue));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️ ADVERTENCIAS:');
    warnings.forEach(warning => console.log(warning));
  }
}

console.log('\n📋 PRÓXIMOS PASOS:');
if (issues.length > 0) {
  console.log('1. 🔧 Arreglar problemas críticos antes de continuar');
  console.log('2. ⚙️ Configurar variables de entorno reales');
  console.log('3. 🧪 Probar funcionalidades básicas');
} else if (warnings.length > 0) {
  console.log('1. ⚙️ Configurar variables de entorno reales');
  console.log('2. 🧪 Probar funcionalidades básicas');
  console.log('3. 💳 Implementar sistema de pagos');
} else {
  console.log('1. 🧪 Probar funcionalidades básicas');
  console.log('2. 💳 Implementar sistema de pagos');
  console.log('3. 🚀 Desplegar a producción');
}

console.log('\n🔗 COMANDOS ÚTILES:');
console.log('- npm run dev          # Iniciar desarrollo');
console.log('- npm run build        # Build de producción');
console.log('- node scripts/setup-env.cjs  # Configurar entorno');
console.log('- npm run verify-supabase     # Verificar Supabase'); 