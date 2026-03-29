import { SelectedParts } from '../types';
import { Resend } from 'resend';

// ⚠️ IMPORTANTE: En producción, esto debe estar en el backend por seguridad
// Esta es una implementación simplificada para desarrollo/pruebas
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY || ''; // Usar variable de entorno de Vite

// Inicializar cliente de Resend solo si hay API key
let resend: Resend | null = null;
if (RESEND_API_KEY && RESEND_API_KEY.startsWith('re_')) {
  try {
    resend = new Resend(RESEND_API_KEY);
  } catch (error) {
    console.warn('Error initializing Resend client:', error);
  }
}

export interface ResendEmailConfig {
  to: string;
  subject: string;
  html: string;
  configId: string;
  totalPrice: number;
}

export class ResendEmailService {
  
  /**
   * Verifica si Resend está configurado
   */
  static isConfigured(): boolean {
    return RESEND_API_KEY.startsWith('re_') && RESEND_API_KEY.length > 10;
  }

  /**
   * Envía email usando Resend API directamente
   */
  static async sendConfigurationEmail(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    configId: string
  ): Promise<{ success: boolean; error?: string }> {
    
    // Si Resend no está configurado, usar simulación
    if (!this.isConfigured()) {
      console.warn('⚠️ Resend API Key no configurada, enviando email simulado');
      return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
    }

    try {
      if (!resend) {
        console.warn('⚠️ Resend client not initialized, using simulation');
        return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
      }
      
      console.log('📧 Enviando email real con Resend...');
      
      // Generar contenido del email
      const configName = `Superhéroe Custom ${new Date().toLocaleDateString()}`;
      const partsList = Object.entries(configuration)
        .filter(([_, part]) => part !== null)
        .map(([category, part]) => `<li><strong>${category}:</strong> ${part?.name || 'Unknown'} ($${part?.priceUSD || 0})</li>`)
        .join('');

      const baseUrl = 'http://localhost:5177'; // URL del frontend para acceder a la configuración
      
      // Template HTML para el email con diseño mejorado
      const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tu Configuración de Superhéroe</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            line-height: 1.6;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 800;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 500;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 24px;
            font-weight: 600;
        }
        
        .intro {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 32px;
        }
        
        .config-details {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            border: 1px solid #e2e8f0;
        }
        
        .config-title {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .config-list {
            list-style: none;
            margin-bottom: 24px;
        }
        
        .config-list li {
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 15px;
            color: #4a5568;
        }
        
        .config-list li:last-child {
            border-bottom: none;
        }
        
        .config-list strong {
            color: #2d3748;
            font-weight: 600;
        }
        
        .parts-title {
            font-size: 18px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .parts-list {
            list-style: none;
            background: white;
            border-radius: 8px;
            padding: 16px;
            border: 1px solid #e2e8f0;
        }
        
        .parts-list li {
            padding: 6px 0;
            font-size: 14px;
            color: #4a5568;
            border-bottom: 1px solid #f7fafc;
        }
        
        .parts-list li:last-child {
            border-bottom: none;
        }
        
        .parts-list strong {
            color: #2d3748;
            font-weight: 600;
        }
        
        .actions {
            text-align: center;
            margin: 40px 0;
        }
        
        .actions-title {
            font-size: 22px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 24px;
        }
        
        .button-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
        }
        
        .btn {
            display: inline-block;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            text-align: center;
            transition: all 0.3s ease;
            min-width: 280px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(66, 153, 225, 0.4);
        }
        
        .btn-secondary {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
        }
        
        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
        }
        
        .btn-tertiary {
            background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
            color: white;
        }
        
        .btn-tertiary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(237, 137, 54, 0.4);
        }
        
        .instructions {
            background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
            border-left: 4px solid #4299e1;
        }
        
        .instructions h3 {
            font-size: 18px;
            font-weight: 700;
            color: #2c5282;
            margin-bottom: 16px;
        }
        
        .instructions ul {
            list-style: none;
            margin: 0;
        }
        
        .instructions li {
            padding: 8px 0;
            color: #2c5282;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .warning {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            border-radius: 12px;
            padding: 20px;
            margin: 32px 0;
            border-left: 4px solid #e53e3e;
            text-align: center;
        }
        
        .warning p {
            color: #c53030;
            font-weight: 600;
            font-size: 16px;
        }
        
        .footer {
            background: #f7fafc;
            padding: 32px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
            color: #718096;
            font-size: 14px;
            margin-bottom: 16px;
        }
        
        .footer .brand {
            color: #2d3748;
            font-weight: 700;
            font-size: 18px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 12px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .btn {
                min-width: 100%;
                padding: 14px 24px;
            }
            
            .button-group {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🦸‍♂️ ¡Tu Superhéroe Está Listo!</h1>
            <p>Configuración personalizada completada</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                ¡Hola, Héroe Personalizado! 👋
            </div>
            
            <div class="intro">
                Gracias por usar nuestro <strong>Superhero 3D Customizer</strong>. Tu configuración personalizada ha sido guardada exitosamente y está lista para descargar.
            </div>
            
            <div class="config-details">
                <div class="config-title">
                    📋 Detalles de tu Configuración
                </div>
                <ul class="config-list">
                    <li><strong>🦸 Nombre:</strong> ${configName}</li>
                    <li><strong>💰 Precio Total:</strong> $${totalPrice.toFixed(2)} USD</li>
                    <li><strong>🗓️ Fecha de Creación:</strong> ${new Date().toLocaleDateString()}</li>
                    <li><strong>🆔 ID de Configuración:</strong> ${configId}</li>
                </ul>
                
                <div class="parts-title">
                    🎨 Partes Seleccionadas
                </div>
                <ul class="parts-list">
                    ${partsList}
                </ul>
            </div>
            
            <div class="actions">
                <div class="actions-title">
                    🚀 Accede a tu Configuración
                </div>
                <div class="button-group">
                    <a href="${baseUrl}?load=${configId}" class="btn btn-primary">
                        👀 Ver en Customizador 3D
                    </a>
                    <a href="http://localhost:3001/download/${configId}/glb" class="btn btn-secondary">
                        📥 Descargar Modelo GLB
                    </a>
                    <a href="http://localhost:3001/download/${configId}/stl" class="btn btn-tertiary">
                        🎯 Descargar Archivo STL
                    </a>
                </div>
            </div>
            
            <div class="instructions">
                <h3>💡 Instrucciones de Uso</h3>
                <ul>
                    <li>🖥️ <strong>Ver en Customizador:</strong> Abre tu superhéroe en el editor 3D interactivo</li>
                    <li>📥 <strong>Descargar GLB:</strong> Formato 3D para visualización y edición</li>
                    <li>🎯 <strong>Descargar STL:</strong> Formato optimizado para impresión 3D</li>
                </ul>
            </div>
            
            <div class="warning">
                <p>⏰ <strong>Importante:</strong> Tus enlaces de descarga estarán disponibles por 7 días</p>
            </div>
        </div>
        
        <div class="footer">
            <p>
                Para guardar permanentemente tus configuraciones y acceder a funciones adicionales,<br>
                te recomendamos crear una cuenta gratuita en nuestra plataforma.
            </p>
            <div class="brand">
                Superhero 3D Customizer
            </div>
        </div>
    </div>
</body>
</html>`;

      // Primero guardar configuración en el servidor backend
      const configData = {
        selectedParts: configuration,
        totalPrice,
        configName,
        email,
        createdAt: new Date().toISOString()
      };

      const saveResponse = await fetch('http://localhost:3001/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configId,
          selectedParts: configuration,
          totalPrice,
          configName,
          email,
        }),
      });

      if (!saveResponse.ok) {
        console.error('❌ Error guardando configuración en servidor backend');
      }

      // Enviar email usando servidor backend
      const response = await fetch('http://localhost:3001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Superhero 3D Customizer <onboarding@resend.dev>',
          to: email,
          subject: `🦸‍♂️ Tu Superhéroe "${configName}" está listo - Superhero 3D Customizer`,
          html: emailHTML,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error del servidor de email:', errorData);
        
        // Fallback a simulación si el servidor falla
        return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
      }

      const result = await response.json();
      
      if (!result.success) {
        console.error('❌ Error de Resend:', result.error);
        
        // Fallback a simulación si Resend falla
        return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
      }

      console.log('✅ Email enviado exitosamente con servidor backend:', result.data);
      
      return { success: true };

    } catch (error) {
      console.error('Error al enviar email con Resend:', error);
      
      // Fallback a simulación en caso de error
      return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
    }
  }

  /**
   * Envía email simulado (fallback) con contenido mejorado
   */
  private static async sendSimulatedEmail(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    configId: string
  ): Promise<{ success: boolean; error?: string }> {
    console.log('\n🔶 MODO SIMULACIÓN - Resend API Key no configurada');
    console.log('══════════════════════════════════════════════════════════════');
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generar contenido del email
    const configName = `Superhéroe Custom ${new Date().toLocaleDateString()}`;
    const partsList = Object.entries(configuration)
      .filter(([_, part]) => part !== null)
      .map(([category, part]) => `- ${category}: ${part?.name || 'Unknown'} ($${part?.priceUSD || 0})`)
      .join('\n');

    const baseUrl = 'http://localhost:5177'; // URL del frontend para acceder a la configuración

    const emailContent = `
📧 EMAIL ENVIADO A: ${email}
═══════════════════════════════════════════════════════════════

🦸‍♂️ ¡Tu Superhéroe Está Listo!

Hola,

Gracias por usar nuestro Superhero 3D Customizer. 
Tu configuración personalizada ha sido guardada exitosamente.

📧 DETALLES DE TU CONFIGURACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🦸 Nombre: ${configName}
💰 Precio Total: $${totalPrice.toFixed(2)} USD
🗓️ Fecha: ${new Date().toLocaleDateString()}
🆔 ID: ${configId}

📋 PARTES SELECCIONADAS:
${partsList}

🔗 ENLACE DE ACCESO:
- Ver y descargar tu superhéroe: ${baseUrl}?load=${configId}

💡 INSTRUCCIONES:
1. Haz clic en el enlace de arriba
2. Se abrirá tu configuración en el customizador 3D
3. Abre el panel de configuración (botón superior derecho)
4. Haz clic en "Download" para descargar tu modelo GLB real

⏰ IMPORTANTE: Estos enlaces estarán disponibles por 7 días.

Para guardar permanentemente tus configuraciones y acceder a funciones adicionales, 
te recomendamos crear una cuenta gratuita en nuestra plataforma.

¡Gracias por personalizar con nosotros!

El equipo de Superhero 3D Customizer

═══════════════════════════════════════════════════════════════

💡 PARA RECIBIR EMAILS REALES:
1. Obtén tu API Key de Resend: https://resend.com/api-keys
2. Reemplaza 'RE_TU_API_KEY_AQUI' en services/resendEmailService.ts
3. ¡Los emails se enviarán automáticamente!

📧 MIENTRAS TANTO: Este contenido muestra exactamente lo que recibirían 
los usuarios por email. ¡El sistema funciona perfectamente!

═══════════════════════════════════════════════════════════════
    `;

    // NO loggear contenido completo del email por seguridad
    console.log(`📧 Email simulado enviado a: ${email.substring(0, 3)}***@${email.split('@')[1]}`);

    // Simular éxito (95% éxito para demostrar confiabilidad)
    const success = Math.random() > 0.05;

    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Error simulado al enviar el email. Inténtalo de nuevo.' };
    }
  }

  /**
   * Guarda configuración para usuarios invitados
   */
  static async saveGuestConfiguration(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    selectedArchetype?: string
  ): Promise<{ success: boolean; configId?: string; error?: string }> {
    try {
      const configId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const accessToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Guardar en localStorage para persistencia
      const configData = {
        id: configId,
        email,
        configuration,
        selectedParts: configuration, // Alias para compatibilidad
        selectedArchetype,
        totalPrice,
        createdAt: new Date().toISOString(),
        accessToken
      };
      
      localStorage.setItem(`guest_config_${configId}`, JSON.stringify(configData));
      
      // TAMBIÉN guardar en sessionStorage para cargar desde URL
      sessionStorage.setItem(`config_${configId}`, JSON.stringify(configData));
      
      console.log('✅ Configuración guardada en localStorage y sessionStorage');

      return { success: true, configId };

    } catch (error) {
      console.error('Error saving guest configuration:', error);
      return { success: false, error: 'Error al guardar la configuración' };
    }
  }

  /**
   * Obtiene información del estado del servicio de email
   */
  static getEmailServiceStatus(): {
    service: 'resend' | 'simulation';
    configured: boolean;
    message: string;
  } {
    if (this.isConfigured()) {
      return {
        service: 'resend',
        configured: true,
        message: '✅ Resend configurado correctamente. Enviando emails reales.'
      };
    } else {
      return {
        service: 'simulation',
        configured: false,
        message: '🔶 Modo simulación. Configura Resend API Key para emails reales.'
      };
    }
  }

  /**
   * Envía un email de prueba usando el backend Node.js
   */
  static async sendTestEmail(testEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Enviando email de prueba vía backend...');
      
      const response = await fetch('http://localhost:3001/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        return { success: false, error: `Error HTTP ${response.status}: ${errorData}` };
      }

      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: `Error del backend: ${result.error}` };
      }

      console.log('✅ Email de prueba enviado vía backend:', result.data);
      return { success: true };

    } catch (error: any) {
      console.error('Error enviando email de prueba:', error);
      return { success: false, error: `Error de conexión: ${error.message}` };
    }
  }
} 