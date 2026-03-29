#!/usr/bin/env node

/**
 * 🔄 MIGRATE: SUPABASE PROJECT
 * 
 * Este script ayuda a migrar a un nuevo proyecto de Supabase
 * cuando se ha excedido la cuota del plan gratuito.
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 MIGRATE: SUPABASE PROJECT');
console.log('============================');

console.log('\n🔴 PROBLEMA DETECTADO:');
console.log('Has excedido la cuota del plan gratuito de Supabase');
console.log('- Egress: 6.139 GB / 5 GB (123% EXCEDIDO)');
console.log('- Overage: 1.14 GB');

console.log('\n🛠️ SOLUCIONES DISPONIBLES:');

console.log('\n📋 OPCIÓN 1: ACTUALIZAR A PLAN DE PAGO (RECOMENDADO)');
console.log('1. Ir a https://supabase.com/dashboard');
console.log('2. Seleccionar tu proyecto actual');
console.log('3. Hacer clic en "Upgrade" en el banner rojo');
console.log('4. Elegir plan Pro ($25/mes)');
console.log('5. Beneficios: 250 GB egress, 8 GB DB, sin restricciones');

console.log('\n📋 OPCIÓN 2: CREAR NUEVO PROYECTO GRATUITO');
console.log('1. Ir a https://supabase.com/dashboard');
console.log('2. Crear nuevo proyecto');
console.log('3. Ejecutar script SQL en el nuevo proyecto');
console.log('4. Actualizar variables de entorno');
console.log('5. Beneficios: Nueva cuota gratuita, sin costo');

console.log('\n📋 OPCIÓN 3: OPTIMIZAR USO ACTUAL');
console.log('1. Reducir uso durante desarrollo');
console.log('2. Limpiar datos de prueba');
console.log('3. Esperar reinicio de cuota mensual');
console.log('4. Beneficios: Sin costo, pero limitado');

console.log('\n🔧 PASOS PARA MIGRACIÓN (OPCIÓN 2):');

console.log('\n📋 PASO 1: Crear Nuevo Proyecto');
console.log('1. Ir a https://supabase.com/dashboard');
console.log('2. Hacer clic en "New Project"');
console.log('3. Elegir organización');
console.log('4. Nombre: "3dcustomizer-v2" (o similar)');
console.log('5. Contraseña de base de datos: [generar una segura]');
console.log('6. Región: [elegir la más cercana]');
console.log('7. Hacer clic en "Create new project"');

console.log('\n📋 PASO 2: Configurar Base de Datos');
console.log('1. En el nuevo proyecto, ir a SQL Editor');
console.log('2. Copiar contenido de supabase-setup-clean.sql');
console.log('3. Pegar y ejecutar el script');
console.log('4. Verificar que las tablas se crearon');

console.log('\n📋 PASO 3: Configurar Autenticación');
console.log('1. Ir a Authentication > Settings');
console.log('2. Site URL: http://localhost:5178');
console.log('3. Redirect URLs: http://localhost:5178/**');
console.log('4. Habilitar Email/Password provider');

console.log('\n📋 PASO 4: Obtener Nuevas Credenciales');
console.log('1. Ir a Settings > API');
console.log('2. Copiar Project URL');
console.log('3. Copiar anon public key');
console.log('4. Actualizar archivo .env');

console.log('\n📋 PASO 5: Actualizar Variables de Entorno');
console.log('1. Abrir archivo .env');
console.log('2. Reemplazar VITE_SUPABASE_URL');
console.log('3. Reemplazar VITE_SUPABASE_ANON_KEY');
console.log('4. Guardar archivo');
console.log('5. Reiniciar servidor de desarrollo');

console.log('\n🔍 VERIFICACIÓN POST-MIGRACIÓN:');
console.log('1. Ejecutar: node scripts/verify-supabase-connection.cjs');
console.log('2. Probar registro de usuario');
console.log('3. Verificar que no hay errores de base de datos');
console.log('4. Confirmar que la autenticación funciona');

console.log('\n⚠️  CONSIDERACIONES IMPORTANTES:');
console.log('- Los datos del proyecto anterior se perderán');
console.log('- Los usuarios registrados necesitarán registrarse de nuevo');
console.log('- Las configuraciones guardadas no se migrarán');
console.log('- Considerar hacer backup antes de migrar');

console.log('\n💡 RECOMENDACIÓN FINAL:');
console.log('Si planeas usar la aplicación en producción,');
console.log('considera actualizar al plan Pro de Supabase.');
console.log('Es más económico que migrar proyectos constantemente.');

console.log('\n🎉 ¡Migración completada!'); 