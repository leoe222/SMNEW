import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    const { id, reason } = await req.json().catch(() => ({})) as { id?: string; reason?: string }
    if (!id) {
      return NextResponse.json({ error: 'Missing assessment id' }, { status: 400 })
    }
    if (!reason || !String(reason).trim()) {
      return NextResponse.json({ error: 'Debes ingresar un motivo para rechazar la evaluación' }, { status: 400 })
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (!profile || profile.role !== 'leader') {
      return NextResponse.json({ error: 'No tienes permisos para rechazar evaluaciones' }, { status: 403 })
    }

    const { error } = await supabase
      .from('skill_assessments')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: user.id,
        rejection_reason: String(reason).trim(),
      })
      .eq('id', id)
      .eq('status', 'pending')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Evaluación rechazada exitosamente' })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}
