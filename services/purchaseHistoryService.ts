import { supabase } from '../lib/supabase';
import { SelectedParts } from '../types';

export interface Purchase {
  id: string;
  user_id: string;
  configuration_name: string;
  configuration_data: SelectedParts;
  total_price: number;
  purchase_date: string;
  items_count: number;
  status: 'completed' | 'pending' | 'failed';
  purchase_items?: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  configuration_data: SelectedParts;
}

export class PurchaseHistoryService {
  
  /**
   * Guardar una compra completa en Supabase
   */
  static async savePurchase(
    userId: string,
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      configuration: SelectedParts;
    }>,
    totalPrice: number
  ): Promise<{ success: boolean; purchaseId?: string; error?: string }> {
    try {
      // Crear el registro de compra principal
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          configuration_name: `Compra ${new Date().toLocaleDateString()}`,
          total_price: totalPrice,
          items_count: items.reduce((sum, item) => sum + item.quantity, 0),
          status: 'completed',
          purchase_date: new Date().toISOString()
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Error saving purchase:', purchaseError);
        return { success: false, error: purchaseError.message };
      }

      // Crear los items individuales de la compra
      const purchaseItems = items.map(item => ({
        purchase_id: purchase.id,
        item_name: item.name,
        item_price: item.price,
        quantity: item.quantity,
        configuration_data: item.configuration
      }));

      const { error: itemsError } = await supabase
        .from('purchase_items')
        .insert(purchaseItems);

      if (itemsError) {
        console.error('Error saving purchase items:', itemsError);
        return { success: false, error: itemsError.message };
      }

      return { success: true, purchaseId: purchase.id };

    } catch (error) {
      console.error('Error in savePurchase:', error);
      return { success: false, error: 'Error inesperado al guardar la compra' };
    }
  }

  /**
   * Obtener el historial de compras del usuario
   */
  static async getUserPurchases(userId: string): Promise<{
    success: boolean;
    purchases?: Purchase[];
    error?: string;
  }> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          purchase_items (*)
        `)
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Error fetching purchases:', error);
        return { success: false, error: error.message };
      }

      return { success: true, purchases: data || [] };

    } catch (error) {
      console.error('Error in getUserPurchases:', error);
      return { success: false, error: 'Error al cargar el historial de compras' };
    }
  }

  /**
   * Obtener una compra específica con todos sus items
   */
  static async getPurchaseById(purchaseId: string): Promise<{
    success: boolean;
    purchase?: Purchase & { items: PurchaseItem[] };
    error?: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          purchase_items (*)
        `)
        .eq('id', purchaseId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching purchase:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        purchase: {
          ...data,
          items: data.purchase_items || []
        }
      };

    } catch (error) {
      console.error('Error in getPurchaseById:', error);
      return { success: false, error: 'Error al cargar la compra' };
    }
  }

  /**
   * Cargar una configuración desde el historial de compras
   */
  static async loadConfigurationFromPurchase(purchaseId: string, itemId: string): Promise<{ success: boolean; configuration?: SelectedParts; error?: string }> {
    try {
      const { data: purchase, error } = await supabase
        .from('purchases')
        .select(`
          id,
          purchase_items!inner(
            id,
            configuration_data
          )
        `)
        .eq('id', purchaseId)
        .eq('purchase_items.id', itemId)
        .single();

      if (error) {
        console.error('Error loading purchase:', error);
        return { success: false, error: error.message };
      }

      if (!purchase || !purchase.purchase_items || purchase.purchase_items.length === 0) {
        return { success: false, error: 'Purchase or item not found' };
      }

      const item = purchase.purchase_items[0];
      if (!item.configuration_data) {
        return { success: false, error: 'No configuration data found' };
      }

      return { success: true, configuration: item.configuration_data };
    } catch (error) {
      console.error('Error in loadConfigurationFromPurchase:', error);
      return { success: false, error: 'Failed to load configuration' };
    }
  }

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
} 
