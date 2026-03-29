#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG: Verificando carga de capas...\n');

// Simular la lógica de CharacterViewer
const ALL_PARTS = [
  {
    id: 'strong_torso_01',
    name: 'Torso 01',
    category: 'TORSO',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/torso/strong_torso_01.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_cape_01_t01',
    name: 'Classic Cape (Torso 01)',
    category: 'CAPE',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/cape/strong_cape_01_t01.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_head_01_t01',
    name: 'Head 01',
    category: 'HEAD',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/head/strong_head_01_t01.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_hands_fist_01_t01_l_ng',
    name: 'Hand Left',
    category: 'HAND_LEFT',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/hands/strong_hands_fist_01_t01_l_ng.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_hands_fist_01_t01_r_ng',
    name: 'Hand Right',
    category: 'HAND_RIGHT',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/hands/strong_hands_fist_01_t01_r_ng.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_legs_01',
    name: 'Legs 01',
    category: 'LEGS',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/legs/strong_legs_01.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_boots_01_l0',
    name: 'Boots 01',
    category: 'BOOTS',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/boots/strong_boots_01_l0.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_belt_01',
    name: 'Belt 01',
    category: 'BELT',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/belt/strong_belt_01.glb',
    compatible: ['strong_torso_01'],
  },
  {
    id: 'strong_buckle_01',
    name: 'Buckle 01',
    category: 'BUCKLE',
    archetype: 'STRONG',
    gltfPath: 'assets/strong/buckle/strong_buckle_01.glb',
    compatible: ['strong_torso_01'],
  },
];

// Simular selectedParts vacío
const selectedParts = {};

console.log('📋 Estado inicial:');
console.log('- selectedParts vacío:', Object.keys(selectedParts).length === 0);
console.log('- isAuthenticated: false\n');

// Simular la lógica de CharacterViewer
const isAuthenticated = false;
const selectedArchetype = 'STRONG';

if (!isAuthenticated) {
  if (Object.keys(selectedParts).length === 0) {
    console.log('🔄 Usuario NO autenticado con selectedParts vacío, cargando partes por defecto');
    
    const defaultParts = ALL_PARTS.filter(part => part.archetype === selectedArchetype);
    console.log('🔍 Partes disponibles para STRONG:', defaultParts.map(p => `${p.category}: ${p.id}`));
    
    const torso = defaultParts.find(p => p.id === 'strong_torso_01');
    const head = defaultParts.find(p => p.id === 'strong_head_01_t01');
    const handLeft = defaultParts.find(p => p.id === 'strong_hands_fist_01_t01_l_ng');
    const handRight = defaultParts.find(p => p.id === 'strong_hands_fist_01_t01_r_ng');
    const legs = defaultParts.find(p => p.id === 'strong_legs_01');
    const boots = defaultParts.find(p => p.id === 'strong_boots_01_l0');
    const cape = defaultParts.find(p => p.id === 'strong_cape_01_t01');
    const belt = defaultParts.find(p => p.id === 'strong_belt_01');
    const buckle = defaultParts.find(p => p.id === 'strong_buckle_01');
    
    console.log('\n🔍 Verificación de partes encontradas:');
    console.log('- Torso:', torso ? '✅' : '❌', torso?.id);
    console.log('- Head:', head ? '✅' : '❌', head?.id);
    console.log('- Hand Left:', handLeft ? '✅' : '❌', handLeft?.id);
    console.log('- Hand Right:', handRight ? '✅' : '❌', handRight?.id);
    console.log('- Legs:', legs ? '✅' : '❌', legs?.id);
    console.log('- Boots:', boots ? '✅' : '❌', boots?.id);
    console.log('- Cape:', cape ? '✅' : '❌', cape?.id);
    console.log('- Belt:', belt ? '✅' : '❌', belt?.id);
    console.log('- Buckle:', buckle ? '✅' : '❌', buckle?.id);
    
    const partsToLoad = {
      ...(torso && { TORSO: torso }),
      ...(head && { HEAD: head }),
      ...(handLeft && { HAND_LEFT: handLeft }),
      ...(handRight && { HAND_RIGHT: handRight }),
      ...(legs && { LEGS: legs }),
      ...(boots && { BOOTS: boots }),
      ...(cape && { CAPE: cape }),
      ...(belt && { BELT: belt }),
      ...(buckle && { BUCKLE: buckle }),
    };
    
    console.log('\n📦 partsToLoad resultante:');
    Object.entries(partsToLoad).forEach(([category, part]) => {
      console.log(`- ${category}: ${part.id}`);
    });
    
    console.log('\n🔍 Verificación específica de capa:');
    console.log('- Cape en partsToLoad:', partsToLoad.CAPE ? '✅' : '❌');
    if (partsToLoad.CAPE) {
      console.log('  - ID:', partsToLoad.CAPE.id);
      console.log('  - Path:', partsToLoad.CAPE.gltfPath);
      console.log('  - Compatible con:', partsToLoad.CAPE.compatible);
    }
  }
}

// Verificar si el archivo existe
const capePath = path.join(__dirname, '..', 'public', 'assets', 'strong', 'cape', 'strong_cape_01_t01.glb');
console.log('\n📁 Verificación de archivo:');
console.log('- Ruta completa:', capePath);
console.log('- Archivo existe:', fs.existsSync(capePath) ? '✅' : '❌');

if (fs.existsSync(capePath)) {
  const stats = fs.statSync(capePath);
  console.log('- Tamaño:', (stats.size / 1024).toFixed(2), 'KB');
} else {
  console.log('❌ ERROR: El archivo de la capa no existe');
}

console.log('\n🎯 Conclusión:');
console.log('Si el archivo existe pero la capa no aparece en el visor,');
console.log('el problema está en la lógica de carga del modelo 3D.'); 