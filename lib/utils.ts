import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as THREE from 'three';
import { ALL_PARTS } from '../constants';
import { PartCategory, SelectedParts, Part, RPGCharacterSync } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Funciones de asignación de partes ---
// 🛡️ PROTEGIDO: NO MODIFICAR ESTAS FUNCIONES - SISTEMA DE COMPATIBILIDAD CRÍTICO

// 🛡️ FUNCIÓN PROTEGIDA - assignDefaultHandsForTorso
// ✅ PATRÓN BASE para todas las funciones de compatibilidad
// ❌ NO CAMBIAR la lógica de preservación de tipos de arma y guantes
export function assignDefaultHandsForTorso(newTorso: Part, currentParts: SelectedParts): SelectedParts {
  let newParts = { ...currentParts };
  // ✅ CORREGIDO: NO eliminar manos existentes - preservarlas
  // Las manos se preservan automáticamente en currentParts
  
  // For suit_torso, use the base torso ID from the compatible array for lookups
  const effectiveTorsoId = newTorso.category === PartCategory.SUIT_TORSO && newTorso.compatible.length > 0
    ? newTorso.compatible[0]
    : newTorso.id;

  const torsoMatch = effectiveTorsoId.match(/strong_torso_(\d+)/);
  if (!torsoMatch) return newParts;

  const getHandType = (handId: string): string | null => {
    // Verificar tipos específicos primero usando el patrón correcto
    if (handId.includes('hands_pistol_')) return 'pistol';
    if (handId.includes('hands_hammer_')) return 'hammer';
    if (handId.includes('hands_fist_')) return 'fist';
    if (handId.includes('hands_noweapon_')) return 'noweapon';
    if (handId.includes('hands_bands_')) return 'bands';
    
    // Fallback para otros patrones
    const match = handId.match(/hands_([a-z]+)_\d+_t\d+_[lr]/);
    if (match) return match[1];
    const fallback = handId.match(/hands_([a-z]+)_\d+/);
    if (fallback) return fallback[1];
    
    return null;
  };
  
  const getGloveStatus = (hand: Part): boolean => {
    // ✅ CORREGIDO: Determinar guantes basándose en el ID de la mano
    // Las manos con guantes terminan en _g, las sin guantes en _ng
    return hand.id.endsWith('_g');
  };
  
  const currentLeftHand = Object.values(currentParts).find(p => p.category === PartCategory.HAND_LEFT);
  const currentRightHand = Object.values(currentParts).find(p => p.category === PartCategory.HAND_RIGHT);
  const currentLeftType = currentLeftHand ? getHandType(currentLeftHand.id) : null;
  const currentRightType = currentRightHand ? getHandType(currentRightHand.id) : null;
  
  const currentLeftGlove = currentLeftHand ? getGloveStatus(currentLeftHand) : false;
  const currentRightGlove = currentRightHand ? getGloveStatus(currentRightHand) : false;
  
  const compatibleLeftHands = ALL_PARTS.filter(p =>
    p.category === PartCategory.HAND_LEFT &&
    p.archetype === newTorso.archetype &&
    p.compatible.includes(effectiveTorsoId)
  );
  const compatibleRightHands = ALL_PARTS.filter(p =>
    p.category === PartCategory.HAND_RIGHT &&
    p.archetype === newTorso.archetype &&
    p.compatible.includes(effectiveTorsoId)
  );
  
  const findMatchingHand = (hands: Part[], targetType: string | null, targetGlove: boolean): Part | null => {
    if (!targetType) return hands.find(p => !getGloveStatus(p)) || hands[0];
    let matchingHand = hands.find(p => {
      const handType = getHandType(p.id);
      const handGlove = getGloveStatus(p);
      return handType === targetType && handGlove === targetGlove;
    });
    
    if (!matchingHand) {
      // Si no encuentra coincidencia exacta, buscar solo por tipo
      matchingHand = hands.find(p => getHandType(p.id) === targetType);
    }
    
    if (!matchingHand) {
      // Si aún no encuentra, buscar solo por guantes
      matchingHand = hands.find(p => getGloveStatus(p) === targetGlove);
    }
    
    return matchingHand || hands[0];
  };
  
  // Asignar manos compatibles preservando tipo y guantes
  if (compatibleLeftHands.length > 0) {
    const matchingLeftHand = findMatchingHand(compatibleLeftHands, currentLeftType, currentLeftGlove);
    if (matchingLeftHand) {
      newParts[PartCategory.HAND_LEFT] = matchingLeftHand;
    }
  }
  
  if (compatibleRightHands.length > 0) {
    const matchingRightHand = findMatchingHand(compatibleRightHands, currentRightType, currentRightGlove);
    if (matchingRightHand) {
      newParts[PartCategory.HAND_RIGHT] = matchingRightHand;
    }
  }
  
  return newParts;
}

// 🛡️ FUNCIÓN PROTEGIDA - assignAdaptiveHeadForTorso
// ✅ Preserva cabezas compatibles del mismo tipo
// ❌ NO CAMBIAR la lógica de compatibilidad y tipos
export function assignAdaptiveHeadForTorso(newTorso: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  if (import.meta.env.DEV) console.log('🔍 assignAdaptiveHeadForTorso called with:', {
    newTorsoId: newTorso.id,
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });

  let newParts = { ...currentParts };

  // For suit_torso, use the base torso ID for compatibility lookups
  const effectiveTorsoId = newTorso.category === PartCategory.SUIT_TORSO && newTorso.compatible.length > 0
    ? newTorso.compatible[0]
    : newTorso.id;

  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  if (import.meta.env.DEV) console.log('🔍 Parts to check for current head:', Object.keys(partsToCheck));
  const currentHead = Object.values(partsToCheck).find(p => p.category === PartCategory.HEAD);
  if (import.meta.env.DEV) console.log('🔍 Current head found:', currentHead?.id || 'none');

  // Si no hay cabeza actual, usar la primera compatible
  if (!currentHead) {
    const compatibleHeads = ALL_PARTS.filter(p =>
      p.category === PartCategory.HEAD &&
      p.archetype === newTorso.archetype &&
      p.compatible.includes(effectiveTorsoId)
    );
    
    if (compatibleHeads.length > 0) {
      if (import.meta.env.DEV) console.log('📌 No current head, using first compatible:', compatibleHeads[0].id);
      newParts[PartCategory.HEAD] = compatibleHeads[0];
    }
    return newParts;
  }
  
  // Verificar si la cabeza actual es compatible con el nuevo torso
  const isCurrentHeadCompatible = currentHead.compatible.includes(effectiveTorsoId);

  if (isCurrentHeadCompatible) {
    if (import.meta.env.DEV) console.log('✅ Current head is compatible, keeping:', currentHead.id);
    return newParts;
  }

  // La cabeza actual no es compatible, buscar una del mismo tipo
  let currentType = null;
  const headMatch = currentHead.id.match(/strong_head_(\d+)_t\d+/);
  if (headMatch) {
    currentType = headMatch[1];
  }

  if (import.meta.env.DEV) console.log('🎯 Current head info:', { currentHeadId: currentHead.id, currentType, headMatch: headMatch ? headMatch[0] : 'no match' });

  const compatibleHeads = ALL_PARTS.filter(p =>
    p.category === PartCategory.HEAD &&
    p.archetype === newTorso.archetype &&
    p.compatible.includes(effectiveTorsoId)
  );

  if (import.meta.env.DEV) console.log('✅ Compatible heads found:', compatibleHeads.length, 'heads for torso:', effectiveTorsoId);
  if (import.meta.env.DEV) console.log('✅ Compatible heads IDs:', compatibleHeads.map(h => h.id));
  
  // Buscar una cabeza del mismo tipo
  if (currentType) {
    if (import.meta.env.DEV) console.log('🔍 Looking for head type:', currentType);
    const matchingHead = compatibleHeads.find(p => p.id.includes(`strong_head_${currentType}_`));
    if (matchingHead) {
      if (import.meta.env.DEV) console.log('🎯 Found matching head type:', matchingHead.id);
      newParts[PartCategory.HEAD] = matchingHead;
      return newParts;
    } else {
      if (import.meta.env.DEV) console.log('❌ No matching head type found for type:', currentType);
    }
  }
  
  // Si no encuentra del mismo tipo, usar la primera compatible
  if (compatibleHeads.length > 0) {
    if (import.meta.env.DEV) console.log('📌 No matching type found, using first compatible:', compatibleHeads[0].id);
    newParts[PartCategory.HEAD] = compatibleHeads[0];
  } else {
    if (import.meta.env.DEV) console.log('❌ No compatible heads found for torso:', effectiveTorsoId);
    // Limpiar cabeza si no hay compatibles
    delete newParts[PartCategory.HEAD];
  }
  
  return newParts;
}

export function assignAdaptiveCapeForTorso(newTorso: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  if (import.meta.env.DEV) console.log('🔍 assignAdaptiveCapeForTorso called with:', {
    newTorsoId: newTorso.id,
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });

  let newParts = { ...currentParts };

  // For suit_torso, use the base torso ID for compatibility lookups
  const effectiveTorsoId = newTorso.category === PartCategory.SUIT_TORSO && newTorso.compatible.length > 0
    ? newTorso.compatible[0]
    : newTorso.id;

  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  if (import.meta.env.DEV) console.log('🔍 Parts to check for current cape:', Object.keys(partsToCheck));
  const currentCape = Object.values(partsToCheck).find(p => p.category === PartCategory.CAPE);
  if (import.meta.env.DEV) console.log('🔍 Current cape found:', currentCape?.id || 'none');

  // Buscar todas las capas compatibles con el nuevo torso
  const compatibleCapes = ALL_PARTS.filter(p =>
    p.category === PartCategory.CAPE &&
    p.archetype === newTorso.archetype &&
    p.compatible.includes(effectiveTorsoId)
  );

  if (import.meta.env.DEV) console.log('✅ Compatible capes found:', compatibleCapes.length, 'capes for torso:', effectiveTorsoId);
  if (import.meta.env.DEV) console.log('✅ Compatible capes IDs:', compatibleCapes.map(c => c.id));

  // Si no hay capa actual, usar la primera compatible
  if (!currentCape) {
    if (compatibleCapes.length > 0) {
      if (import.meta.env.DEV) console.log('📌 No current cape, using first compatible:', compatibleCapes[0].id);
      newParts[PartCategory.CAPE] = compatibleCapes[0];
    }
    return newParts;
  }

  // Verificar si la capa actual es compatible con el nuevo torso
  const isCurrentCapeCompatible = currentCape.compatible.includes(effectiveTorsoId);
  
  if (isCurrentCapeCompatible) {
    if (import.meta.env.DEV) console.log('✅ Current cape is compatible, keeping:', currentCape.id);
    // No hacer nada, mantener la capa actual
    return newParts;
  }

  // La capa actual no es compatible, buscar una del mismo tipo
  let currentType = null;
  const capeMatch = currentCape.id.match(/strong_cape_(\d+)_t\d+/);
  if (capeMatch) {
    currentType = capeMatch[1];
  }
  
  if (import.meta.env.DEV) console.log('🎯 Current cape info:', { currentCapeId: currentCape.id, currentType, capeMatch: capeMatch ? capeMatch[0] : 'no match' });

  // Buscar una capa del mismo tipo que sea compatible
  if (currentType) {
    if (import.meta.env.DEV) console.log('🔍 Looking for cape type:', currentType);
    const matchingCape = compatibleCapes.find(p => p.id.includes(`strong_cape_${currentType}_`));
    if (matchingCape) {
      if (import.meta.env.DEV) console.log('🎯 Found matching cape type:', matchingCape.id);
      newParts[PartCategory.CAPE] = matchingCape;
      return newParts;
    } else {
      if (import.meta.env.DEV) console.log('❌ No matching cape type found for type:', currentType);
    }
  }

  // FIXED: Si no encuentra del mismo tipo, usar la primera compatible
  if (compatibleCapes.length > 0) {
    if (import.meta.env.DEV) console.log('📌 No matching type found, using first compatible:', compatibleCapes[0].id);
    newParts[PartCategory.CAPE] = compatibleCapes[0];
  } else {
    if (import.meta.env.DEV) console.log('❌ No compatible capes found for torso:', effectiveTorsoId);
    // Limpiar capa si no hay compatibles
    delete newParts[PartCategory.CAPE];
  }

  return newParts;
}

export function assignAdaptiveBootsForTorso(newLegs: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  let newParts = { ...currentParts };
  
  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  const currentBoots = Object.values(partsToCheck).find(p => p.category === PartCategory.BOOTS);
  
  // Si no hay botas actuales, usar la primera compatible
  if (!currentBoots) {
    const compatibleBoots = ALL_PARTS.filter(p => 
      p.category === PartCategory.BOOTS && 
      p.archetype === newLegs.archetype &&
      p.compatible.includes(newLegs.id)
    );
    
    if (compatibleBoots.length > 0) {
      newParts[PartCategory.BOOTS] = compatibleBoots[0];
    }
    return newParts;
  }
  
  // Verificar si las botas actuales son compatibles con las nuevas piernas
  const isCurrentBootsCompatible = currentBoots.compatible.includes(newLegs.id);
  
  if (isCurrentBootsCompatible) {
    // No hacer nada, mantener las botas actuales
    return newParts;
  }
  
  // Las botas actuales no son compatibles, buscar unas del mismo tipo
  let currentType = null;
  const bootsMatch = currentBoots.id.match(/strong_boots_(\d+)_l\d+/);
  if (bootsMatch) {
    currentType = bootsMatch[1];
  }
  
  const compatibleBoots = ALL_PARTS.filter(p => 
    p.category === PartCategory.BOOTS && 
    p.archetype === newLegs.archetype &&
    p.compatible.includes(newLegs.id)
  );
  
  // Buscar botas del mismo tipo
  if (currentType) {
    const matchingBoots = compatibleBoots.find(p => p.id.includes(`strong_boots_${currentType}_`));
    if (matchingBoots) {
      newParts[PartCategory.BOOTS] = matchingBoots;
      return newParts;
    }
  }
  
  // Si no encuentra del mismo tipo, usar la primera compatible
  if (compatibleBoots.length > 0) {
    newParts[PartCategory.BOOTS] = compatibleBoots[0];
  } else {
    // Limpiar botas si no hay compatibles
    delete newParts[PartCategory.BOOTS];
  }
  
  return newParts;
}

// 🛡️ FUNCIÓN PROTEGIDA - assignAdaptiveSymbolForTorso
// ✅ Sistema de compatibilidad para símbolos con torso
// ❌ NO CAMBIAR - Usado en hover y selección de símbolos
export function assignAdaptiveSymbolForTorso(newTorso: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  if (import.meta.env.DEV) console.log('🔍 assignAdaptiveSymbolForTorso called with:', {
    newTorsoId: newTorso.id,
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });

  let newParts = { ...currentParts };

  // For suit_torso, use the base torso ID for compatibility lookups
  const effectiveTorsoId = newTorso.category === PartCategory.SUIT_TORSO && newTorso.compatible.length > 0
    ? newTorso.compatible[0]
    : newTorso.id;

  // Usar las partes originales si están disponibles, sino usar las actuales
  const partsToCheck = originalParts || currentParts;
  if (import.meta.env.DEV) console.log('🔍 Parts to check for current symbol:', Object.keys(partsToCheck));
  const currentSymbol = Object.values(partsToCheck).find(p => p.category === PartCategory.SYMBOL);
  if (import.meta.env.DEV) console.log('🔍 Current symbol found:', currentSymbol?.id || 'none');

  // Si no hay símbolo actual, usar el primero compatible
  if (!currentSymbol) {
    const compatibleSymbols = ALL_PARTS.filter(p =>
      p.category === PartCategory.SYMBOL &&
      p.archetype === newTorso.archetype &&
      p.compatible.includes(effectiveTorsoId)
    );
    
    if (compatibleSymbols.length > 0) {
      if (import.meta.env.DEV) console.log('📌 No current symbol, using first compatible:', compatibleSymbols[0].id);
      newParts[PartCategory.SYMBOL] = compatibleSymbols[0];
    }
    return newParts;
  }
  
  // Verificar si el símbolo actual es compatible con el nuevo torso
  const isCurrentSymbolCompatible = currentSymbol.compatible.includes(effectiveTorsoId);
  
  if (isCurrentSymbolCompatible) {
    if (import.meta.env.DEV) console.log('✅ Current symbol is compatible, keeping:', currentSymbol.id);
    // No hacer nada, mantener el símbolo actual
    return newParts;
  }
  
  // El símbolo actual no es compatible, buscar uno del mismo tipo
  let currentType = null;
  const symbolMatch = currentSymbol.id.match(/strong_symbol_(\d+)_t\d+/);
  if (symbolMatch) {
    currentType = symbolMatch[1];
  }
  
  if (import.meta.env.DEV) console.log('🎯 Current symbol info:', { currentSymbolId: currentSymbol.id, currentType, symbolMatch: symbolMatch ? symbolMatch[0] : 'no match' });
  
  const compatibleSymbols = ALL_PARTS.filter(p =>
    p.category === PartCategory.SYMBOL &&
    p.archetype === newTorso.archetype &&
    p.compatible.includes(effectiveTorsoId)
  );

  if (import.meta.env.DEV) console.log('✅ Compatible symbols found:', compatibleSymbols.length, 'symbols for torso:', effectiveTorsoId);
  if (import.meta.env.DEV) console.log('✅ Compatible symbols IDs:', compatibleSymbols.map(s => s.id));
  
  // Buscar un símbolo del mismo tipo
  if (currentType) {
    if (import.meta.env.DEV) console.log('🔍 Looking for symbol type:', currentType);
    const matchingSymbol = compatibleSymbols.find(p => p.id.includes(`strong_symbol_${currentType}_`));
    if (matchingSymbol) {
      if (import.meta.env.DEV) console.log('🎯 Found matching symbol type:', matchingSymbol.id);
      newParts[PartCategory.SYMBOL] = matchingSymbol;
      return newParts;
    } else {
      if (import.meta.env.DEV) console.log('❌ No matching symbol type found for type:', currentType);
    }
  }
  
  // Si no encuentra del mismo tipo, usar el primero compatible
  if (compatibleSymbols.length > 0) {
    if (import.meta.env.DEV) console.log('📌 No matching type found, using first compatible:', compatibleSymbols[0].id);
    newParts[PartCategory.SYMBOL] = compatibleSymbols[0];
  } else {
    if (import.meta.env.DEV) console.log('❌ No compatible symbols found for torso:', effectiveTorsoId);
    // Limpiar símbolo si no hay compatibles
    delete newParts[PartCategory.SYMBOL];
  }
  
  return newParts;
} 

export function assignAdaptiveChestBeltForTorso(newTorso: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  let newParts = { ...currentParts };

  const effectiveTorsoId = newTorso.category === PartCategory.SUIT_TORSO && newTorso.compatible.length > 0
    ? newTorso.compatible[0]
    : newTorso.id;

  const partsToCheck = originalParts || currentParts;
  const currentChestBelt = Object.values(partsToCheck).find(p => p.category === PartCategory.CHEST_BELT);

  // No chest belt selected — nothing to adjust
  if (!currentChestBelt) return newParts;

  // Keep it if it's already compatible with the new torso
  if (currentChestBelt.compatible.includes(effectiveTorsoId)) return newParts;

  // Incompatible — try to find a same-type variant for the new torso
  const torsoMatch = effectiveTorsoId.match(/strong_torso_(\d+)/);
  const torsoNumber = torsoMatch ? torsoMatch[1] : null;

  const compatibleChestBelts = ALL_PARTS.filter(p =>
    p.category === PartCategory.CHEST_BELT &&
    p.archetype === newTorso.archetype &&
    p.compatible.includes(effectiveTorsoId)
  );

  if (compatibleChestBelts.length === 0) {
    delete newParts[PartCategory.CHEST_BELT];
    return newParts;
  }

  // Try to match the same variant suffix (e.g. _np vs with-pouch)
  if (torsoNumber) {
    const isNp = currentChestBelt.id.endsWith('_np');
    const matchingVariant = compatibleChestBelts.find(p =>
      p.id.includes(`_t${torsoNumber}`) && (isNp ? p.id.endsWith('_np') : !p.id.endsWith('_np'))
    );
    if (matchingVariant) {
      newParts[PartCategory.CHEST_BELT] = matchingVariant;
      return newParts;
    }
  }

  newParts[PartCategory.CHEST_BELT] = compatibleChestBelts[0];
  return newParts;
}

// 🛡️ FUNCIÓN PROTEGIDA - assignAdaptiveSuitTorsoForTorso
// ✅ Sistema de compatibilidad para suit_torso con torso
// ❌ NO CAMBIAR - Copia exacta del patrón de manos - FUNCIONA PERFECTAMENTE
export function assignAdaptiveSuitTorsoForTorso(newTorso: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  if (import.meta.env.DEV) console.log('🔍 assignAdaptiveSuitTorsoForTorso called with:', {
    newTorsoId: newTorso.id,
    currentParts: Object.keys(currentParts),
    originalParts: originalParts ? Object.keys(originalParts) : 'none'
  });
  
  let newParts = { ...currentParts };
  
  // Use original parts if available, otherwise current parts
  const partsToCheck = originalParts || currentParts;
  if (import.meta.env.DEV) console.log('🔍 Parts to check for current suit_torso:', Object.keys(partsToCheck));
  const currentSuitTorso = Object.values(partsToCheck).find(p => p.category === PartCategory.SUIT_TORSO);
  if (import.meta.env.DEV) console.log('🔍 Current suit_torso found:', currentSuitTorso?.id || 'none');
  
  // If no current suit_torso, don't assign any - suit_torso is optional
  if (!currentSuitTorso) {
    if (import.meta.env.DEV) console.log('📌 No current suit_torso, not assigning any (optional)');
    return newParts;
  }
  
  // For suit_torso, resolve to base torso ID for compatibility lookups
  const effectiveTorsoId = newTorso.category === PartCategory.SUIT_TORSO && newTorso.compatible.length > 0
    ? newTorso.compatible[0]
    : newTorso.id;

  // Check if current suit_torso is compatible with the effective base torso
  const isCurrentSuitCompatible = currentSuitTorso.compatible.includes(effectiveTorsoId);

  if (isCurrentSuitCompatible) {
    newParts[PartCategory.SUIT_TORSO] = currentSuitTorso;
    return newParts;
  }

  // Current suit_torso not compatible, find matching type
  let currentSuitType = null;
  const suitMatch = currentSuitTorso.id.match(/strong_suit_torso_(\d+)_t\d+/);
  if (suitMatch) {
    currentSuitType = suitMatch[1];
  }

  // Find compatible suit_torsos for the effective base torso
  const compatibleSuits = ALL_PARTS.filter(p =>
    p.category === PartCategory.SUIT_TORSO &&
    p.archetype === newTorso.archetype &&
    p.compatible.includes(effectiveTorsoId)
  );
  
  if (compatibleSuits.length === 0) {
    if (import.meta.env.DEV) console.log('⚠️ No compatible suit_torsos found for torso:', newTorso.id);
    // Remove incompatible suit_torso
    delete newParts[PartCategory.SUIT_TORSO];
    return newParts;
  }
  
  if (import.meta.env.DEV) console.log('✅ Compatible suits found:', compatibleSuits.length, 'suits for torso:', newTorso.id);
  if (import.meta.env.DEV) console.log('✅ Compatible suits IDs:', compatibleSuits.map(s => s.id));
  
  // Try to find exact match by type
  if (currentSuitType) {
    if (import.meta.env.DEV) console.log('🔍 Looking for suit type:', currentSuitType);
    const sameTypeSuit = compatibleSuits.find(s => {
      const match = s.id.match(/strong_suit_torso_(\d+)_t\d+/);
      return match && match[1] === currentSuitType;
    });
    
    if (sameTypeSuit) {
      if (import.meta.env.DEV) console.log('🎯 Found matching suit type:', sameTypeSuit.id);
      newParts[PartCategory.SUIT_TORSO] = sameTypeSuit;
      return newParts;
    }
  }
  
  // No exact type match — use first compatible suit rather than removing it
  newParts[PartCategory.SUIT_TORSO] = compatibleSuits[0];
  return newParts;
} 

// Export 3D model utilities
export interface ModelExportOptions {
  format: 'glb' | 'gltf' | 'stl';
  includeTextures: boolean;
  compression: boolean;
}

export interface STLExportOptions {
  binary: boolean;
  includeMaterials: boolean;
  scale: number;
}

export interface ExportResult {
  success: boolean;
  data?: Blob;
  error?: string;
  filename?: string;
}

/**
 * Export a 3D scene as a downloadable file
 */
export async function exportModel(scene: THREE.Object3D, options: ModelExportOptions = { format: 'glb', includeTextures: true, compression: true }): Promise<ExportResult> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Export only works in browser environment');
    }

    if (options.format === 'stl') {
      return exportSTL(scene);
    }

    // Import GLTFExporter dynamically to avoid SSR issues
    const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter');
    const exporter = new GLTFExporter();

    // Prepare export options
    const exportOptions = {
      binary: options.format === 'glb',
      embedImages: options.includeTextures,
      forceIndices: true,
      truncateDrawRange: true,
      maxTextureSize: 2048,
      animations: [],
    };

    // Export the scene
    const result: { data: ArrayBuffer | { [key: string]: unknown } } = await new Promise((resolve, reject) => {
      exporter.parse(scene, (gltf: ArrayBuffer | { [key: string]: unknown }) => {
        resolve({ data: gltf });
      }, (error: ErrorEvent) => {
        reject(new Error(error.message));
      }, exportOptions);
    });

    // Create blob and filename
    const blob = options.format === 'glb'
      ? new Blob([result.data as ArrayBuffer], { type: 'model/gltf-binary' })
      : new Blob([JSON.stringify(result.data)], { type: 'model/gltf+json' });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `superhero_3d_model_${timestamp}.${options.format}`;

    return {
      success: true,
      data: blob,
      filename
    };

  } catch (error) {
    if (import.meta.env.DEV) console.error('Error exporting model:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during export'
    };
  }
}

async function exportSTL(scene: THREE.Object3D, options: STLExportOptions = { binary: true, includeMaterials: false, scale: 1 }): Promise<ExportResult> {
  try {
    // Import STLExporter dynamically for STL printing
    const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter');
    const exporter = new STLExporter();

    // Prepare export options
    const exportOptions = {
      binary: options.binary
    };

    // Export the scene
    const stlData = exporter.parse(scene, exportOptions);

    // Create blob and filename
    const blob = new Blob([stlData], {
      type: options.binary ? 'application/octet-stream' : 'text/plain'
    });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `superhero_3d_print_${timestamp}.stl`;

    return {
      success: true,
      data: blob,
      filename
    };

  } catch (error) {
    if (import.meta.env.DEV) console.error('Error exporting STL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during STL export'
    };
  }
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a comprehensive model name based on selected parts
 */
export function generateModelName(selectedParts: SelectedParts, archetype: string): string {
  const parts = Object.values(selectedParts).filter(Boolean) as Part[];
  const archetypeName = archetype || 'custom';

  // Extract key parts for naming
  const torso = parts.find((p) => p.category === PartCategory.TORSO || p.category === PartCategory.SUIT_TORSO);
  const head = parts.find((p) => p.category === PartCategory.HEAD);
  const cape = parts.find((p) => p.category === PartCategory.CAPE);

  let name = `${archetypeName}`;

  if (torso) {
    const torsoType = torso.id.includes('suit') ? 'suit' : 'torso';
    name += `_${torsoType}`;
  }

  if (head) {
    name += '_headed';
  }

  if (cape) {
    name += '_caped';
  }

  return name;
}

/**
 * Get user-friendly name for a part category
 * @deprecated Use getCategoryI18nKey + t() instead to support i18n
 */
export function getCategoryName(category: PartCategory): string {
  const categoryNames: Record<PartCategory, string> = {
    [PartCategory.TORSO]: 'Torso',
    [PartCategory.SUIT_TORSO]: 'Suit Torso',
    [PartCategory.LOWER_BODY]: 'Lower Body',
    [PartCategory.HEAD]: 'Head',
    [PartCategory.HAND_LEFT]: 'Left Hand',
    [PartCategory.HAND_RIGHT]: 'Right Hand',
    [PartCategory.CAPE]: 'Cape',
    [PartCategory.BACKPACK]: 'Backpack',
    [PartCategory.CHEST_BELT]: 'Chest Belt',
    [PartCategory.BELT]: 'Belt',
    [PartCategory.BUCKLE]: 'Buckle',
    [PartCategory.POUCH]: 'Pouch',
    [PartCategory.SHOULDERS]: 'Shoulders',
    [PartCategory.FOREARMS]: 'Forearms',
    [PartCategory.BOOTS]: 'Boots',
    [PartCategory.SYMBOL]: 'Symbol',
  };

  return categoryNames[category] || category;
}

/**
 * Map a PartCategory to its i18n translation key (sub.* namespace)
 */
export function getCategoryI18nKey(category: PartCategory): import('./i18n').TransKey {
  const keys: Record<PartCategory, import('./i18n').TransKey> = {
    [PartCategory.TORSO]: 'sub.torso',
    [PartCategory.SUIT_TORSO]: 'sub.suit',
    [PartCategory.HEAD]: 'sub.head',
    [PartCategory.HAND_LEFT]: 'sub.hand_left',
    [PartCategory.HAND_RIGHT]: 'sub.hand_right',
    [PartCategory.CAPE]: 'sub.cape',
    [PartCategory.SYMBOL]: 'sub.symbol',
    [PartCategory.CHEST_BELT]: 'sub.chest',
    [PartCategory.SHOULDERS]: 'sub.shoulders',
    [PartCategory.FOREARMS]: 'sub.forearms',
    [PartCategory.BELT]: 'sub.belt',
    [PartCategory.POUCH]: 'sub.pouch',
    [PartCategory.BUCKLE]: 'sub.buckle',
    [PartCategory.LOWER_BODY]: 'sub.legs',
    [PartCategory.BOOTS]: 'sub.boots',
    [PartCategory.BACKPACK]: 'sub.backpack',
  };
  return keys[category] ?? 'sub.torso';
} 

/**
 * Compare two SelectedParts objects for equality
 */
export function arePartsEqual(parts1: SelectedParts, parts2: SelectedParts): boolean {
  const keys1 = Object.keys(parts1);
  const keys2 = Object.keys(parts2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    const part1 = parts1[key];
    const part2 = parts2[key];
    
    if (!part1 && !part2) continue;
    if (!part1 || !part2) return false;
    if (part1.id !== part2.id) return false;
  }
  
  return true;
}

/**
 * Compare two RPGCharacterSync objects for equality
 */
export function areRPGCharactersEqual(char1: RPGCharacterSync | null, char2: RPGCharacterSync | null): boolean {
  if (!char1 && !char2) return true;
  if (!char1 || !char2) return false;

  return (
    char1.archetypeId === char2.archetypeId &&
    JSON.stringify(char1.calculatedStats) === JSON.stringify(char2.calculatedStats) &&
    JSON.stringify(char1.physicalAttributes) === JSON.stringify(char2.physicalAttributes) &&
    JSON.stringify(char1.visualEffects) === JSON.stringify(char2.visualEffects)
  );
}

export function areSelectedPartsEqual(parts1: SelectedParts, parts2: SelectedParts): boolean {
  const keys1 = Object.keys(parts1);
  const keys2 = Object.keys(parts2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const part1 = parts1[key];
    const part2 = parts2[key];

    if (!part1 && !part2) continue; // Both are null/undefined
    if (!part1 || !part2) return false; // One is null/undefined, the other isn't
    if (part1.id !== part2.id || part1.category !== part2.category) {
      return false;
    }
  }

  return true;
} 