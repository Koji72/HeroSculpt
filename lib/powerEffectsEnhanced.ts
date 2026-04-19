import * as THREE from 'three';
import { PowerEffectsSystem, PowerType, PowerEffectConfig } from './powerEffectsSystem';

// 🌟 ENHANCED POWER EFFECTS SYSTEM
export class EnhancedPowerEffectsSystem extends PowerEffectsSystem {
  
  // 🔥 CREATE FULL-BODY ICE ARMOR
  createIceArmorEffect(characterModel: THREE.Group): string[] {
    const effectIds: string[] = [];
    
    if (!characterModel) return effectIds;
    
    // Create ice crystals around each major body part
    const bodyParts = ['torso', 'head', 'hand_left', 'hand_right'];
    
    bodyParts.forEach((partName, index) => {
      const config: PowerEffectConfig = {
        type: 'ice',
        attachPoint: partName,
        intensity: 0.7 + (index * 0.1),
        scale: partName === 'head' ? 0.6 : 0.8,
        position: this.getPartPosition(partName)
      };
      
      const effectId = this.createPowerEffect(config);
      
      // Find the actual body part in the character model
      const targetPart = this.findBodyPart(characterModel, partName);
      if (targetPart) {
        this.attachEffectToPart(effectId, targetPart, config.position);
      }
      
      effectIds.push(effectId);
    });
    
    // Add floating ice shards around character
    const shardConfig: PowerEffectConfig = {
      type: 'ice',
      attachPoint: 'torso',
      intensity: 0.5,
      scale: 1.5,
      position: new THREE.Vector3(0, 0.5, 0)
    };
    
    const shardEffectId = this.createIceShards();
    effectIds.push(shardEffectId);
    
    if (import.meta.env.DEV) console.log(`❄️ Created full Ice Armor with ${effectIds.length} effects`);
    return effectIds;
  }
  
  // 🔥 CREATE MAGIC AURA LAYERS
  createMagicAuraLayers(characterModel: THREE.Group): string[] {
    const effectIds: string[] = [];
    
    if (!characterModel) return effectIds;
    
    // Create multiple aura layers at different distances
    const layers = [
      { radius: 1.0, intensity: 1.2, color: '#8B00FF' },
      { radius: 1.4, intensity: 0.8, color: '#FF1493' },
      { radius: 1.8, intensity: 0.5, color: '#00FFFF' }
    ];
    
    layers.forEach((layer, index) => {
      const config: PowerEffectConfig = {
        type: 'magic',
        attachPoint: 'torso',
        intensity: layer.intensity,
        scale: layer.radius,
        position: new THREE.Vector3(0, 0.3, 0)
      };
      
      const effectId = this.createPowerEffect(config);
      
      // Attach to character torso
      const torso = this.findBodyPart(characterModel, 'torso');
      if (torso) {
        this.attachEffectToPart(effectId, torso, config.position);
      }
      
      effectIds.push(effectId);
    });
    
    if (import.meta.env.DEV) console.log(`✨ Created Magic Aura with ${effectIds.length} layers`);
    return effectIds;
  }
  
  // 🔥 CREATE FIRE TRAIL SYSTEM
  createFireTrailSystem(characterModel: THREE.Group): string[] {
    const effectIds: string[] = [];
    
    if (!characterModel) return effectIds;
    
    // Fire on hands, feet, and shoulders
    const firePoints = [
      { part: 'hand_left', scale: 0.8, position: new THREE.Vector3(-0.1, 0, 0.1) },
      { part: 'hand_right', scale: 0.8, position: new THREE.Vector3(0.1, 0, 0.1) },
      { part: 'torso', scale: 1.2, position: new THREE.Vector3(-0.3, 0.8, -0.2) }, // Left shoulder
      { part: 'torso', scale: 1.2, position: new THREE.Vector3(0.3, 0.8, -0.2) },  // Right shoulder
    ];
    
    firePoints.forEach((point) => {
      const config: PowerEffectConfig = {
        type: 'fire',
        attachPoint: point.part,
        intensity: 1.0,
        scale: point.scale,
        position: point.position
      };
      
      const effectId = this.createPowerEffect(config);
      
      const targetPart = this.findBodyPart(characterModel, point.part);
      if (targetPart) {
        this.attachEffectToPart(effectId, targetPart, config.position);
      }
      
      effectIds.push(effectId);
    });
    
    if (import.meta.env.DEV) console.log(`🔥 Created Fire Trail System with ${effectIds.length} effects`);
    return effectIds;
  }
  
  // 🔥 CREATE LIGHTNING STORM
  createLightningStorm(characterModel: THREE.Group): string[] {
    const effectIds: string[] = [];
    
    if (!characterModel) return effectIds;
    
    // Lightning emanating from multiple points
    const lightningPoints = [
      { part: 'head', position: new THREE.Vector3(0, 0.1, 0.1) },
      { part: 'hand_left', position: new THREE.Vector3(0, 0, 0.1) },
      { part: 'hand_right', position: new THREE.Vector3(0, 0, 0.1) },
      { part: 'torso', position: new THREE.Vector3(0, 0.5, 0) }, // Chest center
    ];
    
    lightningPoints.forEach((point) => {
      const config: PowerEffectConfig = {
        type: 'lightning',
        attachPoint: point.part,
        intensity: 1.3,
        scale: 0.7,
        position: point.position
      };
      
      const effectId = this.createPowerEffect(config);
      
      const targetPart = this.findBodyPart(characterModel, point.part);
      if (targetPart) {
        this.attachEffectToPart(effectId, targetPart, config.position);
      }
      
      effectIds.push(effectId);
    });
    
    if (import.meta.env.DEV) console.log(`⚡ Created Lightning Storm with ${effectIds.length} effects`);
    return effectIds;
  }
  
  // 🎯 HELPER METHODS
  private getPartPosition(partName: string): THREE.Vector3 {
    const positions: Record<string, THREE.Vector3> = {
      'torso': new THREE.Vector3(0, 0.3, 0),
      'head': new THREE.Vector3(0, 0.1, 0.1),
      'hand_left': new THREE.Vector3(-0.05, 0, 0.1),
      'hand_right': new THREE.Vector3(0.05, 0, 0.1),
      'chest': new THREE.Vector3(0, 0.4, 0.1),
    };
    
    return positions[partName] || new THREE.Vector3(0, 0, 0);
  }
  
  private findBodyPart(characterModel: THREE.Group, partName: string): THREE.Object3D | null {
    let foundPart: THREE.Object3D | null = null;
    
    characterModel.traverse((child) => {
      if (child.userData.category === partName || 
          child.userData.partId?.includes(partName) ||
          child.name.toLowerCase().includes(partName.toLowerCase())) {
        foundPart = child;
      }
    });
    
    return foundPart || characterModel; // Fallback to character model itself
  }
  
  private createIceShards(): string {
    // Create floating ice shards effect
    const config: PowerEffectConfig = {
      type: 'ice',
      attachPoint: 'torso',
      intensity: 0.6,
      scale: 1.8,
      position: new THREE.Vector3(0, 0.8, 0)
    };
    
    return this.createPowerEffect(config);
  }
}

// 🎮 ENHANCED PRESET CONFIGURATIONS
export const enhancedPowerPresets = {
  fullIceArmor: {
    name: 'Full Ice Armor',
    description: 'Complete ice crystalline armor covering the character',
    createEffect: (system: EnhancedPowerEffectsSystem, character: THREE.Group) => 
      system.createIceArmorEffect(character)
  },
  
  magicAuraLayers: {
    name: 'Layered Magic Aura',
    description: 'Multiple magical aura layers with different colors',
    createEffect: (system: EnhancedPowerEffectsSystem, character: THREE.Group) => 
      system.createMagicAuraLayers(character)
  },
  
  fireTrailSystem: {
    name: 'Fire Trail System',
    description: 'Fire emanating from hands, shoulders and movement',
    createEffect: (system: EnhancedPowerEffectsSystem, character: THREE.Group) => 
      system.createFireTrailSystem(character)
  },
  
  lightningStorm: {
    name: 'Lightning Storm',
    description: 'Electrical energy crackling from multiple body points',
    createEffect: (system: EnhancedPowerEffectsSystem, character: THREE.Group) => 
      system.createLightningStorm(character)
  }
};

// 🎯 UTILITY FUNCTIONS
export function createEnhancedEffect(
  system: EnhancedPowerEffectsSystem, 
  character: THREE.Group, 
  presetName: keyof typeof enhancedPowerPresets
): string[] {
  const preset = enhancedPowerPresets[presetName];
  if (preset) {
    return preset.createEffect(system, character);
  }
  return [];
}

export function removeEnhancedEffect(
  system: EnhancedPowerEffectsSystem, 
  effectIds: string[]
): void {
  effectIds.forEach(id => system.removeEffect(id));
}
