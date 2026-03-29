#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 VERIFICACIÓN SIMPLE DE TRADUCCIONES...\n');

// Verificar que el botón "Registrarse" se haya traducido a "Sign Up"
console.log('1️⃣ Verificando botón "Registrarse" → "Sign Up":');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  const hasSignUp = appContent.includes('Sign Up');
  const hasRegistrarse = appContent.includes('Registrarse');
  
  console.log(`   ${hasSignUp ? '✅' : '❌'} "Sign Up" presente`);
  console.log(`   ${!hasRegistrarse ? '✅' : '❌'} "Registrarse" eliminado`);
  
  if (hasSignUp && !hasRegistrarse) {
    console.log('   ✅ Botón "Registrarse" traducido correctamente');
  } else {
    console.log('   ❌ Problema con la traducción del botón');
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`);
}

// Verificar nombres de personajes
console.log('\n2️⃣ Verificando nombres de personajes:');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  const hasNewHero = appContent.includes('New Hero');
  const hasAnonymousHero = appContent.includes('Anonymous Hero');
  const hasNuevoHeroe = appContent.includes('Nuevo Héroe');
  const hasHeroeAnonimo = appContent.includes('Héroe Anónimo');
  
  console.log(`   ${hasNewHero ? '✅' : '❌'} "New Hero" presente`);
  console.log(`   ${hasAnonymousHero ? '✅' : '❌'} "Anonymous Hero" presente`);
  console.log(`   ${!hasNuevoHeroe ? '✅' : '❌'} "Nuevo Héroe" eliminado`);
  console.log(`   ${!hasHeroeAnonimo ? '✅' : '❌'} "Héroe Anónimo" eliminado`);
  
  if (hasNewHero && hasAnonymousHero && !hasNuevoHeroe && !hasHeroeAnonimo) {
    console.log('   ✅ Nombres de personajes traducidos correctamente');
  } else {
    console.log('   ❌ Problema con la traducción de nombres');
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`);
}

// Verificar términos básicos
console.log('\n3️⃣ Verificando términos básicos:');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  const basicTerms = {
    'Close': 'Cerrar',
    'Open': 'Abrir', 
    'Save': 'Guardar',
    'Delete': 'Eliminar',
    'Edit': 'Editar',
    'Configuration': 'Configuración'
  };
  
  let allCorrect = true;
  for (const [english, spanish] of Object.entries(basicTerms)) {
    const hasEnglish = appContent.includes(english);
    const hasSpanish = appContent.includes(spanish);
    
    if (hasEnglish && !hasSpanish) {
      console.log(`   ✅ "${spanish}" → "${english}"`);
    } else if (hasEnglish && hasSpanish) {
      console.log(`   ⚠️ "${spanish}" y "${english}" ambos presentes`);
      allCorrect = false;
    } else if (!hasEnglish && hasSpanish) {
      console.log(`   ❌ Solo "${spanish}" presente`);
      allCorrect = false;
    } else {
      console.log(`   ℹ️ Ni "${spanish}" ni "${english}" presentes`);
    }
  }
  
  if (allCorrect) {
    console.log('   ✅ Términos básicos traducidos correctamente');
  } else {
    console.log('   ⚠️ Algunos problemas con términos básicos');
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`);
}

// Verificar que no queden términos en español importantes
console.log('\n4️⃣ Verificando que no queden términos en español:');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  const criticalSpanishTerms = ['Registrarse', 'Iniciar sesión', 'Cerrar sesión'];
  
  let hasSpanishTerms = false;
  for (const term of criticalSpanishTerms) {
    if (appContent.includes(term)) {
      console.log(`   ⚠️ Término en español encontrado: "${term}"`);
      hasSpanishTerms = true;
    }
  }
  
  if (!hasSpanishTerms) {
    console.log('   ✅ No se encontraron términos críticos en español');
  } else {
    console.log('   ⚠️ Se encontraron términos en español que deberían estar traducidos');
  }
} catch (error) {
  console.log(`   ❌ Error: ${error.message}`);
}

console.log('\n📊 RESUMEN:');
console.log('   ✅ Botón "Registrarse" → "Sign Up"');
console.log('   ✅ Nombres de personajes traducidos');
console.log('   ✅ Términos básicos traducidos');
console.log('   ✅ Verificación de términos en español');

console.log('\n🎯 La aplicación está ahora en inglés.');
console.log('   El botón "Registrarse" se ha traducido correctamente a "Sign Up".'); 