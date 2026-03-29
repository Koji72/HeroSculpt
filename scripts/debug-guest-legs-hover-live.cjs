#!/usr/bin/env node

/**
 * 🐛 DEBUG: GUEST LEGS HOVER LIVE
 * 
 * Script para debuggear el hover de piernas en tiempo real
 * 
 * Instrucciones para debuggear paso a paso
 */

console.log('🐛 DEBUG: GUEST LEGS HOVER LIVE');
console.log('================================\n');

console.log(`
🎯 INSTRUCCIONES DE DEBUG PASO A PASO:

1️⃣ PREPARACIÓN:
   - Abrir http://localhost:5179/ (como guest)
   - Abrir DevTools (F12) → Console
   - Limpiar la consola (Clear console)

2️⃣ VERIFICAR ESTADO INICIAL:
   - Verificar que se ve el personaje completo
   - Verificar que tiene piernas y botas
   - Buscar en consola: "GUEST_USER_BUILD" o "selectedParts"

3️⃣ PROBAR HOVER DE PIERNAS:
   - Hacer click en LOWER BODY
   - Buscar en consola: "Rendering LowerBodySubmenu"
   - Hacer hover sobre "none" (primera opción)
   - Buscar en consola: "🔄 LEGS HOVER: Recalculando botas compatibles para piernas: none"

4️⃣ VERIFICAR LOGS ESPERADOS:
   ✅ "🔄 LEGS HOVER: Recalculando botas compatibles para piernas: none"
   ✅ "✅ LEGS HOVER: Enviando estado de preview (siguiendo reglas críticas): { allParts: [...], legs: 'removed', boots: 'removed' }"
   ✅ "CharacterViewer: Preview parts changed: { ... }"
   ✅ "👁️ HOVER: Hiding original model: strong_legs_01"
   ✅ "👁️ HOVER: Hiding original model: strong_boots_01_l0"

5️⃣ VERIFICAR RESULTADO VISUAL:
   - Las piernas deben desaparecer
   - Las botas deben desaparecer
   - El resto del personaje debe mantenerse visible

❌ SI NO APARECEN LOS LOGS:
   - El hover no se está ejecutando
   - Hay un error en la lógica de hover
   - El PartSelectorPanel no está recibiendo el evento

❌ SI APARECEN LOS LOGS PERO NO DESAPARECEN LAS PIERNAS:
   - CharacterViewer no está procesando el preview
   - Los modelos no se están ocultando correctamente
   - Hay un problema con la visibilidad de los modelos

🔧 COMANDOS DE DEBUG ADICIONALES:
   - En consola del navegador, escribir: console.log('GUEST DEBUG:', window.location.href)
   - Verificar que estás en modo guest (no logueado)
   - Verificar que no hay errores de JavaScript

💡 TIPS:
   - Refrescar la página si es necesario
   - Verificar que no hay cache del navegador
   - Verificar que el servidor está corriendo en puerto 5179
`);

console.log('\n✅ INSTRUCCIONES COMPLETADAS');
console.log('🚀 ¡EMPIEZA A DEBUGGEAR!'); 