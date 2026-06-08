import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const authSession = request.cookies.get('auth_session');

    // 1. If not logged in, redirect to login
    if (!authSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const session = JSON.parse(authSession.value);

      // 2. Check RBAC (Role-Based Access Control)
      // /dashboard/admin requires role 'admin'
      if (pathname.startsWith('/dashboard/admin') && session.role !== 'admin') {
        return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
      }

      // /dashboard/guru requires role 'guru'
      if (pathname.startsWith('/dashboard/guru') && session.role !== 'guru') {
        return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
      }

      // /dashboard/siswa requires role 'siswa'
      if (pathname.startsWith('/dashboard/siswa') && session.role !== 'siswa') {
        return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
      }

      // /dashboard/wali requires role 'wali'
      if (pathname.startsWith('/dashboard/wali') && session.role !== 'wali') {
        return NextResponse.redirect(new URL(`/dashboard/${session.role}`, request.url));
      }

      // Pass the request along
      return NextResponse.next();

    } catch (error) {
      // If cookie parsing fails, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_session');
      return response;
    }
  }

  // Allow all other routes (public)
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
