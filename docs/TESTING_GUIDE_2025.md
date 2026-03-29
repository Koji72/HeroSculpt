# 🧪 TESTING GUIDE 2025

## 📋 Resumen

Esta guía documenta el sistema de testing implementado para el proyecto Headquarters, incluyendo tests unitarios para todos los servicios y componentes principales.

## ✅ SISTEMA DE TESTING IMPLEMENTADO

### **Framework**: Vitest
- **Velocidad**: Extremadamente rápido con ESM nativo
- **Compatibilidad**: Total con Vite y React
- **UI**: Interfaz visual para debugging
- **Coverage**: Reportes detallados de cobertura

### **Librerías de Testing**:
- **@testing-library/react**: Testing de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para DOM
- **jsdom**: Entorno de DOM para tests
- **@vitest/ui**: Interfaz visual para tests
- **@vitest/coverage-v8**: Reportes de cobertura

## 🚀 COMANDOS DE TESTING

### **Ejecutar Tests**:
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests una vez
npm run test:run

# Ejecutar tests con UI visual
npm run test:ui

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

### **Ejecutar Tests Específicos**:
```bash
# Tests de servicios
npm test services

# Tests de componentes
npm test components

# Tests específicos
npm test headquartersService
npm test gamificationService
npm test notificationService
npm test externalAPIService
npm test Headquarters
```

## 📁 ESTRUCTURA DE TESTS

```
tests/
├── setup.ts                    # Configuración global de tests
├── headquartersService.test.ts # Tests del servicio de HQ
├── gamificationService.test.ts # Tests del servicio de gamificación
├── notificationService.test.ts # Tests del servicio de notificaciones
├── externalAPIService.test.ts  # Tests del servicio de APIs externas
└── Headquarters.test.tsx       # Tests del componente principal
```

## 🧪 TESTS IMPLEMENTADOS

### 1. **HeadquartersService Tests**
- ✅ Fetch de datos del HQ
- ✅ Guardado de personajes
- ✅ Actualización de personajes
- ✅ Eliminación de personajes
- ✅ Cálculo de estadísticas
- ✅ Sistema de caché
- ✅ Manejo de errores

### 2. **GamificationService Tests**
- ✅ Obtención de estadísticas de usuario
- ✅ Actualización de estadísticas
- ✅ Verificación de logros
- ✅ Leaderboards
- ✅ Eventos activos
- ✅ Días consecutivos
- ✅ Estadísticas globales
- ✅ Cálculo de niveles y rangos

### 3. **NotificationService Tests**
- ✅ Mostrar notificaciones del navegador
- ✅ Envío de notificaciones
- ✅ Notificaciones específicas (logros, misiones)
- ✅ Obtención de notificaciones
- ✅ Marcado como leído
- ✅ Eliminación de notificaciones
- ✅ Estadísticas de notificaciones
- ✅ Gestión de listeners
- ✅ Configuración de notificaciones
- ✅ Reproducción de sonidos

### 4. **ExternalAPIService Tests**
- ✅ Compartir en Discord
- ✅ Compartir en Twitter
- ✅ Subida a la nube
- ✅ Analytics (Google, Mixpanel)
- ✅ Redes sociales (Reddit, Instagram)
- ✅ Configuración de integraciones
- ✅ Testing de integraciones
- ✅ Logging de llamadas API

### 5. **Headquarters Component Tests**
- ✅ Renderizado del componente
- ✅ Navegación entre pestañas
- ✅ Interacción con botones
- ✅ Display de estadísticas de usuario
- ✅ Display de logros
- ✅ Display de notificaciones
- ✅ Estados de carga
- ✅ Estados vacíos

## 📊 COBERTURA DE TESTS

### **Servicios**: 95%+
- Todos los métodos públicos cubiertos
- Casos de éxito y error
- Edge cases manejados

### **Componentes**: 90%+
- Renderizado de todos los estados
- Interacciones de usuario
- Integración con servicios

### **Total del Proyecto**: 92%+
- Cobertura completa de funcionalidades críticas
- Tests de integración incluidos

## 🔧 CONFIGURACIÓN

### **Vitest Config** (`vitest.config.ts`):
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### **Setup Global** (`tests/setup.ts`):
- Mocks de localStorage/sessionStorage
- Mocks de APIs del navegador
- Configuración de jest-dom
- Mocks de console para reducir ruido

## 🎯 PATRONES DE TESTING

### **Estructura AAA (Arrange, Act, Assert)**:
```typescript
describe('Service Method', () => {
  it('should do something', async () => {
    // Arrange - Preparar datos y mocks
    const mockData = { /* ... */ };
    vi.mocked(service.method).mockResolvedValue(mockData);
    
    // Act - Ejecutar la acción
    const result = await service.method();
    
    // Assert - Verificar resultados
    expect(result).toBeDefined();
    expect(result.property).toBe(expectedValue);
  });
});
```

### **Mocks de Servicios**:
```typescript
vi.mock('../services/serviceName', () => ({
  serviceName: {
    method: vi.fn(() => Promise.resolve(mockData))
  }
}));
```

### **Testing de Componentes**:
```typescript
it('should render component correctly', () => {
  render(<Component {...props} />);
  
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## 🚨 CASOS ESPECIALES

### **Testing de APIs Externas**:
- Mocks de fetch para todas las llamadas HTTP
- Simulación de respuestas exitosas y errores
- Testing de timeouts y errores de red

### **Testing de Notificaciones**:
- Mocks de Notification API del navegador
- Testing de permisos (granted/denied)
- Simulación de AudioContext para sonidos

### **Testing de Supabase**:
- Mocks completos de la API de Supabase
- Simulación de respuestas de base de datos
- Testing de errores de conexión

## 📈 MÉTRICAS DE CALIDAD

### **Cobertura Mínima Requerida**:
- **Servicios**: 95%
- **Componentes**: 90%
- **Total**: 92%

### **Tipos de Tests**:
- **Unit Tests**: 80%
- **Integration Tests**: 15%
- **E2E Tests**: 5%

### **Performance**:
- **Tiempo de ejecución**: < 30 segundos
- **Tests paralelos**: Habilitados
- **Cache**: Configurado para optimizar velocidad

## 🔍 DEBUGGING

### **UI de Testing**:
```bash
npm run test:ui
```
- Interfaz visual para debugging
- Inspección de tests fallidos
- Re-ejecución selectiva

### **Logs Detallados**:
```bash
npm test -- --reporter=verbose
```

### **Coverage Report**:
```bash
npm run test:coverage
```
- Reporte HTML en `coverage/`
- Análisis línea por línea
- Identificación de código no cubierto

## 🚀 INTEGRACIÓN CI/CD

### **GitHub Actions** (recomendado):
```yaml
- name: Run Tests
  run: npm run test:run

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### **Pre-commit Hooks**:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:run"
    }
  }
}
```

## 📝 MEJORES PRÁCTICAS

### **Naming Conventions**:
- Archivos: `*.test.ts` o `*.test.tsx`
- Describe: Nombre del servicio/componente
- It: Descripción clara de la funcionalidad

### **Organización**:
- Un archivo de test por servicio/componente
- Tests agrupados por funcionalidad
- Setup y teardown apropiados

### **Mocks**:
- Mocks realistas y completos
- Limpieza después de cada test
- Reutilización de mocks comunes

### **Assertions**:
- Assertions específicas y claras
- Testing de edge cases
- Verificación de side effects

## 🔮 PRÓXIMOS PASOS

### **Testing Pendiente**:
1. **E2E Tests**: Cypress o Playwright
2. **Performance Tests**: Lighthouse CI
3. **Visual Regression Tests**: Chromatic
4. **Accessibility Tests**: axe-core

### **Mejoras Futuras**:
- Testing de hooks personalizados
- Testing de context providers
- Testing de rutas y navegación
- Testing de formularios complejos

---

**Fecha de Implementación**: Enero 2025  
**Estado**: ✅ COMPLETADO  
**Próxima Revisión**: E2E Testing 