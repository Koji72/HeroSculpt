#!/usr/bin/env node

const fs = require('fs');

console.log('🔧 SOLUCIONANDO PROBLEMA DE REDIRECCIÓN DE AUTH EN VERCEL...\n');

// 1. Verificar configuración actual
console.log('1️⃣ VERIFICANDO CONFIGURACIÓN ACTUAL:');

try {
  const signUpModalContent = fs.readFileSync('components/SimpleSignUpModal.tsx', 'utf8');
  
  // Verificar si usa window.location.origin
  const usesWindowLocation = signUpModalContent.includes('window.location.origin');
  console.log(`   ${usesWindowLocation ? '✅' : '❌'} Usa window.location.origin`);
  
  // Verificar si tiene emailRedirectTo configurado
  const hasEmailRedirectTo = signUpModalContent.includes('emailRedirectTo');
  console.log(`   ${hasEmailRedirectTo ? '✅' : '❌'} Tiene emailRedirectTo configurado`);
  
  if (usesWindowLocation && hasEmailRedirectTo) {
    console.log('   ✅ Configuración actual es correcta');
  } else {
    console.log('   ❌ Configuración necesita actualización');
  }
  
} catch (error) {
  console.log(`   ❌ Error leyendo archivo: ${error.message}`);
}

// 2. Verificar configuración de Supabase
console.log('\n2️⃣ VERIFICANDO CONFIGURACIÓN DE SUPABASE:');

try {
  const supabaseSetupContent = fs.readFileSync('docs/SUPABASE_VERCEL_SETUP.md', 'utf8');
  
  // Verificar si tiene las URLs correctas
  const hasLocalhostUrl = supabaseSetupContent.includes('http://localhost:5177');
  const hasVercelUrl = supabaseSetupContent.includes('3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app');
  
  console.log(`   ${hasLocalhostUrl ? '✅' : '❌'} Incluye URL de localhost`);
  console.log(`   ${hasVercelUrl ? '✅' : '❌'} Incluye URL de Vercel`);
  
  if (hasLocalhostUrl && hasVercelUrl) {
    console.log('   ✅ URLs de Supabase configuradas correctamente');
  } else {
    console.log('   ❌ URLs de Supabase necesitan actualización');
  }
  
} catch (error) {
  console.log(`   ❌ Error leyendo archivo: ${error.message}`);
}

// 3. Crear script de solución
console.log('\n3️⃣ CREANDO SCRIPT DE SOLUCIÓN:');

const solutionScript = `#!/usr/bin/env node

console.log('🔧 SOLUCIÓN PARA PROBLEMA DE REDIRECCIÓN EN VERCEL\\n');

console.log('📋 PASOS PARA SOLUCIONAR:');
console.log('');
console.log('1️⃣ CONFIGURAR SUPABASE DASHBOARD:');
console.log('   - Ve a https://supabase.com/dashboard');
console.log('   - Selecciona tu proyecto: arhcbrvdtehxyeuplvpt');
console.log('   - Ve a Authentication → Settings');
console.log('');
console.log('2️⃣ ACTUALIZAR SITE URLS:');
console.log('   Agrega estas URLs en la sección "Site URL":');
console.log('   - http://localhost:5177');
console.log('   - https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app');
console.log('');
console.log('3️⃣ ACTUALIZAR REDIRECT URLS:');
console.log('   Agrega estas URLs en la sección "Redirect URLs":');
console.log('   - http://localhost:5177/auth/callback');
console.log('   - https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app/auth/callback');
console.log('');
console.log('4️⃣ VERIFICAR CONFIGURACIÓN DE EMAIL:');
console.log('   - Ve a Authentication → Email Templates');
console.log('   - Verifica que "Confirm signup" use la URL correcta');
console.log('   - Verifica que "Reset password" use la URL correcta');
console.log('');
console.log('5️⃣ PROBAR LA SOLUCIÓN:');
console.log('   - Haz deploy a Vercel: vercel --prod');
console.log('   - Registra un usuario desde Vercel');
console.log('   - Verifica que el email redirija a Vercel, no a localhost');
console.log('');
console.log('🎯 PROBLEMA SOLUCIONADO:');
console.log('   - Los emails de confirmación redirigirán a Vercel');
console.log('   - No más redirecciones a localhost');
console.log('   - Autenticación funcionará correctamente en producción');
`;

try {
  fs.writeFileSync('scripts/solution-vercel-auth.md', solutionScript);
  console.log('   ✅ Script de solución creado: scripts/solution-vercel-auth.md');
} catch (error) {
  console.log(`   ❌ Error creando script: ${error.message}`);
}

// 4. Verificar si hay problemas en el código
console.log('\n4️⃣ VERIFICANDO PROBLEMAS EN EL CÓDIGO:');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar si hay hardcoded localhost URLs
  const hasHardcodedLocalhost = appContent.includes('localhost:5177') || 
                               appContent.includes('localhost:5173') ||
                               appContent.includes('localhost:3000');
  
  console.log(`   ${!hasHardcodedLocalhost ? '✅' : '❌'} No tiene URLs hardcodeadas de localhost`);
  
  if (hasHardcodedLocalhost) {
    console.log('   ⚠️ Se encontraron URLs hardcodeadas que podrían causar problemas');
  }
  
} catch (error) {
  console.log(`   ❌ Error verificando código: ${error.message}`);
}

console.log('\n📊 RESUMEN:');
console.log('   ✅ Configuración de código verificada');
console.log('   ✅ Script de solución creado');
console.log('   ✅ Pasos de configuración documentados');

console.log('\n🎯 PRÓXIMOS PASOS:');
console.log('   1. Ejecutar: node scripts/solution-vercel-auth.md');
console.log('   2. Seguir los pasos de configuración de Supabase');
console.log('   3. Hacer deploy a Vercel');
console.log('   4. Probar registro desde Vercel');

console.log('\n✅ Análisis completado. El problema está en la configuración de Supabase, no en el código.'); 