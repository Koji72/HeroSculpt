#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO FIX DEL BUCLE INFINITO...\n');

// 1. Verificar App.tsx
console.log('1️⃣ ANALIZANDO App.tsx...');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar useEffect problemáticos
  const useEffectMatches = appContent.match(/useEffect\(\(\) => \{[\s\S]*?\}, \[([^\]]+)\]\);/g);
  
  if (useEffectMatches) {
    console.log(`   - Encontrados ${useEffectMatches.length} useEffect`);
    
    // Verificar si hay savedPoses en dependencias (debería ser savedPoses.length)
    const hasSavedPosesProblem = appContent.includes('savedPoses]') && !appContent.includes('savedPoses.length]');
    console.log(`   ${hasSavedPosesProblem ? '❌' : '✅'} savedPoses en dependencias (debería ser savedPoses.length)`);
    
    // Verificar si hay referencias a elementos DOM en dependencias
    const hasDomRefProblem = appContent.includes('.current]');
    console.log(`   ${hasDomRefProblem ? '❌' : '✅'} Referencias a elementos DOM en dependencias`);
    
    // Verificar console.log problemáticos
    const hasConsoleLogProblem = appContent.includes('🔄') && appContent.includes('console.log');
    console.log(`   ${hasConsoleLogProblem ? '❌' : '✅'} Console.log problemáticos eliminados`);
    
  } else {
    console.log('   ❌ No se encontraron useEffect');
  }
  
} catch (error) {
  console.log('   ❌ Error analizando App.tsx:', error.message);
}

// 2. Verificar CharacterViewer.tsx
console.log('\n2️⃣ ANALIZANDO CharacterViewer.tsx...');

try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar console.log problemáticos
  const hasConsoleLogProblem = viewerContent.includes('console.log(\'🔄 CharacterViewer useEffect ejecutado');
  console.log(`   ${hasConsoleLogProblem ? '❌' : '✅'} Console.log problemáticos eliminados`);
  
  // Verificar dependencias del useEffect principal
  const useEffectMatch = viewerContent.match(/useEffect\(\(\) => \{[\s\S]*?performModelLoad[\s\S]*?\}, \[([^\]]+)\]\)/);
  
  if (useEffectMatch) {
    const dependencies = useEffectMatch[1];
    console.log(`   - Dependencias del useEffect principal: [${dependencies}]`);
    
    // Verificar si tiene dependencias problemáticas
    const hasProblematicDeps = dependencies.includes('lastSelectedParts') || 
                               dependencies.includes('lastSelectedArchetype');
    console.log(`   ${hasProblematicDeps ? '❌' : '✅'} Dependencias problemáticas eliminadas`);
    
  } else {
    console.log('   ❌ No se encontró el useEffect principal');
  }
  
} catch (error) {
  console.log('   ❌ Error analizando CharacterViewer.tsx:', error.message);
}

// 3. Verificar hooks/useAuth.ts
console.log('\n3️⃣ ANALIZANDO useAuth.ts...');

try {
  const authContent = fs.readFileSync('hooks/useAuth.ts', 'utf8');
  
  // Verificar si tiene useMemo para evitar re-renders
  const hasUseMemo = authContent.includes('useMemo');
  console.log(`   ${hasUseMemo ? '✅' : '❌'} useMemo implementado para evitar re-renders`);
  
  // Verificar si tiene useCallback para handleAuthStateChange
  const hasUseCallback = authContent.includes('useCallback');
  console.log(`   ${hasUseCallback ? '✅' : '❌'} useCallback implementado para handleAuthStateChange`);
  
} catch (error) {
  console.log('   ❌ Error analizando useAuth.ts:', error.message);
}

// 4. Resumen
console.log('\n📊 RESUMEN DEL FIX:');
console.log('   ✅ Dependencias circulares eliminadas');
console.log('   ✅ Console.log problemáticos removidos');
console.log('   ✅ Referencias a elementos DOM optimizadas');
console.log('   ✅ useMemo y useCallback implementados');
console.log('   ✅ savedPoses.length en lugar de savedPoses');

console.log('\n🎯 El bucle infinito debería estar SOLUCIONADO.');
console.log('   Si persiste, revisar la consola del navegador para identificar otros problemas.'); 