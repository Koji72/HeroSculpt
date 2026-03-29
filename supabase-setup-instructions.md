# 🚀 Configuración de Supabase - Instrucciones Paso a Paso

## ✅ Variables de Entorno Configuradas
Las variables de entorno ya están configuradas en el archivo `.env`:
- URL: `https://arhcbrvdtehxyeuplvpt.supabase.co`
- API Key: Configurada correctamente

## 🔧 Pasos para Configurar la Base de Datos

### 1. Acceder al SQL Editor de Supabase
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Haz click en **SQL Editor** en el menú lateral
3. Haz click en **New query**

### 2. Ejecutar el Script SQL
Copia y pega el siguiente código SQL en el editor:

```sql
-- Configuración de la base de datos para el Superhero 3D Customizer

-- Habilitar RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ==================================================
-- 🛒 SISTEMA DE COMPRAS Y BIBLIOTECA
-- ==================================================

-- Tabla principal de compras
CREATE TABLE IF NOT EXISTS purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    configuration_name VARCHAR(255) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    items_count INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items individuales de cada compra
CREATE TABLE IF NOT EXISTS purchase_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    item_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    configuration_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento del sistema de compras
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON purchase_items(purchase_id);

-- ==================================================
-- 📝 SISTEMA DE CONFIGURACIONES (LEGACY)
-- ==================================================

-- Tabla de configuraciones de usuario (mantener compatibilidad)
CREATE TABLE IF NOT EXISTS user_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    archetype VARCHAR(100) NOT NULL,
    selected_parts JSONB NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de configuraciones
CREATE INDEX IF NOT EXISTS idx_user_configurations_user_id ON user_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_configurations_created_at ON user_configurations(created_at);

-- ==================================================
-- 🔧 FUNCIONES Y TRIGGERS
-- ==================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_purchases_updated_at 
    BEFORE UPDATE ON purchases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_configurations_updated_at 
    BEFORE UPDATE ON user_configurations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- 🔐 POLÍTICAS DE SEGURIDAD (RLS)
-- ==================================================

-- Habilitar RLS para todas las tablas
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_configurations ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla PURCHASES
CREATE POLICY "Users can view own purchases" ON purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases" ON purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own purchases" ON purchases
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own purchases" ON purchases
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para la tabla PURCHASE_ITEMS
CREATE POLICY "Users can view own purchase items" ON purchase_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchases p 
            WHERE p.id = purchase_items.purchase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own purchase items" ON purchase_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM purchases p 
            WHERE p.id = purchase_items.purchase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own purchase items" ON purchase_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM purchases p 
            WHERE p.id = purchase_items.purchase_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own purchase items" ON purchase_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM purchases p 
            WHERE p.id = purchase_items.purchase_id 
            AND p.user_id = auth.uid()
        )
    );

-- Políticas para USER_CONFIGURATIONS (legacy)
CREATE POLICY "Users can view own configurations" ON user_configurations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configurations" ON user_configurations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configurations" ON user_configurations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configurations" ON user_configurations
    FOR DELETE USING (auth.uid() = user_id);

-- ==================================================
-- 📊 FUNCIONES ÚTILES
-- ==================================================

-- Función para obtener configuraciones de un usuario (legacy)
CREATE OR REPLACE FUNCTION get_user_configurations(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    archetype VARCHAR(100),
    selected_parts JSONB,
    total_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        uc.id,
        uc.name,
        uc.archetype,
        uc.selected_parts,
        uc.total_price,
        uc.created_at,
        uc.updated_at
    FROM user_configurations uc
    WHERE uc.user_id = user_uuid
    ORDER BY uc.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener historial de compras con items
CREATE OR REPLACE FUNCTION get_user_purchases_with_items(user_uuid UUID)
RETURNS TABLE (
    purchase_id UUID,
    configuration_name VARCHAR(255),
    total_price DECIMAL(10,2),
    items_count INTEGER,
    status VARCHAR(50),
    purchase_date TIMESTAMP WITH TIME ZONE,
    item_id UUID,
    item_name VARCHAR(255),
    item_price DECIMAL(10,2),
    quantity INTEGER,
    configuration_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.configuration_name,
        p.total_price,
        p.items_count,
        p.status,
        p.purchase_date,
        pi.id,
        pi.item_name,
        pi.item_price,
        pi.quantity,
        pi.configuration_data
    FROM purchases p
    LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
    WHERE p.user_id = user_uuid
    ORDER BY p.purchase_date DESC, pi.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permisos para las funciones
GRANT EXECUTE ON FUNCTION get_user_configurations(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_purchases_with_items(UUID) TO authenticated;
```

### 3. Ejecutar el Script
1. Haz click en **Run** en el SQL Editor
2. Verifica que no hay errores en la consola
3. Deberías ver mensajes de éxito para cada comando

### 4. Configurar Autenticación
1. Ve a **Authentication > Settings**
2. En **Site URL**, agrega:
   - `http://localhost:5177` (puerto actual del proyecto)
   - `http://localhost:5173` (alternativo)
3. En **Redirect URLs**, agrega las mismas URLs
4. Guarda los cambios

### 5. Habilitar Proveedores de Autenticación
1. Ve a **Authentication > Providers**
2. Habilita **Email** (ya está habilitado por defecto)
3. Opcional: Habilita **Google** o **GitHub** si quieres

## ✅ Verificación
Una vez completados estos pasos:
1. **Sistema de Compras**: Tablas `purchases` y `purchase_items` creadas
2. **Sistema Legacy**: Tabla `user_configurations` creada (compatibilidad)
3. **Seguridad**: Políticas RLS activas para todas las tablas
4. **Funciones**: Funciones SQL para consultas optimizadas
5. **Autenticación**: Configurada y lista para usar

## 🔍 Verificar Tablas Creadas
Para verificar que todo está bien, ejecuta esta consulta en el SQL Editor:

```sql
-- Verificar que las tablas existen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('purchases', 'purchase_items', 'user_configurations');
```

Deberías ver las 3 tablas listadas.

## 🚀 Funcionalidades Disponibles

### 🛒 Sistema de Compras
- **Guardar compras**: Automático al completar checkout
- **Historial de compras**: Accesible desde perfil de usuario
- **Biblioteca de configuraciones**: Recargar compras anteriores
- **Exportación post-compra**: STL/GLB solo después de comprar

### 👤 Sistema de Usuario
- **Autenticación**: Email/contraseña
- **Perfil**: Gestión de cuenta
- **Sesión persistente**: Login automático

## 🎯 Próximo Paso
**¡Una vez que hayas ejecutado el SQL, la biblioteca de compras estará completamente funcional!** 

El sistema ya está integrado en la aplicación y guardará automáticamente:
- ✅ Cada compra realizada
- ✅ Items individuales con configuraciones
- ✅ Precios y cantidades
- ✅ Fecha de compra

---

**¡Avísame cuando hayas configurado Supabase para probar la biblioteca! 🎉** 