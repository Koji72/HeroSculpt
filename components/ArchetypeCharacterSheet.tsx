import React from 'react';
import { ArchetypeInfo, Faction } from '../types';
import { getAverageStats } from '../lib/archetypeData';
import { useLang, t } from '../lib/i18n';

interface ArchetypeCharacterSheetProps {
  archetype: ArchetypeInfo;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const ArchetypeCharacterSheet: React.FC<ArchetypeCharacterSheetProps> = ({
  archetype,
  isExpanded = false,
  onToggle
}) => {
  const { lang } = useLang();
  const averageStats = getAverageStats(archetype);

  const getStatColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 80) return 'text-blue-400';
    if (value >= 70) return 'text-yellow-400';
    if (value >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatBarColor = (value: number) => {
    if (value >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (value >= 80) return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    if (value >= 70) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    if (value >= 60) return 'bg-gradient-to-r from-orange-500 to-red-600';
    return 'bg-gradient-to-r from-red-500 to-pink-600';
  };

  return (
    <div className="relative">
              {/* Character Sheet Header */}
      <div 
        className={`bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur will-change-transform-xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-400/20 px-6 py-4 rounded-lg relative overflow-hidden transition-colors transition-transform transition-shadow duration-150 ${
          onToggle ? 'cursor-pointer hover:scale-[1.02]' : ''
        }`}
        style={{
          clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
        }}
        onClick={onToggle}
      >
        {/* Holographic effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-cyan-400/5 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-400/5 to-transparent animate-scan opacity-30" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{archetype.icon}</div>
            <div>
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-black"
                   style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                {t('sheet.hero_character_sheet', lang)}
              </div>
              <div className={`text-xl font-black uppercase tracking-widest bg-gradient-to-r ${archetype.colors} bg-clip-text text-transparent`}
                   style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                {archetype.name}
              </div>
              <div className="text-xs text-slate-400 font-bold"
                   style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                {archetype.title}
              </div>
            </div>
          </div>
          
          {/* Expansion indicator */}
          {onToggle && (
            <div className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>
      </div>

              {/* Expanded Character Sheet Panel */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[60] min-w-[700px]">
          <div className="from-slate-900/98 backdrop-blur will-change-transform-xl shadow-2xl shadow-purple-400/20 p-6 relative overflow-hidden bg-gradient-to-b via-slate-800/98 to-slate-900/98 border-2 border-purple-400/50 rounded-lg">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/5 via-cyan-400/5 to-purple-400/5 animate-holographic" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-black text-purple-400 uppercase tracking-wider mb-4 text-center"
                  style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                {t('sheet.character_statistics', lang)}
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Statistics */}
                <div className="space-y-4">
                  <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-3"
                        style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                      {t('sheet.base_statistics', lang)}
                    </h4>
                    
                    <div className="space-y-3">
                      {Object.entries(archetype.stats).map(([stat, value]) => (
                        <div key={stat} className="flex items-center gap-3">
                          <span className={`text-xs uppercase w-16 font-bold ${getStatColor(value)}`}
                                style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                            {stat}
                          </span>
                          <div className="flex-1 bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-colors transition-transform transition-shadow duration-1000 ${getStatBarColor(value)}`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold w-8 ${getStatColor(value)}`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Statistics average */}
                    <div className="mt-4 pt-3 border-t border-slate-600/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-400 uppercase font-bold"
                              style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                          {t('sheet.average', lang)}
                        </span>
                        <span className={`text-sm font-bold ${getStatColor(averageStats)}`}>
                          {averageStats}
                        </span>
                      </div>
                    </div>
                  </div>

                                     {/* Abilities */}
                  <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-3"
                        style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                      {t('sheet.abilities', lang)}
                    </h4>
                    
                    <div className="space-y-3">
                      {Object.entries(archetype.abilities).map(([ability, name]) => (
                        <div key={ability} className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 uppercase w-16 font-bold"
                                style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                            {ability}
                          </span>
                          <span className="text-sm text-slate-300 font-bold">
                            {name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Information */}
                <div className="space-y-4">
                                     {/* Description */}
                  <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-3"
                        style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                      {t('sheet.description', lang)}
                    </h4>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-slate-300">
                        {archetype.description}
                      </p>
                      <p className="text-xs text-slate-400">
                        <span className="text-cyan-400 font-bold">{t('sheet.brief', lang)}</span> {archetype.briefDescription}
                      </p>
                      <p className="text-xs text-slate-400">
                        <span className="text-purple-400 font-bold">{t('sheet.theme', lang)}</span> {archetype.theme}
                      </p>
                    </div>
                  </div>

                                     {/* Famous Examples */}
                  <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-3"
                        style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                      {t('sheet.famous_examples', lang)}
                    </h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {archetype.famousExamples.map((example) => (
                        <span key={example} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded border border-slate-600/50">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                                     {/* Associated Factions */}
                  <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-3"
                        style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                      {t('sheet.associated_factions', lang)}
                    </h4>
                    
                    <div className="flex flex-wrap gap-2">
                      {archetype.associatedFactions.map((faction) => (
                        <span key={faction} className="text-xs bg-gradient-to-r from-orange-500/20 to-red-600/20 text-orange-400 px-2 py-1 rounded border border-orange-400/30">
                          {faction.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                                     {/* Iconic Pieces */}
                  <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
                    <h4 className="text-sm font-black text-cyan-400 uppercase tracking-wider mb-3"
                        style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                      {t('sheet.iconic_pieces', lang)}
                    </h4>
                    
                    <p className="text-xs text-slate-300">
                      {archetype.iconicPieces}
                    </p>
                  </div>
                </div>
              </div>

                             {/* Footer with additional information */}
              <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{t('sheet.archetype_id', lang)} {archetype.id}</span>
                  <span>{t('sheet.prefix', lang)} {archetype.prefix}</span>
                  <span>{t('sheet.palette', lang)} {archetype.palette}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchetypeCharacterSheet; 