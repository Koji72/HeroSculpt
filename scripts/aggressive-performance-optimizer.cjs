#!/usr/bin/env node

/**
 * 🚀 Optimizador Agresivo de Rendimiento
 * 
 * Este script optimiza TODOS los elementos problemáticos que causan
 * delays de 600ms+ en la aplicación:
 * 
 * - transition-all (causa reflows completos)
 * - hover:scale (causa reflows)
 * - duration-300+ (demasiado lento)
 * - className strings muy largos
 * - backdrop-blur sin will-change
 */

const fs = require('fs');
const path = require('path');

// Configuración
const TARGET_DIR = '.';
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'backup-', 'dist', 'build'];

// Patrones problemáticos
const PROBLEMATIC_PATTERNS = [
  {
    name: 'transition-all',
    pattern: /transition-all/g,
    replacement: 'transition-colors transition-transform transition-shadow',
    description: 'Reemplaza transition-all con transiciones específicas'
  },
  {
    name: 'duration-300',
    pattern: /duration-300/g,
    replacement: 'duration-150',
    description: 'Reduce duración de 300ms a 150ms'
  },
  {
    name: 'duration-500',
    pattern: /duration-500/g,
    replacement: 'duration-200',
    description: 'Reduce duración de 500ms a 200ms'
  },
  {
    name: 'hover:scale-105',
    pattern: /hover:scale-105/g,
    replacement: 'hover:scale-[1.02]',
    description: 'Reduce escala hover de 1.05 a 1.02'
  },
  {
    name: 'hover:scale-110',
    pattern: /hover:scale-110/g,
    replacement: 'hover:scale-[1.05]',
    description: 'Reduce escala hover de 1.10 a 1.05'
  },
  {
    name: 'backdrop-blur-sm',
    pattern: /backdrop-blur-sm/g,
    replacement: 'backdrop-blur-sm will-change-transform',
    description: 'Agrega will-change para backdrop-blur'
  },
  {
    name: 'backdrop-blur',
    pattern: /backdrop-blur(?!-sm)/g,
    replacement: 'backdrop-blur will-change-transform',
    description: 'Agrega will-change para backdrop-blur'
  }
];

// Función para escanear archivos recursivamente
function scanFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const shouldExclude = EXCLUDE_DIRS.some(exclude => 
        item.includes(exclude) || fullPath.includes(exclude)
      );
      
      if (!shouldExclude) {
        scanFiles(fullPath, files);
      }
    } else if (EXTENSIONS.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Función para optimizar un archivo
function optimizeFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changes = [];
    
    // Aplicar optimizaciones
    for (const pattern of PROBLEMATIC_PATTERNS) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        content = content.replace(pattern.pattern, pattern.replacement);
        changes.push({
          pattern: pattern.name,
          count: matches.length,
          description: pattern.description
        });
      }
    }
    
    // Optimizar className strings muy largos (>200 caracteres)
    const longClassNamePattern = /className="([^"]{200,})"/g;
    const longClassMatches = content.match(longClassNamePattern);
    
    if (longClassMatches) {
      console.log(`⚠️  Archivo ${filePath} tiene className strings muy largos:`);
      longClassMatches.forEach(match => {
        console.log(`   - ${match.substring(0, 100)}...`);
      });
      changes.push({
        pattern: 'long-classname',
        count: longClassMatches.length,
        description: 'className strings muy largos detectados'
      });
    }
    
    // Guardar cambios si hubo modificaciones
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return {
        file: filePath,
        changes,
        optimized: true
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return null;
  }
}

// Función principal
function main() {
  console.log('🚀 Iniciando Optimización Agresiva de Rendimiento...\n');
  
  // Escanear archivos
  console.log('📁 Escaneando archivos...');
  const files = scanFiles(TARGET_DIR);
  console.log(`✅ Encontrados ${files.length} archivos para analizar\n`);
  
  // Procesar archivos
  let optimizedFiles = 0;
  let totalChanges = 0;
  const results = [];
  
  for (const file of files) {
    const result = optimizeFile(file);
    if (result) {
      optimizedFiles++;
      totalChanges += result.changes.length;
      results.push(result);
      
      console.log(`✅ ${result.file}`);
      result.changes.forEach(change => {
        console.log(`   - ${change.pattern}: ${change.count} cambios (${change.description})`);
      });
    }
  }
  
  // Resumen
  console.log('\n📊 RESUMEN DE OPTIMIZACIÓN');
  console.log('========================');
  console.log(`📁 Archivos procesados: ${files.length}`);
  console.log(`✅ Archivos optimizados: ${optimizedFiles}`);
  console.log(`🔧 Cambios totales: ${totalChanges}`);
  
  if (results.length > 0) {
    console.log('\n📋 ARCHIVOS OPTIMIZADOS:');
    results.forEach(result => {
      console.log(`\n🔧 ${result.file}`);
      result.changes.forEach(change => {
        console.log(`   • ${change.pattern}: ${change.count} cambios`);
      });
    });
  }
  
  // Recomendaciones adicionales
  console.log('\n💡 RECOMENDACIONES ADICIONALES:');
  console.log('1. Revisar archivos con className strings largos manualmente');
  console.log('2. Considerar usar CSS-in-JS para estilos complejos');
  console.log('3. Implementar lazy loading para componentes pesados');
  console.log('4. Usar React.memo() para componentes que no cambian frecuentemente');
  
  console.log('\n🎯 La aplicación debería tener mejor rendimiento ahora!');
  console.log('   Prueba los botones que antes tenían 600ms+ de delay.');
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { main, PROBLEMATIC_PATTERNS }; 