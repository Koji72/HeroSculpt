import React from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Check, X, Info, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom toast component with gaming aesthetics
const HudToast = ({ message, type, icon: Icon }: { message: string; type: string; icon?: React.ComponentType<any> }) => {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-900/80 border-green-500/50 text-green-100 shadow-green-500/20';
      case 'error':
        return 'bg-red-900/80 border-red-500/50 text-red-100 shadow-red-500/20';
      case 'warning':
        return 'bg-amber-900/80 border-amber-500/50 text-amber-100 shadow-amber-500/20';
      case 'info':
        return 'bg-blue-900/80 border-blue-500/50 text-blue-100 shadow-blue-500/20';
      default:
        return 'bg-slate-900/80 border-slate-500/50 text-slate-100 shadow-slate-500/20';
    }
  };

  const getIcon = () => {
    if (Icon) return <Icon size={20} />;
    
    switch (type) {
      case 'success':
        return <Check size={20} />;
      case 'error':
        return <X size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Zap size={20} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur will-change-transform-lg shadow-lg
        ${getStyles()}
        font-medium text-sm max-w-md
      `}
    >
      {getIcon()}
      <span>{message}</span>
    </motion.div>
  );
};

// HUD notification functions
export const hudNotify = {
  success: (message: string, icon?: React.ComponentType<any>) => {
    toast.custom(
      <HudToast message={message} type="success" icon={icon} />,
      {
        duration: 3000,
        position: 'top-right',
      }
    );
  },

  error: (message: string, icon?: React.ComponentType<any>) => {
    toast.custom(
      <HudToast message={message} type="error" icon={icon} />,
      {
        duration: 4000,
        position: 'top-right',
      }
    );
  },

  warning: (message: string, icon?: React.ComponentType<any>) => {
    toast.custom(
      <HudToast message={message} type="warning" icon={icon} />,
      {
        duration: 3500,
        position: 'top-right',
      }
    );
  },

  info: (message: string, icon?: React.ComponentType<any>) => {
    toast.custom(
      <HudToast message={message} type="info" icon={icon} />,
      {
        duration: 3000,
        position: 'top-right',
      }
    );
  },

  partChanged: (partType: string, partName: string) => {
    hudNotify.success(`${partType} updated: ${partName}`, Zap);
  },

  configSaved: () => {
    hudNotify.success('Configuration saved', Check);
  },

  configLoaded: () => {
    hudNotify.info('Configuration loaded', Info);
  },
};

// Toaster component with gaming theme
export const HudToaster: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
        },
      }}
    />
  );
}; 