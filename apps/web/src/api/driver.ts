import { apiClient } from './client';
import type { PickupRequest } from '../types';
export async function getDriverPickups(): Promise<PickupRequest[]> {
  const { data } = await apiClient.get('/driver/pickups');
  return data.pickups;
}
export async function getDriverHistory(): Promise<PickupRequest[]> {
  const { data } = await apiClient.get('/driver/history');
  return data.pickups;
}
export async function updateDriverPickupStatus(
  id: string,
  status: 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED',
  feedback?: string
): Promise<PickupRequest> {
  const { data } = await apiClient.patch(`/driver/pickups/${id}/status`, { status, feedback });
  return data.pickup;
}