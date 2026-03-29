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
