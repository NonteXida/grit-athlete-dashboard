import React from 'react';
import { 
  Home, 
  User, 
  Dumbbell, 
  Apple, 
  Video, 
  Target,
  Trophy,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export function Sidebar({ currentPage, onNavigate, onLogout, isMobileOpen, onToggleMobile }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'training', icon: Dumbbell, label: 'Training' },
    { id: 'nutrition', icon: Apple, label: 'Nutrition' },
    { id: 'media', icon: Video, label: 'Media' },
    { id: 'goals', icon: Target, label: 'Goals' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onToggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#141414] border border-[#252525] rounded-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#141414] border-r border-[#252525] 
          flex flex-col transition-transform duration-300 z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#252525]">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-[#03fd1c]" />
            <span className="text-white">AthleteHub</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onToggleMobile();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all
                  ${isActive 
                    ? 'bg-[#03fd1c] text-black' 
                    : 'text-gray-400 hover:bg-[#252525] hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#252525]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#252525] hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          onClick={onToggleMobile}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}
