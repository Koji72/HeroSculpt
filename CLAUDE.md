# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev              # Start dev server on port 5177
npm run build            # Production build
npm run preview          # Preview production build
npm run verify-supabase  # Verify Supabase connection
```

## Project Overview

Superhero 3D Customizer - A web-based character customization platform where users create personalized 3D superhero characters, purchase configurations, and export models (GLB/STL) for 3D printing.

**Tech Stack:** React 18 + TypeScript + Vite + Three.js + Tailwind CSS 4.x + Supabase

## Architecture

### State Management
App.tsx is the state root. All part selections are stored in `SelectedParts`:
```typescript
type SelectedParts = { [category in PartCategory]?: Part };
```

### Key Type Hierarchy
- **ArchetypeId**: STRONG, JUSTICIERO, SPEEDSTER, MYSTIC, TECH
- **PartCategory**: 16 categories (TORSO, SUIT_TORSO, HEAD, HAND_LEFT, HAND_RIGHT, CAPE, BOOTS, etc.)
- **Part**: Contains id, name, category, archetype, gltfPath, priceUSD, compatible[], thumbnail

### Compatibility System
Parts have a `compatible` array listing parent IDs they work with. Hands list compatible torso IDs. Before rendering, the app verifies `part.compatible.includes(baseTorsoId)`.

### Core Files
- **App.tsx** - Global state, archetype switching, part selection logic
- **CharacterViewer.tsx** - Three.js scene, model loading, export functionality
- **constants.ts** - Part definitions database (~3600 lines)
- **lib/utils.ts** - Part assignment functions, adaptive selection logic
- **lib/modelCache.ts** - Singleton model cache for Three.js

### Services Layer
- `purchaseHistoryService.ts` - Purchase management
- `sessionStorageService.ts` - Configuration persistence
- `supabaseSessionService.ts` - User session management

## Critical Patterns - NEVER CHANGE

### 1. SelectedParts Type
```typescript
// ✅ CORRECT - Uses category as key
export type SelectedParts = { [category in PartCategory]?: Part };

// ❌ WRONG - Would cause hand duplication
// export type SelectedParts = { [partId: string]: Part };
```

### 2. State Updates - Always Use Category Keys
```typescript
// ✅ CORRECT
delete newParts[PartCategory.HAND_LEFT];
newParts[PartCategory.HAND_LEFT] = part;

// ❌ WRONG - Causes hand accumulation
// delete newParts[part.id];
```

### 3. Compatibility Verification
```typescript
// ✅ REQUIRED before loading models
const isCompatible = part.compatible.includes(baseTorsoId);
if (!isCompatible) return false;
```

### 4. Head Preservation When Changing Torso
```typescript
// ✅ CORRECT - Preserve head BEFORE deleting dependent parts
const currentHead = newParts[PartCategory.HEAD];
TORSO_DEPENDENT_CATEGORIES.forEach(dep => delete newParts[dep]);

const partsWithHead = { ...newParts };
if (currentHead) partsWithHead[PartCategory.HEAD] = currentHead;
newParts = assignAdaptiveHeadForTorso(part, newParts, partsWithHead);
```

### 5. Cape Preservation
```typescript
// ✅ CORRECT - Preserve cape before torso change
const currentCape = newParts[PartCategory.CAPE];
const partsWithCape = { ...newParts };
if (currentCape) partsWithCape[PartCategory.CAPE] = currentCape;
newParts = assignAdaptiveCapeForTorso(part, newParts, partsWithCape);
```

## Protected Files

Do not change core logic in these files:
1. **types.ts** - SelectedParts type definition
2. **lib/utils.ts** - Part assignment functions
3. **components/CharacterViewer.tsx** - Compatibility verification
4. **App.tsx** - State management with category keys and preservation patterns
5. **constants.ts** - Part definitions with correct asset paths

## Asset Paths

- Heads: `assets/strong/head/`
- Capes: `assets/strong/cape/`
- Torsos: `assets/strong/torso/`
- Suit Torsos: `assets/strong/suit_torsos/`
- Models are GLB format with DRACO compression support

## Verification Commands

```bash
# Verify SelectedParts type
grep "SelectedParts.*=" types.ts

# Verify state patterns use category keys
grep "delete.*newParts\[" App.tsx

# Verify head preservation
grep "currentHead.*newParts" App.tsx

# Verify compatibility checks
grep "compatible.includes" components/CharacterViewer.tsx
```

## Documentation

Key documentation in `docs/`:
- `DOCUMENTATION_INDEX.md` - Complete navigation
- `HANDS_DUPLICATION_FIX_2025.md` - Hand system solution
- `HEADS_SYSTEM_FIX_2025.md` - Head preservation logic
- `PROBLEMS_SOLUTIONS_SUMMARY_2025.md` - Executive summary

## Environment Variables

```env
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_OPENAI_API_KEY=<openai-key>
```
