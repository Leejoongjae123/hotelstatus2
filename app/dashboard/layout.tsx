import Sidebar from './components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="h-full p-6">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
} 