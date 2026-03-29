import { ArchetypeId, Part, PartCategory } from '../../types';

export const STRONG_BELT_PARTS: Part[] = [
  {
    id: 'strong_belt_01',
    name: 'Strong Belt Alpha',
    category: PartCategory.BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/belt/strong_belt_01.glb',
    priceUSD: 0.3,
    compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03', 'strong_torso_04', 'strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_belt_01/100/100',
  },
  {
    id: 'strong_belt_02',
    name: 'Strong Belt Beta',
    category: PartCategory.BELT,
    archetype: ArchetypeId.STRONG,
    gltfPath: 'assets/strong/belt/strong_belt_02.glb',
    priceUSD: 0.35,
    compatible: ['strong_torso_01', 'strong_torso_02', 'strong_torso_03', 'strong_torso_04', 'strong_torso_05'],
    thumbnail: 'https://picsum.photos/seed/strong_belt_02/100/100',
  },
]; 