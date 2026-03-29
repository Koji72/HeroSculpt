
// Script de debug para el Cuartel General
const debugHeadquarters = () => {
  console.log('🔍 Debug del Cuartel General iniciado...');
  
  // 1. Verificar si el modal está presente
  const modal = document.querySelector('[class*="fixed"][class*="top-0"]');
  if (modal) {
    console.log('✅ Modal del Cuartel General encontrado');
  } else {
    console.log('❌ Modal del Cuartel General NO encontrado');
    return;
  }
  
  // 2. Verificar si las pestañas están presentes
  const tabs = document.querySelectorAll('[class*="px-4"][class*="py-3"]');
  console.log('📋 Pestañas encontradas:', tabs.length);
  
  // 3. Verificar contenido de las pestañas
  const dashboardContent = document.querySelector('[class*="MISSION CONTROL"]');
  const aiLabContent = document.querySelector('[class*="AI LABORATORY"]');
  
  if (dashboardContent) {
    console.log('✅ Contenido de Dashboard visible');
  } else {
    console.log('❌ Contenido de Dashboard NO visible');
  }
  
  if (aiLabContent) {
    console.log('✅ Contenido de AI Lab visible');
  } else {
    console.log('❌ Contenido de AI Lab NO visible');
  }
  
  // 4. Verificar pestaña activa
  const activeTab = document.querySelector('[class*="text-blue-400"][class*="border-blue-400"]');
  if (activeTab) {
    console.log('📋 Pestaña activa:', activeTab.textContent);
  } else {
    console.log('❌ No se encontró pestaña activa');
  }
  
  // 5. Forzar renderizado del contenido
  const contentArea = document.querySelector('[class*="p-6"]');
  if (contentArea) {
    console.log('✅ Área de contenido encontrada');
    
    // Verificar si hay contenido dentro
    const hasContent = contentArea.children.length > 0;
    console.log('📋 Contenido en el área:', hasContent ? 'SÍ' : 'NO');
    
    if (!hasContent) {
      console.log('🚨 Área de contenido vacía - forzando renderizado...');
      
      // Intentar forzar el renderizado
      contentArea.style.display = 'none';
      setTimeout(() => {
        contentArea.style.display = 'block';
        console.log('🔄 Renderizado forzado completado');
      }, 100);
    }
  } else {
    console.log('❌ Área de contenido NO encontrada');
  }
  
  // 6. Verificar errores de JavaScript
  const errors = window.performance.getEntriesByType('resource')
    .filter(entry => entry.name.includes('error') || entry.name.includes('failed'));
  
  if (errors.length > 0) {
    console.log('⚠️ Errores detectados:', errors.length);
  } else {
    console.log('✅ No se detectaron errores de recursos');
  }
};

// Ejecutar debug cuando se carga la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', debugHeadquarters);
  window.addEventListener('DOMContentLoaded', debugHeadquarters);
  
  // También ejecutar después de un delay para asegurar que React haya renderizado
  setTimeout(debugHeadquarters, 1000);
  setTimeout(debugHeadquarters, 3000);
  
  // Ejecutar cuando se haga click en las pestañas
  document.addEventListener('click', (e) => {
    if (e.target.closest('[class*="px-4"][class*="py-3"]')) {
      setTimeout(debugHeadquarters, 500);
    }
  });
  
  // Exponer función globalmente para debugging manual
  window.debugHeadquarters = debugHeadquarters;
  console.log('🔧 Función debugHeadquarters() disponible globalmente');
}
