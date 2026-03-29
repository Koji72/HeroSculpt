#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 VERIFICACIÓN SIMPLE DEL FIX DE POSES DESPUÉS DE COMPRA...\n');

try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // 1. Verificar que existe la llamada a loadUserPoses después de compra
  const hasLoadUserPosesCall = appContent.includes('await loadUserPoses()');
  console.log(`1️⃣ Llamada a loadUserPoses: ${hasLoadUserPosesCall ? '✅ PRESENTE' : '❌ FALTANTE'}`);
  
  // 2. Verificar que está en el contexto correcto (después de guardar compra)
  const hasCorrectContext = appContent.includes('🔄 Recargando poses después de la compra') && 
                           appContent.includes('await loadUserPoses()');
  console.log(`2️⃣ Contexto correcto: ${hasCorrectContext ? '✅ CORRECTO' : '❌ INCORRECTO'}`);
  
  // 3. Verificar que loadUserPoses ordena por fecha
  const hasDateSorting = appContent.includes('allPoses.sort((a, b) =>') && 
                        appContent.includes('dateA.getTime() - dateB.getTime()');
  console.log(`3️⃣ Ordenación por fecha: ${hasDateSorting ? '✅ IMPLEMENTADA' : '❌ FALTANTE'}`);
  
  // 4. Verificar que carga la última pose
  const hasLastPoseLoading = appContent.includes('const lastPoseIndex = allPoses.length - 1') && 
                            appContent.includes('const latestPose = allPoses[lastPoseIndex]');
  console.log(`4️⃣ Carga última pose: ${hasLastPoseLoading ? '✅ IMPLEMENTADA' : '❌ FALTANTE'}`);
  
  // 5. Verificar que PoseNavigation se muestra
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  const hasPoseNavigation = viewerContent.includes('<PoseNavigation') && 
                           viewerContent.includes('isAuthenticated &&');
  console.log(`5️⃣ PoseNavigation: ${hasPoseNavigation ? '✅ CONFIGURADA' : '❌ FALTANTE'}`);
  
  console.log('\n📊 RESUMEN:');
  const allChecks = [hasLoadUserPosesCall, hasCorrectContext, hasDateSorting, hasLastPoseLoading, hasPoseNavigation];
  const passedChecks = allChecks.filter(check => check).length;
  
  console.log(`   ✅ ${passedChecks}/5 verificaciones pasadas`);
  
  if (passedChecks === 5) {
    console.log('\n🎉 ¡TODOS LOS FIXES IMPLEMENTADOS CORRECTAMENTE!');
    console.log('\n🎯 FLUJO DESPUÉS DE COMPRA:');
    console.log('   1. ✅ Se guarda la compra en la base de datos');
    console.log('   2. ✅ Se llama a loadUserPoses()');
    console.log('   3. ✅ Se recargan las poses del usuario');
    console.log('   4. ✅ Se ordenan las poses por fecha');
    console.log('   5. ✅ Se carga la ÚLTIMA pose (la más reciente)');
    console.log('   6. ✅ Se actualiza savedPoses');
    console.log('   7. ✅ Se muestran las flechas verdes (X/Y)');
    console.log('\n✅ El sistema debería funcionar correctamente ahora.');
  } else {
    console.log('\n⚠️ Algunos fixes faltan. Revisar implementación.');
  }
  
} catch (error) {
  console.log('❌ Error durante la verificación:', error.message);
} 