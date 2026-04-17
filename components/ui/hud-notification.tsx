import React from 'react';
import { Check, X, Info, AlertTriangle, Zap } from 'lucide-react';

const iconMap = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  info: Info,
  default: Zap,
};

const logHudMessage = (type: string, message: string) => {
  const logger = type === 'error' ? console.error : console.log;
  logger(`[hud:${type}] ${message}`);
};

export const hudNotify = {
  success: (message: string) => {
    logHudMessage('success', message);
  },

  error: (message: string) => {
    logHudMessage('error', message);
  },

  warning: (message: string) => {
    logHudMessage('warning', message);
  },

  info: (message: string) => {
    logHudMessage('info', message);
  },

  partChanged: (partType: string, partName: string) => {
    hudNotify.success(`${partType} updated: ${partName}`);
  },

  configSaved: () => {
    hudNotify.success('Configuration saved');
  },

  configLoaded: () => {
    hudNotify.info('Configuration loaded');
  },
};

export const HudToaster: React.FC = () => {
  void iconMap;
  return null;
};
