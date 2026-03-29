#!/usr/bin/env node

/**
 * Script de Optimización Automática de Botones
 * 
 * Este script optimiza automáticamente los botones con problemas de rendimiento
 * reemplazando transition-all y otros patrones costosos.
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`)
};

function optimizeButtonPattern(content) {
  let optimized = content;
  let changes = 0;

  // Patrón para botones con transition-all y efectos hover complejos
  const buttonPattern = /className="([^"]*transition-all[^"]*duration-300[^"]*hover:scale-[^"]*hover:shadow-lg[^"]*)"/g;
  
  optimized = optimized.replace(buttonPattern, (match, className) => {
    changes++;
    
    // Extraer el color del gradiente
    const colorMatch = className.match(/from-(\w+)-600 to-(\w+)-500/);
    const color = colorMatch ? colorMatch[1] : 'blue';
    
    // Crear la versión optimizada
    const optimizedClass = className
      .replace(/transition-all duration-300/g, '')
      .replace(/hover:from-\w+-\d+ hover:to-\w+-\d+/g, '')
      .replace(/hover:scale-\d+/g, '')
      .replace(/hover:shadow-lg hover:shadow-\w+-\d+\/\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Crear el estilo inline optimizado
    const colorMap = {
      blue: {
        normal: 'linear-gradient(to right, rgb(37 99 235), rgb(59 130 246))',
        hover: 'linear-gradient(to right, rgb(59 130 246), rgb(96 165 250))',
        shadow: '0 10px 25px -5px rgba(59 130 246, 0.5)'
      },
      teal: {
        normal: 'linear-gradient(to right, rgb(13 148 136), rgb(20 184 166))',
        hover: 'linear-gradient(to right, rgb(20 184 166), rgb(34 197 94))',
        shadow: '0 10px 25px -5px rgba(20 184 166, 0.5)'
      },
      amber: {
        normal: 'linear-gradient(to right, rgb(217 119 6), rgb(245 158 11))',
        hover: 'linear-gradient(to right, rgb(245 158 11), rgb(251 191 36))',
        shadow: '0 10px 25px -5px rgba(245 158 11, 0.5)'
      },
      emerald: {
        normal: 'linear-gradient(to right, rgb(5 150 105), rgb(16 185 129))',
        hover: 'linear-gradient(to right, rgb(16 185 129), rgb(34 197 94))',
        shadow: '0 10px 25px -5px rgba(16 185 129, 0.5)'
      },
      indigo: {
        normal: 'linear-gradient(to right, rgb(79 70 229), rgb(99 102 241))',
        hover: 'linear-gradient(to right, rgb(99 102 241), rgb(129 140 248))',
        shadow: '0 10px 25px -5px rgba(99 102 241, 0.5)'
      },
      green: {
        normal: 'linear-gradient(to right, rgb(21 128 61), rgb(34 197 94))',
        hover: 'linear-gradient(to right, rgb(34 197 94), rgb(74 222 128))',
        shadow: '0 10px 25px -5px rgba(34 197 94, 0.5)'
      }
    };
    
    const colors = colorMap[color] || colorMap.blue;
    
    return `className="${optimizedClass}" style={{ 
      transition: 'background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
      willChange: 'background, transform, box-shadow'
    }} onMouseEnter={(e) => {
      e.currentTarget.style.background = '${colors.hover}';
      e.currentTarget.style.transform = 'scale(1.02)';
      e.currentTarget.style.boxShadow = '${colors.shadow}';
    }} onMouseLeave={(e) => {
      e.currentTarget.style.background = '${colors.normal}';
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = 'none';
    }}`;
  });

  return { optimized, changes };
}

function optimizeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { optimized, changes } = optimizeButtonPattern(content);
    
    if (changes > 0) {
      fs.writeFileSync(filePath, optimized, 'utf8');
      return { file: path.relative(process.cwd(), filePath), changes };
    }
    
    return null;
  } catch (error) {
    log.error(`Error optimizando ${filePath}: ${error.message}`);
    return null;
  }
}

function findFilesToOptimize() {
  const files = [];
  
  function scan(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules' && !item.includes('backup')) {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith('.tsx') && !item.includes('backup')) {
        files.push(fullPath);
      }
    }
  }
  
  scan(process.cwd());
  return files;
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}🚀 Optimización Automática de Botones${colors.reset}\n`);
  
  const files = findFilesToOptimize();
  log.info(`Analizando ${files.length} archivos para optimización...`);
  
  const results = [];
  let totalChanges = 0;
  
  for (const file of files) {
    const result = optimizeFile(file);
    if (result) {
      results.push(result);
      totalChanges += result.changes;
    }
  }
  
  log.header('📊 Resultados de la Optimización');
  
  if (results.length === 0) {
    log.success('No se encontraron botones que necesiten optimización automática.');
  } else {
    log.success(`Optimizados ${results.length} archivos con ${totalChanges} cambios:`);
    
    results.forEach(result => {
      console.log(`  ${colors.green}• ${result.file}${colors.reset} - ${result.changes} cambios`);
    });
    
    log.header('🎯 Impacto Esperado');
    console.log('• Reducción del tiempo de click de ~300ms a <100ms');
    console.log('• Eliminación de re-renders innecesarios');
    console.log('• Mejor hardware acceleration con will-change');
    console.log('• Transiciones más suaves y responsivas');
  }
  
  log.header('🔧 Próximos Pasos');
  console.log('1. Probar la aplicación para verificar que todo funciona');
  console.log('2. Medir el rendimiento con las herramientas de desarrollo');
  console.log('3. Ejecutar el análisis CSS nuevamente para verificar mejoras');
  console.log('4. Considerar optimizar componentes específicos manualmente');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, optimizeButtonPattern, optimizeFile }; 