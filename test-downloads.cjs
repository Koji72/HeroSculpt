const http = require('http');
const fs = require('fs');

async function testDownloads() {
  console.log('🧪 PROBANDO ENLACES DE DESCARGA');
  console.log('═══════════════════════════════════════');
  
  // Configuración de prueba
  const testConfigId = 'test_config_123';
  const testConfig = {
    selectedParts: {
      TORSO: { name: 'Strong Torso Alpha', priceUSD: 1.5 },
      LOWER_BODY: { name: 'Strong Legs Alpha', priceUSD: 1.0 },
      HEAD: { name: 'Strong Head 01', priceUSD: 1.2 },
      HAND_LEFT: { name: 'Left Fist (Ungloved)', priceUSD: 0.5 },
      HAND_RIGHT: { name: 'Right Fist (Ungloved)', priceUSD: 0.5 },
      CAPE: { name: 'Classic Cape', priceUSD: 0.35 },
      BOOTS: { name: 'Strong Boots Combat', priceUSD: 0.75 },
      SYMBOL: { name: 'Strong Symbol Alpha', priceUSD: 0.3 }
    },
    totalPrice: 6.1,
    configName: 'Test Configuration',
    email: 'test@example.com'
  };

  try {
    // 1. Guardar configuración de prueba
    console.log('1️⃣ Guardando configuración de prueba...');
    await saveTestConfig(testConfigId, testConfig);
    
    // 2. Probar descarga GLB
    console.log('\n2️⃣ Probando descarga GLB...');
    await testDownload(testConfigId, 'glb');
    
    // 3. Probar descarga STL
    console.log('\n3️⃣ Probando descarga STL...');
    await testDownload(testConfigId, 'stl');
    
    console.log('\n✅ TODAS LAS PRUEBAS COMPLETADAS');
    
  } catch (error) {
    console.error('❌ ERROR EN PRUEBAS:', error.message);
  }
}

function saveTestConfig(configId, config) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      configId,
      configuration: config
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/save-config',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Configuración guardada exitosamente');
          resolve();
        } else {
          reject(new Error(`Error guardando configuración: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function testDownload(configId, format) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/download/${configId}/${format}`,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        let dataLength = 0;
        const chunks = [];
        
        res.on('data', (chunk) => {
          chunks.push(chunk);
          dataLength += chunk.length;
        });
        
        res.on('end', () => {
          const fileData = Buffer.concat(chunks);
          const fileName = `test_download.${format}`;
          
          // Guardar archivo para verificación
          fs.writeFileSync(fileName, fileData);
          
          console.log(`✅ Descarga ${format.toUpperCase()} exitosa:`);
          console.log(`   📁 Archivo: ${fileName}`);
          console.log(`   📊 Tamaño: ${dataLength} bytes`);
          console.log(`   🎯 Content-Type: ${res.headers['content-type']}`);
          console.log(`   📥 Content-Disposition: ${res.headers['content-disposition']}`);
          
          // Verificar contenido básico
          if (format === 'glb') {
            verifyGLBFile(fileData);
          } else if (format === 'stl') {
            verifySTLFile(fileData);
          }
          
          resolve();
        });
      } else {
        reject(new Error(`Error descargando ${format}: ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.end();
  });
}

function verifyGLBFile(data) {
  console.log('🔍 Verificando archivo GLB...');
  
  // Verificar magic number de GLB
  const magic = data.readUInt32LE(0);
  if (magic === 0x46546C67) { // 'glTF'
    console.log('✅ Archivo GLB válido (magic number correcto)');
    const version = data.readUInt32LE(4);
    const length = data.readUInt32LE(8);
    console.log(`   📋 Versión: ${version}`);
    console.log(`   📏 Longitud: ${length} bytes`);
  } else {
    console.log('⚠️  Archivo GLB simulado (no es GLB real)');
  }
}

function verifySTLFile(data) {
  console.log('🔍 Verificando archivo STL...');
  
  // Verificar header STL
  const header = data.slice(0, 80).toString('ascii');
  const triangleCount = data.readUInt32LE(80);
  
  console.log(`   📋 Header: ${header.substring(0, 30)}...`);
  console.log(`   🔺 Triángulos: ${triangleCount}`);
  
  // Calcular tamaño esperado: 80 bytes header + 4 bytes count + (50 bytes * triangles)
  const expectedSize = 80 + 4 + (triangleCount * 50);
  
  if (data.length === expectedSize) {
    console.log('✅ Archivo STL válido (tamaño correcto)');
  } else {
    console.log(`⚠️  Tamaño STL incorrecto: ${data.length} vs ${expectedSize} esperado`);
  }
}

// Ejecutar pruebas
testDownloads(); 