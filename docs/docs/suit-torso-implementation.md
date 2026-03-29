# Suit Torso Compatibility System

## Overview

The suit torso system allows users to select different suit variations that are compatible with specific base torsos. Suits are dependent parts that require a compatible base torso to be selected first.

## Architecture

### Data Structure

Suits are defined in `constants.ts` with the following structure:

```typescript
{
  id: 'strong_suit_torso_01_t01', 
  name: 'Strong Suit Alpha (Torso 01)', 
  category: PartCategory.SUIT_TORSO, 
  archetype: ArchetypeId.STRONG,
  gltfPath: 'assets/strong/suit_torsos/strong_suit_torso_01.glb', 
  priceUSD: 0.80, 
  compatible: ['strong_torso_01'], // Links to base torso
  thumbnail: 'https://picsum.photos/seed/strong_suit_torso_01_t01/100/100',
}
```

### Naming Convention

- **Pattern**: `[archetype]_suit_torso_[variant]_t[torsoType]`
- **Example**: `strong_suit_torso_01_t01` = Strong archetype, suit variant 01, compatible with torso 01

### Compatibility Mapping

| Suit ID | Compatible Torso | Description |
|---------|------------------|-------------|
| `strong_suit_torso_01_t01` | `strong_torso_01` | Suit Alpha for Torso 01 |
| `strong_suit_torso_02_t01` | `strong_torso_01` | Suit Beta for Torso 01 |
| `strong_suit_torso_04_t01` | `strong_torso_01` | Suit Delta for Torso 01 |

## Implementation Details

### Filtering Logic

In `PartSelectorPanel.tsx`, suits are filtered based on the currently selected torso:

```typescript
// For suits: selectable if no torso is selected or if the selected base torso is compatible
const isCompatible = !selectedTorso || 
  (selectedTorso && part.compatible.includes(selectedTorso.id));
```

### Selection Logic

When a suit is selected in `App.tsx`:

1. **Identify compatible base torso**: Extract the base torso ID from the suit's `compatible` array
2. **Update base torso**: Set the base torso to the compatible one
3. **Apply suit**: Add the suit to the selected parts
4. **Update dependent parts**: Recalculate compatible heads, hands, capes, etc.

### UI Behavior

- **Torso Category**: Shows both base torsos and compatible suits
- **Filtering**: Only shows suits compatible with the currently selected torso
- **Selection**: Selecting a suit automatically selects its compatible base torso

## Workflow

1. **User selects base torso** → Available suits are filtered
2. **User selects suit** → Base torso is automatically updated to compatible one
3. **Dependent parts update** → Heads, hands, capes are recalculated for new torso

## Benefits

- ✅ **Flexible customization**: Multiple suit options per torso
- ✅ **Automatic compatibility**: No manual torso selection required
- ✅ **Consistent UI**: Suits appear in the same category as base torsos
- ✅ **Dependency management**: Proper handling of part relationships

## Testing

### Manual Testing Scenarios

1. **Select Torso 01** → Verify suits 01, 02, 04 appear
2. **Select Suit 01** → Verify Torso 01 is automatically selected
3. **Change to Torso 02** → Verify suits disappear (no compatible suits)
4. **Select different suit** → Verify base torso updates correctly

### Expected Behavior

- Suits should only appear when compatible with selected torso
- Selecting a suit should automatically select its base torso
- Dependent parts should update based on the new base torso
- UI should clearly distinguish between base torsos and suits

## File Locations

- **Constants**: `constants.ts` - Suit definitions and compatibility
- **Filtering**: `PartSelectorPanel.tsx` - UI filtering logic
- **Selection**: `App.tsx` - Part selection and dependency management
- **Models**: `public/assets/strong/suit_torsos/` - 3D model files

## Future Enhancements

- Add more suit variants for different torsos
- Implement suit-specific accessories
- Add suit preview thumbnails
- Consider suit-specific pricing tiers 