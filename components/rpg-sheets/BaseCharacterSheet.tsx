import React from 'react';
import { useLang, t } from '../../lib/i18n';

export interface RPGSystem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface BaseCharacterData {
  id: string;
  name: string;
  player: string;
  system: string;
  level?: number;
  experience?: number | { earned: number; spent: number; available: number };
  selectedParts?: Record<string, unknown>; // Parts from the 3D customizer
  archetype?: string; // Archetype from the 3D customizer
  [key: string]: unknown;
}

export interface ModularCharacterData extends BaseCharacterData {
  grado: string;
  str: number;
  end: number;
  agi: number;
  wil: number;
  int: number;
  pre: number;
  poderes: string;
  ventajas: string;
  descripcion: string;
  abilities: Array<{ _id: string; key: string; name: string; icon: string }>;
}

export interface CharacterSheetProps {
  character: BaseCharacterData;
  isEditing: boolean;
  onCharacterChange: (character: BaseCharacterData) => void;
  onToggleEdit: () => void;
}

export interface RPGSheetComponent {
  system: RPGSystem;
  component: React.ComponentType<CharacterSheetProps>;
}

const BaseCharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  isEditing,
  onCharacterChange,
  onToggleEdit
}) => {
  const { lang } = useLang();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto bg-slate-800/90 backdrop-blur-sm will-change-transform rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{t('base_sheet.title', lang)}</h1>
          <button
            onClick={onToggleEdit}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isEditing ? t('base_sheet.save', lang) : t('base_sheet.edit', lang)}
          </button>
        </div>
        <div className="p-6">
          <p className="text-white">{t('base_sheet.placeholder', lang)}</p>
        </div>
      </div>
    </div>
  );
};

export default BaseCharacterSheet; 