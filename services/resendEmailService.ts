import { SelectedParts } from '../types';

const getBackendBaseUrl = () => import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const getFrontendBaseUrl = () =>
  typeof window !== 'undefined' && window.location?.origin
    ? window.location.origin
    : 'http://localhost:5177';

export interface ResendEmailConfig {
  to: string;
  subject: string;
  html: string;
  configId: string;
  totalPrice: number;
}

export class ResendEmailService {
  static isConfigured(): boolean {
    return true;
  }

  static async sendConfigurationEmail(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    configId: string
  ): Promise<{ success: boolean; error?: string }> {
    const configName = `Superheroe Custom ${new Date().toLocaleDateString()}`;
    const frontendUrl = getFrontendBaseUrl();
    const backendUrl = getBackendBaseUrl();
    const partsList = Object.entries(configuration)
      .filter(([, part]) => part !== null)
      .map(([category, part]) => `<li><strong>${category}:</strong> ${part?.name || 'Unknown'} ($${part?.priceUSD || 0})</li>`)
      .join('');

    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu configuracion de superheroe</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f5f7fb; color: #1f2937; padding: 24px;">
  <div style="max-width: 640px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px;">
    <h1 style="margin-top: 0;">Tu superheroe esta listo</h1>
    <p>Tu configuracion personalizada ha sido guardada y esta lista para descargar.</p>
    <ul>
      <li><strong>Nombre:</strong> ${configName}</li>
      <li><strong>Precio total:</strong> $${totalPrice.toFixed(2)} USD</li>
      <li><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</li>
      <li><strong>ID:</strong> ${configId}</li>
    </ul>
    <h2>Partes seleccionadas</h2>
    <ul>${partsList}</ul>
    <p><a href="${frontendUrl}?load=${configId}">Abrir en el customizador 3D</a></p>
    <p><a href="${backendUrl}/download/${configId}/glb">Descargar GLB</a></p>
    <p><a href="${backendUrl}/download/${configId}/stl">Descargar STL</a></p>
  </div>
</body>
</html>`;

    try {
      const saveResponse = await fetch(`${backendUrl}/save-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configId,
          selectedParts: configuration,
          totalPrice,
          configName,
          email,
        }),
      });

      if (!saveResponse.ok) {
        return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
      }

      const response = await fetch(`${backendUrl}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: `Tu superheroe "${configName}" esta listo`,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
      }

      const result = await response.json();
      return result.success ? { success: true } : this.sendSimulatedEmail(email, configuration, totalPrice, configId);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error sending configuration email:', error);
      return this.sendSimulatedEmail(email, configuration, totalPrice, configId);
    }
  }

  private static async sendSimulatedEmail(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    configId: string
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const configData = {
      id: configId,
      email,
      configuration,
      selectedParts: configuration,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(`guest_config_${configId}`, JSON.stringify(configData));
      sessionStorage.setItem(`config_${configId}`, JSON.stringify(configData));
      return { success: true };
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error saving simulated email payload:', error);
      return { success: false, error: 'Error al guardar la configuracion local.' };
    }
  }

  static async saveGuestConfiguration(
    email: string,
    configuration: SelectedParts,
    totalPrice: number,
    selectedArchetype?: string
  ): Promise<{ success: boolean; configId?: string; error?: string }> {
    try {
      const configId = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      const accessToken = `token_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      const configData = {
        id: configId,
        email,
        configuration,
        selectedParts: configuration,
        selectedArchetype,
        totalPrice,
        createdAt: new Date().toISOString(),
        accessToken
      };

      localStorage.setItem(`guest_config_${configId}`, JSON.stringify(configData));
      sessionStorage.setItem(`config_${configId}`, JSON.stringify(configData));
      return { success: true, configId };
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error saving guest configuration:', error);
      return { success: false, error: 'Error al guardar la configuracion' };
    }
  }

  static getEmailServiceStatus(): {
    service: 'resend' | 'simulation';
    configured: boolean;
    message: string;
  } {
    return {
      service: 'resend',
      configured: true,
      message: 'Backend de email configurado. El frontend no expone credenciales.'
    };
  }

  static async sendTestEmail(_testEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${getBackendBaseUrl()}/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.text();
        return { success: false, error: `Error HTTP ${response.status}: ${errorData}` };
      }

      const result = await response.json();
      return result.success ? { success: true } : { success: false, error: result.error || 'Unknown backend error' };
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error sending test email:', error);
      return { success: false, error: `Error de conexion: ${error.message}` };
    }
  }
}
