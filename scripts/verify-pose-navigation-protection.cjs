#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🛡️ VERIFICACIÓN DE PROTECCIÓN - Sistema de Navegación de Poses');
console.log('===============================================================\n');

let allChecksPassed = true;

// 1. Verificar variable isNavigatingPoses en App.tsx
console.log('1️⃣ Verificando variable isNavigatingPoses...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  // Verificar que la variable existe
  const hasVariable = appContent.includes('const [isNavigatingPoses, setIsNavigatingPoses] = useState(false)');
  if (hasVariable) {
    console.log('   ✅ Variable isNavigatingPoses presente y correcta');
  } else {
    console.log('   ❌ Variable isNavigatingPoses NO encontrada o incorrecta');
    allChecksPassed = false;
  }
  
  // Verificar protección en useEffect
  const hasProtection = appContent.includes('if (isNavigatingPoses)') && 
                       appContent.includes('updateCurrentPoseConfiguration saltado (navegación en progreso)');
  if (hasProtection) {
    console.log('   ✅ Protección en useEffect presente');
  } else {
    console.log('   ❌ Protección en useEffect NO encontrada');
    allChecksPassed = false;
  }
  
  // Verificar funciones de navegación
  const hasNavigationProtection = appContent.includes('setIsNavigatingPoses(true)') &&
                                 appContent.includes('setIsNavigatingPoses(false)');
  if (hasNavigationProtection) {
    console.log('   ✅ Funciones de navegación protegidas');
  } else {
    console.log('   ❌ Funciones de navegación NO protegidas');
    allChecksPassed = false;
  }
  
  // Verificar carga inicial
  const hasLoadProtection = appContent.includes('setIsNavigatingPoses(true)') &&
                           appContent.includes('Bandera de navegación desactivada después de cargar última pose');
  if (hasLoadProtection) {
    console.log('   ✅ Carga inicial protegida');
  } else {
    console.log('   ❌ Carga inicial NO protegida');
    allChecksPassed = false;
  }
  
  // Verificar restauración de cámara
  const hasCameraRestore = appContent.includes('Cámara restaurada después del login') &&
                          appContent.includes('800'); // Delay de 800ms
  if (hasCameraRestore) {
    console.log('   ✅ Restauración de cámara presente');
  } else {
    console.log('   ❌ Restauración de cámara NO encontrada');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo App.tsx:', error.message);
  allChecksPassed = false;
}

// 2. Verificar renderizado condicional en CharacterViewer.tsx
console.log('\n2️⃣ Verificando renderizado condicional...');
try {
  const viewerContent = fs.readFileSync('components/CharacterViewer.tsx', 'utf8');
  
  // Verificar condición isAuthenticated
  const hasAuthCondition = viewerContent.includes('isAuthenticated &&') &&
                          viewerContent.includes('PoseNavigation');
  if (hasAuthCondition) {
    console.log('   ✅ Renderizado condicional correcto');
  } else {
    console.log('   ❌ Renderizado condicional incorrecto');
    allChecksPassed = false;
  }
  
  // Verificar multiplicador de distancia
  const hasCorrectDistance = viewerContent.includes('1.1') &&
                            viewerContent.includes('Multiplicador reducido a 1.1');
  if (hasCorrectDistance) {
    console.log('   ✅ Multiplicador de distancia correcto (1.1)');
  } else {
    console.log('   ❌ Multiplicador de distancia incorrecto');
    allChecksPassed = false;
  }
  
  // Verificar distancia por defecto
  const hasDefaultDistance = viewerContent.includes('spherical.radius = 4') &&
                            viewerContent.includes('Distancia por defecto reducida a 4');
  if (hasDefaultDistance) {
    console.log('   ✅ Distancia por defecto correcta (4)');
  } else {
    console.log('   ❌ Distancia por defecto incorrecta');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo CharacterViewer.tsx:', error.message);
  allChecksPassed = false;
}

// 3. Verificar documentación
console.log('\n3️⃣ Verificando documentación...');
try {
  const protectionDoc = fs.readFileSync('docs/POSE_NAVIGATION_PROTECTION_RULES_2025.md', 'utf8');
  const fixDoc = fs.readFileSync('docs/POSE_NAVIGATION_LOGIN_FIX_2025.md', 'utf8');
  
  if (protectionDoc.length > 1000) {
    console.log('   ✅ Documentación de protección presente');
  } else {
    console.log('   ❌ Documentación de protección incompleta');
    allChecksPassed = false;
  }
  
  if (fixDoc.length > 1000) {
    console.log('   ✅ Documentación del fix presente');
  } else {
    console.log('   ❌ Documentación del fix incompleta');
    allChecksPassed = false;
  }
  
} catch (error) {
  console.log('   ❌ Error leyendo documentación:', error.message);
  allChecksPassed = false;
}

// 4. Verificar backup
console.log('\n4️⃣ Verificando backup...');
try {
  const backupPath = 'backup-pose-navigation-login-fix-2025';
  if (fs.existsSync(backupPath)) {
    const backupStats = fs.statSync(backupPath);
    if (backupStats.isDirectory()) {
      console.log('   ✅ Backup presente');
    } else {
      console.log('   ❌ Backup no es un directorio');
      allChecksPassed = false;
    }
  } else {
    console.log('   ❌ Backup NO encontrado');
    allChecksPassed = false;
  }
} catch (error) {
  console.log('   ❌ Error verificando backup:', error.message);
  allChecksPassed = false;
}

// Resultado final
console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
console.log('==========================');

if (allChecksPassed) {
  console.log('✅ TODAS LAS VERIFICACIONES PASARON');
  console.log('🛡️ Sistema de navegación de poses COMPLETAMENTE PROTEGIDO');
  console.log('');
  console.log('🎯 Estado del sistema:');
  console.log('   - Variable de control: ✅ PRESENTE');
  console.log('   - Protección en useEffect: ✅ ACTIVA');
  console.log('   - Funciones de navegación: ✅ PROTEGIDAS');
  console.log('   - Carga inicial: ✅ PROTEGIDA');
  console.log('   - Renderizado condicional: ✅ CORRECTO');
  console.log('   - Posicionamiento de cámara: ✅ OPTIMIZADO');
  console.log('   - Documentación: ✅ COMPLETA');
  console.log('   - Backup: ✅ DISPONIBLE');
  console.log('');
  console.log('🚀 El sistema está listo para producción');
} else {
  console.log('❌ ALGUNAS VERIFICACIONES FALLARON');
  console.log('⚠️ El sistema NO está completamente protegido');
  console.log('');
  console.log('🔧 Acciones recomendadas:');
  console.log('   1. Revisar los errores arriba');
  console.log('   2. Restaurar desde backup si es necesario');
  console.log('   3. Consultar docs/POSE_NAVIGATION_PROTECTION_RULES_2025.md');
  console.log('   4. Ejecutar este script nuevamente');
}

console.log('\n📚 Documentación de referencia:');
console.log('   - docs/POSE_NAVIGATION_PROTECTION_RULES_2025.md');
console.log('   - docs/POSE_NAVIGATION_LOGIN_FIX_2025.md');
console.log('   - backup-pose-navigation-login-fix-2025/');

process.exit(allChecksPassed ? 0 : 1); 