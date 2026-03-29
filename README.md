# 🦸‍♂️ Superhero 3D Customizer

Un customizador 3D avanzado de superhéroes con sistema completo de e-commerce y biblioteca personal.

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![React](https://img.shields.io/badge/React-18.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-latest-green.svg)
![Supabase](https://img.shields.io/badge/Supabase-enabled-green.svg)

## ✨ Características Principales

### 🎨 **Customización 3D Avanzada**
- Sistema de arquetipo con físico realista
- Customización completa por categorías (torso, cabeza, manos, etc.)
- Compatibilidad inteligente entre partes
- Visualización 3D en tiempo real con Three.js
- Sistema de materiales y texturas

### 🛒 **Sistema de E-commerce Híbrido**
- Carrito de compras funcional
- **Modo Gratis**: Descarga gratuita para usuarios registrados
- **Modo Pagos**: Integración completa con Stripe (preparado)
- Confirmación de compras con exportación
- Integración completa con Supabase
- **Sistema híbrido**: Cambio instantáneo entre modos gratis/pago

### 🛡️ **Sistema de Seguridad Avanzado**
- Rate limiting para prevenir spam y ataques
- Headers de seguridad con Helmet.js
- Validación robusta de entrada
- Logging de seguridad en tiempo real
- Protección contra XSS y SQL injection
- CORS configurado de forma estricta

### 📚 **Biblioteca Personal**
- Historial completo de compras
- Recarga de configuraciones compradas
- Descarga directa STL/GLB desde biblioteca
- Gestión de compras por usuario

### 🔐 **Sistema de Usuarios**
- Autenticación con Supabase
- Perfiles personales
- Seguridad RLS (Row Level Security)
- Gestión de sesiones

## 🚀 Instalación y Configuración

### 1. **Clonar el Repositorio**
```bash
git clone https://github.com/USER/REPO//supabase.com)
2. Ejecutar script SQL: `supabase-setup-clean.sql`
3. Configurar variables de entorno:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 4. **Verificar Configuración**
```bash
npm run verify-supabase
```

### 5. **Ejecutar en Desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5177`

## 🏗️ Arquitectura del Proyecto

```
📁 Project Structure
├── 🎨 components/           # Componentes React
│   ├── 🛒 ShoppingCart.tsx
│   ├── 📚 PurchaseLibrary.tsx
│   ├── ✅ PurchaseConfirmation.tsx
│   └── 🎮 CharacterViewer.tsx
├── 🔧 services/            # Servicios y APIs
│   └── 📊 purchaseHistoryService.ts
├── 🗄️ src/parts/          # Definiciones de partes 3D
├── 📚 docs/               # Documentación
├── 🔧 scripts/           # Scripts de utilidad
└── 🏗️ lib/               # Librerías y utilidades
```

## 🎮 Cómo Usar

### 1. **Crear Superhéroe**
- Selecciona arquetipo (Strong, Speed, Tech, etc.)
- Personaliza cada categoría de parte
- Visualiza en tiempo real

### 2. **Comprar Configuración**
- Agrega configuraciones al carrito
- Procesa checkout (simulado)
- Recibe confirmación con opciones de descarga

### 3. **Acceder a Biblioteca**
- Ve tu historial desde el perfil
- Recarga configuraciones anteriores
- Descarga modelos STL/GLB

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- ⚛️ **React 18** - Framework principal
- 🎯 **TypeScript** - Tipado estático
- 🎨 **Tailwind CSS** - Estilos modernos
- 🎮 **Three.js** - Renderizado 3D
- ⚡ **Vite** - Build tool rápido

### **Backend & Base de Datos**
- 🗄️ **Supabase** - Backend as a Service
- 🔐 **Auth** - Autenticación de usuarios
- 📊 **PostgreSQL** - Base de datos relacional

### **3D & Exportación**
- 🎯 **GLTFLoader** - Carga de modelos
- 📥 **GLTFExporter** - Exportación GLB
- 🖨️ **STLExporter** - Exportación para impresión 3D

## 📊 Base de Datos

### **Tablas Principales**
- `purchases` - Compras principales
- `purchase_items` - Items individuales de compras
- `user_configurations` - Configuraciones guardadas

### **Seguridad**
- Row Level Security (RLS) habilitado
- Acceso basado en autenticación
- Políticas de usuario por defecto

## 🎯 Flujo de Usuario

1. **🎨 Customización** → Crear superhéroe personalizado
2. **🛒 Carrito** → Agregar configuraciones deseadas
3. **💳 Checkout** → Procesar compra (simulada)
4. **✅ Confirmación** → Recibir confirmación con descarga
5. **📚 Biblioteca** → Acceder a compras desde perfil
6. **📥 Descarga** → STL para impresión, GLB para visualización

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 5177)
npm run build        # Build para producción
npm run preview      # Preview del build
npm run verify-supabase  # Verificar conexión con Supabase

# 🎯 Scripts de Sistema de Pagos
node scripts/activate-payments.js     # Activar modo de pagos reales
node scripts/activate-free-mode.js    # Volver al modo gratis

# 🛡️ Scripts de Seguridad
node scripts/install-security-deps.js # Instalar dependencias de seguridad
node scripts/test-security.js         # Probar mejoras de seguridad
```

## 📁 Documentación Adicional

- 📋 [Integración de Biblioteca](docs/PURCHASE_LIBRARY_INTEGRATION.md)
- 🛠️ [Configuración de Supabase](supabase-setup-instructions.md)
- 📈 [Mejoras del Sistema](docs/IMPROVEMENTS_SUMMARY.md)
- 🔍 [Índice de Documentación](docs/DOCUMENTATION_INDEX.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

## 🚀 Estado del Proyecto

✅ **Completado:**
- Sistema de customización 3D completo
- Carrito de compras y checkout híbrido
- Integración con Supabase
- Biblioteca personal de compras
- Exportación STL/GLB funcional
- Autenticación de usuarios
- **Sistema híbrido de pagos** (gratis/pago)

🔄 **En Desarrollo:**
- Optimizaciones de rendimiento
- Nuevas partes y arquetipos
- Activación de pagos reales (cuando sea necesario)

---

**Desarrollado con ❤️ para la comunidad de superhéroes 🦸‍♂️🦸‍♀️**
