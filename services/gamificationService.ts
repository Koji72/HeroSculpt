import { supabase } from '../lib/supabase';
import { notificationService } from './notificationService';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'creation' | 'exploration' | 'social' | 'mastery' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: AchievementRequirement[];
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface AchievementRequirement {
  type: 'characters_created' | 'power_level' | 'archetype_mastery' | 'missions_completed' | 'gallery_shares' | 'consecutive_days';
  value: number;
  condition: 'equals' | 'greater_than' | 'less_than' | 'contains';
  target?: any;
}

export interface UserStats {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalPoints: number;
  achievementsUnlocked: number;
  charactersCreated: number;
  missionsCompleted: number;
  galleryShares: number;
  consecutiveDays: number;
  lastLoginDate: Date;
  rank: 'Novice' | 'Apprentice' | 'Hero' | 'Champion' | 'Legend' | 'Mythic';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  level: number;
  totalPoints: number;
  achievementsUnlocked: number;
  rank: number;
  avatar?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  type: 'seasonal' | 'challenge' | 'community' | 'special';
  rewards: EventReward[];
  isActive: boolean;
  participants: number;
}

export interface EventReward {
  type: 'achievement' | 'points' | 'parts' | 'title' | 'badge';
  value: string | number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export class GamificationService {
  private static instance: GamificationService;
  private achievements: Achievement[] = [];
  private events: Event[] = [];

  static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService();
    }
    return GamificationService.instance;
  }

  constructor() {
    this.initializeAchievements();
    this.initializeEvents();
  }

  // 🏆 INICIALIZAR LOGROS
  private initializeAchievements(): void {
    this.achievements = [
      {
        id: 'first_creation',
        name: 'Creador Novato',
        description: 'Crea tu primer héroe personalizado',
        icon: '🎨',
        category: 'creation',
        rarity: 'common',
        points: 10,
        requirements: [{ type: 'characters_created', value: 1, condition: 'greater_than' }],
        isUnlocked: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: 'power_master',
        name: 'Maestro del Poder',
        description: 'Crea un héroe con nivel de poder 100',
        icon: '⚡',
        category: 'mastery',
        rarity: 'epic',
        points: 100,
        requirements: [{ type: 'power_level', value: 100, condition: 'equals' }],
        isUnlocked: false,
        progress: 0,
        maxProgress: 100
      },
      {
        id: 'archetype_collector',
        name: 'Coleccionista de Arquetipos',
        description: 'Crea héroes de todos los arquetipos disponibles',
        icon: '🎭',
        category: 'exploration',
        rarity: 'rare',
        points: 50,
        requirements: [{ type: 'archetype_mastery', value: 5, condition: 'equals' }],
        isUnlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'mission_complete',
        name: 'Completador de Misiones',
        description: 'Completa 10 misiones',
        icon: '🎯',
        category: 'mastery',
        rarity: 'rare',
        points: 75,
        requirements: [{ type: 'missions_completed', value: 10, condition: 'greater_than' }],
        isUnlocked: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: 'gallery_star',
        name: 'Estrella de la Galería',
        description: 'Comparte 5 héroes en la galería',
        icon: '⭐',
        category: 'social',
        rarity: 'common',
        points: 25,
        requirements: [{ type: 'gallery_shares', value: 5, condition: 'greater_than' }],
        isUnlocked: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: 'daily_hero',
        name: 'Héroe Diario',
        description: 'Conecta durante 7 días consecutivos',
        icon: '📅',
        category: 'special',
        rarity: 'epic',
        points: 150,
        requirements: [{ type: 'consecutive_days', value: 7, condition: 'equals' }],
        isUnlocked: false,
        progress: 0,
        maxProgress: 7
      },
      {
        id: 'legendary_creator',
        name: 'Creador Legendario',
        description: 'Crea 50 héroes únicos',
        icon: '👑',
        category: 'creation',
        rarity: 'legendary',
        points: 500,
        requirements: [{ type: 'characters_created', value: 50, condition: 'greater_than' }],
        isUnlocked: false,
        progress: 0,
        maxProgress: 50
      }
    ];
  }

  // 🎪 INICIALIZAR EVENTOS
  private initializeEvents(): void {
    this.events = [
      {
        id: 'summer_heroes',
        name: 'Héroes de Verano',
        description: 'Crea héroes con temática de verano y gana recompensas especiales',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-31'),
        type: 'seasonal',
        rewards: [
          { type: 'achievement', value: 'Summer Hero', rarity: 'rare' },
          { type: 'points', value: 200, rarity: 'common' },
          { type: 'badge', value: 'Summer Champion', rarity: 'epic' }
        ],
        isActive: false,
        participants: 0
      },
      {
        id: 'speed_creation',
        name: 'Creación Rápida',
        description: 'Crea el mayor número de héroes en 24 horas',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-16'),
        type: 'challenge',
        rewards: [
          { type: 'title', value: 'Speed Creator', rarity: 'epic' },
          { type: 'points', value: 300, rarity: 'rare' }
        ],
        isActive: false,
        participants: 0
      }
    ];
  }

  // 👤 OBTENER ESTADÍSTICAS DEL USUARIO
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Crear estadísticas iniciales
        const initialStats: Omit<UserStats, 'userId'> = {
          level: 1,
          experience: 0,
          experienceToNextLevel: 100,
          totalPoints: 0,
          achievementsUnlocked: 0,
          charactersCreated: 0,
          missionsCompleted: 0,
          galleryShares: 0,
          consecutiveDays: 0,
          lastLoginDate: new Date(),
          rank: 'Novice'
        };

        const { data: newStats, error: createError } = await supabase
          .from('user_stats')
          .insert([{ ...initialStats, user_id: userId }])
          .select()
          .single();

        if (createError) throw createError;
        return newStats;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // 📊 ACTUALIZAR ESTADÍSTICAS
  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // 🎯 VERIFICAR LOGROS
  async checkAchievements(userId: string): Promise<Achievement[]> {
    try {
      const userStats = await this.getUserStats(userId);
      const unlockedAchievements: Achievement[] = [];

      for (const achievement of this.achievements) {
        if (achievement.isUnlocked) continue;

        const isUnlocked = this.evaluateAchievement(achievement, userStats);
        
        if (isUnlocked) {
          achievement.isUnlocked = true;
          achievement.unlockedAt = new Date();
          
          // Guardar logro desbloqueado
          await this.unlockAchievement(userId, achievement);
          
          // Enviar notificación
          await notificationService.sendAchievementNotification(userId, achievement.name);
          
          // Otorgar puntos
          await this.awardPoints(userId, achievement.points);
          
          unlockedAchievements.push(achievement);
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      throw error;
    }
  }

  // ✅ EVALUAR LOGRO
  private evaluateAchievement(achievement: Achievement, userStats: UserStats): boolean {
    for (const requirement of achievement.requirements) {
      let currentValue: number;

      switch (requirement.type) {
        case 'characters_created':
          currentValue = userStats.charactersCreated;
          break;
        case 'power_level':
          currentValue = userStats.level;
          break;
        case 'missions_completed':
          currentValue = userStats.missionsCompleted;
          break;
        case 'gallery_shares':
          currentValue = userStats.galleryShares;
          break;
        case 'consecutive_days':
          currentValue = userStats.consecutiveDays;
          break;
        default:
          currentValue = 0;
      }

      switch (requirement.condition) {
        case 'equals':
          if (currentValue !== requirement.value) return false;
          break;
        case 'greater_than':
          if (currentValue <= requirement.value) return false;
          break;
        case 'less_than':
          if (currentValue >= requirement.value) return false;
          break;
      }
    }

    return true;
  }

  // 🔓 DESBLOQUEAR LOGRO
  private async unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert([{
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString()
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }
  }

  // 🎁 OTORGAR PUNTOS
  private async awardPoints(userId: string, points: number): Promise<void> {
    try {
      const userStats = await this.getUserStats(userId);
      const newTotalPoints = userStats.totalPoints + points;
      const newExperience = userStats.experience + points;
      
      // Calcular nuevo nivel
      const newLevel = this.calculateLevel(newExperience);
      const experienceToNextLevel = this.calculateExperienceToNextLevel(newLevel);
      const newRank = this.calculateRank(newTotalPoints);

      await this.updateUserStats(userId, {
        totalPoints: newTotalPoints,
        experience: newExperience,
        level: newLevel,
        experienceToNextLevel,
        rank: newRank,
        achievementsUnlocked: userStats.achievementsUnlocked + 1
      });
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // 📈 CALCULAR NIVEL
  private calculateLevel(experience: number): number {
    return Math.floor(experience / 100) + 1;
  }

  // 🎯 CALCULAR EXPERIENCIA PARA SIGUIENTE NIVEL
  private calculateExperienceToNextLevel(level: number): number {
    return level * 100;
  }

  // 👑 CALCULAR RANGO
  private calculateRank(totalPoints: number): UserStats['rank'] {
    if (totalPoints >= 10000) return 'Mythic';
    if (totalPoints >= 5000) return 'Legend';
    if (totalPoints >= 2000) return 'Champion';
    if (totalPoints >= 500) return 'Hero';
    if (totalPoints >= 100) return 'Apprentice';
    return 'Novice';
  }

  // 🏆 OBTENER TABLA DE CLASIFICACIÓN
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select(`
          user_id,
          level,
          total_points,
          achievements_unlocked,
          users!inner(username, avatar_url)
        `)
        .order('total_points', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map((entry, index) => ({
        userId: entry.user_id,
        username: entry.users.username,
        level: entry.level,
        totalPoints: entry.total_points,
        achievementsUnlocked: entry.achievements_unlocked,
        rank: index + 1,
        avatar: entry.users.avatar_url
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  // 🎪 OBTENER EVENTOS ACTIVOS
  async getActiveEvents(): Promise<Event[]> {
    const now = new Date();
    return this.events.filter(event => 
      event.startDate <= now && event.endDate >= now
    );
  }

  // 📅 ACTUALIZAR DÍAS CONSECUTIVOS
  async updateConsecutiveDays(userId: string): Promise<void> {
    try {
      const userStats = await this.getUserStats(userId);
      const today = new Date();
      const lastLogin = new Date(userStats.lastLoginDate);
      
      // Verificar si es el mismo día
      if (today.toDateString() === lastLogin.toDateString()) {
        return;
      }

      // Verificar si es el día siguiente
      const diffTime = today.getTime() - lastLogin.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let newConsecutiveDays = userStats.consecutiveDays;

      if (diffDays === 1) {
        // Día consecutivo
        newConsecutiveDays++;
      } else if (diffDays > 1) {
        // Rompió la racha
        newConsecutiveDays = 1;
      }

      await this.updateUserStats(userId, {
        consecutiveDays: newConsecutiveDays,
        lastLoginDate: today
      });
    } catch (error) {
      console.error('Error updating consecutive days:', error);
      throw error;
    }
  }

  // 📊 OBTENER ESTADÍSTICAS GLOBALES
  async getGlobalStats(): Promise<{
    totalUsers: number;
    totalCharacters: number;
    totalAchievements: number;
    averageLevel: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('level, total_points');

      if (error) throw error;

      const totalUsers = data?.length || 0;
      const averageLevel = totalUsers > 0 
        ? Math.round(data!.reduce((sum, user) => sum + user.level, 0) / totalUsers)
        : 0;

      return {
        totalUsers,
        totalCharacters: 0, // TODO: Implementar
        totalAchievements: 0, // TODO: Implementar
        averageLevel
      };
    } catch (error) {
      console.error('Error fetching global stats:', error);
      throw error;
    }
  }

  // 🎯 OBTENER LOGROS DEL USUARIO
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', userId);

      if (error) throw error;

      const unlockedAchievementIds = new Set(data?.map(ua => ua.achievement_id) || []);

      return this.achievements.map(achievement => ({
        ...achievement,
        isUnlocked: unlockedAchievementIds.has(achievement.id),
        unlockedAt: data?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at
          ? new Date(data.find(ua => ua.achievement_id === achievement.id)!.unlocked_at)
          : undefined
      }));
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      throw error;
    }
  }
}

export const gamificationService = GamificationService.getInstance(); 