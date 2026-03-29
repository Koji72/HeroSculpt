#!/usr/bin/env node

/**
 * 🛡️ Auditoría de Seguridad Automatizada
 * Superhero 3D Customizer - 2025
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Función para imprimir con colores
function print(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

// Función para imprimir título
function printTitle(text) {
  console.log('\n' + '='.repeat(60));
  print('bright', `🛡️  ${text}`);
  console.log('='.repeat(60));
}

// Función para imprimir resultado
function printResult(test, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  const color = status === 'PASS' ? 'green' : status === 'WARN' ? 'yellow' : 'red';
  print(color, `${icon} ${test}: ${status}`);
  if (details) {
    print('cyan', `   ${details}`);
  }
}

// Resultados de la auditoría
const auditResults = {
  passed: 0,
  warnings: 0,
  failed: 0,
  tests: []
};

// Función para agregar resultado
function addResult(test, status, details = '') {
  auditResults.tests.push({ test, status, details });
  if (status === 'PASS') auditResults.passed++;
  else if (status === 'WARN') auditResults.warnings++;
  else auditResults.failed++;
}

// 1. Verificar archivo .env
function checkEnvFile() {
  printTitle('VERIFICANDO ARCHIVO .env');
  
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.example');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Verificar variables críticas
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_STRIPE_PUBLISHABLE_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => 
      !envContent.includes(varName)
    );
    
    if (missingVars.length === 0) {
      addResult('Variables de entorno críticas', 'PASS', 'Todas las variables requeridas están presentes');
    } else {
      addResult('Variables de entorno críticas', 'FAIL', `Faltan variables: ${missingVars.join(', ')}`);
    }
    
    // Verificar que no hay claves secretas expuestas
    const secretPatterns = [
      /sk_live_/,
      /sk_test_/,
      /pk_live_/,
      /pk_test_/,
      /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/
    ];
    
    const exposedSecrets = secretPatterns.filter(pattern => 
      pattern.test(envContent)
    );
    
    if (exposedSecrets.length === 0) {
      addResult('Claves secretas', 'PASS', 'No se detectaron claves secretas expuestas');
    } else {
      addResult('Claves secretas', 'WARN', 'Se detectaron posibles claves secretas - verificar');
    }
    
  } else {
    addResult('Archivo .env', 'FAIL', 'Archivo .env no encontrado');
  }
  
  // Verificar archivo de ejemplo
  if (fs.existsSync(envExamplePath)) {
    addResult('Archivo .env.example', 'PASS', 'Archivo de ejemplo presente');
  } else {
    addResult('Archivo .env.example', 'WARN', 'Archivo de ejemplo no encontrado');
  }
}

// 2. Verificar dependencias de seguridad
function checkSecurityDependencies() {
  printTitle('VERIFICANDO DEPENDENCIAS DE SEGURIDAD');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const securityDeps = [
      'helmet',
      'cors',
      'express-rate-limit',
      'joi',
      'winston'
    ];
    
    const missingDeps = securityDeps.filter(dep => !dependencies[dep]);
    
    if (missingDeps.length === 0) {
      addResult('Dependencias de seguridad', 'PASS', 'Todas las dependencias de seguridad están instaladas');
    } else {
      addResult('Dependencias de seguridad', 'WARN', `Faltan dependencias: ${missingDeps.join(', ')}`);
    }
    
    // Verificar versiones
    const criticalDeps = {
      'helmet': '7.0.0',
      'cors': '2.8.0',
      'express-rate-limit': '7.0.0'
    };
    
    Object.entries(criticalDeps).forEach(([dep, minVersion]) => {
      if (dependencies[dep]) {
        const version = dependencies[dep].replace(/^[\^~]/, '');
        if (version >= minVersion) {
          addResult(`Versión ${dep}`, 'PASS', `v${version} >= v${minVersion}`);
        } else {
          addResult(`Versión ${dep}`, 'WARN', `v${version} < v${minVersion} - actualizar recomendado`);
        }
      }
    });
    
  } else {
    addResult('package.json', 'FAIL', 'Archivo package.json no encontrado');
  }
}

// 3. Verificar configuración de Supabase
function checkSupabaseConfig() {
  printTitle('VERIFICANDO CONFIGURACIÓN DE SUPABASE');
  
  const supabasePath = path.join(process.cwd(), 'lib', 'supabase.ts');
  
  if (fs.existsSync(supabasePath)) {
    const supabaseContent = fs.readFileSync(supabasePath, 'utf8');
    
    // Verificar validación de variables de entorno
    if (supabaseContent.includes('supabaseUrl && supabaseAnonKey')) {
      addResult('Validación de variables Supabase', 'PASS', 'Validación implementada');
    } else {
      addResult('Validación de variables Supabase', 'WARN', 'Falta validación de variables');
    }
    
    // Verificar manejo de errores
    if (supabaseContent.includes('console.warn') || supabaseContent.includes('try-catch')) {
      addResult('Manejo de errores Supabase', 'PASS', 'Manejo de errores implementado');
    } else {
      addResult('Manejo de errores Supabase', 'WARN', 'Falta manejo de errores');
    }
    
  } else {
    addResult('Configuración Supabase', 'FAIL', 'Archivo lib/supabase.ts no encontrado');
  }
  
  // Verificar archivo SQL de configuración
  const sqlPath = path.join(process.cwd(), 'supabase-setup-clean.sql');
  
  if (fs.existsSync(sqlPath)) {
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Verificar RLS
    if (sqlContent.includes('ENABLE ROW LEVEL SECURITY')) {
      addResult('Row Level Security (RLS)', 'PASS', 'RLS habilitado en tablas');
    } else {
      addResult('Row Level Security (RLS)', 'FAIL', 'RLS no configurado');
    }
    
    // Verificar políticas de seguridad
    if (sqlContent.includes('CREATE POLICY')) {
      addResult('Políticas de seguridad', 'PASS', 'Políticas RLS configuradas');
    } else {
      addResult('Políticas de seguridad', 'FAIL', 'Políticas RLS no configuradas');
    }
    
  } else {
    addResult('Configuración SQL', 'WARN', 'Archivo supabase-setup-clean.sql no encontrado');
  }
}

// 4. Verificar configuración del servidor
function checkServerSecurity() {
  printTitle('VERIFICANDO CONFIGURACIÓN DEL SERVIDOR');
  
  const serverPath = path.join(process.cwd(), 'complete-server.cjs');
  
  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Verificar Helmet
    if (serverContent.includes('helmet')) {
      addResult('Headers de seguridad (Helmet)', 'PASS', 'Helmet configurado');
    } else {
      addResult('Headers de seguridad (Helmet)', 'FAIL', 'Helmet no configurado');
    }
    
    // Verificar CORS
    if (serverContent.includes('cors')) {
      addResult('Configuración CORS', 'PASS', 'CORS configurado');
    } else {
      addResult('Configuración CORS', 'FAIL', 'CORS no configurado');
    }
    
    // Verificar Rate Limiting
    if (serverContent.includes('rate-limit') || serverContent.includes('express-rate-limit')) {
      addResult('Rate Limiting', 'PASS', 'Rate limiting configurado');
    } else {
      addResult('Rate Limiting', 'FAIL', 'Rate limiting no configurado');
    }
    
    // Verificar validación Joi
    if (serverContent.includes('joi') || serverContent.includes('Joi')) {
      addResult('Validación de entrada (Joi)', 'PASS', 'Validación Joi implementada');
    } else {
      addResult('Validación de entrada (Joi)', 'WARN', 'Validación Joi no encontrada');
    }
    
    // Verificar logging de seguridad
    if (serverContent.includes('winston') || serverContent.includes('securityLogger')) {
      addResult('Logging de seguridad', 'PASS', 'Logging de seguridad implementado');
    } else {
      addResult('Logging de seguridad', 'WARN', 'Logging de seguridad no encontrado');
    }
    
  } else {
    addResult('Servidor principal', 'WARN', 'Archivo complete-server.cjs no encontrado');
  }
}

// 5. Verificar configuración de Vite
function checkViteConfig() {
  printTitle('VERIFICANDO CONFIGURACIÓN DE VITE');
  
  const vitePath = path.join(process.cwd(), 'vite.config.ts');
  
  if (fs.existsSync(vitePath)) {
    const viteContent = fs.readFileSync(vitePath, 'utf8');
    
    // Verificar definición de variables de entorno
    if (viteContent.includes('import.meta.env')) {
      addResult('Variables de entorno Vite', 'PASS', 'Variables de entorno configuradas');
    } else {
      addResult('Variables de entorno Vite', 'WARN', 'Variables de entorno no configuradas');
    }
    
    // Verificar que no se exponen claves secretas
    const secretPatterns = [
      /VITE_.*SECRET/,
      /VITE_.*KEY.*sk_/,
      /VITE_.*PASSWORD/
    ];
    
    const exposedSecrets = secretPatterns.filter(pattern => 
      pattern.test(viteContent)
    );
    
    if (exposedSecrets.length === 0) {
      addResult('Exposición de claves secretas', 'PASS', 'No se detectaron claves secretas expuestas');
    } else {
      addResult('Exposición de claves secretas', 'FAIL', 'Se detectaron claves secretas expuestas');
    }
    
  } else {
    addResult('Configuración Vite', 'WARN', 'Archivo vite.config.ts no encontrado');
  }
}

// 6. Verificar archivos de seguridad
function checkSecurityFiles() {
  printTitle('VERIFICANDO ARCHIVOS DE SEGURIDAD');
  
  const securityFiles = [
    'security-logs.json',
    'AUDITORIA_SEGURIDAD_2025.md',
    'docs/SECURITY_IMPROVEMENTS_2025.md'
  ];
  
  securityFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      addResult(`Archivo ${file}`, 'PASS', 'Archivo de seguridad presente');
    } else {
      addResult(`Archivo ${file}`, 'WARN', `Archivo ${file} no encontrado`);
    }
  });
}

// 7. Verificar vulnerabilidades de dependencias
function checkVulnerabilities() {
  printTitle('VERIFICANDO VULNERABILIDADES DE DEPENDENCIAS');
  
  try {
    // Verificar si npm audit está disponible
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(auditResult);
    
    const vulnerabilities = auditData.metadata?.vulnerabilities || {};
    const critical = vulnerabilities.critical || 0;
    const high = vulnerabilities.high || 0;
    const moderate = vulnerabilities.moderate || 0;
    const low = vulnerabilities.low || 0;
    
    if (critical === 0 && high === 0) {
      addResult('Vulnerabilidades críticas y altas', 'PASS', `Críticas: ${critical}, Altas: ${high}`);
    } else {
      addResult('Vulnerabilidades críticas y altas', 'FAIL', `Críticas: ${critical}, Altas: ${high}`);
    }
    
    if (moderate === 0 && low === 0) {
      addResult('Vulnerabilidades moderadas y bajas', 'PASS', `Moderadas: ${moderate}, Bajas: ${low}`);
    } else {
      addResult('Vulnerabilidades moderadas y bajas', 'WARN', `Moderadas: ${moderate}, Bajas: ${low}`);
    }
    
  } catch (error) {
    addResult('Auditoría de dependencias', 'WARN', 'No se pudo ejecutar npm audit');
  }
}

// Función principal
function runSecurityAudit() {
  print('bright', '\n🛡️  INICIANDO AUDITORÍA DE SEGURIDAD AUTOMATIZADA');
  print('cyan', 'Superhero 3D Customizer - 2025\n');
  
  // Ejecutar todas las verificaciones
  checkEnvFile();
  checkSecurityDependencies();
  checkSupabaseConfig();
  checkServerSecurity();
  checkViteConfig();
  checkSecurityFiles();
  checkVulnerabilities();
  
  // Mostrar resumen
  printTitle('RESUMEN DE LA AUDITORÍA');
  
  auditResults.tests.forEach(test => {
    printResult(test.test, test.status, test.details);
  });
  
  console.log('\n' + '='.repeat(60));
  print('bright', '📊 ESTADÍSTICAS FINALES');
  console.log('='.repeat(60));
  
  print('green', `✅ Tests pasados: ${auditResults.passed}`);
  print('yellow', `⚠️  Advertencias: ${auditResults.warnings}`);
  print('red', `❌ Tests fallidos: ${auditResults.failed}`);
  
  const total = auditResults.passed + auditResults.warnings + auditResults.failed;
  const score = Math.round((auditResults.passed / total) * 100);
  
  console.log('\n' + '='.repeat(60));
  print('bright', '🎯 PUNTUACIÓN FINAL');
  console.log('='.repeat(60));
  
  if (score >= 90) {
    print('green', `🏆 PUNTUACIÓN: ${score}/100 - EXCELENTE`);
    print('green', '✅ El proyecto está listo para producción');
  } else if (score >= 70) {
    print('yellow', `📊 PUNTUACIÓN: ${score}/100 - BUENO`);
    print('yellow', '⚠️  Se recomiendan algunas mejoras antes de producción');
  } else {
    print('red', `📊 PUNTUACIÓN: ${score}/100 - REQUIERE MEJORAS`);
    print('red', '❌ Se requieren correcciones antes de producción');
  }
  
  console.log('\n' + '='.repeat(60));
  print('bright', '📋 RECOMENDACIONES');
  console.log('='.repeat(60));
  
  if (auditResults.failed > 0) {
    print('red', '🔴 CORREGIR INMEDIATAMENTE:');
    auditResults.tests.filter(t => t.status === 'FAIL').forEach(test => {
      print('red', `   • ${test.test}: ${test.details}`);
    });
  }
  
  if (auditResults.warnings > 0) {
    print('yellow', '🟡 MEJORAR A CORTO PLAZO:');
    auditResults.tests.filter(t => t.status === 'WARN').forEach(test => {
      print('yellow', `   • ${test.test}: ${test.details}`);
    });
  }
  
  if (auditResults.failed === 0 && auditResults.warnings === 0) {
    print('green', '🎉 ¡FELICITACIONES! El proyecto tiene excelente seguridad');
  }
  
  console.log('\n' + '='.repeat(60));
  print('bright', '📄 REPORTE COMPLETO');
  console.log('='.repeat(60));
  print('cyan', '📖 Consulta AUDITORIA_SEGURIDAD_2025.md para detalles completos');
  print('cyan', '🛡️  Ejecuta este script regularmente para mantener la seguridad');
  
  console.log('\n');
}

// Ejecutar auditoría
if (require.main === module) {
  runSecurityAudit();
}

module.exports = { runSecurityAudit, auditResults }; 