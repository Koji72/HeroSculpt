# 🛡️ REGLA CRÍTICA: Protección del Sistema de Manos

## 🚨 **ADVERTENCIA IMPORTANTE**
**Esta regla es OBLIGATORIA y NUNCA debe ser ignorada. El sistema de manos es crítico para el funcionamiento del proyecto.**

---

## 📋 **Regla Principal**

### **NUNCA modificar estos elementos del sistema de manos:**

#### 1. **Tipo SelectedParts (CRÍTICO)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
export type SelectedParts = { [category: string]: Part };

// ❌ INCORRECTO - Causaba duplicación de manos
// export type SelectedParts = { [partId: string]: Part };
```

#### 2. **Patrón de Gestión de Estado (CRÍTICO)**
```typescript
// ✅ CORRECTO - Siempre usar categorías
delete newParts[PartCategory.HAND_LEFT];
newParts[PartCategory.HAND_LEFT] = part;

// ❌ INCORRECTO - Causaba acumulación de manos
// delete newParts[part.id];
// newParts[part.id] = part;
```

#### 3. **Verificación de Compatibilidad (OBLIGATORIO)**
```typescript
// ✅ REQUERIDO - Verificar compatibilidad
const isCompatible = part.compatible.includes(baseTorsoId);
if (!isCompatible) {
  return false; // No cargar parte incompatible
}
```

---

## 🎯 **Puntos Críticos a Proteger**

### **Archivos que NUNCA deben cambiar su lógica:**
1. **`types.ts`** - Definición de `SelectedParts`
2. **`lib/utils.ts`** - Funciones de asignación de manos
3. **`components/CharacterViewer.tsx`** - Verificación de compatibilidad
4. **`App.tsx`** - Gestión de estado con categorías

### **Patrones que SIEMPRE deben mantenerse:**
- Usar `PartCategory` como keys, nunca part IDs
- Verificar compatibilidad antes de cargar modelos
- Preservar manos compatibles al cambiar torso
- Limpiar la escena 3D correctamente

---

## 🔍 **Verificación Rápida**

Si necesitas verificar que todo está correcto, usa estos comandos:

```bash
# Verificar integridad de archivos críticos (OBLIGATORIO)
node scripts/protect-critical-files.js --verify

# Verificar sistema de manos
node scripts/verify-hands-system.js

# Verificar tipo SelectedParts
grep "SelectedParts.*=" types.ts

# Verificar patrones de estado
grep "delete.*newParts\[" App.tsx

# Verificar funciones de utilidad
grep "newParts\[.*\] = " lib/utils.ts

# Verificar compatibilidad
grep "compatible.includes" components/CharacterViewer.tsx
```

---

## 📚 **Documentación de Referencia**

Las reglas incluyen referencias a:
- `docs/HANDS_DUPLICATION_FIX_2025.md` - Solución completa
- `docs/PROBLEMS_SOLUTIONS_SUMMARY_2025.md` - Resumen ejecutivo
- `docs/DOCUMENTATION_INDEX.md` - Índice completo

---

## 🎯 **Beneficios de Estas Reglas**

### **Para el Proyecto:**
- ✅ **Protege las soluciones** implementadas
- ✅ **Previene regresiones** de bugs ya resueltos
- ✅ **Mantiene consistencia** en el código
- ✅ **Facilita el mantenimiento** futuro

### **Para el Desarrollo:**
- ✅ **Guía clara** para nuevos cambios
- ✅ **Patrones establecidos** para seguir
- ✅ **Verificación rápida** de implementación correcta
- ✅ **Recuperación de emergencia** si algo se rompe

---

## 🚨 **Sanciones por Incumplimiento**

### **Si se modifica accidentalmente:**
1. **REVERTIR inmediatamente** los cambios
2. **Verificar** que no hay duplicación de manos
3. **Probar** la funcionalidad completa
4. **Documentar** el incidente

### **Si se rompe el sistema:**
1. **Restaurar** desde el último commit funcional
2. **Revisar** la documentación de soluciones
3. **Aplicar** las correcciones conocidas
4. **Verificar** que todo funciona correctamente

---

## 📞 **Contacto de Emergencia**

Si tienes dudas sobre esta regla o necesitas ayuda:
1. **Revisar** `docs/HANDS_DUPLICATION_FIX_2025.md`
2. **Verificar** los patrones de código establecidos
3. **Consultar** la documentación de soluciones
4. **Probar** en un entorno de desarrollo antes de aplicar cambios

---

**Última actualización**: Enero 2025  
**Estado**: ✅ ACTIVA Y OBLIGATORIA  
**Prioridad**: 🔴 CRÍTICA 