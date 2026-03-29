import React, { useEffect, useRef, useState } from 'react';
import { Rive } from '@rive-app/canvas';

interface RiveButtonProps {
  riveFile: string;
  stateMachineName?: string;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  width?: number;
  height?: number;
  title?: string;
}

const RiveButton: React.FC<RiveButtonProps> = ({
  riveFile,
  stateMachineName,
  className = '',
  onClick,
  onHover,
  onLeave,
  width = 120,
  height = 60,
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<Rive | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    canvas.width = width;
    canvas.height = height;

    // Crear instancia de Rive
    const rive = new Rive({
      src: riveFile,
      canvas: canvas,
      autoplay: true,
      stateMachines: stateMachineName ? [stateMachineName] : [],
      onLoad: () => {
  
        setIsLoaded(true);
        setError(null);
        
        // Configurar canvas
        rive.resizeDrawingSurfaceToCanvas();
        
        // Iniciar state machine si existe
        if (stateMachineName) {
          try {
            const inputs = rive.stateMachineInputs(stateMachineName);
    
          } catch (err) {
            console.warn('⚠️ No state machine inputs found');
          }
        }
      },
      onLoadError: (err) => {
        console.error('❌ Rive button load error:', err);
        setError(err.toString());
        setIsLoaded(false);
      }
    });

    riveRef.current = rive;

    return () => {
      if (riveRef.current) {
        riveRef.current.cleanup();
        riveRef.current = null;
      }
    };
  }, [riveFile, stateMachineName, width, height]);

  const handleMouseEnter = () => {
    if (riveRef.current && stateMachineName) {
      try {
        const inputs = riveRef.current.stateMachineInputs(stateMachineName);
        const hoverInput = inputs.find(input => input.name === 'Hover' || input.name === 'hover');
        if (hoverInput) {
          hoverInput.value = true;
        }
      } catch (err) {
        console.warn('⚠️ Could not trigger hover state');
      }
    }
    onHover?.();
  };

  const handleMouseLeave = () => {
    if (riveRef.current && stateMachineName) {
      try {
        const inputs = riveRef.current.stateMachineInputs(stateMachineName);
        const hoverInput = inputs.find(input => input.name === 'Hover' || input.name === 'hover');
        if (hoverInput) {
          hoverInput.value = false;
        }
      } catch (err) {
        console.warn('⚠️ Could not reset hover state');
      }
    }
    onLeave?.();
  };

  const handleClick = () => {
    if (riveRef.current && stateMachineName) {
      try {
        const inputs = riveRef.current.stateMachineInputs(stateMachineName);
        const clickInput = inputs.find(input => input.name === 'Click' || input.name === 'click');
        if (clickInput) {
          clickInput.value = true;
          // Reset after a short delay
          setTimeout(() => {
            if (clickInput) clickInput.value = false;
          }, 100);
        }
      } catch (err) {
        console.warn('⚠️ Could not trigger click state');
      }
    }
    onClick?.();
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      title={title}
    >
      <canvas
        ref={canvasRef}
        className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          display: 'block'
        }}
      />
      
      {error && (
        <div className="absolute inset-0 bg-red-500/20 border border-red-500/50 rounded flex items-center justify-center">
          <span className="text-red-400 text-xs">Error</span>
        </div>
      )}
      
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-slate-700/50 border border-slate-600/50 rounded flex items-center justify-center">
          <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default RiveButton; 