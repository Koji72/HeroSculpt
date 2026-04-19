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

  // AuthModal
  'auth.email_sent': { en: 'EMAIL SENT', es: 'EMAIL ENVIADO' },
  'auth.email_sent_body': { en: 'Check your email and follow the link to create a new password.', es: 'Revisa tu correo y sigue el enlace para crear una nueva contraseña.' },
  'auth.account_created': { en: 'ACCOUNT CREATED!', es: '¡CUENTA CREADA!' },
  'auth.account_created_body': { en: 'Check your email to confirm your account, then sign in.', es: 'Revisa tu email para confirmar la cuenta y luego inicia sesión.' },
  'auth.close_btn': { en: 'CLOSE', es: 'CERRAR' },
  'auth.title.signup': { en: 'JOIN THE SQUAD', es: 'ÚNETE AL ESCUADRÓN' },
  'auth.title.forgot': { en: 'RECOVER ACCESS', es: 'RECUPERAR ACCESO' },
  'auth.title.signin': { en: 'WELCOME BACK', es: 'BIENVENIDO DE VUELTA' },
  'auth.submit.signup': { en: 'CREATE ACCOUNT →', es: 'CREAR CUENTA →' },
  'auth.submit.forgot': { en: 'SEND LINK →', es: 'ENVIAR ENLACE →' },
  'auth.submit.signin': { en: 'SIGN IN →', es: 'ENTRAR →' },
  'auth.have_account': { en: 'Already have an account?', es: '¿Ya tienes cuenta?' },
  'auth.signin_link': { en: 'SIGN IN', es: 'INICIAR SESIÓN' },
  'auth.back': { en: '← BACK', es: '← VOLVER' },
  'auth.new_here': { en: 'New here?', es: '¿Nuevo aquí?' },
  'auth.join_free': { en: 'JOIN FREE', es: 'ÚNETE GRATIS' },
  'auth.forgot_link': { en: 'Forgot your password?', es: '¿Olvidaste tu contraseña?' },
  'auth.password_label': { en: 'Password', es: 'Contraseña' },
  'auth.password_placeholder': { en: 'password', es: 'contraseña' },
  'auth.signup_subtitle': { en: 'CREATE YOUR FREE ACCOUNT', es: 'CREA TU CUENTA GRATUITA' },

  // SimpleSignUpModal
  'signup.title': { en: 'CREATE ACCOUNT', es: 'CREAR CUENTA' },
  'signup.success': { en: 'Account created successfully. Check your email if confirmation is required.', es: 'Cuenta creada con éxito. Revisa tu email si se requiere confirmación.' },
  'signup.close': { en: 'CLOSE', es: 'CERRAR' },
  'signup.submitting': { en: 'Creating account...', es: 'Creando cuenta...' },
  'signup.submit': { en: 'CREATE ACCOUNT', es: 'CREAR CUENTA' },
  'signup.password_label': { en: 'Password', es: 'Contraseña' },
  'signup.password_hint': { en: 'Minimum 6 characters', es: 'Mínimo 6 caracteres' },
  'signup.terms': { en: 'By creating an account, you agree to our terms of service.', es: 'Al crear una cuenta, aceptas nuestros términos de servicio.' },
  'signup.email_placeholder': { en: 'your@email.com', es: 'tu@correo.com' },

  // ResetPasswordModal
  'reset.title': { en: 'NEW PASSWORD', es: 'NUEVA CONTRASEÑA' },
  'reset.success': { en: 'Password updated. You can now sign in.', es: 'Contraseña actualizada. Ya puedes iniciar sesión.' },
  'reset.done': { en: 'SIGN IN →', es: 'ENTRAR →' },
  'reset.new_password': { en: 'New password', es: 'Nueva contraseña' },
  'reset.confirm_password': { en: 'Confirm password', es: 'Confirmar contraseña' },
  'reset.submit': { en: 'SAVE →', es: 'GUARDAR →' },
  'reset.err.mismatch': { en: 'Passwords do not match', es: 'Las contraseñas no coinciden' },
  'reset.err.min_length': { en: 'Minimum 6 characters', es: 'Mínimo 6 caracteres' },

  // ShoppingCart
  'cart.title': { en: '🛒 MY HERO', es: '🛒 MI HÉROE' },
  'cart.parts': { en: 'PARTS', es: 'PARTES' },
  'cart.tab.config': { en: 'CONFIGURATION', es: 'CONFIGURACIÓN' },
  'cart.tab.cart': { en: 'CART', es: 'CARRITO' },
  'cart.empty.title': { en: 'BUILD YOUR HERO!', es: '¡CONSTRUYE TU HÉROE!' },
  'cart.empty.hint': { en: 'Select parts from the left panel to start.', es: 'Selecciona partes desde el panel izquierdo para comenzar tu personaje.' },
  'cart.parts_panel': { en: 'PARTS PANEL', es: 'PANEL DE PARTES' },
  'cart.owned': { en: '✓ OWNED', es: '✓ YA TIENES' },
  'cart.new_badge': { en: 'NEW', es: 'NUEVO' },
  'cart.in_library': { en: 'In library', es: 'En biblioteca' },
  'cart.part_singular': { en: 'part', es: 'parte' },
  'cart.part_plural': { en: 'parts', es: 'partes' },
  'cart.total_new': { en: 'New total', es: 'Total nuevas' },
  'cart.discount': { en: 'Signup discount', es: 'Descuento registro' },
  'cart.free': { en: 'FREE', es: 'GRATIS' },
  'cart.empty_cart': { en: 'EMPTY CART', es: 'CARRITO VACÍO' },
  'cart.empty_cart_hint': { en: 'Add premium parts from the configuration panel.', es: 'Añade partes premium desde el panel de configuración.' },
  'cart.saving': { en: 'SAVING...', es: 'GUARDANDO...' },
  'cart.save': { en: '✓ SAVE CONFIGURATION', es: '✓ GUARDAR CONFIGURACIÓN' },
  'cart.register_save': { en: '🔑 REGISTER TO SAVE', es: '🔑 REGISTRARSE PARA GUARDAR' },
  'cart.back_edit': { en: 'Back to edit', es: 'Volver a editar' },
  'cart.checkout_error': { en: 'Error processing payment. Please try again.', es: 'Error al procesar el pago. Por favor intenta de nuevo.' },

  // HeaderDropdown
  'menu.profile': { en: 'My Profile', es: 'Mi Perfil' },
  'menu.heroes': { en: 'My Heroes', es: 'Mis Héroes' },
  'menu.help': { en: 'Help', es: 'Ayuda' },
  'menu.vtt': { en: 'VTT Tokens', es: 'Tokens VTT' },

  // StylePanel
  'style.header': { en: '🎨 STYLE', es: '🎨 ESTILO' },
  'style.color': { en: 'COLOR', es: 'COLOR' },
  'style.material': { en: 'MATERIAL', es: 'MATERIAL' },
  'style.material.fabric_desc': { en: 'Soft, matte', es: 'Suave, mate' },
  'style.material.metal_desc': { en: 'Shiny metallic', es: 'Metálico brillante' },
  'style.material.plastic_desc': { en: 'Smooth, hard', es: 'Liso, duro' },
  'style.material.chrome_desc': { en: 'Mirror reflective', es: 'Espejo reflectante' },
  'style.close': { en: 'Close', es: 'Cerrar' },

  // LightsPanel
  'lights.on': { en: 'ON', es: 'ON' },

  // SkinsPanel
  'skins.header': { en: '✨ SKINS', es: '✨ SKINS' },

  // WelcomeScreen
  'welcome.title': { en: 'HERO BUILDER', es: 'HERO BUILDER' },
  'welcome.greeting': { en: 'WELCOME!', es: '¡BIENVENIDO!' },
  'welcome.library.desc': { en: 'Save and load unlimited builds', es: 'Guarda y carga builds ilimitadas' },

  // PartSelectorPanel
  'panel.focus_camera': { en: 'Focus camera on part', es: 'Centrar cámara en esta parte' },
  'panel.show_all_title': { en: 'Show all parts', es: 'Mostrar todas las partes' },
  'panel.favorites_only_title': { en: 'Show favorites only', es: 'Mostrar solo favoritos' },

  // AuthModal / ResetPasswordModal aria-labels
  'common.close': { en: 'Close', es: 'Cerrar' },
  'common.service_unavailable': { en: 'Service unavailable', es: 'Servicio no disponible' },
  'common.email_label': { en: 'Email', es: 'Email' },

  // CharacterViewer camera controls
  'viewer.rotate_left': { en: 'Rotate left 15°', es: 'Girar izquierda 15°' },
  'viewer.rotate_right': { en: 'Rotate right 15°', es: 'Girar derecha 15°' },
  'viewer.zoom_in': { en: 'Zoom in', es: 'Acercar' },
  'viewer.zoom_out': { en: 'Zoom out', es: 'Alejar' },
  'viewer.reset_view': { en: 'Reset view', es: 'Restablecer vista' },
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
