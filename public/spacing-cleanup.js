
// Script de limpieza específico para espaciado del Cuartel General
const fixSpacing = () => {
  // Eliminar cualquier centrado vertical problemático
  const problematicElements = document.querySelectorAll('[class*="items-center"][class*="justify-center"]');
  problematicElements.forEach(el => {
    const classes = el.className;
    if (classes.includes('justify-center') && !classes.includes('justify-start')) {
      el.className = classes.replace('justify-center', 'justify-start');
    }
  });
  
  // Forzar que el modal ocupe toda la pantalla
  const modalElements = document.querySelectorAll('[class*="fixed"][class*="inset-0"]');
  modalElements.forEach(el => {
    el.style.top = '0';
    el.style.left = '0';
    el.style.right = '0';
    el.style.bottom = '0';
    el.style.margin = '0';
    el.style.padding = '0';
  });
  
  // Eliminar espacios del body y html
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  
  console.log('🧹 Limpieza de espaciado aplicada');
};

// Ejecutar limpieza cuando se carga la página
if (typeof window !== 'undefined') {
  window.addEventListener('load', fixSpacing);
  window.addEventListener('DOMContentLoaded', fixSpacing);
  
  // También ejecutar después de un pequeño delay para asegurar que React haya renderizado
  setTimeout(fixSpacing, 100);
  setTimeout(fixSpacing, 500);
  setTimeout(fixSpacing, 1000);
}
