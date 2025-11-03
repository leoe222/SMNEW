import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/assessments  { title: string, numericLevel: number, justification?: string }
export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

    const body = await req.json()
    const { title, numericLevel, justification, skillId } = body || {}

    // Validate inputs: require either a valid skillId or a title, and a finite numeric level
    const hasSkillId = typeof skillId === 'string' && skillId.length > 0
    const hasTitle = typeof title === 'string' && title.length > 0
    if ((!hasSkillId && !hasTitle) || !Number.isFinite(numericLevel)) {
      return NextResponse.json({ error: 'Invalid payload. Provide skillId or title and a numericLevel (0-5).' }, { status: 400 })
    }

    // Resolve skill id without attempting to create (avoid RLS issues)
    let resolvedSkillId: string | null = null
    if (hasSkillId) {
      resolvedSkillId = skillId
    } else if (hasTitle) {
      const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
      const target = normalize(title)
      const { data: allSkills, error: skillsErr } = await supabase.from('skills').select('id, name')
      if (skillsErr) return NextResponse.json({ error: skillsErr.message }, { status: 500 })
      const matched = (allSkills || []).find((sk: any) => normalize(sk.name) === target)
      resolvedSkillId = matched?.id ?? null
    }

    if (!resolvedSkillId) {
      return NextResponse.json({ error: 'Skill not found. Please ensure the skill exists in the database.' }, { status: 404 })
    }

    const toLegacy = (n: number) => (n <= 1 ? 'basic' : n <= 3 ? 'intermediate' : 'advanced')

    // Build the base payload
    const normalized = Math.max(0, Math.min(5, Math.round(Number(numericLevel))))
    const base = {
      user_id: user.id,
      skill_id: resolvedSkillId,
      level: toLegacy(normalized),
      justification: justification || 'Sin comentario',
      status: 'pending' as const,
      approved_at: null,
      approved_by: null,
      updated_at: new Date().toISOString(),
    }

    // Try 1: include numeric_level (schema v2+) and text level for compatibility
    const withNumeric: Record<string, any> = { ...base, numeric_level: normalized }
    let { error } = await supabase
      .from('skill_assessments')
      .upsert(withNumeric, { onConflict: 'user_id,skill_id' })

    // Try 2: if error mentions numeric_level missing OR type mismatch on level, try integer level only
    if (error && (/numeric_level/i.test(error.message || '') || /column\s+"?level"?.*integer|invalid input syntax for type integer|type integer/i.test(error.message || ''))) {
      const intLevelOnly = { ...base, level: normalized }
      const { error: retryLevelInt } = await supabase
        .from('skill_assessments')
        .upsert(intLevelOnly, { onConflict: 'user_id,skill_id' })
      if (!retryLevelInt) {
        return NextResponse.json({ success: true, note: 'Saved using integer level schema.' })
      }
      error = retryLevelInt
    }

    // Try 3: if still failing and error suggests level column expects text (legacy), try text-only without numeric_level
    if (error && /column\s+"?numeric_level"? does not exist|unknown column|does not exist/i.test(error.message || '')) {
      const textOnly = { ...base } // base has level as text
      const { error: retryText } = await supabase
        .from('skill_assessments')
        .upsert(textOnly, { onConflict: 'user_id,skill_id' })
      if (!retryText) {
        return NextResponse.json({ success: true, note: 'Saved using legacy text level schema.' })
      }
      error = retryText
    }

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
