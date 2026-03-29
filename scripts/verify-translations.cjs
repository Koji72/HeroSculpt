#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 VERIFICANDO TRADUCCIONES AL INGLÉS...\n');

// Términos que deberían estar traducidos
const expectedTranslations = {
  'Sign Up': 'Registrarse',
  'Sign In': 'Iniciar sesión', 
  'Sign Out': 'Cerrar sesión',
  'New Hero': 'Nuevo Héroe',
  'Anonymous Hero': 'Héroe Anónimo',
  'Close': 'Cerrar',
  'Open': 'Abrir',
  'Save': 'Guardar',
  'Delete': 'Eliminar',
  'Edit': 'Editar',
  'Configuration': 'Configuración',
  'Complete Configuration': 'Configuración Completa',
  'Saved Configuration': 'Configuración Guardada',
  'Save as new editable pose': 'Guardar como nueva pose editable',
  'Open RPG character sheets': 'Abrir hojas de personaje RPG',
  'Open materials panel': 'Abrir panel de materiales',
  'Open VTT library': 'Abrir biblioteca VTT',
  'Open shopping cart': 'Abrir carrito de compras'
};

// Términos en español que NO deberían aparecer
const spanishTermsToCheck = [
  'Registrarse',
  'Iniciar sesión',
  'Cerrar sesión', 
  'Nuevo Héroe',
  'Héroe Anónimo',
  'Configuración',
  'Guardar',
  'Eliminar',
  'Editar',
  'Cerrar',
  'Abrir'
];

// Archivos a verificar
const filesToCheck = [
  'App.tsx',
  'components/AuthModal.tsx',
  'components/PoseNavigation.tsx',
  'components/TestSignUpModal.tsx',
  'components/rpg-sheets/RPGCharacterSheetManager.tsx'
];

console.log('📁 Verificando archivos:');
filesToCheck.forEach(file => console.log(`   - ${file}`));

console.log('\n🔍 Iniciando verificación...\n');

let totalIssues = 0;
let filesWithIssues = 0;

filesToCheck.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`⚠️ Archivo no encontrado: ${file}`);
    return;
  }

  try {
    const content = fs.readFileSync(file, 'utf8');
    let fileIssues = 0;
    
    console.log(`📄 ${file}:`);
    
    // Verificar que las traducciones estén presentes
    for (const [english, spanish] of Object.entries(expectedTranslations)) {
      if (content.includes(english)) {
        console.log(`   ✅ "${spanish}" → "${english}"`);
      } else {
        console.log(`   ❌ Falta: "${english}" (era "${spanish}")`);
        fileIssues++;
      }
    }
    
    // Verificar que no queden términos en español
    for (const spanishTerm of spanishTermsToCheck) {
      if (content.includes(spanishTerm)) {
        console.log(`   ⚠️ Término en español encontrado: "${spanishTerm}"`);
        fileIssues++;
      }
    }
    
    if (fileIssues > 0) {
      filesWithIssues++;
      totalIssues += fileIssues;
    } else {
      console.log(`   ✅ Sin problemas`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error leyendo archivo: ${error.message}`);
    totalIssues++;
  }
  
  console.log('');
});

console.log('📊 RESUMEN DE VERIFICACIÓN:');
console.log(`   📁 Archivos verificados: ${filesToCheck.length}`);
console.log(`   ❌ Archivos con problemas: ${filesWithIssues}`);
console.log(`   🚨 Problemas totales: ${totalIssues}`);

if (totalIssues === 0) {
  console.log('\n🎉 ¡TODAS LAS TRADUCCIONES VERIFICADAS CORRECTAMENTE!');
  console.log('   La aplicación está completamente en inglés.');
} else {
  console.log('\n⚠️ Se encontraron problemas en las traducciones.');
  console.log('   Revisar los archivos mencionados arriba.');
}

console.log('\n✅ Verificación completada.'); 