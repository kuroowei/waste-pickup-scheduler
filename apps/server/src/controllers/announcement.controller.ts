import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
  AnnouncementError,
} from '../services/announcement.service';

export async function create(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const announcement = await createAnnouncement({ title, message });
    return res.status(201).json({ announcement });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function list(_req: AuthenticatedRequest, res: Response) {
  try {
    const announcements = await getAllAnnouncements();
    return res.status(200).json({ announcements });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params as { id: string };
    await deleteAnnouncement(id);
    return res.status(200).json({ message: 'Announcement deleted' });
  } catch (err) {
    if (err instanceof AnnouncementError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}