# 🔧 Configuración de Supabase

Esta guía te ayudará a configurar Supabase para el sistema de usuarios del Superhero 3D Customizer.

## 📋 Prerrequisitos

- Cuenta en [Supabase](https://supabase.com)
- Proyecto creado en Supabase
- Node.js y npm instalados

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la **URL del proyecto** y la **API Key anónima**

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Configurar la Base de Datos

1. Ve al **SQL Editor** en tu proyecto de Supabase
2. Copia y ejecuta el contenido del archivo `supabase-setup.sql`
3. Esto creará:
   - Tabla `user_configurations`
   - Políticas de seguridad (RLS)
   - Índices para optimización
   - Funciones auxiliares

### 4. Configurar Autenticación

1. Ve a **Authentication > Settings** en Supabase
2. Configura los **Site URL**:
   - `http://localhost:5173` (desarrollo)
   - `https://tu-dominio.com` (producción)
3. Habilita los proveedores que desees:
   - **Email/Password**
   - **Google**
   - **GitHub**

### 5. Configurar Políticas de Seguridad

Las políticas RLS ya están configuradas en el SQL, pero puedes verificarlas en:
**Authentication > Policies**

## 🔐 Estructura de la Base de Datos

### Tabla: `user_configurations`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | ID del usuario (referencia a auth.users) |
| `name` | VARCHAR(255) | Nombre de la configuración |
| `archetype` | VARCHAR(100) | Tipo de arquetipo (strong, justiciero, etc.) |
| `selected_parts` | JSONB | Partes seleccionadas del personaje |
| `total_price` | DECIMAL(10,2) | Precio total de la configuración |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

## 🛡️ Seguridad

### Row Level Security (RLS)
- Los usuarios solo pueden acceder a sus propias configuraciones
- Todas las operaciones están protegidas por políticas RLS
- Las funciones auxiliares tienen permisos específicos

### Políticas Implementadas
- **SELECT**: Usuarios pueden ver solo sus configuraciones
- **INSERT**: Usuarios pueden crear configuraciones propias
- **UPDATE**: Usuarios pueden actualizar sus configuraciones
- **DELETE**: Usuarios pueden eliminar sus configuraciones

## 🔧 Funciones Disponibles

### `get_user_configurations(user_uuid UUID)`
Retorna todas las configuraciones de un usuario específico, ordenadas por fecha de creación.

## 📱 Uso en la Aplicación

### Hook de Autenticación
```typescript
import { useAuth } from '../hooks/useAuth';

const { user, isAuthenticated, signOut } = useAuth();
```

### Servicio de Configuraciones
```typescript
import { UserConfigService } from '../services/userConfigService';

// Guardar configuración
const saved = await UserConfigService.saveConfiguration(
  userId,
  name,
  archetype,
  selectedParts,
  totalPrice
);

// Cargar configuraciones
const configs = await UserConfigService.getUserConfigurations(userId);
```

## 🚨 Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que el archivo `.env` existe
- Confirma que las variables están correctamente nombradas
- Reinicia el servidor de desarrollo

### Error: "Invalid API key"
- Verifica que la API key anónima es correcta
- Confirma que el proyecto está activo en Supabase

### Error: "RLS policy violation"
- Verifica que el usuario está autenticado
- Confirma que las políticas RLS están configuradas
- Revisa que el `user_id` coincide con el usuario autenticado

### Error: "Table does not exist"
- Ejecuta el script SQL completo
- Verifica que la tabla `user_configurations` existe
- Confirma que los índices están creados

## 🔄 Desarrollo vs Producción

### Desarrollo
- URL: `http://localhost:5173`
- Base de datos: Proyecto de desarrollo en Supabase
- Variables de entorno: Archivo `.env` local

### Producción
- URL: Tu dominio de producción
- Base de datos: Proyecto de producción en Supabase
- Variables de entorno: Configuradas en el hosting

## 📊 Monitoreo

### Logs de Supabase
- Ve a **Logs** en tu proyecto de Supabase
- Monitorea las consultas y errores
- Revisa el rendimiento de las consultas

### Métricas de Uso
- Número de usuarios registrados
- Configuraciones guardadas por usuario
- Tiempo promedio de carga de configuraciones

## 🔗 Enlaces Útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Autenticación](https://supabase.com/docs/guides/auth)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript)

---

**¡Con esta configuración, tu aplicación tendrá un sistema completo de usuarios con autenticación y persistencia de datos! 🎉** 