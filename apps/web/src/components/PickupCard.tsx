import { useState } from 'react';
import { Calendar, Clock, MapPin, Trash2, Star } from 'lucide-react';
import type { PickupRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { RatePickupForm } from './RatePickupForm';
import { StarRating } from './StarRating';
import type { Feedback } from '../api/feedback';

interface PickupCardProps {
  pickup: PickupRequest;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
  allowRating?: boolean;
  existingFeedback?: Feedback;
}

export function PickupCard({ pickup, onCancel, isCancelling, allowRating, existingFeedback }: PickupCardProps) {
  const [showRateForm, setShowRateForm] = useState(false);
  const canCancel = onCancel && pickup.status !== 'CANCELLED' && pickup.status !== 'COMPLETED';
  const canRate = allowRating && pickup.status === 'COMPLETED' && !existingFeedback;

  const formattedDate = new Date(pickup.pickupDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-900">{pickup.wasteType.name}</h3>
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
          </div>
          {pickup.notes && (
            <p className="mt-2 text-sm text-slate-400 italic">"{pickup.notes}"</p>
          )}
        </div>
        <StatusBadge status={pickup.status} />
      </div>

      <div className="flex items-center gap-4 mt-3">
        {canCancel && (
          <button
            onClick={() => onCancel(pickup.id)}
            disabled={isCancelling}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            <Trash2 size={14} />
            {isCancelling ? 'Cancelling...' : 'Cancel pickup'}
          </button>
        )}
        {canRate && !showRateForm && (
          <button
            onClick={() => setShowRateForm(true)}
            className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700"
          >
            <Star size={14} />
            Rate this pickup
          </button>
        )}
      </div>

      {canRate && showRateForm && (
        <RatePickupForm pickupId={pickup.id} onDone={() => setShowRateForm(false)} />
      )}

      {existingFeedback && (
        <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-800">Your rating</span>
            <StarRating value={existingFeedback.rating} readOnly size={14} />
          </div>
          {existingFeedback.comments && (
            <p className="text-sm text-slate-600 mt-1 italic">"{existingFeedback.comments}"</p>
          )}
        </div>
      )}
    </div>
  );
}