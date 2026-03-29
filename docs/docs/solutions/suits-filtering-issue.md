# Suits Filtering Issue

## Problema

Al seleccionar diferentes torsos, los suits disponibles no se filtran correctamente. Cada torso debería mostrar solo los 4 suits compatibles con ese torso específico.

## Análisis

### Estructura de archivos
- **5 torsos**: `strong_torso_01`, `strong_torso_02`, `strong_torso_03`, `strong_torso_04`, `strong_torso_05`
- **4 suits por torso**: `01`, `02`, `03`, `04`
- **Total**: 20 archivos GLB de suits

### Patrón de nomenclatura
```
strong_suit_torso_[variante]_t[torso].glb
```

Ejemplos:
- `strong_suit_torso_01_t01.glb` - Suit 01 para Torso 01
- `strong_suit_torso_02_t03.glb` - Suit 02 para Torso 03
- `strong_suit_torso_04_t05.glb` - Suit 04 para Torso 05

### Archivos GLB disponibles
```
Torso 01: strong_suit_torso_01_t01.glb, strong_suit_torso_02_t01.glb, strong_suit_torso_03_t01.glb, strong_suit_torso_04_t01.glb
Torso 02: strong_suit_torso_01_t02.glb, strong_suit_torso_02_t02.glb, strong_suit_torso_03_t02.glb, strong_suit_torso_04_t02.glb
Torso 03: strong_suit_torso_01_t03.glb, strong_suit_torso_02_t03.glb, strong_suit_torso_03_t03.glb, strong_suit_torso_04_t03.glb
Torso 04: strong_suit_torso_01_t04.glb, strong_suit_torso_02_t04.glb, strong_suit_torso_03_t04.glb, strong_suit_torso_04_t04.glb
Torso 05: strong_suit_torso_01_t05.glb, strong_suit_torso_02_t05.glb, strong_suit_torso_03_t05.glb, strong_suit_torso_04_t05.glb
```

## Solución

### 1. Definiciones en constants.ts

Todas las 20 definiciones de suits están correctamente definidas en `constants.ts` con:

- **IDs correctos**: `strong_suit_torso_[variante]_t[torso]`
- **Rutas correctas**: `assets/strong/suit_torso/`
- **Arrays `compatible` correctos**: `['strong_torso_01']`, `['strong_torso_02']`, etc.
- **Atributos correctos**: `torsoType` y `style`

### 2. Ejemplo de definición

```typescript
{
  id: 'strong_suit_torso_02_t03',
  name: 'Strong Suit Torso 02 T03',
  category: PartCategory.SUIT_TORSO,
  archetype: ArchetypeId.STRONG,
  gltfPath: 'assets/strong/suit_torso/strong_suit_torso_02_t03.glb',
  priceUSD: 1.90,
  compatible: ['strong_torso_03'],
  thumbnail: 'https://picsum.photos/seed/strong_suit_torso_02_t03/100/100',
  attributes: {
    torsoType: '03',
    style: '02'
  }
}
```

### 3. Validación

Se creó un script de validación `scripts/validate_suit_definitions.cjs` que verifica:

- ✅ Todos los archivos GLB tienen definiciones en `constants.ts`
- ✅ Todas las definiciones tienen archivos GLB correspondientes
- ✅ Sincronización completa entre archivos y definiciones

### 4. Comando de validación

```bash
npm run validate-suits
```

## Estado actual

✅ **Completado**: Todas las 20 definiciones de suits están correctamente definidas y validadas.

## Archivos modificados

- `constants.ts` - Definiciones de suits (líneas 769-1047)
- `scripts/validate_suit_definitions.cjs` - Script de validación
- `package.json` - Comando `validate-suits`

## Notas importantes

- Cada torso tiene exactamente 4 suits disponibles
- Los suits son específicos por torso (no intercambiables)
- El filtrado se basa en el array `compatible` de cada definición
- Los atributos `torsoType` y `style` permiten filtrado adicional si es necesario 