import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

interface ThreeSceneConfig {
  canvasRef: React.RefObject<HTMLDivElement>;
}

interface ThreeSceneState {
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  controlsRef: React.RefObject<OrbitControls | null>;
  composerRef: React.RefObject<EffectComposer | null>;
  animate: () => void;
  setComposer: (newComposer: EffectComposer | null) => void;
}

export const useThreeScene = ({ canvasRef }: ThreeSceneConfig): ThreeSceneState => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);

  const isInitialized = useRef(false);

  const setComposer = useCallback((newComposer: EffectComposer | null) => {
    composerRef.current = newComposer;
  }, []);

  const animationIdRef = useRef<number>(0);

  const animate = useCallback(() => {
    animationIdRef.current = requestAnimationFrame(animate);
    controlsRef.current?.update();

    if (composerRef.current && composerRef.current.passes.length > 1) {
      composerRef.current.render();
    } else if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    const currentMount = canvasRef.current;
    const mountWidth = Math.max(currentMount.clientWidth, 300);
    const mountHeight = Math.max(currentMount.clientHeight, 400);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(28.6, mountWidth / mountHeight, 0.1, 1000);
    const azimuthalRotation = Math.PI / 5;
    const distance = 8;
    camera.position.set(
      Math.sin(azimuthalRotation) * distance,
      2,
      Math.cos(azimuthalRotation) * distance
    );
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
      stencil: false,
      depth: true
    });
    renderer.setSize(mountWidth, mountHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x1a1a1a, 1);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 1.5;
    controls.zoomSpeed = 0; // ✅ ZERO ZOOM SPEED - Completely disable zoom
    controls.target.set(0, 1.5, 0);
    controls.enablePan = false;
    controls.enableZoom = true; // Keep zoom enabled
    controls.enableRotate = true;
    
    // ✅ COMPLETELY DISABLE ZOOM - Set min and max distance to same value
    controls.minDistance = 6;  // Allow manual zoom in
    controls.maxDistance = 20; // Allow manual zoom out
    
    controls.minPolarAngle = Math.PI / 6;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.autoRotate = false;
    
    // ✅ PREVENT ZOOM ON HOVER - Temporarily disable zoom when mouse is over canvas
    const handleMouseEnter = () => {
      if (controlsRef.current) {
        controlsRef.current.enableZoom = false;
      }
    };
    
    const handleMouseLeave = () => {
      if (controlsRef.current) {
        controlsRef.current.enableZoom = true;
      }
    };
    
    // ✅ AGGRESSIVE WHEEL PREVENTION - Prevent all wheel events on canvas
    const preventWheelZoom = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    
    // Add event listeners to control zoom behavior
    renderer.domElement.addEventListener('mouseenter', handleMouseEnter);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);
    
    // Add aggressive wheel prevention
    renderer.domElement.addEventListener('wheel', preventWheelZoom, { passive: false });
    (renderer.domElement as any).addEventListener('mousewheel', preventWheelZoom, { passive: false });
    (renderer.domElement as any).addEventListener('DOMMouseScroll', preventWheelZoom, { passive: false });
    
    // ✅ PREVENT BROWSER ZOOM - Add wheel prevention to parent container
    currentMount.addEventListener('wheel', preventWheelZoom, { passive: false });
    (currentMount as any).addEventListener('mousewheel', preventWheelZoom, { passive: false });
    (currentMount as any).addEventListener('DOMMouseScroll', preventWheelZoom, { passive: false });
    
    controls.update();
    controlsRef.current = controls;

    // Initial Composer setup (will be updated by AdvancedEffects)
    const initialComposer = new EffectComposer(renderer);
    initialComposer.addPass(new RenderPass(scene, camera));
    composerRef.current = initialComposer;

    // Lights (initial setup, will be managed by MaterialConfigurator's lighting presets)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
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

    const fillLight = new THREE.DirectionalLight(0xaaaaaa, 0.8);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(0, 10, -10);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    animate();

    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;
      const rawWidth = canvasRef.current.clientWidth;
      const rawHeight = canvasRef.current.clientHeight;
      const newWidth = Math.max(rawWidth, 300);
      const newHeight = Math.max(rawHeight, 400);

      if (rawWidth === 0 || rawHeight === 0) {
        console.warn('useThreeScene: Attempted resize with zero dimensions. Skipping.', { raw: { width: rawWidth, height: rawHeight }, adjusted: { width: newWidth, height: newHeight } });
        return;
      }
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
      composerRef.current.setSize(newWidth, newHeight);
      // SSAOPass and UnrealBloomPass need to be updated here if they are directly managed by this hook.
      // For now, they are managed by AdvancedEffects, so no direct update here.
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === currentMount) {
          handleResize();
        }
      }
    });
    resizeObserver.observe(currentMount);

    const cleanupScene = () => {
      isInitialized.current = false;
      cancelAnimationFrame(animationIdRef.current);
      resizeObserver.disconnect();
      currentMount.removeEventListener('wheel', preventWheelZoom);
      (currentMount as any).removeEventListener('mousewheel', preventWheelZoom);
      (currentMount as any).removeEventListener('DOMMouseScroll', preventWheelZoom);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.removeEventListener('mouseenter', handleMouseEnter);
        rendererRef.current.domElement.removeEventListener('mouseleave', handleMouseLeave);
        if (currentMount) currentMount.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
      controlsRef.current?.dispose();

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      composerRef.current = null;
    };

    return cleanupScene;
  }, []);

  return {
    sceneRef,
    cameraRef,
    rendererRef,
    controlsRef,
    composerRef,
    animate,
    setComposer,
  };
};