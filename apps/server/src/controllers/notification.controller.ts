import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  NotificationError,
} from '../services/notification.service';
export async function listNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const notifications = await getUserNotifications(req.user!.userId);
    return res.status(200).json({ notifications });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
export async function markRead(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const notification = await markNotificationRead(id, req.user!.userId);
    return res.status(200).json({ notification });
  } catch (err) {
    if (err instanceof NotificationError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
export async function markAllRead(req: AuthenticatedRequest, res: Response) {
  try {
    await markAllNotificationsRead(req.user!.userId);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}