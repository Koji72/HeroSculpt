import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Hand, 
  ShirtIcon as Shirt, 
  Crown, 
  Footprints, 
  Shield, 
  Zap, 
  Package,
  Layers,
  Target,
  Swords
} from 'lucide-react';
import { PartCategory } from '../types';
import { GlassPanel } from './ui/glass-panel';
import { GamingButton } from './ui/gaming-button';

interface GamingCategoryToolbarProps {
  onSelectCategory: (category: PartCategory) => void;
  activeCategory: PartCategory | null;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
}

// Map categories to modern icons and display names
const categoryConfig: Record<PartCategory, { icon: any; label: string; color: string }> = {
  [PartCategory.HEAD]: { icon: Crown, label: 'Head', color: 'amber' },
  [PartCategory.TORSO]: { icon: User, label: 'Torso', color: 'blue' },
  [PartCategory.SUIT_TORSO]: { icon: Shirt, label: 'Suit', color: 'purple' },
  [PartCategory.HAND_LEFT]: { icon: Hand, label: 'Left Hand', color: 'green' },
  [PartCategory.HAND_RIGHT]: { icon: Hand, label: 'Right Hand', color: 'green' },
  [PartCategory.LOWER_BODY]: { icon: Target, label: 'Legs', color: 'blue' },
  [PartCategory.BOOTS]: { icon: Footprints, label: 'Boots', color: 'amber' },
  [PartCategory.CAPE]: { icon: Layers, label: 'Cape', color: 'red' },
  [PartCategory.SYMBOL]: { icon: Zap, label: 'Symbol', color: 'amber' },
  [PartCategory.BELT]: { icon: Package, label: 'Belt', color: 'blue' },
  [PartCategory.CHEST_BELT]: { icon: Shield, label: 'Chest', color: 'purple' },
  [PartCategory.BUCKLE]: { icon: Target, label: 'Buckle', color: 'amber' },
  [PartCategory.POUCH]: { icon: Package, label: 'Pouch', color: 'green' },
  [PartCategory.BACKPACK]: { icon: Package, label: 'Backpack', color: 'green' },
  [PartCategory.SHOULDERS]: { icon: Shield, label: 'Shoulders', color: 'blue' },
  [PartCategory.FOREARMS]: { icon: Shield, label: 'Forearms', color: 'blue' },

};

const GamingCategoryToolbar: React.FC<GamingCategoryToolbarProps> = ({ 
  onSelectCategory, 
  activeCategory, 
  id, 
  registerElement 
}) => {
  const categories = Object.values(PartCategory);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerElement(id, ref.current);
  }, [id, registerElement]);

  const handleCategoryClick = (category: PartCategory) => {
    onSelectCategory(category);
  };

  return (
    <GlassPanel 
      variant="toolbar" 
      glowColor="blue" 
      className="pointer-events-auto"
      ref={ref}
    >
      <div className="p-3">
        {/* Header */}
        <div className="mb-3 text-center">
          <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider">
            Categories
          </h3>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-1 rounded-full" />
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          <AnimatePresence>
            {categories.map((category) => {
              const config = categoryConfig[category];
              const Icon = config?.icon || Target;
              const isActive = activeCategory === category;
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: categories.indexOf(category) * 0.02 }}
                >
                  <GamingButton
                    variant={isActive ? 'primary' : 'ghost'}
                    size="sm"
                    active={isActive}
                    onClick={() => handleCategoryClick(category)}
                    className="w-full flex-col gap-1 h-16 text-xs"
                    glowOnHover={!isActive}
                  >
                    <Icon size={16} className={isActive ? 'text-black' : 'text-white/80'} />
                    <span className={`font-medium ${isActive ? 'text-black' : 'text-white/80'}`}>
                      {config?.label || category}
                    </span>
                  </GamingButton>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Footer with active category indicator */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <div className="text-center">
                <div className="text-xs text-white/60 mb-1">Categoría activa</div>
                <div className="text-sm font-semibold text-amber-400">
                  {categoryConfig[activeCategory]?.label || activeCategory}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
};

export default GamingCategoryToolbar; 