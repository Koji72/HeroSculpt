# 🎲 VTT Preview Implementation - 2025

## 📸 Funcionalidad Implementada

### **Preview con Recuadro y Captura de Miniatura**

Se ha recuperado y mejorado la funcionalidad del menú VTT con las siguientes características:

---

## 🎯 Características Principales

### **1. Preview del Personaje**
- **Captura automática** al abrir el modal VTT
- **Botón de actualización** para recapturar la imagen
- **Vista previa en tiempo real** del personaje 3D

### **2. Recuadro de Selección**
- **Recuadro circular** que indica el área del token
- **Indicador de tamaño** que muestra las dimensiones seleccionadas
- **Borde cyan** con opacidad para mejor visibilidad

### **3. Información del Personaje**
- **Arquetipo** del personaje
- **Nivel de poder** basado en las estadísticas calculadas
- **Diseño responsive** con grid de 2 columnas

---

## 🔧 Implementación Técnica

### **VTTExportModal.tsx**
```typescript
// Nuevas props agregadas
interface VTTExportModalProps {
  // ... props existentes
  characterViewerRef?: any; // Para acceder a takeScreenshot
}

// Nuevos estados
const [previewImage, setPreviewImage] = useState<string>('');
const [isCapturing, setIsCapturing] = useState(false);

// Función de captura
const capturePreview = async () => {
  if (!characterViewerRef?.current?.takeScreenshot) {
    console.warn('CharacterViewer ref not available for screenshot');
    return;
  }

  setIsCapturing(true);
  try {
    const screenshot = await characterViewerRef.current.takeScreenshot();
    setPreviewImage(screenshot);
  } catch (error) {
    console.error('Error capturing preview:', error);
  } finally {
    setIsCapturing(false);
  }
};
```

### **App.tsx**
```typescript
// Pasar la referencia del CharacterViewer
<VTTExportModal
  isOpen={isVTTExportModalOpen}
  onClose={handleCloseVTTExportModal}
  character={rpgCharacter}
  onExportToken={handleExportVTTToken}
  onExportCharacter={handleExportVTTCharacter}
  characterViewerRef={characterViewerRef} // ✅ NUEVO
/>
```

---

## 🎨 UI/UX Mejorada

### **Layout del Modal**
- **Ancho aumentado** de `max-w-4xl` a `max-w-6xl`
- **Sección de preview** siempre visible
- **Diseño responsive** para diferentes tamaños de pantalla

### **Preview Section**
```jsx
<div className="relative bg-slate-800 rounded-lg border-2 border-cyan-400/30 p-4">
  <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden border border-slate-600">
    {previewImage ? (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <img src={previewImage} alt="Preview del personaje" className="max-w-full max-h-full object-contain" />
            {/* Recuadro circular para token */}
            <div className="absolute inset-0 border-4 border-cyan-400 rounded-full opacity-70 pointer-events-none"></div>
            {/* Indicador de tamaño */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-cyan-600 text-white text-xs px-2 py-1 rounded">
              Token {tokenOptions.size}x{tokenOptions.size}
            </div>
          </div>
        </div>
      </div>
    ) : (
      // Placeholder cuando no hay imagen
    )}
  </div>
</div>
```

---

## 🚀 Funcionalidades Recuperadas

### **✅ Captura de Screenshot**
- Integración con `CharacterViewer.takeScreenshot()`
- Captura automática al abrir el modal
- Botón de actualización manual

### **✅ Preview Visual**
- Vista previa del personaje 3D
- Recuadro de selección para tokens
- Indicadores de tamaño y formato

### **✅ Información Contextual**
- Datos del arquetipo
- Estadísticas del personaje
- Compatibilidad y efectos visuales

---

## 🎯 Beneficios de la Implementación

### **Para Usuarios:**
- **Vista previa inmediata** del token que se va a exportar
- **Control visual** sobre el área de captura
- **Información contextual** del personaje

### **Para el Proyecto:**
- **Funcionalidad completa** de exportación VTT
- **UX mejorada** con feedback visual
- **Integración fluida** con el sistema 3D

### **Para VTT:**
- **Tokens optimizados** con recuadro circular
- **Múltiples formatos** y tamaños
- **Datos estructurados** para importación

---

## 🔍 Verificación

### **Comandos de Prueba:**
```bash
# Verificar que el servidor funciona
npm run dev

# Probar la funcionalidad
node scripts/test-vtt-preview.js
```

### **Flujo de Uso:**
1. **Crear personaje** en el customizer
2. **Hacer click** en "VTT Export" en el header
3. **Ver preview** automático del personaje
4. **Ajustar configuración** de token/character
5. **Exportar** en el formato deseado

---

## 📝 Notas Técnicas

### **Dependencias:**
- `CharacterViewer.takeScreenshot()` - Captura del canvas 3D
- `VTTService` - Lógica de exportación
- `RPGCharacterSync` - Datos del personaje

### **Compatibilidad:**
- **Roll20** - JSON con atributos
- **Foundry VTT** - Datos estructurados
- **Fantasy Grounds** - XML format
- **Generic** - JSON estándar

### **Formatos de Token:**
- **PNG** - Transparente, alta calidad
- **JPEG** - Comprimido, menor tamaño
- **WebP** - Moderno, optimizado

### **Tamaños:**
- **256x256** - Estándar
- **512x512** - Alta resolución
- **1024x1024** - Ultra alta resolución

---

## ✅ Estado Actual

### **Implementado:**
- ✅ Preview con captura automática
- ✅ Recuadro circular de selección
- ✅ Información del personaje
- ✅ Integración con CharacterViewer
- ✅ UI responsive y moderna
- ✅ Múltiples formatos de exportación

### **Funcionando:**
- ✅ Captura de screenshot
- ✅ Preview en tiempo real
- ✅ Configuración de tokens
- ✅ Exportación de personajes
- ✅ Interfaz de usuario

---

## 🎯 Próximos Pasos

### **Mejoras Futuras:**
1. **Ajuste manual** del recuadro de selección
2. **Previsualización** de diferentes formatos
3. **Historial** de exportaciones
4. **Templates** de tokens por arquetipo
5. **Integración directa** con VTT populares

### **Optimizaciones:**
1. **Cache** de capturas de pantalla
2. **Compresión** automática de imágenes
3. **Batch export** de múltiples personajes
4. **API endpoints** para integración externa

---

**Fecha de Implementación:** Enero 2025  
**Estado:** ✅ Completado y Funcionando  
**Versión:** 1.0.0 