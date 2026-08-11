import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Truck,
  LayoutDashboard,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  MessageSquareWarning,
  Star,
  Megaphone,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminStats, useAdminUsers, useAdminPickups, useAdminFeedback } from '../hooks/useAdmin';
import { useAllComplaints } from '../hooks/useComplaints';
import { StatsCard } from '../components/StatsCard';
import { UserTable } from '../components/UserTable';
import { AdminPickupTable } from '../components/AdminPickupTable';
import { ComplaintTable } from '../components/ComplaintTable';
import { RatingsTable } from '../components/RatingsTable';
import { AnnouncementManager } from '../components/AnnouncementManager';
import { Sidebar } from '../components/Sidebar';
import type { SidebarNavItem } from '../components/Sidebar';
import { MobileTopBar } from '../components/MobileTopBar';

type Tab = 'overview' | 'users' | 'pickups' | 'complaints' | 'ratings' | 'announcements';

const NAV_ITEMS: SidebarNavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'pickups', label: 'Pickups', icon: Truck },
  { key: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
  { key: 'ratings', label: 'Ratings', icon: Star },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
];

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const stats = useAdminStats();
  const users = useAdminUsers();
  const pickups = useAdminPickups();
  const complaints = useAllComplaints();
  const feedback = useAdminFeedback();

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
        userSubtitle="Administrator"
        onLogout={handleLogout}
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

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="hidden md:block mb-6">
            <h1 className="text-xl font-semibold text-slate-900">
              {NAV_ITEMS.find((i) => i.key === activeTab)?.label}
            </h1>
            <p className="text-sm text-slate-500">Waste Pickup Scheduler management</p>
          </div>

          {activeTab === 'overview' && (
            <div>
              {stats.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {stats.data && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatsCard label="Total Residents" value={stats.data.totalUsers} icon={Users} />
                  <StatsCard label="Today's Pickups" value={stats.data.todaysPickups} icon={CalendarDays} />
                  <StatsCard label="Pending" value={stats.data.pending} icon={Clock} accent="text-amber-600" />
                  <StatsCard label="Completed" value={stats.data.completed} icon={CheckCircle2} accent="text-green-600" />
                  <StatsCard label="Cancelled" value={stats.data.cancelled} icon={XCircle} accent="text-slate-400" />
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              {users.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {users.data && <UserTable users={users.data} />}
            </div>
          )}

          {activeTab === 'pickups' && (
            <div>
              {pickups.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {pickups.data && <AdminPickupTable pickups={pickups.data} />}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div>
              {complaints.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {complaints.data && <ComplaintTable complaints={complaints.data} />}
            </div>
          )}

          {activeTab === 'ratings' && (
            <div>
              {feedback.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
              {feedback.data && <RatingsTable feedback={feedback.data} />}
            </div>
          )}

          {activeTab === 'announcements' && <AnnouncementManager />}
        </div>
      </div>
    </div>
  );
}