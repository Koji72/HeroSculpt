# 📋 Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Sistema de usuarios y autenticación
- Backend API para persistencia de datos
- Sistema de pagos integrado
- Exportación de archivos STL
- Más arquetipos de superhéroes
- Animaciones de transición suaves

## [2025-01-27] - Hands Guest User Fix

### Fixed
- **Hands Filtering for Guest Users**: Resolved issue where non-logged users saw hands from all torsos
  - Added default hands to `DEFAULT_STRONG_BUILD` in `constants.ts`
  - Fixed filtering logic to show only compatible hands
  - Result: Guest users now see only 22 compatible hands instead of 110 mixed hands

### Technical Details
- **File**: `constants.ts` - Added `HAND_LEFT` and `HAND_RIGHT` to `DEFAULT_STRONG_BUILD`
- **Hands Selected**: `strong_hands_fist_01_t01_l_ng` and `strong_hands_fist_01_t01_r_ng`
- **Compatibility**: Both hands compatible with `strong_torso_01`
- **Documentation**: `docs/HANDS_GUEST_USER_FIX_2025.md` - Complete solution documentation

### Scripts Added
- **`scripts/diagnose-hands-issue.cjs`** - Initial problem diagnosis
- **`scripts/test-hands-issue.cjs`** - Specific problem simulation
- **`scripts/verify-hands-fix.cjs`** - Final solution verification

### Lessons Learned
- **Default builds matter**: Users need complete default configurations
- **Filtering logic**: Must handle edge cases for non-authenticated users
- **Verification tools**: Automated scripts help identify and verify fixes

## [2025-01-27] - VTT Screenshot Fix

### Fixed
- **VTT Screenshot Issue**: Resolved transparent screenshot problem in VTT modal
  - Restored simple `takeScreenshot` implementation from backup
  - Eliminated complex rendering logic that was interfering with basic Three.js rendering
  - Added comprehensive pixel analysis and debug tools
  - Result: Screenshot now shows character with 0.00% transparency

### Technical Details
- **File**: `components/CharacterViewer.tsx` - Restored simple takeScreenshot method
- **File**: `components/VTTExportModal.tsx` - Enhanced debug analysis and UI
- **Documentation**: `docs/VTT_SCREENSHOT_FIX_2025.md` - Complete solution documentation

### Lessons Learned
- **Simplicity over complexity**: Simple Three.js rendering works better than over-engineered solutions
- **Backup importance**: Having working versions as backup is crucial for quick recovery
- **Debug tools**: Pixel analysis and debug UI are essential for troubleshooting rendering issues

### Added
- **🛡️ Sistema de Protección de Manos**: Implementadas reglas críticas para proteger el sistema de manos
  - Regla obligatoria en `docs/HANDS_PROTECTION_RULE.md` para prevenir regresiones
  - Script de verificación automática `scripts/verify-hands-system.js`
  - Documentación completa de protección en `docs/README_PROTECTION_RULES.md`
  - Comandos de verificación rápida para desarrollo seguro
  - Procedimientos de emergencia para recuperación de problemas

### Added
- **🛒 Checkout & Download Feature**: Implementada funcionalidad completa de descarga de modelos 3D
  - Exportación de modelos en formato GLB con todas las partes seleccionadas
  - Botón de descarga prominente en el panel de precios
  - Estados de carga y mensajes de feedback visual
  - Nombres inteligentes de archivos basados en arquetipo y partes
  - Manejo robusto de errores y validaciones
  - Documentación completa en `docs/CHECKOUT_FEATURE.md`

### Changed
- **Layout Principal**: Reorganización completa del layout para mejor UX
- **Componentes Compactos**: Rediseño de tarjetas y paneles para optimizar espacio
- **Navegación Mejorada**: Sistema de navegación más intuitivo
- **Responsividad**: Breakpoints optimizados para móvil, tablet y desktop
- **Performance**: Optimizaciones de renderizado y carga
- **PriceDisplay Component**: Rediseñado para incluir funcionalidad de descarga
  - Nuevo botón verde "Download Model" 
  - Indicador de progreso durante la preparación
  - Mensajes de estado para éxito/error
  - Texto actualizado para reflejar funcionalidad real

### Technical
- **CharacterViewer**: Añadida funcionalidad de exportación
  - Ref expuesta para acceso desde componentes padre
  - Método `exportModel()` para generar archivos GLB
  - Escena limpia sin efectos post-procesamiento
  - Integración con sistema de caché existente

- **Utils**: Nuevas funciones de exportación
  - `exportModel()`: Exporta escena Three.js a GLB
  - `downloadBlob()`: Descarga archivos desde blob
  - `generateModelName()`: Genera nombres inteligentes de archivos

### 🐛 Fixed
- **Viewport Issues**: Corrección de problemas de adaptación al navegador
- **Overflow Problems**: Solución de cortes en paneles y contenido
- **Mobile Compatibility**: Mejoras en dispositivos táctiles
- **Panel Derecho**: Ajuste correcto del panel de configuración
- **Touch Interactions**: Optimización para dispositivos móviles

### 🎨 Styling
- **Tema Consistente**: Colores y estilos unificados
- **Animaciones Suaves**: Transiciones fluidas entre estados
- **Iconografía**: Iconos consistentes con Lucide React
- **Typography**: Tipografía optimizada para legibilidad

## [1.2.0] - 2025-06-26

### ✨ Added
- **Sistema de Cámara Y-Axis**: Rotación restringida solo al eje Y para visualización consistente
- **Controles de Cámara Mejorados**: Sensibilidad ajustable y zoom optimizado
- **Diseño Responsivo Completo**: Adaptación a todos los tamaños de pantalla
- **Panel Modal de Selección**: Interfaz overlay sin bloquear el visor 3D
- **Preview en Tiempo Real**: Vista previa instantánea de cambios
- **Sistema de Caché Inteligente**: Carga rápida y eficiente de modelos 3D
- **Indicadores Visuales**: Feedback claro para selecciones y estados
- **Scrollbars Personalizados**: Estilo consistente con el tema del proyecto

### 🔧 Changed
- **Layout Principal**: Reorganización completa del layout para mejor UX
- **Componentes Compactos**: Rediseño de tarjetas y paneles para optimizar espacio
- **Navegación Mejorada**: Sistema de navegación más intuitivo
- **Responsividad**: Breakpoints optimizados para móvil, tablet y desktop
- **Performance**: Optimizaciones de renderizado y carga

### 🐛 Fixed
- **Viewport Issues**: Corrección de problemas de adaptación al navegador
- **Overflow Problems**: Solución de cortes en paneles y contenido
- **Mobile Compatibility**: Mejoras en dispositivos táctiles
- **Panel Derecho**: Ajuste correcto del panel de configuración
- **Touch Interactions**: Optimización para dispositivos móviles

### 🎨 Styling
- **Tema Consistente**: Colores y estilos unificados
- **Animaciones Suaves**: Transiciones fluidas entre estados
- **Iconografía**: Iconos consistentes con Lucide React
- **Typography**: Tipografía optimizada para legibilidad

## [1.1.0] - 2025-06-25

### ✨ Added
- **Sistema de Compatibilidad**: Adaptación automática de partes dependientes
- **Arquetipo Strong Completo**: Implementación completa del arquetipo Strong
- **Sistema de Precios**: Cálculo dinámico de precios en tiempo real
- **Categorías de Partes**: Organización por tipos de partes
- **Sistema de Preview**: Vista previa de cambios antes de aplicar

### 🔧 Changed
- **Arquitectura de Componentes**: Refactorización para mejor mantenibilidad
- **Sistema de Estados**: Gestión mejorada del estado de la aplicación
- **Carga de Modelos**: Optimización del sistema de carga de modelos 3D

### 🐛 Fixed
- **Compatibilidad de Partes**: Corrección de lógica de compatibilidad
- **Carga de Modelos**: Solución de problemas de carga asíncrona
- **Renderizado 3D**: Mejoras en la visualización de modelos

## [1.0.0] - 2025-06-20

### ✨ Added
- **Visor 3D Básico**: Implementación inicial con Three.js
- **Sistema de Partes**: Estructura básica para manejo de partes
- **Interfaz de Usuario**: Componentes React básicos
- **Carga de Modelos GLB**: Sistema de carga de modelos 3D
- **Controles de Órbita**: Controles básicos de cámara

### 🔧 Changed
- **Estructura del Proyecto**: Organización inicial de archivos
- **Configuración de Build**: Setup con Vite y TypeScript

### 🐛 Fixed
- **Configuración Inicial**: Resolución de problemas de setup
- **Dependencias**: Instalación y configuración de librerías

---

## 📝 Notas de Versión

### Versionado
- **MAJOR**: Cambios incompatibles con versiones anteriores
- **MINOR**: Nuevas funcionalidades compatibles hacia atrás
- **PATCH**: Correcciones de bugs compatibles hacia atrás

### Convenciones de Commits
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (espacios, comas, etc.)
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Cambios en build, configuraciones, etc.

### Contribuciones
Para contribuir al changelog, sigue las convenciones establecidas y documenta claramente los cambios realizados. 