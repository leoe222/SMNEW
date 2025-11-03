import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Verificar que las variables de entorno estén disponibles
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      // Si faltan las variables, permitir acceso sin middleware
      return NextResponse.next()
    }

    const { pathname } = request.nextUrl

    // Permitir acceso directo a rutas estáticas y API
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.') // archivos estáticos
    ) {
      return NextResponse.next()
    }

    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Intentar obtener el usuario
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Si hay error de autenticación, permitir continuar
    if (error) {
      console.error('Auth error in middleware:', error.message)
      return NextResponse.next()
    }

    // Definir rutas
    const publicRoutes = ['/login', '/register']
    const privateRoutes = ['/dashboard', '/profile', '/auto-evaluaciones']

    // Lógica de redirección
    if (!user && privateRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirigir raíz según autenticación
    if (pathname === '/') {
      const redirectUrl = user ? '/dashboard' : '/login'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    return response

  } catch (error) {
    // Log del error pero permitir que la request continúe
    console.error('Middleware critical error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      pathname: request.nextUrl.pathname,
      url: request.url
    })
    
    // En caso de cualquier error crítico, permitir acceso
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next static files
     * - _next image optimization
     * - favicon and other static assets
     */
    '/((?!api/|_next/|favicon.ico|.*\\.).*)',
  ],
}
