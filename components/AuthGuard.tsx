'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, token, logout, setUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  // 토큰 유효성 검증 함수
  const validateToken = async () => {
    if (!token) return false;
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Zustand persist 미들웨어의 hydration 완료를 기다림
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && token) {
      // 토큰 유효성 검증
      setIsValidating(true);
      validateToken().then((isValid) => {
        if (!isValid) {
          logout();
          router.push('/login');
        }
        setIsValidating(false);
      });
    } else if (!isLoading && (!isAuthenticated || !token)) {
      router.push('/login');
    }
  }, [isAuthenticated, token, router, isLoading, logout]);

  if (isLoading || isValidating || (!isAuthenticated || !token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            {isValidating ? '토큰 검증 중...' : '인증 확인 중...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 