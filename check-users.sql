-- ================================================================================
-- 🔍 VERIFICAR USUARIOS EN LA BASE DE DATOS
-- ================================================================================

-- Verificar usuarios en auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- Verificar configuraciones de usuario
SELECT 
    uc.id,
    uc.user_id,
    uc.name,
    uc.archetype,
    uc.created_at,
    u.email
FROM user_configurations uc
LEFT JOIN auth.users u ON uc.user_id = u.id
ORDER BY uc.created_at DESC;

-- Contar total de usuarios
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as confirmed_users,
    COUNT(CASE WHEN email_confirmed_at IS NULL THEN 1 END) as unconfirmed_users
FROM auth.users; 