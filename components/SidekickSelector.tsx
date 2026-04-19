import React, { useState } from 'react';
import { SidekickPart, SidekickType, SidekickSize, SidekickPosition, ArchetypeId, ExtendedPartCategory } from '../types';
import { Card } from './ui/card';
import { GamingButton } from './ui/gaming-button';
import { useLang, t } from '../lib/i18n';

interface SidekickSelectorProps {
  selectedSidekick?: SidekickPart;
  onSidekickSelect: (sidekick: SidekickPart | null) => void;
  onPositionChange: (position: SidekickPosition) => void;
  currentPosition: SidekickPosition;
}

const SAMPLE_SIDEKICKS: SidekickPart[] = [
  {
    id: 'sidekick_robot_01',
    name: 'Companion Bot Alpha',
    category: ExtendedPartCategory.SIDEKICK,
    archetype: ArchetypeId.TECH,
    gltfPath: '/assets/sidekicks/robot/companion_bot_alpha.glb',
    priceUSD: 2.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/sidekick_robot_01/100/100',
    companionType: SidekickType.ROBOT,
    size: SidekickSize.MEDIUM,
    position: SidekickPosition.RIGHT,
    animations: ['idle', 'follow', 'attack'],
    syncWithHero: true,
    stats: {
      power: 3,
      defense: 4,
      speed: 5,
      intelligence: 7,
      energy: 6,
      charisma: 2
    }
  },
  {
    id: 'sidekick_pet_01',
    name: 'Mystic Familiar',
    category: ExtendedPartCategory.SIDEKICK,
    archetype: ArchetypeId.MYSTIC,
    gltfPath: '/assets/sidekicks/pet/mystic_familiar.glb',
    priceUSD: 1.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/sidekick_pet_01/100/100',
    companionType: SidekickType.FAMILIAR,
    size: SidekickSize.SMALL,
    position: SidekickPosition.FLOATING,
    animations: ['float', 'cast', 'teleport'],
    syncWithHero: true,
    stats: {
      power: 2,
      defense: 3,
      speed: 6,
      intelligence: 8,
      energy: 7,
      charisma: 4
    }
  },
  {
    id: 'sidekick_ally_01',
    name: 'Battle Partner',
    category: ExtendedPartCategory.SIDEKICK,
    archetype: ArchetypeId.STRONG,
    gltfPath: '/assets/sidekicks/ally/battle_partner.glb',
    priceUSD: 3.99,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/sidekick_ally_01/100/100',
    companionType: SidekickType.ALLY,
    size: SidekickSize.LARGE,
    position: SidekickPosition.BEHIND,
    animations: ['ready', 'charge', 'defend'],
    syncWithHero: false,
    stats: {
      power: 6,
      defense: 5,
      speed: 4,
      intelligence: 3,
      energy: 2,
      charisma: 5
    }
  }
];

const SidekickSelector: React.FC<SidekickSelectorProps> = ({
  selectedSidekick,
  onSidekickSelect,
  onPositionChange,
  currentPosition
}) => {
  const { lang } = useLang();
  const [hoveredSidekick, setHoveredSidekick] = useState<string | null>(null);

  const getSidekickTypeIcon = (type: SidekickType) => {
    switch (type) {
      case SidekickType.ROBOT: return '🤖';
      case SidekickType.PET: return '🐾';
      case SidekickType.ALLY: return '⚔️';
      case SidekickType.FAMILIAR: return '✨';
      default: return '👥';
    }
  };

  const getSizeLabel = (size: SidekickSize) => {
    switch (size) {
      case SidekickSize.SMALL: return t('sidekick.size.small', lang);
      case SidekickSize.MEDIUM: return t('sidekick.size.medium', lang);
      case SidekickSize.LARGE: return t('sidekick.size.large', lang);
      default: return t('sidekick.size.medium', lang);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{t('sidekick.title', lang)}</h3>
        <GamingButton
          variant="ghost"
          size="sm"
          onClick={() => onSidekickSelect(null)}
          className="text-red-400 hover:text-red-300"
        >
          {t('sidekick.remove', lang)}
        </GamingButton>
      </div>

      {/* Sidekick Position */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t('sidekick.position', lang)}</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(SidekickPosition).map((position) => (
            <GamingButton
              key={position}
              variant={currentPosition === position ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPositionChange(position)}
              className="text-xs"
            >
              {position === SidekickPosition.LEFT && t('sidekick.pos.left', lang)}
              {position === SidekickPosition.RIGHT && t('sidekick.pos.right', lang)}
              {position === SidekickPosition.BEHIND && t('sidekick.pos.behind', lang)}
              {position === SidekickPosition.FLOATING && t('sidekick.pos.floating', lang)}
            </GamingButton>
          ))}
        </div>
      </div>

      {/* Sidekicks List */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{t('sidekick.available', lang)}</label>
        <div className="grid grid-cols-1 gap-3">
          {SAMPLE_SIDEKICKS.map((sidekick) => (
            <Card
              key={sidekick.id}
              className={`p-3 cursor-pointer transition-colors transition-transform transition-shadow duration-200 ${
                selectedSidekick?.id === sidekick.id
                  ? 'ring-2 ring-blue-500 bg-blue-500/10'
                  : hoveredSidekick === sidekick.id
                  ? 'ring-1 ring-gray-400 bg-gray-800/50'
                  : 'bg-gray-900/50 hover:bg-gray-800/50'
              }`}
              onMouseEnter={() => setHoveredSidekick(sidekick.id)}
              onMouseLeave={() => setHoveredSidekick(null)}
              onClick={() => onSidekickSelect(sidekick)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-2xl">
                  {getSidekickTypeIcon(sidekick.companionType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-white truncate">
                      {sidekick.name}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {getSizeLabel(sidekick.size)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      {sidekick.companionType}
                    </span>
                    <span className="text-xs font-medium text-green-400">
                      ${sidekick.priceUSD}
                    </span>
                  </div>
                  {sidekick.stats && (
                    <div className="flex space-x-1 mt-2">
                      {Object.entries(sidekick.stats).slice(0, 3).map(([stat, value]) => (
                        <div
                          key={stat}
                          className="text-xs px-1 py-0.5 bg-gray-700 rounded"
                          title={`${stat}: ${value}`}
                        >
                          {stat.charAt(0).toUpperCase()}: {value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Sidekick Info */}
      {selectedSidekick && (
        <Card className="p-4 bg-blue-900/20 border-blue-500/30">
          <h4 className="font-medium text-blue-300 mb-2">
            {selectedSidekick.name} - {getSidekickTypeIcon(selectedSidekick.companionType)}
          </h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p>{t('sidekick.info.size', lang)} {getSizeLabel(selectedSidekick.size)}</p>
            <p>{t('sidekick.info.position', lang)} {currentPosition}</p>
            <p>{t('sidekick.info.synced', lang)} {selectedSidekick.syncWithHero ? t('sidekick.info.synced_yes', lang) : t('sidekick.info.synced_no', lang)}</p>
            <p>{t('sidekick.info.animations', lang)} {selectedSidekick.animations.join(', ')}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SidekickSelector; 