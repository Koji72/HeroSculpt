#!/usr/bin/env node

/**
 * 🛡️ Script para Instalar Dependencias de Seguridad
 * 
 * Este script instala todas las dependencias necesarias para las mejoras de seguridad.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🛡️ Instalando dependencias de seguridad...\n');

try {
  // Verificar si estamos en el directorio correcto
  if (!fs.existsSync('package.json')) {
    console.error('❌ No se encontró package.json. Ejecuta este script desde la raíz del proyecto.');
    process.exit(1);
  }

  // Instalar dependencias de seguridad
  console.log('📦 Instalando express-rate-limit...');
  execSync('npm install express-rate-limit@^7.1.5', { stdio: 'inherit' });

  console.log('📦 Instalando helmet...');
  execSync('npm install helmet@^7.1.0', { stdio: 'inherit' });

  console.log('📦 Instalando winston (para logging)...');
  execSync('npm install winston@^3.11.0', { stdio: 'inherit' });

  console.log('📦 Instalando joi (para validación)...');
  execSync('npm install joi@^17.11.0', { stdio: 'inherit' });

  console.log('📦 Instalando csurf (para protección CSRF)...');
  execSync('npm install csurf@^1.11.0', { stdio: 'inherit' });

  console.log('\n✅ Todas las dependencias de seguridad instaladas correctamente!');
  
  console.log('\n📋 Dependencias instaladas:');
  console.log('  - express-rate-limit: Rate limiting');
  console.log('  - helmet: Headers de seguridad');
  console.log('  - winston: Sistema de logging');
  console.log('  - joi: Validación de datos');
  console.log('  - csurf: Protección CSRF');

  console.log('\n🚀 Próximos pasos:');
  console.log('1. Reinicia el servidor: npm run dev');
  console.log('2. Verifica que no hay errores en la consola');
  console.log('3. Prueba los endpoints con datos inválidos');
  console.log('4. Revisa los logs de seguridad en la consola');

} catch (error) {
  console.error('❌ Error instalando dependencias:', error.message);
  process.exit(1);
} 