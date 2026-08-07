import { apiClient } from './client';
import type { PickupRequest, PickupStatus } from '../types';
import type { Feedback } from './feedback';

export interface AdminStats {
  totalUsers: number;
  todaysPickups: number;
  completed: number;
  pending: number;
  cancelled: number;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'RESIDENT' | 'ADMIN';
  address?: string;
  createdAt: string;
  _count: { pickups: number };
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get('/admin/dashboard');
  return data.stats;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data } = await apiClient.get('/admin/users');
  return data.users;
}

export async function getAllPickups(status?: PickupStatus): Promise<PickupRequest[]> {
  const { data } = await apiClient.get('/admin/pickups', { params: status ? { status } : {} });
  return data.pickups;
}

export async function updatePickupStatus(id: string, status: PickupStatus): Promise<PickupRequest> {
  const { data } = await apiClient.put(`/admin/pickups/${id}/status`, { status });
  return data.pickup;
}

export interface AdminFeedback extends Feedback {
  user: { id: string; fullName: string; email: string; phone?: string };
  pickup: { wasteType: { name: string } };
}

export async function getAllFeedback(): Promise<AdminFeedback[]> {
  const { data } = await apiClient.get('/admin/feedback');
  return data.feedback;
}