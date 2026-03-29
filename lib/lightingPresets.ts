import * as THREE from 'three';

export type LightingPreset = {
  name: string;
  description: string;
  icon?: string;
  keyLight: { color: number; intensity: number; position: THREE.Vector3 };
  fillLight: { color: number; intensity: number; position: THREE.Vector3 };
  rimLight: { color: number; intensity: number; position: THREE.Vector3 };
};

export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    name: 'Cinematic Gold',
    description: 'Key/Fill/Rim cinematic',
    icon: '⭐',
    keyLight: { color: 0xfff2cc, intensity: 1.6, position: new THREE.Vector3(-4, 9, 11) },
    fillLight: { color: 0xbec7ff, intensity: 0.65, position: new THREE.Vector3(0, 5, 10) },
    rimLight: { color: 0xffffff, intensity: 1.2, position: new THREE.Vector3(4, 12, -8) },
  },
  {
    name: 'Cinematic Dark',
    description: 'Dramatic rim-focused setup',
    icon: '🌑',
    keyLight: { color: 0xfff2cc, intensity: 1.4, position: new THREE.Vector3(-4, 8, 9) },
    fillLight: { color: 0xddddff, intensity: 0.35, position: new THREE.Vector3(0, 4, 8) },
    rimLight: { color: 0xffffff, intensity: 1.5, position: new THREE.Vector3(4, 13, -7) },
  },
  {
    name: 'Alien Rim Red',
    description: 'Cold key, red rim, icy fill',
    icon: '👾',
    keyLight: { color: 0xcfeeff, intensity: 2.0, position: new THREE.Vector3(-6, 5, 8) },
    fillLight: { color: 0x66ccff, intensity: 0.45, position: new THREE.Vector3(2, -4, 2) },
    rimLight: { color: 0xff3333, intensity: 2.3, position: new THREE.Vector3(6, 3, -4) },
  },
  {
    name: 'Magneto Legend',
    description: 'Cold key (violet tint), blue fill, icy rim',
    icon: '🧲',
    keyLight: { color: 0xf2e6ff, intensity: 1.5, position: new THREE.Vector3(-8, 11, 8) },
    fillLight: { color: 0x5dbaff, intensity: 0.6, position: new THREE.Vector3(5, -3, 3) },
    rimLight: { color: 0xbbe6ff, intensity: 0.9, position: new THREE.Vector3(-9, 9, -5) },
  },
  {
    name: 'Batman Legend',
    description: 'Cold key, blue fill, icy rim; Gotham night vibe',
    icon: '🦇',
    keyLight: { color: 0xf2f6ff, intensity: 1.45, position: new THREE.Vector3(-8, 11, 8) },
    fillLight: { color: 0x3b63a2, intensity: 0.52, position: new THREE.Vector3(6, -3, 2) },
    rimLight: { color: 0xbbe6ff, intensity: 0.87, position: new THREE.Vector3(-9, 8, -7) },
  },
  {
    name: 'Dark Knight',
    description: 'Cold key, lower fill, strong icy rim; higher contrast',
    icon: '🦇',
    keyLight: { color: 0xf2f6ff, intensity: 1.35, position: new THREE.Vector3(-8, 11, 8) },
    fillLight: { color: 0x2f4770, intensity: 0.4, position: new THREE.Vector3(6, -3, 2) },
    rimLight: { color: 0xbbe6ff, intensity: 1.0, position: new THREE.Vector3(-9, 9, -7) },
  },
  {
    name: 'Blue & Gray Classic',
    description: 'Cold key, stronger blue fill, soft icy rim',
    icon: '🦇',
    keyLight: { color: 0xf2f6ff, intensity: 1.4, position: new THREE.Vector3(-8, 11, 8) },
    fillLight: { color: 0x4a6bb5, intensity: 0.6, position: new THREE.Vector3(6, -3, 2) },
    rimLight: { color: 0xbbe6ff, intensity: 0.8, position: new THREE.Vector3(-9, 8, -7) },
  },
  {
    name: 'Gambit & Rogue – Comic Studio',
    description: 'Cool key, cyan fill, magenta rim, studio look',
    icon: '🃏',
    keyLight: { color: 0xF2F6FF, intensity: 1.9, position: new THREE.Vector3(-6, 9, 8) },
    fillLight: { color: 0x6CA6FF, intensity: 0.75, position: new THREE.Vector3(6, 2, 3) },
    rimLight: { color: 0xFF3AD5, intensity: 0.8, position: new THREE.Vector3(-3, 6, -4) },
  },
  {
    name: 'Colossus – Studio Metal',
    description: 'Neutral key, cyan fill, cold blue rim; high-contrast metal skin',
    icon: '🧊',
    keyLight: { color: 0xFFFFFF, intensity: 1.6, position: new THREE.Vector3(-5, 6, 5) },
    fillLight: { color: 0x66D3E0, intensity: 0.6, position: new THREE.Vector3(5, 1, 3) },
    rimLight: { color: 0x8ACFFF, intensity: 1.0, position: new THREE.Vector3(-3, 7, -4) },
  },
  {
    name: 'Hulk – Warm Studio',
    description: 'Warm key, teal-green fill, warm yellow rim',
    icon: '💪',
    keyLight: { color: 0xFFF5E6, intensity: 1.6, position: new THREE.Vector3(-4, 6, 5) },
    fillLight: { color: 0x78E6C0, intensity: 0.6, position: new THREE.Vector3(4, 2, 3) },
    rimLight: { color: 0xFFD566, intensity: 0.9, position: new THREE.Vector3(-3, 7, -4) },
  },
  {
    name: 'Captain Marvel – Gallery',
    description: 'Neutral-warm key, cold blue fill, warm orange rim',
    icon: '⭐',
    keyLight: { color: 0xFFF8EE, intensity: 1.6, position: new THREE.Vector3(-4, 5, 4) },
    fillLight: { color: 0x6BD3FF, intensity: 0.5, position: new THREE.Vector3(3, 2, 3) },
    rimLight: { color: 0xFFD166, intensity: 0.9, position: new THREE.Vector3(-2, 6, -3) },
  },
  {
    name: 'Captain America – Sideshow',
    description: 'Warm key, cool blue fill, warm orange rim (Sideshow style)',
    icon: '🛡️',
    keyLight: { color: 0xFFF6E9, intensity: 1.6, position: new THREE.Vector3(-3, 5, 4) },
    fillLight: { color: 0x68C3FF, intensity: 0.5, position: new THREE.Vector3(3, 3, 3) },
    rimLight: { color: 0xFFB55C, intensity: 0.9, position: new THREE.Vector3(-2, 6, -3) },
  },
  {
    name: 'Spider‑Man – Sideshow',
    description: 'Cinematic bi-color: warm key + cool green-blue fill, lemon rim',
    icon: '🕷️',
    keyLight: { color: 0xFF9B4A, intensity: 1.8, position: new THREE.Vector3(-3.5, 2.5, 4) },
    fillLight: { color: 0x9EFFB3, intensity: 1.2, position: new THREE.Vector3(3.5, 2.5, -3) },
    rimLight: { color: 0xFFD66B, intensity: 0.8, position: new THREE.Vector3(-2, 5, -2) },
  },
  {
    name: 'Emerald Studio',
    description: 'Cold key, blue fill, cool rim',
    icon: '💚',
    keyLight: { color: 0xffffff, intensity: 1.4, position: new THREE.Vector3(-6, 8, 6) },
    fillLight: { color: 0x77aaff, intensity: 0.5, position: new THREE.Vector3(3, -2, 3) },
    rimLight: { color: 0xccffe6, intensity: 0.9, position: new THREE.Vector3(-7, 6, -4) },
  },
  {
    name: 'Tech Neon',
    description: 'Cool neon mood',
    icon: '💡',
    keyLight: { color: 0xaaf0ff, intensity: 1.3, position: new THREE.Vector3(-4, 9, 10) },
    fillLight: { color: 0x8a7bff, intensity: 0.7, position: new THREE.Vector3(0, 4, 9) },
    rimLight: { color: 0xffffff, intensity: 1.0, position: new THREE.Vector3(-3, 12, -8) },
  },
  {
    name: 'Warm Studio',
    description: 'Warm front light and soft fill',
    icon: '🎬',
    keyLight: { color: 0xfff2cc, intensity: 1.5, position: new THREE.Vector3(-3, 9, 10) },
    fillLight: { color: 0xffd9a6, intensity: 0.55, position: new THREE.Vector3(0, 5, 9) },
    rimLight: { color: 0xffffff, intensity: 1.0, position: new THREE.Vector3(3, 12, -8) },
  },
  {
    name: 'X‑Men Legend',
    description: 'Warm key, fuchsia fill, cyan rim',
    icon: '❌',
    keyLight: { color: 0xf8f2ea, intensity: 1.3, position: new THREE.Vector3(-7, 8, 8) },
    fillLight: { color: 0xff32b7, intensity: 0.95, position: new THREE.Vector3(4, -3, 4) },
    rimLight: { color: 0x00b8ff, intensity: 0.8, position: new THREE.Vector3(7, 5, -6) },
  },
  {
    name: 'X‑Men Classic',
    description: 'Warm key, fuchsia fill, cyan rim',
    icon: '❌',
    keyLight: { color: 0xf8f2ea, intensity: 1.35, position: new THREE.Vector3(-7, 8, 8) },
    fillLight: { color: 0xff32b7, intensity: 1.0, position: new THREE.Vector3(4, -3, 4) },
    rimLight: { color: 0x00b8ff, intensity: 0.85, position: new THREE.Vector3(7, 5, -6) },
  },
  {
    name: 'Moebius Comic Studio',
    description: 'NPR/Toon lighting for comic book style',
    icon: '🎨',
    keyLight: { color: 0xffffff, intensity: 2.0, position: new THREE.Vector3(-2, 8, 6) },
    fillLight: { color: 0xffffff, intensity: 0.8, position: new THREE.Vector3(4, 2, 4) },
    rimLight: { color: 0xffffff, intensity: 0.6, position: new THREE.Vector3(-2, 6, -8) },
  },
  {
    name: 'Manga High Contrast',
    description: 'High contrast dramatic lighting for manga style',
    icon: '📚',
    keyLight: { color: 0xffffff, intensity: 2.5, position: new THREE.Vector3(-4, 10, 8) },
    fillLight: { color: 0xffffff, intensity: 0.3, position: new THREE.Vector3(6, 0, 2) },
    rimLight: { color: 0xffffff, intensity: 1.0, position: new THREE.Vector3(2, 8, -10) },
  },
  {
    name: 'Cartoon Bright',
    description: 'Bright even lighting for cartoon style',
    icon: '🎭',
    keyLight: { color: 0xffffff, intensity: 1.8, position: new THREE.Vector3(-1, 6, 8) },
    fillLight: { color: 0xffffff, intensity: 1.2, position: new THREE.Vector3(3, 3, 6) },
    rimLight: { color: 0xffffff, intensity: 0.8, position: new THREE.Vector3(-4, 8, -6) },
  },
  {
    name: 'Comic Cell Shading',
    description: 'Classic cell shading lighting setup',
    icon: '🔆',
    keyLight: { color: 0xffffff, intensity: 2.2, position: new THREE.Vector3(-3, 9, 5) },
    fillLight: { color: 0xffffff, intensity: 0.5, position: new THREE.Vector3(5, 1, 3) },
    rimLight: { color: 0xffffff, intensity: 0.9, position: new THREE.Vector3(1, 7, -7) },
  }
];

export function findLightingPresetByName(name: string): LightingPreset | null {
  try {
    const preset = LIGHTING_PRESETS.find((p) => p.name === name);
    return preset || null;
  } catch {
    return null;
  }
}


