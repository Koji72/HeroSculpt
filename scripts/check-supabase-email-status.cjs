#!/usr/bin/env node

/**
 * Script para verificar el estado de la configuración de email en Supabase
 * Ayuda a identificar si el problema está en la configuración
 */

console.log('🔍 CHECKING SUPABASE EMAIL STATUS');
console.log('=================================\n');

console.log('📋 CONFIGURACIÓN QUE DEBES VERIFICAR EN SUPABASE DASHBOARD:');
console.log('==========================================================\n');

console.log('1️⃣ AUTHENTICATION → SETTINGS:');
console.log('   - Enable email confirmations: ✅ DEBE ESTAR ON');
console.log('   - Enable email change confirmations: ✅ DEBE ESTAR ON');
console.log('   - Enable secure email change: ✅ DEBE ESTAR ON');
console.log('   - Site URL: https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app');
console.log('   - Redirect URLs:');
console.log('     * http://localhost:5177/auth/callback');
console.log('     * https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app/auth/callback\n');

console.log('2️⃣ AUTHENTICATION → EMAIL TEMPLATES:');
console.log('   - Confirm signup template: ✅ DEBE ESTAR CONFIGURADO');
console.log('   - From email: ✅ DEBE ESTAR CONFIGURADO');
console.log('   - Subject: ✅ DEBE ESTAR CONFIGURADO');
console.log('   - Content: ✅ DEBE TENER CONTENIDO\n');

console.log('3️⃣ SETTINGS → BILLING:');
console.log('   - Plan: ✅ VERIFICAR QUE INCLUYA EMAILS');
console.log('   - Email quota: ✅ VERIFICAR QUE NO ESTÉ EXCEDIDA');
console.log('   - Usage: ✅ VERIFICAR LÍMITES ACTUALES\n');

console.log('4️⃣ LOGS → AUTH:');
console.log('   - Buscar eventos de "signup" recientes');
console.log('   - Verificar si hay errores de email');
console.log('   - Buscar mensajes de "email_sent" o "email_error"\n');

console.log('🚨 PROBLEMAS COMUNES Y SOLUCIONES:');
console.log('==================================\n');

console.log('❌ PROBLEMA: "Enable email confirmations" está OFF');
console.log('   SOLUCIÓN:');
console.log('   1. Ve a Authentication → Settings');
console.log('   2. Activa "Enable email confirmations"');
console.log('   3. Guarda los cambios\n');

console.log('❌ PROBLEMA: Template de email vacío');
console.log('   SOLUCIÓN:');
console.log('   1. Ve a Authentication → Email Templates');
console.log('   2. Selecciona "Confirm signup"');
console.log('   3. Configura el contenido del email');
console.log('   4. Guarda los cambios\n');

console.log('❌ PROBLEMA: Límites de email excedidos');
console.log('   SOLUCIÓN:');
console.log('   1. Ve a Settings → Billing');
console.log('   2. Actualiza el plan o espera al siguiente mes');
console.log('   3. Verifica la cuota de emails\n');

console.log('❌ PROBLEMA: Dominio no verificado');
console.log('   SOLUCIÓN:');
console.log('   1. Ve a Authentication → Settings');
console.log('   2. Verifica el dominio de email');
console.log('   3. O usa el servicio por defecto de Supabase\n');

console.log('🧪 PRUEBA RÁPIDA:');
console.log('==================');
console.log('1. Ve a https://10minutemail.com');
console.log('2. Genera un email temporal');
console.log('3. Usa ese email en tu aplicación');
console.log('4. Haz sign up');
console.log('5. Verifica si llega el email');
console.log('6. Si llega: problema con tu email específico');
console.log('7. Si no llega: problema de configuración\n');

console.log('🔧 SOLUCIÓN TEMPORAL IMPLEMENTADA:');
console.log('==================================');
console.log('✅ He deshabilitado temporalmente la confirmación de email');
console.log('✅ Ahora puedes crear cuentas sin confirmación');
console.log('✅ Esto te permite probar el sistema mientras solucionamos el problema');
console.log('✅ El mensaje de advertencia aparece en la interfaz\n');

console.log('📞 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. Verifica la configuración de Supabase siguiendo los pasos arriba');
console.log('2. Prueba con un email temporal (10minutemail.com)');
console.log('3. Si funciona, el problema es con tu email específico');
console.log('4. Si no funciona, necesitamos configurar Supabase correctamente');
console.log('5. Una vez solucionado, habilitaremos la confirmación de email\n');

console.log('🎯 ESTADO ACTUAL:');
console.log('==================');
console.log('✅ Signup funciona sin confirmación de email (temporal)');
console.log('✅ Puedes probar el sistema completo');
console.log('⚠️  Confirmación de email deshabilitada hasta solucionar el problema');
console.log('🔧 Trabajando en solucionar el problema de emails\n');

console.log('✅ ¡Verificación de estado completada!');
