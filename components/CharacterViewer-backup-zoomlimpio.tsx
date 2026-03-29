import { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { SelectedParts, ArchetypeId, PartCategory } from '../types';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { exportModel, downloadBlob, generateModelName } from '../lib/utils';
import { modelCache } from '../lib/modelCache';
import PoseNavigation from './PoseNavigation';

interface CharacterViewerProps {
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId | null;
  characterName?: string; // NUEVO
  onCharacterNameChange?: (newName: string) => void; // NUEVO
  onOpenLibrary?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenHelp?: () => void;
  // Nueva funcionalidad para navegación de poses
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

// Expose methods to parent component
export interface CharacterViewerRef {
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

const CharacterViewer = forwardRef<CharacterViewerRef, CharacterViewerProps>(({ 
  selectedParts, 
  selectedArchetype,
  characterName, // NUEVO
  onCharacterNameChange, // NUEVO
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
  const mountRef = useRef<HTMLDivElement>(null);
  
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const loaderRef = useRef<GLTFLoader | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const initialCameraPosition = useRef<THREE.Vector3 | null>(null);
  const initialCameraTarget = useRef<THREE.Vector3 | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [previewParts, setPreviewParts] = useState<SelectedParts | null>(null);
  const [lastLoadedParts, setLastLoadedParts] = useState<SelectedParts>({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [edgeDetectionActive, setEdgeDetectionActive] = useState(false);
  const edgeLinesRef = useRef<THREE.LineSegments[]>([]);
  const [cacheLoadingStatus, setCacheLoadingStatus] = useState<string>(''); // ✨ Nuevo estado para mostrar estado de cache
  const isInitialized = useRef(false); // ✅ Para evitar doble inicialización
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(characterName || '');

  useEffect(() => {
    setTempName(characterName || '');
  }, [characterName]);

  // Se ejecuta una vez al montar para guardar la posición inicial de la cámara
  useEffect(() => {
    if (cameraRef.current && controlsRef.current && !initialCameraPosition.current) {
      initialCameraPosition.current = cameraRef.current.position.clone();
      initialCameraTarget.current = controlsRef.current.target.clone();
      console.log("📸 [INIT] Posición inicial de la cámara guardada: (", initialCameraPosition.current.x.toFixed(2), ",", initialCameraPosition.current.y.toFixed(2), ",", initialCameraPosition.current.z.toFixed(2), ")");
      console.log("📸 [INIT] Target inicial de la cámara guardado: (", initialCameraTarget.current.x.toFixed(2), ",", initialCameraTarget.current.y.toFixed(2), ",", initialCameraTarget.current.z.toFixed(2), ")");
    }
  }, []);

  const handleNameClick = () => {
    setEditingName(true);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value);
  };
  const handleNameBlur = () => {
    setEditingName(false);
    if (onCharacterNameChange && tempName.trim() && tempName !== characterName) {
      onCharacterNameChange(tempName.trim());
    }
  };
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  // Initialize cache
  useLayoutEffect(() => {
    if (!mountRef.current || isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const currentMount = mountRef.current;
    
    // Ensure mount has proper dimensions before initializing Three.js
    const mountWidth = Math.max(currentMount.clientWidth, 300); // Minimum 300px width
    const mountHeight = Math.max(currentMount.clientHeight, 400); // Minimum 400px height
    


    // Scene setup with Strong archetype theme
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a); // Dark background for Strong theme
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      28.6,
      mountWidth / mountHeight,
      0.1,
      1000
    );
    // Position camera with 5% azimuthal rotation (approx 18 degrees) to see over shoulders
    const azimuthalRotation = Math.PI / 5; // ~36 degrees (20% of full rotation) - moved 15% more to the left
    const distance = 6.8 * 1.1; // 15% closer (8 * 0.85 = 6.8) + 10% más lejos
    camera.position.set(
      Math.sin(azimuthalRotation) * distance, // X position for azimuthal rotation
      2, // Keep same height
      Math.cos(azimuthalRotation) * distance  // Z position for azimuthal rotation
    );
    cameraRef.current = camera;
    // Guardar posición inicial
    initialCameraPosition.current = camera.position.clone();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mountWidth, mountHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x1a1a1a, 1); // Asegurar color de fondo
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 1.5;
    controls.zoomSpeed = 1.2;
    // Centrar la cámara en el origen
    controls.target.set(0, 1.5, 0);
    
    // Enable azimuthal rotation (horizontal) while limiting vertical movement
    controls.enablePan = false; // Disable panning
    controls.enableZoom = true; // Keep zoom enabled
    controls.enableRotate = true; // Keep rotation enabled
    
    // Allow full Y rotation (front/back) but prevent viewing from below
    controls.minPolarAngle = Math.PI / 6; // 30 degrees (can look from above)
    controls.maxPolarAngle = Math.PI / 2; // 90 degrees (horizontal, prevents viewing from below)
    
    // Allow full azimuthal rotation (360 degrees) to see front and back
    controls.minAzimuthAngle = -Infinity; // Full rotation allowed
    controls.maxAzimuthAngle = Infinity; // Full rotation allowed
    
    controls.autoRotate = false; // Disable auto-rotation
    
    // Set the initial azimuthal angle directly using OrbitControls method
    // This ensures the angle limits work correctly
    controls.update(); // First update to calculate current angles
    
    // Set azimuthal angle to 20% rotation (π/5 = 36°) - moved 15% more to the left
    const targetAzimuth = Math.PI / 5;
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position.clone().sub(controls.target));
    spherical.theta = targetAzimuth; // Set azimuthal angle
    camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target));
    

    
    controls.update();
    controlsRef.current = controls;
    // Guardar target inicial después de crear y configurar controls
    initialCameraTarget.current = controls.target.clone();

    // Neutral "Resin" lighting setup
    // Key light (main)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2); // Aumentar intensidad
    keyLight.position.set(5, 10, 7.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    scene.add(keyLight);

    // Fill light (secondary) - más suave
    const fillLight = new THREE.DirectionalLight(0xaaaaaa, 0.8); // Aumentar intensidad
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    // Rim light (backlight) - más dramático
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8); // Aumentar intensidad
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    // Luz ambiental más brillante
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Aumentar intensidad
    scene.add(ambientLight);

    // Initialize GLTFLoader and DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loaderRef.current = loader;

    // Initialize the global model cache with loaders
    modelCache.initializeLoaders(loader, dracoLoader);

    modelGroupRef.current = new THREE.Group();
    scene.add(modelGroupRef.current);

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const ssaoPass = new SSAOPass(scene, camera, mountWidth, mountHeight);
    ssaoPass.kernelRadius = 0.5;
    ssaoPass.minDistance = 0.001;
    ssaoPass.maxDistance = 0.1;
    composer.addPass(ssaoPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mountWidth, mountHeight),
      0.2, // strength
      0.5, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      composer.render();
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;

      const rawWidth = mountRef.current.clientWidth;
      const rawHeight = mountRef.current.clientHeight;
      
      // Ensure minimum dimensions to prevent WebGL errors
      const newWidth = Math.max(rawWidth, 300);
      const newHeight = Math.max(rawHeight, 400);
      
      // Only update if dimensions are valid
      if (rawWidth === 0 || rawHeight === 0) {
        console.warn('CharacterViewer: Attempted resize with zero dimensions. Skipping.', { 
          raw: { width: rawWidth, height: rawHeight },
          adjusted: { width: newWidth, height: newHeight }
        });
        return;
      }

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
      composerRef.current.setSize(newWidth, newHeight);
      ssaoPass.setSize(newWidth, newHeight);
      bloomPass.setSize(newWidth, newHeight);

    };

    const resizeObserver = new ResizeObserver(entries => {
      // We only expect one entry since we are observing a single element
      for (let entry of entries) {
        if (entry.target === currentMount) {
          handleResize();
        }
      }
    });

    resizeObserver.observe(currentMount);

    const cleanupScene = () => {
      isInitialized.current = false;
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      if (currentMount && rendererRef.current?.domElement) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
      modelCache.clearCache();
      
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      modelGroupRef.current = null;
      loaderRef.current = null;
      composerRef.current = null;
    };

    return cleanupScene;
  }, []); // Empty dependency array to run only once on mount

  // Incremental model loading - only load parts that changed
  const loadModelsIncremental = useCallback(async (newParts: SelectedParts, force: boolean = false) => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current || !modelGroupRef.current) return;

    const modelGroup = modelGroupRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!modelGroup || !camera || !controls) {
      console.error('CharacterViewer: Missing required refs for loading models');
      return;
    }

    // Detect what changed
    const changedCategories: PartCategory[] = [];
    
    for (const category of Object.values(PartCategory)) {
      const oldPart = lastLoadedParts[category];
      const newPart = newParts[category];
      
      if (force || oldPart?.id !== newPart?.id) {
        changedCategories.push(category);
      }
    }

    if (changedCategories.length === 0 && !force) {
      return;
    }

    // ✨ Mostrar estado de carga
    if (changedCategories.length > 0) {
      setCacheLoadingStatus(`🔄 Loading ${changedCategories.length} models...`);
    }
    
    const basePath = (import.meta as any).env.BASE_URL || '/';
    
    // Remove old models for changed categories
    const modelsToRemove: THREE.Object3D[] = [];
    modelGroup.traverse((child) => {
      if (child.userData.category && changedCategories.includes(child.userData.category)) {
        modelsToRemove.push(child);
      }
    });
    
    modelsToRemove.forEach(model => {
      modelGroup.remove(model);
    });

    // Load new models for changed categories
    const loadPromises = changedCategories.map(async (category) => {
      const part = newParts[category];
      if (!part || part.attributes?.none || part.attributes?.hidden || !part.gltfPath) {
        return;
      }

      const modelPath = `${basePath}${part.gltfPath.startsWith('/') ? part.gltfPath.slice(1) : part.gltfPath}`;
      try {
        const startTime = performance.now();
        const model = await modelCache.getModel(modelPath);
        const loadTime = performance.now() - startTime;
        
        // ✨ Mostrar si fue desde cache o red
        if (loadTime < 50) {
          console.log(`⚡ Model loaded from cache: ${part.name} (${loadTime.toFixed(1)}ms)`);
          setCacheLoadingStatus(`⚡ Cached: ${part.name}`);
        } else {
          console.log(`🌐 Model loaded from network: ${part.name} (${loadTime.toFixed(1)}ms)`);
          setCacheLoadingStatus(`🌐 Network: ${part.name}`);
        }
        
        // Tag the model with category for future removal
        model.userData.category = category;
        model.userData.partId = part.id;
        // CRITICAL: Assign category to all meshes within the model
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.userData.category = category;
            child.userData.partId = part.id;
          }
        });
        modelGroup.add(model);

      } catch (error) {
        console.error(`CharacterViewer: Error loading model ${part.name} (${part.id})`, error);
        setCacheLoadingStatus(`❌ Error: ${part.name}`);
      }
    });

    try {
      await Promise.all(loadPromises);
      setLastLoadedParts(newParts);
      
      // ✨ Limpiar estado después de un momento
      setTimeout(() => {
        setCacheLoadingStatus('');
      }, 2000);

    } catch (error) {
      console.error('CharacterViewer: Error during incremental loading:', error);
      setCacheLoadingStatus('❌ Loading error');
    }
  }, [lastLoadedParts]);

  // Full model loading (for initial load and major changes)
  const loadModels = useCallback(async () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current || !modelGroupRef.current) return;

    const modelGroup = modelGroupRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!modelGroup || !camera || !controls) {
      console.error('CharacterViewer: Missing required refs for loading models');
      return;
    }

    // Use preview parts if available, otherwise use selected parts
    const partsToLoad = previewParts || selectedParts;
    
    const startTime = performance.now();
    setIsLoading(true);

    

    
    // Force clear with manual removal for better reliability
    const childrenToRemove = [...modelGroup.children];
    childrenToRemove.forEach(child => {
      modelGroup.remove(child);
      // Dispose of geometry and materials to free memory
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
    
    const selectedPartList = Object.values(partsToLoad).filter(Boolean);
    const basePath = (import.meta as any).env.BASE_URL || '/';
    
    // Load base model first (Strong archetype base)
    try {
      const baseModelPath = `${basePath}assets/strong/Base/strong_base_01.glb`;

      const baseModel = await modelCache.getModel(baseModelPath);
      
      // Tag the base model
      baseModel.userData.category = 'BASE';
      baseModel.userData.partId = 'strong_base_01';
      
      modelGroup.add(baseModel);

    } catch (error) {
      console.error('CharacterViewer: Error loading base model:', error);
    }

    // Load selected parts with caching
    // NO FILTER - Render exactly what is received
    let filteredPartList = selectedPartList;

    // ✅ CORREGIDO: NO filtrar compatibilidad aquí - dejar que App.tsx maneje la preservación
    // El filtrado de compatibilidad se maneja en App.tsx con las funciones de preservación
    // CharacterViewer solo debe renderizar las partes que recibe

    const loadPromises = filteredPartList
      .filter((part: any) => part && part.gltfPath && !part.attributes?.hidden)
      .map(async (part: any) => {
        const modelPath = `${basePath}${part.gltfPath.startsWith('/') ? part.gltfPath.slice(1) : part.gltfPath}`;
        try {

          const model = await modelCache.getModel(modelPath);
          
          // Tag the model with category for future removal (CRITICAL for hover preview)
          model.userData.category = part.category;
          model.userData.partId = part.id;
          
          // CRITICAL: Assign category to all meshes within the model
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.userData.category = part.category;
              child.userData.partId = part.id;

            }
          });
          
          modelGroup.add(model);

        } catch (error) {
          console.error(`CharacterViewer: Error loading model ${part.name} (${part.id}) from ${modelPath}`, error);
          return null;
        }
      });

    try {
      await Promise.all(loadPromises);
      const endTime = performance.now();
      const loadTime = Math.round(endTime - startTime);
      
      setIsLoading(false);
      
  

      // Position and frame the character
      modelGroup.rotation.y = Math.PI;

      if (modelGroup.children.length > 0) {
    
        
        // Calculate bounding box and center
        const box = new THREE.Box3().setFromObject(modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        

        
        // Center the model
        modelGroup.position.sub(center);
        // El modelo queda en el origen (0,0,0) para que la rotación sea correcta
        
        // Solo resetear la cámara en la primera carga
        if (isFirstLoad) {
          // Frame the character
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const cameraDistance = maxDim / (2 * Math.tan(fov / 2));
          

          
          // Maintain azimuthal rotation when framing character using spherical coordinates
          const targetAzimuth = Math.PI / 5; // ~36 degrees (20% of full rotation) - moved 15% more to the left
          const finalDistance = cameraDistance * 1.2825 * 1.1; // 15% closer total + 10% más lejos
          
          // Centrar la cámara en el modelo (origen)
          controls.target.set(0, 0, 0);
          
          // Use spherical coordinates for proper azimuthal positioning
          const spherical = new THREE.Spherical();
          spherical.radius = finalDistance;
          spherical.phi = Math.PI / 2.5; // Slightly elevated view (~72 degrees from vertical)
          spherical.theta = targetAzimuth; // Set azimuthal angle
          camera.position.setFromSpherical(spherical).add(controls.target);

          // Save initial camera position and target for resetCamera
          initialCameraPosition.current = camera.position.clone();
          initialCameraTarget.current = controls.target.clone();

          setIsFirstLoad(false);
        }
      } else {

        // Solo resetear la cámara en la primera carga
        if (isFirstLoad) {
          // Apply same azimuthal rotation for consistency using spherical coordinates
          const targetAzimuth = Math.PI / 5; // ~36 degrees (20% of full rotation) - moved 15% more to the left
          const distance = 8 * 1.1; // 10% más lejos
          
          // Centrar la cámara en el origen
          controls.target.set(0, 1.5, 0);
          
          // Use spherical coordinates for proper azimuthal positioning
          const spherical = new THREE.Spherical();
          spherical.radius = distance;
          spherical.phi = Math.PI / 2.5; // Slightly elevated view (~72 degrees from vertical)
          spherical.theta = targetAzimuth; // Set azimuthal angle
          camera.position.setFromSpherical(spherical).add(controls.target);
          
          setIsFirstLoad(false);
        }
      }
      
      controls.update();
      
    } catch (error) {
      setIsLoading(false);
      console.error('CharacterViewer: Error during model loading:', error);
    }
  }, [selectedParts, selectedArchetype, previewParts, loadModelsIncremental, isFirstLoad]);

  // Smart loading: detect what parts actually changed and load only those
  const [lastSelectedParts, setLastSelectedParts] = useState<SelectedParts>({});
  
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current || !modelGroupRef.current) return;

    // If it's the first load or archetype changed, do full load
    const isFirstLoad = Object.keys(lastSelectedParts).length === 0;
    const archetypeChanged = selectedArchetype !== selectedArchetype; // This will always be same, but kept for future
    

    
    if (isFirstLoad) {

      setIsFirstLoad(true); // Reset para nueva carga
      setLastSelectedParts(selectedParts);
      loadModels();
      return;
    }
    
    // Check if parts actually changed (not just color changes)
    const partsActuallyChanged = (() => {
      const lastKeys = Object.keys(lastSelectedParts).sort();
      const currentKeys = Object.keys(selectedParts).sort();
      
      // Different number of parts
      if (lastKeys.length !== currentKeys.length) return true;
      
      // Check if any part IDs actually changed
      for (const key of lastKeys) {
        if (lastSelectedParts[key]?.id !== selectedParts[key]?.id) {
          return true;
        }
      }
      
      return false;
    })();
    
    if (!partsActuallyChanged) {

      return;
    }
    


    // ✨ NUEVA IMPLEMENTACIÓN: Carga directa sin animaciones para evitar efecto de descomposición
    if (modelGroupRef.current) {
      // Eliminar modelos antiguos directamente sin animaciones
      const children = [...modelGroupRef.current.children];
      children.forEach((child) => {
        modelGroupRef.current?.remove(child);
      });
    }

    // Cargar nuevos modelos inmediatamente
    setLastSelectedParts(selectedParts);
    loadModels();
  }, [selectedParts, selectedArchetype, loadModels, isFirstLoad]);

  useImperativeHandle(ref, () => ({
    exportModel: async () => {
      try {
        const scene = sceneRef.current;
        const modelGroup = modelGroupRef.current;
        
        if (!scene || !modelGroup) {
          return { success: false, error: 'Scene or model group not available' };
        }



        // Check if we have any models loaded
        if (modelGroup.children.length === 0) {
          return { success: false, error: 'No models loaded to export' };
        }

        // Create a new scene specifically for export
        const exportScene = new THREE.Scene();
        
        // Copy the model group (which contains all the loaded models)
        const exportModelGroup = modelGroup.clone();
        
        // Ensure the model group is properly positioned
        exportModelGroup.position.set(0, 0, 0);
        exportModelGroup.rotation.set(0, 0, 0);
        exportModelGroup.scale.set(1, 1, 1);
        
        exportScene.add(exportModelGroup);
        
        // Add basic lighting for the export (only directional lights are supported)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 5);
        exportScene.add(directionalLight);


        
        const modelName = generateModelName(selectedParts, selectedArchetype || ArchetypeId.STRONG);
        const { data: glbBlob, filename: generatedFileName } = await exportModel(exportScene, { format: 'glb', includeTextures: true, compression: true });

        if (glbBlob) {
          const finalFileName = generatedFileName || `${modelName}_export.glb`; // Ensure filename is always a string
          downloadBlob(glbBlob, finalFileName);
          return { success: true, fileName: finalFileName };
        } else {
          return { success: false, error: 'Failed to generate GLB blob' };
        }
      } catch (error) {
        console.error('Error exporting model:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown export error' };
      }
    },
    exportSTL: async () => {
      try {
        const scene = sceneRef.current;
        const modelGroup = modelGroupRef.current;
        
        if (!scene || !modelGroup) {
          return { success: false, error: 'Scene or model group not available' };
        }



        // Check if we have any models loaded
        if (modelGroup.children.length === 0) {
          return { success: false, error: 'No models loaded to export' };
        }

        // Create a new scene specifically for STL export
        const exportScene = new THREE.Scene();
        
        // Copy the model group (which contains all the loaded models)
        const exportModelGroup = modelGroup.clone();
        
        // Ensure the model group is properly positioned for 3D printing
        exportModelGroup.position.set(0, 0, 0);
        exportModelGroup.rotation.set(0, 0, 0);
        exportModelGroup.scale.set(1, 1, 1);
        
        exportScene.add(exportModelGroup);


        
        const modelName = generateModelName(selectedParts, selectedArchetype || ArchetypeId.STRONG);
        const { data: stlBlob, filename: generatedFileName } = await exportModel(exportScene, { format: 'stl', includeTextures: false, compression: false });

        if (stlBlob) {
          const finalFileName = generatedFileName || `${modelName}_3d_print.stl`;
          downloadBlob(stlBlob, finalFileName);
          return { success: true, fileName: finalFileName };
        } else {
          return { success: false, error: 'Failed to generate STL blob' };
        }
      } catch (error) {
        console.error('Error exporting STL:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown STL export error' };
      }
    },
    getScene: () => sceneRef.current,
    getRenderer: () => rendererRef.current,
    getCamera: () => cameraRef.current,
    handlePreviewPartsChange: async (changedParts: SelectedParts) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current || !modelGroupRef.current) return;
      
      // Check if this is a "clear preview" call (when changedParts equals selectedParts)
      // Use a more robust comparison that ignores property order and compares actual content
      const isClearPreview = (() => {
        const changedKeys = Object.keys(changedParts).sort();
        const selectedKeys = Object.keys(selectedParts).sort();
        
        // Must have same number of parts
        if (changedKeys.length !== selectedKeys.length) return false;
        
        // Must have same categories
        if (changedKeys.join(',') !== selectedKeys.join(',')) return false;
        
        // Must have same part IDs for each category
        for (const category of changedKeys) {
          if (changedParts[category]?.id !== selectedParts[category]?.id) return false;
        }
        
        return true;
      })();
      
      if (isClearPreview) {
        console.log('🧹 CLEARING PREVIEW: Cleaning up preview models and restoring originals');
        setPreviewParts(null);
        
        // Remove all preview models and restore original models visibility
        const modelGroup = modelGroupRef.current;
        if (!modelGroup) return;
        
        // Remove all preview models (marked with isPreview)
        const previewModelsToRemove: THREE.Object3D[] = [];
        const modelsToRestore: THREE.Object3D[] = [];
        
        modelGroup.traverse((child) => {
          if (child.userData.isPreview) {
            console.log('🗑️ PREVIEW CLEANUP: Removing preview model:', child.userData.partId);
            previewModelsToRemove.push(child);
          }
          // ✅ MEJORADO: Restaurar todos los modelos originales ocultos
          else if (!child.visible && child.userData.category && child.userData.partId) {
            const category = child.userData.category;
            const partId = child.userData.partId;
            
            // Verificar si este modelo coincide con el estado actual seleccionado
            const currentSelectedPart = selectedParts[category];
            if (currentSelectedPart && currentSelectedPart.id === partId) {
              console.log('👁️ VISIBILITY RESTORE: Restoring original model:', partId);
              modelsToRestore.push(child);
            }
          }
        });
        
                 // Remover modelos preview
        previewModelsToRemove.forEach(model => {
          modelGroup.remove(model);
          // ✅ MEJORADO: Limpiar memoria para meshes
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((mat: any) => mat.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        });
        
        // Restaurar visibilidad de modelos originales
        modelsToRestore.forEach(model => {
          model.visible = true;
        });
        
        console.log(`✅ CLEANUP COMPLETE: Removed ${previewModelsToRemove.length} preview models, restored ${modelsToRestore.length} original models`);
        return;
      }
      
      // Normal preview change
      const combinedParts = { ...selectedParts, ...changedParts };
      setPreviewParts(combinedParts);
      

      
      // For hover preview, directly load only the changed parts
      const modelGroup = modelGroupRef.current;
      if (!modelGroup) return;
      
      const basePath = (import.meta as any).env.BASE_URL || '/';
      const changedCategories = Object.keys(changedParts) as PartCategory[];
      
      // ✅ MEJORADO: Logging de debugging para hover preview
      console.log('🖱️ HOVER PREVIEW:', {
        changedCategories,
        changedParts: changedCategories.map(cat => ({
          category: cat,
          partId: changedParts[cat]?.id || 'none'
        }))
      });
      
      // Debug específico para cinturones
      if (changedCategories.includes(PartCategory.BELT)) {

      }
      
      // HOVER PREVIEW: Only remove existing preview models, never original models
      const modelsToRemove: THREE.Object3D[] = [];
      

      
      // HOVER PREVIEW LOGIC: Hide original models and remove preview models
      modelGroup.traverse((child) => {
        // Hide original models of the same category as the changing parts
        if (!child.userData.isPreview && 
            child.userData.category && 
            changedCategories.includes(child.userData.category)) {
          child.visible = false; // Hide original model

        }
        
        // Remove existing preview models of the same category
        if (child.userData.isPreview && 
            child.userData.category && 
            changedCategories.includes(child.userData.category)) {
          modelsToRemove.push(child);

        }
      });
      
      // Remove the preview models we found
      modelsToRemove.forEach(model => {
        modelGroup.remove(model);
      });
      
      // ✅ MEJORADO: Log de visibilidad después de ocultar modelos
      console.log('👁️ VISIBILITY UPDATE:', {
        hiddenModels: modelsToRemove.length,
        removedPreviewModels: modelsToRemove.filter(m => m.userData.isPreview).length
      });
      


      // ✅ MEJORADO: Load new models for changed categories with better async handling
      const loadPromises = changedCategories.map(async (category) => {
        const part = changedParts[category];
        if (!part || part.attributes?.none || part.attributes?.hidden || !part.gltfPath) {
          return null;
        }

        const modelPath = `${basePath}${part.gltfPath.startsWith('/') ? part.gltfPath.slice(1) : part.gltfPath}`;
        try {
          console.log('📦 PREVIEW LOAD: Loading preview model for:', part.id);

          const model = await modelCache.getModel(modelPath);
          
          // Tag the model with category for future removal
          model.userData.category = category;
          model.userData.partId = part.id;
          model.userData.isPreview = true; // Mark as preview
          
          // CRITICAL: Assign category to all meshes within the preview model
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.userData.category = category;
              child.userData.partId = part.id;
              child.userData.isPreview = true;
            }
          });
          
          return { model, category };

        } catch (error) {
          console.error(`❌ HOVER: Error loading model ${part.name} (${part.id})`, error);
          return null;
        }
      });

      // ✅ ESPERAR A QUE TODOS LOS MODELOS SE CARGUEN
      try {
        const results = await Promise.all(loadPromises);
        results.filter(Boolean).forEach(({ model }: any) => {
          console.log('✅ PREVIEW ADD: Adding preview model to scene:', model.userData.partId);
          modelGroup.add(model);
        });
        console.log(`🎯 PREVIEW COMPLETE: Added ${results.filter(Boolean).length} preview models`);
      } catch (error) {
        console.error('❌ PREVIEW ERROR: Error loading preview models:', error);
      }
    },
    clearPreview: () => {
      console.log('🧹 [CLEAR PREVIEW] Llamado.');
      setPreviewParts(null);
      
      // Always restore visibility of currently selected models
      // This ensures that when a new part is selected, it remains visible
      if (modelGroupRef.current) {
        modelGroupRef.current.traverse((child) => {
          if (!child.userData.isPreview && !child.visible) {
            const category = child.userData.category;
            const partId = child.userData.partId;
            
            // Check if this model is still the currently selected one
            const isCurrentlySelected = selectedParts[category]?.id === partId;
            
            if (isCurrentlySelected) {
              child.visible = true; // Restore visibility
            }
          }
        });
      }
    },
    resetState: () => {
      console.log('♻️ [RESET STATE] Llamado.');
      setPreviewParts(null);
      setLastSelectedParts({});
      // Force a complete reload on the next change
    },
    resetCamera: () => {
      if (cameraRef.current && controlsRef.current) {
        // Usar valores predeterminados más amplios si no se han guardado los iniciales
        const pos = initialCameraPosition.current || new THREE.Vector3(5, 5, 12); // Aumentar Y y Z
        const tgt = initialCameraTarget.current || new THREE.Vector3(0, 2, 0);    // Aumentar Y del target

        console.log(`📸 [RESET CAMERA] Llamado. Posición inicial guardada: (${initialCameraPosition.current?.x.toFixed(2)},${initialCameraPosition.current?.y.toFixed(2)},${initialCameraPosition.current?.z.toFixed(2)})`);
        console.log(`📸 [RESET CAMERA] Llamado. Target inicial guardado: (${initialCameraTarget.current?.x.toFixed(2)},${initialCameraTarget.current?.y.toFixed(2)},${initialCameraTarget.current?.z.toFixed(2)})`);
        console.log(`📸 [RESET CAMERA] Posición destino (pos): (${pos.x.toFixed(2)},${pos.y.toFixed(2)},${pos.z.toFixed(2)})`);
        console.log(`📸 [RESET CAMERA] Target destino (tgt): (${tgt.x.toFixed(2)},${tgt.y.toFixed(2)},${tgt.z.toFixed(2)})`);

        const startPos = cameraRef.current.position.clone();
        const startTgt = controlsRef.current.target.clone();
        const endPos = pos.clone();
        const endTgt = tgt.clone();
        const duration = 350;
        const startTime = performance.now();
        function animate() {
          const now = performance.now();
          const t = Math.min(1, (now - startTime) / duration);
          cameraRef.current!.position.lerpVectors(startPos, endPos, t);
          controlsRef.current!.target.lerpVectors(startTgt, endTgt, t);
          controlsRef.current!.update();

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            console.log('✅ [RESET CAMERA] Animación finalizada.');
          }
        }
        requestAnimationFrame(animate);
        console.log('📸 [RESET CAMERA] Llamado.');
      }
    },
    setViewAngle: (azimuthPercentage: number) => {

      if (cameraRef.current && controlsRef.current) {
        // Convert percentage to radians (100% = 2π, so percentage/100 * 2π)
        const targetAzimuth = (azimuthPercentage / 100) * 2 * Math.PI;
        const distance = 6.8; // 15% closer (8 * 0.85 = 6.8)
        
        controlsRef.current.target.set(0, 1.5, 0);
        
        // Use spherical coordinates for proper azimuthal positioning
        const spherical = new THREE.Spherical();
        spherical.radius = distance;
        spherical.phi = Math.PI / 2.5; // Slightly elevated view (~72 degrees from vertical)
        spherical.theta = targetAzimuth; // Set azimuthal angle
        cameraRef.current.position.setFromSpherical(spherical).add(controlsRef.current.target);
        
        controlsRef.current.update();
      }
    },
    takeScreenshot: async () => {

      return new Promise<string>((resolve) => {
        if (rendererRef.current) {
          // Render the scene
          rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          
          // Get the canvas data
          const canvas = rendererRef.current.domElement;
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } else {
          resolve('');
        }
      });
    },
    // Nuevos métodos para materiales
    applyMaterialToPart: (material: THREE.Material, partType: string) => {
      if (modelGroupRef.current) {
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.category === partType) {
            child.material = material.clone();
          }
        });
      }
    },
    applyLightingPreset: (preset: any) => {
      // Implementar presets de iluminación

    },
    applyColorToPart: (color: number, partType: string) => {
      console.log(`🎨 Applying color ${color.toString(16)} to part: ${partType}`);
      if (modelGroupRef.current) {
        let foundMeshes = 0;
        let coloredMeshes = 0;
        
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            console.log(`🔍 Checking mesh: ${child.name || 'unnamed'}`, {
              userDataCategory: child.userData.category,
              partType,
              materialType: child.material?.constructor?.name,
              isMeshPhysicalMaterial: child.material instanceof THREE.MeshPhysicalMaterial
            });
            
            if (child.userData.category === partType) {
              foundMeshes++;
              if (child.material instanceof THREE.MeshPhysicalMaterial) {
                child.material.color.setHex(color);
                coloredMeshes++;
                console.log(`✅ Applied color to ${partType}: ${child.name || 'unnamed'}`);
              } else {
                console.log(`⚠️ Material not MeshPhysicalMaterial for ${partType}: ${child.name || 'unnamed'}`);
              }
            }
          }
        });
        
        console.log(`🎨 Summary for ${partType}: Found ${foundMeshes} meshes, colored ${coloredMeshes}`);
      } else {
        console.log('❌ Model group not available');
      }
    },
     applyColorToAllParts: (color: number) => {
       console.log(`🎨 Applying color ${color.toString(16)} to all colorable parts`);
       if (modelGroupRef.current) {
         let coloredCount = 0;
         modelGroupRef.current.traverse((child) => {
           if (child instanceof THREE.Mesh && child.userData.category) {
             // Solo colorear partes coloreables (excluir cabeza)
             const category = child.userData.category;
             if (category !== PartCategory.HEAD) {
               if (child.material instanceof THREE.MeshPhysicalMaterial) {
                 child.material.color.setHex(color);
                 coloredCount++;
                 console.log(`✅ Applied color to ${category}: ${child.name || 'unnamed'}`);
               } else {
                 console.log(`⚠️ Material not MeshPhysicalMaterial for ${category}: ${child.name || 'unnamed'}`);
               }
             } else {
               console.log(`🚫 Skipping HEAD category: ${child.name || 'unnamed'}`);
             }
           }
         });
         console.log(`🎨 Total parts colored: ${coloredCount}`);
       } else {
         console.log('❌ Model group not available');
       }
     },
    applyTextureToPart: (textureType: string, partType: string) => {
      if (modelGroupRef.current) {
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.category === partType) {
            // Assuming textureType is 'albedo', 'normal', 'roughness', etc.
            // This part would require actual texture loading logic
            // For now, we'll just log the request
            console.log(`Applying texture type: ${textureType} to part: ${partType}`);
            // Example: child.material.map = new THREE.TextureLoader().load(`/textures/${textureType}.png`);
          }
        });
      }
    },
         toggleEdgeDetection: (selectedPart?: string) => {
       console.log('🎨 Toggle edge detection for part:', selectedPart);
       
       if (edgeDetectionActive) {
         // Remove wireframe effects
         if (edgeLinesRef.current.length > 0) {
           edgeLinesRef.current.forEach(wireframe => {
             // Remove wireframe from its parent mesh
             if (wireframe.parent) {
               wireframe.parent.remove(wireframe);
             }
           });
           edgeLinesRef.current = [];
         }
         setEdgeDetectionActive(false);
         console.log('🎨 Wireframe effect disabled');
       } else {
         // Apply wireframe effect to selected part only
         if (modelGroupRef.current && sceneRef.current) {
           const newEdgeLines: THREE.LineSegments[] = [];
           
           // Get all meshes first to avoid redefining the array
           const allMeshes: THREE.Mesh[] = [];
           modelGroupRef.current.traverse((obj) => {
             if (obj instanceof THREE.Mesh) {
               allMeshes.push(obj);
             }
           });
           
           modelGroupRef.current.traverse((child) => {
             if (child instanceof THREE.Mesh) {
               // Since all meshes are named "mesh_0", we need to identify parts by their position in the model hierarchy
               const partName = selectedPart?.toLowerCase() || '';
               
               console.log(`🔍 Checking mesh: "${child.name}" for part: "${selectedPart}"`);
               console.log(`🔍 Mesh parent: "${child.parent?.name || 'no parent'}"`);
               console.log(`🔍 Mesh userData:`, child.userData);
               
               // Get the current mesh index
               const currentMeshIndex = allMeshes.indexOf(child);
               console.log(`🔍 Current mesh index: ${currentMeshIndex} out of ${allMeshes.length} total meshes`);
               
               // Try to identify the part based on the mesh's position in the hierarchy
               let isTargetMesh = false;
               
               if (!selectedPart) {
                 // If no part selected, apply to all meshes
                 isTargetMesh = true;
               } else {
                 // Map mesh indices to parts (this is based on the loading order)
                 // This is a temporary mapping - we'll need to improve this
                 switch (partName) {
                   case 'torso':
                     // Torso is usually the first few meshes (base, torso, chest_belt)
                     isTargetMesh = currentMeshIndex >= 0 && currentMeshIndex <= 2;
                     break;
                   case 'head':
                     // Head is usually around index 3
                     isTargetMesh = currentMeshIndex === 3;
                     break;
                   case 'hands':
                     // Hands are usually around indices 4-5
                     isTargetMesh = currentMeshIndex >= 4 && currentMeshIndex <= 5;
                     break;
                   case 'cape':
                     // Cape is usually around index 6
                     isTargetMesh = currentMeshIndex === 6;
                     break;
                   case 'belt':
                     // Belt components are usually around indices 7-9
                     isTargetMesh = currentMeshIndex >= 7 && currentMeshIndex <= 9;
                     break;
                   case 'boots':
                     // Boots are usually around index 10
                     isTargetMesh = currentMeshIndex === 10;
                     break;
                   case 'symbol':
                     // Symbol is usually around index 11
                     isTargetMesh = currentMeshIndex === 11;
                     break;
                   case 'legs':
                     // Legs are usually around index 12
                     isTargetMesh = currentMeshIndex === 12;
                     break;
                   default:
                     isTargetMesh = false;
                     break;
                 }
               }
               
               if (isTargetMesh) {
                 console.log(`✅ Found matching mesh at index ${currentMeshIndex} for part: "${selectedPart}"`);
               }
               
               if (isTargetMesh) {
                 try {
                   // Create a wireframe overlay that matches the mesh exactly
                   const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
                                    const wireframeMaterial = new THREE.LineBasicMaterial({ 
                   color: 0x00ffff, // Cyan color
                   linewidth: 2,
                   transparent: true,
                   opacity: 0.8,
                   depthTest: true, // Allow depth testing
                   depthWrite: false
                 });
                   const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
                   
                   // Make wireframe a child of the original mesh so it moves with it
                   child.add(wireframe);
                   newEdgeLines.push(wireframe);
                   
                   console.log(`🎨 Applied wireframe effect to mesh: ${child.name || 'unnamed'} (part: ${selectedPart})`);
                 } catch (error) {
                   console.error(`❌ Error applying wireframe to mesh: ${child.name || 'unnamed'}`, error);
                 }
               }
             }
           });
           
           edgeLinesRef.current = newEdgeLines;
           setEdgeDetectionActive(true);
           console.log(`🎨 Wireframe effect enabled for ${selectedPart || 'all parts'} - applied to ${newEdgeLines.length} meshes`);
           
           // If no meshes were found, log all available meshes for debugging
           if (newEdgeLines.length === 0 && selectedPart) {
             console.log('🔍 No meshes found for selected part. Available meshes:');
             modelGroupRef.current.traverse((child) => {
               if (child instanceof THREE.Mesh) {
                 console.log(`  - "${child.name}"`);
               }
             });
           }
         } else {
           console.log('❌ Model group or scene not available');
         }
       }
     },
    zoomToPart: (category: string) => {
      if (!cameraRef.current || !controlsRef.current || !modelGroupRef.current) return;

      // Buscar todas las mallas (mesh) visibles que pertenecen a la categoría
      const meshesForCategory: THREE.Mesh[] = [];
      console.log(`🔍 [ZOOM TRAVERSE] Iniciando búsqueda de mallas para categoría: ${category}`);
      modelGroupRef.current.traverse((child: THREE.Object3D) => {
        console.log(`🔍 [ZOOM TRAVERSE] Examinando child: Name=${child.name || 'N/A'}, UUID=${child.uuid}, InstanceOfMesh=${child instanceof THREE.Mesh}, Visible=${child.visible}, UserDataCategory=${child.userData.category || 'N/A'}`);
        if (child instanceof THREE.Mesh && child.visible && child.userData && child.userData.category === category) {
          meshesForCategory.push(child);
          console.log(`✅ [ZOOM TRAVERSE] Malla de destino encontrada y añadida para ${category}: Name=${child.name || 'N/A'}, UUID=${child.uuid}`);
        }
      });

      if (meshesForCategory.length === 0) {
        console.warn(`[ZOOM] No se encontró ninguna malla visible para la categoría: ${category}. No se puede calcular el bounding box.`);
        return;
      }

      // Crear un bounding box que contenga todas las mallas de la categoría
      const combinedBox = new THREE.Box3();
      meshesForCategory.forEach(mesh => {
        combinedBox.expandByObject(mesh);
      });
      
      const center = combinedBox.getCenter(new THREE.Vector3());
      // Offsets configurables por categoría para centrado visual
      const OFFSETS: Record<string, {x?: number, y?: number, z?: number}> = {
        HEAD: { y: 2.0 },
        TORSO: { y: 0 },
        // Puedes agregar más categorías y valores aquí
      };
      const offset = OFFSETS[category] || {};
      if (offset.x) center.x += offset.x;
      if (offset.y) center.y += offset.y;
      if (offset.z) center.z += offset.z;

      const size = combinedBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      console.log(`🔍 [ZOOM] Bounding Box Combinado - Center: (${center.x.toFixed(2)},${center.y.toFixed(2)},${center.z.toFixed(2)}) Size: (${size.x.toFixed(2)},${size.y.toFixed(2)},${size.z.toFixed(2)}) Max Dim: ${maxDim.toFixed(2)})`);

      // === NEW LOGIC: Usar maxDim real para todas las categorías ===
      let effectiveMaxDim = maxDim;

      // Calcular la distancia necesaria para que la parte ocupe el 70% del FOV
      const fov = cameraRef.current.fov * (Math.PI / 180);
      let distance = (effectiveMaxDim / (2 * Math.tan(fov / 2))) * 0.5;

      // Asegurar una distancia mínima para evitar meterse dentro del modelo
      distance = Math.max(distance, 7.0);
      console.log(`🔍 [ZOOM] Calculated distance (raw): ${(maxDim / (2 * Math.tan(fov / 2))).toFixed(2)}`);
      console.log(`🔍 [ZOOM] Calculated distance (final after multiplier and min): ${distance.toFixed(2)}`);

      // Calcular la posición final de la cámara desde un ángulo frontal estándar
      const phi = Math.PI / 2.5; // Ángulo vertical (ligeramente elevado)
      const azimuth = Math.PI / 5; // Ángulo horizontal (frontal-izquierda, similar a la vista inicial)

      const x = center.x + distance * Math.sin(phi) * Math.cos(azimuth);
      const y = center.y + distance * Math.cos(phi);
      const z = center.z + distance * Math.sin(phi) * Math.sin(azimuth);

      const endPos = new THREE.Vector3(x, y, z);
      const endTgt = center; // El target es el centro de la parte

      console.log('🔍 [ZOOM] Calculando zoom a categoría:', category);
      console.log('🔍 [ZOOM] Distancia calculada (final): ', distance.toFixed(2));
      console.log(`🔍 [ZOOM] Posición final (endPos): (${endPos.x.toFixed(2)},${endPos.y.toFixed(2)},${endPos.z.toFixed(2)})`);
      console.log(`🔍 [ZOOM] Target final (endTgt): (${endTgt.x.toFixed(2)},${endTgt.y.toFixed(2)},${endTgt.z.toFixed(2)})`);

      const startPos = cameraRef.current.position.clone();
      const startTgt = controlsRef.current.target.clone();
      const duration = 350;
      const startTime = performance.now();

      function animate() {
        const now = performance.now();
        const t = Math.min(1, (now - startTime) / duration);
        cameraRef.current!.position.lerpVectors(startPos, endPos, t);
        controlsRef.current!.target.lerpVectors(startTgt, endTgt, t);
        controlsRef.current!.update();

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          cameraRef.current!.position.copy(endPos);
          controlsRef.current!.target.copy(endTgt);
          controlsRef.current!.update();
          console.log('✅ [ZOOM TO PART] Animación finalizada para categoría:', category);
        }
      }
      requestAnimationFrame(animate);
    }
  }));

  // Al final de la función, retornar el contenedor principal:
  return (
    <div ref={mountRef} className="relative w-full h-full select-none">
      {/* Nombre del personaje editable en recuadro */}
      {characterName && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 select-none" style={{minWidth: 220, maxWidth: 400}}>
          {editingName ? (
            <input
              className="w-full text-center text-2xl font-bold text-orange-400 bg-slate-900/90 border-2 border-orange-400 rounded-lg px-3 py-1 outline-none shadow-lg"
              style={{letterSpacing: '0.04em'}}
              value={tempName}
              autoFocus
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              maxLength={32}
            />
          ) : (
            <div
              className="w-full shadow-lg text-center text-2xl text-orange-400 bg-slate-900/90 border-2 border-orange-400 hover:bg-orange-400/10 rounded-lg font-bold px-3 py-1 cursor-pointer transition"
              style={{letterSpacing: '0.04em'}}
              onClick={handleNameClick}
              title="Click to edit name"
            >
              {characterName}
            </div>
          )}
        </div>
      )}


      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm will-change-transform z-20">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Rotating outer ring */}
              <div className="absolute inset-0 border-4 border-orange-400/30 rounded-full animate-spin border-t-orange-400"></div>
              {/* Secondary inner ring */}
              <div className="absolute inset-2 border-3 border-cyan-400/40 rounded-full animate-spin animate-reverse border-b-cyan-400" style={{ animationDuration: '2s' }}></div>
              {/* Inner pulsing circle */}
              <div className="absolute inset-3 bg-gradient-to-r from-orange-400/20 to-cyan-400/20 rounded-full animate-pulse"></div>
              {/* 3D Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
                🦸‍♂️
              </div>
            </div>
            <div className="text-xl font-black text-orange-400 mb-2 animate-pulse uppercase tracking-wider"
                 style={{ fontFamily: 'RefrigeratorDeluxeHeavy, sans-serif' }}>
              Loading 3D Model
            </div>
            <div className="text-sm text-cyan-400 font-bold uppercase tracking-wider"
                 style={{ fontFamily: 'RefrigeratorDeluxeBold, sans-serif' }}>
              Preparing your superhero...
            </div>
            <div className="mt-4 w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* ✨ Cache Loading Status Indicator */}
      {cacheLoadingStatus && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30">
          <div className="px-4 py-2 bg-slate-800/90 backdrop-blur-sm will-change-transform rounded-full border border-slate-600/50 text-white text-sm font-medium shadow-lg">
            {cacheLoadingStatus}
          </div>
        </div>
      )}

      {/* Precision Controls - Bottom Center */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center z-30">
        <div className="flex items-center gap-4">
        {/* Rotate Left */}
        <button
          onClick={() => {
            if (cameraRef.current && controlsRef.current) {
              const currentAzimuth = controlsRef.current.getAzimuthalAngle();
              const newAzimuth = currentAzimuth - Math.PI / 12; // 15 degrees
              // Use spherical coordinates to set new position
              const spherical = new THREE.Spherical();
              spherical.radius = controlsRef.current.getDistance();
              spherical.phi = controlsRef.current.getPolarAngle();
              spherical.theta = newAzimuth;
              cameraRef.current.position.setFromSpherical(spherical).add(controlsRef.current.target);
              controlsRef.current.update();
            }
          }}
          className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-cyan-400 hover:text-cyan-300 border-cyan-400/20 hover:border-cyan-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center"
          title="Rotate left (15°)"
        >
          ↶
        </button>
        
        {/* Zoom Out */}
        <button
          onClick={() => {
            if (cameraRef.current && controlsRef.current) {
              // Zoom out by increasing distance
              const currentDistance = controlsRef.current.getDistance();
              const newDistance = Math.min(currentDistance + 0.5, 15); // Max zoom out aumentado
              
              const spherical = new THREE.Spherical();
              spherical.radius = newDistance;
              spherical.phi = controlsRef.current.getPolarAngle();
              spherical.theta = controlsRef.current.getAzimuthalAngle();
              
              cameraRef.current.position.setFromSpherical(spherical).add(controlsRef.current.target);
              controlsRef.current.update();
            }
          }}
          className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-orange-400 hover:text-orange-300 border-orange-400/20 hover:border-orange-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center"
          title="Zoom out"
        >
          🔍-
        </button>
        
        {/* Reset Camera */}
        <button
          onClick={() => {
            // Set to 5% azimuth (Inicio view) - using proper model-based distance
            if (cameraRef.current && controlsRef.current && modelGroupRef.current) {
              const targetAzimuth = Math.PI / 5; // ~36 degrees (20% of full rotation) - moved 15% more to the left
              
              if (modelGroupRef.current.children.length > 0) {
                // Calculate proper distance based on model size (15% closer total + 10% más lejos)
                const box = new THREE.Box3().setFromObject(modelGroupRef.current);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = cameraRef.current.fov * (Math.PI / 180);
                const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.2825 * 1.1; // 15% closer total + 10% más lejos
                
                controlsRef.current.target.set(0, 0, 0);
                const spherical = new THREE.Spherical();
                spherical.radius = distance;
                spherical.phi = Math.PI / 2.5;
                spherical.theta = targetAzimuth;
                cameraRef.current.position.setFromSpherical(spherical).add(controlsRef.current.target);
              } else {
                // Default fallback
                controlsRef.current.target.set(0, 1.5, 0);
                const spherical = new THREE.Spherical();
                spherical.radius = 6.8 * 1.1; // 15% closer (8 * 0.85 = 6.8) + 10% más lejos
                spherical.phi = Math.PI / 2.5;
                spherical.theta = targetAzimuth;
                cameraRef.current.position.setFromSpherical(spherical).add(controlsRef.current.target);
              }
              controlsRef.current.update();
            }
          }}
          className="w-12 h-12 from-purple-600 hover:from-purple-500 backdrop-blur-sm flex shadow-lg bg-gradient-to-r to-blue-600 hover:to-blue-500 text-white border-purple-400/20 hover:border-purple-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center font-bold"
          title="Initial view (5%)"
        >
          👁️
        </button>
        
        {/* Zoom In */}
        <button
          onClick={() => {
            if (cameraRef.current && controlsRef.current) {
              // Zoom in by decreasing distance
              const currentDistance = controlsRef.current.getDistance();
              const newDistance = Math.max(currentDistance - 0.5, 4); // Min zoom in aumentado
              
              const spherical = new THREE.Spherical();
              spherical.radius = newDistance;
              spherical.phi = controlsRef.current.getPolarAngle();
              spherical.theta = controlsRef.current.getAzimuthalAngle();
              
              cameraRef.current.position.setFromSpherical(spherical).add(controlsRef.current.target);
              controlsRef.current.update();
            }
          }}
          className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-orange-400 hover:text-orange-300 border-orange-400/20 hover:border-orange-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center"
          title="Zoom in"
        >
          🔍+
        </button>
        
        {/* Rotate Right */}
        <button
          onClick={() => {
            if (cameraRef.current && controlsRef.current) {
              const currentAzimuth = controlsRef.current.getAzimuthalAngle();
              const newAzimuth = currentAzimuth + Math.PI / 12; // 15 degrees
              // Use spherical coordinates to set new position
              const spherical = new THREE.Spherical();
              spherical.radius = controlsRef.current.getDistance();
              spherical.phi = controlsRef.current.getPolarAngle();
              spherical.theta = newAzimuth;
              cameraRef.current.position.setFromSpherical(spherical).add(controlsRef.current.target);
              controlsRef.current.update();
            }
          }}
          className="w-10 h-10 backdrop-blur-sm flex shadow-lg bg-slate-800/80 hover:bg-slate-700/90 text-cyan-400 hover:text-cyan-300 border-cyan-400/20 hover:border-cyan-400/40 rounded-full transition-colors transition-transform transition-shadow duration-200 will-change-transform border items-center justify-center"
          title="Rotate right (15°)"
        >
          ↷
        </button>
        </div>
      </div>

      {/* Library Navigation - Top Left */}
      <PoseNavigation
        savedPoses={savedPoses || []}
        currentPoseIndex={currentPoseIndex}
        onPreviousPose={onPreviousPose || (() => {})}
        onNextPose={onNextPose || (() => {})}
        onSelectPose={onSelectPose || (() => {})}
        onRenamePose={onRenamePose}
      />

      {/* Screenshot Button - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        {/* Botones eliminados: Test Colors, Colores, y Hoja de Personaje */}
      </div>
    </div>
  );
});

CharacterViewer.displayName = 'CharacterViewer';

export default CharacterViewer; 