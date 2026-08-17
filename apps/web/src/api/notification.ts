import { apiClient } from './client';
export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
export async function getNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get('/notifications');
  return data.notifications;
}
export async function markNotificationRead(id: string): Promise<Notification> {
  const { data } = await apiClient.patch(`/notifications/${id}/read`);
  return data.notification;
}
export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}