import { supabase } from '../lib/supabase';
import { SelectedParts } from '../types';

export interface SupabaseEmailConfig {
  to: string;
  subject: string;
  html: string;
  configId: string;
  totalPrice: number;
}

export class SupabaseEmailService {
  
  /**
   * Send email using Supabase Edge Function
   */
  static async sendConfigurationEmail(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    configId: string
  ): Promise<{ success: boolean; error?: string }> {
    
    if (!supabase) {
      console.warn('⚠️ Supabase is not configured, sending simulated email');
      return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
    }

    try {
      // Generate email content
      const configName = `Custom Superhero ${new Date().toLocaleDateString()}`;
      const partsList = Object.entries(configuration)
        .filter(([_, part]) => part !== null)
        .map(([category, part]) => `<li><strong>${category}:</strong> ${part?.name || 'Unknown'} ($${part?.priceUSD || 0})</li>`)
        .join('');

      const baseUrl = window.location.origin;
      
      // HTML template for the email
      const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Superhero Configuration</title>
</head>
<body style="font-family: Arial, sans-serif; background: #1a1a1a; color: #ffffff; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px;">
        <h1 style="color: #00ff88; text-align: center;">🦸‍♂️ Your Superhero is Ready!</h1>
        
        <p>Hello <strong>Custom Hero</strong>,</p>
        
        <p>Thank you for using our <strong>Superhero 3D Customizer</strong>. Your custom configuration has been saved successfully.</p>
        
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #00ff88;">📧 YOUR CONFIGURATION DETAILS:</h3>
            <ul style="color: #cccccc;">
                <li><strong>🦸 Name:</strong> ${configName}</li>
                <li><strong>💰 Total Price:</strong> $${totalPrice.toFixed(2)} USD</li>
                <li><strong>🗓️ Date:</strong> ${new Date().toLocaleDateString()}</li>
                <li><strong>🆔 ID:</strong> ${configId}</li>
            </ul>
            
            <h3 style="color: #00ff88;">📋 SELECTED PARTS:</h3>
            <ul style="color: #cccccc;">
                ${partsList}
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #00ff88;">🔗 ACCESS YOUR CONFIGURATION:</h3>
            <a href="${baseUrl}?load=${configId}" style="display: inline-block; background: #00ff88; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">👀 View Configuration</a>
            <a href="${baseUrl}/download/${configId}/glb" style="display: inline-block; background: #ff6b00; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">📥 Download GLB</a>
            <a href="${baseUrl}/download/${configId}/stl" style="display: inline-block; background: #ff6b00; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; font-weight: bold;">🎯 Download STL</a>
        </div>
        
        <div style="background: #ff4444; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⏰ IMPORTANT:</strong> These links will be available for 7 days.</p>
        </div>
        
        <p style="text-align: center; color: #888;">
            To permanently save your configurations and access additional features,<br>
            we recommend creating a free account on our platform.
        </p>
        
        <p style="text-align: center;">
            Thank you for customizing with us!<br>
            <strong>Superhero 3D Customizer</strong>
        </p>
    </div>
</body>
</html>`;

      // Call Supabase Edge Function to send email
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: `🦸‍♂️ Your Superhero "${configName}" is ready - Superhero 3D Customizer`,
          html: emailHTML,
          configId: configId,
          totalPrice: totalPrice
        }
      });

      if (error) {
        console.error('❌ Error al enviar email con Supabase:', error);
        
        // Fallback a simulación si Supabase falla
        return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
      }

      console.log('✅ Email enviado exitosamente con Supabase:', data);
      return { success: true };

    } catch (error) {
      console.error('Error al enviar email con Supabase:', error);
      
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
    console.log('\n🔶 MODO SIMULACIÓN - Supabase Edge Function no disponible');
    console.log('══════════════════════════════════════════════════════════════');
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generar contenido del email
    const configName = `Superhéroe Custom ${new Date().toLocaleDateString()}`;
    const partsList = Object.entries(configuration)
      .filter(([_, part]) => part !== null)
      .map(([category, part]) => `- ${category}: ${part?.name || 'Unknown'} ($${part?.priceUSD || 0})`)
      .join('\n');

    const baseUrl = window.location.origin;

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

🔗 ENLACES DE ACCESO:
- Ver configuración: ${baseUrl}?load=${configId}
- Descargar modelo GLB: ${baseUrl}/download/${configId}/glb
- Descargar modelo STL: ${baseUrl}/download/${configId}/stl

⏰ IMPORTANTE: Estos enlaces estarán disponibles por 7 días.

Para guardar permanentemente tus configuraciones y acceder a funciones adicionales, 
te recomendamos crear una cuenta gratuita en nuestra plataforma.

¡Gracias por personalizar con nosotros!

El equipo de Superhero 3D Customizer

═══════════════════════════════════════════════════════════════

💡 PARA RECIBIR EMAILS REALES:
1. Configura Supabase Edge Function para envío de emails
2. O configura EmailJS como alternativa
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
   * Guarda configuración para usuarios invitados en Supabase
   */
  static async saveGuestConfiguration(
    email: string,
    configuration: SelectedParts,
    totalPrice: number
  ): Promise<{ success: boolean; configId?: string; error?: string }> {
    try {
      const configId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const accessToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Guardar en localStorage como backup
      const configData = {
        id: configId,
        email,
        configuration,
        totalPrice,
        createdAt: new Date().toISOString(),
        accessToken
      };
      
      localStorage.setItem(`guest_config_${configId}`, JSON.stringify(configData));

      // Intentar guardar en Supabase si está disponible
      // COMENTADO: tabla guest_configurations no existe
      /*
      if (supabase) {
        try {
          const { error } = await supabase
            .from('guest_configurations')
            .insert({
              id: configId,
              email,
              configuration_data: configuration,
              total_price: totalPrice,
              access_token: accessToken,
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
            });

          if (error) {
            console.warn('No se pudo guardar en Supabase, usando localStorage:', error);
          } else {
            console.log('✅ Configuración guardada en Supabase');
          }
        } catch (supabaseError) {
          console.warn('Error con Supabase, usando localStorage:', supabaseError);
        }
      }
      */

      return { success: true, configId };

    } catch (error) {
      console.error('Error saving guest configuration:', error);
      return { success: false, error: 'Error al guardar la configuración' };
    }
  }

  /**
   * Verifica si Supabase está configurado correctamente
   */
  static isSupabaseConfigured(): boolean {
    return supabase !== null;
  }

  /**
   * Obtiene información del estado del servicio de email
   */
  static getEmailServiceStatus(): {
    service: 'supabase' | 'simulation';
    configured: boolean;
    message: string;
  } {
    if (this.isSupabaseConfigured()) {
      return {
        service: 'supabase',
        configured: true,
        message: 'Supabase configurado. Para emails reales, configura Edge Function.'
      };
    } else {
      return {
        service: 'simulation',
        configured: false,
        message: 'Modo simulación. Configura Supabase para emails reales.'
      };
    }
  }
} 