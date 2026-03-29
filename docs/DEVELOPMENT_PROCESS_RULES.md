# 🚨 REGLAS OBLIGATORIAS DEL PROCESO DE DESARROLLO

## ⚠️ **ADVERTENCIA CRÍTICA**
**Estas reglas son OBLIGATORIAS y NUNCA deben ser ignoradas. Violarlas puede romper el sistema de manos.**

---

## 📋 **Proceso Obligatorio ANTES de Cualquier Cambio**

### 1. **Verificación Previa (OBLIGATORIA)**
```bash
# SIEMPRE ejecutar antes de hacer cambios
node scripts/protect-critical-files.js --verify
node scripts/verify-hands-system.js
```

**Si alguno falla → NO hacer cambios**

### 2. **Regla de Un Solo Archivo**
- **NUNCA** modificar múltiples archivos críticos a la vez
- **SIEMPRE** hacer cambios en un solo archivo por vez
- **VERIFICAR** después de cada cambio

### 3. **Proceso de Cambio Seguro**
```
1. Verificar integridad → ✅ OK
2. Hacer cambio en UN archivo
3. Verificar integridad → ✅ OK
4. Probar funcionalidad
5. Si algo falla → Revertir inmediatamente
```

---

## 🛡️ **Archivos Críticos Protegidos**

### **NUNCA Modificar Sin Verificación:**
- `types.ts` - Definición de tipos
- `lib/utils.ts` - Funciones de utilidad
- `App.tsx` - Componente principal
- `components/CharacterViewer.tsx` - Visor 3D

### **Sistema de Protección:**
- **Hashes guardados** en `.critical-files-hash.json`
- **Verificación automática** con `protect-critical-files.js`
- **Alerta inmediata** si se detectan cambios

---

## 🚨 **Sanciones por Violación**

### **Si se violan las reglas:**
1. **DETENER** inmediatamente el desarrollo
2. **REVERTIR** todos los cambios
3. **VERIFICAR** integridad de archivos
4. **DOCUMENTAR** la violación
5. **REVISAR** el proceso

### **Si se rompe el sistema:**
1. **Restaurar** desde último commit funcional
2. **Aplicar** solo cambios seguros
3. **Verificar** que todo funciona
4. **No continuar** hasta que esté estable

---

## 🔧 **Comandos de Emergencia**

### **Verificación Rápida:**
```bash
# Verificar todo el sistema
node scripts/protect-critical-files.js --verify && node scripts/verify-hands-system.js
```

### **Restauración de Emergencia:**
```bash
# Restaurar archivos críticos
git restore types.ts lib/utils.ts App.tsx components/CharacterViewer.tsx

# Verificar restauración
node scripts/protect-critical-files.js --verify
```

### **Regenerar Protección:**
```bash
# Si se necesita actualizar hashes (solo cuando esté todo estable)
node scripts/protect-critical-files.js --save
```

---

## 📚 **Documentación de Referencia**

### **Reglas Específicas:**
- `docs/HANDS_PROTECTION_RULE.md` - Regla de manos
- `docs/README_PROTECTION_RULES.md` - Reglas generales

### **Scripts de Verificación:**
- `scripts/protect-critical-files.js` - Protección de archivos
- `scripts/verify-hands-system.js` - Verificación de manos

---

## 🎯 **Beneficios del Sistema**

### **Para el Proyecto:**
- ✅ **Prevención** de regresiones
- ✅ **Detección temprana** de problemas
- ✅ **Restauración rápida** en emergencias
- ✅ **Confianza** en el desarrollo

### **Para el Desarrollador:**
- ✅ **Guía clara** de qué hacer
- ✅ **Verificación automática** de seguridad
- ✅ **Proceso establecido** para cambios
- ✅ **Protección** contra errores

---

## 📞 **Contacto de Emergencia**

### **Si hay dudas:**
1. **NO hacer cambios** hasta aclarar
2. **Consultar** la documentación
3. **Ejecutar** verificaciones
4. **Buscar** ayuda si es necesario

### **Si algo se rompe:**
1. **DETENER** desarrollo
2. **REVERTIR** cambios
3. **VERIFICAR** integridad
4. **DOCUMENTAR** problema

---

**Última actualización**: Enero 2025  
**Estado**: ✅ ACTIVO Y OBLIGATORIO  
**Prioridad**: 🔴 CRÍTICA 