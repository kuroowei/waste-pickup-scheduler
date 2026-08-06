import { apiClient } from './client';
import type { PickupRequest } from '../types';

export interface CreatePickupInput {
  wasteTypeId: string;
  pickupDate: string;
  pickupTime: string;
  address: string;
  notes?: string;
}

export async function createPickup(input: CreatePickupInput): Promise<PickupRequest> {
  const { data } = await apiClient.post('/pickup/create', input);
  return data.pickup;
}

export async function getUpcomingPickups(): Promise<PickupRequest[]> {
  const { data } = await apiClient.get('/pickup/upcoming');
  return data.pickups;
}

export async function getPickupHistory(): Promise<PickupRequest[]> {
  const { data } = await apiClient.get('/pickup/history');
  return data.pickups;
}

export async function cancelPickup(id: string): Promise<void> {
  await apiClient.delete(`/pickup/delete/${id}`);
}

export async function updatePickup(id: string, input: Partial<CreatePickupInput>): Promise<PickupRequest> {
  const { data } = await apiClient.put(`/pickup/update/${id}`, input);
  return data.pickup;
}