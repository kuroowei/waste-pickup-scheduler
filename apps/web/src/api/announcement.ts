import { apiClient } from './client';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  publishedDate: string;
}

export interface CreateAnnouncementInput {
  title: string;
  message: string;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await apiClient.get('/announcements/list');
  return data.announcements;
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
  const { data } = await apiClient.post('/announcements/create', input);
  return data.announcement;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await apiClient.delete(`/announcements/${id}`);
}