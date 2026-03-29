# Problema: Suits no aparecían en la categoría Torso

## 📋 Descripción del problema

**Fecha**: 18 de Junio 2025  
**Problema**: Cuando el usuario seleccionaba la categoría "Torso" en el menú, solo aparecían los torsos base pero no los suits disponibles.

**Comportamiento esperado**: Al seleccionar "Torso" deberían aparecer tanto los torsos base como los suits compatibles.

**Comportamiento real**: Solo se mostraban los torsos base, los suits no aparecían.

## 🔍 Análisis del problema

### Causa raíz
La lógica en `PartSelectorPanel.tsx` estaba filtrando incorrectamente las partes cuando se seleccionaba la categoría `TORSO`:

```typescript
// ❌ Lógica anterior (incorrecta)
const allParts = ALL_PARTS.filter(part =>
  part.category === PartCategory.TORSO &&  // Solo torsos base
  part.archetype === selectedArchetype
);
```

### Problemas identificados
1. **Filtrado incorrecto**: Solo se buscaban partes con `PartCategory.TORSO`, excluyendo los suits que tienen `PartCategory.SUIT_TORSO`
2. **Torsos faltantes**: Faltaban las definiciones de `strong_torso_04` y `strong_torso_05` en `constants.ts`
3. **Lógica de selección**: La función `isPartSelectable` no manejaba correctamente los suits en la categoría TORSO

## 🛠️ Solución implementada

### 1. Corregir la lógica de filtrado en PartSelectorPanel.tsx

```typescript
// ✅ Lógica corregida
if (currentCategory === PartCategory.TORSO) {
  // Obtener torsos base
  const baseTorsos = ALL_PARTS.filter(part =>
    part.category === PartCategory.TORSO &&
    part.archetype === selectedArchetype &&
    (!part.compatible || part.compatible.length === 0)
  );
  
  // Obtener suits
  const suits = ALL_PARTS.filter(part =>
    part.category === PartCategory.SUIT_TORSO &&
    part.archetype === selectedArchetype
  );
  
  return {
    baseTorsos,
    suits
  };
}
```

### 2. Actualizar la función isPartSelectable

```typescript
// ✅ Lógica corregida para selección
if (currentCategory === PartCategory.TORSO) {
  // Para torsos base: siempre seleccionable
  if (part.category === PartCategory.TORSO) {
    return true;
  }
  // Para suits: seleccionable si no hay torso seleccionado o si el torso base seleccionado es compatible
  if (part.category === PartCategory.SUIT_TORSO) {
    if (!currentBaseTorso) return true;
    return part.compatible && part.compatible.includes(currentBaseTorso.id);
  }
}
```

### 3. Agregar torsos faltantes en constants.ts

```typescript
// ✅ Agregados strong_torso_04 y strong_torso_05
{
  id: 'strong_torso_04',
  name: 'Strong Torso 04',
  category: PartCategory.TORSO,
  archetype: ArchetypeId.STRONG,
  gltfPath: 'assets/strong/torso/strong_torso_04.glb',
  priceUSD: 2.40,
  attributes: {
    torsoType: '04'
  },
  compatible: [],
  thumbnail: 'https://picsum.photos/seed/strong_torso_04/100/100'
},
{
  id: 'strong_torso_05',
  name: 'Strong Torso 05',
  category: PartCategory.TORSO,
  archetype: ArchetypeId.STRONG,
  gltfPath: 'assets/strong/torso/strong_torso_05.glb',
  priceUSD: 2.60,
  attributes: {
    torsoType: '05'
  },
  compatible: [],
  thumbnail: 'https://picsum.photos/seed/strong_torso_05/100/100'
}
```

## 📊 Configuración final

### Torsos base disponibles
- `strong_torso_01` - Strong Torso 01 ($2.00)
- `strong_torso_02` - Strong Torso 02 ($2.20)
- `strong_torso_03` - Strong Torso 03 ($1.70)
- `strong_torso_04` - Strong Torso 04 ($2.40)
- `strong_torso_05` - Strong Torso 05 ($2.60)

### Suits disponibles
- **20 suits totales**: 4 suits por cada torso (4 × 5 = 20)
- **Categoría**: `PartCategory.SUIT_TORSO`
- **Compatibilidad**: Cada suit tiene array `compatible` con su torso correspondiente

### Ejemplos de suits por torso
- **Torso 01**: `strong_suit_torso_01_t01`, `strong_suit_torso_02_t01`, `strong_suit_torso_03_t01`, `strong_suit_torso_04_t01`
- **Torso 02**: `strong_suit_torso_01_t02`, `strong_suit_torso_02_t02`, `strong_suit_torso_03_t02`, `strong_suit_torso_04_t02`
- **Torso 03**: `strong_suit_torso_01_t03`, `strong_suit_torso_02_t03`, `strong_suit_torso_03_t03`, `strong_suit_torso_04_t03`
- **Torso 04**: `strong_suit_torso_01_t04`, `strong_suit_torso_02_t04`, `strong_suit_torso_03_t04`, `strong_suit_torso_04_t04`
- **Torso 05**: `strong_suit_torso_01_t05`, `strong_suit_torso_02_t05`, `strong_suit_torso_03_t05`, `strong_suit_torso_04_t05`

## 🎯 Flujo de usuario corregido

1. **Seleccionar categoría "Torso"** en el menú
2. **Ver dos secciones**:
   - **"Base Torsos"**: 5 torsos base disponibles
   - **"Suits"**: 20 suits disponibles (todos los suits)
3. **Seleccionar un torso base** (ej: "Torso 01")
4. **Los suits se filtran automáticamente** para mostrar solo los compatibles
5. **Seleccionar un suit compatible** con el torso elegido

## ✅ Verificación

### Archivos modificados
- `src/components/PartSelectorPanel.tsx` - Lógica de filtrado y selección
- `constants.ts` - Agregados torsos 04 y 05

### Pruebas realizadas
- ✅ Torsos base aparecen correctamente
- ✅ Suits aparecen en la categoría Torso
- ✅ Filtrado automático por compatibilidad funciona
- ✅ Selección de torsos y suits funciona correctamente

## 📝 Notas adicionales

- Los suits mantienen su categoría `SUIT_TORSO` separada para compatibilidad con otras funcionalidades
- La lógica de filtrado respeta la compatibilidad definida en los arrays `compatible`
- Los precios de los suits varían entre $1.80 y $2.10 según el estilo
- Cada suit tiene atributos `torsoType` y `style` para identificación

## 🔗 Archivos relacionados

- `docs/solutions/suits-filtering-issue.md` - Problema anterior con suits
- `docs/solutions/hands-filtering-issue.md` - Problema similar con manos
- `docs/solutions/heads-filtering-issue.md` - Problema similar con cabezas 