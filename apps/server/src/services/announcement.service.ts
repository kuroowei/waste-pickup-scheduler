import prisma from '../config/prisma';
import { createNotificationForAllResidents } from './notification.service';
export class AnnouncementError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AnnouncementError';
    this.statusCode = statusCode;
  }
}
interface CreateAnnouncementInput {
  title: string;
  message: string;
}
export async function createAnnouncement(input: CreateAnnouncementInput) {
  const announcement = await prisma.announcement.create({
    data: {
      title: input.title,
      message: input.message,
    },
  });
  await createNotificationForAllResidents(input.title, input.message);
  return announcement;
}
export async function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { publishedDate: 'desc' },
  });
}
export async function deleteAnnouncement(id: string) {
  const announcement = await prisma.announcement.findUnique({ where: { id }});
  if (!announcement) {
    throw new AnnouncementError('Announcement not found', 404);
  }
  return prisma.announcement.delete({ where: { id } });
}