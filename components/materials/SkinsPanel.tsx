import React from 'react';
import * as THREE from 'three';
import { CharacterViewerRef } from '../CharacterViewer';
import { findLightingPresetByName } from '../../lib/lightingPresets';
import { PartCategory } from '../../types';
import { setMaterialOverride, setColorOverride, clearColorOverrides, clearMaterialOverrides } from '../../lib/materialOverrides';
import { setAOIntensity } from '../../lib/aoController';
import { useLang, t } from '../../lib/i18n';

type SkinPreset = {
  id: string;
  name: string;
  description: string;
  preview?: string;
  build: (api: CharacterViewerRef) => void;
};

const applyColors = (
  api: CharacterViewerRef,
  colors: Partial<Record<PartCategory, number>>
) => {
  Object.entries(colors).forEach(([cat, hex]) => {
    if (typeof hex === 'number') {
      setColorOverride(cat as PartCategory, hex);
      api.applyColorToPart(hex, cat as PartCategory);
    }
  });
};

const resetAllCategoriesToNeutral = (api: CharacterViewerRef) => {
  const neutral = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, roughness: 0.5, metalness: 0.2, clearcoat: 0.0 });
  const allCategories = Object.values(PartCategory).filter((v) => typeof v === 'string') as string[];
  allCategories.forEach((cat) => {
    api.applyMaterialToPart(neutral, cat);
  });
};

// Captain America – materials only (lights must be applied from Lights panel)
// 🎨 Moebius/NPR Toon Skin - Versión mejorada con alto contraste
const createMoebiusToonSkin = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  setAOIntensity(0.12); // Más contraste en AO

  // Crear materiales base vibrantes estilo superhéroe con alto contraste
  const bodyMaterial = new THREE.MeshToonMaterial({ 
    color: 0x1d4ed8, // Azul superhéroe más oscuro
    gradientMap: createToonGradient(),
    transparent: false,
    side: THREE.FrontSide
  });
  
  const headMaterial = new THREE.MeshToonMaterial({ 
    color: 0xf59e0b, // Piel más cálida
    gradientMap: createToonGradient(),
    transparent: false,
    side: THREE.FrontSide
  });
  
  const capeMaterial = new THREE.MeshToonMaterial({ 
    color: 0xb91c1c, // Rojo capa más intenso
    gradientMap: createToonGradient(),
    transparent: false,
    side: THREE.FrontSide
  });
  
  const metalMaterial = new THREE.MeshToonMaterial({ 
    color: 0xf59e0b, // Dorado más intenso
    gradientMap: createToonGradient(),
    transparent: false,
    side: THREE.FrontSide
  });

  // Mapeo de materiales por categoría
  const materialMap: Array<[THREE.Material, PartCategory]> = [
    [bodyMaterial, PartCategory.TORSO],
    [bodyMaterial, PartCategory.SUIT_TORSO],
    [bodyMaterial, PartCategory.LOWER_BODY],
    [bodyMaterial, PartCategory.HAND_LEFT],
    [bodyMaterial, PartCategory.HAND_RIGHT],
    [bodyMaterial, PartCategory.BOOTS],
    [headMaterial, PartCategory.HEAD],
    [capeMaterial, PartCategory.CAPE],
    [metalMaterial, PartCategory.SYMBOL],
    [metalMaterial, PartCategory.BELT],
    [metalMaterial, PartCategory.BUCKLE]
  ];

  materialMap.forEach(([material, category]) => {
    setMaterialOverride(category, material);
    api.applyMaterialToPart(material, category);
  });
};

// Función helper para crear gradiente toon con estilo cómic granulado
function createToonGradient(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 8; // Más resolución para mejor control
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  
  // Gradiente con 8 bandas para más contraste
  const gradient = ctx.createLinearGradient(0, 0, 8, 0);
  gradient.addColorStop(0, '#000000');      // Sombra profunda
  gradient.addColorStop(0.125, '#1a1a1a'); // Sombra oscura
  gradient.addColorStop(0.25, '#333333');   // Sombra media
  gradient.addColorStop(0.375, '#4d4d4d'); // Sombra clara
  gradient.addColorStop(0.5, '#666666');   // Medio
  gradient.addColorStop(0.625, '#808080'); // Luz media
  gradient.addColorStop(0.75, '#b3b3b3'); // Luz clara
  gradient.addColorStop(0.875, '#cccccc'); // Luz brillante
  gradient.addColorStop(1, '#ffffff');     // Luz máxima
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 8, 1);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  
  return texture;
}

// Gradiente manga con alto contraste
function createMangaGradient(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  
  // Gradiente dramático de 4 bandas
  const gradient = ctx.createLinearGradient(0, 0, 4, 0);
  gradient.addColorStop(0, '#000000');      // Negro puro
  gradient.addColorStop(0.25, '#222222');   // Sombra muy oscura
  gradient.addColorStop(0.75, '#aaaaaa');   // Luz media
  gradient.addColorStop(1, '#ffffff');      // Blanco puro
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 4, 1);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  
  return texture;
}

// Gradiente cartoon suave con 6 bandas
function createCartoonGradient(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 6;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  
  // Gradiente suave para cartoon
  const gradient = ctx.createLinearGradient(0, 0, 6, 0);
  gradient.addColorStop(0, '#111111');      // Sombra suave
  gradient.addColorStop(0.2, '#333333');    // Sombra media
  gradient.addColorStop(0.4, '#555555');    // Medio bajo
  gradient.addColorStop(0.6, '#888888');    // Medio alto
  gradient.addColorStop(0.8, '#bbbbbb');    // Luz media
  gradient.addColorStop(1, '#ffffff');      // Luz máxima
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 6, 1);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  
  return texture;
}

// 🎨 Skin de granulado cómic con efecto de impresión
const createComicGrainSkin = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  setAOIntensity(0.15); // Contraste medio-alto

  // Crear gradiente con efecto de granulado cómic
  const comicGrainGradient = createComicGrainGradient();
  
  // Materiales con colores de cómic clásico
  const comicBlue = new THREE.MeshToonMaterial({ 
    color: 0x1e40af, // Azul cómic
    gradientMap: comicGrainGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const comicRed = new THREE.MeshToonMaterial({ 
    color: 0xdc2626, // Rojo cómic
    gradientMap: comicGrainGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const comicYellow = new THREE.MeshToonMaterial({ 
    color: 0xf59e0b, // Amarillo cómic
    gradientMap: comicGrainGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const comicSkin = new THREE.MeshToonMaterial({ 
    color: 0xfbbf24, // Piel estilo cómic
    gradientMap: comicGrainGradient,
    transparent: false,
    side: THREE.FrontSide
  });

  const materialMap: Array<[THREE.Material, PartCategory]> = [
    [comicBlue, PartCategory.TORSO],
    [comicBlue, PartCategory.SUIT_TORSO],
    [comicBlue, PartCategory.LOWER_BODY],
    [comicBlue, PartCategory.BOOTS],
    [comicSkin, PartCategory.HEAD],
    [comicSkin, PartCategory.HAND_LEFT],
    [comicSkin, PartCategory.HAND_RIGHT],
    [comicRed, PartCategory.CAPE],
    [comicYellow, PartCategory.SYMBOL],
    [comicYellow, PartCategory.BELT],
    [comicYellow, PartCategory.BUCKLE]
  ];

  materialMap.forEach(([material, category]) => {
    setMaterialOverride(category, material);
    api.applyMaterialToPart(material, category);
  });
};

// Función para crear gradiente con efecto de granulado cómic
function createComicGrainGradient(): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 10; // Alta resolución para granulado
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  
  // Gradiente con efecto de granulado de impresión
  const gradient = ctx.createLinearGradient(0, 0, 10, 0);
  gradient.addColorStop(0, '#000000');      // Negro puro
  gradient.addColorStop(0.1, '#0a0a0a');   // Negro granulado
  gradient.addColorStop(0.2, '#1a1a1a');   // Sombra profunda
  gradient.addColorStop(0.3, '#2a2a2a');   // Sombra oscura
  gradient.addColorStop(0.4, '#3a3a3a');   // Sombra media
  gradient.addColorStop(0.5, '#555555');   // Medio
  gradient.addColorStop(0.6, '#707070');   // Medio alto
  gradient.addColorStop(0.7, '#8a8a8a');   // Luz media
  gradient.addColorStop(0.8, '#a5a5a5');   // Luz clara
  gradient.addColorStop(0.9, '#d4d4d4');   // Luz brillante
  gradient.addColorStop(1, '#ffffff');     // Blanco puro
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 10, 1);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  
  return texture;
}

const createMangaHighContrastSkin = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.18); // Máximo contraste en AO

  // Material manga con alto contraste dramático
  const mangaGradient = createMangaGradient();
  
  const bodyMaterial = new THREE.MeshToonMaterial({ 
    color: 0x1e3a8a, // Azul muy oscuro para manga
    gradientMap: mangaGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const accentMaterial = new THREE.MeshToonMaterial({ 
    color: 0xdc2626, // Rojo muy intenso
    gradientMap: mangaGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const darkAccent = new THREE.MeshToonMaterial({ 
    color: 0x000000, // Negro puro para detalles
    gradientMap: mangaGradient,
    transparent: false,
    side: THREE.FrontSide
  });

  const materialMap: Array<[THREE.Material, PartCategory]> = [
    [bodyMaterial, PartCategory.TORSO],
    [bodyMaterial, PartCategory.SUIT_TORSO],
    [bodyMaterial, PartCategory.LOWER_BODY],
    [bodyMaterial, PartCategory.BOOTS],
    [bodyMaterial, PartCategory.HEAD],
    [bodyMaterial, PartCategory.HAND_LEFT],
    [bodyMaterial, PartCategory.HAND_RIGHT],
    [accentMaterial, PartCategory.CAPE],
    [accentMaterial, PartCategory.SYMBOL],
    [darkAccent, PartCategory.BELT],
    [darkAccent, PartCategory.BUCKLE]
  ];

  materialMap.forEach(([material, category]) => {
    setMaterialOverride(category, material);
    api.applyMaterialToPart(material, category);
  });
};



const createCartoonBrightSkin = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  setAOIntensity(0.08); // Contraste medio para cartoon

  // Colores brillantes estilo cartoon con mejor contraste
  const cartoonGradient = createCartoonGradient();
  
  const brightBlue = new THREE.MeshToonMaterial({ 
    color: 0x2563eb, // Azul más intenso
    gradientMap: cartoonGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const brightRed = new THREE.MeshToonMaterial({ 
    color: 0xdc2626, // Rojo más intenso
    gradientMap: cartoonGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const brightYellow = new THREE.MeshToonMaterial({ 
    color: 0xf59e0b, // Amarillo más intenso
    gradientMap: cartoonGradient,
    transparent: false,
    side: THREE.FrontSide
  });
  
  const skinTone = new THREE.MeshToonMaterial({ 
    color: 0xf59e0b, // Tono piel más cálido
    gradientMap: cartoonGradient,
    transparent: false,
    side: THREE.FrontSide
  });

  const materialMap: Array<[THREE.Material, PartCategory]> = [
    [brightBlue, PartCategory.TORSO],
    [brightBlue, PartCategory.SUIT_TORSO],
    [brightBlue, PartCategory.LOWER_BODY],
    [brightBlue, PartCategory.BOOTS],
    [skinTone, PartCategory.HEAD],
    [skinTone, PartCategory.HAND_LEFT],
    [skinTone, PartCategory.HAND_RIGHT],
    [brightRed, PartCategory.CAPE],
    [brightYellow, PartCategory.SYMBOL],
    [brightYellow, PartCategory.BELT],
    [brightYellow, PartCategory.BUCKLE]
  ];

  materialMap.forEach(([material, category]) => {
    setMaterialOverride(category, material);
    api.applyMaterialToPart(material, category);
  });
};



const createCaptainAmericaSkin = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.06);

  // Suit blue (fabric ballistic look)
  const suitBlue = new THREE.MeshPhysicalMaterial({
    color: 0x1B355F,
    metalness: 0.05,
    roughness: 0.4,
    clearcoat: 0.12,
    clearcoatRoughness: 0.35,
  });

  const redDetails = new THREE.MeshPhysicalMaterial({
    color: 0x8B1F28,
    metalness: 0.05,
    roughness: 0.38,
  });

  const whiteDetails = new THREE.MeshPhysicalMaterial({
    color: 0xEAEAEA,
    metalness: 0.05,
    roughness: 0.4,
  });

  // Shield metals
  const shieldRed = new THREE.MeshStandardMaterial({ color: 0xB2202A, metalness: 1.0, roughness: 0.25 });
  const shieldBlue = new THREE.MeshStandardMaterial({ color: 0x1B355F, metalness: 1.0, roughness: 0.22 });
  const shieldSilver = new THREE.MeshStandardMaterial({ color: 0xDADADA, metalness: 1.0, roughness: 0.2 });

  const matMap: Array<[THREE.Material, PartCategory]> = [
    // Fabric suit
    [suitBlue, PartCategory.TORSO],
    [suitBlue, PartCategory.SUIT_TORSO],
    [suitBlue, PartCategory.LOWER_BODY],
    // Gloves/boots (white or red depending on your model set)
    [whiteDetails, PartCategory.HAND_LEFT],
    [whiteDetails, PartCategory.HAND_RIGHT],
    [redDetails, PartCategory.BOOTS],
    // Belt/buckle as silver to match shield metal
    [shieldSilver, PartCategory.BELT],
    [shieldSilver, PartCategory.BUCKLE],
    [shieldSilver, PartCategory.CHEST_BELT],
    // Symbol (star) as silver by default
    [shieldSilver, PartCategory.SYMBOL],
  ];

  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });

  // Optional color nudges for parts
  applyColors(api, {
    [PartCategory.TORSO]: 0x1B355F,
    [PartCategory.SUIT_TORSO]: 0x1B355F,
    [PartCategory.LOWER_BODY]: 0x1B355F,
    [PartCategory.HAND_LEFT]: 0xEAEAEA,
    [PartCategory.HAND_RIGHT]: 0xEAEAEA,
    [PartCategory.BOOTS]: 0x8B1F28,
    [PartCategory.BELT]: 0xDADADA,
    [PartCategory.BUCKLE]: 0xDADADA,
    [PartCategory.CHEST_BELT]: 0xDADADA,
    [PartCategory.SYMBOL]: 0xDADADA,
  });
};

// Spider‑Man – materials only (lights via Lights panel)
const createSpiderManSkin = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.07);

  const redSuit = new THREE.MeshPhysicalMaterial({
    color: 0xC3261E,
    metalness: 0.05,
    roughness: 0.45,
    clearcoat: 0.15,
    clearcoatRoughness: 0.4,
  });

  const blueSuit = new THREE.MeshPhysicalMaterial({
    color: 0x2674D4,
    metalness: 0.04,
    roughness: 0.43,
    clearcoat: 0.1,
  });

  const eyeWhite = new THREE.MeshPhysicalMaterial({
    color: 0xE8E8E8,
    metalness: 0.05,
    roughness: 0.1,
    clearcoat: 0.4,
  });

  const baseStone = new THREE.MeshStandardMaterial({
    color: 0x56605A, // stone with greenish tint
    metalness: 0.2,
    roughness: 0.65,
  });

  const matMap: Array<[THREE.Material, PartCategory]> = [
    [redSuit, PartCategory.TORSO],
    [redSuit, PartCategory.CHEST_BELT], // webbing/symbol carrier as approximation
    [blueSuit, PartCategory.SUIT_TORSO],
    [blueSuit, PartCategory.LOWER_BODY],
    [blueSuit, PartCategory.BOOTS],
    [eyeWhite, PartCategory.HEAD],
    [baseStone, PartCategory.BELT], // use belt/pouch as proxy for base if present
    [baseStone, PartCategory.POUCH],
  ];

  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });

  applyColors(api, {
    [PartCategory.TORSO]: 0xC3261E,
    [PartCategory.CHEST_BELT]: 0xC3261E,
    [PartCategory.SUIT_TORSO]: 0x2674D4,
    [PartCategory.LOWER_BODY]: 0x2674D4,
    [PartCategory.BOOTS]: 0x2674D4,
  });
};

const createCosmicWarrior = (api: CharacterViewerRef) => {
  // Reset all previous overrides so this skin fully applies
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.05);
  // lighting moved to Lights panel
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 1.0, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2, reflectivity: 0.6 });
  const fabric = new THREE.MeshPhysicalMaterial({ color: 0x22346c, metalness: 0.0, roughness: 0.70, sheen: 0.5, sheenRoughness: 0.9 });
  const boots = new THREE.MeshPhysicalMaterial({ color: 0x425a7a, metalness: 0.25, roughness: 0.45, clearcoat: 0.25 });
  const symbolMetal = new THREE.MeshPhysicalMaterial({ color: 0xCCCCCC, metalness: 0.8, roughness: 0.2, clearcoat: 0.4, reflectivity: 0.5 });
  const matMap: Array<[THREE.Material, PartCategory]> = [
    [fabric, PartCategory.TORSO],
    [fabric, PartCategory.SUIT_TORSO],
    [fabric, PartCategory.LOWER_BODY],
    [fabric, PartCategory.CAPE],
    [boots, PartCategory.BOOTS],
    [gold, PartCategory.BELT],
    [gold, PartCategory.BUCKLE],
    [gold, PartCategory.CHEST_BELT],
    [symbolMetal, PartCategory.SYMBOL],
  ];
  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => { setMaterialOverride(c as PartCategory, m as THREE.Material); api.applyMaterialToPart(m as THREE.Material, c as PartCategory); });

  // Color accents per part for the skin
  applyColors(api, {
    [PartCategory.TORSO]: 0x22346c,       // deep navy
    [PartCategory.SUIT_TORSO]: 0x22346c,
    [PartCategory.LOWER_BODY]: 0x1e2e5a,  // slightly darker legs
    [PartCategory.CAPE]: 0x1a2244,        // dark cape
    [PartCategory.HAND_LEFT]: 0x21335f,   // gloves
    [PartCategory.HAND_RIGHT]: 0x21335f,
    [PartCategory.BOOTS]: 0x425a7a,       // steel blue boots
    [PartCategory.BELT]: 0xD4AF37,        // gold
    [PartCategory.BUCKLE]: 0xD4AF37,
    [PartCategory.CHEST_BELT]: 0xD4AF37,
    [PartCategory.SYMBOL]: 0xE0E5EA       // silver symbol
  });
};

const createCosmicWarriorDark = (api: CharacterViewerRef) => {
  // Reset all previous overrides so this skin fully applies
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.085);
  // lighting moved to Lights panel
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xC8A13A, metalness: 1.0, roughness: 0.28, clearcoat: 0.55 });
  const darkFabric = new THREE.MeshPhysicalMaterial({ color: 0x17243d, metalness: 0.0, roughness: 0.72, sheen: 0.45, sheenRoughness: 0.95 });
  const boots = new THREE.MeshPhysicalMaterial({ color: 0x2b3b52, metalness: 0.25, roughness: 0.5, clearcoat: 0.2 });
  const symbol = new THREE.MeshPhysicalMaterial({ color: 0xE0E5EA, metalness: 0.85, roughness: 0.22, clearcoat: 0.35 });
  const matMap: Array<[THREE.Material, PartCategory]> = [
    [darkFabric, PartCategory.TORSO],
    [darkFabric, PartCategory.SUIT_TORSO],
    [darkFabric, PartCategory.LOWER_BODY],
    [darkFabric, PartCategory.CAPE],
    [boots, PartCategory.BOOTS],
    [gold, PartCategory.BELT],
    [gold, PartCategory.BUCKLE],
    [gold, PartCategory.CHEST_BELT],
    [symbol, PartCategory.SYMBOL],
  ];
  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => { setMaterialOverride(c as PartCategory, m as THREE.Material); api.applyMaterialToPart(m as THREE.Material, c as PartCategory); });

  // Dark variant color accents
  applyColors(api, {
    [PartCategory.TORSO]: 0x17243d,
    [PartCategory.SUIT_TORSO]: 0x17243d,
    [PartCategory.LOWER_BODY]: 0x101a2b,
    [PartCategory.CAPE]: 0x0d1424,
    [PartCategory.HAND_LEFT]: 0x142032,
    [PartCategory.HAND_RIGHT]: 0x142032,
    [PartCategory.BOOTS]: 0x2b3b52,
    [PartCategory.BELT]: 0xC8A13A,
    [PartCategory.BUCKLE]: 0xC8A13A,
    [PartCategory.CHEST_BELT]: 0xC8A13A,
    [PartCategory.SYMBOL]: 0xDDE3E8
  });
};

// New: Alien/Stalker sci‑fi skin based on the provided lighting/material analysis
const createAlienStalker = (api: CharacterViewerRef) => {
  // Reset all previous overrides so this skin fully applies
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  // Strong AO look with a touch more contrast
  setAOIntensity(0.075);

  // Lighting: cold key, stronger red rim, more saturated icy fill
  // lighting moved to Lights panel

  // Materials (slightly more saturated skin and claws)
  const skin = new THREE.MeshPhysicalMaterial({
    color: 0xd6b89c,
    metalness: 0.0,
    roughness: 0.78,
    transmission: 0.1, // a bit more lively
    ior: 1.4,
    thickness: 0.25,
  });
  const claw = new THREE.MeshPhysicalMaterial({
    color: 0xd6b27a,
    metalness: 0.0,
    roughness: 0.45,
    clearcoat: 0.12,
    clearcoatRoughness: 0.38,
  });

  const matMap: Array<[THREE.Material, PartCategory]> = [
    [skin, PartCategory.HEAD],
    [skin, PartCategory.TORSO],
    [skin, PartCategory.SUIT_TORSO],
    [skin, PartCategory.LOWER_BODY],
    [claw, PartCategory.HAND_LEFT],
    [claw, PartCategory.HAND_RIGHT],
  ];
  const cats = matMap.map(([, c]) => c);
  // Do NOT persist overrides so this skin won't carry across poses
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });

  // Add color accents to push vibrancy
  applyColors(api, {
    [PartCategory.HEAD]: 0xd8b79f,
    [PartCategory.TORSO]: 0xd2ae94,
    [PartCategory.SUIT_TORSO]: 0xd2ae94,
    [PartCategory.LOWER_BODY]: 0xcaa48c,
  });
};

// New: X-Men Legend (Marvel Legends style) skin
const createXMenLegend = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.065);


  // Materials per analysis
  const skin = new THREE.MeshPhysicalMaterial({
    color: 0xb07a4e,
    metalness: 0.0,
    roughness: 0.62,
    transmission: 0.05,
    ior: 1.4,
    thickness: 0.2,
  });
  const suitBlue = new THREE.MeshPhysicalMaterial({
    color: 0x1d4c99,
    metalness: 0.0,
    roughness: 0.8,
  });
  const yellowArmor = new THREE.MeshPhysicalMaterial({
    color: 0xe5b348,
    metalness: 0.1,
    roughness: 0.7,
  });
  const blackPoly = new THREE.MeshPhysicalMaterial({
    color: 0x292929,
    metalness: 0.0,
    roughness: 0.78,
  });
  const fx = new THREE.MeshPhysicalMaterial({
    color: 0xff32b7,
    metalness: 0.0,
    roughness: 0.1,
    transmission: 0.8,
    transparent: true,
    opacity: 0.45,
    emissive: new THREE.Color(0xff32b7),
    emissiveIntensity: 2.7,
  } as any);

  const matMap: Array<[THREE.Material, PartCategory]> = [
    // Suit blue on main body
    [suitBlue, PartCategory.TORSO],
    [suitBlue, PartCategory.SUIT_TORSO],
    [suitBlue, PartCategory.LOWER_BODY],
    // Yellow armor accents
    [yellowArmor, PartCategory.BOOTS],
    [yellowArmor, PartCategory.HAND_LEFT],
    [yellowArmor, PartCategory.HAND_RIGHT],
    [yellowArmor, PartCategory.BELT],
    [yellowArmor, PartCategory.BUCKLE],
    [yellowArmor, PartCategory.CHEST_BELT],
    [yellowArmor, PartCategory.POUCH],
    // Skin
    [skin, PartCategory.HEAD],
    // Emblem/FX
    [fx, PartCategory.SYMBOL],
  ];

  // Apply and persist
  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

// New: Magneto Legend (classic comic style)
const createMagnetoLegend = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.07);

  // Lighting: cold key (slightly violet), cool fill, icy rim
  // lighting moved to Lights panel

  // Materials per analysis
  const suitRed = new THREE.MeshPhysicalMaterial({
    color: 0xa22626,
    metalness: 0.0,
    roughness: 0.55,
  });
  const armorPurple = new THREE.MeshPhysicalMaterial({
    color: 0x6046a6,
    metalness: 0.2,
    roughness: 0.25,
  });
  const capePurple = new THREE.MeshPhysicalMaterial({
    color: 0x4a356e,
    metalness: 0.15,
    roughness: 0.35,
  });
  const faceSkin = new THREE.MeshPhysicalMaterial({
    color: 0xdeb9a0,
    metalness: 0.0,
    roughness: 0.6,
    transmission: 0.04,
    ior: 1.4,
    thickness: 0.18,
  });

  const matMap: Array<[THREE.Material, PartCategory]> = [
    // Red suit core
    [suitRed, PartCategory.TORSO],
    [suitRed, PartCategory.SUIT_TORSO],
    [suitRed, PartCategory.LOWER_BODY],
    // Purple armor and accents
    [armorPurple, PartCategory.HAND_LEFT],
    [armorPurple, PartCategory.HAND_RIGHT],
    [armorPurple, PartCategory.BOOTS],
    [armorPurple, PartCategory.BELT],
    [armorPurple, PartCategory.BUCKLE],
    [armorPurple, PartCategory.CHEST_BELT],
    [armorPurple, PartCategory.POUCH],
    // Cape
    [capePurple, PartCategory.CAPE],
    // Skin
    [faceSkin, PartCategory.HEAD],
  ];

  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

// New: Batman Legend (premium statue, gothic/night mood)
const createBatmanLegend = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.075);

  // Lighting: cold key, blue/violet fill, icy rim
  // lighting moved to Lights panel

  // Materials from analysis
  const suitGray = new THREE.MeshPhysicalMaterial({
    color: 0x8b96a9,
    metalness: 0.0,
    roughness: 0.82,
  });
  const deepBlueSatin = new THREE.MeshPhysicalMaterial({
    color: 0x324d6e,
    metalness: 0.13,
    roughness: 0.44,
  });
  const beltYellow = new THREE.MeshPhysicalMaterial({
    color: 0xffd553,
    metalness: 0.0,
    roughness: 0.33,
  });
  const darkMetal = new THREE.MeshPhysicalMaterial({
    color: 0x595a62,
    metalness: 1.0,
    roughness: 0.3,
  });

  // Note: HEAD is treated as cowl+head in this model; we apply deep blue satin
  const matMap: Array<[THREE.Material, PartCategory]> = [
    // Grey suit body
    [suitGray, PartCategory.TORSO],
    [suitGray, PartCategory.SUIT_TORSO],
    [suitGray, PartCategory.LOWER_BODY],
    // Deep blue cape, gloves, boots, cowl
    [deepBlueSatin, PartCategory.CAPE],
    [deepBlueSatin, PartCategory.HAND_LEFT],
    [deepBlueSatin, PartCategory.HAND_RIGHT],
    [deepBlueSatin, PartCategory.BOOTS],
    [deepBlueSatin, PartCategory.HEAD],
    // Belt and pouches
    [beltYellow, PartCategory.BELT],
    [beltYellow, PartCategory.BUCKLE],
    [beltYellow, PartCategory.CHEST_BELT],
    [beltYellow, PartCategory.POUCH],
    // Emblem / accessories
    [darkMetal, PartCategory.SYMBOL],
  ];

  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

// Variant: Batman – Dark Knight (charcoal suit, deeper blacks, higher contrast)
const createBatmanDarkKnight = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.088);

  // lighting moved to Lights panel

  const suitCharcoal = new THREE.MeshPhysicalMaterial({
    color: 0x3a3d44,
    metalness: 0.0,
    roughness: 0.84,
  });
  const blackBlueSatin = new THREE.MeshPhysicalMaterial({
    color: 0x1b2736,
    metalness: 0.12,
    roughness: 0.42,
  });
  const beltMutedGold = new THREE.MeshPhysicalMaterial({
    color: 0xcaa83c,
    metalness: 0.2,
    roughness: 0.4,
  });
  const emblemDarkMetal = new THREE.MeshPhysicalMaterial({
    color: 0x5a5b61,
    metalness: 1.0,
    roughness: 0.28,
  });

  const matMap: Array<[THREE.Material, PartCategory]> = [
    [suitCharcoal, PartCategory.TORSO],
    [suitCharcoal, PartCategory.SUIT_TORSO],
    [suitCharcoal, PartCategory.LOWER_BODY],
    [blackBlueSatin, PartCategory.CAPE],
    [blackBlueSatin, PartCategory.HAND_LEFT],
    [blackBlueSatin, PartCategory.HAND_RIGHT],
    [blackBlueSatin, PartCategory.BOOTS],
    [blackBlueSatin, PartCategory.HEAD],
    [beltMutedGold, PartCategory.BELT],
    [beltMutedGold, PartCategory.BUCKLE],
    [beltMutedGold, PartCategory.CHEST_BELT],
    [beltMutedGold, PartCategory.POUCH],
    [emblemDarkMetal, PartCategory.SYMBOL],
  ];

  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

// Variant: Batman – Blue & Gray Classic (brighter blue, lighter gray)
const createBatmanBlueGrayClassic = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.07);

  // lighting moved to Lights panel

  const suitGrayLight = new THREE.MeshPhysicalMaterial({
    color: 0x9aa4b5,
    metalness: 0.0,
    roughness: 0.8,
  });
  const blueClassic = new THREE.MeshPhysicalMaterial({
    color: 0x3a5fa3,
    metalness: 0.12,
    roughness: 0.38,
  });
  const beltBright = new THREE.MeshPhysicalMaterial({
    color: 0xffd553,
    metalness: 0.0,
    roughness: 0.33,
  });
  const emblemDark = new THREE.MeshPhysicalMaterial({
    color: 0x2a2b2f,
    metalness: 0.9,
    roughness: 0.32,
  });

  const matMap: Array<[THREE.Material, PartCategory]> = [
    [suitGrayLight, PartCategory.TORSO],
    [suitGrayLight, PartCategory.SUIT_TORSO],
    [suitGrayLight, PartCategory.LOWER_BODY],
    [blueClassic, PartCategory.CAPE],
    [blueClassic, PartCategory.HAND_LEFT],
    [blueClassic, PartCategory.HAND_RIGHT],
    [blueClassic, PartCategory.BOOTS],
    [blueClassic, PartCategory.HEAD],
    [beltBright, PartCategory.BELT],
    [beltBright, PartCategory.BUCKLE],
    [beltBright, PartCategory.CHEST_BELT],
    [beltBright, PartCategory.POUCH],
    [emblemDark, PartCategory.SYMBOL],
  ];

  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

// New: Gambit & Rogue – Comic Studio (cool key, cyan fill, magenta rim + FX)
const createGambitRogue = (api: CharacterViewerRef) => {
  // Full reset
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.06);

  // Lighting setup (key/fill/rim)
  // lighting moved to Lights panel

  // Optional FX: magenta point light near hands/cards (no fog by default)
  try {
    const scene = (api as any)?.getScene?.();
    if (scene) {
      const prev = scene.getObjectByName('cardsLight');
      if (prev && prev.parent) { prev.parent.remove(prev); }
      const cardsLight = new THREE.PointLight(0xFF2EB3, 1.4, 3.0);
      cardsLight.name = 'cardsLight';
      cardsLight.position.set(0.6, 1.2, 0.8);
      scene.add(cardsLight);
      // Clear any previous fog that could darken/tint the scene excessively
      if (scene.fog) { (scene as any).fog = null; }
      // Optional: very subtle fog can be enabled by user later if desired
    }
  } catch {}

  // Materials per brief - Enhanced with PBR
  const leatherBrown = new THREE.MeshPhysicalMaterial({
    color: 0x503a2b, // darker
    metalness: 0.0,
    roughness: 0.75, // more matte
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    normalScale: new THREE.Vector2(1.2, 1.2),
    aoMapIntensity: 1.3,
  } as any);
  const spandexGreen = new THREE.MeshPhysicalMaterial({
    color: 0x127c47, // darker
    metalness: 0.02,
    roughness: 0.45, // more matte
    clearcoat: 0.35, // less varnish
    clearcoatRoughness: 0.35,
    sheen: 0.3, // fabric-like sheen
    sheenColor: 0x127c47,
    sheenRoughness: 0.8,
    normalScale: new THREE.Vector2(0.8, 0.8),
    aoMapIntensity: 1.1,
  } as any);
  const spandexYellow = new THREE.MeshPhysicalMaterial({
    color: 0xD4A320, // darker
    metalness: 0.0,
    roughness: 0.52, // more matte
    clearcoat: 0.45,
    clearcoatRoughness: 0.35,
    sheen: 0.25, // fabric-like sheen
    sheenColor: 0xD4A320,
    sheenRoughness: 0.7,
    normalScale: new THREE.Vector2(0.6, 0.6),
    aoMapIntensity: 1.0,
  } as any);
  const purplePanel = new THREE.MeshStandardMaterial({
    color: 0x5f2aa6, // darker, muted
    metalness: 0.1,
    roughness: 0.5,
    aoMapIntensity: 1.0,
  });
  const skin = new THREE.MeshPhysicalMaterial({
    color: 0xC79E8A, // slightly darker
    metalness: 0.0,
    roughness: 0.65, // more matte
    transmission: 0.15, // subsurface scattering simulation
    thickness: 0.3,
    ior: 1.4, // skin IOR
    sheen: 0.4, // natural skin sheen
    sheenColor: 0xfdbcb4,
    sheenRoughness: 0.9,
    clearcoat: 0.08, // very subtle surface
    normalScale: new THREE.Vector2(0.7, 0.7),
    aoMapIntensity: 1.1,
  } as any);
  const metalSmall = new THREE.MeshPhysicalMaterial({
    color: 0xB0BBC2,
    metalness: 0.85, // more metallic
    roughness: 0.35, // smoother
    clearcoat: 0.4,
    clearcoatRoughness: 0.1,
    normalScale: new THREE.Vector2(1.1, 1.1), // subtle scratches
    aoMapIntensity: 1.2,
    ior: 2.4, // metallic IOR
  } as any);
  const fxMagenta = new THREE.MeshPhysicalMaterial({
    color: 0xCC278F, // darker
    metalness: 0.0,
    roughness: 0.25, // smoother for glass-like effect
    transmission: 0.65, // more transparent
    thickness: 1.5, // thicker for better refraction
    ior: 1.35, // slightly higher
    transparent: true,
    opacity: 0.75,
    emissive: new THREE.Color(0xCC278F),
    emissiveIntensity: 1.4, // brighter glow
    clearcoat: 0.8, // glass-like surface
    clearcoatRoughness: 0.05,
    normalScale: new THREE.Vector2(0.3, 0.3), // subtle surface variation
    aoMapIntensity: 0.8, // less AO for glowing effect
  } as any);

  // Map to our categories (approximation for duo theme)
  const matMap: Array<[THREE.Material, PartCategory]> = [
    // Rogue spandex
    [spandexGreen, PartCategory.TORSO],
    [spandexGreen, PartCategory.SUIT_TORSO],
    [spandexYellow, PartCategory.LOWER_BODY],
    [spandexYellow, PartCategory.BOOTS],
    [spandexYellow, PartCategory.HAND_LEFT],
    [spandexYellow, PartCategory.HAND_RIGHT],
    // Gambit accents
    [leatherBrown, PartCategory.CAPE], // coat/chaqueta mapped to cape where available
    [purplePanel, PartCategory.BELT],
    // Common
    [skin, PartCategory.HEAD],
    [metalSmall, PartCategory.BUCKLE],
    [metalSmall, PartCategory.CHEST_BELT],
    [leatherBrown, PartCategory.POUCH],
    // FX / emblem
    [fxMagenta, PartCategory.SYMBOL],
  ];

  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

// New: Emerald Champion (green metallic hero suit)
const createEmeraldChampion = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.06);

  // Lighting preset: cold key, soft blue fill, cool rim
  // lighting moved to Lights panel

  // Materials
  const suitGreen = new THREE.MeshPhysicalMaterial({
    color: 0x2b775e,
    metalness: 1.0,
    roughness: 0.19,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
  });
  const blackSuit = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    metalness: 0.0,
    roughness: 0.7,
  });
  const faceSkin = new THREE.MeshPhysicalMaterial({
    color: 0xf0d2b5,
    metalness: 0.0,
    roughness: 0.6,
    transmission: 0.05,
    ior: 1.4,
    thickness: 0.2,
  });
  const emblem = new THREE.MeshPhysicalMaterial({
    color: 0x47ff8b,
    metalness: 1.0,
    roughness: 0.13,
    emissive: new THREE.Color(0x47ff8b),
    emissiveIntensity: 1.8,
  } as any);

  const matMap: Array<[THREE.Material, PartCategory]> = [
    [suitGreen, PartCategory.TORSO],
    [suitGreen, PartCategory.SUIT_TORSO],
    [blackSuit, PartCategory.LOWER_BODY],
    [blackSuit, PartCategory.BOOTS],
    [blackSuit, PartCategory.HAND_LEFT],
    [blackSuit, PartCategory.HAND_RIGHT],
    [faceSkin, PartCategory.HEAD],
    [emblem, PartCategory.SYMBOL],
  ];
  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

// Miniature Painting Skin Functions
const createCitadelStyle = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.08); // Citadel wash intensity
  
  // Citadel-style materials with strong recess shading
  const armorMetal = new THREE.MeshPhysicalMaterial({
    color: 0x8A9BA8, // Leadbelcher base
    metalness: 0.9,
    roughness: 0.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    normalScale: new THREE.Vector2(1.5, 1.5), // Strong edge definition
    aoMapIntensity: 1.8, // Heavy recess shading
  } as any);
  
  const clothRed = new THREE.MeshPhysicalMaterial({
    color: 0x8B1A1A, // Khorne Red base
    metalness: 0.0,
    roughness: 0.7,
    sheen: 0.2,
    sheenColor: 0xB22222, // Brighter edges
    sheenRoughness: 0.8,
    normalScale: new THREE.Vector2(1.2, 1.2),
    aoMapIntensity: 2.0, // Deep fabric recesses
  } as any);
  
  const gold = new THREE.MeshPhysicalMaterial({
    color: 0xDAA520, // Retributor Armor base
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 0.7,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color(0x332200),
    emissiveIntensity: 0.1, // Subtle glow on edges
    normalScale: new THREE.Vector2(1.3, 1.3),
    aoMapIntensity: 1.5,
  } as any);
  
  const matMap: Array<[THREE.Material, PartCategory]> = [
    [armorMetal, PartCategory.HEAD],
    [armorMetal, PartCategory.HAND_LEFT],
    [armorMetal, PartCategory.HAND_RIGHT],
    [clothRed, PartCategory.TORSO],
    [clothRed, PartCategory.SUIT_TORSO],
    [clothRed, PartCategory.LOWER_BODY],
    [armorMetal, PartCategory.BOOTS],
    [gold, PartCategory.BELT],
    [gold, PartCategory.BUCKLE],
    [gold, PartCategory.SYMBOL],
  ];
  
  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

const createVallejo = (api: CharacterViewerRef) => {
  clearMaterialOverrides();
  clearColorOverrides();
  resetAllCategoriesToNeutral(api);
  setAOIntensity(0.15); // Strong Vallejo wash
  
  // Vallejo Model Color style with heavy contrast
  const camoGreen = new THREE.MeshPhysicalMaterial({
    color: 0x4A5D23, // Reflective Green base
    metalness: 0.0,
    roughness: 0.6,
    sheen: 0.4, // Paint sheen
    sheenColor: 0x7A8A4A, // Highlighted edges
    sheenRoughness: 0.7,
    normalScale: new THREE.Vector2(1.8, 1.8), // Maximum detail
    aoMapIntensity: 2.2, // Very dark recesses
  } as any);
  
  const leatherBrown = new THREE.MeshPhysicalMaterial({
    color: 0x3D2914, // Burnt Umber base
    metalness: 0.0,
    roughness: 0.8,
    clearcoat: 0.1,
    normalScale: new THREE.Vector2(2.0, 2.0), // Heavy texture
    aoMapIntensity: 2.5, // Deep leather creases
  } as any);
  
  const gunMetal = new THREE.MeshPhysicalMaterial({
    color: 0x2C3539, // Gun Metal base
    metalness: 0.95,
    roughness: 0.4,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
    normalScale: new THREE.Vector2(1.6, 1.6),
    aoMapIntensity: 1.8,
  } as any);
  
  const matMap: Array<[THREE.Material, PartCategory]> = [
    [gunMetal, PartCategory.HEAD],
    [gunMetal, PartCategory.HAND_LEFT],
    [gunMetal, PartCategory.HAND_RIGHT],
    [camoGreen, PartCategory.TORSO],
    [camoGreen, PartCategory.SUIT_TORSO],
    [camoGreen, PartCategory.LOWER_BODY],
    [leatherBrown, PartCategory.BOOTS],
    [leatherBrown, PartCategory.BELT],
    [gunMetal, PartCategory.BUCKLE],
    [gunMetal, PartCategory.SYMBOL],
  ];
  
  const cats = matMap.map(([, c]) => c);
  clearMaterialOverrides(cats);
  clearColorOverrides(cats);
  matMap.forEach(([m, c]) => {
    setMaterialOverride(c as PartCategory, m as THREE.Material);
    api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
  });
};

const SKINS: SkinPreset[] = [
  {
    id: 'citadel-miniature',
    name: '🛡️ Citadel Miniature',
    description: 'Games Workshop style with strong recess shading and edge highlights',
    build: createCitadelStyle,
  },
  {
    id: 'vallejo-military',
    name: '🎨 Vallejo Military',
    description: 'Model Color style with maximum contrast and heavy weathering',
    build: createVallejo,
  },
  {
    id: 'cosmic-warrior',
    name: 'Cosmic Warrior',
    description: 'Cinematic gold armor with deep navy suit',
    build: createCosmicWarrior,
  },
  {
    id: 'cosmic-warrior-dark',
    name: 'Cosmic Warrior – Dark',
    description: 'Darker suit with strong rim light',
    build: createCosmicWarriorDark,
  },
  {
    id: 'tech-neon',
    name: 'Tech Neon',
    description: 'Teal/purple neon accent with chrome symbol',
    build: (api) => {
      // Reset all previous overrides so this skin fully applies
      clearMaterialOverrides();
      clearColorOverrides();
      resetAllCategoriesToNeutral(api);
      setAOIntensity(0.04);
      // lighting moved to Lights panel
      const suit = new THREE.MeshPhysicalMaterial({ 
        color: 0x0fb9b1, 
        roughness: 0.35, 
        metalness: 0.2, 
        clearcoat: 0.6,
        clearcoatRoughness: 0.1,
        emissive: new THREE.Color(0x0fb9b1),
        emissiveIntensity: 0.15, // subtle glow
        normalScale: new THREE.Vector2(0.8, 0.8),
        aoMapIntensity: 1.0,
      } as any);
      const chrome = new THREE.MeshPhysicalMaterial({ 
        color: 0xf0f0f0, 
        roughness: 0.02, 
        metalness: 1.0, 
        clearcoat: 0.95,
        clearcoatRoughness: 0.01,
        ior: 2.8, // high metallic IOR
        normalScale: new THREE.Vector2(0.5, 0.5), // polished surface
        aoMapIntensity: 0.8,
      } as any);
      const boots = new THREE.MeshPhysicalMaterial({ 
        color: 0x4c2a85, 
        roughness: 0.25, 
        metalness: 0.5, 
        clearcoat: 0.5,
        clearcoatRoughness: 0.15,
        emissive: new THREE.Color(0x4c2a85),
        emissiveIntensity: 0.1,
        normalScale: new THREE.Vector2(1.0, 1.0),
        aoMapIntensity: 1.1,
      } as any);
      const matMap: Array<[THREE.Material, PartCategory]> = [
        [suit, PartCategory.TORSO], [suit, PartCategory.SUIT_TORSO], [suit, PartCategory.LOWER_BODY], [suit, PartCategory.CAPE],
        [boots, PartCategory.BOOTS], [chrome, PartCategory.SYMBOL], [chrome, PartCategory.BELT], [chrome, PartCategory.BUCKLE]
      ];
      const cats = matMap.map(([, c]) => c);
      clearMaterialOverrides(cats);
      clearColorOverrides(cats);
      matMap.forEach(([m, c]) => {
        setMaterialOverride(c as PartCategory, m as THREE.Material);
        api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
      });
    },
  },
  {
    id: 'moebius-toon',
    name: '🎨 Moebius Comic',
    description: 'NPR/Toon shader estilo Moebius con colores planos y contornos. Usar con "Moebius Comic Studio" en Luces.',
    build: (api) => {
      createMoebiusToonSkin(api);
    },
  },
  {
    id: 'manga-high-contrast',
    name: '📚 Manga High Contrast',
    description: 'Shader toon con alto contraste estilo manga. Usar con "Manga High Contrast" en Luces.',
    build: (api) => {
      createMangaHighContrastSkin(api);
    },
  },
  {
    id: 'cartoon-bright',
    name: '🎭 Cartoon Bright',
    description: 'Shader toon brillante para estilo cartoon. Usar con "Cartoon Bright" en Luces.',
    build: (api) => {
      createCartoonBrightSkin(api);
    },
  },
  {
    id: 'comic-grain',
    name: '📰 Comic Grain',
    description: 'Estilo cómic con granulado y alto contraste. Usar con "Comic Cell Shading" en Luces.',
    build: (api) => {
      createComicGrainSkin(api);
    },
  },
  {
    id: 'captain-america-sideshow',
    name: 'Captain America – Sideshow',
    description: 'Materials for Cap suit and shield. Apply lights via "Captain America – Sideshow" in Lights tab.',
    build: (api) => {
      createCaptainAmericaSkin(api);
    },
  },
  {
    id: 'spider-man-sideshow',
    name: 'Spider‑Man – Sideshow',
    description: 'Materials for Spider‑Man suit and base tone. Apply lights via “Spider‑Man – Sideshow” in Lights tab.',
    build: (api) => {
      createSpiderManSkin(api);
    },
  },
  {
    id: 'alien-stalker',
    name: 'Alien Stalker',
    description: 'Cold key + red rim, organic skin and claws',
    build: createAlienStalker,
  },
  {
    id: 'xmen-legend',
    name: 'X‑Men Legend',
    description: 'Warm key, fuchsia fill, cyan rim; blue suit with yellow armor accents',
    build: createXMenLegend,
  },
  {
    id: 'magneto-legend',
    name: 'Magneto Legend',
    description: 'Red suit, purple armor/cape; cold key, blue fill, icy rim',
    build: createMagnetoLegend,
  },
  {
    id: 'batman-legend',
    name: 'Batman Legend',
    description: 'Grey suit, deep-blue cape/gloves/boots; cold key, blue fill, icy rim',
    build: createBatmanLegend,
  },
  {
    id: 'batman-dark-knight',
    name: 'Batman – Dark Knight',
    description: 'Charcoal suit, deeper blacks, higher AO; high-contrast rim',
    build: createBatmanDarkKnight,
  },
  {
    id: 'batman-blue-gray-classic',
    name: 'Batman – Blue & Gray Classic',
    description: 'Lighter gray suit, classic brighter bluecape; Gotham blue fill',
    build: createBatmanBlueGrayClassic,
  },
  {
    id: 'xmen-legend-classic',
    name: 'X‑Men Legend – Classic',
    description: 'Darker blue suit, warmer yellow accents, shinier gloves/boots',
    build: (api) => {
      clearMaterialOverrides();
      clearColorOverrides();
      resetAllCategoriesToNeutral(api);
      setAOIntensity(0.07);


      const skin = new THREE.MeshPhysicalMaterial({ color: 0xa56f46, metalness: 0.0, roughness: 0.6, transmission: 0.05, ior: 1.4, thickness: 0.2 });
      const suitBlueDark = new THREE.MeshPhysicalMaterial({ color: 0x153a7a, metalness: 0.0, roughness: 0.78 });
      const yellowWarm = new THREE.MeshPhysicalMaterial({ color: 0xf2c14e, metalness: 0.12, roughness: 0.65 });
      const yellowShiny = new THREE.MeshPhysicalMaterial({ color: 0xf2c14e, metalness: 0.15, roughness: 0.4, clearcoat: 0.25, clearcoatRoughness: 0.2 });
      const emblemFx = new THREE.MeshPhysicalMaterial({
        color: 0xff32b7,
        metalness: 0.0,
        roughness: 0.1,
        transmission: 0.75,
        transparent: true,
        opacity: 0.5,
        emissive: new THREE.Color(0xff32b7),
        emissiveIntensity: 2.8,
      } as any);

      const matMap: Array<[THREE.Material, PartCategory]> = [
        [suitBlueDark, PartCategory.TORSO],
        [suitBlueDark, PartCategory.SUIT_TORSO],
        [suitBlueDark, PartCategory.LOWER_BODY],
        [yellowShiny, PartCategory.HAND_LEFT],
        [yellowShiny, PartCategory.HAND_RIGHT],
        [yellowShiny, PartCategory.BOOTS],
        [yellowWarm, PartCategory.BELT],
        [yellowWarm, PartCategory.BUCKLE],
        [yellowWarm, PartCategory.CHEST_BELT],
        [yellowWarm, PartCategory.POUCH],
        [skin, PartCategory.HEAD],
        [emblemFx, PartCategory.SYMBOL],
      ];

      const cats = matMap.map(([, c]) => c);
      clearMaterialOverrides(cats);
      clearColorOverrides(cats);
      matMap.forEach(([m, c]) => { setMaterialOverride(c as PartCategory, m as THREE.Material); api.applyMaterialToPart(m as THREE.Material, c as PartCategory); });
    }
  },
  {
    id: 'emerald-champion',
    name: 'Emerald Champion',
    description: 'Green metallic suit with heroic studio lights',
    build: createEmeraldChampion,
  },
  {
    id: 'gambit-rogue',
    name: 'Gambit & Rogue – Comic Studio',
    description: 'Cool key, cyan fill, magenta rim; green/yellow spandex + leather coat and magenta FX',
    build: createGambitRogue,
  },
  {
    id: 'colossus-studio-metal',
    name: 'Colossus – Studio Metal',
    description: 'Neutral key, cyan fill, cold blue rim; chrome skin with red/yellow suit',
    build: (api) => {
      // No persist; scene-only application
      clearMaterialOverrides();
      clearColorOverrides();
      resetAllCategoriesToNeutral(api);
      setAOIntensity(0.065);

      // Lighting preset only (coordinated with global lights manager)
      try {
        const preset = findLightingPresetByName('Colossus – Studio Metal');
        if (preset) {
          api.applyLightingPreset(preset);
        }
      } catch {}

      // Materials (scene-only) - Enhanced PBR
      const metalSkin = new THREE.MeshPhysicalMaterial({
        color: 0xC0C5CC, // brighter chrome
        metalness: 1.0,
        roughness: 0.15, // more polished
        clearcoat: 0.95,
        clearcoatRoughness: 0.05,
        ior: 2.8, // chrome IOR
        normalScale: new THREE.Vector2(0.7, 0.7), // subtle brushed texture
        aoMapIntensity: 0.9, // less AO for reflective surface
      } as any);
      const redSuit = new THREE.MeshPhysicalMaterial({
        color: 0x8A2828,
        metalness: 0.1,
        roughness: 0.45,
        sheen: 0.4, // fabric-like sheen
        sheenColor: 0x8A2828,
        sheenRoughness: 0.7,
        normalScale: new THREE.Vector2(0.8, 0.8),
        aoMapIntensity: 1.1,
      } as any);
      const yellowSuit = new THREE.MeshPhysicalMaterial({
        color: 0xF6A623,
        metalness: 0.0,
        roughness: 0.3,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        sheen: 0.3,
        sheenColor: 0xF6A623,
        sheenRoughness: 0.6,
        normalScale: new THREE.Vector2(0.6, 0.6),
        aoMapIntensity: 1.0,
      } as any);
      const belt = new THREE.MeshStandardMaterial({
        color: 0x3B2415,
        metalness: 0.0,
        roughness: 0.6,
      });
      const buckle = new THREE.MeshStandardMaterial({
        color: 0xC9A448,
        metalness: 1.0,
        roughness: 0.3,
      });

      const matMap: Array<[THREE.Material, PartCategory]> = [
        [metalSkin, PartCategory.HEAD],
        [metalSkin, PartCategory.HAND_LEFT],
        [metalSkin, PartCategory.HAND_RIGHT],
        [redSuit, PartCategory.TORSO],
        [redSuit, PartCategory.SUIT_TORSO],
        [redSuit, PartCategory.LOWER_BODY],
        [yellowSuit, PartCategory.SHOULDERS],
        [yellowSuit, PartCategory.FOREARMS],
        [yellowSuit, PartCategory.BOOTS],
        [belt, PartCategory.BELT],
        [buckle, PartCategory.BUCKLE],
        [buckle, PartCategory.SYMBOL],
      ];
      const cats = matMap.map(([, c]) => c);
      clearMaterialOverrides(cats);
      clearColorOverrides(cats);
      // Persist overrides so materials are saved with pose snapshots
      matMap.forEach(([m, c]) => {
        setMaterialOverride(c as PartCategory, m as THREE.Material);
        api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
      });
    }
  },
  {
    id: 'hulk-warm-studio',
    name: 'Hulk – Warm Studio',
    description: 'Warm key, teal fill, warm rim; olive skin with purple pants',
    build: (api) => {
      // Reset (scene-only categories first)
      clearMaterialOverrides();
      clearColorOverrides();
      resetAllCategoriesToNeutral(api);
      setAOIntensity(0.07);

      // Apply lighting via preset (menu de luces)
      try {
        const preset = findLightingPresetByName('Hulk – Warm Studio');
        if (preset) {
          api.applyLightingPreset(preset);
        }
      } catch {}

      // Materials PBR
      const skinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x5A8C54,
        metalness: 0.0,
        roughness: 0.4,
        clearcoat: 0.1,
        clearcoatRoughness: 0.4,
        aoMapIntensity: 1.0,
      });
      const pantsMaterial = new THREE.MeshStandardMaterial({
        color: 0x3E205B,
        metalness: 0.0,
        roughness: 0.6,
      });

      const matMap: Array<[THREE.Material, PartCategory]> = [
        [skinMaterial, PartCategory.HEAD],
        [skinMaterial, PartCategory.TORSO],
        [skinMaterial, PartCategory.SUIT_TORSO],
        [skinMaterial, PartCategory.LOWER_BODY],
        [skinMaterial, PartCategory.HAND_LEFT],
        [skinMaterial, PartCategory.HAND_RIGHT],
        [pantsMaterial, PartCategory.BOOTS], // fallback si pantalones están mapeados a boots/legs
      ];
      const cats = matMap.map(([, c]) => c);
      clearMaterialOverrides(cats);
      clearColorOverrides(cats);
      // Persist materials to override store so poses guardan materiales
      matMap.forEach(([m, c]) => {
        setMaterialOverride(c as PartCategory, m as THREE.Material);
        api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
      });
    }
  },
  {
    id: 'captain-marvel-gallery',
    name: 'Captain Marvel – Gallery',
    description: 'Cinematic suit with gold accents; gallery lighting',
    build: (api) => {
      clearMaterialOverrides();
      clearColorOverrides();
      resetAllCategoriesToNeutral(api);
      setAOIntensity(0.06);

      // Lighting only via preset (menu de luces)
      try {
        const preset = findLightingPresetByName('Captain Marvel – Gallery');
        if (preset) {
          api.applyLightingPreset(preset);
        }
      } catch {}

      // Materials
      const blueSuit = new THREE.MeshPhysicalMaterial({
        color: 0x1C3E74,
        metalness: 0.1,
        roughness: 0.4,
        clearcoat: 0.15,
        clearcoatRoughness: 0.3,
      });
      const redSuit = new THREE.MeshPhysicalMaterial({
        color: 0x8B1F28,
        metalness: 0.1,
        roughness: 0.42,
        clearcoat: 0.15,
        clearcoatRoughness: 0.3,
      });
      const gold = new THREE.MeshStandardMaterial({
        color: 0xD4A84F,
        metalness: 1.0,
        roughness: 0.25,
      });
      const skin = new THREE.MeshPhysicalMaterial({
        color: 0xD9B49B,
        metalness: 0.0,
        roughness: 0.45,
        thickness: 0.25,
        transmission: 0.05,
        ior: 1.4,
      });
      const hair = new THREE.MeshStandardMaterial({
        color: 0xC9A86F,
        metalness: 0.0,
        roughness: 0.45,
      });

      const matMap: Array<[THREE.Material, PartCategory]> = [
        [blueSuit, PartCategory.TORSO],
        [blueSuit, PartCategory.SUIT_TORSO],
        [blueSuit, PartCategory.LOWER_BODY],
        [redSuit, PartCategory.HAND_LEFT],
        [redSuit, PartCategory.HAND_RIGHT],
        [redSuit, PartCategory.BOOTS],
        [gold, PartCategory.BELT],
        [gold, PartCategory.BUCKLE],
        [gold, PartCategory.SYMBOL],
        [skin, PartCategory.HEAD],
      ];
      const cats = matMap.map(([, c]) => c);
      clearMaterialOverrides(cats);
      clearColorOverrides(cats);
      // Persist para que se guarde con las poses
      matMap.forEach(([m, c]) => {
        setMaterialOverride(c as PartCategory, m as THREE.Material);
        api.applyMaterialToPart(m as THREE.Material, c as PartCategory);
      });
    }
  },
  {
    id: 'classic-hero',
    name: 'Classic Hero',
    description: 'Primary colors and warm studio lights',
    build: (api) => {
      // Reset all previous overrides so this skin fully applies
      clearMaterialOverrides();
      clearColorOverrides();
      resetAllCategoriesToNeutral(api);
      // lighting moved to Lights panel
      const red = new THREE.MeshPhysicalMaterial({ color: 0xc1121f, roughness: 0.55, metalness: 0.1, clearcoat: 0.3 });
      const blue = new THREE.MeshPhysicalMaterial({ color: 0x0047ab, roughness: 0.6, metalness: 0.05, clearcoat: 0.2 });
      const gold = new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 1.0, roughness: 0.28, clearcoat: 0.5 });
      const matMap: Array<[THREE.Material, PartCategory]> = [[blue, PartCategory.TORSO], [blue, PartCategory.LOWER_BODY], [red, PartCategory.CAPE], [gold, PartCategory.BELT], [gold, PartCategory.BUCKLE], [gold, PartCategory.SYMBOL]];
      const cats = matMap.map(([, c]) => c);
      clearMaterialOverrides(cats);
      clearColorOverrides(cats);
      matMap.forEach(([m,c]) => { setMaterialOverride(c as PartCategory, m as THREE.Material); api.applyMaterialToPart(m as THREE.Material, c as PartCategory); });
    }
  }
];

// ─── SKIN CATEGORIES for grouping ─────────────────────────────────────────
const SKIN_CATEGORIES: { label: string; ids: string[] }[] = [
  { label: '🎨 COMIC / TOON', ids: ['moebius-toon', 'manga-high-contrast', 'cartoon-bright', 'comic-grain'] },
  { label: '🦸 LEGENDS', ids: ['xmen-legend', 'xmen-legend-classic', 'magneto-legend', 'captain-america-sideshow', 'spider-man-sideshow', 'batman-legend', 'batman-dark-knight', 'batman-blue-gray-classic', 'gambit-rogue', 'colossus-studio-metal', 'classic-hero', 'hulk-warm-studio', 'captain-marvel-gallery'] },
  { label: '⚙️ SCI-FI / SPECIAL', ids: ['cosmic-warrior', 'cosmic-warrior-dark', 'tech-neon', 'alien-stalker', 'emerald-champion'] },
  { label: '🖌️ MINIATURE PAINT', ids: ['citadel-miniature', 'vallejo-military'] },
];

interface SkinsPanelProps {
  apiRef: React.RefObject<CharacterViewerRef | null>;
  onClose?: () => void;
}

const SkinsPanel: React.FC<SkinsPanelProps> = ({ apiRef, onClose }) => {
  const { lang } = useLang();
  const [activeSkinId, setActiveSkinId] = React.useState<string>('');

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('__activeSkinId');
      if (saved) setActiveSkinId(saved);
    } catch {}
  }, []);

  const applySkin = (skin: SkinPreset) => {
    if (!apiRef.current) return;
    skin.build(apiRef.current);
    setActiveSkinId(skin.id);
    try { localStorage.setItem('__activeSkinId', skin.id); } catch {}
  };

  const skinById = (id: string) => SKINS.find(s => s.id === id);
  const activeSkin = SKINS.find(s => s.id === activeSkinId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="panel-header">
        <span>{t('skins.header', lang)}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-comic)', fontSize: 18, color: '#000', opacity: 0.6 }}>✕</button>
      </div>

      {/* Active skin indicator */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: 'var(--color-text-faint)', fontFamily: 'var(--font-comic)', letterSpacing: 1 }}>{t('skins.active', lang)}</span>
        <span style={{ fontSize: 12, color: activeSkin ? 'var(--color-accent)' : 'var(--color-text-muted)', fontFamily: 'var(--font-comic)', letterSpacing: 1 }}>
          {activeSkin ? activeSkin.name : t('skins.none', lang)}
        </span>
      </div>

      {/* Skin list grouped by category */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {SKIN_CATEGORIES.map(({ label, ids }) => {
          const skins = ids.map(skinById).filter(Boolean) as SkinPreset[];
          if (skins.length === 0) return null;
          return (
            <div key={label} style={{ marginBottom: 12 }}>
              {/* Category header */}
              <div style={{ fontFamily: 'var(--font-comic)', fontSize: 11, letterSpacing: 2, color: 'var(--color-accent)', padding: '4px 6px', marginBottom: 4, borderBottom: '1px solid var(--color-border)' }}>
                {label}
              </div>
              {/* Skin cards */}
              {skins.map((skin) => {
                const isActive = activeSkinId === skin.id;
                return (
                  <div key={skin.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 10px', marginBottom: 4,
                    background: isActive ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                    border: isActive ? '2px solid var(--color-accent)' : '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius)',
                    transition: 'border-color 0.1s',
                  }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                      <div style={{ fontFamily: 'var(--font-comic)', fontSize: 12, letterSpacing: 1, color: isActive ? 'var(--color-accent)' : 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {skin.name}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-faint)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {skin.description}
                      </div>
                    </div>
                    <button
                      onClick={() => applySkin(skin)}
                      className={isActive ? 'btn-comic btn-primary' : 'btn-comic btn-outline'}
                      style={{ fontSize: 10, padding: '4px 10px', flexShrink: 0 }}
                    >
                      {isActive ? t('skins.active_btn', lang) : t('skins.apply', lang)}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkinsPanel;
