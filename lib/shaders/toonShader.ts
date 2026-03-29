import * as THREE from 'three';

export interface ToonShaderUniforms {
  uBaseMap: { value: THREE.Texture | null };
  uPaperMap: { value: THREE.Texture | null };
  uPaperIntensity: { value: number };
  uSaturation: { value: number };
  uContrast: { value: number };
  uLightDir: { value: THREE.Vector3 };
  uToonLevels: { value: number };
  uOutlineThickness: { value: number };
  uTime: { value: number };
}

export const toonShaderUniforms: ToonShaderUniforms = {
  uBaseMap: { value: null },
  uPaperMap: { value: null },
  uPaperIntensity: { value: 0.25 },
  uSaturation: { value: 1.2 },
  uContrast: { value: 1.1 },
  uLightDir: { value: new THREE.Vector3(0.5, 1.0, 0.3) },
  uToonLevels: { value: 4.0 },
  uOutlineThickness: { value: 1.05 },
  uTime: { value: 0.0 }
};

export const toonVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vViewDir;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const toonFragmentShader = `
  uniform sampler2D uBaseMap;
  uniform sampler2D uPaperMap;
  uniform float uPaperIntensity;
  uniform float uSaturation;
  uniform float uContrast;
  uniform vec3 uLightDir;
  uniform float uToonLevels;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // Función para ajustar saturación tipo Moebius
  vec3 adjustSaturation(vec3 color, float sat) {
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    return mix(vec3(luma), color, sat);
  }

  // Función para ajustar contraste
  vec3 adjustContrast(vec3 color, float contrast) {
    return (color - 0.5) * contrast + 0.5;
  }

  // Función toon shading con bandas discretas - más suave
  float toonShading(float light) {
    float stepped = floor(light * uToonLevels) / uToonLevels;
    return max(0.3, stepped); // Más luz ambiente
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightDir);
    
    // Cálculo de iluminación más brillante
    float NdotL = dot(normal, lightDir) * 0.5 + 0.5; // Wrap lighting
    float light = toonShading(NdotL);
    
    // Color base vibrante por defecto - colores superhéroe
    vec3 baseColor = vec3(0.2, 0.4, 0.8); // Azul superhéroe por defecto
    
    // Si hay textura base, usarla pero con colores más vibrantes
    if (uBaseMap != null) {
      vec3 texColor = texture2D(uBaseMap, vUv).rgb;
      // Aumentar saturación de la textura original
      texColor = adjustSaturation(texColor, 1.5);
      baseColor = texColor;
    }
    
    // Aplicar iluminación toon pero conservando colores
    baseColor = baseColor * (0.6 + light * 0.4); // Mezcla más sutil
    
    // Ajustes estilo Moebius/cómic - más vibrante
    baseColor = adjustSaturation(baseColor, uSaturation);
    baseColor = adjustContrast(baseColor, uContrast);
    
    // Overlay de textura de papel muy sutil
    if (uPaperMap != null) {
      vec3 paper = texture2D(uPaperMap, vUv * 2.0).rgb;
      baseColor = mix(baseColor, baseColor * paper, uPaperIntensity * 0.5);
    }
    
    // Asegurar que los colores no sean demasiado oscuros
    baseColor = max(baseColor, vec3(0.1));
    
    gl_FragColor = vec4(baseColor, 1.0);
  }
`;

export class ToonShaderMaterial extends THREE.ShaderMaterial {
  constructor(uniforms?: Partial<ToonShaderUniforms>) {
    const finalUniforms = THREE.UniformsUtils.clone(toonShaderUniforms);
    
    if (uniforms) {
      Object.assign(finalUniforms, uniforms);
    }

    super({
      uniforms: finalUniforms,
      vertexShader: toonVertexShader,
      fragmentShader: toonFragmentShader,
      transparent: false,
      side: THREE.FrontSide
    });

    this.type = 'ToonShaderMaterial';
  }

  // Métodos de conveniencia para actualizar uniforms
  setBaseTexture(texture: THREE.Texture | null) {
    this.uniforms.uBaseMap.value = texture;
  }

  setPaperTexture(texture: THREE.Texture | null) {
    this.uniforms.uPaperMap.value = texture;
  }

  setPaperIntensity(intensity: number) {
    this.uniforms.uPaperIntensity.value = intensity;
  }

  setSaturation(saturation: number) {
    this.uniforms.uSaturation.value = saturation;
  }

  setContrast(contrast: number) {
    this.uniforms.uContrast.value = contrast;
  }

  setLightDirection(direction: THREE.Vector3) {
    this.uniforms.uLightDir.value.copy(direction);
  }

  setToonLevels(levels: number) {
    this.uniforms.uToonLevels.value = levels;
  }

  updateTime(time: number) {
    this.uniforms.uTime.value = time;
  }
}

// Función para crear outline dinámico
export function createOutlineMesh(
  mesh: THREE.Mesh, 
  scale: number = 1.05, 
  color: number = 0x000000
): THREE.Mesh {
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color,
    side: THREE.BackSide,
    transparent: false
  });

  const outlineMesh = new THREE.Mesh(mesh.geometry.clone(), outlineMaterial);
  outlineMesh.scale.multiplyScalar(scale);
  outlineMesh.name = mesh.name + '_outline';
  
  return outlineMesh;
}

// Presets de configuración Moebius - ajustados para mejor visibilidad
export const moebiusPresets = {
  classic: {
    uSaturation: { value: 1.4 },
    uContrast: { value: 1.1 },
    uToonLevels: { value: 5.0 }, // Más suave
    uPaperIntensity: { value: 0.15 } // Menos efecto papel
  },
  vibrant: {
    uSaturation: { value: 1.6 },
    uContrast: { value: 1.3 },
    uToonLevels: { value: 4.0 },
    uPaperIntensity: { value: 0.1 }
  },
  subtle: {
    uSaturation: { value: 1.2 },
    uContrast: { value: 1.05 },
    uToonLevels: { value: 6.0 }, // Muy suave
    uPaperIntensity: { value: 0.2 }
  }
};

