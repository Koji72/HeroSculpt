# Sistema de Hojas de Personaje RPG

Este sistema permite crear y gestionar hojas de personaje para diferentes juegos de rol, integrado en la aplicación de personalización de superhéroes.

## Características

- **Múltiples sistemas RPG**: Soporte para Mutants & Masterminds y Champions
- **Interfaz unificada**: Sistema modular que permite agregar nuevos juegos fácilmente
- **Persistencia local**: Los personajes se guardan en localStorage
- **Importación/Exportación**: Funcionalidad para compartir personajes
- **Edición en tiempo real**: Modo de edición con validación de datos

## Sistemas Soportados

### Mutants & Masterminds
- Sistema basado en d20 para superhéroes
- Características: Defensas, Habilidades, Ataques, Poderes, Condiciones
- Nivel de personaje configurable
- Sistema de complicaciones

### Champions
- Sistema Hero System para superhéroes
- Características: 14 características principales
- Sistema de habilidades con tipos y costos
- Poderes con costos de END
- Complicaciones psicológicas y físicas
- Seguimiento de experiencia

## Estructura de Archivos

```
components/rpg-sheets/
├── BaseCharacterSheet.tsx          # Componente base y tipos
├── MutantsAndMastermindsSheet.tsx  # Hoja específica para M&M
├── ChampionsSheet.tsx              # Hoja específica para Champions
├── RPGSheetRegistry.tsx            # Registro de sistemas y utilidades
├── RPGCharacterSheetManager.tsx    # Gestor principal
├── index.ts                        # Exportaciones
└── README.md                       # Esta documentación
```

## Uso

### Acceso desde la aplicación
1. Haz clic en el botón "RPG Sheets" en el header
2. Selecciona un sistema RPG
3. Crea un nuevo personaje o carga uno existente
4. Edita los datos del personaje
5. Guarda los cambios

### Agregar un nuevo sistema RPG

1. **Crear la interfaz de datos**:
```typescript
export interface NewRPGCharacterData extends BaseCharacterData {
  // Definir las propiedades específicas del sistema
  characteristics: { [key: string]: number };
  skills: Array<{ name: string; value: number }>;
  // ... más propiedades
}
```

2. **Crear el componente de hoja**:
```typescript
const NewRPGSheet: React.FC<CharacterSheetProps> = ({
  character,
  isEditing,
  onCharacterChange,
  onToggleEdit
}) => {
  // Implementar la interfaz de usuario
  return (
    <div>
      {/* UI específica del sistema */}
    </div>
  );
};
```

3. **Registrar el sistema**:
```typescript
// En RPGSheetRegistry.tsx
export const RPG_SYSTEMS: RPGSystem[] = [
  // ... sistemas existentes
  {
    id: 'new-rpg',
    name: 'New RPG System',
    description: 'Descripción del sistema',
    icon: '🎲',
    color: 'from-green-600 to-blue-600'
  }
];

export const RPG_SHEETS: RPGSheetComponent[] = [
  // ... hojas existentes
  {
    system: RPG_SYSTEMS.find(s => s.id === 'new-rpg')!,
    component: NewRPGSheet
  }
];
```

4. **Agregar función de creación por defecto**:
```typescript
export const createDefaultCharacter = (systemId: string): BaseCharacterData => {
  switch (systemId) {
    // ... casos existentes
    case 'new-rpg':
      return {
        id: `new-rpg-${Date.now()}`,
        name: 'New Character',
        player: 'Player Name',
        system: 'new-rpg',
        characteristics: { /* valores por defecto */ },
        skills: [ /* habilidades por defecto */ ]
      } as NewRPGCharacterData;
  }
};
```

## Funcionalidades

### Gestión de Personajes
- **Crear**: Nuevo personaje con valores por defecto
- **Cargar**: Abrir personaje existente
- **Guardar**: Persistir cambios en localStorage
- **Eliminar**: Remover personaje de la lista
- **Exportar**: Descargar como archivo JSON
- **Importar**: Cargar desde archivo JSON

### Validación
- Verificación de campos requeridos
- Validación específica por sistema
- Prevención de datos corruptos

### Interfaz de Usuario
- Modo de edición/visualización
- Campos editables en tiempo real
- Validación visual de datos
- Navegación intuitiva

## Persistencia

Los personajes se guardan en `localStorage` con la clave `rpg-characters`. La estructura es un array de objetos `BaseCharacterData`.

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:

1. **Nuevos sistemas**: Agregar al registro
2. **Nuevas características**: Extender las interfaces
3. **Nuevas funcionalidades**: Modificar el gestor principal
4. **Personalización visual**: Modificar los componentes de hoja

## Consideraciones Técnicas

- **TypeScript**: Tipado completo para seguridad
- **React Hooks**: Gestión de estado moderna
- **Tailwind CSS**: Estilos consistentes
- **Lucide Icons**: Iconografía unificada
- **Responsive**: Diseño adaptable a diferentes pantallas 