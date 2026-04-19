import React, { useState, useEffect } from 'react';
import { useLang, t } from '../lib/i18n';

interface LastPoseIndicatorProps {
  currentPoseIndex: number;
  totalPoses: number;
  isSaving?: boolean;
  lastSaved?: string;
}

const LastPoseIndicator: React.FC<LastPoseIndicatorProps> = ({
  currentPoseIndex,
  totalPoses,
  isSaving = false,
  lastSaved
}) => {
  const { lang } = useLang();
  const [showIndicator, setShowIndicator] = useState(false);

  // Show indicator when saving
  useEffect(() => {
    if (isSaving) {
      setShowIndicator(true);
      const timer = setTimeout(() => setShowIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving]);

  if (totalPoses === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Indicador de guardado */}
      {showIndicator && (
        <div className="bg-green-500/90 backdrop-blur-sm will-change-transform border border-green-400/50 rounded-lg px-3 py-2 shadow-lg shadow-green-500/20 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            <span className="text-white text-xs font-bold">{t('pose.saving', lang)}</span>
          </div>
        </div>
      )}

      {/* Indicador de última pose */}
      <div className="bg-slate-900/90 backdrop-blur-sm will-change-transform border border-slate-600/50 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full" />
          <div className="text-xs text-slate-300">
            <span className="font-bold text-cyan-400">{t('pose.last', lang)}</span>
            <span className="ml-1">
              {currentPoseIndex + 1}/{totalPoses}
            </span>
          </div>
        </div>
        
        {lastSaved && (
          <div className="text-xs text-slate-400 mt-1">
            {t('pose.saved_at', lang)} {new Date(lastSaved).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default LastPoseIndicator; 