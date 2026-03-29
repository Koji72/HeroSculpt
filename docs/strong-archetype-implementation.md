# Strong Archetype Implementation

## Overview

The Strong archetype has been fully implemented following the project's documentation patterns and best practices. This document outlines the implementation details, features, and technical specifications.

## 🎯 **Archetype Characteristics**

### Visual Identity
- **Palette**: Red, steel gray (following documentation)
- **Role**: Tank character with heavy armor
- **Iconic Pieces**: Gauntlets, short cape, heavy armor
- **Theme**: Strength, resilience, and powerful presence

### Material Properties
```typescript
// Strong archetype material palette
{
  color: 0x8B0000,        // Dark red base
  roughness: 0.7,         // Semi-rough surface
  metalness: 0.3,         // Metallic appearance
  clearcoat: 0.4,         // Protective coating
  clearcoatRoughness: 0.2, // Smooth clearcoat
  sheen: 0.3,             // Subtle sheen
  sheenColor: 0x696969,   // Steel gray sheen
  emissive: 0x2F2F2F,     // Dark emissive
  emissiveIntensity: 0.05 // Low glow
}
```

## 🏗️ **Technical Implementation**

### Cache System
- **ModelCache Class**: Efficient caching of 3D models
- **Loading Promises**: Prevents duplicate loading requests
- **Memory Management**: Automatic cleanup and optimization
- **Performance Tracking**: Real-time load time monitoring

### Lighting Setup
```typescript
// Strong archetype lighting
const keyLight = new THREE.DirectionalLight(0xff6b35, 1.2);    // Orange-red key
const fillLight = new THREE.DirectionalLight(0x696969, 0.6);   // Steel gray fill
const rimLight = new THREE.DirectionalLight(0x8B0000, 0.8);    // Dark red rim
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);    // Ambient
```

### Post-Processing Effects
- **Bloom Effect**: Enhanced for Strong archetype (0.2 strength, 0.5 radius)
- **Shadow Mapping**: PCFSoftShadowMap for realistic shadows
- **Anti-aliasing**: Enabled for smooth rendering

## 📁 **File Structure**

### Models Organization
```
public/assets/strong/
├── Base/
│   └── strong_base_01.glb
├── torso/
│   ├── strong_torso_01.glb
│   ├── strong_torso_02.glb
│   └── strong_torso_03.glb
├── suit_torsos/
│   ├── strong_suit_torso_01.glb
│   ├── strong_suit_torso_02.glb
│   └── strong_suit_torso_04.glb
├── legs/
│   ├── strong_legs_01.glb
│   ├── strong_legs_02.glb
│   ├── strong_legs_03.glb
│   ├── strong_legs_04.glb
│   ├── strong_legs_05.glb
│   └── strong_legs_06.glb
├── boots/
│   ├── strong_boots_01_p01_p05.glb
│   ├── strong_boots_02_p02_p06.glb
│   ├── strong_boots_03_p03.glb
│   └── strong_boots_04_p04.glb
├── head/
│   ├── strong_head_01.glb
│   ├── strong_head_02.glb
│   ├── strong_head_03.glb
│   └── strong_head_04.glb
├── hands/
│   ├── strong_hand_left_openglove_01.glb
│   ├── strong_hand_right_openglove_01.glb
│   ├── strong_hand_left_gloved_fist_01.glb
│   ├── strong_hand_right_gloved_fist_01.glb
│   ├── strong_hand_left_gloved_pistol_01.glb
│   └── strong_hand_right_gloved_pistol_01.glb
├── cape/
│   ├── strong_cape_01_t01.glb
│   ├── strong_cape_02.glb
│   ├── strong_cape_03.glb
│   └── strong_cape_04.glb
├── beltchest/
│   └── strong_beltchest_01.glb
├── buckle/
│   ├── strong_buckle_01.glb
│   ├── strong_buckle_02.glb
│   ├── strong_buckle_03.glb
│   ├── strong_buckle_04.glb
│   ├── strong_buckle_05.glb
│   └── strong_buckle_06.glb
├── pouch/
│   ├── strong_pouch_01.glb
│   ├── strong_pouch_02.glb
│   ├── strong_pouch_03.glb
│   ├── strong_pouch_04.glb
│   ├── strong_pouch_05.glb
│   └── strong_pouch_06.glb
└── symbol/
    ├── strong_symbol_01.glb
    ├── strong_symbol_02.glb
    ├── strong_symbol_03.glb
    ├── strong_symbol_04.glb
    ├── strong_symbol_05.glb
    └── strong_symbol_none_01.glb
```

## 💰 **Pricing Strategy**

Following the documentation's pricing guidelines:

| Category | Price Range | Examples |
|----------|-------------|----------|
| **Torso Base** | $1.50 - $1.70 | Independent base pieces |
| **Suit Torso** | $0.80 - $0.90 | Dependent on torso base |
| **Legs** | $1.00 - $1.50 | Independent pieces |
| **Head** | $1.20 - $1.35 | Dependent on torso |
| **Boots** | $0.75 | Dependent on legs |
| **Hands** | $0.50 - $0.60 | With/without gloves, weapons |
| **Cape** | $0.80 - $0.95 | Dependent on torso |
| **Accessories** | $0.10 - $0.50 | Buckles, pouches, symbols |
| **Base** | $0.25 | Foundation piece |

**Target Total**: ≤ $6.00 USD per complete Strong character

## 🔗 **Compatibility System**

### Torso and Suit Structure
The Strong archetype implements a **two-tier torso system**:

1. **Torso Base** (`PartCategory.TORSO`):
   - Independent pieces that serve as the foundation
   - Examples: `strong_torso_01`, `strong_torso_02`, `strong_torso_03`
   - No dependencies, can be selected freely

2. **Suit Torso** (`PartCategory.SUIT_TORSO`):
   - Dependent pieces that overlay the torso base
   - Examples: `strong_suit_torso_01_t01`, `strong_suit_torso_02_t01`
   - Must be compatible with the selected torso base
   - Follow naming convention: `{arquetipo}_suit_torso_{variante}_t{torsoXX}`

### Dependencies
- **Torso-dependent**: Head, hands, cape, symbols, suit_torso
- **Legs-dependent**: Boots
- **Independent**: Torso base, legs, belt, buckles, pouches

### Compatibility Matrix
```typescript
// Torso base compatibility
{
  'strong_torso_01': [], // Independent
  'strong_torso_02': [], // Independent
  'strong_torso_03': [], // Independent
}

// Suit torso compatibility
{
  'strong_suit_torso_01_t01': ['strong_torso_01'],
  'strong_suit_torso_02_t01': ['strong_torso_01'],
  'strong_suit_torso_04_t01': ['strong_torso_01'],
}

// Other parts compatibility
{
  'strong_head_01': ['strong_torso_01', 'strong_torso_02', 'strong_torso_03'],
  'strong_boots_01': ['strong_legs_01', 'strong_legs_05'],
  'strong_cape_01': ['strong_torso_01'], // Specific torso dependency
  'strong_symbol_01': ['strong_torso_01', 'strong_torso_02', 'strong_torso_03']
}
```

## 🎮 **User Experience Features**

### Cache Information Display
- **Real-time cache size**: Shows number of cached models
- **Loading status**: Visual indicator during model loading
- **Performance metrics**: Last load time display
- **Position**: Fixed bottom-right corner

### Visual Feedback
- **Loading animation**: Pulse effect during model loading
- **Status indicators**: Green (ready) / Orange (loading)
- **Performance tracking**: Millisecond precision timing

## 🚀 **Performance Optimizations**

### Caching Benefits
- **First load**: Models cached for subsequent use
- **Duplicate prevention**: Loading promises prevent redundant requests
- **Memory efficiency**: Automatic cleanup and optimization
- **Speed improvement**: Subsequent loads use cached models

### Rendering Optimizations
- **DRACO compression**: Reduced file sizes
- **Shadow optimization**: High-quality shadow mapping
- **Material optimization**: Efficient material application
- **Scene management**: Proper cleanup and disposal

## 📊 **Implementation Statistics**

### Current Parts Count
- **Torso Base**: 3 variants
- **Suit Torso**: 3 variants (for torso 01)
- **Legs**: 6 variants
- **Boots**: 4 variants
- **Heads**: 4 variants
- **Hands**: 6 variants (left/right, gloved/ungloved, weapons)
- **Capes**: 4 variants
- **Buckles**: 6 variants
- **Pouches**: 6 variants
- **Symbols**: 6 variants (including "none" option)

**Total**: 48+ unique parts for Strong archetype

### File Naming Convention
Following the established pattern:
```
{arquetipo}_{categoria}_{variante}[_t{torsoXX}][_p{piernasXX}][{sufijos}].glb
```

Examples:
- `strong_torso_01.glb` (torso base)
- `strong_suit_torso_01_t01.glb` (suit for torso 01)
- `strong_cape_01_t01.glb` (cape for torso 01)
- `strong_hand_left_gloved_fist_01.glb` (hand with attributes)

## 🔧 **Technical Requirements**

### Dependencies
- Three.js r170+
- DRACO decoder
- GLTFLoader
- React 18+
- TypeScript

### Browser Support
- WebGL 2.0 compatible browsers
- Modern ES6+ support
- Hardware acceleration recommended

## 📝 **Future Enhancements**

### Planned Features
- **Animation support**: Idle animations for Strong character
- **Texture variations**: Multiple color schemes
- **LOD system**: Level of detail optimization
- **Export functionality**: STL generation for 3D printing

### Scalability
- **Modular design**: Easy to add new parts
- **Cache expansion**: Support for multiple archetypes
- **Performance monitoring**: Advanced metrics and analytics

## ✅ **Recent Corrections**

### Torso and Suit Structure
- **Added SUIT_TORSO category**: Properly separated from TORSO base
- **Corrected naming conventions**: Following documentation patterns
- **Fixed dependencies**: Suit torsos now properly depend on torso base
- **Updated compatibility**: All parts correctly reference compatible torsos

### Naming Convention Compliance
- **Torso base**: `strong_torso_XX.glb` (independent)
- **Suit torso**: `strong_suit_torso_XX_t01.glb` (dependent on torso 01)
- **Dependent parts**: Include `_t01` suffix when specific to torso

---

*This implementation follows the project's documentation patterns and serves as a reference for future archetype development.* 