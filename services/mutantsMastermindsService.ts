import { supabase } from '../lib/supabase';

// Tipos específicos para M&M
export interface MAndMCharacter {
  id: string;
  userId: string;
  name: string;
  powerLevel: number;
  archetype: string;
  faction?: string;
  portrait?: string;
  mini3D?: string;
  
  // Estadísticas M&M
  abilities: {
    strength: { value: number; cost: number };
    stamina: { value: number; cost: number };
    agility: { value: number; cost: number };
    dexterity: { value: number; cost: number };
    fighting: { value: number; cost: number };
    intellect: { value: number; cost: number };
    awareness: { value: number; cost: number };
    presence: { value: number; cost: number };
  };
  
  defenses: {
    dodge: { value: number; temp: number; total: number };
    parry: { value: number; temp: number; total: number };
    fortitude: { value: number; temp: number; total: number };
    toughness: { value: number; temp: number; total: number };
    will: { value: number; temp: number; total: number };
  };
  
  powers: Array<{
    id: string;
    name: string;
    type: string;
    cost: number;
    descriptor: string;
    description: string;
    effects: string[];
  }>;
  
  skills: {
    [key: string]: { value: number; ability: string; cost: number };
  };
  
  advantages: Array<{
    name: string;
    cost: number;
    description: string;
  }>;
  
  complications: Array<{
    name: string;
    type: 'motivation' | 'enemy' | 'reputation' | 'accident' | 'other';
    description: string;
    points: number;
  }>;
  
  equipment: Array<{
    name: string;
    type: string;
    description: string;
    cost: number;
  }>;
  
  // Progresión
  experience: number;
  totalPoints: number;
  spentPoints: number;
  availablePoints: number;
  
  // Campaña
  campaignId?: string;
  isActive: boolean;
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  lastPlayed?: Date;
  playTime: number; // en minutos
}

export interface MAndMCampaign {
  id: string;
  name: string;
  description: string;
  gmId: string;
  players: string[];
  powerLevel: number;
  setting: string;
  status: 'active' | 'paused' | 'completed' | 'planning';
  
  // Configuración
  houseRules: string[];
  allowedArchetypes: string[];
  allowedFactions: string[];
  
  // Progresión
  sessions: Array<{
    id: string;
    date: Date;
    title: string;
    description: string;
    experienceAwarded: number;
    achievements: string[];
  }>;
  
  // NPCs y Villanos
  npcs: Array<{
    id: string;
    name: string;
    type: 'ally' | 'enemy' | 'neutral';
    powerLevel: number;
    description: string;
    characterData?: Partial<MAndMCharacter>;
  }>;
  
  // Misiones
  missions: Array<{
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'epic';
    rewards: {
      experience: number;
      items: string[];
      achievements: string[];
    };
    status: 'available' | 'active' | 'completed';
    assignedTo?: string[];
  }>;
  
  createdAt: Date;
  updatedAt: Date;
  nextSession?: Date;
}

export interface MAndMPower {
  id: string;
  name: string;
  type: 'attack' | 'defense' | 'movement' | 'sensory' | 'utility' | 'transformation';
  cost: number;
  descriptor: string;
  description: string;
  effects: string[];
  prerequisites: string[];
  archetype: string;
  faction?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface MAndMAchievement {
  id: string;
  name: string;
  description: string;
  category: 'combat' | 'roleplay' | 'exploration' | 'social' | 'creative';
  requirements: {
    type: string;
    value: number;
    description: string;
  }[];
  rewards: {
    experience: number;
    points: number;
    items: string[];
    badges: string[];
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface MAndMStats {
  totalCharacters: number;
  activeCharacters: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalExperience: number;
  totalPlayTime: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  powerLevelAverage: number;
  favoriteArchetype: string;
  favoriteFaction: string;
  sessionsPlayed: number;
  villainsDefeated: number;
  missionsCompleted: number;
}

class MutantsMastermindsService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  // ===== GESTIÓN DE PERSONAJES =====
  
  async getCharacters(userId: string): Promise<MAndMCharacter[]> {
    const cacheKey = `characters_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mnm_characters')
      .select('*')
      .eq('userId', userId)
      .order('updatedAt', { ascending: false });

    if (error) throw new Error(`Error fetching characters: ${error.message}`);
    
    const characters = data?.map(char => ({
      ...char,
      createdAt: new Date(char.createdAt),
      updatedAt: new Date(char.updatedAt),
      lastPlayed: char.lastPlayed ? new Date(char.lastPlayed) : undefined
    })) || [];

    this.setCache(cacheKey, characters);
    return characters;
  }

  async getCharacter(id: string, userId: string): Promise<MAndMCharacter | null> {
    const cacheKey = `character_${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mnm_characters')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single();

    if (error) throw new Error(`Error fetching character: ${error.message}`);
    
    if (!data) return null;

    const character = {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      lastPlayed: data.lastPlayed ? new Date(data.lastPlayed) : undefined
    };

    this.setCache(cacheKey, character);
    return character;
  }

  async saveCharacter(character: Partial<MAndMCharacter>): Promise<MAndMCharacter> {
    const now = new Date();
    const characterData = {
      ...character,
      updatedAt: now,
      createdAt: character.createdAt || now
    };

    let result;
    if (character.id) {
      // Actualizar
      const { data, error } = await supabase
        .from('mnm_characters')
        .update(characterData)
        .eq('id', character.id)
        .eq('userId', character.userId)
        .select()
        .single();

      if (error) throw new Error(`Error updating character: ${error.message}`);
      result = data;
    } else {
      // Crear nuevo
      const { data, error } = await supabase
        .from('mnm_characters')
        .insert(characterData)
        .select()
        .single();

      if (error) throw new Error(`Error creating character: ${error.message}`);
      result = data;
    }

    // Limpiar caché
    this.clearCache(`characters_${character.userId}`);
    this.clearCache(`character_${result.id}`);

    return {
      ...result,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      lastPlayed: result.lastPlayed ? new Date(result.lastPlayed) : undefined
    };
  }

  async deleteCharacter(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('mnm_characters')
      .delete()
      .eq('id', id)
      .eq('userId', userId);

    if (error) throw new Error(`Error deleting character: ${error.message}`);

    // Limpiar caché
    this.clearCache(`characters_${userId}`);
    this.clearCache(`character_${id}`);
  }

  // ===== GESTIÓN DE CAMPAÑAS =====

  async getCampaigns(userId: string): Promise<MAndMCampaign[]> {
    const cacheKey = `campaigns_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mnm_campaigns')
      .select('*')
      .or(`gmId.eq.${userId},players.cs.{${userId}}`)
      .order('updatedAt', { ascending: false });

    if (error) throw new Error(`Error fetching campaigns: ${error.message}`);
    
    const campaigns = data?.map(campaign => ({
      ...campaign,
      createdAt: new Date(campaign.createdAt),
      updatedAt: new Date(campaign.updatedAt),
      nextSession: campaign.nextSession ? new Date(campaign.nextSession) : undefined,
      sessions: campaign.sessions?.map(session => ({
        ...session,
        date: new Date(session.date)
      })) || []
    })) || [];

    this.setCache(cacheKey, campaigns);
    return campaigns;
  }

  async saveCampaign(campaign: Partial<MAndMCampaign>): Promise<MAndMCampaign> {
    const now = new Date();
    const campaignData = {
      ...campaign,
      updatedAt: now,
      createdAt: campaign.createdAt || now
    };

    let result;
    if (campaign.id) {
      const { data, error } = await supabase
        .from('mnm_campaigns')
        .update(campaignData)
        .eq('id', campaign.id)
        .select()
        .single();

      if (error) throw new Error(`Error updating campaign: ${error.message}`);
      result = data;
    } else {
      const { data, error } = await supabase
        .from('mnm_campaigns')
        .insert(campaignData)
        .select()
        .single();

      if (error) throw new Error(`Error creating campaign: ${error.message}`);
      result = data;
    }

    // Limpiar caché
    this.clearCache(`campaigns_${campaign.gmId}`);
    this.clearCache(`campaign_${result.id}`);

    return {
      ...result,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      nextSession: result.nextSession ? new Date(result.nextSession) : undefined,
      sessions: result.sessions?.map(session => ({
        ...session,
        date: new Date(session.date)
      })) || []
    };
  }

  // ===== PODERES Y HABILIDADES =====

  async getPowers(archetype?: string, faction?: string): Promise<MAndMPower[]> {
    const cacheKey = `powers_${archetype || 'all'}_${faction || 'all'}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    let query = supabase.from('mnm_powers').select('*');
    
    if (archetype) {
      query = query.eq('archetype', archetype);
    }
    
    if (faction) {
      query = query.eq('faction', faction);
    }

    const { data, error } = await query.order('name');

    if (error) throw new Error(`Error fetching powers: ${error.message}`);
    
    this.setCache(cacheKey, data || []);
    return data || [];
  }

  // ===== LOGROS Y GAMIFICACIÓN =====

  async getAchievements(userId: string): Promise<MAndMAchievement[]> {
    const cacheKey = `achievements_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const { data, error } = await supabase
      .from('mnm_achievements')
      .select('*')
      .eq('userId', userId)
      .order('category');

    if (error) throw new Error(`Error fetching achievements: ${error.message}`);
    
    const achievements = data?.map(achievement => ({
      ...achievement,
      unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
    })) || [];

    this.setCache(cacheKey, achievements);
    return achievements;
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const now = new Date();
    
    const { error } = await supabase
      .from('mnm_achievements')
      .update({
        isUnlocked: true,
        unlockedAt: now.toISOString()
      })
      .eq('id', achievementId)
      .eq('userId', userId);

    if (error) throw new Error(`Error unlocking achievement: ${error.message}`);

    // Limpiar caché
    this.clearCache(`achievements_${userId}`);
  }

  // ===== ESTADÍSTICAS =====

  async getUserStats(userId: string): Promise<MAndMStats> {
    const cacheKey = `stats_${userId}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Obtener datos básicos
    const [characters, campaigns, achievements] = await Promise.all([
      this.getCharacters(userId),
      this.getCampaigns(userId),
      this.getAchievements(userId)
    ]);

    // Calcular estadísticas
    const stats: MAndMStats = {
      totalCharacters: characters.length,
      activeCharacters: characters.filter(c => c.isActive).length,
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalExperience: characters.reduce((sum, c) => sum + c.experience, 0),
      totalPlayTime: characters.reduce((sum, c) => sum + c.playTime, 0),
      achievementsUnlocked: achievements.filter(a => a.isUnlocked).length,
      totalAchievements: achievements.length,
      powerLevelAverage: characters.length > 0 
        ? Math.round(characters.reduce((sum, c) => sum + c.powerLevel, 0) / characters.length)
        : 0,
      favoriteArchetype: this.getMostFrequent(characters.map(c => c.archetype)),
      favoriteFaction: this.getMostFrequent(characters.map(c => c.faction).filter(Boolean)),
      sessionsPlayed: campaigns.reduce((sum, c) => sum + c.sessions.length, 0),
      villainsDefeated: 0, // TODO: Implementar tracking
      missionsCompleted: 0 // TODO: Implementar tracking
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  // ===== UTILIDADES =====

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private clearCache(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  private getMostFrequent(items: string[]): string {
    if (items.length === 0) return '';
    
    const frequency: { [key: string]: number } = {};
    items.forEach(item => {
      frequency[item] = (frequency[item] || 0) + 1;
    });
    
    return Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b
    );
  }

  // ===== SINCRONIZACIÓN =====

  async syncData(userId: string): Promise<void> {
    // Limpiar todo el caché del usuario
    this.clearCache(`characters_${userId}`);
    this.clearCache(`campaigns_${userId}`);
    this.clearCache(`achievements_${userId}`);
    this.clearCache(`stats_${userId}`);
    
    // Fetch data first so getUserStats reads from warm cache
    await Promise.all([
      this.getCharacters(userId),
      this.getCampaigns(userId),
      this.getAchievements(userId),
    ]);
    await this.getUserStats(userId);
  }
}

export const mutantsMastermindsService = new MutantsMastermindsService(); 