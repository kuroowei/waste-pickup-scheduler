import { useState } from 'react';
import { LogOut, Plus, Calendar, History, MessageSquareWarning } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUpcomingPickups, usePickupHistory, useCancelPickup } from '../hooks/usePickups';
import { PickupCard } from '../components/PickupCard';
import { ScheduleForm } from '../components/ScheduleForm';
import { ComplaintForm } from '../components/ComplaintForm';

type Tab = 'upcoming' | 'schedule' | 'history' | 'complaints';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');

  const upcoming = useUpcomingPickups();
  const history = usePickupHistory();
  const cancelPickup = useCancelPickup();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-slate-900">Welcome, {user?.fullName}</h1>
            <p className="text-sm text-slate-500">{user?.address || 'No address on file'}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
              activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Calendar size={16} />
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
              activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Plus size={16} />
            Schedule New
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <History size={16} />
            History
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition ${
              activeTab === 'complaints' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <MessageSquareWarning size={16} />
            Complaints
          </button>
        </div>

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
              <PickupCard key={pickup.id} pickup={pickup} allowRating />
            ))}
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <ComplaintForm />
          </div>
        )}
      </div>
    </div>
  );
}