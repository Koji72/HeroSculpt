import React, { useState, useEffect } from 'react';

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
        className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-green-400 hover:text-green-300 border-green-400/20 hover:border-green-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center"
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
        className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-green-400 hover:text-green-300 border-green-400/20 hover:border-green-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center"
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
              Borrar
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="px-2 py-1 backdrop-blur-sm shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 text-xs border-slate-600/50 rounded-full transition-colors duration-200 border font-medium"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-red-700/80 text-red-400 hover:text-white border-red-400/20 hover:border-red-400/40 rounded-full transition-colors duration-200 will-change-transform border items-center justify-center"
            title="Borrar esta pose"
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
          title="Save como nueva pose editable"
        >
          💾 Save
        </button>
      )}

      {/* Overlay para cerrar el selector */}
      {showPoseSelector && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowPoseSelector(false)}
        />
      )}
    </div>
  );
};

export default PoseNavigation; 