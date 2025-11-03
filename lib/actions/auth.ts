'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { LoginFormData, RegisterFormData } from '@/lib/schemas/auth';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
  leader_id?: string;
  squad?: string | null;
  // Campos estadísticos opcionales usados en el dashboard
  stats?: {
    averageScore?: number;
    maxScore?: number;
    deltaText?: string;
    objectivesCount?: number;
    validatedCount?: number;
    validatedTotal?: number;
    lastUpdated?: string;
  };
  // Redundancias/fallback de datos planos que el dashboard intenta leer directamente
  averageScore?: number;
  validatedCount?: number;
  updatedAt?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
}

// Cliente reutilizable para todas las funciones
async function getSupabaseClient() {
  return await createClient();
}

// Obtener el perfil del usuario actual de forma optimizada
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await getSupabaseClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error al obtener perfil:', profileError);
      return null;
    }

    // Cálculo de estadísticas (promedio 0-5) usando nueva columna numeric_level si existe; fallback al bucket textual.
    let averageScore: number | undefined
    let maxScore: number | undefined
    let validatedCount: number | undefined
    let lastUpdated: string | undefined

    try {
      // Traer evaluaciones aprobadas del usuario (numéricas si están disponibles)
      // Seleccionamos ambas columnas para compatibilidad durante la migración.
      const { data: assessments, error: assessError } = await supabase
        .from('skill_assessments')
        .select('numeric_level, level, updated_at, status')
        .eq('user_id', user.id)
        .eq('status', 'approved')

      if (!assessError && assessments) {
        const numericValues: number[] = assessments.map((a: any) => {
          if (typeof a.numeric_level === 'number') return a.numeric_level
          // Fallback: mapear texto antiguo a un punto representativo dentro de la escala 0-5
          switch (a.level) {
            case 'basic': return 1
            case 'intermediate': return 3
            case 'advanced': return 5
            default: return 0
          }
        })
        if (numericValues.length > 0) {
          const sum = numericValues.reduce((acc, v) => acc + v, 0)
            
          averageScore = parseFloat((sum / numericValues.length).toFixed(2))
          maxScore = 5
          validatedCount = numericValues.length
          // último updated_at aprobado
          const last = assessments
            .map((a: any) => a.updated_at ? new Date(a.updated_at).getTime() : 0)
            .sort((a: number, b: number) => b - a)[0]
          if (last) lastUpdated = new Date(last).toISOString()
        }
      }
    } catch (e) {
      // Silenciar errores de stats para no romper perfil
      console.warn('No se pudieron calcular stats del usuario:', e)
    }

    return {
      id: user.id,
      email: user.email!,
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      role: profile.role,
      avatar_url: profile.avatar_url,
      bio: profile.bio,
      leader_id: profile.leader_id,
      stats: (averageScore !== undefined || validatedCount !== undefined) ? {
        averageScore,
        maxScore,
        validatedCount,
        validatedTotal: validatedCount, // placeholder (se podría calcular total distinto)
        lastUpdated,
      } : undefined,
    };
  } catch (error) {
    console.error('Error en getCurrentUserProfile:', error);
    return null;
  }
}

export async function signUp(data: RegisterFormData) {
  try {
    const supabase = await getSupabaseClient();

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (authData.user) {
      try {
        // Crear el perfil manualmente si el trigger no funciona
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            role: data.role,
          });

        if (profileError) {
          // No fallar si el perfil ya existe (trigger ya lo creó)
          if (!profileError.message.includes('duplicate key')) {
            return { error: `Error al crear el perfil: ${profileError.message}` };
          }
        }
      } catch {
        // Continuar incluso si falla la creación del perfil
      }

      revalidatePath('/dashboard');
      return { success: true, redirect: '/login' };
    }

    return { error: 'Error al crear la cuenta' };
  } catch {
    return { error: 'Error inesperado al crear la cuenta' };
  }
}

export async function signIn(data: LoginFormData) {
  try {
    const supabase = await getSupabaseClient();

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { error: error.message };
    }

    if (authData.user) {
      revalidatePath('/dashboard');
      return { success: true, redirect: '/dashboard' };
    }

    return { error: 'Error al iniciar sesión' };
  } catch {
    return { error: 'Error inesperado' };
  }
}

export async function signOut() {
  try {
    const supabase = await getSupabaseClient();

    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      revalidatePath('/');
      return { success: true, redirect: '/login' };
    } else {
      return { error: error.message };
    }
  } catch {
    return { error: 'Error al cerrar sesión' };
  }
}
