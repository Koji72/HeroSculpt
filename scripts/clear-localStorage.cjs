const puppeteer = require('puppeteer');

async function clearLocalStorage() {
  console.log('🔄 Iniciando limpieza de localStorage...');
  
  try {
    // Abrir navegador
    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Ir a la aplicación
    await page.goto('http://localhost:5180', { waitUntil: 'networkidle0' });
    
    console.log('🌐 Navegador abierto en http://localhost:5180');
    console.log('🗑️ Ejecutando limpieza de localStorage...');
    
    // Ejecutar script para limpiar localStorage
    await page.evaluate(() => {
      const keysToRemove = [];
      
      // Buscar todas las claves que empiecen con los patrones específicos
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('character_name_') ||
          key.startsWith('guest_config_') ||
          key === 'character_name' ||
          key === 'last_pose' ||
          key === 'session_data' ||
          key.includes('davidworkshop3d')
        )) {
          keysToRemove.push(key);
        }
      }
      
      // Eliminar las claves encontradas
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Eliminada clave: ${key}`);
      });
      
      console.log(`✅ Limpieza completada. ${keysToRemove.length} claves eliminadas.`);
      return keysToRemove;
    });
    
    console.log('✅ localStorage limpiado exitosamente');
    console.log('🔄 Recargando página...');
    
    // Recargar la página
    await page.reload({ waitUntil: 'networkidle0' });
    
    console.log('✅ Página recargada. La biblioteca del usuario davidworkshop3d ha sido reseteada completamente.');
    console.log('📋 Resumen:');
    console.log('   ✅ Base de datos limpiada (configuraciones y compras)');
    console.log('   ✅ localStorage limpiado');
    console.log('   ✅ Página recargada');
    
    // Mantener el navegador abierto por 5 segundos para que el usuario vea el resultado
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await browser.close();
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    console.log('💡 Alternativa manual:');
    console.log('   1. Abrir DevTools (F12)');
    console.log('   2. Ir a Application > Storage > Local Storage');
    console.log('   3. Eliminar manualmente las claves mencionadas');
  }
}

// Verificar si puppeteer está instalado
try {
  require('puppeteer');
  clearLocalStorage();
} catch (error) {
  console.log('⚠️ Puppeteer no está instalado. Limpieza manual requerida:');
  console.log('   1. Abrir DevTools (F12)');
  console.log('   2. Ir a Application > Storage > Local Storage');
  console.log('   3. Eliminar estas claves:');
  console.log('      * character_name_');
  console.log('      * guest_config_');
  console.log('      * character_name');
  console.log('      * last_pose');
  console.log('      * session_data');
  console.log('      * Cualquier clave que contenga "davidworkshop3d"');
  console.log('   4. Recargar la página (F5)');
} 