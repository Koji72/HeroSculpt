# Shop Experience Redesign — Design Spec
**Date:** 2026-03-15
**Status:** Approved
**Branch:** feat/dark-comics-redesign

---

## Overview

Redesign the three core pieces of the purchase/library experience to match the Dark Comics visual system and provide clear premium-vs-free distinction throughout the customizer.

**Scope — three components, one cohesive feature:**
1. `ShoppingCart.tsx` — full Dark Comics redesign (layout + CSS)
2. `PartItemCard.tsx` — 3-state premium indicator system
3. `PurchaseConfirmation.tsx` — celebration screen with hero preview

---

## 0. Data Foundation: `ownedPartIds`

### Schema facts
`PurchaseHistoryService.getUserPurchases(userId)` executes:
```sql
SELECT *, purchase_items(*) FROM purchases WHERE user_id = ?
```
Supabase returns each purchase with a `purchase_items` sub-array embedded at runtime. The `Purchase` TypeScript interface declares `configuration_data: SelectedParts` but that column does NOT exist in the `purchases` DB table — it is always `undefined` at runtime on the top-level purchase object. The `configuration_data` field is correctly typed on `PurchaseItem` (line 21 of `purchaseHistoryService.ts`) and that is the correct field to read.

### New static method on `PurchaseHistoryService`
```ts
static async getOwnedPartIds(userId: string): Promise<Set<string>> {
  const result = await PurchaseHistoryService.getUserPurchases(userId);
  if (!result.success) return new Set();
  const ids = new Set<string>();
  for (const purchase of result.purchases ?? []) {
    // purchase_items is an embedded sub-array from the Supabase join,
    // not typed on Purchase — access via any cast
    const items: PurchaseItem[] = (purchase as any).purchase_items ?? [];
    for (const item of items) {
      // item.configuration_data is correctly typed as SelectedParts on PurchaseItem
      if (!item.configuration_data) continue;
      for (const part of Object.values(item.configuration_data)) {
        if (part?.id) ids.add(part.id);
      }
    }
  }
  return ids;
}
```

### App.tsx wiring
```ts
const [ownedPartIds, setOwnedPartIds] = useState<Set<string>>(new Set());
const [ownedPartIdsLoading, setOwnedPartIdsLoading] = useState(false);

// Load once on auth
useEffect(() => {
  if (!user?.id) { setOwnedPartIds(new Set()); return; }
  setOwnedPartIdsLoading(true);
  PurchaseHistoryService.getOwnedPartIds(user.id)
    .then(setOwnedPartIds)
    .finally(() => setOwnedPartIdsLoading(false));
}, [user?.id]);
```

**Re-fetch after save:** Inside `handleCartCheckout`, after `saveResult.success === true`, add:
```ts
PurchaseHistoryService.getOwnedPartIds(user.id).then(setOwnedPartIds);
// (same pattern as the existing loadUserPoses() call at line ~1212)
```

**Unauthenticated:** `ownedPartIds` stays as `new Set()` — no OWNED badges.

**During load (`ownedPartIdsLoading === true`):** All paid parts render as PREMIUM (no OWNED badge until the set resolves). No skeleton needed; transition is fast.

---

## 1. Shopping Cart Redesign (`ShoppingCart.tsx`)

### Removing `StandardShoppingCart.tsx`
- `StandardShoppingCart.tsx` is **deleted**.
- `App.tsx` currently renders `<StandardShoppingCart>` — its import and JSX are replaced with `<ShoppingCart>`.
- `ShoppingCart.onCheckout` signature is updated to match `handleCartCheckout`. **Two changes required — both must be made atomically:**
  1. The prop type declaration (currently line 23 of `ShoppingCart.tsx`):
     ```ts
     // Old: onCheckout: () => void;
     // New:
     onCheckout: (items: CartItem[]) => Promise<void>;
     ```
  2. The CTA call site (currently line 656):
     ```ts
     // Old: onClick={onCheckout}
     // New:
     onClick={() => onCheckout(cartItems)}
     ```

### `CartItem` type reconciliation
`ShoppingCart.tsx` currently defines its own local `CartItem` interface (lines 6–14) that is missing the `archetype: string` field present in App.tsx's `CartItem` (line 71). As part of this rewrite, **move** `CartItem` out of `ShoppingCart.tsx` and into `types.ts` as an exported interface, then import it in both `App.tsx` and the rewritten `ShoppingCart.tsx`. The canonical definition is App.tsx's version:
```ts
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
```
Remove the duplicate local definition from `ShoppingCart.tsx`.

### Full CSS rewrite
The existing `ShoppingCart.tsx` uses Tailwind `slate-*`/`blue-*` classes throughout. The entire component's CSS is rewritten to use Dark Comics CSS vars. Tailwind utility classes are removed from this file (layout helpers like `flex`, `gap-*` may be kept if the project uses Tailwind for layout; color/background/border classes are removed).

### What stays vs what goes
- **Stays:** `CartItem` type (unchanged), `cartItems` prop, `isProcessing` spinner, Escape-to-close, scroll indicator logic, `onAddCurrentConfig`, `onRemoveItem`, `onUpdateQuantity`, `onClearCart`, `onDownload`.
- **Removed:** `PurchaseAnalysisService` integration (`analyzePurchaseHistory`, `purchaseAnalysis`, `isAnalyzing`). The owned-parts system replaces its purpose.
- **Updated:** `onCheckout` signature (see above), CSS, visual layout.

### New props added
```ts
ownedPartIds?: Set<string>;       // defaults to new Set()
ownedPartIdsLoading?: boolean;    // defaults to false
```

### Visual design

**Header:** `panel-header` class — "🛒 MI HÉROE" in `var(--font-comic)` + badge with total part count.

**Tabs:** Two tabs in `var(--font-comic)` — "CONFIGURACIÓN" / "CARRITO". Cart tab shows amber dot `●` when `cartItems.length > 0`. Active tab: amber bottom border + `--color-surface-2` background.

**Configuration tab — part rows:**
Iterates `Object.values(currentConfiguration)` (live `SelectedParts`, same as today). Each row:
- Left: thumbnail (part image or emoji fallback) + part name in `var(--font-comic)` + category label (small, muted)
- Right, one of three:
  - `priceUSD > 0` and NOT in `ownedPartIds` → amber `$X.XX` + "NUEVO" label (0.6rem, muted)
  - `ownedPartIds.has(part.id)` → `✓ YA TIENES` in `#22c55e`
  - `priceUSD === 0` → nothing (free parts show no price indicator)

Note: `Part.priceUSD` is typed as `number` (never optional). Use `priceUSD > 0` for paid, `priceUSD === 0` for free. Do not use `!priceUSD`.

**Summary block:**
```
Ya tienes        N partes    ← #22c55e
Total nuevas     $X.XX       ← --color-accent
```
For authenticated users, add:
```
Descuento registro   GRATIS  ← #22c55e
```

**Primary CTA (full-width amber, `var(--font-comic)`):**
- Authenticated: `⬇ GUARDAR EN BIBLIOTECA` → calls `onCheckout(cartItems)`
- Unauthenticated: `🔑 REGISTRARSE PARA GUARDAR` → calls `onAuthRequired` (new optional prop, or wires to existing auth modal trigger)

**Secondary CTA (ghost):** `Editar configuración` → calls `onClose`.

**Guest path:** The existing guest email modal (`GuestEmailModal`) and `handleGuestEmailSubmitted` in App.tsx are **not changed** by this feature. The new `PurchaseConfirmation` is never shown for unauthenticated users — the unauthenticated CTA redirects to auth. The guest path remains functional but untouched.

---

## 2. Premium Part Indicators (`PartItemCard.tsx`)

### 3-state system

| State | Condition | Visual |
|-------|-----------|--------|
| **FREE** | `part.priceUSD === 0` | Blue `FREE` badge top-right, no overlay |
| **OWNED** | `ownedPartIds.has(part.id)` | Green `✓ MÍO` badge top-right, `YA COMPRADO` label below name |
| **PREMIUM** | `part.priceUSD > 0` and not owned | Dark overlay (`rgba(0,0,0,0.55)`) centered on thumb + 🔒 icon + amber price badge top-right, `PREMIUM` label below name |

Again: `priceUSD` is always `number`. Use `=== 0` for free, `> 0` for paid.

**During `ownedPartIdsLoading`:** All `priceUSD > 0` parts render as PREMIUM (no green OWNED badge). Single-click still applies to the 3D model even during load — the tooltip is shown. Once `ownedPartIdsLoading` becomes false, the badge updates.

**Interaction:**
- FREE / OWNED: single click applies part normally (existing behavior unchanged).
- PREMIUM: single click **still applies** part to 3D model (preview is free). Shows tooltip: "Añadir al carrito para descargar".
- No double-click behavior (dropped from scope).

**Remove existing `priceUSD != null` guard:** The current `PartItemCard.tsx` line 121 guards with `part.priceUSD != null`. Replace this with the 3-state logic above — `priceUSD` is always `number` (never optional), so `!= null` guard is unnecessary and can be removed.

### New props
```ts
interface PartItemCardProps {
  // ... all existing props unchanged ...
  ownedPartIds?: Set<string>;      // optional, defaults to new Set()
}
```

### CSS
All badge and overlay styles use `var(--color-accent)`, `var(--color-border)`, `var(--font-comic)`, `var(--radius)`. No Tailwind in new additions.

---

## 3. Purchase Confirmation Redesign (`PurchaseConfirmation.tsx`)

### Props interface (full replacement)
```ts
interface PurchaseConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedParts: Part[];             // Object.values(currentConfiguration) at save time
  modelName: string;                  // editable by user
  onModelNameChange?: (name: string) => void;
  archetypeId: ArchetypeId;           // enum, not plain string
  onExportGLB?: () => void;
  onOpenLibrary?: () => void;
}
```

### Dropped props — rationale
| Dropped prop | Reason |
|---|---|
| `totalPaid` | Checkout is free for registered users; price shown in cart before save, not after |
| `registerElement` | Was used for legacy `ExportButton`; removed — GLB handled via `onExportGLB` |
| `onExportSTL` | Out of scope for confirmation; available in main toolbar |
| `isGuestUser` / `guestEmail` | Guest flow handled at cart level — unauthenticated users never reach this modal |

### App.tsx `purchaseData` shape
The existing `purchaseData` state (line 166–171) is typed as:
```ts
{ items: CartItem[]; totalPaid: number; isGuestUser?: boolean; guestEmail?: string }
```
This is replaced with:
```ts
// Update the useState declaration at line 166:
const [purchaseData, setPurchaseData] = useState<{
  parts: Part[];
  modelName: string;
  archetypeId: ArchetypeId;
} | null>(null);
```

In `handleCartCheckout`, replace the existing `setPurchaseData(...)` call with:
```ts
setPurchaseData({
  // Parts come from the live currentConfiguration at the moment of save,
  // NOT from cartItems. cartItems are configuration bundles; this captures
  // the actual Part objects currently applied to the 3D model.
  parts: Object.values(currentConfiguration).filter(Boolean) as Part[],
  // Use ArchetypeInfo.title (e.g. "THE POWERHOUSE") as default name
  modelName: ARCHETYPE_DATA[selectedArchetype ?? ArchetypeId.STRONG]?.title ?? 'Mi Héroe',
  // selectedArchetype is ArchetypeId | null — fallback to STRONG
  archetypeId: selectedArchetype ?? ArchetypeId.STRONG,
});
```

**Atomicity note:** The `purchaseData` state type change, the `<PurchaseConfirmation>` JSX block in App.tsx (currently lines ~1970–1981), and the new `PurchaseConfirmation.tsx` interface must all be changed in the same commit — the old JSX references `purchaseData.items`, `purchaseData.totalPaid`, `purchaseData.isGuestUser`, `purchaseData.guestEmail` which will fail to compile the moment the state type is changed.

### Visual design

**Header:** `panel-header` class — "🎯 ¡HÉROE GUARDADO!"

**Hero preview:**
- Radial glow: `background: radial-gradient(ellipse, rgba(245,158,11,0.15), transparent 70%)`
- 4 floating sparkle spans (✦ ★) with `@keyframes float` (translateY + rotate, 2s ease-in-out infinite)
- **Hero silhouette:** A styled CSS `div` (80×110px, dark gradient background, `var(--radius)` border-radius, 1px border) containing a centered emoji `🦸` at `font-size: 3rem`. No image asset required.
- Hero name: `<input>` styled as text, `var(--font-comic)`, max 40 chars. Editable inline. On blur: calls `onModelNameChange?.(name)`.
- Subtitle: `{ARCHETYPE_DATA[archetypeId].title.toUpperCase()} · {purchasedParts.length} PARTES`
  (uses `ArchetypeInfo.title`, e.g. "THE POWERHOUSE · 4 PARTES")

**Parts saved list:**
- Section label: "PARTES GUARDADAS" (small, muted, uppercase)
- Each row: part name + category label + `✓ GUARDADO` in `#22c55e`
- `max-height: 180px; overflow-y: auto` — scrolls when more than ~4 parts

**Three action buttons (stacked, full-width):**
1. `⬇ DESCARGAR GLB` — primary amber, `var(--font-comic)`, calls `onExportGLB`. Hidden if `!onExportGLB`.
2. `📚 VER EN BIBLIOTECA` — ghost button, calls `onOpenLibrary?.(); onClose()`.
3. `🎲 SEGUIR PERSONALIZANDO` — ghost button, calls `onClose()`.

### `onOpenLibrary` wiring in App.tsx
```ts
onOpenLibrary={() => {
  setIsPurchaseConfirmationOpen(false);
  setPurchaseData(null);          // ← clear stale data to avoid re-showing confirmation
  setIsPurchaseLibraryOpen(true);
}}
```

---

## Component Architecture

```
App.tsx
├── state: ownedPartIds: Set<string>           ← new
├── state: ownedPartIdsLoading: boolean         ← new
├── state: purchaseData shape updated           ← changed
├── PurchaseHistoryService.getOwnedPartIds()    ← new method
│
├── ShoppingCart.tsx (rewritten, replaces StandardShoppingCart)
│   ├── props: ownedPartIds, ownedPartIdsLoading, onCheckout signature updated
│   └── Configuration tab: iterates currentConfiguration (SelectedParts)
│
├── PartItemCard.tsx (3-state indicators added)
│   └── prop: ownedPartIds?: Set<string>
│
└── PurchaseConfirmation.tsx (rewritten)
    ├── props: purchasedParts, modelName, archetypeId, onExportGLB, onOpenLibrary
    └── onOpenLibrary → setIsPurchaseLibraryOpen(true)
```

---

## Styling Rules

All new code uses Dark Comics CSS vars exclusively:
- `var(--color-surface)` / `var(--color-surface-2)` for backgrounds
- `var(--color-border)` / `var(--color-border-strong)` for borders
- `var(--color-accent)` (#f59e0b) for primary actions, badges, highlights
- `var(--font-comic)` (Bangers) for all headings, CTAs, badges
- `var(--radius)` (2px) for all border-radius
- Tailwind color/background/border classes removed from all rewritten files

---

## Out of Scope

- Stripe payment activation (future sprint)
- `PurchaseLibrary.tsx` redesign (separate feature)
- `part.isNew` field / NEW badge state (requires data task)
- Double-click "highlight in cart" for PREMIUM parts
- Mobile responsiveness (separate ticket)
- `onExportSTL` from confirmation screen
- Guest checkout flow changes

---

## Success Criteria

1. Users identify FREE / OWNED / PREMIUM parts visually in the part selector
2. Configuration tab in cart shows `$X.XX NUEVO` vs `✓ YA TIENES` per part
3. After saving: hero name + archetype + parts list + GLB download in confirmation
4. All three components use Dark Comics CSS vars only — no Tailwind `slate-*` / `blue-*` color classes
5. `StandardShoppingCart.tsx` deleted; `App.tsx` imports `ShoppingCart`
6. `ownedPartIds` re-fetched after each successful cart save
