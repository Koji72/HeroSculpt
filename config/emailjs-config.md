# 📧 Configuración de EmailJS para Envío Real de Emails

## 🎯 **Estado Actual**
- ✅ Sistema instalado y funcional
- 🔶 Actualmente en **modo simulación** (no envía emails reales)
- 📨 Para recibir emails reales, necesitas configurar EmailJS

---

## 🚀 **Configuración Rápida (5 minutos)**

### **Paso 1: Crear Cuenta en EmailJS**
1. Ve a [https://www.emailjs.com](https://www.emailjs.com)
2. Crea una cuenta gratuita (100 emails/mes gratis)
3. Verifica tu email

### **Paso 2: Configurar Email Service**
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor (Gmail, Outlook, etc.)
4. Conecta tu cuenta de email
5. **Copia el `Service ID`** que aparece

### **Paso 3: Crear Email Template**
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa este template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Tu Configuración de Superhéroe</title>
</head>
<body style="font-family: Arial, sans-serif; background: #1a1a1a; color: #ffffff; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px;">
        <h1 style="color: #00ff88; text-align: center;">🦸‍♂️ ¡Tu Superhéroe Está Listo!</h1>
        
        <p>Hola <strong>{{to_name}}</strong>,</p>
        
        <p>Gracias por usar nuestro <strong>Superhero 3D Customizer</strong>. Tu configuración personalizada ha sido guardada exitosamente.</p>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #00ff88;">📧 DETALLES DE TU CONFIGURACIÓN:</h3>
            <ul style="color: #cccccc;">
                <li><strong>🦸 Nombre:</strong> {{config_name}}</li>
                <li><strong>💰 Precio Total:</strong> ${{total_price}} USD</li>
                <li><strong>🗓️ Fecha:</strong> {{date}}</li>
            </ul>
            
            <h3 style="color: #00ff88;">📋 PARTES SELECCIONADAS:</h3>
            <pre style="color: #cccccc; white-space: pre-wrap;">{{parts_list}}</pre>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #00ff88;">🔗 ACCEDE A TU CONFIGURACIÓN:</h3>
            <a href="{{view_url}}" style="display: inline-block; background: #00ff88; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">👀 Ver Configuración</a>
            <a href="{{download_glb_url}}" style="display: inline-block; background: #ff6b00; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">📥 Descargar GLB</a>
            <a href="{{download_stl_url}}" style="display: inline-block; background: #ff6b00; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">🎯 Descargar STL</a>
        </div>
        
        <div style="background: #ff4444; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⏰ IMPORTANTE:</strong> Estos enlaces estarán disponibles por {{expiry_days}} días.</p>
        </div>
        
        <p style="text-align: center; color: #888;">
            Para guardar permanentemente tus configuraciones y acceder a funciones adicionales,<br>
            te recomendamos crear una cuenta gratuita en nuestra plataforma.
        </p>
        
        <p style="text-align: center;">
            ¡Gracias por personalizar con nosotros!<br>
            <strong>{{from_name}}</strong>
        </p>
    </div>
</body>
</html>
```

4. **Copia el `Template ID`** que aparece

### **Paso 4: Obtener Public Key**
1. Ve a **"Integration"** en el menú
2. **Copia tu `Public Key`**

### **Paso 5: Configurar en el Código**
1. Abre el archivo `services/emailService.ts`
2. Encuentra esta sección y reemplaza los valores:

```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'TU_SERVICE_ID_AQUI',     // Del paso 2
  TEMPLATE_ID: 'TU_TEMPLATE_ID_AQUI',   // Del paso 3
  PUBLIC_KEY: 'TU_PUBLIC_KEY_AQUI',     // Del paso 4
};
```

---

## ✅ **¡Listo!**

Una vez configurado:
- ✅ Los usuarios invitados recibirán emails **reales**
- ✅ Con enlaces funcionales a sus configuraciones
- ✅ Diseño profesional y responsive
- ✅ 100 emails gratis al mes

---

## 🔧 **Troubleshooting**

### **Si no funcionan los emails:**
1. Verifica que todos los IDs estén correctos
2. Revisa la consola del navegador para errores
3. Asegúrate de que tu servicio de email esté conectado
4. Verifica los límites de tu plan EmailJS

### **Modo Simulación:**
Si EmailJS no está configurado, el sistema:
- ✅ Sigue funcionando normalmente
- 🔶 Muestra emails simulados en la consola
- 💡 Incluye instrucciones para configurar emails reales

---

## 📊 **Planes EmailJS**

- **Gratis:** 100 emails/mes
- **Personal:** $15/mes - 1,000 emails
- **Business:** $50/mes - 10,000 emails

**Perfecto para empezar con el plan gratuito.** 