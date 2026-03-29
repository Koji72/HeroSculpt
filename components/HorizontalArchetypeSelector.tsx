import React from 'react';
import { ArchetypeId } from '../types';

interface HorizontalArchetypeSelectorProps {
  selectedArchetype: ArchetypeId;
  onArchetypeChange: (archetype: ArchetypeId) => void;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
}

// Simplified archetype data for horizontal display
const ARCHETYPE_DATA = {
  [ArchetypeId.STRONG]: {
    name: 'STRONG',
    icon: '💪',
    colors: 'from-orange-500 to-red-600',
    bgColors: 'from-orange-500/20 to-red-600/20'
  },
  [ArchetypeId.JUSTICIERO]: {
    name: 'JUSTICIERO',
    icon: '⚖️',
    colors: 'from-blue-500 to-cyan-600',
    bgColors: 'from-blue-500/20 to-cyan-600/20'
  },
  [ArchetypeId.SPEEDSTER]: {
    name: 'SPEEDSTER',
    icon: '⚡',
    colors: 'from-yellow-400 to-amber-500',
    bgColors: 'from-yellow-400/20 to-amber-500/20'
  },
  [ArchetypeId.MYSTIC]: {
    name: 'MYSTIC',
    icon: '🔮',
    colors: 'from-purple-500 to-indigo-600',
    bgColors: 'from-purple-500/20 to-indigo-600/20'
  },
  [ArchetypeId.TECH]: {
    name: 'TECH',
    icon: '🤖',
    colors: 'from-cyan-400 to-blue-500',
    bgColors: 'from-cyan-400/20 to-blue-500/20'
  }
};

const HorizontalArchetypeSelector: React.FC<HorizontalArchetypeSelectorProps> = ({ 
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
    <div ref={ref} className="w-full">
      {/* Horizontal Archetype Tabs */}
      <div className="flex gap-2 bg-slate-900/80 backdrop-blur will-change-transform-xl border border-slate-600/50 rounded-lg p-2 shadow-xl">
        {Object.entries(ARCHETYPE_DATA).map(([archetypeId, data]) => {
          const isSelected = selectedArchetype === archetypeId;
          
          return (
            <button
              key={archetypeId}
              onClick={() => onArchetypeChange(archetypeId as ArchetypeId)}
              className={`relative flex items-center gap-3 px-4 py-3 transition-colors transition-transform transition-shadow duration-150 group overflow-hidden marvel-button ${
                isSelected
                  ? `marvel-button-active bg-gradient-to-r ${data.bgColors} border-2 border-orange-400/60 shadow-lg shadow-orange-400/20`
                  : 'marvel-button-inactive bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50'
              }`}
              style={{
                fontFamily: 'var(--font-comic), system-ui',
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
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
              
              <div className="relative z-10 flex items-center gap-3">
                {/* Icon */}
                <div className="text-2xl">{data.icon}</div>
                
                {/* Name */}
                <div className={`font-black text-sm uppercase tracking-wider ${
                  isSelected
                    ? `bg-gradient-to-r ${data.colors} bg-clip-text text-transparent`
                    : 'text-slate-300 group-hover:text-white'
                }`}
                     style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                  {data.name}
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Current Archetype Label */}
      <div className="text-center mt-2">
        <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider"
             style={{ fontFamily: 'var(--font-comic), system-ui' }}>
          Selected Archetype: {ARCHETYPE_DATA[selectedArchetype].name}
        </div>
      </div>
    </div>
  );
};

export default HorizontalArchetypeSelector; 