import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Next 15: ensure params is awaited before property access (in edge/runtime changes)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Support both direct object and promise (defensive)
  const resolvedParams = await params
  const { id } = resolvedParams

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('skill_assessments')
    .select(`
      id,
      user_id,
      level,
      numeric_level,
      status,
  skills(name, category)
    `)
    .eq('user_id', id)

  if (error) {
  console.error('Error fetching member skills', { userId: id, error })
  return NextResponse.json({ skills: [], error: error.message }, { status: 500 })
  }

  const mapTextLevel = (lvl: string | number | null | undefined) => {
    if (typeof lvl === 'number') return lvl
    switch (lvl) {
      case 'basic': return 1
      case 'intermediate': return 3
      case 'advanced': return 5
      default: return 0
    }
  }

  const skills = (data || []).map((r: any) => ({
    id: r.id,
    name: r.skills?.name || '',
    category: r.skills?.category || '',
    numericLevel: typeof r.numeric_level === 'number'
      ? r.numeric_level
      : mapTextLevel(r.level),
    status: r.status
  }))
  return NextResponse.json({ skills })
}
