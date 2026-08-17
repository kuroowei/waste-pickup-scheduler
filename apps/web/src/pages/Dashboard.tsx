import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, History, MessageSquareWarning, Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUpcomingPickups, usePickupHistory, useCancelPickup } from '../hooks/usePickups';
import { useMyFeedback } from '../hooks/useFeedback';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { PickupCard } from '../components/PickupCard';
import { ScheduleForm } from '../components/ScheduleForm';
import { ComplaintForm } from '../components/ComplaintForm';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { Sidebar } from '../components/Sidebar';
import type { SidebarNavItem } from '../components/Sidebar';
import { MobileTopBar } from '../components/MobileTopBar';

type Tab = 'upcoming' | 'schedule' | 'history' | 'complaints' | 'announcements';

const NAV_ITEMS: SidebarNavItem[] = [
  { key: 'upcoming', label: 'Upcoming', icon: Calendar },
  { key: 'schedule', label: 'Schedule New', icon: Plus },
  { key: 'history', label: 'History', icon: History },
  { key: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
];

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const upcoming = useUpcomingPickups();
  const history = usePickupHistory();
  const cancelPickup = useCancelPickup();
  const myFeedback = useMyFeedback();
  const announcements = useAnnouncements();

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
        userSubtitle={user?.address || 'Resident'}
        onLogout={handleLogout}
        homePath="/dashboard"
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

          {activeTab !== 'announcements' && announcements.data && announcements.data.length > 0 && (
            <div className="mb-6">
              {announcements.data.slice(0, 1).map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          )}

          {activeTab === 'upcoming' && (
            <div className="space-y-3">
              {upcoming.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {upcoming.data?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-400">No upcoming pickups scheduled</p>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="mt-3 text-sm text-slate-900 font-medium hover:underline"
                  >
                    Schedule your first pickup
                  </button>
                </div>
              )}
              {upcoming.data?.map((pickup) => (
                <PickupCard
                  key={pickup.id}
                  pickup={pickup}
                  onCancel={(id) => cancelPickup.mutate(id)}
                  isCancelling={cancelPickup.isPending && cancelPickup.variables === pickup.id}
                />
              ))}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <ScheduleForm onSuccess={() => setActiveTab('upcoming')} />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {history.data?.length === 0 && (
                <p className="text-center py-12 text-slate-400">No pickup history yet</p>
              )}
              {history.data?.map((pickup) => (
                <PickupCard
                  key={pickup.id}
                  pickup={pickup}
                  allowRating
                  existingFeedback={myFeedback.data?.find((f) => f.pickupId === pickup.id)}
                />
              ))}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <ComplaintForm />
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-3">
              {announcements.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {announcements.data?.length === 0 && (
                <p className="text-center py-12 text-slate-400">No announcements yet</p>
              )}
              {announcements.data?.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}