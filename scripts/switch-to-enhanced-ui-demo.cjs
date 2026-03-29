const fs = require('fs');
const path = require('path');

// Función para hacer backup del index.tsx original
function backupOriginalIndex() {
  const indexPath = path.join(__dirname, '..', 'index.tsx');
  const backupPath = path.join(__dirname, '..', 'index-backup.tsx');
  
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, backupPath);
    console.log('✅ Backup del index.tsx original creado');
  }
}

// Función para restaurar el index.tsx original
function restoreOriginalIndex() {
  const indexPath = path.join(__dirname, '..', 'index.tsx');
  const backupPath = path.join(__dirname, '..', 'index-backup.tsx');
  
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, indexPath);
    console.log('✅ index.tsx original restaurado');
  }
}

// Función para cambiar a la versión de demostración
function switchToDemo() {
  const indexPath = path.join(__dirname, '..', 'index.tsx');
  const demoAppPath = path.join(__dirname, '..', 'App-demo-enhanced-ui.tsx');
  
  if (!fs.existsSync(demoAppPath)) {
    console.error('❌ No se encontró App-demo-enhanced-ui.tsx');
    return;
  }
  
  // Crear backup
  backupOriginalIndex();
  
  // Leer el contenido del index.tsx actual
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Cambiar la importación de App.tsx a App-demo-enhanced-ui.tsx
  indexContent = indexContent.replace(
    "import App from './App';",
    "import App from './App-demo-enhanced-ui';"
  );
  
  // Escribir el nuevo contenido
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Cambiado a la versión de demostración de UI mejorada');
  console.log('🌐 Ejecuta "npm start" para ver la nueva UI en acción');
}

// Función para mostrar el estado actual
function showStatus() {
  const indexPath = path.join(__dirname, '..', 'index.tsx');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  if (indexContent.includes("App-demo-enhanced-ui")) {
    console.log('📱 Estado actual: MODO DEMOSTRACIÓN (UI Mejorada)');
    console.log('💡 Para volver al modo normal, ejecuta: node scripts/switch-to-enhanced-ui-demo.js restore');
  } else {
    console.log('📱 Estado actual: MODO NORMAL');
    console.log('💡 Para activar la demostración, ejecuta: node scripts/switch-to-enhanced-ui-demo.js demo');
  }
}

// Manejar argumentos de línea de comandos
const command = process.argv[2];

switch (command) {
  case 'demo':
    switchToDemo();
    break;
  case 'restore':
    restoreOriginalIndex();
    break;
  case 'status':
    showStatus();
    break;
  default:
    console.log('🔧 Script para cambiar entre UI normal y UI mejorada');
    console.log('');
    console.log('Comandos disponibles:');
    console.log('  demo     - Cambiar a la versión de demostración de UI mejorada');
    console.log('  restore  - Restaurar la versión original');
    console.log('  status   - Mostrar el estado actual');
    console.log('');
    console.log('Ejemplos:');
    console.log('  node scripts/switch-to-enhanced-ui-demo.js demo');
    console.log('  node scripts/switch-to-enhanced-ui-demo.js restore');
    console.log('  node scripts/switch-to-enhanced-ui-demo.js status');
} 