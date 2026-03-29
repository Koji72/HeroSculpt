import React from 'react';
import { SelectedParts, ArchetypeInfo, PartCategory } from '../types';
import { getCategoryName } from '../lib/utils'; 

interface CharacterViewerPlaceholderProps {
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeInfo | null;
}

const CharacterViewerPlaceholder: React.FC<CharacterViewerPlaceholderProps> = ({ selectedParts, selectedArchetype }) => {
  const characterName = selectedArchetype ? `${selectedArchetype.name} Hero` : "Superhero";
  
  const getPartDisplayName = (partName: string) => {
    if(partName.startsWith("Ninguno")) return partName;
    const parenIndex = partName.indexOf(" (");
    return parenIndex > 0 ? partName.substring(0, parenIndex) : partName;
  }

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg shadow-xl flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"> {/* Darker BG */}
      {/* Placeholder for 3D model */}
      <div className="w-40 h-40 sm:w-56 sm:h-56 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-6xl shadow-inner ring-1 ring-slate-700">
        {selectedArchetype?.icon ? 
            <span className="text-6xl sm:text-7xl opacity-80">{selectedArchetype.icon}</span> 
            : 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 sm:h-28 sm:w-28 text-orange-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}> {/* Orange icon */}
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        }
      </div>
      
      <h2 className="text-xl sm:text-2xl font-bold text-orange-400 mb-1 sm:mb-2">{characterName}</h2> {/* Orange title */}
              <p className="text-xs sm:text-sm text-slate-300 mb-4">Character Visualization (Placeholder)</p>

      <div className="w-full max-w-sm bg-slate-800/50 p-3 rounded-md shadow"> {/* Darker selected parts box */}
        <h4 className="text-sm font-semibold text-orange-400 mb-2 border-b border-slate-700 pb-1.5">Componentes Seleccionados:</h4>
        <div className="space-y-1.5 text-xs max-h-28 sm:max-h-32 overflow-y-auto pr-2 custom-scrollbar">
          {Object.entries(selectedParts || {}).map(([category, part]) => 
            part && typeof part === 'object' && part.id && !part.attributes?.none && selectedArchetype && part.id !== `none_${category}_${selectedArchetype.id}` ? (
              <div key={category} className="flex justify-between items-center bg-slate-700/70 p-1.5 rounded-sm shadow-sm">
                <span className="capitalize font-medium text-slate-300">{getCategoryName(category as PartCategory)}:</span>
                <span className="text-slate-100 truncate ml-2 text-right" title={part.name}>{getPartDisplayName(part.name)}</span>
              </div>
            ) : null
          )}
          {Object.values(selectedParts || {}).every(p => !p || p.attributes?.none) && (
             <p className="text-slate-400 italic text-center py-1">No components selected.</p>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-orange-500/10 rounded-full transform -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div> {/* Orange decorative */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full transform translate-x-1/4 translate-y-1/4 pointer-events-none"></div> {/* Cyan decorative */}
    </div>
  );
};

export default CharacterViewerPlaceholder;