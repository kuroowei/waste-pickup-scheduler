import prisma from '../config/prisma';
import { createNotification } from './notification.service';
export class DriverError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'DriverError';
    this.statusCode = statusCode;
  }
}
export async function getDriverPickups(driverUserId: string) {
  const truck = await prisma.truck.findUnique({ where: { driverId: driverUserId } });
  if (!truck) {
    throw new DriverError('No truck assigned to this account', 404);
  }
  return prisma.pickupRequest.findMany({
    where: { truckId: truck.id, status: { in: ['SCHEDULED', 'IN_PROGRESS'] } },
    include: {
      wasteType: true,
      user: { select: { id: true, fullName: true, phone: true, address: true } },
    },
    orderBy: { pickupDate: 'asc' },
  });
}
export async function getDriverHistory(driverUserId: string) {
  const truck = await prisma.truck.findUnique({ where: { driverId: driverUserId } });
  if (!truck) {
    throw new DriverError('No truck assigned to this account', 404);
  }
  return prisma.pickupRequest.findMany({
    where: { truckId: truck.id, status: { in: ['COMPLETED', 'CANCELLED', 'SKIPPED'] } },
    include: {
      wasteType: true,
      user: { select: { id: true, fullName: true, phone: true, address: true } },
    },
    orderBy: { pickupDate: 'desc' },
  });
}
export async function updateDriverPickupStatus(
  driverUserId: string,
  pickupId: string,
  status: 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED',
  feedback?: string
) {
  const truck = await prisma.truck.findUnique({ where: { driverId: driverUserId } });
  if (!truck) {
    throw new DriverError('No truck assigned to this account', 404);
  }
  const pickup = await prisma.pickupRequest.findUnique({ where: { id: pickupId } });
  if (!pickup || pickup.truckId !== truck.id) {
    throw new DriverError('Pickup not found or not assigned to you', 404);
  }
  const updated = await prisma.pickupRequest.update({
    where: { id: pickupId },
    data: {
      status,
      notes: feedback ? `${pickup.notes ? pickup.notes + ' | ' : ''}Driver: ${feedback}` : pickup.notes,
    },
    include: { wasteType: true, user: { select: { fullName: true } } },
  });
  if (status === 'COMPLETED' || status === 'SKIPPED') {
    await prisma.truck.update({ where: { id: truck.id }, data: { status: 'AVAILABLE' } });
  }
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
  const statusLabel = status === 'COMPLETED' ? 'completed' : status === 'SKIPPED' ? 'skipped' : 'started';
  for (const admin of admins) {
    await createNotification(
      admin.id,
      'Driver Update',
      `${updated.user.fullName}'s ${updated.wasteType.name} pickup was ${statusLabel} by ${truck.name}.${feedback ? ` Note: ${feedback}` : ''}`
    );
  }
  return updated;
}