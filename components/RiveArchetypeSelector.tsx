import React, { useState, useRef, useEffect } from 'react';
import { Rive } from '@rive-app/canvas';
import { ARCHETYPE_DATA } from '../lib/archetypeData';
import { ArchetypeId } from '../types';

interface RiveArchetypeSelectorProps {
  selectedArchetype: ArchetypeId;
  onArchetypeChange: (archetype: ArchetypeId) => void;
  id: string;
  registerElement: (id: string, element: HTMLElement | null) => void;
}

const RiveArchetypeSelector: React.FC<RiveArchetypeSelectorProps> = ({
  selectedArchetype,
  onArchetypeChange,
  id,
  registerElement
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const riveRef = useRef<Rive | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredArchetype, setHoveredArchetype] = useState<ArchetypeId | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    registerElement(id, ref.current);
  }, [id, registerElement]);

  // Initialize Rive animation only for TECH archetype
  useEffect(() => {
    if (!canvasRef.current || selectedArchetype !== ArchetypeId.TECH) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;



    // Configurar canvas
    canvas.width = 400;
    canvas.height = 128;

    const rive = new Rive({
      src: '/assets/boost_selection_interactiondemo.riv',
      canvas: canvas,
      autoplay: true,
      onLoad: () => {

        setIsLoaded(true);
        rive.resizeDrawingSurfaceToCanvas();
      },
      onLoadError: (error) => {
        console.error('❌ Rive animation failed to load:', error);
      },
    });

    riveRef.current = rive;

    // Handle window resize
    const handleResize = () => {
      if (riveRef.current) {
        riveRef.current.resizeDrawingSurfaceToCanvas();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (riveRef.current) {
        riveRef.current.cleanup();
        riveRef.current = null;
      }
    };
  }, [selectedArchetype]);

  const currentCharacterType = ARCHETYPE_DATA[selectedArchetype];

  return (
    <div className="relative" ref={ref}>
      {/* Archetype Selection Background */}
      <div className="relative w-full h-32 bg-slate-900 rounded-lg overflow-hidden">
        {/* Rive Animation only for TECH */}
        {selectedArchetype === ArchetypeId.TECH && (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            width={400}
            height={128}
          />
        )}
        
        {/* Overlay with archetype selection */}
        <div className={`absolute inset-0 ${
          selectedArchetype === ArchetypeId.TECH 
            ? 'bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60' 
            : 'bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80'
        }`}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-2xl mb-2">{currentCharacterType.icon}</div>
              <div className={`font-black text-lg uppercase tracking-wider ${currentCharacterType.colors}`}
                   style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                {currentCharacterType.name}
              </div>
              {selectedArchetype === ArchetypeId.TECH && (
                <div className="text-xs text-cyan-400 mt-1">🎨 Rive Animation Active</div>
              )}
            </div>
          </div>
        </div>

        {/* Click to expand indicator */}
        <div className="absolute bottom-2 right-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-full transition-colors"
          >
            {isExpanded ? '×' : '+'}
          </button>
        </div>
      </div>

      {/* Expanded Archetype Selection */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[60] min-w-[600px]">
          <div className="from-slate-900/98 backdrop-blur will-change-transform-xl shadow-2xl shadow-cyan-400/20 p-6 relative overflow-hidden bg-gradient-to-b via-slate-800/98 to-slate-900/98 border-2 border-cyan-400/50 rounded-lg">
            <div className="relative z-10">
              <h3 className="text-lg font-black text-cyan-400 uppercase tracking-wider mb-4 text-center"
                  style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                SELECT YOUR CHARACTER
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(ARCHETYPE_DATA).map(([archetypeId, data]) => {
                  const isSelected = selectedArchetype === archetypeId;
                  const isHovered = hoveredArchetype === archetypeId;
                  
                  return (
                    <div
                      key={archetypeId}
                      onClick={() => {
                        onArchetypeChange(archetypeId as ArchetypeId);
                        setIsExpanded(false);
                      }}
                      onMouseEnter={() => {
                        setHoveredArchetype(archetypeId as ArchetypeId);
                      }}
                      onMouseLeave={() => {
                        setHoveredArchetype(null);
                      }}
                      className={`relative p-4 rounded-lg cursor-pointer transition-colors transition-transform transition-shadow duration-150 hover:scale-[1.02] group ${
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
                      
                      {/* Rive animation indicator for TECH */}
                      {isHovered && archetypeId === ArchetypeId.TECH && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
                      )}
                      
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="text-2xl">{data.icon}</div>
                        <div className="flex-1">
                          <div className={`font-black text-sm uppercase tracking-wider ${
                            isSelected
                              ? `bg-gradient-to-r ${data.colors} bg-clip-text text-transparent`
                              : 'text-slate-300 group-hover:text-white'
                          }`}
                               style={{ fontFamily: 'var(--font-comic), system-ui' }}>
                            {data.name}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {data.description}
                          </div>
                          {archetypeId === ArchetypeId.TECH && (
                            <div className="text-xs text-cyan-400 mt-1">🎨 Has Rive Animation</div>
                          )}
                        </div>
                        
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiveArchetypeSelector; 