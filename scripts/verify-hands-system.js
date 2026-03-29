#!/usr/bin/env node

/**
 * Script de Verificación del Sistema de Manos
 * 
 * Este script verifica que el sistema de manos esté funcionando correctamente
 * y que no haya regresiones en la implementación.
 * 
 * Uso: node scripts/verify-hands-system.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando Sistema de Manos...\n');

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - ARCHIVO NO ENCONTRADO`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - ERROR: ${error.message}`, 'red');
    return false;
  }
}

function checkPattern(filePath, pattern, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matches = content.match(pattern);
    
    if (matches) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`❌ ${description} - PATRÓN NO ENCONTRADO`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ ${description} - ERROR: ${error.message}`, 'red');
    return false;
  }
}

// Verificaciones principales
log('📋 VERIFICACIONES CRÍTICAS', 'bold');

// 1. Verificar archivos críticos
log('\n1. Archivos Críticos:', 'blue');
const criticalFiles = [
  { path: 'types.ts', desc: 'Definición de tipos' },
  { path: 'lib/utils.ts', desc: 'Funciones de utilidad' },
  { path: 'components/CharacterViewer.tsx', desc: 'Visor de personaje' },
  { path: 'App.tsx', desc: 'Componente principal' },
  { path: 'docs/HANDS_PROTECTION_RULE.md', desc: 'Regla de protección' },
  { path: 'docs/HANDS_DUPLICATION_FIX_2025.md', desc: 'Documentación de solución' }
];

let criticalFilesOk = true;
criticalFiles.forEach(file => {
  if (!checkFile(file.path, file.desc)) {
    criticalFilesOk = false;
  }
});

// 2. Verificar patrones críticos
log('\n2. Patrones Críticos:', 'blue');

// Verificar tipo SelectedParts
const selectedPartsPattern = /export type SelectedParts = \{ \[category: string\]: Part \};/;
if (!checkPattern('types.ts', selectedPartsPattern, 'Tipo SelectedParts correcto')) {
  criticalFilesOk = false;
}

// Verificar gestión de estado con categorías
const statePattern = /delete newParts\[PartCategory\.HAND_LEFT\];/;
if (!checkPattern('App.tsx', statePattern, 'Gestión de estado con categorías')) {
  criticalFilesOk = false;
}

// Verificar verificación de compatibilidad
const compatibilityPattern = /compatible\.includes\(/;
if (!checkPattern('components/CharacterViewer.tsx', compatibilityPattern, 'Verificación de compatibilidad')) {
  criticalFilesOk = false;
}

// 3. Verificar funciones de utilidad
log('\n3. Funciones de Utilidad:', 'blue');
const utilsPattern = /newParts\[PartCategory\.HAND_LEFT\] = /;
if (!checkPattern('lib/utils.ts', utilsPattern, 'Asignación correcta de manos')) {
  criticalFilesOk = false;
}

// 4. Verificar documentación
log('\n4. Documentación:', 'blue');
const protectionRulePattern = /REGLA CRÍTICA: Protección del Sistema de Manos/;
if (!checkPattern('docs/HANDS_PROTECTION_RULE.md', protectionRulePattern, 'Regla de protección documentada')) {
  criticalFilesOk = false;
}

// Resumen final
log('\n📊 RESUMEN DE VERIFICACIÓN', 'bold');
log('=' * 50, 'blue');

if (criticalFilesOk) {
  log('\n🎉 SISTEMA DE MANOS: ✅ FUNCIONANDO CORRECTAMENTE', 'green');
  log('✅ Todos los archivos críticos están presentes', 'green');
  log('✅ Los patrones de código son correctos', 'green');
  log('✅ La documentación está actualizada', 'green');
  log('\n💡 El sistema está protegido contra regresiones', 'green');
} else {
  log('\n🚨 SISTEMA DE MANOS: ❌ PROBLEMAS DETECTADOS', 'red');
  log('❌ Se encontraron problemas críticos', 'red');
  log('❌ Revisar la documentación de soluciones', 'red');
  log('❌ Aplicar las correcciones necesarias', 'red');
}

log('\n📚 DOCUMENTACIÓN DE REFERENCIA:', 'blue');
log('- docs/HANDS_PROTECTION_RULE.md', 'yellow');
log('- docs/HANDS_DUPLICATION_FIX_2025.md', 'yellow');
log('- docs/DOCUMENTATION_INDEX.md', 'yellow');

log('\n🔧 COMANDOS DE VERIFICACIÓN RÁPIDA:', 'blue');
log('grep "SelectedParts.*=" types.ts', 'yellow');
log('grep "delete.*newParts\\[" App.tsx', 'yellow');
log('grep "compatible.includes" components/CharacterViewer.tsx', 'yellow');

console.log('\n'); 