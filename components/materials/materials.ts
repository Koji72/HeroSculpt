import * as THREE from 'three';
import { PartCategory } from '../../types';

// Interfaces movidas aquí para ser exportadas
export interface MaterialPreset {
  name: string;
  description: string;
  material: THREE.MeshPhysicalMaterial;
  icon: string;
  category: 'fabric' | 'metal' | 'plastic' | 'special';
}

export interface LightingPreset {
  name: string;
  description: string;
  keyLight: { color: number; intensity: number; position: THREE.Vector3 };
  fillLight: { color: number; intensity: number; position: THREE.Vector3 };
  rimLight: { color: number; intensity: number; position: THREE.Vector3 };
  icon: string;
}

// Colorable parts configuration by category
export const colorableParts = {
  [PartCategory.TORSO]: {
    colorable: true,
    name: 'Torso',
    description: 'Main body part',
    defaultColor: 0x666666,
    materialType: 'body'
  },
  [PartCategory.SUIT_TORSO]: {
    colorable: true,
    name: 'Suit',
    description: 'Hero complete suit',
    defaultColor: 0x666666,
    materialType: 'body'
  },
  [PartCategory.LOWER_BODY]: {
    colorable: true,
    name: 'Legs',
    description: 'Lower body part',
    defaultColor: 0x666666,
    materialType: 'body'
  },
  [PartCategory.HEAD]: {
    colorable: false, // Head is not colored (it's skin)
    name: 'Head',
    description: 'Character head',
    defaultColor: 0xfefefe,
    materialType: 'head'
  },
  [PartCategory.HAND_LEFT]: {
    colorable: true,
    name: 'Left Hand',
    description: 'Left glove or hand',
    defaultColor: 0x666666,
    materialType: 'body'
  },
  [PartCategory.HAND_RIGHT]: {
    colorable: true,
    name: 'Right Hand',
    description: 'Right glove or hand',
    defaultColor: 0x666666,
    materialType: 'body'
  },
  [PartCategory.CAPE]: {
    colorable: true,
    name: 'Cape',
    description: 'Hero cape',
    defaultColor: 0x222222,
    materialType: 'cape'
  },
  [PartCategory.BACKPACK]: {
    colorable: true,
    name: 'Backpack',
    description: 'Backpack or back equipment',
    defaultColor: 0x444444,
    materialType: 'equip'
  },
  [PartCategory.CHEST_BELT]: {
    colorable: true,
    name: 'Chest Belt',
    description: 'Belt that crosses the chest',
    defaultColor: 0x666666,
    materialType: 'belt'
  },
  [PartCategory.BELT]: {
    colorable: true,
    name: 'Belt',
    description: 'Main belt',
    defaultColor: 0x666666,
    materialType: 'belt'
  },
  [PartCategory.BUCKLE]: {
    colorable: true,
    name: 'Buckle',
    description: 'Belt buckle',
    defaultColor: 0xcccccc,
    materialType: 'equip'
  },
  [PartCategory.POUCH]: {
    colorable: true,
    name: 'Pouch',
    description: 'Pouch or bag',
    defaultColor: 0x8b6f4e,
    materialType: 'pouch'
  },
  [PartCategory.SHOULDERS]: {
    colorable: true,
    name: 'Shoulders',
    description: 'Shoulder protections',
    defaultColor: 0x666666,
    materialType: 'body'
  },
  [PartCategory.FOREARMS]: {
    colorable: true,
    name: 'Forearms',
    description: 'Forearm protections',
    defaultColor: 0x666666,
    materialType: 'body'
  },
  [PartCategory.BOOTS]: {
    colorable: true,
    name: 'Boots',
    description: 'Hero boots',
    defaultColor: 0x666666,
    materialType: 'boots'
  },
  [PartCategory.SYMBOL]: {
    colorable: true,
    name: 'Symbol',
    description: 'Hero symbol or emblem',
    defaultColor: 0x666666,
    materialType: 'symbol'
  },

};

// Predefined color palettes
export const colorPalettes = {
  classic: {
    primary: 0x0066cc,    // Classic blue
    secondary: 0xff6600,  // Orange
    accent: 0xffd700,     // Gold
    dark: 0x1a1a1a,       // Black
    light: 0xffffff       // White
  },
  modern: {
    primary: 0x00d4aa,    // Teal
    secondary: 0xff6b6b,  // Coral
    accent: 0x4ecdc4,     // Turquoise
    dark: 0x2c3e50,       // Dark blue
    light: 0xecf0f1       // Light gray
  },
  metallic: {
    primary: 0x7f8c8d,    // Silver
    secondary: 0xf39c12,  // Bronze
    accent: 0xf1c40f,     // Gold
    dark: 0x2c3e50,       // Steel
    light: 0xbdc3c7       // Aluminum
  },
  neon: {
    primary: 0x00ff88,    // Neon green
    secondary: 0xff0080,  // Neon pink
    accent: 0x00ffff,     // Neon cyan
    dark: 0x000000,       // Black
    light: 0xffffff       // White
  }
};

// Head material, based on MI_1021500_Head.json
export const headMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xfefefe, // BaseTint
  roughness: 0.0, // RoughnessPower
  metalness: 0.1, // SpecularMultiplier
  clearcoat: 0.4,
  clearcoatRoughness: 0.15,
  sheen: 0.3,
  sheenColor: 0xffffff,
  sheenRoughness: 0.2,
  reflectivity: 0.2,
});

// Metallic equipment material, based on MI_1021500_Equip_03.json
export const equipMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xcccccc, // ExtraSpecularTint
  roughness: 0.35, // ExtraSpecularRoughness
  metalness: 1.0,  // Metailic
  clearcoat: 0.3,
  reflectivity: 0.7,
});

// Rim light material (simulated, color only)
export const rimLightColor = 0x233f3e; // BackRimColor

// Body material (torso, legs, hands)
export const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x666666, // Neutral gray
  roughness: 0.35,
  metalness: 0.15,
  clearcoat: 0.6,
  clearcoatRoughness: 0.15,
  sheen: 0.4,
  sheenColor: 0xffffff,
  sheenRoughness: 0.3,
  transmission: 0.1,
  ior: 1.45,
  reflectivity: 0.25,
});

// Cape material
export const capeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x222222,
  roughness: 0.7,
  metalness: 0.05,
  sheen: 0.2,
});

// Specific material for boots
export const bootsMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x666666,
  roughness: 0.45,
  metalness: 0.3,
  clearcoat: 0.2,
  reflectivity: 0.2,
});

// Specific material for symbol
export const symbolMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x666666, // gray
  roughness: 0.18,
  metalness: 1.0,
  clearcoat: 0.4,
  reflectivity: 0.8,
});

// Specific material for belt
export const beltMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x666666, // gray
  roughness: 0.6,
  metalness: 0.2,
  clearcoat: 0.1,
  reflectivity: 0.15,
});

// Specific material for pouch (pockets)
export const pouchMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x8b6f4e, // light brown
  roughness: 0.65,
  metalness: 0.15,
  clearcoat: 0.08,
  reflectivity: 0.12,
});

// Specific material for weapons
export const weaponMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x666666, // metal gray
  roughness: 0.25,
  metalness: 0.8,
  clearcoat: 0.3,
  reflectivity: 0.6,
});

// Material for metals/accessories (buckle, chest, etc.)
export const metalMaterial = equipMaterial;

// Default material
export const defaultMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xaaaaaa,
  roughness: 0.5,
  metalness: 0.2,
});

// Helper to choose material based on path/category
export function getMaterialForPath(path: string): THREE.Material {
  // Create new materials instead of cloning to avoid texture issues
  if (/head/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0xfefefe,
      roughness: 0.3,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.1,
    });
  }
  if (/boots/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      roughness: 0.45,
      metalness: 0.3,
      clearcoat: 0.2,
      reflectivity: 0.2,
    });
  }
  if (/symbol/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666, // gray
      roughness: 0.18,
      metalness: 1.0,
      clearcoat: 0.4,
      reflectivity: 0.8,
    });
  }
  if (/belt(?!chest)/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666, // gray
      roughness: 0.6,
      metalness: 0.2,
      clearcoat: 0.1,
      reflectivity: 0.15,
    });
  }
  if (/pouch/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x8b6f4e, // light brown
      roughness: 0.65,
      metalness: 0.15,
      clearcoat: 0.08,
      reflectivity: 0.12,
    });
  }
  if (/equip|buckle|chest/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0xcccccc,
      roughness: 0.4,
      metalness: 0.6,
      clearcoat: 0.3,
      reflectivity: 0.4,
    });
  }
  if (/torso/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      roughness: 0.35,
      metalness: 0.15,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      sheen: 0.4,
      sheenColor: 0xffffff,
      sheenRoughness: 0.3,
      transmission: 0.1,
      ior: 1.45,
      reflectivity: 0.25,
    });
  }
  if (/legs|lower_body/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      roughness: 0.4,
      metalness: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      sheen: 0.25,
      sheenColor: 0xffffff,
      sheenRoughness: 0.5,
      transmission: 0.05,
      ior: 1.4,
      reflectivity: 0.25,
    });
  }
  if (/hand/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      roughness: 0.5,
      metalness: 0.2,
      clearcoat: 0.2,
      clearcoatRoughness: 0.1,
      sheen: 0.3,
      sheenColor: 0xffffff,
      sheenRoughness: 0.4,
      transmission: 0.05,
      ior: 1.4,
      reflectivity: 0.3,
    });
  }
  if (/shoulders/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      roughness: 0.3,
      metalness: 0.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.15,
      sheen: 0.2,
      sheenColor: 0xffffff,
      sheenRoughness: 0.4,
      ior: 1.6,
      reflectivity: 0.4,
    });
  }
  if (/forearms/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666,
      roughness: 0.35,
      metalness: 0.3,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      sheen: 0.15,
      sheenColor: 0xffffff,
      sheenRoughness: 0.5,
      ior: 1.5,
      reflectivity: 0.3,
    });
  }
  if (/cape/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x222222,
      roughness: 0.7,
      metalness: 0.05,
      clearcoat: 0.1,
      clearcoatRoughness: 0.2,
      sheen: 0.2,
      sheenColor: 0xffffff,
      sheenRoughness: 0.6,
      ior: 1.3,
      reflectivity: 0.1,
    });
  }
  if (/weapon/i.test(path)) {
    return new THREE.MeshPhysicalMaterial({
      color: 0x666666, // metal gray
      roughness: 0.25,
      metalness: 0.8,
      clearcoat: 0.3,
      reflectivity: 0.6,
    });
  }
  return new THREE.MeshPhysicalMaterial({
    color: 0xaaaaaa,
    roughness: 0.5,
    metalness: 0.2,
  });
}

// Function to create custom material with color
export function createCustomMaterial(baseMaterial: THREE.Material, color: number): THREE.Material {
  const customMaterial = baseMaterial.clone();
  if (customMaterial instanceof THREE.MeshPhysicalMaterial) {
    customMaterial.color.setHex(color);
  }
  return customMaterial;
}

// Function to apply color palette
export function applyColorPalette(material: THREE.Material, palette: keyof typeof colorPalettes, colorType: keyof typeof colorPalettes.classic): THREE.Material {
  const customMaterial = material.clone();
  if (customMaterial instanceof THREE.MeshPhysicalMaterial) {
    customMaterial.color.setHex(colorPalettes[palette][colorType]);
  }
  return customMaterial;
}

// Function to get colorable parts
export function getColorableParts() {
  return Object.entries(colorableParts)
    .filter(([_, config]) => config.colorable)
    .map(([category, config]) => ({
      category: category as PartCategory,
      ...config
    }));
}

// Function to check if a part is colorable
export function isPartColorable(category: PartCategory): boolean {
  return colorableParts[category]?.colorable || false;
} 