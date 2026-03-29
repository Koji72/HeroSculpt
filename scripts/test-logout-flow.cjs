const fs = require('fs');
const path = require('path');

console.log('🧪 Probando flujo de logout...\n');

// Leer el archivo constants.ts
const constantsPath = path.join(__dirname, '..', 'constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');

// Verificar que los builds por defecto no estén vacíos
const strongBuildMatch = constantsContent.match(/export const DEFAULT_STRONG_BUILD: SelectedParts = \{([\s\S]*?)\};/);
const justicieroBuildMatch = constantsContent.match(/export const DEFAULT_JUSTICIERO_BUILD: SelectedParts = \{([\s\S]*?)\};/);

console.log('🔍 Verificando builds por defecto:');

if (strongBuildMatch) {
  const strongBuildContent = strongBuildMatch[1];
  const hasParts = strongBuildContent.includes('PartCategory.TORSO') || 
                   strongBuildContent.includes('PartCategory.HEAD') ||
                   strongBuildContent.includes('PartCategory.HAND_LEFT');
  
  if (hasParts) {
    console.log('✅ DEFAULT_STRONG_BUILD tiene partes definidas');
    const partCount = (strongBuildContent.match(/PartCategory\./g) || []).length;
    console.log(`   - Número de partes: ${partCount}`);
  } else {
    console.log('❌ DEFAULT_STRONG_BUILD está vacío');
  }
} else {
  console.log('❌ No se pudo encontrar DEFAULT_STRONG_BUILD');
}

if (justicieroBuildMatch) {
  const justicieroBuildContent = justicieroBuildMatch[1];
  const hasParts = justicieroBuildContent.includes('PartCategory.TORSO') || 
                   justicieroBuildContent.includes('PartCategory.HEAD') ||
                   justicieroBuildContent.includes('PartCategory.HAND_LEFT');
  
  if (hasParts) {
    console.log('✅ DEFAULT_JUSTICIERO_BUILD tiene partes definidas');
    const partCount = (justicieroBuildContent.match(/PartCategory\./g) || []).length;
    console.log(`   - Número de partes: ${partCount}`);
  } else {
    console.log('❌ DEFAULT_JUSTICIERO_BUILD está vacío');
  }
} else {
  console.log('❌ No se pudo encontrar DEFAULT_JUSTICIERO_BUILD');
}

// Verificar que las partes estén en ALL_PARTS
console.log('\n🔍 Verificando que las partes estén en ALL_PARTS...');

const allPartsMatch = constantsContent.match(/export const ALL_PARTS: Part\[\] = \[([\s\S]*?)\];/);
if (allPartsMatch) {
  const allPartsContent = allPartsMatch[1];
  
  const requiredParts = [
    'strong_torso_01',
    'strong_head_01_t01',
    'strong_hands_fist_01_t01_l_g',
    'strong_hands_fist_01_t01_r_g',
    'justiciero_torso_01',
    'justiciero_head_01',
    'justiciero_hand_left_01',
    'justiciero_hand_right_01'
  ];
  
  console.log('   Verificando partes requeridas:');
  let allPartsExist = true;
  requiredParts.forEach(partId => {
    const exists = allPartsContent.includes(`id: '${partId}'`);
    console.log(`   - ${partId}: ${exists ? '✅' : '❌'}`);
    if (!exists) allPartsExist = false;
  });
  
  if (allPartsExist) {
    console.log('\n✅ Todas las partes requeridas están en ALL_PARTS');
  } else {
    console.log('\n❌ Algunas partes requeridas faltan en ALL_PARTS');
  }
} else {
  console.log('❌ No se pudo encontrar ALL_PARTS');
}

// Verificar el flujo de logout en App.tsx
console.log('\n🔍 Verificando flujo de logout en App.tsx...');

const appPath = path.join(__dirname, '..', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

// Verificar que handleSignOut existe y usa los builds por defecto
const signOutMatch = appContent.match(/const handleSignOut = async \(\) => \{([\s\S]*?)\};/);
if (signOutMatch) {
  const signOutContent = signOutMatch[1];
  
  const usesStrongBuild = signOutContent.includes('DEFAULT_STRONG_BUILD');
  const usesJusticieroBuild = signOutContent.includes('DEFAULT_JUSTICIERO_BUILD');
  const callsSetSelectedParts = signOutContent.includes('setSelectedParts');
  const callsResetState = signOutContent.includes('resetState');
  const callsSetCharacterViewerKey = signOutContent.includes('setCharacterViewerKey');
  
  console.log('   Verificando flujo de logout:');
  console.log(`   - Usa DEFAULT_STRONG_BUILD: ${usesStrongBuild ? '✅' : '❌'}`);
  console.log(`   - Usa DEFAULT_JUSTICIERO_BUILD: ${usesJusticieroBuild ? '✅' : '❌'}`);
  console.log(`   - Llama setSelectedParts: ${callsSetSelectedParts ? '✅' : '❌'}`);
  console.log(`   - Llama resetState: ${callsResetState ? '✅' : '❌'}`);
  console.log(`   - Llama setCharacterViewerKey: ${callsSetCharacterViewerKey ? '✅' : '❌'}`);
  
  if (usesStrongBuild && usesJusticieroBuild && callsSetSelectedParts && callsResetState && callsSetCharacterViewerKey) {
    console.log('\n✅ Flujo de logout parece correcto');
  } else {
    console.log('\n❌ Flujo de logout tiene problemas');
  }
} else {
  console.log('❌ No se pudo encontrar handleSignOut en App.tsx');
}

// Verificar que CharacterViewer recibe las partes
console.log('\n🔍 Verificando que CharacterViewer maneja las partes...');

const characterViewerPath = path.join(__dirname, '..', 'components', 'CharacterViewer.tsx');
const characterViewerContent = fs.readFileSync(characterViewerPath, 'utf8');

const performModelLoadMatch = characterViewerContent.match(/const performModelLoad = async \(\) => \{([\s\S]*?)\};/);
if (performModelLoadMatch) {
  const performModelLoadContent = performModelLoadMatch[1];
  
  const usesSelectedParts = performModelLoadContent.includes('selectedParts');
  const hasLogging = performModelLoadContent.includes('console.log');
  const loadsModels = performModelLoadContent.includes('modelCache.getModel');
  
  console.log('   Verificando performModelLoad:');
  console.log(`   - Usa selectedParts: ${usesSelectedParts ? '✅' : '❌'}`);
  console.log(`   - Tiene logging: ${hasLogging ? '✅' : '❌'}`);
  console.log(`   - Carga modelos: ${loadsModels ? '✅' : '❌'}`);
  
  if (usesSelectedParts && loadsModels) {
    console.log('\n✅ performModelLoad parece correcto');
  } else {
    console.log('\n❌ performModelLoad tiene problemas');
  }
} else {
  console.log('❌ No se pudo encontrar performModelLoad en CharacterViewer.tsx');
}

console.log('\n🎯 Resumen del flujo de logout:');
console.log('   1. Usuario hace logout');
console.log('   2. handleSignOut se ejecuta');
console.log('   3. Se asigna build por defecto según arquetipo');
console.log('   4. Se llama setSelectedParts con el build por defecto');
console.log('   5. Se resetea el CharacterViewer');
console.log('   6. CharacterViewer recibe las nuevas partes');
console.log('   7. performModelLoad carga los modelos');
console.log('   8. El visor muestra el modelo por defecto');

console.log('\n💡 Para debuggear en vivo:');
console.log('   - Abre la consola del navegador');
console.log('   - Haz logout');
console.log('   - Revisa los logs que empiezan con 🚪, 🔄, 🎯, 📦');
console.log('   - Verifica que las partes se asignan correctamente'); 