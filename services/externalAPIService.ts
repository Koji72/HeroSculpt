import { supabase } from '../lib/supabase';

export interface DiscordWebhook {
  id: string;
  url: string;
  channel: string;
  isActive: boolean;
}

export interface SocialShare {
  platform: 'discord' | 'twitter' | 'reddit' | 'instagram';
  content: string;
  imageUrl?: string;
  tags: string[];
  scheduledFor?: Date;
}

export interface CloudStorage {
  provider: 'supabase' | 'aws' | 'google' | 'azure';
  bucket: string;
  path: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export interface APIIntegration {
  id: string;
  name: string;
  type: 'discord' | 'twitter' | 'storage' | 'analytics';
  config: Record<string, unknown>;
  isActive: boolean;
  lastUsed?: Date;
}

export class ExternalAPIService {
  private static instance: ExternalAPIService;
  private integrations: Map<string, APIIntegration> = new Map();

  static getInstance(): ExternalAPIService {
    if (!ExternalAPIService.instance) {
      ExternalAPIService.instance = new ExternalAPIService();
    }
    return ExternalAPIService.instance;
  }

  constructor() {
    this.loadIntegrations();
  }

  // 🔧 CARGAR INTEGRACIONES
  private async loadIntegrations(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      data?.forEach(integration => {
        this.integrations.set(integration.id, integration);
      });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error loading integrations:', error);
    }
  }

  // 🎮 INTEGRACIÓN CON DISCORD
  async shareToDiscord(
    webhookId: string,
    content: string,
    imageUrl?: string,
    embed?: {
      title?: string;
      description?: string;
      color?: number;
      fields?: Array<{ name: string; value: string; inline?: boolean }>;
    }
  ): Promise<boolean> {
    try {
      const webhook = await this.getDiscordWebhook(webhookId);
      if (!webhook || !webhook.isActive) {
        throw new Error('Discord webhook not found or inactive');
      }

      const payload: { content: string; embeds: unknown[] } = {
        content,
        embeds: []
      };

      if (embed) {
        payload.embeds.push({
          title: embed.title,
          description: embed.description,
          color: embed.color || 0x00bfff,
          fields: embed.fields || [],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'Superhero 3D Customizer'
          }
        });
      }

      if (imageUrl) {
        payload.embeds[0] = {
          ...payload.embeds[0],
          image: { url: imageUrl }
        };
      }

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }

      // Registrar uso
      await this.logAPICall(webhookId, 'discord', 'success');
      return true;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error sharing to Discord:', error);
      await this.logAPICall(webhookId, 'discord', 'error', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  // 🐦 INTEGRACIÓN CON TWITTER (X)
  async shareToTwitter(
    content: string,
    imageUrl?: string,
    tags: string[] = []
  ): Promise<boolean> {
    try {
      const twitterIntegration = this.getIntegrationByType('twitter');
      if (!twitterIntegration) {
        throw new Error('Twitter integration not configured');
      }

      // Construir contenido con hashtags
      const hashtags = tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
      const fullContent = `${content}\n\n${hashtags}`;

      // Aquí iría la lógica real de la API de Twitter
      // Por ahora simulamos la respuesta
      if (import.meta.env.DEV) console.log('Sharing to Twitter:', { content: fullContent, imageUrl });

      await this.logAPICall(twitterIntegration.id, 'twitter', 'success');
      return true;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error sharing to Twitter:', error);
      return false;
    }
  }

  // 📁 ALMACENAMIENTO EN LA NUBE
  async uploadToCloud(
    file: File,
    path: string,
    provider: CloudStorage['provider'] = 'supabase'
  ): Promise<CloudStorage> {
    try {
      let uploadResult: CloudStorage;

      switch (provider) {
        case 'supabase':
          uploadResult = await this.uploadToSupabase(file, path);
          break;
        case 'aws':
          uploadResult = await this.uploadToAWS(file, path);
          break;
        case 'google':
          uploadResult = await this.uploadToGoogle(file, path);
          break;
        case 'azure':
          uploadResult = await this.uploadToAzure(file, path);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      // Guardar registro en base de datos
      await this.saveCloudStorageRecord(uploadResult);
      return uploadResult;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error uploading to cloud:', error);
      throw error;
    }
  }

  // ☁️ SUBIR A SUPABASE STORAGE
  private async uploadToSupabase(file: File, path: string): Promise<CloudStorage> {
    const { data, error } = await supabase.storage
      .from('hero-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('hero-images')
      .getPublicUrl(path);

    return {
      provider: 'supabase',
      bucket: 'hero-images',
      path: data.path,
      url: urlData.publicUrl,
      size: file.size,
      uploadedAt: new Date()
    };
  }

  // 🚀 SUBIR A AWS S3
  private async uploadToAWS(file: File, path: string): Promise<CloudStorage> {
    // Implementación de AWS S3
    // Por ahora simulamos
    return {
      provider: 'aws',
      bucket: 'hero-customizer',
      path,
      url: `https://hero-customizer.s3.amazonaws.com/${path}`,
      size: file.size,
      uploadedAt: new Date()
    };
  }

  // 🔍 SUBIR A GOOGLE CLOUD
  private async uploadToGoogle(file: File, path: string): Promise<CloudStorage> {
    // Implementación de Google Cloud Storage
    // Por ahora simulamos
    return {
      provider: 'google',
      bucket: 'hero-customizer-storage',
      path,
      url: `https://storage.googleapis.com/hero-customizer-storage/${path}`,
      size: file.size,
      uploadedAt: new Date()
    };
  }

  // ☁️ SUBIR A AZURE BLOB
  private async uploadToAzure(file: File, path: string): Promise<CloudStorage> {
    // Implementación de Azure Blob Storage
    // Por ahora simulamos
    return {
      provider: 'azure',
      bucket: 'hero-customizer',
      path,
      url: `https://herocustomizer.blob.core.windows.net/hero-customizer/${path}`,
      size: file.size,
      uploadedAt: new Date()
    };
  }

  // 📊 ANALÍTICAS EXTERNAS
  async sendAnalytics(
    event: string,
    data: Record<string, unknown>,
    provider: 'google' | 'mixpanel' | 'amplitude' = 'google'
  ): Promise<void> {
    try {
      switch (provider) {
        case 'google':
          await this.sendGoogleAnalytics(event, data);
          break;
        case 'mixpanel':
          await this.sendMixpanelAnalytics(event, data);
          break;
        case 'amplitude':
          await this.sendAmplitudeAnalytics(event, data);
          break;
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error sending analytics:', error);
    }
  }

  // 📈 GOOGLE ANALYTICS
  private async sendGoogleAnalytics(event: string, data: Record<string, unknown>): Promise<void> {
    // Implementación de Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event, data);
    }
  }

  // 📊 MIXPANEL
  private async sendMixpanelAnalytics(event: string, data: Record<string, unknown>): Promise<void> {
    // Implementación de Mixpanel
    if (typeof mixpanel !== 'undefined') {
      mixpanel.track(event, data);
    }
  }

  // 📈 AMPLITUDE
  private async sendAmplitudeAnalytics(event: string, data: Record<string, unknown>): Promise<void> {
    // Implementación de Amplitude
    if (typeof amplitude !== 'undefined') {
      amplitude.getInstance().logEvent(event, data);
    }
  }

  // 🔗 COMPARTIR EN REDES SOCIALES
  async shareToSocialMedia(
    platform: SocialShare['platform'],
    content: string,
    imageUrl?: string,
    tags: string[] = []
  ): Promise<boolean> {
    try {
      switch (platform) {
        case 'discord':
          const webhook = await this.getDefaultDiscordWebhook();
          return await this.shareToDiscord(webhook.id, content, imageUrl);
        
        case 'twitter':
          return await this.shareToTwitter(content, imageUrl, tags);
        
        case 'reddit':
          return await this.shareToReddit(content, imageUrl, tags);
        
        case 'instagram':
          return await this.shareToInstagram(content, imageUrl, tags);
        
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error(`Error sharing to ${platform}:`, error);
      return false;
    }
  }

  // 📱 COMPARTIR EN REDDIT
  private async shareToReddit(content: string, imageUrl?: string, tags: string[] = []): Promise<boolean> {
    // Implementación de Reddit API
    if (import.meta.env.DEV) console.log('Sharing to Reddit:', { content, imageUrl, tags });
    return true;
  }

  // 📸 COMPARTIR EN INSTAGRAM
  private async shareToInstagram(content: string, imageUrl?: string, tags: string[] = []): Promise<boolean> {
    // Implementación de Instagram API
    if (import.meta.env.DEV) console.log('Sharing to Instagram:', { content, imageUrl, tags });
    return true;
  }

  // 🔧 OBTENER WEBHOOK DE DISCORD
  private async getDiscordWebhook(webhookId: string): Promise<DiscordWebhook | null> {
    try {
      const { data, error } = await supabase
        .from('discord_webhooks')
        .select('*')
        .eq('id', webhookId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching Discord webhook:', error);
      return null;
    }
  }

  // 🎯 OBTENER WEBHOOK PREDETERMINADO
  private async getDefaultDiscordWebhook(): Promise<DiscordWebhook> {
    const { data, error } = await supabase
      .from('discord_webhooks')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (error || !data) {
      throw new Error('No active Discord webhook found');
    }

    return data;
  }

  // 🔍 OBTENER INTEGRACIÓN POR TIPO
  private getIntegrationByType(type: APIIntegration['type']): APIIntegration | null {
    for (const integration of this.integrations.values()) {
      if (integration.type === type && integration.isActive) {
        return integration;
      }
    }
    return null;
  }

  // 📝 GUARDAR REGISTRO DE ALMACENAMIENTO
  private async saveCloudStorageRecord(storage: CloudStorage): Promise<void> {
    try {
      const { error } = await supabase
        .from('cloud_storage')
        .insert([{
          provider: storage.provider,
          bucket: storage.bucket,
          path: storage.path,
          url: storage.url,
          size: storage.size,
          uploaded_at: storage.uploadedAt.toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error saving cloud storage record:', error);
      throw error;
    }
  }

  // 📊 REGISTRAR LLAMADA A API
  private async logAPICall(
    integrationId: string,
    service: string,
    status: 'success' | 'error',
    errorMessage?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('api_logs')
        .insert([{
          integration_id: integrationId,
          service,
          status,
          error_message: errorMessage,
          called_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error logging API call:', error);
    }
  }

  // ⚙️ CONFIGURAR INTEGRACIÓN
  async configureIntegration(
    name: string,
    type: APIIntegration['type'],
    config: Record<string, unknown>
  ): Promise<APIIntegration> {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .insert([{
          name,
          type,
          config,
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      this.integrations.set(data.id, data);
      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error configuring integration:', error);
      throw error;
    }
  }

  // 🔄 PROBAR INTEGRACIÓN
  async testIntegration(integrationId: string): Promise<boolean> {
    try {
      const integration = this.integrations.get(integrationId);
      if (!integration) {
        throw new Error('Integration not found');
      }

      switch (integration.type) {
        case 'discord':
          return await this.testDiscordIntegration(integration);
        case 'twitter':
          return await this.testTwitterIntegration(integration);
        case 'storage':
          return await this.testStorageIntegration(integration);
        default:
          throw new Error(`Unsupported integration type: ${integration.type}`);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error testing integration:', error);
      return false;
    }
  }

  // 🎮 PROBAR INTEGRACIÓN DE DISCORD
  private async testDiscordIntegration(integration: APIIntegration): Promise<boolean> {
    return await this.shareToDiscord(
      integration.config.webhookId,
      '🧪 Test message from Superhero 3D Customizer',
      undefined,
      {
        title: 'Integration Test',
        description: 'This is a test message to verify the Discord integration is working correctly.',
        color: 0x00ff00
      }
    );
  }

  // 🐦 PROBAR INTEGRACIÓN DE TWITTER
  private async testTwitterIntegration(integration: APIIntegration): Promise<boolean> {
    return await this.shareToTwitter(
      '🧪 Test message from Superhero 3D Customizer #test #integration',
      undefined,
      ['test', 'integration']
    );
  }

  // ☁️ PROBAR INTEGRACIÓN DE ALMACENAMIENTO
  private async testStorageIntegration(integration: APIIntegration): Promise<boolean> {
    try {
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      await this.uploadToCloud(testFile, 'test/test.txt', integration.config.provider);
      return true;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Storage integration test failed:', error);
      return false;
    }
  }
}

export const externalAPIService = ExternalAPIService.getInstance(); 