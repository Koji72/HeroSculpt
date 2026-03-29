const puppeteer = require('puppeteer');

async function testColorSystem() {
  console.log('🧪 Testing color system...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log(`[Browser] ${msg.type()}: ${msg.text()}`);
  });
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:5177', { waitUntil: 'networkidle0' });
    console.log('✅ Page loaded');
    
    // Wait for the 3D viewer to load
    await page.waitForSelector('.character-viewer', { timeout: 10000 });
    console.log('✅ 3D viewer found');
    
    // Wait a bit for models to load
    await page.waitForTimeout(3000);
    
    // Click the test colors button
    const testButton = await page.$('button[title="Test color system"]');
    if (testButton) {
      console.log('✅ Test button found, clicking...');
      await testButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Test button not found');
    }
    
    // Try to open the material panel
    const colorButton = await page.$('button[title="Configurar colores y materiales"]');
    if (colorButton) {
      console.log('✅ Color button found, clicking...');
      await colorButton.click();
      await page.waitForTimeout(2000);
    } else {
      console.log('❌ Color button not found');
    }
    
    // Wait a bit more to see the results
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await browser.close();
  }
}

testColorSystem().catch(console.error); 