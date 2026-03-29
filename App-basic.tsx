import React, { useState } from 'react';

const AppBasic: React.FC = () => {
  const [count, setCount] = useState(0);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    },
    content: {
      textAlign: 'center' as const,
      padding: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '1rem'
    },
    button: {
      backgroundColor: '#f97316',
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '1rem'
    },
    status: {
      color: '#4ade80',
      marginTop: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>🦸‍♂️ Superhero 3D Customizer - Basic</h1>
        <p>Versión completamente básica sin dependencias externas</p>
        <button 
          style={styles.button}
          onClick={() => setCount(count + 1)}
        >
          Contador: {count}
        </button>
        <div style={styles.status}>
          ✅ Si ves esto, React funciona sin problemas
        </div>
      </div>
    </div>
  );
};

export default AppBasic; 