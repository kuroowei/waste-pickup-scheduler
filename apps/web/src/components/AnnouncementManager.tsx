import { useState, FormEvent } from 'react';
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from '../hooks/useAnnouncements';
import { AnnouncementCard } from './AnnouncementCard';

export function AnnouncementManager() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const announcements = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await createAnnouncement.mutateAsync({ title, message });
      setTitle('');
      setMessage('');
    } catch {
      // error shown below
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h3 className="font-medium text-slate-900">New announcement</h3>

        {createAnnouncement.isError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {(createAnnouncement.error as any)?.response?.data?.error || 'Something went wrong.'}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Public Holiday Schedule Change"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Details for residents..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={createAnnouncement.isPending}
          className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50"
        >
          {createAnnouncement.isPending ? 'Publishing...' : 'Publish announcement'}
        </button>
      </form>

      <div>
        <h3 className="font-medium text-slate-900 mb-3">Published announcements</h3>
        {announcements.isLoading && <p className="text-slate-400 text-sm">Loading...</p>}
        {announcements.data?.length === 0 && (
          <p className="text-slate-400 text-sm">No announcements published yet</p>
        )}
        <div className="space-y-3">
          {announcements.data?.map((a) => (
            <AnnouncementCard
              key={a.id}
              announcement={a}
              onDelete={(id) => deleteAnnouncement.mutate(id)}
              isDeleting={deleteAnnouncement.isPending && deleteAnnouncement.variables === a.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}