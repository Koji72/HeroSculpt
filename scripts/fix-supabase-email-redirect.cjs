#!/usr/bin/env node

/**
 * Script para verificar y configurar Supabase para el problema de redirección de email
 * Este script te guía paso a paso para configurar correctamente Supabase Dashboard
 */

console.log('🔧 SUPABASE EMAIL REDIRECT CONFIGURATION FIX');
console.log('============================================\n');

console.log('🚨 PROBLEMA IDENTIFICADO:');
console.log('==========================');
console.log('El email de confirmación sigue redirigiendo a Vercel en lugar de a tu aplicación.');
console.log('Esto indica que la configuración de Supabase Dashboard necesita ser actualizada.\n');

console.log('📋 PASOS PARA SOLUCIONAR:');
console.log('=========================\n');

console.log('1️⃣ ACCEDER AL DASHBOARD DE SUPABASE:');
console.log('   - Ve a: https://supabase.com/dashboard');
console.log('   - Inicia sesión con tu cuenta');
console.log('   - Selecciona tu proyecto: arhcbrvdtehxyeuplvpt\n');

console.log('2️⃣ CONFIGURAR SITE URLS:');
console.log('   - Ve a: Authentication → Settings');
console.log('   - En la sección "Site URL", asegúrate de tener:');
console.log('     ✅ http://localhost:5177');
console.log('     ✅ https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app');
console.log('   - Si no están, agrégalas y haz clic en "Save"\n');

console.log('3️⃣ CONFIGURAR REDIRECT URLS:');
console.log('   - En la misma página, en la sección "Redirect URLs", agrega:');
console.log('     ✅ http://localhost:5177/auth/callback');
console.log('     ✅ https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app/auth/callback');
console.log('   - Haz clic en "Save"\n');

console.log('4️⃣ VERIFICAR EMAIL TEMPLATES:');
console.log('   - Ve a: Authentication → Email Templates');
console.log('   - Selecciona "Confirm signup"');
console.log('   - Verifica que el template use la URL correcta');
console.log('   - Haz lo mismo para "Reset password"\n');

console.log('5️⃣ CONFIGURACIÓN ADICIONAL IMPORTANTE:');
console.log('   - Ve a: Authentication → Settings');
console.log('   - En "Enable email confirmations", asegúrate de que esté habilitado');
console.log('   - En "Enable email change confirmations", asegúrate de que esté habilitado');
console.log('   - En "Enable secure email change", asegúrate de que esté habilitado\n');

console.log('6️⃣ VERIFICAR CONFIGURACIÓN DE DOMINIO:');
console.log('   - En la misma página, verifica que "Site URL" tenga la URL de Vercel como principal');
console.log('   - La URL de Vercel debe ser: https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app\n');

console.log('🔍 VERIFICACIÓN DEL CÓDIGO:');
console.log('===========================');
console.log('El código ya está configurado correctamente con:');
console.log('   emailRedirectTo: window.location.origin');
console.log('Esto debería detectar automáticamente el dominio correcto.\n');

console.log('🧪 PRUEBA DESPUÉS DE LA CONFIGURACIÓN:');
console.log('=====================================');
console.log('1. Haz deploy a Vercel: vercel --prod');
console.log('2. Ve a tu aplicación en Vercel');
console.log('3. Haz sign up con un email real');
console.log('4. Revisa el email de confirmación');
console.log('5. Haz clic en el link de confirmación');
console.log('6. Verifica que te redirija a tu app, no a Vercel\n');

console.log('🚨 SI EL PROBLEMA PERSISTE:');
console.log('===========================');
console.log('1. Espera 5-10 minutos para que los cambios de Supabase se propaguen');
console.log('2. Limpia el caché del navegador');
console.log('3. Verifica que las URLs estén exactamente como se muestra arriba');
console.log('4. Asegúrate de que no haya espacios extra en las URLs');
console.log('5. Verifica que no haya barras finales innecesarias\n');

console.log('📞 SOPORTE ADICIONAL:');
console.log('=====================');
console.log('Si el problema persiste después de estos pasos:');
console.log('1. Verifica los logs de Supabase en el dashboard');
console.log('2. Revisa si hay errores en la consola del navegador');
console.log('3. Verifica que el email esté bien escrito');
console.log('4. Revisa la carpeta de spam\n');

console.log('🎯 CONFIGURACIÓN ALTERNATIVA:');
console.log('=============================');
console.log('Si nada funciona, puedes intentar:');
console.log('1. Cambiar la Site URL principal a la URL de Vercel');
console.log('2. Eliminar localhost de las URLs si no lo usas en producción');
console.log('3. Verificar que no haya conflictos con otras configuraciones\n');

console.log('✅ CONFIGURACIÓN COMPLETA');
console.log('=========================');
console.log('Después de seguir estos pasos, el problema debería estar resuelto.');
console.log('El email de confirmación debería redirigir a tu aplicación en lugar de a Vercel.\n');

console.log('🎯 ¡Buena suerte con la configuración!');
