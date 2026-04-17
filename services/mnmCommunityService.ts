import { supabase } from '../lib/supabase';
import { MAndMCharacter, MAndMCampaign } from './mutantsMastermindsService';

// Tipos para la comunidad M&M
export interface MAndMCommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'character' | 'campaign' | 'achievement' | 'event' | 'story' | 'art';
  title: string;
  content: string;
  media?: {
    type: 'image' | 'video' | '3d-model';
    url: string;
    thumbnail?: string;
  }[];
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MAndMLeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  rank: number;
  score: number;
  metrics: {
    totalExperience: number;
    charactersCreated: number;
    campaignsCompleted: number;
    achievementsUnlocked: number;
    communityPosts: number;
    likesReceived: number;
    playTime: number;
  };
  topCharacter?: {
    name: string;
    archetype: string;
    powerLevel: number;
    portrait?: string;
  };
}

export interface MAndMEvent {
  id: string;
  title: string;
  description: string;
  type: 'challenge' | 'tournament' | 'story' | 'community';
  status: 'upcoming' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  participants: string[];
  maxParticipants?: number;
  rewards: {
    experience: number;
    points: number;
    badges: string[];
    items: string[];
  };
  requirements: {
    minPowerLevel?: number;
    requiredArchetypes?: string[];
    requiredFactions?: string[];
  };
  leaderboard?: MAndMLeaderboardEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MAndMChallenge {
  id: string;
  title: string;
  description: string;
  category: 'combat' | 'roleplay' | 'creative' | 'social' | 'exploration';
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  duration: 'daily' | 'weekly' | 'monthly' | 'event';
  requirements: {
    type: string;
    value: number;
    description: string;
  }[];
  rewards: {
    experience: number;
    points: number;
    badges: string[];
  };
  participants: Array<{
    userId: string;
    userName: string;
    progress: number;
    completed: boolean;
    completedAt?: Date;
  }>;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface MAndMGalleryItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  description: string;
  type: 'character' | 'scene' | 'artwork' | 'miniature';
  media: {
    type: 'image' | 'video' | '3d-model';
    url: string;
    thumbnail?: string;
  }[];
  characterData?: Partial<MAndMCharacter>;
  tags: string[];
  likes: number;
  comments: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MAndMCommunityStats {
  totalUsers: number;
  activeUsers: number;
  totalCharacters: number;
  totalCampaigns: number;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  topArchetypes: Array<{ name: string; count: number }>;
  topFactions: Array<{ name: string; count: number }>;
  recentActivity: Array<{
    type: string;
    count: number;
    period: string;
  }>;
}

class MAndMCommunityService {
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos

  // ===== FEED Y PUBLICACIONES =====

  async getCommunityFeed(userId: string, page = 1, limit = 20): Promise<MAndMCommunityPost[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const verifiedUserId = user?.id ?? '';
    const cacheKey = `feed_${verifiedUserId}_${page}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const offset = (page - 1) * limit;

    const { data, error } = await supabase
      .from('mnm_community_posts')
      .select('*')
      .or(`isPublic.eq.true${verifiedUserId ? ',userId.eq.' + verifiedUserId : ''}`)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Error fetching community feed: ${error.message}`);
    
    const posts = data?.map(post => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    })) || [];

    this.setCache(cacheKey, posts);
    return posts;
  }

  async createPost(post: Partial<MAndMCommunityPost>): Promise<MAndMCommunityPost> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const now = new Date();
    const postData = {
      ...post,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      comments: 0,
      shares: 0
    };

    const { data, error } = await supabase
      .from('mnm_community_posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw new Error(`Error creating post: ${error.message}`);

    // Limpiar caché del feed
    if (post.userId) {
      this.clearCache(`feed_${post.userId}`);
    }

    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  async likePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('mnm_post_likes')
      .upsert({
        postId,
        userId,
        createdAt: new Date().toISOString()
      });

    if (error) throw new Error(`Error liking post: ${error.message}`);

    const { error: rpcError } = await supabase.rpc('increment_post_likes', { post_id: postId });
    if (rpcError) throw new Error(`Error incrementing post likes: ${rpcError.message}`);
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('mnm_post_likes')
      .delete()
      .eq('postId', postId)
      .eq('userId', userId);

    if (error) throw new Error(`Error unliking post: ${error.message}`);

    const { error: rpcError } = await supabase.rpc('decrement_post_likes', { post_id: postId });
    if (rpcError) throw new Error(`Error decrementing post likes: ${rpcError.message}`);
  }

  // ===== RANKINGS Y LEADERBOARDS =====

  async getLeaderboard(type: 'experience' | 'characters' | 'achievements' | 'community', limit = 50): Promise<MAndMLeaderboardEntry[]> {
    const cacheKey = `leaderboard_${type}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    let query;
    switch (type) {
      case 'experience':
        query = supabase
          .from('mnm_user_stats')
          .select('userId, totalExperience, totalCharacters, campaignsCompleted, achievementsUnlocked, communityPosts, likesReceived, playTime')
          .order('totalExperience', { ascending: false });
        break;
      case 'characters':
        query = supabase
          .from('mnm_user_stats')
          .select('userId, totalExperience, totalCharacters, campaignsCompleted, achievementsUnlocked, communityPosts, likesReceived, playTime')
          .order('totalCharacters', { ascending: false });
        break;
      case 'achievements':
        query = supabase
          .from('mnm_user_stats')
          .select('userId, totalExperience, totalCharacters, campaignsCompleted, achievementsUnlocked, communityPosts, likesReceived, playTime')
          .order('achievementsUnlocked', { ascending: false });
        break;
      case 'community':
        query = supabase
          .from('mnm_user_stats')
          .select('userId, totalExperience, totalCharacters, campaignsCompleted, achievementsUnlocked, communityPosts, likesReceived, playTime')
          .order('communityPosts', { ascending: false });
        break;
      default:
        throw new Error(`Unknown leaderboard type: ${type}`);
    }

    const { data, error } = await query.limit(limit);

    if (error) throw new Error(`Error fetching leaderboard: ${error.message}`);

    // Enriquecer con datos de usuario y personaje top
    const enrichedData = await Promise.all(
      data?.map(async (entry, index) => {
        const [userData, topCharacter] = await Promise.all([
          this.getUserProfile(entry.userId),
          this.getTopCharacter(entry.userId)
        ]);

        return {
          userId: entry.userId,
          userName: userData?.name || 'Unknown',
          userAvatar: userData?.avatar,
          rank: index + 1,
          score: entry[type === 'experience' ? 'totalExperience' : type === 'characters' ? 'totalCharacters' : type === 'achievements' ? 'achievementsUnlocked' : 'communityPosts'],
          metrics: {
            totalExperience: entry.totalExperience,
            charactersCreated: entry.totalCharacters,
            campaignsCompleted: entry.campaignsCompleted,
            achievementsUnlocked: entry.achievementsUnlocked,
            communityPosts: entry.communityPosts,
            likesReceived: entry.likesReceived,
            playTime: entry.playTime
          },
          topCharacter
        };
      }) || []
    );

    this.setCache(cacheKey, enrichedData);
    return enrichedData;
  }

  // ===== EVENTOS Y DESAFÍOS =====

  async getActiveEvents(): Promise<MAndMEvent[]> {
    const cacheKey = 'active_events';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('mnm_events')
      .select('*')
      .or(`status.eq.active,status.eq.upcoming`)
      .gte('endDate', now)
      .order('startDate', { ascending: true });

    if (error) throw new Error(`Error fetching events: ${error.message}`);
    
    const events = data?.map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt)
    })) || [];

    this.setCache(cacheKey, events);
    return events;
  }

  async getActiveChallenges(): Promise<MAndMChallenge[]> {
    const cacheKey = 'active_challenges';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('mnm_challenges')
      .select('*')
      .eq('isActive', true)
      .gte('endDate', now)
      .order('startDate', { ascending: true });

    if (error) throw new Error(`Error fetching challenges: ${error.message}`);
    
    const challenges = data?.map(challenge => ({
      ...challenge,
      startDate: new Date(challenge.startDate),
      endDate: new Date(challenge.endDate),
      participants: challenge.participants?.map(p => ({
        ...p,
        completedAt: p.completedAt ? new Date(p.completedAt) : undefined
      })) || []
    })) || [];

    this.setCache(cacheKey, challenges);
    return challenges;
  }

  async joinEvent(eventId: string, userId: string): Promise<void> {
    const { data: event, error: fetchError } = await supabase
      .from('mnm_events')
      .select('participants')
      .eq('id', eventId)
      .single();
    if (fetchError) throw new Error(`Error fetching event: ${fetchError.message}`);

    const participants: string[] = Array.isArray(event?.participants) ? event.participants : [];
    if (!participants.includes(userId)) participants.push(userId);

    const { error } = await supabase
      .from('mnm_events')
      .update({ participants })
      .eq('id', eventId);

    if (error) throw new Error(`Error joining event: ${error.message}`);

    this.clearCache('active_events');
  }

  async joinChallenge(challengeId: string, userId: string, userName: string): Promise<void> {
    const { data: challenge, error: fetchError } = await supabase
      .from('mnm_challenges')
      .select('participants')
      .eq('id', challengeId)
      .single();
    if (fetchError) throw new Error(`Error fetching challenge: ${fetchError.message}`);

    const participants: any[] = Array.isArray(challenge?.participants) ? challenge.participants : [];
    const alreadyJoined = participants.some((p: any) => p.userId === userId);
    if (!alreadyJoined) {
      participants.push({ userId, userName, progress: 0, completed: false });
    }

    const { error } = await supabase
      .from('mnm_challenges')
      .update({ participants })
      .eq('id', challengeId);

    if (error) throw new Error(`Error joining challenge: ${error.message}`);

    this.clearCache('active_challenges');
  }

  // ===== GALERÍA =====

  async getGalleryItems(type?: string, page = 1, limit = 20): Promise<MAndMGalleryItem[]> {
    const cacheKey = `gallery_${type || 'all'}_${page}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('mnm_gallery')
      .select('*')
      .eq('isPublic', true)
      .order('createdAt', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) throw new Error(`Error fetching gallery: ${error.message}`);
    
    const items = data?.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    })) || [];

    this.setCache(cacheKey, items);
    return items;
  }

  async submitToGallery(item: Partial<MAndMGalleryItem>): Promise<MAndMGalleryItem> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const now = new Date();
    const itemData = {
      ...item,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      comments: 0,
      isFeatured: false
    };

    const { data, error } = await supabase
      .from('mnm_gallery')
      .insert(itemData)
      .select()
      .single();

    if (error) throw new Error(`Error submitting to gallery: ${error.message}`);

    // Limpiar caché de la galería
    this.clearCache('gallery');

    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    };
  }

  // ===== ESTADÍSTICAS DE COMUNIDAD =====

  async getCommunityStats(): Promise<MAndMCommunityStats> {
    const cacheKey = 'community_stats';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Obtener estadísticas básicas
    const [
      { count: totalUsers },
      { count: totalCharacters },
      { count: totalCampaigns },
      { count: totalPosts },
      { count: totalLikes }
    ] = await Promise.all([
      supabase.from('mnm_users').select('*', { count: 'exact', head: true }),
      supabase.from('mnm_characters').select('*', { count: 'exact', head: true }),
      supabase.from('mnm_campaigns').select('*', { count: 'exact', head: true }),
      supabase.from('mnm_community_posts').select('*', { count: 'exact', head: true }),
      supabase.from('mnm_post_likes').select('*', { count: 'exact', head: true })
    ]);

    // Obtener arquetipos y facciones más populares
    const { data: archetypeStats } = await supabase
      .from('mnm_characters')
      .select('archetype')
      .not('archetype', 'is', null);

    const { data: factionStats } = await supabase
      .from('mnm_characters')
      .select('faction')
      .not('faction', 'is', null);

    // Procesar estadísticas
    const archetypeCounts: { [key: string]: number } = {};
    archetypeStats?.forEach(char => {
      archetypeCounts[char.archetype] = (archetypeCounts[char.archetype] || 0) + 1;
    });

    const factionCounts: { [key: string]: number } = {};
    factionStats?.forEach(char => {
      if (char.faction) {
        factionCounts[char.faction] = (factionCounts[char.faction] || 0) + 1;
      }
    });

    const stats: MAndMCommunityStats = {
      totalUsers: totalUsers || 0,
      activeUsers: Math.floor((totalUsers || 0) * 0.3), // Estimación
      totalCharacters: totalCharacters || 0,
      totalCampaigns: totalCampaigns || 0,
      totalPosts: totalPosts || 0,
      totalLikes: totalLikes || 0,
      totalComments: Math.floor((totalPosts || 0) * 0.5), // Estimación
      topArchetypes: Object.entries(archetypeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      topFactions: Object.entries(factionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      recentActivity: [
        { type: 'characters_created', count: Math.floor((totalCharacters || 0) * 0.1), period: 'last_week' },
        { type: 'posts_shared', count: Math.floor((totalPosts || 0) * 0.2), period: 'last_week' },
        { type: 'campaigns_started', count: Math.floor((totalCampaigns || 0) * 0.15), period: 'last_week' }
      ]
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  // ===== UTILIDADES PRIVADAS =====

  private async getUserProfile(userId: string): Promise<{ name: string; avatar?: string } | null> {
    const { data, error } = await supabase
      .from('mnm_users')
      .select('name, avatar')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data;
  }

  private async getTopCharacter(userId: string): Promise<{ name: string; archetype: string; powerLevel: number; portrait?: string } | undefined> {
    const { data, error } = await supabase
      .from('mnm_characters')
      .select('name, archetype, powerLevel, portrait')
      .eq('userId', userId)
      .order('powerLevel', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return undefined;
    return data;
  }

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
}

export const mnmCommunityService = new MAndMCommunityService(); 