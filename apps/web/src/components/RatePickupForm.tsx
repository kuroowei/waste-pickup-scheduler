import { useState } from 'react';
import { StarRating } from './StarRating';
import { useCreateFeedback } from '../hooks/useFeedback';

export function RatePickupForm({ pickupId, onDone }: { pickupId: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const createFeedback = useCreateFeedback();

  async function handleSubmit() {
    if (rating === 0) return;
    try {
      await createFeedback.mutateAsync({ pickupId, rating, comments: comments || undefined });
      onDone();
    } catch {
      // error shown below
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
      {createFeedback.isError && (
        <p className="text-xs text-red-600 mb-2">
          {(createFeedback.error as any)?.response?.data?.error || 'Something went wrong.'}
        </p>
      )}
      <p className="text-sm font-medium text-slate-700 mb-2">Rate this pickup</p>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        rows={2}
        placeholder="Any comments? (optional)"
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        className="w-full mt-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || createFeedback.isPending}
          className="bg-slate-900 text-white text-sm rounded-lg px-3 py-1.5 font-medium hover:bg-slate-800 transition disabled:opacity-50"
        >
          {createFeedback.isPending ? 'Submitting...' : 'Submit rating'}
        </button>
        <button
          onClick={onDone}
          className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}