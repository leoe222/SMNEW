import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Permitir todas las rutas API y archivos estáticos
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Redirigir raíz a login por ahora (sin autenticación)
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Permitir todas las demás rutas
    return NextResponse.next()

  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!api/|_next/|favicon.ico|.*\\.).*)',
  ],
}