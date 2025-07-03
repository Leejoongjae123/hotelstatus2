import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge Runtime 명시
export const runtime = 'edge';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 루트 경로 처리
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 대시보드 경로 보호
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 로그인 페이지에서 토큰이 있으면 대시보드로 리다이렉트
  if (pathname === '/login') {
    const token = request.cookies.get('token');
    
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 