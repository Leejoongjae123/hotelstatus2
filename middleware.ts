import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 보호된 경로들
  const protectedPaths = ['/dashboard'];
  const publicPaths = ['/login'];
  
  const { pathname } = request.nextUrl;

  // 루트 경로 처리
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );

  // 공개 경로인지 확인
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // 쿠키에서 토큰 확인
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // 토큰이 있으면 계속 진행
    return NextResponse.next();
  }

  if (isPublicPath) {
    // 로그인 페이지에서 토큰이 있으면 대시보드로 리다이렉트
    const token = request.cookies.get('token')?.value;
    
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 