import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Part, PartCategory, ArchetypeId, SelectedParts } from '../types';
import { ALL_PARTS, createNonePart } from '../constants';
import PartItemCard from './PartItemCard';
import { getCategoryName, assignDefaultHandsForTorso, assignAdaptiveHeadForTorso, assignAdaptiveBootsForTorso, assignAdaptiveCapeForTorso, assignAdaptiveSymbolForTorso, assignAdaptiveSuitTorsoForTorso } from '../lib/utils'; 
import { XMarkIcon /*, CheckIcon, RotateCcwIcon*/ } from './icons';

// import { GamingButton } from './ui/gaming-button'; // Removed: no longer used
// import { GlassPanel } from './ui/glass-panel'; // Removed: no longer used
import { CharacterViewerRef } from './CharacterViewer';

interface PartSelectorPanelProps {
  activeCategory: PartCategory | null;
  selectedArchetype: ArchetypeId | null;
  selectedParts: SelectedParts;
  onPartSelect: (newSelectedParts: SelectedParts) => void;
  onClose: () => void;
  onPreviewChange?: (previewParts: SelectedParts) => void;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
  characterViewerRef?: React.RefObject<CharacterViewerRef>;
  ownedPartIds?: Set<string>;
  favoriteIds?: Set<string>;
  onToggleFavorite?: (partId: string) => void;
  getRecentParts?: (category: string) => string[];
}

const PartSelectorPanel: React.FC<PartSelectorPanelProps> = ({
  activeCategory,
  selectedArchetype,
  selectedParts,
  onPartSelect,
  onClose,
  onPreviewChange,
  id,
  registerElement,
  characterViewerRef,
  ownedPartIds = new Set(),
  favoriteIds = new Set(),
  onToggleFavorite,
  getRecentParts,
}) => {

  const [previewParts, setPreviewParts] = useState<SelectedParts>(selectedParts);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep previewParts in sync when the external selectedParts changes (pose navigation, archetype switch, etc.)
  useEffect(() => {
    setPreviewParts(selectedParts);
    setHasChanges(false);
  }, [selectedParts]);



  const handleCancelChanges = useCallback(() => {
    // console.log('?? [CANCEL CHANGES] Reiniciando c�mara...');
    setPreviewParts(selectedParts);
    setHasChanges(false);
    if (onPreviewChange) {
      // ? FIXED: Send empty object to clear preview without triggering Smart Loading
      onPreviewChange({});
    }
    // ? REMOVED: No resetCamera() to avoid zoom
    onClose();
  }, [selectedParts, onPreviewChange, onClose, characterViewerRef]);

  const handleResetPreview = useCallback(() => {
    setPreviewParts(selectedParts);
    setHasChanges(false);
    if (onPreviewChange) {
      // ? FIXED: Send empty object to clear preview without triggering Smart Loading
      onPreviewChange({});
    }
  }, [selectedParts, onPreviewChange]);

  const handleApplyChanges = useCallback(() => {
    onPartSelect(previewParts);
    setHasChanges(false);
    onClose();
  }, [previewParts, onPartSelect, onClose]);

  const handlePreviewSelect = useCallback((part: Part) => {
    if (!activeCategory) {
      // console.log('? No activeCategory, cannot preview selection');
      return;
    }
    
    let newPreviewParts = { ...previewParts };
    
    // Remove existing parts of the same category - use category as key
    delete newPreviewParts[activeCategory];
    
    // SPECIAL CASE: If selecting a torso, recalculate compatible parts
    if (activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO) {
      // console.log('?? TORSO SELECT: Recalculating compatible parts for torso:', part.id);
      
      if (part.attributes?.none) {
        // For "none" torso, remove torso and all torso-dependent parts
        delete newPreviewParts[activeCategory];
        delete newPreviewParts[PartCategory.HEAD];
        delete newPreviewParts[PartCategory.HAND_LEFT];
        delete newPreviewParts[PartCategory.HAND_RIGHT];
        delete newPreviewParts[PartCategory.SYMBOL];
        delete newPreviewParts[PartCategory.CAPE];
        delete newPreviewParts[PartCategory.SUIT_TORSO];
      } else {
        // ? CRITICAL: Remove both TORSO and SUIT_TORSO when selecting either
        if (activeCategory === PartCategory.TORSO) {
          delete newPreviewParts[PartCategory.TORSO];
          delete newPreviewParts[PartCategory.SUIT_TORSO];
        } else if (activeCategory === PartCategory.SUIT_TORSO) {
          delete newPreviewParts[PartCategory.SUIT_TORSO];
          delete newPreviewParts[PartCategory.TORSO];
        }
        
        newPreviewParts[activeCategory] = part;

        // Chain sequentially so each step builds on the previous result
        const afterHands = assignDefaultHandsForTorso(part, newPreviewParts);
        const afterHead = assignAdaptiveHeadForTorso(part, afterHands);

        const withSymbol = { ...afterHead };
        const currentSymbol = selectedParts[PartCategory.SYMBOL];
        if (currentSymbol) withSymbol[PartCategory.SYMBOL] = currentSymbol;
        const afterSymbol = assignAdaptiveSymbolForTorso(part, afterHead, withSymbol);

        const withCape = { ...afterSymbol };
        const currentCape = selectedParts[PartCategory.CAPE];
        if (currentCape) withCape[PartCategory.CAPE] = currentCape;
        const afterCape = assignAdaptiveCapeForTorso(part, afterSymbol, withCape);

        const withSuit = { ...afterCape };
        const currentSuit = selectedParts[PartCategory.SUIT_TORSO];
        if (currentSuit) withSuit[PartCategory.SUIT_TORSO] = currentSuit;
        newPreviewParts = assignAdaptiveSuitTorsoForTorso(part, afterCape, withSuit);
        
        // console.log('? TORSO SELECT: Updated preview state:', {
        //   allParts: Object.keys(newPreviewParts),
        //   torso: newPreviewParts[activeCategory]?.id || 'removed',
        //   head: newPreviewParts[PartCategory.HEAD]?.id || 'removed',
        //   leftHand: newPreviewParts[PartCategory.HAND_LEFT]?.id || 'removed',
        //   rightHand: newPreviewParts[PartCategory.HAND_RIGHT]?.id || 'removed',
        //   symbol: newPreviewParts[PartCategory.SYMBOL]?.id || 'removed',
        //   cape: newPreviewParts[PartCategory.CAPE]?.id || 'removed'
        // });
      }
    }
    // SPECIAL CASE: If selecting legs, recalculate compatible boots
    else if (activeCategory === PartCategory.LOWER_BODY) {
      // console.log('?? LEGS SELECT: Recalculating compatible boots for legs:', part.id);
      
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
    // SPECIAL CASE: If selecting a symbol, verify compatibility with current torso
    else if (activeCategory === PartCategory.SYMBOL) {
      
      if (part.attributes?.none) {
        delete newPreviewParts[activeCategory];
      } else {
        const currentTorso = previewParts[PartCategory.TORSO] || previewParts[PartCategory.SUIT_TORSO];
        
        if (!currentTorso) {
          newPreviewParts[activeCategory] = part;
        } else {
          // Check if the selected symbol is compatible with current torso
          const isCompatible = part.compatible.includes(currentTorso.id);
          
          if (isCompatible) {
            newPreviewParts[activeCategory] = part;
          } else {
            
            // Find compatible symbol of the same type
            const currentType = part.id.match(/strong_symbol_(\d+)_t\d+/)?.[1];
            let compatibleSymbol = null;
            
            if (currentType) {
              compatibleSymbol = ALL_PARTS.find(p => 
                p.category === PartCategory.SYMBOL &&
                p.archetype === currentTorso.archetype &&
                p.compatible.includes(currentTorso.id) &&
                p.id.includes(`strong_symbol_${currentType}_`)
              );
            }
            
            if (compatibleSymbol) {
              newPreviewParts[activeCategory] = compatibleSymbol;
            } else {
              // Use first compatible symbol
              const firstCompatible = ALL_PARTS.find(p => 
                p.category === PartCategory.SYMBOL &&
                p.archetype === currentTorso.archetype &&
                p.compatible.includes(currentTorso.id)
              );
              
              if (firstCompatible) {
                newPreviewParts[activeCategory] = firstCompatible;
              } else {
                delete newPreviewParts[activeCategory];
              }
            }
          }
        }
      }
    }
    // GENERIC CASE: For all other categories using complete state pattern
    else {
      // console.log(`?? ${activeCategory} SELECT: Using complete state pattern for:`, part.id);
      
      // IMPLEMENTADO - Patr�n gen�rico para todas las categor�as seg�n documentaci�n
      const categoriesWithCompleteState = [
        PartCategory.HEAD, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT,
        PartCategory.BACKPACK, PartCategory.CHEST_BELT, PartCategory.BELT,
        PartCategory.BUCKLE, PartCategory.POUCH, PartCategory.SHOULDERS,
        PartCategory.FOREARMS, PartCategory.BOOTS, PartCategory.CAPE // Removed SYMBOL from here
      ];

      if (categoriesWithCompleteState.includes(activeCategory)) {
        if (part.attributes?.none) {
          delete newPreviewParts[activeCategory];
        } else {
          newPreviewParts[activeCategory] = part;
        }
        
        // console.log(`? ${activeCategory} SELECT: Complete state pattern applied:`, {
        //   allParts: Object.keys(newPreviewParts),
        //   changedPart: `${activeCategory}: ${newPreviewParts[activeCategory]?.id || 'removed'}`
        // });
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
    setHasChanges(false);
    // Don't call onPreviewChange here — it sets isHoverPreviewActive=true in CharacterViewer
    // which blocks the main model loading effect triggered by onPartSelect below.
    // The hover preview is only for mouseover; clicks go directly through onPartSelect.
    onPartSelect(newPreviewParts);
  }, [activeCategory, previewParts, selectedParts, onPartSelect]);

  const handleHoverPreview = useCallback((part: Part | null) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
    if (!activeCategory || !onPreviewChange) return;

    let hoverPreviewParts: SelectedParts = { ...selectedParts };

    // Determinar la parte a mostrar en el preview. Si es null o "none", se considera que no hay parte.
    const partToDisplay: Part | null = (part && !part.attributes?.none) ? part : null;



    // L�gica de preview para los modelos: asegurar que hoverPreviewParts siempre tiene Part o se elimina la clave.
    if (partToDisplay) {
      hoverPreviewParts[activeCategory] = partToDisplay;
    } else {
      delete hoverPreviewParts[activeCategory];
    }

    // ??? PROTEGIDO: SPECIAL CASE - NO MODIFICAR ESTA L�GICA
    // ? Si se hace hover sobre un torso, recalcular partes compatibles
    // ? NO CAMBIAR - Sistema de eliminaci�n y compatibilidad cr�tico
    if (activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO) {
      // console.log('?? TORSO HOVER: Recalculando partes compatibles para torso:', partToDisplay?.id || 'none');

      const partsWithoutCurrentTorso = { ...selectedParts };
      if (activeCategory === PartCategory.TORSO) {
        delete partsWithoutCurrentTorso[PartCategory.TORSO];
        delete partsWithoutCurrentTorso[PartCategory.SUIT_TORSO];
      } else if (activeCategory === PartCategory.SUIT_TORSO) {
        delete partsWithoutCurrentTorso[PartCategory.SUIT_TORSO];
        delete partsWithoutCurrentTorso[PartCategory.TORSO];
      }

      // Si hay una parte de torso para mostrar, la usamos para la compatibilidad
      if (partToDisplay) {
        // ? FIXED: Preservar manos existentes antes de aplicar compatibilidad
        // El problema era que partsWithoutCurrentTorso no conten�a las manos
        const partsWithHands = { ...partsWithoutCurrentTorso };
        
        // Chain sequentially so each step builds on the previous result
        const afterHands = assignDefaultHandsForTorso(partToDisplay, partsWithHands);
        const afterHead = assignAdaptiveHeadForTorso(partToDisplay, afterHands);

        const withSymbol = { ...afterHead };
        const currentSymbol = selectedParts[PartCategory.SYMBOL];
        if (currentSymbol) withSymbol[PartCategory.SYMBOL] = currentSymbol;
        const afterSymbol = assignAdaptiveSymbolForTorso(partToDisplay, afterHead, withSymbol);

        const withCape = { ...afterSymbol };
        const currentCape = selectedParts[PartCategory.CAPE];
        if (currentCape) withCape[PartCategory.CAPE] = currentCape;
        const afterCape = assignAdaptiveCapeForTorso(partToDisplay, afterSymbol, withCape);

        const withSuit = { ...afterCape };
        const currentSuit = selectedParts[PartCategory.SUIT_TORSO];
        if (currentSuit) withSuit[PartCategory.SUIT_TORSO] = currentSuit;
        hoverPreviewParts = {
          ...assignAdaptiveSuitTorsoForTorso(partToDisplay, afterCape, withSuit),
          [activeCategory]: partToDisplay
        };
      } else {
        // Si es "none" torso, asegurar que las dependencias tambi�n se eliminan del preview
        delete hoverPreviewParts[PartCategory.TORSO];
        delete hoverPreviewParts[PartCategory.SUIT_TORSO];
        delete hoverPreviewParts[PartCategory.HEAD];
        delete hoverPreviewParts[PartCategory.HAND_LEFT];
        delete hoverPreviewParts[PartCategory.HAND_RIGHT];
        delete hoverPreviewParts[PartCategory.SYMBOL];
        delete hoverPreviewParts[PartCategory.CAPE];
      }

      // console.log('? TORSO HOVER: Enviando estado de preview (siguiendo reglas cr�ticas):', {
      //   allParts: Object.keys(hoverPreviewParts),
      //   torso: hoverPreviewParts[PartCategory.TORSO]?.id || 'removed',
      //   suitTorso: hoverPreviewParts[PartCategory.SUIT_TORSO]?.id || 'removed',
      //   head: hoverPreviewParts[PartCategory.HEAD]?.id || 'removed',
      //   leftHand: hoverPreviewParts[PartCategory.HAND_LEFT]?.id || 'removed',
      //   rightHand: hoverPreviewParts[PartCategory.HAND_RIGHT]?.id || 'removed',
      //   symbol: hoverPreviewParts[PartCategory.SYMBOL]?.id || 'removed',
      //   cape: hoverPreviewParts[PartCategory.CAPE]?.id || 'removed'
      // });
    }
    // SPECIAL CASE: Si se hace hover sobre las piernas, recalcular las botas compatibles
    else if (activeCategory === PartCategory.LOWER_BODY) {
      
      // ? COPIAR L�GICA DEL TORSO: Crear copia sin la parte actual
      const partsWithoutCurrentLegs = { ...selectedParts };
      delete partsWithoutCurrentLegs[PartCategory.LOWER_BODY];

      // Si hay una parte de piernas para mostrar, la usamos para la compatibilidad
      if (partToDisplay) {
        // ? FIXED: Preservar partes existentes antes de aplicar compatibilidad
        const partsWithLegs = { ...partsWithoutCurrentLegs };
        
        // ? APLICAR FUNCIONES DE COMPATIBILIDAD EN ORDEN - SIGUIENDO REGLAS CR�TICAS
        const fullCompatibleParts = assignAdaptiveBootsForTorso(partToDisplay, partsWithLegs);
        
        // ? COMBINAR TODOS LOS RESULTADOS - SIGUIENDO REGLAS CR�TICAS
        hoverPreviewParts = { 
          ...partsWithoutCurrentLegs,
          ...fullCompatibleParts, 
          [activeCategory]: partToDisplay 
        };
      } else {
        // ? FIXED: Si es "none" piernas, eliminar piernas y botas del preview
        hoverPreviewParts = { ...partsWithoutCurrentLegs };
        delete hoverPreviewParts[PartCategory.LOWER_BODY];
        delete hoverPreviewParts[PartCategory.BOOTS];
      }
    }
    // CASO GEN�RICO: Para todas las dem�s categor�as que usan el patr�n de estado completo
    else {
      // console.log(`?? ${activeCategory} HOVER: Usando patr�n de estado completo para:`, partToDisplay?.id || 'none');
      const categoriesWithCompleteState = [
        PartCategory.HEAD, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT,
        PartCategory.BACKPACK, PartCategory.CHEST_BELT, PartCategory.BELT,
        PartCategory.BUCKLE, PartCategory.POUCH, PartCategory.SHOULDERS,
        PartCategory.FOREARMS, PartCategory.BOOTS, PartCategory.SYMBOL, PartCategory.CAPE // Added CAPE here
      ];
      if (categoriesWithCompleteState.includes(activeCategory)) {
        if (partToDisplay) {
          hoverPreviewParts[activeCategory] = partToDisplay;
        } else {
          delete hoverPreviewParts[activeCategory];
        }
        // console.log(`? ${activeCategory} HOVER: Patr�n de estado completo aplicado:`, {
        //   allParts: Object.keys(hoverPreviewParts),
        //   changedPart: `${activeCategory}: ${hoverPreviewParts[activeCategory]?.id || 'removed'}`
        // });
      }
    }
    
    // Debug espec�fico para cinturones
    if (activeCategory === PartCategory.BELT) {
      // console.log('?? BELT DEBUG - Enviando preview parts:', hoverPreviewParts);
    }
    
    onPreviewChange(hoverPreviewParts);
    }, 150);
  }, [activeCategory, selectedParts, previewParts, onPreviewChange, characterViewerRef]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  useEffect(() => {
    registerElement(id, ref.current);
  }, [id, registerElement]);

  useEffect(() => {
    setSearchQuery('');
  }, [activeCategory]);

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

  useEffect(() => {
    if (!activeCategory || !selectedArchetype || !characterViewerRef?.current) return;
    const partsToPreload = ALL_PARTS.filter(
      p =>
        p.category === activeCategory &&
        p.archetype === selectedArchetype &&
        !p.attributes?.none &&
        Boolean(p.gltfPath)
    );
    characterViewerRef.current.preloadParts(partsToPreload);
  }, [activeCategory, selectedArchetype]);

  if (!selectedArchetype || !activeCategory) {
    // console.log('?? PartSelectorPanel not showing - missing:', { selectedArchetype, activeCategory });
    return null; 
  }
  
  // Debug b�sico para verificar datos
  // console.log('?? PartSelectorPanel DEBUG - Datos b�sicos:', {
  //   selectedArchetype,
  //   activeCategory,
  //   totalPartsInALL_PARTS: ALL_PARTS.length,
  //   partsForThisCategory: ALL_PARTS.filter(p => p.category === activeCategory).length,
  //   partsForThisArchetype: ALL_PARTS.filter(p => p.archetype === selectedArchetype).length
  // });
  


  // Test simple para verificar ALL_PARTS (comentado)
  // console.log('?? ALL_PARTS test:', {
  //   totalParts: ALL_PARTS.length,
  //   firstPart: ALL_PARTS[0] ? { id: ALL_PARTS[0].id, category: ALL_PARTS[0].category, archetype: ALL_PARTS[0].archetype } : 'none'
  // });

  // Debug espec�fico para arquetipos (comentado)
  // const strongParts = ALL_PARTS.filter(p => p.archetype === ArchetypeId.STRONG);
  // console.log('?? STRONG archetype debug:', {
  //   totalStrongParts: strongParts.length,
  //   strongPartsForCategory: strongParts.filter(p => p.category === activeCategory).length
  // });

  const availableParts = ALL_PARTS.filter(part => {
    // Debug espec�fico para cabezas de torso 04
    // if (activeCategory === PartCategory.HEAD && part.id.includes('t04')) {
    //   console.log(`?? Debugging ${part.id}:`, {
    //     category: part.category,
    //     archetype: part.archetype,
    //     selectedArchetype,
    //     compatible: part.compatible,
    //     categoryMatch: part.category === activeCategory,
    //     archetypeMatch: part.archetype === selectedArchetype
    //   });
    // }
    
    // Debug espec�fico para cinturones
    // if (activeCategory === PartCategory.BELT && part.category === PartCategory.BELT) {
    //   console.log(`?? BELT DEBUG - Filtering ${part.id}:`, {
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
    
    // Debug espec�fico para botas
    // if (activeCategory === PartCategory.BOOTS && part.category === PartCategory.BOOTS) {
    //   const selectedLegs = selectedParts[PartCategory.LOWER_BODY];
    //   console.log(`?? BOOTS DEBUG - Filtering ${part.id}:`, {
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
    

    
    // Verificaci�n b�sica de categor�a y arquetipo
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
    
    // Caso especial para BUCKLE - independiente de belt
    if (part.category === PartCategory.BUCKLE) {
      return true; // BUCKLE es independiente, mostrar todos los buckles
    }
    

    
    // Caso especial para CAPE - verificar compatibilidad con torso
    if (part.category === PartCategory.CAPE) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      if (!selectedTorso) {
        return part.compatible.includes('strong_torso_01');
      }
      return part.compatible.includes(selectedTorso.id);
    }
    
    // Caso especial para HEAD - verificar compatibilidad con torso
    if (part.category === PartCategory.HEAD) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      if (!selectedTorso) {
        return part.compatible.includes('strong_torso_01');
      }
      return part.compatible.includes(selectedTorso.id);
    }
    
    // Caso especial para SYMBOL - verificar compatibilidad con torso
    if (part.category === PartCategory.SYMBOL) {
      const selectedTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
      if (!selectedTorso) {
        return part.compatible.includes('strong_torso_01');
      }
      return part.compatible.includes(selectedTorso.id);
    }
    
    // Caso especial para CHEST_BELT - usar l�gica de nombres
    if (part.category === PartCategory.CHEST_BELT) {
      const selectedTorso = selectedParts[PartCategory.TORSO];
      const selectedSuit = selectedParts[PartCategory.SUIT_TORSO];
      const activeTorso = selectedSuit || selectedTorso;
      
      if (!activeTorso) {
        return true;
      }
      
      // Extraer el n�mero del torso activo
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
      
      // Para chest belt, verificar si es espec�fico para el torso o gen�rico
      // Gen�rico: strong_beltchest_01_np (compatible con todos los torsos)
      // Espec�fico: strong_beltchest_01_t01, strong_beltchest_01_t01_np, etc.
      const isGeneric = part.id === 'strong_beltchest_01_np';
      const isSpecificForTorso = part.id.includes(`_t${torsoNumber}`);
      
  
      
      return isGeneric || isSpecificForTorso;
    }
    
    // Caso especial para MANOS - verificar compatibilidad con torso
    if (part.category === PartCategory.HAND_LEFT || part.category === PartCategory.HAND_RIGHT) {
      const selectedTorso = selectedParts[PartCategory.TORSO];
      const selectedSuit = selectedParts[PartCategory.SUIT_TORSO];
      const activeTorso = selectedSuit || selectedTorso;
      
      // ? SOLUCI�N ROBUSTA: Si no hay torso, usar torso por defecto
      if (!activeTorso) {
        // Usar strong_torso_01 como fallback para usuarios no logueados
        return part.compatible.includes('strong_torso_01');
      }
      
      // Para suit torsos, extraer el torso base para verificar compatibilidad
      let baseTorsoId = activeTorso.id;
      if (selectedSuit) {
        const suitMatch = selectedSuit.id.match(/strong_suit_torso_\d+_t(\d+)/);
        if (suitMatch) {
          const torsoNumber = suitMatch[1];
          baseTorsoId = `strong_torso_${torsoNumber}`;
        }
      }
      
      return part.compatible.includes(baseTorsoId);
    }
    
    // Para todas las dem�s categor�as, usar l�gica de compatibilidad est�ndar
    const selectedTorso = selectedParts[PartCategory.TORSO];
    const selectedSuit = selectedParts[PartCategory.SUIT_TORSO];
    const activeTorso = selectedSuit || selectedTorso;
    
    // ? FIXED: Para guest users, usar torso por defecto si no hay torso seleccionado
    if (!activeTorso) {
      // Usar strong_torso_01 como fallback para usuarios no logueados
      return part.compatible.includes('strong_torso_01');
    }
    
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
  

  
  // Debug espec�fico para chest belt
  if (activeCategory === PartCategory.CHEST_BELT) {
    // console.log('?? DEBUG CHEST_BELT - PartSelectorPanel:');
    // console.log('   - Torso activo:', Object.values(selectedParts).find(p => p.category === PartCategory.TORSO)?.id || 'ninguno');
    // console.log('   - Suit activo:', Object.values(selectedParts).find(p => p.category === PartCategory.SUIT_TORSO)?.id || 'ninguno');
    // console.log('   - Chest belts disponibles:', availableParts.map(p => p.id));
    // console.log('   - Total chest belts en ALL_PARTS:', ALL_PARTS.filter(p => p.category === PartCategory.CHEST_BELT).length);
  }
  
  // Debug espec�fico para buckles
  if (activeCategory === PartCategory.BUCKLE) {
  }
  
  // Debug espec�fico para cabezas
  if (activeCategory === PartCategory.HEAD) {
    // console.log('?? DEBUG CABEZAS - PartSelectorPanel:');
    // console.log('   - Cabeza actualmente seleccionada:', selectedParts.HEAD?.id || 'ninguna');
    // console.log('   - Cabeza en preview:', previewParts.HEAD?.id || 'ninguna');
    // console.log('   - Todas las cabezas disponibles:', availableParts.map(p => p.id));
    
    // Verificar si la cabeza seleccionada est� en las disponibles
    // const selectedHeadInAvailable = availableParts.find(p => p.id === selectedParts.HEAD?.id); // Removed: not used
    // console.log('   - �Cabeza seleccionada est� disponible?', selectedHeadInAvailable ? 'S�' : 'NO');
    
    // Verificar compatibilidad
    // const selectedTorso = Object.values(selectedParts).find(p => p.category === PartCategory.TORSO); // Removed: not used
    // const selectedSuit = Object.values(selectedParts).find(p => p.category === PartCategory.SUIT_TORSO); // Removed: not used
    // const activeTorso = selectedSuit || selectedTorso; // Removed: not used
    // console.log('   - Torso activo:', activeTorso?.id || 'ninguno');
    
    if (selectedParts.HEAD) {
      // const isCompatible = selectedParts.HEAD.compatible.includes(activeTorso?.id || ''); // Removed: not used
      // console.log('   - �Cabeza seleccionada es compatible?', isCompatible);
    }
  }
  
  const nonePart = activeCategory && selectedArchetype ? createNonePart(activeCategory, selectedArchetype) : null;

  const isPartSelected = (part: Part): boolean => {
    if (part.attributes?.none) {
      return !Object.values(previewParts).some(p => p.category === activeCategory);
    }
    return previewParts[activeCategory]?.id === part.id;
  };

  const recentIds = activeCategory && getRecentParts ? getRecentParts(activeCategory) : [];
  const sortedAvailable = recentIds.length
    ? [...availableParts].sort((a, b) => {
        const ai = recentIds.indexOf(a.id);
        const bi = recentIds.indexOf(b.id);
        if (ai === -1 && bi === -1) return 0;
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
    : availableParts;
  const allPartsToShow = (nonePart ? [nonePart] : []).concat(sortedAvailable).filter(part => part && typeof part === 'object' && part.id);
  const partsToShow = allPartsToShow.filter(p => {
    if (p.attributes?.none) return true;
    if (showFavoritesOnly && !favoriteIds.has(p.id)) return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const hasFavorites = allPartsToShow.some(p => !p.attributes?.none && favoriteIds.has(p.id));

  return (
    <div id="part-selector-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }} ref={ref}>
      {/* Header */}
      <div className="panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getCategoryName(activeCategory)}</span>
          {allPartsToShow.length > 0 && (
            <span style={{
              fontSize: 8, fontFamily: 'var(--font-body)', fontWeight: 700,
              background: 'rgba(216,162,58,0.12)', color: 'var(--color-accent)',
              border: '1px solid rgba(216,162,58,0.25)',
              padding: '1px 5px', borderRadius: 3, letterSpacing: 0.5, flexShrink: 0,
            }}>
              {partsToShow.length === allPartsToShow.length ? allPartsToShow.length : `${partsToShow.length}/${allPartsToShow.length}`}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {hasFavorites && (
            <button
              onClick={() => setShowFavoritesOnly(v => !v)}
              title={showFavoritesOnly ? 'Show all parts' : 'Show favorites only'}
              style={{
                background: showFavoritesOnly ? 'rgba(244,63,94,0.15)' : 'none',
                border: showFavoritesOnly ? '1px solid rgba(244,63,94,0.4)' : 'none',
                borderRadius: 4, cursor: 'pointer', fontSize: 13, padding: '1px 5px',
                color: showFavoritesOnly ? '#f43f5e' : 'rgba(100,116,139,0.7)',
              }}
            >♥</button>
          )}
          <button
            onClick={handleCancelChanges}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}
          >✕</button>
        </div>
      </div>

      {/* Search bar */}
      {allPartsToShow.length > 6 && (
        <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Buscar parte..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              color: 'var(--color-text)', fontFamily: 'var(--font-body)', fontSize: 11,
              padding: '5px 8px', outline: 'none', borderRadius: 'var(--radius)',
            }}
          />
        </div>
      )}

      {/* Content */}
      {partsToShow.length <= 1 && availableParts.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <XMarkIcon className="h-8 w-8" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontFamily: 'var(--font-comic)', fontSize: 13, color: 'var(--color-text-muted)' }}>Sin partes compatibles para esta combinación.</p>
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          alignContent: 'start',
        }}
        onMouseLeave={() => {
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
          if (onPreviewChange) onPreviewChange({});
        }}
      >
          {partsToShow.map(part => {
            if (!part || typeof part !== 'object' || !part.id) {
              return null;
            }
            return (
              <PartItemCard
                key={part.id}
                part={part}
                isSelected={isPartSelected(part)}
                onSelect={handlePreviewSelect}
                onHover={handleHoverPreview}
                ownedPartIds={ownedPartIds}
                favoriteIds={favoriteIds}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      )}

      {/* Footer with Apply button */}
      <div style={{ padding: '10px 12px', borderTop: '2px solid var(--color-border)', background: 'var(--color-bg)', flexShrink: 0 }}>
        <button
          className="btn-comic btn-primary"
          style={{ width: '100%', padding: '10px', fontSize: 18, letterSpacing: 3 }}
          onClick={handleApplyChanges}
        >
          ✓ APLICAR
        </button>
      </div>
    </div>
  );
};

export default PartSelectorPanel;
