import React, { useState, useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ArchetypeId, PartCategory, SelectedParts, Part, CartItem } from './types';
import { ALL_PARTS, TORSO_DEPENDENT_CATEGORIES, DEFAULT_STRONG_BUILD, DEFAULT_JUSTICIERO_BUILD, GUEST_USER_BUILD } from './constants';
import CharacterViewer, { CharacterViewerRef } from './components/CharacterViewer';

import PartSelectorPanel from './components/PartSelectorPanel';
import ShoppingCart from './components/ShoppingCart';
import { ShieldCheckIcon, Cog6ToothIcon, UserIcon, BookOpenIcon, ShoppingCartIcon, FileTextIcon } from './components/icons';
import PartCategoryToolbar from './components/PartCategoryToolbar';
import AuthModal from './components/AuthModal';
import ResetPasswordModal from './components/ResetPasswordModal';
import WelcomeScreen from './components/WelcomeScreen';
import SimpleSignUpModal from './components/SimpleSignUpModal';
import UserProfile from './components/UserProfile';
import TorsoSubmenu from './components/TorsoSubmenu';
import BeltSubmenu from './components/BeltSubmenu';
import LowerBodySubmenu from './components/LowerBodySubmenu';


import PurchaseConfirmation from './components/PurchaseConfirmation';
import PurchaseLibrary from './components/PurchaseLibrary';
import GuestEmailModal from './components/GuestEmailModal';
import { useAuth } from './hooks/useAuth';
import { assignDefaultHandsForTorso, assignAdaptiveHeadForTorso, assignAdaptiveCapeForTorso, assignAdaptiveBootsForTorso, assignAdaptiveSymbolForTorso, assignAdaptiveSuitTorsoForTorso } from './lib/utils';
import { ARCHETYPE_DATA, ARCHETYPES_LIST } from './lib/archetypeData';
import ArchetypeSwitcher from './components/ArchetypeSwitcher';
import STLScaleModal from './components/STLScaleModal';
import StylePanel, { type PartEntry, type MaterialType } from './components/StylePanel';
import { SessionStorageService } from './services/sessionStorageService';

import { modelCache } from './lib/modelCache';
import ErrorBoundary from './components/ErrorBoundary';

import { PurchaseHistoryService } from './services/purchaseHistoryService';
import { ResendEmailService } from './services/resendEmailService';
import { UserConfigService } from './services/userConfigService';
import { Card } from "./components/ui/card";
import HeaderDropdown from './components/HeaderDropdown';
import MaterialPanel from './components/MaterialPanel';
import SkinsPanel from './components/materials/SkinsPanel';
import LightsPanel from './components/LightsPanel';
import PowerEffectsPanel from './components/PowerEffectsPanel';
import LastPoseIndicator from './components/LastPoseIndicator';
import RPGCharacterSheetManager from './components/rpg-sheets/RPGCharacterSheetManager';
import RPGCharacterSheet from './components/RPGCharacterSheet';
import VTTExportModal from './components/VTTExportModal';
import { RPGCharacterSync } from './types';
import { STRONG_TORSO_PARTS } from './src/parts/strongTorsoParts';
import { STRONG_LEGS_PARTS } from './src/parts/strongLegsParts';
import { STRONG_HEAD_PARTS } from './src/parts/strongHeadParts';
import { STRONG_BOOTS_PARTS } from './src/parts/strongBootsParts';
import { STRONG_CAPE_PARTS } from './src/parts/strongCapeParts';
import { STRONG_BELT_PARTS } from './src/parts/strongBeltParts';
import { STRONG_HANDS_PARTS } from './src/parts/strongHandsParts';
import PartsDebugPanel from './components/PartsDebugPanel';

// Hacer disponible para debugging en consola

// ✅ FIXED: Import from constants.ts to avoid duplication
// HEAD, CAPE, MANOS ya no se eliminan aquí - se preservan explícitamente

const STYLE_PART_TO_CATEGORY: Record<string, string> = {
  torso: 'TORSO', legs: 'LOWER_BODY', head: 'HEAD',
  hand_left: 'HAND_LEFT', hand_right: 'HAND_RIGHT',
  cape: 'CAPE', boots: 'BOOTS', belt: 'BELT',
};

const buildThreeMaterial = (type: MaterialType, color: number): THREE.MeshPhysicalMaterial => {
  const presets: Record<MaterialType, { roughness: number; metalness: number; clearcoat: number }> = {
    FABRIC: { roughness: 0.85, metalness: 0.0, clearcoat: 0.0 },
    METAL: { roughness: 0.2, metalness: 0.9, clearcoat: 0.3 },
    PLASTIC: { roughness: 0.4, metalness: 0.0, clearcoat: 0.6 },
    CHROME: { roughness: 0.05, metalness: 1.0, clearcoat: 1.0 },
  };
  const { roughness, metalness, clearcoat } = presets[type];
  return new THREE.MeshPhysicalMaterial({ color, roughness, metalness, clearcoat });
};

const AppContent: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(ArchetypeId.STRONG);
  // ✅ CRITICAL FIX: GET AUTH FIRST
  const { isAuthenticated, loading, signOut, user } = useAuth();

  // ✅ CRITICAL FIX: TWO COMPLETELY SEPARATE STATES
  // - Non-authenticated users: GUEST_USER_BUILD (fixed state)
// - Authenticated users: userSelectedParts (personal state)
  const [guestSelectedParts, setGuestSelectedParts] = useState<SelectedParts>(GUEST_USER_BUILD);
  const [userSelectedParts, setUserSelectedParts] = useState<SelectedParts>({});
  
  // ✅ CRITICAL FIX: Ensure userSelectedParts is cleaned when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setUserSelectedParts({});
    }
  }, [isAuthenticated]);
  
  // ✅ CRITICAL FIX: Force CharacterViewer restart when authentication changes
  // REMOVED: This was redundant with loadUserPoses and could cause infinite loops
  // useEffect(() => {
  //   if (isAuthenticated && user?.id) {
  //     setUserSelectedParts(DEFAULT_STRONG_BUILD);
  //     setCharacterName('New Hero');
  //   }
  // }, [isAuthenticated, user?.id]);
  
  // ✅ ACTIVE STATE based on authentication
  const selectedParts = isAuthenticated ? userSelectedParts : guestSelectedParts;

  // ✅ CRITICAL FIX: Función que usa el estado correcto según autenticación
  const setSelectedParts = useCallback((newParts: SelectedParts | ((prev: SelectedParts) => SelectedParts)) => {
    if (isAuthenticated) {
      if (typeof newParts === 'function') {
        setUserSelectedParts(newParts);
      } else {
        setUserSelectedParts(newParts);
      }
    } else {
      if (typeof newParts === 'function') {
        setGuestSelectedParts(newParts);
      } else {
        setGuestSelectedParts(newParts);
      }
    }
  }, [isAuthenticated]);
  const [activeCategory, setActiveCategory] = useState<PartCategory | null>(null);

  // Undo/redo history for part selections
  const partsHistoryRef = useRef<SelectedParts[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pushPartsHistory = useCallback((parts: SelectedParts) => {
    const newHistory = partsHistoryRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(parts);
    if (newHistory.length > 50) newHistory.shift();
    partsHistoryRef.current = newHistory;
    historyIndexRef.current = newHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    const prev = partsHistoryRef.current[historyIndexRef.current];
    setSelectedParts(prev);
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(true);
  }, [setSelectedParts]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= partsHistoryRef.current.length - 1) return;
    historyIndexRef.current += 1;
    const next = partsHistoryRef.current[historyIndexRef.current];
    setSelectedParts(next);
    setCanUndo(true);
    setCanRedo(historyIndexRef.current < partsHistoryRef.current.length - 1);
  }, [setSelectedParts]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signup');
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(() => {
    const hash = window.location.hash;
    return hash.includes('type=recovery') || hash.includes('type=signup');
  });
  const [isWelcomeScreenOpen, setIsWelcomeScreenOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const [sessionInfo, setSessionInfo] = useState<{ hasSession: boolean; lastSaved?: string; source?: 'supabase' | 'localStorage' }>({ hasSession: false });
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSavingLastPose, setIsSavingLastPose] = useState(false);
  const [characterName, setCharacterName] = useState<string>("");
  const [rpgCharacter, setRpgCharacter] = useState<RPGCharacterSync | null>(null);

  // Estados del carrito de compras
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [ownedPartIds, setOwnedPartIds] = useState<Set<string>>(new Set());
  const [ownedPartIdsLoading, setOwnedPartIdsLoading] = useState(false);

  // Estado para confirmación de compra
  const [isPurchaseConfirmationOpen, setIsPurchaseConfirmationOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{
    parts: Part[];
    modelName: string;
    archetypeId: ArchetypeId;
  } | null>(null);

  // Estado para biblioteca de compras
  const [isPurchaseLibraryOpen, setIsPurchaseLibraryOpen] = useState(false);

  // Estado para modal de email de invitado
  const [isGuestEmailModalOpen, setIsGuestEmailModalOpen] = useState(false);
  const [guestEmailData, setGuestEmailData] = useState<{
    cartItems: CartItem[];
    totalPrice: number;
  } | null>(null);

  // ✅ NUEVO: Variable para detectar navegación entre poses
  const [isNavigatingPoses, setIsNavigatingPoses] = useState(false);

  // Estado para hojas de personaje RPG
  const [isRPGSheetOpen, setIsRPGSheetOpen] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<'stats' | 'style' | 'skins' | 'library' | null>('stats');
  const toggleRightPanel = (panel: 'stats' | 'style' | 'skins' | 'library') =>
    setActiveRightPanel(p => p === panel ? null : panel);

  // Estado para panel de materiales
  const [isMaterialPanelOpen, setIsMaterialPanelOpen] = useState(false);
  
  // Estado para modal VTT
  const [isVTTModalOpen, setIsVTTModalOpen] = useState(false);

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

  // ✨ NUEVOS ESTADOS Y REFERENCIAS PARA EL SUBMENÚ DEL TORSO
  const [torsoSubmenuExpanded, setTorsoSubmenuExpanded] = useState(false);
  const torsoButtonRef = useRef<HTMLButtonElement | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

  // Estados para el submenu del Belt
  const [beltSubmenuExpanded, setBeltSubmenuExpanded] = useState(false);
  const beltButtonRef = useRef<HTMLButtonElement | null>(null);
  const [beltSubmenuPosition, setBeltSubmenuPosition] = useState({ top: 0, left: 0 });

  // Estados para el submenu del Lower Body
  const [lowerBodySubmenuExpanded, setLowerBodySubmenuExpanded] = useState(false);
  const lowerBodyButtonRef = useRef<HTMLButtonElement | null>(null);
  const [lowerBodySubmenuPosition, setLowerBodySubmenuPosition] = useState({ top: 0, left: 0 });



  // Estado para panel de debug
  const [isDebugPanelVisible, setIsDebugPanelVisible] = useState(false);

  // Dark Comics Studio layout state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'parts' | 'materials' | 'skins' | 'effects' | 'lighting'>('parts');

  // Task 6: archetype loading spinner
  const [archetypeLoading, setArchetypeLoading] = useState(false);

  // STL scale modal
  const [showSTLModal, setShowSTLModal] = useState(false);

  // Task 7: side panel state
  const [activeSidePanel, setActiveSidePanel] = useState<'style' | 'skins' | 'lights' | null>(null);
  const activePanelMode: 'parts' | 'style' | 'skins' | 'lights' = activeSidePanel ?? 'parts';

  const STYLE_PART_LABELS: Record<string, string> = {
    torso: 'TORSO', legs: 'LEGS', head: 'HEAD', hand_left: 'L.HAND',
    hand_right: 'R.HAND', cape: 'CAPE', boots: 'BOOTS', belt: 'BELT',
  };

  const [stylePanelParts, setStylePanelParts] = useState<PartEntry[]>(
    Object.keys(STYLE_PART_LABELS).map((id) => ({
      id,
      label: STYLE_PART_LABELS[id],
      color: '#9ca3af',
      material: 'FABRIC' as MaterialType,
    }))
  );
  const [activePanelPart, setActivePanelPart] = useState('torso');

  // Submenu positions are calculated inline in toggle handlers to avoid flicker



  // ✨ MANEJADOR DEL TOGGLE DEL SUBMENÚ DEL UPPER BODY
  const handleTorsoSubmenuToggle = useCallback(() => {
    if (torsoButtonRef.current) {
      const rect = torsoButtonRef.current.getBoundingClientRect();
      setSubmenuPosition({ top: rect.top, left: rect.right + 8 });
    }
    setTorsoSubmenuExpanded(prev => !prev);
    setBeltSubmenuExpanded(false);
    setLowerBodySubmenuExpanded(false);
    if (activeCategory === PartCategory.HEAD || activeCategory === PartCategory.SUIT_TORSO ||
        activeCategory === PartCategory.HAND_LEFT || activeCategory === PartCategory.HAND_RIGHT) {
      setActiveCategory(PartCategory.TORSO);
    }
  }, [activeCategory]);

  // Función para obtener la referencia del botón Upper Body desde el PartCategoryToolbar
  const getTorsoButtonRef = useCallback((ref: HTMLButtonElement | null) => {
    torsoButtonRef.current = ref;
  }, []);

  const handleBeltSubmenuToggle = useCallback(() => {
    if (beltButtonRef.current) {
      const rect = beltButtonRef.current.getBoundingClientRect();
      setBeltSubmenuPosition({ top: rect.top, left: rect.right + 8 });
    }
    setBeltSubmenuExpanded(prev => !prev);
    setTorsoSubmenuExpanded(false);
    setLowerBodySubmenuExpanded(false);
  }, []);

  // Función para obtener la referencia del botón Belt desde el PartCategoryToolbar
  const getBeltButtonRef = useCallback((ref: HTMLButtonElement | null) => {
    beltButtonRef.current = ref;
  }, []);

  // ✨ MANEJADOR DEL TOGGLE DEL SUBMENÚ DEL LOWER BODY
  const handleLowerBodySubmenuToggle = useCallback(() => {
    if (lowerBodyButtonRef.current) {
      const rect = lowerBodyButtonRef.current.getBoundingClientRect();
      setLowerBodySubmenuPosition({ top: rect.top, left: rect.right + 8 });
    }
    setLowerBodySubmenuExpanded(prev => !prev);
    setTorsoSubmenuExpanded(false);
    setBeltSubmenuExpanded(false);
  }, []);

  // Función para obtener la referencia del botón Legs desde el PartCategoryToolbar
  const getLowerBodyButtonRef = useCallback((ref: HTMLButtonElement | null) => {
    lowerBodyButtonRef.current = ref;
  }, []);

  // ✨ NUEVA FUNCIONALIDAD: Precargar modelos de todas las poses
  const preloadPoseModels = useCallback(async (poses: Array<{configuration: SelectedParts}>) => {
    try {
      
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
      
      // Precargar todos los modelos únicos
      if (uniquePaths.length > 0) {
        await modelCache.preloadModels(uniquePaths);
      }

    } catch (error) {
      // Removed debug log
      // No bloquear la funcionalidad si falla el precarga
    }
  }, []);

  // ✨ NUEVA FUNCIONALIDAD: Cargar poses guardadas del usuario
  const loadUserPoses = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setSavedPoses([]);
      setCurrentPoseIndex(0);
      setUserSelectedParts({}); // Asegurar que el estado de usuario está vacío
      setCharacterName('Anonymous Hero'); // Resetear nombre
      return;
    }

    try {
      const purchasesResult = await PurchaseHistoryService.getUserPurchases(user.id);
      const purchases = purchasesResult.success ? purchasesResult.purchases || [] : [];

      const configurations = await UserConfigService.getUserConfigurations(user.id);

      const allPoses = [];

      purchases.forEach((purchase: any) => {
        if (purchase.purchase_items) {
          purchase.purchase_items.forEach((item: any) => {
            if (item.configuration_data) {
              allPoses.push({
                id: `purchase-${purchase.id}-${item.id}`,
                name: `${item.item_name || 'Configuration'} (Compra)`,
                configuration: item.configuration_data,
                source: 'purchase',
                date: purchase.purchase_date || item.created_at
              });
            }
          });
        }
      });

      configurations.forEach((config: any) => {
        if (config.selected_parts && Object.keys(config.selected_parts).length > 0) {
          allPoses.push({
            id: `saved-${config.id}`,
            name: config.name || 'Configuration Guardada',
            configuration: config.selected_parts,
            source: 'saved',
            date: config.created_at
          });
        }
      });

      // ✅ CRITICAL FIX: Ordenar poses por fecha (más reciente al final)
      allPoses.sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return dateA.getTime() - dateB.getTime(); // Orden ascendente (más antigua primero)
      });

      if (allPoses.length > 0) {
        // ✅ CRITICAL FIX: Cargar la ÚLTIMA pose (la más reciente) en lugar de la primera
        const lastPoseIndex = allPoses.length - 1;
        const latestPose = allPoses[lastPoseIndex];
        setSavedPoses(allPoses);
        setCurrentPoseIndex(lastPoseIndex);
        // ✅ CRITICAL FIX: NO sobrescribir la selección actual del usuario
        // Solo cargar si no hay una selección activa
        setSelectedParts(prev => {
          // Si ya hay partes seleccionadas, mantenerlas
          if (Object.keys(prev).length > 0) {
            return prev;
          }
          // Solo cargar la pose si no hay selección actual
          return latestPose.configuration;
        });
        setCharacterName(latestPose.name);
      } else {
        setSavedPoses([]);
        setCurrentPoseIndex(0);
        // ✅ CRITICAL FIX: NO sobrescribir la selección actual del usuario
        setSelectedParts(prev => {
          // Si ya hay partes seleccionadas, mantenerlas
          if (Object.keys(prev).length > 0) {
            return prev;
          }
          // Solo cargar el default si no hay selección actual
          return DEFAULT_STRONG_BUILD;
        });
        setCharacterName('New Hero');
      }
      
      // Asegurarse de que el CharacterViewer se actualice con la configuración correcta
      // setCharacterViewerKey(prev => prev + 1); // ❌ REMOVIDO: Esto causaba bucles de re-renderizado

    } catch (error) {
      // En caso de error, resetear a un estado seguro (DEFAULT_STRONG_BUILD para autenticados)
      if (isAuthenticated) {
        // ✅ CRITICAL FIX: NO sobrescribir la selección actual del usuario
        setUserSelectedParts(prev => {
          // Si ya hay partes seleccionadas, mantenerlas
          if (Object.keys(prev).length > 0) {
            return prev;
          }
          // Solo cargar el default si no hay selección actual
          return DEFAULT_STRONG_BUILD;
        });
        setCharacterName('Héroe Fallback');
      } else {
        setGuestSelectedParts(GUEST_USER_BUILD);
        setCharacterName('Anonymous Hero');
      }
      setSavedPoses([]);
      setCurrentPoseIndex(0);
    }
  }, [isAuthenticated, user?.id, setSavedPoses, setCurrentPoseIndex, setSelectedParts, setCharacterName, setUserSelectedParts, setGuestSelectedParts]);

  // Load owned part IDs when user authenticates or changes
  useEffect(() => {
    if (!user?.id) { setOwnedPartIds(new Set()); return; }
    setOwnedPartIdsLoading(true);
    PurchaseHistoryService.getOwnedPartIds(user.id)
      .then(setOwnedPartIds)
      .finally(() => setOwnedPartIdsLoading(false));
  }, [user?.id]);

  // Empty function for components that expect registerElement (tutorial functionality removed)
  const registerElement = (/*id: string, element: HTMLElement | null*/) => {};

  const characterViewerRef = useRef<CharacterViewerRef>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // ✅ FIXED: handleResetToDefaultBuild - Use proper build based on authentication status
  const handleResetToDefaultBuild = useCallback(() => {

    
    // Clear any preview state first
    if (characterViewerRef.current?.clearPreview) {
      characterViewerRef.current.clearPreview();
    }
    
    // ✅ CRITICAL FIX: Usar el estado correcto según autenticación
    if (!isAuthenticated) {
      // Usuario NO logueado: resetear guestSelectedParts
      setGuestSelectedParts(GUEST_USER_BUILD);
    } else {
      // Usuario logueado: resetear userSelectedParts según arquetipo
      let defaultBuild: SelectedParts;
      switch (selectedArchetype) {
        case ArchetypeId.STRONG:
          defaultBuild = DEFAULT_STRONG_BUILD;
          break;
        case ArchetypeId.JUSTICIERO:
          defaultBuild = DEFAULT_JUSTICIERO_BUILD;
          break;
        default:
          defaultBuild = DEFAULT_STRONG_BUILD;
      }
      setUserSelectedParts(defaultBuild);
    }
    
    // Force a complete reload by resetting the viewer state
    if (characterViewerRef.current?.resetState) {
      characterViewerRef.current.resetState();
    }
    
    // Force a complete re-render by updating the key
    setCharacterViewerKey(prev => prev + 1);
    
    setActiveCategory(null);
  }, [isAuthenticated, selectedArchetype]);

  // Log activeCategory changes in development only
  useEffect(() => {
    if (import.meta.env.DEV) {

    }
  }, [activeCategory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const inInput = ['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName);
      if (inInput) return;

      // Undo: Ctrl+Z
      if (event.key === 'z' && (event.ctrlKey || event.metaKey) && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
        return;
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((event.key === 'z' && (event.ctrlKey || event.metaKey) && event.shiftKey) ||
          (event.key === 'y' && (event.ctrlKey || event.metaKey))) {
        event.preventDefault();
        handleRedo();
        return;
      }
      // Reset camera with 'C' key
      if (event.key.toLowerCase() === 'c') {
        event.preventDefault();
        handleResetCamera();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleUndo, handleRedo]);

  // Save última pose cuando el usuario salga de la página
  useEffect(() => {
    const handleBeforeUnload = async () => {
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
          // Removed debug log
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
        // ✅ Cargar arquetipo de la sesión guardada
        const savedSession = await SessionStorageService.loadSession();
        if (savedSession?.selectedArchetype) {
          setSelectedArchetype(savedSession.selectedArchetype);
        }
        
        // ✅ NO cargar partes de la sesión - las cargará loadUserPoses con la última pose del usuario
        await loadUserPoses();
        
        // ✅ NUEVO: Restaurar posición de la cámara después del login (más cerca del modelo)
        setTimeout(() => {
          handleResetCamera();
        }, 800); // Delay aumentado para asegurar que el modelo se haya cargado completamente
      }
    };
    loadSessionOnAuthChange();
  }, [isAuthenticated, loading, user, loadUserPoses]); // Add loadUserPoses to dependencies

  // Detect fresh signup vs returning login
  useEffect(() => {
    if (!user) return;
    const justRegistered = sessionStorage.getItem('just_registered') === '1';
    if (justRegistered) {
      sessionStorage.removeItem('just_registered');
      setIsWelcomeScreenOpen(true);
      setIsAuthModalOpen(false);
    } else if (isAuthModalOpen) {
      setIsAuthModalOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // isAuthModalOpen is intentionally excluded: stale closure is safe because it is
  // only read (never set) in the else-if, and we only want this effect to fire
  // when the user identity changes, not on every modal open/close cycle.
  }, [user?.id]);

  // Cargar última pose guardada al iniciar la aplicación (solo para usuarios no autenticados)
  useEffect(() => {
    const resetGuestModel = async () => {
      // ✅ Si está autenticado, la carga principal se encarga de todo. No hacer nada aquí.
      if (isAuthenticated || loading) return;

      try {
        // Para usuarios no autenticados, siempre limpiar y cargar el modelo por defecto
        await SessionStorageService.clearSession();
        handleResetToDefaultBuild();
        // Removed debug log
      } catch (error) {
        // Removed debug log
      }
    };

    // Ejecutar el reseteo solo si no está autenticado y no está cargando
    if (!isAuthenticated && !loading) {
      resetGuestModel();
    }
  }, [isAuthenticated, loading, handleResetToDefaultBuild]); // Añadir handleResetToDefaultBuild a las dependencias

  useEffect(() => {
    const updateSessionInfo = async () => {
      const info = await SessionStorageService.getSessionInfo();
      setSessionInfo(info);
    };
    updateSessionInfo();
  }, [selectedParts, currentPoseIndex]); // ✅ FIXED: Agregar currentPoseIndex para que se actualice cuando cambie la pose

  // Save automáticamente la última pose cuando cambie
  useEffect(() => {
    // Save automáticamente la última pose cuando cambie
    const saveCurrentPoseAuto = async () => {
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
          // Removed debug log
          setIsSavingLastPose(false);
        }
      }
    };

    // Save con un pequeño delay para evitar demasiadas llamadas
    const timeoutId = setTimeout(saveCurrentPoseAuto, 1000); // Save after 3 seconds without changes
    return () => clearTimeout(timeoutId);
  }, [selectedArchetype, selectedParts, currentPoseIndex, savedPoses.length]); // ✅ FIXED: Usar savedPoses.length en lugar de savedPoses

  // ✨ NUEVA FUNCIONALIDAD: Actualizar la configuración de la pose actual cuando se modifica
  useEffect(() => {
    // ✅ NUEVO: NO ejecutar durante navegación entre poses
    if (isNavigatingPoses) {
      return;
    }

    const updateCurrentPoseConfiguration = async () => {
      if (savedPoses.length > 0 && currentPoseIndex >= 0 && currentPoseIndex < savedPoses.length) {
        const currentPose = savedPoses[currentPoseIndex];
        
        // Verificar si la configuración realmente cambió
        const currentConfig = currentPose.configuration;
        const configChanged = JSON.stringify(currentConfig) !== JSON.stringify(selectedParts);
        
        if (configChanged) {
          // Actualizar el estado local
          setSavedPoses(prev => {
            const newPoses = [...prev];
            // Actualizar solo la configuración de la pose actual
            newPoses[currentPoseIndex] = {
              ...newPoses[currentPoseIndex],
              configuration: selectedParts
            };
            return newPoses;
          });

          // Si es una pose guardada por el usuario, actualizar en la base de datos
          if (currentPose.source === 'saved' && user?.id) {
            try {
              const configId = currentPose.id.replace('saved-', '');
              
              // Removed debug log

              await UserConfigService.updateConfiguration(configId, { name: currentPose.name, selected_parts: selectedParts });
                    } catch (error) {
          // Removed debug log
        }
          }
        }
      }
    };

    // Actualizar con un delay para evitar demasiadas actualizaciones (delay aumentado)
    const timeoutId = setTimeout(updateCurrentPoseConfiguration, 800);
    return () => clearTimeout(timeoutId);
  }, [selectedParts, currentPoseIndex, user?.id, isNavigatingPoses, savedPoses.length]); // ✅ FIXED: Usar savedPoses.length en lugar de savedPoses

  // Cargar configuración desde URL si existe parámetro 'load'
  useEffect(() => {
    const loadConfigurationFromURL = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const configId = urlParams.get('load');
      const shouldDownload = urlParams.get('download') === 'true';
      
      if (configId) {
    
        
        try {
          // Intentar cargar desde sessionStorage primero
          const savedConfig = sessionStorage.getItem(`config_${configId}`);
          if (savedConfig) {
            const configData = JSON.parse(savedConfig);
        
            
            if (configData.selectedParts) {
              setSelectedParts(configData.selectedParts);
            }
            if (configData.selectedArchetype) {
              setSelectedArchetype(configData.selectedArchetype);
            }
            
            // Si se solicita descarga automática, esperar un momento y descargar
            if (shouldDownload) {
          
              
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
        
          }
        } catch (error) {
          // Removed debug log
        }
      }
    };
    
    loadConfigurationFromURL();
  }, []); // Solo ejecutar una vez al montar el componente

  useEffect(() => {
    document.body.classList.toggle('panel-open', isPanelOpen);
    return () => document.body.classList.remove('panel-open');
  }, [isPanelOpen]);

  const handleArchetypeChange = (archetype: ArchetypeId) => {
    setSelectedArchetype(archetype);
    
    // Reset to default build for the new archetype
    let defaultBuild: SelectedParts;
    switch (archetype) {
      case ArchetypeId.STRONG:
        defaultBuild = DEFAULT_STRONG_BUILD;
        break;
      case ArchetypeId.JUSTICIERO:
        defaultBuild = DEFAULT_JUSTICIERO_BUILD;
        break;
      default:
        defaultBuild = DEFAULT_STRONG_BUILD;
    }
    
    setSelectedParts(defaultBuild);
    setCharacterName('New Hero');
  };

  // Task 6: ArchetypeSwitcher handler
  const handleArchetypeSelect = (id: string) => {
    setSelectedArchetype(id as ArchetypeId);
    // Reset selected parts when changing archetype
    if (isAuthenticated) {
      setUserSelectedParts({});
    } else {
      setGuestSelectedParts(GUEST_USER_BUILD);
    }
    // Trigger remount with spinner
    setArchetypeLoading(true);
    setCharacterViewerKey((k: number) => k + 1);
    setTimeout(() => setArchetypeLoading(false), 2000);
  };

  // Task 7: side panel toggle — wired to right panel system
  const handleSidePanelToggle = (panel: 'style' | 'skins') => {
    toggleRightPanel(panel);
  };

  const handlePanelModeChange = (mode: 'parts' | 'style' | 'skins' | 'lights') => {
    setIsPanelOpen(true);
    if (mode === 'parts') {
      setActiveSidePanel(null);
      setActiveTab('parts');
      return;
    }
    setActiveSidePanel(mode);
  };

  // Task 7: StylePanel handlers
  const handleStylePanelColorChange = (partId: string, color: string) => {
    setStylePanelParts((prev) => prev.map((p) => p.id === partId ? { ...p, color } : p));
    const category = STYLE_PART_TO_CATEGORY[partId];
    if (category && characterViewerRef.current) {
      characterViewerRef.current.applyColorToPart(parseInt(color.replace('#', ''), 16), category);
    }
  };

  const handleStylePanelMaterialChange = (partId: string, material: MaterialType) => {
    setStylePanelParts((prev) => prev.map((p) => p.id === partId ? { ...p, material } : p));
    const category = STYLE_PART_TO_CATEGORY[partId];
    if (category && characterViewerRef.current) {
      const currentColor = stylePanelParts.find((p) => p.id === partId)?.color ?? '#9ca3af';
      const mat = buildThreeMaterial(material, parseInt(currentColor.replace('#', ''), 16));
      characterViewerRef.current.applyMaterialToPart(mat, category);
    }
  };

  const handleApplyToAll = (color: string, material: MaterialType) => {
    setStylePanelParts((prev) => prev.map((p) => ({ ...p, color, material })));
    if (characterViewerRef.current) {
      const colorNum = parseInt(color.replace('#', ''), 16);
      const mat = buildThreeMaterial(material, colorNum);
      Object.values(STYLE_PART_TO_CATEGORY).forEach((category) => {
        characterViewerRef.current!.applyColorToPart(colorNum, category);
        characterViewerRef.current!.applyMaterialToPart(mat, category);
      });
    }
  };

  const handleLoadConfiguration = (parts: SelectedParts, modelName?: string) => {

    // ✅ LIMPIAR COMPLETAMENTE EL ESTADO ANTES DE CARGAR
    // Clear any preview state first
    if (characterViewerRef.current?.clearPreview) {
      characterViewerRef.current.clearPreview();
    }

    // ✅ RESETEAR EL ESTADO DEL VIEWER ANTES DE CARGAR NUEVAS PARTES
    if (characterViewerRef.current?.resetState) {
      characterViewerRef.current.resetState();
    }

    // ✅ CARGAR LAS NUEVAS PARTES (REEMPLAZANDO COMPLETAMENTE)
    setSelectedParts(parts);
    
    // ✅ NUEVO: ACTUALIZAR EL NOMBRE DEL PERSONAJE SI SE PROPORCIONA
    if (modelName) {
      setCharacterName(modelName);
    }
    
    // ✅ FORZAR RE-RENDER COMPLETO DEL VIEWER
    setCharacterViewerKey(prev => prev + 1);
    
    // ✅ CERRAR PANELES ABIERTOS
    setActiveCategory(null);
    setIsPurchaseLibraryOpen(false);
    setIsUserProfileOpen(false);
  };

  const handleSelectPart = useCallback((newSelectedParts: SelectedParts) => {
    pushPartsHistory(newSelectedParts);
    setSelectedParts(newSelectedParts);
    return true;
  }, [setSelectedParts, pushPartsHistory]);

  const handleEditCategory = (category: PartCategory) => {
    setActiveCategory(category);
    setActiveTab('parts');
    setIsPanelOpen(true);
    setActiveSidePanel(null);

    // Cerrar todos los submenús al seleccionar cualquier categoría
    setTorsoSubmenuExpanded(false);
    setBeltSubmenuExpanded(false);
    setLowerBodySubmenuExpanded(false);
  };

  const handleCloseSelector = () => {
    setActiveCategory(null);
    setIsPanelOpen(false);
  };

  const handleSignOut = async () => {
    // ✅ LIMPIAR ESTADO ANTES DEL SIGNOUT
    if (characterViewerRef.current?.clearPreview) {
      characterViewerRef.current.clearPreview();
    }
    
    // ✅ CRITICAL FIX: LIMPIAR ESTADO DEL USUARIO Y RESTAURAR GUEST
    setUserSelectedParts({});
    
    // ✅ CRITICAL FIX: RESTAURAR ESTADO DEL GUEST
    setGuestSelectedParts(GUEST_USER_BUILD);
    
    // ✅ LIMPIAR POSES GUARDADAS
    setSavedPoses([]);
    setCurrentPoseIndex(0);
    
    // ✅ RESETEAR ESTADO DEL VIEWER
    if (characterViewerRef.current?.resetState) {
      characterViewerRef.current.resetState();
    }
    
    // ✅ FORZAR RE-RENDER
    setCharacterViewerKey(prev => prev + 1);
    
    // ✅ CERRAR SESIÓN (con manejo de errores)
    try {
      await signOut();
    } catch (error) {
      // Removed debug log
    }
    
    // ✅ CRITICAL FIX: FORZAR LIMPIEZA LOCAL SIEMPRE
    
    // Limpiar localStorage/sessionStorage si es necesario
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (error) {
      // Removed debug log
    }
    
    setIsUserProfileOpen(false);
    
    // ✅ CRITICAL FIX: FORZAR CAMBIO DE ESTADO SIN RELOAD
    
    // Forzar que el estado active sea guestSelectedParts
    // Esto se hace automáticamente cuando isAuthenticated cambia
  };

  // Funciones de exportación
  const handleExportGLB = async () => {
    if (characterViewerRef.current?.exportModel) {
      try {
        const result = await characterViewerRef.current.exportModel();
        return result;
      } catch (error) {
        // Removed debug log
        return { success: false, error: 'Error exporting GLB' };
      }
    }
    return { success: false, error: 'Viewer not available' };
  };

  const handleExportSTL = async () => {
    if (characterViewerRef.current?.exportSTL) {
      try {
        const result = await characterViewerRef.current.exportSTL();
        return result;
      } catch (error) {
        return { success: false, error: 'Error exporting STL' };
      }
    }
    return { success: false, error: 'Viewer not available' };
  };

  const handleExportSTLWithScale = async (scaleFactor: number) => {
    setShowSTLModal(false);
    if (characterViewerRef.current?.exportSTL) {
      try {
        await characterViewerRef.current.exportSTL({ scaleFactor });
      } catch {}
    }
  };

  const handleRandomize = () => {
    const archetype = selectedArchetype ?? ArchetypeId.STRONG;
    const ap = ALL_PARTS.filter((p) => p.archetype === archetype);

    const pick = (category: PartCategory, anchorId?: string, excludeId?: string): Part | undefined => {
      const pool = ap.filter((p) => {
        if (p.category !== category) return false;
        if (excludeId && p.id === excludeId) return false;
        if (!anchorId) return true;
        return p.compatible.length === 0 || p.compatible.includes(anchorId);
      });
      if (pool.length === 0) return undefined;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    // 1. TORSO is the root — everything else anchors to it
    const currentTorsoId = selectedParts[PartCategory.TORSO]?.id;
    const torso = pick(PartCategory.TORSO, undefined, currentTorsoId) ?? pick(PartCategory.TORSO);
    if (!torso) return; // archetype has no torso parts, bail
    const torsoId = torso.id;

    // 2. LOWER_BODY is independent from torso — always pick a different variant
    const currentLegsId = selectedParts[PartCategory.LOWER_BODY]?.id;
    const legs = pick(PartCategory.LOWER_BODY, undefined, currentLegsId) ?? pick(PartCategory.LOWER_BODY);
    const legsId = legs?.id;

    const result: SelectedParts = {
      [PartCategory.TORSO]: torso,
      ...(legs && { [PartCategory.LOWER_BODY]: legs }),
      // Torso-dependent parts
      ...([PartCategory.HEAD, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT,
           PartCategory.CAPE, PartCategory.BELT, PartCategory.SYMBOL,
           PartCategory.SHOULDERS, PartCategory.FOREARMS, PartCategory.CHEST_BELT,
        ] as PartCategory[]).reduce((acc, cat) => {
          const p = pick(cat, torsoId);
          if (p) acc[cat] = p;
          return acc;
        }, {} as SelectedParts),
      // Legs-dependent parts
      ...(legsId && (() => {
          const boots = pick(PartCategory.BOOTS, legsId);
          return boots ? { [PartCategory.BOOTS]: boots } : {};
        })()),
      // Unconstrained extras (50% chance each to avoid overloading the model)
      ...(Math.random() > 0.5 ? (() => {
          const p = pick(PartCategory.BUCKLE);
          return p ? { [PartCategory.BUCKLE]: p } : {};
        })() : {}),
      ...(Math.random() > 0.5 ? (() => {
          const p = pick(PartCategory.BACKPACK);
          return p ? { [PartCategory.BACKPACK]: p } : {};
        })() : {}),
    };

    setSelectedParts(result);
  };



  const handleResetCamera = () => {
    if (characterViewerRef.current?.resetCamera) {
      characterViewerRef.current.resetCamera();
    }
  };

  

  const handleOpenAuthModal = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleOpenSignUpModal = () => {
    setIsSignUpModalOpen(true);
  };

  const handleCloseSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  // ✅ NUEVA FUNCIÓN: Manejar éxito del registro
  const handleSignInSuccess = () => {
    // El usuario ya está autenticado por el registro exitoso
    // No necesitamos hacer nada más aquí, el hook useAuth manejará el estado
  };

  const handleOpenUserProfile = () => {
    setIsUserProfileOpen(true);
  };

  const handleCloseUserProfile = () => {
    setIsUserProfileOpen(false);
  };

  // const handleToggleBattleDemo = () => { // Removed: not used
  //   setShowBattleDemo(!showBattleDemo);
  // };

  // Funciones del carrito de compras - VERSIÓN MEJORADA
  const handleAddToCart = (configuration: SelectedParts, archetype?: string, name?: string) => {
    if (Object.keys(configuration).length === 0) return;

    const configPrice = Object.values(configuration).reduce((sum, part) => sum + (part?.priceUSD || 0), 0);
    const effectiveArchetype = archetype || selectedArchetype || ArchetypeId.STRONG;
    const configName = name || `Superhéroe ${archetype} - ${new Date().toLocaleDateString('es-ES')}`;
    const configThumbnail = Object.values(configuration)[0]?.thumbnail || '';
    
    const newItem: CartItem = {
      id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: configName,
      category: 'Configuration Completa',
      price: configPrice,
      thumbnail: configThumbnail,
      quantity: 1,
      configuration: { ...configuration },
      archetype: effectiveArchetype
    };

    setCartItems(prev => {
      // Verificar si ya existe una configuración igual
      const existingIndex = prev.findIndex(item => 
        JSON.stringify(item.configuration) === JSON.stringify(configuration) &&
        item.archetype === effectiveArchetype
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
          // Removed debug log
          throw new Error(`Error saving in library: ${saveResult.error}`);
        }

        

        // Preparar datos de compra para la confirmación
        setPurchaseData({
          parts: Object.values(selectedParts).filter(Boolean) as Part[],
          modelName: ARCHETYPE_DATA[selectedArchetype ?? ArchetypeId.STRONG]?.title ?? 'Mi Héroe',
          archetypeId: selectedArchetype ?? ArchetypeId.STRONG,
        });

        // Limpiar carrito
        setCartItems([]);
        setIsCartOpen(false);

        // ✅ CRITICAL FIX: Recargar poses después de la compra para mostrar flechas verdes
        // Removed debug log
        await loadUserPoses();
        PurchaseHistoryService.getOwnedPartIds(user.id).then(setOwnedPartIds);

        // Mostrar confirmación de compra gratuita
        setIsPurchaseConfirmationOpen(true);


      } catch (error) {
        // Removed debug log
        throw new Error(`Error processing order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      // 🔶 USUARIO INVITADO: Proceso con email (gratis por ahora)
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
    
    setIsPurchaseConfirmationOpen(false);
    setPurchaseData(null);
    
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
      // Save configuración para usuario invitado
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
        // Limpiar datos temporales
        setCartItems([]);
        setGuestEmailData(null);
        setIsGuestEmailModalOpen(false);

        // Guest users do not see the purchase confirmation modal (spec: guest flow
        // handled at cart level — unauthenticated users never reach that modal).

        // Mostrar mensaje de éxito
        alert(`✅ Configuration sent successfully to ${email}!\n\n` +
              `Check your inbox for download links.\n` +
              `Links will be available for 7 days.`);
      } else {
        alert(`❌ Error sending email: ${emailResult.error}\n\nPlease try again.`);
      }

    } catch (error) {
      // Removed debug log
      alert('Unexpected error. Please try again.');
    }
  };

  // Register elements for tutorial
  // const categoryToolbarRef = useRef<HTMLDivElement>(null); // Removed: not used
  // const currentConfigButtonRef = useRef<HTMLButtonElement>(null); // Removed: not used
  // const aiDesignerButtonRef = useRef<HTMLButtonElement>(null); // Removed: not used
  // const authButtonRef = useRef<HTMLButtonElement>(null); // Removed: not used
  // const battlePrototypeButtonRef = useRef<HTMLButtonElement>(null); // Removed: not used

  const handleOpenSettings = () => {};
  const handleOpenHelp = () => {};

  const handleToggleMaterialPanel = () => {
    setIsMaterialPanelOpen(!isMaterialPanelOpen);
  };

  const handleOpenVTTLibrary = () => {
    // Crear personaje RPG si no existe
    if (!rpgCharacter) {
      const newRPGCharacter: RPGCharacterSync = {
        archetypeId: selectedArchetype || ArchetypeId.STRONG,
        selectedParts: selectedParts,
        calculatedStats: {
          power: 10,
          defense: 8,
          speed: 6,
          intelligence: 4,
          energy: 5,
          charisma: 3
        },
        physicalAttributes: {
          build: 'athletic',
          height: 'average',
          weight: 'medium',
          stance: 'erect',
          movement: 'fluid'
        },
        compatibility: {
          isOptimal: true,
          score: 85,
          suggestions: []
        },
        visualEffects: [],
        lastUpdated: new Date()
      };
      setRpgCharacter(newRPGCharacter);
    }
    setIsVTTModalOpen(true);
  };
  
  const handleCloseVTTModal = () => {
    setIsVTTModalOpen(false);
  };
  
  const handleOpenRPGSheet = () => {
    setIsRPGSheetOpen(true);
  };
  
  const handleCloseRPGSheet = () => {
    setIsRPGSheetOpen(false);
    // REMOVED: handleLoadRPGCharacterToCustomizer(rpgCharacter); // Esto causaba bucle infinito
  };

  // ✨ NUEVA FUNCIONALIDAD: Navegar a la pose anterior
  const handlePreviousPose = () => {
    if (savedPoses.length === 0) {
      return;
    }
    
    // ✅ NUEVO: Activar bandera de navegación
    setIsNavigatingPoses(true);
    
    const newIndex = currentPoseIndex > 0 ? currentPoseIndex - 1 : savedPoses.length - 1;
    
    setCurrentPoseIndex(newIndex);
    
    const newPose = savedPoses[newIndex];
    
    setUserSelectedParts(newPose.configuration);
    
    // ✅ NUEVO: Desactivar bandera después de un delay
    setTimeout(() => {
      setIsNavigatingPoses(false);
    }, 100);
  };

  const handleNextPose = () => {
    if (savedPoses.length === 0) {
      return;
    }
    
    // ✅ NUEVO: Activar bandera de navegación
    setIsNavigatingPoses(true);
    
    const newIndex = currentPoseIndex < savedPoses.length - 1 ? currentPoseIndex + 1 : 0;
    
    setCurrentPoseIndex(newIndex);
    
    const newPose = savedPoses[newIndex];
    
    setUserSelectedParts(newPose.configuration);
    
    // ✅ NUEVO: Desactivar bandera después de un delay
    setTimeout(() => {
      setIsNavigatingPoses(false);
    }, 100);
  };

  const handleSelectPose = (index: number) => {
    if (index < 0 || index >= savedPoses.length) {
      return;
    }
    
    // ✅ NUEVO: Activar bandera de navegación
    setIsNavigatingPoses(true);
    
    const newPose = savedPoses[index];
    setCurrentPoseIndex(index);
    setUserSelectedParts(newPose.configuration);
    
    // ✅ NUEVO: Desactivar bandera después de un delay
    setTimeout(() => {
      setIsNavigatingPoses(false);
    }, 100);
  };

  const handleRenamePose = (index: number, newName: string) => {
    setSavedPoses(prev => {
      const newPoses = [...prev];
      if (newPoses[index]) {
        newPoses[index] = { ...newPoses[index], name: newName };
      }
      return newPoses;
    });
    updateSavedPoseName(index, newName); // Actualizar en la base de datos
  };

  const handleDeletePose = async (index: number) => {
    const pose = savedPoses[index];
    if (!pose || pose.source !== 'saved') return;

    const success = await UserConfigService.deleteConfiguration(pose.id);
    if (!success) return;

    const newPoses = savedPoses.filter((_, i) => i !== index);
    const newIndex = newPoses.length === 0 ? 0 : index > 0 ? index - 1 : 0;

    setSavedPoses(newPoses);
    setCurrentPoseIndex(newIndex);

    if (newPoses.length === 0) {
      setUserSelectedParts({});
    } else {
      setUserSelectedParts(newPoses[newIndex].configuration);
    }
  };

  // ✨ NUEVA FUNCIONALIDAD: Convertir pose de compra en pose guardada
  const handleSaveCurrentPoseAsNew = async () => {
    if (!user?.id) {
      return;
    }

    try {
      // Crear nueva configuración guardada
      const configToSave = {
        name: `Copia de ${savedPoses[currentPoseIndex]?.name || 'Pose'}`,
        archetype: selectedArchetype || 'STRONG',
        selected_parts: selectedParts,
        total_price: 0 // Precio 0 para copias
      };
      
          // Removed debug log

      const newConfig = await UserConfigService.saveConfiguration(configToSave);

      if (newConfig) {
        // Removed debug log
        
        // Recargar poses para incluir la nueva
        await loadUserPoses();
        
        // Navegar a la nueva pose
        const newPoseIndex = savedPoses.length; // La nueva será la última
        setCurrentPoseIndex(newPoseIndex);
        setSelectedParts(selectedParts); // Mantener la configuración actual
        
        // Removed debug log
      }
          } catch (error) {
        // Removed debug log
      }
  };

  const updateSavedPoseName = async (index: number, newName: string) => {
    if (!user?.id || !savedPoses[index]) return;

    try {
      const poseId = savedPoses[index].id;
      if (poseId.startsWith('saved-')) {
        const configId = poseId.replace('saved-', '');
        await UserConfigService.updateConfigurationName(configId, newName);
        
      } else {
        // Removed debug log
      }
    } catch (error) {
      // Removed debug log
    }
  };

  const handleCharacterNameChange = (newName: string) => {
    setCharacterName(newName);
  };

  // Función para manejar actualizaciones del personaje RPG
  const handleRPGCharacterUpdate = (character: RPGCharacterSync) => {
    setRpgCharacter(character);
    // Removed debug log
    // REMOVED: handleLoadRPGCharacterToCustomizer(character); // Esto causaba bucle infinito
  };

  const mapStatToTorso = (stat: number) => {
    if (stat <= 3) return 'strong_torso_01';
    if (stat <= 6) return 'strong_torso_02';
    if (stat <= 8) return 'strong_torso_03';
    if (stat <= 9) return 'strong_torso_04';
    return 'strong_torso_05';
  };
  const mapStatToLegs = (stat: number) => {
    if (stat <= 3) return 'strong_legs_01';
    if (stat <= 6) return 'strong_legs_02';
    if (stat <= 8) return 'strong_legs_03';
    return 'strong_legs_04';
  };
  const [lastLoadedRPGCharacter, setLastLoadedRPGCharacter] = useState<any>(null);

  const handleLoadRPGCharacterToCustomizer = useCallback((character: any) => {
    setSelectedArchetype(prevArchetype => character.archetypeId || prevArchetype || ArchetypeId.STRONG);
    setCharacterName(character.name || "");
    
    setSelectedParts(prevParts => {
      const newParts = { ...prevParts };

      // Si el torso no está seleccionado, o el usuario está cargando un personaje RPG por primera vez,
      // establecer el torso y las piernas según las estadísticas del RPG.
      // Si ya hay un torso seleccionado manualmente, lo respetamos.
      const currentTorso = newParts[PartCategory.TORSO] || newParts[PartCategory.SUIT_TORSO];
    const torsoId = mapStatToTorso(character.str);
    const legsId = mapStatToLegs(character.end);
    const torso = STRONG_TORSO_PARTS.find(p => p.id === torsoId)!;
    const legs = STRONG_LEGS_PARTS.find(p => p.id === legsId)!;

      if (!currentTorso || Object.keys(prevParts).length === 0) { // Si no hay torso o es una carga inicial
        newParts[PartCategory.TORSO] = torso;
        newParts[PartCategory.LOWER_BODY] = legs;
      } else {
        // Si hay un torso, pero las piernas son incompatibles, actualizarlas.
        // O si las piernas están vacías.
        if (!newParts[PartCategory.LOWER_BODY] || !newParts[PartCategory.LOWER_BODY].compatible.includes(currentTorso.id)) {
            newParts[PartCategory.LOWER_BODY] = legs;
        }
      }

      // Siempre adaptar manos, cabeza, capa, cinturón y botas al torso *actual* o al *nuevo* torso generado.
      // PRIORIZAR la selección actual del usuario si es compatible.
      const effectiveTorso = newParts[PartCategory.TORSO] || newParts[PartCategory.SUIT_TORSO];

      if (effectiveTorso) {
        // Manos: preservar si son compatibles con el torso actual, si no, asignar adaptativas
        const currentLeftHand = prevParts[PartCategory.HAND_LEFT];
        const currentRightHand = prevParts[PartCategory.HAND_RIGHT];

        if (!currentLeftHand || !currentLeftHand.compatible.includes(effectiveTorso.id)) {
          newParts[PartCategory.HAND_LEFT] = STRONG_HANDS_PARTS.find(h => h.category === PartCategory.HAND_LEFT && h.compatible.includes(effectiveTorso.id) && h.id.endsWith('_ng')) ||
                                            STRONG_HANDS_PARTS.find(h => h.category === PartCategory.HAND_LEFT && h.compatible.includes(effectiveTorso.id))!;
        }
        if (!currentRightHand || !currentRightHand.compatible.includes(effectiveTorso.id)) {
          newParts[PartCategory.HAND_RIGHT] = STRONG_HANDS_PARTS.find(h => h.category === PartCategory.HAND_RIGHT && h.compatible.includes(effectiveTorso.id) && h.id.endsWith('_ng')) ||
                                             STRONG_HANDS_PARTS.find(h => h.category === PartCategory.HAND_RIGHT && h.compatible.includes(effectiveTorso.id))!;
        }

        // Cabeza: preservar si es compatible con el torso actual, si no, asignar adaptativa
        const currentHead = prevParts[PartCategory.HEAD];
        if (!currentHead || !currentHead.compatible.includes(effectiveTorso.id)) {
          newParts[PartCategory.HEAD] = STRONG_HEAD_PARTS.find(h => h.compatible.includes(effectiveTorso.id)) || STRONG_HEAD_PARTS.find(h => h.compatible.includes('strong_torso_01'))!;
        }

        // Capa: preservar si es compatible con el torso actual, si no, asignar adaptativa
        const currentCape = prevParts[PartCategory.CAPE];
        if (!currentCape || !currentCape.compatible.includes(effectiveTorso.id)) {
          newParts[PartCategory.CAPE] = STRONG_CAPE_PARTS.find(c => c.compatible.includes(effectiveTorso.id)) || STRONG_CAPE_PARTS.find(c => c.compatible.includes('strong_torso_01'))!;
        }

        // Cinturón: preservar si es compatible con el torso actual, si no, asignar adaptativo
        const currentBelt = prevParts[PartCategory.BELT];
        if (!currentBelt || !currentBelt.compatible.includes(effectiveTorso.id)) {
          newParts[PartCategory.BELT] = STRONG_BELT_PARTS.find(b => b.compatible.includes(effectiveTorso.id)) || STRONG_BELT_PARTS[0];
        }

        // Botas: adaptar a las piernas si no están seleccionadas o son incompatibles
        const effectiveLegs = newParts[PartCategory.LOWER_BODY];
        const currentBoots = prevParts[PartCategory.BOOTS];
        if (effectiveLegs && (!currentBoots || !currentBoots.compatible.includes(effectiveLegs.id))) {
          const specificLegsSuffix = '_' + effectiveLegs.id.substring(effectiveLegs.id.lastIndexOf('_') + 1);
          newParts[PartCategory.BOOTS] = STRONG_BOOTS_PARTS.find(b =>
            b.compatible.includes(effectiveLegs.id) && b.id.endsWith(specificLegsSuffix)
          ) || STRONG_BOOTS_PARTS.find(b =>
            b.compatible.includes(effectiveLegs.id)
          ) || STRONG_BOOTS_PARTS.find(b => b.compatible.includes('strong_legs_01')) || STRONG_BOOTS_PARTS[0];
        }
      }

      return newParts;
    });

    setCharacterViewerKey(prev => prev + 1);
    setIsRPGSheetOpen(false);
  }, []);

  const handlePartHover = useCallback((part: Part) => {
    if (characterViewerRef.current?.handlePreviewPartsChange) {
      // Removed debug log
      characterViewerRef.current.handlePreviewPartsChange({ [part.category]: part });
    }
  }, []);

  const handlePartUnhover = useCallback(() => {
    if (characterViewerRef.current?.clearPreview) {
      // Removed debug log
      characterViewerRef.current.clearPreview();
    }
  }, []);

  

  return (
    <div className="relative w-full h-full" style={{ background: 'var(--color-bg)' }}>
      {/* ── 3D VIEWER (full-screen background) ── */}
      <div className="app-viewer" style={{ right: activeRightPanel ? 354 : 34, transition: 'right 200ms ease' }}>
        <ErrorBoundary>
          <CharacterViewer
            key={characterViewerKey}
            ref={characterViewerRef}
            selectedParts={selectedParts}
            selectedArchetype={selectedArchetype || ArchetypeId.STRONG}
            characterName={characterName}
            onCharacterNameChange={handleCharacterNameChange}
            isAuthenticated={isAuthenticated}
            savedPoses={savedPoses}
            currentPoseIndex={currentPoseIndex}
            onPreviousPose={handlePreviousPose}
            onNextPose={handleNextPose}
            onSelectPose={handleSelectPose}
            onRenamePose={handleRenamePose}
            onSaveAsNew={handleSaveCurrentPoseAsNew}
            onDeletePose={handleDeletePose}
          />
        </ErrorBoundary>
        {archetypeLoading && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,10,15,0.65)',
            zIndex: 50, pointerEvents: 'none',
          }}>
            <div style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 4 }}>
              LOADING…
            </div>
          </div>
        )}
      </div>

      {/* ── TOPBAR ── */}
      <header className="app-topbar">
        {/* Logo block */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(216, 162, 58, 0.98), rgba(184, 131, 31, 0.96))',
          padding: '0 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 900, letterSpacing: '1.8px', color: '#09090f', lineHeight: 1 }}>
            HERO BUILDER
          </span>
        </div>

        {/* Archetype Switcher */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', padding: '0 12px', overflow: 'hidden' }}>
          <ArchetypeSwitcher
            archetypes={ARCHETYPES_LIST}
            activeArchetypeId={selectedArchetype ?? ArchetypeId.STRONG}
            hasUnsavedParts={Object.keys(selectedParts).length > 0}
            onSelect={handleArchetypeSelect}
          />
        </div>

        {/* 3-step flow indicator */}
        {(() => {
          const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
          const activeStep = cartCount > 0 ? 3 : 2;
          const steps: Array<{ n: number; label: string }> = [
            { n: 1, label: 'ARCHETYPE' },
            { n: 2, label: 'BUILD' },
            { n: 3, label: 'EXPORT' },
          ];
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0, padding: '0 16px' }}>
              {steps.map((step, i) => (
                <React.Fragment key={step.n}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: step.n <= activeStep ? 'var(--color-accent, #f59e0b)' : 'rgba(71,85,105,0.5)',
                      color: step.n <= activeStep ? '#09090f' : 'rgba(148,163,184,0.6)',
                      fontSize: 10, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-body)',
                      flexShrink: 0,
                    }}>
                      {step.n < activeStep ? '✓' : step.n}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1,
                      color: step.n === activeStep ? 'var(--color-accent, #f59e0b)' : step.n < activeStep ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.6)',
                      textTransform: 'uppercase' as const,
                    }}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 20, height: 1, background: 'rgba(71,85,105,0.5)', margin: '0 4px' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          );
        })()}

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', gap: '8px', flexShrink: 0 }}>
          <button
            className="btn-comic btn-outline"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            style={{ fontSize: '13px', padding: '5px 9px', opacity: canUndo ? 1 : 0.35, cursor: canUndo ? 'pointer' : 'default' }}
            onClick={handleUndo}
          >↩</button>
          <button
            className="btn-comic btn-outline"
            title="Redo (Ctrl+Shift+Z)"
            disabled={!canRedo}
            style={{ fontSize: '13px', padding: '5px 9px', opacity: canRedo ? 1 : 0.35, cursor: canRedo ? 'pointer' : 'default' }}
            onClick={handleRedo}
          >↪</button>
          <button
            className="btn-comic btn-outline"
            title="Randomize parts for this archetype"
            style={{ fontSize: '13px', padding: '5px 12px' }}
            onClick={handleRandomize}
          >
            🎲 RANDOM
          </button>
          <button
            className="btn-comic btn-primary"
            style={{ fontSize: '14px', padding: '5px 16px', position: 'relative' }}
            onClick={handleOpenCart}
          >
            CHECKOUT →
            {cartItems.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--color-danger)', color: '#fff',
                fontSize: '9px', fontWeight: 700,
                width: 14, height: 14, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          {!user && (
            <button
              className="btn-comic btn-primary"
              style={{ fontSize: '14px', padding: '5px 14px', background: 'var(--color-accent)', color: '#09090f', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)', fontWeight: 900, letterSpacing: 0.8, cursor: 'pointer' }}
              onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
            >
              JOIN ▶
            </button>
          )}
          {user && (
            <button
              ref={userButtonRef}
              className="btn-comic btn-outline"
              style={{ fontSize: '13px', padding: '5px 12px', fontFamily: 'var(--font-body)', fontWeight: 700 }}
              onClick={() => setIsUserDropdownOpen(v => !v)}
            >
              👤 {user.email?.split('@')[0]?.toUpperCase()}
            </button>
          )}
          <HeaderDropdown
            isOpen={isUserDropdownOpen}
            onClose={() => setIsUserDropdownOpen(false)}
            triggerRef={userButtonRef}
            onOpenUserProfile={handleOpenUserProfile}
            onOpenPurchaseLibrary={handleOpenPurchaseLibrary}
            onOpenSettings={handleOpenSettings}
            onOpenHelp={handleOpenHelp}
            onOpenVTTLibrary={handleOpenVTTLibrary}
            onSignOut={handleSignOut}
            userEmail={user?.email}
          />
        </div>
      </header>

      {/* ── LEFT SIDEBAR ── */}
      <aside className="app-sidebar">
        <PartCategoryToolbar
          id="part-category-toolbar"
          registerElement={registerElement}
          onSelectCategory={handleEditCategory}
          activeCategory={activeCategory}
          onTorsoToggle={handleTorsoSubmenuToggle}
          getTorsoButtonRef={getTorsoButtonRef}
          isTorsoSubmenuExpanded={torsoSubmenuExpanded}
          onBeltToggle={handleBeltSubmenuToggle}
          getBeltButtonRef={getBeltButtonRef}
          isBeltSubmenuExpanded={beltSubmenuExpanded}
          onLowerBodyToggle={handleLowerBodySubmenuToggle}
          getLowerBodyButtonRef={getLowerBodyButtonRef}
          isLowerBodySubmenuExpanded={lowerBodySubmenuExpanded}
        />
      </aside>

      {/* ── RIGHT PANEL ── */}
      <div className={`app-panel ${isPanelOpen ? 'open' : ''}`}>
        {/* Close button shared header */}
        <div style={{ display: 'none', position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
          <button
            onClick={() => { setIsPanelOpen(false); setActiveSidePanel(null); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-muted)', fontSize: 18, lineHeight: 1,
            }}
          >✕</button>
        </div>

        <div className="app-panel-shell">
          <div className="app-panel-top">
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: 4 }}>
                Customizer
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>
                {{ parts: 'Parts', style: 'Style', skins: 'Skins', lights: 'Lights' }[activePanelMode]}
              </div>
              <div style={{ marginTop: 6, fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.35, color: 'var(--color-text-muted)', maxWidth: 230 }}>
                {{
                  parts: 'Swap hero parts and build the silhouette before refining materials.',
                  style: 'Adjust color and material behavior for each part or the whole build.',
                  skins: 'Apply curated looks quickly when you want a stronger preset direction.',
                  lights: 'Tune the display lighting to present the character more clearly.',
                }[activePanelMode]}
              </div>
            </div>
            <button
              onClick={() => { setIsPanelOpen(false); setActiveSidePanel(null); }}
              style={{
                width: 32,
                height: 32,
                flexShrink: 0,
                background: 'rgba(19, 19, 31, 0.92)',
                border: '1px solid rgba(71, 85, 105, 0.55)',
                borderRadius: 8,
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                fontSize: 16,
                lineHeight: 1,
              }}
              title="Close panel"
            >
              ×
            </button>
          </div>

          <div className="app-panel-tabs">
            {([
              ['parts', 'Parts'],
              ['style', 'Style'],
              ['skins', 'Skins'],
              ['lights', 'Lights'],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={`app-panel-tab ${activePanelMode === mode ? 'active' : ''}`}
                onClick={() => handlePanelModeChange(mode)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="app-panel-body">
            {activePanelMode === 'parts' && (
              <PartSelectorPanel
                activeCategory={activeCategory}
                selectedArchetype={selectedArchetype || ArchetypeId.STRONG}
                selectedParts={selectedParts}
                onPartSelect={handleSelectPart}
                onClose={handleCloseSelector}
                onPreviewChange={characterViewerRef.current?.handlePreviewPartsChange}
                id="part-selector-panel"
                registerElement={registerElement}
                characterViewerRef={characterViewerRef}
                ownedPartIds={ownedPartIds}
              />
            )}

            {activePanelMode === 'style' && (
              <StylePanel
                parts={stylePanelParts}
                activePart={activePanelPart}
                onPartSelect={setActivePanelPart}
                onColorChange={handleStylePanelColorChange}
                onMaterialChange={handleStylePanelMaterialChange}
                onApplyToAll={handleApplyToAll}
                onClose={() => { setActiveSidePanel(null); setIsPanelOpen(false); }}
                embedded
              />
            )}

            {activePanelMode === 'skins' && (
              <SkinsPanel apiRef={characterViewerRef} onClose={() => { setActiveSidePanel(null); setIsPanelOpen(false); }} />
            )}

            {activePanelMode === 'lights' && (
              <LightsPanel apiRef={characterViewerRef} onClose={() => { setActiveSidePanel(null); setIsPanelOpen(false); }} />
            )}
          </div>
        </div>

      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="app-bottom" style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
        {/* Pose navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button className="btn-comic btn-ghost" style={{ width: 30, height: 30, padding: 0, fontSize: 12, borderRadius: 6 }}
            onClick={handlePreviousPose}>◀</button>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, letterSpacing: 0.8, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            POSE {(currentPoseIndex ?? 0) + 1} / {savedPoses?.length ?? 1}
          </span>
          <button className="btn-comic btn-ghost" style={{ width: 30, height: 30, padding: 0, fontSize: 12, borderRadius: 6 }}
            onClick={handleNextPose}>▶</button>
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(71, 85, 105, 0.45)' }} />

        {/* View presets */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['FRONT', 'SIDE', '3/4', 'BACK'] as const).map((label, i) => {
            const angles = [0.5, 0.25, 0.375, 0];
            return (
              <button
                key={label}
                className="btn-comic btn-ghost"
                style={{ fontSize: 11, padding: '3px 10px', letterSpacing: 0.6, fontFamily: 'var(--font-body)', fontWeight: 700 }}
                onClick={() => (characterViewerRef.current as any)?.setViewAngle(angles[i])}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(71, 85, 105, 0.45)' }} />

        {/* Export */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            onClick={() => setShowSTLModal(true)}
            style={{ padding: '5px 12px', background: 'rgba(19,19,31,0.84)', border: '1px solid rgba(71, 85, 105, 0.56)', borderRadius: '6px', color: '#b8c0cc', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            🖨️ STL
          </button>
          <button
            type="button"
            onClick={handleOpenVTTLibrary}
            style={{ padding: '5px 12px', background: 'rgba(216, 162, 58, 0.08)', border: '1px solid rgba(216, 162, 58, 0.34)', borderRadius: '6px', color: 'var(--color-accent)', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            🎲 VTT
          </button>
          {user ? (
            <button
              type="button"
              onClick={handleSaveCurrentPoseAsNew}
              style={{ padding: '5px 12px', background: 'rgba(216, 162, 58, 0.08)', border: '1px dashed rgba(216, 162, 58, 0.34)', borderRadius: '6px', color: 'var(--color-accent)', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
              💾 POSE
            </button>
          ) : (
            <button
              type="button"
              style={{ padding: '5px 12px', background: 'rgba(216, 162, 58, 0.08)', border: '1px dashed rgba(216, 162, 58, 0.34)', borderRadius: '6px', color: 'var(--color-accent)', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
              title="Sign in to save poses"
            >
              💾 POSES
            </button>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {isResetPasswordOpen && (
        <ResetPasswordModal onClose={() => setIsResetPasswordOpen(false)} />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      )}

      {isWelcomeScreenOpen && (
        <WelcomeScreen
          isOpen={isWelcomeScreenOpen}
          userEmail={user?.email ?? ''}
          onClose={() => setIsWelcomeScreenOpen(false)}
          onOpenLibrary={() => {
            setIsWelcomeScreenOpen(false);
            setActiveRightPanel('library');
          }}
        />
      )}

      {isSignUpModalOpen && (
        <SimpleSignUpModal 
          isOpen={isSignUpModalOpen} 
          onClose={handleCloseSignUpModal}
          onSignInSuccess={handleSignInSuccess}
        />
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

      {/* Submenú del Upper Body - Renderizado en un nivel superior */}
              {/* Removed debug log */}
      <TorsoSubmenu
        onSelectCategory={handleEditCategory}
        activeCategory={activeCategory}
        isExpanded={torsoSubmenuExpanded}
        onToggle={handleTorsoSubmenuToggle}
        submenuPosition={submenuPosition} // Pasar la posición calculada
      />

      {/* Submenú del Belt - Renderizado en un nivel superior */}
              {/* Removed debug log */}
      <BeltSubmenu
        onSelectCategory={handleEditCategory}
        activeCategory={activeCategory}
        isExpanded={beltSubmenuExpanded}
        onToggle={handleBeltSubmenuToggle}
        submenuPosition={beltSubmenuPosition}
      />

      {/* Submenú de Legs - Renderizado en un nivel superior */}
              {/* Removed debug log */}
      <LowerBodySubmenu
        onSelectCategory={handleEditCategory}
        activeCategory={activeCategory}
        isExpanded={lowerBodySubmenuExpanded}
        onToggle={handleLowerBodySubmenuToggle}
        submenuPosition={lowerBodySubmenuPosition}
        characterViewerRef={characterViewerRef} // Pass ref
        selectedArchetype={selectedArchetype || ArchetypeId.STRONG} // Pass selectedArchetype
        onPartHover={handlePartHover} // Pass hover handler
        onPartUnhover={handlePartUnhover} // Pass unhover handler
      />



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
        onAuthRequired={handleOpenAuthModal}
        ownedPartIds={ownedPartIds}
        ownedPartIdsLoading={ownedPartIdsLoading}
      />

             {isPurchaseConfirmationOpen && purchaseData && (
         <PurchaseConfirmation
           isOpen={isPurchaseConfirmationOpen}
           onClose={handleClosePurchaseConfirmation}
           purchasedParts={purchaseData.parts}
           modelName={purchaseData.modelName}
           onModelNameChange={setCharacterName}
           archetypeId={purchaseData.archetypeId}
           onExportGLB={handleExportGLB}
           onOpenLibrary={() => {
             setIsPurchaseConfirmationOpen(false);
             setPurchaseData(null);
             setIsPurchaseLibraryOpen(true);
           }}
         />
       )}

       {/* Biblioteca de Compras */}
       {isPurchaseLibraryOpen && (
         <PurchaseLibrary
           isOpen={isPurchaseLibraryOpen}
           onClose={handleClosePurchaseLibrary}
           onLoadConfiguration={handleLoadConfiguration}
           user={user}
           onExportGLB={handleExportGLB}
           onExportSTL={handleExportSTL}
        />
      )}

      {/* Modal de Email para Usuarios Invitados */}
      {isGuestEmailModalOpen && guestEmailData && (
        <GuestEmailModal
          isOpen={isGuestEmailModalOpen}
          onClose={handleCloseGuestEmailModal}
          onEmailSubmitted={handleGuestEmailSubmitted}
          totalPrice={guestEmailData.totalPrice}
        />
      )}

      {/* STL Scale Modal */}
      {showSTLModal && (
        <STLScaleModal
          onConfirm={handleExportSTLWithScale}
          onCancel={() => setShowSTLModal(false)}
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
        onLoadToCustomizer={handleLoadRPGCharacterToCustomizer}
      />
      {isRPGSheetOpen && lastLoadedRPGCharacter && (
        <>

          <button
            style={{ position: 'fixed', top: 180, right: 40, zIndex: 9999, background: '#e53935', color: '#fff', fontWeight: 'bold', padding: '12px 24px', borderRadius: 8, boxShadow: '0 2px 8px #0004', border: 'none', cursor: 'pointer' }}
            onClick={() => {
              const saved = localStorage.getItem('rpg-characters');
              if (saved) {
                const characters = JSON.parse(saved);
                const filtered = characters.filter((c: any) => c.id !== lastLoadedRPGCharacter.id);
                localStorage.setItem('rpg-characters', JSON.stringify(filtered));
                setLastLoadedRPGCharacter(null);
                window.location.reload(); // Refreshes the list
              }
            }}
          >
            Borrar Ficha
          </button>
        </>
      )}

      {/* Modal VTT */}
      {isVTTModalOpen && rpgCharacter && (
        <VTTExportModal
          isOpen={isVTTModalOpen}
          onClose={handleCloseVTTModal}
          character={rpgCharacter}
          onExportToken={(format, size) => {
            // no-op
          }}
          characterViewerRef={characterViewerRef}
        />
      )}

      {/* Panel lateral derecho — pestañas + panel unificado */}
      <div style={{ position: 'fixed', right: 0, top: 128, zIndex: 60, display: 'flex', alignItems: 'flex-start' }}>
        {/* Panel content — mismo tamaño para todos */}
        {activeRightPanel && (
          <div style={{ width: 320, maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto', background: 'var(--color-surface, #0f172a)', border: '1px solid var(--color-border, #334155)', borderRight: 'none' }}>
            {activeRightPanel === 'stats' && (
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-0 shadow-none rounded-none">
                <RPGCharacterSheet
                  selectedArchetype={selectedArchetype}
                  selectedParts={selectedParts}
                  onCharacterUpdate={handleRPGCharacterUpdate}
                />
              </Card>
            )}
            {activeRightPanel === 'style' && (
              <StylePanel
                parts={stylePanelParts}
                activePart={activePanelPart}
                onPartSelect={setActivePanelPart}
                onColorChange={handleStylePanelColorChange}
                onMaterialChange={handleStylePanelMaterialChange}
                onApplyToAll={handleApplyToAll}
                onClose={() => setActiveRightPanel(null)}
              />
            )}
            {activeRightPanel === 'skins' && (
              <SkinsPanel apiRef={characterViewerRef} onClose={() => setActiveRightPanel(null)} />
            )}
            {activeRightPanel === 'library' && (
              <PurchaseLibrary
                isOpen={true}
                user={user}
                onLoadConfiguration={handleLoadConfiguration}
                onClose={() => setActiveRightPanel(null)}
              />
            )}
          </div>
        )}

        {/* Columna de pestañas — siempre visible */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {(['stats', 'style', 'skins'] as const).map(key => (
            <button
              key={key}
              onClick={() => toggleRightPanel(key)}
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                background: activeRightPanel === key ? 'var(--color-accent, #f59e0b)' : 'var(--color-surface-2, #1e293b)',
                border: '1px solid var(--color-border, #334155)',
                borderRight: 'none',
                color: activeRightPanel === key ? '#000' : 'var(--color-accent, #f59e0b)',
                fontFamily: 'var(--font-comic, Bangers, sans-serif)',
                fontSize: '13px',
                letterSpacing: '0.1em',
                padding: '10px 6px',
                cursor: 'pointer',
                borderRadius: '4px 0 0 4px',
                userSelect: 'none',
              }}
            >{key.toUpperCase()}</button>
          ))}
          {/* LIBRARY tab — auth-conditional */}
          <button
            onClick={() => {
              if (!user) {
                setAuthModalMode('signup');
                setIsAuthModalOpen(true);
              } else {
                setActiveRightPanel(p => p === 'library' ? null : 'library');
              }
            }}
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              background: activeRightPanel === 'library' ? 'var(--color-accent, #f59e0b)' : 'var(--color-surface-2, #1e293b)',
              border: !user ? '1px dashed var(--color-accent, #f59e0b)' : '1px solid var(--color-border, #334155)',
              borderRight: 'none',
              color: activeRightPanel === 'library' ? '#000' : 'var(--color-accent, #f59e0b)',
              fontFamily: 'var(--font-comic, Bangers, sans-serif)',
              fontSize: '13px',
              letterSpacing: '0.1em',
              padding: '10px 6px',
              cursor: 'pointer',
              borderRadius: '4px 0 0 4px',
              userSelect: 'none',
              opacity: !user ? 0.7 : 1,
            }}
            title={!user ? 'Sign in to access your Library' : 'Library'}
          >
            LIBRARY
          </button>
        </div>
      </div>

      {/* Panel de Debug - Solo visible en desarrollo */}
      {import.meta.env.DEV && (
        <PartsDebugPanel 
          selectedParts={selectedParts}
          isVisible={isDebugPanelVisible}
        />
      )}

      {/* Botón para mostrar/ocultar panel de debug */}
      {import.meta.env.DEV && (
        <button
          onClick={() => setIsDebugPanelVisible(!isDebugPanelVisible)}
          className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold"
          title="Toggle Debug Panel"
        >
          {isDebugPanelVisible ? '🔴' : '🔍'} Debug
        </button>
      )}

    </div>
  );
};

const App: React.FC = () => (
    <AppContent />
);

export default App;





