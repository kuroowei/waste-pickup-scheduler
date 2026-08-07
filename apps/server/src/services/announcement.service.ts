import prisma from '../config/prisma';

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
  return prisma.announcement.create({
    data: {
      title: input.title,
      message: input.message,
    },
  });
}

export async function getAllAnnouncements() {
  return prisma.announcement.findMany({
    orderBy: { publishedDate: 'desc' },
  });
}

export async function deleteAnnouncement(id: string) {
  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) {
    throw new AnnouncementError('Announcement not found', 404);
  }
  return prisma.announcement.delete({ where: { id } });
}