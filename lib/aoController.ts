// Simple global AO controller to allow changing AO intensity from anywhere (e.g., skins)
// This avoids tight coupling with rendering components and allows per-skin control.

type AOListener = (intensity: number) => void;

export const DEFAULT_AO_INTENSITY = 0.046;

const state = {
  intensity: DEFAULT_AO_INTENSITY, // default matches current SAO setup
  listeners: new Set<AOListener>()
};

export function setAOIntensity(intensity: number) {
  state.intensity = intensity;
  state.listeners.forEach((cb) => {
    try { cb(intensity); } catch {}
  });
}

export function getAOIntensity(): number {
  return state.intensity;
}

export function subscribeAO(listener: AOListener): () => void {
  state.listeners.add(listener);
  // Push current value immediately
  try { listener(state.intensity); } catch {}
  return () => state.listeners.delete(listener);
}


