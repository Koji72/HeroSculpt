# 🎯 **README: Sistema de Torsos - Guía Rápida 2025**

## 📋 **Descripción**

Este README proporciona una guía rápida para entender y trabajar con el sistema de torsos del customizador 3D. El sistema ha sido completamente reescrito para resolver todos los problemas críticos de duplicación, desaparición y sincronización.

---

## 🚀 **Estado Actual**

### **✅ SISTEMA COMPLETAMENTE FUNCIONAL**
- ✅ **Duplicación de manos:** Eliminada
- ✅ **Desaparición de partes:** Resuelta
- ✅ **Sincronización suit-torso:** Perfecta
- ✅ **Hover preview:** Funcionando
- ✅ **Preservación:** Total

---

## 🏗️ **Arquitectura Clave**

### **1. Constantes Críticas**
```typescript
// constants.ts
export const TORSO_DEPENDENT_CATEGORIES = [
  PartCategory.SUIT_TORSO
];
```

### **2. Tipo de Estado**
```typescript
// types.ts
export type SelectedParts = { [category: string]: Part };
```

### **3. Patrón de Preservación**
```typescript
// 1. Preservar antes de eliminar
const currentParts = { /* partes actuales */ };

// 2. Eliminar solo dependientes
TORSO_DEPENDENT_CATEGORIES.forEach(dep => {
  delete newParts[dep];
});

// 3. Asignar nueva parte
newParts[category] = part;

// 4. Aplicar funciones de preservación
newParts = assignDefaultHandsForTorso(part, tempParts);
```

---

## 📁 **Archivos Críticos**

### **Archivos Principales:**
- `constants.ts` - Constantes de control
- `types.ts` - Definiciones de tipos
- `App.tsx` - Lógica principal de estado
- `lib/utils.ts` - Funciones de preservación
- `components/PartSelectorPanel.tsx` - Lógica de hover

### **Scripts de Verificación:**
- `scripts/definitive-torso-test.cjs` - Test completo
- `scripts/test-torso-hover-fix.cjs` - Test de hover
- `scripts/test-suit-torso-sync.cjs` - Test de sincronización

---

## 🔧 **Reglas Críticas (NUNCA CAMBIAR)**

### **1. Usar Categorías como Keys**
```typescript
// ✅ CORRECTO
export type SelectedParts = { [category: string]: Part };
delete newParts[PartCategory.HAND_LEFT];
newParts[PartCategory.HAND_LEFT] = part;

// ❌ INCORRECTO
export type SelectedParts = { [partId: string]: Part };
delete newParts[part.id];
newParts[part.id] = part;
```

### **2. Preservar Antes de Eliminar**
```typescript
// ✅ CORRECTO
const currentLeftHand = Object.values(newParts).find(p => p.category === PartCategory.HAND_LEFT);
// Luego eliminar dependientes
TORSO_DEPENDENT_CATEGORIES.forEach(dep => {
  delete newParts[dep];
});

// ❌ INCORRECTO
delete newParts[PartCategory.SUIT_TORSO]; // Eliminar inmediatamente
// Las funciones de preservación no encuentran las partes
```

### **3. Eliminar Solo Dependientes**
```typescript
// ✅ CORRECTO
TORSO_DEPENDENT_CATEGORIES.forEach(dep => {
  delete newParts[dep];
});

// ❌ INCORRECTO
delete newParts[PartCategory.HAND_LEFT]; // Eliminar manos
delete newParts[PartCategory.HEAD]; // Eliminar cabeza
```

### **4. Aplicar Funciones de Preservación**
```typescript
// ✅ CORRECTO
newParts = assignDefaultHandsForTorso(part, tempParts);
newParts = assignAdaptiveHeadForTorso(part, newParts, partsWithHead);
newParts = assignAdaptiveCapeForTorso(part, newParts, partsWithCape);
```

### **5. Eliminar Parte Actual en Hover**
```typescript
// ✅ CORRECTO
const partsWithoutCurrentTorso = { ...selectedParts };
delete partsWithoutCurrentTorso[activeCategory];
hoverPreviewParts = { ...partsWithoutCurrentTorso, [activeCategory]: part };

// ❌ INCORRECTO
hoverPreviewParts = { ...selectedParts, [activeCategory]: part };
```

---

## 🧪 **Verificación Rápida**

### **Comandos de Verificación:**
```bash
# Test completo del sistema
node scripts/definitive-torso-test.cjs

# Test específico de hover
node scripts/test-torso-hover-fix.cjs

# Test de sincronización
node scripts/test-suit-torso-sync.cjs
```

### **Verificación Manual:**
1. **Cambiar torso:** Las manos no se duplican
2. **Cambiar suit:** Se sincroniza correctamente
3. **Hover sobre torso:** El torso actual desaparece
4. **Preservación:** Todas las partes se mantienen

---

## 🐛 **Problemas Comunes y Soluciones**

### **Problema: Manos se duplican**
**Causa:** Uso de part IDs en lugar de categorías
**Solución:** Verificar que `SelectedParts` use categorías como keys

### **Problema: Partes desaparecen**
**Causa:** Eliminación prematura antes de preservar
**Solución:** Aplicar patrón "preservar antes de eliminar"

### **Problema: Hover no funciona**
**Causa:** Inclusión del torso actual en preview
**Solución:** Eliminar parte actual antes del preview

### **Problema: Sincronización rota**
**Causa:** Eliminación doble o prematura
**Solución:** Usar `TORSO_DEPENDENT_CATEGORIES` para control centralizado

---

## 📚 **Documentación Completa**

### **Documentos Principales:**
- `docs/TORSO_SYSTEM_FINAL_FIX_2025.md` - Documentación completa
- `docs/CHANGELOG_TORSO_SYSTEM_2025.md` - Changelog detallado
- `docs/HANDS_DUPLICATION_FIX_2025.md` - Solución de duplicación
- `docs/HOVER_PREVIEW_FIX_2025.md` - Solución de hover

### **Documentos Relacionados:**
- `docs/PROBLEMS_SOLUTIONS_SUMMARY_2025.md` - Resumen ejecutivo
- `docs/DOCUMENTATION_INDEX.md` - Índice completo

---

## 🎯 **Flujo de Trabajo Recomendado**

### **Para Nuevos Desarrolladores:**
1. Leer este README
2. Ejecutar scripts de verificación
3. Probar funcionalidades manualmente
4. Consultar documentación completa si es necesario

### **Para Modificaciones:**
1. Verificar que no se violen las reglas críticas
2. Ejecutar scripts de verificación después de cambios
3. Probar funcionalidades manualmente
4. Actualizar documentación si es necesario

### **Para Debugging:**
1. Ejecutar scripts de verificación
2. Revisar logs de consola
3. Verificar constantes críticas
4. Consultar documentación de problemas específicos

---

## 🚨 **Advertencias Importantes**

### **⚠️ NUNCA CAMBIAR:**
- Definición de `SelectedParts` en `types.ts`
- Constante `TORSO_DEPENDENT_CATEGORIES` en `constants.ts`
- Patrón de preservación en `App.tsx`
- Lógica de hover en `PartSelectorPanel.tsx`

### **⚠️ SIEMPRE VERIFICAR:**
- Que se usen categorías como keys
- Que se preserve antes de eliminar
- Que se eliminen solo dependientes
- Que se apliquen funciones de preservación

---

## 🎉 **Conclusión**

**El sistema de torsos está configurado correctamente PARA SIEMPRE.**

Todas las reglas críticas han sido implementadas y verificadas. La aplicación está lista para uso en producción con un sistema de torsos robusto y confiable.

**¡Mantén estas reglas y el sistema funcionará perfectamente!**

---

*README creado: 2025*
*Última actualización: 2025*
*Estado: ✅ COMPLETADO* 