import { ArchetypeId, ArchetypeInfo, Faction, PhysicalAttributes, PartCompatibility, PartBonus, ArchetypeStats, SelectedParts, RPGCharacterSync } from '../types';
export type { ArchetypeInfo } from '../types';

// Datos completos de todos los tipos de personajes
export const ARCHETYPE_DATA: Record<ArchetypeId, ArchetypeInfo> = {
  // Tipos de personajes originales (mantener compatibilidad)
  [ArchetypeId.STRONG]: {
    id: ArchetypeId.STRONG,
    name: 'SENTINEL',
    title: 'THE POWERHOUSE',
    description: 'Raw strength and unbreakable defense',
    briefDescription: 'Super strength, flight, invulnerability',
    theme: 'Tank • Strength • Defense',
    colors: 'from-orange-500 to-red-600',
    bgColors: 'from-orange-500/20 to-red-600/20',
    icon: '💪',
    stats: { power: 95, defense: 90, speed: 60, intelligence: 70, energy: 75, charisma: 65 },
    abilities: {
      primary: 'Super Strength',
      secondary: 'Invulnerability',
      ultimate: 'Earthquake Slam',
      passive: 'Unbreakable Will'
    },
    famousExamples: ['Superman', 'Hulk', 'Thor'],
    associatedFactions: [Faction.POWERHOUSE, Faction.ETERNAL_DYNASTIES],
    prefix: 'strong',
    palette: 'orange-red',
    iconicPieces: 'muscular torso, heavy armor'
  },

  [ArchetypeId.JUSTICIERO]: {
    id: ArchetypeId.JUSTICIERO,
    name: 'PHANTOM',
    title: 'THE GUARDIAN',
    description: 'Justice and protection for all',
    briefDescription: 'Justice, protection, leadership',
    theme: 'Guardian • Justice • Protection',
    colors: 'from-blue-500 to-cyan-600',
    bgColors: 'from-blue-500/20 to-cyan-600/20',
    icon: '⚖️',
    stats: { power: 80, defense: 85, speed: 75, intelligence: 85, energy: 70, charisma: 90 },
    abilities: {
      primary: 'Justice Strike',
      secondary: 'Protective Aura',
      ultimate: 'Guardian\'s Call',
      passive: 'Inspiring Presence'
    },
    famousExamples: ['Captain America', 'Wonder Woman', 'Black Panther'],
    associatedFactions: [Faction.WARRIORS, Faction.GALACTIC_GUARDIANS],
    prefix: 'justiciero',
    palette: 'blue-cyan',
    iconicPieces: 'shield, cape, armor'
  },

  [ArchetypeId.SPEEDSTER]: {
    id: ArchetypeId.SPEEDSTER,
    name: 'BLITZ',
    title: 'THE FLASH',
    description: 'Lightning speed and agility',
    briefDescription: 'Super speed, hyper-reflexes',
    theme: 'Speed • Agility • Mobility',
    colors: 'from-yellow-400 to-amber-500',
    bgColors: 'from-yellow-400/20 to-amber-500/20',
    icon: '⚡',
    stats: { power: 70, defense: 60, speed: 98, intelligence: 75, energy: 80, charisma: 70 },
    abilities: {
      primary: 'Lightning Strike',
      secondary: 'Speed Force',
      ultimate: 'Time Warp',
      passive: 'Hyper Reflexes'
    },
    famousExamples: ['Flash', 'Quicksilver', 'Sonic'],
    associatedFactions: [Faction.SPEEDCORE],
    prefix: 'speedster',
    palette: 'yellow-amber',
    iconicPieces: 'lightning bolt, streamlined suit'
  },

  [ArchetypeId.MYSTIC]: {
    id: ArchetypeId.MYSTIC,
    name: 'ARCANE',
    title: 'THE SORCERER',
    description: 'Ancient magic and mystical powers',
    briefDescription: 'Magic, runes, summoning',
    theme: 'Magic • Wisdom • Mysticism',
    colors: 'from-purple-500 to-indigo-600',
    bgColors: 'from-purple-500/20 to-indigo-600/20',
    icon: '🔮',
    stats: { power: 88, defense: 70, speed: 75, intelligence: 95, energy: 90, charisma: 80 },
    abilities: {
      primary: 'Mystic Blast',
      secondary: 'Rune Shield',
      ultimate: 'Reality Warp',
      passive: 'Arcane Knowledge'
    },
    famousExamples: ['Doctor Strange', 'Scarlet Witch', 'Zatanna'],
    associatedFactions: [Faction.MYSTICS, Faction.TECHNOMANCERS, Faction.ARCANOTECH],
    prefix: 'mystic',
    palette: 'purple-indigo',
    iconicPieces: 'mystical symbols, robes, staff'
  },

  [ArchetypeId.TECH]: {
    id: ArchetypeId.TECH,
    name: 'GHOST',
    title: 'THE INVENTOR',
    description: 'Advanced technology and innovation',
    briefDescription: 'Creative technology use',
    theme: 'Technology • Intelligence • Innovation',
    colors: 'from-cyan-400 to-blue-500',
    bgColors: 'from-cyan-400/20 to-blue-500/20',
    icon: '🤖',
    stats: { power: 85, defense: 80, speed: 82, intelligence: 98, energy: 85, charisma: 75 },
    abilities: {
      primary: 'Tech Blast',
      secondary: 'Shield Generator',
      ultimate: 'Nanotech Swarm',
      passive: 'Technological Mastery'
    },
    famousExamples: ['Iron Man', 'Batman', 'Mr. Fantastic'],
    associatedFactions: [Faction.TECHNOMANCERS, Faction.ARCANOTECH, Faction.SPACE_EXILES],
    prefix: 'tech',
    palette: 'cyan-blue',
    iconicPieces: 'tech armor, gadgets, holograms'
  },

  // Nuevos tipos de personajes
  [ArchetypeId.PARAGON]: {
    id: ArchetypeId.PARAGON,
    name: 'TITAN',
    title: 'THE PERFECT HERO',
    description: 'The ultimate hero with balanced powers',
    briefDescription: 'Super strength, flight, invulnerability',
    theme: 'Heroism • Balance • Perfection',
    colors: 'from-red-500 to-blue-600',
    bgColors: 'from-red-500/20 to-blue-600/20',
    icon: '🦸',
    stats: { power: 90, defense: 85, speed: 85, intelligence: 80, energy: 85, charisma: 90 },
    abilities: {
      primary: 'Heroic Strike',
      secondary: 'Flight',
      ultimate: 'Paragon\'s Justice',
      passive: 'Inspiring Hero'
    },
    famousExamples: ['Superman', 'Captain Marvel', 'Wonder Woman'],
    associatedFactions: [Faction.POWERHOUSE, Faction.ETERNAL_DYNASTIES],
    prefix: 'paragon',
    palette: 'red-blue',
    iconicPieces: 'cape, symbol, heroic stance'
  },

  [ArchetypeId.ENERGY_PRO]: {
    id: ArchetypeId.ENERGY_PRO,
    name: 'ENERGY PRO',
    title: 'THE ENERGY MASTER',
    description: 'Master of energy manipulation',
    briefDescription: 'Fires energy: fire, plasma',
    theme: 'Energy • Power • Destruction',
    colors: 'from-orange-400 to-yellow-500',
    bgColors: 'from-orange-400/20 to-yellow-500/20',
    icon: '🔥',
    stats: { power: 85, defense: 70, speed: 80, intelligence: 75, energy: 95, charisma: 70 },
    abilities: {
      primary: 'Energy Blast',
      secondary: 'Plasma Shield',
      ultimate: 'Supernova',
      passive: 'Energy Absorption'
    },
    famousExamples: ['Cyclops', 'Human Torch', 'Storm'],
    associatedFactions: [Faction.GALACTIC_GUARDIANS, Faction.VOX, Faction.MYSTICS, Faction.ARCANOTECH],
    prefix: 'energy',
    palette: 'orange-yellow',
    iconicPieces: 'energy effects, glowing eyes, power aura'
  },

  [ArchetypeId.WEAPON_MASTER]: {
    id: ArchetypeId.WEAPON_MASTER,
    name: 'WEAPON MASTER',
    title: 'THE WARRIOR',
    description: 'Master of weapons and combat',
    briefDescription: 'Highly skilled in weapons',
    theme: 'Combat • Skill • Weapons',
    colors: 'from-gray-600 to-red-700',
    bgColors: 'from-gray-600/20 to-red-700/20',
    icon: '⚔️',
    stats: { power: 85, defense: 75, speed: 80, intelligence: 85, energy: 70, charisma: 75 },
    abilities: {
      primary: 'Weapon Mastery',
      secondary: 'Combat Reflexes',
      ultimate: 'Weapon Storm',
      passive: 'Combat Instinct'
    },
    famousExamples: ['Batman', 'Hawkeye', 'Black Widow'],
    associatedFactions: [Faction.WARRIORS, Faction.CRIMSON_LEGION, Faction.TECHNOMANCERS],
    prefix: 'weapon',
    palette: 'gray-red',
    iconicPieces: 'weapons, armor, combat gear'
  },

  [ArchetypeId.SHAPESHIFTER]: {
    id: ArchetypeId.SHAPESHIFTER,
    name: 'SHAPESHIFTER',
    title: 'THE CHANGELING',
    description: 'Master of biological adaptation',
    briefDescription: 'Biological adaptation, mutation',
    theme: 'Adaptation • Mutation • Change',
    colors: 'from-green-500 to-blue-600',
    bgColors: 'from-green-500/20 to-blue-600/20',
    icon: '🦎',
    stats: { power: 80, defense: 75, speed: 85, intelligence: 80, energy: 75, charisma: 85 },
    abilities: {
      primary: 'Shape Shift',
      secondary: 'Adaptive Form',
      ultimate: 'Perfect Mimic',
      passive: 'Regeneration'
    },
    famousExamples: ['Mystique', 'Beast Boy', 'Martian Manhunter'],
    associatedFactions: [Faction.ALPHA_MUTANTS, Faction.INFESTED],
    prefix: 'shapeshifter',
    palette: 'green-blue',
    iconicPieces: 'morphing effects, adaptive armor'
  },

  [ArchetypeId.MENTALIST]: {
    id: ArchetypeId.MENTALIST,
    name: 'MENTALIST',
    title: 'THE MIND READER',
    description: 'Master of psychic powers',
    briefDescription: 'Telepathy, mind control',
    theme: 'Psionics • Mind • Control',
    colors: 'from-pink-500 to-purple-600',
    bgColors: 'from-pink-500/20 to-purple-600/20',
    icon: '🧠',
    stats: { power: 70, defense: 65, speed: 75, intelligence: 95, energy: 90, charisma: 85 },
    abilities: {
      primary: 'Mind Blast',
      secondary: 'Telepathy',
      ultimate: 'Mass Control',
      passive: 'Mental Shield'
    },
    famousExamples: ['Jean Grey', 'Professor X', 'Emma Frost'],
    associatedFactions: [Faction.MIND_CUSTODIANS, Faction.PSIONICS],
    prefix: 'mentalist',
    palette: 'pink-purple',
    iconicPieces: 'psychic effects, mental aura'
  },

  [ArchetypeId.GADGETEER]: {
    id: ArchetypeId.GADGETEER,
    name: 'GADGETEER',
    title: 'THE INVENTOR',
    description: 'Master of gadgets and technology',
    briefDescription: 'Creative technology use',
    theme: 'Technology • Innovation • Gadgets',
    colors: 'from-cyan-400 to-blue-500',
    bgColors: 'from-cyan-400/20 to-blue-500/20',
    icon: '🔧',
    stats: { power: 75, defense: 80, speed: 70, intelligence: 95, energy: 85, charisma: 75 },
    abilities: {
      primary: 'Gadget Mastery',
      secondary: 'Tech Shield',
      ultimate: 'Gadget Storm',
      passive: 'Technological Genius'
    },
    famousExamples: ['Batman', 'Iron Man', 'Spider-Man'],
    associatedFactions: [Faction.TECHNOMANCERS, Faction.ARCANOTECH, Faction.SPACE_EXILES],
    prefix: 'gadgeteer',
    palette: 'cyan-blue',
    iconicPieces: 'gadgets, tech belt, utility items'
  },

  [ArchetypeId.MONSTER]: {
    id: ArchetypeId.MONSTER,
    name: 'MONSTER',
    title: 'THE BEAST',
    description: 'Raw power and primal fury',
    briefDescription: 'Raw power, claws, mutation',
    theme: 'Brute Force • Rage • Power',
    colors: 'from-red-600 to-black',
    bgColors: 'from-red-600/20 to-black/20',
    icon: '👹',
    stats: { power: 95, defense: 85, speed: 70, intelligence: 60, energy: 80, charisma: 50 },
    abilities: {
      primary: 'Rage Strike',
      secondary: 'Primal Roar',
      ultimate: 'Beast Mode',
      passive: 'Unstoppable Rage'
    },
    famousExamples: ['Hulk', 'Wolverine', 'Beast'],
    associatedFactions: [Faction.INFESTED, Faction.ALPHA_MUTANTS, Faction.NIHILISTS],
    prefix: 'monster',
    palette: 'red-black',
    iconicPieces: 'claws, fangs, monstrous form'
  },

  [ArchetypeId.ELEMENTAL]: {
    id: ArchetypeId.ELEMENTAL,
    name: 'ELEMENTAL',
    title: 'THE NATURE MASTER',
    description: 'Master of natural elements',
    briefDescription: 'Controls fire, earth, air, water',
    theme: 'Nature • Elements • Control',
    colors: 'from-green-500 to-blue-600',
    bgColors: 'from-green-500/20 to-blue-600/20',
    icon: '🌪️',
    stats: { power: 80, defense: 75, speed: 80, intelligence: 85, energy: 90, charisma: 75 },
    abilities: {
      primary: 'Elemental Blast',
      secondary: 'Elemental Shield',
      ultimate: 'Nature\'s Wrath',
      passive: 'Elemental Affinity'
    },
    famousExamples: ['Storm', 'Iceman', 'Human Torch'],
    associatedFactions: [Faction.CORE_ELEMENTALS],
    prefix: 'elemental',
    palette: 'green-blue',
    iconicPieces: 'elemental effects, nature symbols'
  },

  [ArchetypeId.CONSTRUCT]: {
    id: ArchetypeId.CONSTRUCT,
    name: 'CONSTRUCT',
    title: 'THE ARTIFICIAL',
    description: 'Artificial being with unique abilities',
    briefDescription: 'Artificial being: robot, AI',
    theme: 'Artificial • Technology • Evolution',
    colors: 'from-silver-400 to-gray-600',
    bgColors: 'from-silver-400/20 to-gray-600/20',
    icon: '🤖',
    stats: { power: 85, defense: 90, speed: 75, intelligence: 90, energy: 85, charisma: 70 },
    abilities: {
      primary: 'Tech Strike',
      secondary: 'Adaptive Armor',
      ultimate: 'System Override',
      passive: 'Technological Evolution'
    },
    famousExamples: ['Vision', 'Red Tornado', 'Ultron'],
    associatedFactions: [Faction.ARCANOTECH, Faction.GALACTIC_GUARDIANS],
    prefix: 'construct',
    palette: 'silver-gray',
    iconicPieces: 'robotic parts, tech armor, AI effects'
  },

  [ArchetypeId.BLASTER]: {
    id: ArchetypeId.BLASTER,
    name: 'BLASTER',
    title: 'THE RANGED FIGHTER',
    description: 'Master of long-range attacks',
    briefDescription: 'Long-range energy attacks',
    theme: 'Ranged • Energy • Precision',
    colors: 'from-yellow-400 to-orange-500',
    bgColors: 'from-yellow-400/20 to-orange-500/20',
    icon: '🎯',
    stats: { power: 75, defense: 65, speed: 80, intelligence: 80, energy: 90, charisma: 70 },
    abilities: {
      primary: 'Precision Blast',
      secondary: 'Energy Shield',
      ultimate: 'Barrage Storm',
      passive: 'Enhanced Accuracy'
    },
    famousExamples: ['Havok', 'Firestar', 'Cyclops'],
    associatedFactions: [Faction.VOX, Faction.ENERGY_CORE, Faction.PSIONICS],
    prefix: 'blaster',
    palette: 'yellow-orange',
    iconicPieces: 'energy weapons, targeting systems'
  },

  [ArchetypeId.TRICKSTER]: {
    id: ArchetypeId.TRICKSTER,
    name: 'TRICKSTER',
    title: 'THE DECEIVER',
    description: 'Master of illusions and deception',
    briefDescription: 'Illusions, traps, unpredictable',
    theme: 'Deception • Illusion • Chaos',
    colors: 'from-purple-500 to-pink-600',
    bgColors: 'from-purple-500/20 to-pink-600/20',
    icon: '🎭',
    stats: { power: 70, defense: 65, speed: 85, intelligence: 90, energy: 80, charisma: 90 },
    abilities: {
      primary: 'Illusion Mastery',
      secondary: 'Trap Setting',
      ultimate: 'Reality Distortion',
      passive: 'Master of Deception'
    },
    famousExamples: ['Riddler', 'Loki', 'Mysterio'],
    associatedFactions: [Faction.CRIMSON_LEGION, Faction.SPACE_EXILES],
    prefix: 'trickster',
    palette: 'purple-pink',
    iconicPieces: 'illusion effects, trick gadgets'
  },

  [ArchetypeId.CONTROLLER]: {
    id: ArchetypeId.CONTROLLER,
    name: 'CONTROLLER',
    title: 'THE BATTLEFIELD MASTER',
    description: 'Master of battlefield control',
    briefDescription: 'Controls battlefield, environment',
    theme: 'Control • Strategy • Domination',
    colors: 'from-blue-600 to-purple-700',
    bgColors: 'from-blue-600/20 to-purple-700/20',
    icon: '🎮',
    stats: { power: 75, defense: 80, speed: 70, intelligence: 95, energy: 90, charisma: 80 },
    abilities: {
      primary: 'Field Control',
      secondary: 'Environmental Manipulation',
      ultimate: 'Battlefield Domination',
      passive: 'Strategic Mastery'
    },
    famousExamples: ['Magneto', 'Iceman', 'Storm'],
    associatedFactions: [Faction.MIND_CUSTODIANS, Faction.NIHILISTS, Faction.PSIONICS],
    prefix: 'controller',
    palette: 'blue-purple',
    iconicPieces: 'control devices, field effects'
  },

  [ArchetypeId.SUMMONER]: {
    id: ArchetypeId.SUMMONER,
    name: 'SUMMONER',
    title: 'THE CONJURER',
    description: 'Master of summoning entities',
    briefDescription: 'Summons entities, shadow creatures',
    theme: 'Summoning • Entities • Dark Magic',
    colors: 'from-black to-purple-800',
    bgColors: 'from-black/20 to-purple-800/20',
    icon: '👻',
    stats: { power: 70, defense: 65, speed: 70, intelligence: 85, energy: 95, charisma: 75 },
    abilities: {
      primary: 'Entity Summon',
      secondary: 'Shadow Control',
      ultimate: 'Legion of Shadows',
      passive: 'Dark Pact'
    },
    famousExamples: ['Raven', 'Doctor Fate', 'Zatanna'],
    associatedFactions: [Faction.MYSTICS, Faction.ABYSSAL_CORRUPTED],
    prefix: 'summoner',
    palette: 'black-purple',
    iconicPieces: 'summoning circles, shadow effects'
  },

  [ArchetypeId.ANTIHERO]: {
    id: ArchetypeId.ANTIHERO,
    name: 'ANTIHERO',
    title: 'THE DARK PROTECTOR',
    description: 'Violent but effective protector',
    briefDescription: 'Violent, pragmatic, operative',
    theme: 'Violence • Pragmatism • Justice',
    colors: 'from-red-700 to-black',
    bgColors: 'from-red-700/20 to-black/20',
    icon: '⚔️',
    stats: { power: 85, defense: 80, speed: 80, intelligence: 85, energy: 75, charisma: 70 },
    abilities: {
      primary: 'Brutal Strike',
      secondary: 'Tactical Defense',
      ultimate: 'Unleashed Fury',
      passive: 'Combat Experience'
    },
    famousExamples: ['Punisher', 'Wolverine', 'Deadpool'],
    associatedFactions: [Faction.CRIMSON_LEGION, Faction.WARRIORS, Faction.SPACE_EXILES],
    prefix: 'antihero',
    palette: 'red-black',
    iconicPieces: 'weapons, tactical gear, dark armor'
  }
};

// 🎯 NUEVO: Atributos Físicos por Tipo de Personaje
export const ARCHETYPE_PHYSICAL_ATTRIBUTES: Record<ArchetypeId, PhysicalAttributes> = {
  [ArchetypeId.STRONG]: {
    build: 'muscular',
    height: 'tall',
    weight: 'heavy',
    stance: 'aggressive',
    movement: 'rigid'
  },
  [ArchetypeId.JUSTICIERO]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'erect',
    movement: 'fluid'
  },
  [ArchetypeId.SPEEDSTER]: {
    build: 'slim',
    height: 'average',
    weight: 'light',
    stance: 'casual',
    movement: 'bouncy'
  },
  [ArchetypeId.MYSTIC]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'mystical',
    movement: 'gliding'
  },
  [ArchetypeId.TECH]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'erect',
    movement: 'rigid'
  },
  [ArchetypeId.PARAGON]: {
    build: 'muscular',
    height: 'tall',
    weight: 'heavy',
    stance: 'erect',
    movement: 'fluid'
  },
  [ArchetypeId.ENERGY_PRO]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'aggressive',
    movement: 'fluid'
  },
  [ArchetypeId.WEAPON_MASTER]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'aggressive',
    movement: 'rigid'
  },
  [ArchetypeId.SHAPESHIFTER]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'casual',
    movement: 'fluid'
  },
  [ArchetypeId.MENTALIST]: {
    build: 'slim',
    height: 'average',
    weight: 'light',
    stance: 'mystical',
    movement: 'gliding'
  },
  [ArchetypeId.GADGETEER]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'erect',
    movement: 'rigid'
  },
  [ArchetypeId.MONSTER]: {
    build: 'heavy',
    height: 'tall',
    weight: 'massive',
    stance: 'aggressive',
    movement: 'rigid'
  },
  [ArchetypeId.ELEMENTAL]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'mystical',
    movement: 'gliding'
  },
  [ArchetypeId.CONSTRUCT]: {
    build: 'robotic',
    height: 'tall',
    weight: 'heavy',
    stance: 'robotic',
    movement: 'mechanical'
  },
  [ArchetypeId.BLASTER]: {
    build: 'slim',
    height: 'average',
    weight: 'light',
    stance: 'erect',
    movement: 'rigid'
  },
  [ArchetypeId.TRICKSTER]: {
    build: 'slim',
    height: 'average',
    weight: 'light',
    stance: 'casual',
    movement: 'bouncy'
  },
  [ArchetypeId.CONTROLLER]: {
    build: 'athletic',
    height: 'average',
    weight: 'medium',
    stance: 'mystical',
    movement: 'gliding'
  },
  [ArchetypeId.SUMMONER]: {
    build: 'slim',
    height: 'average',
    weight: 'light',
    stance: 'mystical',
    movement: 'gliding'
  },
  [ArchetypeId.ANTIHERO]: {
    build: 'muscular',
    height: 'tall',
    weight: 'heavy',
    stance: 'aggressive',
    movement: 'rigid'
  }
};

// 🎯 NUEVO: Compatibilidad de Partes por Tipo de Personaje
export const ARCHETYPE_PART_COMPATIBILITY: Partial<Record<ArchetypeId, PartCompatibility>> = {
  [ArchetypeId.STRONG]: {
    archetype: ArchetypeId.STRONG,
    physicalRequirements: {
      build: 'muscular',
      height: 'tall',
      weight: 'heavy'
    },
    statRequirements: {
      power: 80,
      defense: 80
    },
    recommendedParts: [
      'strong_torso_01', 'strong_torso_02', 'strong_torso_03',
      'strong_suit_torso_01_t01', 'strong_suit_torso_02_t01',
      'strong_legs_01', 'strong_legs_02', 'strong_legs_03'
    ],
         incompatibleParts: [
       'speedster_torso_01', 'mystic_torso_01', // Partes de otros tipos de personajes
       'slim_armor_01', 'light_gear_01' // Equipamiento ligero
     ],
    visualEffects: ['muscle_definition', 'heavy_armor_glow', 'power_aura']
  },
  [ArchetypeId.SPEEDSTER]: {
    archetype: ArchetypeId.SPEEDSTER,
    physicalRequirements: {
      build: 'slim',
      weight: 'light',
      movement: 'bouncy'
    },
    statRequirements: {
      speed: 80
    },
    recommendedParts: [
      'speedster_torso_01', 'speedster_legs_01',
      'light_armor_01', 'streamlined_suit_01'
    ],
    incompatibleParts: [
      'heavy_armor_01', 'bulky_gear_01', 'slow_movement_gear'
    ],
    visualEffects: ['speed_trails', 'lightning_effects', 'motion_blur']
  }
  // ... continuar con otros arquetipos
};

// 🎯 NUEVO: Bonificaciones de Partes Específicas
export const PART_BONUSES: Record<string, PartBonus> = {
  'strong_torso_01': {
    partId: 'strong_torso_01',
    statBonuses: {
      power: 5,
      defense: 3
    },
    abilityUnlocks: ['Super Strength', 'Unbreakable Will'],
    visualEnhancements: ['muscle_definition', 'power_aura'],
    restrictions: ['Requires STRONG archetype']
  },
  'speedster_legs_01': {
    partId: 'speedster_legs_01',
    statBonuses: {
      speed: 8,
      defense: 5
    },
    abilityUnlocks: ['Lightning Strike', 'Speed Force'],
    visualEnhancements: ['speed_trails', 'lightning_effects'],
    restrictions: ['Requires SPEEDSTER archetype']
  },
  'mystic_cape_01': {
    partId: 'mystic_cape_01',
    statBonuses: {
      energy: 5,
      charisma: 3
    },
    abilityUnlocks: ['Mystic Blast', 'Arcane Knowledge'],
    visualEnhancements: ['mystical_glow', 'floating_effects'],
    restrictions: ['Requires MYSTIC archetype']
  }
};

// Función para obtener tipo de personaje por ID
export function getArchetypeById(id: ArchetypeId): ArchetypeInfo {
  return ARCHETYPE_DATA[id];
}

// Función para obtener todos los tipos de personajes
export function getAllArchetypes(): ArchetypeInfo[] {
  return Object.values(ARCHETYPE_DATA);
}

// Convenience list export for components
export const ARCHETYPES_LIST: ArchetypeInfo[] = Object.values(ARCHETYPE_DATA);

// Función para obtener tipos de personajes por facción
export function getArchetypesByFaction(faction: Faction): ArchetypeInfo[] {
  return getAllArchetypes().filter(archetype => 
    archetype.associatedFactions.includes(faction)
  );
}

// Función para obtener estadísticas promedio de un tipo de personaje
export function getAverageStats(archetype: ArchetypeInfo): number {
  const stats = archetype.stats;
  return Math.round(
    (stats.power + stats.defense + stats.speed + stats.intelligence + stats.energy + stats.charisma) / 6
  );
} 

// 🎯 NUEVO: Funciones de Utilidad para Equipamiento

// Verificar compatibilidad de una parte con un tipo de personaje
export function isPartCompatibleWithArchetype(partId: string, archetypeId: ArchetypeId): boolean {
  const compatibility = ARCHETYPE_PART_COMPATIBILITY[archetypeId];
  if (!compatibility) return true; // Si no hay reglas específicas, es compatible
  
  // Verificar si está en la lista de incompatibles
  if (compatibility.incompatibleParts.includes(partId)) {
    return false;
  }
  
  // Verificar si está en la lista de recomendados
  if (compatibility.recommendedParts.includes(partId)) {
    return true;
  }
  
  return true; // Por defecto es compatible
}

// Obtener bonificaciones de estadísticas de una parte
export function getPartStatBonuses(partId: string): Partial<ArchetypeStats> {
  const bonus = PART_BONUSES[partId];
  return bonus ? bonus.statBonuses : {};
}

// Calcular estadísticas totales con bonificaciones de partes
export function calculateTotalStats(
  baseStats: ArchetypeStats, 
  selectedParts: string[]
): ArchetypeStats {
  const totalStats = { ...baseStats };
  
  selectedParts.forEach(partId => {
    const bonuses = getPartStatBonuses(partId);
    Object.entries(bonuses).forEach(([stat, bonus]) => {
      if (stat in totalStats) {
        totalStats[stat as keyof ArchetypeStats] += bonus;
      }
    });
  });
  
  return totalStats;
}

// Obtener efectos visuales recomendados para un tipo de personaje
export function getRecommendedVisualEffects(archetypeId: ArchetypeId): string[] {
  const compatibility = ARCHETYPE_PART_COMPATIBILITY[archetypeId];
  return compatibility ? compatibility.visualEffects : [];
}

// Obtener partes recomendadas para un tipo de personaje
export function getRecommendedParts(archetypeId: ArchetypeId): string[] {
  const compatibility = ARCHETYPE_PART_COMPATIBILITY[archetypeId];
  return compatibility ? compatibility.recommendedParts : [];
}

// Verificar si una combinación de partes es óptima
export function isOptimalPartCombination(
  selectedParts: string[], 
  archetypeId: ArchetypeId
): { isOptimal: boolean; score: number; suggestions: string[] } {
  const recommended = getRecommendedParts(archetypeId);
  const selected = new Set(selectedParts);
  const recommendedSet = new Set(recommended);
  
  // Calcular puntuación de compatibilidad
  let score = 0;
  const suggestions: string[] = [];
  
  selectedParts.forEach(partId => {
    if (recommendedSet.has(partId)) {
      score += 10; // Parte recomendada
    } else if (isPartCompatibleWithArchetype(partId, archetypeId)) {
      score += 5; // Parte compatible
    } else {
      score -= 5; // Parte incompatible
              suggestions.push(`Consider replacing ${partId} with a more compatible part`);
    }
  });
  
  // Sugerir partes faltantes
  recommended.forEach(partId => {
    if (!selected.has(partId)) {
              suggestions.push(`Consider adding ${partId} to optimize character type`);
    }
  });
  
  const isOptimal = score >= selectedParts.length * 8; // 80% de optimización
  
  return { isOptimal, score, suggestions };
}

// Generar personaje RPG basado en personalización
export function generateRPGCharacterFromCustomization(
  archetypeId: ArchetypeId,
  selectedParts: string[]
): {
  archetype: ArchetypeId;
  stats: ArchetypeStats;
  physicalAttributes: PhysicalAttributes;
  selectedParts: string[];
  compatibility: { isOptimal: boolean; score: number; suggestions: string[] };
  visualEffects: string[];
} {
  const baseStats = ARCHETYPE_DATA[archetypeId].stats;
  const totalStats = calculateTotalStats(baseStats, selectedParts);
  const physicalAttrs = ARCHETYPE_PHYSICAL_ATTRIBUTES[archetypeId];
  
  return {
    archetype: archetypeId,
    stats: totalStats,
    physicalAttributes: physicalAttrs,
    selectedParts,
    compatibility: isOptimalPartCombination(selectedParts, archetypeId),
    visualEffects: getRecommendedVisualEffects(archetypeId)
  };
} 

// 🎯 NUEVO: Función de Sincronización en Tiempo Real
export function syncRPGCharacterFromParts(
  archetypeId: ArchetypeId,
  selectedParts: SelectedParts,
  currentCharacter: RPGCharacterSync | null = null // Nuevo parámetro opcional
): RPGCharacterSync {
  const selectedPartIds = Object.values(selectedParts)
    .map(part => part?.id)
    .filter(Boolean);
  
  const baseStats = ARCHETYPE_DATA[archetypeId].stats;
  const calculatedStats = calculateTotalStats(baseStats, selectedPartIds);
  const physicalAttributes = ARCHETYPE_PHYSICAL_ATTRIBUTES[archetypeId];
  const compatibility = isOptimalPartCombination(selectedPartIds, archetypeId);
  const visualEffects = getRecommendedVisualEffects(archetypeId);
  
  // Determinar lastUpdated: si no hay cambios significativos, mantener la fecha existente
  const newLastUpdated = (
    currentCharacter && 
    !hasSignificantPartChanges(currentCharacter.selectedParts, selectedParts) &&
    currentCharacter.archetypeId === archetypeId
  ) ? currentCharacter.lastUpdated : new Date();

  return {
    archetypeId,
    selectedParts,
    calculatedStats,
    physicalAttributes,
    compatibility,
    visualEffects,
    lastUpdated: newLastUpdated
  };
}

// 🎯 NUEVO: Función para Detectar Cambios Significativos
export function hasSignificantPartChanges(
  oldParts: SelectedParts,
  newParts: SelectedParts
): boolean {
  const oldIds = Object.values(oldParts).map(part => part?.id).filter(Boolean).sort();
  const newIds = Object.values(newParts).map(part => part?.id).filter(Boolean).sort();
  
  if (oldIds.length !== newIds.length) return true;
  
  return oldIds.some((id, index) => id !== newIds[index]);
}

// 🎯 NUEVO: Función para Obtener Impacto de Cambio de Parte
export function getPartChangeImpact(
  oldPartId: string | null,
  newPartId: string | null,
  archetypeId: ArchetypeId
): {
  statChanges: Partial<ArchetypeStats>;
  compatibilityChange: number;
  newAbilities: string[];
  removedAbilities: string[];
} {
  const oldBonuses = oldPartId ? getPartStatBonuses(oldPartId) : {};
  const newBonuses = newPartId ? getPartStatBonuses(newPartId) : {};
  
  // Calcular cambios en estadísticas
  const statChanges: Partial<ArchetypeStats> = {};
  const allStats = ['power', 'defense', 'speed', 'intelligence', 'energy', 'charisma'] as const;
  
  allStats.forEach(stat => {
    const oldValue = oldBonuses[stat] || 0;
    const newValue = newBonuses[stat] || 0;
    if (oldValue !== newValue) {
      statChanges[stat] = newValue - oldValue;
    }
  });
  
  // Calcular cambio en compatibilidad
  const oldCompatible = oldPartId ? isPartCompatibleWithArchetype(oldPartId, archetypeId) : true;
  const newCompatible = newPartId ? isPartCompatibleWithArchetype(newPartId, archetypeId) : true;
  const compatibilityChange = (newCompatible ? 1 : -1) - (oldCompatible ? 1 : -1);
  
  // Obtener habilidades nuevas/removidas
  const oldAbilities = oldPartId ? PART_BONUSES[oldPartId]?.abilityUnlocks || [] : [];
  const newAbilities = newPartId ? PART_BONUSES[newPartId]?.abilityUnlocks || [] : [];
  
  return {
    statChanges,
    compatibilityChange,
    newAbilities: newAbilities.filter(ability => !oldAbilities.includes(ability)),
    removedAbilities: oldAbilities.filter(ability => !newAbilities.includes(ability))
  };
} 