# Guía de Optimización de Modelos 3D

## Proceso de Optimización

### 1. Preparación del Modelo

- **Geometría**
  - Reducir polígonos innecesarios
  - Eliminar vértices duplicados
  - Optimizar topología
  - Mantener UVs limpias

- **Texturas**
  - Comprimir texturas (PNG/JPG)
  - Usar potencias de 2 (512x512, 1024x1024)
  - Optimizar canales de textura
  - Eliminar texturas no utilizadas

- **Materiales**
  - Simplificar shaders
  - Usar PBR cuando sea posible
  - Reducir número de materiales
  - Optimizar parámetros de materiales

### 2. Exportación GLB

- **Configuración**
  - Habilitar compresión Draco
  - Incluir solo nodos necesarios
  - Optimizar animaciones
  - Validar estructura de huesos

- **Validación**
  - Verificar escala correcta
  - Comprobar orientación
  - Validar materiales
  - Revisar UVs

### 3. Post-Procesamiento

- **Optimización Final**
  - Comprimir archivo GLB
  - Validar tamaño final
  - Probar carga en el visor
  - Verificar rendimiento

## Herramientas Recomendadas

1. **Blender**
   - Optimización de geometría
   - Preparación de UVs
   - Exportación GLB

2. **gltf-pipeline**
   - Compresión Draco
   - Optimización de texturas
   - Validación de archivos

3. **gltf-transform**
   - Post-procesamiento
   - Optimización final
   - Validación de estructura

## Checklist de Optimización

### Geometría
- [ ] Polígonos reducidos al mínimo necesario
- [ ] Topología limpia y eficiente
- [ ] Sin vértices duplicados
- [ ] UVs optimizadas

### Texturas
- [ ] Tamaño de textura optimizado
- [ ] Compresión aplicada
- [ ] Canales de textura optimizados
- [ ] Sin texturas innecesarias

### Materiales
- [ ] Shaders simplificados
- [ ] PBR implementado correctamente
- [ ] Número de materiales reducido
- [ ] Parámetros optimizados

### Exportación
- [ ] Compresión Draco habilitada
- [ ] Solo nodos necesarios incluidos
- [ ] Animaciones optimizadas
- [ ] Estructura de huesos validada

### Validación Final
- [ ] Escala correcta
- [ ] Orientación correcta
- [ ] Materiales funcionando
- [ ] UVs correctas
- [ ] Tamaño de archivo aceptable
- [ ] Rendimiento verificado

## Tamaños Recomendados

### Modelos Base
- Torso: < 5MB
- Piernas: < 3MB
- Cabeza: < 2MB
- Manos: < 1MB

### Accesorios
- Capa: < 2MB
- Símbolo: < 1MB
- Cinturón: < 1MB

## Proceso de Validación

1. **Pre-Validación**
   - Verificar nomenclatura
   - Comprobar estructura
   - Validar materiales

2. **Validación en Visor**
   - Cargar en el visor
   - Verificar escala
   - Comprobar materiales
   - Validar animaciones

3. **Validación de Rendimiento**
   - Medir tiempo de carga
   - Verificar uso de memoria
   - Comprobar FPS
   - Validar con múltiples modelos

## Solución de Problemas

### Problemas Comunes

1. **Modelo no carga**
   - Verificar nomenclatura
   - Comprobar ruta
   - Validar formato GLB
   - Revisar compresión

2. **Materiales incorrectos**
   - Verificar shaders
   - Comprobar texturas
   - Validar PBR
   - Revisar UVs

3. **Rendimiento pobre**
   - Optimizar geometría
   - Reducir texturas
   - Simplificar materiales
   - Comprimir archivo

## Referencias

- [glTF Best Practices](https://github.com/USER/REPO/tree/master/specification/2.0#best-practices)
- [Draco Compression](https://google.github.io/draco/)
- [gltf-pipeline](https://github.com/USER/REPO//gltf-transform.donmccurdy.com/) 