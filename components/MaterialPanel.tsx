import React, { useState } from 'react';
import * as THREE from 'three';
import MaterialConfigurator from './MaterialConfigurator';
import AdvancedEffects from './AdvancedEffects';
import { SelectedParts, PartCategory } from '../types';
import { CharacterViewerRef } from './CharacterViewer';

interface MaterialPanelProps {
  characterViewerRef: React.RefObject<CharacterViewerRef | null>;
  selectedParts: SelectedParts;
  onLoadConfiguration: (parts: SelectedParts, modelName?: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  isHeadquartersOpen?: boolean;
}

const MaterialPanel = React.memo(({
  characterViewerRef,
  selectedParts,
  onLoadConfiguration,
  isOpen,
  onClose,
  isHeadquartersOpen = false
}: MaterialPanelProps) => {
  const [currentColors, setCurrentColors] = useState<{ [key: string]: number }>({});

  // If Headquarters is open, don't render the MaterialPanel
  if (isHeadquartersOpen) {
    return null;
  }

  const handleMaterialChange = (material: THREE.Material, partType: string) => {
    if (characterViewerRef.current) {
      characterViewerRef.current.applyMaterialToPart(material, partType);
    }
  };

  const handleColorChange = (palette: string, colorType: string, color: number, partCategory?: PartCategory) => {
    if (import.meta.env.DEV) console.log(`MaterialPanel: handleColorChange called`, {
      palette,
      colorType,
      color: color.toString(16),
      partCategory,
      partCategoryType: typeof partCategory,
      characterViewerRef: !!characterViewerRef.current,
      selectedPartsKeys: Object.keys(selectedParts || {})
    });

    if (characterViewerRef.current) {
      if (partCategory) {
        if (import.meta.env.DEV) console.log(`MaterialPanel: Applying color to specific part: ${partCategory}`);
        characterViewerRef.current.applyColorToPart(color, partCategory);
        setCurrentColors(prev => ({ ...prev, [partCategory]: color }));
      } else {
        if (import.meta.env.DEV) console.log(`MaterialPanel: Applying color to all parts`);
        characterViewerRef.current.applyColorToAllParts(color);
        setCurrentColors(prev => {
          const newColors = { ...prev };
          Object.keys(selectedParts).forEach(category => {
            if (category !== PartCategory.HEAD) newColors[category] = color;
          });
          return newColors;
        });
      }
    } else {
      if (import.meta.env.DEV) console.log('MaterialPanel: characterViewerRef.current is null');
    }
  };

  const handleLightingChange = (preset: any) => {
    if (characterViewerRef.current) {
      characterViewerRef.current.applyLightingPreset(preset);
    }
  };

  const handleTextureChange = (partType: string) => {
    if (characterViewerRef.current) {
      characterViewerRef.current.applyTextureToPart(partType);
    }
  };

  const getScene = () => {
    return characterViewerRef.current?.getScene() || null;
  };

  const getRenderer = () => {
    return characterViewerRef.current?.getRenderer() || null;
  };

  const getCamera = () => {
    return characterViewerRef.current?.getCamera() || null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="panel-header">
        <span>MATERIALS</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}
        >✕</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {/* Debug Button */}
        {import.meta.env.DEV && (
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => {
                if (characterViewerRef.current) {
                  characterViewerRef.current.debugAvailableParts();
                }
              }}
              className="btn-comic"
              style={{ width: '100%', fontSize: 12 }}
            >
              Debug Available Parts
            </button>
          </div>
        )}

        {/* Material Configurator */}
        <MaterialConfigurator
          characterViewerRef={characterViewerRef}
          selectedParts={selectedParts}
          onMaterialChange={handleMaterialChange}
          onColorChange={handleColorChange}
          onLightingChange={handleLightingChange}
          currentColors={currentColors}
          onLoadConfiguration={onLoadConfiguration}
        />

        {/* Texture Options */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: 'var(--font-comic)', fontSize: 13, letterSpacing: 1, marginBottom: 8, color: 'var(--color-text-muted)' }}>TEXTURES</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn-comic btn-ghost"
              style={{ flex: 1, fontSize: 11 }}
              onClick={() => handleTextureChange(PartCategory.TORSO)}
            >Wood (Torso)</button>
            <button
              className="btn-comic btn-ghost"
              style={{ flex: 1, fontSize: 11 }}
              onClick={() => handleTextureChange(PartCategory.BOOTS)}
            >Metal (Boots)</button>
          </div>
        </div>

        {/* Advanced Effects */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: 'var(--font-comic)', fontSize: 13, letterSpacing: 1, marginBottom: 8, color: 'var(--color-text-muted)' }}>ADVANCED EFFECTS</div>
          <AdvancedEffects
            getScene={getScene}
            getRenderer={getRenderer}
            getCamera={getCamera}
            onComposerChange={undefined}
          />
        </div>

      </div>
    </div>
  );
});

export default MaterialPanel;
