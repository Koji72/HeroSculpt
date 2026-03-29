import React, { useEffect, useRef, useState } from 'react';
import { ArchetypeId } from '../types';
import { ARCHETYPE_DATA } from '../lib/archetypeData';
import ArchetypeCharacterSheet from './ArchetypeCharacterSheet';
import RiveButton from './RiveButton';
import StrongArchetypeButton from './StrongArchetypeButton';

interface ArchetypeSelectorProps {
  selectedArchetype: ArchetypeId;
  onArchetypeChange: (archetype: ArchetypeId) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Usar los datos de tipos de personajes del archivo centralizado

const ArchetypeSelector: React.FC<ArchetypeSelectorProps> = ({ selectedArchetype, onArchetypeChange, isOpen, onClose }) => {
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);

  // No need for ref and registerElement here, as this component is now a modal
  // useEffect(() => {
  //   registerElement(id, ref.current);
  // }, [id, registerElement]);

  const currentCharacterType = ARCHETYPE_DATA[selectedArchetype];

  if (!isOpen) {
    return null; // Don't render anything if not open
  }

  return (
    <>
      {/* Expanded Selection Panel */}
      {console.log('🔍 Renderizando panel, isExpanded:', isOpen)}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] min-w-[900px] max-w-[95vw] max-h-[80vh] overflow-y-auto">
        <div className="from-slate-900/98 backdrop-blur will-change-transform-xl shadow-2xl shadow-cyan-400/20 p-6 relative overflow-hidden bg-gradient-to-b via-slate-800/98 to-slate-900/98 border-2 border-cyan-400/50 rounded-lg">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-cyan-400/5 animate-holographic" />
          
          <div className="relative z-10">
            <h3 className="text-lg font-black text-cyan-400 uppercase tracking-wider mb-4 text-center"
                style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              ALL CHARACTER TYPES AVAILABLE
            </h3>
            
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {console.log('🔍 ARCHETYPE_DATA:', Object.keys(ARCHETYPE_DATA))}
              {Object.entries(ARCHETYPE_DATA).map(([archetypeId, data]) => {
                const isSelected = selectedArchetype === archetypeId;
                
                return (
                  <div
                    key={archetypeId}
                    onClick={() => {
                      onArchetypeChange(archetypeId as ArchetypeId);
                      onClose(); // Close panel after selection
                    }}
                    className={`relative p-3 rounded-lg cursor-pointer transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] group ${
                      isSelected 
                        ? `bg-gradient-to-r ${data.bgColors} border-2 border-orange-400 shadow-lg shadow-orange-400/30`
                        : 'bg-slate-800/50 border border-slate-600/50 hover:border-cyan-400/50'
                    }`}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/10 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center gap-2">
                      <div className="text-3xl">{data.icon}</div>
                      <div className="flex-1 w-full">
                        <div className={`text-base font-black uppercase tracking-wider bg-gradient-to-r ${data.colors} bg-clip-text text-transparent`}
                             style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                          {data.name}
                        </div>
                        <div className="text-xs font-bold text-slate-300 mb-1"
                             style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                          {data.title}
                        </div>
                        <div className="text-xs text-slate-400 mb-2 line-clamp-2">
                          {data.description}
                        </div>
                        <div className="text-xs text-cyan-400 font-bold mb-2">
                          {data.theme}
                        </div>
                        
                        {/* Stats bars */}
                        <div className="space-y-1">
                          {Object.entries(data.stats).slice(0, 2).map(([stat, value]) => (
                            <div key={stat} className="flex items-center gap-1">
                              <span className="text-xs text-slate-400 uppercase w-8">{stat}</span>
                              <div className="flex-1 bg-slate-700 rounded-full h-1">
                                <div 
                                  className={`h-1 rounded-full bg-gradient-to-r ${data.colors} transition-colors transition-transform transition-shadow duration-1000`}
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-300 w-6"> {value}</span>
                            </div>
                          ))}
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
                onClick={onClose} // Use onClose prop
                className="relative hover:shadow-lg hover:shadow-cyan-400/30 overflow-hidden bg-slate-800/80 text-slate-300 hover:text-white hover:scale-[1.02] transition-colors transition-transform transition-shadow duration-150 px-4 py-2 marvel-button marvel-button-inactive group"
                style={{ 
                  fontFamily: 'var(--font-comic), system-ui',
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                <div className="absolute from-white/0 group-hover:translate-x-full bg-gradient-to-r via-white/20 to-white/0 transition-transform duration-200 inset-0 transform -translate-x-full" />
                <span className="relative z-10">CLOSE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Backdrop to close when clicking outside */}
      <div 
        className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-sm will-change-transform" 
        onClick={onClose}
      />

      {/* Ficha de Características */}
      {showCharacterSheet && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[70]">
          <ArchetypeCharacterSheet 
            archetype={currentCharacterType}
            isExpanded={true}
          />
        </div>
      )}

      {/* Backdrop para cerrar ficha de características */}
      {showCharacterSheet && (
        <div 
          className="fixed inset-0 z-[65]" 
          onClick={() => setShowCharacterSheet(false)}
        />
      )}
    </>
  );
};

export default ArchetypeSelector;