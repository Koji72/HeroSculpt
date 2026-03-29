console.log('🔍 TESTING WEAPON TYPE DETECTION');

// Simular la función getHandType del código actual
const getHandType = (handId) => {
  // Verificar tipos específicos primero usando el patrón correcto
  if (handId.includes('hands_pistol_')) return 'pistol';
  if (handId.includes('hands_hammer_')) return 'hammer';
  if (handId.includes('hands_fist_')) return 'fist';
  if (handId.includes('hands_noweapon_')) return 'noweapon';
  if (handId.includes('hands_bands_')) return 'bands';
  
  // Fallback para otros patrones
  const match = handId.match(/hands_([a-z]+)_\d+_t\d+_[lr]/);
  if (match) return match[1];
  const fallback = handId.match(/hands_([a-z]+)_\d+/);
  if (fallback) return fallback[1];
  
  return null;
};

// Casos de prueba
const testCases = [
  'strong_hands_pistol_01_t01_l_ng',
  'strong_hands_pistol_01_t01_r_ng',
  'strong_hands_hammer_01_t01_l_ng',
  'strong_hands_hammer_01_t01_r_ng',
  'strong_hands_fist_01_t01_l_ng',
  'strong_hands_fist_01_t01_r_ng',
  'strong_hands_bands_01_t01_l_ng',
  'strong_hands_bands_01_t01_r_ng',
  'strong_hands_noweapon_01_t01_l_ng',
  'strong_hands_noweapon_01_t01_r_ng'
];

console.log('🧪 Probando detección de tipos de arma:');
testCases.forEach(handId => {
  const detectedType = getHandType(handId);
  console.log(`  ${handId} → ${detectedType}`);
});

// Simular escenario de cambio de torso
console.log('\n🎯 Simulando cambio de torso con pistolas:');

const currentParts = {
  'HAND_LEFT': { id: 'strong_hands_pistol_01_t01_l_ng' },
  'HAND_RIGHT': { id: 'strong_hands_pistol_01_t01_r_ng' }
};

const currentLeftType = getHandType(currentParts['HAND_LEFT'].id);
const currentRightType = getHandType(currentParts['HAND_RIGHT'].id);

console.log('Estado inicial:');
console.log(`  - Mano izquierda: ${currentParts['HAND_LEFT'].id} (tipo: ${currentLeftType})`);
console.log(`  - Mano derecha: ${currentParts['HAND_RIGHT'].id} (tipo: ${currentRightType})`);

// Simular manos compatibles para torso 02
const compatibleHands = [
  'strong_hands_pistol_01_t02_l_ng',
  'strong_hands_pistol_01_t02_r_ng',
  'strong_hands_hammer_01_t02_l_ng',
  'strong_hands_hammer_01_t02_r_ng',
  'strong_hands_fist_01_t02_l_ng',
  'strong_hands_fist_01_t02_r_ng'
];

console.log('\nManos compatibles con torso 02:');
compatibleHands.forEach(handId => {
  const type = getHandType(handId);
  console.log(`  - ${handId} (tipo: ${type})`);
});

// Simular findMatchingHand
const findMatchingHand = (hands, targetType) => {
  console.log(`\n🔍 Buscando manos tipo "${targetType}":`);
  const matching = hands.filter(handId => getHandType(handId) === targetType);
  console.log(`  - Encontradas: ${matching.length} manos`);
  matching.forEach(handId => console.log(`    * ${handId}`));
  return matching[0] || hands[0];
};

const selectedLeftHand = findMatchingHand(compatibleHands, currentLeftType);
const selectedRightHand = findMatchingHand(compatibleHands, currentRightType);

console.log('\n🎯 RESULTADO:');
console.log(`  - Mano izquierda seleccionada: ${selectedLeftHand} (tipo: ${getHandType(selectedLeftHand)})`);
console.log(`  - Mano derecha seleccionada: ${selectedRightHand} (tipo: ${getHandType(selectedRightHand)})`);
console.log(`  - ¿Izquierda mantiene tipo? ${getHandType(currentParts['HAND_LEFT'].id) === getHandType(selectedLeftHand)}`);
console.log(`  - ¿Derecha mantiene tipo? ${getHandType(currentParts['HAND_RIGHT'].id) === getHandType(selectedRightHand)}`); 