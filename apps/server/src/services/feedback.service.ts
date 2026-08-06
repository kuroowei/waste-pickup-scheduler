import prisma from '../config/prisma';

export class FeedbackError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'FeedbackError';
    this.statusCode = statusCode;
  }
}

interface CreateFeedbackInput {
  userId: string;
  pickupId: string;
  rating: number;
  comments?: string;
}

export async function createFeedback(input: CreateFeedbackInput) {
  const pickup = await prisma.pickupRequest.findUnique({ where: { id: input.pickupId } });

  if (!pickup) {
    throw new FeedbackError('Pickup request not found', 404);
  }
  if (pickup.userId !== input.userId) {
    throw new FeedbackError('You can only rate your own pickups', 403);
  }
  if (pickup.status !== 'COMPLETED') {
    throw new FeedbackError('You can only rate a pickup after it has been completed', 400);
  }
  if (input.rating < 1 || input.rating > 5) {
    throw new FeedbackError('Rating must be between 1 and 5', 400);
  }

  const existing = await prisma.feedback.findUnique({ where: { pickupId: input.pickupId } });
  if (existing) {
    throw new FeedbackError('You have already rated this pickup', 409);
  }

  return prisma.feedback.create({
    data: {
      userId: input.userId,
      pickupId: input.pickupId,
      rating: input.rating,
      comments: input.comments,
    },
  });
}

export async function getMyFeedback(userId: string) {
  return prisma.feedback.findMany({
    where: { userId },
    include: { pickup: { include: { wasteType: true } } },
    orderBy: { createdAt: 'desc' },
  });
}