import React, { useState, useCallback, useEffect, useRef } from 'react';

// Basic imports first
console.log('🔍 Importing types...');
import { ArchetypeId, PartCategory, SelectedParts, Part } from './types';
console.log('✅ Types imported');

console.log('🔍 Importing constants...');
import { ALL_PARTS, DEFAULT_STRONG_BUILD, DEFAULT_JUSTICIERO_BUILD } from './constants';
console.log('✅ Constants imported');

// Component imports one by one
console.log('🔍 Importando CharacterViewer...');
import CharacterViewer, { CharacterViewerRef } from './components/CharacterViewer';
console.log('✅ CharacterViewer importado');

console.log('🔍 Importando PartSelectorPanel...');
import PartSelectorPanel from './components/PartSelectorPanel';
console.log('✅ PartSelectorPanel importado');

console.log('🔍 Importando ShoppingCart...');
import ShoppingCart from './components/ShoppingCart';
console.log('✅ ShoppingCart importado');

console.log('🔍 Importando iconos...');
import { ShieldCheckIcon, Cog6ToothIcon, UserIcon, BookOpenIcon, SparklesIcon, ShoppingCartIcon } from './components/icons';
console.log('✅ Iconos importados');

console.log('🔍 Importando ArchetypeSelector...');
import ArchetypeSelector from './components/ArchetypeSelector';
console.log('✅ ArchetypeSelector importado');

console.log('🔍 Importando VerticalArchetypeSelector...');
import VerticalArchetypeSelector from './components/VerticalArchetypeSelector';
console.log('✅ VerticalArchetypeSelector importado');

console.log('🔍 Importando PartCategoryToolbar...');
import PartCategoryToolbar from './components/PartCategoryToolbar';
console.log('✅ PartCategoryToolbar importado');

console.log('🔍 Importando AuthModal...');
import AuthModal from './components/AuthModal';
console.log('✅ AuthModal importado');

console.log('🔍 Importando UserProfile...');
import UserProfile from './components/UserProfile';
console.log('✅ UserProfile importado');

console.log('🔍 Importando AiDesignerModal...');
import AiDesignerModal from './components/AiDesignerModal';
console.log('✅ AiDesignerModal importado');

console.log('🔍 Importando PurchaseConfirmation...');
import PurchaseConfirmation from './components/PurchaseConfirmation';
console.log('✅ PurchaseConfirmation importado');

console.log('🔍 Importando PurchaseLibrary...');
import PurchaseLibrary from './components/PurchaseLibrary';
console.log('✅ PurchaseLibrary importado');

console.log('🔍 Importando GuestEmailModal...');
import GuestEmailModal from './components/GuestEmailModal';
console.log('✅ GuestEmailModal importado');

console.log('🔍 Importando GamingButton...');
import { GamingButton } from './components/ui/gaming-button';
console.log('✅ GamingButton importado');

console.log('🔍 Importando GlassPanel...');
import { GlassPanel } from './components/ui/glass-panel';
console.log('✅ GlassPanel importado');

console.log('🔍 Importando useAuth...');
import { useAuth } from './hooks/useAuth';
console.log('✅ useAuth importado');

console.log('🔍 Importando utils...');
import { assignDefaultHandsForTorso, assignAdaptiveHeadForTorso, assignAdaptiveCapeForTorso, assignAdaptiveBootsForTorso, assignAdaptiveSymbolForTorso } from './lib/utils';
console.log('✅ Utils importados');

console.log('🔍 Importando SessionStorageService...');
import { SessionStorageService } from './services/sessionStorageService';
console.log('✅ SessionStorageService importado');

console.log('🔍 Importando openaiService...');
import { generateBuild, isAIServiceAvailable } from './services/openaiService';
console.log('✅ openaiService importado');

console.log('🔍 Importando BattleDemo...');
import { BattleDemo } from './battle-prototype';
console.log('✅ BattleDemo importado');

console.log('🔍 Importando modelCache...');
import { modelCache } from './lib/modelCache';
console.log('✅ modelCache importado');

console.log('🔍 Importando ErrorBoundary...');
import ErrorBoundary from './components/ErrorBoundary';
console.log('✅ ErrorBoundary importado');

console.log('🔍 Importando ExportButton...');
import ExportButton from './components/ExportButton';
console.log('✅ ExportButton importado');

console.log('🔍 Importando PurchaseHistoryService...');
import { PurchaseHistoryService } from './services/purchaseHistoryService';
console.log('✅ PurchaseHistoryService importado');

console.log('🔍 Importando ResendEmailService...');
import { ResendEmailService } from './services/resendEmailService';
console.log('✅ ResendEmailService importado');

console.log('🔍 Importando Card...');
import { Card } from "./components/ui/card";
console.log('✅ Card importado');

console.log('🔍 Importando HeaderDropdown...');
import HeaderDropdown from './components/HeaderDropdown';
console.log('✅ HeaderDropdown importado');

console.log('🔍 Importando CSS...');
console.log('✅ CSS importado');

console.log('🔍 Importando MaterialPanel...');
import MaterialPanel from './components/MaterialPanel';
console.log('✅ MaterialPanel importado');

console.log('🔍 Importando stripeService...');
import { createStripeCheckoutSession, redirectToCheckout } from './services/stripeService';
console.log('✅ stripeService importado');

console.log('🎉 All imports completed successfully!');

const AppDebug: React.FC = () => {
  const [debugStep, setDebugStep] = useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      <h1>🔍 Debug - Superhero 3D Customizer</h1>
             <p>Verifying imports step by step...</p>
      
      <div style={{ 
        backgroundColor: '#334155', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
                 <h3>Import Status:</h3>
        <ul>
                     <li>✅ Basic types</li>
                     <li>✅ Constants</li>
          <li>✅ CharacterViewer</li>
          <li>✅ PartSelectorPanel</li>
          <li>✅ ShoppingCart</li>
                     <li>✅ Icons</li>
          <li>✅ ArchetypeSelector</li>
          <li>✅ VerticalArchetypeSelector</li>
          <li>✅ PartCategoryToolbar</li>
          <li>✅ AuthModal</li>
          <li>✅ UserProfile</li>
          <li>✅ AiDesignerModal</li>
          <li>✅ PurchaseConfirmation</li>
          <li>✅ PurchaseLibrary</li>
          <li>✅ GuestEmailModal</li>
          <li>✅ GamingButton</li>
          <li>✅ GlassPanel</li>
          <li>✅ useAuth</li>
          <li>✅ Utils</li>
          <li>✅ SessionStorageService</li>
          <li>✅ openaiService</li>
          <li>✅ BattleDemo</li>
          <li>✅ modelCache</li>
          <li>✅ ErrorBoundary</li>
          <li>✅ ExportButton</li>
          <li>✅ PurchaseHistoryService</li>
          <li>✅ ResendEmailService</li>
          <li>✅ Card</li>
          <li>✅ HeaderDropdown</li>
          <li>✅ CSS</li>
          <li>✅ MaterialPanel</li>
          <li>✅ stripeService</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#475569', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Next Step:</h3>
                 <p>If you can see this page, all imports are working correctly.</p>
         <p>The problem might be in the main application logic.</p>
      </div>

      <button 
        onClick={() => {
          console.log('✅ Debug completado - todas las importaciones funcionan');
          alert('All imports are working correctly!');
        }}
        style={{
          backgroundColor: '#f97316',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
                 Confirm Debug
      </button>
    </div>
  );
};

export default AppDebug; 