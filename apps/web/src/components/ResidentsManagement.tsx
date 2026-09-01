import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { AdminUser } from '../api/admin';
import type { PickupRequest } from '../types';
import { StatusBadge } from './StatusBadge';

const TERMINAL_STATUSES = ['COMPLETED', 'CANCELLED', 'SKIPPED'];

export function ResidentsManagement({
  residents,
  pickups,
}: {
  residents: AdminUser[];
  pickups: PickupRequest[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="px-4 py-3 font-medium w-8"></th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Pickups</th>
          </tr>
        </thead>
        <tbody>
          {residents.map((resident) => {
            const isOpen = expandedId === resident.id;
            const residentPickups = pickups.filter((p: any) => p.user?.id === resident.id);
            const upcoming = residentPickups.filter((p) => !TERMINAL_STATUSES.includes(p.status));
            const history = residentPickups.filter((p) => TERMINAL_STATUSES.includes(p.status));

            return (
              <>
                <tr
                  key={resident.id}
                  onClick={() => setExpandedId(isOpen ? null : resident.id)}
                  className="border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-slate-400">
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{resident.fullName}</td>
                  <td className="px-4 py-3 text-slate-500">{resident.email}</td>
                  <td className="px-4 py-3 text-slate-500">{resident.phone || '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{resident._count.pickups}</td>
                </tr>
                {isOpen && (
                  <tr key={`${resident.id}-detail`} className="border-b border-slate-100 last:border-0">
                    <td colSpan={5} className="bg-slate-50 px-4 py-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                            Upcoming ({upcoming.length})
                          </h4>
                          {upcoming.length === 0 && (
                            <p className="text-xs text-slate-400">No upcoming pickups</p>
                          )}
                          <div className="space-y-2">
                            {upcoming.map((p: any) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                              >
                                <div>
                                  <div className="text-sm font-medium text-slate-900">{p.wasteType?.name}</div>
                                  <div className="text-xs text-slate-400">
                                    {new Date(p.pickupDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}{' '}
                                    - {p.pickupTime}
                                  </div>
                                </div>
                                <StatusBadge status={p.status} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                            History ({history.length})
                          </h4>
                          {history.length === 0 && (
                            <p className="text-xs text-slate-400">No pickup history</p>
                          )}
                          <div className="space-y-2">
                            {history.map((p: any) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                              >
                                <div>
                                  <div className="text-sm font-medium text-slate-900">{p.wasteType?.name}</div>
                                  <div className="text-xs text-slate-400">
                                    {new Date(p.pickupDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                    })}{' '}
                                    - {p.pickupTime}
                                  </div>
                                </div>
                                <StatusBadge status={p.status} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}