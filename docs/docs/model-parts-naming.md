# Model Parts Naming Convention

## Overview
This document explains the naming convention used for 3D model parts in the Superhero Customizer project.

## Basic Structure
```
[archetype]_[part]_[number]_[dependencies]_[variant].glb
```

## Components

### 1. Archetype (Prefix)
- `strong` - Strong archetype
- `agile` - Agile archetype
- `magic` - Magic archetype
- `tech` - Tech archetype
- `justicier` - Justicier archetype

### 2. Parts
- `torso` - Basic torso
- `suit_torso` - Suit torso
- `legs` - Legs
- `head` - Head
- `hands` - Hands
- `cape` - Cape
- `symbol` - Symbol
- `belt` - Belt (independent)
- `beltchest` - Belt/Chest (torso dependent)
- `buckle` - Buckle
- `pouch` - Pouch (small accessory/pocket)
- `elbow` - Elbow
- `base` - Base
- `bands` - Bands (leg/arm accessories)
- `cylinder`/`none` - Placeholder/empty object for menu slots

### 3. Numbers
- Always two digits: `01`, `02`, `03`, etc.
- Start at 01
- Don't skip numbers

### 4. Dependencies
- `t01`, `t02`, `t03`, etc. - For torso-dependent parts
- `l01`, `l02`, `l03`, etc. - For leg-dependent parts
- `p01_p05`, `p02_p06`, etc. - For boots compatibility with multiple legs
- Optional for independent parts

### 5. Variants
- `_l` - Left side
- `_r` - Right side
- `_pair` - Boots exported together
- `_g` - With glove
- `_ng` - Without glove
- `_nc` - No cape
- `_ns` - No symbol
- `_nt` - No torsosuit
- `_np` - No pocketbelt
- `_none`/`none` - Empty/placeholder (for menu slots)
- `_lod{n}` - Level of detail
- `_v{mm}` - Major-minor version

### 6. Boots Compatibility Format
For boots files, the naming includes compatibility information:
- `p01_p05` - Compatible with legs 01 and 05 (Standard group)
- `p02_p06` - Compatible with legs 02 and 06 (Armored group)
- `p03` - Compatible with legs 03 (Standard group)
- `p04` - Compatible with legs 04 (Armored group)

This format indicates which legs the boots are compatible with, allowing for group-based compatibility rather than 1-to-1 relationships.

## Part Categories

### Main Categories
1. `TORSO` (Torso)
2. `LOWER_BODY` (Legs)
3. `HEAD` (Head)
4. `HAND_LEFT` (Left Hand)
5. `HAND_RIGHT` (Right Hand)
6. `CAPE` (Cape)
7. `BACKPACK` (Backpack)
8. `CHEST_BELT` (Accessories)
9. `BELT` (Belt)
10. `BUCKLE` (Buckle)
11. `POUCH` (Pouch)
12. `SHOULDERS` (Shoulders)
13. `FOREARMS` (Forearms)
14. `BOOTS` (Boots)
15. `SYMBOL` (Symbol)
16. `ELBOW` (Elbow)
17. `BASE` (Base)

## Dependencies

### Torso-Dependent Parts
- Head (Cabeza)
- Hands (Manos)
- Cape (Capa) - *Nota: Las capas dependen del torso. Al seleccionar un traje, el torso base cambia y, por ende, la compatibilidad de la capa se ajusta automáticamente al nuevo torso.*
- Symbol (Símbolo)
- Beltchest (Cinturón del pecho)
- Suit Torso (Traje del torso)

### Leg-Dependent Parts
- Boots (Botas)
- Legs Suit (Traje de piernas)

### Independent Parts
- Belt (Cinturón)
- Base (Base)

## Examples

### Basic Parts
- `strong_torso_01.glb` - Basic torso
- `strong_legs_01.glb` - Basic legs
- `strong_head_01.glb` - Basic head

### Dependent Parts
- `strong_hands_hammer_01_t01_r_g.glb` - Right hand with glove, dependent on torso 01
- `strong_hands_pistol_01_t01_l_ng.glb` - Left hand without glove, dependent on torso 01
- `strong_boots_01_p01_p05.glb` - Boots variant 01 compatible with legs 01 and 05
- `strong_boots_02_p02_p06.glb` - Boots variant 02 compatible with legs 02 and 06

### Accessories
- `strong_belt_01.glb` - Independent belt
- `strong_beltchest_01_t01.glb` - Chest belt dependent on torso 01

## Directory Structure
```
public/assets/
├── strong/
│   ├── torso/
│   │   ├── strong_torso_01.glb
│   │   ├── strong_torso_02.glb
│   │   └── strong_torso_03.glb
│   ├── hands/
│   │   ├── strong_hands_hammer_01_t01_r_g.glb
│   │   └── strong_hands_pistol_01_t01_l_ng.glb
│   ├── head/
│   │   └── strong_head_01_t01.glb
│   ├── beltchest/
│   │   └── strong_beltchest_01_t01.glb
│   ├── belt/
│   │   └── strong_belt_01.glb
│   ├── suit_torso/
│   │   └── strong_suit_torso_01_t01.glb
│   ├── symbol/
│   │   └── strong_symbol_01_t01.glb
│   ├── cape/
│   │   └── strong_cape_01_t01.glb
│   ├── legs/
│   │   ├── strong_legs_01.glb
│   │   └── strong_legs_02.glb
│   ├── boots/
│   │   ├── strong_boots_01_p01_p05.glb
│   │   └── strong_boots_02_p02_p06.glb
│   └── legs_suit/
│       ├── strong_legs_suit_01_l01.glb
│       └── strong_legs_suit_02_l02.glb
```

## Validation Rules

1. **Consistency**
   - Always use lowercase
   - Separate words with underscores (_)
   - No spaces or special characters
   - Maintain consistent suffixes

2. **Naming Length**
   - Maximum 32 characters before .glb
   - Keep names descriptive but concise

3. **Compatibility**
   - Specify torso compatibility for torso-dependent parts
   - Specify leg compatibility for leg-dependent parts
   - Use correct variant suffixes
   - Document new variants

4. **Organization**
   - Group files by their dependencies
   - Maintain clear part relationships
   - Document dependencies 

## Ejemplos de nuevos accesorios y placeholders

### Bands (accesorios de pierna/brazo dependientes de legs)
- `strong_bands_01_l05.glb` - Bands variant 01 for legs 05

### Placeholder vacío para menú (cylinder/none)
- `strong_head_none_01_t05.glb` - Empty head slot for torso 05
- `strong_beltchest_none_01_t03.glb` - Empty beltchest slot for torso 03 