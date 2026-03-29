import React, { useEffect, useRef, useState } from 'react';
import { Rive } from '@rive-app/canvas';
import { ArchetypeId } from '../types';

interface StrongArchetypeButtonProps {
  isSelected: boolean;
  onClick: () => void;
  className?: string;
  width?: number;
  height?: number;
}

const StrongArchetypeButton: React.FC<StrongArchetypeButtonProps> = ({
  isSelected,
  onClick,
  className = '',
  width = 120,
  height = 60
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<Rive | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

  

    // Configurar canvas con dimensiones más grandes para la animación
    canvas.width = width * 2; // Doble resolución para mejor calidad
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Crear instancia de Rive con la animación completa
    const rive = new Rive({
      src: '/assets/boost_selection_interactiondemo.riv',
      canvas: canvas,
      autoplay: true,
      onLoad: () => {
  
        setIsLoaded(true);
        setError(null);
        
        // Configurar canvas
        rive.resizeDrawingSurfaceToCanvas();
        
        // Intentar acceder a state machines para el botón STRONG
        try {
          const stateMachines = rive.stateMachineNames;
    
          
          if (stateMachines.length > 0) {
            const inputs = rive.stateMachineInputs(stateMachines[0]);

            
            // Buscar inputs específicos para el botón STRONG
            const strongInputs = inputs.filter(input => 
              input.name.toLowerCase().includes('strong') ||
              input.name.toLowerCase().includes('button') ||
              input.name.toLowerCase().includes('hover') ||
              input.name.toLowerCase().includes('click')
            );

            
            // Activar la primera state machine si existe
            if (stateMachines.length > 0) {
  
            }
          }
        } catch (err) {
          console.warn('⚠️ Could not access state machine info:', err);
        }
      },
      onLoadError: (err) => {
        console.error('❌ Strong button Rive load error:', err);
        setError(err.toString());
        setIsLoaded(false);
      },
      onStateChange: (event) => {

      }
    });

    riveRef.current = rive;

    return () => {
      if (riveRef.current) {

        riveRef.current.cleanup();
        riveRef.current = null;
      }
    };
  }, [width, height]);

  const handleMouseEnter = () => {

    setIsHovered(true);
    if (riveRef.current) {
      try {
        const stateMachines = riveRef.current.stateMachineNames;
        if (stateMachines.length > 0) {
          const inputs = riveRef.current.stateMachineInputs(stateMachines[0]);
          
          // Activar todos los inputs de hover para el botón STRONG
          inputs.forEach(input => {
            if (input.name.toLowerCase().includes('hover') || 
                input.name.toLowerCase().includes('mouse') ||
                input.name.toLowerCase().includes('strong')) {
              input.value = true;
    
            }
          });
        }
      } catch (err) {
        console.warn('⚠️ Could not trigger hover state:', err);
      }
    }
  };

  const handleMouseLeave = () => {

    setIsHovered(false);
    if (riveRef.current) {
      try {
        const stateMachines = riveRef.current.stateMachineNames;
        if (stateMachines.length > 0) {
          const inputs = riveRef.current.stateMachineInputs(stateMachines[0]);
          
          // Desactivar todos los inputs de hover
          inputs.forEach(input => {
            if (input.name.toLowerCase().includes('hover') || 
                input.name.toLowerCase().includes('mouse') ||
                input.name.toLowerCase().includes('strong')) {
              input.value = false;
  
            }
          });
        }
      } catch (err) {
        console.warn('⚠️ Could not reset hover state:', err);
      }
    }
  };

  const handleClick = () => {

    if (riveRef.current) {
      try {
        const stateMachines = riveRef.current.stateMachineNames;
        if (stateMachines.length > 0) {
          const inputs = riveRef.current.stateMachineInputs(stateMachines[0]);
          
          // Activar todos los inputs de click para el botón STRONG
          inputs.forEach(input => {
            if (input.name.toLowerCase().includes('click') || 
                input.name.toLowerCase().includes('press') ||
                input.name.toLowerCase().includes('strong')) {
              input.value = true;
  
              // Reset después de un breve delay
              setTimeout(() => {
                if (input) input.value = false;
              }, 100);
            }
          });
        }
      } catch (err) {
        console.warn('⚠️ Could not trigger click state:', err);
      }
    }
    onClick();
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
      }}
    >
      <canvas
        ref={canvasRef}
        className={`cursor-pointer transition-colors transition-transform transition-shadow duration-150 ${
          isSelected 
            ? 'scale-105 shadow-lg shadow-orange-400/30' 
            : isHovered 
              ? 'scale-102 shadow-md shadow-cyan-400/20' 
              : 'hover:scale-102'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          display: 'block',
          border: isSelected ? '2px solid var(--color-accent)' : '1px solid rgba(148, 163, 184, 0.3)',
          borderRadius: '8px',
          backgroundColor: 'transparent'
        }}
      />
      
      {/* Overlay minimal para STRONG - solo el texto */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1 left-1 right-1 text-center">
          <div className="text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            STRONG
          </div>
        </div>
      </div>
      
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-slate-700/50 border border-slate-600/50 rounded flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-orange-400 text-xs">Loading...</div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-500/20 border border-red-500/50 rounded flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 text-xs">Error loading animation</div>
            <div className="text-red-300 text-xs mt-1">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrongArchetypeButton; 