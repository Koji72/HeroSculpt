# Adaptación Automática de Manos por Torso

## Resumen

Se ha implementado un sistema de adaptación automática de manos que asigna manos específicas para cada torso cuando el usuario cambia de torso base. Cada torso tiene sus propias manos únicas que se cargan automáticamente.

## Análisis de Archivos

Se analizaron todos los archivos de manos en `/public/assets/strong/hands/` y se encontró la siguiente estructura:

### Estructura de Nombres de Archivos
```
strong_hands_[tipo]_[versión]_[torso]_[lado]_[guantes].glb
```

Donde:
- `tipo`: bands, fist, hammer, noweapon, pistol
- `versión`: 01, 02, 03, etc.
- `torso`: t01, t02, t03, t04, t05
- `lado`: l (izquierda), r (derecha)
- `guantes`: g (con guantes), ng (sin guantes)

### Distribución por Torso
- **Torso 01**: 25 manos - 5 tipos (bands, fist, hammer, noweapon, pistol)
- **Torso 02**: 24 manos - 5 tipos (bands, fist, hammer, noweapon, pistol)
- **Torso 03**: 23 manos - 5 tipos (bands, fist, hammer, noweapon, pistol)
- **Torso 04**: 22 manos - 4 tipos (fist, hammer, noweapon, pistol) - sin bands
- **Torso 05**: 24 manos - 5 tipos (bands, fist, hammer, noweapon, pistol)

## Implementación

### 1. Constantes Actualizadas (`constants.ts`)

Se regeneraron completamente las constantes de manos basándose en el análisis real de los archivos:

```typescript
// Ejemplo de manos específicas por torso
{
  id: 'strong_hands_bands_01_t01_l',
  name: 'Left Bands (Ungloved, Torso 01)',
  category: PartCategory.HAND_LEFT,
  archetype: ArchetypeId.STRONG,
  gltfPath: 'assets/strong/hands/strong_hands_bands_01_t01_l.glb',
  priceUSD: 0.75,
  compatible: ['strong_torso_01'],
  thumbnail: 'https://picsum.photos/seed/strong_hands_bands_01_t01_l/100/100',
  attributes: { side: 'l', glove: false },
}
```

### 2. Lógica de Adaptación (`App.tsx`)

Se implementó la función `assignDefaultHandsForTorso` que:

1. **Elimina las manos actuales** del personaje
2. **Busca manos compatibles** para el nuevo torso
3. **Prioriza manos sin guantes** sobre manos con guantes
4. **Asigna automáticamente** las primeras manos compatibles encontradas

```typescript
const assignDefaultHandsForTorso = (newTorso: Part, currentParts: SelectedParts): SelectedParts => {
  // Eliminar manos actuales
  Object.values(newParts).forEach(p => {
    if (p.category === PartCategory.HAND_LEFT || p.category === PartCategory.HAND_RIGHT) {
      delete newParts[p.id];
    }
  });
  
  // Buscar manos específicas para este torso
  const compatibleLeftHands = ALL_PARTS.filter(p => 
    p.category === PartCategory.HAND_LEFT && 
    p.compatible.includes(newTorso.id)
  );
  
  const compatibleRightHands = ALL_PARTS.filter(p => 
    p.category === PartCategory.HAND_RIGHT && 
    p.compatible.includes(newTorso.id)
  );
  
  // Seleccionar manos (sin guantes primero)
  const selectedLeftHand = compatibleLeftHands.find(p => !p.attributes?.glove) || compatibleLeftHands[0];
  const selectedRightHand = compatibleRightHands.find(p => !p.attributes?.glove) || compatibleRightHands[0];
  
  // Agregar las manos seleccionadas
  if (selectedLeftHand) newParts[selectedLeftHand.id] = selectedLeftHand;
  if (selectedRightHand) newParts[selectedRightHand.id] = selectedRightHand;
  
  return newParts;
};
```

### 3. Integración en el Flujo Principal

La función se ejecuta automáticamente cuando el usuario selecciona un nuevo torso:

```typescript
if (category === PartCategory.TORSO) {
  // Al cambiar de torso, asignar siempre las primeras manos compatibles
  newParts = assignDefaultHandsForTorso(part, newParts);
  // ... resto de la lógica de limpieza
}
```

## Comportamiento Esperado

### Al Cambiar de Torso:
1. **Torso 01** → Manos con bands (sin guantes)
2. **Torso 02** → Manos con fist (sin guantes)
3. **Torso 03** → Manos con bands (sin guantes)
4. **Torso 04** → Manos con fist (sin guantes)
5. **Torso 05** → Manos con bands (sin guantes)

### Priorización:
1. **Sin guantes** (ng) se priorizan sobre con guantes (g)
2. **Primera mano compatible** encontrada en la lista
3. **Manos específicas del torso** se usan automáticamente

## Ventajas de la Implementación

1. **Automatización completa**: No requiere intervención manual del usuario
2. **Compatibilidad garantizada**: Solo se asignan manos compatibles con el torso
3. **Consistencia visual**: Cada torso mantiene su estilo de manos específico
4. **Priorización inteligente**: Prefiere manos sin guantes para mejor visibilidad
5. **Escalabilidad**: Fácil agregar nuevos torsos y manos

## Archivos Modificados

- `constants.ts`: Regeneración completa de constantes de manos
- `App.tsx`: Implementación de lógica de adaptación automática

## Pruebas Realizadas

Se crearon y ejecutaron scripts de prueba que confirmaron:
- ✅ Detección correcta de manos por torso
- ✅ Asignación automática de manos compatibles
- ✅ Priorización de manos sin guantes
- ✅ Funcionamiento para todos los torsos (01-05) 