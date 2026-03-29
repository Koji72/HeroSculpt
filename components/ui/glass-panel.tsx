import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'blue' | 'amber' | 'red' | 'green' | 'purple';
  variant?: 'default' | 'sidebar' | 'floating' | 'toolbar';
}

const glowColorStyles = {
  blue: 'shadow-blue-500/20 border-blue-500/30',
  amber: 'shadow-amber-500/20 border-amber-500/30',
  red: 'shadow-red-500/20 border-red-500/30',
  green: 'shadow-green-500/20 border-green-500/30',
  purple: 'shadow-purple-500/20 border-purple-500/30',
};

const variantStyles = {
  default: 'bg-black/40 backdrop-blur will-change-transform-lg border border-white/10',
  sidebar: 'bg-black/50 backdrop-blur will-change-transform-xl border-l border-white/20',
  floating: 'bg-black/30 backdrop-blur will-change-transform-md border border-white/10 rounded-xl',
  toolbar: 'bg-black/60 backdrop-blur will-change-transform-lg border border-white/20 rounded-lg',
};

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(({
  children,
  className,
  glowColor = 'blue',
  variant = 'default'
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        variantStyles[variant],
        glowColorStyles[glowColor],
        'shadow-2xl relative overflow-hidden',
        className
      )}
    >
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}); 