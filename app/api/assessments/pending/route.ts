import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    // Validate leader
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'leader') {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 })
    }

    // Get team members for this leader
    const { data: members, error: membersErr } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role, avatar_url')
      .eq('leader_id', user.id)
      .eq('role', 'designer')

    if (membersErr) {
      return NextResponse.json({ error: membersErr.message }, { status: 500 })
    }

    const memberIds = (members || []).map(m => m.id)
    if (memberIds.length === 0) return NextResponse.json([])

    // Get pending assessments for these members
    const { data: assessments, error: assessErr } = await supabase
      .from('skill_assessments')
      .select('id, user_id, skill_id, level, justification, evidence, status, created_at')
      .eq('status', 'pending')
      .in('user_id', memberIds)
      .order('created_at', { ascending: false })

    if (assessErr) {
      return NextResponse.json({ error: assessErr.message }, { status: 500 })
    }

    // Fetch skills to map names
    const skillIds = [...new Set((assessments || []).map(a => a.skill_id))]
  const { data: skills, error: skillsErr } = await supabase.from('skills').select('id, name, category')
      .in('id', skillIds)
    if (skillsErr) {
      return NextResponse.json({ error: skillsErr.message }, { status: 500 })
    }

    const usersMap = new Map((members || []).map(u => [u.id, u]))
    const skillsMap = new Map((skills || []).map(s => [s.id, s]))

  const result = (assessments || []).map(a => {
      const u = usersMap.get(a.user_id)
      const s = skillsMap.get(a.skill_id)
      return {
        id: a.id,
        memberName: u ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : 'Usuario desconocido',
        memberRole: u?.role || 'Diseñador',
        memberAvatar: (u as any)?.avatar_url || null,
    skillName: s?.name || 'Skill desconocida',
    category: s?.category || 'Sin categoría',
        level: a.level || '',
        justification: a.justification || '',
        evidence: a.evidence || '',
        createdAt: a.created_at,
        status: 'pending' as const,
        userId: a.user_id,
        skillId: a.skill_id,
      }
    })

    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
