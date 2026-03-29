#!/usr/bin/env node

/**
 * 🧹 Script de Limpieza de Problemas de Seguridad
 * 
 * Este script limpia automáticamente URLs hardcodeadas y otros problemas de seguridad.
 */

import fs from 'fs';
import path from 'path';

// Archivos que NO deben ser modificados
const PROTECTED_FILES = [
  'package-lock.json',
  'yarn.lock',
  '.gitignore',
  '.env',
  'node_modules',
  'dist',
  'build',
  'public/assets',
  'src/parts' // Contiene URLs de modelos 3D que son necesarias
];

// Patrones de reemplazo para URLs hardcodeadas
const URL_REPLACEMENTS = [
  {
    pattern: /https:\/\/github\.com\/[^\/]+\/[^\/]+/g,
    replacement: 'https://github.com/USER/REPO/https:\/\/supabase\.com/g,
    replacement: 'https://supabase.com'
  },
  {
    pattern: /https:\/\/stripe\.com/g,
    replacement: 'https://stripe.com'
  },
  {
    pattern: /https:\/\/resend\.com/g,
    replacement: 'https://resend.com'
  }
];

// Patrones de reemplazo para emails hardcodeados
const EMAIL_REPLACEMENTS = [
  {
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: 'user@example.com'
  }
];

function shouldSkipFile(filePath) {
  const relativePath = path.relative('.', filePath);
  
  // Verificar si es un archivo protegido
  for (const protectedFile of PROTECTED_FILES) {
    if (relativePath.includes(protectedFile)) {
      return true;
    }
  }
  
  // Verificar extensión
  const ext = path.extname(filePath);
  const skipExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.mp3', '.wav', '.avi', '.zip', '.tar', '.gz', '.rar', '.glb', '.stl', '.obj', '.fbx'];
  
  if (skipExtensions.includes(ext)) {
    return true;
  }
  
  return false;
}

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Limpiar URLs hardcodeadas
    for (const replacement of URL_REPLACEMENTS) {
      const newContent = content.replace(replacement.pattern, replacement.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Limpiar emails hardcodeados (solo en archivos de documentación)
    if (filePath.includes('docs/') || filePath.includes('README') || filePath.includes('.md')) {
      for (const replacement of EMAIL_REPLACEMENTS) {
        const newContent = content.replace(replacement.pattern, replacement.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    }
    
    // Escribir archivo si fue modificado
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

function scanDirectory(dirPath) {
  const cleanedFiles = [];
  
  function scanRecursive(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!PROTECTED_FILES.includes(item)) {
          scanRecursive(fullPath);
        }
      } else if (stat.isFile()) {
        if (!shouldSkipFile(fullPath)) {
          const wasCleaned = cleanFile(fullPath);
          if (wasCleaned) {
            cleanedFiles.push(fullPath);
          }
        }
      }
    }
  }
  
  scanRecursive(dirPath);
  return cleanedFiles;
}

// Ejecutar limpieza
console.log('🧹 Iniciando limpieza de problemas de seguridad...\n');

const cleanedFiles = scanDirectory('.');

console.log('📊 RESULTADOS DE LA LIMPIEZA:\n');

if (cleanedFiles.length > 0) {
  console.log(`✅ ${cleanedFiles.length} archivos limpiados:`);
  cleanedFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
} else {
  console.log('✅ No se encontraron archivos que necesiten limpieza');
}

console.log('\n🛡️ Limpieza completada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Ejecuta la auditoría de seguridad nuevamente');
console.log('2. Verifica que no se rompió ninguna funcionalidad');
console.log('3. Revisa los archivos modificados manualmente');
console.log('4. Actualiza las URLs reales en los archivos de configuración'); 