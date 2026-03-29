import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Part, PartCategory, ArchetypeId, SelectedParts } from '../types';
import { ALL_PARTS, createNonePart } from '../constants';
import PartItemCard from './PartItemCard';
import { getCategoryName, assignDefaultHandsForTorso, assignAdaptiveHeadForTorso, assignAdaptiveBootsForTorso, assignAdaptiveCapeForTorso, assignAdaptiveSymbolForTorso, assignAdaptiveSuitTorsoForTorso } from '../lib/utils'; 
import { XMarkIcon, CheckIcon, RotateCcwIcon } from './icons';

import { GamingButton } from './ui/gaming-button';
import { GlassPanel } from './ui/glass-panel';
import { CharacterViewerRef } from './CharacterViewer';

interface PartSelectorPanelProps {
  activeCategory: PartCategory | null;
  selectedArchetype: ArchetypeId | null;
  selectedParts: SelectedParts;
  onPartSelect: (category: PartCategory, part: Part) => void;
  onClose: () => void;
  onPreviewChange?: (previewParts: SelectedParts) => void;
  onResetToDefault?: () => void;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
  characterViewerRef?: React.RefObject<CharacterViewerRef>;
}

const PartSelectorPanel: React.FC<PartSelectorPanelProps> = ({
  activeCategory,
  selectedArchetype,
  selectedParts,
  onPartSelect,
  onClose,
  onPreviewChange,
  onResetToDefault,
  id,
  registerElement,
  characterViewerRef
}) => {
  const [previewParts, setPreviewParts] = useState<SelectedParts>(selectedParts);
  const [hasChanges, setHasChanges] = useState(false);
  const ref = useRef<HTMLDivElement>(null);



  const handleCancelChanges = useCallback(() => {
    setPreviewParts(selectedParts);
    setHasChanges(false);
    if (onPreviewChange) {
      onPreviewChange(selectedParts);
    }
    if (characterViewerRef && characterViewerRef.current) {
      console.log('🔍 [CANCEL CHANGES] Reiniciando cámara...');
      characterViewerRef.current.resetCamera();
    }
    onClose();
  }, [selectedParts, onPreviewChange, onClose, characterViewerRef]);

  const handleResetPreview = useCallback(() => {
    setPreviewParts(selectedParts);
    setHasChanges(false);
    if (onPreviewChange) {
      onPreviewChange(selectedParts);
    }
  }, [selectedParts, onPreviewChange]);

  const handleApplyChanges = useCallback(() => {
    // Si no hay cambios, aplicar la parte actualmente seleccionada en preview
    const partToApply = Object.values(previewParts).find(p => p.category === activeCategory);
    if (partToApply) {
      onPartSelect(partToApply.category, partToApply);
    }
    if (characterViewerRef && characterViewerRef.current) {
      console.log('🔍 [APPLY CHANGES] Reiniciando cámara...');
      characterViewerRef.current.resetCamera();
    }
    onClose();
  }, [previewParts, activeCategory, onPartSelect, onClose, characterViewerRef]);

  const handleDoubleClickApply = useCallback((part: Part) => {
    console.log('🎯 Double-click apply for:', { partId: part.id, category: part.category, activeCategory });
    
    // Debug específico para cabezas
    if (activeCategory === PartCategory.HEAD) {
      console.log('🔍 HEAD DOUBLE-CLICK DEBUG:');
      console.log('   - Previous head:', selectedParts[PartCategory.HEAD]?.id || 'none');
      console.log('   - New head:', part.id);
      console.log('   - Will trigger App.tsx handleSelectPart with category:', activeCategory);
    }
    
    if (!activeCategory) {
      console.log('❌ No activeCategory, cannot apply selection');
      return;
    }
    
    let newParts = { ...selectedParts };
    
    // Remove existing parts of the same category - use category as key, not part ID
    console.log('🗑️ Removing existing part for category:', activeCategory);
    delete newParts[activeCategory];
    
    // Add the new part if it's not "none"
    if (!part.attributes?.none) {
      newParts[activeCategory] = part;
      console.log('✅ Adding new part:', part.id);
    }
    
    // Apply the selection directly
    console.log('🎯 Calling onPartSelect for:', { category: activeCategory, partId: part.id });
    onPartSelect(activeCategory, part);
    
    console.log('✅ Double-click apply completed for category:', activeCategory);
    onClose();
  }, [selectedParts, activeCategory, onPartSelect, onClose]);

  const handlePreviewSelect = useCallback((part: Part) => {
    if (!activeCategory) {
      console.log('❌ No activeCategory, cannot preview selection');
      return;
    }
    
    let newPreviewParts = { ...previewParts };
    
    // Remove existing parts of the same category - use category as key
    delete newPreviewParts[activeCategory];
    
    // SPECIAL CASE: If selecting a torso, recalculate compatible parts
    if (activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO) {
      console.log('🔄 TORSO SELECT: Recalculating compatible parts for torso:', part.id);
      
      if (part.attributes?.none) {
        // For "none" torso, remove torso and related parts
        delete newPreviewParts[activeCategory];
        delete newPreviewParts[PartCategory.HEAD];
        delete newPreviewParts[PartCategory.HAND_LEFT];
        delete newPreviewParts[PartCategory.HAND_RIGHT];
        delete newPreviewParts[PartCategory.SYMBOL];
      } else {
        // ✅ CRITICAL: Remove both TORSO and SUIT_TORSO when selecting either
        if (activeCategory === PartCategory.TORSO) {
          delete newPreviewParts[PartCategory.TORSO];
          delete newPreviewParts[PartCategory.SUIT_TORSO];
        } else if (activeCategory === PartCategory.SUIT_TORSO) {
          delete newPreviewParts[PartCategory.SUIT_TORSO];
          // Keep current torso when selecting suit_torso
        }
        
        newPreviewParts[activeCategory] = part;
        
        const fullCompatibleParts = assignDefaultHandsForTorso(part, newPreviewParts);
        const finalCompatibleParts = assignAdaptiveHeadForTorso(part, fullCompatibleParts);
        
        const partsWithSymbol = { ...finalCompatibleParts };
        const currentSymbol = selectedParts[PartCategory.SYMBOL];
        if (currentSymbol) partsWithSymbol[PartCategory.SYMBOL] = currentSymbol;
        const finalPartsWithSymbol = assignAdaptiveSymbolForTorso(part, finalCompatibleParts, partsWithSymbol);
        
        const partsWithCape = { ...finalCompatibleParts };
        const currentCape = selectedParts[PartCategory.CAPE];
        if (currentCape) partsWithCape[PartCategory.CAPE] = currentCape;
        const finalPartsWithCape = assignAdaptiveCapeForTorso(part, finalCompatibleParts, partsWithCape);
        
        const partsWithSuit = { ...finalCompatibleParts };
        const currentSuit = selectedParts[PartCategory.SUIT_TORSO];
        if (currentSuit) partsWithSuit[PartCategory.SUIT_TORSO] = currentSuit;
        const finalPartsWithSuit = assignAdaptiveSuitTorsoForTorso(part, finalCompatibleParts, partsWithSuit);
        
        newPreviewParts = { ...newPreviewParts, ...finalCompatibleParts, ...finalPartsWithSymbol, ...finalPartsWithCape, ...finalPartsWithSuit };
        
        console.log('✅ TORSO SELECT: Updated preview state:', {
          allParts: Object.keys(newPreviewParts),
          torso: newPreviewParts[activeCategory]?.id || 'removed',
          head: newPreviewParts[PartCategory.HEAD]?.id || 'removed',
          leftHand: newPreviewParts[PartCategory.HAND_LEFT]?.id || 'removed',
          rightHand: newPreviewParts[PartCategory.HAND_RIGHT]?.id || 'removed',
          symbol: newPreviewParts[PartCategory.SYMBOL]?.id || 'removed',
          cape: newPreviewParts[PartCategory.CAPE]?.id || 'removed'
        });
      }
    }
    // SPECIAL CASE: If selecting legs, recalculate compatible boots
    else if (activeCategory === PartCategory.LOWER_BODY) {
      console.log('🔄 LEGS SELECT: Recalculating compatible boots for legs:', part.id);
      
      if (part.attributes?.none) {
        // For "none" legs, remove legs and boots
        delete newPreviewParts[activeCategory];
        delete newPreviewParts[PartCategory.BOOTS];
      } else {
        // Add the new legs
        newPreviewParts[activeCategory] = part;
        
        // Apply legs compatibility logic for boots (preserves compatible boots, assigns defaults for incompatible)
        const bootsCompatibleParts = assignAdaptiveBootsForTorso(part, newPreviewParts);
        
        // Update preview parts with compatible parts AND ensure legs are included
        newPreviewParts = { ...newPreviewParts, ...bootsCompatibleParts, [activeCategory]: part };
      }
    }
    // SPECIAL CASE: If selecting symbol, recalculate with torso compatibility  
    else if (activeCategory === PartCategory.SYMBOL) {
      console.log('🔄 SYMBOL SELECT: Recalculating compatible symbol for torso:', part.id);
      
      if (part.attributes?.none) {
        // For "none" symbol, remove symbol
        delete newPreviewParts[activeCategory];
      } else {
        // Get current torso for compatibility
        const currentTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
        if (currentTorso) {
          // Apply symbol compatibility logic
          const symbolCompatibleParts = assignAdaptiveSymbolForTorso(currentTorso, newPreviewParts);
          
          // Update preview parts with compatible parts
          newPreviewParts = { ...newPreviewParts, ...symbolCompatibleParts, [activeCategory]: part };
        } else {
          // No torso selected, just add the symbol directly
          newPreviewParts[activeCategory] = part;
        }
      }
      
      console.log('✅ SYMBOL SELECT: Updated preview state:', {
        allParts: Object.keys(newPreviewParts),
        symbol: newPreviewParts[PartCategory.SYMBOL]?.id || 'removed'
      });
    }
    // GENERIC CASE: For all other categories using complete state pattern
    else {
      console.log(`🔄 ${activeCategory} SELECT: Using complete state pattern for:`, part.id);
      
      // IMPLEMENTADO - Patrón genérico para todas las categorías según documentación
      const categoriesWithCompleteState = [
        PartCategory.HEAD, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT,
        PartCategory.BACKPACK, PartCategory.CHEST_BELT, PartCategory.BELT,
        PartCategory.BUCKLE, PartCategory.POUCH, PartCategory.SHOULDERS,
        PartCategory.FOREARMS, PartCategory.BOOTS
      ];

      if (categoriesWithCompleteState.includes(activeCategory)) {
        if (part.attributes?.none) {
          delete newPreviewParts[activeCategory];
        } else {
          newPreviewParts[activeCategory] = part;
        }
        
        console.log(`✅ ${activeCategory} SELECT: Complete state pattern applied:`, {
          allParts: Object.keys(newPreviewParts),
          changedPart: `${activeCategory}: ${newPreviewParts[activeCategory]?.id || 'removed'}`
        });
      } else {
        // Fallback for any other categories
        if (part.attributes?.none) {
          delete newPreviewParts[activeCategory];
    } else {
        newPreviewParts[activeCategory] = part;
        }
      }
    }
    
    setPreviewParts(newPreviewParts);
    setHasChanges(true);
    if (onPreviewChange) {
      onPreviewChange(newPreviewParts);
    }
  }, [activeCategory, previewParts, selectedParts, onPreviewChange]);

  const handleHoverPreview = useCallback((part: Part | null) => {
    if (!activeCategory || !onPreviewChange) return;

    console.log('🔍 [HOVER PREVIEW] Recibiendo part:', part?.id || 'null', 'para categoría:', activeCategory);

    let hoverPreviewParts: SelectedParts = { ...selectedParts };

    // Determinar la parte a mostrar en el preview. Si es null o "none", se considera que no hay parte.
    const partToDisplay: Part | null = (part && !part.attributes?.none) ? part : null;



    // Lógica de preview para los modelos: asegurar que hoverPreviewParts siempre tiene Part o se elimina la clave.
    if (partToDisplay) {
      hoverPreviewParts[activeCategory] = partToDisplay;
    } else {
      delete hoverPreviewParts[activeCategory];
    }

    // 🛡️ PROTEGIDO: SPECIAL CASE - NO MODIFICAR ESTA LÓGICA
    // ✅ Si se hace hover sobre un torso, recalcular partes compatibles
    // ❌ NO CAMBIAR - Sistema de eliminación y compatibilidad crítico
    if (activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO) {
      console.log('🔄 TORSO HOVER: Recalculando partes compatibles para torso:', partToDisplay?.id || 'none');

      const partsWithoutCurrentTorso = { ...selectedParts };
      if (activeCategory === PartCategory.TORSO) {
        delete partsWithoutCurrentTorso[PartCategory.TORSO];
        delete partsWithoutCurrentTorso[PartCategory.SUIT_TORSO];
      } else if (activeCategory === PartCategory.SUIT_TORSO) {
        delete partsWithoutCurrentTorso[PartCategory.SUIT_TORSO];
      }

      // Si hay una parte de torso para mostrar, la usamos para la compatibilidad
      if (partToDisplay) {
        let tempHoverParts: SelectedParts = { ...partsWithoutCurrentTorso, [activeCategory]: partToDisplay };
        tempHoverParts = assignDefaultHandsForTorso(partToDisplay, tempHoverParts);
        tempHoverParts = assignAdaptiveHeadForTorso(partToDisplay, tempHoverParts);
        tempHoverParts = assignAdaptiveSymbolForTorso(partToDisplay, tempHoverParts);
        tempHoverParts = assignAdaptiveCapeForTorso(partToDisplay, tempHoverParts);
        tempHoverParts = assignAdaptiveSuitTorsoForTorso(partToDisplay, tempHoverParts);

        // Asegurar que hoverPreviewParts solo contiene Part, no null
        const newHoverState: SelectedParts = {};
        for (const key in tempHoverParts) {
          if (tempHoverParts[key] !== null) {
            newHoverState[key] = tempHoverParts[key] as Part;
          }
        }

        hoverPreviewParts = { ...newHoverState, [activeCategory]: partToDisplay };
      } else {
        // Si es "none" torso, asegurar que las dependencias también se eliminan del preview
        delete hoverPreviewParts[PartCategory.TORSO];
        delete hoverPreviewParts[PartCategory.SUIT_TORSO];
        delete hoverPreviewParts[PartCategory.HEAD];
        delete hoverPreviewParts[PartCategory.HAND_LEFT];
        delete hoverPreviewParts[PartCategory.HAND_RIGHT];
        delete hoverPreviewParts[PartCategory.SYMBOL];
        delete hoverPreviewParts[PartCategory.CAPE];
      }

      console.log('✅ TORSO HOVER: Enviando estado de preview (siguiendo reglas críticas):', {
        allParts: Object.keys(hoverPreviewParts),
        torso: hoverPreviewParts[PartCategory.TORSO]?.id || 'removed',
        suitTorso: hoverPreviewParts[PartCategory.SUIT_TORSO]?.id || 'removed',
        head: hoverPreviewParts[PartCategory.HEAD]?.id || 'removed',
        leftHand: hoverPreviewParts[PartCategory.HAND_LEFT]?.id || 'removed',
        rightHand: hoverPreviewParts[PartCategory.HAND_RIGHT]?.id || 'removed',
        symbol: hoverPreviewParts[PartCategory.SYMBOL]?.id || 'removed',
        cape: hoverPreviewParts[PartCategory.CAPE]?.id || 'removed'
      });
    }
    // SPECIAL CASE: Si se hace hover sobre las piernas, recalcular las botas compatibles
    else if (activeCategory === PartCategory.LOWER_BODY) {
      console.log('🔄 LEGS HOVER: Recalculando botas compatibles para piernas:', partToDisplay?.id || 'none');
      if (partToDisplay) {
        let tempHoverParts: SelectedParts = { ...selectedParts, [activeCategory]: partToDisplay };
        const bootsCompatibleParts = assignAdaptiveBootsForTorso(partToDisplay, tempHoverParts);
        hoverPreviewParts = { ...tempHoverParts, ...bootsCompatibleParts, [activeCategory]: partToDisplay };
      } else {
        delete hoverPreviewParts[PartCategory.LOWER_BODY];
        delete hoverPreviewParts[PartCategory.BOOTS];
      }
      console.log('✅ LEGS HOVER: Enviando estado de preview completo:', {
        allParts: Object.keys(hoverPreviewParts),
        legs: hoverPreviewParts[PartCategory.LOWER_BODY]?.id || 'removed',
        boots: hoverPreviewParts[PartCategory.BOOTS]?.id || 'removed'
      });
    }
    // SPECIAL CASE: Si se hace hover sobre la capa, recalcular la compatibilidad con el torso
    else if (activeCategory === PartCategory.CAPE) {
      console.log('🔄 CAPE HOVER: Recalculando capa compatible para torso:', partToDisplay?.id || 'none');
      if (partToDisplay) {
        const currentTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
        if (currentTorso) {
          let tempHoverParts: SelectedParts = { ...selectedParts, [activeCategory]: partToDisplay };
          const capeCompatibleParts = assignAdaptiveCapeForTorso(currentTorso, tempHoverParts);
          hoverPreviewParts = { ...tempHoverParts, ...capeCompatibleParts, [activeCategory]: partToDisplay };
        } else {
          hoverPreviewParts[activeCategory] = partToDisplay;
        }
      } else {
        delete hoverPreviewParts[activeCategory];
      }
      console.log('✅ CAPE HOVER: Enviando estado de preview completo:', {
        allParts: Object.keys(hoverPreviewParts),
        cape: hoverPreviewParts[PartCategory.CAPE]?.id || 'removed',
        hoveredPart: partToDisplay?.id || 'none'
      });
    }
    // SPECIAL CASE: Si se hace hover sobre el símbolo, recalcular la compatibilidad con el torso
    else if (activeCategory === PartCategory.SYMBOL) {
      console.log('🔄 SYMBOL HOVER: Recalculando símbolo compatible para torso:', partToDisplay?.id || 'none');
      if (partToDisplay) {
        const currentTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
        if (currentTorso) {
          let tempHoverParts: SelectedParts = { ...selectedParts, [activeCategory]: partToDisplay };
          const symbolCompatibleParts = assignAdaptiveSymbolForTorso(currentTorso, tempHoverParts);
          hoverPreviewParts = { ...tempHoverParts, ...symbolCompatibleParts, [activeCategory]: partToDisplay };
        } else {
          hoverPreviewParts[activeCategory] = partToDisplay;
        }
      } else {
        delete hoverPreviewParts[activeCategory];
      }
      console.log('✅ SYMBOL HOVER: Enviando estado de preview completo:', {
        allParts: Object.keys(hoverPreviewParts),
        symbol: hoverPreviewParts[PartCategory.SYMBOL]?.id || 'removed',
        hoveredPart: partToDisplay?.id || 'none'
      });
    }
    // CASO GENÉRICO: Para todas las demás categorías que usan el patrón de estado completo
    else {
      console.log(`🔄 ${activeCategory} HOVER: Usando patrón de estado completo para:`, partToDisplay?.id || 'none');
      const categoriesWithCompleteState = [
        PartCategory.HEAD, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT,
        PartCategory.BACKPACK, PartCategory.CHEST_BELT, PartCategory.BELT,
        PartCategory.BUCKLE, PartCategory.POUCH, PartCategory.SHOULDERS,
        PartCategory.FOREARMS, PartCategory.BOOTS, PartCategory.SYMBOL
      ];
      if (categoriesWithCompleteState.includes(activeCategory)) {
        if (partToDisplay) {
          hoverPreviewParts[activeCategory] = partToDisplay;
        } else {
          delete hoverPreviewParts[activeCategory];
        }
        console.log(`✅ ${activeCategory} HOVER: Patrón de estado completo aplicado:`, {
          allParts: Object.keys(hoverPreviewParts),
          changedPart: `${activeCategory}: ${hoverPreviewParts[activeCategory]?.id || 'removed'}`
        });
      }
    }
    
    // Debug específico para cinturones
    if (activeCategory === PartCategory.BELT) {
      console.log('🔍 BELT DEBUG - Enviando preview parts:', hoverPreviewParts);
    }
    
    // Enviar el estado de preview completo
    onPreviewChange(hoverPreviewParts);
  }, [activeCategory, selectedParts, onPreviewChange, characterViewerRef]);

  useEffect(() => {
    registerElement(id, ref.current);
  }, [id, registerElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelChanges();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCancelChanges]);

  if (!selectedArchetype || !activeCategory) {
    console.log('🚫 PartSelectorPanel not showing - missing:', { selectedArchetype, activeCategory });
    return null; 
  }
  
  const availableParts = ALL_PARTS.filter(part => {
    // Debug específico para cabezas de torso 04
    // if (activeCategory === PartCategory.HEAD && part.id.includes('t04')) {
    //   console.log(`🔍 Debugging ${part.id}:`, {
    //     category: part.category,
    //     archetype: part.archetype,
    //     selectedArchetype,
    //     compatible: part.compatible,
    //     categoryMatch: part.category === activeCategory,
    //     archetypeMatch: part.archetype === selectedArchetype
    //   });
    // }
    
    // Debug específico para cinturones
    // if (activeCategory === PartCategory.BELT && part.category === PartCategory.BELT) {
    //   console.log(`🔍 BELT DEBUG - Filtering ${part.id}:`, {
    //     category: part.category,
    //     archetype: part.archetype,
    //     selectedArchetype,
    //     compatible: part.compatible,
    //     categoryMatch: part.category === activeCategory,
    //     archetypeMatch: part.archetype === selectedArchetype,
    //     baseTorso: selectedParts[PartCategory.TORSO]?.id || selectedParts[PartCategory.SUIT_TORSO]?.id,
    //     compatibilityCheck: part.compatible.length === 0 ? 'Compatible con todos' : `Compatible con: ${part.compatible.join(', ')}`
    //   });
    // }
    
    // Debug específico para botas
    // if (activeCategory === PartCategory.BOOTS && part.category === PartCategory.BOOTS) {
    //   const selectedLegs = selectedParts[PartCategory.LOWER_BODY];
    //   console.log(`🔍 BOOTS DEBUG - Filtering ${part.id}:`, {
    //     category: part.category,
    //     archetype: part.archetype,
    //     selectedArchetype,
    //     compatible: part.compatible,
    //     categoryMatch: part.category === activeCategory,
    //     archetypeMatch: part.archetype === selectedArchetype,
    //     selectedLegs: selectedLegs?.id || 'ningunas',
    //     compatibilityCheck: part.compatible.length === 0 ? 'Compatible con todos' : `Compatible con: ${part.compatible.join(', ')}`,
    //     isCompatibleWithLegs: selectedLegs ? part.compatible.includes(selectedLegs.id) : true
    //   });
    // }
    
    // Debug específico para capas
    if (activeCategory === PartCategory.CAPE && part.category === PartCategory.CAPE) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      console.log(`🔍 CAPE DEBUG - Filtering ${part.id}:`, {
        category: part.category,
        archetype: part.archetype,
        selectedArchetype,
        compatible: part.compatible,
        categoryMatch: part.category === activeCategory,
        archetypeMatch: part.archetype === selectedArchetype,
        selectedTorso: selectedTorso?.id || 'ninguno',
        compatibilityCheck: part.compatible.length === 0 ? 'Compatible con todos' : `Compatible con: ${part.compatible.join(', ')}`,
        isCompatibleWithTorso: selectedTorso ? part.compatible.includes(selectedTorso.id) : true
      });
    }
    
    // Debug específico para símbolos
    if (activeCategory === PartCategory.SYMBOL && part.category === PartCategory.SYMBOL) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      console.log(`🔍 SYMBOL DEBUG - Filtering ${part.id}:`, {
        category: part.category,
        archetype: part.archetype,
        selectedArchetype,
        compatible: part.compatible,
        categoryMatch: part.category === activeCategory,
        archetypeMatch: part.archetype === selectedArchetype,
        selectedTorso: selectedTorso?.id || 'ninguno',
        compatibilityCheck: part.compatible.length === 0 ? 'Compatible con todos' : `Compatible con: ${part.compatible.join(', ')}`,
        isCompatibleWithTorso: selectedTorso ? part.compatible.includes(selectedTorso.id) : true
      });
    }
    
    // Verificación básica de categoría y arquetipo
    if (part.category !== activeCategory || part.archetype !== selectedArchetype) {
      return false;
    }
    
    // Si no hay restricciones de compatibilidad, mostrar la parte
    if (part.compatible.length === 0) {
      return true;
    }
    
    // Caso especial para LOWER_BODY - siempre mostrar
    if (part.category === PartCategory.LOWER_BODY) {
      return true;
    }
    
    // Caso especial para BOOTS - verificar compatibilidad con piernas
    if (part.category === PartCategory.BOOTS) {
      const selectedLegs = selectedParts[PartCategory.LOWER_BODY];
      if (!selectedLegs) return true;
      return part.compatible.includes(selectedLegs.id);
    }
    
    // Caso especial para CAPE - verificar compatibilidad con torso
    if (part.category === PartCategory.CAPE) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      if (!selectedTorso) return true; // Si no hay torso, mostrar todas las capas
      return part.compatible.includes(selectedTorso.id);
    }
    
    // Caso especial para SYMBOL - verificar compatibilidad con torso
    if (part.category === PartCategory.SYMBOL) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      if (!selectedTorso) return true; // Si no hay torso, mostrar todos los símbolos
      return part.compatible.includes(selectedTorso.id);
    }
    
    // Caso especial para CHEST_BELT - usar lógica de nombres
    if (part.category === PartCategory.CHEST_BELT) {
      const selectedTorso = selectedParts[PartCategory.TORSO];
      const selectedSuit = selectedParts[PartCategory.SUIT_TORSO];
      const activeTorso = selectedSuit || selectedTorso;
      
      if (!activeTorso) {
        return true;
      }
      
      // Extraer el número del torso activo
      let torsoNumber = null;
      if (selectedSuit) {
        const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
        if (suitMatch) {
          torsoNumber = suitMatch[1];
        }
      } else if (selectedTorso) {
        const torsoMatch = selectedTorso.id.match(/strong_torso_(\d+)/);
        if (torsoMatch) {
          torsoNumber = torsoMatch[1];
        }
      }
      
      if (!torsoNumber) {
        return true;
      }
      
      // Para chest belt, verificar si es específico para el torso o genérico
      // Genérico: strong_beltchest_01_np (compatible con todos los torsos)
      // Específico: strong_beltchest_01_t01, strong_beltchest_01_t01_np, etc.
      const isGeneric = part.id === 'strong_beltchest_01_np';
      const isSpecificForTorso = part.id.includes(`_t${torsoNumber}`);
      
      console.log(`🔍 CHEST_BELT DEBUG: ${part.id} - Torso: ${torsoNumber} - Generic: ${isGeneric} - Specific: ${isSpecificForTorso}`);
      
      return isGeneric || isSpecificForTorso;
    }
    
    // Para todas las demás categorías, usar lógica de compatibilidad estándar
    const selectedTorso = selectedParts[PartCategory.TORSO];
    const selectedSuit = selectedParts[PartCategory.SUIT_TORSO];
    const activeTorso = selectedSuit || selectedTorso;
    
    if (!activeTorso) return true;
    
    // Para suit torsos, extraer el torso subyacente
    if (selectedSuit) {
      const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
      if (suitMatch) {
        const torsoNumber = suitMatch[1];
        const underlyingTorsoId = `strong_torso_${torsoNumber}`;
        return part.compatible.includes(underlyingTorsoId);
      }
    }
    
    return part.compatible.includes(activeTorso.id);
  });
  
  console.log('✅ PartSelectorPanel showing for category:', activeCategory, 'with', availableParts.length, 'available parts');
  
  // Debug específico para chest belt
  if (activeCategory === PartCategory.CHEST_BELT) {
    console.log('🔍 DEBUG CHEST_BELT - PartSelectorPanel:');
    console.log('   - Torso activo:', Object.values(selectedParts).find(p => p.category === PartCategory.TORSO)?.id || 'ninguno');
    console.log('   - Suit activo:', Object.values(selectedParts).find(p => p.category === PartCategory.SUIT_TORSO)?.id || 'ninguno');
    console.log('   - Chest belts disponibles:', availableParts.map(p => p.id));
    console.log('   - Total chest belts en ALL_PARTS:', ALL_PARTS.filter(p => p.category === PartCategory.CHEST_BELT).length);
  }
  
  // Debug específico para cabezas
  if (activeCategory === PartCategory.HEAD) {
    console.log('🔍 DEBUG CABEZAS - PartSelectorPanel:');
    console.log('   - Cabeza actualmente seleccionada:', selectedParts.HEAD?.id || 'ninguna');
    console.log('   - Cabeza en preview:', previewParts.HEAD?.id || 'ninguna');
    console.log('   - Todas las cabezas disponibles:', availableParts.map(p => p.id));
    
    // Verificar si la cabeza seleccionada está en las disponibles
    const selectedHeadInAvailable = availableParts.find(p => p.id === selectedParts.HEAD?.id);
    console.log('   - ¿Cabeza seleccionada está disponible?', selectedHeadInAvailable ? 'SÍ' : 'NO');
    
    // Verificar compatibilidad
    const selectedTorso = Object.values(selectedParts).find(p => p.category === PartCategory.TORSO);
    const selectedSuit = Object.values(selectedParts).find(p => p.category === PartCategory.SUIT_TORSO);
    const activeTorso = selectedSuit || selectedTorso;
    console.log('   - Torso activo:', activeTorso?.id || 'ninguno');
    
    if (selectedParts.HEAD) {
      const isCompatible = selectedParts.HEAD.compatible.includes(activeTorso?.id || '');
      console.log('   - ¿Cabeza seleccionada es compatible?', isCompatible);
    }
  }
  
  const nonePart = createNonePart(activeCategory, selectedArchetype);

  const isPartSelected = (part: Part): boolean => {
    if (part.attributes?.none) {
      return !Object.values(previewParts).some(p => p.category === activeCategory);
    }
    return previewParts[activeCategory]?.id === part.id;
  };

  const partsToShow = [nonePart, ...availableParts];

  return (
    <div id="part-selector-panel" className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-150 ease-out animate-fadeIn" ref={ref}>
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={handleCancelChanges} />
      
      {/* Side panel */}
      <div 
        className="absolute top-0 w-[400px] xl:w-[450px] h-full flex flex-col marvel-grid backdrop-blur will-change-transform-xl shadow-2xl shadow-purple-400/20 relative overflow-hidden transition-transform duration-150 right-0 pointer-events-auto ease-out animate-slideInRight marvel-panel marvel-glow"
        onMouseLeave={() => {
          // Al salir del panel, limpiar el preview y resetear la cámara de forma definitiva
          if (characterViewerRef && characterViewerRef.current) {
            console.log('🔍 [PANEL MOUSE LEAVE] Limpiando preview y reiniciando cámara...');
            characterViewerRef.current.clearPreview(); // Limpia cualquier preview persistente
            characterViewerRef.current.resetCamera();   // Reinicia la cámara a la vista general
          }
        }}
      >
        {/* Holographic background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-cyan-400/5 to-purple-400/5 animate-holographic opacity-60" />
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/10 to-transparent opacity-50" 
             style={{
               background: 'linear-gradient(0deg, transparent 0%, rgba(147,51,234,0.1) 45%, rgba(147,51,234,0.2) 55%, transparent 100%)',
               animation: 'scan 6s linear infinite'
             }} />
        
        {/* Header */}
        <div className="relative z-10 flex flex-col p-4 border-b border-white/10 bg-slate-900/50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black uppercase tracking-wider truncate marvel-title flex-1" 
                style={{ fontFamily: 'RefrigeratorDeluxeHeavy, sans-serif' }}>
              {getCategoryName(activeCategory)}
            </h2>
            <div className="flex items-center gap-2 flex-shrink-0">
              {hasChanges && (
                <button
                  onClick={handleResetPreview}
                  className="relative hover:shadow-lg hover:shadow-cyan-400/30 overflow-hidden bg-slate-800/80 text-slate-300 hover:text-white rounded-lg hover:scale-[1.02] transition-colors transition-transform transition-shadow duration-150 px-2 py-2 marvel-button marvel-button-inactive group"
                  title="Reset Preview"
                >
                  <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                  <RotateCcwIcon className="h-4 w-4 relative z-10" />
                </button>
              )}
              <button
                onClick={handleCancelChanges}
                className="relative hover:shadow-lg hover:shadow-cyan-400/30 overflow-hidden bg-slate-800/80 text-slate-300 hover:text-white rounded-lg hover:scale-[1.02] transition-colors transition-transform transition-shadow duration-150 px-2 py-2 marvel-button marvel-button-inactive group"
                title="Close"
              >
                <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                <XMarkIcon className="h-4 w-4 relative z-10" />
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-300 truncate" 
             style={{ fontFamily: 'RefrigeratorDeluxeBold, sans-serif' }}>
            {selectedArchetype} • {availableParts.length} options
          </p>
        </div>


        {/* Content */}
        <div className="relative z-10 flex-1 overflow-hidden p-4 bg-slate-900/30">
          {partsToShow.length <= 1 && availableParts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center marvel-panel marvel-grid backdrop-blur-sm will-change-transform bg-slate-800/50 p-6 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-400/30">
                  <XMarkIcon className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-200 mb-2 marvel-title" 
                    style={{ fontFamily: 'RefrigeratorDeluxeHeavy, sans-serif' }}>
                  No parts available
                </h3>
                <p className="text-slate-400 text-sm" 
                   style={{ fontFamily: 'RefrigeratorDeluxeBold, sans-serif' }}>
                  No compatible parts found for this combination.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 overflow-y-auto h-full compact-scrollbar pr-2"
                 style={{ 
                   scrollbarWidth: 'thin',
                   scrollbarColor: 'rgba(147, 51, 234, 0.7) rgba(30, 41, 59, 0.3)'
                 }}>
              {partsToShow.map(part => (
                <PartItemCard 
                  key={part.id}
                  part={part}
                  isSelected={isPartSelected(part)}
                  onSelect={handlePreviewSelect}
                  onDoubleClick={handleDoubleClickApply}
                  onHover={handleHoverPreview}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Apply/Cancel buttons */}
        <div className="relative z-10 p-4 border-t border-white/10 bg-slate-900/50">
          <div className="flex flex-col gap-3">
            <div className="text-sm text-slate-300" 
                 style={{ fontFamily: 'RefrigeratorDeluxeBold, sans-serif' }}>
              {hasChanges ? (
                <span className="text-orange-400 font-bold">• Changes previewed - click Apply to save</span>
              ) : (
                <span>Hover to preview • Click to select • Double-click to apply</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelChanges}
                className="marvel-action-btn cancel flex-1"
                style={{ fontFamily: 'RefrigeratorDeluxeBold, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={handleApplyChanges}
                disabled={false}
                className={`marvel-action-btn flex-1`}
                style={{ fontFamily: 'RefrigeratorDeluxeBold, sans-serif' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartSelectorPanel;