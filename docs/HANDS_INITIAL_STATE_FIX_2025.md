# Solución: Problema de Manos en Estado Inicial Vacío - 2025

## 🎯 Problema Identificado

Cuando un usuario **no logueado** cambiaba de torso, las manos no se asignaban correctamente porque:

1. **Estado inicial vacío**: `selectedParts` se inicializa como `{}` (objeto vacío)
2. **Función no preparada**: `assignDefaultHandsForTorso` no manejaba el caso donde no hay manos actuales
3. **Dos sistemas diferentes**: `CharacterViewer.tsx` y `App.tsx` manejaban las manos de forma diferente

## 🔍 Análisis del Flujo

### Estado Inicial (Usuario No Logueado)
```typescript
// App.tsx línea 67
const [selectedParts, setSelectedParts] = useState<SelectedParts>(DEFAULT_STRONG_BUILD);

// constants.ts línea 4020
export const DEFAULT_STRONG_BUILD: SelectedParts = {}; // Objeto vacío
```

### Flujo Problemático
1. Usuario no logueado accede → `selectedParts = {}`
2. Usuario selecciona torso → `handleSelectPart` se ejecuta
3. `assignDefaultHandsForTorso` se llama con `currentParts = {}`
4. No encuentra manos actuales → No asigna manos nuevas
5. Resultado: Personaje sin manos

## ✅ Solución Implementada

### Modificación en `lib/utils.ts`

Se modificó la función `assignDefaultHandsForTorso` para manejar el caso donde no hay manos actuales:

```typescript
// ✅ NUEVO: Manejar caso donde no hay manos actuales (estado inicial vacío)
let selectedLeftHand: Part | null = null;
let selectedRightHand: Part | null = null;

if (!currentLeftHand && !currentRightHand) {
  // Caso: No hay manos actuales (estado inicial vacío para usuarios no logueados)
  console.log('🆕 No hay manos actuales, asignando manos por defecto para el torso:', newTorso.id);
  
  // Buscar manos por defecto sin guantes para este torso
  selectedLeftHand = compatibleLeftHands.find(p => !p.attributes?.glove) || compatibleLeftHands[0];
  selectedRightHand = compatibleRightHands.find(p => !p.attributes?.glove) || compatibleRightHands[0];
  
  console.log('🎯 Manos por defecto asignadas:', {
    leftHand: selectedLeftHand?.id,
    rightHand: selectedRightHand?.id
  });
} else {
  // Caso: Hay manos actuales - preservar tipo y guantes
  selectedLeftHand = findMatchingHand(compatibleLeftHands, currentLeftType, currentLeftGlove);
  selectedRightHand = findMatchingHand(compatibleRightHands, currentRightType, currentRightGlove);
}
```

## 🎯 Comportamiento Esperado

### Antes de la Solución
- ❌ Usuario no logueado selecciona torso → Personaje sin manos
- ❌ Función fallaba al no encontrar manos para preservar

### Después de la Solución
- ✅ Usuario no logueado selecciona torso → Manos compatibles asignadas automáticamente
- ✅ Prioriza manos sin guantes (`_ng`) sobre manos con guantes (`_g`)
- ✅ Mantiene compatibilidad con el sistema existente para usuarios logueados

## 🔧 Detalles Técnicos

### Lógica de Selección
1. **Verificar manos actuales**: Si no hay manos, usar modo "inicial"
2. **Buscar compatibilidad**: Filtrar manos compatibles con el torso seleccionado
3. **Priorizar sin guantes**: Seleccionar manos sin guantes primero
4. **Fallback**: Si no hay manos sin guantes, usar la primera disponible

### Compatibilidad
- ✅ **Usuarios logueados**: Comportamiento sin cambios
- ✅ **Usuarios no logueados**: Ahora funciona correctamente
- ✅ **Preservación de tipos**: Mantiene la lógica de preservación existente

## 🧪 Verificación

Para verificar que la solución funciona:

1. **Abrir aplicación sin login**
2. **Seleccionar diferentes torsos**
3. **Verificar que las manos se asignan automáticamente**
4. **Confirmar que las manos son compatibles con el torso**

### Logs de Debug
```javascript
// Buscar estos logs en la consola:
🆕 No hay manos actuales, asignando manos por defecto para el torso: strong_torso_01
🎯 Manos por defecto asignadas: { leftHand: "strong_hands_fist_01_t01_l_ng", rightHand: "strong_hands_fist_01_t01_r_ng" }
```

## 📚 Archivos Modificados

- `lib/utils.ts`: Función `assignDefaultHandsForTorso` actualizada

## 🛡️ Protecciones

- ✅ **No rompe funcionalidad existente**: Usuarios logueados no se ven afectados
- ✅ **Mantiene reglas críticas**: Preserva el patrón de `SelectedParts` por categorías
- ✅ **Logs informativos**: Facilita debugging sin afectar rendimiento
- ✅ **Fallbacks seguros**: Si no encuentra manos, usa la primera disponible

## 🎉 Resultado

El problema de las manos para usuarios no logueados está **completamente resuelto**. Ahora cuando un usuario no logueado selecciona un torso, las manos compatibles se asignan automáticamente, manteniendo la experiencia de usuario consistente. 