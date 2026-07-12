import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

export default function AppLayout() {
  const { user } = useAuth();
  const { theme } = useSettings();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={cn('flex h-screen overflow-hidden', theme === 'dark' ? 'bg-[#1a0f17]' : 'bg-[#faf5f9]')}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
