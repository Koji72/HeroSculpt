# Problema de Zoom en CharacterViewer.tsx

## Descripción del Problema
Los usuarios experimentaban un comportamiento errático o limitado con la funcionalidad de zoom en el `CharacterViewer`. A pesar de intentar hacer zoom in o zoom out, la cámara no se comportaba como se esperaba, a menudo restableciendo su posición de manera inconsistente o impidiendo un rango de zoom adecuado.

## Diagnóstico

Se identificaron las siguientes causas raíz del problema:

1.  **Límites de Zoom Restrictivos**: Las funciones `handleZoomIn` y `handleZoomOut` en `CharacterViewer.tsx` tenían límites de distancia (`Math.min(currentDistance + 0.5, 15)` y `Math.max(currentDistance - 0.5, 4)`) que eran demasiado restrictivos, impidiendo un rango de zoom más amplio.
2.  **Doble Implementación de `resetCamera`**: Existían dos implementaciones de `resetCamera`, una como `handleResetCamera` (función local) y otra dentro del `useImperativeHandle` (expuesta al componente padre). La duplicación o inconsistencia entre estas podría causar comportamientos inesperados.
3.  **Auto-Framing Agresivo**: La lógica de auto-framing dentro de la función `performModelLoad` restablecía automáticamente la posición de la cámara cada vez que se cargaban modelos, anulando cualquier ajuste de zoom realizado por el usuario. Esto era especialmente problemático después de la carga inicial o cambios de modelo, ya que el zoom se "reiniciaba" sin el consentimiento del usuario.
4.  **Advertencias del Linter por Variables No Utilizadas**: Múltiples variables y parámetros declarados en `CharacterViewer.tsx` no se estaban utilizando, lo que, aunque no causaba errores funcionales directos, indicaba código redundante y potencial confusión. Notablemente, las referencias `initialCameraPosition` y `initialCameraTarget` no se utilizaban después de las refactorizaciones.

## Solución Implementada

Se realizaron los siguientes cambios para resolver el problema de zoom y limpiar el código:

1.  **Ajuste de Límites de Zoom**:
    *   En `handleZoomOut`, el límite máximo de zoom out se aumentó de `15` a `30`.
    *   En `handleZoomIn`, el límite mínimo de zoom in se disminuyó de `4` a `2`.
    *   Esto permite un rango mucho más amplio para el control del zoom por parte del usuario.

2.  **Estandarización del Reinicio de Cámara**:
    *   La implementación de `resetCamera` dentro del `useImperativeHandle` se modificó para llamar directamente a `handleResetCamera`. Esto asegura que toda la lógica de reinicio de cámara esté centralizada y sea consistente.

3.  **Control del Auto-Framing**:
    *   Se introdujo un nuevo `useRef` llamado `hasUserInteractedWithCamera` para rastrear si el usuario ha movido la cámara manualmente (a través de los controles `OrbitControls`).
    *   Se añadió un `useEffect` para escuchar el evento `start` de `OrbitControls`, estableciendo `hasUserInteractedWithCamera.current = true` cuando el usuario interactúa.
    *   La lógica de auto-framing en `performModelLoad` ahora solo se ejecuta si `!isHoverPreviewActive` Y `!hasUserInteractedWithCamera.current`. Esto significa que el auto-framing solo ocurrirá en la carga inicial o después de un reinicio manual de la cámara, pero no anulará los ajustes de zoom del usuario.
    *   En la función `resetCamera` (a la que ahora apunta la API pública), se añadió `hasUserInteractedWithCamera.current = false` para permitir que el auto-framing ocurra de nuevo después de un reinicio explícito del usuario.

4.  **Limpieza de Variables No Utilizadas**:
    *   Se eliminaron o comentaron las declaraciones de las siguientes variables y parámetros que no se utilizaban, basándose en las advertencias del linter:
        *   `arePartsEqual` (de la importación)
        *   `safeSelectedParts`
        *   Variables desestructuradas de `useThreeScene` (`scene`, `camera`, `renderer`, `controls`, `composer`, `animate`)
        *   `cacheLoadingStatus` y `setCacheLoadingStatus`
        *   `loadModelsIncremental` (función completa comentada, ya que su lógica ya no se utilizaba con el enfoque actual de carga de modelos)
        *   `textureType` (parámetro en `applyTextureToPart`)
        *   `newComposer` (parámetro en `setComposer`)
        *   `initialCameraPosition` y `initialCameraTarget`

## Archivos Modificados

-   `components/CharacterViewer.tsx`