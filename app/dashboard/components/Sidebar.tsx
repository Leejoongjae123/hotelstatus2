'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
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
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
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

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      {/* 헤더 */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Hotel className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground">호텔 관리</h1>
            <p className="text-sm text-muted-foreground">시스템</p>
          </div>
        </div>
      </div>

      {/* 사용자 정보 */}
      {user && (
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.username}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 메뉴 */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-10 ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => router.push(item.href)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      <Separator />

      {/* 로그아웃 */}
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  );
} 