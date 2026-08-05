import { Request, Response } from 'express';
import prisma from '../config/prisma';

export async function list(_req: Request, res: Response) {
  try {
    const wasteTypes = await prisma.wasteType.findMany({ orderBy: { name: 'asc' } });
    return res.status(200).json({ wasteTypes });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}