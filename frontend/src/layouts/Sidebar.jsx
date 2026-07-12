import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import {
  LayoutDashboard, Truck, Users, MapPin, Wrench,
  DollarSign, BarChart2, Bot, LogOut, Zap, Sun, Moon, Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, lang, t, toggleTheme, toggleLang } = useSettings();
  const navigate = useNavigate();

  const NAV = [
    { to: '/', icon: LayoutDashboard, label: t.dashboard },
    { to: '/vehicles', icon: Truck, label: t.vehicles },
    { to: '/drivers', icon: Users, label: t.drivers },
    { to: '/trips', icon: MapPin, label: t.trips },
    { to: '/maintenance', icon: Wrench, label: t.maintenance },
    { to: '/finance', icon: DollarSign, label: t.finance },
    { to: '/reports', icon: BarChart2, label: t.reports },
    { to: '/ai', icon: Bot, label: t.aiAssistant },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  const isDark = theme === 'dark';

  return (
    <aside className={cn(
      'w-64 flex flex-col h-screen sticky top-0 border-r',
      isDark ? 'bg-[#1a0f17] border-[#4e3347]' : 'bg-white border-[#e8d2e2]'
    )}>
      {/* Logo */}
      <div className={cn('p-6 border-b', isDark ? 'border-[#4e3347]' : 'border-[#e8d2e2]')}>
        <div className="flex items-center gap-3">
          <div className="bg-[#714b67] p-2 rounded-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className={cn('font-bold text-lg leading-none', isDark ? 'text-white' : 'text-[#3d2838]')}>TransitOps</h1>
            <p className={cn('text-xs mt-0.5', isDark ? 'text-[#9e6089]' : 'text-[#b980a6]')}>{t.fleetManagement}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-[#714b67]/20 text-[#714b67] border border-[#714b67]/40 dark:text-[#d4adc8]'
                : isDark
                  ? 'text-[#b980a6] hover:text-white hover:bg-[#714b67]/20'
                  : 'text-[#714b67] hover:text-[#3d2838] hover:bg-[#f3e8f0]'
            )}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme & Language toggles */}
      <div className={cn('px-4 py-3 border-t flex gap-2', isDark ? 'border-[#4e3347]' : 'border-[#e8d2e2]')}>
        <button
          onClick={toggleTheme}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            isDark
              ? 'bg-[#3d2838] text-[#d4adc8] hover:bg-[#4e3347]'
              : 'bg-[#f3e8f0] text-[#714b67] hover:bg-[#e8d2e2]'
          )}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? t.light : t.dark}
        </button>
        <button
          onClick={toggleLang}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            isDark
              ? 'bg-[#3d2838] text-[#d4adc8] hover:bg-[#4e3347]'
              : 'bg-[#f3e8f0] text-[#714b67] hover:bg-[#e8d2e2]'
          )}
        >
          <Languages size={14} />
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      {/* User */}
      <div className={cn('p-4 border-t', isDark ? 'border-[#4e3347]' : 'border-[#e8d2e2]')}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#714b67] rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-medium truncate', isDark ? 'text-white' : 'text-[#3d2838]')}>{user?.name}</p>
            <p className={cn('text-xs truncate', isDark ? 'text-[#9e6089]' : 'text-[#b980a6]')}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#9e6089] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          {t.signOut}
        </button>
      </div>
    </aside>
  );
}
