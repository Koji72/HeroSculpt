# Fondo Gaming Transparente con Three.js

## Problema
El canvas de Three.js mostraba un fondo negro (o blanco) y no permitía ver el fondo gaming personalizado, incluso usando `alpha: true` y estilos CSS `background: transparent`.

## Causa
- El uso de post-procesado (`EffectComposer`, `SSAOPass`, `UnrealBloomPass`, etc.) puede forzar el fondo a negro, aunque el renderer sea transparente.
- El valor por defecto de Three.js para el fondo es negro opaco.
- El método correcto para transparencia total requiere tanto configuración en el renderer como en el render loop.

## Solución Correcta

### 1. Configura el renderer de Three.js con transparencia
```js
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0); // Negro, alpha 0 = completamente transparente
renderer.domElement.style.background = 'transparent';
renderer.domElement.style.backgroundColor = 'transparent';
```

### 2. Evita post-procesado que fuerce fondo opaco
- Comenta o elimina el uso de `EffectComposer`, `SSAOPass`, `UnrealBloomPass`, etc.
- Usa el render simple:
```js
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera); // Render simple, sin post-procesado
};
animate();
```

### 3. Verifica en el inspector
- El `<canvas>` debe tener `background-color: transparent` en Computed.
- El fondo gaming debe ser visible debajo del modelo 3D.

## Notas adicionales
- Si en el futuro quieres usar post-procesado, revisa la documentación de cada pass para asegurarte de que soporta transparencia.
- Si usas `EffectComposer`, asegúrate de que el renderer y todos los passes soporten alpha y no sobrescriban el fondo.

## Resumen
- Siempre usa: `renderer.setClearColor(0x000000, 0)`
- Evita: post-procesado que no soporte alpha
- Verifica: el canvas en el inspector 