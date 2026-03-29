#!/usr/bin/env node

/**
 * Script de Protección de Archivos Críticos
 * 
 * Este script genera hashes de los archivos críticos y los verifica
 * para prevenir violaciones de las reglas de protección.
 * 
 * Uso: 
 * - node scripts/protect-critical-files.js --save    (guardar hashes)
 * - node scripts/protect-critical-files.js --verify  (verificar hashes)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivos críticos que NUNCA deben cambiar
const CRITICAL_FILES = [
  'types.ts',
  'lib/utils.ts',
  'App.tsx',
  'components/CharacterViewer.tsx'
];

const HASH_FILE = path.join(__dirname, '../.critical-files-hash.json');

function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function saveHashes() {
  console.log('🔒 Guardando hashes de archivos críticos...');
  
  const hashes = {};
  let allValid = true;
  
  CRITICAL_FILES.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const hash = calculateFileHash(filePath);
    
    if (hash) {
      hashes[file] = hash;
      console.log(`✅ ${file}: ${hash.substring(0, 8)}...`);
    } else {
      allValid = false;
    }
  });
  
  if (allValid) {
    fs.writeFileSync(HASH_FILE, JSON.stringify(hashes, null, 2));
    console.log('✅ Hashes guardados en .critical-files-hash.json');
    console.log('🚨 ADVERTENCIA: Estos archivos están ahora protegidos');
    console.log('🚨 NO modifiques estos archivos sin verificar primero');
  } else {
    console.log('❌ Error: No se pudieron guardar todos los hashes');
    process.exit(1);
  }
}

function verifyHashes() {
  console.log('🔍 Verificando integridad de archivos críticos...');
  
  if (!fs.existsSync(HASH_FILE)) {
    console.log('❌ No se encontró archivo de hashes. Ejecuta --save primero');
    process.exit(1);
  }
  
  const savedHashes = JSON.parse(fs.readFileSync(HASH_FILE, 'utf8'));
  let allValid = true;
  
  CRITICAL_FILES.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const currentHash = calculateFileHash(filePath);
    const savedHash = savedHashes[file];
    
    if (!currentHash) {
      console.log(`❌ ${file}: Error al leer archivo`);
      allValid = false;
    } else if (currentHash !== savedHash) {
      console.log(`🚨 ${file}: HASH MODIFICADO!`);
      console.log(`   Original: ${savedHash.substring(0, 8)}...`);
      console.log(`   Actual:   ${currentHash.substring(0, 8)}...`);
      allValid = false;
    } else {
      console.log(`✅ ${file}: Integridad verificada`);
    }
  });
  
  if (allValid) {
    console.log('🎉 Todos los archivos críticos están intactos');
    console.log('✅ Las reglas de protección se están respetando');
  } else {
    console.log('🚨 VIOLACIÓN DE REGLAS DETECTADA!');
    console.log('🚨 Los archivos críticos han sido modificados');
    console.log('🚨 Revisa los cambios y restaura si es necesario');
    process.exit(1);
  }
}

// Procesar argumentos
const args = process.argv.slice(2);

if (args.includes('--save')) {
  saveHashes();
} else if (args.includes('--verify')) {
  verifyHashes();
} else {
  console.log('Uso:');
  console.log('  node scripts/protect-critical-files.js --save    (guardar hashes)');
  console.log('  node scripts/protect-critical-files.js --verify  (verificar hashes)');
  console.log('');
  console.log('Archivos críticos protegidos:');
  CRITICAL_FILES.forEach(file => console.log(`  - ${file}`));
} 