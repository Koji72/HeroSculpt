#!/usr/bin/env node

/**
 * Script de Optimización de Rendimiento CSS
 * 
 * Este script identifica y sugiere optimizaciones para mejorar el rendimiento
 * de las transiciones y efectos CSS en el proyecto.
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
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
  performance: (msg) => console.log(`${colors.magenta}⚡ ${msg}${colors.reset}`)
};

function scanDirectory(dir, fileExtensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && fileExtensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

function analyzeCSSPerformance(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  const optimizations = [];
  
  // Buscar transition-all (problemático)
  const transitionAllMatches = content.match(/transition-all/g);
  if (transitionAllMatches) {
    issues.push(`transition-all encontrado ${transitionAllMatches.length} veces`);
    optimizations.push('Reemplazar transition-all con transiciones específicas');
  }
  
  // Buscar hover:scale (puede causar reflow)
  const hoverScaleMatches = content.match(/hover:scale-\d+/g);
  if (hoverScaleMatches) {
    issues.push(`hover:scale encontrado ${hoverScaleMatches.length} veces`);
    optimizations.push('Considerar usar transform: translateZ(0) para hardware acceleration');
  }
  
  // Buscar shadow-lg en hover (costoso)
  const hoverShadowMatches = content.match(/hover:shadow-lg/g);
  if (hoverShadowMatches) {
    issues.push(`hover:shadow-lg encontrado ${hoverShadowMatches.length} veces`);
    optimizations.push('Optimizar sombras o usar box-shadow más simples');
  }
  
  // Buscar duration-300 (muy largo)
  const duration300Matches = content.match(/duration-300/g);
  if (duration300Matches) {
    issues.push(`duration-300 encontrado ${duration300Matches.length} veces`);
    optimizations.push('Reducir a duration-200 o duration-150 para mejor UX');
  }
  
  // Buscar muchas clases CSS en un elemento
  const longClassMatches = content.match(/className="[^"]{100,}"/g);
  if (longClassMatches) {
    issues.push(`${longClassMatches.length} elementos con muchas clases CSS`);
    optimizations.push('Considerar extraer estilos a componentes o CSS modules');
  }
  
  return {
    file: path.relative(process.cwd(), filePath),
    issues,
    optimizations,
    severity: issues.length > 3 ? 'high' : issues.length > 1 ? 'medium' : 'low'
  };
}

function generateOptimizationSuggestions() {
  return [
    {
      type: 'transition-all',
      problem: 'Transición de todas las propiedades es costosa',
      solution: 'Especificar solo las propiedades que necesitan transición',
      example: `
// ❌ Problemático
transition-all duration-300

// ✅ Optimizado
transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease
      `
    },
    {
      type: 'hover-scale',
      problem: 'Transform scale puede causar reflow',
      solution: 'Usar hardware acceleration y optimizar',
      example: `
// ❌ Problemático
hover:scale-105

// ✅ Optimizado
transform: scale(1.02);
will-change: transform;
      `
    },
    {
      type: 'shadow-complex',
      problem: 'Sombras complejas son costosas',
      solution: 'Simplificar sombras o usar alternativas',
      example: `
// ❌ Problemático
hover:shadow-lg hover:shadow-blue-400/50

// ✅ Optimizado
box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      `
    },
    {
      type: 'duration-long',
      problem: 'Duración de 300ms es muy lenta',
      solution: 'Reducir a 200ms o menos',
      example: `
// ❌ Problemático
duration-300

// ✅ Optimizado
duration-200
      `
    },
    {
      type: 'many-classes',
      problem: 'Muchas clases CSS en un elemento',
      solution: 'Extraer a componentes o CSS modules',
      example: `
// ❌ Problemático
className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-sm uppercase tracking-wider rounded-md transition-all duration-300 hover:from-blue-500 hover:to-blue-400 hover:scale-105 hover:shadow-lg hover:shadow-blue-400/50 relative overflow-hidden group"

// ✅ Optimizado
<OptimizedButton variant="blue" onClick={handleClick}>
  {children}
</OptimizedButton>
      `
    }
  ];
}

function generateReport(analyses) {
  log.header('📊 Reporte de Rendimiento CSS');
  
  let totalIssues = 0;
  let highSeverity = 0;
  let mediumSeverity = 0;
  let lowSeverity = 0;
  
  // Agrupar por severidad
  const highSeverityFiles = analyses.filter(a => a.severity === 'high');
  const mediumSeverityFiles = analyses.filter(a => a.severity === 'medium');
  const lowSeverityFiles = analyses.filter(a => a.severity === 'low');
  
  analyses.forEach(analysis => {
    totalIssues += analysis.issues.length;
    if (analysis.severity === 'high') highSeverity++;
    else if (analysis.severity === 'medium') mediumSeverity++;
    else lowSeverity++;
  });
  
  // Mostrar archivos con alta severidad
  if (highSeverityFiles.length > 0) {
    log.error(`Archivos con problemas críticos (${highSeverityFiles.length}):`);
    highSeverityFiles.forEach(analysis => {
      console.log(`  ${colors.red}• ${analysis.file}${colors.reset}`);
      analysis.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    });
  }
  
  // Mostrar archivos con severidad media
  if (mediumSeverityFiles.length > 0) {
    log.warning(`Archivos con problemas moderados (${mediumSeverityFiles.length}):`);
    mediumSeverityFiles.forEach(analysis => {
      console.log(`  ${colors.yellow}• ${analysis.file}${colors.reset}`);
      analysis.issues.slice(0, 2).forEach(issue => {
        console.log(`    - ${issue}`);
      });
    });
  }
  
  // Resumen
  log.header('📈 Resumen de Rendimiento CSS');
  console.log(`Total de archivos analizados: ${colors.blue}${analyses.length}${colors.reset}`);
  console.log(`Total de problemas encontrados: ${colors.red}${totalIssues}${colors.reset}`);
  console.log(`Archivos críticos: ${colors.red}${highSeverity}${colors.reset}`);
  console.log(`Archivos moderados: ${colors.yellow}${mediumSeverity}${colors.reset}`);
  console.log(`Archivos con pocos problemas: ${colors.green}${lowSeverity}${colors.reset}`);
  
  // Calcular score
  const maxIssues = analyses.length * 5; // Estimación máxima
  const score = Math.max(0, 100 - Math.round((totalIssues / maxIssues) * 100));
  
  if (score >= 80) {
    log.success(`Puntuación CSS: ${score}/100 - ¡Excelente rendimiento!`);
  } else if (score >= 60) {
    log.warning(`Puntuación CSS: ${score}/100 - Rendimiento aceptable`);
  } else {
    log.error(`Puntuación CSS: ${score}/100 - Se requieren optimizaciones urgentes`);
  }
  
  return { score, totalIssues, highSeverity };
}

function suggestOptimizations() {
  log.header('🔧 Optimizaciones CSS Recomendadas');
  
  const suggestions = generateOptimizationSuggestions();
  
  suggestions.forEach((suggestion, index) => {
    console.log(`\n${index + 1}. ${colors.bright}${suggestion.type.toUpperCase()}${colors.reset}`);
    console.log(`   Problema: ${suggestion.problem}`);
    console.log(`   Solución: ${suggestion.solution}`);
    console.log(`   Ejemplo: ${colors.cyan}${suggestion.example.trim()}${colors.reset}`);
  });
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}🎨 Análisis de Rendimiento CSS${colors.reset}\n`);
  
  const projectRoot = process.cwd();
  const files = scanDirectory(projectRoot);
  
  log.info(`Analizando ${files.length} archivos...`);
  
  const analyses = [];
  for (const file of files) {
    try {
      const analysis = analyzeCSSPerformance(file);
      if (analysis.issues.length > 0) {
        analyses.push(analysis);
      }
    } catch (error) {
      log.error(`Error analizando ${file}: ${error.message}`);
    }
  }
  
  const { score, totalIssues, highSeverity } = generateReport(analyses);
  
  if (score < 80 || highSeverity > 0) {
    suggestOptimizations();
  }
  
  log.header('🎯 Próximos Pasos');
  if (highSeverity > 0) {
    console.log('1. 🔴 Optimizar archivos con problemas críticos primero');
  }
  console.log('2. 🎨 Implementar OptimizedButton en lugar de botones complejos');
  console.log('3. ⚡ Reducir duraciones de transición a 200ms o menos');
  console.log('4. 🎯 Especificar transiciones específicas en lugar de transition-all');
  console.log('5. 🔄 Re-ejecutar este análisis después de las optimizaciones');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, analyzeCSSPerformance, generateOptimizationSuggestions }; 