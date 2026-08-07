import { useState, FormEvent } from 'react';
import { useCreateComplaint } from '../hooks/useComplaints';

export function ComplaintForm({ onSuccess }: { onSuccess?: () => void }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const createComplaint = useCreateComplaint();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await createComplaint.mutateAsync({ subject, message });
      setSubject('');
      setMessage('');
      onSuccess?.();
    } catch {
      // error shown below
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {createComplaint.isError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {(createComplaint.error as any)?.response?.data?.error || 'Something went wrong.'}
        </div>
      )}
      {createComplaint.isSuccess && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Complaint submitted. We'll review it shortly.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Truck skipped my area"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the issue..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={createComplaint.isPending}
        className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-800 transition disabled:opacity-50"
      >
        {createComplaint.isPending ? 'Submitting...' : 'Submit complaint'}
      </button>
    </form>
  );
}