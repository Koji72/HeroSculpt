#!/usr/bin/env node

/**
 * 🔧 Script de Eliminación RADICAL: Todos los Elementos Flex
 * 
 * Este script elimina TODOS los elementos flex problemáticos
 * del dashboard del Headquarters.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Eliminación RADICAL de todos los elementos flex...\n');

// Verificar Headquarters.tsx
const headquartersPath = path.join(__dirname, '../components/Headquarters.tsx');
if (!fs.existsSync(headquartersPath)) {
  console.error('❌ No se encontró Headquarters.tsx');
  process.exit(1);
}

let headquartersContent = fs.readFileSync(headquartersPath, 'utf8');

console.log('📋 ELIMINANDO ELEMENTOS PROBLEMÁTICOS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Contar elementos antes de la eliminación
const flexBefore = (headquartersContent.match(/flex/g) || []).length;
const itemsCenterBefore = (headquartersContent.match(/items-center/g) || []).length;
const justifyCenterBefore = (headquartersContent.match(/justify-center/g) || []).length;
const gapBefore = (headquartersContent.match(/gap-/g) || []).length;
const spaceYBefore = (headquartersContent.match(/space-y-/g) || []).length;

console.log(`🔍 Elementos antes de la eliminación:`);
console.log(`  - flex: ${flexBefore}`);
console.log(`  - items-center: ${itemsCenterBefore}`);
console.log(`  - justify-center: ${justifyCenterBefore}`);
console.log(`  - gap: ${gapBefore}`);
console.log(`  - space-y: ${spaceYBefore}`);

// Eliminar todos los elementos flex problemáticos del dashboard
// Reemplazar flex items-center justify-between con block
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)flex items-center justify-between([^"]*?)"/g,
  'className="$1block$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar flex items-center gap-3 con block
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)flex items-center gap-3([^"]*?)"/g,
  'className="$1block$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar flex items-center gap-2 con block
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)flex items-center gap-2([^"]*?)"/g,
  'className="$1block$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar flex items-center gap-1 con block
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)flex items-center gap-1([^"]*?)"/g,
  'className="$1block$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar flex items-center con block
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)flex items-center([^"]*?)"/g,
  'className="$1block$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar flex justify-center con block
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)flex justify-center([^"]*?)"/g,
  'className="$1block$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar flex con block
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)flex([^"]*?)"/g,
  'className="$1block$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar gap-3 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)gap-3([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar gap-2 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)gap-2([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar gap-1 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)gap-1([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar space-y-8 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)space-y-8([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar space-y-6 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)space-y-6([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar space-y-4 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)space-y-4([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar space-y-3 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)space-y-3([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Reemplazar space-y-2 con style inline
headquartersContent = headquartersContent.replace(
  /className="([^"]*?)space-y-2([^"]*?)"/g,
  'className="$1$2" style={{ margin: 0, padding: 0 }}'
);

// Guardar el archivo modificado
fs.writeFileSync(headquartersPath, headquartersContent, 'utf8');

// Contar elementos después de la eliminación
const flexAfter = (headquartersContent.match(/flex/g) || []).length;
const itemsCenterAfter = (headquartersContent.match(/items-center/g) || []).length;
const justifyCenterAfter = (headquartersContent.match(/justify-center/g) || []).length;
const gapAfter = (headquartersContent.match(/gap-/g) || []).length;
const spaceYAfter = (headquartersContent.match(/space-y-/g) || []).length;

console.log(`\n✅ Elementos después de la eliminación:`);
console.log(`  - flex: ${flexAfter} (eliminados: ${flexBefore - flexAfter})`);
console.log(`  - items-center: ${itemsCenterAfter} (eliminados: ${itemsCenterBefore - itemsCenterAfter})`);
console.log(`  - justify-center: ${justifyCenterAfter} (eliminados: ${justifyCenterBefore - justifyCenterAfter})`);
console.log(`  - gap: ${gapAfter} (eliminados: ${gapBefore - gapAfter})`);
console.log(`  - space-y: ${spaceYAfter} (eliminados: ${spaceYBefore - spaceYAfter})`);

console.log('\n🎉 ELIMINACIÓN RADICAL COMPLETADA');
console.log('✅ Se eliminaron TODOS los elementos flex problemáticos');
console.log('✅ Se reemplazaron con block y style inline');
console.log('✅ El espacio excesivo debería estar ELIMINADO');

console.log('\n🚀 Para probar la solución RADICAL:');
console.log('1. Ejecutar: npm run dev');
console.log('2. Abrir el Cuartel General');
console.log('3. Verificar que NO haya NINGÚN espacio excesivo');
console.log('4. Verificar que el contenido esté PEGADO al borde superior');
console.log('5. Verificar que no haya centrado vertical u horizontal');
console.log('6. Verificar que el dashboard se ajuste PERFECTAMENTE'); 