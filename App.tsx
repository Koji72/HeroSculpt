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
import { useFavorites } from './hooks/useFavorites';
import { useRecentParts } from './hooks/useRecentParts';
import { assignDefaultHandsForTorso, assignAdaptiveHeadForTorso, assignAdaptiveCapeForTorso, assignAdaptiveBootsForTorso, assignAdaptiveSymbolForTorso, assignAdaptiveSuitTorsoForTorso, getCategoryI18nKey } from './lib/utils';
import { ARCHETYPE_DATA, ARCHETYPES_LIST } from './lib/archetypeData';
import ArchetypeSwitcher from './components/ArchetypeSwitcher';
import STLScaleModal from './components/STLScaleModal';
import StylePanel, { type PartEntry, type MaterialType } from './components/StylePanel';
import { SessionStorageService } from './services/sessionStorageService';
import { useLang, t } from './lib/i18n';

import { modelCache } from './lib/modelCache';
import ErrorBoundary from './components/ErrorBoundary';

import { PurchaseHistoryService } from './services/purchaseHistoryService';
import { ResendEmailService } from './services/resendEmailService';
import { UserConfigService } from './services/userConfigService';
import { notificationService } from './services/notificationService';
import { Card } from "./components/ui/card";
import HeaderDropdown from './components/HeaderDropdown';
import SkinsPanel from './components/materials/SkinsPanel';
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
import { STRONG_CHEST_BELT_PARTS } from './src/parts/strongChestBeltParts';
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

const CATEGORY_TO_STYLE_PART: Record<string, string> = {
  TORSO: 'torso', SUIT_TORSO: 'torso', LOWER_BODY: 'legs', HEAD: 'head',
  HAND_LEFT: 'hand_left', HAND_RIGHT: 'hand_right',
  CAPE: 'cape', BOOTS: 'boots', BELT: 'belt', CHEST_BELT: 'belt',
};

const STYLE_PART_LABELS: Record<string, string> = {
  torso: 'TORSO', legs: 'LEGS', head: 'HEAD', hand_left: 'L.HAND',
  hand_right: 'R.HAND', cape: 'CAPE', boots: 'BOOTS', belt: 'BELT',
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
  const { lang, setLang } = useLang();
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(ArchetypeId.STRONG);
  // ✅ CRITICAL FIX: GET AUTH FIRST
  const { isAuthenticated, loading, signOut, user, isPasswordRecovery, clearPasswordRecovery } = useAuth();
  const { favorites: favoriteIds, toggleFavorite } = useFavorites();
  const { recordUsed, getRecent } = useRecentParts();

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
  const isResetPasswordOpen = isPasswordRecovery;
  const [isWelcomeScreenOpen, setIsWelcomeScreenOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  const [sessionInfo, setSessionInfo] = useState<{ hasSession: boolean; lastSaved?: string; source?: 'supabase' | 'localStorage' }>({ hasSession: false });
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSavingLastPose, setIsSavingLastPose] = useState(false);
  const [characterName, setCharacterName] = useState<string>("My Hero");
  const [rpgCharacter, setRpgCharacter] = useState<RPGCharacterSync | null>(null);

  // Estados del carrito de compras
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('herosculpt_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [ownedPartIds, setOwnedPartIds] = useState<Set<string>>(new Set());
  const [ownedPartIdsLoading, setOwnedPartIdsLoading] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('herosculpt_cart', JSON.stringify(cartItems)); } catch {}
  }, [cartItems]);

  // Estado para confirmación de compra
  const [isPurchaseConfirmationOpen, setIsPurchaseConfirmationOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{
    parts: Part[];
    modelName: string;
    archetypeId: ArchetypeId;
  } | null>(null);

  // Estado para biblioteca de compras
  const [isPurchaseLibraryOpen, setIsPurchaseLibraryOpen] = useState(false);
  const [libraryRefreshKey, setLibraryRefreshKey] = useState(0);

  // Estado para modal de email de invitado
  const [isGuestEmailModalOpen, setIsGuestEmailModalOpen] = useState(false);
  const [guestEmailData, setGuestEmailData] = useState<{
    cartItems: CartItem[];
    totalPrice: number;
  } | null>(null);

  // Ref (not state) so the updateCurrentPoseConfiguration effect can synchronously
  // read the true current value. useState would batch true→false in one render,
  // meaning the effect would never see the flag as true.
  const isNavigatingPosesRef = useRef(false);

  // Estado para hojas de personaje RPG
  const [isRPGSheetOpen, setIsRPGSheetOpen] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<'stats' | 'library' | null>('stats');
  const toggleRightPanel = (panel: 'stats' | 'library') => {
    setActiveRightPanel(p => p === panel ? null : panel);
  };

  const [showShortcutsOverlay, setShowShortcutsOverlay] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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
  const [activeSidePanel, setActiveSidePanel] = useState<'style' | 'skins' | null>(null);
  const activePanelMode: 'parts' | 'style' | 'skins' = activeSidePanel ?? 'parts';

  const [stylePanelParts, setStylePanelParts] = useState<PartEntry[]>(
    Object.keys(STYLE_PART_LABELS).map((id) => ({
      id,
      label: STYLE_PART_LABELS[id],
      color: '#9ca3af',
      material: 'FABRIC' as MaterialType,
    }))
  );
  // Ref mirrors stylePanelParts so handlers always read the latest color/material
  // without waiting for a React state flush (avoids stale-closure race on APPLY).
  const stylePanelPartsRef = useRef<PartEntry[]>(stylePanelParts);
  const [activePanelPart, setActivePanelPart] = useState('torso');

  // Submenu positions are calculated inline in toggle handlers to avoid flicker



  // ✨ MANEJADOR DEL TOGGLE DEL SUBMENÚ DEL UPPER BODY
  const handleTorsoSubmenuToggle = useCallback(() => {
    const upperCats = [PartCategory.TORSO, PartCategory.SUIT_TORSO, PartCategory.HEAD,
      PartCategory.CAPE, PartCategory.SYMBOL, PartCategory.CHEST_BELT,
      PartCategory.SHOULDERS, PartCategory.FOREARMS, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT];
    setBeltSubmenuExpanded(false);
    setLowerBodySubmenuExpanded(false);
    setTorsoSubmenuExpanded(false);
    const cat = upperCats.includes(activeCategory as PartCategory) ? activeCategory as PartCategory : PartCategory.TORSO;
    setActiveCategory(cat);
    setActiveTab('parts');
    setIsPanelOpen(true);
    setActiveSidePanel(null);
  }, [activeCategory]);

  // Función para obtener la referencia del botón Upper Body desde el PartCategoryToolbar
  const getTorsoButtonRef = useCallback((ref: HTMLButtonElement | null) => {
    torsoButtonRef.current = ref;
  }, []);

  const handleBeltSubmenuToggle = useCallback(() => {
    const beltCats = [PartCategory.BELT, PartCategory.POUCH, PartCategory.BUCKLE];
    setTorsoSubmenuExpanded(false);
    setBeltSubmenuExpanded(false);
    setLowerBodySubmenuExpanded(false);
    const cat = beltCats.includes(activeCategory as PartCategory) ? activeCategory as PartCategory : PartCategory.BELT;
    setActiveCategory(cat);
    setActiveTab('parts');
    setIsPanelOpen(true);
    setActiveSidePanel(null);
  }, [activeCategory]);

  // Función para obtener la referencia del botón Belt desde el PartCategoryToolbar
  const getBeltButtonRef = useCallback((ref: HTMLButtonElement | null) => {
    beltButtonRef.current = ref;
  }, []);

  // ✨ MANEJADOR DEL TOGGLE DEL SUBMENÚ DEL LOWER BODY
  const handleLowerBodySubmenuToggle = useCallback(() => {
    const lowerCats = [PartCategory.LOWER_BODY, PartCategory.BOOTS];
    setTorsoSubmenuExpanded(false);
    setBeltSubmenuExpanded(false);
    setLowerBodySubmenuExpanded(false);
    const cat = lowerCats.includes(activeCategory as PartCategory) ? activeCategory as PartCategory : PartCategory.LOWER_BODY;
    setActiveCategory(cat);
    setActiveTab('parts');
    setIsPanelOpen(true);
    setActiveSidePanel(null);
  }, [activeCategory]);

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

      const configurations = await UserConfigService.getUserConfigurations();

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
        const lastPoseIndex = allPoses.length - 1;
        const latestPose = allPoses[lastPoseIndex];
        setSavedPoses(allPoses);
        setCurrentPoseIndex(lastPoseIndex);
        setSelectedParts(prev => {
          if (Object.keys(prev).length > 0) return prev;
          return latestPose.configuration;
        });
        setCharacterName(latestPose.name);
      } else {
        setSavedPoses([]);
        setCurrentPoseIndex(0);
        setSelectedParts(prev => {
          if (Object.keys(prev).length > 0) return prev;
          return DEFAULT_STRONG_BUILD;
        });
        setCharacterName('New Hero');
      }

      return allPoses;

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
    let active = true;
    setOwnedPartIdsLoading(true);
    PurchaseHistoryService.getOwnedPartIds(user.id)
      .then(ids => { if (active) setOwnedPartIds(ids); })
      .finally(() => { if (active) setOwnedPartIdsLoading(false); });
    return () => { active = false; };
  }, [user?.id]);

  // Empty function for components that expect registerElement (tutorial functionality removed)
  const registerElement = (/*id: string, element: HTMLElement | null*/) => {};

  const characterViewerRef = useRef<CharacterViewerRef>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const archetypeLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ FIXED: handleResetToDefaultBuild - Use proper build based on authentication status
  const handleResetToDefaultBuild = useCallback(() => {

    
    // Clear any preview state first
    if (characterViewerRef.current?.clearPreview) {
      characterViewerRef.current.clearPreview();
    }
    
    // ✅ CRITICAL FIX: Usar el estado correcto según autenticación
    if (!isAuthenticated) {
      pushPartsHistory(GUEST_USER_BUILD);
      setGuestSelectedParts(GUEST_USER_BUILD);
    } else {
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
      pushPartsHistory(defaultBuild);
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

  const handleResetCamera = useCallback(() => {
    if (characterViewerRef.current?.resetCamera) {
      characterViewerRef.current.resetCamera();
    }
  }, []);

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
      // Category shortcuts: 1=Upper, 2=Belt, 3=Lower
      if (event.key === '1') { event.preventDefault(); handleTorsoSubmenuToggle(); }
      if (event.key === '2') { event.preventDefault(); handleBeltSubmenuToggle(); }
      if (event.key === '3') { event.preventDefault(); handleLowerBodySubmenuToggle(); }
      if (event.key === '?') { event.preventDefault(); setShowShortcutsOverlay(v => !v); }
      if (event.key === 'Escape') {
        setShowShortcutsOverlay(false);
        setTorsoSubmenuExpanded(false);
        setBeltSubmenuExpanded(false);
        setLowerBodySubmenuExpanded(false);
        setIsPanelOpen(false);
        setActiveCategory(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleUndo, handleRedo, handleResetCamera, handleTorsoSubmenuToggle, handleBeltSubmenuToggle, handleLowerBodySubmenuToggle]);

  // Close submenus when clicking outside the sidebar or submenus
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const sidebar = document.getElementById('category-toolbar')?.closest('.app-sidebar');
      if (sidebar && sidebar.contains(target)) return;
      // Don't close if click is inside a submenu panel itself
      const submenus = document.querySelectorAll('[data-submenu]');
      for (const sm of Array.from(submenus)) {
        if (sm.contains(target)) return;
      }
      setTorsoSubmenuExpanded(false);
      setBeltSubmenuExpanded(false);
      setLowerBodySubmenuExpanded(false);
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  // Load build from URL ?build= param — wait for auth to resolve first
  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('build');
    if (!encoded) return;
    try {
      const payload = JSON.parse(atob(encoded)) as { a: string; p: Record<string, string> };
      if (payload.a) setSelectedArchetype(payload.a as ArchetypeId);
      if (payload.p) {
        const parts: SelectedParts = {};
        Object.entries(payload.p).forEach(([cat, id]) => {
          const found = ALL_PARTS.find(p => p.id === id);
          if (found) parts[cat as PartCategory] = found;
        });
        if (Object.keys(parts).length > 0) {
          setSelectedParts(parts);
        }
      }
      // Clean URL without reload
      window.history.replaceState(null, '', window.location.pathname);
    } catch {}
  }, [loading, setSelectedParts]);

  // Save última pose cuando el usuario salga de la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (selectedArchetype && savedPoses.length > 0) {
        SessionStorageService.saveLastPose(
          selectedArchetype,
          selectedParts,
          currentPoseIndex,
          savedPoses
        );
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
      if (isAuthenticated && user?.id) {
        notificationService.setupRealtimeSubscriptions(user.id);

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
      } else if (!isAuthenticated) {
        notificationService.unsubscribe();
      }
    };
    loadSessionOnAuthChange();
  }, [isAuthenticated, user?.id, loadUserPoses]);

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
    if (isNavigatingPosesRef.current) {
      return;
    }

    const updateCurrentPoseConfiguration = async () => {
      let shouldUpdateDB = false;
      let poseId: string | undefined;
      let poseName: string | undefined;

      setSavedPoses(prev => {
        if (prev.length === 0 || currentPoseIndex < 0 || currentPoseIndex >= prev.length) return prev;
        const currentPose = prev[currentPoseIndex];
        const configChanged = JSON.stringify(currentPose.configuration) !== JSON.stringify(selectedParts);
        if (!configChanged) return prev;
        shouldUpdateDB = currentPose.source === 'saved';
        poseId = currentPose.id;
        poseName = currentPose.name;
        const newPoses = [...prev];
        newPoses[currentPoseIndex] = { ...newPoses[currentPoseIndex], configuration: selectedParts };
        return newPoses;
      });

      if (shouldUpdateDB && user?.id && poseId && poseName) {
        try {
          const configId = poseId.replace('saved-', '');
          await UserConfigService.updateConfiguration(configId, { name: poseName, selected_parts: selectedParts });
        } catch (error) {
          // Removed debug log
        }
      }
    };

    // Actualizar con un delay para evitar demasiadas actualizaciones (delay aumentado)
    const timeoutId = setTimeout(updateCurrentPoseConfiguration, 800);
    return () => clearTimeout(timeoutId);
  }, [selectedParts, currentPoseIndex, user?.id]);

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
              const exportTid = setTimeout(() => {
                handleExportGLB();
                alert('Your 3D model is downloading! 📥');
                window.history.replaceState({}, document.title, window.location.pathname);
              }, 2000);
              return () => clearTimeout(exportTid);
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
    setCharacterName(t('topbar.heroplaceholder', lang));
  };

  // Task 6: ArchetypeSwitcher handler
  const handleArchetypeSelect = (id: string) => {
    setSelectedArchetype(id as ArchetypeId);
    if (isAuthenticated) {
      setUserSelectedParts({});
    } else {
      setGuestSelectedParts(GUEST_USER_BUILD);
    }
    setActiveCategory(null);
    setIsPanelOpen(false);
    setArchetypeLoading(true);
    setCharacterViewerKey((k: number) => k + 1);
    if (archetypeLoadingTimerRef.current !== null) clearTimeout(archetypeLoadingTimerRef.current);
    archetypeLoadingTimerRef.current = setTimeout(() => setArchetypeLoading(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (archetypeLoadingTimerRef.current !== null) clearTimeout(archetypeLoadingTimerRef.current);
    };
  }, []);

  const handleSidePanelToggle = (panel: 'style' | 'skins') => {
    handlePanelModeChange(panel);
  };

  const handlePanelModeChange = (mode: 'parts' | 'style' | 'skins') => {
    characterViewerRef.current?.clearPreview();
    setIsPanelOpen(true);
    if (mode === 'parts') {
      setActiveSidePanel(null);
      setActiveTab('parts');
      return;
    }
    if (mode === 'style' && activeCategory) {
      const mapped = CATEGORY_TO_STYLE_PART[activeCategory];
      if (mapped) setActivePanelPart(mapped);
    }
    setActiveSidePanel(mode);
  };

  // Task 7: StylePanel handlers
  const handleStylePanelColorChange = (partId: string, color: string) => {
    const next = stylePanelPartsRef.current.map((p) => p.id === partId ? { ...p, color } : p);
    stylePanelPartsRef.current = next;
    setStylePanelParts(next);
    const category = STYLE_PART_TO_CATEGORY[partId];
    if (category && characterViewerRef.current) {
      characterViewerRef.current.applyColorToPart(parseInt(color.replace('#', ''), 16), category);
    }
  };

  const handleStylePanelMaterialChange = (partId: string, material: MaterialType) => {
    // Read from ref so we always get the latest color even when called synchronously
    // after handleStylePanelColorChange (React state update may not have flushed yet).
    const currentColor = stylePanelPartsRef.current.find((p) => p.id === partId)?.color ?? '#9ca3af';
    const next = stylePanelPartsRef.current.map((p) => p.id === partId ? { ...p, material } : p);
    stylePanelPartsRef.current = next;
    setStylePanelParts(next);
    const category = STYLE_PART_TO_CATEGORY[partId];
    if (category && characterViewerRef.current) {
      const mat = buildThreeMaterial(material, parseInt(currentColor.replace('#', ''), 16));
      characterViewerRef.current.applyMaterialToPart(mat, category);
    }
  };

  const handleApplyToAll = (color: string, material: MaterialType) => {
    const next = stylePanelPartsRef.current.map((p) => ({ ...p, color, material }));
    stylePanelPartsRef.current = next;
    setStylePanelParts(next);
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
    pushPartsHistory(parts);
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
    // Record recently used per category
    Object.values(newSelectedParts).forEach(part => {
      if (part && !part.attributes?.none) recordUsed(part.category, part.id);
    });
    return true;
  }, [setSelectedParts, pushPartsHistory, recordUsed]);

  // Stable callback that delegates to the viewer ref — avoids passing
  // characterViewerRef.current?.handlePreviewPartsChange directly as a prop,
  // which would be undefined on the first render and never update.
  const handlePreviewChange = useCallback((parts: SelectedParts) => {
    characterViewerRef.current?.handlePreviewPartsChange(parts);
  }, []);

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

  const handleScreenshot = async () => {
    if (!characterViewerRef.current?.takeScreenshot) return;
    try {
      const dataUrl = await characterViewerRef.current.takeScreenshot();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${characterName || 'hero'}-screenshot.png`;
      a.click();
    } catch {}
  };

  const handleShareBuild = () => {
    const payload = {
      a: selectedArchetype ?? ArchetypeId.STRONG,
      p: Object.fromEntries(
        Object.entries(selectedParts)
          .filter(([, part]) => part && !part.attributes?.none)
          .map(([cat, part]) => [cat, part!.id])
      ),
    };
    const encoded = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}?build=${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  const handleRandomize = () => {
    const archetype = selectedArchetype ?? ArchetypeId.STRONG;
    const ap = ALL_PARTS.filter((p) => p.archetype === archetype);

    const pick = (category: PartCategory, anchorId?: string, excludeId?: string, filter?: (p: Part) => boolean): Part | undefined => {
      const pool = ap.filter((p) => {
        if (p.category !== category) return false;
        if (excludeId && p.id === excludeId) return false;
        if (filter && !filter(p)) return false;
        if (!anchorId) return true;
        return p.compatible.length === 0 || p.compatible.includes(anchorId);
      });
      if (pool.length === 0) return undefined;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    // For random builds, avoid "blank" variants that look like missing parts.
    // Falls back to full pool if no non-blank variant exists for the torso.
    const categoryFilters: Partial<Record<PartCategory, (p: Part) => boolean>> = {
      [PartCategory.SYMBOL]: (p) => !p.id.endsWith('_ns'),
      [PartCategory.HAND_LEFT]: (p) => !p.id.includes('noweapon'),
      [PartCategory.HAND_RIGHT]: (p) => !p.id.includes('noweapon'),
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
           PartCategory.SUIT_TORSO,
        ] as PartCategory[]).reduce((acc, cat) => {
          const catFilter = categoryFilters[cat];
          const p = (catFilter ? pick(cat, torsoId, undefined, catFilter) : undefined) ?? pick(cat, torsoId);
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
          const p = pick(PartCategory.POUCH);
          return p ? { [PartCategory.POUCH]: p } : {};
        })() : {}),
      ...(Math.random() > 0.5 ? (() => {
          const p = pick(PartCategory.BUCKLE);
          return p ? { [PartCategory.BUCKLE]: p } : {};
        })() : {}),
      ...(Math.random() > 0.5 ? (() => {
          const p = pick(PartCategory.BACKPACK);
          return p ? { [PartCategory.BACKPACK]: p } : {};
        })() : {}),
    };

    pushPartsHistory(result);
    setSelectedParts(result);
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
        setLibraryRefreshKey(prev => prev + 1);

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

    isNavigatingPosesRef.current = true;

    const newIndex = currentPoseIndex > 0 ? currentPoseIndex - 1 : savedPoses.length - 1;

    setCurrentPoseIndex(newIndex);

    const newPose = savedPoses[newIndex];

    pushPartsHistory(newPose.configuration);
    setSelectedParts(newPose.configuration);

    isNavigatingPosesRef.current = false;
  };

  const handleNextPose = () => {
    if (savedPoses.length === 0) {
      return;
    }

    isNavigatingPosesRef.current = true;

    const newIndex = currentPoseIndex < savedPoses.length - 1 ? currentPoseIndex + 1 : 0;

    setCurrentPoseIndex(newIndex);

    const newPose = savedPoses[newIndex];

    pushPartsHistory(newPose.configuration);
    setSelectedParts(newPose.configuration);

    isNavigatingPosesRef.current = false;
  };

  const handleSelectPose = (index: number) => {
    if (index < 0 || index >= savedPoses.length) {
      return;
    }

    isNavigatingPosesRef.current = true;

    const newPose = savedPoses[index];
    setCurrentPoseIndex(index);
    // Reset lastSelectedPartsRef so CharacterViewer always reloads the target
    // pose even if its parts happen to equal the current selection.
    characterViewerRef.current?.resetState();
    pushPartsHistory(newPose.configuration);
    setSelectedParts(newPose.configuration);

    isNavigatingPosesRef.current = false;
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
    if (!pose) return;

    if (pose.source === 'saved') {
      const configId = pose.id.replace(/^saved-/, '');
      const success = await UserConfigService.deleteConfiguration(configId);
      if (!success) return;
    }
    // Purchase poses: just remove from the slider (purchase record stays in DB)

    const newPoses = savedPoses.filter((_, i) => i !== index);
    const newIndex = newPoses.length === 0 ? 0 : index > 0 ? index - 1 : 0;

    setSavedPoses(newPoses);
    setCurrentPoseIndex(newIndex);

    if (newPoses.length === 0) {
      setSelectedParts({});
    } else {
      setSelectedParts(newPoses[newIndex].configuration);
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
        
        const newPoses = await loadUserPoses();
        setCurrentPoseIndex((newPoses?.length ?? 1) - 1);
        
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

        // Chest belt: preserve if compatible with the current torso, otherwise find matching variant
        const currentChestBelt = prevParts[PartCategory.CHEST_BELT];
        if (currentChestBelt && currentChestBelt.compatible.length > 0 && !currentChestBelt.compatible.includes(effectiveTorso.id)) {
          const compatible = STRONG_CHEST_BELT_PARTS.filter(b => b.compatible.includes(effectiveTorso.id));
          if (compatible.length > 0) {
            const isNp = currentChestBelt.id.endsWith('_np');
            newParts[PartCategory.CHEST_BELT] = compatible.find(b => isNp ? b.id.endsWith('_np') : !b.id.endsWith('_np')) || compatible[0];
          } else {
            delete newParts[PartCategory.CHEST_BELT];
          }
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
              {t('loading', lang)}
            </div>
          </div>
        )}
      </div>

      {/* ── TOPBAR ── */}
      <header className="app-topbar">
        {/* Logo block */}
        <div style={{
          flexShrink: 0,
          borderRight: '1px solid rgba(216,162,58,0.25)',
          width: 200,
          height: 80,
          overflow: 'hidden',
        }}>
          <img
            src="/logo.png"
            alt="What If Superheroes"
            style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', display: 'block' }}
          />
        </div>

        {/* Archetype Switcher */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', padding: '0 12px', overflow: 'visible' }}>
          <ArchetypeSwitcher
            archetypes={ARCHETYPES_LIST}
            activeArchetypeId={selectedArchetype ?? ArchetypeId.STRONG}
            hasUnsavedParts={Object.keys(selectedParts).length > 0}
            onSelect={handleArchetypeSelect}
          />
        </div>

        {/* 3-step flow indicator */}
        {(() => {
          const partCount = Object.values(selectedParts).filter(p => p && !p.attributes?.none).length;
          const activeStep = partCount >= 3 ? 3 : 2;
          const steps: Array<{ n: number; label: string }> = [
            { n: 1, label: t('steps.archetype', lang) },
            { n: 2, label: t('steps.build', lang) },
            { n: 3, label: t('steps.export', lang) },
          ];
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0, padding: '0 16px' }}>
              {steps.map((step, i) => (
                <React.Fragment key={step.n}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: step.n <= activeStep ? 'var(--color-accent)' : 'rgba(71,85,105,0.5)',
                      color: step.n <= activeStep ? '#09090f' : 'rgba(148,163,184,0.6)',
                      fontSize: 10, fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-body)',
                      flexShrink: 0,
                      boxShadow: step.n === activeStep ? '0 0 8px rgba(216,162,58,0.6)' : 'none',
                      animation: step.n === activeStep ? 'stepPulse 2s ease-in-out infinite' : 'none',
                    }}>
                      {step.n < activeStep ? '✓' : step.n}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1,
                      color: step.n === activeStep ? 'var(--color-accent)' : step.n < activeStep ? 'rgba(148,163,184,0.7)' : 'rgba(71,85,105,0.6)',
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

        {/* Hero name — inline editable */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, padding: '0 12px', borderLeft: '1px solid rgba(71,85,105,0.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: 'rgba(148,163,184,0.6)', textTransform: 'uppercase' }}>
              {t('topbar.heroplaceholder', lang)}
            </span>
            <input
              type="text"
              value={characterName}
              onChange={e => setCharacterName(e.target.value)}
              onBlur={e => { if (!e.target.value.trim()) setCharacterName(t('topbar.heroplaceholder', lang)); }}
              maxLength={28}
              placeholder="..."
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(216,162,58,0.5)',
                borderRadius: 0,
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-comic)',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: '0 2px 2px',
                outline: 'none',
                width: 180,
              }}
              onFocus={e => e.target.select()}
            />
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 14px', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            title={lang === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
            style={{ fontSize: '11px', padding: '4px 9px', background: 'rgba(19,19,31,0.7)', border: '1px solid rgba(71,85,105,0.5)', borderRadius: 6, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)', fontWeight: 700, letterSpacing: 0.5, cursor: 'pointer', flexShrink: 0 }}
          >
            {lang === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}
          </button>
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
            title={t('topbar.random', lang)}
            style={{ fontSize: '13px', padding: '5px 12px' }}
            onClick={handleRandomize}
          >
            {t('topbar.random', lang)}
          </button>
          <button
            className="btn-comic btn-outline"
            title={t('topbar.share', lang)}
            style={{ fontSize: '13px', padding: '5px 12px', transition: 'background 0.2s', background: shareCopied ? 'rgba(34,197,94,0.15)' : undefined, borderColor: shareCopied ? 'rgba(34,197,94,0.5)' : undefined, color: shareCopied ? '#22c55e' : undefined }}
            onClick={handleShareBuild}
          >
            {shareCopied ? t('topbar.copied', lang) : t('topbar.share', lang)}
          </button>
          {(() => {
            const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            return (
              <button
                className="btn-comic btn-primary"
                style={{ fontSize: '14px', padding: '5px 16px', position: 'relative' }}
                onClick={handleOpenCart}
              >
                {cartCount > 0 ? t('topbar.checkout', lang) : t('topbar.mybuild', lang)}
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -4, right: -4,
                    background: 'var(--color-danger)', color: '#fff',
                    fontSize: '9px', fontWeight: 700,
                    width: 14, height: 14, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            );
          })()}
          {!user && (
            <button
              className="btn-comic btn-primary"
              style={{ fontSize: '13px', padding: '5px 14px', background: 'var(--color-accent)', color: '#09090f', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)', fontWeight: 900, letterSpacing: 0.8, cursor: 'pointer' }}
              onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
              title="Crea una cuenta gratis para guardar tu héroe"
            >
              {t('topbar.savehero', lang)}
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
        {(() => {
          const arch = selectedArchetype || ArchetypeId.STRONG;
          const archParts = ALL_PARTS.filter(p => p.archetype === arch && !p.attributes?.none);
          const upperCats = new Set([PartCategory.TORSO, PartCategory.HEAD, PartCategory.SUIT_TORSO, PartCategory.CAPE, PartCategory.SYMBOL, PartCategory.CHEST_BELT, PartCategory.SHOULDERS, PartCategory.FOREARMS, PartCategory.HAND_LEFT, PartCategory.HAND_RIGHT]);
          const beltCats = new Set([PartCategory.BELT, PartCategory.POUCH, PartCategory.BUCKLE]);
          const lowerCats = new Set([PartCategory.LOWER_BODY, PartCategory.BOOTS]);
          const categoryCounts = {
            upper: archParts.filter(p => upperCats.has(p.category as PartCategory)).length,
            belt: archParts.filter(p => beltCats.has(p.category as PartCategory)).length,
            lower: archParts.filter(p => lowerCats.has(p.category as PartCategory)).length,
            backpack: archParts.filter(p => p.category === PartCategory.BACKPACK).length,
          };
          return (
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
              categoryCounts={categoryCounts}
              activeSidePanel={activeSidePanel}
              onSidePanelToggle={handlePanelModeChange}
            />
          );
        })()}
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
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: 2 }}>
                {t('panel.title', lang)}
              </div>
              {activePanelMode === 'parts' && activeCategory ? (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>
                  {t(getCategoryI18nKey(activeCategory), lang)}
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.1 }}>
                  {{ parts: t('panel.parts', lang), style: t('panel.style', lang), skins: t('panel.skins', lang), lights: t('panel.lights', lang) }[activePanelMode]}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {activePanelMode === 'parts' && activeCategory && (
                <button
                  onClick={() => characterViewerRef.current?.focusOnCategory(activeCategory)}
                  title={t('panel.focus_camera', lang)}
                  style={{
                    width: 32, height: 32,
                    background: 'rgba(216,162,58,0.12)',
                    border: '1px solid rgba(216,162,58,0.4)',
                    borderRadius: 8, cursor: 'pointer', fontSize: 15, lineHeight: 1,
                    color: 'var(--color-accent)',
                  }}
                >🎯</button>
              )}
              <button
                onClick={() => { setIsPanelOpen(false); setActiveSidePanel(null); setActiveCategory(null); }}
                style={{
                  width: 32, height: 32, flexShrink: 0,
                  background: 'rgba(19, 19, 31, 0.92)',
                  border: '1px solid rgba(71, 85, 105, 0.55)',
                  borderRadius: 8, cursor: 'pointer',
                  color: 'var(--color-text-muted)', fontSize: 16, lineHeight: 1,
                }}
                title={t('panel.close', lang)}
              >×</button>
            </div>
          </div>

          <div className="app-panel-tabs">
            {([
              ['parts', t('panel.parts', lang)],
              ['style', t('panel.style', lang)],
              ['skins', t('panel.skins', lang)],
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
                onPreviewChange={handlePreviewChange}
                id="part-selector-panel"
                registerElement={registerElement}
                characterViewerRef={characterViewerRef}
                ownedPartIds={ownedPartIds}
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
                getRecentParts={getRecent}
                onSwitchCategory={handleEditCategory}
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
            {t('bottom.pose', lang)} {(currentPoseIndex ?? 0) + 1} / {Math.max(savedPoses?.length ?? 0, 1)}
          </span>
          <button className="btn-comic btn-ghost" style={{ width: 30, height: 30, padding: 0, fontSize: 12, borderRadius: 6 }}
            onClick={handleNextPose}>▶</button>
          {user && savedPoses?.[currentPoseIndex ?? 0] && (
            <button
              className="btn-comic btn-ghost"
              style={{ width: 30, height: 30, padding: 0, fontSize: 13, borderRadius: 6, color: 'var(--color-danger, #f43f5e)' }}
              title="Borrar esta pose"
              onClick={() => handleDeletePose(currentPoseIndex ?? 0)}
            >🗑</button>
          )}
        </div>

        <div style={{ width: 1, height: 28, background: 'rgba(71, 85, 105, 0.45)' }} />

        {/* View presets */}
        <div style={{ display: 'flex', gap: 4 }}>
          {([t('bottom.front', lang), t('bottom.side', lang), '3/4', t('bottom.back', lang)] as const).map((label, i) => {
            const angles = [0, 0.25, 0.125, 0.5];
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
            onClick={handleScreenshot}
            title={t('bottom.png', lang)}
            style={{ padding: '5px 12px', background: 'rgba(19,19,31,0.84)', border: '1px solid rgba(71, 85, 105, 0.56)', borderRadius: '6px', color: '#b8c0cc', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            {t('bottom.png', lang)}
          </button>
          <button
            type="button"
            onClick={handleExportGLB}
            style={{ padding: '5px 12px', background: 'rgba(19,19,31,0.84)', border: '1px solid rgba(71, 85, 105, 0.56)', borderRadius: '6px', color: '#b8c0cc', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            {t('bottom.glb', lang)}
          </button>
          <button
            type="button"
            onClick={() => setShowSTLModal(true)}
            style={{ padding: '5px 12px', background: 'rgba(19,19,31,0.84)', border: '1px solid rgba(71, 85, 105, 0.56)', borderRadius: '6px', color: '#b8c0cc', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            {t('bottom.stl', lang)}
          </button>
          <button
            type="button"
            onClick={handleOpenVTTLibrary}
            style={{ padding: '5px 12px', background: 'rgba(216, 162, 58, 0.08)', border: '1px solid rgba(216, 162, 58, 0.34)', borderRadius: '6px', color: 'var(--color-accent)', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            {t('bottom.vtt', lang)}
          </button>
          {user ? (
            <button
              type="button"
              onClick={handleSaveCurrentPoseAsNew}
              style={{ padding: '5px 12px', background: 'rgba(216, 162, 58, 0.08)', border: '1px dashed rgba(216, 162, 58, 0.34)', borderRadius: '6px', color: 'var(--color-accent)', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            >
              {t('bottom.save_pose', lang)}
            </button>
          ) : (
            <button
              type="button"
              style={{ padding: '5px 12px', background: 'rgba(216, 162, 58, 0.08)', border: '1px dashed rgba(216, 162, 58, 0.34)', borderRadius: '6px', color: 'var(--color-accent)', fontSize: 10, fontWeight: 700, letterSpacing: 0.7, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              onClick={() => { setAuthModalMode('signup'); setIsAuthModalOpen(true); }}
              title={t('topbar.savehero', lang)}
            >
              {t('bottom.save_pose', lang)}
            </button>
          )}
        </div>

        {/* Help button */}
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setShowShortcutsOverlay(v => !v)}
            title="Atajos de teclado (?)"
            style={{ padding: '5px 10px', background: 'none', border: '1px solid rgba(71,85,105,0.4)', borderRadius: 6, color: 'rgba(100,116,139,0.7)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >?</button>
        </div>
      </div>

      {/* Keyboard shortcuts overlay */}
      {showShortcutsOverlay && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowShortcutsOverlay(false)}
        >
          <div style={{ background: 'var(--color-surface-2)', border: '1px solid rgba(216,162,58,0.35)', borderRadius: 8, padding: '20px 28px', minWidth: 260, boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}>
            <div style={{ fontFamily: 'var(--font-comic)', fontSize: 14, letterSpacing: 2, color: 'var(--color-accent)', marginBottom: 14 }}>{t('shortcuts.title', lang)}</div>
            {[
              ['Ctrl+Z', t('shortcuts.undo', lang)],
              ['Ctrl+Shift+Z', t('shortcuts.redo', lang)],
              ['1', t('shortcuts.upper', lang)],
              ['2', t('shortcuts.belt', lang)],
              ['3', t('shortcuts.lower', lang)],
              ['C', t('shortcuts.camera', lang)],
              ['?', t('shortcuts.help', lang)],
              ['Esc', t('shortcuts.close', lang)],
            ].map(([key, desc]) => (
              <div key={key} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'center' }}>
                <kbd style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, background: 'rgba(71,85,105,0.5)', border: '1px solid rgba(71,85,105,0.8)', borderRadius: 4, padding: '2px 6px', color: '#e2e8f0', minWidth: 70, textAlign: 'center', letterSpacing: 0.5 }}>{key}</kbd>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-muted)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {isResetPasswordOpen && (
        <ResetPasswordModal onClose={clearPasswordRecovery} />
      )}

      {isAuthModalOpen && !isPasswordRecovery && (
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
          archetypes={ARCHETYPES_LIST.slice(0, 6)}
          activeArchetypeId={selectedArchetype ?? ArchetypeId.STRONG}
          onSelectArchetype={handleArchetypeSelect}
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
        selectedArchetype={selectedArchetype || ArchetypeId.STRONG}
        onPartHover={handlePartHover}
        onPartUnhover={handlePartUnhover}
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
           refreshKey={libraryRefreshKey}
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
          {([
            { key: 'stats', icon: '📊', label: t('rtab.stats', lang) },
          ] as const).map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => toggleRightPanel(key)}
              title={label}
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                background: activeRightPanel === key ? 'var(--color-accent, #f59e0b)' : 'var(--color-surface-2, #1e293b)',
                border: '1px solid var(--color-border, #334155)',
                borderRight: 'none',
                color: activeRightPanel === key ? '#000' : 'var(--color-accent, #f59e0b)',
                fontFamily: 'var(--font-comic, Bangers, sans-serif)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                padding: '10px 6px',
                cursor: 'pointer',
                borderRadius: '4px 0 0 4px',
                userSelect: 'none',
              }}
            >{icon} {label}</button>
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
            title={!user ? t('rtab.library_locked', lang) : t('rtab.builds', lang)}
          >
            {t('rtab.builds', lang)}
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





