import { ArchetypeId, Part, PartCategory } from '../../types';

export const STRONG_POUCH_PARTS: Part[] = [
  {
    id: 'strong_pouch_01',
    name: 'Strong Pouch Alpha',
    category: PartCategory.POUCH,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/pouch/strong_pouch_01.glb',
    priceUSD: 0.25,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_pouch_01/100/100',
  },
  {
    id: 'strong_pouch_02',
    name: 'Strong Pouch Beta',
    category: PartCategory.POUCH,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/pouch/strong_pouch_02.glb',
    priceUSD: 0.3,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_pouch_02/100/100',
  },
  {
    id: 'strong_pouch_03',
    name: 'Strong Pouch Gamma',
    category: PartCategory.POUCH,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/pouch/strong_pouch_03.glb',
    priceUSD: 0.35,
    compatible: [],
    thumbnail: 'https://picsum.photos/seed/strong_pouch_03/100/100',
  },
]; 