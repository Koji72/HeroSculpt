#!/usr/bin/env node

/**
 * Script de Verificación de Configuración del Sistema de Login
 * 
 * Este script verifica que todas las configuraciones necesarias para el sistema
 * de autenticación estén correctamente configuradas.
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

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkEnvFile() {
  log.header('🔍 Verificando Archivo de Variables de Entorno');
  
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.example');
  
  if (checkFileExists(envPath)) {
    log.success('Archivo .env encontrado');
    
    // Leer y verificar contenido
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
    
    if (missingVars.length === 0) {
      log.success('Todas las variables de Supabase están configuradas');
    } else {
      log.error(`Variables faltantes: ${missingVars.join(', ')}`);
      return false;
    }
  } else {
    log.error('Archivo .env no encontrado');
    if (checkFileExists(envExamplePath)) {
      log.info('Archivo env.example encontrado - puedes copiarlo como .env');
    }
    return false;
  }
  
  return true;
}

function checkSupabaseConfig() {
  log.header('🔧 Verificando Configuración de Supabase');
  
  const supabasePath = path.join(process.cwd(), 'lib', 'supabase.ts');
  
  if (checkFileExists(supabasePath)) {
    log.success('Archivo lib/supabase.ts encontrado');
    
    const content = fs.readFileSync(supabasePath, 'utf8');
    
    // Verificar que el archivo tenga la configuración básica
    if (content.includes('createClient') && content.includes('VITE_SUPABASE_URL')) {
      log.success('Configuración básica de Supabase presente');
    } else {
      log.error('Configuración básica de Supabase incompleta');
      return false;
    }
  } else {
    log.error('Archivo lib/supabase.ts no encontrado');
    return false;
  }
  
  return true;
}

function checkAuthHook() {
  log.header('🎣 Verificando Hook de Autenticación');
  
  const hookPath = path.join(process.cwd(), 'hooks', 'useAuth.ts');
  
  if (checkFileExists(hookPath)) {
    log.success('Hook useAuth.ts encontrado');
    
    const content = fs.readFileSync(hookPath, 'utf8');
    
    // Verificar funcionalidades básicas
    const checks = [
      { name: 'Importación de Supabase', check: content.includes('@supabase/supabase-js') },
      { name: 'Estado de usuario', check: content.includes('useState') && content.includes('user') },
      { name: 'Manejo de sesión', check: content.includes('getSession') },
      { name: 'Escucha de cambios', check: content.includes('onAuthStateChange') },
      { name: 'Función de logout', check: content.includes('signOut') }
    ];
    
    let allChecksPassed = true;
    checks.forEach(({ name, check }) => {
      if (check) {
        log.success(name);
      } else {
        log.error(name);
        allChecksPassed = false;
      }
    });
    
    return allChecksPassed;
  } else {
    log.error('Hook useAuth.ts no encontrado');
    return false;
  }
}

function checkAuthModal() {
  log.header('🪟 Verificando Modal de Autenticación');
  
  const modalPath = path.join(process.cwd(), 'components', 'AuthModal.tsx');
  
  if (checkFileExists(modalPath)) {
    log.success('Componente AuthModal.tsx encontrado');
    
    const content = fs.readFileSync(modalPath, 'utf8');
    
    // Verificar funcionalidades básicas
    const checks = [
      { name: 'Importación de Auth UI', check: content.includes('@supabase/auth-ui-react') },
      { name: 'Configuración de tema', check: content.includes('ThemeSupa') },
      { name: 'Manejo de eventos', check: content.includes('onAuthStateChange') },
      { name: 'Estilos personalizados', check: content.includes('supabase-auth-ui_ui-input') }
    ];
    
    let allChecksPassed = true;
    checks.forEach(({ name, check }) => {
      if (check) {
        log.success(name);
      } else {
        log.error(name);
        allChecksPassed = false;
      }
    });
    
    return allChecksPassed;
  } else {
    log.error('Componente AuthModal.tsx no encontrado');
    return false;
  }
}

function checkPackageDependencies() {
  log.header('📦 Verificando Dependencias');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (checkFileExists(packagePath)) {
    log.success('package.json encontrado');
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const requiredDeps = [
      '@supabase/supabase-js',
      '@supabase/auth-ui-react',
      '@supabase/auth-ui-shared'
    ];
    
    const missingDeps = requiredDeps.filter(dep => !dependencies[dep]);
    
    if (missingDeps.length === 0) {
      log.success('Todas las dependencias de Supabase están instaladas');
    } else {
      log.error(`Dependencias faltantes: ${missingDeps.join(', ')}`);
      log.info('Ejecuta: npm install ' + missingDeps.join(' '));
      return false;
    }
  } else {
    log.error('package.json no encontrado');
    return false;
  }
  
  return true;
}

function checkViteConfig() {
  log.header('⚡ Verificando Configuración de Vite');
  
  const vitePath = path.join(process.cwd(), 'vite.config.ts');
  
  if (checkFileExists(vitePath)) {
    log.success('vite.config.ts encontrado');
    
    const content = fs.readFileSync(vitePath, 'utf8');
    
    if (content.includes('VITE_SUPABASE_URL') && content.includes('VITE_SUPABASE_ANON_KEY')) {
      log.success('Variables de Supabase configuradas en Vite');
    } else {
      log.warning('Variables de Supabase no encontradas en la configuración de Vite');
    }
  } else {
    log.warning('vite.config.ts no encontrado');
  }
  
  return true;
}

function generateReport(results) {
  log.header('📊 Reporte de Verificación');
  
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
  
  console.log(`\n${colors.bright}Resumen:${colors.reset}`);
  console.log(`✅ Exitosos: ${colors.green}${passed}${colors.reset}`);
  console.log(`❌ Fallidos: ${colors.red}${failed}${colors.reset}`);
  console.log(`📊 Total: ${colors.blue}${total}${colors.reset}`);
  
  if (failed === 0) {
    log.success('\n🎉 ¡Todas las verificaciones pasaron! El sistema de login está correctamente configurado.');
  } else {
    log.error('\n⚠️  Algunas verificaciones fallaron. Revisa los errores arriba.');
    
    const failedChecks = results.filter(r => !r.passed);
    console.log(`\n${colors.bright}Problemas encontrados:${colors.reset}`);
    failedChecks.forEach(check => {
      console.log(`• ${colors.red}${check.name}${colors.reset}`);
    });
  }
  
  return failed === 0;
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}🔐 Verificación del Sistema de Login${colors.reset}\n`);
  
  const checks = [
    { name: 'Variables de Entorno', fn: checkEnvFile },
    { name: 'Configuración de Supabase', fn: checkSupabaseConfig },
    { name: 'Hook de Autenticación', fn: checkAuthHook },
    { name: 'Modal de Autenticación', fn: checkAuthModal },
    { name: 'Dependencias', fn: checkPackageDependencies },
    { name: 'Configuración de Vite', fn: checkViteConfig }
  ];
  
  const results = [];
  
  for (const check of checks) {
    try {
      const passed = check.fn();
      results.push({ name: check.name, passed });
    } catch (error) {
      log.error(`Error en ${check.name}: ${error.message}`);
      results.push({ name: check.name, passed: false });
    }
  }
  
  const allPassed = generateReport(results);
  
  if (!allPassed) {
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(error => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main, checkEnvFile, checkSupabaseConfig, checkAuthHook, checkAuthModal }; 