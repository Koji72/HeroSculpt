import * as THREE from 'three';

// Persist material overrides by category across model reloads
const materialOverrides: Record<string, THREE.Material> = {};

// Persist color overrides by category across model reloads
const colorOverrides: Record<string, number> = {};

// Track override materials to avoid disposing them during scene cleanup
const overrideMaterials = new WeakSet<THREE.Material>();

export function isOverrideMaterial(material: THREE.Material | null | undefined): boolean {
  if (!material) return false;
  return overrideMaterials.has(material) || (material as THREE.Material & { __override?: boolean }).__override === true;
}

type OverrideListener = (payload: { type: 'material' | 'color'; category: string }) => void;
const listeners = new Set<OverrideListener>();

let notificationsSuspended = false;

export function suspendOverrideNotifications(): void {
  notificationsSuspended = true;
}

export function resumeOverrideNotifications(): void {
  notificationsSuspended = false;
}

export function subscribeMaterialOverrides(listener: OverrideListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setMaterialOverride(category: string, material: THREE.Material) {
  const instance = material.clone();
  // mark as persistent/override to skip disposal
  try { (instance as THREE.Material & { __override?: boolean }).__override = true; } catch {}
  overrideMaterials.add(instance);
  materialOverrides[category] = instance;
  try {
    const w = window as Window & { __matOverrides?: Record<string, unknown> };
    w.__matOverrides = w.__matOverrides || {};
    w.__matOverrides[category] = instance.toJSON ? instance.toJSON() : { __type: instance.type };
  } catch {}
  if (!notificationsSuspended) {
    listeners.forEach((l) => {
      try { l({ type: 'material', category }); } catch {}
    });
  }
}

export function getMaterialOverrides(): Record<string, THREE.Material> {
  return materialOverrides;
}

export function clearMaterialOverrides(categories?: string[]) {
  if (!categories) {
    Object.keys(materialOverrides).forEach((k) => delete materialOverrides[k]);
    return;
  }
  categories.forEach((k) => delete materialOverrides[k]);
}

export function setColorOverride(category: string, colorHex: number) {
  colorOverrides[category] = colorHex;
  try {
    const w = window as Window & { __colorOverrides?: Record<string, number> };
    w.__colorOverrides = w.__colorOverrides || {};
    w.__colorOverrides[category] = colorHex;
  } catch {}
  if (!notificationsSuspended) {
    listeners.forEach((l) => {
      try { l({ type: 'color', category }); } catch {}
    });
  }
}

export function getColorOverrides(): Record<string, number> {
  return colorOverrides;
}

export function clearColorOverrides(categories?: string[]) {
  if (!categories) {
    Object.keys(colorOverrides).forEach((k) => delete colorOverrides[k]);
    return;
  }
  categories.forEach((k) => delete colorOverrides[k]);
}

