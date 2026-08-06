import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
  ComplaintError,
} from '../services/complaint.service';

export async function create(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const { pickupId, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'Subject and message are required' });
    }

    const complaint = await createComplaint({ userId, pickupId, subject, message });
    return res.status(201).json({ complaint });
  } catch (err) {
    if (err instanceof ComplaintError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function list(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const complaints = await getMyComplaints(userId);
    return res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function adminList(_req: AuthenticatedRequest, res: Response) {
  try {
    const complaints = await getAllComplaints();
    return res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function adminUpdateStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const complaint = await updateComplaintStatus(id, status);
    return res.status(200).json({ complaint });
  } catch (err) {
    if (err instanceof ComplaintError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}