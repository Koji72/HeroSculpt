const fs = require('fs');

console.log('🔄 FORZAR RECARGA DE POSES');
console.log('==========================\n');

// Verificar que los archivos están actualizados
console.log('📁 VERIFICACIÓN DE ARCHIVOS ACTUALIZADOS:');
const filesToCheck = [
  'App.tsx',
  'components/PoseNavigation.tsx',
  'components/CharacterViewer.tsx'
];

filesToCheck.forEach(file => {
  const exists = fs.existsSync(file);
  const stats = exists ? fs.statSync(file) : null;
  const lastModified = exists ? new Date(stats.mtime).toLocaleString() : 'No existe';
  console.log(`   ${exists ? '✅' : '❌'} ${file} - Última modificación: ${lastModified}`);
});

// Simular el proceso de carga de poses de prueba
console.log('\n🎯 SIMULACIÓN DE CARGA DE POSES DE PRUEBA:');

const testPoses = [
  {
    id: 'test-pose-1',
    name: 'Superhéroe Básico (Compra)',
    configuration: {
      TORSO: { 
        id: 'strong_torso_01', 
        name: 'Torso Básico', 
        priceUSD: 5.99,
        category: 'TORSO',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/torso/strong_torso_01.glb',
        compatible: ['strong_torso_01'],
        thumbnail: '/assets/ui/torso_thumb.png'
      },
      HEAD: { 
        id: 'strong_head_01_t01', 
        name: 'Cabeza Básica', 
        priceUSD: 3.99,
        category: 'HEAD',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/head/strong_head_01_t01.glb',
        compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
        thumbnail: '/assets/ui/head_thumb.png'
      }
    },
    source: 'purchase',
    date: '2025-01-15T10:30:00Z'
  },
  {
    id: 'test-pose-2',
    name: 'Villano Oscuro (Compra)',
    configuration: {
      TORSO: { 
        id: 'strong_torso_02', 
        name: 'Torso Oscuro', 
        priceUSD: 7.99,
        category: 'TORSO',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/torso/strong_torso_02.glb',
        compatible: ['strong_torso_02'],
        thumbnail: '/assets/ui/torso_thumb.png'
      },
      CAPE: { 
        id: 'strong_cape_01_t01', 
        name: 'Capa Negra', 
        priceUSD: 4.99,
        category: 'CAPE',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/cape/strong_cape_01_t01.glb',
        compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
        thumbnail: '/assets/ui/cape_thumb.png'
      }
    },
    source: 'purchase',
    date: '2025-01-14T15:45:00Z'
  },
  {
    id: 'test-pose-3',
    name: 'Mi Superhéroe Personalizado (Guardado)',
    configuration: {
      TORSO: { 
        id: 'strong_torso_01', 
        name: 'Torso Personalizado', 
        priceUSD: 0,
        category: 'TORSO',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/torso/strong_torso_01.glb',
        compatible: ['strong_torso_01'],
        thumbnail: '/assets/ui/torso_thumb.png'
      },
      HEAD: { 
        id: 'strong_head_01_t02', 
        name: 'Cabeza Personalizada', 
        priceUSD: 0,
        category: 'HEAD',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/head/strong_head_01_t02.glb',
        compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
        thumbnail: '/assets/ui/head_thumb.png'
      },
      HAND_LEFT: { 
        id: 'strong_hands_open_01_t01_l_g', 
        name: 'Mano Izquierda Abierta', 
        priceUSD: 0,
        category: 'HAND_LEFT',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/hands/strong_hands_open_01_t01_l_g.glb',
        compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
        thumbnail: '/assets/ui/hands_thumb.png'
      },
      HAND_RIGHT: { 
        id: 'strong_hands_open_01_t01_r_g', 
        name: 'Mano Derecha Abierta', 
        priceUSD: 0,
        category: 'HAND_RIGHT',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/hands/strong_hands_open_01_t01_r_g.glb',
        compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
        thumbnail: '/assets/ui/hands_thumb.png'
      }
    },
    source: 'saved',
    date: '2025-01-13T09:20:00Z'
  },
  {
    id: 'test-pose-4',
    name: 'Protector de la Ciudad (Guardado)',
    configuration: {
      TORSO: { 
        id: 'strong_torso_03', 
        name: 'Torso Protector', 
        priceUSD: 0,
        category: 'TORSO',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/torso/strong_torso_03.glb',
        compatible: ['strong_torso_03'],
        thumbnail: '/assets/ui/torso_thumb.png'
      },
      SYMBOL: { 
        id: 'strong_symbol_01_t01', 
        name: 'Símbolo Protector', 
        priceUSD: 0,
        category: 'SYMBOL',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/symbol/strong_symbol_01_t01.glb',
        compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
        thumbnail: '/assets/ui/symbol_thumb.png'
      },
      CAPE: { 
        id: 'strong_cape_01_t02', 
        name: 'Capa Protectora', 
        priceUSD: 0,
        category: 'CAPE',
        archetype: 'STRONG',
        gltfPath: '/assets/models/strong/cape/strong_cape_01_t02.glb',
        compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
        thumbnail: '/assets/ui/cape_thumb.png'
      }
    },
    source: 'saved',
    date: '2025-01-12T14:15:00Z'
  }
];

console.log(`✅ ${testPoses.length} poses de prueba creadas:`);
testPoses.forEach((pose, index) => {
  console.log(`   ${index + 1}. ${pose.name} (${pose.source})`);
  console.log(`      Partes: ${Object.keys(pose.configuration).join(', ')}`);
  console.log(`      Fecha: ${pose.date}`);
});

// Simular navegación
console.log('\n🧪 SIMULACIÓN DE NAVEGACIÓN:');

let currentPoseIndex = 0;
const totalPoses = testPoses.length;

console.log(`\n🎯 Estado inicial: ${currentPoseIndex + 1}/${totalPoses}`);
console.log(`   Pose actual: ${testPoses[currentPoseIndex].name}`);

// Simular navegación hacia adelante
console.log('\n➡️ Navegación hacia adelante:');
for (let i = 0; i < totalPoses; i++) {
  const newIndex = (currentPoseIndex + i) % totalPoses;
  console.log(`   ${i + 1}. ${testPoses[newIndex].name} (${newIndex + 1}/${totalPoses})`);
}

// Simular navegación hacia atrás
console.log('\n⬅️ Navegación hacia atrás:');
for (let i = 0; i < totalPoses; i++) {
  const newIndex = (currentPoseIndex - i + totalPoses) % totalPoses;
  console.log(`   ${i + 1}. ${testPoses[newIndex].name} (${newIndex + 1}/${totalPoses})`);
}

// Simular selección directa
console.log('\n🎯 Selección directa:');
testPoses.forEach((pose, index) => {
  console.log(`   ${index + 1}. ${pose.name} - Click directo`);
});

console.log('\n================================');
console.log('🔄 VERIFICACIÓN COMPLETADA');
console.log('================================');

console.log('\n📋 LO QUE DEBERÍA VERSE EN LA APLICACIÓN:');
console.log('1. Contador en la esquina superior izquierda: "1/4"');
console.log('2. Al hacer click en el contador, se abre selector con:');
testPoses.forEach((pose, index) => {
  const isCurrent = index === 0;
  console.log(`   ${isCurrent ? '✓' : ' '} ${pose.name} (${pose.source})`);
  console.log(`      Fecha: ${new Date(pose.date).toLocaleDateString()}`);
});
console.log('3. Navegación con flechas ◀ ▶ funciona');
console.log('4. Selección directa desde el selector funciona');

console.log('\n🚀 COMANDOS PARA EJECUTAR EN LA CONSOLA DEL NAVEGADOR:');
console.log('1. Abrir consola (F12)');
console.log('2. Buscar logs que empiecen con "🎯 Loading test poses..."');
console.log('3. Verificar que aparecen 4 poses de prueba');
console.log('4. Probar navegación con flechas');
console.log('5. Probar selección directa desde el contador');

console.log('\n⚠️ SI NO FUNCIONA:');
console.log('1. Verificar que el servidor de desarrollo está corriendo');
console.log('2. Recargar la página (Ctrl+F5)');
console.log('3. Verificar que no hay errores en la consola');
console.log('4. Ejecutar: loadTestPoses() en la consola para forzar carga');

console.log('\n✅ RESULTADO ESPERADO:');
console.log(`   - ${totalPoses} poses disponibles`);
console.log('   - Contador clickeable funcional');
console.log('   - Navegación con flechas funcional');
console.log('   - Selección directa funcional');
console.log('   - Información detallada mostrada'); 