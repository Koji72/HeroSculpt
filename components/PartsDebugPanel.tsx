import React from 'react';
import { SelectedParts, PartCategory } from '../types';

interface PartsDebugPanelProps {
  selectedParts: SelectedParts;
  isVisible: boolean;
}

const PartsDebugPanel: React.FC<PartsDebugPanelProps> = ({ selectedParts, isVisible }) => {
  if (!isVisible) return null;

  const partsList = Object.entries(selectedParts)
    .filter(([key, part]) => part && key !== '__characterName')
    .map(([key, part]) => ({
      category: key,
      partId: part?.id || 'null',
      partName: part?.name || 'Unknown'
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  const duplicateCategories = partsList
    .map(item => item.category)
    .filter((category, index, array) => array.indexOf(category) !== index);

  return (
    <div className="fixed top-20 right-4 z-50 bg-black/90 border border-red-500/50 rounded-lg p-4 max-w-sm max-h-96 overflow-auto">
      <h3 className="text-red-400 font-bold text-sm mb-2 uppercase tracking-wider">
        🔍 Debug Panel - Partes Actuales
      </h3>
      
      <div className="text-xs space-y-1">
        <div className="text-green-400 font-semibold">
          Total: {partsList.length} partes
        </div>
        
        {duplicateCategories.length > 0 && (
          <div className="text-red-400 font-bold bg-red-500/20 p-2 rounded border border-red-500/50">
            ⚠️ DUPLICADOS DETECTADOS: {duplicateCategories.join(', ')}
          </div>
        )}
        
        <div className="space-y-1">
          {partsList.map((item, index) => (
            <div 
              key={index} 
              className={`p-1 rounded text-xs ${
                duplicateCategories.includes(item.category) 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-300' 
                  : 'bg-slate-800/50 text-slate-300'
              }`}
            >
              <div className="font-semibold">{item.category}</div>
              <div className="text-xs opacity-75">{item.partId}</div>
              <div className="text-xs opacity-50">{item.partName}</div>
            </div>
          ))}
        </div>
        
        {partsList.length === 0 && (
          <div className="text-yellow-400 italic">
            No hay partes seleccionadas
          </div>
        )}
      </div>
    </div>
  );
};

export default PartsDebugPanel; 