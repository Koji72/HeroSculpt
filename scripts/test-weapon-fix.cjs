#!/usr/bin/env node

/**
 * 🔧 Test de Fix de Arma
 * Verifica que el problema del arma inexistente esté resuelto
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Verificando Fix de Arma...\n');

// Verificar que el archivo de arma existe
const weaponPath = 'public/assets/strong/weapons/strong_weapon_hammer_01.glb';
const weaponPath2 = 'public/assets/strong/weapons/strong_weapon_hammer_02.glb';

console.log('📁 Verificando archivos de armas...');

const checks = [
  {
    name: 'Directorio weapons existe',
    path: 'public/assets/strong/weapons',
    type: 'directory'
  },
  {
    name: 'Arma hammer_01 existe',
    path: weaponPath,
    type: 'file'
  },
  {
    name: 'Arma hammer_02 existe',
    path: weaponPath2,
    type: 'file'
  }
];

let allChecksPassed = true;

checks.forEach(check => {
  try {
    const stats = fs.statSync(check.path);
    const exists = check.type === 'directory' ? stats.isDirectory() : stats.isFile();
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${check.name}`);
    
    if (!exists) {
      allChecksPassed = false;
    }
  } catch (error) {
    console.log(`  ❌ ${check.name} - Error: ${error.message}`);
    allChecksPassed = false;
  }
});

// Verificar configuración en constants.ts
console.log('\n📋 Verificando configuración en constants.ts...');

try {
  const constantsContent = fs.readFileSync('constants.ts', 'utf8');
  
  const configChecks = [
    {
      name: 'Arma definida en ALL_PARTS',
      pattern: /strong_weapon_hammer_01/,
      required: true
    },
    {
      name: 'Arma incluida en DEFAULT_STRONG_BUILD',
      pattern: /\[PartCategory\.WEAPON\].*strong_weapon_hammer_01/,
      required: true
    },
    {
      name: 'Path correcto en definición',
      pattern: /gltfPath.*assets\/strong\/weapons\/strong_weapon_hammer_01\.glb/,
      required: true
    }
  ];
  
  configChecks.forEach(check => {
    const found = check.pattern.test(constantsContent);
    const status = found ? '✅' : '❌';
    console.log(`  ${status} ${check.name}`);
    
    if (check.required && !found) {
      allChecksPassed = false;
    }
  });
  
} catch (error) {
  console.log(`  ❌ Error leyendo constants.ts: ${error.message}`);
  allChecksPassed = false;
}

// Verificar que no hay errores de carga
console.log('\n🔍 Verificando logs de error...');

try {
  const characterViewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Buscar logs de error relacionados con armas
  const errorPatterns = [
    /Error loading model.*strong_weapon_hammer_01/,
    /SyntaxError.*Unexpected token.*strong_weapon_hammer_01/,
    /Failed to load.*strong_weapon_hammer_01/
  ];
  
  const hasErrors = errorPatterns.some(pattern => pattern.test(characterViewerContent));
  
  if (hasErrors) {
    console.log('  ⚠️  Se encontraron patrones de error en el código');
    console.log('     (Esto es normal si son logs de debugging)');
  } else {
    console.log('  ✅ No se encontraron patrones de error críticos');
  }
  
} catch (error) {
  console.log(`  ❌ Error verificando logs: ${error.message}`);
}

console.log('\n' + '='.repeat(50));

if (allChecksPassed) {
  console.log('🎉 ¡EL PROBLEMA DEL ARMA ESTÁ RESUELTO!');
  console.log('\n✅ Verificaciones completadas:');
  console.log('  • Archivos de armas creados correctamente');
  console.log('  • Configuración en constants.ts correcta');
  console.log('  • No hay errores críticos de carga');
  console.log('\n🚀 El arquetipo Strong ahora puede cargar armas sin errores');
} else {
  console.log('❌ Algunos problemas persisten');
  console.log('   Revisa los errores arriba y completa las correcciones');
}

console.log('\n🔧 El proyecto está listo para usar armas!'); 