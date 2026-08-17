import prisma from '../config/prisma';
export class NotificationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'NotificationError';
    this.statusCode = statusCode;
  }
}
export async function createNotification(userId: string, title: string, message: string) {
  return prisma.notification.create({
    data: { userId, title, message },
  });
}
export async function createNotificationForAllResidents(title: string, message: string) {
  const residents = await prisma.user.findMany({
    where: { role: 'RESIDENT' },
    select: { id: true },
  });
  if (residents.length === 0) return;
  await prisma.notification.createMany({
    data: residents.map((r) => ({ userId: r.id, title, message })),
  });
}
export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}
export async function markNotificationRead(id: string, userId: string) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== userId) {
    throw new NotificationError('Notification not found', 404);
  }
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}
export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}