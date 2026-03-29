# 🎨 Instrucciones Específicas para strong_torso_02.glb

## 📋 Información del Modelo
- **Nombre**: strong_torso_02.glb
- **Categoría**: torso
- **Arquetipo**: STRONG
- **Prioridad**: ALTA

## 🎯 Objetivo
Preparar este modelo para deformación basada en texturas (displacement mapping).

## 🛠️ Software Recomendado
**Blender** (versión 3.0+)

## 📝 Pasos Específicos

### 1. Importar Modelo
1. Abrir Blender
2. File → Import → glTF 2.0 (.glb/.gltf)
3. Seleccionar: public/assets/strong/torso/strong_torso_02.glb
4. Import

### 2. Aplicar UV Mapping
1. Seleccionar el modelo
2. Cambiar a UV Editing workspace
3. Seleccionar todo (A)
4. U → Smart UV Project
5. Configurar:
   - Angle Limit: 66°
   - Island Margin: 0.02
6. Aplicar

### 3. Verificar UVs
1. En UV Editor, verificar que:
   - Las UVs cubren todo el espacio 0-1
   - No hay solapamientos excesivos
   - Las islas están bien distribuidas

### 4. Subdividir si es necesario
1. Modifiers panel
2. Add Modifier → Subdivision Surface
3. Levels Viewport: 2
4. Levels Render: 3
5. Apply modifier

### 5. Limpiar Geometría
1. Edit Mode
2. A → Seleccionar todo
3. Mesh → Clean Up → Merge By Distance (0.001)
4. Mesh → Clean Up → Delete → Degenerate Dissolve

### 6. Recalcular Normales
1. Edit Mode
2. A → Seleccionar todo
3. Mesh → Normals → Recalculate Outside
4. Mesh → Normals → Smooth

### 7. Exportar
1. File → Export → glTF 2.0 (.glb/.gltf)
2. Configurar:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects
   - Transform: +Y Up
   - Geometry: Apply Modifiers ✓
3. Export

## ✅ Verificación Final
Ejecutar: `node scripts/verify-prepared-model.cjs`

## 🎯 Resultado Esperado
- ✅ Coordenadas UV presentes
- ✅ Mínimo 1000 vértices
- ✅ Topología limpia
- ✅ Normales calculadas
- ✅ Score >= 70/100
