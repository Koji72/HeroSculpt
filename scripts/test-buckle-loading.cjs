const fs = require('fs');
const path = require('path');

console.log('🔍 Testing buckle model loading...');

// Verificar que el archivo existe
const bucklePath = path.join(__dirname, '../public/assets/strong/buckle/strong_buckle_01.glb');
console.log('📁 Buckle path:', bucklePath);

if (fs.existsSync(bucklePath)) {
  const stats = fs.statSync(bucklePath);
  console.log('✅ Buckle file exists');
  console.log('📊 File size:', stats.size, 'bytes');
  console.log('📅 Last modified:', stats.mtime);
} else {
  console.log('❌ Buckle file not found');
}

// Verificar todos los buckles
const buckleDir = path.join(__dirname, '../public/assets/strong/buckle');
if (fs.existsSync(buckleDir)) {
  const files = fs.readdirSync(buckleDir);
  console.log('📂 Buckle directory contents:');
  files.forEach(file => {
    const filePath = path.join(buckleDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file}: ${stats.size} bytes`);
  });
} else {
  console.log('❌ Buckle directory not found');
}

console.log('✅ Buckle test completed'); 