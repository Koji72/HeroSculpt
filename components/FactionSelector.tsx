import React, { useState } from 'react';
import { ArchetypeId } from '../types';

interface SimpleArchetypeSelectorProps {
  selectedArchetype: ArchetypeId;
  onArchetypeChange: (archetype: ArchetypeId) => void;
}

// Datos de facciones (cada facción es un arquetipo)
const FACTION_DATA = {
  [ArchetypeId.STRONG]: {
    name: 'POWERHOUSE',
    icon: '💪',
    description: 'Raw strength and unbreakable defense'
  },
  [ArchetypeId.JUSTICIERO]: {
    name: 'GALACTIC_GUARDIANS',
    icon: '⚖️',
    description: 'Justice and protection for all'
  },
  [ArchetypeId.SPEEDSTER]: {
    name: 'SPEEDCORE',
    icon: '⚡',
    description: 'Lightning speed and agility'
  },
  [ArchetypeId.MYSTIC]: {
    name: 'MYSTICS',
    icon: '🔮',
    description: 'Ancient magic and mystical powers'
  },
  [ArchetypeId.TECH]: {
    name: 'TECHNOMANCERS',
    icon: '🤖',
    description: 'Advanced technology and innovation'
  },
  [ArchetypeId.PARAGON]: {
    name: 'ETERNAL_DYNASTIES',
    icon: '🦸',
    description: 'The ultimate hero with balanced powers'
  },
  [ArchetypeId.ENERGY_PRO]: {
    name: 'ENERGY_CORE',
    icon: '🔥',
    description: 'Master of energy manipulation'
  },
  [ArchetypeId.WEAPON_MASTER]: {
    name: 'WARRIORS',
    icon: '⚔️',
    description: 'Master of weapons and combat'
  },
  [ArchetypeId.SHAPESHIFTER]: {
    name: 'ALPHA_MUTANTS',
    icon: '🦎',
    description: 'Master of biological adaptation'
  },
  [ArchetypeId.MENTALIST]: {
    name: 'MIND_CUSTODIANS',
    icon: '🧠',
    description: 'Master of psychic powers'
  },
  [ArchetypeId.GADGETEER]: {
    name: 'ARCANOTECH',
    icon: '🔧',
    description: 'Master of gadgets and technology'
  },
  [ArchetypeId.MONSTER]: {
    name: 'INFESTED',
    icon: '👹',
    description: 'Raw power and primal fury'
  },
  [ArchetypeId.ELEMENTAL]: {
    name: 'CORE_ELEMENTALS',
    icon: '🌪️',
    description: 'Master of natural elements'
  },
  [ArchetypeId.CONSTRUCT]: {
    name: 'SPACE_EXILES',
    icon: '🤖',
    description: 'Artificial being with unique abilities'
  },
  [ArchetypeId.BLASTER]: {
    name: 'VOX',
    icon: '🎯',
    description: 'Master of long-range attacks'
  },
  [ArchetypeId.TRICKSTER]: {
    name: 'NIHILISTS',
    icon: '🎭',
    description: 'Master of illusions and deception'
  },
  [ArchetypeId.CONTROLLER]: {
    name: 'PSIONICS',
    icon: '🎮',
    description: 'Master of battlefield control'
  },
  [ArchetypeId.SUMMONER]: {
    name: 'CRIMSON_LEGION',
    icon: '👻',
    description: 'Master of summoning entities'
  },
  [ArchetypeId.ANTIHERO]: {
    name: 'ABYSSAL_CORRUPTED',
    icon: '⚔️',
    description: 'Violent but effective protector'
  }
};

const FactionSelector: React.FC<SimpleArchetypeSelectorProps> = ({
  selectedArchetype,
  onArchetypeChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);



  return (
    <div className="relative">
      {/* Header */}
      <div 
        className="from-slate-900/95 backdrop-blur will-change-transform-xl shadow-2xl shadow-orange-400/20 relative overflow-hidden bg-gradient-to-r via-slate-800/95 to-slate-900/95 border-2 border-orange-400/50 rounded-lg transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] px-6 py-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl">
              {FACTION_DATA[selectedArchetype]?.icon || '❓'}
            </div>
            <div>
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-black">
                HERO FACTION
              </div>
              <div className="text-xl font-black text-orange-400 uppercase tracking-widest">
                {FACTION_DATA[selectedArchetype]?.name || 'UNKNOWN'}
              </div>
              <div className="text-xs text-slate-400 font-bold">
                {FACTION_DATA[selectedArchetype]?.description || 'No description'}
              </div>
            </div>
          </div>
          
          {/* Expand/Collapse indicator */}
          <div className={`transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded Selection Panel */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[60] min-w-[600px]">
          <div className="from-slate-900/98 backdrop-blur will-change-transform-xl shadow-2xl shadow-cyan-400/20 p-6 relative overflow-hidden bg-gradient-to-b via-slate-800/98 to-slate-900/98 border-2 border-cyan-400/50 rounded-lg">
            <div className="relative z-10">
              <h3 className="text-lg font-black text-cyan-400 uppercase tracking-wider mb-4 text-center">
                SELECT YOUR FACTION ({Object.keys(FACTION_DATA).length} FACTIONS)
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(FACTION_DATA).map(([archetypeId, data]) => {
                  const isSelected = selectedArchetype === archetypeId;
                  
                  return (
                    <div
                      key={archetypeId}
                      onClick={() => {
                    
                        onArchetypeChange(archetypeId as ArchetypeId);
                        setIsExpanded(false);
                      }}
                      className={`relative p-4 rounded-lg cursor-pointer transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] group ${
                        isSelected 
                          ? 'bg-gradient-to-r from-orange-500/20 to-red-600/20 border-2 border-orange-400 shadow-lg shadow-orange-400/30'
                          : 'bg-slate-800/50 border border-slate-600/50 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="relative z-10 flex items-center gap-4">
                        <div className="text-4xl">{data.icon}</div>
                        <div className="flex-1">
                          <div className="text-lg font-black uppercase tracking-wider text-orange-400">
                            {data.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {data.description}
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-400/50">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 bg-slate-800/80 text-slate-300 hover:text-white rounded-lg transition-colors transition-transform transition-shadow duration-150"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Backdrop to close when clicking outside */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[55]" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default FactionSelector; 