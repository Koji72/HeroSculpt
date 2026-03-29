
// Script de integración para el customizador
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

// Función para cargar materiales PBR desde Supabase
export async function loadPBRMaterials() {
  const { data, error } = await supabase
    .from('pbr_materials')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error cargando materiales PBR:', error);
    return [];
  }
  
  return data;
}

// Función para obtener material por nombre y variante
export async function getPBRMaterial(name, variant) {
  const { data, error } = await supabase
    .from('pbr_materials')
    .select('*')
    .eq('name', name)
    .eq('variant', variant)
    .single();
    
  if (error) {
    console.error('Error obteniendo material PBR:', error);
    return null;
  }
  
  return data;
}
