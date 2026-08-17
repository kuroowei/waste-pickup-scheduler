import { Bell } from 'lucide-react';
import type { Notification } from '../api/notification';
interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  isMarking?: boolean;
}
export function NotificationCard({ notification, onMarkRead, isMarking }: NotificationCardProps) {
  const formattedDate = new Date(notification.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <div
      className={`rounded-xl border p-4 ${
        notification.isRead ? 'border-slate-200 bg-white' : 'border-emerald-100 bg-emerald-50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Bell size={18} className={notification.isRead ? 'text-slate-400 mt-0.5 shrink-0' : 'text-emerald-600 mt-0.5 shrink-0'} />
          <div>
            <h3 className="font-medium text-slate-900">{notification.title}</h3>
            <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
            <p className="text-xs text-slate-400 mt-2">{formattedDate}</p>
          </div>
        </div>
        {!notification.isRead && onMarkRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            disabled={isMarking}
            className="text-xs text-emerald-700 font-medium hover:underline shrink-0"
          >
            Mark read
          </button>
        )}
      </div>
    </div>
  );
}