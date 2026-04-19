import React, { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

// import { colorPalettes, getColorableParts, isPartColorable } from './materials/materials'; // Removed unused imports
import { colorPalettes, LightingPreset, MaterialPreset } from './materials/materials'; // Corrected import for COLOR_PALETTES
import { PartCategory, SelectedParts } from '../types';
import { CharacterViewerRef } from './CharacterViewer'; // Import CharacterViewerRef

interface MaterialConfiguratorProps {
  characterViewerRef: React.RefObject<CharacterViewerRef | null>; // Changed from scene and renderer
  onMaterialChange?: (material: THREE.Material, partType: string) => void;
  onColorChange?: (palette: string, colorType: string, color: number, partCategory?: PartCategory) => void;
  selectedParts: SelectedParts;
  // onToggleEdgeDetection?: (selectedPart?: string) => void; // Removed: not used
  // edgeDetectionActive?: boolean; // Removed: not used
  onLightingChange?: (preset: LightingPreset | null) => void; 
  currentColors: { [key: string]: number }; // Add currentColors prop
  onLoadConfiguration: (parts: SelectedParts, modelName?: string) => void; // Add onLoadConfiguration prop
}

const MaterialConfigurator: React.FC<MaterialConfiguratorProps> = ({
  characterViewerRef, // New prop
  onMaterialChange,
  onColorChange,
  selectedParts,
  // onToggleEdgeDetection, // Removed
  // edgeDetectionActive = false, // Removed
  onLightingChange, // Destructure the new prop
  currentColors,
  onLoadConfiguration
}) => {
  const [activeTab, setActiveTab] = useState<'parts' | 'materials' | 'lighting' | 'export'>('parts'); // Added 'export' tab
  const [selectedPart, setSelectedPart] = useState<string>('TORSO');
  const [materialSettings, setMaterialSettings] = useState({
    color: '#b0b0b0',
    roughness: 0.5,
    metalness: 0.0,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    transmission: 0.0,
    ior: 1.5,
    sheen: 0.0,
    sheenColor: '#ffffff',
    sheenRoughness: 0.0,
    keyLightColor: '#ffffff',
    keyLightIntensity: 1.0,
    fillLightColor: '#aaaaaa',
    fillLightIntensity: 0.5,
    rimLightColor: '#ffffff',
    rimLightIntensity: 0.3,
  });

  // Estados para el sistema de colores
  // const [selectedColorPalette, setSelectedColorPalette] = useState('classic'); // Removed: not used
  // const [selectedColorType, setSelectedColorType] = useState('primary'); // Removed: not used

  // 🔧 OPTIMIZADO: Usar useMemo para evitar recrear presets en cada render
  const materialPresets: Record<string, MaterialPreset[]> = useMemo(() => ({
    TORSO: [
      {
        name: 'Soft Suit',
        description: 'Like soft cotton',
        icon: '👕',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x0066cc,
          roughness: 0.8,
          metalness: 0.0,
          clearcoat: 0.0,
        })
      },
      {
        name: 'Brilliant Metal',
        description: 'Like polished steel',
        icon: '⚙️',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xcccccc,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      },
      {
        name: 'Smooth Plastic',
        description: 'Like hard plastic',
        icon: '🔲',
        category: 'plastic',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x888888,
          roughness: 0.3,
          metalness: 0.0,
          clearcoat: 0.5,
        })
      },
      {
        name: 'Leather',
        description: 'Like real leather',
        icon: '🟫',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x8B4513,
          roughness: 0.7,
          metalness: 0.0,
          clearcoat: 0.2,
        })
      },
      {
        name: 'Crystal',
        description: 'Transparent and shiny',
        icon: '💎',
        category: 'special',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.0,
          metalness: 0.0,
          transmission: 0.8,
          ior: 1.5,
          clearcoat: 1.0,
        })
      }
    ],
    SUIT_TORSO: [
      {
        name: 'Hero Suit',
        description: 'Classic superhero suit',
        icon: '🦸‍♂️',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x0066cc,
          roughness: 0.6,
          metalness: 0.0,
          clearcoat: 0.3,
        })
      },
      {
        name: 'Metallic Armor',
        description: 'Shiny metallic armor',
        icon: '⚔️',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xcccccc,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.8,
        })
      },
      {
        name: 'Flexible Material',
        description: 'Modern flexible suit',
        icon: '🔲',
        category: 'plastic',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x666666,
          roughness: 0.4,
          metalness: 0.0,
          clearcoat: 0.6,
        })
      },
      {
        name: 'Tactical Gear',
        description: 'Military tactical suit',
        icon: '🟫',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.8,
          metalness: 0.0,
          clearcoat: 0.1,
        })
      }
    ],
    LOWER_BODY: [
      {
        name: 'Flexible Fabric',
        description: 'Comfortable leg fabric',
        icon: '👖',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x666666,
          roughness: 0.4,
          metalness: 0.2,
          clearcoat: 0.3,
          sheen: 0.25,
        })
      },
      {
        name: 'Armor Plates',
        description: 'Protective leg armor',
        icon: '🛡️',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x888888,
          roughness: 0.3,
          metalness: 0.4,
          clearcoat: 0.5,
        })
      },
      {
        name: 'Tactical Pants',
        description: 'Military tactical pants',
        icon: '🎽',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.6,
          metalness: 0.1,
          clearcoat: 0.2,
        })
      }
    ],
    HEAD: [
      {
        name: 'Natural Skin',
        description: 'Realistic skin texture',
        icon: '👤',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xf4d03f,
          roughness: 0.9,
          metalness: 0.0,
          clearcoat: 0.0,
        })
      },
      {
        name: 'Metallic Mask',
        description: 'Polished metal mask',
        icon: '🎭',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xcccccc,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      },
      {
        name: 'Transparent Crystal',
        description: 'Transparent visor',
        icon: '👁️',
        category: 'special',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.0,
          metalness: 0.0,
          transmission: 0.8,
          ior: 1.4,
        })
      }
    ],
    HAND_LEFT: [
      {
        name: 'Flexible Gloves',
        description: 'Comfortable hand fabric',
        icon: '✋',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x666666,
          roughness: 0.5,
          metalness: 0.2,
          clearcoat: 0.2,
          sheen: 0.3,
        })
      },
      {
        name: 'Metal Gauntlets',
        description: 'Protective metal gloves',
        icon: '🦾',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x888888,
          roughness: 0.3,
          metalness: 0.6,
          clearcoat: 0.4,
        })
      },
      {
        name: 'Tactical Gloves',
        description: 'Military tactical gloves',
        icon: '🎽',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.7,
          metalness: 0.1,
          clearcoat: 0.1,
        })
      }
    ],
    HAND_RIGHT: [
      {
        name: 'Flexible Gloves',
        description: 'Comfortable hand fabric',
        icon: '✋',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x666666,
          roughness: 0.5,
          metalness: 0.2,
          clearcoat: 0.2,
          sheen: 0.3,
        })
      },
      {
        name: 'Metal Gauntlets',
        description: 'Protective metal gloves',
        icon: '🦾',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x888888,
          roughness: 0.3,
          metalness: 0.6,
          clearcoat: 0.4,
        })
      },
      {
        name: 'Tactical Gloves',
        description: 'Military tactical gloves',
        icon: '🎽',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.7,
          metalness: 0.1,
          clearcoat: 0.1,
        })
      }
    ],
    CAPE: [
      {
        name: 'Soft Fabric',
        description: 'Natural fabric cape',
        icon: '🦇',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x8B4513,
          roughness: 0.9,
          metalness: 0.0,
          clearcoat: 0.0,
        })
      },
      {
        name: 'Bright Silk',
        description: 'Elegant silk cape',
        icon: '✨',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffd700,
          roughness: 0.2,
          metalness: 0.0,
          clearcoat: 0.8,
          sheen: 0.5,
        })
      },
      {
        name: 'Resistant Leather',
        description: 'Durable leather cape',
        icon: '🟫',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x654321,
          roughness: 0.8,
          metalness: 0.0,
          clearcoat: 0.1,
        })
      }
    ],
    BACKPACK: [
      {
        name: 'Tactical Pack',
        description: 'Military tactical backpack',
        icon: '🎒',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.6,
          metalness: 0.2,
          clearcoat: 0.3,
        })
      },
      {
        name: 'Metallic Pack',
        description: 'Shiny metallic backpack',
        icon: '⚙️',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x888888,
          roughness: 0.2,
          metalness: 0.8,
          clearcoat: 0.6,
        })
      }
    ],
    CHEST_BELT: [
      {
        name: 'Tactical Belt',
        description: 'Military chest belt',
        icon: '🛡️',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.6,
          metalness: 0.2,
          clearcoat: 0.3,
        })
      },
      {
        name: 'Golden Belt',
        description: 'Elegant golden chest belt',
        icon: '🥇',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffd700,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      }
    ],
    BELT: [
      {
        name: 'Natural Leather',
        description: 'Real leather belt',
        icon: '🟫',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x8B4513,
          roughness: 0.8,
          metalness: 0.0,
          clearcoat: 0.1,
        })
      },
      {
        name: 'Golden Metal',
        description: 'Golden metallic belt',
        icon: '🥇',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffd700,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      }
    ],
    BUCKLE: [
      {
        name: 'Classic Buckle',
        description: 'Traditional belt buckle',
        icon: '🔗',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xcccccc,
          roughness: 0.2,
          metalness: 0.8,
          clearcoat: 0.7,
        })
      },
      {
        name: 'Golden Buckle',
        description: 'Elegant golden buckle',
        icon: '🥇',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffd700,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      }
    ],
    POUCH: [
      {
        name: 'Leather Pouch',
        description: 'Natural leather pouch',
        icon: '👜',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x8b6f4e,
          roughness: 0.65,
          metalness: 0.15,
          clearcoat: 0.08,
        })
      },
      {
        name: 'Tactical Pouch',
        description: 'Military tactical pouch',
        icon: '🎒',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.7,
          metalness: 0.1,
          clearcoat: 0.2,
        })
      }
    ],
    SHOULDERS: [
      {
        name: 'Armor Shoulders',
        description: 'Protective shoulder armor',
        icon: '🛡️',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x666666,
          roughness: 0.3,
          metalness: 0.4,
          clearcoat: 0.5,
        })
      },
      {
        name: 'Tactical Shoulders',
        description: 'Military tactical shoulders',
        icon: '🎽',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.5,
          metalness: 0.2,
          clearcoat: 0.3,
        })
      }
    ],
    FOREARMS: [
      {
        name: 'Armor Forearms',
        description: 'Protective forearm armor',
        icon: '🛡️',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x666666,
          roughness: 0.35,
          metalness: 0.3,
          clearcoat: 0.4,
        })
      },
      {
        name: 'Tactical Forearms',
        description: 'Military tactical forearms',
        icon: '🎽',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x2d5016,
          roughness: 0.5,
          metalness: 0.2,
          clearcoat: 0.3,
        })
      }
    ],
    BOOTS: [
      {
        name: 'Classic Leather',
        description: 'Traditional leather boots',
        icon: '👢',
        category: 'fabric',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x8B4513,
          roughness: 0.7,
          metalness: 0.0,
          clearcoat: 0.2,
        })
      },
      {
        name: 'Polished Metal',
        description: 'Bright metallic boots',
        icon: '⚙️',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xcccccc,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      },
      {
        name: 'Modern Plastic',
        description: 'Modern plastic boots',
        icon: '🔲',
        category: 'plastic',
        material: new THREE.MeshPhysicalMaterial({
          color: 0x333333,
          roughness: 0.4,
          metalness: 0.0,
          clearcoat: 0.6,
        })
      }
    ],
    [PartCategory.SYMBOL]: [
      {
        name: 'Golden Classic',
        description: 'Bright golden symbol',
        icon: '⭐',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffd700,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      },
      {
        name: 'Silver Metallic',
        description: 'Elegant silver symbol',
        icon: '⚡',
        category: 'metal',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xffd700,
          roughness: 0.1,
          metalness: 1.0,
          clearcoat: 0.9,
        })
      },
      {
        name: 'Shiny Crystal',
        description: 'Transparent shiny crystal symbol',
        icon: '💎',
        category: 'special',
        material: new THREE.MeshPhysicalMaterial({
          color: 0xc0c0c0,
          roughness: 0.0,
          metalness: 0.0,
          transmission: 0.9,
          ior: 1.5,
        })
      }
    ],

  }), []); // 🔧 OPTIMIZADO: Dependencias vacías para evitar recreación

  useEffect(() => {
    return () => {
      Object.values(materialPresets).forEach(presets =>
        presets.forEach(p => p.material.dispose())
      );
    };
  }, [materialPresets]);

  // 🔧 OPTIMIZADO: Usar useMemo para evitar recálculos innecesarios
  const availableCategories = useMemo(() => {
    // Mostrar todas las categorías disponibles, no solo las seleccionadas
    const allCategories = [
      'TORSO',
      'SUIT_TORSO', 
      'LOWER_BODY',
      'HEAD',
      'HAND_LEFT',
      'HAND_RIGHT',
      'CAPE',
      'BACKPACK',
      'CHEST_BELT',
      'BELT',
      'BUCKLE',
      'POUCH',
      'SHOULDERS',
      'FOREARMS',
      'BOOTS',
      PartCategory.SYMBOL
    ];
    
    // Filtrar solo las que tienen materiales configurados
    const categoriesWithMaterials = allCategories.filter(category => 
      materialPresets[category] && materialPresets[category].length > 0
    );
    
    if (import.meta.env.DEV) {
      console.log('🎨 MaterialConfigurator - Available categories:', categoriesWithMaterials);
      console.log('🎨 MaterialConfigurator - Selected parts:', Object.keys(selectedParts || {}));
    }
    
    return categoriesWithMaterials;
  }, [selectedParts, selectedPart, materialPresets]);

  // 🔧 OPTIMIZADO: Usar useMemo para evitar recrear presets de iluminación
  const lightingPresets: LightingPreset[] = useMemo(() => [
    {
      name: 'Studio Neutral',
      description: 'Professional balanced lighting',
      icon: '📸',
      keyLight: { color: 0xffffff, intensity: 1.0, position: new THREE.Vector3(5, 10, 7.5) },
      fillLight: { color: 0xaaaaaa, intensity: 0.5, position: new THREE.Vector3(-5, 5, 5) },
      rimLight: { color: 0xffffff, intensity: 0.3, position: new THREE.Vector3(0, 10, -5) }
    },
    {
      name: 'Dramatic',
      description: 'Intense and contrasted lighting',
      icon: '🎭',
      keyLight: { color: 0xffd700, intensity: 1.2, position: new THREE.Vector3(8, 12, 5) },
      fillLight: { color: 0x444444, intensity: 0.2, position: new THREE.Vector3(-8, 8, 8) },
      rimLight: { color: 0xff6b6b, intensity: 0.4, position: new THREE.Vector3(0, 15, -8) }
    },
    {
      name: 'Soft',
      description: 'Warm and cozy lighting',
      icon: '☀️',
      keyLight: { color: 0xfff8dc, intensity: 0.8, position: new THREE.Vector3(3, 8, 6) },
      fillLight: { color: 0xffe4b5, intensity: 0.6, position: new THREE.Vector3(-3, 6, 4) },
      rimLight: { color: 0xffdab9, intensity: 0.2, position: new THREE.Vector3(0, 12, -3) }
    },
    {
      name: 'Neon',
      description: 'Cyberpunk and futuristic lighting',
      icon: '🌃',
      keyLight: { color: 0x00ff00, intensity: 1.0, position: new THREE.Vector3(10, 10, 0) },
      fillLight: { color: 0x0000ff, intensity: 0.7, position: new THREE.Vector3(-10, 8, 0) },
      rimLight: { color: 0xff00ff, intensity: 0.5, position: new THREE.Vector3(0, 15, -10) }
    },
    {
      name: 'Batman',
      description: 'Dark and mysterious lighting',
      icon: '🦇',
      keyLight: { color: 0x1a1a1a, intensity: 0.3, position: new THREE.Vector3(5, 15, 5) },
      fillLight: { color: 0x2a2a2a, intensity: 0.1, position: new THREE.Vector3(-5, 10, 5) },
      rimLight: { color: 0x000000, intensity: 0.0, position: new THREE.Vector3(0, 20, -5) }
    }
  ], []); // 🔧 OPTIMIZADO: Dependencias vacías para evitar recreación

  // 🔧 OPTIMIZADO: Usar useMemo para objetos estáticos
  const paletteNames = useMemo(() => ({
    classic: 'Classic',
    modern: 'Modern',
    metallic: 'Metallic',
    neon: 'Neon'
  }), []);

  const colorTypeNames = useMemo(() => ({
    primary: 'Primary',
    secondary: 'Secondary',
    accent: 'Accent',
    dark: 'Dark',
    light: 'Light'
  }), []);

  const partIcons = useMemo(() => ({
    TORSO: '🦸‍♂️',
    SUIT_TORSO: '👕',
    LOWER_BODY: '👖',
    HEAD: '👤',
    HAND_LEFT: '✋',
    HAND_RIGHT: '✋',
    CAPE: '🦇',
    BACKPACK: '🎒',
    CHEST_BELT: '🛡️',
    BELT: '🪖',
    BUCKLE: '🔗',
    POUCH: '👜',
    SHOULDERS: '💪',
    FOREARMS: '🦾',
    BOOTS: '👢',
    [PartCategory.SYMBOL]: '⭐'
  }), []);

  const partNames = useMemo(() => ({
    TORSO: 'Torso',
    SUIT_TORSO: 'Suit',
    LOWER_BODY: 'Legs',
    HEAD: 'Head & Mask',
    HAND_LEFT: 'Left Hand',
    HAND_RIGHT: 'Right Hand',
    CAPE: 'Cape',
    BACKPACK: 'Backpack',
    CHEST_BELT: 'Chest Belt',
    BELT: 'Belt',
    BUCKLE: 'Buckle',
    POUCH: 'Pouch',
    SHOULDERS: 'Shoulders',
    FOREARMS: 'Forearms',
    BOOTS: 'Boots',
    [PartCategory.SYMBOL]: 'Symbol'
  }), []);

  const applyMaterialPreset = (preset: MaterialPreset) => {
    // Actualizar el estado materialSettings con los valores del preset
    const material = preset.material as THREE.MeshPhysicalMaterial;
    setMaterialSettings(prev => ({
      ...prev,
      color: `#${material.color.getHexString()}`,
      roughness: material.roughness || 0.0,
      metalness: material.metalness || 0.0,
      clearcoat: material.clearcoat || 0.0,
      clearcoatRoughness: material.clearcoatRoughness || 0.0,
      transmission: material.transmission || 0.0,
      ior: material.ior || 1.5,
      sheen: material.sheen || 0.0,
      sheenColor: `#${(material.sheenColor?.getHexString() || 'ffffff')}`,
      sheenRoughness: material.sheenRoughness || 0.0,
    }));

    // 🔧 NUEVO: Aplicar el material inmediatamente al modelo 3D
    if (onMaterialChange) {
      if (import.meta.env.DEV) console.log(`🎨 MaterialConfigurator: Applying preset "${preset.name}" to ${selectedPart}`, {
        preset,
        selectedPart,
        materialProperties: {
          color: material.color.getHexString(),
          roughness: material.roughness,
          metalness: material.metalness,
          clearcoat: material.clearcoat
        }
      });
      onMaterialChange(material.clone(), selectedPart);
    }
  };

  const applyLightingPreset = (preset: LightingPreset) => {
    // Actualizar materialSettings para consistencia del estado interno
    setMaterialSettings(prev => ({
      ...prev,
      keyLightColor: `#${preset.keyLight.color.toString(16).padStart(6, '0')}`,
      keyLightIntensity: preset.keyLight.intensity,
      fillLightColor: `#${preset.fillLight.color.toString(16).padStart(6, '0')}`,
      fillLightIntensity: preset.fillLight.intensity,
      rimLightColor: `#${preset.rimLight.color.toString(16).padStart(6, '0')}`,
      rimLightIntensity: preset.rimLight.intensity,
    }));

    // Notificar al componente padre (MaterialPanel) sobre el cambio de iluminación
    if (onLightingChange) {
      onLightingChange(preset);
    }
  };

  const updateMaterial = () => {
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(materialSettings.color).getHex(),
      roughness: materialSettings.roughness,
      metalness: materialSettings.metalness,
      clearcoat: materialSettings.clearcoat,
      clearcoatRoughness: materialSettings.clearcoatRoughness,
      transmission: materialSettings.transmission,
      ior: materialSettings.ior,
      sheen: materialSettings.sheen,
      sheenColor: new THREE.Color(materialSettings.sheenColor).getHex(),
      sheenRoughness: materialSettings.sheenRoughness,
    });

    if (onMaterialChange) {
      onMaterialChange(material, selectedPart);
    } else {
      material.dispose();
    }
  };

  const handleColorSelect = (palette: string, colorType: string) => {
    const color = colorPalettes[palette as keyof typeof colorPalettes][colorType as keyof typeof colorPalettes.classic];
    const hexColor = `#${color.toString(16).padStart(6, '0')}`;
    
    setMaterialSettings(prev => ({ ...prev, color: hexColor }));
    
    if (onColorChange) {
      // Ensure selectedPart is a valid PartCategory
      const partCategory = selectedPart as PartCategory;
      if (import.meta.env.DEV) console.log(`🎨 MaterialConfigurator: handleColorSelect called`, {
        palette,
        colorType,
        color: color.toString(16),
        selectedPart,
        partCategory,
        partCategoryType: typeof partCategory
      });
      onColorChange(palette, colorType, color, partCategory);
    }
  };

  const tabStyle = (tab: string): React.CSSProperties => ({
    flex: 1,
    padding: '8px 4px',
    background: activeTab === tab ? 'var(--color-accent)' : 'transparent',
    color: activeTab === tab ? '#000' : 'var(--color-text-muted)',
    fontFamily: 'var(--font-comic)',
    fontSize: 11,
    letterSpacing: 1,
    border: 'none',
    borderBottom: activeTab === tab ? 'none' : '2px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'background 0.1s, color 0.1s',
  });

  const sectionStyle: React.CSSProperties = {
    background: 'var(--color-surface-2)',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    marginBottom: 8,
    overflow: 'hidden',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontFamily: 'var(--font-comic)',
    fontSize: 13,
    letterSpacing: 2,
    color: 'var(--color-accent)',
    borderBottom: '1px solid var(--color-border)',
    background: 'rgba(245,158,11,0.06)',
  };

  const sectionBodyStyle: React.CSSProperties = { padding: '10px 12px' };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    color: 'var(--color-text-muted)',
    marginBottom: 4,
    fontFamily: 'var(--font-body)',
  };

  const valueStyle: React.CSSProperties = { fontSize: 11, color: 'var(--color-text-faint)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', flexShrink: 0, borderBottom: '2px solid var(--color-border)' }}>
        {(['parts', 'materials', 'lighting', 'export'] as const).map(tab => (
          <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab === 'parts' ? '🦸 PARTS' : tab === 'materials' ? '🎨 MAT' : tab === 'lighting' ? '💡 LIGHT' : '💾 EXPORT'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>

        {/* PARTS */}
        {activeTab === 'parts' && (
          <div>
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>SELECT BODY PART</div>
              <div style={{ ...sectionBodyStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {availableCategories.map((category) => {
                  const isSelected = selectedPart === category;
                  const hasPart = !!(selectedParts[category] && selectedParts[category].gltfPath);
                  return (
                    <button key={category} onClick={() => setSelectedPart(category)} style={{
                      padding: '8px 10px',
                      background: isSelected ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                      border: isSelected ? '2px solid var(--color-accent)' : hasPart ? '2px solid rgba(34,197,94,0.4)' : '2px solid var(--color-border)',
                      borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{partIcons[category as keyof typeof partIcons] || '🦸'}</span>
                        <div>
                          <div style={{ fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1, color: isSelected ? 'var(--color-accent)' : 'var(--color-text)', lineHeight: 1.2 }}>
                            {partNames[category as keyof typeof partNames] || category}
                          </div>
                          <div style={{ fontSize: 10, color: hasPart ? 'var(--color-success)' : 'var(--color-text-faint)', marginTop: 2 }}>
                            {hasPart ? selectedParts[category]?.name : 'Not equipped'}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {selectedPart && (
              <div style={sectionStyle}>
                <div style={sectionHeaderStyle}>{partIcons[selectedPart as keyof typeof partIcons]} CURRENT: {partNames[selectedPart as keyof typeof partNames] || selectedPart}</div>
                <div style={{ ...sectionBodyStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text)', fontWeight: 600 }}>{selectedParts[selectedPart]?.name || 'No part equipped'}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{selectedParts[selectedPart]?.gltfPath ? 'Ready to customize' : 'Select a part first'}</div>
                  </div>
                  <span style={{ padding: '2px 8px', border: '1.5px solid', borderColor: selectedParts[selectedPart]?.gltfPath ? 'var(--color-success)' : 'var(--color-border-strong)', color: selectedParts[selectedPart]?.gltfPath ? 'var(--color-success)' : 'var(--color-text-faint)', borderRadius: 'var(--radius)', fontSize: 10, fontFamily: 'var(--font-comic)', letterSpacing: 1 }}>
                    {selectedParts[selectedPart]?.gltfPath ? 'ACTIVE' : 'EMPTY'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MATERIALS */}
        {activeTab === 'materials' && (
          <div>
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>MATERIAL PRESETS — {partNames[selectedPart as keyof typeof partNames] || selectedPart}</div>
              <div style={sectionBodyStyle}>
                {['fabric', 'metal', 'plastic', 'special'].map((category) => {
                  const categoryPresets = materialPresets[selectedPart]?.filter(p => p.category === category) || [];
                  if (categoryPresets.length === 0) return null;
                  return (
                    <div key={category} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: 'var(--color-text-faint)', fontFamily: 'var(--font-comic)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{category}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {categoryPresets.map((preset) => (
                          <button key={preset.name} onClick={() => applyMaterialPreset(preset)}
                            style={{ padding: '8px 12px', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
                            onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                            onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                            <span style={{ fontSize: 18 }}>{preset.icon}</span>
                            <div>
                              <div style={{ fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1, color: 'var(--color-text)' }}>{preset.name}</div>
                              <div style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>{preset.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>🌈 COLOR PALETTES</div>
              <div style={sectionBodyStyle}>
                {Object.entries(colorPalettes).map(([paletteKey, palette]) => (
                  <div key={paletteKey} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1, color: 'var(--color-text)' }}>{paletteNames[paletteKey as keyof typeof paletteNames]}</span>
                      <span style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>{Object.keys(palette).length} colors</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {Object.entries(palette).map(([colorKey, color]) => {
                        const hexColor = `#${color.toString(16).padStart(6, '0')}`;
                        return (
                          <button key={colorKey} onClick={() => handleColorSelect(paletteKey, colorKey)}
                            title={`${colorTypeNames[colorKey as keyof typeof colorTypeNames]} — ${hexColor}`}
                            style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--color-border-strong)', backgroundColor: hexColor, cursor: 'pointer' }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border-strong)'; e.currentTarget.style.transform = 'scale(1)'; }} />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>🎨 CUSTOM COLOR</div>
              <div style={sectionBodyStyle}>
                <input type="color"
                  style={{ width: '100%', height: 48, border: '2px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                  onChange={(e) => { const color = parseInt(e.target.value.replace('#', ''), 16); if (onColorChange) onColorChange('custom', 'custom', color, selectedPart as PartCategory); }} />
                <p style={{ fontSize: 10, color: 'var(--color-text-faint)', textAlign: 'center', marginTop: 6 }}>Custom color for {partNames[selectedPart as keyof typeof partNames] || selectedPart}</p>
              </div>
            </div>

            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>⚙️ ADVANCED PROPERTIES</div>
              <div style={sectionBodyStyle}>
                {(['roughness','metalness','clearcoat','clearcoatRoughness','transmission','ior','sheen','sheenRoughness'] as const).map((key) => (
                  <div key={key} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <label style={labelStyle}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
                      <span style={valueStyle}>{(materialSettings[key] as number).toFixed(2)}</span>
                    </div>
                    <input type="range" min={key === 'ior' ? 1 : 0} max={key === 'ior' ? 2.5 : 1} step={0.01}
                      value={materialSettings[key] as number}
                      onChange={(e) => setMaterialSettings(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                      style={{ width: '100%', accentColor: 'var(--color-accent)' }} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>SHEEN COLOR</label>
                  <input type="color" value={materialSettings.sheenColor}
                    onChange={(e) => setMaterialSettings(prev => ({ ...prev, sheenColor: e.target.value }))}
                    style={{ width: '100%', height: 36, border: '2px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LIGHTING */}
        {activeTab === 'lighting' && (
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>💡 LIGHTING PRESETS</div>
            <div style={{ ...sectionBodyStyle, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {lightingPresets.map((preset) => (
                <button key={preset.name} onClick={() => applyLightingPreset(preset)}
                  style={{ padding: '10px 12px', background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                  <span style={{ fontSize: 20 }}>{preset.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-comic)', fontSize: 13, letterSpacing: 1, color: 'var(--color-text)' }}>{preset.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>{preset.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EXPORT */}
        {activeTab === 'export' && (
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>💾 EXPORT CONFIGURATION</div>
            <div style={sectionBodyStyle}>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12 }}>Export the current material configuration for the selected part.</p>
              <button onClick={() => onLoadConfiguration(selectedParts)} className="btn-comic btn-primary" style={{ width: '100%' }}>EXPORT CONFIGURATION</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MaterialConfigurator; 