# 🛡️ PROTECTION RULES - SISTEMA DE HOVER Y COMPATIBILIDAD

## 🚨 REGLAS CRÍTICAS QUE NUNCA DEBEN CAMBIAR

### ✅ **SISTEMA DE HOVER PREVIEW (PROTEGIDO)**

#### **En `components/PartSelectorPanel.tsx` - NUNCA MODIFICAR ESTA LÓGICA:**

```typescript
// ✅ PROTEGIDO - Lógica de hover para TORSO/SUIT_TORSO
if (activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO) {
  // ✅ CRÍTICO: Eliminar AMBOS cuando hover sobre TORSO
  if (activeCategory === PartCategory.TORSO) {
    delete partsWithoutCurrentTorso[PartCategory.TORSO];
    delete partsWithoutCurrentTorso[PartCategory.SUIT_TORSO];
  } else if (activeCategory === PartCategory.SUIT_TORSO) {
    delete partsWithoutCurrentTorso[PartCategory.SUIT_TORSO];
  }
  
  // ✅ APLICAR FUNCIONES DE COMPATIBILIDAD EN ORDEN
  const fullCompatibleParts = assignDefaultHandsForTorso(part, hoverPreviewParts);
  const finalCompatibleParts = assignAdaptiveHeadForTorso(part, fullCompatibleParts);
  const finalPartsWithSymbol = assignAdaptiveSymbolForTorso(part, finalCompatibleParts, partsWithSymbol);
  const finalPartsWithCape = assignAdaptiveCapeForTorso(part, finalCompatibleParts, partsWithCape);
  const finalPartsWithSuit = assignAdaptiveSuitTorsoForTorso(part, finalCompatibleParts, partsWithSuit);
  
  // ✅ COMBINAR TODOS LOS RESULTADOS
  hoverPreviewParts = { 
    ...partsWithoutCurrentTorso,
    ...finalCompatibleParts, 
    ...finalPartsWithSymbol, 
    ...finalPartsWithCape,
    ...finalPartsWithSuit,
    [activeCategory]: part 
  };
}

// ✅ PROTEGIDO - Lógica de hover para SYMBOL
else if (activeCategory === PartCategory.SYMBOL) {
  const currentTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
  if (currentTorso) {
    const symbolCompatibleParts = assignAdaptiveSymbolForTorso(currentTorso, hoverPreviewParts);
    hoverPreviewParts = { ...selectedParts, ...symbolCompatibleParts };
    if (part && !part.attributes?.none) {
      hoverPreviewParts[activeCategory] = part;
    }
  }
}
```

#### **En `components/PartSelectorPanel.tsx` - SELECCIÓN (PROTEGIDO):**

```typescript
// ✅ PROTEGIDO - Lógica de selección para TORSO/SUIT_TORSO
if (activeCategory === PartCategory.TORSO || activeCategory === PartCategory.SUIT_TORSO) {
  // ✅ CRÍTICO: Eliminar AMBOS cuando selección de TORSO
  if (activeCategory === PartCategory.TORSO) {
    delete newPreviewParts[PartCategory.TORSO];
    delete newPreviewParts[PartCategory.SUIT_TORSO];
  } else if (activeCategory === PartCategory.SUIT_TORSO) {
    delete newPreviewParts[PartCategory.SUIT_TORSO];
  }
  
  // ✅ APLICAR FUNCIONES DE COMPATIBILIDAD
  const finalPartsWithSuit = assignAdaptiveSuitTorsoForTorso(part, finalCompatibleParts, partsWithSuit);
  newPreviewParts = { ...newPreviewParts, ...finalCompatibleParts, ...finalPartsWithSuit };
}

// ✅ PROTEGIDO - Lógica de selección para SYMBOL
else if (activeCategory === PartCategory.SYMBOL) {
  const currentTorso = selectedParts[PartCategory.TORSO] || selectedParts[PartCategory.SUIT_TORSO];
  if (currentTorso) {
    const symbolCompatibleParts = assignAdaptiveSymbolForTorso(currentTorso, newPreviewParts);
    newPreviewParts = { ...newPreviewParts, ...symbolCompatibleParts, [activeCategory]: part };
  }
}
```

### ✅ **FUNCIONES DE COMPATIBILIDAD (PROTEGIDAS)**

#### **En `lib/utils.ts` - NUNCA MODIFICAR ESTAS FUNCIONES:**

```typescript
// ✅ PROTEGIDO - assignAdaptiveSuitTorsoForTorso
export function assignAdaptiveSuitTorsoForTorso(newTorso: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  // Si no hay suit_torso actual, no asignar ninguno (opcional)
  // Si es compatible, preservar el mismo tipo
  // Si no es compatible, eliminar
}

// ✅ PROTEGIDO - assignAdaptiveSymbolForTorso  
export function assignAdaptiveSymbolForTorso(newTorso: Part, currentParts: SelectedParts, originalParts?: SelectedParts): SelectedParts {
  // Si no hay symbol actual, usar primero compatible
  // Si es compatible, mantener
  // Si no es compatible, buscar mismo tipo o usar primero compatible
}

// ✅ PROTEGIDO - assignDefaultHandsForTorso
export function assignDefaultHandsForTorso(newTorso: Part, currentParts: SelectedParts): SelectedParts {
  // Preservar tipo de arma y guantes
  // Buscar compatible del mismo tipo
  // Fallback a compatible sin guantes
}
```

### ✅ **IMPORTS REQUERIDOS (PROTEGIDOS)**

#### **En `components/PartSelectorPanel.tsx`:**
```typescript
// ✅ NUNCA ELIMINAR ESTOS IMPORTS
import { 
  assignDefaultHandsForTorso, 
  assignAdaptiveHeadForTorso, 
  assignAdaptiveBootsForTorso, 
  assignAdaptiveCapeForTorso, 
  assignAdaptiveSymbolForTorso, 
  assignAdaptiveSuitTorsoForTorso 
} from '../lib/utils';
```

#### **En `App.tsx`:**
```typescript
// ✅ NUNCA ELIMINAR ESTOS IMPORTS
import { 
  assignDefaultHandsForTorso, 
  assignAdaptiveHeadForTorso, 
  assignAdaptiveCapeForTorso, 
  assignAdaptiveBootsForTorso, 
  assignAdaptiveSymbolForTorso, 
  assignAdaptiveSuitTorsoForTorso 
} from './lib/utils';
```

## 🔒 **REGLAS DE PROTECCIÓN**

### **❌ NUNCA HACER:**

1. **NO eliminar las funciones `assignAdaptive*ForTorso`**
2. **NO cambiar la lógica de eliminación en hover/selección**
3. **NO modificar el orden de aplicación de funciones**
4. **NO cambiar los imports de funciones de compatibilidad**
5. **NO eliminar la lógica especial para TORSO/SUIT_TORSO/SYMBOL**

### **❌ PATRONES PROHIBIDOS:**

```typescript
// ❌ NO HACER - Eliminar solo una parte cuando debería eliminar ambas
if (activeCategory === PartCategory.TORSO) {
  delete parts[PartCategory.TORSO]; // ✅ OK
  // ❌ FALTA: delete parts[PartCategory.SUIT_TORSO];
}

// ❌ NO HACER - No aplicar funciones de compatibilidad
hoverPreviewParts = { [activeCategory]: part }; // Sin compatibilidad

// ❌ NO HACER - Cambiar orden de funciones
const suit = assignAdaptiveSuitTorsoForTorso(...);
const hands = assignDefaultHandsForTorso(...); // ❌ Orden incorrecto
```

### **✅ PATRONES OBLIGATORIOS:**

```typescript
// ✅ SIEMPRE - Eliminar dependencias correctamente
if (activeCategory === PartCategory.TORSO) {
  delete parts[PartCategory.TORSO];
  delete parts[PartCategory.SUIT_TORSO]; // ✅ OBLIGATORIO
}

// ✅ SIEMPRE - Aplicar todas las funciones de compatibilidad
const hands = assignDefaultHandsForTorso(part, hoverPreviewParts);
const head = assignAdaptiveHeadForTorso(part, hands);
const symbol = assignAdaptiveSymbolForTorso(part, head, symbolParts);
const cape = assignAdaptiveCapeForTorso(part, head, capeParts);
const suit = assignAdaptiveSuitTorsoForTorso(part, head, suitParts);

// ✅ SIEMPRE - Combinar todos los resultados
hoverPreviewParts = { 
  ...partsWithoutCurrent,
  ...hands, ...head, ...symbol, ...cape, ...suit,
  [activeCategory]: part 
};
```

## 🛡️ **VERIFICACIÓN DE PROTECCIÓN**

### **Script de Verificación:**
```bash
# Verificar que las funciones existen
grep -n "assignAdaptiveSuitTorsoForTorso" lib/utils.ts
grep -n "assignAdaptiveSymbolForTorso" lib/utils.ts

# Verificar imports en PartSelectorPanel
grep -n "assignAdaptiveSuitTorsoForTorso" components/PartSelectorPanel.tsx

# Verificar lógica de eliminación
grep -A 5 "delete.*SUIT_TORSO" components/PartSelectorPanel.tsx
```

### **Logs de Confirmación:**
```typescript
// ✅ Estos logs DEBEN aparecer
🔄 TORSO HOVER: Recalculating compatible parts
🔄 SYMBOL HOVER: Recalculating compatible symbol
🔍 assignAdaptiveSuitTorsoForTorso called with:
🔍 assignAdaptiveSymbolForTorso called with:
```

## 🚨 **ACCIÓN EN CASO DE ROTURA**

### **Si el sistema se rompe:**

1. **Verificar imports** en PartSelectorPanel.tsx y App.tsx
2. **Verificar funciones** en lib/utils.ts existen
3. **Verificar lógica** de eliminación en hover/selección
4. **Restaurar desde** esta documentación
5. **Ejecutar tests** de verificación

### **Recuperación de Emergencia:**

```bash
# Restaurar funciones críticas
git checkout HEAD -- lib/utils.ts
git checkout HEAD -- components/PartSelectorPanel.tsx

# O usar los patterns protegidos de este documento
```

## 📋 **CHECKLIST DE PROTECCIÓN**

- [ ] ✅ Funciones de compatibilidad existen en lib/utils.ts
- [ ] ✅ Imports correctos en PartSelectorPanel.tsx y App.tsx  
- [ ] ✅ Lógica de eliminación TORSO → SUIT_TORSO en hover
- [ ] ✅ Lógica de eliminación TORSO → SUIT_TORSO en selección
- [ ] ✅ Lógica especial para SYMBOL en hover y selección
- [ ] ✅ Orden correcto de aplicación de funciones
- [ ] ✅ Combinación correcta de resultados

---

**⚠️ ADVERTENCIA FINAL:**

**ESTE SISTEMA HA SIDO PROBADO Y FUNCIONA PERFECTAMENTE.**  
**CUALQUIER MODIFICACIÓN DEBE PASAR POR ESTA DOCUMENTACIÓN PRIMERO.**  
**NO CAMBIAR SIN VERIFICAR IMPACTO EN TODA LA FUNCIONALIDAD.**

---

*Documentación de Protección creada: 2025-01-19*  
*Estado: SISTEMA PROTEGIDO* ✅ 