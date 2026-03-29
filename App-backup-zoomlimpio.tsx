import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ArchetypeId, PartCategory, SelectedParts, Part } from './types';
import { ALL_PARTS, DEFAULT_STRONG_BUILD, DEFAULT_JUSTICIERO_BUILD, TORSO_DEPENDENT_CATEGORIES } from './constants';
import CharacterViewer, { CharacterViewerRef } from './components/CharacterViewer';

import PartSelectorPanel from './components/PartSelectorPanel';
import ShoppingCart from './components/ShoppingCart';
import StandardShoppingCart from './components/StandardShoppingCart';
import { ShieldCheckIcon, Cog6ToothIcon, UserIcon, BookOpenIcon, SparklesIcon, ShoppingCartIcon } from './components/icons';
import ArchetypeSelector from './components/ArchetypeSelector';
import VerticalArchetypeSelector from './components/VerticalArchetypeSelector';
import PartCategoryToolbar from './components/PartCategoryToolbar';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import AiDesignerModal from './components/AiDesignerModal';
import PurchaseConfirmation from './components/PurchaseConfirmation';
import PurchaseLibrary from './components/PurchaseLibrary';
import GuestEmailModal from './components/GuestEmailModal';
import { GamingButton } from './components/ui/gaming-button';
import { GlassPanel } from './components/ui/glass-panel';
import { useAuth } from './hooks/useAuth';
import { assignDefaultHandsForTorso, assignAdaptiveHeadForTorso, assignAdaptiveCapeForTorso, assignAdaptiveBootsForTorso, assignAdaptiveSymbolForTorso, assignAdaptiveSuitTorsoForTorso } from './lib/utils';
import { SessionStorageService } from './services/sessionStorageService';
import { generateBuild, isAIServiceAvailable } from './services/openaiService';
import { BattleDemo } from './battle-prototype';
import { modelCache } from './lib/modelCache';
import ErrorBoundary from './components/ErrorBoundary';

import ExportButton from './components/ExportButton';
import { PurchaseHistoryService } from './services/purchaseHistoryService';
import { ResendEmailService } from './services/resendEmailService';
import { UserConfigService } from './services/userConfigService';
import { Card } from "./components/ui/card";
import HeaderDropdown from './components/HeaderDropdown';
import MaterialPanel from './components/MaterialPanel';
import { createStripeCheckoutSession, redirectToCheckout } from './services/stripeService';
import LastPoseIndicator from './components/LastPoseIndicator';
import RPGCharacterSheetManager from './components/rpg-sheets/RPGCharacterSheetManager';
import RPGCharacterSheet from './components/RPGCharacterSheet';
import { RPGCharacterSync } from './types';

// Hacer disponible para debugging en consola
(window as any).ResendEmailService = ResendEmailService;

// Tipo para items del carrito
interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  thumbnail: string;
  quantity: number;
  configuration: SelectedParts;
  archetype: string;
}

// ✅ CORREGIDO: Importar desde constants.ts para evitar duplicación
// HEAD, CAPE, MANOS ya no se eliminan aquí - se preservan explícitamente

const AppContent: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(ArchetypeId.STRONG);
  const [selectedParts, setSelectedParts] = useState<SelectedParts>({});
  const [activeCategory, setActiveCategory] = useState<PartCategory | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{ hasSession: boolean; lastSaved?: string; source?: 'supabase' | 'localStorage' }>({ hasSession: false });
  const [showBattleDemo, setShowBattleDemo] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSavingLastPose, setIsSavingLastPose] = useState(false);
  const [characterName, setCharacterName] = useState('STRONG');
  const [rpgCharacter, setRpgCharacter] = useState<RPGCharacterSync | null>(null);


  // Estados del carrito de compras
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Estado para confirmación de compra
  const [isPurchaseConfirmationOpen, setIsPurchaseConfirmationOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{
    items: CartItem[];
    totalPaid: number;
    isGuestUser?: boolean;
    guestEmail?: string;
  } | null>(null);

  // Estado para biblioteca de compras
  const [isPurchaseLibraryOpen, setIsPurchaseLibraryOpen] = useState(false);

  // Estado para modal de email de invitado
  const [isGuestEmailModalOpen, setIsGuestEmailModalOpen] = useState(false);
  const [guestEmailData, setGuestEmailData] = useState<{
    cartItems: CartItem[];
    totalPrice: number;
  } | null>(null);

  // Estado para hojas de personaje RPG
  const [isRPGSheetOpen, setIsRPGSheetOpen] = useState(false);

  // Estado para navegación de poses guardadas
  const [savedPoses, setSavedPoses] = useState<Array<{
    id: string;
    name: string;
    configuration: SelectedParts;
    source: 'purchase' | 'saved';
    date: string;
  }>>([]);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  
  // Key to force CharacterViewer re-render
  const [characterViewerKey, setCharacterViewerKey] = useState(0);

  const { isAuthenticated, loading, signOut, user } = useAuth();

  // Empty function for components that expect registerElement (tutorial functionality removed)
  const registerElement = (id: string, element: HTMLElement | null) => {};

  const characterViewerRef = useRef<CharacterViewerRef>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // Log activeCategory changes in development only
  useEffect(() => {
    if (import.meta.env.DEV) {
    console.log('🔄 activeCategory changed to:', activeCategory);
    }
  }, [activeCategory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Reset camera with 'R' key (only if not typing in an input)
      if (event.key.toLowerCase() === 'r' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) {
        event.preventDefault();
        handleResetCamera();
        console.log('📷 Camera reset triggered by keyboard shortcut (R)');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Guardar última pose cuando el usuario salga de la página
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (selectedArchetype && savedPoses.length > 0) {
        try {
          console.log('💾 Guardando última pose antes de salir...');
          setIsSavingLastPose(true);
          await SessionStorageService.saveLastPose(
            selectedArchetype,
            selectedParts,
            currentPoseIndex,
            savedPoses
          );
          console.log('✅ Última pose guardada antes de salir');
          setIsSavingLastPose(false);
        } catch (error) {
          console.error('❌ Error guardando última pose antes de salir:', error);
          setIsSavingLastPose(false);
        }
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        await handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedArchetype, selectedParts, currentPoseIndex, savedPoses]);

  useEffect(() => {
    const loadSessionOnAuthChange = async () => {
      if (isAuthenticated) {
        const savedSession = await SessionStorageService.loadSession();
        if (savedSession) {
          setSelectedArchetype(savedSession.selectedArchetype);
          setSelectedParts(savedSession.selectedParts);
        }
      }
    };
    loadSessionOnAuthChange();
  }, [isAuthenticated, loading, user]);

  // Cargar última pose guardada al iniciar la aplicación (solo para usuarios no autenticados)
  useEffect(() => {
    const loadLastPose = async () => {
      // ✅ Si está autenticado, la carga principal se encarga de todo. No hacer nada aquí.
      if (isAuthenticated || loading) return;

      try {
        const lastPoseData = await SessionStorageService.loadLastPose();
        if (lastPoseData) {
          console.log('🔄 Cargando última pose guardada (localStorage)...');
          setSelectedArchetype(lastPoseData.selectedArchetype);
          setSelectedParts(lastPoseData.selectedParts);
          setSavedPoses(lastPoseData.savedPoses);
          setCurrentPoseIndex(lastPoseData.lastPoseIndex);
          console.log(`✅ Última pose cargada: ${lastPoseData.lastPoseIndex + 1}/${lastPoseData.savedPoses.length}`);
        }
      } catch (error) {
        console.error('❌ Error cargando última pose:', error);
      }
    };

    // Solo cargar si no hay poses ya cargadas Y no está autenticado Y no está cargando
    if (savedPoses.length === 0 && !isAuthenticated && !loading) {
      loadLastPose();
    }
  }, [isAuthenticated, loading]);

  useEffect(() => {
    const updateSessionInfo = async () => {
      const info = await SessionStorageService.getSessionInfo();
      setSessionInfo(info);
    };
    updateSessionInfo();
  }, [selectedParts]);

  // Guardar automáticamente la última pose cuando cambie
  useEffect(() => {
    const saveLastPose = async () => {
      if (selectedArchetype && savedPoses.length > 0) {
        try {
          setIsSavingLastPose(true);
          await SessionStorageService.saveLastPose(
            selectedArchetype,
            selectedParts,
            currentPoseIndex,
            savedPoses
          );
          setIsSavingLastPose(false);
        } catch (error) {
          console.error('❌ Error guardando última pose automáticamente:', error);
          setIsSavingLastPose(false);
        }
      }
    };

    // Guardar con un pequeño delay para evitar demasiadas llamadas
    const timeoutId = setTimeout(saveLastPose, 1000);
    return () => clearTimeout(timeoutId);
  }, [selectedArchetype, selectedParts, currentPoseIndex, savedPoses]);

  // Cargar configuración desde URL si existe parámetro 'load'
  useEffect(() => {
    const loadConfigurationFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const configId = urlParams.get('load');
      const shouldDownload = urlParams.get('download') === 'true';
      
      if (configId) {
        console.log('🔗 Cargando configuración desde URL:', configId);
        
        try {
          // Intentar cargar desde sessionStorage primero
          const savedConfig = sessionStorage.getItem(`config_${configId}`);
          if (savedConfig) {
            const configData = JSON.parse(savedConfig);
            console.log('✅ Configuración cargada desde sessionStorage:', configData);
            
            if (configData.selectedParts) {
              setSelectedParts(configData.selectedParts);
            }
            if (configData.selectedArchetype) {
              setSelectedArchetype(configData.selectedArchetype);
            }
            
            // Si se solicita descarga automática, esperar un momento y descargar
            if (shouldDownload) {
              console.log('📥 Iniciando descarga automática...');
              
              // Esperar un poco para que se cargue la configuración
              setTimeout(() => {
                handleExportGLB();
                
                // Mostrar mensaje de descarga
                alert('Your 3D model is downloading! 📥');
                
                // Limpiar la URL
                window.history.replaceState({}, document.title, window.location.pathname);
              }, 2000);
            } else {
              // Limpiar URL después de cargar si no hay descarga
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          } else {
            console.log('⚠️ Configuración no encontrada en sessionStorage para ID:', configId);
          }
        } catch (error) {
          console.error('❌ Error al cargar configuración desde URL:', error);
        }
      }
    };
    
    loadConfigurationFromURL();
  }, []); // Solo ejecutar una vez al montar el componente

  const handleArchetypeChange = (archetype: ArchetypeId) => {
    setSelectedArchetype(archetype);
    let newDefaultParts: SelectedParts;
    switch (archetype) {
      case ArchetypeId.STRONG:
        newDefaultParts = DEFAULT_STRONG_BUILD;
        break;
      case ArchetypeId.JUSTICIERO:
        newDefaultParts = DEFAULT_JUSTICIERO_BUILD;
        break;
      default:
        newDefaultParts = DEFAULT_STRONG_BUILD; 
    }
    setSelectedParts(newDefaultParts);
    setActiveCategory(null);
    SessionStorageService.clearSession();
    const basePath = (import.meta as any).env.BASE_URL || '/';
    const gltfPathsToPreload = Object.values(newDefaultParts)
                                   .filter((part): part is Part => !!part && !!part.gltfPath)
                                   .map(part => `${basePath}${part.gltfPath.startsWith('/') ? part.gltfPath.slice(1) : part.gltfPath}`);
    modelCache.preloadModels(gltfPathsToPreload);
  };

  const handleClearSession = async () => {
    try {
      await SessionStorageService.clearSession();
      setSessionInfo({ hasSession: false });
      setSelectedParts(DEFAULT_STRONG_BUILD);
      setSelectedArchetype(ArchetypeId.STRONG);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  const handleSelectPart = useCallback((category: PartCategory, part: Part) => {
    setSelectedParts(prev => {
      let newParts = { ...prev };

      if (category === PartCategory.SUIT_TORSO) {
        // ✅ CORREGIDO: NO eliminar el torso base inmediatamente
        // Primero preservar todas las partes, luego manejar el torso
        
        // ✅ REGLA CRÍTICA: PRESERVAR TODAS LAS PARTES ANTES DE ELIMINAR
        const currentLeftHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_LEFT);
        const currentRightHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_RIGHT);
        const currentHead = newParts[PartCategory.HEAD];
        const currentCape = newParts[PartCategory.CAPE];
        const currentSymbol = newParts[PartCategory.SYMBOL];
        const currentSuit = newParts[PartCategory.SUIT_TORSO];
        
        // ✅ OBTENER EL TORSO COMPATIBLE ANTES DE ELIMINAR NADA
        const compatibleTorsoId = part.compatible?.[0];
        if (!compatibleTorsoId) return newParts;
        const compatibleTorso = ALL_PARTS.find(p => p.id === compatibleTorsoId && p.category === PartCategory.TORSO);
        if (!compatibleTorso) return newParts;
        
        // ✅ AHORA SÍ ELIMINAR, pero manteniendo el torso base
        delete newParts[PartCategory.SUIT_TORSO]; // Solo eliminar el suit actual
        newParts[PartCategory.TORSO] = compatibleTorso; // Asignar el torso compatible
        
        // Crear un objeto temporal con las manos actuales para pasarlo a la función
        const tempParts = { ...newParts };
        if (currentLeftHand) tempParts[PartCategory.HAND_LEFT] = currentLeftHand;
        if (currentRightHand) tempParts[PartCategory.HAND_RIGHT] = currentRightHand;
        
        // Asignar automáticamente manos compatibles preservando el tipo
        newParts = assignDefaultHandsForTorso(compatibleTorso, tempParts);
        
        // ✅ Pasar todas las partes preservadas a las funciones adaptativas
        const partsWithHead = { ...newParts };
        if (currentHead) partsWithHead[PartCategory.HEAD] = currentHead;
        newParts = assignAdaptiveHeadForTorso(compatibleTorso, newParts, partsWithHead);
        
        const partsWithCape = { ...newParts };
        if (currentCape) partsWithCape[PartCategory.CAPE] = currentCape;
        newParts = assignAdaptiveCapeForTorso(compatibleTorso, newParts, partsWithCape);
        
        const partsWithSymbol = { ...newParts };
        if (currentSymbol) partsWithSymbol[PartCategory.SYMBOL] = currentSymbol;
        newParts = assignAdaptiveSymbolForTorso(compatibleTorso, newParts, partsWithSymbol);
        
        // ✅ FINALMENTE ASIGNAR EL NUEVO SUIT
        newParts[PartCategory.SUIT_TORSO] = part;
        
        // Debug: Verificar el estado final después del cambio (solo en desarrollo)
        if (import.meta.env.DEV) {
        console.log('🔍 DEBUG - Después de cambiar suit_torso:');
        console.log('   - Torso base:', compatibleTorso.id);
        console.log('   - Cabeza asignada:', newParts.HEAD?.id || 'ninguna');
        console.log('   - Manos asignadas:', {
          left: newParts.HAND_LEFT?.id || 'ninguna',
          right: newParts.HAND_RIGHT?.id || 'ninguna'
        });
        
        // Log para debuggear las manos después de la asignación
        const handsAfterAssignment = Object.values(newParts).filter(p => p.category === PartCategory.HAND_LEFT || p.category === PartCategory.HAND_RIGHT);
        console.log('🎯 Hands after assignment in App.tsx:', handsAfterAssignment.map(p => ({ id: p.id, category: p.category })));
        }
        
        return newParts;
      }

      if (category === PartCategory.TORSO) {
        // ✅ CORREGIDO DEFINITIVO: Preservar ANTES de eliminar, aplicar DESPUÉS de asignar
        
        // ✅ REGLA CRÍTICA: PRESERVAR TODAS LAS PARTES ANTES DE ELIMINAR
        const currentLeftHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_LEFT);
        const currentRightHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_RIGHT);
        const currentHead = newParts[PartCategory.HEAD];
        const currentCape = newParts[PartCategory.CAPE];
        const currentSymbol = newParts[PartCategory.SYMBOL];
        const currentSuit = newParts[PartCategory.SUIT_TORSO];
        
        // ✅ ELIMINAR SOLO PARTES DEPENDIENTES DEL TORSO
        TORSO_DEPENDENT_CATEGORIES.forEach(dep => {
          delete newParts[dep];
        });

        // ✅ ASIGNAR EL NUEVO TORSO
        newParts[PartCategory.TORSO] = part;
        
        // ✅ APLICAR FUNCIONES DE PRESERVACIÓN DESPUÉS DE ASIGNAR EL TORSO
        // Crear un objeto temporal con las manos actuales para pasarlo a la función
        const tempParts = { ...newParts };
        if (currentLeftHand) tempParts[PartCategory.HAND_LEFT] = currentLeftHand;
        if (currentRightHand) tempParts[PartCategory.HAND_RIGHT] = currentRightHand;
        
        // Asignar automáticamente manos compatibles preservando el tipo
        newParts = assignDefaultHandsForTorso(part, tempParts);
        
        // ✅ Pasar todas las partes preservadas a las funciones adaptativas
        const partsWithHead = { ...newParts };
        if (currentHead) partsWithHead[PartCategory.HEAD] = currentHead;
        newParts = assignAdaptiveHeadForTorso(part, newParts, partsWithHead);
        
        const partsWithCape = { ...newParts };
        if (currentCape) partsWithCape[PartCategory.CAPE] = currentCape;
        newParts = assignAdaptiveCapeForTorso(part, newParts, partsWithCape);
        
        const partsWithSymbol = { ...newParts };
        if (currentSymbol) partsWithSymbol[PartCategory.SYMBOL] = currentSymbol;
        newParts = assignAdaptiveSymbolForTorso(part, newParts, partsWithSymbol);
        
        const partsWithSuit = { ...newParts };
        if (currentSuit) partsWithSuit[PartCategory.SUIT_TORSO] = currentSuit;
        newParts = assignAdaptiveSuitTorsoForTorso(part, newParts, partsWithSuit);
        
        return newParts;
      }

      if (category === PartCategory.LOWER_BODY) {
        // ✅ CORREGIDO: Preservar botas antes de eliminar cualquier cosa
        const currentBoots = newParts[PartCategory.BOOTS];
        
        // Eliminar solo las piernas, NO las botas todavía
        delete newParts[PartCategory.LOWER_BODY];
        newParts[PartCategory.LOWER_BODY] = part;
        
        // Asignar botas compatibles preservando las actuales si son compatibles
        const partsWithBoots = { ...newParts };
        if (currentBoots) partsWithBoots[PartCategory.BOOTS] = currentBoots;
        newParts = assignAdaptiveBootsForTorso(part, newParts, partsWithBoots);
        
        return newParts;
      }

      // Handle regular part selection
      delete newParts[category];
      newParts[category] = part;
      
      // ✅ CORREGIDO: Preservar capas para TODAS las categorías
      // Cuando cambiamos cualquier parte, verificar si necesitamos adaptar la capa
      const currentTorso = newParts[PartCategory.TORSO] || newParts[PartCategory.SUIT_TORSO];
      if (currentTorso) {
        const currentCape = newParts[PartCategory.CAPE];
        if (currentCape) {
          const partsWithCape = { ...newParts };
          partsWithCape[PartCategory.CAPE] = currentCape;
          newParts = assignAdaptiveCapeForTorso(currentTorso, newParts, partsWithCape);
        }
      }
      
      return newParts;
    });
  }, []);

  const handleEditCategory = (category: PartCategory) => {
    setActiveCategory(category);
    // Asegurar que la cámara se reinicie a la vista general al abrir el panel de una categoría
    if (characterViewerRef.current) {
      console.log('📸 [APP] Reiniciando cámara al abrir categoría:', category);
      characterViewerRef.current.resetCamera();
    }
  };

  const handleCloseSelector = () => {
    setActiveCategory(null);
  };

  const handleResetToDefaultBuild = useCallback(() => {
    // Reset to default build for current archetype
    let newDefaultParts: SelectedParts;
    switch (selectedArchetype) {
      case ArchetypeId.STRONG:
        newDefaultParts = DEFAULT_STRONG_BUILD;
        break;
      case ArchetypeId.JUSTICIERO:
        newDefaultParts = DEFAULT_JUSTICIERO_BUILD;
        break;
      default:
        newDefaultParts = DEFAULT_STRONG_BUILD;
    }
    
    // Clear any preview state first
    if (characterViewerRef.current?.clearPreview) {
      characterViewerRef.current.clearPreview();
    }
    
    // Reset the selected parts
    setSelectedParts(newDefaultParts);
    
    // Force a complete reload by resetting the viewer state
    if (characterViewerRef.current?.resetState) {
      characterViewerRef.current.resetState();
    }
    
    // Force a complete re-render by updating the key
    setCharacterViewerKey(prev => prev + 1);
    
    setActiveCategory(null);
  }, [selectedArchetype]);

  const handleLoadConfiguration = (parts: SelectedParts) => {
    console.log('🔄 Loading configuration from library...', parts);
    setSelectedParts(parts);
    setCharacterViewerKey(prev => prev + 1); // Force re-render of 3D viewer
    
    // Close any open panels
    setActiveCategory(null);
    setIsPurchaseLibraryOpen(false);
    
    console.log('✅ Configuration loaded and viewer refreshed');
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserProfileOpen(false);
    
    // Reset to default build for current archetype after logout
    let newDefaultParts: SelectedParts;
    switch (selectedArchetype) {
      case ArchetypeId.STRONG:
        newDefaultParts = DEFAULT_STRONG_BUILD;
        break;
      case ArchetypeId.JUSTICIERO:
        newDefaultParts = DEFAULT_JUSTICIERO_BUILD;
        break;
      default:
        newDefaultParts = DEFAULT_STRONG_BUILD;
    }
    
    // Clear any preview state first
    if (characterViewerRef.current?.clearPreview) {
      characterViewerRef.current.clearPreview();
    }
    
    // Reset the selected parts
    setSelectedParts(newDefaultParts);
    
    // Force a complete reload by resetting the viewer state
    if (characterViewerRef.current?.resetState) {
      characterViewerRef.current.resetState();
    }
    
    // Force a complete re-render by updating the key
    setCharacterViewerKey(prev => prev + 1);
  };

  // Funciones de exportación
  const handleExportGLB = async () => {
    if (characterViewerRef.current?.exportModel) {
      try {
        const result = await characterViewerRef.current.exportModel();
        return result;
      } catch (error) {
        console.error('Error exporting GLB:', error);
        return { success: false, error: 'Error al exportar GLB' };
      }
    }
    return { success: false, error: 'Viewer no disponible' };
  };

  const handleExportSTL = async () => {
    if (characterViewerRef.current?.exportSTL) {
      try {
        const result = await characterViewerRef.current.exportSTL();
        return result;
      } catch (error) {
        console.error('Error exporting STL:', error);
        return { success: false, error: 'Error al exportar STL' };
      }
    }
    return { success: false, error: 'Viewer no disponible' };
  };

  const handleOpenAiDesigner = () => {
    setIsAiModalOpen(true);
  };

  const handleResetCamera = () => {
    if (characterViewerRef.current?.resetCamera) {
      characterViewerRef.current.resetCamera();
    }
  };

  const handleGenerateFromAI = async (prompt: string) => {
    if (!selectedParts) return;
    
    try {
      const newBuild = await generateBuild(prompt, ALL_PARTS, selectedArchetype || ArchetypeId.STRONG);
      setSelectedParts(newBuild);
      setIsAiModalOpen(false);
      // nextStep('ai-generated'); // Trigger after AI generation (optional)
    } catch (error) {
      console.error('🎨 AI Designer: Error generating build from AI:', error);
      alert(`Failed to generate AI build: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleOpenUserProfile = () => {
    setIsUserProfileOpen(true);
  };

  const handleCloseUserProfile = () => {
    setIsUserProfileOpen(false);
  };

  const handleToggleBattleDemo = () => {
    setShowBattleDemo(!showBattleDemo);
  };

  // Funciones del carrito de compras - VERSIÓN MEJORADA
  const handleAddToCart = (configuration: SelectedParts, archetype: string, name: string) => {
    if (Object.keys(configuration).length === 0) return;

    const configPrice = Object.values(configuration).reduce((sum, part) => sum + (part?.priceUSD || 0), 0);
    const configName = name || `Superhéroe ${archetype} - ${new Date().toLocaleDateString('es-ES')}`;
    const configThumbnail = Object.values(configuration)[0]?.thumbnail || '';
    
    const newItem: CartItem = {
      id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: configName,
      category: 'Configuración Completa',
      price: configPrice,
      thumbnail: configThumbnail,
      quantity: 1,
      configuration: { ...configuration },
      archetype: archetype
    };

    setCartItems(prev => {
      // Verificar si ya existe una configuración igual
      const existingIndex = prev.findIndex(item => 
        JSON.stringify(item.configuration) === JSON.stringify(configuration) &&
        item.archetype === archetype
      );

      if (existingIndex >= 0) {
        // Si existe, incrementar cantidad
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        // Si no existe, agregar como nuevo item
        return [...prev, newItem];
      }
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCartCheckout = async (items: CartItem[]) => {
    if (items.length === 0) return;

    // 🎯 SISTEMA HÍBRIDO: Gratis para usuarios registrados, Stripe preparado para el futuro
    if (isAuthenticated && user) {
      // ✅ USUARIO REGISTRADO: Proceso gratuito
      try {
        console.log('🎁 Usuario registrado - Proceso gratuito activado');
        console.log(`📦 Procesando ${items.length} configuraciones...`);
        
        // ✅ CORREGIDO: Usar PurchaseHistoryService para usuarios registrados
        const saveResult = await PurchaseHistoryService.savePurchase(
          user.id,
          items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            configuration: item.configuration
          })),
          items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        );

        if (!saveResult.success) {
          console.error('❌ Error guardando compra en biblioteca:', saveResult.error);
          throw new Error(`Error guardando en biblioteca: ${saveResult.error}`);
        }

        console.log('✅ Compra guardada exitosamente en biblioteca:', saveResult.purchaseId);

        // Preparar datos de compra para la confirmación
        setPurchaseData({
          items: [...items],
          totalPaid: 0, // Gratis para usuarios registrados
          isGuestUser: false,
          guestEmail: user.email
        });

        // Limpiar carrito
        setCartItems([]);
        setIsCartOpen(false);

        // Mostrar confirmación de compra gratuita
        setIsPurchaseConfirmationOpen(true);

        // Mostrar mensaje de éxito
        const successMessage = items.length === 1 
          ? `🎉 ¡Configuración guardada exitosamente!\n\nTu modelo está disponible en tu biblioteca personal.\nAccede desde tu perfil para descargar.`
          : `🎉 ¡${items.length} configuraciones guardadas exitosamente!\n\nTus modelos están disponibles en tu biblioteca personal.\nAccede desde tu perfil para descargar.`;
        
        alert(successMessage);

      } catch (error) {
        console.error('Error en proceso gratuito:', error);
        throw new Error(`Error al procesar el pedido: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } else {
      // 🔶 USUARIO INVITADO: Proceso con email (gratis por ahora)
      console.log('📧 Usuario invitado - Proceso con email activado');
      setGuestEmailData({
        cartItems: [...items],
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      });
      setIsGuestEmailModalOpen(true);
      setIsCartOpen(false);
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const handleClosePurchaseConfirmation = () => {
    console.log('🔄 Ejecutando handleClosePurchaseConfirmation...');
    console.log('Estado actual:', { isPurchaseConfirmationOpen, purchaseData });
    setIsPurchaseConfirmationOpen(false);
    setPurchaseData(null);
    console.log('✅ Modal cerrado, estados limpiados');
  };

  const handleOpenPurchaseLibrary = () => {
    setIsPurchaseLibraryOpen(true);
  };

  const handleClosePurchaseLibrary = () => {
    setIsPurchaseLibraryOpen(false);
  };

  const handleCloseGuestEmailModal = () => {
    setIsGuestEmailModalOpen(false);
    setGuestEmailData(null);
  };

  const handleGuestEmailSubmitted = async (email: string) => {
    if (!guestEmailData) return;

    try {
      // Guardar configuración para usuario invitado
      const saveResult = await ResendEmailService.saveGuestConfiguration(
        email,
        guestEmailData.cartItems[0]?.configuration || {},
        guestEmailData.totalPrice,
        selectedArchetype || 'STRONG'
      );

      if (!saveResult.success) {
        alert('Error saving configuration. Please try again.');
        return;
      }

      // Enviar email con la configuración
      const emailResult = await ResendEmailService.sendConfigurationEmail(
        email,
        guestEmailData.cartItems[0]?.configuration || {},
        guestEmailData.totalPrice,
        saveResult.configId || ''
      );

      if (emailResult.success) {
        // Preparar datos de compra para la confirmación
        setPurchaseData({
          items: [...guestEmailData.cartItems],
          totalPaid: guestEmailData.totalPrice,
          isGuestUser: true,
          guestEmail: email
        });

        // Limpiar datos temporales
        setCartItems([]);
        setGuestEmailData(null);
        setIsGuestEmailModalOpen(false);

        // Mostrar confirmación de compra con información de email
        setIsPurchaseConfirmationOpen(true);

        // Mostrar mensaje de éxito
        alert(`✅ Configuration sent successfully to ${email}!\n\n` +
                              `Check your inbox to access the download links.\n` +
                `Links will be available for 7 days.`);
      } else {
        alert(`❌ Error sending email: ${emailResult.error}\n\nPlease try again.`);
      }

    } catch (error) {
      console.error('Error in guest email flow:', error);
      alert('Error inesperado. Inténtalo de nuevo.');
    }
  };

  // Register elements for tutorial
  const archetypeSelectorRef = useRef<HTMLDivElement>(null);
  const categoryToolbarRef = useRef<HTMLDivElement>(null);
  const currentConfigButtonRef = useRef<HTMLButtonElement>(null);
  const aiDesignerButtonRef = useRef<HTMLButtonElement>(null);
  const authButtonRef = useRef<HTMLButtonElement>(null);
  const battlePrototypeButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenSettings = () => {};
  const handleOpenHelp = () => {};
  
  const handleOpenRPGSheet = () => {
    setIsRPGSheetOpen(true);
  };
  
  const handleCloseRPGSheet = () => {
    setIsRPGSheetOpen(false);
  };

  // ✨ NUEVA FUNCIONALIDAD: Cargar poses guardadas del usuario
  const loadUserPoses = async () => {
    if (!isAuthenticated || !user?.id) {
      console.log('⚠️ Usuario no autenticado, cargando datos de prueba...');
      // ✅ Limpiar poses para evitar duplicados al desloguearse
      setSavedPoses([]);
      setCurrentPoseIndex(0);
      loadTestPoses();
      return;
    }

    try {
      console.log('🎨 Loading user poses...');
      
      // Cargar compras del usuario
      const purchasesResult = await PurchaseHistoryService.getUserPurchases(user.id);
      const purchases = purchasesResult.success ? purchasesResult.purchases || [] : [];
      console.log(`📦 Found ${purchases.length} purchases`);
      
      // Cargar configuraciones guardadas
      const configurations = await UserConfigService.getUserConfigurations(user.id);
      console.log(`💾 Found ${configurations.length} saved configurations`);
      
      // Combinar poses de compras y configuraciones guardadas
      const allPoses: Array<{
        id: string;
        name: string;
        configuration: SelectedParts;
        source: 'purchase' | 'saved';
        date: string;
      }> = [];

      // Agregar poses de compras
      let purchasePoseCount = 0;
      purchases.forEach((purchase: any, purchaseIndex: number) => {
        console.log(`🛒 Processing purchase ${purchaseIndex + 1}: ${purchase.id}`);
        if (purchase.purchase_items) {
          console.log(`   - Purchase has ${purchase.purchase_items.length} items`);
          purchase.purchase_items.forEach((item: any, index: number) => {
            if (item.configuration_data) {
              purchasePoseCount++;
              const poseName = `${item.item_name || 'Configuración'} (Compra ${purchaseIndex + 1})`;
              console.log(`   - Adding pose ${purchasePoseCount}: ${poseName}`);
              allPoses.push({
                id: `purchase-${purchase.id}-${index}`,
                name: poseName,
                configuration: item.configuration_data,
                source: 'purchase',
                date: purchase.purchase_date || purchase.created_at
              });
            }
          });
        }
      });

      // Agregar configuraciones guardadas
      let savedPoseCount = 0;
      configurations.forEach((config: any, index: number) => {
        // --- PROTECCIÓN: Saltar configuraciones vacías o corruptas ---
        if (!config.configuration_data || typeof config.configuration_data !== 'object' || Object.keys(config.configuration_data).length === 0) {
          // console.warn('Skipping empty or invalid configuration:', config.id);
          return;
        }
        savedPoseCount++;
        const poseName = (config.configuration_name && typeof config.configuration_name === 'string' && config.configuration_name.trim())
          ? config.configuration_name.trim()
          : (config.name && typeof config.name === 'string' && config.name.trim())
            ? config.name.trim()
            : 'Sin nombre';
        console.log(`💾 Adding saved pose ${savedPoseCount}: ${poseName}`);
        allPoses.push({
          id: `saved-${config.id}`,
          name: poseName,
          configuration: config.configuration_data,
          source: 'saved',
          date: config.created_at
        });
      });
      // --- NO agregar datos de prueba ni fallback si no hay poses reales ---
      setSavedPoses(allPoses);
      
      // ✨ NUEVA FUNCIONALIDAD: Precargar modelos en cache
      if (allPoses.length > 0) {
        await preloadPoseModels(allPoses);
      }
      
      // ✨ NUEVA FUNCIONALIDAD: Cargar la última pose del usuario desde la BD
      if (allPoses.length > 0 && Object.keys(selectedParts).length === 0) {
        try {
          const lastPose = await UserConfigService.getUserLastPose(user.id);
          if (lastPose) {
            // Buscar la pose en las poses cargadas
            const lastPoseIndex = allPoses.findIndex(pose => 
              pose.id === `saved-${lastPose.id}` || 
              JSON.stringify(pose.configuration) === JSON.stringify(lastPose.selected_parts)
            );
            
            if (lastPoseIndex !== -1) {
              setCurrentPoseIndex(lastPoseIndex);
              setSelectedParts(allPoses[lastPoseIndex].configuration);
              console.log('🎯 Loaded user last pose:', allPoses[lastPoseIndex].name, `(${lastPoseIndex + 1}/${allPoses.length})`);
            } else {
              // Si no se encuentra la última pose, usar la configuración directamente
              setCurrentPoseIndex(0);
              setSelectedParts(lastPose.selected_parts);
              setSelectedArchetype(lastPose.archetype as ArchetypeId);
              console.log('🎯 Loaded user last pose directly from DB:', lastPose.name);
            }
          } else {
            // No hay última pose, cargar la primera
        setCurrentPoseIndex(0);
        setSelectedParts(allPoses[0].configuration);
            console.log('🎯 No last pose found, loaded first pose:', allPoses[0].name);
          }
        } catch (error) {
          console.error('Error loading last pose, using first:', error);
          setCurrentPoseIndex(0);
          setSelectedParts(allPoses[0].configuration);
          console.log('🎯 Fallback to first pose:', allPoses[0].name);
        }
      }
      
    } catch (error) {
      console.error('Error loading user poses:', error);
      console.log('⚠️ Error cargando poses, cargando datos de prueba...');
      loadTestPoses();
    }
  };

  // ✨ NUEVA FUNCIONALIDAD: Cargar datos de prueba para demostración
  const loadTestPoses = () => {
    console.log('🎯 Loading test poses for demonstration...');
    
    const testPoses: Array<{
      id: string;
      name: string;
      configuration: SelectedParts;
      source: 'purchase' | 'saved';
      date: string;
    }> = [
      {
        id: 'test-pose-1',
        name: 'Superhéroe Básico (Compra)',
        configuration: DEFAULT_STRONG_BUILD,
        source: 'purchase' as const,
        date: '2025-01-15T10:30:00Z'
      },
      {
        id: 'test-pose-2',
        name: 'Villano Oscuro (Compra)',
        configuration: DEFAULT_STRONG_BUILD,
        source: 'purchase' as const,
        date: '2025-01-14T15:45:00Z'
      },
      {
        id: 'test-pose-3',
        name: 'Mi Superhéroe Personalizado (Guardado)',
        configuration: DEFAULT_STRONG_BUILD,
        source: 'saved' as const,
        date: '2025-01-13T09:20:00Z'
      },
      {
        id: 'test-pose-4',
        name: 'Protector de la Ciudad (Guardado)',
        configuration: DEFAULT_STRONG_BUILD,
        source: 'saved' as const,
        date: '2025-01-12T14:15:00Z'
      }
    ];

    console.log(`✅ Loaded ${testPoses.length} test poses:`);
    testPoses.forEach((pose, index) => {
      console.log(`   ${index + 1}. ${pose.name} (${pose.source})`);
    });

    setSavedPoses(testPoses);
    
    // Cargar la primera pose si no hay configuración actual
    if (Object.keys(selectedParts).length === 0) {
      setCurrentPoseIndex(0);
      setSelectedParts(testPoses[0].configuration);
      console.log('🎯 Loaded first test pose:', testPoses[0].name);
    }
  };

  // ✨ NUEVA FUNCIONALIDAD: Precargar modelos de todas las poses
  const preloadPoseModels = async (poses: Array<{configuration: SelectedParts}>) => {
    try {
      console.log('🚀 Starting model preload for poses...');
      
      // Extraer todas las rutas de modelos únicas de todas las poses
      const allModelPaths = new Set<string>();
      const basePath = (import.meta as any).env.BASE_URL || '/';
      
      poses.forEach(pose => {
        Object.values(pose.configuration).forEach(part => {
          if (part && part.gltfPath && !part.attributes?.none && !part.attributes?.hidden) {
            const modelPath = `${basePath}${part.gltfPath.startsWith('/') ? part.gltfPath.slice(1) : part.gltfPath}`;
            allModelPaths.add(modelPath);
          }
        });
      });

      const uniquePaths = Array.from(allModelPaths);
      console.log(`📦 Preloading ${uniquePaths.length} unique models for ${poses.length} poses`);

      // Precargar todos los modelos únicos
      if (uniquePaths.length > 0) {
        await modelCache.preloadModels(uniquePaths);
        console.log(`✅ Successfully preloaded ${uniquePaths.length} models in cache`);
      }

    } catch (error) {
      console.error('Error preloading pose models:', error);
      // No bloquear la funcionalidad si falla el precarga
    }
  };

  // ✨ NUEVA FUNCIONALIDAD: Filtrar poses duplicadas y innecesarias
  const filterAndCleanPoses = (poses: Array<{
    id: string;
    name: string;
    configuration: SelectedParts;
    source: 'purchase' | 'saved';
    date: string;
  }>) => {
    console.log('🧹 Filtering and cleaning poses...');
    
    const filteredPoses = poses.filter(pose => {
      // Eliminar configuraciones automáticas duplicadas
      if (pose.name.includes('Última Pose (Auto-guardado)')) {
        console.log(`🗑️ Removing auto-saved pose: ${pose.name}`);
        return false;
      }
      
      // Eliminar poses con configuraciones vacías
      if (!pose.configuration || Object.keys(pose.configuration).length === 0) {
        console.log(`🗑️ Removing empty pose: ${pose.name}`);
        return false;
      }
      
      // Eliminar poses duplicadas (misma configuración)
      const configString = JSON.stringify(pose.configuration);
      const isDuplicate = poses.some(otherPose => 
        otherPose.id !== pose.id && 
        JSON.stringify(otherPose.configuration) === configString
      );
      
      if (isDuplicate) {
        console.log(`🗑️ Removing duplicate pose: ${pose.name}`);
        return false;
      }
      
      return true;
    });
    
    console.log(`🧹 Filtered ${poses.length} poses down to ${filteredPoses.length} unique poses`);
    return filteredPoses;
  };

  // ✨ NUEVA FUNCIONALIDAD: Navegar a la pose anterior
  const handlePreviousPose = () => {
    if (savedPoses.length === 0) return;
    
    const newIndex = currentPoseIndex > 0 ? currentPoseIndex - 1 : savedPoses.length - 1;
    setCurrentPoseIndex(newIndex);
    
    const newPose = savedPoses[newIndex];
    setSelectedParts(newPose.configuration);
    
    console.log(`⬅️ Previous pose: ${newPose.name} (${newIndex + 1}/${savedPoses.length})`);
    console.log(`📦 Pose models should be cached for instant loading`);
    
    // Mostrar feedback visual (opcional)
    // Aquí podrías agregar un toast o notificación
  };

  // ✨ NUEVA FUNCIONALIDAD: Navegar a la pose siguiente
  const handleNextPose = () => {
    if (savedPoses.length === 0) return;
    
    const newIndex = currentPoseIndex < savedPoses.length - 1 ? currentPoseIndex + 1 : 0;
    setCurrentPoseIndex(newIndex);
    
    const newPose = savedPoses[newIndex];
    setSelectedParts(newPose.configuration);
    
    console.log(`➡️ Next pose: ${newPose.name} (${newIndex + 1}/${savedPoses.length})`);
    console.log(`📦 Pose models should be cached for instant loading`);
    
    // Mostrar feedback visual (opcional)
    // Aquí podrías agregar un toast o notificación
  };

  // ✨ NUEVA FUNCIONALIDAD: Seleccionar pose directamente por índice
  const handleSelectPose = (index: number) => {
    if (savedPoses.length === 0 || index < 0 || index >= savedPoses.length) return;
    
    setCurrentPoseIndex(index);
    
    const selectedPose = savedPoses[index];
    setSelectedParts(selectedPose.configuration);
    
    console.log(`🎯 Direct pose selection: ${selectedPose.name} (${index + 1}/${savedPoses.length})`);
    console.log(`📦 Pose models should be cached for instant loading`);
    
    // Mostrar feedback visual (opcional)
    // Aquí podrías agregar un toast o notificación
  };

  // ✨ NUEVA FUNCIONALIDAD: Renombrar pose
  const handleRenamePose = (index: number, newName: string) => {
    if (savedPoses.length === 0 || index < 0 || index >= savedPoses.length) return;
    
    const updatedPoses = [...savedPoses];
    const oldName = updatedPoses[index].name;
    updatedPoses[index] = {
      ...updatedPoses[index],
      name: newName
    };
    
    setSavedPoses(updatedPoses);
    
    console.log(`✏️ Pose renamed: "${oldName}" → "${newName}" (${index + 1}/${savedPoses.length})`);
    
    // Si es una configuración guardada, actualizar en la base de datos
    if (updatedPoses[index].source === 'saved' && isAuthenticated && user?.id) {
      updateSavedPoseName(index, newName);
    }
    
    // Mostrar feedback visual (opcional)
    // Aquí podrías agregar un toast o notificación
  };

  // ✨ NUEVA FUNCIONALIDAD: Actualizar nombre de pose guardada en la base de datos
  const updateSavedPoseName = async (index: number, newName: string) => {
    try {
      const pose = savedPoses[index];
      if (pose.source === 'saved' && pose.id.startsWith('saved-')) {
        const configId = pose.id.replace('saved-', '');
        
        // Actualizar en la base de datos
        const success = await UserConfigService.updateConfigurationName(configId, newName);
        
        if (success) {
          console.log(`✅ Pose name updated in database: ${newName}`);
        } else {
          console.error('❌ Failed to update pose name in database');
        }
      }
    } catch (error) {
      console.error('❌ Error updating pose name in database:', error);
    }
  };

  // ✨ NUEVA FUNCIONALIDAD: Cargar poses cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user?.id && !loading) {
      loadUserPoses();
    } else if (!isAuthenticated && !loading) {
      // ✅ Limpiar poses al desloguearse y volver a la configuración por defecto.
      setSavedPoses([]);
      setCurrentPoseIndex(0);
      handleResetToDefaultBuild();
    }
  }, [isAuthenticated, user?.id, loading]);

  // ✨ NUEVA FUNCIONALIDAD: Persistir la última pose del usuario
  const saveCurrentPoseAsLast = async () => {
    if (!isAuthenticated || !user?.id || Object.keys(selectedParts).length === 0) return;
    
    try {
      // Guardar configuración actual como "Última Pose"
      const totalPrice = Object.values(selectedParts).reduce((sum, part) => sum + (part?.priceUSD || 0), 0);
      await UserConfigService.saveConfiguration(
        user.id,
        'Última Pose (Auto-guardado)',
        selectedArchetype || 'STRONG',
        selectedParts,
        totalPrice
      );
      console.log('💾 Last pose saved automatically');
    } catch (error) {
      console.error('Error saving last pose:', error);
    }
  };

  // ✨ NUEVA FUNCIONALIDAD: Guardar pose automáticamente al cambiar configuración
  useEffect(() => {
    if (isAuthenticated && user?.id && Object.keys(selectedParts).length > 0) {
      // Debounce para evitar guardado excesivo
      const timeoutId = setTimeout(() => {
        saveCurrentPoseAsLast();
      }, 3000); // Guardar después de 3 segundos sin cambios

      return () => clearTimeout(timeoutId);
    }
  }, [selectedParts, selectedArchetype, isAuthenticated, user?.id]);

  const handleCharacterNameChange = (newName: string) => {
    setCharacterName(newName);
  };

  // Función para manejar actualizaciones del personaje RPG
  const handleRPGCharacterUpdate = (character: RPGCharacterSync) => {
    setRpgCharacter(character);
    console.log('Personaje RPG actualizado:', character);
  };

  return (
    <div className="app-content-wrapper relative z-10 flex flex-col items-center justify-between h-screen w-screen overflow-hidden animate-fadeInScale">
      {/* Header Gaming Pro - Marvel Rivals Style */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
        <Card className="marvel-panel-box pointer-events-auto w-full max-w-[1800px] mx-auto p-0" style={{borderRadius: '0 0 1.5rem 1.5rem', boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25), 0 0 0 2px #fbbf24'}}>
          <div className="w-full pointer-events-auto relative">
            {/* Main header panel */}
            <div className="from-slate-900/95 backdrop-blur will-change-transform-xl shadow-2xl shadow-orange-400/20 flex w-full relative bg-gradient-to-r via-slate-800/95 to-slate-900/95 border-b-2 border-orange-400/50 rounded-none items-center justify-between px-8 py-4"
                 style={{
                   clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                 }}>
              {/* Holographic background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-cyan-400/5 to-orange-400/5 animate-holographic" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scan opacity-30" />
              {/* Logo y título */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <ShieldCheckIcon className="w-10 h-10 text-orange-400 animate-glow" />
                  <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-lg animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-widest uppercase marvel-title"
                        style={{ fontFamily: 'RefrigeratorDeluxeHeavy, sans-serif' }}>
                    SUPERHERO
                  </span>
                  <span className="text-sm font-bold text-cyan-400 tracking-wider uppercase"
                        style={{ fontFamily: 'RefrigeratorDeluxeBold, sans-serif' }}>
                    CUSTOMIZER PRO
                  </span>
                </div>
              </div>
              {/* Botones de acceso rápido */}
              <div className="flex items-center gap-3 relative z-10">
                <button
                  onClick={handleOpenAiDesigner}
                  className="flex gap-2 from-purple-600 hover:from-purple-500 hover:shadow-lg hover:shadow-purple-400/50 relative overflow-hidden bg-gradient-to-r to-purple-500 text-white text-sm hover:to-purple-400 rounded-md transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] items-center px-4 py-2 font-black uppercase tracking-wider group"
                  style={{ 
                    fontFamily: 'RefrigeratorDeluxeBold, sans-serif',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                  <SparklesIcon className="h-5 w-5 relative z-10" />
                  <span className="hidden sm:inline relative z-10">AI Designer</span>
                </button>
                
                {/* Botón de Hojas RPG */}
                <button
                  onClick={handleOpenRPGSheet}
                  className="flex gap-2 from-teal-600 hover:from-teal-500 hover:shadow-lg hover:shadow-teal-400/50 relative overflow-hidden bg-gradient-to-r to-teal-500 text-white text-sm hover:to-teal-400 rounded-md transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] items-center px-4 py-2 font-black uppercase tracking-wider group"
                  style={{ 
                    fontFamily: 'RefrigeratorDeluxeBold, sans-serif',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                  title="Abrir hojas de personaje RPG"
                >
                  <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                  <BookOpenIcon className="h-5 w-5 relative z-10" />
                  <span className="hidden sm:inline relative z-10">RPG Sheets</span>
                </button>
                
                {/* Botón del Carrito */}
                <button
                  onClick={handleOpenCart}
                  className="flex gap-2 from-indigo-600 hover:from-indigo-500 hover:shadow-lg hover:shadow-indigo-400/50 relative overflow-hidden bg-gradient-to-r to-indigo-500 text-white text-sm hover:to-indigo-400 rounded-md transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] items-center px-4 py-2 font-black uppercase tracking-wider group"
                  style={{ 
                    fontFamily: 'RefrigeratorDeluxeBold, sans-serif',
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                  title="Abrir carrito de compras"
                >
                  <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                  <div className="relative z-10 flex items-center gap-1">
                    <ShoppingCartIcon className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline relative z-10">Cart</span>
                </button>
                
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      ref={userButtonRef}
                      onClick={() => setIsUserDropdownOpen((v) => !v)}
                      className="flex gap-2 from-green-600 hover:from-green-500 hover:shadow-lg hover:shadow-green-400/50 relative overflow-hidden bg-gradient-to-r to-green-500 text-white text-sm hover:to-green-400 rounded-md transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] items-center px-4 py-2 font-black uppercase tracking-wider group"
                      style={{ 
                        fontFamily: 'RefrigeratorDeluxeBold, sans-serif',
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                      }}
                    >
                      <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                      <UserIcon className="h-5 w-5 relative z-10" />
                      <span className="hidden sm:inline relative z-10 truncate max-w-[120px]">{user?.email || 'Perfil'}</span>
                    </button>
                    <HeaderDropdown
                      isOpen={isUserDropdownOpen}
                      onClose={() => setIsUserDropdownOpen(false)}
                      triggerRef={userButtonRef}
                      onOpenUserProfile={handleOpenUserProfile}
                      onOpenPurchaseLibrary={handleOpenPurchaseLibrary}
                      onOpenSettings={handleOpenSettings}
                      onOpenHelp={handleOpenHelp}
                      onSignOut={handleSignOut}
                      userEmail={user?.email}
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleOpenAuthModal}
                    className="flex gap-2 from-blue-600 hover:from-blue-500 hover:shadow-lg hover:shadow-blue-400/50 relative overflow-hidden bg-gradient-to-r to-blue-500 text-white text-sm hover:to-blue-400 rounded-md transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] items-center px-4 py-2 font-black uppercase tracking-wider group"
                    style={{ 
                      fontFamily: 'RefrigeratorDeluxeBold, sans-serif',
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                    <UserIcon className="h-5 w-5 relative z-10" />
                    <span className="hidden sm:inline relative z-10">Login</span>
                  </button>
                )}
                
                {/* Marvel-style navigation controls */}
                <div className="flex items-center gap-2 ml-4">
                  <div className="marvel-nav-button prev" title="Previous Model"></div>
                  <div className="marvel-nav-button next" title="Next Model"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {showBattleDemo ? (
        <div className="flex-grow w-full h-full">
          <BattleDemo />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full" style={{paddingTop: '110px'}}>
          <div className="flex flex-row w-full h-full">
            {/* Left Panel - Responsive Two Containers */}
            <div className="z-40 flex flex-row gap-6 container-archetypes" style={{width: '450px', maxWidth: 'calc(100vw - 280px)'}}>
              {/* Archetype Selector Container */}
              <Card className="marvel-panel-box pointer-events-auto container-archetypes-box" style={{ maxWidth: '48%', flex: 1 }}>
                <div className="relative z-10 p-2 sm:p-3 lg:p-4">
                  <VerticalArchetypeSelector
                    selectedArchetype={selectedArchetype || ArchetypeId.STRONG}
                    onArchetypeChange={handleArchetypeChange}
                    id="archetype-selector"
                    registerElement={registerElement}
                  />
                </div>
              </Card>
              {/* Part Category Toolbar Container */}
              <Card className="marvel-panel-box pointer-events-auto container-hero-parts" style={{ width: '420px', padding: 0 }}>
                <PartCategoryToolbar
                  activeCategory={activeCategory}
                  onSelectCategory={handleEditCategory}
                  id="category-toolbar"
                  registerElement={registerElement}
                />
              </Card>
            </div>
            {/* 3D Viewer Panel */}
            <div className="flex-1 flex items-center justify-center min-w-[300px] min-h-[400px] container-3dviewer">
              <Card className="marvel-panel-box w-3/5 h-full flex items-center justify-center p-6 container-3dviewer-box" style={{boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25), 0 0 0 2px #3fd0ff', border: '2px solid #3fd0ff33', background: 'linear-gradient(135deg, #181e29 0%, #232a3a 100%)', marginLeft: '-28%'}}>
                <ErrorBoundary>
                  <CharacterViewer
                    key={characterViewerKey}
                    ref={characterViewerRef}
                    selectedParts={selectedParts}
                    selectedArchetype={selectedArchetype || ArchetypeId.STRONG}
                    characterName={characterName}
                    onCharacterNameChange={handleCharacterNameChange}
                    savedPoses={savedPoses}
                    currentPoseIndex={currentPoseIndex}
                    onPreviousPose={handlePreviousPose}
                    onNextPose={handleNextPose}
                    onSelectPose={handleSelectPose}
                    onRenamePose={handleRenamePose}
                  />
                </ErrorBoundary>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Modals and Panels (rendered outside main content flow for overlay) */}
      {isAuthModalOpen && (
        <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
      )}

      {isUserProfileOpen && (
        <UserProfile
          isOpen={isUserProfileOpen}
          onClose={handleCloseUserProfile}
          onLoadConfiguration={handleLoadConfiguration}
          isAuthenticated={isAuthenticated}
          user={user}
          onSignOut={handleSignOut}
          onOpenPurchaseLibrary={handleOpenPurchaseLibrary}
          id="user-profile-panel"
          registerElement={registerElement}
        />
      )}

      {isAiModalOpen && (
        <AiDesignerModal 
          isOpen={isAiModalOpen} 
          onClose={() => setIsAiModalOpen(false)} 
          onGenerate={handleGenerateFromAI} 
        />
      )}

      {activeCategory && (
        <PartSelectorPanel
          activeCategory={activeCategory}
          selectedArchetype={selectedArchetype || ArchetypeId.STRONG}
          selectedParts={selectedParts}
          onPartSelect={handleSelectPart}
          onClose={handleCloseSelector}
          onPreviewChange={characterViewerRef.current?.handlePreviewPartsChange}
          onResetToDefault={handleResetToDefaultBuild}
          id="part-selector-panel"
          registerElement={registerElement}
          characterViewerRef={characterViewerRef}
        />
      )}

      {/* Carrito de Compras - VERSIÓN ESTÁNDAR */}
      <StandardShoppingCart
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        onCheckout={handleCartCheckout}
        onAddCurrentConfig={handleAddToCart}
        currentConfiguration={selectedParts}
        currentArchetype={selectedArchetype || 'STRONG'}
        onEditCategory={handleEditCategory}
        isAuthenticated={isAuthenticated}
        userEmail={user?.email}
        user={user}
      />

             {isPurchaseConfirmationOpen && purchaseData && (
         <PurchaseConfirmation
           isOpen={isPurchaseConfirmationOpen}
           onClose={handleClosePurchaseConfirmation}
           purchasedItems={purchaseData.items}
           totalPaid={purchaseData.totalPaid}
           onExportGLB={handleExportGLB}
           onExportSTL={handleExportSTL}
           registerElement={registerElement}
           isGuestUser={purchaseData.isGuestUser}
           guestEmail={purchaseData.guestEmail}
         />
       )}

       {/* Biblioteca de Compras */}
       {isPurchaseLibraryOpen && (
         <PurchaseLibrary
           isOpen={isPurchaseLibraryOpen}
           onClose={handleClosePurchaseLibrary}
           onLoadConfiguration={handleLoadConfiguration}
           user={user}
           registerElement={registerElement}
           onExportGLB={handleExportGLB}
           onExportSTL={handleExportSTL}
        />
      )}

             {/* Panel de Materiales */}
       <MaterialPanel 
         characterViewerRef={characterViewerRef} 
         selectedParts={selectedParts}
         onLoadConfiguration={handleLoadConfiguration}
       />

      {/* Modal de Email para Usuarios Invitados */}
      {isGuestEmailModalOpen && guestEmailData && (
        <GuestEmailModal
          isOpen={isGuestEmailModalOpen}
          onClose={handleCloseGuestEmailModal}
          onEmailSubmitted={handleGuestEmailSubmitted}
          totalPrice={guestEmailData.totalPrice}
        />
      )}

      {/* Indicador de última pose */}
      <LastPoseIndicator
        currentPoseIndex={currentPoseIndex}
        totalPoses={savedPoses.length}
        isSaving={isSavingLastPose}
        lastSaved={sessionInfo.lastSaved}
      />

      {/* Modal de Hojas de Personaje RPG */}
      <RPGCharacterSheetManager
        isOpen={isRPGSheetOpen}
        onClose={handleCloseRPGSheet}
      />

      {/* Panel lateral derecho - Hoja de Personaje RPG */}
      <div className="fixed right-4 top-32 w-80 max-h-[calc(100vh-8rem)] overflow-y-auto z-30">
        <Card className="marvel-panel-box bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
          <RPGCharacterSheet
            selectedArchetype={selectedArchetype}
            selectedParts={selectedParts}
            onCharacterUpdate={handleRPGCharacterUpdate}
          />
        </Card>
      </div>
    </div>
  );
};

const App: React.FC = () => (
    <AppContent />
);

export default App;