import { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, CheckCircle2, SkipForward } from 'lucide-react';
import type { PickupRequest } from '../types';
interface DriverPickupCardProps {
  pickup: PickupRequest;
  onUpdateStatus?: (id: string, status: 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED', feedback?: string) => void;
  isUpdating?: boolean;
}
export function DriverPickupCard({ pickup, onUpdateStatus, isUpdating }: DriverPickupCardProps) {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState<'COMPLETED' | 'SKIPPED' | null>(null);
  const canAct = onUpdateStatus && (pickup.status === 'SCHEDULED' || pickup.status === 'IN_PROGRESS');
  const formattedDate = new Date(pickup.pickupDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  function submitAction(status: 'COMPLETED' | 'SKIPPED') {
    onUpdateStatus?.(pickup.id, status, feedback || undefined);
    setShowFeedback(null);
    setFeedback('');
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-900">{pickup.wasteType.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{pickup.user?.fullName}</p>
          <div className="mt-2 space-y-1.5 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{formattedDate}</span>
              <Clock size={14} className="ml-2" />
              <span>{pickup.pickupTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} />
              <span>{pickup.address}</span>
            </div>
            {pickup.user?.phone && (
              <a href={`tel:${pickup.user.phone}`} className="flex items-center gap-1.5 text-emerald-700 hover:underline">
                <Phone size={14} />
                <span>{pickup.user.phone}</span>
              </a>
            )}
          </div>
          {pickup.notes && (
            <p className="mt-2 text-sm text-slate-400 italic">"{pickup.notes}"</p>
          )}
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
          {pickup.status.replace('_', ' ')}
        </span>
      </div>

      {canAct && pickup.status === 'SCHEDULED' && (
        <button
          onClick={() => onUpdateStatus?.(pickup.id, 'IN_PROGRESS')}
          disabled={isUpdating}
          className="mt-3 w-full rounded-lg bg-slate-900 text-white text-sm font-medium py-2 hover:bg-slate-800 disabled:opacity-50"
        >
          Start pickup
        </button>
      )}

      {canAct && pickup.status === 'IN_PROGRESS' && !showFeedback && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowFeedback('COMPLETED')}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium py-2 hover:bg-emerald-700"
          >
            <CheckCircle2 size={16} />
            Complete
          </button>
          <button
            onClick={() => setShowFeedback('SKIPPED')}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium py-2 hover:bg-slate-50"
          >
            <SkipForward size={16} />
            Report issue
          </button>
        </div>
      )}

      {showFeedback && (
        <div className="mt-3 space-y-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={showFeedback === 'COMPLETED' ? 'Any notes for the admin (optional)' : 'What happened?'}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => submitAction(showFeedback)}
              disabled={isUpdating}
              className="flex-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2 hover:bg-slate-800 disabled:opacity-50"
            >
              {isUpdating ? 'Submitting...' : 'Submit'}
            </button>
            <button
              onClick={() => setShowFeedback(null)}
              className="rounded-lg border border-slate-300 text-slate-600 text-sm font-medium px-4 py-2 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}