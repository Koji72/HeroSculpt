import * as THREE from 'three';
import { PartCategory } from '../types';

export interface SocketMap {
  [socketName: string]: THREE.Vector3;
}

/**
 * Extract all SOCKET_* empties from a loaded GLB model.
 * Returns a map of { socketName → worldPosition }.
 * The empties are hidden from rendering (visible = false).
 */
export function extractSockets(model: THREE.Object3D): SocketMap {
  const sockets: SocketMap = {};
  model.traverse((child) => {
    if (child.name.startsWith('SOCKET_')) {
      const worldPos = new THREE.Vector3();
      child.getWorldPosition(worldPos);
      sockets[child.name] = worldPos;
      child.visible = false; // hide from render
    }
  });
  return sockets;
}

/**
 * Which socket on the TORSO does each part category attach to?
 */
const CATEGORY_TO_TORSO_SOCKET: Partial<Record<PartCategory, string>> = {
  [PartCategory.HEAD]:          'SOCKET_neck',
  [PartCategory.HAND_LEFT]:     'SOCKET_wrist_left',
  [PartCategory.HAND_RIGHT]:    'SOCKET_wrist_right',
  [PartCategory.SHOULDERS]:     'SOCKET_shoulder_left',   // mirrored in code if needed
  [PartCategory.FOREARMS]:      'SOCKET_shoulder_left',
  [PartCategory.SYMBOL]:        'SOCKET_chest',
  [PartCategory.CHEST_BELT]:    'SOCKET_chest',
  [PartCategory.BELT]:          'SOCKET_belt',
  [PartCategory.CAPE]:          'SOCKET_cape',
};

/**
 * Apply socket-based positioning to a newly loaded part model.
 *
 * @param partModel   The loaded part GLB (clone from modelCache)
 * @param category    The part's PartCategory
 * @param torsoSockets The socket map extracted from the active torso model
 *
 * If the part has a SOCKET_root empty AND the torso has the corresponding
 * socket, the part is translated so SOCKET_root aligns with the torso socket.
 * Falls back to no-op (origin-based placement) if either socket is missing.
 */
export function applySocketPositioning(
  partModel: THREE.Object3D,
  category: PartCategory,
  torsoSockets: SocketMap,
): void {
  // 1. Find SOCKET_root inside the part
  let partSocketWorld: THREE.Vector3 | null = null;
  partModel.traverse((child) => {
    if (child.name === 'SOCKET_root' && partSocketWorld === null) {
      const pos = new THREE.Vector3();
      child.getWorldPosition(pos);
      partSocketWorld = pos;
      child.visible = false;
    }
  });

  if (!partSocketWorld) return; // part has no socket — use origin as-is

  // 2. Find the matching socket on the torso
  const torsoSocketName = CATEGORY_TO_TORSO_SOCKET[category];
  if (!torsoSocketName) return;

  const torsoSocketWorld = torsoSockets[torsoSocketName];
  if (!torsoSocketWorld) return; // torso not yet updated with sockets — fall back

  // 3. Translate the part so its SOCKET_root aligns with the torso socket
  const offset = new THREE.Vector3().subVectors(torsoSocketWorld, partSocketWorld);
  partModel.position.add(offset);
}
