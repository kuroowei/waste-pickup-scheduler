import type { AdminFeedback } from '../api/admin';
import { StarRating } from './StarRating';

export function RatingsTable({ feedback }: { feedback: AdminFeedback[] }) {
  if (feedback.length === 0) {
    return <p className="text-center py-12 text-slate-400">No ratings submitted yet</p>;
  }

  return (
    <div className="space-y-3">
      {feedback.map((item) => (
        <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-slate-900">{item.pickup.wasteType.name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {item.user.fullName} · {item.user.email}
              </p>
            </div>
            <StarRating value={item.rating} readOnly size={16} />
          </div>
          {item.comments && (
            <p className="text-sm text-slate-500 mt-2 italic">"{item.comments}"</p>
          )}
        </div>
      ))}
    </div>
  );
}