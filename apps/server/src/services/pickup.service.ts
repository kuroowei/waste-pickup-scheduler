import prisma from '../config/prisma';

export class PickupError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'PickupError';
    this.statusCode = statusCode;
  }
}

interface CreatePickupInput {
  userId: string;
  wasteTypeId: string;
  pickupDate: string;
  pickupTime: string;
  address: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export async function createPickup(input: CreatePickupInput) {
  const wasteType = await prisma.wasteType.findUnique({ where: { id: input.wasteTypeId } });
  if (!wasteType) {
    throw new PickupError('Selected waste type does not exist', 404);
  }

  const dateOnly = new Date(input.pickupDate);
  dateOnly.setHours(0, 0, 0, 0);
  const nextDay = new Date(dateOnly);
  nextDay.setDate(nextDay.getDate() + 1);

  const existing = await prisma.pickupRequest.findFirst({
    where: {
      userId: input.userId,
      pickupDate: { gte: dateOnly, lt: nextDay },
      status: { notIn: ['CANCELLED'] },
    },
  });

  if (existing) {
    throw new PickupError('You already have a pickup scheduled for this date', 409);
  }

  return prisma.pickupRequest.create({
    data: {
      userId: input.userId,
      wasteTypeId: input.wasteTypeId,
      pickupDate: dateOnly,
      pickupTime: input.pickupTime,
      address: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      notes: input.notes,
    },
    include: { wasteType: true },
  });
}

interface UpdatePickupInput {
  pickupDate?: string;
  pickupTime?: string;
  address?: string;
  wasteTypeId?: string;
  notes?: string;
}

export async function updatePickup(pickupId: string, userId: string, input: UpdatePickupInput) {
  const pickup = await prisma.pickupRequest.findUnique({ where: { id: pickupId } });
  if (!pickup) {
    throw new PickupError('Pickup request not found', 404);
  }
  if (pickup.userId !== userId) {
    throw new PickupError('You do not have permission to modify this pickup', 403);
  }
  if (pickup.status === 'COMPLETED' || pickup.status === 'CANCELLED') {
    throw new PickupError(`Cannot modify a pickup that is already ${pickup.status.toLowerCase()}`, 400);
  }

  return prisma.pickupRequest.update({
    where: { id: pickupId },
    data: {
      ...(input.pickupDate && { pickupDate: new Date(input.pickupDate) }),
      ...(input.pickupTime && { pickupTime: input.pickupTime }),
      ...(input.address && { address: input.address }),
      ...(input.wasteTypeId && { wasteTypeId: input.wasteTypeId }),
      ...(input.notes !== undefined && { notes: input.notes }),
    },
    include: { wasteType: true },
  });
}

export async function deletePickup(pickupId: string, userId: string) {
  const pickup = await prisma.pickupRequest.findUnique({ where: { id: pickupId } });
  if (!pickup) {
    throw new PickupError('Pickup request not found', 404);
  }
  if (pickup.userId !== userId) {
    throw new PickupError('You do not have permission to cancel this pickup', 403);
  }

  return prisma.pickupRequest.update({
    where: { id: pickupId },
    data: { status: 'CANCELLED' },
  });
}

export async function getPickupHistory(userId: string) {
  return prisma.pickupRequest.findMany({
    where: {
      userId,
      OR: [{ status: 'COMPLETED' }, { status: 'CANCELLED' }],
    },
    include: { wasteType: true },
    orderBy: { pickupDate: 'desc' },
  });
}

export async function getUpcomingPickups(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return prisma.pickupRequest.findMany({
    where: {
      userId,
      pickupDate: { gte: today },
      status: { notIn: ['COMPLETED', 'CANCELLED'] },
    },
    include: { wasteType: true },
    orderBy: { pickupDate: 'asc' },
  });
}