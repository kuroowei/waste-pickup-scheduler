import { Link, useLocation } from 'react-router-dom';
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
}

export function Sidebar({ navItems, activeKey, onSelect, userName, userSubtitle, onLogout }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0">
      <Link to="/" className="flex items-center gap-2 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
          <Truck size={18} className="text-white" />
        </div>
        <span className="font-semibold text-slate-900">WastePickup</span>
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
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium text-sm shrink-0">
            {userName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userSubtitle}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}
