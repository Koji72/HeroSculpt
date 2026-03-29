import React, { useState } from 'react';

const AppSimple: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      <h1>🦸‍♂️ Superhero 3D Customizer - Versión Simple</h1>
      <p>Esta es una versión simplificada para diagnosticar problemas.</p>
      
      <div style={{ 
        backgroundColor: '#334155', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Estado del Sistema:</h3>
        <ul>
          <li>✅ React cargado</li>
          <li>✅ Vite funcionando</li>
          <li>✅ Servidor en puerto 5177</li>
          <li>✅ Aplicación principal cargada</li>
        </ul>
      </div>

      <div style={{ margin: '20px 0' }}>
        <h3>Contador de Prueba: {count}</h3>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Incrementar
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{
            backgroundColor: '#64748b',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Resetear
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#475569', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Próximos Pasos:</h3>
        <ol>
          <li>Si puedes ver esta página, React está funcionando</li>
          <li>Si el contador funciona, el estado está funcionando</li>
          <li>Ahora podemos diagnosticar la aplicación completa</li>
        </ol>
      </div>
    </div>
  );
};

export default AppSimple; 