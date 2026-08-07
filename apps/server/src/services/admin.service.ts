import prisma from '../config/prisma';
import { PickupStatus } from '../generated/prisma/enums';

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

  return prisma.pickupRequest.update({
    where: { id: pickupId },
    data: { status },
    include: {
      wasteType: true,
      user: { select: { id: true, fullName: true, email: true, phone: true } },
    },
  });
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