import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge Runtime 명시
export const runtime = 'edge';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 정적 파일이나 API 경로는 제외
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  // 보호된 경로들
  const protectedPaths = ['/dashboard'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  // 인증이 필요한 경로에 토큰이 없는 경우
  if (isProtectedPath && !token) {
    // 이미 로그인 페이지로 가고 있다면 무한 리다이렉트 방지
    if (pathname === '/login') {
      return NextResponse.next();
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 루트 경로 처리
  if (pathname === '/') {
    if (token) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    } else {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 로그인 페이지에 토큰이 있는 사용자가 접근하는 경우
  if (pathname === '/login' && token) {
    // 이미 대시보드로 가고 있다면 무한 리다이렉트 방지
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.next();
    }
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
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