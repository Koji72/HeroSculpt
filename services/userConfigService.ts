import { supabase, UserConfiguration } from '../lib/supabase';
import { SelectedParts } from '../types';

interface ConfigData {
  name: string;
  archetype: string;
  selected_parts: SelectedParts;
  total_price: number;
}

export class UserConfigService {
  // Save a new configuration
  static async saveConfiguration(
    configData: ConfigData
  ): Promise<UserConfiguration | null> {
    // 1. Verificar que el usuario está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Error de autenticación para guardar configuración:', authError?.message || 'Usuario no autenticado.');
      throw new Error('Usuario no autenticado para guardar configuración.');
    }

    // 2. Insertar con el user_id correcto
    const { data, error } = await supabase
      .from('user_configurations')
      .insert({
        user_id: user.id,  // ⭐ CRÍTICO: Debe ser user.id
        name: configData.name,
        archetype: configData.archetype,
        selected_parts: configData.selected_parts,
        total_price: configData.total_price,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving configuration:', error);
      throw error; // Propagar el error para manejo superior
    }

    return data;
  }

  // Get all configurations for a user
  static async getUserConfigurations(userId: string): Promise<UserConfiguration[]> {
    try {
      const { data, error } = await supabase
        .from('user_configurations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching configurations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching configurations:', error);
      return [];
    }
  }

  // Get user's last pose (most recent configuration)
  static async getUserLastPose(userId: string): Promise<UserConfiguration | null> {
    try {
      const { data, error } = await supabase
        .from('user_configurations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.log('No last pose found for user:', userId);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching last pose:', error);
      return null;
    }
  }

  // Get a specific configuration
  static async getConfiguration(configId: string): Promise<UserConfiguration | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_configurations')
        .select('*')
        .eq('id', configId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching configuration:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching configuration:', error);
      return null;
    }
  }

  // Update an existing configuration
  static async updateConfiguration(
    configId: string,
    updates: Partial<Omit<UserConfiguration, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<UserConfiguration | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_configurations')
        .update(updates)
        .eq('id', configId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating configuration:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating configuration:', error);
      return null;
    }
  }

  // Delete a configuration
  static async deleteConfiguration(configId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_configurations')
        .delete()
        .eq('id', configId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting configuration:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting configuration:', error);
      return false;
    }
  }

  // Update only the name of a configuration
  static async updateConfigurationName(configId: string, newName: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_configurations')
        .update({ name: newName })
        .eq('id', configId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating configuration name:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating configuration name:', error);
      return false;
    }
  }
} 