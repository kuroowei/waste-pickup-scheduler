import prisma from '../config/prisma';

export class ComplaintError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'ComplaintError';
    this.statusCode = statusCode;
  }
}

interface CreateComplaintInput {
  userId: string;
  pickupId?: string;
  subject: string;
  message: string;
}

export async function createComplaint(input: CreateComplaintInput) {
  if (input.pickupId) {
    const pickup = await prisma.pickupRequest.findUnique({ where: { id: input.pickupId } });
    if (!pickup) {
      throw new ComplaintError('Referenced pickup request not found', 404);
    }
    if (pickup.userId !== input.userId) {
      throw new ComplaintError('You can only file a complaint about your own pickups', 403);
    }
  }

  return prisma.complaint.create({
    data: {
      userId: input.userId,
      pickupId: input.pickupId,
      subject: input.subject,
      message: input.message,
    },
  });
}

export async function getMyComplaints(userId: string) {
  return prisma.complaint.findMany({
    where: { userId },
    include: { pickup: { include: { wasteType: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllComplaints() {
  return prisma.complaint.findMany({
    include: {
      pickup: { include: { wasteType: true } },
      user: { select: { id: true, fullName: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateComplaintStatus(complaintId: string, status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED') {
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) {
    throw new ComplaintError('Complaint not found', 404);
  }

  return prisma.complaint.update({
    where: { id: complaintId },
    data: { status },
  });
}