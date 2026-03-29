# Problemas Abiertos

Este documento mantiene un registro de los problemas técnicos actuales y su estado de resolución.

## Problemas Activos

### 1. Compatibilidad de Partes

**Estado**: En progreso
**Prioridad**: Alta
**Asignado**: [Nombre del desarrollador]

#### Descripción
Actualmente no hay validación de compatibilidad entre las diferentes partes del personaje. Esto puede llevar a combinaciones visualmente incorrectas o técnicamente imposibles.

#### Impacto
- Experiencia de usuario confusa
- Posibles errores visuales
- Necesidad de validación manual

#### Plan de Acción
1. **Definición de Reglas**
   - [ ] Crear esquema de compatibilidad para cada tipo de parte
   - [ ] Documentar restricciones de combinación
   - [ ] Implementar validación en tiempo real

2. **Implementación de Validación**
   - [ ] Crear capa de validación en el modelo de datos
   - [ ] Añadir comprobaciones de compatibilidad
   - [ ] Implementar feedback visual para combinaciones inválidas

3. **UI/UX**
   - [ ] Deshabilitar opciones incompatibles
   - [ ] Mostrar advertencias visuales
   - [ ] Proporcionar explicaciones de incompatibilidad

### 2. Optimización de Rendimiento

**Estado**: En progreso
**Prioridad**: Media
**Asignado**: [Nombre del desarrollador]

#### Descripción
El rendimiento del visor 3D puede degradarse con modelos complejos o múltiples partes cargadas simultáneamente.

#### Impacto
- FPS bajos en dispositivos menos potentes
- Alto consumo de memoria
- Tiempos de carga prolongados

#### Plan de Acción
1. **Implementación de LOD**
   - [ ] Crear variantes de baja resolución para cada modelo
   - [ ] Implementar sistema de cambio de nivel de detalle
   - [ ] Optimizar transiciones entre niveles

2. **Optimización de Texturas**
   - [ ] Implementar carga diferida de texturas
   - [ ] Comprimir texturas para reducir tamaño
   - [ ] Implementar sistema de mipmaps

3. **Sistema de Caché**
   - [ ] Implementar caché en memoria para modelos frecuentes
   - [ ] Añadir almacenamiento local para modelos base
   - [ ] Optimizar estrategia de precarga

## Problemas Resueltos

### Carga de Modelos GLB ✅

**Estado**: Resuelto
**Fecha de Resolución**: [Fecha]

#### Solución Implementada
Se implementó soporte para `DRACOLoader` para manejar modelos comprimidos con Draco. La solución incluye:
- Configuración del decoder path en `/draco/`
- Mejora en el sistema de logging
- Optimización de la carga de modelos

#### Mejoras Pendientes
- [ ] Implementar sistema de fallback para modelos no encontrados
- [ ] Añadir mecanismo de reintento
- [ ] Mejorar manejo de errores

## Referencias

- [Three.js Documentation](https://threejs.org/docs/)
- [GLTF/GLB Format Specification](https://github.com/USER/REPO/tree/master/specification/2.0)
- [Draco Compression](https://google.github.io/draco/) 