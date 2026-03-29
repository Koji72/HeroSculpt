import React, { useState } from 'react';

const AppMinimal: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">🦸‍♂️ Superhero 3D Customizer</h1>
        <p className="text-xl mb-8">Versión mínima para debugging</p>
        <div className="space-y-4">
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold"
          >
            Contador: {count}
          </button>
          <div className="text-green-400">
            ✅ Si ves esto, React funciona correctamente
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMinimal; 