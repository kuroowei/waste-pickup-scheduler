import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { createFeedback, getMyFeedback, FeedbackError } from '../services/feedback.service';

export async function create(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const { pickupId, rating, comments } = req.body;

    if (!pickupId || rating === undefined) {
      return res.status(400).json({ error: 'Pickup ID and rating are required' });
    }

    const feedback = await createFeedback({ userId, pickupId, rating, comments });
    return res.status(201).json({ feedback });
  } catch (err) {
    if (err instanceof FeedbackError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function list(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const feedback = await getMyFeedback(userId);
    return res.status(200).json({ feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}