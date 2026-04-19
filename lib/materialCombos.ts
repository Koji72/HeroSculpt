import * as THREE from 'three';

export type SerializedMaterial = {
  type: 'MeshPhysicalMaterial' | 'MeshStandardMaterial' | 'Material';
  color?: number;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  ior?: number;
  sheen?: number;
  sheenColor?: number;
  sheenRoughness?: number;
  emissive?: number;
  emissiveIntensity?: number;
};

export type MaterialCombo = {
  id: string;
  name: string;
  createdAt: number;
  materials: Record<string, SerializedMaterial>; // by category
  colors: Record<string, number>; // by category
};

const STORAGE_KEY = 'material-combinations';

export function serializeMaterial(material: THREE.Material): SerializedMaterial {
  const anyMat = material as THREE.MeshPhysicalMaterial & THREE.MeshStandardMaterial; // THREE.js extended props
  const type = anyMat?.constructor?.name as SerializedMaterial['type'];
  const serializeColor = (c: { getHex?: () => number } | null | undefined) =>
    c && typeof c.getHex === 'function' ? c.getHex() : undefined;
  return {
    type: type === 'MeshPhysicalMaterial' || type === 'MeshStandardMaterial' ? type : 'Material',
    color: serializeColor(anyMat?.color),
    roughness: isFinite(anyMat?.roughness) ? anyMat.roughness : undefined,
    metalness: isFinite(anyMat?.metalness) ? anyMat.metalness : undefined,
    clearcoat: isFinite(anyMat?.clearcoat) ? anyMat.clearcoat : undefined,
    clearcoatRoughness: isFinite(anyMat?.clearcoatRoughness) ? anyMat.clearcoatRoughness : undefined,
    transmission: isFinite(anyMat?.transmission) ? anyMat.transmission : undefined,
    ior: isFinite(anyMat?.ior) ? anyMat.ior : undefined,
    sheen: isFinite(anyMat?.sheen) ? anyMat.sheen : undefined,
    sheenColor: serializeColor(anyMat?.sheenColor),
    sheenRoughness: isFinite(anyMat?.sheenRoughness) ? anyMat.sheenRoughness : undefined,
    emissive: serializeColor(anyMat?.emissive),
    emissiveIntensity: isFinite(anyMat?.emissiveIntensity) ? anyMat.emissiveIntensity : undefined,
  };
}

export function deserializeMaterial(sm: SerializedMaterial): THREE.Material {
  const base = sm.type === 'MeshStandardMaterial'
    ? new THREE.MeshStandardMaterial()
    : sm.type === 'MeshPhysicalMaterial'
      ? new THREE.MeshPhysicalMaterial()
      : new THREE.MeshStandardMaterial();
  const anyMat = base as THREE.MeshPhysicalMaterial & THREE.MeshStandardMaterial; // THREE.js extended props
  if (typeof sm.color === 'number') anyMat.color = new THREE.Color(sm.color);
  if (typeof sm.roughness === 'number') anyMat.roughness = sm.roughness;
  if (typeof sm.metalness === 'number') anyMat.metalness = sm.metalness;
  if (typeof sm.clearcoat === 'number') anyMat.clearcoat = sm.clearcoat;
  if (typeof sm.clearcoatRoughness === 'number') anyMat.clearcoatRoughness = sm.clearcoatRoughness;
  if (typeof sm.transmission === 'number') anyMat.transmission = sm.transmission;
  if (typeof sm.ior === 'number') anyMat.ior = sm.ior;
  if (typeof sm.sheen === 'number') anyMat.sheen = sm.sheen;
  if (typeof sm.sheenColor === 'number') anyMat.sheenColor = new THREE.Color(sm.sheenColor);
  if (typeof sm.sheenRoughness === 'number') anyMat.sheenRoughness = sm.sheenRoughness;
  if (typeof sm.emissive === 'number') anyMat.emissive = new THREE.Color(sm.emissive);
  if (typeof sm.emissiveIntensity === 'number') anyMat.emissiveIntensity = sm.emissiveIntensity;
  return base;
}

export function saveMaterialCombo(name: string, materialsByCategory: Record<string, THREE.Material>, colorsByCategory: Record<string, number>): MaterialCombo {
  const combo: MaterialCombo = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    createdAt: Date.now(),
    materials: Object.fromEntries(Object.entries(materialsByCategory).map(([cat, mat]) => [cat, serializeMaterial(mat)])),
    colors: { ...colorsByCategory },
  };
  const list = listMaterialCombos();
  list.push(combo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return combo;
}

export function listMaterialCombos(): MaterialCombo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MaterialCombo[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function deleteMaterialCombo(id: string): void {
  const list = listMaterialCombos().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function loadMaterialCombo(id: string): { materials: Record<string, THREE.Material>; colors: Record<string, number> } | null {
  const combo = listMaterialCombos().find((c) => c.id === id);
  if (!combo) return null;
  const materials: Record<string, THREE.Material> = {};
  for (const [cat, sm] of Object.entries(combo.materials)) {
    materials[cat] = deserializeMaterial(sm);
  }
  return { materials, colors: { ...combo.colors } };
}

export function exportAllMaterialCombos(pretty: boolean = true): string {
  const list = listMaterialCombos();
  return JSON.stringify(list, null, pretty ? 2 : 0);
}

export function exportMaterialCombo(id: string, pretty: boolean = true): string | null {
  const combo = listMaterialCombos().find((c) => c.id === id);
  if (!combo) return null;
  return JSON.stringify(combo, null, pretty ? 2 : 0);
}

export function importMaterialCombos(json: string, mode: 'merge' | 'replace' = 'merge'): number {
  try {
    const parsed = JSON.parse(json);
    const incoming: MaterialCombo[] = Array.isArray(parsed) ? parsed : [parsed];
    const valid = incoming.filter((c) => c && typeof c.id === 'string' && typeof c.name === 'string' && c.materials && c.colors);
    if (mode === 'replace') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      return valid.length;
    }
    // merge
    const byId = new Map<string, MaterialCombo>();
    for (const c of listMaterialCombos()) byId.set(c.id, c);
    for (const c of valid) byId.set(c.id, c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(byId.values())));
    return valid.length;
  } catch {
    return 0;
  }
}


