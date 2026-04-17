import React, { useState, useEffect } from 'react';
import { useLang, t } from '../lib/i18n';

interface PoseNavigationProps {
  savedPoses: Array<{
    id: string;
    name: string;
    configuration: any;
    source: 'purchase' | 'saved';
    date: string;
  }>;
  currentPoseIndex: number;
  onPreviousPose: () => void;
  onNextPose: () => void;
  onSelectPose: (index: number) => void;
  onRenamePose?: (index: number, newName: string) => void;
  onSaveAsNew?: () => void;
  onDeletePose?: (index: number) => void;
}

const PoseNavigation: React.FC<PoseNavigationProps> = ({
  savedPoses,
  currentPoseIndex,
  onPreviousPose,
  onNextPose,
  onSelectPose,
  onRenamePose,
  onSaveAsNew,
  onDeletePose,
}) => {
  const { lang } = useLang();
  const [showPoseSelector, setShowPoseSelector] = useState(false);
  const [editingPoseIndex, setEditingPoseIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => { setConfirmingDelete(false); }, [currentPoseIndex]);

  if (!savedPoses || savedPoses.length === 0) {
    return (
      <div className="absolute top-2 left-2 flex items-center gap-3 z-30">
        <div className="px-3 py-1 bg-slate-800/80 rounded-full backdrop-blur-sm will-change-transform border border-slate-600/50 text-white text-sm font-medium opacity-50">
          0/0
        </div>
      </div>
    );
  }

  const handleCounterClick = () => {
    setShowPoseSelector(!showPoseSelector);
    setConfirmingDelete(false);
  };

  const handlePoseSelect = (index: number) => {
    onSelectPose(index);
    setShowPoseSelector(false);
  };

  const handleRenameClick = (index: number, currentName: string) => {
    setEditingPoseIndex(index);
    setEditingName(currentName);
  };

  const handleRenameSave = () => {
    if (editingPoseIndex !== null && editingName.trim() && onRenamePose) {
      onRenamePose(editingPoseIndex, editingName.trim());
      setEditingPoseIndex(null);
      setEditingName('');
    }
  };

  const handleRenameCancel = () => {
    setEditingPoseIndex(null);
    setEditingName('');
  };

  const handleRenameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSave();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  // Contador de poses sincronizado con la biblioteca real
  const totalPoses = savedPoses?.length || 0;
  const currentIndex = totalPoses > 0 ? currentPoseIndex + 1 : 0;

  return (
    <div className="absolute top-2 left-2 flex items-center gap-3 z-30">
      {/* Botón Anterior */}
      <button
        onClick={onPreviousPose}
        disabled={savedPoses.length <= 1}
        className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-green-400 hover:text-green-300 border-green-400/20 hover:border-green-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        title={`Pose anterior: ${savedPoses[currentPoseIndex > 0 ? currentPoseIndex - 1 : savedPoses.length - 1]?.name}`}
      >
        ◀
      </button>
      
      {/* Contador Clickable */}
      <div className="relative">
        <button
          onClick={handleCounterClick}
          className="backdrop-blur-sm shadow-lg bg-slate-800/80 hover:bg-slate-700/90 border-slate-600/50 hover:border-slate-500/60 text-white text-sm rounded-full transition-colors transition-transform transition-shadow duration-200 px-3 py-1 will-change-transform border font-medium cursor-pointer"
          title="Click para seleccionar pose"
        >
          {currentIndex}/{totalPoses}
        </button>
        {/* Eliminado: bloque de nombre de pose actual */}
      </div>
      
      {/* Botón Siguiente */}
      <button
        onClick={onNextPose}
        disabled={savedPoses.length <= 1}
        className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-green-400 hover:text-green-300 border-green-400/20 hover:border-green-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        title={`Siguiente pose: ${savedPoses[currentPoseIndex < savedPoses.length - 1 ? currentPoseIndex + 1 : 0]?.name}`}
      >
        ▶
      </button>

      {/* Botón Borrar (solo para poses guardadas) */}
      {savedPoses[currentPoseIndex]?.source === 'saved' && onDeletePose && (
        confirmingDelete ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onDeletePose(currentPoseIndex); setConfirmingDelete(false); }}
              className="px-2 py-1 backdrop-blur-sm shadow-lg bg-red-700/90 hover:bg-red-600 text-white text-xs border-red-400/40 rounded-full transition-colors duration-200 border font-medium"
            >
              {t('pose.delete', lang)}
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="px-2 py-1 backdrop-blur-sm shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 text-xs border-slate-600/50 rounded-full transition-colors duration-200 border font-medium"
            >
              {t('pose.cancel', lang)}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-red-700/80 text-red-400 hover:text-white border-red-400/20 hover:border-red-400/40 rounded-full transition-colors duration-200 will-change-transform border items-center justify-center"
            title={t('pose.delete_confirm', lang)}
          >
            🗑
          </button>
        )
      )}

      {/* Botón Save como Nueva (solo para poses de compra) */}
      {savedPoses[currentPoseIndex]?.source === 'purchase' && onSaveAsNew && (
        <button
          onClick={onSaveAsNew}
          className="backdrop-blur-sm shadow-lg bg-blue-600/80 hover:bg-blue-500/90 text-white text-xs border-blue-400/20 hover:border-blue-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 px-3 py-1 font-medium will-change-transform border cursor-pointer"
          title={t('pose.save_as_new_title', lang)}
        >
          {t('pose.save_as_new', lang)}
        </button>
      )}

      {/* Pose selector dropdown */}
      {showPoseSelector && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setShowPoseSelector(false); setConfirmingDelete(false); }} />
          <div
            className="absolute top-12 left-0 z-50 bg-slate-800/95 border border-slate-600/60 rounded-xl shadow-2xl backdrop-blur-sm min-w-[220px] max-h-72 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {savedPoses.map((pose, index) => (
              <div
                key={pose.id}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer group hover:bg-slate-700/70 transition-colors ${index === currentPoseIndex ? 'bg-slate-700/50 text-green-400' : 'text-slate-200'}`}
              >
                {editingPoseIndex === index ? (
                  <input
                    autoFocus
                    className="flex-1 bg-slate-900 border border-green-400/50 rounded px-2 py-0.5 text-sm text-white outline-none"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    onKeyDown={handleRenameKeyPress}
                    onBlur={handleRenameCancel}
                  />
                ) : (
                  <span className="flex-1 text-sm truncate" onClick={() => handlePoseSelect(index)}>
                    {index + 1}. {pose.name}
                    {pose.source === 'purchase' && <span className="ml-1 text-xs text-yellow-400">★</span>}
                  </span>
                )}
                {editingPoseIndex !== index && pose.source === 'saved' && onRenamePose && (
                  <button
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white text-xs px-1 transition-opacity"
                    onMouseDown={e => { e.preventDefault(); handleRenameClick(index, pose.name); }}
                    title={t('pose.rename', lang)}
                  >
                    ✏
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PoseNavigation; 