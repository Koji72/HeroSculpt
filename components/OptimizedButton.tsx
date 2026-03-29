import React, { ReactNode } from 'react';

interface OptimizedButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'teal' | 'amber' | 'emerald' | 'indigo' | 'green' | 'blue' | 'red' | 'purple';
  className?: string;
  title?: string;
  disabled?: boolean;
}

const OptimizedButton: React.FC<OptimizedButtonProps> = ({
  onClick,
  children,
  variant = 'blue',
  className = '',
  title,
  disabled = false
}) => {
  const getVariantStyles = () => {
    const baseStyles = {
      fontFamily: 'var(--font-comic), system-ui',
      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      transition: 'background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease',
      willChange: 'background, transform, box-shadow'
    };

    const variants = {
      teal: {
        normal: 'linear-gradient(to right, rgb(13 148 136), rgb(20 184 166))',
        hover: 'linear-gradient(to right, rgb(20 184 166), rgb(34 197 94))',
        shadow: '0 10px 25px -5px rgba(20 184 166, 0.5)'
      },
      amber: {
        normal: 'linear-gradient(to right, rgb(217 119 6), rgb(245 158 11))',
        hover: 'linear-gradient(to right, rgb(245 158 11), rgb(251 191 36))',
        shadow: '0 10px 25px -5px rgba(245 158 11, 0.5)'
      },
      emerald: {
        normal: 'linear-gradient(to right, rgb(5 150 105), rgb(16 185 129))',
        hover: 'linear-gradient(to right, rgb(16 185 129), rgb(34 197 94))',
        shadow: '0 10px 25px -5px rgba(16 185 129, 0.5)'
      },
      indigo: {
        normal: 'linear-gradient(to right, rgb(79 70 229), rgb(99 102 241))',
        hover: 'linear-gradient(to right, rgb(99 102 241), rgb(129 140 248))',
        shadow: '0 10px 25px -5px rgba(99 102 241, 0.5)'
      },
      green: {
        normal: 'linear-gradient(to right, rgb(21 128 61), rgb(34 197 94))',
        hover: 'linear-gradient(to right, rgb(34 197 94), rgb(74 222 128))',
        shadow: '0 10px 25px -5px rgba(34 197 94, 0.5)'
      },
      blue: {
        normal: 'linear-gradient(to right, rgb(37 99 235), rgb(59 130 246))',
        hover: 'linear-gradient(to right, rgb(59 130 246), rgb(96 165 250))',
        shadow: '0 10px 25px -5px rgba(59 130 246, 0.5)'
      },
      red: {
        normal: 'linear-gradient(to right, rgb(185 28 28), rgb(220 38 38))',
        hover: 'linear-gradient(to right, rgb(220 38 38), rgb(239 68 68))',
        shadow: '0 10px 25px -5px rgba(220 38 38, 0.5)'
      },
      purple: {
        normal: 'linear-gradient(to right, rgb(126 34 206), rgb(147 51 234))',
        hover: 'linear-gradient(to right, rgb(147 51 234), rgb(168 85 247))',
        shadow: '0 10px 25px -5px rgba(147 51 234, 0.5)'
      }
    };

    return { ...baseStyles, ...variants[variant] };
  };

  const styles = getVariantStyles();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.background = styles.hover;
    e.currentTarget.style.transform = 'scale(1.02)';
    e.currentTarget.style.boxShadow = styles.shadow;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.background = styles.normal;
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 text-white font-black text-sm uppercase tracking-wider rounded-md relative overflow-hidden group ${className}`}
      style={{
        background: styles.normal,
        ...styles
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={title}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-200" />
      <div className="relative z-10 flex items-center gap-2">
        {children}
      </div>
    </button>
  );
};

export default OptimizedButton; 