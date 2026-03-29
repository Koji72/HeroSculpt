# Solución: Partes por defecto del arquetipo no aparecen

## Problema

Al seleccionar un arquetipo (ej. "Strong"), las partes por defecto como las piernas, la base, el cinturón y las botas no se cargaban o desaparecían, dejando el modelo incompleto en el visor.

## Análisis

Se identificó que la función `handleArchetypeSelect` en `App.tsx` estaba vaciando `selectedParts` o no estaba incluyendo explícitamente todas las partes por defecto necesarias al cambiar de arquetipo. Aunque el torso se cargaba correctamente, otras partes esenciales como `strong_legs_01`, `strong_base_01`, `strong_belt_01` y `strong_boots_01` no se estaban añadiendo a la configuración de `selectedParts` después de la selección del arquetipo.

## Solución

Se modificó la función `handleArchetypeSelect` en `App.tsx` para asegurar que, al seleccionar un arquetipo, se inicialicen las `selectedParts` con todas las partes por defecto requeridas. Esto incluyó la adición explícita de las siguientes partes:

- `strong_legs_01` (piernas)
- `strong_base_01` (base)
- `strong_belt_01` (cinturón)
- `strong_boots_01` (botas)

El código fue actualizado para buscar estas partes por su `archetype`, `category` y que su `id` incluya `_01`, y luego añadirlas al objeto `defaultParts` antes de actualizar el estado `selectedParts`.

## Verificación

Para verificar la solución, se realizaron los siguientes pasos:

1.  Se inició la aplicación de desarrollo.
2.  Se navegó a la interfaz de selección de arquetipos.
3.  Se seleccionó el arquetipo "Strong".
4.  Se confirmó visualmente que el modelo en el visor mostraba correctamente las piernas, la base, el cinturón y las botas junto con el torso por defecto. 