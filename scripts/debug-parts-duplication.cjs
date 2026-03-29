#!/usr/bin/env node

/**
 * Script de Diagnóstico de Duplicación de Partes
 * 
 * Este script ayuda a identificar y diagnosticar problemas de duplicación
 * de partes en el estado de la aplicación.
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

function analyzePartsDuplication(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Buscar patrones que puedan causar duplicación
    const patterns = [
      {
        name: 'setSelectedParts sin limpieza',
        regex: /setSelectedParts\([^)]*\)/g,
        description: 'Asignación de partes sin limpiar estado anterior'
      },
      {
        name: 'DEFAULT_BUILD mezclado',
        regex: /DEFAULT_\w+_BUILD/g,
        description: 'Uso de builds por defecto que pueden mezclarse'
      },
      {
        name: 'handleLoadConfiguration',
        regex: /handleLoadConfiguration/g,
        description: 'Función de carga de configuración'
      },
      {
        name: 'assignDefaultHandsForTorso',
        regex: /assignDefaultHandsForTorso/g,
        description: 'Función que puede duplicar manos'
      },
      {
        name: 'assignAdaptiveHeadForTorso',
        regex: /assignAdaptiveHeadForTorso/g,
        description: 'Función que puede duplicar cabezas'
      },
      {
        name: 'assignAdaptiveCapeForTorso',
        regex: /assignAdaptiveCapeForTorso/g,
        description: 'Función que puede duplicar capas'
      }
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches) {
        issues.push({
          type: pattern.name,
          count: matches.length,
          description: pattern.description,
          lines: matches.map(match => {
            const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
            return `${lineNumber}: ${match.substring(0, 50)}...`;
          })
        });
      }
    });
    
    return {
      file: path.relative(process.cwd(), filePath),
      issues,
      hasDuplicationRisk: issues.length > 0
    };
  } catch (error) {
    return {
      file: path.relative(process.cwd(), filePath),
      error: error.message,
      hasDuplicationRisk: false
    };
  }
}

function generateDuplicationReport(analyses) {
  log.header('🔍 Diagnóstico de Duplicación de Partes');
  
  let totalIssues = 0;
  let filesWithRisk = 0;
  
  analyses.forEach(analysis => {
    if (analysis.hasDuplicationRisk) {
      filesWithRisk++;
      totalIssues += analysis.issues.length;
      
      console.log(`\n${colors.yellow}📁 ${analysis.file}${colors.reset}`);
      analysis.issues.forEach(issue => {
        console.log(`  ${colors.red}• ${issue.type}${colors.reset} (${issue.count} veces)`);
        console.log(`    ${issue.description}`);
        if (issue.lines && issue.lines.length > 0) {
          console.log(`    Líneas: ${issue.lines.slice(0, 3).join(', ')}`);
        }
      });
    }
  });
  
  log.header('📊 Resumen de Diagnóstico');
  console.log(`Archivos analizados: ${colors.blue}${analyses.length}${colors.reset}`);
  console.log(`Archivos con riesgo: ${colors.red}${filesWithRisk}${colors.reset}`);
  console.log(`Problemas encontrados: ${colors.red}${totalIssues}${colors.reset}`);
  
  if (filesWithRisk > 0) {
    log.header('🔧 Soluciones Recomendadas');
    console.log('1. ✅ Limpiar estado antes de cargar configuraciones');
    console.log('2. ✅ Usar resetState() en CharacterViewer');
    console.log('3. ✅ Verificar que no se mezclen builds por defecto');
    console.log('4. ✅ Revisar funciones adaptativas (assignDefault*)');
    console.log('5. ✅ Agregar logs de debug para rastrear cambios');
  } else {
    log.success('No se encontraron riesgos de duplicación evidentes');
  }
  
  return { totalIssues, filesWithRisk };
}

function findFilesToAnalyze() {
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
  console.log(`${colors.bright}${colors.cyan}🔍 Diagnóstico de Duplicación de Partes${colors.reset}\n`);
  
  const files = findFilesToAnalyze();
  log.info(`Analizando ${files.length} archivos para riesgos de duplicación...`);
  
  const analyses = [];
  for (const file of files) {
    const analysis = analyzePartsDuplication(file);
    if (analysis.hasDuplicationRisk) {
      analyses.push(analysis);
    }
  }
  
  const { totalIssues, filesWithRisk } = generateDuplicationReport(analyses);
  
  log.header('🎯 Próximos Pasos');
  if (filesWithRisk > 0) {
    console.log('1. 🔍 Revisar los archivos con riesgo identificados');
    console.log('2. 🧪 Probar la carga de configuraciones de usuario');
    console.log('3. 📝 Agregar logs de debug para rastrear el estado');
    console.log('4. 🔄 Verificar que handleLoadConfiguration limpie correctamente');
  }
  console.log('5. 🎮 Probar la aplicación para verificar que no hay duplicación');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, analyzePartsDuplication, generateDuplicationReport }; 