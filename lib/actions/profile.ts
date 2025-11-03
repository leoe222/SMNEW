'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface Leader {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Cliente reutilizable para todas las funciones
async function getSupabaseClient() {
  return await createClient();
}

// Obtener líderes según el rol del usuario
export async function getLeadersByRole(userRole: string): Promise<Leader[]> {
  try {
    const supabase = await getSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      redirect('/login');
    }

    let targetRole: string;
    
    // Determinar qué rol buscar según el rol del usuario
    switch (userRole) {
      case 'designer':
        targetRole = 'leader';
        break;
      case 'leader':
        targetRole = 'head_chapter';
        break;
      case 'head_chapter':
        targetRole = 'admin';
        break;
      default:
        return [];
    }

    const { data: leaders, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('role', targetRole)
      .order('first_name');

    if (error) {
      console.error('Error al obtener líderes:', error);
      return [];
    }

    return (leaders || []).map(leader => ({
      id: leader.id,
      firstName: leader.first_name || '',
      lastName: leader.last_name || '',
      email: leader.email || ''
    }));
  } catch (error) {
    console.error('Error en getLeadersByRole:', error);
    return [];
  }
}

// Obtener líderes disponibles (función original mantenida para compatibilidad)
export async function getLeaders(): Promise<Leader[]> {
  try {
    const supabase = await getSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      redirect('/login');
    }

    const { data: leaders, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('role', 'leader')
      .order('first_name');

    if (error) {
      console.error('Error al obtener líderes:', error);
      return [];
    }

    return (leaders || []).map(leader => ({
      id: leader.id,
      firstName: leader.first_name || '',
      lastName: leader.last_name || '',
      email: leader.email || ''
    }));
  } catch (error) {
    console.error('Error en getLeaders:', error);
    return [];
  }
}

// Actualizar perfil del usuario
export async function updateProfile(data: {
  firstName: string;
  lastName: string;
  leaderId?: string;
  squad?: string;
  avatarUrl?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = await getSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const updatePayload: any = {
      first_name: data.firstName,
      last_name: data.lastName,
      leader_id: data.leaderId === 'none' ? null : data.leaderId
    }
    if (typeof data.squad === 'string') {
      updatePayload.squad = data.squad
    }
    if (data.avatarUrl !== undefined) {
      updatePayload.avatar_url = data.avatarUrl ? data.avatarUrl : null
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (error) {
      console.error('Error al actualizar perfil:', error);
      return { success: false, error: 'Error al actualizar el perfil' };
    }

    revalidatePath('/profile');
    return { success: true, message: 'Perfil actualizado exitosamente' };
  } catch (error) {
    console.error('Error en updateProfile:', error);
    return { success: false, error: 'Error interno del servidor' };
  }
}
