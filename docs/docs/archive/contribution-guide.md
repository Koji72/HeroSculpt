# Guía de Contribución

## Proceso de Contribución

### 1. Configuración del Entorno

1. **Fork del Repositorio**
   ```bash
   git clone https://github.com/USER/REPO/nombre-de-la-feature
   ```

2. **Desarrollo**
   - Seguir las guías de estilo
   - Escribir tests
   - Documentar cambios
   - Mantener commits atómicos

3. **Testing**
   ```bash
   npm run test
   npm run lint
   ```

4. **Commit**
   ```bash
   git commit -m "feat: descripción del cambio"
   ```

5. **Push**
   ```bash
   git push origin feature/nombre-de-la-feature
   ```

6. **Pull Request**
   - Crear PR en GitHub
   - Seguir la plantilla
   - Esperar review

## Convenciones

### 1. Commits

```
tipo(alcance): descripción

[body opcional]

[footer opcional]
```

Tipos:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento

### 2. Código

#### TypeScript
```typescript
// Interfaces
interface Props {
  name: string;
  age: number;
}

// Types
type Status = 'loading' | 'success' | 'error';

// Enums
enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}
```

#### React
```typescript
// Componentes
const Component: React.FC<Props> = ({ name, age }) => {
  return <div>{name}</div>;
};

// Hooks
const useCustomHook = () => {
  // implementación
};
```

### 3. Documentación

#### JSDoc
```typescript
/**
 * Descripción de la función
 * @param {string} param1 - Descripción del parámetro
 * @returns {boolean} Descripción del retorno
 */
function example(param1: string): boolean {
  return true;
}
```

## Pull Requests

### 1. Plantilla
```markdown
## Descripción
[Descripción detallada de los cambios]

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva característica
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Tests añadidos/actualizados
- [ ] Documentación actualizada
- [ ] Código formateado
- [ ] Lint sin errores
- [ ] Build exitoso
```

### 2. Review
- Revisar cambios
- Verificar tests
- Comprobar documentación
- Validar estilo

## Modelos 3D

### 1. Preparación
- Seguir nomenclatura
- Optimizar modelos
- Validar formatos
- Documentar cambios

### 2. Integración
- Añadir a assets
- Actualizar documentación
- Probar en visor
- Verificar compatibilidad

## Testing

### 1. Unit Tests
```typescript
describe('Component', () => {
  it('should render correctly', () => {
    // test
  });
});
```

### 2. Integration Tests
```typescript
describe('Feature', () => {
  it('should work end-to-end', () => {
    // test
  });
});
```

## Mejores Prácticas

### 1. Código
- Mantener funciones pequeñas
- Usar nombres descriptivos
- Comentar código complejo
- Seguir principios SOLID

### 2. Git
- Commits atómicos
- Mensajes claros
- Branches descriptivas
- Mantener historial limpio

### 3. Documentación
- Mantener actualizada
- Ser clara y concisa
- Incluir ejemplos
- Documentar cambios

## Recursos

### 1. Herramientas
- VS Code
- Git
- Node.js
- npm

### 2. Documentación
- [TypeScript](https://www.typescriptlang.org/docs/)
- [React](https://reactjs.org/docs/)
- [Three.js](https://threejs.org/docs/)
- [Vite](https://vitejs.dev/guide/)

### 3. Comunidad
- [Discord](link)
- [GitHub Issues](link)
- [Stack Overflow](link)

## Contacto

- Mantenedores: [@Koji72](https://github.com/Koji72)
- Email: [email]
- Discord: [link] 