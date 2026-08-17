import prisma from '../config/prisma';
import { PickupStatus } from '../generated/prisma/enums';
import { createNotification } from './notification.service';
export class AdminError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AdminError';
    this.statusCode = statusCode;
  }
}
export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      address: true,
      createdAt: true,
      _count: { select: { pickups: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
interface PickupFilters {
  status?: PickupStatus;
}
export async function getAllPickups(filters: PickupFilters) {
  return prisma.pickupRequest.findMany({
    where: filters.status ? { status: filters.status } : undefined,
    include: {
      wasteType: true,
      user: { select: { id: true, fullName: true, email: true, phone: true } },
    },
    orderBy: { pickupDate: 'desc' },
  });
}
export async function updatePickupStatus(pickupId: string, status: PickupStatus) {
  const pickup = await prisma.pickupRequest.findUnique({ where: { id: pickupId } });
  if (!pickup) {
    throw new AdminError('Pickup request not found', 404);
  }
  const updated = await prisma.pickupRequest.update({
    where: { id: pickupId },
    data: { status },
    include: {
      wasteType: true,
      user: { select: { id: true, fullName: true, email: true, phone: true } },
    },
  });
  const statusMessages: Record<string, string> = {
    COMPLETED: `Your ${updated.wasteType.name} pickup has been completed.`,
    CANCELLED: `Your ${updated.wasteType.name} pickup was cancelled.`,
    IN_PROGRESS: `Your ${updated.wasteType.name} pickup is on its way.`,
    SCHEDULED: `Your ${updated.wasteType.name} pickup has been scheduled.`,
    SKIPPED: `Your ${updated.wasteType.name} pickup was skipped.`,
  };
  if (statusMessages[status]) {
    await createNotification(updated.userId, 'Pickup Update', statusMessages[status]);
  }
  return updated;
}
export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [totalUsers, todaysPickups, completed, pending, cancelled] = await Promise.all([
    prisma.user.count({ where: { role: 'RESIDENT' } }),
    prisma.pickupRequest.count({
      where: { pickupDate: { gte: today, lt: tomorrow } },
    }),
    prisma.pickupRequest.count({ where: { status: 'COMPLETED' } }),
    prisma.pickupRequest.count({ where: { status: 'PENDING' } }),
    prisma.pickupRequest.count({ where: { status: 'CANCELLED' } }),
  ]);
  return { totalUsers, todaysPickups, completed, pending, cancelled };
}
export async function getAllFeedback() {
  return prisma.feedback.findMany({
    include: {
      user: { select: { id: true, fullName: true, email: true, phone: true } },
      pickup: { include: { wasteType: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}