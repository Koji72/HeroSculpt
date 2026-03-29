#!/usr/bin/env node

/**
 * 🛡️ Verificación de Seguridad Simplificada
 * Superhero 3D Customizer - 2025
 */

const fs = require('fs');
const path = require('path');

console.log('\n🛡️  VERIFICACIÓN DE SEGURIDAD - SUPERHERO 3D CUSTOMIZER');
console.log('='.repeat(60));

// Resultados
let passed = 0;
let warnings = 0;
let failed = 0;

function check(test, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} ${test}: ${status}`);
  if (details) console.log(`   ${details}`);
  
  if (status === 'PASS') passed++;
  else if (status === 'WARN') warnings++;
  else failed++;
}

console.log('\n📋 VERIFICANDO CONFIGURACIÓN DE SEGURIDAD...\n');

// 1. Verificar archivo .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
  
  if (missingVars.length === 0) {
    check('Variables de entorno críticas', 'PASS', 'Todas las variables requeridas están presentes');
  } else {
    check('Variables de entorno críticas', 'FAIL', `Faltan variables: ${missingVars.join(', ')}`);
  }
} else {
  check('Archivo .env', 'FAIL', 'Archivo .env no encontrado');
}

// 2. Verificar archivo .env.example
const envExamplePath = path.join(process.cwd(), 'env.example');
if (fs.existsSync(envExamplePath)) {
  check('Archivo .env.example', 'PASS', 'Archivo de ejemplo presente');
} else {
  check('Archivo .env.example', 'WARN', 'Archivo de ejemplo no encontrado');
}

// 3. Verificar configuración de Supabase
const supabasePath = path.join(process.cwd(), 'lib', 'supabase.ts');
if (fs.existsSync(supabasePath)) {
  const supabaseContent = fs.readFileSync(supabasePath, 'utf8');
  
  if (supabaseContent.includes('supabaseUrl && supabaseAnonKey')) {
    check('Validación de variables Supabase', 'PASS', 'Validación implementada');
  } else {
    check('Validación de variables Supabase', 'WARN', 'Falta validación de variables');
  }
  
  if (supabaseContent.includes('console.warn')) {
    check('Manejo de errores Supabase', 'PASS', 'Manejo de errores implementado');
  } else {
    check('Manejo de errores Supabase', 'WARN', 'Falta manejo de errores');
  }
} else {
  check('Configuración Supabase', 'FAIL', 'Archivo lib/supabase.ts no encontrado');
}

// 4. Verificar RLS en SQL
const sqlPath = path.join(process.cwd(), 'supabase-setup-clean.sql');
if (fs.existsSync(sqlPath)) {
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  
  if (sqlContent.includes('ENABLE ROW LEVEL SECURITY')) {
    check('Row Level Security (RLS)', 'PASS', 'RLS habilitado en tablas');
  } else {
    check('Row Level Security (RLS)', 'FAIL', 'RLS no configurado');
  }
  
  if (sqlContent.includes('CREATE POLICY')) {
    check('Políticas de seguridad', 'PASS', 'Políticas RLS configuradas');
  } else {
    check('Políticas de seguridad', 'FAIL', 'Políticas RLS no configuradas');
  }
} else {
  check('Configuración SQL', 'WARN', 'Archivo supabase-setup-clean.sql no encontrado');
}

// 5. Verificar dependencias de seguridad
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const securityDeps = ['helmet', 'cors', 'express-rate-limit', 'joi', 'winston'];
  const missingDeps = securityDeps.filter(dep => !dependencies[dep]);
  
  if (missingDeps.length === 0) {
    check('Dependencias de seguridad', 'PASS', 'Todas las dependencias de seguridad están instaladas');
  } else {
    check('Dependencias de seguridad', 'WARN', `Faltan dependencias: ${missingDeps.join(', ')}`);
  }
} else {
  check('package.json', 'FAIL', 'Archivo package.json no encontrado');
}

// 6. Verificar configuración del servidor
const serverPath = path.join(process.cwd(), 'complete-server.cjs');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('helmet')) {
    check('Headers de seguridad (Helmet)', 'PASS', 'Helmet configurado');
  } else {
    check('Headers de seguridad (Helmet)', 'FAIL', 'Helmet no configurado');
  }
  
  if (serverContent.includes('cors')) {
    check('Configuración CORS', 'PASS', 'CORS configurado');
  } else {
    check('Configuración CORS', 'FAIL', 'CORS no configurado');
  }
  
  if (serverContent.includes('rate-limit') || serverContent.includes('express-rate-limit')) {
    check('Rate Limiting', 'PASS', 'Rate limiting configurado');
  } else {
    check('Rate Limiting', 'FAIL', 'Rate limiting no configurado');
  }
  
  if (serverContent.includes('joi') || serverContent.includes('Joi')) {
    check('Validación de entrada (Joi)', 'PASS', 'Validación Joi implementada');
  } else {
    check('Validación de entrada (Joi)', 'WARN', 'Validación Joi no encontrada');
  }
  
  if (serverContent.includes('winston') || serverContent.includes('securityLogger')) {
    check('Logging de seguridad', 'PASS', 'Logging de seguridad implementado');
  } else {
    check('Logging de seguridad', 'WARN', 'Logging de seguridad no encontrado');
  }
} else {
  check('Servidor principal', 'WARN', 'Archivo complete-server.cjs no encontrado');
}

// 7. Verificar configuración de Vite
const vitePath = path.join(process.cwd(), 'vite.config.ts');
if (fs.existsSync(vitePath)) {
  const viteContent = fs.readFileSync(vitePath, 'utf8');
  
  if (viteContent.includes('import.meta.env')) {
    check('Variables de entorno Vite', 'PASS', 'Variables de entorno configuradas');
  } else {
    check('Variables de entorno Vite', 'WARN', 'Variables de entorno no configuradas');
  }
} else {
  check('Configuración Vite', 'WARN', 'Archivo vite.config.ts no encontrado');
}

// 8. Verificar archivos de seguridad
const securityFiles = ['AUDITORIA_SEGURIDAD_2025.md'];
securityFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    check(`Archivo ${file}`, 'PASS', 'Archivo de seguridad presente');
  } else {
    check(`Archivo ${file}`, 'WARN', `Archivo ${file} no encontrado`);
  }
});

// Mostrar resumen
console.log('\n' + '='.repeat(60));
console.log('📊 ESTADÍSTICAS FINALES');
console.log('='.repeat(60));

console.log(`✅ Tests pasados: ${passed}`);
console.log(`⚠️  Advertencias: ${warnings}`);
console.log(`❌ Tests fallidos: ${failed}`);

const total = passed + warnings + failed;
const score = total > 0 ? Math.round((passed / total) * 100) : 0;

console.log('\n' + '='.repeat(60));
console.log('🎯 PUNTUACIÓN FINAL');
console.log('='.repeat(60));

if (score >= 90) {
  console.log(`🏆 PUNTUACIÓN: ${score}/100 - EXCELENTE`);
  console.log('✅ El proyecto está listo para producción');
} else if (score >= 70) {
  console.log(`📊 PUNTUACIÓN: ${score}/100 - BUENO`);
  console.log('⚠️  Se recomiendan algunas mejoras antes de producción');
} else {
  console.log(`📊 PUNTUACIÓN: ${score}/100 - REQUIERE MEJORAS`);
  console.log('❌ Se requieren correcciones antes de producción');
}

console.log('\n' + '='.repeat(60));
console.log('📋 RECOMENDACIONES');
console.log('='.repeat(60));

if (failed === 0 && warnings === 0) {
  console.log('🎉 ¡FELICITACIONES! El proyecto tiene excelente seguridad');
} else {
  if (failed > 0) {
    console.log('🔴 CORREGIR INMEDIATAMENTE los tests fallidos');
  }
  if (warnings > 0) {
    console.log('🟡 MEJORAR A CORTO PLAZO las advertencias');
  }
}

console.log('\n📖 Consulta AUDITORIA_SEGURIDAD_2025.md para detalles completos');
console.log('🛡️  Ejecuta este script regularmente para mantener la seguridad');
console.log('\n'); 