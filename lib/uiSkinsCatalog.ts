// Catalog of UI skins available for purchase/application
// This is purely UI/UX theming metadata and does not change any core logic

export type UiSkinCatalogItem = {
  id: string; // unique id, also used in CSS class name: theme-<id>
  name: string;
  description: string;
  priceUSD: number;
  previewUrl: string;
};

export const UI_SKINS_CATALOG: UiSkinCatalogItem[] = [
  {
    id: 'neon-hud',
    name: 'Neon HUD',
    description: 'Futuristic neon palette with glassmorphism and glow accents',
    priceUSD: 4.99,
    previewUrl: '/assets/ui/skins/neon-hud.webp',
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    description: '80s retro-futuristic vibes with purple/pink gradients',
    priceUSD: 3.99,
    previewUrl: '/assets/ui/skins/synthwave.webp',
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Ultra-clean, high-contrast minimal look',
    priceUSD: 2.99,
    previewUrl: '/assets/ui/skins/minimal-dark.webp',
  },
];





