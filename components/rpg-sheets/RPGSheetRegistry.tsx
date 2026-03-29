import React from 'react';
import { RPGSystem, RPGSheetComponent, BaseCharacterData } from './BaseCharacterSheet';
import GenericModularSheet from './GenericModularSheet';

// Definir los sistemas RPG disponibles
export const RPG_SYSTEMS: RPGSystem[] = [
  {
    id: 'generic-modular',
    name: 'Generic Modular',
    description: 'Customizable modular system',
    icon: '🧩',
    color: 'from-yellow-400 to-orange-400'
  }
];

// Registrar las hojas de personaje
export const RPG_SHEETS: RPGSheetComponent[] = [
  {
    system: RPG_SYSTEMS[0],
    component: GenericModularSheet
  }
];

// Funciones para crear personajes por defecto
export const createDefaultCharacter = (systemId: string): BaseCharacterData => {
  switch (systemId) {
    case 'generic-modular':
      return {
        id: `modular-${Date.now()}`,
        name: '',
        player: '',
        system: 'generic-modular',
        grado: 'G1',
        str: 5,
        end: 5,
        agi: 5,
        wil: 5,
        int: 5,
        pre: 5,
        poderes: '',
        ventajas: '',
        descripcion: '',
        abilities: [
          { key: 'Q', name: 'KARMIC REVIVAL', icon: 'https://r.res.easebar.com/pic/20241120/bedb33ea-a7d7-482f-a3ba-695afc84d7df.png' },
          { key: 'SHIFT', name: 'SOUL BOND', icon: 'https://r.res.easebar.com/pic/20241120/6d9c5f2f-ad6d-4f5e-9a1d-bf039b2d6fdc.png' },
          { key: 'E', name: 'AVATAR LIFE STREAM', icon: 'https://r.res.easebar.com/pic/20241120/00ceedf0-0fab-45f5-bcb6-009797271b65.png' }
        ]
      };
    default:
      return {
        id: `default-${Date.now()}`,
        name: 'New Character',
        player: 'Player Name',
        system: systemId
      };
  }
};

// Obtener la hoja de personaje por sistema
export const getSheetComponent = (systemId: string) => {
  const sheet = RPG_SHEETS.find(s => s.system.id === systemId);
  return sheet?.component || null;
};

// Obtener información del sistema
export const getSystemInfo = (systemId: string) => {
  return RPG_SYSTEMS.find(s => s.id === systemId) || null;
};

// Validar datos de personaje
export const validateCharacterData = (character: BaseCharacterData): boolean => {
  if (!character.name || !character.system) {
    return false;
  }
  // Validaciones específicas por sistema
  switch (character.system) {
    case 'generic-modular':
      return true;
    default:
      return true;
  }
}; 