# File Naming Convention

## General Structure

```
[archetype]_[part]_[number]_[dependencies]_[variant].glb
```

## Components

### 1. Archetype (Prefix)
- `strong` - For Strong archetype
- `agile` - For Agile archetype
- `magic` - For Magic archetype
- `tech` - For Tech archetype
- `justicier` - For Justicier archetype

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
- `base` - Base

### 3. Numbers
- Always two digits: `01`, `02`, `03`, etc.
- Start at 01
- Don't skip numbers

### 4. Dependencies
- `t01`, `t02`, `t03`, etc. - For torso-dependent parts
- `l01`, `l02`, `l03`, etc. - For leg-dependent parts
- Optional for independent parts

### 5. Variants
- `_l`, `_r` - Left/right side
- `_pair` - Boots exported together
- `_g`, `_ng` - With/without glove
- `_nc` - No cape
- `_ns` - No symbol
- `_nt` - No torsosuit
- `_lod{n}` - Level of detail
- `_v{mm}` - Major-minor version

## Part Dependencies Table

| Part | Torso Dependent | Beltchest Dependent | Legs Dependent | Example |
|------|----------------|-------------------|----------------|---------|
| torso | No | No | No | `strong_torso_01.glb` |
| suit_torso | Yes | No | No | `strong_suit_torso_01_t01.glb` |
| legs | No | No | No | `strong_legs_01.glb` |
| head | Yes | No | No | `strong_head_01_t01.glb` |
| hands | Yes | No | No | `strong_hands_hammer_01_t01_r_g.glb` |
| cape | Yes | No | No | `strong_cape_01_t01.glb` |
| symbol | Yes | No | No | `strong_symbol_01_t01.glb` |
| beltchest | Yes | No | No | `strong_beltchest_01_t01.glb` |
| belt | No | No | No | `strong_belt_01.glb` |
| boots | No | No | Yes | `strong_boots_01_l01_pair.glb` |
| legs_suit | No | No | Yes | `strong_legs_suit_01_l01.glb` |

## Example Sets

### Torso 01 Set
```
# Base Torso
strong_torso_01.glb

# Torso-dependent parts
strong_hands_hammer_01_t01_r_g.glb
strong_head_01_t01.glb
strong_suit_torso_01_t01.glb
strong_symbol_01_t01.glb
strong_cape_01_t01.glb
strong_beltchest_01_t01.glb

# Independent belt
strong_belt_01.glb
```

### Legs 01 Set
```
# Base Legs
strong_legs_01.glb

# Leg-dependent parts
strong_boots_01_l01_pair.glb
strong_legs_suit_01_l01.glb
```

## Variant Rules by Part Type

### Hands
- `_g` - With glove
- `_ng` - Without glove
- `_l` - Left side
- `_r` - Right side
- Must match torso number

### Suits
- `_nt` - No suit
- Must match torso number for torso suits
- Must match leg number for leg suits

### Capes
- `_nc` - No cape
- Must match torso number

### Symbols
- `_ns` - No symbol
- Must match torso number

### Boots
- `_lXX` - Matches leg number
- `_pair` - Boots exported together
- `_l`, `_r` - Left/right side

### Belt
- No dependencies
- Can be used with any torso/legs combination
- Example: `strong_belt_01.glb`

### Beltchest
- Must match torso number
- Can have different variants for same torso

## Important Rules

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
│   │   ├── strong_boots_01_l01_pair.glb
│   │   └── strong_boots_02_l02_pair.glb
│   └── legs_suit/
│       ├── strong_legs_suit_01_l01.glb
│       └── strong_legs_suit_02_l02.glb
```

## Validation

To validate a filename:
1. Must start with correct archetype
2. Must include correct part name
3. Must have two-digit number
4. Must include torso number for torso-dependent parts
5. Must include leg number for leg-dependent parts
6. Must use correct variant suffixes
7. Must end with .glb
8. Must not exceed 32 characters before .glb

## Change History

- [Date] - Created document
- [Date] - Added torso dependency section
- [Date] - Updated part relationships
- [Date] - Added validation rules
- [Date] - Added dependency table
- [Date] - Updated belt as independent part 