-- ================================================================================
-- 🚨 QUICK FIX: Configuración mínima para resolver "Database error saving new user"
-- ================================================================================

-- Crear tabla user_configurations si no existe
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

-- Habilitar RLS
ALTER TABLE user_configurations ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can insert own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can update own configurations" ON user_configurations;
DROP POLICY IF EXISTS "Users can delete own configurations" ON user_configurations;

-- Crear políticas básicas
CREATE POLICY "Users can view own configurations" ON user_configurations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own configurations" ON user_configurations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own configurations" ON user_configurations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own configurations" ON user_configurations
    FOR DELETE USING (auth.uid() = user_id);

-- Crear índice para rendimiento
CREATE INDEX IF NOT EXISTS idx_user_configurations_user_id ON user_configurations(user_id);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_user_configurations_updated_at ON user_configurations;
CREATE TRIGGER update_user_configurations_updated_at 
    BEFORE UPDATE ON user_configurations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de confirmación
SELECT 'Database setup completed successfully!' as status; 