#!/usr/bin/env node

/**
 * Script de verificación para el fix de redirección de email
 * Verifica que todos los archivos de signup tengan la configuración correcta
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 VERIFYING EMAIL REDIRECT FIX');
console.log('================================\n');

const filesToCheck = [
  'components/SimpleSignUpModal.tsx',
  'components/LoginDiagnostic.tsx'
];

let allFilesCorrect = true;
const issues = [];

console.log('📋 Checking signup files for emailRedirectTo configuration:');
console.log('------------------------------------------------------------');

filesToCheck.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Verificar si tiene emailRedirectTo
    if (content.includes('emailRedirectTo: window.location.origin')) {
      console.log(`✅ ${file} - emailRedirectTo configured correctly`);
    } else if (content.includes('supabase.auth.signUp')) {
      console.log(`❌ ${file} - signUp found but NO emailRedirectTo configured`);
      issues.push(`${file} - Missing emailRedirectTo configuration`);
      allFilesCorrect = false;
    } else {
      console.log(`⚠️  ${file} - No signUp found (might be empty or different)`);
    }
  } else {
    console.log(`❌ ${file} - File not found`);
    issues.push(`${file} - File not found`);
    allFilesCorrect = false;
  }
});

console.log('\n📊 VERIFICATION SUMMARY:');
console.log('========================');

if (allFilesCorrect) {
  console.log('✅ ALL FILES CORRECT - Email redirect fix is properly implemented!');
  console.log('✅ SimpleSignUpModal.tsx - emailRedirectTo configured');
  console.log('✅ LoginDiagnostic.tsx - emailRedirectTo configured');
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('==============');
  console.log('1. Deploy to Vercel: vercel --prod');
  console.log('2. Test signup from Vercel domain');
  console.log('3. Verify email redirects to Vercel, not localhost');
  console.log('4. Check Supabase dashboard configuration if needed');
  
  console.log('\n📋 SUPABASE DASHBOARD CONFIGURATION:');
  console.log('====================================');
  console.log('Site URLs should include:');
  console.log('- http://localhost:5177');
  console.log('- https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app');
  console.log('');
  console.log('Redirect URLs should include:');
  console.log('- http://localhost:5177/auth/callback');
  console.log('- https://3dcustomicerdefinitivo-82uql1qzc-davids-projects-5c176cd5.vercel.app/auth/callback');
  
} else {
  console.log('❌ ISSUES FOUND - Email redirect fix needs attention!');
  console.log('Issues:');
  issues.forEach(issue => console.log(`   - ${issue}`));
  
  console.log('\n🔧 FIX REQUIRED:');
  console.log('================');
  console.log('Add emailRedirectTo configuration to signUp calls:');
  console.log('');
  console.log('const { data, error } = await supabase.auth.signUp({');
  console.log('  email,');
  console.log('  password,');
  console.log('  options: {');
  console.log('    emailRedirectTo: window.location.origin');
  console.log('  }');
  console.log('});');
}

console.log('\n🎯 Email redirect verification completed!');
