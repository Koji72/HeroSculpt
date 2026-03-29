// Exportar todos los componentes de hojas RPG
export { default as BaseCharacterSheet } from './BaseCharacterSheet';
export { default as MutantsAndMastermindsSheet } from './MutantsAndMastermindsSheet';
export { default as ChampionsSheet } from './ChampionsSheet';
export { default as RPGCharacterSheetManager } from './RPGCharacterSheetManager';

// Exportar tipos y utilidades
export type {
  RPGSystem,
  BaseCharacterData,
  CharacterSheetProps,
  RPGSheetComponent
} from './BaseCharacterSheet';

export type {
  MAndMCharacterData
} from './MutantsAndMastermindsSheet';

export type {
  ChampionsCharacterData
} from './ChampionsSheet';

// Exportar registro y utilidades
export {
  RPG_SYSTEMS,
  RPG_SHEETS,
  createDefaultCharacter,
  getSheetComponent,
  getSystemInfo,
  validateCharacterData
} from './RPGSheetRegistry'; 