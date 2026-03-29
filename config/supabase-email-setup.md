# 📧 Configuración de Supabase para Envío de Emails

## 🎯 **Estado Actual**
- ✅ Sistema implementado usando **Supabase Edge Functions**
- ✅ **Más confiable** que servicios externos de email
- ✅ **Integrado** con tu base de datos existente
- 🔶 Actualmente en **modo simulación** (Edge Function no configurada)

---

## 🚀 **Configuración Supabase Edge Functions (10 min)**

### **Prerequisitos**
- ✅ Proyecto de Supabase activo
- ✅ CLI de Supabase instalado
- ✅ Cuenta con plan que incluya Edge Functions

### **Paso 1: Instalar Supabase CLI**

```bash
# Instalar CLI de Supabase
npm install -g supabase

# Verificar instalación
supabase --version
```

### **Paso 2: Conectar con tu Proyecto**

```bash
# Hacer login a Supabase
supabase login

# Linkar tu proyecto
supabase link --project-ref TU_PROJECT_ID
```

### **Paso 3: Crear Edge Function**

```bash
# Crear la función de email
supabase functions new send-email
```

### **Paso 4: Código de la Edge Function**

Reemplaza el contenido de `supabase/functions/send-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface EmailRequest {
  to: string
  subject: string
  html: string
  configId: string
  totalPrice: number
}

serve(async (req) => {
  // Manejar CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html, configId, totalPrice }: EmailRequest = await req.json()

    // Validar datos
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos requeridos' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Configurar el servicio de email (usando Resend como ejemplo)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurada')
    }

    // Enviar email usando Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Superhero 3D Customizer <user@example.com>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Error de Resend: ${error}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.id,
        configId,
        totalPrice 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Error al enviar email', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

### **Paso 5: Crear archivo CORS**

Crear `supabase/functions/_shared/cors.ts`:

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### **Paso 6: Configurar Variables de Entorno**

```bash
# Configurar API key de Resend (servicio de email)
supabase secrets set RESEND_API_KEY=tu_api_key_de_resend
```

### **Paso 7: Desplegar la Función**

```bash
# Desplegar la función
supabase functions deploy send-email

# Verificar que se desplegó correctamente
supabase functions list
```

---

## 📨 **Alternativas de Servicios de Email**

### **Opción 1: Resend (Recomendado)**
- ✅ **Gratuito**: 3,000 emails/mes
- ✅ **Fácil configuración**
- ✅ **Buena deliverabilidad**
- 🔗 [resend.com](https://resend.com)

### **Opción 2: SendGrid**
- ✅ **Gratuito**: 100 emails/día
- 🔧 **Configuración media**
- ✅ **Muy confiable**
- 🔗 [sendgrid.com](https://sendgrid.com)

### **Opción 3: Mailgun**
- ✅ **Gratuito**: 5,000 emails/mes (3 meses)
- 🔧 **Configuración media**
- ✅ **Buena para desarrolladores**
- 🔗 [mailgun.com](https://mailgun.com)

---

## 🧪 **Configuración de Resend (Recomendado)**

### **1. Crear cuenta en Resend**
1. Ve a [resend.com](https://resend.com)
2. Crea cuenta gratuita
3. Verifica tu dominio (o usa el dominio de prueba)

### **2. Obtener API Key**
1. Ve a **API Keys** en el dashboard
2. Crea nueva API key
3. Copia la key

### **3. Configurar en Supabase**
```bash
supabase secrets set RESEND_API_KEY=re_tu_api_key_aqui
```

---

## ✅ **Verificar que Funciona**

### **1. Probar la Edge Function**
```bash
# Probar localmente
supabase functions serve

# Hacer petición de prueba
curl -X POST 'http://localhost:54321/functions/v1/send-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "user@example.com",
    "subject": "Prueba",
    "html": "<h1>¡Funciona!</h1>",
    "configId": "test123",
    "totalPrice": 50.00
  }'
```

### **2. Verificar en la Aplicación**
1. **Personaliza** un superhéroe sin registrarte
2. **Haz checkout** como invitado
3. **Ingresa tu email real**
4. **¡Recibirás el email!** 📧

---

## 🔧 **Troubleshooting**

### **Si no funciona:**
1. **Verifica logs**: `supabase functions logs send-email`
2. **Revisa secrets**: `supabase secrets list`
3. **Prueba localmente**: `supabase functions serve`
4. **Verifica permisos** de tu API key de email

### **Si sigue en modo simulación:**
- El sistema seguirá funcionando
- Los emails aparecerán en la consola del navegador
- Los usuarios verán el contenido completo del email

---

## 💰 **Costos**

### **Supabase Edge Functions:**
- **Gratis**: 500,000 invocaciones/mes
- **Pro**: 2M invocaciones/mes ($25/mes)

### **Resend:**
- **Gratis**: 3,000 emails/mes
- **Pro**: $20/mes por 50,000 emails

### **Total para empezar: $0/mes** 🎯

---

## 🎯 **Beneficios vs EmailJS**

| Característica | Supabase + Resend | EmailJS |
|---------------|-------------------|---------|
| **Configuración** | 10 minutos | 5 minutos |
| **Confiabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Integración** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Escalabilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Emails gratis** | 3,000/mes | 100/mes |
| **Control total** | ✅ | ❌ |

**Recomendación**: Usa Supabase + Resend para un sistema profesional y escalable.

---

## 🚀 **¡Lista para Usar!**

Una vez configurado:
- ✅ **Emails reales** a usuarios invitados
- ✅ **Templates profesionales** 
- ✅ **Backup automático** si falla
- ✅ **Logs completos** para debugging
- ✅ **Escalable** para miles de usuarios 