const fs = require('fs');
const path = require('path');

console.log('🧪 TESTING CAMERA FIXES 2025');
console.log('============================\n');

// Leer el archivo CharacterViewer.tsx
const characterViewerPath = path.join(__dirname, '../components/CharacterViewer.tsx');
const content = fs.readFileSync(characterViewerPath, 'utf8');

// Verificar que las correcciones se aplicaron correctamente
const tests = [];

// Test 1: Verificar que no hay duplicaciones de enableDamping
const enableDampingMatches = content.match(/controls\.enableDamping = true;/g);
if (enableDampingMatches && enableDampingMatches.length === 1) {
  tests.push({ name: 'No duplicación enableDamping', status: '✅ PASS' });
} else {
  tests.push({ name: 'No duplicación enableDamping', status: '❌ FAIL', details: `Encontradas ${enableDampingMatches?.length || 0} instancias` });
}

// Test 2: Verificar que no hay duplicaciones de dampingFactor
const dampingFactorMatches = content.match(/controls\.dampingFactor = [\d.]+;/g);
if (dampingFactorMatches && dampingFactorMatches.length === 1) {
  tests.push({ name: 'No duplicación dampingFactor', status: '✅ PASS' });
} else {
  tests.push({ name: 'No duplicación dampingFactor', status: '❌ FAIL', details: `Encontradas ${dampingFactorMatches?.length || 0} instancias` });
}

// Test 3: Verificar que se usa CAMERA_DISTANCE consistentemente
const cameraDistanceMatches = content.match(/CAMERA_DISTANCE = 8/g);
if (cameraDistanceMatches && cameraDistanceMatches.length >= 3) {
  tests.push({ name: 'Uso consistente de CAMERA_DISTANCE', status: '✅ PASS', details: `${cameraDistanceMatches.length} usos encontrados` });
} else {
  tests.push({ name: 'Uso consistente de CAMERA_DISTANCE', status: '❌ FAIL', details: `${cameraDistanceMatches?.length || 0} usos encontrados` });
}

// Test 4: Verificar que el botón reset usa la lógica correcta
const resetButtonLogic = content.includes('const CAMERA_DISTANCE = 8; // Distancia estándar') && 
                         content.includes('controlsRef.current.target.set(0, 1.5, 0); // Target consistente');
if (resetButtonLogic) {
  tests.push({ name: 'Botón reset usa lógica correcta', status: '✅ PASS' });
} else {
  tests.push({ name: 'Botón reset usa lógica correcta', status: '❌ FAIL' });
}

// Test 5: Verificar que se eliminó la restauración problemática
const restorationCode = content.includes('currentCameraPosition') && content.includes('currentCameraRotation');
if (!restorationCode) {
  tests.push({ name: 'Eliminada restauración problemática', status: '✅ PASS' });
} else {
  tests.push({ name: 'Eliminada restauración problemática', status: '❌ FAIL' });
}

// Test 6: Verificar que el target es consistente
const targetMatches = content.match(/controls\.target\.set\(0, 1\.5, 0\)/g);
if (targetMatches && targetMatches.length >= 2) {
  tests.push({ name: 'Target consistente (0, 1.5, 0)', status: '✅ PASS', details: `${targetMatches.length} usos encontrados` });
} else {
  tests.push({ name: 'Target consistente (0, 1.5, 0)', status: '❌ FAIL', details: `${targetMatches?.length || 0} usos encontrados` });
}

// Mostrar resultados
console.log('📊 RESULTADOS DE LAS PRUEBAS:\n');

let passedTests = 0;
let totalTests = tests.length;

tests.forEach((test, index) => {
  console.log(`${index + 1}. ${test.name}: ${test.status}`);
  if (test.details) {
    console.log(`   ${test.details}`);
  }
  if (test.status === '✅ PASS') passedTests++;
});

console.log(`\n📈 RESUMEN: ${passedTests}/${totalTests} pruebas pasaron`);

if (passedTests === totalTests) {
  console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! La cámara debería funcionar correctamente.');
} else {
  console.log('\n⚠️ Algunas pruebas fallaron. Revisar las correcciones.');
}

// Verificar configuración final
console.log('\n🔧 CONFIGURACIÓN FINAL:');
const fovMatch = content.match(/new THREE\.PerspectiveCamera\(([\d.]+)/);
if (fovMatch) console.log(`- FOV: ${fovMatch[1]}°`);

const minDistanceMatch = content.match(/controls\.minDistance = ([\d.]+)/);
if (minDistanceMatch) console.log(`- Distancia mínima: ${minDistanceMatch[1]}`);

const maxDistanceMatch = content.match(/controls\.maxDistance = ([\d.]+)/);
if (maxDistanceMatch) console.log(`- Distancia máxima: ${maxDistanceMatch[1]}`);

const dampingFactorMatch = content.match(/controls\.dampingFactor = ([\d.]+)/);
if (dampingFactorMatch) console.log(`- Damping Factor: ${dampingFactorMatch[1]}`);

console.log('\n✅ Test completado'); 