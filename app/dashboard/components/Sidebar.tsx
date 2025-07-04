'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  User, 
  FileText,
  LogOut,
  Hotel
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function Sidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const menuItems = [
    {
      name: '로그인 정보',
      href: '/dashboard/login-info',
      icon: User,
    },
    {
      name: '로그 메뉴',
      href: '/dashboard/logs',
      icon: FileText,
    },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* 헤더 */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <Hotel className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">예약관리 솔루션</h1>
        </div>
      </div>

      {/* 사용자 정보 */}
      <div className="p-6 border-b w-full flex justify-center">
        <div className="flex items-center gap-3 justify-center w-full">
          
          <div className="w-full flex flex-col justify-center items-center">
            <p className="text-lg font-bold truncate">
              {session?.user?.name || '사용자'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        
      </div>

      {/* 메뉴 */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => router.push(item.href)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* 로그아웃 */}
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
} 