#!/usr/bin/env node

/**
 * Script de diagnóstico para el problema de emails no recibidos
 * Ayuda a identificar por qué no llegan los emails de confirmación
 */

console.log('🔍 DIAGNOSING EMAIL NOT RECEIVED PROBLEM');
console.log('========================================\n');

console.log('🚨 PROBLEMA IDENTIFICADO:');
console.log('==========================');
console.log('No recibes ningún email de confirmación después del sign up.');
console.log('Esto puede ser un problema de configuración de Supabase o del servicio de email.\n');

console.log('📋 PASOS DE DIAGNÓSTICO:');
console.log('=========================\n');

console.log('1️⃣ VERIFICAR CONFIGURACIÓN DE SUPABASE:');
console.log('   - Ve a: https://supabase.com/dashboard');
console.log('   - Selecciona tu proyecto: arhcbrvdtehxyeuplvpt');
console.log('   - Ve a: Authentication → Settings');
console.log('   - Verifica que "Enable email confirmations" esté HABILITADO');
console.log('   - Verifica que "Enable email change confirmations" esté HABILITADO');
console.log('   - Verifica que "Enable secure email change" esté HABILITADO\n');

console.log('2️⃣ VERIFICAR CONFIGURACIÓN DE EMAIL:');
console.log('   - Ve a: Authentication → Email Templates');
console.log('   - Selecciona "Confirm signup"');
console.log('   - Verifica que el template esté configurado correctamente');
console.log('   - Verifica que el remitente (From) esté configurado');
console.log('   - Verifica que el asunto (Subject) esté configurado\n');

console.log('3️⃣ VERIFICAR LÍMITES DE EMAIL:');
console.log('   - Ve a: Settings → Billing');
console.log('   - Verifica que no hayas excedido los límites de email');
console.log('   - Verifica que tu plan incluya envío de emails');
console.log('   - Verifica que no haya restricciones de cuota\n');

console.log('4️⃣ VERIFICAR LOGS DE SUPABASE:');
console.log('   - Ve a: Logs → Auth');
console.log('   - Busca eventos de "signup" recientes');
console.log('   - Verifica si hay errores en el envío de emails');
console.log('   - Busca mensajes de error relacionados con email\n');

console.log('5️⃣ VERIFICAR CONFIGURACIÓN DE DOMINIO:');
console.log('   - Ve a: Authentication → Settings');
console.log('   - Verifica que el dominio de email esté verificado');
console.log('   - Verifica que no haya problemas con SPF/DKIM');
console.log('   - Verifica que el dominio no esté en listas negras\n');

console.log('6️⃣ PRUEBAS ESPECÍFICAS:');
console.log('   - Usa un email diferente (Gmail, Outlook, etc.)');
console.log('   - Verifica la carpeta de spam/junk');
console.log('   - Verifica que el email esté bien escrito');
console.log('   - Intenta con un email temporal (10minutemail.com)\n');

console.log('7️⃣ VERIFICAR CÓDIGO:');
console.log('   - Abre la consola del navegador (F12)');
console.log('   - Haz sign up y revisa los logs');
console.log('   - Verifica que no hay errores de JavaScript');
console.log('   - Verifica que la llamada a signUp se ejecuta correctamente\n');

console.log('🔧 SOLUCIONES COMUNES:');
console.log('=====================\n');

console.log('✅ SOLUCIÓN 1: Habilitar confirmación de email');
console.log('   - Ve a Supabase Dashboard → Authentication → Settings');
console.log('   - Asegúrate de que "Enable email confirmations" esté ON');
console.log('   - Guarda los cambios\n');

console.log('✅ SOLUCIÓN 2: Verificar template de email');
console.log('   - Ve a Authentication → Email Templates');
console.log('   - Selecciona "Confirm signup"');
console.log('   - Verifica que el contenido esté completo');
console.log('   - Haz clic en "Save"\n');

console.log('✅ SOLUCIÓN 3: Configurar dominio de email');
console.log('   - Ve a Authentication → Settings');
console.log('   - En "SMTP Settings", verifica la configuración');
console.log('   - O usa el servicio de email por defecto de Supabase\n');

console.log('✅ SOLUCIÓN 4: Verificar límites de plan');
console.log('   - Ve a Settings → Billing');
console.log('   - Verifica que tu plan incluya envío de emails');
console.log('   - Considera actualizar el plan si es necesario\n');

console.log('✅ SOLUCIÓN 5: Usar email de prueba');
console.log('   - Ve a https://10minutemail.com');
console.log('   - Genera un email temporal');
console.log('   - Usa ese email para hacer sign up');
console.log('   - Verifica si llega el email de confirmación\n');

console.log('🚨 PROBLEMAS ESPECÍFICOS:');
console.log('==========================\n');

console.log('❌ PROBLEMA: Plan gratuito sin emails');
console.log('   - El plan gratuito de Supabase tiene límites de email');
console.log('   - Solución: Actualizar a un plan pagado o usar SMTP externo\n');

console.log('❌ PROBLEMA: Dominio no verificado');
console.log('   - Supabase necesita verificar el dominio de email');
console.log('   - Solución: Verificar dominio o usar email verificado\n');

console.log('❌ PROBLEMA: Template mal configurado');
console.log('   - El template de email puede estar vacío o mal configurado');
console.log('   - Solución: Revisar y corregir el template\n');

console.log('❌ PROBLEMA: Límites excedidos');
console.log('   - Puedes haber excedido los límites de email del plan');
console.log('   - Solución: Esperar o actualizar el plan\n');

console.log('🧪 PRUEBA RÁPIDA:');
console.log('==================');
console.log('1. Ve a https://10minutemail.com');
console.log('2. Copia el email temporal');
console.log('3. Ve a tu aplicación');
console.log('4. Haz sign up con ese email');
console.log('5. Revisa si llega el email de confirmación');
console.log('6. Si llega, el problema es con tu email específico');
console.log('7. Si no llega, el problema es de configuración\n');

console.log('📞 SOPORTE ADICIONAL:');
console.log('=====================');
console.log('Si ninguna solución funciona:');
console.log('1. Revisa la documentación de Supabase sobre emails');
console.log('2. Contacta al soporte de Supabase');
console.log('3. Verifica los logs de la aplicación');
console.log('4. Considera usar un servicio de email externo\n');

console.log('🎯 DIAGNÓSTICO COMPLETO');
console.log('========================');
console.log('Sigue estos pasos en orden para identificar el problema.');
console.log('El problema más común es que "Enable email confirmations" esté deshabilitado.\n');

console.log('✅ ¡Buena suerte con el diagnóstico!');
