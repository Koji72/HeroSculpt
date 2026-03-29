
// Script de limpieza específico para contenido del Cuartel General
const fixHeadquartersContent = () => {
  console.log('🔧 Iniciando fix de contenido del Cuartel General...');
  
  // 1. Forzar que el contenido sea visible
  const contentElements = document.querySelectorAll('[class*="space-y-8"]');
  contentElements.forEach(el => {
    el.style.display = 'block';
    el.style.visibility = 'visible';
    el.style.opacity = '1';
  });
  
  // 2. Asegurar que las pestañas funcionen
  const tabButtons = document.querySelectorAll('[class*="px-4"][class*="py-3"]');
  tabButtons.forEach(button => {
    button.style.pointerEvents = 'auto';
    button.style.cursor = 'pointer';
  });
  
  // 3. Forzar renderizado del contenido activo
  const activeTab = document.querySelector('[class*="text-blue-400"][class*="border-blue-400"]');
  if (activeTab) {
    const tabId = activeTab.getAttribute('data-tab-id') || 
                 activeTab.textContent?.toLowerCase().replace(/s+/g, '-');
    
    console.log('📋 Pestaña activa detectada:', tabId);
    
    // Simular click en la pestaña activa para forzar renderizado
    setTimeout(() => {
      activeTab.click();
    }, 100);
  }
  
  // 4. Eliminar cualquier overlay que pueda estar bloqueando
  const overlays = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
  overlays.forEach(overlay => {
    if (overlay.style.zIndex && parseInt(overlay.style.zIndex) > 1000) {
      overlay.style.pointerEvents = 'none';
    }
  });
  
  // 5. Forzar que el contenido tenga altura
  const contentArea = document.querySelector('[class*="p-6"]');
  if (contentArea) {
    contentArea.style.minHeight = '400px';
    contentArea.style.height = 'auto';
  }
  
  console.log('🧹 Fix de contenido completado');
};

// Ejecutar limpieza múltiples veces
if (typeof window !== 'undefined') {
  window.addEventListener('load', fixHeadquartersContent);
  window.addEventListener('DOMContentLoaded', fixHeadquartersContent);
  
  // Ejecutar con delays para asegurar que React haya renderizado
  setTimeout(fixHeadquartersContent, 1000);
  setTimeout(fixHeadquartersContent, 3000);
  setTimeout(fixHeadquartersContent, 5000);
  
  // También ejecutar cuando se haga click en las pestañas
  document.addEventListener('click', (e) => {
    if (e.target.closest('[class*="px-4"][class*="py-3"]')) {
      setTimeout(fixHeadquartersContent, 500);
    }
  });
}
