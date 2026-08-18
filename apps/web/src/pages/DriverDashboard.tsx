import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck as TruckIcon, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDriverPickups, useDriverHistory, useUpdateDriverPickupStatus } from '../hooks/useDriver';
import { DriverPickupCard } from '../components/DriverPickupCard';
import { Sidebar } from '../components/Sidebar';
import type { SidebarNavItem } from '../components/Sidebar';
import { MobileTopBar } from '../components/MobileTopBar';

type Tab = 'assigned' | 'history';

const NAV_ITEMS: SidebarNavItem[] = [
  { key: 'assigned', label: 'Assigned Pickups', icon: TruckIcon },
  { key: 'history', label: 'History', icon: History },
];

export function DriverDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('assigned');

  const assigned = useDriverPickups();
  const history = useDriverHistory();
  const updateStatus = useUpdateDriverPickupStatus();

  function handleLogout() {
    navigate('/');
    logout();
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar
        navItems={NAV_ITEMS}
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key as Tab)}
        userName={user?.fullName}
        userSubtitle="Driver"
        onLogout={handleLogout}
        homePath="/driver"
      />

      <div className="flex-1 min-w-0">
        <MobileTopBar userName={user?.fullName} onLogout={handleLogout} />

        <div className="md:hidden flex gap-1 bg-slate-100 p-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as Tab)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition ${
                activeTab === item.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="hidden md:block mb-6">
            <h1 className="text-xl font-semibold text-slate-900">
              {NAV_ITEMS.find((i) => i.key === activeTab)?.label}
            </h1>
          </div>

          {activeTab === 'assigned' && (
            <div className="space-y-3">
              {assigned.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {assigned.data?.length === 0 && (
                <p className="text-center py-12 text-slate-400">No pickups assigned right now</p>
              )}
              {assigned.data?.map((pickup) => (
                <DriverPickupCard
                  key={pickup.id}
                  pickup={pickup}
                  onUpdateStatus={(id, status, feedback) => updateStatus.mutate({ id, status, feedback })}
                  isUpdating={updateStatus.isPending && updateStatus.variables?.id === pickup.id}
                />
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {history.data?.length === 0 && (
                <p className="text-center py-12 text-slate-400">No completed pickups yet</p>
              )}
              {history.data?.map((pickup) => (
                <DriverPickupCard key={pickup.id} pickup={pickup} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}