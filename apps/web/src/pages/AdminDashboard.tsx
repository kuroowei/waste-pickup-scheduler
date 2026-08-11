import { useState } from 'react';
import { LogOut, Users, Truck, LayoutDashboard, Clock, CheckCircle2, XCircle, CalendarDays, MessageSquareWarning, Star, Megaphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdminStats, useAdminUsers, useAdminPickups, useAdminFeedback } from '../hooks/useAdmin';
import { useAllComplaints } from '../hooks/useComplaints';
import { StatsCard } from '../components/StatsCard';
import { UserTable } from '../components/UserTable';
import { AdminPickupTable } from '../components/AdminPickupTable';
import { ComplaintTable } from '../components/ComplaintTable';
import { RatingsTable } from '../components/RatingsTable';
import { AnnouncementManager } from '../components/AnnouncementManager';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'users' | 'pickups' | 'complaints' | 'ratings' | 'announcements';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const stats = useAdminStats();
  const users = useAdminUsers();
  const pickups = useAdminPickups();
  const complaints = useAllComplaints();
  const feedback = useAdminFeedback();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-slate-900">Admin — {user?.fullName}</h1>
            <p className="text-sm text-slate-500">Waste Pickup Scheduler management</p>
          </div>
          <button
            onClick={() => {
              navigate('/');
              logout();
            }}
            className="flex items-center gap-1.5 text-sm text-slate-900 hover:text-slate-900 transition"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Users size={16} />
            Users
          </button>
          <button
            onClick={() => setActiveTab('pickups')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'pickups' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Truck size={16} />
            Pickups
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'complaints' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <MessageSquareWarning size={16} />
            Complaints
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'ratings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Star size={16} />
            Ratings
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === 'announcements' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Megaphone size={16} />
            Announcements
          </button>
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
  );
}