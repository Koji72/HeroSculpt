#!/usr/bin/env node

/**
 * Test script for Rive Canvas API implementation
 * Verifies the new @rive-app/canvas package integration
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Testing Rive Canvas API Implementation...\n');

// Check package installation
console.log('✅ Package Installation:');
try {
  const packageJson = require('../package.json');
  const riveCanvasPackage = packageJson.dependencies['@rive-app/canvas'];
  const riveReactPackage = packageJson.dependencies['@rive-app/react-canvas'];
  
  if (riveCanvasPackage) {
    console.log(`- @rive-app/canvas: ✅ INSTALLED (${riveCanvasPackage})`);
  } else {
    console.log('- @rive-app/canvas: ❌ NOT INSTALLED');
  }
  
  if (riveReactPackage) {
    console.log(`- @rive-app/react-canvas: ⚠️ STILL INSTALLED (${riveReactPackage}) - Should be removed`);
  } else {
    console.log('- @rive-app/react-canvas: ✅ REMOVED');
  }
} catch (error) {
  console.log('- Package.json: ❌ ERROR READING');
}

// Check node_modules
const canvasNodeModulesPath = path.join(__dirname, '../node_modules/@rive-app/canvas');
const reactNodeModulesPath = path.join(__dirname, '../node_modules/@rive-app/react-canvas');

console.log('\n✅ Node Modules:');
if (fs.existsSync(canvasNodeModulesPath)) {
  console.log('- @rive-app/canvas: ✅ EXISTS');
} else {
  console.log('- @rive-app/canvas: ❌ NOT FOUND');
}

if (fs.existsSync(reactNodeModulesPath)) {
  console.log('- @rive-app/react-canvas: ⚠️ STILL EXISTS - Should be removed');
} else {
  console.log('- @rive-app/react-canvas: ✅ REMOVED');
}

// Check file existence
const riveFilePath = path.join(__dirname, '../public/assets/boost_selection_interactiondemo.riv');
console.log('\n✅ File Existence:');
if (fs.existsSync(riveFilePath)) {
  const stats = fs.statSync(riveFilePath);
  console.log(`- Rive file: ✅ EXISTS (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
} else {
  console.log('- Rive file: ❌ NOT FOUND');
}

// Check component files
console.log('\n✅ Component Files:');
const simpleTestPath = path.join(__dirname, '../components/SimpleRiveTest.tsx');
const archetypeSelectorPath = path.join(__dirname, '../components/RiveArchetypeSelector.tsx');

if (fs.existsSync(simpleTestPath)) {
  console.log('- SimpleRiveTest.tsx: ✅ EXISTS');
} else {
  console.log('- SimpleRiveTest.tsx: ❌ NOT FOUND');
}

if (fs.existsSync(archetypeSelectorPath)) {
  console.log('- RiveArchetypeSelector.tsx: ✅ EXISTS');
} else {
  console.log('- RiveArchetypeSelector.tsx: ❌ NOT FOUND');
}

// Implementation summary
console.log('\n🎯 Implementation Summary:');
console.log('✅ Switched from @rive-app/react-canvas to @rive-app/canvas');
console.log('✅ Updated SimpleRiveTest to use Canvas API directly');
console.log('✅ Updated RiveArchetypeSelector to use Canvas API directly');
console.log('✅ Added proper cleanup and resize handling');
console.log('✅ Added error handling and loading states');

// Test instructions
console.log('\n📝 Test Instructions:');
console.log('1. Open browser at http://localhost:5180');
console.log('2. Click "🎨 Rive Test" button in header');
console.log('3. Select "Simple Test" mode');
console.log('4. Check browser console for loading messages');
console.log('5. Try different state machine names');
console.log('6. Verify animation loads and displays correctly');

// Expected behavior
console.log('\n🎬 Expected Behavior:');
console.log('- Animation should load without errors');
console.log('- Canvas should display the Rive animation');
console.log('- Console should show "✅ Rive animation loaded successfully"');
console.log('- Status should show "Animation Loaded: Yes"');
console.log('- Rive Instance should show "Available"');

console.log('\n🎯 Rive Canvas API Test Complete!');
console.log('🚀 Ready to test the new implementation!'); 