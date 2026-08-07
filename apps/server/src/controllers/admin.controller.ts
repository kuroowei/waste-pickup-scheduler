import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  getAllUsers,
  getAllPickups,
  updatePickupStatus,
  getDashboardStats,
  getAllFeedback,
  AdminError,
} from '../services/admin.service';

export async function listUsers(_req: AuthenticatedRequest, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function listPickups(req: AuthenticatedRequest, res: Response) {
  try {
    const status = req.query.status as string | undefined;
    const pickups = await getAllPickups({ status: status as any });
    return res.status(200).json({ pickups });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function updateStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const pickup = await updatePickupStatus(id, status);
    return res.status(200).json({ pickup });
  } catch (err) {
    if (err instanceof AdminError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function dashboard(_req: AuthenticatedRequest, res: Response) {
  try {
    const stats = await getDashboardStats();
    return res.status(200).json({ stats });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function listFeedback(_req: AuthenticatedRequest, res: Response) {
  try {
    const feedback = await getAllFeedback();
    return res.status(200).json({ feedback });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}