import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CharacterViewerRef } from '../CharacterViewer';
import { PartCategory, SelectedParts, ArchetypeId } from '../../types';

interface ViewportHoverOverlayProps {
  viewerRef: React.RefObject<CharacterViewerRef>;
  selectedParts: SelectedParts;
  selectedArchetype: ArchetypeId | null;
  onOpenCategory: (category: PartCategory) => void;
}

export const ViewportHoverOverlay: React.FC<ViewportHoverOverlayProps> = ({ viewerRef, onOpenCategory }) => {
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());
  const outlineNodesRef = useRef<THREE.Object3D[]>([]);
  const lastOutlinedRootRef = useRef<THREE.Object3D | null>(null);
  const lastCategoryRef = useRef<PartCategory | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const onOpenCategoryRef = useRef(onOpenCategory);
  onOpenCategoryRef.current = onOpenCategory;

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let attached = false;

    const clearOutline = () => {
      for (const node of outlineNodesRef.current) {
        if (node.parent) node.parent.remove(node);
      }
      outlineNodesRef.current = [];
      lastOutlinedRootRef.current = null;
    };

    const tryAttach = () => {
      if (attached) return;
      const renderer = viewerRef.current?.getRenderer();
      const camera = viewerRef.current?.getCamera() as THREE.PerspectiveCamera | null;
      const scene = viewerRef.current?.getScene();
      const canvas = renderer?.domElement;
      console.log('[HoverOverlay] poll:', { hasRef: !!viewerRef.current, hasRenderer: !!renderer, hasCamera: !!camera, hasScene: !!scene, hasCanvas: !!canvas });
      if (!canvas || !camera || !scene) return;
      console.log('[HoverOverlay] ATTACHED to canvas', canvas);

      attached = true;
      if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }

      const handleMove = (evt: MouseEvent) => {
        console.log('[HoverOverlay] mousemove detected');
        const rect = canvas.getBoundingClientRect();
        const x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
        pointerRef.current.set(x, y);

        raycasterRef.current.setFromCamera(pointerRef.current, camera);
        const intersections = raycasterRef.current.intersectObjects(scene.children, true);
        let hit: THREE.Object3D | null = null;
        for (const inter of intersections) {
          if (inter.object.visible) { hit = inter.object; break; }
        }

        if (!hit) {
          clearOutline();
          lastCategoryRef.current = null;
          return;
        }

        let node: any = hit;
        let foundCategory: PartCategory | null = null;
        while (node && !foundCategory) {
          if (node.userData?.category) foundCategory = node.userData.category as PartCategory;
          node = node.parent;
        }

        if (!foundCategory) {
          clearOutline();
          lastCategoryRef.current = null;
          return;
        }

        if (lastOutlinedRootRef.current !== hit) {
          clearOutline();
          try {
            const meshes: THREE.Mesh[] = [];
            (hit as any).traverse?.((child: any) => {
              if (child instanceof THREE.Mesh && child.geometry) meshes.push(child);
            });
            if (meshes.length === 0 && hit instanceof THREE.Mesh && hit.geometry) meshes.push(hit as THREE.Mesh);
            for (const m of meshes) {
              const outlineMat = new THREE.MeshBasicMaterial({
                color: 0x00ffff, side: THREE.BackSide,
                depthTest: true, depthWrite: false,
                transparent: true, opacity: 1.0,
                polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
              });
              const outlineMesh = new THREE.Mesh(m.geometry, outlineMat);
              outlineMesh.name = '__outline__';
              outlineMesh.renderOrder = (m.renderOrder || 0) + 1;
              outlineMesh.scale.set(1.005, 1.005, 1.005);
              m.add(outlineMesh);
              outlineNodesRef.current.push(outlineMesh);
            }
            lastOutlinedRootRef.current = hit;
          } catch {}
        }

        lastCategoryRef.current = foundCategory;
      };

      const handleClick = () => {
        if (lastCategoryRef.current) onOpenCategoryRef.current(lastCategoryRef.current);
      };

      const handleLeave = () => {
        clearOutline();
        lastCategoryRef.current = null;
      };

      canvas.addEventListener('mousemove', handleMove);
      canvas.addEventListener('mouseleave', handleLeave);
      canvas.addEventListener('click', handleClick);

      cleanupRef.current = () => {
        canvas.removeEventListener('mousemove', handleMove);
        canvas.removeEventListener('mouseleave', handleLeave);
        canvas.removeEventListener('click', handleClick);
        clearOutline();
      };
    };

    // Poll until Three.js is ready
    pollInterval = setInterval(tryAttach, 300);
    tryAttach(); // try immediately too

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [viewerRef]);

  return null;
};

export default ViewportHoverOverlay;
