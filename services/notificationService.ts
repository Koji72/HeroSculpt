import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  achievementAlerts: boolean;
  missionUpdates: boolean;
  systemAlerts: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private listeners: Map<string, (notification: Notification) => void> = new Map();
  private audioContext: AudioContext | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  constructor() {
    this.initializeAudioContext();
    this.setupRealtimeSubscriptions();
  }

  // 🎵 INICIALIZAR CONTEXTO DE AUDIO
  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported');
    }
  }

  // 📡 CONFIGURAR SUSCRIPCIONES EN TIEMPO REAL
  private setupRealtimeSubscriptions(): void {
    // Suscribirse a cambios en la base de datos
    supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        this.handleRealtimeNotification(payload);
      })
      .subscribe();
  }

  // 🎯 MANEJAR NOTIFICACIÓN EN TIEMPO REAL
  private handleRealtimeNotification(payload: any): void {
    if (payload.eventType === 'INSERT') {
      const notification = payload.new as Notification;
      this.showNotification(notification);
      this.playNotificationSound(notification.type);
    }
  }

  // 🔔 MOSTRAR NOTIFICACIÓN
  showNotification(notification: Notification): void {
    // Notificar a todos los listeners
    this.listeners.forEach(listener => {
      try {
        listener(notification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });

    // Mostrar notificación del navegador si está permitido
    this.showBrowserNotification(notification);
  }

  // 🌐 NOTIFICACIÓN DEL NAVEGADOR
  private async showBrowserNotification(notification: Notification): Promise<void> {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high',
        silent: !this.shouldPlaySound(notification.type)
      });

      // Manejar clic en la notificación
      browserNotification.onclick = () => {
        if (notification.actionUrl) {
          window.open(notification.actionUrl, '_blank');
        }
        browserNotification.close();
      };

      // Auto-cerrar notificaciones de baja prioridad
      if (notification.priority === 'low') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    } else if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(notification);
      }
    }
  }

  // 🎵 REPRODUCIR SONIDO DE NOTIFICACIÓN
  private playNotificationSound(type: Notification['type']): void {
    if (!this.audioContext || !this.shouldPlaySound(type)) {
      return;
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configurar frecuencia según el tipo
      const frequencies = {
        success: 800,
        warning: 600,
        error: 400,
        info: 1000,
        achievement: 1200
      };

      oscillator.frequency.setValueAtTime(frequencies[type] || 800, this.audioContext.currentTime);
      oscillator.type = 'sine';

      // Configurar envolvente
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn('Error playing notification sound:', error);
    }
  }

  // 🔊 VERIFICAR SI DEBE REPRODUCIR SONIDO
  private shouldPlaySound(type: Notification['type']): boolean {
    const settings = this.getNotificationSettings();
    if (!settings.soundEnabled) return false;

    switch (type) {
      case 'achievement':
        return settings.achievementAlerts;
      case 'warning':
      case 'error':
        return settings.systemAlerts;
      default:
        return true;
    }
  }

  // 📨 ENVIAR NOTIFICACIÓN
  async sendNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    priority: Notification['priority'] = 'medium',
    actionUrl?: string
  ): Promise<Notification> {
    try {
      const notification: Omit<Notification, 'id'> = {
        type,
        title,
        message,
        timestamp: new Date(),
        isRead: false,
        actionUrl,
        priority
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notification,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // 🎯 NOTIFICACIONES ESPECÍFICAS
  async sendAchievementNotification(userId: string, achievementName: string): Promise<void> {
    await this.sendNotification(
      userId,
      'achievement',
      '🏆 ¡Logro Desbloqueado!',
      `Has conseguido el logro: ${achievementName}`,
      'high',
      '/headquarters?tab=achievements'
    );
  }

  async sendMissionCompletedNotification(userId: string, missionTitle: string): Promise<void> {
    await this.sendNotification(
      userId,
      'success',
      '✅ Misión Completada',
      `¡Has completado la misión: ${missionTitle}!`,
      'medium',
      '/headquarters?tab=missions'
    );
  }

  async sendCharacterSavedNotification(userId: string, characterName: string): Promise<void> {
    await this.sendNotification(
      userId,
      'success',
      '💾 Héroe Guardado',
      `Tu héroe "${characterName}" ha sido guardado exitosamente`,
      'low'
    );
  }

  async sendSystemAlertNotification(userId: string, message: string): Promise<void> {
    await this.sendNotification(
      userId,
      'warning',
      '⚠️ Alerta del Sistema',
      message,
      'high'
    );
  }

  // 📋 OBTENER NOTIFICACIONES
  async getNotifications(userId: string, limit: number = 50): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // ✅ MARCAR COMO LEÍDA
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ isRead: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // 🗑️ ELIMINAR NOTIFICACIÓN
  async deleteNotification(userId: string, notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // ⚙️ OBTENER CONFIGURACIONES
  getNotificationSettings(): NotificationSettings {
    const stored = localStorage.getItem('notificationSettings');
    if (stored) {
      return JSON.parse(stored);
    }

    // Configuración por defecto
    const defaultSettings: NotificationSettings = {
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      achievementAlerts: true,
      missionUpdates: true,
      systemAlerts: true
    };

    localStorage.setItem('notificationSettings', JSON.stringify(defaultSettings));
    return defaultSettings;
  }

  // ⚙️ GUARDAR CONFIGURACIONES
  saveNotificationSettings(settings: NotificationSettings): void {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }

  // 👂 AGREGAR LISTENER
  addListener(id: string, callback: (notification: Notification) => void): void {
    this.listeners.set(id, callback);
  }

  // 🚫 REMOVER LISTENER
  removeListener(id: string): void {
    this.listeners.delete(id);
  }

  // 📊 OBTENER ESTADÍSTICAS
  async getNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
  }> {
    try {
      const notifications = await this.getNotifications(userId, 1000);
      
      const unread = notifications.filter(n => !n.isRead).length;
      const byType = notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: notifications.length,
        unread,
        byType
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return { total: 0, unread: 0, byType: {} };
    }
  }
}

export const notificationService = NotificationService.getInstance(); 