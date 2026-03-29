# 🛡️ REGLAS DE PROTECCIÓN - Sistema de Navegación de Poses 2025

## 🚨 **REGLAS CRÍTICAS QUE NUNCA DEBEN CAMBIARSE**

### **✅ Variable de Control (CRÍTICA)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
const [isNavigatingPoses, setIsNavigatingPoses] = useState(false);

// ❌ INCORRECTO - Causaría que las poses no se carguen
// const [isNavigatingPoses, setIsNavigatingPoses] = useState(true);
```

### **✅ Protección en useEffect (CRÍTICA)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
useEffect(() => {
  // ✅ NUEVO: NO ejecutar durante navegación entre poses
  if (isNavigatingPoses) {
    console.log('🔍 DEBUG - updateCurrentPoseConfiguration saltado (navegación en progreso)');
    return;
  }
  
  const updateCurrentPoseConfiguration = async () => {
    // ... lógica de actualización
  };

  // Actualizar con un delay para evitar demasiadas actualizaciones (delay aumentado)
  const timeoutId = setTimeout(updateCurrentPoseConfiguration, 800);
  return () => clearTimeout(timeoutId);
}, [selectedParts, currentPoseIndex, user?.id, isNavigatingPoses]);
```

### **✅ Funciones de Navegación (CRÍTICAS)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
const handlePreviousPose = () => {
  // ... validaciones
  
  // ✅ NUEVO: Activar bandera de navegación
  setIsNavigatingPoses(true);
  
  setCurrentPoseIndex(newIndex);
  setSelectedParts(newPose.configuration);
  
  // ✅ NUEVO: Desactivar bandera después de un delay
  setTimeout(() => {
    setIsNavigatingPoses(false);
    console.log('  ✅ Bandera de navegación desactivada');
  }, 100);
};
```

### **✅ Carga Inicial en loadUserPoses (CRÍTICA)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
if (lastPoseIndex !== -1) {
  console.log('    - ✅ Aplicando última pose del usuario (índice:', lastPoseIndex, ')');
  setCurrentPoseIndex(lastPoseIndex);
  // ✅ NUEVO: Activar bandera temporalmente para evitar interferencia
  setIsNavigatingPoses(true);
  setSelectedParts(allPoses[lastPoseIndex].configuration);
  // ✅ NUEVO: Desactivar bandera después de aplicar la pose (delay aumentado)
  setTimeout(() => {
    setIsNavigatingPoses(false);
    console.log('    - ✅ Bandera de navegación desactivada después de cargar última pose');
  }, 300);
}
```

### **✅ Renderizado Condicional (CRÍTICO)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
{/* Library Navigation - Top Left - SOLO PARA USUARIOS AUTENTICADOS */}
{isAuthenticated && (
  <PoseNavigation
    savedPoses={savedPoses || []}
    currentPoseIndex={currentPoseIndex}
    onPreviousPose={onPreviousPose || (() => {})}
    onNextPose={onNextPose || (() => {})}
    onSelectPose={onSelectPose || (() => {})}
    onRenamePose={onRenamePose}
    onSaveAsNew={onSaveAsNew}
  />
)}

// ❌ INCORRECTO - Causaría que usuarios no logueados vean las flechas
// {savedPoses && savedPoses.length > 0 && (
```

### **✅ Posicionamiento de Cámara (CRÍTICO)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
// ✅ AJUSTADO: Multiplicador reducido a 1.1 para acercar como estaba originalmente
const distance = (maxDim / (2 * Math.tan(fov / 2))) * 1.1;

// ✅ AJUSTADO: Distancia por defecto reducida a 4 para posición original
spherical.radius = 4;

// ❌ INCORRECTO - Cámara muy lejos
// const distance = (maxDim / (2 * Math.tan(fov / 2))) * 2.5;
// spherical.radius = 8;
```

### **✅ Restauración de Cámara en Login (CRÍTICA)**
```typescript
// ✅ CORRECTO - NUNCA CAMBIAR
// ✅ NUEVO: Restaurar posición de la cámara después del login (más cerca del modelo)
setTimeout(() => {
  handleResetCamera();
  console.log('✅ Cámara restaurada después del login');
}, 800); // Delay aumentado para asegurar que el modelo se haya cargado completamente

// ❌ INCORRECTO - Timing incorrecto
// setTimeout(() => {
//   handleResetCamera();
// }, 100);
```

---

## 🔧 **ARCHIVOS PROTEGIDOS**

### **App.tsx - LÍNEAS CRÍTICAS:**
- **Líneas 102-104**: Variable `isNavigatingPoses` - NO TOCAR
- **Líneas 408-453**: Protección en `loadUserPoses` - NO TOCAR
- **Líneas 577-581**: Restauración de cámara - NO TOCAR
- **Líneas 610-701**: Protección en `updateCurrentPoseConfiguration` - NO TOCAR
- **Líneas 1374-1434**: Funciones de navegación - NO TOCAR

### **components/CharacterViewer.tsx - LÍNEAS CRÍTICAS:**
- **Líneas 170-171**: Multiplicador de distancia 1.1 - NO TOCAR
- **Líneas 181-182**: Distancia por defecto 4 - NO TOCAR
- **Líneas 1990-2001**: Renderizado condicional - NO TOCAR

---

## 🚫 **OPERACIONES PROHIBIDAS**

### **❌ NUNCA HACER:**
1. **Eliminar la variable `isNavigatingPoses`**
2. **Cambiar la condición `if (isNavigatingPoses)` en el useEffect**
3. **Remover `setIsNavigatingPoses(true)` de las funciones de navegación**
4. **Cambiar el delay de 300ms en `loadUserPoses`**
5. **Cambiar el delay de 800ms en `updateCurrentPoseConfiguration`**
6. **Cambiar el delay de 800ms en restauración de cámara**
7. **Cambiar el multiplicador de distancia de 1.1**
8. **Cambiar la distancia por defecto de 4**
9. **Remover la condición `isAuthenticated &&` del renderizado**
10. **Agregar `savedPoses.length > 0` al renderizado condicional**

### **❌ NUNCA MODIFICAR:**
- **Dependencias del useEffect** de `updateCurrentPoseConfiguration`
- **Timing de los setTimeout** en cualquier función
- **Lógica de activación/desactivación** de `isNavigatingPoses`
- **Condiciones de renderizado** de `PoseNavigation`

---

## ✅ **OPERACIONES PERMITIDAS**

### **✅ SÍ SE PUEDE HACER:**
1. **Agregar logs de debug** (sin cambiar lógica)
2. **Mejorar comentarios** (sin cambiar código)
3. **Optimizar performance** (sin cambiar funcionalidad)
4. **Agregar nuevas funcionalidades** (sin tocar las existentes)
5. **Mejorar UI/UX** (sin cambiar lógica de navegación)

---

## 🔍 **VERIFICACIÓN RÁPIDA**

### **Comandos para verificar que todo está correcto:**
```bash
# Verificar variable isNavigatingPoses
grep "isNavigatingPoses.*useState" App.tsx

# Verificar protección en useEffect
grep "if (isNavigatingPoses)" App.tsx

# Verificar funciones de navegación
grep "setIsNavigatingPoses(true)" App.tsx

# Verificar renderizado condicional
grep "isAuthenticated &&" components/CharacterViewer.tsx

# Verificar multiplicador de distancia
grep "1.1" components/CharacterViewer.tsx
```

---

## 🚨 **PROCEDIMIENTO DE EMERGENCIA**

### **Si algo se rompe:**
1. **NO tocar el código** - Documentar el problema
2. **Restaurar desde backup**: `backup-pose-navigation-login-fix-2025`
3. **Verificar reglas** de este documento
4. **Consultar documentación**: `docs/POSE_NAVIGATION_LOGIN_FIX_2025.md`

---

## 📋 **CHECKLIST DE PROTECCIÓN**

- [ ] **Variable `isNavigatingPoses`** presente y correcta
- [ ] **Protección en useEffect** funcionando
- [ ] **Funciones de navegación** con bandera activada
- [ ] **Carga inicial** con protección temporal
- [ ] **Renderizado condicional** solo para autenticados
- [ ] **Posicionamiento de cámara** con multiplicador 1.1
- [ ] **Restauración de cámara** con delay 800ms
- [ ] **Documentación** actualizada
- [ ] **Backup** creado y verificado

---

## 🎯 **ESTADO FINAL PROTEGIDO**

- **Sistema de Navegación de Poses**: ✅ **PROTEGIDO AL 100%**
- **Carga de Poses en Login**: ✅ **PROTEGIDO**
- **Posicionamiento de Cámara**: ✅ **PROTEGIDO**
- **Renderizado Condicional**: ✅ **PROTEGIDO**
- **Protección contra Interferencias**: ✅ **PROTEGIDO**

---

*Reglas de protección creadas el 2025 - Sistema de navegación de poses completamente blindado* 