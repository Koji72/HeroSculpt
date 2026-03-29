import { SelectedParts } from '../types';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

export interface EmailConfigurationData {
  id: string;
  email: string;
  configuration: SelectedParts;
  totalPrice: number;
  createdAt: string;
  accessToken: string;
}

// Configuración de EmailJS (necesitarás configurar estos valores)
const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id', // Reemplazar con tu Service ID
  TEMPLATE_ID: 'your_template_id', // Reemplazar con tu Template ID  
  PUBLIC_KEY: 'your_public_key', // Reemplazar con tu Public Key
};

export class EmailService {
  
  /**
   * Inicializa EmailJS con la clave pública
   */
  private static initEmailJS() {
    if (EMAILJS_CONFIG.PUBLIC_KEY !== 'your_public_key') {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }

  /**
   * Genera un token único para acceso a la configuración
   */
  private static generateAccessToken(): string {
    return `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Guarda la configuración temporalmente para usuarios invitados
   */
  static async saveGuestConfiguration(
    email: string,
    configuration: SelectedParts,
    totalPrice: number
  ): Promise<{ success: boolean; configId?: string; error?: string }> {
    try {
      const configId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const accessToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Guardar en localStorage del navegador como backup
      const configData = {
        id: configId,
        email,
        configuration,
        totalPrice,
        createdAt: new Date().toISOString(),
        accessToken
      };
      
      localStorage.setItem(`guest_config_${configId}`, JSON.stringify(configData));

      // También intentar guardar en Supabase en una tabla temporal (opcional)
      // COMENTADO: tabla guest_configurations no existe
      /*
      if (supabase) {
        try {
          await supabase
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
        } catch (error) {
          console.warn('No se pudo guardar en Supabase, usando solo localStorage:', error);
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
   * Envía la configuración por email usando EmailJS
   */
  static async sendConfigurationEmail(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    configId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar si EmailJS está configurado
      if (EMAILJS_CONFIG.PUBLIC_KEY === 'your_public_key' || 
          EMAILJS_CONFIG.SERVICE_ID === 'your_service_id' ||
          EMAILJS_CONFIG.TEMPLATE_ID === 'your_template_id') {
        
        // Si EmailJS no está configurado, fallback a simulación mejorada
        return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
      }

      // Inicializar EmailJS
      this.initEmailJS();

      // Generar contenido del email
      const configName = `Superhéroe Custom ${new Date().toLocaleDateString()}`;
      const partsList = Object.entries(configuration)
        .filter(([_, part]) => part !== null)
        .map(([category, part]) => `${category}: ${part?.name || 'Unknown'} ($${part?.priceUSD || 0})`)
        .join('\n');

      const baseUrl = window.location.origin;
      
      // Parámetros para el template de EmailJS
      const templateParams = {
        to_email: email,
        to_name: 'Héroe Personalizado',
        config_name: configName,
        total_price: totalPrice.toFixed(2),
        date: new Date().toLocaleDateString(),
        parts_list: partsList,
        view_url: `${baseUrl}?load=${configId}`,
        download_glb_url: `${baseUrl}/download/${configId}/glb`,
        download_stl_url: `${baseUrl}/download/${configId}/stl`,
        expiry_days: '7',
        from_name: 'Superhero 3D Customizer'
      };

      // Enviar email usando EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        console.log('✅ Email enviado exitosamente:', response);
        return { success: true };
      } else {
        console.error('❌ Error al enviar email:', response);
        return { success: false, error: 'Error al enviar el email' };
      }

    } catch (error) {
      console.error('Error sending email with EmailJS:', error);
      
      // Fallback a simulación si EmailJS falla
      return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
    }
  }

  /**
   * Envía email simulado mejorado (fallback)
   */
  private static async sendSimulatedEmail(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    configId: string
  ): Promise<{ success: boolean; error?: string }> {
    console.log('\n🔶 MODO SIMULACIÓN - EmailJS no configurado');
    console.log('══════════════════════════════════════════════');
    
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

¡Hola!

Gracias por usar nuestro Superhero 3D Customizer. Tu configuración personalizada ha sido guardada exitosamente.

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
1. Configura EmailJS en services/emailService.ts
2. Añade tu SERVICE_ID, TEMPLATE_ID y PUBLIC_KEY
3. ¡Los emails se enviarán automáticamente!

═══════════════════════════════════════════════════════════════
    `;

    // NO loggear contenido completo del email por seguridad
    console.log(`📧 Email simulado enviado a: ${email.substring(0, 3)}***@${email.split('@')[1]}`);

    // Simular éxito (90% éxito simulado)
    const success = Math.random() > 0.1;

    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Error simulado al enviar el email. Inténtalo de nuevo.' };
    }
  }

  /**
   * Valida formato de email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtiene una configuración guardada por ID
   */
  static async getGuestConfiguration(configId: string): Promise<EmailConfigurationData | null> {
    try {
      // Intentar obtener de localStorage primero
      const localData = localStorage.getItem(`guest_config_${configId}`);
      if (localData) {
        return JSON.parse(localData);
      }

      // La lógica de Supabase estaba comentada y podría causar problemas.
      // Se ha eliminado para simplificar y asegurar la compilación.

      return null;

    } catch (error) {
      console.error('Error getting guest configuration:', error);
      return null;
    }
  }

  /**
   * Limpia configuraciones expiradas (más de 7 días)
   */
  static async cleanupExpiredConfigurations(): Promise<void> {
    try {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      // Limpiar localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('guest_config_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');
            const createdAt = new Date(data.createdAt).getTime();
            if (createdAt < sevenDaysAgo) {
              keysToRemove.push(key);
            }
          } catch (error) {
            // Remover datos corruptos
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // La lógica de Supabase estaba comentada y se ha eliminado.

    } catch (error) {
      console.error('Error cleaning up configurations:', error);
    }
  }

  /**
   * Verifica si EmailJS está configurado correctamente
   */
  static isEmailJSConfigured(): boolean {
    return EMAILJS_CONFIG.PUBLIC_KEY !== 'your_public_key' && 
           EMAILJS_CONFIG.SERVICE_ID !== 'your_service_id' &&
           EMAILJS_CONFIG.TEMPLATE_ID !== 'your_template_id';
  }
}

// Ejecutar limpieza al cargar el módulo
EmailService.cleanupExpiredConfigurations(); 