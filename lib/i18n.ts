import React, { createContext, useContext, useState } from 'react';

export type Lang = 'en' | 'es';

const dict = {
  // Top bar
  'topbar.undo': { en: '↩', es: '↩' },
  'topbar.redo': { en: '↪', es: '↪' },
  'topbar.random': { en: '🎲 RANDOM', es: '🎲 AZAR' },
  'topbar.share': { en: '🔗 SHARE', es: '🔗 COMPARTIR' },
  'topbar.copied': { en: '✓ COPIED', es: '✓ COPIADO' },
  'topbar.checkout': { en: 'CHECKOUT →', es: 'PAGAR →' },
  'topbar.mybuild': { en: 'MY BUILD →', es: 'MI BUILD →' },
  'topbar.savehero': { en: '💾 SAVE HERO', es: '💾 GUARDAR HÉROE' },
  'topbar.heroplaceholder': { en: 'My Hero', es: 'Mi Héroe' },

  // Step indicator
  'steps.archetype': { en: 'ARCHETYPE', es: 'ARQUETIPO' },
  'steps.build': { en: 'BUILD', es: 'BUILD' },
  'steps.export': { en: 'EXPORT', es: 'EXPORTAR' },

  // Left sidebar toolbar tooltips
  'toolbar.upper': { en: 'UPPER BODY [1]', es: 'CUERPO SUPERIOR [1]' },
  'toolbar.belt': { en: 'BELT & ACCESSORIES [2]', es: 'CINTURÓN Y ACCESORIOS [2]' },
  'toolbar.lower': { en: 'LOWER BODY [3]', es: 'CUERPO INFERIOR [3]' },
  'toolbar.backpack': { en: 'BACKPACK & EXTRAS', es: 'MOCHILA Y EXTRAS' },
  'toolbar.style': { en: 'COLORS & MATERIALS', es: 'COLORES Y MATERIALES' },
  'toolbar.skins': { en: 'TEXTURES & SKINS', es: 'TEXTURAS Y SKINS' },
  'toolbar.lights': { en: 'LIGHTING', es: 'ILUMINACIÓN' },

  // Toolbar labels
  'toolbar.upper.label': { en: 'UPPER', es: 'UPPER' },
  'toolbar.belt.label': { en: 'BELT', es: 'BELT' },
  'toolbar.lower.label': { en: 'LOWER', es: 'LOWER' },
  'toolbar.backpack.label': { en: 'PACK', es: 'MOCHILA' },

  // Left panel
  'panel.title': { en: 'CUSTOMIZER', es: 'PERSONALIZADOR' },
  'panel.parts': { en: 'Parts', es: 'Partes' },
  'panel.style': { en: 'Style', es: 'Estilo' },
  'panel.skins': { en: 'Skins', es: 'Skins' },
  'panel.lights': { en: 'Lights', es: 'Luces' },
  'panel.parts.desc': { en: 'Swap hero parts and build the silhouette before refining materials.', es: 'Elige y combina piezas para construir la silueta de tu héroe.' },
  'panel.style.desc': { en: 'Adjust color and material behavior for each part or the whole build.', es: 'Ajusta colores y materiales por pieza o aplica un estilo global.' },
  'panel.skins.desc': { en: 'Apply curated looks quickly when you want a stronger preset direction.', es: 'Aplica looks predefinidos para conseguir estilos rápidamente.' },
  'panel.lights.desc': { en: 'Tune the display lighting to present the character more clearly.', es: 'Configura la iluminación para presentar mejor al personaje.' },
  'panel.close': { en: 'Close panel', es: 'Cerrar panel' },

  // Archetype switcher
  'arch.active': { en: 'ACTIVE', es: 'ACTIVO' },
  'arch.select': { en: 'SELECT', es: 'ELEGIR' },
  'arch.more': { en: '••• MORE', es: '••• MÁS' },
  'arch.stats.power': { en: 'POWER', es: 'PODER' },
  'arch.stats.defense': { en: 'DEF', es: 'DEF' },
  'arch.stats.speed': { en: 'SPEED', es: 'VELOC' },

  // TorsoSubmenu
  'sub.torso': { en: 'TORSO', es: 'TORSO' },
  'sub.head': { en: 'HEAD', es: 'CABEZA' },
  'sub.suit': { en: 'SUIT', es: 'TRAJE' },
  'sub.cape': { en: 'CAPE', es: 'CAPA' },
  'sub.symbol': { en: 'SYMBOL', es: 'SÍMBOLO' },
  'sub.chest': { en: 'CHEST', es: 'PECHO' },
  'sub.shoulders': { en: 'SHOULDERS', es: 'HOMBROS' },
  'sub.forearms': { en: 'FOREARMS', es: 'ANTEBRAZOS' },
  'sub.hand_left': { en: 'L.HAND', es: 'MANO IZQ' },
  'sub.hand_right': { en: 'R.HAND', es: 'MANO DER' },

  // BeltSubmenu
  'sub.belt': { en: 'BELT', es: 'CINTURÓN' },
  'sub.pouch': { en: 'POUCH', es: 'BOLSA' },
  'sub.buckle': { en: 'BUCKLE', es: 'HEBILLA' },

  // LowerBodySubmenu
  'sub.legs': { en: 'LEGS', es: 'PIERNAS' },
  'sub.boots': { en: 'BOOTS', es: 'BOTAS' },

  // Bottom bar
  'bottom.pose': { en: 'POSE', es: 'POSE' },
  'bottom.front': { en: 'FRONT', es: 'FRENTE' },
  'bottom.side': { en: 'SIDE', es: 'LADO' },
  'bottom.back': { en: 'BACK', es: 'ATRÁS' },
  'bottom.png': { en: '📷 PNG', es: '📷 PNG' },
  'bottom.glb': { en: '📦 GLB', es: '📦 GLB' },
  'bottom.stl': { en: '🖨️ STL', es: '🖨️ STL' },
  'bottom.vtt': { en: '🎲 VTT', es: '🎲 VTT' },
  'bottom.save_pose': { en: '💾 POSE', es: '💾 POSE' },

  // Pose navigation
  'pose.saving': { en: 'Saving last pose...', es: 'Guardando última pose...' },
  'pose.last': { en: 'Last pose:', es: 'Última pose:' },
  'pose.saved_at': { en: 'Saved:', es: 'Guardado:' },
  'pose.delete': { en: 'Delete', es: 'Borrar' },
  'pose.cancel': { en: 'Cancel', es: 'Cancelar' },
  'pose.rename': { en: 'Rename', es: 'Renombrar' },
  'pose.save_as_new': { en: '💾 Save', es: '💾 Guardar' },
  'pose.delete_confirm': { en: 'Delete this pose?', es: '¿Borrar esta pose?' },
  'pose.save_as_new_title': { en: 'Save as new editable pose', es: 'Guardar como nueva pose editable' },

  // Right panel tabs
  'rtab.stats': { en: 'STATS', es: 'STATS' },
  'rtab.style': { en: 'STYLE', es: 'ESTILO' },
  'rtab.skins': { en: 'SKINS', es: 'SKINS' },
  'rtab.builds': { en: '📚 BUILDS', es: '📚 BUILDS' },
  'rtab.library_locked': { en: 'Sign in to access your Library', es: 'Inicia sesión para acceder a tu biblioteca' },

  // Keyboard shortcuts overlay
  'shortcuts.title': { en: 'KEYBOARD SHORTCUTS', es: 'ATAJOS DE TECLADO' },
  'shortcuts.undo': { en: 'Undo', es: 'Deshacer' },
  'shortcuts.redo': { en: 'Redo', es: 'Rehacer' },
  'shortcuts.upper': { en: 'Upper body panel', es: 'Panel cuerpo superior' },
  'shortcuts.belt': { en: 'Belt panel', es: 'Panel cinturón' },
  'shortcuts.lower': { en: 'Lower body panel', es: 'Panel cuerpo inferior' },
  'shortcuts.camera': { en: 'Reset camera', es: 'Resetear cámara' },
  'shortcuts.help': { en: 'Show/hide this help', es: 'Mostrar/ocultar esta ayuda' },
  'shortcuts.close': { en: 'Close panel', es: 'Cerrar panel' },

  // WelcomeScreen
  'welcome.parts': { en: 'PARTS', es: 'PIEZAS' },
  'welcome.archetypes': { en: 'ARCHETYPES', es: 'ARQUETIPOS' },
  'welcome.exports': { en: 'EXPORTS', es: 'EXPORTS' },
  'welcome.library': { en: 'HERO LIBRARY', es: 'MI BIBLIOTECA' },
  'welcome.library.open': { en: 'OPEN →', es: 'ABRIR →' },
  'welcome.start': { en: 'START CREATING →', es: 'EMPEZAR A CREAR →' },
  'welcome.start.with': { en: 'CREATE WITH', es: 'CREAR CON' },
  'welcome.pick': { en: 'CHOOSE YOUR ARCHETYPE', es: 'ELIGE TU ARQUETIPO' },
  'welcome.picked': { en: '✓ SELECTED', es: '✓ ELEGIDO' },

  // RPGCharacterSheet
  'rpg.sheet.title': { en: 'RPG Character Sheet', es: 'Ficha de Personaje RPG' },
  'rpg.recent_changes': { en: 'Recent Changes', es: 'Cambios Recientes' },
  'rpg.stats': { en: 'Statistics', es: 'Estadísticas' },
  'rpg.new_abilities': { en: 'New Abilities:', es: 'Nuevas Habilidades:' },
  'rpg.removed_abilities': { en: 'Removed Abilities:', es: 'Habilidades Removidas:' },
  'rpg.archetype': { en: 'Selected Archetype', es: 'Arquetipo Seleccionado' },
  'rpg.compatibility': { en: 'Compatibility', es: 'Compatibilidad' },
  'rpg.physical': { en: 'Physical Attributes', es: 'Atributos Físicos' },
  'rpg.visual_effects': { en: 'Visual Effects', es: 'Efectos Visuales' },
  'rpg.suggestions': { en: 'Suggestions', es: 'Sugerencias' },
  'rpg.loading': { en: 'Calculating stats…', es: 'Calculando estadísticas…' },

  // Loading
  'loading': { en: 'LOADING…', es: 'CARGANDO…' },

  // HeaderDropdown
  'menu.settings': { en: 'Settings', es: 'Ajustes' },
  'menu.signout': { en: 'Sign out', es: 'Cerrar sesión' },

  // LightsPanel
  'lights.title': { en: '💡 LIGHTING', es: '💡 ILUMINACIÓN' },
  'lights.active': { en: 'ACTIVE:', es: 'ACTIVO:' },
  'lights.none': { en: 'NONE', es: 'NINGUNO' },

  // SkinsPanel
  'skins.title': { en: '✨ SKINS', es: '✨ SKINS' },
  'skins.active': { en: 'ACTIVE:', es: 'ACTIVO:' },
  'skins.none': { en: 'NONE', es: 'NINGUNO' },
  'skins.apply': { en: 'APPLY', es: 'APLICAR' },
  'skins.active_btn': { en: 'ON', es: '✓ ACTIVO' },

  // PartSelectorPanel
  'panel.apply': { en: '✓ APPLY', es: '✓ APLICAR' },
  'panel.search': { en: 'Search part...', es: 'Buscar parte...' },
  'panel.show_all': { en: 'Show all', es: 'Mostrar todas' },
  'panel.favorites_only': { en: 'Favorites only', es: 'Solo favoritos' },
  'panel.no_parts': { en: 'No compatible parts for this combination.', es: 'Sin partes compatibles para esta combinación.' },

  // ArchetypeSwitcher
  'archetype.confirm': { en: 'CONFIRM', es: 'CONFIRMAR' },
  'archetype.cancel': { en: 'CANCEL', es: 'CANCELAR' },
  'archetype.confirm_msg': { en: 'Switching archetype will reset selected parts. Continue?', es: 'Cambiar arquetipo reiniciará las partes seleccionadas. ¿Continuar?' },

  // StylePanel apply buttons
  'style.apply': { en: '✓ APPLY', es: '✓ APLICAR' },
  'style.apply_all': { en: 'APPLY TO ALL PARTS', es: 'APLICAR A TODAS LAS PARTES' },

  // PurchaseLibrary
  'library.title': { en: '📚 MY BUILDS', es: '📚 MIS BUILDS' },
} as const;

export type TransKey = keyof typeof dict;

export const t = (key: TransKey, lang: Lang): string =>
  (dict[key] as Record<Lang, string>)[lang] ?? (dict[key] as Record<Lang, string>).en;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem('herosculpt_lang') as Lang) || 'en'; } catch { return 'en'; }
  });

  const handleSet = (l: Lang) => {
    setLang(l);
    try { localStorage.setItem('herosculpt_lang', l); } catch {}
  };

  return React.createElement(LangContext.Provider, { value: { lang, setLang: handleSet } }, children);
};

export const useLang = () => useContext(LangContext);
