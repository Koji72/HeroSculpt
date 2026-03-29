import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface GamingButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  active?: boolean;
  glowOnHover?: boolean;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-500/50 hover:from-blue-500 hover:to-blue-600 shadow-blue-500/25',
  secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white border-slate-500/50 hover:from-slate-500 hover:to-slate-600 shadow-slate-500/25',
  danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500/50 hover:from-red-500 hover:to-red-600 shadow-red-500/25',
  success: 'bg-gradient-to-r from-green-600 to-green-700 text-white border-green-500/50 hover:from-green-500 hover:to-green-600 shadow-green-500/25',
  ghost: 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/30 shadow-white/10',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const activeStyles = {
  primary: 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400/50 shadow-amber-500/40',
  secondary: 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400/50 shadow-amber-500/40',
  danger: 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400/50 shadow-amber-500/40',
  success: 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400/50 shadow-amber-500/40',
  ghost: 'bg-amber-500/20 border-amber-400/50 shadow-amber-500/30',
};

export const GamingButton: React.FC<GamingButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  disabled = false,
  active = false,
  glowOnHover = true,
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.15 }}
      className={cn(
        'relative font-semibold rounded-lg border backdrop-blur-sm will-change-transform transition-colors transition-transform transition-shadow duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        active ? activeStyles[variant] : variantStyles[variant],
        sizeStyles[size],
        glowOnHover && !disabled && 'hover:shadow-lg',
        className
      )}
    >
      {/* Glow effect */}
      {glowOnHover && !disabled && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200" />
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      </div>
    </motion.button>
  );
}; 