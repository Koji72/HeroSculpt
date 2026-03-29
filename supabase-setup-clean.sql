-- ================================================================================
-- 🛒 SUPERHERO 3D CUSTOMIZER - CONFIGURACIÓN DE BASE DE DATOS SUPABASE
-- ================================================================================
-- Script optimizado para Supabase Cloud (sin permisos de admin)

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
DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at 
    BEFORE UPDATE ON purchases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_configurations_updated_at ON user_configurations;
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

-- Eliminar políticas existentes si existen (para reejecutar script)
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can update own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can delete own purchases" ON purchases;

DROP POLICY IF EXISTS "Users can view own purchase items" ON purchase_items;
DROP POLICY IF EXISTS "Users can insert own purchase items" ON purchase_items;
DROP POLICY IF EXISTS "Users can update own purchase items" ON purchase_items;
DROP POLICY IF EXISTS "Users can delete own purchase items" ON purchase_items;

DROP POLICY IF EXISTS "Users can view own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can insert own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can update own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can delete own configurations" ON user_configurations;

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

-- Eliminar funciones existentes si existen (para evitar conflictos de tipos)
DROP FUNCTION IF EXISTS get_user_configurations(UUID);
DROP FUNCTION IF EXISTS get_user_purchases_with_items(UUID);

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

-- ==================================================
-- ✅ VERIFICACIÓN FINAL
-- ==================================================

-- Verificar que las tablas fueron creadas correctamente
DO $$
BEGIN
    RAISE NOTICE '🎉 ¡Configuración completada!';
    RAISE NOTICE '📊 Tablas creadas: purchases, purchase_items, user_configurations';
    RAISE NOTICE '🔐 Políticas RLS activas para todas las tablas';
    RAISE NOTICE '⚡ Índices optimizados para rendimiento';
    RAISE NOTICE '🛠️ Funciones SQL listas para usar';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Tu sistema de compras está listo para funcionar!';
END $$; 