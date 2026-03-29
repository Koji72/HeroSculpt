# 🎮 Sistema de Preview - Guía de Usuario

## 📖 **Descripción**

El sistema de preview permite visualizar los cambios de partes en tiempo real antes de aplicarlos permanentemente. Esto proporciona una experiencia más fluida y profesional al customizar tu superhéroe.

## 🚀 **Cómo Funciona**

### **1. Activar Preview**
- Abre cualquier categoría de partes (TORSO, HEAD, HAND_LEFT, etc.)
- Haz **clic simple** en cualquier parte para ver un preview temporal
- El modelo 3D se actualiza automáticamente para mostrar la parte seleccionada
- El footer muestra: **"• Changes previewed - click Apply to save"**

### **2. Navegación en Preview**
- **Clic**: Preview persistente hasta que hagas clic en otra parte
- **Múltiples cambios**: Puedes hacer clic en varias partes para combinar cambios
- **Hover**: Solo efectos visuales (sin carga de modelo para mejor rendimiento)

### **3. Aplicar Cambios**
- **Botón Apply**: Aplica todos los cambios previsualizados permanentemente
- **Doble-click**: Aplica la parte inmediatamente sin pasar por preview
- **Enter/Space**: Atajos de teclado para aplicar cambios rápidamente

### **4. Cancelar Preview**
- **Botón Cancel**: Descarta todos los cambios y vuelve al estado original
- **Botón Reset (↻)**: Limpia el preview actual sin cerrar el panel
- **Escape**: Atajo de teclado para cancelar y cerrar
- **Clic fuera**: Cierra el panel y cancela cambios

## 🎯 **Estados Visuales**

### **Botón Apply**
- **Inactivo**: `bg-slate-800/50 text-slate-500` - No hay cambios
- **Activo**: `bg-gradient-to-r from-orange-500 to-amber-500` - Cambios pendientes

### **Partes en Preview**
- **Seleccionada**: Border orange con glow effect
- **Hover**: Border cyan con sutil glow
- **Normal**: Border slate estándar

### **Footer Information**
- **Sin cambios**: "Click to preview • Double-click to apply directly"
- **Con cambios**: "• Changes previewed - click Apply to save"

## 🔧 **Implementación Técnica**

### **Flujo de Datos**
```typescript
1. Usuario hace clic → PartItemCard.onSelect()
2. PartSelectorPanel.handlePreviewSelect()
3. CharacterViewer.handlePreviewPartsChange()
4. Se actualiza previewParts state
5. loadModels() usa previewParts || selectedParts
6. Modelo 3D se actualiza automáticamente
```

### **Estado del Preview**
```typescript
// En CharacterViewer.tsx
const [previewParts, setPreviewParts] = useState<SelectedParts | null>(null);

// En PartSelectorPanel.tsx  
const [hasChanges, setHasChanges] = useState(false);
```

### **Limpieza del Preview**
```typescript
// Se limpia automáticamente cuando:
- Se aplican cambios (Apply/Double-click)
- Se cancela (Cancel/Escape)
- Se cierra el panel
```

## 🎨 **Mejoras Estéticas Marvel Rivals**

### **Efectos Visuales**
- **Holographic background**: Gradient animado con scan lines
- **Shine effects**: Efectos de brillo al hacer hover
- **Corner accents**: Marcos futuristas en cada card
- **Marvel typography**: RefrigeratorDeluxe fonts

### **Animaciones**
- **scan-horizontal**: Líneas de escaneo en partes seleccionadas
- **breathe**: Efectos de "respiración" en elementos activos
- **shine**: Efectos de brillo en hover states

## 💡 **Consejos de UX**

1. **Preview rápido**: Usa hover para preview instantáneo
2. **Cambios múltiples**: Haz clic en varias partes antes de aplicar
3. **Comparación**: Usa Reset para comparar con el estado original
4. **Aplicación rápida**: Doble-click para aplicar inmediatamente
5. **Cancelar fácil**: Escape o clic fuera para salir rápido

## 🐛 **Debugging**

### **Logs de Consola**
```
🎯 CharacterViewer: Preview parts changed: {...}
🔍 CharacterViewer: Using preview? true
✅ CharacterViewer: Clearing preview
```

### **Verificación de Estados**
- Abre DevTools
- Ve a Components → CharacterViewer
- Busca `previewParts` state
- `null` = Sin preview, `object` = Preview activo

---

**✨ El sistema de preview está completamente implementado y funcional. ¡Disfruta customizando tu superhéroe con la nueva experiencia Marvel Rivals!** 