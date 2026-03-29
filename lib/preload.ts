// Lightweight preload helpers for Draco and common Strong assets

export async function preloadDracoDecoder(): Promise<void> {
  try {
    // Touch the decoder files to warm the browser cache
    await Promise.all([
      fetch('/draco/draco_decoder.wasm', { cache: 'force-cache' }).catch(() => {}),
      fetch('/draco/draco_decoder.js', { cache: 'force-cache' }).catch(() => {}),
      fetch('/draco/draco_wasm_wrapper.js', { cache: 'force-cache' }).catch(() => {})
    ]);
  } catch (_) {}
}

// Prefetch a small set of commonly used GLBs from the Strong pack
const STRONG_PREFETCH_PATHS: string[] = [
  '/assets/strong/Base/strong_base.glb',
  '/assets/strong/torso/strong_torso_01.glb',
  '/assets/strong/hands/strong_hands_fist_l_01.glb',
  '/assets/strong/hands/strong_hands_fist_r_01.glb',
  '/assets/strong/boots/strong_boots_01.glb'
];

export async function prefetchStrongCommonAssets(): Promise<void> {
  try {
    await Promise.all(
      STRONG_PREFETCH_PATHS.map((p) => fetch(p, { cache: 'force-cache' }).catch(() => {}))
    );
  } catch (_) {}
}



