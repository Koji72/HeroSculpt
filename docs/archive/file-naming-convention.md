# Nomenclatura de Archivos

## Estructura General

```
[arquetipo]_[parte]_[número]_[tipo]_[variante].glb
```

## Componentes de la Nomenclatura

### 1. Arquetipo (Prefijo)
- `fuerte` - Para el arquetipo Fuerte
- `agil` - Para el arquetipo Ágil
- `magico` - Para el arquetipo Mágico
- `tech` - Para el arquetipo Tech
- `justiciero` - Para el arquetipo Justiciero

### 2. Parte
- `torso` - Torso
- `piernas` - Piernas
- `cabeza` - Cabeza
- `hands` - Manos
- `cape` - Capa
- `symbol` - Símbolo
- `beltchest` - Cinturón/Pecho
- `base` - Base

### 3. Número
- Formato: `01`, `02`, `03`, etc.
- Siempre dos dígitos
- Comienza en 01

### 4. Tipo (Opcional)
- `t01` - Tipo 1
- `t02` - Tipo 2
- etc.

### 5. Variante (Opcional)
- `nc` - No Capa (No Cape)
- `g` - Enguantado (Gloved)
- `r` - Derecha (Right)
- `l` - Izquierda (Left)

## Ejemplos

### Torsos
```
fuerte_torso_01.glb
fuerte_torso_02.glb
fuerte_torso_03.glb
```

### Manos
```
fuerte_hands_hammer_01_t01_r_g.glb  // Mano derecha enguantada con martillo
fuerte_hands_hammer_01_t01_l_g.glb  // Mano izquierda enguantada con martillo
fuerte_hands_hammer_01_t01_r.glb    // Mano derecha sin guante con martillo
```

### Capas
```
fuerte_cape_01_t01.glb      // Capa normal
fuerte_cape_01_t01_nc.glb   // Sin capa
```

### Símbolos
```
fuerte_symbol_01.glb
fuerte_symbol_02.glb
fuerte_symbol_sin_simbolo_01.glb
```

## Reglas Importantes

1. **Consistencia**
   - Usar siempre minúsculas
   - Separar palabras con guiones bajos (_)
   - No usar espacios ni caracteres especiales

2. **Numeración**
   - Siempre usar dos dígitos (01, 02, etc.)
   - Mantener secuencia lógica
   - No saltar números

3. **Variantes**
   - Usar sufijos cortos y descriptivos
   - Mantener consistencia en los sufijos
   - Documentar nuevas variantes

4. **Compatibilidad**
   - Asegurar que los nombres sean compatibles con sistemas de archivos
   - Evitar nombres demasiado largos
   - No usar caracteres especiales

## Estructura de Directorios

```
public/assets/
├── fuerte/
│   ├── torso/
│   ├── piernas/
│   ├── cabeza/
│   ├── hands/
│   ├── cape/
│   ├── symbol/
│   ├── beltchest/
│   └── base/
├── agil/
├── magico/
├── tech/
└── justiciero/
```

## Scripts de Renombrado

Se han creado scripts para automatizar el proceso de renombrado:

1. `mover_modelos.ps1` - Para renombrar y mover modelos
2. `mover_piernas.ps1` - Específico para renombrar piernas

## Validación

Para validar que un nombre de archivo sigue la convención:

1. Debe comenzar con el arquetipo correcto
2. Debe incluir la parte correspondiente
3. Debe tener un número de dos dígitos
4. Las variantes deben seguir el formato establecido
5. La extensión debe ser .glb

## Historial de Cambios

- [Fecha] - Creado documento
- [Fecha] - Añadida sección de validación
- [Fecha] - Actualizada lista de variantes 