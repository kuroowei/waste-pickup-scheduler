import { useState } from 'react';
import type { Truck } from '../types';
import { useCreateDriverForTruck } from '../hooks/useAdmin';
interface FleetTableProps {
  trucks: Truck[];
}
const statusStyles: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700',
  ON_ROUTE: 'bg-amber-100 text-amber-700',
  MAINTENANCE: 'bg-slate-200 text-slate-600',
};
function AddDriverForm({ truckId, onDone }: { truckId: string; onDone: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const createDriver = useCreateDriverForTruck();
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    createDriver.mutate(
      { truckId, input: { fullName, email, phone, password } },
      {
        onSuccess: () => onDone(),
        onError: (err: any) => setError(err?.response?.data?.error ?? 'Something went wrong'),
      }
    );
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 py-2 min-w-[220px]">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <input
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
      />
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
      />
      <input
        type="password"
        placeholder="Password (min 8 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
        className="rounded-md border border-slate-300 px-2 py-1 text-xs"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={createDriver.isPending}
          className="flex-1 rounded-md bg-slate-900 text-white text-xs font-medium py-1.5 hover:bg-slate-800 disabled:opacity-50"
        >
          {createDriver.isPending ? 'Adding...' : 'Add Driver'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-md border border-slate-300 text-slate-600 text-xs font-medium px-3 py-1.5 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
export function FleetTable({ trucks }: FleetTableProps) {
  const [addingDriverFor, setAddingDriverFor] = useState<string | null>(null);
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
            <tr key={truck.id} className="border-b border-slate-100 last:border-0 align-top">
              <td className="px-4 py-3 font-medium text-slate-900">{truck.name}</td>
              <td className="px-4 py-3 text-slate-600">{truck.plateNumber}</td>
              <td className="px-4 py-3 text-slate-600">
                {truck.driver ? (
                  truck.driver.fullName
                ) : addingDriverFor === truck.id ? (
                  <AddDriverForm truckId={truck.id} onDone={() => setAddingDriverFor(null)} />
                ) : (
                  <button
                    onClick={() => setAddingDriverFor(truck.id)}
                    className="text-emerald-700 text-xs font-medium hover:underline"
                  >
                    + Add Driver
                  </button>
                )}
              </td>
              <td className="px-4 py-3 text-slate-600">{truck.driver?.phone ?? '-'}</td>
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