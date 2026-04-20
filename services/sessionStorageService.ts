import { SelectedParts, ArchetypeId } from '../types';
import { SupabaseSessionService } from './supabaseSessionService';

const SESSION_STORAGE_KEY = 'superhero_customizer_session';
const SESSION_TIMESTAMP_KEY = 'superhero_customizer_session_timestamp';

export interface UserSession {
  selectedArchetype: ArchetypeId;
  selectedParts: SelectedParts;
  pose?: string | null;
  lastPoseIndex?: number;
  savedPoses?: Array<{
    id: string;
    name: string;
    configuration: SelectedParts;
    source: 'purchase' | 'saved';
    date: string;
  }>;
  timestamp: number;
}

export class SessionStorageService {
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  /**
   * Save current user session (localStorage + Supabase if authenticated)
   */
  static async saveSession(
    selectedArchetype: ArchetypeId, 
    selectedParts: SelectedParts, 
    pose?: string | null,
    lastPoseIndex?: number,
    savedPoses?: Array<{
      id: string;
      name: string;
      configuration: SelectedParts;
      source: 'purchase' | 'saved';
      date: string;
    }>
  ): Promise<void> {
    try {
      // Always save to localStorage as fallback
      const session: UserSession = {
        selectedArchetype,
        selectedParts,
        pose: pose || null,
        lastPoseIndex: lastPoseIndex ?? 0,
        savedPoses: savedPoses || [],
        timestamp: Date.now()
      };

      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      localStorage.setItem(SESSION_TIMESTAMP_KEY, session.timestamp.toString());
      
      // console.log('SessionStorageService: Session saved to localStorage');

      // If user is authenticated, also save to Supabase
      try {
        await SupabaseSessionService.saveSession();
        // console.log('SessionStorageService: Session also saved to Supabase');
      } catch (supabaseError) {
        if (import.meta.env.DEV) console.warn('SessionStorageService: Failed to save to Supabase, using localStorage only:', supabaseError);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('SessionStorageService: Error saving session:', error);
    }
  }

  /**
   * Load saved user session (prioritizes Supabase if authenticated)
   */
  static async loadSession(): Promise<UserSession | null> {
    try {
      // First try to load from Supabase if user is authenticated
      try {
        const supabaseSession = await SupabaseSessionService.getCurrentSession();
        if (supabaseSession) {
          // console.log('SessionStorageService: Session loaded from Supabase');
          const s = supabaseSession as Record<string, unknown>;
          if (!s.selected_archetype || !s.selected_parts) return null;
          return {
            selectedArchetype: s.selected_archetype as ArchetypeId,
            selectedParts: s.selected_parts as SelectedParts,
            pose: (s.pose as string | null) || null,
            lastPoseIndex: (s.last_pose_index as number) ?? 0,
            savedPoses: (s.saved_poses as UserSession['savedPoses']) || [],
            timestamp: new Date(s.updated_at as string).getTime()
          };
        }
      } catch (supabaseError) {
        if (import.meta.env.DEV) console.warn('SessionStorageService: Failed to load from Supabase, trying localStorage:', supabaseError);
      }

      // Fallback to localStorage
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      const timestampData = localStorage.getItem(SESSION_TIMESTAMP_KEY);

      if (!sessionData || !timestampData) {
        if (import.meta.env.DEV) console.log('SessionStorageService: No saved session found');
        return null;
      }

      const session: UserSession = JSON.parse(sessionData);
      const timestamp = parseInt(timestampData, 10);

      // Check if session hasn't expired
      const isExpired = Date.now() - timestamp > this.SESSION_DURATION;
      
      if (isExpired) {
        if (import.meta.env.DEV) console.log('SessionStorageService: Session expired, clearing old data');
        await this.clearSession();
        return null;
      }

      // console.log('SessionStorageService: Session loaded from localStorage');
      return session;
    } catch (error) {
      if (import.meta.env.DEV) console.error('SessionStorageService: Error loading session:', error);
      await this.clearSession();
      return null;
    }
  }

  /**
   * Clear saved session (localStorage + Supabase)
   */
  static async clearSession(): Promise<void> {
    if (import.meta.env.DEV) console.log('SessionStorageService: Session cleared from localStorage');
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_TIMESTAMP_KEY);

    // Clear from Supabase if authenticated
    try {
      await SupabaseSessionService.clearCurrentSession();
      if (import.meta.env.DEV) console.log('SessionStorageService: Session also cleared from Supabase');
    } catch (supabaseError) {
      if (import.meta.env.DEV) console.warn('SessionStorageService: Failed to clear from Supabase:', supabaseError);
    }
  }

  /**
   * Check if a valid session exists
   */
  static async hasValidSession(): Promise<boolean> {
    const session = await this.loadSession();
    return session !== null;
  }

  /**
   * Get information about the saved session
   */
  static async getSessionInfo(): Promise<{ hasSession: boolean; lastSaved?: string; source?: 'supabase' | 'localStorage' }> {
    try {
      // Try to load from Supabase first
      const supabaseSession = await SupabaseSessionService.getCurrentSession();
      if (supabaseSession) {
        return {
          hasSession: true,
          lastSaved: new Date((supabaseSession as Record<string, unknown>).updated_at as string).toLocaleString(),
          source: 'supabase'
        };
      }

      // Fallback to localStorage
      const session = await this.loadSession();
      return {
        hasSession: session !== null,
        lastSaved: session ? new Date(session.timestamp).toLocaleString() : undefined,
        source: 'localStorage'
      };
    } catch (error) {
      if (import.meta.env.DEV) console.error('SessionStorageService: Error getting session info:', error);
      return { hasSession: false };
    }
  }

  /**
   * Automatically save the last pose of the user
   */
  static async saveLastPose(
    selectedArchetype: ArchetypeId,
    selectedParts: SelectedParts,
    currentPoseIndex: number,
    savedPoses: Array<{
      id: string;
      name: string;
      configuration: SelectedParts;
      source: 'purchase' | 'saved';
      date: string;
    }>
  ): Promise<void> {
    try {
      // console.log(`💾 Guardando última pose: ${currentPoseIndex + 1}/${savedPoseIndex + 1}`);
      
      await this.saveSession(
        selectedArchetype,
        selectedParts,
        savedPoses[currentPoseIndex]?.name || null,
        currentPoseIndex,
        savedPoses
      );
      
      // console.log('✅ Última pose guardada exitosamente');
    } catch (error) {
      if (import.meta.env.DEV) console.error('❌ Error guardando última pose:', error);
    }
  }

  /**
   * Load the last saved pose of the user
   */
  static async loadLastPose(): Promise<{
    selectedArchetype: ArchetypeId;
    selectedParts: SelectedParts;
    lastPoseIndex: number;
    savedPoses: Array<{
      id: string;
      name: string;
      configuration: SelectedParts;
      source: 'purchase' | 'saved';
      date: string;
    }>;
  } | null> {
    try {
      const session = await this.loadSession();
      
      if (!session) {
        if (import.meta.env.DEV) console.log('📭 No hay última pose guardada');
        return null;
      }

      const lastPoseIndex = session.lastPoseIndex !== undefined ? session.lastPoseIndex : 0;
      const savedPoses = session.savedPoses !== undefined ? session.savedPoses : [];

      if (import.meta.env.DEV) console.log(`📂 Cargando última pose: ${lastPoseIndex + 1}/${savedPoses.length}`);
      
      return {
        selectedArchetype: session.selectedArchetype,
        selectedParts: session.selectedParts,
        lastPoseIndex,
        savedPoses
      };
    } catch (error) {
      if (import.meta.env.DEV) console.error('❌ Error cargando última pose:', error);
      return null;
    }
  }

  /**
   * Returns an array of example poses for local testing
   */
  static async getTestPoses() {
    return [
      {
        id: 'test-pose-1',
        name: 'Pose de Prueba 1',
        selectedArchetype: ArchetypeId.STRONG,
        selectedParts: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'saved',
      },
      {
        id: 'test-pose-2',
        name: 'Pose de Prueba 2',
        selectedArchetype: ArchetypeId.JUSTICIERO,
        selectedParts: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'saved',
      },
    ];
  }
} 