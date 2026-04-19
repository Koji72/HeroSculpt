import React, { useRef, useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { SelectedParts, ArchetypeId } from '../../types';
import Canvas3D, { Canvas3DRef } from '../3d/Canvas3D';
import ModelLoader, { ModelLoaderRef } from '../3d/ModelLoader';
import HeroMenu from './HeroMenu';
import PoseNavigation from '../PoseNavigation';

export interface CharacterDisplayRef {
  exportModel: () => Promise<any>;
  exportSTL: () => Promise<any>;
  getScene: () => THREE.Scene | null;
  getRenderer: () => THREE.WebGLRenderer | null;
  getCamera: () => THREE.Camera | null;
  handlePreviewPartsChange: (_parts: SelectedParts) => Promise<void>;
  clearPreview: () => void;
  resetState: () => void;
  resetCamera: () => void;
  setViewAngle: (azimuthPercentage: number) => void;
  takeScreenshot: () => Promise<string>;
  applyMaterialToPart: (material: THREE.Material, partType: string) => void;
  applyLightingPreset: (preset: any) => void;
  applyColorToPart: (color: number, partType: string) => void;
  applyColorToAllParts: (color: number) => void;
  applyTextureToPart: (textureType: string, partType: string) => void;
  toggleEdgeDetection: (selectedPart?: string) => void;
}

interface CharacterDisplayProps {
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId | null;
  characterName?: string;
  onCharacterNameChange?: (newName: string) => void;
  onOpenLibrary?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenHelp?: () => void;
  savedPoses?: Array<{
    id: string;
    name: string;
    configuration: SelectedParts;
    source: 'purchase' | 'saved';
    date: string;
  }>;
  currentPoseIndex?: number;
  onPreviousPose?: () => void;
  onNextPose?: () => void;
  onSelectPose?: (index: number) => void;
  onRenamePose?: (index: number, newName: string) => void;
}

const CharacterDisplay = forwardRef<CharacterDisplayRef, CharacterDisplayProps>(({
  selectedParts,
  selectedArchetype,
  characterName,
  onCharacterNameChange,
  onOpenLibrary,
  onOpenSettings,
  onOpenProfile,
  onOpenHelp,
  savedPoses,
  currentPoseIndex = 0,
  onPreviousPose,
  onNextPose,
  onSelectPose,
  onRenamePose,
}, ref) => {
  const canvas3DRef = useRef<Canvas3DRef>(null);
  const modelLoaderRef = useRef<ModelLoaderRef>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewParts, setPreviewParts] = useState<SelectedParts | null>(null);
  const [lastLoadedParts, setLastLoadedParts] = useState<SelectedParts>({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleSceneReady = useCallback((scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    setScene(scene);
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handlePreviewPartsChange = useCallback(async (parts: SelectedParts) => {
    if (!modelLoaderRef.current || !selectedArchetype) return;

    setPreviewParts(parts);
    await modelLoaderRef.current.loadModels(parts, selectedArchetype);
  }, [selectedArchetype]);

  const clearPreview = useCallback(() => {
    setPreviewParts(null);
    if (modelLoaderRef.current) {
      modelLoaderRef.current.loadModels(selectedParts, selectedArchetype || ArchetypeId.STRONG);
    }
  }, [selectedParts, selectedArchetype]);

  const resetState = useCallback(() => {
    setPreviewParts(null);
    setLastLoadedParts({});
    setIsFirstLoad(true);
  }, []);

  const resetCamera = useCallback(() => {
    canvas3DRef.current?.resetCamera();
  }, []);

  const setViewAngle = useCallback((azimuthPercentage: number) => {
    canvas3DRef.current?.setViewAngle(azimuthPercentage);
  }, []);

  const takeScreenshot = useCallback(async (): Promise<string> => {
    return canvas3DRef.current?.takeScreenshot() || '';
  }, []);

  const applyMaterialToPart = useCallback((material: THREE.Material, partType: string) => {
    modelLoaderRef.current?.applyMaterialToPart(material, partType);
  }, []);

  const applyLightingPreset = useCallback((preset: any) => {
    canvas3DRef.current?.applyLightingPreset(preset);
  }, []);

  const applyColorToPart = useCallback((color: number, partType: string) => {
    modelLoaderRef.current?.applyColorToPart(color, partType);
  }, []);

  const applyColorToAllParts = useCallback((color: number) => {
    modelLoaderRef.current?.applyColorToAllParts(color);
  }, []);

  const applyTextureToPart = useCallback((textureType: string, partType: string) => {
    modelLoaderRef.current?.applyTextureToPart(textureType, partType);
  }, []);

  const toggleEdgeDetection = useCallback((selectedPart?: string) => {
    canvas3DRef.current?.toggleEdgeDetection(selectedPart);
  }, []);

  const exportModel = useCallback(async () => {
    if (!canvas3DRef.current || !modelLoaderRef.current || !selectedArchetype) {
      return { success: false, error: 'Components not ready' };
    }

    try {
      const scene = canvas3DRef.current.getScene();
      const renderer = canvas3DRef.current.getRenderer();
      
      if (!scene || !renderer) {
        return { success: false, error: 'Scene or renderer not available' };
      }

      // Import here to avoid circular dependencies
      const { exportModel: exportModelUtil, generateModelName } = await import('../../lib/utils');
      
      const modelName = generateModelName(characterName || 'Character', selectedArchetype);
      const result = await exportModelUtil(scene, { format: 'glb', includeTextures: true, compression: true });
      
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [selectedArchetype, characterName]);

  const exportSTL = useCallback(async () => {
    if (!canvas3DRef.current || !modelLoaderRef.current || !selectedArchetype) {
      return { success: false, error: 'Components not ready' };
    }

    try {
      const scene = canvas3DRef.current.getScene();
      const renderer = canvas3DRef.current.getRenderer();
      
      if (!scene || !renderer) {
        return { success: false, error: 'Scene or renderer not available' };
      }

      // Import here to avoid circular dependencies
      const { exportModel: exportModelUtil, generateModelName } = await import('../../lib/utils');
      
      const modelName = generateModelName(characterName || 'Character', selectedArchetype);
      const result = await exportModelUtil(scene, { format: 'stl', includeTextures: false, compression: false });
      
      return result;
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [selectedArchetype, characterName]);

  useImperativeHandle(ref, () => ({
    exportModel,
    exportSTL,
    getScene: () => canvas3DRef.current?.getScene() || null,
    getRenderer: () => canvas3DRef.current?.getRenderer() || null,
    getCamera: () => canvas3DRef.current?.getCamera() || null,
    handlePreviewPartsChange,
    clearPreview,
    resetState,
    resetCamera,
    setViewAngle,
    takeScreenshot,
    applyMaterialToPart,
    applyLightingPreset,
    applyColorToPart,
    applyColorToAllParts,
    applyTextureToPart,
    toggleEdgeDetection
  }), [
    exportModel,
    exportSTL,
    handlePreviewPartsChange,
    clearPreview,
    resetState,
    resetCamera,
    setViewAngle,
    takeScreenshot,
    applyMaterialToPart,
    applyLightingPreset,
    applyColorToPart,
    applyColorToAllParts,
    applyTextureToPart,
    toggleEdgeDetection
  ]);

  // Load models when parts change
  useEffect(() => {
    if (!modelLoaderRef.current || !selectedArchetype || !scene) {
      return;
    }

    const partsToLoad = previewParts || selectedParts;

    // Only load if it's the first load or if parts actually changed
    if (isFirstLoad || JSON.stringify(partsToLoad) !== JSON.stringify(lastLoadedParts)) {
      if (import.meta.env.DEV) console.log('🔄 CharacterDisplay: Loading models for parts:', Object.keys(partsToLoad));
      modelLoaderRef.current.loadModels(partsToLoad, selectedArchetype);
      setLastLoadedParts(partsToLoad);
      setIsFirstLoad(false);
    }
  }, [selectedParts, selectedArchetype, scene, previewParts, isFirstLoad]);

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-lg font-bold">Loading models...</div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas3D
        ref={canvas3DRef}
        onSceneReady={handleSceneReady}
      />

      {/* Model Loader */}
      <ModelLoader
        ref={modelLoaderRef}
        scene={scene}
        onLoadingChange={handleLoadingChange}
      />

      {/* Hero Menu */}
      <HeroMenu
        characterName={characterName}
        onCharacterNameChange={onCharacterNameChange}
        onOpenLibrary={onOpenLibrary}
        onOpenSettings={onOpenSettings}
        onOpenProfile={onOpenProfile}
        onOpenHelp={onOpenHelp}
        canvas3DRef={canvas3DRef}
        modelLoaderRef={modelLoaderRef}
        selectedParts={selectedParts}
        selectedArchetype={selectedArchetype}
      />

      {/* Pose Navigation */}
      {savedPoses && savedPoses.length > 0 && onPreviousPose && onNextPose && onSelectPose && (
        <PoseNavigation
          savedPoses={savedPoses}
          currentPoseIndex={currentPoseIndex}
          onPreviousPose={onPreviousPose}
          onNextPose={onNextPose}
          onSelectPose={onSelectPose}
          onRenamePose={onRenamePose}
        />
      )}
    </div>
  );
});

CharacterDisplay.displayName = 'CharacterDisplay';

export default CharacterDisplay; 