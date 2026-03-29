import React, { useState } from 'react';
import { ArchetypeId, PartCategory, SelectedParts } from './types';
import { DEFAULT_STRONG_BUILD } from './constants';

const AppTest: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeId | null>(ArchetypeId.STRONG);
  const [selectedParts, setSelectedParts] = useState<SelectedParts>(DEFAULT_STRONG_BUILD);
  const [activeCategory, setActiveCategory] = useState<PartCategory | null>(null);
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">🦸‍♂️ Superhero 3D Customizer - Test</h1>
        
        {/* Test básico */}
        <div className="mb-8 p-4 bg-slate-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">✅ Test Básico</h2>
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold"
          >
            Contador: {count}
          </button>
        </div>

        {/* Test de tipos */}
        <div className="mb-8 p-4 bg-slate-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">🔧 Test de Tipos</h2>
          <div className="space-y-2">
            <div>Arquetipo: {selectedArchetype}</div>
            <div>Categoría activa: {activeCategory || 'Ninguna'}</div>
            <div>Partes seleccionadas: {Object.keys(selectedParts).length}</div>
          </div>
        </div>

        {/* Test de botones */}
        <div className="mb-8 p-4 bg-slate-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">🎯 Test de Interacción</h2>
          <div className="space-x-4">
            <button 
              onClick={() => setSelectedArchetype(ArchetypeId.STRONG)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Strong
            </button>
            <button 
              onClick={() => setSelectedArchetype(ArchetypeId.JUSTICIERO)}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Justiciero
            </button>
            <button 
              onClick={() => setActiveCategory(PartCategory.HEAD)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              Categoría Head
            </button>
          </div>
        </div>

        <div className="text-green-400 text-lg">
          ✅ Si ves todo esto, los tipos y estados funcionan correctamente
        </div>
      </div>
    </div>
  );
};

export default AppTest; 