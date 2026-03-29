console.log('🔍 Debugging buckle state...');

// Verificar si el buckle está en el localStorage
const savedParts = localStorage.getItem('selectedParts');
if (savedParts) {
  try {
    const parts = JSON.parse(savedParts);
    console.log('📦 Saved parts from localStorage:');
    console.log(JSON.stringify(parts, null, 2));
    
    // Buscar buckle específicamente
    const buckle = Object.values(parts).find(part => part.category === 'BUCKLE');
    if (buckle) {
      console.log('✅ Buckle found in localStorage:', buckle);
    } else {
      console.log('❌ No buckle found in localStorage');
    }
  } catch (error) {
    console.log('❌ Error parsing localStorage:', error);
  }
} else {
  console.log('❌ No selectedParts in localStorage');
}

// Verificar si hay otros datos relacionados
const allKeys = Object.keys(localStorage);
console.log('🔑 All localStorage keys:', allKeys);

// Buscar cualquier referencia a buckle
allKeys.forEach(key => {
  if (key.toLowerCase().includes('buckle')) {
    console.log(`🔍 Found buckle-related key: ${key}`);
    console.log('Value:', localStorage.getItem(key));
  }
});

console.log('✅ Buckle debug completed'); 