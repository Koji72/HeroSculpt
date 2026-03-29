
// Script de limpieza agresivo para el Cuartel General
const aggressiveCleanup = () => {
  console.log('🚨 Iniciando limpieza agresiva...');
  
  // 1. Forzar que el modal ocupe toda la pantalla
  const modalElements = document.querySelectorAll('[class*="fixed"][class*="top-0"]');
  modalElements.forEach(el => {
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.right = '0';
    el.style.bottom = '0';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.zIndex = '9999';
  });
  
  // 2. Eliminar cualquier centrado vertical
  const centerElements = document.querySelectorAll('[class*="justify-center"]');
  centerElements.forEach(el => {
    const classes = el.className;
    if (classes.includes('justify-center')) {
      el.className = classes.replace('justify-center', 'justify-start');
    }
  });
  
  // 3. Forzar que el contenido comience desde arriba
  const contentElements = document.querySelectorAll('[class*="p-6"]');
  contentElements.forEach(el => {
    if (el.style.paddingTop === '') {
      el.style.paddingTop = '0';
    }
  });
  
  // 4. Eliminar espacios del body y html
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  
  // 5. Forzar que el root ocupe toda la pantalla
  const root = document.getElementById('root');
  if (root) {
    root.style.height = '100vh';
    root.style.width = '100vw';
    root.style.margin = '0';
    root.style.padding = '0';
  }
  
  console.log('🧹 Limpieza agresiva completada');
};

// Ejecutar limpieza múltiples veces
if (typeof window !== 'undefined') {
  window.addEventListener('load', aggressiveCleanup);
  window.addEventListener('DOMContentLoaded', aggressiveCleanup);
  
  // Ejecutar con delays para asegurar que React haya renderizado
  setTimeout(aggressiveCleanup, 100);
  setTimeout(aggressiveCleanup, 500);
  setTimeout(aggressiveCleanup, 1000);
  setTimeout(aggressiveCleanup, 2000);
  
  // También ejecutar cuando cambie la URL o se haga click
  window.addEventListener('click', aggressiveCleanup);
  window.addEventListener('popstate', aggressiveCleanup);
}
