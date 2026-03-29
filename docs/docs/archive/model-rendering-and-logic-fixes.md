# Corrección de Renderizado y Lógica de Modelos (08/06/2025)

Este documento detalla el proceso de diagnóstico y solución de varios problemas críticos relacionados con la visualización y la lógica de negocio de los modelos 3D en el personalizador.

## 1. Problema Inicial: El Modelo No se Visualizaba Correctamente

### Síntomas
- Al cargar la aplicación, el visor 3D aparecía vacío o mostraba artefactos visuales (el "cubo verde" o mallas con aspecto "ruidoso").
- Las partes base del personaje, como las piernas, no aparecían.

### Diagnóstico y Solución
Tras una serie de investigaciones, se identificaron varias causas raíz que contribuían al problema:

1.  **Error de Sincronización (Race Condition)**: El problema más persistente fue un error de tiempos. La lógica para cargar los modelos se ejecutaba *antes* de que la escena de Three.js (cámara, renderizador, etc.) estuviera completamente inicializada. Esto se manifestó en la consola del navegador con el error: `CharacterViewer: Abortando carga, dependencias no listas`.
    *   **Solución**: Se refactorizó el componente `src/components/CharacterViewer.tsx`. Se eliminó el custom hook `useThree` y se consolidó toda la lógica de inicialización y carga dentro del componente. Se usaron dos `useEffect`: el primero para configurar la escena (ejecutándose una sola vez) y el segundo para cargar los modelos, asegurando que el segundo solo se ejecute cuando `selectedParts` cambie y la escena ya esté lista.

2.  **Configuración del Descompresor Draco**: Las texturas con aspecto "ruidoso" indicaban un fallo en la descompresión de los modelos.
    *   **Solución**: Se ajustó la ruta del descompresor en `CharacterViewer.tsx`, estableciendo una ruta explícita y pública (`/draco/`) que el servidor de Vite puede resolver sin ambigüedad.

3.  **Estado Inicial Incompleto**: Las piernas y otras partes base no se cargaban porque el estado inicial `selectedParts` en `App.tsx` no las incluía por defecto.
    *   **Solución**: Se modificó la inicialización del estado en `App.tsx` para que, por defecto, se carguen el `TORSO`, la `CABEZA` y las `PIERNAS` del arquetipo `FUERTE`.

## 2. Problema Secundario: Lógica de Partes y Carga de Modelos

### Síntomas
- **Superposición de Partes**: Al seleccionar partes como las botas, las piernas base no desaparecían, resultando en una superposición visual (geometría duplicada).
- **Fallos de Carga**: Algunas partes específicas, como el cinturón, no se cargaban en absoluto.

### Diagnóstico y Solución

1.  **Implementación de Exclusión por Dependencia**: Se detectó que no existía una lógica que manejara la exclusión mutua entre partes.
    *   **Diagnóstico**: Se analizó el archivo `types.ts` y se encontró la constante `PART_DEPENDENCIES`, que define relaciones jerárquicas (ej: `BOOTS` depende de `PIERNAS`).
    *   **Solución**: Se implementó una lógica de exclusión en `CharacterViewer.tsx`. Antes de renderizar los modelos, el código ahora revisa las dependencias de las partes seleccionadas. Si una parte "hijo" (como `BOOTS`) está seleccionada, su "padre" (`PIERNAS`) se añade a una lista de exclusión y no se renderiza. Esto resuelve el problema de superposición.

2.  **Inconsistencia en Rutas de Modelos**: Se sospechaba que las rutas definidas en el código no coincidían con la estructura de archivos real.
    *   **Diagnóstico**: Se compararon las rutas (`gltfPath`) definidas en `constants.ts` con un listado recursivo de los archivos presentes en la carpeta `public/assets/fuerte`.
    *   **Solución**: Se encontró una discrepancia en la ruta del modelo `fuerte_beltchest_01`. La ruta en `constants.ts` fue corregida para que apuntara a la ubicación correcta del archivo, solucionando el error 404 que impedía su carga.

## Resultado Final

Tras estas correcciones, el personalizador ahora funciona de manera robusta:
- El modelo base se carga correctamente al iniciar la aplicación.
- Las partes dependientes (botas, guantes, etc.) reemplazan visualmente a sus partes base.
- Todas las partes definidas en `constants.ts` se cargan sin errores. 