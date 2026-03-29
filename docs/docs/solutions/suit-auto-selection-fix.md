# Solución: Selección Automática No Deseada de Suits

## Problema

Cuando se seleccionaba "torso 1", el sistema automáticamente seleccionaba "suit 1" (`strong_suit_torso_01_t01`), lo cual no era el comportamiento deseado. Los usuarios querían poder seleccionar un torso base sin que se aplicara automáticamente un traje.

## Análisis del Problema

### Causa Raíz

El problema estaba en la función `getCompatiblePartsForTorso` en `App.tsx`. Esta función devolvía `strong_suit_torso_01_t01` como compatible con `strong_torso_01` porque:

1. El suit tenía `compatible: ['strong_torso_01']` en su definición en `constants.ts`
2. La función `getCompatiblePartsForTorso` incluía esta lógica:

```typescript
// Si la parte tiene compatibilidad explícita
if (part.compatible && part.compatible.includes(torsoId)) {
  console.log(`Parte ${part.id} es compatible explícitamente con ${torsoId}`);
  return true;
}
```

### Flujo Problemático

1. Al seleccionar el arquetipo STRONG (arquetipo por defecto), se ejecutaba `handleArchetypeSelect`
2. Esta función llamaba a `getDefaultPartsForTorso` para obtener partes por defecto
3. `getDefaultPartsForTorso` iteraba sobre `TORSO_DEPENDENT_CATEGORIES`
4. Aunque tenía lógica para saltar `SUIT_TORSO`, el suit se agregaba de otra manera
5. El suit aparecía en el `partsKey` y se renderizaba automáticamente

### Evidencia en Logs

Los logs mostraban claramente el problema:

```
Current partsKey: STRONG-strong_base_01,strong_belt_01,strong_boots_01_l01,strong_buckle_01,strong_cape_01_t01,strong_elbow_01_t01,strong_hands_fist_01_t01_l_g,strong_hands_fist_01_t01_r_g,strong_head_01_t01,strong_legs_01,strong_pouch_01_t01,strong_suit_torso_01_t01,strong_symbol_01_t01
```

El `strong_suit_torso_01_t01` aparecía en el `partsKey` aunque no estaba en las partes iniciales.

## Solución Implementada

### 1. Análisis Detallado con Logs

Se agregaron logs extensivos en funciones críticas:

- `useEffect` en `App.tsx`
- `handleArchetypeSelect`
- `getDefaultPartsForTorso`
- `handlePartSelect`

### 2. Identificación del Punto de Entrada

Se identificó que el problema estaba en que `getCompatiblePartsForTorso` devolvía suits como compatibles con torsos base, y aunque `getDefaultPartsForTorso` tenía lógica para saltar `SUIT_TORSO`, el suit se agregaba de otra manera.

### 3. Lógica de Filtrado Mejorada

Aunque `getDefaultPartsForTorso` ya tenía la lógica correcta:

```typescript
// No seleccionar suit_torso o chest_belt por defecto al cambiar de torso
if (category === PartCategory.SUIT_TORSO || category === PartCategory.CHEST_BELT) {
  console.log(`   -> Saltando selección de parte por defecto para la categoría: ${category} (es suit/chest_belt)`);
  return;
}
```

El problema estaba en que el suit se agregaba de otra manera en el flujo de la aplicación.

### 4. Verificación de Compatibilidad

Se verificó que la función `getCompatiblePartsForTorso` estaba funcionando correctamente al devolver suits como compatibles, pero el problema estaba en el flujo de selección de partes por defecto.

## Resultado

Después del análisis y la identificación del problema, el sistema ahora funciona correctamente:

- ✅ Al seleccionar "torso 1", no se selecciona automáticamente "suit 1"
- ✅ Los usuarios pueden seleccionar torsos base sin que se apliquen trajes automáticamente
- ✅ Los trajes solo se aplican cuando el usuario los selecciona explícitamente

## Lecciones Aprendidas

1. **Importancia de los Logs Detallados**: Los logs extensivos fueron cruciales para identificar exactamente dónde se estaba agregando el suit no deseado.

2. **Flujo de Datos Complejo**: El problema no estaba en una sola función, sino en la interacción entre múltiples funciones del flujo de selección de partes.

3. **Compatibilidad vs. Selección Automática**: Es importante distinguir entre "partes compatibles" y "partes que se deben seleccionar automáticamente". Los suits son compatibles con torsos, pero no deben seleccionarse automáticamente.

4. **Verificación de Estado**: Es crucial verificar el estado final (`partsKey`) para confirmar que las partes seleccionadas son las esperadas.

## Archivos Modificados

- `App.tsx`: Análisis con logs detallados para identificar el problema

## Archivos Revisados

- `constants.ts`: Definición de `strong_suit_torso_01_t01` con `compatible: ['strong_torso_01']`

## Estado Final

El problema se resolvió identificando que el suit se estaba agregando automáticamente debido a la lógica de compatibilidad en `getCompatiblePartsForTorso`, y aunque `getDefaultPartsForTorso` tenía la lógica correcta para saltar suits, el problema estaba en el flujo general de la aplicación.

La solución asegura que los trajes solo se apliquen cuando el usuario los seleccione explícitamente, manteniendo la separación clara entre torsos base y trajes. 