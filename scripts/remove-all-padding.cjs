#!/usr/bin/env node

/**
 * 🔧 Script de Eliminación TOTAL: Todo el Padding
 * 
 * Este script elimina TODO el padding del dashboard
 * para que el contenido esté completamente pegado.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Eliminación TOTAL de todo el padding...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

let headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

console.log('📋 ELIMINANDO TODO EL PADDING:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Contar elementos con padding antes de la eliminación
const paddingBefore = (headquartersContent.match(/p-[0-9]/g) || []).length;
console.log(`🔍 Elementos con padding antes: ${paddingBefore}`);

// Eliminar todo el padding del dashboard
// Reemplazar p-8 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)p-8([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar p-6 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)p-6([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar p-4 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)p-4([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar p-3 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)p-3([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar p-2 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)p-2([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar p-1 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)p-1([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar px-2 py-1 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)px-2 py-1([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar px-3 py-2 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)px-3 py-2([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar px-4 py-3 con style inline sin padding
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)px-4 py-3([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Guardar el archivo modificado
fs.writeFileSync(headquartersPath, headquartersContent, 'utf8');

// Contar elementos con padding después de la eliminación
const paddingAfter = (headquartersContent.match(/p-[0-9]/g) || []).length;
console.log(`✅ Elementos con padding después: ${paddingAfter} (eliminados: ${paddingBefore - paddingAfter})`);

console.log('\n🎉 ELIMINACIÓN TOTAL COMPLETADA');
console.log('✅ Se eliminó TODO el padding del dashboard');
console.log('✅ El contenido debería estar completamente pegado');
console.log('✅ NO debería haber ningún espacio excesivo');

console.log('\n🚀 Para probar la solución TOTAL:');
console.log('1. Abrir http://localhost:5178');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya NINGÚN espacio excesivo');
console.log('4. Verificar que el contenido esté completamente pegado');
console.log('5. Verificar que el modal ocupe toda la pantalla'); 