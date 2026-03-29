# Heads Filtering Issue - Problem & Solution

## Problem Description

**Issue**: When selecting "Torso 2" in the character customizer, only a limited number of heads were displayed in the selection menu, instead of all available heads for this torso.

**Symptoms**:
- Limited head options for Torso 2
- Inconsistent behavior between different torso types
- Users unable to access all available head variants

## Root Cause Analysis

### 1. Missing Part Definitions in `constants.ts`

The main issue was that **not all head GLB files with `t02` in their names had corresponding entries in `constants.ts`**. 

**File Discovery**: We found these head GLB files for Torso 2:
```
strong_head_02_t02.glb
strong_head_03_t02.glb
strong_head_04_t02.glb
```

### 2. Incorrect Understanding of Naming Convention

**Initial Misconception**: It was assumed that only a subset of heads should be available, or that the filtering logic was at fault.

**Correct Understanding**: After reviewing the documentation, we learned that:
- `t02` in the filename indicates compatibility with Torso 2
- **All variants should be included** in the selection menu

### 3. Filtering Logic in `PartSelectorPanel.tsx`

The filtering logic in `PartSelectorPanel.tsx` was working correctly, but it could only display heads that were properly defined in `constants.ts`. The issue was not with the filtering logic itself, but with missing part definitions.

## Solution Implementation

### Step 1: Understanding the Naming Convention

We reviewed the documentation to understand the correct naming convention:
- `strong_head_[variant]_t[torso].glb`
- `t02` = compatible with Torso 2
- All variants should be available

### Step 2: Creating a Complete List of Head Files

We created a Python script to list all head files for Torso 2:

```python
# list_t02_heads.py
import os
import glob

output_file = 'temp_head_files.txt'
head_dir = 'public/assets/strong/head/'

all_glb_files = glob.glob(os.path.join(head_dir, '*t02*.glb'))
all_glb_files.extend(glob.glob(os.path.join(head_dir, '*t02*..glb')))

t02_head_files = sorted(list(set([os.path.basename(f) for f in all_glb_files])))

with open(output_file, 'w') as f:
    for filename in t02_head_files:
        f.write(filename + '\n')

print(f'Listed {len(t02_head_files)} t02 head files to {output_file}')
```

### Step 3: Adding Complete Part Definitions to `constants.ts`

We added all head definitions to `constants.ts` with the correct properties:

```typescript
{
  id: 'strong_head_03_t02',
  name: 'Strong Head 03',
  category: PartCategory.HEAD,
  archetype: ArchetypeId.STRONG,
  gltfPath: 'assets/strong/head/strong_head_03_t02.glb',
  priceUSD: 1.30,
  compatible: ['strong_torso_02'],
  thumbnail: 'https://picsum.photos/seed/strong_head_03_t02/100/100',
  attributes: { torsoType: '02', style: '03' }
}
```

### Step 4: Key Properties for Each Head Definition

Each head definition must include:

1. **`torsoType: '02'`** in attributes (if style is used)
2. **`compatible: ['strong_torso_02']`**
3. **Correct category** - HEAD
4. **Correct variant/style**

## Verification

After implementing the solution:
- ✅ All heads for Torso 2 are now displayed in the selection menu
- ✅ Filtering logic works correctly
- ✅ Users can access all head variants

## Key Lessons Learned

- Always review naming conventions in `docs/model-parts-naming.md`
- Every GLB file that should be selectable needs a corresponding entry in `constants.ts`
- Use scripts to automate file discovery and validation

## Prevention

1. **Automated Validation**: Use the validation script to check for missing definitions
2. **Documentation Updates**: Keep naming conventions up to date
3. **Testing Checklist**: Always test with all torso types when adding new parts

## Related Files

- `constants.ts` - Part definitions
- `src/components/PartSelectorPanel.tsx` - Filtering logic
- `types.ts` - Category definitions
- `docs/model-parts-naming.md` - Naming conventions

---

**Date**: January 2025  
**Status**: ✅ RESOLVED  
**Impact**: Medium - Fixed head selection for torso 2 