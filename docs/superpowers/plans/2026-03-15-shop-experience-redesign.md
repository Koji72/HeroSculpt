# Shop Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the purchase/library experience to match the Dark Comics visual system with clear FREE/OWNED/PREMIUM part distinction throughout the customizer.

**Architecture:** Add `getOwnedPartIds()` to `PurchaseHistoryService` and thread `ownedPartIds: Set<string>` from App.tsx down to `PartItemCard` (3-state badges) and `ShoppingCart` (owned-vs-new row labels). Rewrite `ShoppingCart` and `PurchaseConfirmation` in Dark Comics CSS vars, delete the redundant `StandardShoppingCart`.

**Tech Stack:** React 18, TypeScript, Vitest + React Testing Library, CSS vars (Dark Comics design system), Supabase via `PurchaseHistoryService`.

---

## Chunk 1: Shared CartItem type + `getOwnedPartIds`

### Task 1: Export `CartItem` from `types.ts`

**Files:**
- Modify: `types.ts` (append after existing interfaces)
- Modify: `App.tsx` (remove local CartItem, add import)
- Modify: `components/ShoppingCart.tsx` (remove local CartItem, add import)
- Test: `tests/purchaseHistory.test.ts` (new file)

- [ ] **Step 1: Write the failing test for `getOwnedPartIds`**

Create `tests/purchaseHistory.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PurchaseHistoryService, PurchaseItem } from '../services/purchaseHistoryService';
import { PartCategory } from '../types';

// Minimal Part stub — only fields getOwnedPartIds reads
const makePart = (id: string) => ({
  id,
  name: id,
  category: PartCategory.TORSO,
  priceUSD: 4.99,
  compatible: [],
  attributes: {},
});

const makeConfig = (ids: string[]) =>
  Object.fromEntries(ids.map((id, i) => [`cat${i}`, makePart(id)]));

describe('PurchaseHistoryService.getOwnedPartIds', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty set when user has no purchases', async () => {
    vi.spyOn(PurchaseHistoryService, 'getUserPurchases').mockResolvedValue({
      success: true,
      purchases: [],
    });
    const ids = await PurchaseHistoryService.getOwnedPartIds('user-1');
    expect(ids.size).toBe(0);
  });

  it('returns empty set on service failure', async () => {
    vi.spyOn(PurchaseHistoryService, 'getUserPurchases').mockResolvedValue({
      success: false,
      error: 'DB error',
    });
    const ids = await PurchaseHistoryService.getOwnedPartIds('user-1');
    expect(ids.size).toBe(0);
  });

  it('extracts part IDs from purchase_items configuration_data', async () => {
    const items: PurchaseItem[] = [
      {
        id: 'item-1',
        purchase_id: 'purchase-1',
        item_name: 'Config A',
        item_price: 0,
        quantity: 1,
        configuration_data: makeConfig(['part-a', 'part-b']) as any,
      },
    ];
    vi.spyOn(PurchaseHistoryService, 'getUserPurchases').mockResolvedValue({
      success: true,
      purchases: [{ purchase_items: items } as any],
    });
    const ids = await PurchaseHistoryService.getOwnedPartIds('user-1');
    expect(ids.has('part-a')).toBe(true);
    expect(ids.has('part-b')).toBe(true);
    expect(ids.size).toBe(2);
  });

  it('deduplicates part IDs across multiple purchases', async () => {
    const items1: PurchaseItem[] = [{
      id: 'item-1', purchase_id: 'p1', item_name: 'A', item_price: 0, quantity: 1,
      configuration_data: makeConfig(['part-x']) as any,
    }];
    const items2: PurchaseItem[] = [{
      id: 'item-2', purchase_id: 'p2', item_name: 'B', item_price: 0, quantity: 1,
      configuration_data: makeConfig(['part-x', 'part-y']) as any,
    }];
    vi.spyOn(PurchaseHistoryService, 'getUserPurchases').mockResolvedValue({
      success: true,
      purchases: [
        { purchase_items: items1 } as any,
        { purchase_items: items2 } as any,
      ],
    });
    const ids = await PurchaseHistoryService.getOwnedPartIds('user-1');
    expect(ids.has('part-x')).toBe(true);
    expect(ids.has('part-y')).toBe(true);
    expect(ids.size).toBe(2); // part-x deduplicated
  });

  it('handles purchases with no purchase_items gracefully', async () => {
    vi.spyOn(PurchaseHistoryService, 'getUserPurchases').mockResolvedValue({
      success: true,
      purchases: [{ purchase_items: undefined } as any],
    });
    const ids = await PurchaseHistoryService.getOwnedPartIds('user-1');
    expect(ids.size).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd "c:/Users/david/3dcustomicerdefinitvo/.worktrees/dark-comics-redesign"
npx vitest run tests/purchaseHistory.test.ts
```

Expected: FAIL — `getOwnedPartIds is not a function`

- [ ] **Step 3: Add `CartItem` to `types.ts`**

Open `types.ts`. At the end of the file, append:

```ts
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
```

- [ ] **Step 4: Add `getOwnedPartIds` to `purchaseHistoryService.ts`**

Open `services/purchaseHistoryService.ts`. Add this method inside the `PurchaseHistoryService` class, after the existing `getUserPurchases` method:

```ts
/**
 * Returns the set of part IDs the user has previously saved/purchased.
 * Reads from purchase_items (embedded via Supabase join), not the top-level purchase row.
 * Note: Purchase.configuration_data in the TypeScript interface is stale — it does NOT
 * exist as a column in the purchases table. Use PurchaseItem.configuration_data instead.
 */
static async getOwnedPartIds(userId: string): Promise<Set<string>> {
  const result = await PurchaseHistoryService.getUserPurchases(userId);
  if (!result.success) return new Set();
  const ids = new Set<string>();
  for (const purchase of result.purchases ?? []) {
    const items: PurchaseItem[] = (purchase as any).purchase_items ?? [];
    for (const item of items) {
      if (!item.configuration_data) continue;
      for (const part of Object.values(item.configuration_data)) {
        if (part?.id) ids.add(part.id);
      }
    }
  }
  return ids;
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
npx vitest run tests/purchaseHistory.test.ts
```

Expected: PASS — 5 tests green

- [ ] **Step 6: Update imports — remove duplicate `CartItem` definitions**

In `App.tsx`:
- Find the local `interface CartItem { ... }` block (lines 63–72) and **delete it**
- Add `CartItem` to the existing `types` import at the top:
  ```ts
  import { SelectedParts, Part, PartCategory, ArchetypeId, CartItem } from './types';
  ```

In `components/ShoppingCart.tsx`:
- Find the local `interface CartItem { ... }` block (lines 6–14) and **delete it**
- Add `CartItem` to the types import at the top:
  ```ts
  import { SelectedParts, Part, PartCategory, CartItem } from '../types';
  ```

- [ ] **Step 7: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors related to CartItem. Pre-existing unrelated errors are acceptable.

- [ ] **Step 8: Add `ownedPartIds` state to `App.tsx`**

Open `App.tsx`. After the `cartItems` useState (around line 162), add two new state variables:

```ts
const [ownedPartIds, setOwnedPartIds] = useState<Set<string>>(new Set());
const [ownedPartIdsLoading, setOwnedPartIdsLoading] = useState(false);
```

Then add a `useEffect` to load on auth — place it near other auth-dependent effects (search for `useEffect(() => {` blocks that check `user?.id`):

```ts
// Load owned part IDs when user authenticates or changes
useEffect(() => {
  if (!user?.id) { setOwnedPartIds(new Set()); return; }
  setOwnedPartIdsLoading(true);
  PurchaseHistoryService.getOwnedPartIds(user.id)
    .then(setOwnedPartIds)
    .finally(() => setOwnedPartIdsLoading(false));
}, [user?.id]);
```

Verify `PurchaseHistoryService` is already imported in `App.tsx`:
```bash
grep "import.*PurchaseHistoryService" App.tsx
```
If missing, add: `import { PurchaseHistoryService } from './services/purchaseHistoryService';`

- [ ] **Step 9: Run TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors related to CartItem or ownedPartIds. Pre-existing unrelated errors are acceptable.

- [ ] **Step 10: Commit**

```bash
git add types.ts services/purchaseHistoryService.ts App.tsx components/ShoppingCart.tsx tests/purchaseHistory.test.ts
git commit -m "feat: export CartItem from types.ts + add getOwnedPartIds + wire ownedPartIds state in App.tsx"
```

---

## Chunk 2: PartItemCard 3-state premium indicators

### Task 2: Add FREE / OWNED / PREMIUM badges to `PartItemCard`

**Files:**
- Modify: `components/PartItemCard.tsx`
- Modify: `components/PartSelectorPanel.tsx` (pass `ownedPartIds` prop)
- Test: `tests/PartItemCard.test.tsx` (new file)

- [ ] **Step 1: Write the failing tests**

Create `tests/PartItemCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PartItemCard from '../components/PartItemCard';
import { PartCategory } from '../types';

const makePart = (overrides = {}) => ({
  id: 'part-1',
  name: 'Alpha Torso',
  category: PartCategory.TORSO,
  priceUSD: 0,
  thumbnail: '',
  compatible: [],
  attributes: {},
  ...overrides,
});

const defaultProps = {
  part: makePart(),
  isSelected: false,
  onSelect: () => {},
};

describe('PartItemCard — premium indicators', () => {
  it('shows FREE badge for priceUSD === 0', () => {
    render(<PartItemCard {...defaultProps} part={makePart({ priceUSD: 0 })} />);
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('does not show lock overlay for free parts', () => {
    render(<PartItemCard {...defaultProps} part={makePart({ priceUSD: 0 })} />);
    expect(screen.queryByText('🔒')).not.toBeInTheDocument();
  });

  it('shows PREMIUM badge and lock for paid unowned parts', () => {
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ priceUSD: 4.99 })}
        ownedPartIds={new Set()}
      />
    );
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
    expect(screen.getByText('🔒')).toBeInTheDocument();
    expect(screen.getByText('$4.99')).toBeInTheDocument();
  });

  it('shows OWNED badge when part is in ownedPartIds', () => {
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ id: 'part-1', priceUSD: 4.99 })}
        ownedPartIds={new Set(['part-1'])}
      />
    );
    expect(screen.getByText('✓ MÍO')).toBeInTheDocument();
    expect(screen.getByText('YA COMPRADO')).toBeInTheDocument();
    expect(screen.queryByText('🔒')).not.toBeInTheDocument();
  });

  it('shows PREMIUM when ownedPartIds not provided for paid part', () => {
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ priceUSD: 9.99 })}
        // ownedPartIds not passed — defaults to empty Set
      />
    );
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
  });

  it('shows PREMIUM during loading (ownedPartIds empty set)', () => {
    // During ownedPartIdsLoading, parent passes empty Set temporarily
    render(
      <PartItemCard
        {...defaultProps}
        part={makePart({ id: 'part-1', priceUSD: 4.99 })}
        ownedPartIds={new Set()} // not yet loaded
      />
    );
    expect(screen.getByText('PREMIUM')).toBeInTheDocument();
    expect(screen.queryByText('✓ MÍO')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run tests/PartItemCard.test.tsx
```

Expected: FAIL — badges not found (component doesn't have them yet)

- [ ] **Step 3: Implement 3-state badges in `PartItemCard.tsx`**

Open `components/PartItemCard.tsx`. Make the following changes:

**3a. Update the props interface** (lines 5–11) to add `ownedPartIds`:

```ts
interface PartItemCardProps {
  part: Part;
  isSelected: boolean;
  onSelect: (part: Part) => void;
  onDoubleClick?: (part: Part) => void;
  onHover?: (part: Part | null) => void;
  ownedPartIds?: Set<string>;   // ← new
}
```

**3b. Update the component signature** to destructure it:

```ts
const PartItemCard: React.FC<PartItemCardProps> = ({
  part, isSelected, onSelect, onDoubleClick, onHover,
  ownedPartIds = new Set(),
}) => {
```

**3c. Add state helpers** after the existing `isNonePart` / `isTorso` lines:

```ts
const isFree = part.priceUSD === 0;
const isOwned = !isFree && ownedPartIds.has(part.id);
const isPremium = !isFree && !isOwned;
const premiumLabel = `$${part.priceUSD.toFixed(2)}`;
```

**3d. Replace the existing `{/* Price */}` block** (lines 120–130) with the full 3-state UI.

Delete this old block:
```tsx
{/* Price */}
{part.priceUSD != null && (
  <span style={{
    fontFamily: 'var(--font-body)',
    fontSize: 8,
    color: 'var(--color-text-faint)',
    marginTop: 2,
  }}>
    ${part.priceUSD.toFixed(2)}
  </span>
)}
```

Replace with the lock overlay (inside the thumbnail div) and badges. The full updated return JSX for the price/badge section:

**Inside the thumbnail `<div>` (after the `<img>` block), add the lock overlay:**
```tsx
{/* PREMIUM lock overlay — rendered inside the thumbnail div */}
{isPremium && !isNonePart && (
  <div style={{
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 1,
  }}>
    <span style={{ fontSize: 14 }}>🔒</span>
  </div>
)}
```

**After the thumbnail `<div>` closing tag, before the `{/* Name */}` span, add the top-right badge:**
```tsx
{/* State badge — top-right corner */}
{!isNonePart && (
  <>
    {isFree && (
      <span style={{
        position: 'absolute', top: 2, right: 2,
        fontFamily: 'var(--font-comic)', fontSize: 7, letterSpacing: '0.5px',
        background: 'rgba(59,130,246,0.25)', color: '#60a5fa',
        border: '1px solid rgba(59,130,246,0.4)',
        padding: '1px 3px', borderRadius: 'var(--radius)',
      }}>FREE</span>
    )}
    {isOwned && (
      <span style={{
        position: 'absolute', top: 2, right: 2,
        fontFamily: 'var(--font-comic)', fontSize: 7, letterSpacing: '0.5px',
        background: 'rgba(34,197,94,0.2)', color: '#22c55e',
        border: '1px solid rgba(34,197,94,0.4)',
        padding: '1px 3px', borderRadius: 'var(--radius)',
      }}>✓ MÍO</span>
    )}
    {isPremium && (
      <span style={{
        position: 'absolute', top: 2, right: 2,
        fontFamily: 'var(--font-comic)', fontSize: 7, letterSpacing: '0.5px',
        background: 'rgba(245,158,11,0.25)', color: 'var(--color-accent)',
        border: '1px solid rgba(245,158,11,0.4)',
        padding: '1px 3px', borderRadius: 'var(--radius)',
      }}>{premiumLabel}</span>
    )}
  </>
)}
```

**After the `{/* Name */}` span, add the sub-label:**
```tsx
{/* State sub-label below name */}
{!isNonePart && (
  <>
    {isPremium && (
      <span style={{
        fontFamily: 'var(--font-comic)', fontSize: 7,
        color: 'var(--color-accent)', letterSpacing: '0.5px',
        textTransform: 'uppercase', marginTop: 1,
      }}>PREMIUM</span>
    )}
    {isOwned && (
      <span style={{
        fontFamily: 'var(--font-comic)', fontSize: 7,
        color: '#22c55e', letterSpacing: '0.5px',
        textTransform: 'uppercase', marginTop: 1,
      }}>YA COMPRADO</span>
    )}
  </>
)}
```

**Update the title tooltip** (line 44) to reflect the state:
```tsx
title={
  isNonePart ? 'Remove part' :
  isPremium ? `${part.name} — $${part.priceUSD.toFixed(2)} · Añadir al carrito para descargar` :
  `${part.name} - Click to preview, Double-click to apply`
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run tests/PartItemCard.test.tsx
```

Expected: PASS — 6 tests green

- [ ] **Step 5: Remove `onDoubleClick` from `PartItemCard.tsx`**

The spec drops double-click behavior from scope. In `components/PartItemCard.tsx`:

Remove `onDoubleClick?: (part: Part) => void;` from `PartItemCardProps`.

Remove `onDoubleClick` from the component destructuring.

Delete the `handleDoubleClick` function and the `onDoubleClick={handleDoubleClick}` attribute on the outer `<div>`.

- [ ] **Step 6: Pass `ownedPartIds` from `PartSelectorPanel.tsx` + App.tsx call site**

**6a. Update `components/PartSelectorPanel.tsx`:**

Find the `PartSelectorPanelProps` interface and add:
```ts
ownedPartIds?: Set<string>;
```

Find the component's destructuring and add `ownedPartIds = new Set()`.

Find every `<PartItemCard` usage in the file and add the prop:
```tsx
<PartItemCard
  // ...existing props (remove onDoubleClick if still passed)...
  ownedPartIds={ownedPartIds}
/>
```

Also remove any `onDoubleClick` prop being passed to `<PartItemCard>` — since the prop was removed from the interface in Step 5, any call site still passing it will cause a TypeScript error.

**6b. Update every `<PartSelectorPanel>` in `App.tsx`:**

Search for all `<PartSelectorPanel` usages in `App.tsx`:
```bash
grep -n "PartSelectorPanel" App.tsx
```

For each one, add the `ownedPartIds` prop:
```tsx
<PartSelectorPanel
  // ...existing props...
  ownedPartIds={ownedPartIds}
/>
```

- [ ] **Step 7: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors on PartItemCard / PartSelectorPanel files. Pre-existing unrelated errors are acceptable.

- [ ] **Step 8: Commit**

```bash
git add components/PartItemCard.tsx components/PartSelectorPanel.tsx App.tsx tests/PartItemCard.test.tsx
git commit -m "feat: add FREE/OWNED/PREMIUM 3-state badges to PartItemCard + wire ownedPartIds to panel"
```

---

## Chunk 3: ShoppingCart redesign + StandardShoppingCart deletion

### Task 3: Rewrite `ShoppingCart.tsx` in Dark Comics, delete `StandardShoppingCart`

**Files:**
- Rewrite: `components/ShoppingCart.tsx`
- Delete: `components/StandardShoppingCart.tsx`
- Modify: `App.tsx` (swap import + JSX)
- Test: `tests/ShoppingCart.test.tsx` (new file)

- [ ] **Step 1: Write the failing tests**

Create `tests/ShoppingCart.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ShoppingCart from '../components/ShoppingCart';
import { PartCategory } from '../types';

const makePart = (id: string, priceUSD = 0) => ({
  id, name: id, category: PartCategory.TORSO,
  priceUSD, compatible: [], attributes: {},
});

const makeCartItem = (id: string) => ({
  id, name: `Item ${id}`, category: 'TORSO',
  price: 4.99, thumbnail: '', quantity: 1,
  configuration: {}, archetype: 'STRONG',
});

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  cartItems: [],
  onRemoveItem: vi.fn(),
  onUpdateQuantity: vi.fn(),
  onClearCart: vi.fn(),
  onCheckout: vi.fn(),
  onAddCurrentConfig: vi.fn(),
  currentConfiguration: {},
  isAuthenticated: false,
};

describe('ShoppingCart', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders the panel-header with MI HÉROE title', () => {
    render(<ShoppingCart {...defaultProps} />);
    expect(screen.getByText(/MI HÉROE/i)).toBeInTheDocument();
  });

  it('shows CONFIGURACIÓN and CARRITO tabs', () => {
    render(<ShoppingCart {...defaultProps} />);
    expect(screen.getByText(/CONFIGURACIÓN/i)).toBeInTheDocument();
    expect(screen.getByText(/CARRITO/i)).toBeInTheDocument();
  });

  it('shows YA TIENES for owned parts in config tab', () => {
    const config = { TORSO: makePart('part-1', 4.99) };
    render(
      <ShoppingCart
        {...defaultProps}
        currentConfiguration={config as any}
        ownedPartIds={new Set(['part-1'])}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText(/YA TIENES/i)).toBeInTheDocument();
  });

  it('shows price and NUEVO for unowned paid parts', () => {
    const config = { TORSO: makePart('part-2', 4.99) };
    render(
      <ShoppingCart
        {...defaultProps}
        currentConfiguration={config as any}
        ownedPartIds={new Set()}
        isAuthenticated={true}
      />
    );
    expect(screen.getByText('$4.99')).toBeInTheDocument();
    expect(screen.getByText('NUEVO')).toBeInTheDocument();
  });

  it('shows GUARDAR EN BIBLIOTECA for authenticated users', () => {
    render(<ShoppingCart {...defaultProps} isAuthenticated={true} />);
    expect(screen.getByText(/GUARDAR EN BIBLIOTECA/i)).toBeInTheDocument();
  });

  it('shows REGISTRARSE PARA GUARDAR for unauthenticated users', () => {
    render(<ShoppingCart {...defaultProps} isAuthenticated={false} />);
    expect(screen.getByText(/REGISTRARSE PARA GUARDAR/i)).toBeInTheDocument();
  });

  it('calls onCheckout with cartItems when CTA clicked (authenticated)', () => {
    const onCheckout = vi.fn();
    const items = [makeCartItem('item-1')];
    render(
      <ShoppingCart
        {...defaultProps}
        cartItems={items}
        onCheckout={onCheckout}
        isAuthenticated={true}
      />
    );
    fireEvent.click(screen.getByText(/GUARDAR EN BIBLIOTECA/i));
    expect(onCheckout).toHaveBeenCalledWith(items);
  });

  it('does not render when isOpen is false', () => {
    render(<ShoppingCart {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/MI HÉROE/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run tests/ShoppingCart.test.tsx
```

Expected: FAIL — current ShoppingCart doesn't have these elements.

- [ ] **Step 3: Rewrite `components/ShoppingCart.tsx`**

Replace the entire file content with the following:

```tsx
import React, { useState, useEffect } from 'react';
import { SelectedParts, Part, PartCategory, CartItem } from '../types';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClearCart: () => void;
  onCheckout: (items: CartItem[]) => Promise<void>;
  onAddCurrentConfig: (configuration: SelectedParts) => void;
  currentConfiguration: SelectedParts;
  onEditCategory?: (category: PartCategory) => void;
  onDownload?: () => void;
  user?: { id: string; email?: string } | null;
  isAuthenticated?: boolean;
  onAuthRequired?: () => void;
  ownedPartIds?: Set<string>;
  ownedPartIdsLoading?: boolean;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  onAddCurrentConfig,
  currentConfiguration,
  onEditCategory,
  onDownload,
  user,
  isAuthenticated = false,
  onAuthRequired,
  ownedPartIds = new Set(),
  ownedPartIdsLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'cart'>('config');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const configParts = Object.values(currentConfiguration).filter(
    (p): p is Part => !!p && !p.attributes?.hidden
  );

  const ownedCount = configParts.filter(
    (p) => p.priceUSD > 0 && ownedPartIds.has(p.id)
  ).length;

  const newTotal = configParts
    .filter((p) => p.priceUSD > 0 && !ownedPartIds.has(p.id))
    .reduce((sum, p) => sum + p.priceUSD, 0);

  const handleCheckout = async () => {
    if (!isAuthenticated) { onAuthRequired?.(); return; }
    setIsProcessing(true);
    try {
      await onCheckout(cartItems);
    } finally {
      setIsProcessing(false);
    }
  };

  const getCategoryLabel = (category: string) =>
    category.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: 420, maxHeight: '85vh',
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border-strong)',
        borderRadius: 'var(--radius)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 16, letterSpacing: 2 }}>
            🛒 MI HÉROE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-comic)', fontSize: 11, letterSpacing: 1,
              background: 'rgba(0,0,0,0.3)', color: '#111',
              padding: '2px 6px', borderRadius: 'var(--radius)',
            }}>
              {configParts.length} PARTES
            </span>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#111', opacity: 0.7 }}
            >✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--color-accent)' }}>
          {(['config', 'cart'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '8px 4px',
                fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1,
                background: activeTab === tab ? 'var(--color-surface-2)' : 'var(--color-surface)',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--color-accent)' : '2px solid transparent',
                marginBottom: -2,
                color: activeTab === tab ? 'var(--color-accent)' : 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >
              {tab === 'config' ? 'CONFIGURACIÓN' : (
                <>CARRITO {cartItems.length > 0 && <span style={{ color: 'var(--color-accent)' }}>●</span>}</>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {activeTab === 'config' ? (
            <>
              {configParts.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                  No hay partes seleccionadas
                </p>
              ) : (
                configParts.map((part) => {
                  const isOwned = part.priceUSD > 0 && ownedPartIds.has(part.id);
                  const isNew = part.priceUSD > 0 && !ownedPartIds.has(part.id);

                  return (
                    <div key={part.id} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius)',
                      padding: '6px 8px', marginBottom: 6,
                      background: 'var(--color-surface-2)',
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: 36, height: 36, flexShrink: 0,
                        background: 'var(--color-border)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {part.thumbnail ? (
                          <img src={part.thumbnail} alt={part.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: 18 }}>🦸</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 0.5,
                          color: 'var(--color-text)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {part.name.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {getCategoryLabel(part.category)}
                        </div>
                      </div>

                      {/* Price status */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {isOwned && (
                          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>✓ YA TIENES</span>
                        )}
                        {isNew && (
                          <>
                            <div style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 700 }}>
                              ${part.priceUSD.toFixed(2)}
                            </div>
                            <div style={{ fontSize: 9, color: 'var(--color-text-faint)', textTransform: 'uppercase' }}>
                              NUEVO
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Summary */}
              {configParts.length > 0 && (
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 4 }}>
                  {ownedCount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Ya tienes</span>
                      <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>{ownedCount} {ownedCount === 1 ? 'parte' : 'partes'}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total nuevas</span>
                    <span style={{ fontFamily: 'var(--font-comic)', fontSize: 14, color: 'var(--color-accent)', letterSpacing: 1 }}>
                      ${newTotal.toFixed(2)}
                    </span>
                  </div>
                  {isAuthenticated && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Descuento registro</span>
                      <span style={{ fontFamily: 'var(--font-comic)', fontSize: 14, color: '#22c55e', letterSpacing: 1 }}>GRATIS</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Cart tab */
            <>
              {cartItems.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
                  El carrito está vacío
                </p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    padding: '6px 8px', marginBottom: 6,
                    background: 'var(--color-surface-2)',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-comic)', fontSize: 12, color: 'var(--color-text)' }}>
                        {item.name.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{item.category}</div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 700 }}>
                      ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14 }}
                    >✕</button>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer CTAs */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)' }}>
          {isAuthenticated ? (
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              style={{
                width: '100%', padding: '10px',
                background: isProcessing ? 'var(--color-border)' : 'var(--color-accent)',
                border: 'none', borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2,
                color: '#111', cursor: isProcessing ? 'not-allowed' : 'pointer',
                marginBottom: 6,
              }}
            >
              {isProcessing ? 'GUARDANDO...' : '⬇ GUARDAR EN BIBLIOTECA'}
            </button>
          ) : (
            <button
              onClick={onAuthRequired}
              style={{
                width: '100%', padding: '10px',
                background: 'var(--color-accent)',
                border: 'none', borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2,
                color: '#111', cursor: 'pointer',
                marginBottom: 6,
              }}
            >
              🔑 REGISTRARSE PARA GUARDAR
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '6px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--color-text-muted)', fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Editar configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run tests/ShoppingCart.test.tsx
```

Expected: PASS — 8 tests green

- [ ] **Step 5: Delete `StandardShoppingCart.tsx`**

```bash
rm "components/StandardShoppingCart.tsx"
```

- [ ] **Step 6: Update `App.tsx` imports and JSX**

In `App.tsx`:

**6a. Replace the import** (line 8):
```ts
// Delete: import StandardShoppingCart from './components/StandardShoppingCart';
// Add:
import ShoppingCart from './components/ShoppingCart';
```

**6b. Replace the `<StandardShoppingCart>` JSX block** (lines 1985–2001) with:
```tsx
{/* Shopping Cart */}
<ShoppingCart
  isOpen={isCartOpen}
  onClose={handleCloseCart}
  cartItems={cartItems}
  onRemoveItem={handleRemoveFromCart}
  onUpdateQuantity={handleUpdateCartQuantity}
  onClearCart={handleClearCart}
  onCheckout={handleCartCheckout}
  onAddCurrentConfig={handleAddToCart}
  currentConfiguration={selectedParts}
  onEditCategory={handleEditCategory}
  isAuthenticated={isAuthenticated}
  user={user}
  ownedPartIds={ownedPartIds}
  ownedPartIdsLoading={ownedPartIdsLoading}
/>
```

Note: `ownedPartIds` and `ownedPartIdsLoading` will be added to App.tsx state in Task 4.
For now, those props can be omitted temporarily — the props are optional (`?`) in the interface.

- [ ] **Step 7: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | grep -E "ShoppingCart|StandardShoppingCart" | head -10
```

Expected: 0 errors on these files.

- [ ] **Step 8: Commit**

```bash
git add components/ShoppingCart.tsx App.tsx tests/ShoppingCart.test.tsx
git rm components/StandardShoppingCart.tsx
git commit -m "feat: rewrite ShoppingCart in Dark Comics + delete StandardShoppingCart"
```

---

## Chunk 4: PurchaseConfirmation rewrite + App.tsx wiring

### Task 4: Rewrite `PurchaseConfirmation.tsx` + wire `ownedPartIds` in `App.tsx`

**Files:**
- Rewrite: `components/PurchaseConfirmation.tsx`
- Modify: `App.tsx` — add `ownedPartIds` state + update `purchaseData` type + update JSX (all atomic)
- Test: `tests/PurchaseConfirmation.test.tsx` (new file)

- [ ] **Step 1: Write the failing tests**

Create `tests/PurchaseConfirmation.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PurchaseConfirmation from '../components/PurchaseConfirmation';
import { PartCategory, ArchetypeId } from '../types';

// Mock ARCHETYPE_DATA
vi.mock('../lib/archetypeData', () => ({
  ARCHETYPE_DATA: {
    [ArchetypeId.STRONG]: { title: 'THE POWERHOUSE', name: 'STRONG' },
  },
}));

const makePart = (id: string) => ({
  id, name: `Part ${id}`, category: PartCategory.TORSO,
  priceUSD: 0, compatible: [], attributes: {},
});

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  purchasedParts: [makePart('p1'), makePart('p2')],
  modelName: 'Mi Héroe',
  archetypeId: ArchetypeId.STRONG,
};

describe('PurchaseConfirmation', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders the HÉROE GUARDADO header', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.getByText(/HÉROE GUARDADO/i)).toBeInTheDocument();
  });

  it('shows the hero name in an editable input', () => {
    render(<PurchaseConfirmation {...defaultProps} modelName="Batman Pro" />);
    const input = screen.getByDisplayValue('Batman Pro');
    expect(input.tagName).toBe('INPUT');
  });

  it('calls onModelNameChange on blur', () => {
    const onModelNameChange = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onModelNameChange={onModelNameChange} />);
    const input = screen.getByDisplayValue('Mi Héroe');
    fireEvent.change(input, { target: { value: 'Nuevo Nombre' } });
    fireEvent.blur(input);
    expect(onModelNameChange).toHaveBeenCalledWith('Nuevo Nombre');
  });

  it('shows archetype title from ARCHETYPE_DATA', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.getByText(/THE POWERHOUSE/i)).toBeInTheDocument();
  });

  it('lists all purchased parts with GUARDADO label', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.getByText(/Part p1/i)).toBeInTheDocument();
    expect(screen.getByText(/Part p2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/GUARDADO/i).length).toBeGreaterThanOrEqual(2);
  });

  it('shows DESCARGAR GLB button when onExportGLB provided', () => {
    const onExportGLB = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onExportGLB={onExportGLB} />);
    const btn = screen.getByText(/DESCARGAR GLB/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onExportGLB).toHaveBeenCalled();
  });

  it('hides DESCARGAR GLB when onExportGLB not provided', () => {
    render(<PurchaseConfirmation {...defaultProps} />);
    expect(screen.queryByText(/DESCARGAR GLB/i)).not.toBeInTheDocument();
  });

  it('calls onClose when SEGUIR PERSONALIZANDO clicked', () => {
    const onClose = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText(/SEGUIR PERSONALIZANDO/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onOpenLibrary and onClose when VER EN BIBLIOTECA clicked', () => {
    const onClose = vi.fn();
    const onOpenLibrary = vi.fn();
    render(<PurchaseConfirmation {...defaultProps} onClose={onClose} onOpenLibrary={onOpenLibrary} />);
    fireEvent.click(screen.getByText(/VER EN BIBLIOTECA/i));
    expect(onOpenLibrary).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    render(<PurchaseConfirmation {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/HÉROE GUARDADO/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npx vitest run tests/PurchaseConfirmation.test.tsx
```

Expected: FAIL — current component has different interface.

- [ ] **Step 3: Rewrite `components/PurchaseConfirmation.tsx`**

Replace the entire file:

```tsx
import React, { useState } from 'react';
import { Part, ArchetypeId } from '../types';
import { ARCHETYPE_DATA } from '../lib/archetypeData';

interface PurchaseConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedParts: Part[];
  modelName: string;
  onModelNameChange?: (name: string) => void;
  archetypeId: ArchetypeId;
  onExportGLB?: () => void;
  onOpenLibrary?: () => void;
}

const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  isOpen,
  onClose,
  purchasedParts,
  modelName,
  onModelNameChange,
  archetypeId,
  onExportGLB,
  onOpenLibrary,
}) => {
  const [name, setName] = useState(modelName);

  if (!isOpen) return null;

  const archetypeTitle =
    ARCHETYPE_DATA[archetypeId]?.title?.toUpperCase() ?? archetypeId.toUpperCase();

  const getCategoryLabel = (category: string) =>
    category.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

  const handleBlur = () => {
    onModelNameChange?.(name);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)', zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: 400, maxHeight: '85vh',
        background: 'var(--color-surface)',
        border: '2px solid var(--color-accent)',
        borderRadius: 'var(--radius)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 16, letterSpacing: 2 }}>
            🎯 ¡HÉROE GUARDADO!
          </span>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#111', opacity: 0.7 }}
          >✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero preview */}
          <div style={{
            padding: '20px 16px 12px',
            background: 'var(--color-surface-2)',
            borderBottom: '1px solid var(--color-border)',
            textAlign: 'center',
            position: 'relative',
          }}>
            {/* Radial glow */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse, rgba(245,158,11,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* Sparkles */}
            {['✦', '★', '✦', '★'].map((s, i) => (
              <span key={i} style={{
                position: 'absolute',
                fontSize: 12, opacity: 0.6,
                top: ['12%', '18%', '65%', '70%'][i],
                left: ['12%', '78%', '8%', '80%'][i],
                animation: `float-spark-${i % 2} 2s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}>{s}</span>
            ))}

            {/* Silhouette */}
            <div style={{
              width: 80, height: 110,
              background: 'linear-gradient(180deg, var(--color-border-strong), var(--color-surface))',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius)',
              margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem',
            }}>🦸</div>

            {/* Editable name */}
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              onBlur={handleBlur}
              maxLength={40}
              style={{
                fontFamily: 'var(--font-comic)', fontSize: 20, letterSpacing: 2,
                color: 'var(--color-accent)',
                background: 'transparent', border: 'none', outline: 'none',
                textAlign: 'center', width: '100%',
                cursor: 'text',
              }}
            />

            {/* Subtitle */}
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>
              {archetypeTitle} · {purchasedParts.length} PARTES
            </div>
          </div>

          {/* Parts list */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-faint)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
              PARTES GUARDADAS
            </div>
            <div style={{ maxHeight: 180, overflowY: 'auto' }}>
              {purchasedParts.map((part) => (
                <div key={part.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '5px 0',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--color-text)' }}>{part.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {getCategoryLabel(part.category)}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>✓ GUARDADO</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {onExportGLB && (
            <button
              onClick={onExportGLB}
              style={{
                width: '100%', padding: '10px',
                background: 'var(--color-accent)', border: 'none',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2,
                color: '#111', cursor: 'pointer',
              }}
            >⬇ DESCARGAR GLB</button>
          )}
          <button
            onClick={() => { onOpenLibrary?.(); onClose(); }}
            style={{
              width: '100%', padding: '7px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1,
              color: 'var(--color-text-muted)', cursor: 'pointer',
            }}
          >📚 VER EN BIBLIOTECA</button>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '7px',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1,
              color: 'var(--color-text-muted)', cursor: 'pointer',
            }}
          >🎲 SEGUIR PERSONALIZANDO</button>
        </div>

        {/* Sparkle keyframes */}
        <style>{`
          @keyframes float-spark-0 {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
            50% { transform: translateY(-6px) rotate(15deg); opacity: 1; }
          }
          @keyframes float-spark-1 {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
            50% { transform: translateY(-8px) rotate(-10deg); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PurchaseConfirmation;
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npx vitest run tests/PurchaseConfirmation.test.tsx
```

Expected: PASS — 10 tests green

- [ ] **Step 5: Wire `ownedPartIds` state and update `purchaseData` in `App.tsx` (atomic)**

This step changes three things simultaneously in `App.tsx`. They must all be done before running TypeScript check.

**5a. Add ownedPartIds state** — after the `cartItems` useState (around line 162), add:

```ts
const [ownedPartIds, setOwnedPartIds] = useState<Set<string>>(new Set());
const [ownedPartIdsLoading, setOwnedPartIdsLoading] = useState(false);
```

**5b. Replace `purchaseData` state type** (lines 166–171):

```ts
// Old:
// const [purchaseData, setPurchaseData] = useState<{
//   items: CartItem[];
//   totalPaid: number;
//   isGuestUser?: boolean;
//   guestEmail?: string;
// } | null>(null);

// New:
const [purchaseData, setPurchaseData] = useState<{
  parts: Part[];
  modelName: string;
  archetypeId: ArchetypeId;
} | null>(null);
```

**5c. Add `useEffect` to load `ownedPartIds`** — after the existing auth useEffects (search for similar `useEffect(() => { if (!user?.id)` patterns), add:

```ts
// Load owned part IDs when user authenticates
useEffect(() => {
  if (!user?.id) { setOwnedPartIds(new Set()); return; }
  setOwnedPartIdsLoading(true);
  PurchaseHistoryService.getOwnedPartIds(user.id)
    .then(setOwnedPartIds)
    .finally(() => setOwnedPartIdsLoading(false));
}, [user?.id]);
```

**5d. Add import** for `PurchaseHistoryService` if not already imported:
```ts
import { PurchaseHistoryService } from './services/purchaseHistoryService';
```

**5e. Update `handleCartCheckout`** — find the `setPurchaseData({` call inside `handleCartCheckout` (around line 1199) and replace it:

```ts
// Replace the old setPurchaseData call with:
setPurchaseData({
  parts: Object.values(currentConfiguration).filter(Boolean) as Part[],
  modelName: ARCHETYPE_DATA[selectedArchetype ?? ArchetypeId.STRONG]?.title ?? 'Mi Héroe',
  archetypeId: selectedArchetype ?? ArchetypeId.STRONG,
});
```

Also, after `saveResult.success`, add the re-fetch (same location as the existing `loadUserPoses()` call):
```ts
PurchaseHistoryService.getOwnedPartIds(user.id).then(setOwnedPartIds);
```

**5f. Update the `<PurchaseConfirmation>` JSX block** (lines ~2003–2015):

```tsx
{isPurchaseConfirmationOpen && purchaseData && (
  <PurchaseConfirmation
    isOpen={isPurchaseConfirmationOpen}
    onClose={handleClosePurchaseConfirmation}
    purchasedParts={purchaseData.parts}
    modelName={purchaseData.modelName}
    archetypeId={purchaseData.archetypeId}
    onExportGLB={handleExportGLB}
    onOpenLibrary={() => {
      setIsPurchaseConfirmationOpen(false);
      setPurchaseData(null);
      setIsPurchaseLibraryOpen(true);
    }}
  />
)}
```

**5g. Pass `ownedPartIds` to PartSelectorPanel** — find all `<PartSelectorPanel` usages in App.tsx and add the prop:
```tsx
ownedPartIds={ownedPartIds}
```

- [ ] **Step 6: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: 0 errors on the modified files. Pre-existing errors on unrelated files are acceptable.

- [ ] **Step 7: Run full test suite**

```bash
npx vitest run
```

Expected: All new tests pass. Pre-existing tests unaffected.

- [ ] **Step 8: Commit (atomic — all App.tsx changes together)**

```bash
git add components/PurchaseConfirmation.tsx App.tsx tests/PurchaseConfirmation.test.tsx
git commit -m "feat: rewrite PurchaseConfirmation + wire ownedPartIds in App.tsx"
```

---

## Final: Push

```bash
git push origin feat/dark-comics-redesign
```
