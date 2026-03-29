import { supabase } from '../lib/supabase';
import { SelectedParts, Part } from '../types';

export interface PurchaseAnalysis {
  existingParts: { [category: string]: Part };
  newParts: { [category: string]: Part };
  modifiedParts: { [category: string]: { old: Part; new: Part } };
  totalExistingValue: number;
  totalNewValue: number;
  totalModifiedValue: number;
  finalPrice: number;
  savings: number;
  savingsPercentage: number;
}

export interface UserPurchaseHistory {
  userId: string;
  purchases: Array<{
    id: string;
    configuration: SelectedParts;
    purchaseDate: string;
    totalPaid: number;
  }>;
}

export class PurchaseAnalysisService {
  
  /**
   * Obtener historial completo de compras del usuario
   */
  static async getUserPurchaseHistory(userId: string): Promise<UserPurchaseHistory> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          id,
          purchase_date,
          total_price,
          purchase_items (
            configuration_data
          )
        `)
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) {
        console.error('Error fetching purchase history:', error);
        return { userId, purchases: [] };
      }

      const purchases = data?.map(purchase => ({
        id: purchase.id,
        configuration: purchase.purchase_items?.[0]?.configuration_data || {},
        purchaseDate: purchase.purchase_date,
        totalPaid: purchase.total_price
      })) || [];

      return { userId, purchases };
    } catch (error) {
      console.error('Error in getUserPurchaseHistory:', error);
      return { userId, purchases: [] };
    }
  }

  /**
   * Analizar configuración actual vs compras existentes
   */
  static analyzeConfiguration(
    currentConfiguration: SelectedParts,
    userHistory: UserPurchaseHistory
  ): PurchaseAnalysis {
    console.log('🔍 Analizando configuración vs historial de compras...');
    
    // Obtener todas las partes que el usuario ya ha comprado
    const allExistingParts: { [category: string]: Part } = {};
    let totalExistingValue = 0;

    userHistory.purchases.forEach((purchase) => {
      Object.entries(purchase.configuration).forEach(([category, part]) => {
        if (part && !allExistingParts[category]) {
          allExistingParts[category] = part as Part;
          totalExistingValue += (part as Part).priceUSD || 0;
        }
      });
    });

    console.log(`📦 Partes existentes encontradas: ${Object.keys(allExistingParts).length}`);
    console.log(`💰 Valor total de partes existentes: $${totalExistingValue.toFixed(2)}`);

    // Identificar partes nuevas y modificadas
    const newParts: { [category: string]: Part } = {};
    const modifiedParts: { [category: string]: { old: Part; new: Part } } = {};
    let totalNewValue = 0;
    let totalModifiedValue = 0;

    Object.entries(currentConfiguration).forEach(([category, currentPart]) => {
      if (!currentPart) return;

      const existingPart = allExistingParts[category];

      if (!existingPart) {
        // Parte completamente nueva
        newParts[category] = currentPart;
        totalNewValue += currentPart.priceUSD || 0;
        console.log(`🆕 Nueva parte: ${category} - ${currentPart.name} ($${(currentPart.priceUSD || 0).toFixed(2)})`);
      } else if (existingPart.id !== currentPart.id) {
        // Parte modificada (diferente ID)
        modifiedParts[category] = {
          old: existingPart,
          new: currentPart
        };
        totalModifiedValue += currentPart.priceUSD || 0;
        console.log(`🔄 Parte modificada: ${category} - ${existingPart.name} → ${currentPart.name} ($${(currentPart.priceUSD || 0).toFixed(2)})`);
      } else {
        // Parte idéntica (ya comprada)
        console.log(`✅ Parte ya comprada: ${category} - ${currentPart.name}`);
      }
    });

    // Calcular precio final y ahorros
    const totalCurrentValue = Object.values(currentConfiguration)
      .filter(part => part)
      .reduce((sum, part) => sum + (part?.priceUSD || 0), 0);

    const finalPrice = totalNewValue + totalModifiedValue;
    const savings = totalCurrentValue - finalPrice;
    const savingsPercentage = totalCurrentValue > 0 ? (savings / totalCurrentValue) * 100 : 0;

    const analysis: PurchaseAnalysis = {
      existingParts: allExistingParts,
      newParts,
      modifiedParts,
      totalExistingValue,
      totalNewValue,
      totalModifiedValue,
      finalPrice,
      savings,
      savingsPercentage
    };

    console.log('\n📊 RESUMEN DEL ANÁLISIS:');
    console.log(`   Partes existentes: ${Object.keys(allExistingParts).length}`);
    console.log(`   Partes nuevas: ${Object.keys(newParts).length}`);
    console.log(`   Partes modificadas: ${Object.keys(modifiedParts).length}`);
    console.log(`   Valor total actual: $${totalCurrentValue.toFixed(2)}`);
    console.log(`   Precio final: $${finalPrice.toFixed(2)}`);
    console.log(`   Ahorro: $${savings.toFixed(2)} (${savingsPercentage.toFixed(1)}%)`);

    return analysis;
  }

  /**
   * ✨ NUEVA FUNCIONALIDAD: Verificar si el usuario ya tiene la configuración completa
   */
  static hasCompleteConfiguration(
    currentConfiguration: SelectedParts,
    userHistory: UserPurchaseHistory
  ): boolean {
    if (Object.keys(currentConfiguration).length === 0) return false;
    
    // Obtener todas las partes que el usuario ya ha comprado
    const allExistingParts: { [category: string]: Part } = {};
    
    userHistory.purchases.forEach((purchase) => {
      Object.entries(purchase.configuration).forEach(([category, part]) => {
        if (part && !allExistingParts[category]) {
          allExistingParts[category] = part as Part;
        }
      });
    });

    // Verificar si todas las partes de la configuración actual ya están compradas
    const currentCategories = Object.keys(currentConfiguration).filter(cat => currentConfiguration[cat]);
    const existingCategories = Object.keys(allExistingParts);
    
    // Verificar que todas las categorías actuales estén en las existentes
    const hasAllCategories = currentCategories.every(category => 
      existingCategories.includes(category)
    );

    if (!hasAllCategories) return false;

    // Verificar que todas las partes específicas sean idénticas
    const allPartsMatch = currentCategories.every(category => {
      const currentPart = currentConfiguration[category];
      const existingPart = allExistingParts[category];
      return currentPart && existingPart && currentPart.id === existingPart.id;
    });

    return allPartsMatch;
  }

  /**
   * ✨ NUEVA FUNCIONALIDAD: Obtener solo las partes que debe pagar
   */
  static getPayableParts(
    currentConfiguration: SelectedParts,
    userHistory: UserPurchaseHistory
  ): { [category: string]: Part } {
    const analysis = this.analyzeConfiguration(currentConfiguration, userHistory);
    
    // Combinar partes nuevas y modificadas (estas son las que debe pagar)
    const payableParts: { [category: string]: Part } = { ...analysis.newParts };
    
    // Agregar solo la parte nueva de las modificadas
    Object.entries(analysis.modifiedParts).forEach(([category, { new: newPart }]) => {
      payableParts[category] = newPart;
    });
    
    return payableParts;
  }

  /**
   * ✨ NUEVA FUNCIONALIDAD: Obtener precio final optimizado
   */
  static getOptimizedPrice(
    currentConfiguration: SelectedParts,
    userHistory: UserPurchaseHistory
  ): { 
    originalPrice: number; 
    finalPrice: number; 
    savings: number; 
    isCompleteConfiguration: boolean;
    payableParts: { [category: string]: Part };
  } {
    const analysis = this.analyzeConfiguration(currentConfiguration, userHistory);
    const isCompleteConfiguration = this.hasCompleteConfiguration(currentConfiguration, userHistory);
    
    const originalPrice = Object.values(currentConfiguration)
      .filter(part => part)
      .reduce((sum, part) => sum + (part?.priceUSD || 0), 0);

    // Si tiene la configuración completa, precio final es $0
    const finalPrice = isCompleteConfiguration ? 0 : analysis.finalPrice;
    const savings = originalPrice - finalPrice;
    const payableParts = this.getPayableParts(currentConfiguration, userHistory);

    return {
      originalPrice,
      finalPrice,
      savings,
      isCompleteConfiguration,
      payableParts
    };
  }

  /**
   * Verificar si una parte específica ya fue comprada
   */
  static isPartAlreadyPurchased(
    partId: string,
    userHistory: UserPurchaseHistory
  ): boolean {
    return userHistory.purchases.some(purchase =>
      Object.values(purchase.configuration).some(part => part?.id === partId)
    );
  }

  /**
   * Obtener el precio de descuento para una configuración
   */
  static getDiscountedPrice(
    currentConfiguration: SelectedParts,
    userHistory: UserPurchaseHistory
  ): { originalPrice: number; discountedPrice: number; savings: number } {
    const analysis = this.analyzeConfiguration(currentConfiguration, userHistory);
    
    const originalPrice = Object.values(currentConfiguration)
      .filter(part => part)
      .reduce((sum, part) => sum + (part?.priceUSD || 0), 0);

    return {
      originalPrice,
      discountedPrice: analysis.finalPrice,
      savings: analysis.savings
    };
  }

  /**
   * Generar descripción detallada del análisis
   */
  static generateAnalysisDescription(analysis: PurchaseAnalysis): string {
    const parts = [];

    if (Object.keys(analysis.newParts).length > 0) {
      const newPartsList = Object.entries(analysis.newParts)
        .map(([category, part]) => `${part.name} (${category})`)
        .join(', ');
      parts.push(`🆕 **Nuevas partes:** ${newPartsList}`);
    }

    if (Object.keys(analysis.modifiedParts).length > 0) {
      const modifiedPartsList = Object.entries(analysis.modifiedParts)
        .map(([category, { old, new: newPart }]) => `${old.name} → ${newPart.name} (${category})`)
        .join(', ');
      parts.push(`🔄 **Partes modificadas:** ${modifiedPartsList}`);
    }

    if (Object.keys(analysis.existingParts).length > 0) {
      const existingPartsList = Object.entries(analysis.existingParts)
        .map(([category, part]) => `${part.name} (${category})`)
        .join(', ');
      parts.push(`✅ **Partes ya compradas:** ${existingPartsList}`);
    }

    const summary = [
      `💰 **Precio original:** $${(analysis.finalPrice + analysis.savings).toFixed(2)}`,
      `💳 **Precio final:** $${analysis.finalPrice.toFixed(2)}`,
      `🎉 **Ahorro:** $${analysis.savings.toFixed(2)} (${analysis.savingsPercentage.toFixed(1)}%)`
    ];

    return [...parts, ...summary].join('\n');
  }

  /**
   * Verificar si el usuario tiene suficientes compras para aplicar descuentos
   */
  static hasPurchaseHistory(userHistory: UserPurchaseHistory): boolean {
    return userHistory.purchases.length > 0;
  }

  /**
   * Obtener estadísticas de compras del usuario
   */
  static getUserPurchaseStats(userHistory: UserPurchaseHistory): {
    totalPurchases: number;
    totalSpent: number;
    averagePurchaseValue: number;
    lastPurchaseDate: string | null;
  } {
    if (userHistory.purchases.length === 0) {
      return {
        totalPurchases: 0,
        totalSpent: 0,
        averagePurchaseValue: 0,
        lastPurchaseDate: null
      };
    }

    const totalSpent = userHistory.purchases.reduce((sum, purchase) => sum + purchase.totalPaid, 0);
    const averagePurchaseValue = totalSpent / userHistory.purchases.length;
    const lastPurchaseDate = userHistory.purchases[0]?.purchaseDate || null;

    return {
      totalPurchases: userHistory.purchases.length,
      totalSpent,
      averagePurchaseValue,
      lastPurchaseDate
    };
  }
} 