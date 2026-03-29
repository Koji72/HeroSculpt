import * as THREE from 'three';

// 🔥 FIRE EFFECTS SHADERS
export const fireVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uFlameIntensity;

  // Noise function for flame movement
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    vec3 pos = position;
    
    // Add flame flicker effect
    float flicker = sin(uTime * 3.0 + pos.y * 2.0) * 0.1 * uFlameIntensity;
    pos.x += flicker * noise(vec2(pos.y, uTime));
    pos.z += flicker * noise(vec2(pos.x, uTime + 1.0));
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const fireFragmentShader = `
  uniform float uTime;
  uniform float uFlameIntensity;
  uniform vec3 uFlameColorHot;
  uniform vec3 uFlameColorCold;
  uniform float uFlameSize;
  
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float fractalNoise(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for(int i = 0; i < 4; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    
    // Create flame pattern
    float flamePattern = fractalNoise(uv * uFlameSize + vec2(0.0, uTime * 2.0));
    flamePattern *= fractalNoise(uv * uFlameSize * 0.5 + vec2(uTime * 1.5, 0.0));
    
    // Gradient from bottom (hot) to top (cold)
    float gradient = 1.0 - uv.y;
    flamePattern *= gradient;
    
    // Mix colors based on flame intensity
    vec3 flameColor = mix(uFlameColorCold, uFlameColorHot, flamePattern);
    
    // Add glow effect
    float glow = flamePattern * uFlameIntensity;
    flameColor += glow * vec3(1.0, 0.5, 0.0);
    
    // Alpha based on flame pattern
    float alpha = clamp(flamePattern * 2.0, 0.0, 1.0);
    
    gl_FragColor = vec4(flameColor, alpha);
  }
`;

// ❄️ ICE EFFECTS SHADERS
export const iceVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uIceIntensity;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    vec3 pos = position;
    
    // Add subtle ice crystal shimmer
    float shimmer = sin(uTime * 2.0 + pos.x * 10.0) * 0.02 * uIceIntensity;
    pos += normal * shimmer;
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const iceFragmentShader = `
  uniform float uTime;
  uniform float uIceIntensity;
  uniform vec3 uIceColorCore;
  uniform vec3 uIceColorEdge;
  uniform float uCrystalSize;
  uniform float uRefraction;
  
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Crystal pattern function
  float crystalPattern(vec2 uv) {
    vec2 grid = fract(uv * uCrystalSize);
    float crystal = 0.0;
    
    // Create hexagonal ice crystal pattern
    for(int i = 0; i < 6; i++) {
      float angle = float(i) * 3.14159 / 3.0;
      vec2 dir = vec2(cos(angle), sin(angle));
      crystal += 1.0 - smoothstep(0.0, 0.3, dot(grid - 0.5, dir));
    }
    
    return crystal * 0.3;
  }

  void main() {
    vec2 uv = vUv;
    vec3 normal = normalize(vNormal);
    
    // Create ice crystal pattern with animation
    float crystals = crystalPattern(uv + vec2(sin(uTime * 0.5), cos(uTime * 0.3)) * 0.1);
    crystals += noise(uv * 20.0 + uTime * 0.1) * 0.2;
    
    // Fresnel effect for ice-like refraction
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = 1.0 - dot(normal, viewDir);
    fresnel = pow(fresnel, 2.0);
    
    // Mix ice colors
    vec3 iceColor = mix(uIceColorCore, uIceColorEdge, fresnel);
    iceColor += crystals * vec3(0.8, 0.9, 1.0);
    
    // Add sparkle effect
    float sparkle = crystals * uIceIntensity;
    iceColor += sparkle * vec3(1.0, 1.0, 1.0);
    
    // Transparency based on fresnel and intensity
    float alpha = mix(0.3, 0.8, fresnel) * uIceIntensity;
    
    gl_FragColor = vec4(iceColor, alpha);
  }
`;

// ⚡ LIGHTNING EFFECTS SHADERS
export const lightningVertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uLightningIntensity;

  void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Add lightning jagged movement
    float lightning = sin(uTime * 20.0 + pos.y * 5.0) * 0.05 * uLightningIntensity;
    pos.x += lightning;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const lightningFragmentShader = `
  uniform float uTime;
  uniform float uLightningIntensity;
  uniform vec3 uLightningColor;
  
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float lightningBolt(vec2 uv, float time) {
    float bolt = 0.0;
    
    // Create jagged lightning pattern
    for(int i = 0; i < 3; i++) {
      float offset = float(i) * 0.3;
      float noise = random(vec2(uv.y + time + offset, time)) * 2.0 - 1.0;
      float x = uv.x + noise * 0.1;
      bolt += 1.0 / (abs(x - 0.5) * 100.0 + 1.0);
    }
    
    return bolt;
  }

  void main() {
    vec2 uv = vUv;
    
    // Create animated lightning bolts
    float lightning = lightningBolt(uv, uTime * 10.0);
    lightning *= step(random(vec2(floor(uTime * 10.0))), 0.7); // Intermittent flashes
    
    vec3 color = uLightningColor * lightning * uLightningIntensity;
    float alpha = lightning;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// 🌟 MAGIC AURA SHADERS
export const magicAuraVertexShader = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform float uMagicIntensity;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    vec3 pos = position;
    
    // Add magical floating effect
    float magic = sin(uTime + pos.x * 2.0) * cos(uTime * 1.5 + pos.z * 2.0);
    pos += normal * magic * 0.05 * uMagicIntensity;
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const magicAuraFragmentShader = `
  uniform float uTime;
  uniform float uMagicIntensity;
  uniform vec3 uMagicColor1;
  uniform vec3 uMagicColor2;
  uniform float uAuraSize;
  
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float swirl(vec2 uv, float time) {
    vec2 center = vec2(0.5);
    vec2 dir = uv - center;
    float angle = atan(dir.y, dir.x) + time;
    float radius = length(dir);
    
    return sin(angle * 3.0 + radius * 10.0 - time * 5.0);
  }

  void main() {
    vec2 uv = vUv;
    vec3 normal = normalize(vNormal);
    
    // Create magical swirling pattern
    float pattern = swirl(uv, uTime);
    pattern += noise(uv * uAuraSize + uTime) * 0.5;
    pattern = sin(pattern + uTime * 2.0) * 0.5 + 0.5;
    
    // Fresnel for magical glow
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = 1.0 - dot(normal, viewDir);
    fresnel = pow(fresnel, 1.5);
    
    // Mix magical colors
    vec3 magicColor = mix(uMagicColor1, uMagicColor2, pattern);
    magicColor *= fresnel * uMagicIntensity;
    
    // Pulsing effect
    float pulse = sin(uTime * 3.0) * 0.3 + 0.7;
    magicColor *= pulse;
    
    float alpha = fresnel * pattern * uMagicIntensity;
    
    gl_FragColor = vec4(magicColor, alpha);
  }
`;

// 🎨 SHADER MATERIAL CLASSES
export class FireEffectMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uFlameIntensity: { value: 1.0 },
        uFlameColorHot: { value: new THREE.Color(1.0, 0.3, 0.0) },
        uFlameColorCold: { value: new THREE.Color(1.0, 1.0, 0.0) },
        uFlameSize: { value: 3.0 }
      },
      vertexShader: fireVertexShader,
      fragmentShader: fireFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  updateTime(time: number) {
    this.uniforms.uTime.value = time;
  }

  setIntensity(intensity: number) {
    this.uniforms.uFlameIntensity.value = intensity;
  }
}

export class IceEffectMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uIceIntensity: { value: 1.0 },
        uIceColorCore: { value: new THREE.Color(0.6, 0.8, 1.0) },
        uIceColorEdge: { value: new THREE.Color(0.9, 0.95, 1.0) },
        uCrystalSize: { value: 5.0 },
        uRefraction: { value: 0.3 }
      },
      vertexShader: iceVertexShader,
      fragmentShader: iceFragmentShader,
      transparent: true,
      depthWrite: false
    });
  }

  updateTime(time: number) {
    this.uniforms.uTime.value = time;
  }

  setIntensity(intensity: number) {
    this.uniforms.uIceIntensity.value = intensity;
  }
}

export class LightningEffectMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uLightningIntensity: { value: 1.0 },
        uLightningColor: { value: new THREE.Color(0.5, 0.7, 1.0) }
      },
      vertexShader: lightningVertexShader,
      fragmentShader: lightningFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  updateTime(time: number) {
    this.uniforms.uTime.value = time;
  }

  setIntensity(intensity: number) {
    this.uniforms.uLightningIntensity.value = intensity;
  }
}

export class MagicAuraEffectMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uTime: { value: 0 },
        uMagicIntensity: { value: 1.0 },
        uMagicColor1: { value: new THREE.Color(0.5, 0.0, 1.0) },
        uMagicColor2: { value: new THREE.Color(1.0, 0.0, 0.5) },
        uAuraSize: { value: 8.0 }
      },
      vertexShader: magicAuraVertexShader,
      fragmentShader: magicAuraFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  updateTime(time: number) {
    this.uniforms.uTime.value = time;
  }

  setIntensity(intensity: number) {
    this.uniforms.uMagicIntensity.value = intensity;
  }
}

// 🎯 POWER EFFECT PRESETS
export const powerEffectPresets = {
  fire: {
    name: 'Fire Powers',
    material: FireEffectMaterial,
    attachPoints: ['hand_left', 'hand_right', 'weapon'],
    particleCount: 200,
    description: 'Llamas dinámicas para poderes de fuego'
  },
  ice: {
    name: 'Ice Powers',
    material: IceEffectMaterial,
    attachPoints: ['hand_left', 'hand_right', 'chest'],
    particleCount: 150,
    description: 'Cristales de hielo y escarcha'
  },
  lightning: {
    name: 'Lightning Powers',
    material: LightningEffectMaterial,
    attachPoints: ['hand_left', 'hand_right', 'head'],
    particleCount: 100,
    description: 'Rayos eléctricos intermitentes'
  },
  magic: {
    name: 'Magic Aura',
    material: MagicAuraEffectMaterial,
    attachPoints: ['torso', 'cape', 'symbol'],
    particleCount: 300,
    description: 'Aura mágica con remolinos de energía'
  }
};
