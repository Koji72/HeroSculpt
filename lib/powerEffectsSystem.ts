import * as THREE from 'three';
import { 
  FireEffectMaterial, 
  IceEffectMaterial, 
  LightningEffectMaterial, 
  MagicAuraEffectMaterial,
  powerEffectPresets 
} from './shaders/powerEffectsShaders';

export type PowerType = 'fire' | 'ice' | 'lightning' | 'magic';

export interface PowerEffect {
  id: string;
  type: PowerType;
  mesh: THREE.Mesh;
  material: THREE.Material;
  attachPoint: string;
  intensity: number;
  isActive: boolean;
}

export interface PowerEffectConfig {
  type: PowerType;
  attachPoint: string;
  intensity?: number;
  scale?: number;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
}

export class PowerEffectsSystem {
  private scene: THREE.Scene;
  private activeEffects: Map<string, PowerEffect> = new Map();
  private time: number = 0;
  private animationId: number | null = null;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.startAnimation();
  }

  // 🔥 CREATE POWER EFFECTS
  createPowerEffect(config: PowerEffectConfig): string {
    const effectId = `${config.type}_${config.attachPoint}_${Date.now()}`;
    
    // Create geometry based on power type
    let geometry: THREE.BufferGeometry;
    
    switch (config.type) {
      case 'fire':
        geometry = this.createFlameGeometry();
        break;
      case 'ice':
        geometry = this.createIceGeometry();
        break;
      case 'lightning':
        geometry = this.createLightningGeometry();
        break;
      case 'magic':
        geometry = this.createAuraGeometry();
        break;
      default:
        geometry = new THREE.SphereGeometry(0.5, 16, 16);
    }

    // Create material
    const material = this.createMaterial(config.type);
    
    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.isPowerEffect = true;
    mesh.userData.powerType = config.type;
    mesh.userData.attachPoint = config.attachPoint;
    
    // Set position and scale
    if (config.position) {
      mesh.position.copy(config.position);
    }
    
    if (config.rotation) {
      mesh.rotation.copy(config.rotation);
    }
    
    if (config.scale) {
      mesh.scale.setScalar(config.scale);
    }

    // Create power effect object
    const powerEffect: PowerEffect = {
      id: effectId,
      type: config.type,
      mesh,
      material,
      attachPoint: config.attachPoint,
      intensity: config.intensity || 1.0,
      isActive: true
    };

    // Add to scene and tracking
    this.scene.add(mesh);
    this.activeEffects.set(effectId, powerEffect);

    console.log(`🔥 PowerEffectsSystem: Created ${config.type} effect on ${config.attachPoint}`);
    
    return effectId;
  }

  // 🎯 ATTACH TO CHARACTER PARTS
  attachEffectToPart(effectId: string, targetMesh: THREE.Object3D, offset?: THREE.Vector3): boolean {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return false;

    // Remove from scene first
    this.scene.remove(effect.mesh);
    
    // Add to target mesh
    targetMesh.add(effect.mesh);
    
    if (offset) {
      effect.mesh.position.copy(offset);
    }

    console.log(`🎯 PowerEffectsSystem: Attached effect ${effectId} to ${targetMesh.name}`);
    return true;
  }

  // 🎮 CONTROL EFFECTS
  setEffectIntensity(effectId: string, intensity: number): boolean {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return false;

    effect.intensity = intensity;
    
    // Update material uniforms
    if ('setIntensity' in effect.material) {
      (effect.material as any).setIntensity(intensity);
    }

    return true;
  }

  toggleEffect(effectId: string): boolean {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return false;

    effect.isActive = !effect.isActive;
    effect.mesh.visible = effect.isActive;

    console.log(`⚡ PowerEffectsSystem: Toggled effect ${effectId} - ${effect.isActive ? 'ON' : 'OFF'}`);
    return true;
  }

  removeEffect(effectId: string): boolean {
    const effect = this.activeEffects.get(effectId);
    if (!effect) return false;

    // Remove from scene or parent
    if (effect.mesh.parent) {
      effect.mesh.parent.remove(effect.mesh);
    } else {
      this.scene.remove(effect.mesh);
    }

    // Cleanup
    effect.mesh.geometry?.dispose();
    effect.material?.dispose();
    
    this.activeEffects.delete(effectId);

    console.log(`🗑️ PowerEffectsSystem: Removed effect ${effectId}`);
    return true;
  }

  // 🏷️ HELPER METHODS
  getEffectsByType(type: PowerType): PowerEffect[] {
    return Array.from(this.activeEffects.values()).filter(effect => effect.type === type);
  }

  getEffectsByAttachPoint(attachPoint: string): PowerEffect[] {
    return Array.from(this.activeEffects.values()).filter(effect => effect.attachPoint === attachPoint);
  }

  removeAllEffects(): void {
    for (const [effectId] of this.activeEffects) {
      this.removeEffect(effectId);
    }
  }

  // 🎨 GEOMETRY CREATORS
  private createFlameGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.ConeGeometry(0.3, 1.0, 8, 4);
    
    // Modify vertices for flame shape
    const positions = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      // Make flames wider at bottom, narrower at top
      const scale = Math.pow(1 - y / 0.5, 0.5);
      positions[i] *= scale; // x
      positions[i + 2] *= scale; // z
    }
    
    geometry.attributes.position.needsUpdate = true;
    return geometry;
  }

  private createIceGeometry(): THREE.BufferGeometry {
    // Create multiple ice crystals around character
    const group = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    
    const crystalCount = 8;
    const radius = 1.2; // Distance from character center
    
    for (let c = 0; c < crystalCount; c++) {
      const angle = (c / crystalCount) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.8; // Random height variation
      
      // Position around character
      const centerX = Math.cos(angle) * radius;
      const centerY = height;
      const centerZ = Math.sin(angle) * radius;
      
      // Create small crystal at this position
      const crystalGeo = new THREE.IcosahedronGeometry(0.15, 0);
      const crystalPositions = crystalGeo.attributes.position.array as Float32Array;
      
      const baseIndex = vertices.length / 3;
      
      // Add crystal vertices with position offset
      for (let i = 0; i < crystalPositions.length; i += 3) {
        vertices.push(
          crystalPositions[i] + centerX,
          crystalPositions[i + 1] + centerY,
          crystalPositions[i + 2] + centerZ
        );
      }
      
      // Add crystal indices with offset
      const crystalIndices = crystalGeo.index?.array || [];
      for (let i = 0; i < crystalIndices.length; i++) {
        indices.push(crystalIndices[i] + baseIndex);
      }
    }
    
    group.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    group.setIndex(indices);
    group.computeVertexNormals();
    
    return group;
  }

  private createLightningGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    
    // Create jagged lightning bolt path
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (Math.random() - 0.5) * 0.3;
      const y = t * 2.0 - 1.0;
      const z = (Math.random() - 0.5) * 0.3;
      
      vertices.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }

  private createAuraGeometry(): THREE.BufferGeometry {
    // Create layered sphere aura around character
    const group = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    
    const layers = 3;
    
    for (let layer = 0; layer < layers; layer++) {
      const radius = 0.8 + (layer * 0.3); // Expanding layers
      const alpha = 1.0 - (layer * 0.3); // Fading layers
      
      const sphereGeo = new THREE.SphereGeometry(radius, 16, 12);
      const spherePositions = sphereGeo.attributes.position.array as Float32Array;
      
      const baseIndex = vertices.length / 3;
      
      // Add sphere vertices
      for (let i = 0; i < spherePositions.length; i += 3) {
        vertices.push(
          spherePositions[i],
          spherePositions[i + 1],
          spherePositions[i + 2]
        );
      }
      
      // Add sphere indices with offset
      const sphereIndices = sphereGeo.index?.array || [];
      for (let i = 0; i < sphereIndices.length; i++) {
        indices.push(sphereIndices[i] + baseIndex);
      }
    }
    
    group.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    group.setIndex(indices);
    group.computeVertexNormals();
    
    return group;
  }

  // 🎨 MATERIAL CREATORS
  private createMaterial(type: PowerType): THREE.Material {
    switch (type) {
      case 'fire':
        return new FireEffectMaterial();
      case 'ice':
        return new IceEffectMaterial();
      case 'lightning':
        return new LightningEffectMaterial();
      case 'magic':
        return new MagicAuraEffectMaterial();
      default:
        return new THREE.MeshBasicMaterial({ color: 0xff0000 });
    }
  }

  // ⏰ ANIMATION LOOP
  private startAnimation(): void {
    const animate = () => {
      this.time += 0.016; // ~60fps
      
      // Update all active effects
      for (const effect of this.activeEffects.values()) {
        if (effect.isActive && 'updateTime' in effect.material) {
          (effect.material as any).updateTime(this.time);
        }
      }
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  // 🧹 CLEANUP
  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.removeAllEffects();
  }
}

// 🎯 POWER PRESET CONFIGURATIONS
export const powerPresetConfigs = {
  fireHands: {
    type: 'fire' as PowerType,
    attachPoint: 'hand_left',
    intensity: 1.2,
    scale: 0.8,
    position: new THREE.Vector3(0, 0.1, 0.1)
  },
  iceArmor: {
    type: 'ice' as PowerType,
    attachPoint: 'torso',
    intensity: 0.8,
    scale: 1.0,
    position: new THREE.Vector3(0, 0.5, 0) // Center on character torso
  },
  lightningEyes: {
    type: 'lightning' as PowerType,
    attachPoint: 'head',
    intensity: 1.5,
    scale: 0.3,
    position: new THREE.Vector3(0, 0, 0.2)
  },
  magicAura: {
    type: 'magic' as PowerType,
    attachPoint: 'torso',
    intensity: 1.0,
    scale: 1.2,
    position: new THREE.Vector3(0, 0.3, 0) // Center on character
  }
};

// 🎨 UTILITY FUNCTIONS
export function getAttachPointPosition(partCategory: string): THREE.Vector3 {
  const attachPoints: Record<string, THREE.Vector3> = {
    hand_left: new THREE.Vector3(-0.3, 0, 0.1),
    hand_right: new THREE.Vector3(0.3, 0, 0.1),
    head: new THREE.Vector3(0, 0.2, 0.1),
    torso: new THREE.Vector3(0, 0, 0),
    chest: new THREE.Vector3(0, 0.1, 0.1),
    cape: new THREE.Vector3(0, 0.2, -0.2),
    weapon: new THREE.Vector3(0, 0, 0.2),
    symbol: new THREE.Vector3(0, 0, 0.1)
  };

  return attachPoints[partCategory] || new THREE.Vector3(0, 0, 0);
}

export function createPowerEffectForArchetype(archetype: string): PowerEffectConfig[] {
  const archetypeEffects: Record<string, PowerEffectConfig[]> = {
    strong: [
      { type: 'fire', attachPoint: 'hand_right', intensity: 1.2 },
      { type: 'magic', attachPoint: 'torso', intensity: 0.8 }
    ],
    speedster: [
      { type: 'lightning', attachPoint: 'hand_left', intensity: 1.5 },
      { type: 'lightning', attachPoint: 'hand_right', intensity: 1.5 }
    ],
    mystic: [
      { type: 'magic', attachPoint: 'torso', intensity: 1.3 },
      { type: 'ice', attachPoint: 'cape', intensity: 0.9 }
    ],
    tech: [
      { type: 'lightning', attachPoint: 'head', intensity: 1.0 },
      { type: 'fire', attachPoint: 'weapon', intensity: 1.1 }
    ]
  };

  return archetypeEffects[archetype] || [];
}
