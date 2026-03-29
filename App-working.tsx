import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ArchetypeId, PartCategory, SelectedParts, Part } from './types';
import { ALL_PARTS, DEFAULT_STRONG_BUILD, DEFAULT_JUSTICIERO_BUILD } from './constants';
import CharacterViewer, { CharacterViewerRef } from './components/CharacterViewer';

import PartSelectorPanel from './components/PartSelectorPanel';
import ShoppingCart from './components/ShoppingCart';
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
import { assignDefaultHandsForTorso, assignAdaptiveHeadForTorso, assignAdaptiveCapeForTorso, assignAdaptiveBootsForTorso, assignAdaptiveSymbolForTorso } from './lib/utils';
import { SessionStorageService } from './services/sessionStorageService';
import { generateBuild, isAIServiceAvailable } from './services/openaiService';
import { BattleDemo } from './battle-prototype';
import { modelCache } from './lib/modelCache';
import ErrorBoundary from './components/ErrorBoundary';

import ExportButton from './components/ExportButton';
import { PurchaseHistoryService } from './services/purchaseHistoryService';
import { ResendEmailService } from './services/resendEmailService';
import { Card } from "./components/ui/card";
import HeaderDropdown from './components/HeaderDropdown';
import MaterialPanel from './components/MaterialPanel';
import { createStripeCheckoutSession, redirectToCheckout } from './services/stripeService';

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
}

// Categorías que dependen del torso
const TORSO_DEPENDENT_CATEGORIES = [
  PartCategory.HEAD,
  PartCategory.HAND_LEFT,
  PartCategory.HAND_RIGHT,
  PartCategory.CAPE,
  PartCategory.SUIT_TORSO
];

const AppWorking: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(ArchetypeId.STRONG);
  const [selectedParts, setSelectedParts] = useState<SelectedParts>(DEFAULT_STRONG_BUILD);
  const [activeCategory, setActiveCategory] = useState<PartCategory | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<{ hasSession: boolean; lastSaved?: string; source?: 'supabase' | 'localStorage' }>({ hasSession: false });
  const [showBattleDemo, setShowBattleDemo] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

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
  
  // Key to force CharacterViewer re-render
  const [characterViewerKey, setCharacterViewerKey] = useState(0);

  const { isAuthenticated, loading, signOut, user } = useAuth();

  // Empty function for components that expect registerElement (tutorial functionality removed)
  const registerElement = () => {};

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

  useEffect(() => {
    const updateSessionInfo = async () => {
      const info = await SessionStorageService.getSessionInfo();
      setSessionInfo(info);
    };
    updateSessionInfo();
  }, [selectedParts]);

  // Funciones básicas
  const handleArchetypeChange = (archetype: ArchetypeId) => {
    console.log('🔄 Cambiando arquetipo a:', archetype);
    setSelectedArchetype(archetype);
    
    // Asignar configuración por defecto según el arquetipo
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
    setCharacterViewerKey(prev => prev + 1);
  };

  const handleResetCamera = () => {
    if (characterViewerRef.current) {
      characterViewerRef.current.resetCamera();
    }
  };

  const handleEditCategory = (category: PartCategory) => {
    setActiveCategory(category);
  };

  const handleCloseSelector = () => {
    setActiveCategory(null);
  };

  const handleLoadConfiguration = (parts: SelectedParts) => {
    setSelectedParts(parts);
    setCharacterViewerKey(prev => prev + 1);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserProfileOpen(false);
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleExportGLB = async () => {
    if (characterViewerRef.current) {
      try {
        await characterViewerRef.current.exportModel();
      } catch (error) {
        console.error('Error exporting GLB:', error);
      }
    }
  };

  const handleExportSTL = async () => {
    if (characterViewerRef.current) {
      try {
        await characterViewerRef.current.exportModel();
      } catch (error) {
        console.error('Error exporting STL:', error);
      }
    }
  };

  const handleOpenAiDesigner = () => {
    setIsAiModalOpen(true);
  };

  const handleGenerateFromAI = async (prompt: string) => {
    try {
      const generatedBuild = await generateBuild(prompt);
      if (generatedBuild) {
        setSelectedParts(generatedBuild);
        setCharacterViewerKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error generating build from AI:', error);
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

  // Funciones del carrito simplificadas
  const handleAddToCart = (configuration: SelectedParts) => {
    const newItem: CartItem = {
      id: `config_${Date.now()}`,
      name: `Configuración ${selectedArchetype}`,
      category: 'custom',
      price: 29.99,
      thumbnail: '',
      quantity: 1,
      configuration
    };
    setCartItems(prev => [...prev, newItem]);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCartCheckout = async () => {
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (isAuthenticated) {
      // Usuario autenticado - procesar checkout normal
      setPurchaseData({
        items: cartItems,
        totalPaid: totalPrice
      });
      setIsPurchaseConfirmationOpen(true);
      setIsCartOpen(false);
    } else {
      // Usuario no autenticado - mostrar modal de email
      setGuestEmailData({
        cartItems,
        totalPrice
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
    if (guestEmailData) {
      try {
        // Simular envío de email
        console.log('📧 Enviando configuración a:', email);
        
        setPurchaseData({
          items: guestEmailData.cartItems,
          totalPaid: guestEmailData.totalPrice,
          isGuestUser: true,
          guestEmail: email
        });
        
        setIsGuestEmailModalOpen(false);
        setIsPurchaseConfirmationOpen(true);
        setGuestEmailData(null);
      } catch (error) {
        console.error('Error sending guest email:', error);
      }
    }
  };

  const handleOpenSettings = () => {};
  const handleOpenHelp = () => {};

  // Renderizado simplificado
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header simplificado */}
      <header className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">🦸‍♂️ Superhero 3D Customizer</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleOpenCart}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>Carrito ({cartItems.length})</span>
            </button>
            <button
              onClick={handleOpenUserProfile}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex">
        {/* Panel izquierdo */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 p-4">
          <ArchetypeSelector
            selectedArchetype={selectedArchetype}
            onArchetypeChange={handleArchetypeChange}
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <PartCategoryToolbar
              activeCategory={activeCategory}
              onCategorySelect={handleEditCategory}
            />
          </div>
        </div>

        {/* Visor 3D */}
        <div className="flex-1 relative">
          <CharacterViewer
            key={characterViewerKey}
            ref={characterViewerRef}
            selectedParts={selectedParts}
            archetype={selectedArchetype}
          />
          
          {/* Botones de control */}
          <div className="absolute top-4 right-4 space-y-2">
            <button
              onClick={handleResetCamera}
              className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg"
              title="Reset Camera (R)"
            >
              📷
            </button>
            <button
              onClick={handleExportGLB}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
              title="Export GLB"
            >
              📥
            </button>
          </div>
        </div>

        {/* Panel derecho */}
        {activeCategory && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 p-4">
            <PartSelectorPanel
              category={activeCategory}
              selectedParts={selectedParts}
              onPartSelect={(part) => {
                setSelectedParts(prev => ({ ...prev, [activeCategory]: part }));
                setCharacterViewerKey(prev => prev + 1);
              }}
              onClose={handleCloseSelector}
            />
          </div>
        )}
      </main>

      {/* Modales */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={handleCloseAuthModal}
        />
      )}

      {isUserProfileOpen && (
        <UserProfile
          isOpen={isUserProfileOpen}
          onClose={handleCloseUserProfile}
          onSignOut={handleSignOut}
          user={user}
        />
      )}

      {isCartOpen && (
        <ShoppingCart
          isOpen={isCartOpen}
          onClose={handleCloseCart}
          items={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onClearCart={handleClearCart}
          onCheckout={handleCartCheckout}
        />
      )}

      {isPurchaseConfirmationOpen && purchaseData && (
        <PurchaseConfirmation
          isOpen={isPurchaseConfirmationOpen}
          onClose={handleClosePurchaseConfirmation}
          purchaseData={purchaseData}
        />
      )}

      {isGuestEmailModalOpen && guestEmailData && (
        <GuestEmailModal
          isOpen={isGuestEmailModalOpen}
          onClose={handleCloseGuestEmailModal}
          onSubmit={handleGuestEmailSubmitted}
          cartItems={guestEmailData.cartItems}
          totalPrice={guestEmailData.totalPrice}
        />
      )}
    </div>
  );
};

export default AppWorking; 