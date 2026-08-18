import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  getDriverPickups,
  getDriverHistory,
  updateDriverPickupStatus,
  DriverError,
} from '../services/driver.service';
export async function listMyPickups(req: AuthenticatedRequest, res: Response) {
  try {
    const pickups = await getDriverPickups(req.user!.userId);
    return res.status(200).json({ pickups });
  } catch (err) {
    if (err instanceof DriverError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
export async function listMyHistory(req: AuthenticatedRequest, res: Response) {
  try {
    const pickups = await getDriverHistory(req.user!.userId);
    return res.status(200).json({ pickups });
  } catch (err) {
    if (err instanceof DriverError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
export async function updateMyPickupStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    const { status, feedback } = req.body;
    if (!status || !['IN_PROGRESS', 'COMPLETED', 'SKIPPED'].includes(status)) {
      return res.status(400).json({ error: 'A valid status is required' });
    }
    const pickup = await updateDriverPickupStatus(req.user!.userId, id, status, feedback);
    return res.status(200).json({ pickup });
  } catch (err) {
    if (err instanceof DriverError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}