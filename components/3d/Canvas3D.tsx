import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export interface Canvas3DRef {
  getScene: () => THREE.Scene | null;
  getRenderer: () => THREE.WebGLRenderer | null;
  getCamera: () => THREE.Camera | null;
  getControls: () => OrbitControls | null;
  resetCamera: () => void;
  setViewAngle: (azimuthPercentage: number) => void;
  takeScreenshot: () => Promise<string>;
  applyLightingPreset: (preset: any) => void;
  toggleEdgeDetection: (selectedPart?: string) => void;
}

interface Canvas3DProps {
  onSceneReady?: (scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => void;
  onRender?: () => void;
}

const Canvas3D = forwardRef<Canvas3DRef, Canvas3DProps>(({ onSceneReady, onRender }, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const initialCameraPosition = useRef<THREE.Vector3 | null>(null);
  const initialCameraTarget = useRef<THREE.Vector3 | null>(null);
  const edgeLinesRef = useRef<THREE.LineSegments[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const initializeScene = useCallback(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50, // Wide FOV to fit full model with headroom
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const azimuthalRotation = Math.PI / 5; // ~36 degrees to see over shoulders
    const distance = 10;
    camera.position.set(
      Math.sin(azimuthalRotation) * distance,
      1.5,
      Math.cos(azimuthalRotation) * distance
    );
    cameraRef.current = camera;
    initialCameraPosition.current = camera.position.clone();
    initialCameraTarget.current = new THREE.Vector3(0, 1.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true 
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1; // Restored
    controls.rotateSpeed = 1.5; // Restored
    controls.zoomSpeed = 1.2; // ✅ RESTORED ZOOM SPEED - Enable zoom functionality
    // Centrar la cámara en el origen
    controls.target.set(0, 1.5, 0); // Restored
    
    // Enable azimuthal rotation (horizontal) while limiting vertical movement
    controls.enablePan = false; // Restored
    controls.enableZoom = true; // Keep zoom enabled
    controls.enableRotate = true; // Keep rotation enabled
    
    // ✅ COMPLETELY DISABLE ZOOM - Set min and max distance to same value
    controls.minDistance = 6;  // Allow manual zoom in
    controls.maxDistance = 20; // Allow manual zoom out
    
    // Allow full Y rotation (front/back) but prevent viewing from below
    controls.minPolarAngle = Math.PI / 6; // 30 degrees (can look from above) // Restored
    controls.maxPolarAngle = Math.PI / 2; // 90 degrees (horizontal, prevents viewing from below) // Restored
    
    // Allow full azimuthal rotation (360 degrees) to see front and back
    controls.minAzimuthAngle = -Infinity; // Full rotation allowed // Restored
    controls.maxAzimuthAngle = Infinity; // Full rotation allowed // Restored
    
    controls.autoRotate = false; // Disable auto-rotation // Restored
    
    // Set the initial azimuthal angle directly using OrbitControls method
    // This ensures the angle limits work correctly
    controls.update(); // First update to calculate current angles
    
    // Set azimuthal angle to 20% rotation (π/5 = 36°) - moved 15% more to the left
    const targetAzimuth = Math.PI / 5;
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(camera.position.clone().sub(controls.target));
    spherical.theta = targetAzimuth; // Set azimuthal angle
    camera.position.copy(new THREE.Vector3().setFromSpherical(spherical).add(controls.target));
    
    // ✅ ENABLE ZOOM - Allow zoom functionality
    // No event listeners that prevent zoom
    
    controls.update();
    controlsRef.current = controls;

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
    ssaoPass.kernelRadius = 16;
    ssaoPass.minDistance = 0.005;
    composer.addPass(ssaoPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, 0.4, 0.85
    );
    composer.addPass(bloomPass);
    composerRef.current = composer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 8, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-5, 4, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(0, 2, -8);
    scene.add(rimLight);

    mountRef.current.appendChild(renderer.domElement);

    if (onSceneReady) {
      onSceneReady(scene, camera, renderer);
    }
  }, [onSceneReady]);

  const animate = useCallback(() => {
    if (!controlsRef.current || !composerRef.current) return;

    controlsRef.current.update();
    composerRef.current.render();

    if (onRender) {
      onRender();
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [onRender]);

  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
    composerRef.current.setSize(width, height);
  }, []);

  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current || !initialCameraPosition.current || !initialCameraTarget.current) return;

    cameraRef.current.position.copy(initialCameraPosition.current);
    controlsRef.current.target.copy(initialCameraTarget.current);
    controlsRef.current.update();
  }, []);

  const setViewAngle = useCallback((azimuthPercentage: number) => {
    if (!cameraRef.current || !controlsRef.current || !initialCameraPosition.current) return;

    const angle = (azimuthPercentage / 100) * Math.PI * 2;
    const radius = initialCameraPosition.current.length();
    
    cameraRef.current.position.x = Math.cos(angle) * radius;
    cameraRef.current.position.z = Math.sin(angle) * radius;
    cameraRef.current.position.y = initialCameraPosition.current.y;
    
    controlsRef.current.update();
  }, []);

  const takeScreenshot = useCallback(async (): Promise<string> => {
    if (!rendererRef.current) return '';

    return new Promise((resolve) => {
      rendererRef.current!.render(sceneRef.current!, cameraRef.current!);
      const dataURL = rendererRef.current!.domElement.toDataURL('image/png');
      resolve(dataURL);
    });
  }, []);

  const applyLightingPreset = useCallback((preset: any) => {
    if (!sceneRef.current) return;

    // Clear existing lights
    const lights = sceneRef.current.children.filter(child => child instanceof THREE.Light);
    lights.forEach(light => sceneRef.current!.remove(light));

    // Apply preset lighting
    if (preset.ambient) {
      const ambientLight = new THREE.AmbientLight(preset.ambient.color, preset.ambient.intensity);
      sceneRef.current.add(ambientLight);
    }

    if (preset.directional) {
      const directionalLight = new THREE.DirectionalLight(preset.directional.color, preset.directional.intensity);
      directionalLight.position.copy(preset.directional.position);
      directionalLight.castShadow = true;
      sceneRef.current.add(directionalLight);
    }
  }, []);

  const toggleEdgeDetection = useCallback((selectedPart?: string) => {
    if (!sceneRef.current) return;

    // Clear existing edge lines
    edgeLinesRef.current.forEach(line => sceneRef.current!.remove(line));
    edgeLinesRef.current = [];

    if (selectedPart) {
      // Add edge detection for selected part
      const part = sceneRef.current.getObjectByName(selectedPart);
      if (part && part instanceof THREE.Mesh && part.geometry) {
        const edges = new THREE.EdgesGeometry(part.geometry);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
        );
        line.position.copy(part.position);
        line.rotation.copy(part.rotation);
        line.scale.copy(part.scale);
        sceneRef.current.add(line);
        edgeLinesRef.current.push(line);
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    getScene: () => sceneRef.current,
    getRenderer: () => rendererRef.current,
    getCamera: () => cameraRef.current,
    getControls: () => controlsRef.current,
    resetCamera,
    setViewAngle,
    takeScreenshot,
    applyLightingPreset,
    toggleEdgeDetection
  }), [resetCamera, setViewAngle, takeScreenshot, applyLightingPreset, toggleEdgeDetection]);

  useEffect(() => {
    initializeScene();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [initializeScene, animate, handleResize]);

  return <div ref={mountRef} className="w-full h-full" />;
});

Canvas3D.displayName = 'Canvas3D';

export default Canvas3D; 