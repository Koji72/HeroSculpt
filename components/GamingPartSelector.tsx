import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Filter, X } from 'lucide-react';
import { Part, PartCategory, ArchetypeId } from '../types';
import { GlassPanel } from './ui/glass-panel';
import { GamingButton } from './ui/gaming-button';
import { hudNotify } from './ui/hud-notification';
import { useLang, t } from '../lib/i18n';

interface GamingPartSelectorProps {
  parts: Part[];
  category: PartCategory;
  archetype: ArchetypeId;
  selectedPartIds: string[];
  onSelectPart: (part: Part) => void;
  onClose: () => void;
}

const GamingPartSelector: React.FC<GamingPartSelectorProps> = ({
  parts,
  category,
  archetype,
  selectedPartIds,
  onSelectPart,
  onClose
}) => {
  const { lang } = useLang();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter parts by archetype, category, and search term
  const filteredParts = parts.filter(part => 
    part.archetype === archetype &&
    part.category === category &&
    part.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPart = (part: Part) => {
    onSelectPart(part);
    hudNotify.partChanged(category, part.name);
  };

  const isSelected = (partId: string) => selectedPartIds.includes(partId);

  return (
    <GlassPanel variant="floating" glowColor="purple" className="w-full max-w-2xl mx-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {t('gaming_selector.title', lang)} {category}
            </h2>
            <p className="text-sm text-white/60">
              {filteredParts.length} {t('gaming_selector.parts_available', lang)}
            </p>
          </div>
          <GamingButton
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
            className="p-2"
          >
          </GamingButton>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder={t('gaming_selector.search_placeholder', lang)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full backdrop-blur-sm bg-black/30 border-white/20 text-white focus:border-blue-500/50 rounded-lg focus:outline-none transition-colors pl-10 pr-4 py-3 border 
                       placeholder-white/40 
                       will-change-transform"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GamingButton
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                icon={Grid}
                onClick={() => setViewMode('grid')}
              />
              <GamingButton
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                icon={List}
                onClick={() => setViewMode('list')}
              />
            </div>

            <GamingButton
              variant={showFilters ? 'primary' : 'ghost'}
              size="sm"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              {t('gaming_selector.filters_btn', lang)}
            </GamingButton>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-black/20 border border-white/10 rounded-lg"
            >
              <div className="text-sm text-white/60 mb-2">{t('gaming_selector.additional_filters', lang)}</div>
              <div className="flex gap-2">
                <GamingButton variant="ghost" size="sm">{t('gaming_selector.filter_price', lang)}</GamingButton>
                <GamingButton variant="ghost" size="sm">{t('gaming_selector.filter_compat', lang)}</GamingButton>
                <GamingButton variant="ghost" size="sm">{t('gaming_selector.filter_rarity', lang)}</GamingButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Parts Grid/List */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          {filteredParts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/40 mb-2">{t('gaming_selector.no_parts', lang)}</div>
              <div className="text-sm text-white/30">
                {t('gaming_selector.no_parts_hint', lang)}
              </div>
            </div>
          ) : (
            <div className={`gap-3 ${viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3' : 'flex flex-col'}`}>
              <AnimatePresence>
                {filteredParts.map((part, index) => (
                  <motion.div
                    key={part.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <GamingButton
                      variant={isSelected(part.id) ? 'primary' : 'ghost'}
                      active={isSelected(part.id)}
                      onClick={() => handleSelectPart(part)}
                      className={`
                        ${viewMode === 'grid' 
                          ? 'w-full aspect-square flex-col gap-2 p-4' 
                          : 'w-full justify-start gap-3 p-3'
                        }
                      `}
                    >
                      {/* Part Thumbnail */}
                      <div className={`
                        ${viewMode === 'grid' ? 'w-12 h-12' : 'w-8 h-8'} 
                        bg-gradient-to-br from-white/20 to-white/5 rounded-lg 
                        flex items-center justify-center border border-white/10
                      `}>
                        <div className="text-xs text-white/60 font-mono">3D</div>
                      </div>

                      {/* Part Info */}
                      <div className={`${viewMode === 'grid' ? 'text-center' : 'flex-1 text-left'}`}>
                        <div className={`font-medium ${viewMode === 'grid' ? 'text-xs' : 'text-sm'} 
                                       ${isSelected(part.id) ? 'text-black' : 'text-white'}`}>
                          {part.name}
                        </div>
                        {viewMode === 'list' && (
                          <div className={`text-xs ${isSelected(part.id) ? 'text-black/70' : 'text-white/60'}`}>
                            ${part.priceUSD}
                          </div>
                        )}
                      </div>

                      {/* Selected Indicator */}
                      {isSelected(part.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-3 h-3 bg-amber-400 rounded-full"
                        />
                      )}
                    </GamingButton>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="text-sm text-white/60">
            {selectedPartIds.length > 0 && `${selectedPartIds.length} ${t('gaming_selector.selected', lang)}`}
          </div>
          <GamingButton variant="secondary" onClick={onClose}>
            {t('gaming_selector.close', lang)}
          </GamingButton>
        </div>
      </div>
    </GlassPanel>
  );
};

export default GamingPartSelector; 