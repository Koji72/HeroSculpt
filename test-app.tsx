import React from 'react';
import ReactDOM from 'react-dom/client';

const TestApp: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1e293b', 
      color: 'white', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      <h1>🧪 Test App - Superhero 3D Customizer</h1>
      <p>If you can see this, React is working correctly.</p>
      <div style={{ 
        backgroundColor: '#334155', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>System Status:</h3>
        <ul>
          <li>✅ React loaded</li>
          <li>✅ Vite working</li>
          <li>✅ Server on port 5177</li>
          <li>🔄 Verifying main application...</li>
        </ul>
      </div>
      <button 
        onClick={() => {
          console.log('✅ Test button working');
          alert('React is working correctly!');
        }}
        style={{
          backgroundColor: '#f97316',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test React
      </button>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
); 