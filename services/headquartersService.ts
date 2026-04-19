import { supabase } from '../lib/supabase';
import { HQStats, HQCharacter, Mission, GalleryHero } from '../types';

export interface HeadquartersData {
  stats: HQStats;
  characters: HQCharacter[];
  missions: Mission[];
  galleryHeroes: GalleryHero[];
  systemStatus: {
    customizer: string;
    database: string;
    renderer: string;
    network: string;
  };
}

export class HeadquartersService {
  private static instance: HeadquartersService;
  private cache: Map<string, any> = new Map();

  static getInstance(): HeadquartersService {
    if (!HeadquartersService.instance) {
      HeadquartersService.instance = new HeadquartersService();
    }
    return HeadquartersService.instance;
  }

  // 🎯 OBTENER DATOS DEL HEADQUARTERS
  async getHeadquartersData(userId: string): Promise<HeadquartersData> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== userId) throw new Error('Unauthorized');

      // Verificar cache primero
      const cacheKey = `hq_data_${userId}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      // Obtener datos de Supabase
      const { data: characters, error: charactersError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (charactersError) throw charactersError;

      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', userId);

      if (missionsError) throw missionsError;

      const { data: galleryHeroes, error: galleryError } = await supabase
        .from('gallery_heroes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (galleryError) throw galleryError;

      // Calcular estadísticas
      const stats = this.calculateStats(characters || [], missions || []);

      // Estado del sistema (simulado por ahora)
      const systemStatus = {
        customizer: 'online',
        database: 'online',
        renderer: 'online',
        network: 'online'
      };

      const headquartersData: HeadquartersData = {
        stats,
        characters: characters || [],
        missions: missions || [],
        galleryHeroes: galleryHeroes || [],
        systemStatus
      };

      // Guardar en cache
      this.cache.set(cacheKey, headquartersData);

      return headquartersData;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching headquarters data:', error);
      throw error;
    }
  }

  // 📊 CALCULAR ESTADÍSTICAS
  private calculateStats(characters: HQCharacter[], missions: Mission[]): HQStats {
    const totalCharacters = characters.length;
    const totalPowerLevel = characters.reduce((sum, char) => sum + char.powerLevel, 0);
    const averageCompatibility = characters.length > 0 
      ? Math.round(characters.reduce((sum, char) => sum + char.compatibility, 0) / characters.length)
      : 0;
    const totalValue = characters.reduce((sum, char) => sum + (char.powerLevel * 10), 0);
    const recentActivity = characters.filter(char => {
      const lastModified = new Date(char.lastModified);
      const now = new Date();
      const diffDays = (now.getTime() - lastModified.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 7;
    }).length;
    const achievements = missions.filter(mission => mission.isCompleted).length;

    return {
      totalCharacters,
      totalPowerLevel,
      averageCompatibility,
      totalValue,
      recentActivity,
      achievements
    };
  }

  // 💾 GUARDAR PERSONAJE
  async saveCharacter(userId: string, character: Omit<HQCharacter, 'id'>): Promise<HQCharacter> {
    try {
      const { data, error } = await supabase
        .from('characters')
        .insert([{
          ...character,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Limpiar cache
      this.cache.delete(`hq_data_${userId}`);

      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error saving character:', error);
      throw error;
    }
  }

  // 🔄 ACTUALIZAR PERSONAJE
  async updateCharacter(userId: string, characterId: string, updates: Partial<HQCharacter>): Promise<HQCharacter> {
    try {
      const { data, error } = await supabase
        .from('characters')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', characterId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Limpiar cache
      this.cache.delete(`hq_data_${userId}`);

      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error updating character:', error);
      throw error;
    }
  }

  // 🗑️ ELIMINAR PERSONAJE
  async deleteCharacter(userId: string, characterId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', characterId)
        .eq('user_id', userId);

      if (error) throw error;

      // Limpiar cache
      this.cache.delete(`hq_data_${userId}`);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error deleting character:', error);
      throw error;
    }
  }

  // 🎯 ACTUALIZAR MISIÓN
  async updateMission(userId: string, missionId: string, updates: Partial<Mission>): Promise<Mission> {
    try {
      const { data, error } = await supabase
        .from('missions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', missionId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Limpiar cache
      this.cache.delete(`hq_data_${userId}`);

      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error updating mission:', error);
      throw error;
    }
  }

  // 🌟 COMPARTIR HÉROE EN GALERÍA
  async shareHeroToGallery(userId: string, hero: Omit<GalleryHero, 'id'>): Promise<GalleryHero> {
    try {
      const { data, error } = await supabase
        .from('gallery_heroes')
        .insert([{
          ...hero,
          user_id: userId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Limpiar cache
      this.cache.delete(`hq_data_${userId}`);

      return data;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error sharing hero to gallery:', error);
      throw error;
    }
  }

  // 🔄 SINCRONIZAR DATOS
  async syncData(userId: string): Promise<void> {
    try {
      // Limpiar cache para forzar actualización
      this.cache.delete(`hq_data_${userId}`);
      
      // Obtener datos frescos
      await this.getHeadquartersData(userId);
      
      if (import.meta.env.DEV) console.log('Data synchronized successfully');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error syncing data:', error);
      throw error;
    }
  }

  // 🧹 LIMPIAR CACHE
  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(`hq_data_${userId}`);
    } else {
      this.cache.clear();
    }
  }
}

export const headquartersService = HeadquartersService.getInstance(); 