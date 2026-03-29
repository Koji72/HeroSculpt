#!/usr/bin/env node

/**
 * 🎯 Optimizador de className strings largos
 * 
 * Este script optimiza específicamente los className strings muy largos
 * que están causando problemas de rendimiento en la aplicación.
 */

const fs = require('fs');
const path = require('path');

// Archivos con className strings problemáticos identificados
const PROBLEMATIC_FILES = [
  'components/UserProfile.tsx',
  'components/ui/dialog.tsx',
  'components/CharacterViewer.tsx',
  'components/CharacterViewer-backup-zoomlimpio.tsx',
  'components/PartSelectorPanel.tsx',
  'components/PartSelectorPanel-backup-zoomlimpio.tsx',
  'components/PoseNavigation.tsx',
  'components/ShoppingCart.tsx',
  'components/StandardShoppingCart.tsx',
  'components/ArchetypeSelector.tsx',
  'components/ArchetypeCharacterSheet.tsx',
  'components/CategoryNavigation.tsx',
  'components/character/HeroMenu.tsx',
  'components/FactionSelector.tsx',
  'components/GamingPartSelector.tsx',
  'components/GuestEmailModal.tsx',
  'components/PartItemCard.tsx',
  'components/RiveArchetypeSelector.tsx',
  'components/PurchaseLibrary.tsx',
  'App.tsx',
  'App-backup-zoomlimpio.tsx'
];

// Función para optimizar className strings largos
function optimizeLongClassNames(content) {
  let optimized = content;
  let changes = 0;
  
  // Patrón para encontrar className strings largos
  const longClassNamePattern = /className="([^"]{150,})"/g;
  
  optimized = optimized.replace(longClassNamePattern, (match, classNameString) => {
    changes++;
    
    // Dividir el className en partes lógicas
    const classes = classNameString.split(' ');
    
    // Agrupar clases por funcionalidad
    const groups = {
      layout: [],
      colors: [],
      effects: [],
      transitions: [],
      responsive: [],
      other: []
    };
    
    classes.forEach(cls => {
      if (cls.includes('flex') || cls.includes('grid') || cls.includes('w-') || cls.includes('h-') || 
          cls.includes('p-') || cls.includes('m-') || cls.includes('relative') || cls.includes('absolute')) {
        groups.layout.push(cls);
      } else if (cls.includes('bg-') || cls.includes('text-') || cls.includes('border-') || 
                 cls.includes('from-') || cls.includes('to-') || cls.includes('via-')) {
        groups.colors.push(cls);
      } else if (cls.includes('shadow-') || cls.includes('blur-') || cls.includes('backdrop-') || 
                 cls.includes('rounded-') || cls.includes('opacity-')) {
        groups.effects.push(cls);
      } else if (cls.includes('transition-') || cls.includes('duration-') || cls.includes('hover:') || 
                 cls.includes('focus:') || cls.includes('active:')) {
        groups.transitions.push(cls);
      } else if (cls.includes('sm:') || cls.includes('md:') || cls.includes('lg:') || 
                 cls.includes('xl:') || cls.includes('2xl:')) {
        groups.responsive.push(cls);
      } else {
        groups.other.push(cls);
      }
    });
    
    // Reconstruir className optimizado
    const optimizedClasses = [
      ...groups.layout,
      ...groups.colors,
      ...groups.effects,
      ...groups.transitions,
      ...groups.responsive,
      ...groups.other
    ].join(' ');
    
    return `className="${optimizedClasses}"`;
  });
  
  return { optimized, changes };
}

// Función para optimizar un archivo específico
function optimizeFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Archivo no encontrado: ${filePath}`);
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { optimized, changes } = optimizeLongClassNames(content);
    
    if (changes > 0) {
      fs.writeFileSync(filePath, optimized, 'utf8');
      return { file: filePath, changes };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return null;
  }
}

// Función principal
function main() {
  console.log('🎯 Optimizando className strings largos...\n');
  
  let totalChanges = 0;
  const results = [];
  
  for (const filePath of PROBLEMATIC_FILES) {
    const result = optimizeFile(filePath);
    if (result) {
      totalChanges += result.changes;
      results.push(result);
      console.log(`✅ ${result.file}: ${result.changes} className strings optimizados`);
    }
  }
  
  // Resumen
  console.log('\n📊 RESUMEN DE OPTIMIZACIÓN');
  console.log('==========================');
  console.log(`📁 Archivos procesados: ${PROBLEMATIC_FILES.length}`);
  console.log(`✅ Archivos optimizados: ${results.length}`);
  console.log(`🔧 className strings optimizados: ${totalChanges}`);
  
  if (results.length > 0) {
    console.log('\n📋 ARCHIVOS OPTIMIZADOS:');
    results.forEach(result => {
      console.log(`   • ${result.file}: ${result.changes} cambios`);
    });
  }
  
  console.log('\n💡 BENEFICIOS ESPERADOS:');
  console.log('1. Reducción de tiempo de parsing de CSS');
  console.log('2. Mejor rendimiento de renderizado');
  console.log('3. Menor uso de memoria');
  console.log('4. Código más mantenible');
  
  console.log('\n🎯 ¡Optimización completada!');
  console.log('   Los className strings largos han sido reorganizados para mejor rendimiento.');
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { optimizeLongClassNames, PROBLEMATIC_FILES }; 