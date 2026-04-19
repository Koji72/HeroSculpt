import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Purchase, PurchaseHistoryService } from '../services/purchaseHistoryService';
import { SelectedParts } from '../types';
import { XMarkIcon, BookOpenIcon, ArrowDownTrayIcon, DocumentArrowDownIcon, PencilIcon, CheckIcon } from './icons';
import { RefreshCw, Calendar, DollarSign, Package } from 'lucide-react';
import { useLang, t } from '../lib/i18n';
// import ExportButton from './ExportButton'; // Removed: not used

interface PurchaseLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConfiguration: (configuration: SelectedParts, modelName?: string) => void;
  user: any;
  // registerElement: (id: string, element: HTMLElement | null) => void; // Removed: not used
  onExportGLB?: () => Promise<any>;
  onExportSTL?: () => Promise<any>;
  refreshKey?: number;
}

const PurchaseLibrary: React.FC<PurchaseLibraryProps> = ({
  isOpen,
  onClose,
  onLoadConfiguration,
  user,
  // registerElement, // Removed
  onExportGLB,
  onExportSTL,
  refreshKey,
}) => {
  const { lang } = useLang();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingConfigId, setLoadingConfigId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'completed' | 'pending'>('all');
  
  // ✅ NUEVO: Estados para edición de nombres
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [updatingName, setUpdatingName] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadPurchases();
    }
  }, [isOpen, user?.id, refreshKey]);

  const loadPurchases = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await PurchaseHistoryService.getUserPurchases(user.id);
      
      if (result.success) {
        setPurchases(result.purchases || []);
      } else {
        setError(result.error || t('library.error.title', lang));
      }
    } catch (err) {
      setError(t('library.error.title', lang));
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN DE FALLBACK: Cargar configuración directamente desde purchase_items
  const loadFallbackConfiguration = async (purchaseId: string, itemId: string) => {
    if (import.meta.env.DEV) console.log('🔄 loadFallbackConfiguration: Intentando carga directa...');
    
    try {
      // Importar supabase dinámicamente
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        if (import.meta.env.DEV) console.error('❌ Variables de entorno de Supabase no configuradas');
        return null;
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Consulta directa a purchase_items
      const { data, error } = await supabase
        .from('purchase_items')
        .select('configuration_data')
        .eq('id', itemId)
        .eq('purchase_id', purchaseId)
        .single();
      
      if (error) {
        if (import.meta.env.DEV) console.error('❌ Error en fallback:', error);
        return null;
      }

      if (!data || !data.configuration_data) {
        if (import.meta.env.DEV) console.error('❌ No hay datos de configuración en fallback');
        return null;
      }
      
      if (import.meta.env.DEV) console.log('✅ Fallback exitoso, configuración encontrada');
      return data.configuration_data;
      
    } catch (error) {
      if (import.meta.env.DEV) console.error('❌ Error inesperado en fallback:', error);
      return null;
    }
  };

  // ✅ NUEVO: Funciones para edición de nombres
  const handleStartEditName = (itemId: string, currentName: string) => {
    setEditingItemId(itemId);
    setEditingName(currentName);
  };

  const handleSaveName = async (itemId: string) => {
    if (!editingName.trim()) {
      alert(t('library.err.name_empty', lang));
      return;
    }

    setUpdatingName(itemId);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      const { error } = await supabase
        .from('purchase_items')
        .update({ item_name: editingName.trim() })
        .eq('id', itemId);
      
      if (error) {
        throw error;
      }
      
      // Actualizar el estado local
      setPurchases(prevPurchases => 
        prevPurchases.map(purchase => ({
          ...purchase,
          purchase_items: purchase.purchase_items?.map(item => 
            item.id === itemId 
              ? { ...item, item_name: editingName.trim() }
              : item
          )
        }))
      );
      
      setEditingItemId(null);
      setEditingName('');
      
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error updating name:', error);
      alert(t('library.err.name_update', lang));
    } finally {
      setUpdatingName(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingName('');
  };

  const handleNameKeyPress = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter') {
      handleSaveName(itemId);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleLoadConfiguration = async (purchaseId: string, itemId: string) => {
    setLoadingConfigId(itemId);
    try {
      const result = await PurchaseHistoryService.loadConfigurationFromPurchase(purchaseId, itemId);
      
      if (result.success && result.configuration) {
        const currentPurchase = purchases.find(p => p.id === purchaseId);
        const currentItem = currentPurchase?.purchase_items?.find(item => item.id === itemId);
        const modelName = currentItem?.item_name || t('library.item.unnamed', lang);

        onLoadConfiguration(result.configuration, modelName);
      } else {
        // Fallback: try to load from the purchase data directly
        const currentPurchase = purchases.find(p => p.id === purchaseId);
        const currentItem = currentPurchase?.purchase_items?.find(item => item.id === itemId);

        if (currentItem?.configuration_data) {
          const modelName = currentItem?.item_name || t('library.item.unnamed', lang);
          onLoadConfiguration(currentItem.configuration_data, modelName);
        } else {
          if (import.meta.env.DEV) console.error('No configuration data found for purchase:', purchaseId, 'item:', itemId);
          alert(t('library.err.load_config', lang));
        }
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error loading configuration:', error);

      // Final fallback: try to load from the purchase data directly
      const currentPurchase = purchases.find(p => p.id === purchaseId);
      const currentItem = currentPurchase?.purchase_items?.find(item => item.id === itemId);

      if (currentItem?.configuration_data) {
        const modelName = currentItem?.item_name || t('library.item.unnamed', lang);
        onLoadConfiguration(currentItem.configuration_data, modelName);
      } else {
        alert(t('library.err.load_config', lang));
      }
    } finally {
      setLoadingConfigId(null);
    }
  };

  const handleDownloadModel = async (purchaseId: string, item: any, format: 'STL' | 'GLB') => {
    try {
      // First apply the configuration
      const result = await PurchaseHistoryService.loadConfigurationFromPurchase(
        purchaseId,
        item.id
      );

      if (result.success && result.configuration) {
        // Load configuration
        onLoadConfiguration(result.configuration);
        
        // Give a moment for the configuration to apply and then export
        setTimeout(() => {
          if (format === 'STL' && onExportSTL) {
            onExportSTL();
          } else if (format === 'GLB' && onExportGLB) {
            onExportGLB();
          }
        }, 500);
      } else {
        alert(result.error || t('library.err.download', lang));
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error en descarga:', err);
      alert(t('library.err.download', lang));
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    switch (activeFilter) {
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(purchase.purchase_date) >= oneWeekAgo;
      case 'completed':
        return purchase.status === 'completed';
      case 'pending':
        return purchase.status === 'pending';
      default:
        return true;
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel-box" style={{ width: 520, maxWidth: '95vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="panel-header">
          <span style={{ fontFamily: 'var(--font-comic)', fontSize: 18, letterSpacing: 3 }}>{t('library.title', lang)}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={loadPurchases}
              disabled={loading}
              style={{ background: 'none', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 0.6, color: '#000' }}
              title={t('library.refresh_title', lang)}
            >
              <RefreshCw style={{ width: 16, height: 16 }} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
          </div>
        </div>
        <div style={{ padding: '0', overflowY: 'auto', flex: 1, background: 'var(--color-surface)', display: 'flex', flexDirection: 'column' }}>
          {/* Subtitle */}
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-border-strong)', background: 'var(--color-surface-2)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>{t('library.subtitle', lang)}</p>
          </div>

          {/* Filters */}
          <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--color-border-strong)', background: 'var(--color-surface-2)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <button
                onClick={() => setActiveFilter('all')}
                style={{ padding: '4px 10px', fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 'var(--radius)', border: '1.5px solid var(--color-border-strong)', cursor: 'pointer', background: activeFilter === 'all' ? 'var(--color-accent)' : 'var(--color-surface)', color: activeFilter === 'all' ? '#000' : 'var(--color-text)' }}
              >
                {t('library.filter.all', lang)} ({purchases.length})
              </button>
              <button
                onClick={() => setActiveFilter('recent')}
                style={{ padding: '4px 10px', fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 'var(--radius)', border: '1.5px solid var(--color-border-strong)', cursor: 'pointer', background: activeFilter === 'recent' ? 'var(--color-accent)' : 'var(--color-surface)', color: activeFilter === 'recent' ? '#000' : 'var(--color-text)' }}
              >
                {t('library.filter.recent', lang)}
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                style={{ padding: '4px 10px', fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 'var(--radius)', border: '1.5px solid var(--color-border-strong)', cursor: 'pointer', background: activeFilter === 'completed' ? 'var(--color-accent)' : 'var(--color-surface)', color: activeFilter === 'completed' ? '#000' : 'var(--color-text)' }}
              >
                {t('library.filter.completed', lang)}
              </button>
              <button
                onClick={() => setActiveFilter('pending')}
                style={{ padding: '4px 10px', fontSize: 12, fontFamily: 'var(--font-body)', borderRadius: 'var(--radius)', border: '1.5px solid var(--color-border-strong)', cursor: 'pointer', background: activeFilter === 'pending' ? 'var(--color-accent)' : 'var(--color-surface)', color: activeFilter === 'pending' ? '#000' : 'var(--color-text)' }}
              >
                {t('library.filter.pending', lang)}
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: 16, overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                  <p className="text-slate-400">{t('library.loading', lang)}</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-red-400 font-bold mb-2">{t('library.error.title', lang)}</h3>
                <p className="text-slate-300 text-sm mb-4">{error}</p>
                <button
                  onClick={loadPurchases}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors"
                >
                  {t('library.error.retry', lang)}
                </button>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-slate-300 text-xl font-bold mb-2">
                  {activeFilter === 'all' ? t('library.empty.title', lang) : t('library.empty.filtered', lang)}
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  {activeFilter === 'all'
                    ? t('library.empty.hint', lang)
                    : t('library.empty.filtered_hint', lang)
                  }
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md transition-colors"
                >
                  {t('library.empty.cta', lang)}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">
                    {t('library.purchases_title', lang)} ({filteredPurchases.length})
                  </h3>
                  <div className="text-sm text-slate-400">
                    {t('library.showing', lang)} {filteredPurchases.length} {t('library.of', lang)} {purchases.length} {t('library.purchases_label', lang)}
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredPurchases.map((purchase: any) => (
                  <div key={purchase.id} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:border-blue-400/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-white font-bold text-lg">{purchase.configuration_name}</h4>
                            <span className={`text-sm font-medium ${getStatusColor(purchase.status)}`}>
                              {getStatusIcon(purchase.status)} {purchase.status === 'completed' ? t('library.status.completed', lang) : purchase.status === 'cancelled' ? t('library.status.cancelled', lang) : t('library.status.pending', lang)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                                        <div className="flex items-center gap-1">  
                              <Calendar className="w-4 h-4" />
                              {new Date(purchase.purchase_date || purchase.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4" />
                          {purchase.items_count} item{purchase.items_count !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-green-400 font-bold">${purchase.total_price.toFixed(2)}</span>
                      </div>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Items */}
                    {purchase.purchase_items && purchase.purchase_items.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {t('library.configurations', lang)}
                          </h5>
                          <div className="grid gap-3">
                          {purchase.purchase_items.map((item: any) => (
                              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-800/50 p-4 rounded border border-slate-600/30 gap-3">
                              <div className="flex-1">
                                {/* ✅ NUEVO: Nombre editable */}
                                <div className="flex items-center gap-2">
                                  {editingItemId === item.id ? (
                                    <div className="flex items-center gap-2 flex-1">
                                      <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        onKeyDown={(e) => handleNameKeyPress(e, item.id)}
                                        onBlur={(e) => {
                                          // Avoid double-save when focus moves to the save button
                                          if ((e.relatedTarget as HTMLElement)?.dataset?.saveBtn === item.id) return;
                                          handleSaveName(item.id);
                                        }}
                                        className="flex-1 bg-slate-700 text-slate-200 px-3 py-1 rounded border border-blue-400 focus:outline-none focus:border-blue-300"
                                        autoFocus
                                        maxLength={50}
                                      />
                                      <button
                                        data-save-btn={item.id}
                                        onClick={() => handleSaveName(item.id)}
                                        disabled={updatingName === item.id}
                                        className="p-1 text-green-400 hover:text-green-300 disabled:opacity-50"
                                        title={t('library.name.save_title', lang)}
                                      >
                                        {updatingName === item.id ? (
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                                        ) : (
                                          <CheckIcon className="w-4 h-4" />
                                        )}
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-slate-200 font-medium flex-1">{item.item_name}</p>
                                      <button
                                        onClick={() => handleStartEditName(item.id, item.item_name)}
                                        className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                                        title={t('library.name.edit_title', lang)}
                                      >
                                        <PencilIcon className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                                  <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs mt-1">
                                    <span>{t('library.quantity', lang)} {item.quantity}</span>
                                    <span>${item.item_price.toFixed(2)} {t('library.each', lang)}</span>
                                    <span>{t('library.item_total', lang)} ${(item.quantity * item.item_price).toFixed(2)}</span>
                                  </div>
                              </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                {/* Button to apply configuration */}
                                <button
                                  onClick={() => handleLoadConfiguration(purchase.id, item.id)}
                                  disabled={loadingConfigId === item.id}
                                    className="flex gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-sm transition-colors items-center justify-center px-4 py-2 disabled:cursor-not-allowed font-bold rounded"
                                  title={t('library.item.apply_title', lang)}
                                >
                                  {loadingConfigId === item.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      {t('library.btn.loading', lang)}
                                    </>
                                  ) : (
                                    <>
                                      <ArrowDownTrayIcon className="w-4 h-4" />
                                      {t('library.btn.apply', lang)}
                                    </>
                                  )}
                                </button>
                                
                                {/* Buttons to download model */}
                                  <div className="flex gap-1">
                                <button
                                  onClick={() => handleDownloadModel(purchase.id, item, 'STL')}
                                      className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded transition-colors"
                                  title={t('library.item.stl_title', lang)}
                                >
                                  <DocumentArrowDownIcon className="w-3 h-3" />
                                  STL
                                </button>
                                <button
                                  onClick={() => handleDownloadModel(purchase.id, item, 'GLB')}
                                      className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded transition-colors"
                                  title={t('library.item.glb_title', lang)}
                                >
                                  <DocumentArrowDownIcon className="w-3 h-3" />
                                  GLB
                                </button>
                                  </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--color-border-strong)', background: 'var(--color-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              <span>{t('library.footer.total', lang)} {purchases.length} {t('library.purchases_label', lang)}</span>
              <span style={{ marginLeft: 8 }}>• ${purchases.reduce((sum, p) => sum + p.total_price, 0).toFixed(2)}</span>
            </div>
            <button
              onClick={onClose}
              className="btn-comic btn-primary"
              style={{ padding: '8px 16px', fontSize: 14, letterSpacing: 2 }}
            >
              {t('library.btn.continue', lang)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseLibrary; 
