import type { PickupRequest, PickupStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { useUpdatePickupStatus } from '../hooks/useAdmin';

const STATUS_OPTIONS: PickupStatus[] = [
  'PENDING',
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'SKIPPED',
];

export function AdminPickupTable({ pickups }: { pickups: PickupRequest[] }) {
  const updateStatus = useUpdatePickupStatus();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="px-4 py-3 font-medium">Resident</th>
            <th className="px-4 py-3 font-medium">Waste Type</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Address</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Update</th>
          </tr>
        </thead>
        <tbody>
          {pickups.map((pickup: any) => (
            <tr key={pickup.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{pickup.user?.fullName}</div>
                <div className="text-xs text-slate-400">{pickup.user?.phone}</div>
              </td>
              <td className="px-4 py-3 text-slate-500">{pickup.wasteType.name}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(pickup.pickupDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
                {' · '}
                {pickup.pickupTime}
              </td>
              <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{pickup.address}</td>
              <td className="px-4 py-3">
                <StatusBadge status={pickup.status} />
              </td>
              <td className="px-4 py-3">
                <select
                  value={pickup.status}
                  onChange={(e) =>
                    updateStatus.mutate({ id: pickup.id, status: e.target.value as PickupStatus })
                  }
                  disabled={updateStatus.isPending}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}