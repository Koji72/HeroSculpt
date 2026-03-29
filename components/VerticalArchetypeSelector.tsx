import React from 'react';
import { ArchetypeId } from '../types';

interface VerticalArchetypeSelectorProps {
  selectedArchetype: ArchetypeId;
  onArchetypeChange: (archetype: ArchetypeId) => void;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
}

// Archetype data for vertical display
const ARCHETYPE_DATA = {
  [ArchetypeId.STRONG]: {
    name: 'STRONG',
    icon: '💪',
    colors: 'from-orange-500 to-red-600',
    bgColors: 'from-orange-500/20 to-red-600/20',
    description: 'Tank'
  },
  [ArchetypeId.JUSTICIERO]: {
    name: 'JUSTICIERO',
    icon: '⚖️',
    colors: 'from-blue-500 to-cyan-600',
    bgColors: 'from-blue-500/20 to-cyan-600/20',
    description: 'Guardian'
  },
  [ArchetypeId.SPEEDSTER]: {
    name: 'SPEEDSTER',
    icon: '⚡',
    colors: 'from-yellow-400 to-amber-500',
    bgColors: 'from-yellow-400/20 to-amber-500/20',
    description: 'Speed'
  },
  [ArchetypeId.MYSTIC]: {
    name: 'MYSTIC',
    icon: '🔮',
    colors: 'from-purple-500 to-indigo-600',
    bgColors: 'from-purple-500/20 to-indigo-600/20',
    description: 'Magic'
  },
  [ArchetypeId.TECH]: {
    name: 'TECH',
    icon: '🤖',
    colors: 'from-cyan-400 to-blue-500',
    bgColors: 'from-cyan-400/20 to-blue-500/20',
    description: 'Technology'
  }
};

const VerticalArchetypeSelector: React.FC<VerticalArchetypeSelectorProps> = ({ 
  selectedArchetype, 
  onArchetypeChange, 
  id, 
  registerElement 
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    registerElement(id, ref.current);
  }, [id, registerElement]);

  return (
    <div ref={ref} className="flex flex-col gap-2 sm:gap-3 w-full h-full">
      {/* Title */}
      <div className="text-center mb-1 sm:mb-2 flex-shrink-0">
        <div className="text-base sm:text-lg font-black uppercase tracking-wider mb-1 transition-colors transition-transform transition-shadow duration-150">
          ARCHETYPES
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent opacity-80 animate-pulse" />
      </div>

      {/* Archetype Buttons - Scrolls if overflow */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {Object.entries(ARCHETYPE_DATA).map(([archetypeId, data]) => {
          const isSelected = selectedArchetype === archetypeId;
          
          return (
            <button
              key={archetypeId}
              onClick={() => onArchetypeChange(archetypeId as ArchetypeId)}
              className={`relative w-full flex items-center gap-2 sm:gap-3 lg:gap-4 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 transition-colors transition-transform transition-shadow duration-150 group overflow-hidden marvel-button ${
                isSelected
                  ? `marvel-button-active bg-gradient-to-r ${data.bgColors} shadow-xl shadow-orange-400/30 scale-[1.02]`
                  : 'marvel-button-inactive bg-slate-800/50 hover:bg-slate-700/50 hover:shadow-lg hover:shadow-cyan-400/20'
              }`}
              style={{
                fontFamily: 'var(--font-comic), system-ui',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                animation: isSelected ? 'glow 2s ease-in-out infinite alternate' : undefined
              }}
            >
              {/* Marvel Rivals style background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-200" />
              
              {/* Additional hover glow effect */}
              <div className={`absolute inset-0 transition-colors transition-transform transition-shadow duration-150 ${
                isSelected 
                  ? 'bg-gradient-to-r from-orange-400/10 via-cyan-400/5 to-orange-400/10' 
                  : 'bg-gradient-to-r from-slate-400/0 via-slate-400/5 to-slate-400/0 opacity-0 group-hover:opacity-100'
              }`} />
              
              <div className="relative z-10 flex items-center gap-2 sm:gap-3 w-full">
                {/* Icon */}
                <div className="text-lg sm:text-xl lg:text-2xl flex-shrink-0 transition-colors transition-transform transition-shadow duration-150 group-hover:scale-[1.05]">
                  {data.icon}
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col items-start flex-grow min-w-0">
                  {/* Name */}
                  <div className={`font-black text-sm sm:text-base uppercase tracking-wider transition-colors transition-transform transition-shadow duration-150 ${
                    isSelected
                      ? `bg-gradient-to-r ${data.colors} bg-clip-text text-transparent`
                      : 'text-slate-300 group-hover:text-white'
                  }`}
                       style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                    {data.name}
                  </div>
                  
                  {/* Description */}
                  <div className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors transition-transform transition-shadow duration-150 ${
                    isSelected ? 'text-orange-300' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                       style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                    {data.description}
                  </div>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping flex-shrink-0 relative">
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-orange-400"></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalArchetypeSelector; 