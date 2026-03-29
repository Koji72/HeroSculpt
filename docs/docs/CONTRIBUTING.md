# 🤝 Guía de Contribución - Superhero 3D Customizer

¡Gracias por tu interés en contribuir al **Superhero 3D Customizer**! Este documento proporciona las pautas y el proceso para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Contribuir?](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Testing](#testing)
- [Documentación](#documentación)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)

## 📜 Código de Conducta

Este proyecto y todos los participantes se rigen por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

## 🚀 ¿Cómo Contribuir?

### **1. Fork del Repositorio**
```bash
# Fork el repositorio en GitHub
# Clona tu fork localmente
git clone https://github.com/USER/REPO//localhost:5173 en tu navegador
```

### **3. Crear una Rama**
```bash
# Crear rama para nueva funcionalidad
git checkout -b feature/nombre-de-tu-funcionalidad

# O para corrección de bugs
git checkout -b hotfix/nombre-del-bug
```

## 🔄 Proceso de Desarrollo

### **1. Actualizar tu Fork**
```bash
# Añadir upstream
git remote add upstream https://github.com/USER/REPO/main
```

### **2. Desarrollo**
- Sigue los estándares de código
- Escribe tests cuando sea posible
- Actualiza documentación
- Mantén el código limpio y organizado

### **3. Commits**
- Usa mensajes descriptivos
- Sigue el formato de commits convencionales
- Haz commits pequeños y frecuentes

### **4. Push**
```bash
git push origin feature/nombre-de-tu-funcionalidad
```

## 📏 Estándares de Código

### **TypeScript**
```typescript
// ✅ Correcto
interface CharacterConfig {
  archetype: Archetype;
  parts: PartConfiguration;
  price: number;
}

// ❌ Incorrecto
interface Config {
  archetype: any;
  parts: any;
  price: any;
}
```

### **React Components**
```typescript
// ✅ Estructura recomendada
import React, { useState, useEffect } from 'react';
import { useCharacterContext } from '../contexts/CharacterContext';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const ComponentName: React.FC<ComponentProps> = ({ 
  title, 
  onAction 
}) => {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 3. Handlers
  const handleClick = () => {
    onAction();
  };
  
  // 4. Render
  return (
    <div className="component">
      <h2>{title}</h2>
      <button onClick={handleClick}>
        Action
      </button>
    </div>
  );
};
```

### **Styling**
```typescript
// ✅ Usar TailwindCSS
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// ✅ CSS Variables para temas
<div className="bg-primary text-primary-foreground">

// ❌ Evitar CSS inline
<div style={{ display: 'flex', padding: '16px' }}>
```

### **Naming Conventions**
```typescript
// Components: PascalCase
export const CharacterViewer: React.FC = () => {};

// Functions: camelCase
const loadModel = () => {};

// Types/Interfaces: PascalCase
interface CharacterConfig {};

// Constants: UPPER_SNAKE_CASE
const MAX_ZOOM_LEVEL = 10;

// Files: kebab-case
character-viewer.tsx
part-selector-panel.tsx
```

## 📝 Commits

Sigue el formato de commits convencionales:

```
type(scope): description

[optional body]

[optional footer]
```

### **Tipos de Commits**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (espacios, comas, etc.)
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Cambios en build, configuraciones, etc.

### **Ejemplos**
```bash
# Nueva funcionalidad
feat(camera): add Y-axis rotation restriction

# Corrección de bug
fix(compatibility): resolve hand-torso compatibility issue

# Documentación
docs(readme): update installation instructions

# Refactorización
refactor(components): extract reusable UI components

# Estilos
style(ui): improve button styling and spacing
```

## 🔀 Pull Requests

### **1. Preparación**
- Actualiza tu fork con los últimos cambios
- Resuelve conflictos si los hay
- Asegúrate de que los tests pasen
- Verifica que el código funcione correctamente

### **2. Creación**
- Usa la plantilla de PR
- Describe los cambios claramente
- Referencia issues relacionados
- Incluye capturas de pantalla si es necesario

### **3. Review**
- Responde a los comentarios
- Haz cambios si es necesario
- Mantén el PR actualizado

### **Plantilla de PR**
```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Mejora de documentación
- [ ] Refactorización

## Cambios Realizados
- Lista de cambios específicos
- Mejoras implementadas
- Problemas resueltos

## Testing
- [ ] Tests pasan
- [ ] Funciona en diferentes navegadores
- [ ] Responsive design verificado
- [ ] Performance optimizada

## Screenshots (si aplica)
Incluir capturas de pantalla de los cambios visuales.

## Checklist
- [ ] Código sigue los estándares del proyecto
- [ ] Documentación actualizada
- [ ] Commits siguen el formato convencional
- [ ] No hay conflictos
```

## 🧪 Testing

### **Estrategia de Testing**
```typescript
// Unit Tests
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test code
  });
  
  it('should handle user interactions', () => {
    // Test interactions
  });
});

// Integration Tests
describe('Feature Integration', () => {
  it('should work end-to-end', () => {
    // Test complete flow
  });
});
```

### **Testing Checklist**
- [ ] Funciona en Chrome, Firefox, Safari, Edge
- [ ] Responsive en móvil, tablet, desktop
- [ ] Performance aceptable (60fps)
- [ ] Accesibilidad verificada
- [ ] No hay errores en consola

## 📚 Documentación

### **Código**
```typescript
/**
 * Carga un modelo 3D en la escena
 * @param modelPath - Ruta al archivo del modelo
 * @param position - Posición en la escena
 * @returns Promise que resuelve al modelo cargado
 */
const loadModel = async (modelPath: string, position: Vector3): Promise<Group> => {
  // Implementation
};
```

### **README y Documentación**
- Actualiza cambios importantes
- Documenta nuevas funcionalidades
- Mantén ejemplos actualizados
- Incluye capturas de pantalla

## 🏗️ Arquitectura del Proyecto

### **Estructura de Archivos**
```
3dcustomicerdefinitivo/
├── components/           # Componentes React principales
├── public/assets/        # Modelos 3D y recursos
├── src/                  # Código fuente principal
├── types.ts             # Definiciones TypeScript
├── constants.ts         # Constantes y configuraciones
├── utils.ts             # Utilidades generales
└── docs/                # Documentación completa
```

### **Componentes Principales**
- `CharacterViewer.tsx`: Visor 3D con Three.js
- `PartSelectorPanel.tsx`: Modal de selección de partes
- `CurrentConfigPanel.tsx`: Panel de configuración actual
- `PriceDisplay.tsx`: Display de precios dinámicos

### **Gestión de Estado**
- React Context para estado global
- Local state para componentes específicos
- Cache management para modelos 3D

## 🎯 Áreas de Contribución

### **Funcionalidades Prioritarias**
- [ ] Sistema de usuarios y autenticación
- [ ] Backend API para persistencia
- [ ] Sistema de pagos integrado
- [ ] Exportación de archivos STL
- [ ] Más arquetipos de superhéroes

### **Mejoras Técnicas**
- [ ] Testing suite completa
- [ ] Performance optimizations
- [ ] PWA support
- [ ] Offline capabilities

### **UI/UX**
- [ ] Animaciones suaves
- [ ] Mejoras de accesibilidad
- [ ] Temas personalizables
- [ ] Tutorial interactivo

## 🔧 Herramientas de Desarrollo

### **Comandos Útiles**
```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build

# Linting y formateo
npm run lint             # ESLint
npm run format           # Prettier

# Testing (futuro)
npm run test             # Ejecutar tests
npm run test:watch       # Tests en modo watch
```

### **Configuración del Editor**
- **VS Code**: Configuración recomendada incluida
- **Extensions**: ESLint, Prettier, TypeScript
- **Settings**: Formateo automático al guardar

## 📞 Recursos y Ayuda

### **Documentación**
- [Arquitectura del Sistema](ARCHITECTURE.md)
- [Guía de Usuario](../USER_GUIDE.md)
- [Resumen de Mejoras](../IMPROVEMENTS_SUMMARY.md)

### **Tecnologías**
- [Three.js Documentation](https://threejs.org/docs/)
- [React Guide](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)

### **Comunidad**
- **Issues**: Reporta bugs y solicita funcionalidades
- **Discussions**: Participa en discusiones del proyecto
- **Code Review**: Ayuda revisando PRs de otros contribuidores

---

**¡Gracias por contribuir al Superhero 3D Customizer! 🦸‍♂️✨** 