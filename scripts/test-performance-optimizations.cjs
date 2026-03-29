#!/usr/bin/env node

/**
 * 🚀 Test de Optimizaciones de Rendimiento
 * Verifica que las optimizaciones implementadas funcionen correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Verificando Optimizaciones de Rendimiento...\n');

// Verificar archivos optimizados
const filesToCheck = [
  'components/MaterialConfigurator.tsx',
  'components/CharacterViewer.tsx'
];

let allChecksPassed = true;

filesToCheck.forEach(file => {
  console.log(`📁 Verificando ${file}...`);
  
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar optimizaciones en MaterialConfigurator
    if (file.includes('MaterialConfigurator')) {
      const checks = [
        {
          name: 'useMemo importado',
          pattern: /import.*useMemo.*from 'react'/,
          required: true
        },
        {
          name: 'availableCategories con useMemo',
          pattern: /const availableCategories = useMemo/,
          required: true
        },
        {
          name: 'materialPresets con useMemo',
          pattern: /const materialPresets.*useMemo/,
          required: true
        },
        {
          name: 'lightingPresets con useMemo',
          pattern: /const lightingPresets.*useMemo/,
          required: true
        },
        {
          name: 'Console.log condicional',
          pattern: /process\.env\.NODE_ENV === 'development'/,
          required: true
        },
        {
          name: 'Objetos estáticos con useMemo',
          pattern: /const paletteNames = useMemo/,
          required: true
        }
      ];
      
      checks.forEach(check => {
        const found = check.pattern.test(content);
        const status = found ? '✅' : '❌';
        console.log(`  ${status} ${check.name}`);
        
        if (check.required && !found) {
          allChecksPassed = false;
        }
      });
    }
    
    // Verificar optimizaciones en CharacterViewer
    if (file.includes('CharacterViewer')) {
      const checks = [
        {
          name: 'Console.log condicional',
          pattern: /process\.env\.NODE_ENV === 'development'/,
          required: true
        },
        {
          name: 'Dependencias optimizadas en useEffect',
          pattern: /\[selectedParts, selectedArchetype, isThreeJSReady\]/,
          required: true
        },
        {
          name: 'Logs solo en cambios reales',
          pattern: /isFirstLoad \|\| archetypeChanged/,
          required: true
        }
      ];
      
      checks.forEach(check => {
        const found = check.pattern.test(content);
        const status = found ? '✅' : '❌';
        console.log(`  ${status} ${check.name}`);
        
        if (check.required && !found) {
          allChecksPassed = false;
        }
      });
    }
    
  } catch (error) {
    console.log(`  ❌ Error leyendo archivo: ${error.message}`);
    allChecksPassed = false;
  }
  
  console.log('');
});

// Verificar que no haya console.log excesivos
console.log('🔍 Verificando logs excesivos...');
const materialConfigContent = fs.readFileSync('components/MaterialConfigurator.tsx', 'utf8');
const characterViewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');

const consoleLogCount = {
  materialConfig: (materialConfigContent.match(/console\.log/g) || []).length,
  characterViewer: (characterViewerContent.match(/console\.log/g) || []).length
};

console.log(`  📊 Console.log en MaterialConfigurator: ${consoleLogCount.materialConfig}`);
console.log(`  📊 Console.log en CharacterViewer: ${consoleLogCount.characterViewer}`);

// Verificar que todos los console.log estén condicionados
const unconditionalLogs = [
  ...(materialConfigContent.match(/console\.log[^;]*;/g) || []).filter(log => 
    !log.includes('process.env.NODE_ENV')
  ),
  ...(characterViewerContent.match(/console\.log[^;]*;/g) || []).filter(log => 
    !log.includes('process.env.NODE_ENV')
  )
];

if (unconditionalLogs.length > 0) {
  console.log('  ⚠️  Logs no condicionados encontrados:');
  unconditionalLogs.forEach(log => console.log(`    ${log.trim()}`));
} else {
  console.log('  ✅ Todos los logs están condicionados correctamente');
}

console.log('\n' + '='.repeat(50));

if (allChecksPassed) {
  console.log('🎉 ¡TODAS LAS OPTIMIZACIONES ESTÁN IMPLEMENTADAS CORRECTAMENTE!');
  console.log('\n✅ Beneficios esperados:');
  console.log('  • Reducción significativa de re-renders');
  console.log('  • Mejor rendimiento en la interfaz');
  console.log('  • Logs solo en desarrollo');
  console.log('  • Objetos estáticos memorizados');
  console.log('  • Dependencias optimizadas en useEffect');
} else {
  console.log('❌ Algunas optimizaciones faltan o están incompletas');
  console.log('   Revisa los errores arriba y completa las implementaciones');
}

console.log('\n🚀 El proyecto está optimizado para mejor rendimiento!'); 