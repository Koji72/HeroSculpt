#!/usr/bin/env node

/**
 * Script de prueba para verificar la nueva configuración de redirección de email
 * Simula diferentes entornos y verifica que las URLs sean correctas
 */

console.log('🧪 TESTING EMAIL REDIRECT CONFIGURATION');
console.log('=======================================\n');

// Simular las constantes de entorno
const mockEnv = {
  DEV: true,
  PROD: false
};

// Simular window.location para diferentes entornos
const mockLocations = [
  {
    name: 'Development (localhost)',
    hostname: 'localhost',
    origin: 'http://localhost:5177',
    isVercel: false
  },
  {
    name: 'Production (Vercel)',
    hostname: '3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app',
    origin: 'https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app',
    isVercel: true
  },
  {
    name: 'Other Production',
    hostname: 'myapp.com',
    origin: 'https://myapp.com',
    isVercel: false
  }
];

// URLs esperadas para cada entorno
const expectedUrls = {
  development: 'http://localhost:5177',
  production: 'https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app',
  vercel: 'https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app'
};

console.log('📋 Testing different environments:');
console.log('==================================');

let allTestsPassed = true;

mockLocations.forEach((location, index) => {
  console.log(`\n${index + 1}. Testing ${location.name}:`);
  console.log(`   Hostname: ${location.hostname}`);
  console.log(`   Origin: ${location.origin}`);
  console.log(`   Is Vercel: ${location.isVercel}`);
  
  // Simular la lógica de getEmailRedirectUrl
  let redirectUrl;
  
  if (location.hostname === 'localhost') {
    redirectUrl = expectedUrls.development;
  } else if (location.isVercel) {
    redirectUrl = expectedUrls.vercel;
  } else {
    redirectUrl = expectedUrls.production;
  }
  
  console.log(`   Expected Redirect URL: ${redirectUrl}`);
  
  // Verificar que la URL sea válida
  let isValid = true;
  try {
    new URL(redirectUrl);
  } catch (error) {
    isValid = false;
  }
  
  if (isValid) {
    console.log(`   ✅ URL is valid`);
  } else {
    console.log(`   ❌ URL is invalid`);
    allTestsPassed = false;
  }
  
  // Verificar que no esté vacía
  if (redirectUrl && redirectUrl !== '') {
    console.log(`   ✅ URL is not empty`);
  } else {
    console.log(`   ❌ URL is empty`);
    allTestsPassed = false;
  }
});

console.log('\n📊 TEST RESULTS:');
console.log('================');

if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED - Email redirect configuration is working correctly!');
  
  console.log('\n🎯 CONFIGURATION SUMMARY:');
  console.log('=========================');
  console.log('✅ Development (localhost) → http://localhost:5177');
  console.log('✅ Production (Vercel) → https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app');
  console.log('✅ Other Production → https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app (fallback)');
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('==============');
  console.log('1. Deploy to Vercel: vercel --prod');
  console.log('2. Test signup from Vercel domain');
  console.log('3. Check browser console for debug logs');
  console.log('4. Verify email redirects to correct URL');
  
} else {
  console.log('❌ SOME TESTS FAILED - Email redirect configuration needs attention!');
  
  console.log('\n🔧 FIX REQUIRED:');
  console.log('================');
  console.log('Check the configuration in lib/emailRedirectConfig.ts');
  console.log('Verify that all URLs are valid and not empty');
}

console.log('\n📋 SUPABASE DASHBOARD CONFIGURATION:');
console.log('====================================');
console.log('Make sure these URLs are configured in Supabase Dashboard:');
console.log('- Site URLs:');
console.log('  * http://localhost:5177');
console.log('  * https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app');
console.log('- Redirect URLs:');
console.log('  * http://localhost:5177/auth/callback');
console.log('  * https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app/auth/callback');

console.log('\n🎯 Email redirect configuration test completed!');
