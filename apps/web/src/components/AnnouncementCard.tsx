import { Megaphone, Trash2 } from 'lucide-react';
import type { Announcement } from '../api/announcement';

interface AnnouncementCardProps {
  announcement: Announcement;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function AnnouncementCard({ announcement, onDelete, isDeleting }: AnnouncementCardProps) {
  const formattedDate = new Date(announcement.publishedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Megaphone size={18} className="text-blue-600 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-medium text-slate-900">{announcement.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{announcement.message}</p>
            <p className="text-xs text-slate-400 mt-2">{formattedDate}</p>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(announcement.id)}
            disabled={isDeleting}
            className="text-slate-400 hover:text-red-600 transition shrink-0"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}