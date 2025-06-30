import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware called for:', request.nextUrl.pathname);

  const { pathname } = request.nextUrl;
  
  // Solo procesar rutas de admin
  if (!pathname.startsWith('/admin')) {
    console.log('❌ Not admin route, skipping');

    return NextResponse.next();
  }
  console.log('✅ Processing admin route');


  const isLoginPage = pathname === '/admin/login';
  const isProtectedRoute = pathname.startsWith('/admin') && !isLoginPage;

  try {
    const session = await getSessionFromRequest(request);

    // Redirect to login if no session and trying to access protected route
    if (!session && isProtectedRoute) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to admin if has session and on login page
    if (session && isLoginPage) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // En caso de error, redirigir al login
    if (isProtectedRoute) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};

// middleware.ts - Versión simple para debugging
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   console.log('🔍 Middleware called for:', pathname);
  
//   // Solo loguear por ahora, no hacer nada más
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*'],
// };