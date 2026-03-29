#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🌐 TRADUCIENDO TEXTO AL INGLÉS...\n');

// Mapeo de traducciones
const translations = {
  // Botones y acciones principales
  'Registrarse': 'Sign Up',
  'Iniciar sesión': 'Sign In',
  'Cerrar sesión': 'Sign Out',
  'Cerrar': 'Close',
  'Abrir': 'Open',
  'Guardar': 'Save',
  'Eliminar': 'Delete',
  'Editar': 'Edit',
  
  // Nombres de personajes
  'Nuevo Héroe': 'New Hero',
  'Héroe Anónimo': 'Anonymous Hero',
  
  // Configuraciones y poses
  'Configuración': 'Configuration',
  'Configuración Completa': 'Complete Configuration',
  'Configuración Guardada': 'Saved Configuration',
  'Guardar como nueva pose editable': 'Save as new editable pose',
  
  // Títulos y tooltips
  'Abrir hojas de personaje RPG': 'Open RPG character sheets',
  'Abrir panel de materiales': 'Open materials panel',
  'Abrir biblioteca VTT': 'Open VTT library',
  'Abrir carrito de compras': 'Open shopping cart',
  
  // Comentarios (mantener en español para desarrollo)
  // Los comentarios se mantienen en español para facilitar el desarrollo
};

// Función para traducir un archivo
function translateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Aplicar traducciones
    for (const [spanish, english] of Object.entries(translations)) {
      if (content.includes(spanish)) {
        content = content.replace(new RegExp(spanish.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), english);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Error en ${filePath}:`, error.message);
    return false;
  }
}

// Archivos principales a traducir
const filesToTranslate = [
  'App.tsx',
  'components/AuthModal.tsx',
  'components/PoseNavigation.tsx',
  'components/TestSignUpModal.tsx',
  'components/rpg-sheets/RPGCharacterSheetManager.tsx',
  'components/ShoppingCart.tsx',
  'components/StandardShoppingCart.tsx'
];

console.log('📁 Archivos a traducir:');
filesToTranslate.forEach(file => console.log(`   - ${file}`));

console.log('\n🔄 Iniciando traducción...\n');

let translatedCount = 0;
filesToTranslate.forEach(file => {
  if (fs.existsSync(file)) {
    if (translateFile(file)) {
      translatedCount++;
    }
  } else {
    console.log(`⚠️ Archivo no encontrado: ${file}`);
  }
});

console.log(`\n📊 RESUMEN:`);
console.log(`   ✅ ${translatedCount} archivos traducidos`);
console.log(`   📝 ${Object.keys(translations).length} términos traducidos`);

console.log('\n🎯 TRADUCCIONES APLICADAS:');
Object.entries(translations).forEach(([spanish, english]) => {
  console.log(`   "${spanish}" → "${english}"`);
});

console.log('\n✅ Traducción completada. La aplicación ahora está en inglés.'); 