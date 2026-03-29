# Suit Torso Preservation Fix - Complete Solution

## Overview

This document details the comprehensive fix for suit torso preservation issues in the 3D character customizer. The problem involved suit torsos not being preserved correctly when changing base torsos, and suit torsos not loading properly when selected.

## Problems Identified

### 1. File Naming Issues
**Problem**: Some suit torso GLB files had incorrect names with double dots instead of single dots.

**Files affected**:
- `strong_suit_torso_01_t02..glb` → should be `strong_suit_torso_01_t02.glb`
- `strong_suit_torso_01_t04..glb` → should be `strong_suit_torso_01_t04.glb`
- `strong_suit_torso_02_t02..glb` → should be `strong_suit_torso_02_t02.glb`

**Impact**: These files couldn't be loaded because the paths in `constants.ts` didn't match the actual file names.

**Solution**: Renamed the files using PowerShell commands:
```powershell
Rename-Item "strong_suit_torso_01_t02..glb" "strong_suit_torso_01_t02.glb"
Rename-Item "strong_suit_torso_01_t04..glb" "strong_suit_torso_01_t04.glb"
Rename-Item "strong_suit_torso_02_t02..glb" "strong_suit_torso_02_t02.glb"
```

### 2. Logic Error in Suit Torso Selection
**Problem**: When selecting a suit torso, the `assignAdaptiveSuitTorsoForTorso` function was being called, which would overwrite the selected suit torso.

**Location**: `App.tsx` line 160

**Root Cause**: The preservation function was designed to preserve suit torsos when changing base torsos, but it was incorrectly being called when selecting a suit torso directly.

**Impact**: Users couldn't select suit torsos because they would be immediately overwritten by the preservation logic.

**Solution**: Removed the call to `assignAdaptiveSuitTorsoForTorso` when selecting a suit torso:

```typescript
// Before (incorrect)
newParts = assignAdaptiveSuitTorsoForTorso(compatibleTorso, newParts, prev);

// After (correct)
// NO llamar assignAdaptiveSuitTorsoForTorso aquí porque ya tenemos el suit torso seleccionado
```

## Implementation Details

### Suit Torso Preservation Logic

The `assignAdaptiveSuitTorsoForTorso` function in `lib/utils.ts` implements intelligent preservation:

1. **Exact Match**: Tries to find the exact same suit type for the new torso
2. **Same Type Fallback**: If exact match not found, tries to find same suit type
3. **Alternative Fallback**: If same type not available, assigns any compatible suit
4. **Optional Assignment**: Suit torsos are optional, so no default is assigned if none compatible

```typescript
export function assignAdaptiveSuitTorsoForTorso(newTorso: Part, currentParts: SelectedParts, previousParts: SelectedParts): SelectedParts {
  // Extract torso number from ID
  const torsoMatch = newTorso.id.match(/strong_torso_(\d+)/);
  const newTorsoNumber = torsoMatch ? torsoMatch[1] : '01';
  
  // Find previous suit torso from previousParts (not currentParts)
  const previousSuitTorso = Object.values(previousParts).find(p => p.category === PartCategory.SUIT_TORSO);
  
  // Remove existing suit torsos
  Object.keys(newParts).forEach(key => {
    if (newParts[key]?.category === PartCategory.SUIT_TORSO) {
      delete newParts[key];
    }
  });
  
  if (previousSuitTorso) {
    // Try to preserve suit type but change to corresponding torso
    const suitTorsoMatch = previousSuitTorso.id.match(/strong_suit_torso_(\d+)_t(\d+)/);
    if (suitTorsoMatch) {
      const [, suitType, currentTorso] = suitTorsoMatch;
      
      // 1. Try to find exact suit torso for new torso
      const newSuitTorsoId = `strong_suit_torso_${suitType}_t${newTorsoNumber}`;
      let equivalentSuitTorso = ALL_PARTS.find(p => 
        p.id === newSuitTorsoId && 
        p.category === PartCategory.SUIT_TORSO && 
        p.archetype === newTorso.archetype
      );
      
      if (equivalentSuitTorso) {
        newParts[equivalentSuitTorso.id] = equivalentSuitTorso;
        return newParts;
      }
      
      // 2. Find any compatible suit torso for this torso
      const alternativeSuitTorsos = ALL_PARTS.filter(p => 
        p.category === PartCategory.SUIT_TORSO && 
        p.archetype === newTorso.archetype &&
        p.compatible.includes(newTorso.id)
      );
      
      if (alternativeSuitTorsos.length > 0) {
        // Prioritize same type suits
        const sameTypeSuitTorsos = alternativeSuitTorsos.filter(h => {
          const hMatch = h.id.match(/strong_suit_torso_(\d+)_t/);
          return hMatch && hMatch[1] === suitType;
        });
        
        if (sameTypeSuitTorsos.length > 0) {
          equivalentSuitTorso = sameTypeSuitTorsos[0];
        } else {
          // Use most basic suit if same type not available
          alternativeSuitTorsos.sort((a, b) => {
            const aMatch = a.id.match(/strong_suit_torso_(\d+)_t/);
            const bMatch = b.id.match(/strong_suit_torso_(\d+)_t/);
            const aNum = aMatch ? parseInt(aMatch[1]) : 99;
            const bNum = bMatch ? parseInt(bMatch[1]) : 99;
            return aNum - bNum;
          });
          equivalentSuitTorso = alternativeSuitTorsos[0];
        }
        
        newParts[equivalentSuitTorso.id] = equivalentSuitTorso;
        return newParts;
      }
    }
  }
  
  // 3. Suit torsos are optional, don't assign default
  return newParts;
}
```

### Suit Torso Selection Logic

When a suit torso is selected in `App.tsx`:

```typescript
if (category === PartCategory.SUIT_TORSO) {
  // Remove all existing torsos
  removeAllTorsos();
  
  // Clear torso dependencies (except hands)
  TORSO_DEPENDENT_CATEGORIES.forEach(dep => {
    if (dep !== PartCategory.HAND_LEFT && dep !== PartCategory.HAND_RIGHT) {
      Object.keys(newParts).forEach(key => {
        if (newParts[key]?.category === dep) {
          delete newParts[key];
        }
      });
    }
  });
  
  // Find compatible torso
  const compatibleTorsoId = part.compatible?.[0];
  const compatibleTorso = ALL_PARTS.find(p => p.id === compatibleTorsoId && p.category === PartCategory.TORSO);
  
  // Add compatible torso and suit torso
  newParts[compatibleTorso.id] = compatibleTorso;
  newParts[part.id] = part;
  
  // Assign dependent parts (EXCLUDING suit torso preservation)
  newParts = assignDefaultHandsForTorso(compatibleTorso, newParts, prev);
  newParts = assignAdaptiveHeadForTorso(compatibleTorso, newParts, prev);
  newParts = assignAdaptiveCapeForTorso(compatibleTorso, newParts, prev);
  newParts = assignAdaptiveSymbolForTorso(compatibleTorso, newParts, prev);
  // NO assignAdaptiveSuitTorsoForTorso call here
  
  return newParts;
}
```

## Complete Suit Torso Coverage

The system now includes complete suit torso definitions for all torsos:

### Torso 01 Suits
- `strong_suit_torso_01_t01` - Suit Alpha
- `strong_suit_torso_02_t01` - Suit Beta  
- `strong_suit_torso_03_t01` - Suit Gamma
- `strong_suit_torso_04_t01` - Suit Delta

### Torso 02 Suits
- `strong_suit_torso_01_t02` - Suit Alpha
- `strong_suit_torso_02_t02` - Suit Beta
- `strong_suit_torso_03_t02` - Suit Gamma
- `strong_suit_torso_04_t02` - Suit Delta

### Torso 03 Suits
- `strong_suit_torso_01_t03` - Suit Alpha
- `strong_suit_torso_02_t03` - Suit Beta
- `strong_suit_torso_03_t03` - Suit Gamma
- `strong_suit_torso_04_t03` - Suit Delta

### Torso 04 Suits
- `strong_suit_torso_01_t04` - Suit Alpha
- `strong_suit_torso_02_t04` - Suit Beta
- `strong_suit_torso_03_t04` - Suit Gamma
- `strong_suit_torso_04_t04` - Suit Delta

### Torso 05 Suits
- `strong_suit_torso_01_t05` - Suit Alpha
- `strong_suit_torso_02_t05` - Suit Beta
- `strong_suit_torso_03_t05` - Suit Gamma
- `strong_suit_torso_04_t05` - Suit Delta

**Total**: 20 suit torsos (4 suits × 5 torsos)

## Testing Results

### Before Fix
- ❌ Suit torsos not loading due to file name mismatches
- ❌ Selected suit torsos being overwritten by preservation logic
- ❌ Inconsistent behavior when changing torsos

### After Fix
- ✅ All suit torsos load correctly
- ✅ Suit torso selection works properly
- ✅ Suit torsos preserve correctly when changing base torsos
- ✅ Intelligent fallback to compatible suits
- ✅ Complete coverage across all torso types

## Related Fixes

This fix also benefited other preservation systems:

- **Hands**: Preserved correctly with intelligent fallback
- **Heads**: Preserved correctly when changing torsos
- **Capes**: Preserved correctly when changing torsos
- **Symbols**: Preserved correctly when changing torsos

## Files Modified

1. **`App.tsx`**: Removed incorrect call to `assignAdaptiveSuitTorsoForTorso` when selecting suit torsos
2. **`public/assets/strong/suit_torsos/`**: Renamed files with incorrect extensions
3. **`constants.ts`**: Contains all suit torso definitions (already complete)

## Lessons Learned

1. **File naming consistency** is crucial for asset loading
2. **Preservation logic** should only run when changing base parts, not when selecting dependent parts
3. **Previous parts state** should be used for preservation, not current parts
4. **Intelligent fallback** provides better user experience than simple defaults
5. **Complete coverage** of all combinations prevents edge cases

## Future Considerations

- Consider adding more suit variants for different torsos
- Implement suit-specific accessories or modifications
- Add suit preview thumbnails for better UX
- Consider suit-specific pricing tiers 