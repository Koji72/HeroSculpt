import React from 'react';

export const GamingBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Base gradient background - very visible and simple */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-purple-700 to-blue-600" />
      
      {/* Secondary gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-transparent to-pink-500/30" />
      
      {/* Simple grid overlay - no animation */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Corner accent lights - static */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent" />
    </div>
  );
}; 