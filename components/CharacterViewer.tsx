import { useEffect, useRef, useCallback, useState, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { SelectedParts, ArchetypeId, PartCategory, Part } from '../types';
import { ALL_PARTS, DEFAULT_JUSTICIERO_BUILD, DEFAULT_STRONG_BUILD } from '../constants';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { exportModel, downloadBlob, generateModelName } from '../lib/utils';
import { modelCache } from '../lib/modelCache';
import PoseNavigation from './PoseNavigation';
import { LightingPreset } from './materials/materials'; // Corrected import path
import { areSelectedPartsEqual } from '../lib/utils'; // Import the new utility

interface CharacterViewerProps {
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId | null;
  characterName?: string; // NUEVO
  onCharacterNameChange?: (newName: string) => void; // NUEVO
  isAuthenticated?: boolean; // ? NUEVO: Estado de autenticaci�n
  // Nueva funcionalidad para navegaci�n de poses
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
  onSaveAsNew?: () => void;
  onDeletePose?: (index: number) => void;
}

// Expose methods to parent component
export interface CharacterViewerRef {
  exportModel: () => Promise<any>;
  exportSTL: (options?: { scaleFactor?: number }) => Promise<any>;
  getScene: () => THREE.Scene | null;
  getRenderer: () => THREE.WebGLRenderer | null;
  getCamera: () => THREE.Camera | null;
  handlePreviewPartsChange: (_parts: SelectedParts) => Promise<void>;
  clearPreview: () => void;
  resetState: () => void;
  resetCamera: () => void;
  setViewAngle: (azimuthPercentage: number) => void;
  takeScreenshot: () => Promise<string>;
  takeTokenScreenshot: () => Promise<string>;
  takeScreenshotWithZoom: (zoom: number, position: { x: number; y: number }) => Promise<string>;
  applyMaterialToPart: (material: THREE.Material, partType: string) => void;
  applyLightingPreset: (preset: LightingPreset) => void;
  applyColorToPart: (color: number, partType: string) => void;
  applyColorToAllParts: (color: number) => void;
  applyTextureToPart: (partType: string) => void;
  toggleEdgeDetection: (selectedPart?: string) => void;
  setComposer: (composer: EffectComposer | null) => void; // New method for effects
      debugMeshes: () => void; // Nueva funci�n de debug
    debugAvailableParts: () => void; // Debug available parts
  preloadParts: (parts: Part[]) => void;
}

const CharacterViewer = forwardRef<CharacterViewerRef, CharacterViewerProps>(({
  selectedParts, 
  selectedArchetype,
  characterName, 
  onCharacterNameChange,
  isAuthenticated = false, // ? NUEVO: Estado de autenticaci�n con valor por defecto
  savedPoses,
  currentPoseIndex = 0,
  onPreviousPose,
  onNextPose,
  onSelectPose,
  onRenamePose,
  onSaveAsNew,
  onDeletePose,
}, ref) => {
  const getDefaultBuildForArchetype = useCallback((archetype: ArchetypeId | null): SelectedParts => {
    if (archetype === ArchetypeId.JUSTICIERO) {
      return DEFAULT_JUSTICIERO_BUILD;
    }
    return DEFAULT_STRONG_BUILD;
  }, []);

  const mountRef = useRef<HTMLDivElement>(null);
  
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const loaderRef = useRef<GLTFLoader | null>(null);
  // const initialCameraPosition = useRef<THREE.Vector3 | null>(null); // Removed: no longer used
  // const initialCameraTarget = useRef<THREE.Vector3 | null>(null); // Removed: no longer used

  const [isLoading, setIsLoading] = useState(false);
  const [previewParts, setPreviewParts] = useState<SelectedParts | null>(null);
  const lastSelectedPartsRef = useRef<SelectedParts>({});
  const lastSelectedArchetypeRef = useRef<ArchetypeId | null>(null);
  const hoverLoadCountRef = useRef(0);
  const [isThreeJSReady, setIsThreeJSReady] = useState(false); // ? NUEVO: Flag para controlar cuando Three.js est� listo
  const [edgeDetectionActive, setEdgeDetectionActive] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(characterName || '');
  const [isHoverPreviewActive, setIsHoverPreviewActive] = useState(false);

  const edgeLinesRef = useRef<THREE.LineSegments[]>([]);

  // Refs for Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const isInitializedRef = useRef(false);

  const hasUserInteractedWithCamera = useRef(false); // NEW: Track if user has moved camera

  // ? NEW: Camera Constants for Consistency
  const CAMERA_CONSTANTS = {
    DEFAULT_TARGET: new THREE.Vector3(0, 1.5, 0),
    AUTO_FRAME_TARGET: new THREE.Vector3(0, 1.5, 0), // Orbit around mid-body (chest), not feet
    DEFAULT_DISTANCE: 150,
    MIN_ZOOM_DISTANCE: 25,
    MAX_ZOOM_DISTANCE: 210,
    DEFAULT_AZIMUTH: Math.PI / 5,
    AUTO_FRAME_AZIMUTH: Math.PI / 10,
    DEFAULT_POLAR: Math.PI / 2.5,
    RESET_POLAR: Math.PI / 2.8,
    AUTO_FRAME_MULTIPLIER: 1.4, // More breathing room around model
  };

  // Handlers for name editing
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

  // Handlers for precision controls
  const handleRotateLeft = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const currentCamera = cameraRef.current;
    const currentControls = controlsRef.current;
    const currentAzimuth = currentControls.getAzimuthalAngle();
    const newAzimuth = currentAzimuth + Math.PI / 12;
    const spherical = new THREE.Spherical();
    spherical.radius = currentControls.getDistance();
    spherical.phi = currentControls.getPolarAngle();
    spherical.theta = newAzimuth;
    currentCamera.position.setFromSpherical(spherical).add(currentControls.target);
    currentControls.update();
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const currentCamera = cameraRef.current;
    const currentControls = controlsRef.current;
    const currentDistance = currentControls.getDistance();
    // Let OrbitControls handle min/max distance clamping
    const newDistance = currentDistance + 0.5;
    const spherical = new THREE.Spherical().setFromVector3(currentCamera.position.clone().sub(currentControls.target));
    spherical.radius = newDistance;
    spherical.phi = currentControls.getPolarAngle();
    spherical.theta = currentControls.getAzimuthalAngle();
    currentCamera.position.setFromSpherical(spherical).add(currentControls.target);
    currentControls.update();
  }, []);

  const handleResetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || !modelGroupRef.current) return;
    const currentCamera = cameraRef.current;
    const currentControls = controlsRef.current;
    const targetAzimuth = CAMERA_CONSTANTS.DEFAULT_AZIMUTH; // Standardize azimuth for reset
    if (modelGroupRef.current.children.length > 0) {
      const box = new THREE.Box3().setFromObject(modelGroupRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = currentCamera.fov * (Math.PI / 180);
      // Use auto-frame multiplier from constants
      const distance = (maxDim / (2 * Math.tan(fov / 2))) * CAMERA_CONSTANTS.AUTO_FRAME_MULTIPLIER;
      currentControls.target.set(CAMERA_CONSTANTS.AUTO_FRAME_TARGET.x, CAMERA_CONSTANTS.AUTO_FRAME_TARGET.y, CAMERA_CONSTANTS.AUTO_FRAME_TARGET.z);
      const spherical = new THREE.Spherical();
      spherical.radius = distance;
      spherical.phi = CAMERA_CONSTANTS.DEFAULT_POLAR; // Standardize polar angle for auto-framing
      spherical.theta = CAMERA_CONSTANTS.AUTO_FRAME_AZIMUTH; // Use auto-frame azimuth
      currentCamera.position.setFromSpherical(spherical).add(currentControls.target);
    } else {
      currentControls.target.set(CAMERA_CONSTANTS.DEFAULT_TARGET.x, CAMERA_CONSTANTS.DEFAULT_TARGET.y, CAMERA_CONSTANTS.DEFAULT_TARGET.z);
      const spherical = new THREE.Spherical();
      spherical.radius = CAMERA_CONSTANTS.DEFAULT_DISTANCE; // Use default distance from constants
      spherical.phi = CAMERA_CONSTANTS.RESET_POLAR; // Use reset polar angle from constants
      spherical.theta = CAMERA_CONSTANTS.DEFAULT_AZIMUTH; // Standardize azimuth for fallback
      currentCamera.position.setFromSpherical(spherical).add(currentControls.target);
    }
    currentControls.update();
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const currentCamera = cameraRef.current;
    const currentControls = controlsRef.current;
    const currentDistance = currentControls.getDistance();
    // Let OrbitControls handle min/max distance clamping
    const newDistance = currentDistance - 0.5;
    const spherical = new THREE.Spherical().setFromVector3(currentCamera.position.clone().sub(currentControls.target));
    spherical.radius = newDistance;
    spherical.phi = currentControls.getPolarAngle();
    spherical.theta = currentControls.getAzimuthalAngle();
    currentCamera.position.setFromSpherical(spherical).add(currentControls.target);
    currentControls.update();
  }, []);

  const handleRotateRight = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const currentCamera = cameraRef.current;
    const currentControls = controlsRef.current;
    const currentAzimuth = currentControls.getAzimuthalAngle();
    const newAzimuth = currentAzimuth - Math.PI / 12;
    const spherical = new THREE.Spherical();
    spherical.radius = currentControls.getDistance();
    spherical.phi = currentControls.getPolarAngle();
    spherical.theta = newAzimuth;
    currentCamera.position.setFromSpherical(spherical).add(currentControls.target);
    currentControls.update();
  }, []);

  // Modify OrbitControls to detect user interaction
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    
    const handleStart = () => {
      hasUserInteractedWithCamera.current = true;
    };
    
    controls.addEventListener('start', handleStart);
    
    return () => {
      if (controls) {
        controls.removeEventListener('start', handleStart);
      }
    };
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    setTempName(characterName || '');
  }, [characterName]);

  // ? Reset camera interaction when user authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('CharacterViewer: User authenticated, resetting camera interaction flag');
      hasUserInteractedWithCamera.current = false;
    }
  }, [isAuthenticated]);

  // Initialize cache
  useLayoutEffect(() => {
    // ? PREVENT MULTIPLE INITIALIZATION
    if (isInitializedRef.current) {
      // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Already initialized, skipping');
    }
    }
      return;
    }

    if (!mountRef.current) {
      console.error('CharacterViewer: mountRef.current is null on useLayoutEffect initialization');
      return;
    }

    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Starting Three.js initialization...');
    }
    }
    isInitializedRef.current = true;

    const currentMount = mountRef.current;
    
    // Ensure mount has proper dimensions before initializing Three.js
    const mountWidth = Math.max(currentMount.clientWidth, 300);
    const mountHeight = Math.max(currentMount.clientHeight, 400);
    
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: mountRef.current dimensions (before renderer init):', {
        original: { width: currentMount.clientWidth, height: currentMount.clientHeight },
        adjusted: { width: mountWidth, height: mountHeight }
      });
    }

    // Scene setup with Strong archetype theme
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#b6bec8');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      28.6,
      mountWidth / mountHeight,
      0.1,
      1000
    );
    // Position camera with default azimuthal rotation
    const azimuthalRotation = CAMERA_CONSTANTS.DEFAULT_AZIMUTH;
    const distance = CAMERA_CONSTANTS.DEFAULT_DISTANCE;
    camera.position.set(
      Math.sin(azimuthalRotation) * distance, // X position for azimuthal rotation
      CAMERA_CONSTANTS.DEFAULT_TARGET.y, // Keep same height as target
      Math.cos(azimuthalRotation) * distance  // Z position for azimuthal rotation
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mountWidth, mountHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor('#aeb7c2', 1);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;
  
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Renderer initialized with size:', {
        width: currentMount.clientWidth,
        height: currentMount.clientHeight,
        pixelRatio: window.devicePixelRatio
      });
    }
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 1.5;
    controls.zoomSpeed = 1.2;
    // Centrar la c�mara en el origen
    controls.target.set(CAMERA_CONSTANTS.DEFAULT_TARGET.x, CAMERA_CONSTANTS.DEFAULT_TARGET.y, CAMERA_CONSTANTS.DEFAULT_TARGET.z);
    
    // Enable azimuthal rotation (horizontal) while limiting vertical movement
    controls.enablePan = false; // Disable panning
    controls.enableZoom = true; // Keep zoom enabled
    controls.enableRotate = true; // Keep rotation enabled
    
    // Allow full Y rotation (front/back) but prevent viewing from below
    controls.minPolarAngle = Math.PI / 6; // 30 degrees (can look from above)
    controls.maxPolarAngle = Math.PI / 2; // 90 degrees (horizontal, prevents viewing from below)
    
    // ? NEW: Set zoom limits directly on OrbitControls
    controls.minDistance = CAMERA_CONSTANTS.MIN_ZOOM_DISTANCE;
    controls.maxDistance = CAMERA_CONSTANTS.MAX_ZOOM_DISTANCE;
    
    // Allow full azimuthal rotation (360 degrees) to see front and back
    controls.minAzimuthAngle = -Infinity; // Full rotation allowed
    controls.maxAzimuthAngle = Infinity; // Full rotation allowed
    
    controls.autoRotate = false; // Disable auto-rotation
    
    // Set the initial azimuthal angle directly using OrbitControls method
    // This ensures the angle limits work correctly
    controls.update(); // First update to calculate current angles
    
    // Set azimuthal angle to 20% rotation (p/5 = 36�) - moved 15% more to the left
    const targetAzimuth = Math.PI / 5;
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position.clone().sub(controls.target));
    spherical.theta = targetAzimuth; // Set azimuthal angle
    camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target));
    
    // console.log('?? Azimuth angle:', (controls.getAzimuthalAngle() * 180 / Math.PI).toFixed(1), '�');
    
    // ? ENABLE ZOOM - Allow zoom functionality
    // No event listeners that prevent zoom
    
    controls.update();
    controlsRef.current = controls;

    // Lighting setup
    const keyLight = new THREE.DirectionalLight(0xfff3e2, 1.5);
    keyLight.position.set(7, 12, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce7f4, 0.92);
    fillLight.position.set(-8, 6, 6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.72);
    rimLight.position.set(-2, 9, -10);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc2c9d3, 0.95);
    hemiLight.position.set(0, 14, 0);
    scene.add(hemiLight);

    // Initialize GLTFLoader and DRACOLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loaderRef.current = loader;

    // Initialize the global model cache with loaders
    modelCache.initializeLoaders(loader, dracoLoader);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambientLight);

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
      0.2,
      0.5,
      0.85
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      controls.update();
      composerRef.current?.render();
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;

      const rawWidth = mountRef.current.clientWidth;
      const rawHeight = mountRef.current.clientHeight;
      
      const newWidth = Math.max(rawWidth, 300);
      const newHeight = Math.max(rawHeight, 400);
      
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
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Resized to', { 
        from: { width: rawWidth, height: rawHeight },
        to: { width: newWidth, height: newHeight }
      });
    }
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === currentMount) {
          handleResize();
        }
      }
    });

    resizeObserver.observe(currentMount);

    // ? CRITICAL: Mark Three.js as ready AFTER everything is initialized
    setIsThreeJSReady(true);
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('?? Three.js initialization complete - ready for model loading');
    }
    }

    return () => {
      // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Cleaning up Three.js scene');
    }
    }
      cancelAnimationFrame(rafId);
      setIsThreeJSReady(false);
      isInitializedRef.current = false;
      resizeObserver.disconnect();
      if (currentMount && rendererRef.current?.domElement) {
        currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();
      modelCache.clearCache();
    };
  }, []); // Empty dependency array to run only once on mount

  // Incremental model loading - only load parts that changed
  // const loadModelsIncremental = useCallback(async (newParts: SelectedParts, force: boolean = false) => {
  //   const modelGroup = modelGroupRef.current;
  //   const camera = cameraRef.current;
  //   const controls = controlsRef.current;

  //   if (!modelGroup || !camera || !controls) {
  //     console.error('CharacterViewer: Missing required refs for loading models');
  //     return;
  //   }

  //   // Detect what changed
  //   const changedCategories: PartCategory[] = [];
  
  //   for (const category of Object.values(PartCategory)) {
  //     const oldPart = lastLoadedParts[category];
  //     const newPart = newParts[category];
  
  //     if (force || oldPart?.id !== newPart?.id) {
  //       changedCategories.push(category);
  //     }
  //   }

  //   if (changedCategories.length === 0 && !force) {
  //         // ?? OPTIMIZADO: Solo log en desarrollo


  // ? SIMPLIFIED: Single async function for model loading (no useCallback issues)
  const performModelLoad = async () => {
    console.log('?? CharacterViewer: performModelLoad iniciado - TIMESTAMP:', new Date().toISOString());
    console.log('?? Estado de autenticaci�n:', { isAuthenticated });
    console.log('?? selectedParts recibidas:', {
      count: Object.keys(selectedParts).length,
      parts: Object.entries(selectedParts).map(([category, part]) => `${category}: ${part?.id || 'undefined'}`),
      isEmpty: Object.keys(selectedParts).length === 0
    });
    console.log('?? EXECUTION COUNT - Esta es la ejecuci�n n�mero:', (window as any).__modelLoadCount = ((window as any).__modelLoadCount || 0) + 1);
    
    // ? SAFETY CHECK: Ensure Three.js is ready before loading
    if (!isThreeJSReady) {
      console.log('? Three.js not ready yet, skipping model load');
      return;
    }

    const modelGroup = modelGroupRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!modelGroup || !camera || !controls) {
      console.error('CharacterViewer: Missing required refs for loading models');
      return;
    }

    // ? FIXED: Always fall back to a complete default build when parts are missing.
    const defaultBuild = getDefaultBuildForArchetype(selectedArchetype);
    const hasSelectedParts = Object.keys(selectedParts).length > 0;
    let partsToLoad = hasSelectedParts ? { ...defaultBuild, ...selectedParts } : { ...defaultBuild };

    if (!hasSelectedParts) {
      console.log('?? selectedParts vac�o, cargando build por defecto para el visor:', selectedArchetype);
    } else {
      console.log('?? Completando piezas faltantes con el build por defecto');
    }
    
    const startTime = performance.now();
    setIsLoading(true);
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Loading models for Strong archetype with caching');
    }
    }
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Parts to load:', partsToLoad);
      console.log('CharacterViewer: Parts by category:', Object.entries(partsToLoad).map(([category, part]) => `${category}: ${part.id}`));
    }
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Using preview?', false);
    } // Always false now
    }

    // Debug espec�fico para cabezas
    const currentHead = Object.values(partsToLoad).find(p => p.category === PartCategory.HEAD);
    // Debug espec�fico para buckles
    const currentBuckle = Object.values(partsToLoad).find(p => p.category === PartCategory.BUCKLE);
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('?? DEBUG - CharacterViewer cargando cabeza:', currentHead?.id || 'ninguna');
      console.log('?? DEBUG - CharacterViewer cargando buckle:', currentBuckle?.id || 'ninguno');
    }
    }
    
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? CLEARING MODEL GROUP - Children before clear: ${modelGroup.children.length}`);
    }
    }
    
    // Just remove models from the scene — do NOT dispose geometry/materials.
    // The modelCache holds the authoritative references; disposing clones here
    // would corrupt the cached originals (Three.js clone() shares geometry and
    // material objects by reference, not by value).
    const childrenToRemove = [...modelGroup.children];
    childrenToRemove.forEach(child => {
      modelGroup.remove(child);
    });
    
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? CLEARING MODEL GROUP - Children after manual clear: ${modelGroup.children.length}`);
    }
    }

    const selectedPartList = Object.values(partsToLoad).filter(Boolean);
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Filtered part list:', selectedPartList);
    }
    }
    const basePath = (import.meta as any).env.BASE_URL || '/';
    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Base path:', basePath);
    }
    }
    
    // ? NUEVO: Cargar pedestal siempre (independientemente del estado de autenticaci�n)
    console.log('?? DEBUG: isAuthenticated =', isAuthenticated, '| selectedParts vac�o =', Object.keys(selectedParts).length === 0);
    
    // ? NUEVO: Cargar pedestal siempre
    console.log('?? CARGANDO PEDESTAL - Siempre');
    try {
      const baseModelPath = `${basePath}assets/strong/base/strong_base_01.glb`;
      console.log('?? Cargando pedestal desde:', baseModelPath);
      const baseModel = await modelCache.getModel(baseModelPath);
      
      // Tag the base model
      baseModel.userData.category = 'BASE';
      baseModel.userData.partId = 'strong_base_01';
      
      // ? NUEVO: Posicionar el pedestal correctamente
      baseModel.position.set(0, -0.5, 0); // Posicionar justo debajo del personaje
      baseModel.scale.set(1, 1, 1); // Escala normal
      
      // ? NUEVO: Asegurar que el pedestal sea visible
      baseModel.visible = true;
      baseModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.visible = true;
          // ? NUEVO: Forzar material visible
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.transparent = false;
                mat.opacity = 1;
                mat.color.setHex(0x8a94a1);
                mat.roughness = 0.92;
                mat.metalness = 0.04;
              });
            } else {
              child.material.transparent = false;
              child.material.opacity = 1;
              child.material.color.setHex(0x8a94a1);
              child.material.roughness = 0.92;
              child.material.metalness = 0.04;
            }
          }
        }
      });
      
      modelGroup.add(baseModel);
      console.log('?? Pedestal cargado exitosamente. Children en modelGroup:', modelGroup.children.length);
      
      // ? NUEVO: Debug del pedestal
      console.log('?? DEBUG PEDESTAL:');
      console.log('  - Posici�n:', baseModel.position);
      console.log('  - Escala:', baseModel.scale);
      console.log('  - Visible:', baseModel.visible);
      console.log('  - Children del modelo:', baseModel.children.length);
      
      // Verificar si el modelo tiene geometr�a visible
      if (baseModel.children.length > 0) {
        baseModel.children.forEach((child, index) => {
          console.log(`  - Child ${index}:`, {
            name: child.name,
            visible: child.visible,
            position: child.position.toArray(),
            scale: child.scale
          });
        });
      }
    } catch (error) {
      console.error('CharacterViewer: Error loading pedestal:', error);
    }
    
    // ? NUEVO: Limpieza de partes b�sicas solo para usuarios autenticados
    if (isAuthenticated) {
      console.log('?? LIMPIEZA - Eliminando partes b�sicas del personaje (no el pedestal)');
      const basicPartsToRemove = modelGroup.children.filter(child => {
        // NO eliminar el pedestal, solo partes b�sicas del personaje
        const isBasicPersonPart = child.userData.isDefaultPart === true && 
                                 child.userData.category !== 'BASE';
        
        if (isBasicPersonPart) {
          console.log('?? Encontrada parte b�sica del personaje para eliminar:', child.name, child.userData);
        }
        return isBasicPersonPart;
      });
      
      basicPartsToRemove.forEach(part => {
        console.log('?? Eliminando parte b�sica del personaje:', part.name);
        modelGroup.remove(part);
        // Do NOT dispose — geometry/materials are shared with cache clones.
      });
      
      if (basicPartsToRemove.length > 0) {
        console.log('? Partes b�sicas del personaje eliminadas. Children restantes en modelGroup:', modelGroup.children.length);
      }
    }

    // Load selected parts with caching
    let filteredPartList = selectedPartList;
    const suit = selectedPartList.find((p: any) => p.category === PartCategory.SUIT_TORSO);
    const torso = selectedPartList.find((p: any) => p.category === PartCategory.TORSO);
    if (suit) {
      filteredPartList = selectedPartList.filter((p: any) => p.category !== PartCategory.TORSO);
    } else if (torso) {
      filteredPartList = selectedPartList.filter((p: any) => p.category !== PartCategory.SUIT_TORSO);
    }

    // Verificar compatibilidad de manos con el torso actual
    const activeTorso = suit || torso;
    if (activeTorso) {
      // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('?? Checking hand compatibility with torso:', activeTorso.id);
    }
    }
      
      // Determinar el torso base para verificar compatibilidad
      let baseTorsoId = activeTorso.id;
      if (suit) {
        // Si hay un suit, extraer el torso base del suit
        const suitMatch = suit.id.match(/strong_suit_torso_\d+_t(\d+)/);
        if (suitMatch) {
          const torsoNumber = suitMatch[1];
          baseTorsoId = `strong_torso_${torsoNumber}`;
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? Suit detected, using base torso: ${baseTorsoId}`);
    }
    }
        }
      }
      
      // Filtrar manos incompatibles
      filteredPartList = filteredPartList.filter((part: any) => {
        if (part.category === PartCategory.HAND_LEFT || part.category === PartCategory.HAND_RIGHT) {
          const isCompatible = part.compatible.includes(baseTorsoId);
          if (!isCompatible) {
            console.log(`?? Removing incompatible hand: ${part.id} (not compatible with base torso ${baseTorsoId})`);
          } else {
            console.log(`? Keeping compatible hand: ${part.id} (compatible with base torso ${baseTorsoId})`);
          }
          return isCompatible;
        }
        return true; // Mantener todas las dem�s partes
      });
      
      console.log('?? DEBUG - filteredPartList after hand filtering:', filteredPartList.map((p:any) => p.id));
      
      // Filtrar cabeza compatible
      filteredPartList = filteredPartList.filter((part: any) => {
        if (part.category === PartCategory.HEAD) {
          // Si no hay torso base, permitir todas las cabezas (fallback)
          if (!baseTorsoId) {
                // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? No torso base found, keeping head: ${part.id}`);
    }
            return true;
          }
          const isCompatible = part.compatible.includes(baseTorsoId);
          if (!isCompatible) {
            console.log(`?? Removing incompatible head: ${part.id} (not compatible with base torso ${baseTorsoId})`);
          } else {
            console.log(`? Keeping compatible head: ${part.id} (compatible with base torso ${baseTorsoId})`);
          }
          return isCompatible;
        }
        return true; // Mantener todas las dem�s partes
      });
    }

    const loadPromises = filteredPartList
      .filter((part: any) => part && part.gltfPath && !part.attributes?.hidden)
      .map(async (part: any) => {
        const modelPath = `${basePath}${part.gltfPath.startsWith('/') ? part.gltfPath.slice(1) : part.gltfPath}`;
        
        // ? NUEVO: Debug espec�fico para capas
        if (part.category === PartCategory.CAPE) {
          console.log('?? DEBUG CAPA:', {
            partId: part.id,
            category: part.category,
            gltfPath: part.gltfPath,
            modelPath: modelPath,
            isInFilteredList: true
          });
        }
        
        try {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`CharacterViewer: Loading [${part.category}] from cache: ${modelPath}`);
    }
    }
          const model = await modelCache.getModel(modelPath);
          
          // ? NUEVO: Debug espec�fico para capas
          if (part.category === PartCategory.CAPE) {
            console.log('?? DEBUG CAPA - Modelo cargado:', {
              modelName: model.name,
              modelUuid: model.uuid,
              modelChildren: model.children.length,
              modelVisible: model.visible
            });
          }
          
          // Tag the model with category for future removal (CRITICAL for hover preview)
          console.log(`?? DEBUG: Assigning category '${part.category}' and partId '${part.id}' to model. Model name: ${model.name}`);
          model.userData.category = part.category;
          model.userData.partId = part.id;
          
              // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`??? CharacterViewer: Tagging model for ${part.category}`, {
            modelName: model.name,
            modelUuid: model.uuid,
            category: part.category,
            partId: part.id
          });
    }
          
          // Propagate category to all child meshes for color/material application
          let meshCount = 0;
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.userData.category = part.category;
              child.userData.partId = part.id;
              meshCount++;
                  // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`??? CharacterViewer: Tagged mesh ${meshCount}: ${child.name}. Assigning category: ${part.category}, Current child.userData.category: ${child.userData.category}`);
    }
            }
          });
          
              // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`??? CharacterViewer: Total meshes tagged for ${part.category}: ${meshCount}`);
    }
          
          modelGroup.add(model);
          
          // ? NUEVO: Debug espec�fico para capas
          if (part.category === PartCategory.CAPE) {
            console.log('?? DEBUG CAPA - A�adida al modelGroup:', {
              modelGroupChildren: modelGroup.children.length,
              capeInGroup: modelGroup.children.some(child => child.userData.category === PartCategory.CAPE)
            });
          }
          
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`CharacterViewer: Successfully loaded [${part.category}]`);
    }
    }
          if (process.env.NODE_ENV === 'development') {
            console.log(`? CharacterViewer: Added model to group: ${model.name} (Category: ${model.userData.category}, PartId: ${model.userData.partId}, isPreview: ${!!model.userData.isPreview})`);
            console.log('?? CharacterViewer: Current modelGroup children AFTER ADDITION:',
              modelGroup.children.map(child => ({
                name: child.name,
                category: child.userData.category,
                partId: child.userData.partId,
                isPreview: child.userData.isPreview,
                visible: child.visible,
                position: JSON.stringify(child.position.toArray()) // Changed to stringify array
              }))
            );
          }
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
      // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`CharacterViewer: All models loaded in ${loadTime}ms. Cache size: ${modelCache.getCacheSize()}`);
    }
      
            // Position and frame the character - SOLO SI NO ESTAMOS EN HOVER PREVIEW O SI EL USUARIO NO HA INTERACTUADO CON LA C�MARA
      modelGroup.rotation.y = Math.PI;

      // Position and frame the character - SOLO SI NO ESTAMOS EN HOVER PREVIEW O SI EL USUARIO NO HA INTERACTUADO CON LA C�MARA
      modelGroup.rotation.y = Math.PI;

      // ? AUTO-FRAMING: Frame character when no user interaction and models are loaded
      const shouldAutoFrame = !isHoverPreviewActive && modelGroup.children.length > 0 && !hasUserInteractedWithCamera.current;
      
      if (shouldAutoFrame) {
        console.log('CharacterViewer: Auto-framing character (no user interaction detected)');
        console.log('CharacterViewer: hasUserInteracted:', hasUserInteractedWithCamera.current, 'modelCount:', modelGroup.children.length);
        
        // Calculate bounding box and center
        const box = new THREE.Box3().setFromObject(modelGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        console.log('CharacterViewer: Model bounding box:', {
          center: center.toArray(),
          size: size.toArray(),
          min: box.min.toArray(),
          max: box.max.toArray()
        });
        
        // Center the model
        modelGroup.position.sub(center);
        
        // Frame the character
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = maxDim / (2 * Math.tan(fov / 2));
        
        console.log('CharacterViewer: Camera positioning:', JSON.stringify({
            maxDim,
            fov: camera.fov,
            cameraDistance,
            finalDistance: cameraDistance * CAMERA_CONSTANTS.AUTO_FRAME_MULTIPLIER
          }, null, 2));
        
        // Maintain azimuthal rotation when framing character using spherical coordinates
        const targetAzimuth = CAMERA_CONSTANTS.AUTO_FRAME_AZIMUTH; // Use auto-frame azimuth
        const finalDistance = cameraDistance * CAMERA_CONSTANTS.AUTO_FRAME_MULTIPLIER; // Use auto-frame multiplier
        
        controls.target.set(CAMERA_CONSTANTS.AUTO_FRAME_TARGET.x, CAMERA_CONSTANTS.AUTO_FRAME_TARGET.y, CAMERA_CONSTANTS.AUTO_FRAME_TARGET.z);
        
        // Use spherical coordinates for proper azimuthal positioning
        const spherical = new THREE.Spherical();
        spherical.radius = finalDistance;
        spherical.phi = CAMERA_CONSTANTS.DEFAULT_POLAR; // Use default polar for auto-framing
        spherical.theta = targetAzimuth; // Set azimuthal angle
        
        camera.position.setFromSpherical(spherical).add(controls.target);
        
        console.log('CharacterViewer: Auto-frame applied.', JSON.stringify({
          finalDistance,
          currentCameraPosition: camera.position.toArray(),
          controlsTarget: controls.target.toArray(),
          sphericalRadius: spherical.radius,
          sphericalPhi: spherical.phi,
          sphericalTheta: spherical.theta
        }, null, 2));
      } else if (!isHoverPreviewActive && modelGroup.children.length > 0) {
        console.log('CharacterViewer: Skipping auto-frame (user has interacted with camera)');
        console.log('CharacterViewer: hasUserInteracted:', hasUserInteractedWithCamera.current);
        
        // Solo centrar el modelo sin tocar la c�mara
        if (modelGroup.children.length > 0) {
          const box = new THREE.Box3().setFromObject(modelGroup);
          const center = box.getCenter(new THREE.Vector3());
          modelGroup.position.sub(center);
        }
      } else if (isHoverPreviewActive) {
        console.log('CharacterViewer: Skipping auto-frame (hover preview active)');
        
        // Solo centrar el modelo sin tocar la c�mara
        if (modelGroup.children.length > 0) {
          const box = new THREE.Box3().setFromObject(modelGroup);
          const center = box.getCenter(new THREE.Vector3());
          modelGroup.position.sub(center);
        }
      } else {
        console.log('CharacterViewer: No models to frame, using default camera position');
        
        // Apply same azimuthal rotation for consistency using spherical coordinates
        const targetAzimuth = CAMERA_CONSTANTS.DEFAULT_AZIMUTH; // Use default azimuth
        const distance = CAMERA_CONSTANTS.DEFAULT_DISTANCE; // Use default distance
        
        controls.target.set(CAMERA_CONSTANTS.DEFAULT_TARGET.x, CAMERA_CONSTANTS.DEFAULT_TARGET.y, CAMERA_CONSTANTS.DEFAULT_TARGET.z);
        
        // Use spherical coordinates for proper azimuthal positioning
        const spherical = new THREE.Spherical();
        spherical.radius = distance;
        spherical.phi = CAMERA_CONSTANTS.DEFAULT_POLAR; // Use default polar
        spherical.theta = targetAzimuth; // Set azimuthal angle
        
        camera.position.setFromSpherical(spherical).add(controls.target);
      }
      
      controls.update();
      
    } catch (error) {
      setIsLoading(false);
      console.error('CharacterViewer: Error during model loading:', error);
    } finally {
      if (cameraRef.current && controlsRef.current) {
        console.log('CharacterViewer: IMMEDIATE Post-load Camera State:', JSON.stringify({
          position: cameraRef.current.position.toArray(),
          target: controlsRef.current.target.toArray(),
          distance: controlsRef.current.getDistance(),
          fov: cameraRef.current.fov,
          polarAngle: controlsRef.current.getPolarAngle(),
          azimuthalAngle: controlsRef.current.getAzimuthalAngle()
        }));
      }
    }
    
    console.log('? CharacterViewer: performModelLoad completado - TIMESTAMP:', new Date().toISOString());
    console.log('?? Estado final del modelGroup:', {
      childrenCount: modelGroup.children.length,
      children: modelGroup.children.map(child => ({
        name: child.name,
        category: child.userData.category,
        partId: child.userData.partId,
        gltfPath: ALL_PARTS.find(p => p.id === child.userData.partId)?.gltfPath,
        visible: child.visible, // Added visibility status
        position: JSON.stringify(child.position.toArray()) // Changed to stringify array
      }))
    });
  };

  // ? SMART LOADING: Only execute when Three.js is ready
  useEffect(() => {
    // ? CRITICAL: Don't run if Three.js is not ready
    if (!isThreeJSReady) {
      console.log('?? CharacterViewer useEffect: Three.js not ready, skipping.');
      return;
    }

    // Skip only if hover preview is active AND selectedParts haven't actually changed.
    // If the user clicked a part while hovering, selectedParts will differ from
    // lastSelectedParts — in that case we must reload regardless of hover state.
    if (isHoverPreviewActive) {
      const partsChanged = !areSelectedPartsEqual(selectedParts, lastSelectedPartsRef.current);
      const archetypeChanged2 = selectedArchetype !== lastSelectedArchetypeRef.current;
      if (!partsChanged && !archetypeChanged2) {
        return;
      }
      setIsHoverPreviewActive(false);
    }

    const isFirstLoad = Object.keys(lastSelectedPartsRef.current).length === 0;
    const archetypeChanged = selectedArchetype !== lastSelectedArchetypeRef.current;

    if (isFirstLoad || archetypeChanged || !areSelectedPartsEqual(selectedParts, lastSelectedPartsRef.current)) {
      lastSelectedPartsRef.current = selectedParts;
      lastSelectedArchetypeRef.current = selectedArchetype;
      if (archetypeChanged) hasUserInteractedWithCamera.current = false;
      performModelLoad().catch(error => {
        console.error('CharacterViewer: Error in performModelLoad:', error);
        setIsLoading(false);
      });
      return;
    }

    setIsLoading(false);

  }, [isThreeJSReady, isHoverPreviewActive, selectedParts, selectedArchetype]);

  useImperativeHandle(ref, (): CharacterViewerRef => ({
    exportModel: async () => {
      try {
        if (!sceneRef.current || !modelGroupRef.current) {
          return { success: false, error: 'Scene or model group not available' };
        }

        // Check if we have any models loaded
        if (modelGroupRef.current.children.length === 0) {
          return { success: false, error: 'No models loaded to export' };
        }

        const exportScene = new THREE.Scene();
        const exportModelGroup = modelGroupRef.current.clone();
        // Strip any hover-preview models that may be in the scene
        [...exportModelGroup.children]
          .filter(c => c.userData.isPreview)
          .forEach(c => exportModelGroup.remove(c));
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
          const finalFileName = generatedFileName || `${modelName}_export.glb`;
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
    exportSTL: async (options?: { scaleFactor?: number }) => {
      const scaleFactor = options?.scaleFactor ?? 1;
      try {
        if (!sceneRef.current || !modelGroupRef.current) {
          return { success: false, error: 'Scene or model group not available' };
        }

        // Check if we have any models loaded
        if (modelGroupRef.current.children.length === 0) {
          return { success: false, error: 'No models loaded to export' };
        }

        const exportScene = new THREE.Scene();
        const exportModelGroup = modelGroupRef.current.clone();
        // Strip any hover-preview models that may be in the scene
        [...exportModelGroup.children]
          .filter(c => c.userData.isPreview)
          .forEach(c => exportModelGroup.remove(c));
        exportModelGroup.position.set(0, 0, 0);
        exportModelGroup.rotation.set(0, 0, 0);
        exportModelGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
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
    getScene: () => sceneRef.current!,
    getRenderer: () => rendererRef.current!,
    getCamera: () => cameraRef.current!,
    handlePreviewPartsChange: async (changedParts: SelectedParts) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current || !modelGroupRef.current) return;
      
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('CharacterViewer: Preview parts changed:', changedParts);
    }
      
      setIsHoverPreviewActive(true);
      const loadId = ++hoverLoadCountRef.current;
      

      
      // ? ENABLE ZOOM: Keep zoom enabled during preview
      // No need to disable zoom during preview
      
      // Check if this is a "clear preview" call (empty object or identical to selectedParts)
      const isClearPreview = Object.keys(changedParts).length === 0 || (() => {
        const changedKeys = Object.keys(changedParts).sort();
        const selectedKeys = Object.keys(selectedParts).sort();

        if (changedKeys.length !== selectedKeys.length) return false;
        if (changedKeys.join(',') !== selectedKeys.join(',')) return false;

        for (const category of changedKeys) {
          if (changedParts[category]?.id !== selectedParts[category]?.id) return false;
        }
        return true;
      })();
      
      if (isClearPreview) {
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('?? CLEAR HOVER PREVIEW: Restoring original state');
    }
        setPreviewParts(null);
        setIsHoverPreviewActive(false); // ?? DESMARCAR INMEDIATAMENTE
        
        // Remove all preview models and restore original models visibility
        const modelGroup = modelGroupRef.current;
        if (!modelGroup) return;
        
        const previewModelsToRemove: THREE.Object3D[] = [];

        // Debug: Log all children before clearing
        console.log('?? CLEAR PREVIEW DEBUG: All models in scene before clear:', 
          modelGroup.children.map(child => ({
            name: child.name,
            category: child.userData.category,
            partId: child.userData.partId,
            isPreview: child.userData.isPreview,
            type: child.type,
            visible: child.visible // Add visibility state
          }))
        );
        
        modelGroup.traverse((child) => {
          const childCategory = child.userData.category;
          const childPartId = child.userData.partId;

          if (child.userData.isPreview) {
            previewModelsToRemove.push(child);
            if (process.env.NODE_ENV === 'development') {
              console.log(`??? CLEAR: Marking preview model for removal: ${childPartId || child.name || 'unknown'}`);
            }
          }

          // Restore visibility of any original models that were hidden for preview
          // Only restore if the child is NOT a preview and has a category
          // Also, ensure it was indeed a hidden original model (not just naturally hidden)
          if (!child.userData.isPreview && childCategory && !child.visible) {
            const isCurrentlySelected = selectedParts[childCategory]?.id === childPartId; // Only restore if it's the actively selected part
            if (isCurrentlySelected) {
              child.visible = true;
              if (process.env.NODE_ENV === 'development') {
                console.log(`??? CLEAR: Restoring visibility of selected original model: ${childPartId || child.name || 'unknown'}`);
              }
            } else {
              if (process.env.NODE_ENV === 'development') {
                console.log(`?? CLEAR: NOT restoring visibility of non-selected or non-original model: ${childPartId || child.name || 'unknown'}`);
              }
            }
          }
        });
        
        previewModelsToRemove.forEach(model => {
          modelGroup.remove(model);
        });
        
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? CLEAR: Removed ${previewModelsToRemove.length} preview models`);
    }
        

        
        // ? ZOOM REMAINS ENABLED: No need to restore zoom
        
        return;
      }
      
      // Normal preview change
      const combinedParts = { ...selectedParts, ...changedParts };
      setPreviewParts(combinedParts);
      
      console.log('CharacterViewer: Combined preview parts:', {
        selectedParts: Object.keys(selectedParts),
        changedParts: Object.keys(changedParts),
        combinedParts: Object.keys(combinedParts)
      });
      
      // For hover preview, directly load only the changed parts
      const modelGroup = modelGroupRef.current;
      if (!modelGroup) return;
      
      const basePath = (import.meta as any).env.BASE_URL || '/';
      const changedCategories = Object.keys(changedParts) as PartCategory[];
      
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('?? HOVER PREVIEW: Loading only changed categories:', changedCategories);
    }
      
      // Debug espec�fico para cinturones
      if (changedCategories.includes(PartCategory.BELT)) {
        console.log('?? BELT HOVER DEBUG - CharacterViewer:', {
          changedCategories,
          beltPart: changedParts[PartCategory.BELT],
          allChangedParts: Object.keys(changedParts).reduce((acc, key) => {
            acc[key] = changedParts[key]?.id || 'none';
            return acc;
          }, {} as any)
        });
      }
      
      // HOVER PREVIEW: Only remove existing preview models, never original models
      const modelsToRemove: THREE.Object3D[] = [];
      
      // Debug: Log all children before any modifications
      console.log('?? HOVER DEBUG: All models in scene before modification:', 
        modelGroup.children.map(child => ({
          name: child.name,
          category: child.userData.category,
          partId: child.userData.partId,
          isPreview: child.userData.isPreview,
          type: child.type,
          visible: child.visible // Add visibility state
        }))
      );
      
      // Iterate through models to hide existing and identify old previews for removal
      modelGroup.traverse((child) => {
        const childCategory = child.userData.category;
        const childPartId = child.userData.partId;

        // Hide original models of the categories being previewed
        if (!child.userData.isPreview && childCategory && changedParts[childCategory] && child.visible) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`??? HOVER: Hiding original model for category ${childCategory}: ${childPartId || child.name || 'unknown'}`);
          }
          child.visible = false; // Hide the currently active part of this category
        }

        // Identify existing preview models from the same categories for removal
        if (child.userData.isPreview && childCategory && changedParts[childCategory]) {
          modelsToRemove.push(child);
          if (process.env.NODE_ENV === 'development') {
            console.log(`??? HOVER: Marking existing preview model for removal: ${childPartId || child.name || 'unknown'}`);
          }
        }
      });
      
      modelsToRemove.forEach(model => {
        modelGroup.remove(model);
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`??? HOVER: Removed preview model: ${model.userData.partId || model.name || 'unknown'}`);
    }
      });
      
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? HOVER: Removed ${modelsToRemove.length} preview models`);
    }

      // Load new models for changed categories — await all before clearing the flag
      await Promise.all(changedCategories.map(async (category) => {
        const part = changedParts[category];
        if (!part || part.attributes?.none || part.attributes?.hidden || !part.gltfPath) {
          return;
        }

        const modelPath = `${basePath}${part.gltfPath.startsWith('/') ? part.gltfPath.slice(1) : part.gltfPath}`;
        try {
          const model = await modelCache.getModel(modelPath);
          model.userData.category = part.category ||
                                    (part.id.includes('legs') ? PartCategory.LOWER_BODY :
                                     part.id.includes('boots') ? PartCategory.BOOTS :
                                     part.id.includes('torso') ? PartCategory.TORSO :
                                     part.id.includes('head') ? PartCategory.HEAD :
                                     part.id.includes('hands') && part.id.includes('_l') ? PartCategory.HAND_LEFT :
                                     part.id.includes('hands') && part.id.includes('_r') ? PartCategory.HAND_RIGHT :
                                     part.category);
          model.userData.partId = part.id;
          model.userData.isPreview = true;
          modelGroup.add(model);
        } catch (error) {
          console.error(`HOVER: Error loading model ${part.id}`, error);
        }
      }));

      // Only clear the flag if no newer hover load has started since this one
      if (loadId === hoverLoadCountRef.current) {
        setIsHoverPreviewActive(false);
      }
    },
    clearPreview: () => {
      setPreviewParts(null);
      setIsHoverPreviewActive(false); // ?? DESMARCAR HOVER PREVIEW
      
      
      // Remove all preview models and restore original models visibility
      const modelGroup = modelGroupRef.current;
      if (!modelGroup) return;
      
      const previewModelsToRemove: THREE.Object3D[] = [];

      // Debug: Log all children before clearing
      console.log('?? CLEAR PREVIEW DEBUG: All models in scene before clear:', 
        modelGroup.children.map(child => ({
          name: child.name,
          category: child.userData.category,
          partId: child.userData.partId,
          isPreview: child.userData.isPreview,
          type: child.type,
          visible: child.visible // Add visibility state
        }))
      );
      
      modelGroup.traverse((child) => {
        const childCategory = child.userData.category;
        const childPartId = child.userData.partId;

        if (child.userData.isPreview) {
          previewModelsToRemove.push(child);
          if (process.env.NODE_ENV === 'development') {
            console.log(`??? CLEAR: Marking preview model for removal: ${childPartId || child.name || 'unknown'}`);
          }
        }

        // Restore visibility of any original models that were hidden for preview
        // Only restore if the child is NOT a preview and has a category
        // Also, ensure it was indeed a hidden original model (not just naturally hidden)
        if (!child.userData.isPreview && childCategory && !child.visible) {
          const isCurrentlySelected = selectedParts[childCategory]?.id === childPartId; // Only restore if it's the actively selected part
          if (isCurrentlySelected) {
            child.visible = true;
            if (process.env.NODE_ENV === 'development') {
              console.log(`??? CLEAR: Restoring visibility of selected original model: ${childPartId || child.name || 'unknown'}`);
            }
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.log(`?? CLEAR: NOT restoring visibility of non-selected or non-original model: ${childPartId || child.name || 'unknown'}`);
            }
          }
        }
      });
      
      previewModelsToRemove.forEach(model => {
        modelGroup.remove(model);
        // Do NOT dispose — geometry/materials are shared with cache clones.
      });
      
          // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? CLEAR: Removed ${previewModelsToRemove.length} preview models`);
    }
        

      
      // ? RESTORE ZOOM: Re-enable zoom when preview is cleared
      if (controlsRef.current) {
        controlsRef.current.enableZoom = true;
      }
    },
    resetState: () => {
      setPreviewParts(null);
      lastSelectedPartsRef.current = {};
    },
    resetCamera: () => {
      handleResetCamera();
      hasUserInteractedWithCamera.current = false; // Reset interaction flag on manual reset
    },
    setViewAngle: (azimuthPercentage: number) => {
      if (cameraRef.current && controlsRef.current) {
        const targetAzimuth = (azimuthPercentage / 100) * 2 * Math.PI;
        const distance = 8;
        
        controlsRef.current.target.set(CAMERA_CONSTANTS.DEFAULT_TARGET.x, CAMERA_CONSTANTS.DEFAULT_TARGET.y, CAMERA_CONSTANTS.DEFAULT_TARGET.z);
        
        const spherical = new THREE.Spherical();
        spherical.radius = CAMERA_CONSTANTS.DEFAULT_DISTANCE;
        spherical.phi = CAMERA_CONSTANTS.DEFAULT_POLAR;
        spherical.theta = targetAzimuth;
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
    takeTokenScreenshot: async () => {
      return new Promise<string>((resolve) => {
        console.log('?? TokenScreenshot: Starting token screenshot...');
        console.log('?? TokenScreenshot: Components available:', {
          renderer: !!rendererRef.current,
          camera: !!cameraRef.current,
          controls: !!controlsRef.current,
          scene: !!sceneRef.current,
          modelGroup: !!modelGroupRef.current
        });
        
        if (!rendererRef.current || !cameraRef.current || !controlsRef.current) {
          console.log('? TokenScreenshot: Missing required components');
          resolve('');
          return;
        }

        // Check if models are loaded
        const modelGroup = modelGroupRef.current;
        const modelCount = modelGroup?.children?.length || 0;
        console.log('?? TokenScreenshot: Model count in scene:', modelCount);
        
        if (modelCount === 0) {
          console.log('? TokenScreenshot: No models loaded in scene');
          resolve('');
          return;
        }

        // Save current camera state
        const originalPosition = cameraRef.current.position.clone();
        const originalTarget = controlsRef.current.target.clone();
        const originalFOV = cameraRef.current.fov;
        const originalClearColor = new THREE.Color();
        rendererRef.current.getClearColor(originalClearColor);
        const originalClearAlpha = rendererRef.current.getClearAlpha();

        try {
          // Frame bust (head + shoulders): top ~35% of model height
          const box = new THREE.Box3().setFromObject(modelGroup!);
          const size = box.getSize(new THREE.Vector3());
          const bustTarget = new THREE.Vector3(
            (box.min.x + box.max.x) / 2,
            box.max.y - size.y * 0.18, // just below top of head
            (box.min.z + box.max.z) / 2
          );
          const bustSize = size.y * 0.38; // frame 38% of height
          const fov = cameraRef.current.fov * (Math.PI / 180);
          const distance = (bustSize / (2 * Math.tan(fov / 2))) * 1.2;
          controlsRef.current.target.copy(bustTarget);
          cameraRef.current.position.set(bustTarget.x, bustTarget.y, bustTarget.z + distance);
          cameraRef.current.updateProjectionMatrix();
          controlsRef.current.update();

          // Render and capture
          rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
          resolve(dataUrl);

        } catch (error) {
          console.error('? TokenScreenshot: Error taking token screenshot:', error);
          resolve('');
        } finally {
          // Restore original camera state
          cameraRef.current.position.copy(originalPosition);
          controlsRef.current.target.copy(originalTarget);
          cameraRef.current.fov = originalFOV;
          cameraRef.current.updateProjectionMatrix();
          controlsRef.current.update();
          rendererRef.current.setClearColor(originalClearColor, originalClearAlpha);
          rendererRef.current.render(sceneRef.current!, cameraRef.current!);
        }
      });
    },
    takeScreenshotWithZoom: async (zoom: number, position: { x: number; y: number }) => {
      return new Promise<string>((resolve) => {
        if (!rendererRef.current || !cameraRef.current || !controlsRef.current) {
          console.log('? Componentes no disponibles para zoom');
          resolve('');
          return;
        }

        console.log('?? Aplicando zoom antes de captura:', { zoom, position });

        // Guardar estado actual de la c�mara
        const originalPosition = cameraRef.current.position.clone();
        const originalTarget = controlsRef.current.target.clone();
        const originalFOV = cameraRef.current.fov;

        try {
          // Obtener la direcci�n actual de la c�mara
          const currentDirection = cameraRef.current.position.clone().sub(controlsRef.current.target).normalize();
          
          // Calcular la distancia actual
          const currentDistance = cameraRef.current.position.distanceTo(controlsRef.current.target);
          
          // Aplicar zoom manteniendo la direcci�n actual
          const newDistance = currentDistance / zoom;
          
          // Calcular nueva posici�n manteniendo la misma direcci�n
          const newPosition = controlsRef.current.target.clone().add(currentDirection.multiplyScalar(newDistance));

          // Aplicar offset de posici�n en el plano perpendicular a la direcci�n de la c�mara
          const up = new THREE.Vector3(0, 1, 0);
          const right = new THREE.Vector3().crossVectors(currentDirection, up).normalize();
          const upPerpendicular = new THREE.Vector3().crossVectors(right, currentDirection).normalize();

          // Convertir offset de pantalla a offset en el espacio 3D
          const offsetScale = newDistance / 100;
          const offset3D = right.multiplyScalar(position.x * offsetScale)
                              .add(upPerpendicular.multiplyScalar(-position.y * offsetScale));

          newPosition.add(offset3D);

          console.log('?? C�lculos de zoom:', {
            currentDistance,
            newDistance,
            currentDirection: { x: currentDirection.x, y: currentDirection.y, z: currentDirection.z },
            newPosition: { x: newPosition.x, y: newPosition.y, z: newPosition.z },
            offset3D: { x: offset3D.x, y: offset3D.y, z: offset3D.z }
          });

          // Actualizar c�mara
          cameraRef.current.position.copy(newPosition);
          controlsRef.current.update();

          // Renderizar con zoom aplicado
          rendererRef.current.render(sceneRef.current!, cameraRef.current!);
          
          // Capturar imagen
          const canvas = rendererRef.current.domElement;
          const dataUrl = canvas.toDataURL('image/png');

          console.log('? Captura con zoom completada');
          resolve(dataUrl);

        } catch (error) {
          console.error('? Error al aplicar zoom:', error);
          resolve('');
        } finally {
          // Restaurar posici�n original de la c�mara
          cameraRef.current.position.copy(originalPosition);
          controlsRef.current.target.copy(originalTarget);
          cameraRef.current.fov = originalFOV;
          controlsRef.current.update();
          
          // Re-renderizar con posici�n original
          rendererRef.current.render(sceneRef.current!, cameraRef.current!);
        }
      });
    },
    applyMaterialToPart: (material: THREE.Material, partType: string) => {
      console.log(`?? CharacterViewer: Applying material to part: ${partType}`, {
        partType,
        modelGroupExists: !!modelGroupRef.current,
        modelGroupChildrenCount: modelGroupRef.current?.children.length || 0
      });
      
      if (modelGroupRef.current) {
        let foundMeshes = 0;
        let materializedMeshes = 0;
        
        // ?? DEBUG: Log all meshes and their categories
        if (process.env.NODE_ENV === 'development') {
          console.log(`?? CharacterViewer: Scanning all meshes for partType: ${partType}`);
          modelGroupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              console.log(`?? Mesh: ${child.name || 'unnamed'}`, {
                userDataCategory: child.userData.category,
                partType,
                categoryMatch: child.userData.category === partType,
                materialType: child.material?.constructor?.name
              });
            }
          });
        }
        
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            foundMeshes++;
            
            // ?? MEJORADO: Mapeo flexible de categor�as para piernas
            let categoryMatch = false;
            
            if (partType === 'LOWER_BODY') {
              // Para piernas, aceptar m�ltiples variaciones
              const meshCategory = child.userData.category;
              const meshName = child.name.toLowerCase();
              
              categoryMatch = 
                meshCategory === 'LOWER_BODY' ||
                meshCategory === 'LEGS' ||
                meshName.includes('leg') ||
                meshName.includes('pants') ||
                meshName.includes('lower') ||
                meshName.includes('trousers');
                
              if (categoryMatch) {
                console.log(`?? LOWER_BODY match found: ${child.name} (category: ${meshCategory})`);
              }
            } else {
              // Para otras partes, usar matching exacto
              categoryMatch = child.userData.category === partType;
            }
            
            if (categoryMatch && !child.userData.isPreview) {
              child.material = material.clone();
              materializedMeshes++;
              console.log(`? Applied material to ${partType}: ${child.name || 'unnamed'}`);
            }
          }
        });
        
        console.log(`?? CharacterViewer: Material application complete for ${partType}`, {
          totalMeshes: foundMeshes,
          materializedMeshes,
          success: materializedMeshes > 0
        });
      }
    },
    applyLightingPreset: (preset: LightingPreset) => {
      if (!sceneRef.current) {
        console.warn("Scene reference is null. Cannot apply lighting preset.");
        return;
      }
      const currentScene = sceneRef.current; // Assign to a local variable after null check

      const lightsToRemove: THREE.Light[] = [];
      currentScene.traverse((child) => {
        if (child instanceof THREE.DirectionalLight) {
          lightsToRemove.push(child);
        }
      });
      lightsToRemove.forEach(light => currentScene.remove(light));

      const keyLight = new THREE.DirectionalLight(preset.keyLight.color, preset.keyLight.intensity);
      keyLight.position.copy(preset.keyLight.position);
      keyLight.castShadow = true;
      // Ensure keyLight.shadow exists before accessing its properties
      if (keyLight.shadow) {
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        keyLight.shadow.camera.left = -10;
        keyLight.shadow.camera.right = 10;
        keyLight.shadow.camera.top = 10;
        keyLight.shadow.camera.bottom = -10;
      }
      currentScene.add(keyLight);

      const fillLight = new THREE.DirectionalLight(preset.fillLight.color, preset.fillLight.intensity);
      fillLight.position.copy(preset.fillLight.position);
      currentScene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(preset.rimLight.color, preset.rimLight.intensity);
      rimLight.position.copy(preset.rimLight.position);
      currentScene.add(rimLight);
    },
    applyColorToPart: (color: number, partType: string) => {
      console.log(`?? CharacterViewer: Applying color ${color.toString(16)} to part: ${partType}`, {
        partType,
        partTypeType: typeof partType,
        modelGroupExists: !!modelGroupRef.current,
        modelGroupChildrenCount: modelGroupRef.current?.children.length || 0,
        availableCategories: ['TORSO', 'HEAD', 'HAND_LEFT', 'HAND_RIGHT', 'LEGS', 'BOOTS', 'CAPE', 'BELT', 'BUCKLE']
      });
      
      if (modelGroupRef.current) {
        let foundMeshes = 0;
        let coloredMeshes = 0;
        
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? CharacterViewer: Model group has ${modelGroupRef.current.children.length} children`);
    }
        
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
                // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? Checking mesh: ${child.name || 'unnamed'}`, {
              userDataCategory: child.userData.category,
              partType,
              categoryMatch: child.userData.category === partType,
              materialType: child.material?.constructor?.name,
              isMeshPhysicalMaterial: child.material instanceof THREE.MeshPhysicalMaterial,
              userData: child.userData,
              hasUserData: !!child.userData,
              userDataKeys: Object.keys(child.userData || {})
            });
    }
            
            if (child.userData.category === partType && !child.userData.isPreview) {
              foundMeshes++;
              if (child.material instanceof THREE.MeshPhysicalMaterial) {
                child.material.color.setHex(color);
                coloredMeshes++;
                    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`? Applied color to ${partType}: ${child.name || 'unnamed'}`);
    }
              } else {
                    // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? Material not MeshPhysicalMaterial for ${partType}: ${child.name || 'unnamed'}`);
    }
              }
            }
          }
        });
        
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? Summary for ${partType}: Found ${foundMeshes} meshes, colored ${coloredMeshes}`);
    }
      } else {
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('? Model group not available');
    }
      }
    },
     applyColorToAllParts: (color: number) => {
       if (modelGroupRef.current) {
         let coloredCount = 0;
         modelGroupRef.current.traverse((child) => {
           if (child instanceof THREE.Mesh && child.userData.category) {
             const category = child.userData.category;
             if (category !== PartCategory.HEAD) {
               if (child.material instanceof THREE.MeshPhysicalMaterial) {
                 child.material.color.setHex(color);
                 coloredCount++;
               }
             }
           }
         });
       }
     },
    applyTextureToPart: (partType: string) => {
      if (modelGroupRef.current) {
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.category === partType) {
          }
        });
      }
    },
         toggleEdgeDetection: (selectedPart?: string) => {
       if (edgeDetectionActive) {
         if (edgeLinesRef.current.length > 0) {
           edgeLinesRef.current.forEach(wireframe => {
             if (wireframe.parent) {
               wireframe.parent.remove(wireframe);
             }
           });
           edgeLinesRef.current = [];
         }
         setEdgeDetectionActive(false);
       } else {
         if (modelGroupRef.current && sceneRef.current) {
           const newEdgeLines: THREE.LineSegments[] = [];
           
           const allMeshes: THREE.Mesh[] = [];
           modelGroupRef.current.traverse((obj) => {
             if (obj instanceof THREE.Mesh) {
               allMeshes.push(obj);
             }
           });
           
           modelGroupRef.current.traverse((child) => {
             if (child instanceof THREE.Mesh) {
               const partName = selectedPart?.toLowerCase() || '';
               const currentMeshIndex = allMeshes.indexOf(child);
               let isTargetMesh = false;
               
               if (!selectedPart) {
                 isTargetMesh = true;
               } else {
                 switch (partName) {
                   case 'torso':
                     isTargetMesh = currentMeshIndex >= 0 && currentMeshIndex <= 2;
                     break;
                   case 'head':
                     isTargetMesh = currentMeshIndex === 3;
                     break;
                   case 'hands':
                     isTargetMesh = currentMeshIndex >= 4 && currentMeshIndex <= 5;
                     break;
                   case 'cape':
                     isTargetMesh = currentMeshIndex === 6;
                     break;
                   case 'belt':
                     isTargetMesh = currentMeshIndex >= 7 && currentMeshIndex <= 9;
                     break;
                   case 'boots':
                     isTargetMesh = currentMeshIndex === 10;
                     break;
                   case 'symbol':
                     isTargetMesh = currentMeshIndex === 11;
                     break;
                   case 'legs':
                     isTargetMesh = currentMeshIndex === 12;
                     break;
                   default:
                     isTargetMesh = false;
                     break;
                 }
               }
               
               if (isTargetMesh) {
                 try {
                   const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
                                    const wireframeMaterial = new THREE.LineBasicMaterial({ 
                   color: 0x00ffff,
                   linewidth: 2,
                   transparent: true,
                   opacity: 0.8,
                   depthTest: true,
                   depthWrite: false
                 });
                   const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
                   
                   child.add(wireframe);
                   newEdgeLines.push(wireframe);
                 } catch (error) {
                   console.error(`? Error applying wireframe to mesh: ${child.name || 'unnamed'}`, error);
                 }
               }
             }
           });
           
           edgeLinesRef.current = newEdgeLines;
           setEdgeDetectionActive(true);
         } else {
               // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('? Model group or scene not available');
    }
         }
       }
     },
    setComposer: (/*newComposer: EffectComposer | null*/) => {
      // setComposer(newComposer); // This line was removed from useThreeScene
     },
    debugMeshes: () => {
      if (modelGroupRef.current) {
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('?? DEBUG: All meshes in model group:');
    }
        let meshCount = 0;
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshCount++;
                // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? Mesh ${meshCount}:`, {
              name: child.name,
              userData: child.userData,
              materialType: child.material?.constructor?.name,
              parentName: child.parent?.name,
              parentUserData: child.parent?.userData
            });
    }
          }
        });
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`?? Total meshes found: ${meshCount}`);
    }
      } else {
            // ?? OPTIMIZADO: Solo log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('? DEBUG: Model group not available');
    }
      }
    },
    debugAvailableParts: () => {
      if (modelGroupRef.current) {
        console.log('?? CharacterViewer: Debugging available parts');
        const categories = new Set<string>();
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.userData.category) {
            categories.add(child.userData.category);
          }
        });
        console.log('Available categories:', Array.from(categories));
      } else {
        console.log('? Model group not available for debugging');
      }
    },
    preloadParts: (parts: Part[]) => {
      const paths = parts
        .filter(p => p.gltfPath && !p.attributes?.none)
        .map(p => p.gltfPath);
      if (paths.length > 0) {
        modelCache.preloadModels(paths);
      }
    },
  }));

  const displayName = characterName || (selectedParts && (selectedParts as any).__characterName) || '';
  return (
    <div 
      ref={mountRef} 
      className="relative w-full h-full select-none"
      style={{
        touchAction: 'none', // Prevent touch zoom
        userSelect: 'none', // Prevent text selection
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Nombre del personaje editable en recuadro */}
      {displayName && (
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
              {displayName}
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
                ?????
              </div>
            </div>
            <div className="text-xl font-black text-orange-400 mb-2 animate-pulse uppercase tracking-wider"
                 style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              Loading 3D Model
            </div>
            <div className="text-sm text-cyan-400 font-bold uppercase tracking-wider"
                 style={{ fontFamily: 'var(--font-comic), system-ui' }}>
              Preparing your superhero...
            </div>
            <div className="mt-4 w-48 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* ? Cache Loading Status Indicator */}
      {/* Removed: not used */}

      {/* Precision Controls - Bottom Center, above the fixed bottom bar (56px) */}
      <div className="absolute left-0 right-0 flex justify-center z-30" style={{ bottom: '66px' }}>
        <div
          className="flex items-center gap-2"
          style={{
            padding: '8px 10px',
            borderRadius: 10,
            background: 'rgba(11, 14, 20, 0.5)',
            border: '1px solid rgba(71, 85, 105, 0.4)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
        {/* Rotate Left */}
        <button
          onClick={handleRotateLeft}
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: 34, height: 34,
            background: 'rgba(16,20,30,0.94)',
            border: '1px solid rgba(71, 85, 105, 0.62)',
            borderRadius: '7px',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: 18,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-strong)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; }}
          title="Rotate left (15�)"
        >
          ?
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: 34, height: 34,
            background: 'rgba(16,20,30,0.94)',
            border: '1px solid rgba(71, 85, 105, 0.62)',
            borderRadius: '7px',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-strong)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; }}
          title="Zoom out"
        >
          -
        </button>

        {/* Reset Camera */}
        <button
          onClick={handleResetCamera}
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: 40, height: 34,
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.48)',
            borderRadius: '7px',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-body)',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 0.1,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245, 158, 11, 0.16)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245, 158, 11, 0.1)'; }}
          title="Reset view"
        >
          ?
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: 34, height: 34,
            background: 'rgba(16,20,30,0.94)',
            border: '1px solid rgba(71, 85, 105, 0.62)',
            borderRadius: '7px',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-strong)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; }}
          title="Zoom in"
        >
          +
        </button>

        {/* Rotate Right */}
        <button
          onClick={handleRotateRight}
          className="flex items-center justify-center transition-colors duration-200"
          style={{
            width: 34, height: 34,
            background: 'rgba(16,20,30,0.94)',
            border: '1px solid rgba(71, 85, 105, 0.62)',
            borderRadius: '7px',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: 18,
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-accent)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border-strong)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)'; }}
          title="Rotate right (15�)"
        >
          ?
        </button>
        </div>
      </div>

      {/* Library Navigation - Top Left - SOLO PARA USUARIOS AUTENTICADOS */}
      {isAuthenticated && (
        <PoseNavigation
          savedPoses={savedPoses || []}
          currentPoseIndex={currentPoseIndex}
          onPreviousPose={onPreviousPose || (() => {})}
          onNextPose={onNextPose || (() => {})}
          onSelectPose={onSelectPose || (() => {})}
          onRenamePose={onRenamePose}
          onSaveAsNew={onSaveAsNew}
          onDeletePose={onDeletePose}
        />
      )}

      {/* Screenshot Button - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
      </div>
    </div>
  );
});

CharacterViewer.displayName = 'CharacterViewer';

export default CharacterViewer; 
