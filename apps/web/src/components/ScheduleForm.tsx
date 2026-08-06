import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useWasteTypes, useCreatePickup } from '../hooks/usePickups';

const schema = z.object({
  wasteTypeId: z.string().min(1, 'Please select a waste type'),
  pickupDate: z.string().min(1, 'Please select a date'),
  hour: z.string().min(1, 'Select hour'),
  minute: z.string().min(1, 'Select minute'),
  period: z.enum(['AM', 'PM'], { message: 'Select AM or PM' }),
  address: z.string().min(5, 'Please enter a valid address'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = ['00', '15', '30', '45'];

export function ScheduleForm({ onSuccess }: { onSuccess?: () => void }) {
  const { data: wasteTypes, isLoading: loadingWasteTypes } = useWasteTypes();
  const createPickup = useCreatePickup();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const today = new Date().toISOString().split('T')[0];

  async function onSubmit(values: FormValues) {
    try {
      const pickupTime = `${values.hour}:${values.minute} ${values.period}`;
      await createPickup.mutateAsync({
        wasteTypeId: values.wasteTypeId,
        pickupDate: values.pickupDate,
        pickupTime,
        address: values.address,
        notes: values.notes,
      });
      reset();
      onSuccess?.();
    } catch {
      // error shown below via createPickup.isError
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {createPickup.isError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {(createPickup.error as any)?.response?.data?.error || 'Something went wrong. Please try again.'}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Waste type</label>
        <select
          {...register('wasteTypeId')}
          disabled={loadingWasteTypes}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="">Select waste type</option>
          {wasteTypes?.map((wt) => (
            <option key={wt.id} value={wt.id}>
              {wt.name}
            </option>
          ))}
        </select>
        {errors.wasteTypeId && <p className="text-xs text-red-600 mt-1">{errors.wasteTypeId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
        <input
          type="date"
          min={today}
          {...register('pickupDate')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        {errors.pickupDate && <p className="text-xs text-red-600 mt-1">{errors.pickupDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Pickup time</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            {...register('hour')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Hour</option>
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            {...register('minute')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">Minute</option>
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            {...register('period')}
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="">AM/PM</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        {(errors.hour || errors.minute || errors.period) && (
          <p className="text-xs text-red-600 mt-1">
            {errors.hour?.message || errors.minute?.message || errors.period?.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Pickup address</label>
        <input
          type="text"
          placeholder="123 Sample Street, Yenagoa"
          {...register('address')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
        <textarea
          rows={2}
          placeholder="Any special instructions..."
          {...register('notes')}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
      </div>

      <button
        type="submit"
        disabled={createPickup.isPending}
        className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-medium hover:bg-slate-800 transition disabled:opacity-50"
      >
        {createPickup.isPending ? 'Scheduling...' : 'Schedule pickup'}
      </button>
    </form>
  );
}