import { apiClient } from './client';
import type { WasteType } from '../types';

export async function getWasteTypes(): Promise<WasteType[]> {
  const { data } = await apiClient.get('/waste-types');
  return data.wasteTypes;
}