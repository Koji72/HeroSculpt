import React from 'react';
import { PartCategory } from '../types';
import { getCategoryI18nKey } from '../lib/utils';
import { useLang, t } from '../lib/i18n';
import { 
  User, 
  Shirt, 
  Zap, 
  Shield, 
  Crown, 
  Star, 
  Heart, 
  Target,
  Eye,
  Sparkles,
  X
} from 'lucide-react';

interface CircularCategoryMenuProps {
  categories: PartCategory[];
  selectedCategory: PartCategory | null;
  onSelectCategory: (category: PartCategory | null) => void;
  disabled: boolean;
  radius?: number;
  startAngleOffset?: number;
}

// Icon mapping for categories
const getCategoryIcon = (category: PartCategory) => {
  switch (category) {
    case PartCategory.HEAD:
      return <User className="h-4 w-4" />;
    case PartCategory.TORSO:
      return <Shirt className="h-4 w-4" />;
    case PartCategory.SUIT_TORSO:
      return <Shield className="h-4 w-4" />;
    case PartCategory.LOWER_BODY:
      return <Zap className="h-4 w-4" />;
    case PartCategory.BOOTS:
      return <Target className="h-4 w-4" />;
    case PartCategory.HAND_LEFT:
    case PartCategory.HAND_RIGHT:
      return <Heart className="h-4 w-4" />;
    case PartCategory.CAPE:
      return <Crown className="h-4 w-4" />;
    case PartCategory.SYMBOL:
      return <Star className="h-4 w-4" />;
    case PartCategory.BELT:
    case PartCategory.CHEST_BELT:
      return <Eye className="h-4 w-4" />;
    case PartCategory.BUCKLE:
    case PartCategory.POUCH:
      return <Sparkles className="h-4 w-4" />;
    default:
      return <User className="h-4 w-4" />;
  }
};

const CircularCategoryMenu: React.FC<CircularCategoryMenuProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  disabled,
  radius = 120,
  startAngleOffset = -90, // Start at top
}) => {
  const { lang } = useLang();
  const angleStep = 360 / (categories.length || 1);

  return (
    <div 
      className="fixed bottom-6 right-6 z-40 pointer-events-none" 
      style={{ zIndex: 40 }}
    >
      {/* Center button for closing */}
      <button
        onClick={() => onSelectCategory(null)}
        disabled={disabled}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-12 h-12 flex items-center justify-center
          marvel-button transition-colors transition-transform transition-shadow duration-200 ease-in-out pointer-events-auto
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
          hover:shadow-lg hover:scale-[1.05] overflow-hidden group
          ${selectedCategory 
            ? 'marvel-button-active bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-400/50' 
            : 'marvel-button-inactive bg-slate-800/80 text-slate-300 hover:text-white shadow-md'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
        }}
        title="Close menu"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-200" />
        <X className="h-5 w-5 relative z-10" />
      </button>

      {/* Category buttons */}
      {categories.map((category, index) => {
        const angleDegrees = startAngleOffset + (index * angleStep);
        const angleRadians = (angleDegrees * Math.PI) / 180;
        const x = radius * Math.cos(angleRadians);
        const y = radius * Math.sin(angleRadians);

        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => {
                if (disabled) return;
                onSelectCategory(isSelected ? null : category);
            }}
            disabled={disabled}
            title={t(getCategoryI18nKey(category), lang)}
            className={`absolute w-12 h-12 flex items-center justify-center
                        marvel-button transition-colors transition-transform transition-shadow duration-200 ease-in-out pointer-events-auto
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
              hover:shadow-lg hover:scale-[1.05] group overflow-hidden
                        ${isSelected 
                ? 'marvel-button-active bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-400/50' 
                : 'marvel-button-inactive bg-slate-800/80 text-slate-300 hover:text-white shadow-md'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
            style={{
              top: `calc(50% + ${y}px - 24px)`,
              left: `calc(50% + ${x}px - 24px)`,
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-200" />
            <div className="relative z-10">{getCategoryIcon(category)}</div>
            
            {/* Tooltip */}
            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1
              bg-slate-900 text-white text-xs rounded whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none z-50
            `}>
            {t(getCategoryI18nKey(category), lang)}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 
                border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900">
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CircularCategoryMenu;