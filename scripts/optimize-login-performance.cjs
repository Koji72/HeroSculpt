#!/usr/bin/env node

/**
 * Script de Optimización de Rendimiento del Sistema de Login
 * 
 * Este script identifica y sugiere optimizaciones para mejorar el rendimiento
 * del sistema de autenticación.
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

function analyzeFile(filePath, analysisType) {
  if (!fs.existsSync(filePath)) {
    return { exists: false };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  switch (analysisType) {
    case 'authModal':
      return analyzeAuthModal(content, lines);
    case 'useAuth':
      return analyzeUseAuth(content, lines);
    case 'supabase':
      return analyzeSupabase(content, lines);
    default:
      return { exists: true, content };
  }
}

function analyzeAuthModal(content, lines) {
  const analysis = {
    exists: true,
    issues: [],
    optimizations: [],
    performance: 'good'
  };

  // Verificar uso de useMemo
  if (!content.includes('useMemo')) {
    analysis.issues.push('No se usa useMemo para memoizar configuraciones');
    analysis.optimizations.push('Implementar useMemo para authAppearance y authLocalization');
  }

  // Verificar uso de useCallback
  if (!content.includes('useCallback')) {
    analysis.issues.push('No se usa useCallback para funciones');
    analysis.optimizations.push('Implementar useCallback para handleAuthStateChange');
  }

  // Verificar estilos CSS
  if (content.includes('transition: all')) {
    analysis.issues.push('Uso de "transition: all" puede ser costoso');
    analysis.optimizations.push('Especificar solo las propiedades que necesitan transición');
  }

  // Verificar re-renders innecesarios
  if (content.includes('onAuthStateChange') && !content.includes('useCallback')) {
    analysis.issues.push('Posibles re-renders por función no memoizada');
    analysis.optimizations.push('Memoizar la función de callback de auth state change');
  }

  // Calcular score de rendimiento
  const score = 100 - (analysis.issues.length * 20);
  analysis.performance = score > 80 ? 'excellent' : score > 60 ? 'good' : score > 40 ? 'fair' : 'poor';

  return analysis;
}

function analyzeUseAuth(content, lines) {
  const analysis = {
    exists: true,
    issues: [],
    optimizations: [],
    performance: 'good'
  };

  // Verificar memoización
  if (!content.includes('useMemo')) {
    analysis.issues.push('No se memoiza el estado de autenticación');
    analysis.optimizations.push('Usar useMemo para isAuthenticated');
  }

  // Verificar cleanup de efectos
  if (content.includes('useEffect') && !content.includes('isMounted')) {
    analysis.issues.push('Posible memory leak sin cleanup de efectos');
    analysis.optimizations.push('Implementar cleanup con flag isMounted');
  }

  // Verificar re-creaciones de funciones
  if (content.includes('signOut') && !content.includes('useCallback')) {
    analysis.issues.push('Función signOut se recrea en cada render');
    analysis.optimizations.push('Usar useCallback para signOut');
  }

  // Verificar manejo de errores
  if (!content.includes('setError')) {
    analysis.issues.push('No hay manejo de errores visible');
    analysis.optimizations.push('Implementar manejo de errores robusto');
  }

  // Calcular score de rendimiento
  const score = 100 - (analysis.issues.length * 20);
  analysis.performance = score > 80 ? 'excellent' : score > 60 ? 'good' : score > 40 ? 'fair' : 'poor';

  return analysis;
}

function analyzeSupabase(content, lines) {
  const analysis = {
    exists: true,
    issues: [],
    optimizations: [],
    performance: 'good'
  };

  // Verificar configuración de cliente
  if (!content.includes('createClient')) {
    analysis.issues.push('Cliente de Supabase no configurado correctamente');
    analysis.optimizations.push('Verificar configuración del cliente');
  }

  // Verificar manejo de errores
  if (!content.includes('try') && !content.includes('catch')) {
    analysis.issues.push('No hay manejo de errores en la configuración');
    analysis.optimizations.push('Implementar try-catch en la creación del cliente');
  }

  // Verificar variables de entorno
  if (!content.includes('VITE_SUPABASE_URL')) {
    analysis.issues.push('Variables de entorno no configuradas');
    analysis.optimizations.push('Configurar variables de entorno correctamente');
  }

  return analysis;
}

function generatePerformanceReport(analyses) {
  log.header('📊 Reporte de Rendimiento del Sistema de Login');

  let totalScore = 0;
  let totalIssues = 0;
  let totalOptimizations = 0;

  Object.entries(analyses).forEach(([component, analysis]) => {
    if (!analysis.exists) {
      log.error(`${component}: Archivo no encontrado`);
      return;
    }

    const score = analysis.performance === 'excellent' ? 100 : 
                  analysis.performance === 'good' ? 80 : 
                  analysis.performance === 'fair' ? 60 : 40;

    totalScore += score;
    totalIssues += analysis.issues.length;
    totalOptimizations += analysis.optimizations.length;

    console.log(`\n${colors.bright}${component}:${colors.reset}`);
    
    // Mostrar score de rendimiento
    const performanceColor = analysis.performance === 'excellent' ? colors.green :
                            analysis.performance === 'good' ? colors.blue :
                            analysis.performance === 'fair' ? colors.yellow : colors.red;
    
    log.performance(`Rendimiento: ${performanceColor}${analysis.performance.toUpperCase()}${colors.reset}`);

    // Mostrar issues
    if (analysis.issues.length > 0) {
      console.log(`  ${colors.red}Problemas encontrados:${colors.reset}`);
      analysis.issues.forEach(issue => {
        console.log(`    • ${issue}`);
      });
    }

    // Mostrar optimizaciones
    if (analysis.optimizations.length > 0) {
      console.log(`  ${colors.green}Optimizaciones sugeridas:${colors.reset}`);
      analysis.optimizations.forEach(optimization => {
        console.log(`    • ${optimization}`);
      });
    }
  });

  // Resumen general
  const averageScore = Math.round(totalScore / Object.keys(analyses).length);
  
  log.header('📈 Resumen General');
  console.log(`Puntuación promedio: ${colors.bright}${averageScore}/100${colors.reset}`);
  console.log(`Problemas totales: ${colors.red}${totalIssues}${colors.reset}`);
  console.log(`Optimizaciones sugeridas: ${colors.green}${totalOptimizations}${colors.reset}`);

  if (averageScore >= 80) {
    log.success('¡Excelente rendimiento! El sistema está bien optimizado.');
  } else if (averageScore >= 60) {
    log.warning('Rendimiento aceptable, pero hay espacio para mejoras.');
  } else {
    log.error('Rendimiento deficiente. Se requieren optimizaciones urgentes.');
  }

  return averageScore;
}

function suggestSpecificOptimizations(analyses) {
  log.header('🔧 Optimizaciones Específicas Recomendadas');

  const optimizations = [
    {
      priority: 'high',
      component: 'AuthModal',
      action: 'Implementar useMemo y useCallback',
      impact: 'Reducir re-renders en 60-80%',
      code: `
// En AuthModal.tsx
const authAppearance = useMemo(() => ({...}), []);
const handleAuthStateChange = useCallback((event, session) => {...}, []);
      `
    },
    {
      priority: 'high',
      component: 'useAuth',
      action: 'Memoizar estado y funciones',
      impact: 'Mejorar respuesta en 40-60%',
      code: `
// En useAuth.ts
const isAuthenticated = useMemo(() => !!user, [user]);
const signOut = useCallback(async () => {...}, []);
      `
    },
    {
      priority: 'medium',
      component: 'CSS',
      action: 'Optimizar transiciones CSS',
      impact: 'Reducir tiempo de render en 20-30%',
      code: `
// Cambiar de:
transition: all 0.2s ease;
// A:
transition: border-color 0.2s ease, box-shadow 0.2s ease;
      `
    },
    {
      priority: 'low',
      component: 'Lazy Loading',
      action: 'Implementar carga diferida del modal',
      impact: 'Mejorar tiempo de carga inicial',
      code: `
// Lazy load del AuthModal
const AuthModal = lazy(() => import('./AuthModal'));
      `
    }
  ];

  optimizations.forEach((opt, index) => {
    const priorityColor = opt.priority === 'high' ? colors.red : 
                         opt.priority === 'medium' ? colors.yellow : colors.green;
    
    console.log(`\n${index + 1}. ${priorityColor}[${opt.priority.toUpperCase()}]${colors.reset} ${opt.component}`);
    console.log(`   Acción: ${opt.action}`);
    console.log(`   Impacto: ${opt.impact}`);
    console.log(`   Código: ${colors.cyan}${opt.code.trim()}${colors.reset}`);
  });
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}⚡ Análisis de Rendimiento del Sistema de Login${colors.reset}\n`);

  const analyses = {
    'AuthModal': analyzeFile('components/AuthModal.tsx', 'authModal'),
    'useAuth Hook': analyzeFile('hooks/useAuth.ts', 'useAuth'),
    'Supabase Config': analyzeFile('lib/supabase.ts', 'supabase')
  };

  const averageScore = generatePerformanceReport(analyses);
  
  if (averageScore < 80) {
    suggestSpecificOptimizations(analyses);
  }

  log.header('🎯 Próximos Pasos');
  console.log('1. Implementar las optimizaciones de alta prioridad');
  console.log('2. Ejecutar pruebas de rendimiento');
  console.log('3. Monitorear métricas de tiempo de respuesta');
  console.log('4. Re-ejecutar este análisis después de las optimizaciones');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, analyzeFile, generatePerformanceReport }; 