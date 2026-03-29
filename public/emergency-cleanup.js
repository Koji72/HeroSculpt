
// Script de limpieza adicional para el Cuartel General
const forceCleanup = () => {
  // Forzar cierre de todos los paneles problemáticos
  if (window.isMaterialPanelOpen !== undefined) {
    window.isMaterialPanelOpen = false;
  }
  if (window.setIsMaterialPanelOpen !== undefined) {
    window.setIsMaterialPanelOpen(false);
  }
  
  // Limpiar elementos flotantes
  const floatingElements = document.querySelectorAll('[class*="Material"], [class*="material"]');
  floatingElements.forEach(el => {
    if (el.textContent.includes('Material Configuration') || 
        el.textContent.includes('Customize materials')) {
      el.style.display = 'none';
    }
  });
  
  console.log('🧹 Limpieza de emergencia aplicada');
};

// Ejecutar limpieza cuando se carga la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', forceCleanup);
  window.addEventListener('DOMContentLoaded', forceCleanup);
}
