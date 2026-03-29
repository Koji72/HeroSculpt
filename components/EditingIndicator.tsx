import React from 'react';
import { PartCategory } from '../types';
import { getCategoryName } from '../lib/utils';
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
  Settings,
  Edit3
} from 'lucide-react';

interface EditingIndicatorProps {
  selectedCategory: PartCategory | null;
  onClose: () => void;
}

// Icon mapping for categories
const getCategoryIcon = (category: PartCategory) => {
  switch (category) {
    case PartCategory.HEAD:
      return <User className="h-5 w-5" />;
    case PartCategory.TORSO:
      return <Shirt className="h-5 w-5" />;
    case PartCategory.SUIT_TORSO:
      return <Shield className="h-5 w-5" />;
    case PartCategory.LOWER_BODY:
      return <Zap className="h-5 w-5" />;
    case PartCategory.BOOTS:
      return <Target className="h-5 w-5" />;
    case PartCategory.HAND_LEFT:
    case PartCategory.HAND_RIGHT:
      return <Heart className="h-5 w-5" />;
    case PartCategory.CAPE:
      return <Crown className="h-5 w-5" />;
    case PartCategory.SYMBOL:
      return <Star className="h-5 w-5" />;
    case PartCategory.BELT:
    case PartCategory.CHEST_BELT:
      return <Eye className="h-5 w-5" />;
    case PartCategory.BUCKLE:
    case PartCategory.POUCH:
      return <Sparkles className="h-5 w-5" />;
    default:
      return <Settings className="h-5 w-5" />;
  }
};

const EditingIndicator: React.FC<EditingIndicatorProps> = ({ selectedCategory, onClose }) => {
  if (!selectedCategory) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-slate-900 border border-orange-500/50 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm will-change-transform">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              {getCategoryIcon(selectedCategory)}
            </div>
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-white">
                Editing: {getCategoryName(selectedCategory)}
              </span>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-slate-400 hover:text-white text-sm">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditingIndicator; 