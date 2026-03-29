# Sistema de Configuración de Materiales Avanzado

## Resumen

Se ha implementado un sistema completo de configuración de materiales e iluminación en tiempo real, inspirado en aplicaciones profesionales de customización 3D. Este sistema permite a los usuarios personalizar no solo las partes del personaje, sino también los materiales, la iluminación y los efectos visuales.

## Características Implementadas

### 1. MaterialConfigurator
- **Configuración de materiales en tiempo real**: Permite cambiar propiedades como color, rugosidad, metalicidad, clearcoat, etc.
- **Presets de materiales**: Materiales predefinidos como Mármol, Metal Pulido, Plástico, Cristal, etc.
- **Selección por parte del cuerpo**: Diferentes configuraciones para cabeza, cuerpo y equipamiento
- **Controles intuitivos**: Sliders y selectores de color para ajuste fino

### 2. Sistema de Iluminación
- **Presets de iluminación**: 
  - Estudio Neutral: Iluminación equilibrada
  - Dramático: Contraste alto con luces de colores
  - Suave: Iluminación cálida y suave
  - Neón: Efectos de luz neón coloridos
- **Configuración de intensidades**: Control individual de cada tipo de luz
- **Aplicación en tiempo real**: Los cambios se reflejan inmediatamente en el visor

### 3. Efectos Post-Procesado (AdvancedEffects)
- **SSAO (Screen Space Ambient Occlusion)**: Sombras ambientales realistas
- **Bloom**: Efectos de resplandor para materiales brillantes
- **Corrección de color**: Ajustes de color avanzados
- **Presets de efectos**: Configuraciones predefinidas para diferentes estilos visuales

### 4. MaterialPanel
- **Panel lateral deslizable**: Interfaz moderna y accesible
- **Sistema de pestañas**: Organización clara de funcionalidades
- **Integración completa**: Conectado directamente con el CharacterViewer

## Arquitectura Técnica

### Componentes Principales

```typescript
// MaterialConfigurator.tsx
interface MaterialConfiguratorProps {
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
  onMaterialChange?: (material: THREE.Material, partType: string) => void;
}

// AdvancedEffects.tsx
interface AdvancedEffectsProps {
  scene: THREE.Scene | null;
  camera: THREE.Camera | null;
  renderer: THREE.WebGLRenderer | null;
  onComposerChange?: (composer: EffectComposer | null) => void;
}

// MaterialPanel.tsx
interface MaterialPanelProps {
  characterViewerRef: React.RefObject<CharacterViewerRef | null>;
}
```

### Integración con CharacterViewer

Se han agregado nuevos métodos al `CharacterViewerRef`:

```typescript
export interface CharacterViewerRef {
  // ... métodos existentes
  getRenderer: () => THREE.WebGLRenderer | null;
  applyMaterialToPart: (material: THREE.Material, partType: string) => void;
  applyLightingPreset: (preset: any) => void;
}
```

### Sistema de Materiales

Los materiales se aplican basándose en el nombre del mesh y el tipo de parte:

```typescript
const applyMaterialToPart = (material: THREE.Material, partType: string) => {
  modelGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const meshName = child.name.toLowerCase();
      if (meshName.includes(partType.toLowerCase()) || 
          (partType === 'body' && (meshName.includes('torso') || meshName.includes('legs') || meshName.includes('hands'))) ||
          (partType === 'head' && meshName.includes('head')) ||
          (partType === 'equip' && (meshName.includes('belt') || meshName.includes('boots') || meshName.includes('cape') || meshName.includes('symbol')))) {
        child.material = material;
      }
    }
  });
};
```

## Presets de Materiales

### Cuerpo
- **Mármol**: Material realista con propiedades de mármol
- **Metal Pulido**: Metal brillante con alta reflectividad
- **Plástico**: Material opaco con baja reflectividad
- **Cristal**: Material transparente con refracción

### Cabeza
- **Piel Realista**: Material optimizado para simular piel humana

### Equipamiento
- **Metal Equipamiento**: Metal específico para partes de equipamiento

## Presets de Iluminación

### Estudio Neutral
```typescript
{
  keyLight: { color: 0xffffff, intensity: 1.0, position: new THREE.Vector3(5, 10, 7.5) },
  fillLight: { color: 0xaaaaaa, intensity: 0.5, position: new THREE.Vector3(-5, 5, 5) },
  rimLight: { color: 0xffffff, intensity: 0.6, position: new THREE.Vector3(0, 10, -10) }
}
```

### Dramático
```typescript
{
  keyLight: { color: 0xffd700, intensity: 1.2, position: new THREE.Vector3(8, 12, 5) },
  fillLight: { color: 0x4169e1, intensity: 0.3, position: new THREE.Vector3(-8, 3, 8) },
  rimLight: { color: 0xff4500, intensity: 0.8, position: new THREE.Vector3(0, 15, -15) }
}
```

## Presets de Efectos

### Realista
- SSAO habilitado para sombras ambientales
- Configuración optimizada para realismo

### Cinematográfico
- SSAO y Bloom suaves
- Efectos sutiles para un look profesional

### Dramático
- SSAO y Bloom intensos
- Corrección de color para mayor contraste

### Neón
- Bloom intenso sin SSAO
- Efectos de resplandor para materiales brillantes

## Uso

1. **Acceder al panel**: Hacer clic en el botón de configuración (ícono de engranaje)
2. **Seleccionar pestaña**: Materiales, Iluminación o Efectos
3. **Aplicar presets**: Hacer clic en los botones de preset para aplicar configuraciones predefinidas
4. **Ajustar manualmente**: Usar los controles deslizantes para ajuste fino
5. **Ver cambios en tiempo real**: Los cambios se aplican inmediatamente al modelo 3D

## Beneficios

### Para el Usuario
- **Personalización avanzada**: Control total sobre la apariencia del personaje
- **Interfaz intuitiva**: Controles fáciles de usar con feedback visual inmediato
- **Presets profesionales**: Configuraciones optimizadas para diferentes estilos
- **Experiencia inmersiva**: Cambios en tiempo real sin recargas

### Para el Desarrollo
- **Arquitectura modular**: Componentes reutilizables y bien estructurados
- **Extensibilidad**: Fácil agregar nuevos presets y efectos
- **Rendimiento optimizado**: Efectos post-procesado opcionales
- **Integración limpia**: Conectado sin afectar la funcionalidad existente

## Próximas Mejoras

1. **Más presets de materiales**: Materiales específicos para diferentes arquetipos
2. **Animaciones de transición**: Transiciones suaves entre configuraciones
3. **Guardado de configuraciones**: Permitir guardar configuraciones personalizadas
4. **Efectos adicionales**: Motion blur, depth of field, etc.
5. **Optimización de rendimiento**: LOD para efectos en dispositivos móviles

## Conclusión

Este sistema de configuración de materiales representa un salto significativo en la funcionalidad del customizador, proporcionando herramientas profesionales de personalización visual que elevan la experiencia del usuario a un nivel comparable con aplicaciones comerciales de alta gama. 