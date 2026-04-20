import React, { useState, useCallback } from 'react';
import { exportModel, downloadBlob, generateModelName } from '../../lib/utils';
import { useLang, t } from '../../lib/i18n';
import { Canvas3DRef } from '../3d/Canvas3D';
import { ModelLoaderRef } from '../3d/ModelLoader';
import { SelectedParts, ArchetypeId } from '../../types';
import { ShieldCheckIcon, Cog6ToothIcon, UserIcon, BookOpenIcon } from '../icons';

interface HeroMenuProps {
  characterName?: string;
  onCharacterNameChange?: (newName: string) => void;
  onOpenLibrary?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenHelp?: () => void;
  canvas3DRef?: React.RefObject<Canvas3DRef>;
  modelLoaderRef?: React.RefObject<ModelLoaderRef>;
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId | null;
}

const HeroMenu: React.FC<HeroMenuProps> = ({
  characterName,
  onCharacterNameChange,
  onOpenLibrary,
  onOpenSettings,
  onOpenProfile,
  onOpenHelp,
  canvas3DRef,
  modelLoaderRef,
  selectedParts,
  selectedArchetype
}) => {
  const { lang } = useLang();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(characterName || '');
  const [isExporting, setIsExporting] = useState(false);

  const handleNameClick = useCallback(() => {
    if (onCharacterNameChange) {
      setEditingName(true);
      setTempName(characterName || '');
    }
  }, [characterName, onCharacterNameChange]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  }, []);

  const handleNameBlur = useCallback(() => {
    setEditingName(false);
    if (onCharacterNameChange && tempName.trim() !== characterName) {
      onCharacterNameChange(tempName.trim());
    }
  }, [tempName, characterName, onCharacterNameChange]);

  const handleNameKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setEditingName(false);
      setTempName(characterName || '');
    }
  }, [handleNameBlur, characterName]);

  const handleExportGLB = useCallback(async () => {
    if (!canvas3DRef?.current || !modelLoaderRef?.current || !selectedArchetype) return;

    setIsExporting(true);
    try {
      const scene = canvas3DRef.current.getScene();
      const renderer = canvas3DRef.current.getRenderer();
      
      if (!scene || !renderer) {
        throw new Error('Scene or renderer not available');
      }

      const modelName = generateModelName(selectedParts, selectedArchetype);
      const result = await exportModel(scene, { format: 'glb', includeTextures: true, compression: true });
      
      if (result.success && result.data) {
        downloadBlob(result.data, `${modelName}.glb`);
      } else {
        if (import.meta.env.DEV) console.error('Export failed:', result.error);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [canvas3DRef, modelLoaderRef, selectedArchetype, selectedParts]);

  const handleExportSTL = useCallback(async () => {
    if (!canvas3DRef?.current || !modelLoaderRef?.current || !selectedArchetype) return;

    setIsExporting(true);
    try {
      const scene = canvas3DRef.current.getScene();
      const renderer = canvas3DRef.current.getRenderer();
      
      if (!scene || !renderer) {
        throw new Error('Scene or renderer not available');
      }

      const modelName = generateModelName(selectedParts, selectedArchetype);
      const result = await exportModel(scene, { format: 'stl', includeTextures: false, compression: false });
      
      if (result.success && result.data) {
        downloadBlob(result.data, `${modelName}.stl`);
      } else {
        if (import.meta.env.DEV) console.error('Export failed:', result.error);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [canvas3DRef, modelLoaderRef, selectedArchetype, selectedParts]);

  return (
    <div className="absolute top-4 left-4 z-50">
      <div className="hero-menu-button group relative">
        <div className="hero-menu-button-hover-bg" />
        <div className="hero-menu-button-glow" />
        
        <div className="hero-menu-button-icon">
          <ShieldCheckIcon className="w-6 h-6 text-orange-400" />
        </div>

        <div className="hero-menu-dropdown">
          <div className="hero-menu-header">
            <div className="hero-menu-header-title">
              {editingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  onKeyDown={handleNameKeyDown}
                  className="bg-transparent border-none outline-none text-white font-bold text-lg w-full"
                  autoFocus
                />
              ) : (
                <span 
                  onClick={handleNameClick}
                  className="cursor-pointer hover:text-orange-400 transition-colors"
                >
                  {characterName || 'HERO'}
                </span>
              )}
            </div>
            <div className="hero-menu-header-subtitle">
              {selectedArchetype || 'STRONG'}
            </div>
          </div>

          <div className="hero-menu-items">
            <div className="hero-menu-item" onClick={onOpenLibrary}>
              <div className="hero-menu-item-icon">
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <div className="hero-menu-item-content">
                <div className="hero-menu-item-text">{t('heromenu.library', lang)}</div>
                <div className="hero-menu-item-description">{t('heromenu.library_desc', lang)}</div>
              </div>
              <div className="hero-menu-item-indicator-wrapper">
                <div className="hero-menu-item-indicator" />
              </div>
            </div>

            <div className="hero-menu-item" onClick={onOpenSettings}>
              <div className="hero-menu-item-icon">
                <Cog6ToothIcon className="w-5 h-5" />
              </div>
              <div className="hero-menu-item-content">
                <div className="hero-menu-item-text">{t('heromenu.settings', lang)}</div>
                <div className="hero-menu-item-description">{t('heromenu.settings_desc', lang)}</div>
              </div>
              <div className="hero-menu-item-indicator-wrapper">
                <div className="hero-menu-item-indicator" />
              </div>
            </div>

            <div className="hero-menu-item" onClick={onOpenProfile}>
              <div className="hero-menu-item-icon">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="hero-menu-item-content">
                <div className="hero-menu-item-text">{t('heromenu.profile', lang)}</div>
                <div className="hero-menu-item-description">{t('heromenu.profile_desc', lang)}</div>
              </div>
              <div className="hero-menu-item-indicator-wrapper">
                <div className="hero-menu-item-indicator" />
              </div>
            </div>
          </div>

          <div className="hero-menu-footer">
            <div className="hero-menu-footer-text">
              <button
                onClick={handleExportGLB}
                disabled={isExporting}
                className="from-blue-600 hover:from-blue-500 bg-gradient-to-r to-blue-500 text-white hover:to-blue-400 rounded-md disabled:opacity-50 transition-colors transition-transform transition-shadow duration-150 px-4 py-2 font-bold disabled:cursor-not-allowed"
              >
                {isExporting ? t('heromenu.exporting', lang) : t('heromenu.export_glb', lang)}
              </button>
              <button
                onClick={handleExportSTL}
                disabled={isExporting}
                className="from-green-600 hover:from-green-500 bg-gradient-to-r to-green-500 text-white hover:to-green-400 rounded-md disabled:opacity-50 transition-colors transition-transform transition-shadow duration-150 px-4 py-2 font-bold disabled:cursor-not-allowed ml-2"
              >
                {isExporting ? t('heromenu.exporting', lang) : t('heromenu.export_stl', lang)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroMenu; 
