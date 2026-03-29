# 🔧 Export Troubleshooting Guide

## Problema: Archivo de 1KB o muy pequeño

### Síntomas
- El archivo descargado pesa solo 1KB o menos
- El archivo no se puede abrir en software 3D
- No hay modelos visibles en el archivo exportado

### Causas Posibles

#### 1. **No hay modelos cargados**
- El visor 3D no ha cargado ningún modelo
- Los modelos fallaron al cargar
- El grupo de modelos está vacío

#### 2. **Problema con el clonado de la escena**
- Los modelos no se copian correctamente al clonar
- Referencias rotas en la escena exportada
- Problemas con la jerarquía de objetos

#### 3. **GLTFExporter no funciona en el entorno**
- Problemas con las dependencias de Three.js
- Errores en el navegador
- Problemas de compatibilidad

### Solución Paso a Paso

#### Paso 1: Verificar que los modelos estén cargados
1. Abre la consola del navegador (F12)
2. Busca mensajes como:
   ```
   CharacterViewer: Loading models for Strong archetype with caching
   CharacterViewer: Base model loaded successfully
   CharacterViewer: Successfully loaded [TORSO]
   ```
3. Si no ves estos mensajes, hay un problema de carga

#### Paso 2: Usar el Panel de Debug
1. Click en el icono de bombilla en el header (🔧)
2. Se abrirá el panel de debug rojo
3. Verifica que "Parts loaded" sea mayor que 0
4. Click en "Debug Export" para ver logs detallados

#### Paso 3: Verificar la Consola
Busca estos mensajes durante la exportación:
```
Exporting model...
Scene children: X
Model group children: Y
Export scene children: Z
Export model group children: W
Export child 0: Group unnamed
Export child 1: Group unnamed
```

#### Paso 4: Verificar el Tamaño del Archivo
En la consola deberías ver:
```
Blob created, size: XXXXX bytes
Downloading file: filename.glb Size: XXXXX
```

### Soluciones Específicas

#### Si no hay modelos cargados:
1. **Recargar la página**: A veces los modelos no cargan correctamente
2. **Verificar conexión**: Los modelos se cargan desde el servidor local
3. **Verificar archivos**: Asegúrate de que los archivos GLB existan en `/public/assets/`

#### Si hay modelos pero el archivo es pequeño:
1. **Verificar clonado**: El problema puede estar en el clonado de la escena
2. **Verificar materiales**: Los materiales pueden no estar copiándose correctamente
3. **Verificar geometría**: La geometría puede estar vacía

#### Si hay errores en la consola:
1. **Errores de GLTFExporter**: Verificar que Three.js esté actualizado
2. **Errores de FileReader**: Solo funciona en navegador, no en Node.js
3. **Errores de memoria**: El modelo puede ser demasiado grande

### Comandos de Debug

#### En la Consola del Navegador:
```javascript
// Verificar el estado del visor
console.log('Scene available:', characterViewerRef.current?.getScene());

// Verificar partes seleccionadas
console.log('Selected parts:', selectedParts);

// Forzar recarga de modelos
characterViewerRef.current?.loadModels();
```

#### Verificar Archivos:
```bash
# Verificar que los archivos GLB existan
ls -la public/assets/strong/

# Verificar tamaño de archivos
du -h public/assets/strong/**/*.glb
```

### Casos de Prueba

#### Caso 1: Modelo Básico
1. Seleccionar solo torso base
2. Intentar exportar
3. Verificar que el archivo tenga al menos 10KB

#### Caso 2: Modelo Completo
1. Seleccionar todas las partes
2. Intentar exportar
3. Verificar que el archivo tenga al menos 50KB

#### Caso 3: Modelo Vacío
1. No seleccionar ninguna parte
2. Intentar exportar
3. Debería mostrar error "No models loaded to export"

### Logs de Debug Esperados

#### Exportación Exitosa:
```
Exporting model...
Scene children: 5
Model group children: 3
Export scene children: 2
Export model group children: 3
Export child 0: Group strong_base_01
Export child 1: Group strong_torso_01
Export child 2: Group strong_legs_01
Starting export with options: {format: 'glb', includeTextures: true, compression: true}
Scene to export: Scene
Scene children count: 2
Export options: {binary: true, includeTextures: true, forceIndices: true, truncateDrawRange: true, maxTextureSize: 2048, animations: [], includeCustomExtensions: false}
Export successful, gltf result: {data: ArrayBuffer, ...}
Export completed, creating blob...
Blob created, size: 156789 bytes
Downloading file: strong_torso_headed_caped_2024-12-20T15-30-45.glb Size: 156789
```

#### Exportación Fallida:
```
Exporting model...
Scene children: 5
Model group children: 0
No models loaded to export
```

### Contacto y Soporte

Si el problema persiste después de seguir esta guía:

1. **Capturar logs**: Copiar todos los mensajes de la consola
2. **Capturar pantalla**: Del panel de debug
3. **Describir pasos**: Qué hiciste exactamente
4. **Información del navegador**: Versión y sistema operativo

### Archivos de Referencia

- `src/components/CharacterViewer.tsx` - Lógica de exportación
- `utils.ts` - Funciones de exportación
- `components/DebugPanel.tsx` - Panel de debug
- `docs/CHECKOUT_FEATURE.md` - Documentación de la funcionalidad 