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

  return (
    <aside className={cn(
      'w-64 flex flex-col h-screen sticky top-0 border-r',
      theme === 'dark'
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white border-gray-200'
    )}>
      {/* Logo */}
      <div className={cn('p-6 border-b', theme === 'dark' ? 'border-gray-800' : 'border-gray-200')}>
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className={cn('font-bold text-lg leading-none', theme === 'dark' ? 'text-white' : 'text-gray-900')}>TransitOps</h1>
            <p className={cn('text-xs mt-0.5', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>{t.fleetManagement}</p>
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
                ? 'bg-purple-600/20 text-purple-600 border border-purple-600/30'
                : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Controls */}
      <div className={cn('px-4 py-3 border-t flex gap-2', theme === 'dark' ? 'border-gray-800' : 'border-gray-200')}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? t.light : t.dark}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? t.light : t.dark}
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          title={t.language}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
            theme === 'dark'
              ? 'bg-gray-800 text-purple-400 hover:bg-gray-700'
              : 'bg-gray-100 text-purple-600 hover:bg-gray-200'
          )}
        >
          <Languages size={14} />
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      {/* User */}
      <div className={cn('p-4 border-t', theme === 'dark' ? 'border-gray-800' : 'border-gray-200')}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-medium truncate', theme === 'dark' ? 'text-white' : 'text-gray-900')}>{user?.name}</p>
            <p className={cn('text-xs truncate', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          {t.signOut}
        </button>
      </div>
    </aside>
  );
}
