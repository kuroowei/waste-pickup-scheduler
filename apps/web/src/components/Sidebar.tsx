import { Link } from 'react-router-dom';
import { Truck, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: SidebarNavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  userName?: string;
  userSubtitle?: string;
  onLogout: () => void;
  homePath: string;
}

export function Sidebar({ navItems, activeKey, onSelect, userName, userSubtitle, onLogout, homePath }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-emerald-900 h-screen sticky top-0">
      <Link to={homePath} className="flex items-center gap-2 px-5 py-5 border-b border-emerald-800">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
          <Truck size={18} className="text-white" />
        </div>
        <span className="font-semibold text-white">WastePickup</span>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition text-left ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-emerald-300'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-emerald-800 px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-medium text-sm shrink-0">
            {userName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-emerald-300 truncate">{userSubtitle}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-800 hover:text-white transition"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}