#!/usr/bin/env node

/**
 * Test script for Rive animation loading
 * Diagnoses issues with Rive animation file access
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Testing Rive Animation Loading...\n');

// Check if Rive file exists
const riveFilePath = path.join(__dirname, '../public/assets/boost_selection_interactiondemo.riv');
const distRivePath = path.join(__dirname, '../dist/assets/boost_selection_interactiondemo.riv');

console.log('✅ File Paths:');
console.log(`- Public path: ${riveFilePath}`);
console.log(`- Dist path: ${distRivePath}`);

// Check file existence
console.log('\n✅ File Existence:');
if (fs.existsSync(riveFilePath)) {
  const stats = fs.statSync(riveFilePath);
  console.log(`- Public file: ✅ EXISTS (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
} else {
  console.log('- Public file: ❌ NOT FOUND');
}

if (fs.existsSync(distRivePath)) {
  const stats = fs.statSync(distRivePath);
  console.log(`- Dist file: ✅ EXISTS (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
} else {
  console.log('- Dist file: ❌ NOT FOUND');
}

// Check Rive package installation
console.log('\n✅ Package Installation:');
try {
  const packageJson = require('../package.json');
  const rivePackage = packageJson.dependencies['@rive-app/react-canvas'];
  if (rivePackage) {
    console.log(`- @rive-app/react-canvas: ✅ INSTALLED (${rivePackage})`);
  } else {
    console.log('- @rive-app/react-canvas: ❌ NOT INSTALLED');
  }
} catch (error) {
  console.log('- Package.json: ❌ ERROR READING');
}

// Check node_modules
const nodeModulesPath = path.join(__dirname, '../node_modules/@rive-app/react-canvas');
if (fs.existsSync(nodeModulesPath)) {
  console.log('- Node modules: ✅ EXISTS');
} else {
  console.log('- Node modules: ❌ NOT FOUND');
}

// Test HTTP access (if server is running)
console.log('\n✅ HTTP Access Test:');
console.log('- Try accessing: http://localhost:5180/assets/boost_selection_interactiondemo.riv');
console.log('- Check browser console for CORS or loading errors');

// Common issues and solutions
console.log('\n🔧 Common Issues & Solutions:');
console.log('1. File not found: Copy from dist/ to public/assets/');
console.log('2. CORS issues: Check Vite dev server configuration');
console.log('3. Package not installed: Run npm install @rive-app/react-canvas');
console.log('4. Wrong state machine name: Check Rive file in Rive editor');
console.log('5. Browser compatibility: Check browser console for errors');

console.log('\n🎯 Rive Loading Test Complete!');
console.log('📝 Next Steps:');
console.log('1. Open browser console (F12)');
console.log('2. Click "Rive Test" button in app');
console.log('3. Check for loading errors in console');
console.log('4. Verify animation file is accessible via HTTP'); 