import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { SelectedParts, ArchetypeId, PartCategory } from '../../types';
import { modelCache } from '../../lib/modelCache';
import { arePartsEqual } from '../../lib/utils';

export interface ModelLoaderRef {
  loadModels: (parts: SelectedParts, archetype: ArchetypeId) => Promise<void>;
  clearModels: () => void;
  getModelGroup: () => THREE.Group | null;
  applyMaterialToPart: (material: THREE.Material, partType: string) => void;
  applyColorToPart: (color: number, partType: string) => void;
  applyColorToAllParts: (color: number) => void;
  applyTextureToPart: (textureType: string, partType: string) => void;
}

interface ModelLoaderProps {
  scene: THREE.Scene | null;
  onLoadingChange?: (isLoading: boolean) => void;
  onLoadingProgress?: (progress: number) => void;
}

const ModelLoader = forwardRef<ModelLoaderRef, ModelLoaderProps>(({ scene, onLoadingChange, onLoadingProgress }, ref) => {
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const loaderRef = useRef<GLTFLoader | null>(null);
  const loadedModelsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const lastLoadedPartsRef = useRef<SelectedParts>({});

  const initializeLoader = useCallback(() => {
    if (loaderRef.current) return;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loaderRef.current = loader;
    
    // Initialize model cache with loaders
    modelCache.initializeLoaders(loader, dracoLoader);
  }, []);

  const cleanupScene = useCallback(() => {
    if (!scene || !modelGroupRef.current) return;

    // Remove existing model group
    scene.remove(modelGroupRef.current);

    // Do NOT dispose geometry — it is shared with modelCache (clone() shares BufferGeometry refs).
    // Disposing here corrupts the cache and makes subsequent loads invisible.
    // Materials are cloned by cloneWithMaterials so they are safe to dispose, but
    // skipping is consistent with CharacterViewer's approach and harmless.

    modelGroupRef.current = null;
    loadedModelsRef.current.clear();
  }, [scene]);

  const loadModels = useCallback(async (parts: SelectedParts, archetype: ArchetypeId) => {
    if (!scene || !loaderRef.current) return;

    if (import.meta.env.DEV) console.log('🔄 ModelLoader: loadModels called with:', { parts, archetype });

    // Check if parts have actually changed
    if (arePartsEqual(parts, lastLoadedPartsRef.current)) {
      if (import.meta.env.DEV) console.log('🔄 ModelLoader: Parts unchanged, skipping load');
      return;
    }

    onLoadingChange?.(true);
    onLoadingProgress?.(0);

    try {
      // Clean up existing models
      cleanupScene();

      // Create new model group
      const modelGroup = new THREE.Group();
      modelGroup.name = 'character-models';
      modelGroupRef.current = modelGroup;
      scene.add(modelGroup);

      const partEntries = Object.entries(parts);
      if (import.meta.env.DEV) console.log('🔄 ModelLoader: Loading', partEntries.length, 'parts:', partEntries.map(([cat, part]) => `${cat}: ${part?.id || 'null'}`));
      let loadedCount = 0;

      for (const [category, part] of partEntries) {
        if (!part || !part.gltfPath) {
          if (import.meta.env.DEV) console.log('⚠️ ModelLoader: Skipping part without gltfPath:', category, part);
          continue;
        }

        if (import.meta.env.DEV) console.log('🔄 ModelLoader: Loading part:', category, part.id, part.gltfPath);

        try {
          // Load model from cache
          const model = await modelCache.getModel(part.gltfPath);

          if (model) {
            model.name = `${category}_${part.id}`;
            
            // Position and scale the model appropriately based on category
            model.position.set(0, 0, 0);
            
            // Adjust scale based on category
            let scale = 1;
            if (category === 'HEAD') scale = 1.2;
            else if (category === 'TORSO' || category === 'SUIT_TORSO') scale = 1.0;
            else if (category === 'LOWER_BODY') scale = 1.0;
            else if (category === 'HAND_LEFT' || category === 'HAND_RIGHT') scale = 0.8;
            else if (category === 'BOOTS') scale = 0.9;
            else if (category === 'CAPE') scale = 1.1;
            else if (category === 'BELT' || category === 'BUCKLE' || category === 'POUCH') scale = 0.7;
            else if (category === 'SYMBOL') scale = 0.6;
            else if (category === 'CHEST_BELT') scale = 0.8;
            
            model.scale.set(scale, scale, scale);
            
            // Enable shadows
            model.traverse((child: THREE.Object3D) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });

            modelGroup.add(model);
            loadedModelsRef.current.set(category, model);
            if (import.meta.env.DEV) console.log('✅ ModelLoader: Successfully loaded part:', category, part.id, 'with scale:', scale);
          } else {
            if (import.meta.env.DEV) console.error('❌ ModelLoader: Failed to load model for:', category, part.id, part.gltfPath);
          }

          loadedCount++;
          onLoadingProgress?.(loadedCount / partEntries.length * 100);

        } catch (error) {
          if (import.meta.env.DEV) console.error(`❌ ModelLoader: Error loading model for ${category} (${part.id}):`, error);
        }
      }

      if (import.meta.env.DEV) console.log('✅ ModelLoader: Finished loading. Total loaded:', loadedModelsRef.current.size, 'out of', partEntries.length);
      if (import.meta.env.DEV) console.log('📊 ModelLoader: Loaded models:', Array.from(loadedModelsRef.current.keys()));

      lastLoadedPartsRef.current = { ...parts };
      if (import.meta.env.DEV) console.log('✅ ModelLoader: Finished loading all parts');

    } catch (error) {
      if (import.meta.env.DEV) console.error('❌ ModelLoader: Error loading models:', error);
    } finally {
      onLoadingChange?.(false);
      onLoadingProgress?.(100);
    }
  }, [scene, cleanupScene, onLoadingChange, onLoadingProgress]);

  const clearModels = useCallback(() => {
    cleanupScene();
    lastLoadedPartsRef.current = {};
  }, [cleanupScene]);

  const applyMaterialToPart = useCallback((material: THREE.Material, partType: string) => {
    if (!modelGroupRef.current) return;

    modelGroupRef.current.traverse((child) => {
      if (child.name.includes(partType) && child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, []);

  const applyColorToPart = useCallback((color: number, partType: string) => {
    if (import.meta.env.DEV) console.log(`🎨 ModelLoader: Applying color ${color.toString(16)} to part: ${partType}`);
    if (!modelGroupRef.current) {
      if (import.meta.env.DEV) console.log('❌ ModelLoader: Model group not available');
      return;
    }

    let foundMeshes = 0;
    let coloredMeshes = 0;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (import.meta.env.DEV) console.log(`🔍 ModelLoader: Checking mesh: ${child.name || 'unnamed'}`, {
          name: child.name,
          partType,
          materialType: child.material?.constructor?.name,
          isMeshStandardMaterial: child.material instanceof THREE.MeshStandardMaterial,
          isMeshPhysicalMaterial: child.material instanceof THREE.MeshPhysicalMaterial
        });
        
        if (child.name.includes(partType)) {
          foundMeshes++;
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color.setHex(color);
            coloredMeshes++;
            if (import.meta.env.DEV) console.log(`✅ ModelLoader: Applied color to ${partType}: ${child.name || 'unnamed'}`);
          } else if (child.material instanceof THREE.MeshPhysicalMaterial) {
            child.material.color.setHex(color);
            coloredMeshes++;
            if (import.meta.env.DEV) console.log(`✅ ModelLoader: Applied color to ${partType}: ${child.name || 'unnamed'}`);
          } else {
            if (import.meta.env.DEV) console.log(`⚠️ ModelLoader: Material not compatible for ${partType}: ${child.name || 'unnamed'}`);
          }
        }
      }
    });
    
    if (import.meta.env.DEV) console.log(`🎨 ModelLoader: Summary for ${partType}: Found ${foundMeshes} meshes, colored ${coloredMeshes}`);
  }, []);

  const applyColorToAllParts = useCallback((color: number) => {
    if (!modelGroupRef.current) return;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.color.setHex(color);
      }
    });
  }, []);

  const applyTextureToPart = useCallback((textureType: string, partType: string) => {
    if (!modelGroupRef.current) return;

    // This would need to be implemented based on your texture system
    if (import.meta.env.DEV) console.log(`Applying texture ${textureType} to part ${partType}`);
  }, []);

  useImperativeHandle(ref, () => ({
    loadModels,
    clearModels,
    getModelGroup: () => modelGroupRef.current,
    applyMaterialToPart,
    applyColorToPart,
    applyColorToAllParts,
    applyTextureToPart
  }), [loadModels, clearModels, applyMaterialToPart, applyColorToPart, applyColorToAllParts, applyTextureToPart]);

  // Initialize loader on mount
  initializeLoader();

  return null;
});

ModelLoader.displayName = 'ModelLoader';

export default ModelLoader; 