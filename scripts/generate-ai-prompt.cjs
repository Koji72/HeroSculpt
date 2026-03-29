#!/usr/bin/env node

/**
 * 🤖 Generador de Prompt para IA Generativa
 * 
 * Este script genera un prompt optimizado en español para alimentar
 * IAs generativas (GPT, Stable Diffusion, Midjourney, etc.) y crear
 * texturas PBR automáticamente para el customizador.
 */

const fs = require('fs');
const path = require('path');

// Función para escanear archivos 3D en el proyecto
function scan3DFiles(baseDir = 'public/assets/models') {
  const files = [];
  
  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.glb', '.gltf', '.stl', '.obj'].includes(ext)) {
          files.push({
            name: item,
            path: fullPath,
            relativePath: path.relative(baseDir, fullPath),
            category: path.dirname(path.relative(baseDir, fullPath))
          });
        }
      }
    });
  }
  
  scanDirectory(baseDir);
  return files;
}

// Función para generar el prompt optimizado
function generateAIPrompt(fileList, categoryPalette, archetypes, maxTextureSize = 1024) {
  const prompt = `Actúa como un **generador de materiales PBR** especialmente diseñado para el entorno del customizador **"SUPERHERO CUSTOMIZER PRO"**, que utiliza Three.js y el workflow de Metallic‑Roughness (MeshStandardMaterial de Three.js) en su frontend React + Vite. Tu salida debe ser consistente, escalable y optimizada para performance real‑time.

### 📁 Entrada:

1. \`file_list\`: ${JSON.stringify(fileList.map(f => f.name), null, 2)}
2. \`category_palette\`: ${JSON.stringify(categoryPalette, null, 2)}
3. \`arquetipos\`: ${JSON.stringify(archetypes, null, 2)}
4. \`max_texture_size\`: ${maxTextureSize}

### ✂️ Tarea:

Por cada archivo de la \`file_list\`:
1. Determina la categoría (vía nombre o carpeta).
2. Genera 3 variantes de texturas PBR:
  - **BaseVariant**: colores neutros (grises/metal),
  - **ArquetipoVariant‑X**: aplica una paleta cromática distintiva según \`arquetipos\`, manteniendo valores de metalness/roughness adecuados.
3. Para cada variante, crea los siguientes mapas en PNG (SRGB):
  - \`albedo.png\` (mapa de base color),
  - \`normal.png\` (normal map),
  - \`metal_roughness.png\` (canal metálico → azul, roughness → verde),
  - opcional: \`emissive.png\` (para capas o detalles luminosos),
  - opcional: \`ambientOcclusion.png\`.
4. Copia cada archivo con la nomenclatura:
  \`\`\`
  {category}/{nombre_base}/{variant}/{texture_name}.png
  \`\`\`
5. Exporta un JSON de materiales para Three.js con campos:
  \`\`\`jsonc
  {
    "name": "capa_long_ArquetipoVariant",
    "variant": "ArquetipoVariant",
    "map": "url‑placeholder",
    "metalnessMap": "url‑placeholder",
    "roughnessMap": "url‑placeholder",
    "normalMap": "url‑placeholder",
    "emissiveMap": "...",
    "alphaTest": 0.5,
    "side": "FrontSide"
  }
  \`\`\`
con URLs que luego se subirán a Supabase Storage (\`storage://{category}/{...}\`).

6. Asegúrate de optimizar cada textura PNG (sin transparencia si no es necesario) y comprimir dentro del JSON (base64 opcional o URLs externas). Nada debe exceder \`max_texture_size\`.

### 🧩 Reglas importantes:

- Must‑match: _todas las texturas deben alinear UV con el modelo_.
- Hábitos de rendimiento: usa \`maxanisotropy=4\`, \`flipY=false\`, \`encoding=SRGBEncoding\` al importar en Three.js.
- Seguimiento semántico: el nombre de material en el JSON debe coincidir exactamente con el nombre del archivo 3D.
- si el archivo tiene materiales baked internos, solo genera texturas alternas y solo sobrescribe si la nueva textura ofrece mejor resolución o variación cromática.
- Para cada material, añade un campo \`"arquetipo": "Justiciero"\` si aplica.

### 🧪 Ejemplo de salida para un archivo:

\`\`\`jsonc
{
"file": "capa_long.glb",
"output_folder": "CapesV1/capa_long",
"variants": [
 {
   "variant": "BaseVariant",
   "albedo": "CapesV1/capa_long/BaseVariant/albedo.png",
   "normal": "…/normal.png",
   "metal_roughness": "…/metal_roughness.png"
 },
 {
   "variant": "JusticieroVariant",
   "albedo": "…/albedo.png",
   "normal": "…/normal.png",
   "metal_roughness": "…/metal_roughness.png",
   "emissive": "…/emissive.png"
 }
],
"materialObjects": [
 {
   "name": "capa_long_JusticieroVariant",
   "variant": "JusticieroVariant",
   "map": ".../albedo.png",
   "metalnessMap": ".../metal_roughness.png",
   "roughnessMap": ".../metal_roughness.png",
   "normalMap": ".../normal.png",
   "emissiveMap": ".../emissive.png"
 }
]
}
\`\`\`

### ✔️ Condiciones para validar la calidad final:

* Cada textura PBR debe seguir el workflow Metal‑Roughness (Three.js r147 en adelante donde la extensión spec/gloss está obsoleta).
* Si se detecta un archivo \`.gltf\` original con specular/glossiness, conviértelo al workflow de Metallic‑Roughness automáticamente.
* No usar \`hover:scale\` ni efectos CSS que afecten rendimiento.

### 📦 Output combinado esperable:

* Paquete ZIP con carpetas estructuradas por categoría y nombre.
* JSON master con todos los materiales listos para cargar en tu Customizador.
* Log de warnings si alguna textura excede \`max_texture_size\`.

---

## 🗣️ Instrucciones de uso:

1. Copia este prompt completo a la IA de tu elección.
2. Ejecuta por parte o por lote (batch).
3. Verifica los PNG generados y súbelos a Supabase Storage.
4. Carga el JSON en tu loader de React + Three.js con GLTFLoader y TextureLoader.

Con este prompt, obtendrás un pipeline automático para generar variedad de materiales consistentes y ligeros.`;

  return prompt;
}

// Función principal
function main() {
  console.log('🤖 Generando Prompt para IA Generativa...\n');
  
  // Archivos de ejemplo (basados en el proyecto real)
  const exampleFiles = [
    { name: 'strong_torso_01.glb', category: 'torso' },
    { name: 'justiciero_cape_01.glb', category: 'cape' },
    { name: 'speedster_head_01.glb', category: 'head' },
    { name: 'strong_boots_01.glb', category: 'boots' },
    { name: 'justiciero_belt_01.glb', category: 'belt' }
  ];
  
  const categoryPalette = {
    torso: 'TorsoParts',
    cape: 'CapeParts',
    head: 'HeadParts',
    boots: 'BootsParts',
    belt: 'BeltParts'
  };
  
  const archetypes = ['STRONG', 'JUSTICIERO', 'SPEEDSTER', 'MYSTIC', 'TECH'];
  
  const prompt = generateAIPrompt(exampleFiles, categoryPalette, archetypes);
  
  // Guardar prompt
  fs.writeFileSync('ai-prompt-pbr.txt', prompt);
  
  console.log('✅ Prompt generado exitosamente');
  console.log('📁 Guardado en: ai-prompt-pbr.txt');
  
  console.log('\n💡 PRÓXIMOS PASOS:');
  console.log('1. Copia el contenido de ai-prompt-pbr.txt');
  console.log('2. Pégalo en tu IA generativa preferida');
  console.log('3. Ejecuta la generación de texturas');
  console.log('4. Descarga y organiza los archivos generados');
  console.log('5. Sube las texturas a Supabase Storage');
  
  console.log('\n🎯 ¡Prompt listo para usar!');
}

// Ejecutar
if (require.main === module) {
  main();
}

module.exports = { generateAIPrompt }; 