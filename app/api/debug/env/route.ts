import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    return NextResponse.json({
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlDefined: supabaseUrl ? 'YES' : 'NO',
      keyDefined: supabaseAnonKey ? 'YES' : 'NO',
      // No exponemos las claves reales por seguridad
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Error checking environment variables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}