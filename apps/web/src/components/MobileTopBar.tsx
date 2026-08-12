import { Truck, LogOut } from 'lucide-react';

interface MobileTopBarProps {
  userName?: string;
  onLogout: () => void;
}

export function MobileTopBar({ userName, onLogout }: MobileTopBarProps) {
  return (
    <div className="md:hidden flex items-center justify-between bg-emerald-900 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
          <Truck size={16} className="text-white" />
        </div>
        <span className="font-medium text-white text-sm">{userName}</span>
      </div>
      <button onClick={onLogout} className="text-emerald-200">
        <LogOut size={18} />
      </button>
    </div>
  );
}