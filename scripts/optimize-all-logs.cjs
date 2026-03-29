#!/usr/bin/env node

/**
 * 🚀 Optimización Masiva de Logs
 * Condiciona todos los console.log no condicionados
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizando todos los logs...\n');

const filesToOptimize = [
  'components/CharacterViewer.tsx',
  'components/MaterialConfigurator.tsx',
  'components/MaterialPanel.tsx',
  'components/AuthModal.tsx'
];

filesToOptimize.forEach(file => {
  console.log(`📁 Optimizando ${file}...`);
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Buscar console.log que no estén condicionados
    const consoleLogRegex = /console\.log\([^)]+\);/g;
    const matches = content.match(consoleLogRegex) || [];
    
    matches.forEach(match => {
      // Verificar si ya está condicionado
      const beforeMatch = content.substring(0, content.indexOf(match));
      const lastLine = beforeMatch.split('\n').pop();
      
      if (!lastLine.includes('process.env.NODE_ENV') && !lastLine.includes('// 🔧 OPTIMIZADO')) {
        // Reemplazar con versión condicionada
        const optimizedLog = `    // 🔧 OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      ${match}
    }`;
        
        content = content.replace(match, optimizedLog);
        modified = true;
        console.log(`  ✅ Optimizado: ${match.substring(0, 50)}...`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`  🎉 ${file} optimizado`);
    } else {
      console.log(`  ✅ ${file} ya estaba optimizado`);
    }
    
  } catch (error) {
    console.log(`  ❌ Error optimizando ${file}: ${error.message}`);
  }
});

console.log('\n🎉 Optimización masiva completada!');
console.log('Ahora todos los logs están condicionados para desarrollo.'); 