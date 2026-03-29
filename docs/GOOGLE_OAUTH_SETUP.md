# 🔐 Configuración de Google OAuth en Supabase

## 📋 Resumen
El proyecto ya tiene Google OAuth configurado en el frontend (`AuthModal.tsx`), pero necesita configuración en Supabase y Google Cloud Console.

## 🚀 Pasos de Configuración

### 1. Configurar Google Cloud Console

#### 1.1 Crear Proyecto en Google Cloud
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API** y **Google Identity API**

#### 1.2 Configurar OAuth 2.0
1. Ve a **APIs & Services > Credentials**
2. Haz click en **Create Credentials > OAuth 2.0 Client IDs**
3. Selecciona **Web application**
4. Configura los **Authorized redirect URIs**:
   ```
   https://arhcbrvdtehxyeuplvpt.supabase.co/auth/v1/callback
   http://localhost:5177/auth/v1/callback
   ```
5. Anota el **Client ID** y **Client Secret**

### 2. Configurar Supabase

#### 2.1 Habilitar Google Provider
1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Navega a **Authentication > Providers**
3. Busca **Google** y haz click en **Enable**
4. Configura los campos:
   - **Client ID**: Tu Google Client ID
   - **Client Secret**: Tu Google Client Secret
   - **Redirect URL**: `https://arhcbrvdtehxyeuplvpt.supabase.co/auth/v1/callback`

#### 2.2 Configurar Site URLs
1. Ve a **Authentication > Settings**
2. En **Site URL**, agrega:
   - `http://localhost:5177` (desarrollo)
   - `https://tu-dominio.com` (producción)

### 3. Verificar Configuración

#### 3.1 Test Local
```bash
npm run dev
```
1. Abre `http://localhost:5177`
2. Haz click en "Iniciar Sesión"
3. Deberías ver el botón de Google

#### 3.2 Verificar en Supabase
1. Ve a **Authentication > Users**
2. Deberías ver usuarios que se registren con Google

## 🔧 Código Actual

### AuthModal.tsx
```typescript
<Auth
  supabaseClient={supabase}
  providers={['google', 'github']}  // ✅ Google ya configurado
  redirectTo={window.location.origin}
/>
```

### Variables de Entorno
```bash
# Ya configuradas en .env
VITE_SUPABASE_URL=https://arhcbrvdtehxyeuplvpt.supabase.co
VITE_SUPABASE_ANON_KEY=tu_api_key
```

## 🛠️ Troubleshooting

### Error: "Invalid redirect URI"
- Verifica que las URIs en Google Cloud Console coincidan exactamente
- Asegúrate de incluir `https://arhcbrvdtehxyeuplvpt.supabase.co/auth/v1/callback`

### Error: "Client ID not found"
- Verifica que el Client ID en Supabase sea correcto
- Asegúrate de que el proyecto de Google Cloud esté activo

### Error: "OAuth consent screen not configured"
1. Ve a **APIs & Services > OAuth consent screen**
2. Configura la pantalla de consentimiento
3. Agrega tu dominio a los dominios autorizados

## 📊 Estado Actual

### ✅ Completado
- [x] Frontend configurado con Google OAuth
- [x] AuthModal con providers configurados
- [x] Variables de entorno configuradas
- [x] Supabase client inicializado

### 🔧 Pendiente
- [ ] Configurar Google Cloud Console
- [ ] Configurar Google provider en Supabase
- [ ] Probar autenticación con Google

## 🎯 Próximos Pasos

1. **Configurar Google Cloud Console** (pasos 1.1-1.2)
2. **Configurar Supabase** (pasos 2.1-2.2)
3. **Probar autenticación** (paso 3)
4. **Verificar usuarios** en Supabase Dashboard

## 📞 Soporte

Si tienes problemas:
1. Verifica los logs en Google Cloud Console
2. Revisa los logs en Supabase Dashboard
3. Consulta la [documentación oficial de Supabase](https://supabase.com/docs/guides/auth/social-login/auth-google) 