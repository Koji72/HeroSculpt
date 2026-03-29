const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DE CÁMARA - THREE.JS');
console.log('=====================================\n');

// Leer el archivo CharacterViewer.tsx
const characterViewerPath = path.join(__dirname, '../components/CharacterViewer.tsx');
const content = fs.readFileSync(characterViewerPath, 'utf8');

// Problemas identificados
const problems = [];

// 1. Verificar duplicación de enableDamping
const enableDampingMatches = content.match(/controls\.enableDamping = true;/g);
if (enableDampingMatches && enableDampingMatches.length > 1) {
  problems.push({
    type: 'DUPLICACIÓN',
    issue: 'enableDamping está duplicado',
    count: enableDampingMatches.length,
    lines: content.split('\n').map((line, index) => 
      line.includes('controls.enableDamping = true;') ? index + 1 : null
    ).filter(line => line !== null)
  });
}

// 2. Verificar duplicación de dampingFactor
const dampingFactorMatches = content.match(/controls\.dampingFactor = [\d.]+;/g);
if (dampingFactorMatches && dampingFactorMatches.length > 1) {
  problems.push({
    type: 'DUPLICACIÓN',
    issue: 'dampingFactor está duplicado',
    count: dampingFactorMatches.length,
    values: dampingFactorMatches.map(match => match.match(/[\d.]+/)[0])
  });
}

// 3. Verificar inconsistencias en distancias
const distanceMatches = content.match(/distance = [\d.]+/g);
if (distanceMatches && distanceMatches.length > 1) {
  problems.push({
    type: 'INCONSISTENCIA',
    issue: 'Múltiples valores de distancia diferentes',
    values: distanceMatches.map(match => match.match(/[\d.]+/)[0])
  });
}

// 4. Verificar problemas en la inicialización de controles
const controlsInitPattern = /const controls = new OrbitControls\(camera, renderer\.domElement\);/;
if (!controlsInitPattern.test(content)) {
  problems.push({
    type: 'ERROR',
    issue: 'Inicialización de OrbitControls no encontrada'
  });
}

// 5. Verificar problemas en el orden de inicialización
const cameraBeforeControls = content.indexOf('cameraRef.current = camera;') < content.indexOf('const controls = new OrbitControls');
if (cameraBeforeControls) {
  problems.push({
    type: 'ORDEN',
    issue: 'Cámara se asigna antes de crear los controles'
  });
}

// 6. Verificar problemas en el manejo de eventos
const setTimeoutPattern = /setTimeout.*camera.*position/g;
if (setTimeoutPattern.test(content)) {
  problems.push({
    type: 'TIMING',
    issue: 'Uso de setTimeout para restaurar posición de cámara (puede causar saltos)'
  });
}

// Mostrar resultados
console.log('📊 RESULTADOS DEL DIAGNÓSTICO:\n');

if (problems.length === 0) {
  console.log('✅ No se encontraron problemas críticos en la configuración de cámara');
} else {
  console.log(`❌ Se encontraron ${problems.length} problemas:\n`);
  
  problems.forEach((problem, index) => {
    console.log(`${index + 1}. ${problem.type}: ${problem.issue}`);
    if (problem.count) console.log(`   - Cantidad: ${problem.count}`);
    if (problem.values) console.log(`   - Valores: ${problem.values.join(', ')}`);
    if (problem.lines) console.log(`   - Líneas: ${problem.lines.join(', ')}`);
    console.log('');
  });
}

// Verificar configuración específica
console.log('🔧 CONFIGURACIÓN ACTUAL:');
const fovMatch = content.match(/new THREE\.PerspectiveCamera\(([\d.]+)/);
if (fovMatch) console.log(`- FOV: ${fovMatch[1]}°`);

const minDistanceMatch = content.match(/controls\.minDistance = ([\d.]+)/);
if (minDistanceMatch) console.log(`- Distancia mínima: ${minDistanceMatch[1]}`);

const maxDistanceMatch = content.match(/controls\.maxDistance = ([\d.]+)/);
if (maxDistanceMatch) console.log(`- Distancia máxima: ${maxDistanceMatch[1]}`);

const targetMatch = content.match(/controls\.target\.set\(([^)]+)\)/);
if (targetMatch) console.log(`- Target: ${targetMatch[1]}`);

console.log('\n🎯 RECOMENDACIONES:');
console.log('1. Eliminar duplicaciones de enableDamping y dampingFactor');
console.log('2. Estandarizar valores de distancia');
console.log('3. Revisar el orden de inicialización de cámara y controles');
console.log('4. Considerar usar transiciones suaves en lugar de setTimeout');
console.log('5. Verificar que los controles se actualicen correctamente después de cambios');

console.log('\n✅ Diagnóstico completado'); 