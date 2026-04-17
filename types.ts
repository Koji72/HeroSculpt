export enum ArchetypeId {
  // Original character types (maintain compatibility)
  STRONG = 'STRONG',
  JUSTICIERO = 'JUSTICIERO',
  SPEEDSTER = 'SPEEDSTER',
  MYSTIC = 'MYSTIC',
  TECH = 'TECH',
  
  // New character types
  PARAGON = 'PARAGON',
  ENERGY_PRO = 'ENERGY_PRO',
  WEAPON_MASTER = 'WEAPON_MASTER',
  SHAPESHIFTER = 'SHAPESHIFTER',
  MENTALIST = 'MENTALIST',
  GADGETEER = 'GADGETEER',
  MONSTER = 'MONSTER',
  ELEMENTAL = 'ELEMENTAL',
  CONSTRUCT = 'CONSTRUCT',
  BLASTER = 'BLASTER',
  TRICKSTER = 'TRICKSTER',
  CONTROLLER = 'CONTROLLER',
  SUMMONER = 'SUMMONER',
  ANTIHERO = 'ANTIHERO',
}

// Facciones asociadas a los arquetipos
export enum Faction {
  POWERHOUSE = 'POWERHOUSE',
  ETERNAL_DYNASTIES = 'ETERNAL_DYNASTIES',
  GALACTIC_GUARDIANS = 'GALACTIC_GUARDIANS',
  VOX = 'VOX',
  MYSTICS = 'MYSTICS',
  ARCANOTECH = 'ARCANOTECH',
  WARRIORS = 'WARRIORS',
  CRIMSON_LEGION = 'CRIMSON_LEGION',
  TECHNOMANCERS = 'TECHNOMANCERS',
  ALPHA_MUTANTS = 'ALPHA_MUTANTS',
  INFESTED = 'INFESTED',
  MIND_CUSTODIANS = 'MIND_CUSTODIANS',
  PSIONICS = 'PSIONICS',
  SPEEDCORE = 'SPEEDCORE',
  SPACE_EXILES = 'SPACE_EXILES',
  CORE_ELEMENTALS = 'CORE_ELEMENTALS',
  ENERGY_CORE = 'ENERGY_CORE',
  NIHILISTS = 'NIHILISTS',
  ABYSSAL_CORRUPTED = 'ABYSSAL_CORRUPTED',
}

// Base statistics for archetypes
export interface ArchetypeStats {
  power: number;        // Physical strength and damage
  defense: number;      // Resistance and protection
  speed: number;        // Speed and agility
  intelligence: number; // Intelligence and strategy
  energy: number;       // Energy and special power
  charisma: number;     // Charisma and influence
}

// Special abilities for each archetype
export interface ArchetypeAbilities {
  primary: string;      // Primary ability
  secondary: string;    // Secondary ability
  ultimate: string;     // Ultimate ability
  passive: string;      // Passive ability
}

export interface ArchetypeInfo {
  id: ArchetypeId;
  name: string;
  title: string;
  description: string;
  briefDescription: string;
  theme: string;
  colors: string;
  bgColors: string;
  icon: string;
  stats: ArchetypeStats;
  abilities: ArchetypeAbilities;
  famousExamples: string[];
  associatedFactions: Faction[];
  prefix: string;
  palette: string;
  iconicPieces: string;
  iconNode?: React.ReactNode; // Renamed to avoid conflict
}

// 🎯 NEW: Physical Attributes System
export interface PhysicalAttributes {
  build: 'slim' | 'athletic' | 'muscular' | 'heavy' | 'robotic';
  height: 'short' | 'average' | 'tall' | 'giant';
  weight: 'light' | 'medium' | 'heavy' | 'massive';
  stance: 'erect' | 'casual' | 'aggressive' | 'mystical' | 'robotic';
  movement: 'fluid' | 'rigid' | 'bouncy' | 'gliding' | 'mechanical';
}

// 🎯 NEW: Part Compatibility System
export interface PartCompatibility {
  archetype: ArchetypeId;
  physicalRequirements: Partial<PhysicalAttributes>;
  statRequirements: Partial<ArchetypeStats>;
  recommendedParts: string[]; // IDs of recommended parts
  incompatibleParts: string[]; // IDs of incompatible parts
  visualEffects: string[]; // Applicable visual effects
}

// 🎯 NEW: Part Bonuses System
export interface PartBonus {
  partId: string;
  statBonuses: Partial<ArchetypeStats>;
  abilityUnlocks: string[]; // Abilities it unlocks
  visualEnhancements: string[]; // Visual enhancements
  restrictions: string[]; // Usage restrictions
}

export enum PartCategory {
  TORSO = 'TORSO',
  SUIT_TORSO = 'SUIT_TORSO',
  LOWER_BODY = 'LOWER_BODY',
  HEAD = 'HEAD',
  HAND_LEFT = 'HAND_LEFT',
  HAND_RIGHT = 'HAND_RIGHT',
  CAPE = 'CAPE',
  BACKPACK = 'BACKPACK',
  CHEST_BELT = 'CHEST_BELT',
  BELT = 'BELT',
  BUCKLE = 'BUCKLE',
  POUCH = 'POUCH',
  SHOULDERS = 'SHOULDERS',
  FOREARMS = 'FOREARMS',
  BOOTS = 'BOOTS',
  SYMBOL = 'SYMBOL',
}

export const ALL_PART_CATEGORIES: PartCategory[] = [
  PartCategory.TORSO,
  PartCategory.SUIT_TORSO,
  PartCategory.LOWER_BODY,
  PartCategory.HEAD,
  PartCategory.HAND_LEFT,
  PartCategory.HAND_RIGHT,
  PartCategory.CAPE,
  PartCategory.BACKPACK,
  PartCategory.CHEST_BELT,
  PartCategory.BELT,
  PartCategory.BUCKLE,
  PartCategory.POUCH,
  PartCategory.SHOULDERS,
  PartCategory.FOREARMS,
  PartCategory.BOOTS,
  PartCategory.SYMBOL,
];

export interface Part {
  id: string; // e.g., "strong_torso_01"
  name: string; // User-friendly name, e.g., "Strong Torso Alpha"
  category: PartCategory;
  archetype: ArchetypeId;
  gltfPath: string; // e.g., "/assets/strong/torso/strong_torso_01.glb"
  priceUSD: number;
  compatible: string[]; // List of IDs of parts this part is compatible with / depends on
  thumbnail: string; // URL to placeholder image
  attributes?: Record<string, any>; // e.g., { "side": "right", "hidden": true }
}

export type SelectedParts = { [category: string]: Part };

// 🎯 NEW: Real-time Synchronization System
export interface RPGCharacterSync {
  archetypeId: ArchetypeId;
  selectedParts: SelectedParts;
  calculatedStats: ArchetypeStats;
  physicalAttributes: PhysicalAttributes;
  compatibility: {
    isOptimal: boolean;
    score: number;
    suggestions: string[];
  };
  visualEffects: string[];
  lastUpdated: Date;
}

// 🎯 NEW: Callback for RPG Character Updates
export type RPGCharacterUpdateCallback = (character: RPGCharacterSync) => void;

// 🎯 NEW: Sidekick System
export enum SidekickType {
  PET = 'PET',
  ROBOT = 'ROBOT',
  ALLY = 'ALLY',
  FAMILIAR = 'FAMILIAR',
}

export enum SidekickSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum SidekickPosition {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  BEHIND = 'BEHIND',
  FLOATING = 'FLOATING',
}

export interface SidekickPart extends Part {
  companionType: SidekickType;
  size: SidekickSize;
  position: SidekickPosition;
  animations: string[];
  syncWithHero: boolean;
  stats?: ArchetypeStats; // Sidekick stats
}

// 🎯 NEW: Background System
export enum BackgroundType {
  TWO_D = '2D',
  THREE_D = '3D',
  HDR = 'HDR',
}

export enum LightingPreset {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
  DRAMATIC = 'DRAMATIC',
  MYSTICAL = 'MYSTICAL',
  URBAN = 'URBAN',
  NATURAL = 'NATURAL',
}

export enum WeatherType {
  CLEAR = 'CLEAR',
  RAIN = 'RAIN',
  FOG = 'FOG',
  STORM = 'STORM',
  SNOW = 'SNOW',
}

export interface BackgroundPart extends Part {
  type: BackgroundType;
  lightingPreset: LightingPreset;
  weather: WeatherType;
  customUpload?: boolean;
  hdrPath?: string;
  skyboxPath?: string;
}

// 🎯 NEW: Vehicle System
export enum VehicleType {
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
  HOVERBOARD = 'HOVERBOARD',
  SPACESHIP = 'SPACESHIP',
  JETPACK = 'JETPACK',
  FLYING_CARPET = 'FLYING_CARPET',
}

export enum VehicleSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum VehiclePosition {
  GROUND = 'GROUND',
  FLOATING = 'FLOATING',
  BACKGROUND = 'BACKGROUND',
}

export interface VehiclePart extends Part {
  vehicleType: VehicleType;
  size: VehicleSize;
  position: VehiclePosition;
  customization: {
    colors: string[];
    effects: string[];
    materials: string[];
  };
  animations: string[];
}

export enum ExtendedPartCategory {
  // Existing categories
  TORSO = 'TORSO',
  SUIT_TORSO = 'SUIT_TORSO',
  LOWER_BODY = 'LOWER_BODY',
  HEAD = 'HEAD',
  HAND_LEFT = 'HAND_LEFT',
  HAND_RIGHT = 'HAND_RIGHT',
  CAPE = 'CAPE',
  BACKPACK = 'BACKPACK',
  CHEST_BELT = 'CHEST_BELT',
  BELT = 'BELT',
  BUCKLE = 'BUCKLE',
  POUCH = 'POUCH',
  SHOULDERS = 'SHOULDERS',
  FOREARMS = 'FOREARMS',
  BOOTS = 'BOOTS',
  SYMBOL = 'SYMBOL',
  
  // New categories
  SIDEKICK = 'SIDEKICK',
  SIDEKICK_ACCESSORY = 'SIDEKICK_ACCESSORY',
  BACKGROUND = 'BACKGROUND',
  LIGHTING = 'LIGHTING',
  ATMOSPHERE = 'ATMOSPHERE',
  VEHICLE = 'VEHICLE',
  VEHICLE_ACCESSORY = 'VEHICLE_ACCESSORY',
}

// 🎯 NEW: Extended Scene Configuration
export interface ExtendedSceneConfig {
  character: {
    selectedParts: SelectedParts;
    archetype: ArchetypeId;
    name: string;
  };
  sidekick?: {
    part: SidekickPart;
    position: SidekickPosition;
    animations: string[];
  };
  background?: {
    part: BackgroundPart;
    lighting: LightingPreset;
    weather: WeatherType;
    customSettings?: {
      exposure: number;
      contrast: number;
      saturation: number;
    };
  };
  vehicle?: {
    part: VehiclePart;
    position: VehiclePosition;
    customization: {
      color: string;
      effects: string[];
      materials: string[];
    };
  };
}

// 🎯 NEW: Extended Export Options
export interface ExtendedExportOptions {
  includeSidekick: boolean;
  includeBackground: boolean;
  includeVehicle: boolean;
  format: 'glb' | 'stl' | 'obj';
  quality: 'low' | 'medium' | 'high';
  separateFiles: boolean;
}

// 🎯 NUEVOS TIPOS PARA EL CUARTEL GENERAL
export interface HeroIdea {
  name: string;
  backstory: string;
  visuals: {
    armorStyle: string;
    primaryColor: string;
    secondaryColor: string;
    accessories: string[];
  };
}

export interface HQStats {
  totalCharacters: number;
  totalPowerLevel: number;
  averageCompatibility: number;
  totalValue: number;
  recentActivity: number;
  achievements: number;
}

export interface HQCharacter {
  id: string;
  name: string;
  archetype: ArchetypeId;
  powerLevel: number;
  compatibility: number;
  lastModified: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  reward: {
    type: 'xp' | 'parts' | 'achievement';
    value: string | number;
  };
  requirements: {
    archetype?: ArchetypeId;
    minPowerLevel?: number;
    partsRequired?: string[];
  };
  isCompleted: boolean;
  progress: number;
}

export interface GalleryHero {
  id: number;
  name: string;
  creator: string;
  imageUrl: string;
  story: string;
  archetype: ArchetypeId;
  powerLevel: number;
}

// CartItem — shared between App.tsx and ShoppingCart.tsx
export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  thumbnail: string;
  quantity: number;
  configuration: SelectedParts;
  archetype: string;
}
