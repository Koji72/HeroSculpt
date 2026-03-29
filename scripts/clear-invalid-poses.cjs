// scripts/clear-invalid-poses.cjs
const puppeteer = require('puppeteer');

async function clearInvalidPoses() {
  console.log('🚀 Launching browser to clear invalid poses...');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // No es necesario navegar a la página, solo ejecutar el script en el contexto del navegador
  await page.evaluate(() => {
    try {
      const savedPoses = JSON.parse(localStorage.getItem('savedPoses') || '[]');
      if (!Array.isArray(savedPoses)) {
        console.log('🗑️ Invalid "savedPoses" format. Clearing localStorage.');
        localStorage.clear();
        return;
      }

      const validPoses = savedPoses.filter(pose => pose && typeof pose.name === 'string' && pose.name.trim() !== '');
      
      if (validPoses.length < savedPoses.length) {
        console.log(`🧹 Found ${savedPoses.length - validPoses.length} invalid poses. Cleaning up...`);
        localStorage.setItem('savedPoses', JSON.stringify(validPoses));
        console.log('✅ localStorage cleaned successfully.');
      } else {
        console.log('✨ No invalid poses found. localStorage is clean.');
      }
    } catch (error) {
      console.error('❌ Error cleaning localStorage:', error);
      // Si hay un error de parseo, es probable que todo el localStorage esté corrupto
      console.log('🗑️ Clearing localStorage due to parsing error.');
      localStorage.clear();
    }
  });

  await browser.close();
  console.log('🏁 Browser closed. Invalid poses cleared.');
}

clearInvalidPoses(); 