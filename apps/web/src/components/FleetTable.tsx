import type { Truck } from '../types';
interface FleetTableProps {
  trucks: Truck[];
}
const statusStyles: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  ON_ROUTE: 'bg-amber-100 text-amber-700',
  MAINTENANCE: 'bg-slate-200 text-slate-600',
};
export function FleetTable({ trucks }: FleetTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="px-4 py-3 font-medium">Truck</th>
            <th className="px-4 py-3 font-medium">Plate Number</th>
            <th className="px-4 py-3 font-medium">Driver</th>
            <th className="px-4 py-3 font-medium">Phone</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Active Pickups</th>
          </tr>
        </thead>
        <tbody>
          {trucks.map((truck) => (
            <tr key={truck.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3 font-medium text-slate-900">{truck.name}</td>
              <td className="px-4 py-3 text-slate-600">{truck.plateNumber}</td>
              <td className="px-4 py-3 text-slate-600">{truck.driver?.fullName ?? "-"}</td>
              <td className="px-4 py-3 text-slate-600">{truck.driver?.phone ?? "-"}</td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[truck.status]}`}>
                  {truck.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{truck._count?.pickups ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}