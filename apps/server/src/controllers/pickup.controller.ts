import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  createPickup,
  updatePickup,
  deletePickup,
  getPickupHistory,
  getUpcomingPickups,
  PickupError,
} from '../services/pickup.service';

export async function create(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const { wasteTypeId, pickupDate, pickupTime, address, latitude, longitude, notes } = req.body;

    if (!wasteTypeId || !pickupDate || !pickupTime || !address) {
      return res.status(400).json({ error: 'Waste type, pickup date, pickup time, and address are required' });
    }

    const pickup = await createPickup({ userId, wasteTypeId, pickupDate, pickupTime, address, latitude, longitude, notes });
    return res.status(201).json({ pickup });
  } catch (err) {
    if (err instanceof PickupError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function update(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params as { id: string };
    const pickup = await updatePickup(id, userId, req.body);
    return res.status(200).json({ pickup });
  } catch (err) {
    if (err instanceof PickupError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const { id } = req.params as { id: string };
    await deletePickup(id, userId);
    return res.status(200).json({ message: 'Pickup cancelled successfully' });
  } catch (err) {
    if (err instanceof PickupError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function history(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const pickups = await getPickupHistory(userId);
    return res.status(200).json({ pickups });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function upcoming(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const pickups = await getUpcomingPickups(userId);
    return res.status(200).json({ pickups });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}