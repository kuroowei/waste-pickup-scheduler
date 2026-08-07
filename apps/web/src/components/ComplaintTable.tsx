import type { Complaint, ComplaintStatus } from '../api/complaint';
import { useUpdateComplaintStatus } from '../hooks/useComplaints';

const STATUS_OPTIONS: ComplaintStatus[] = ['OPEN', 'IN_REVIEW', 'RESOLVED'];

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  OPEN: 'bg-red-100 text-red-800',
  IN_REVIEW: 'bg-amber-100 text-amber-800',
  RESOLVED: 'bg-green-100 text-green-800',
};

export function ComplaintTable({ complaints }: { complaints: Complaint[] }) {
  const updateStatus = useUpdateComplaintStatus();

  if (complaints.length === 0) {
    return <p className="text-center py-12 text-slate-400">No complaints filed</p>;
  }

  return (
    <div className="space-y-3">
      {complaints.map((complaint) => (
        <div key={complaint.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-slate-900">{complaint.subject}</h3>
              <p className="text-sm text-slate-500 mt-1">{complaint.message}</p>
              {complaint.user && (
                <p className="text-xs text-slate-400 mt-2">
                  {complaint.user.fullName} · {complaint.user.email}
                  {complaint.user.phone && ` · ${complaint.user.phone}`}
                </p>
              )}
            </div>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[complaint.status]}`}>
              {complaint.status.replace('_', ' ')}
            </span>
          </div>

          <select
            value={complaint.status}
            onChange={(e) =>
              updateStatus.mutate({ id: complaint.id, status: e.target.value as ComplaintStatus })
            }
            disabled={updateStatus.isPending}
            className="mt-3 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}