import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPickup,
  getUpcomingPickups,
  getPickupHistory,
  cancelPickup,
} from '../api/pickup';
import type { CreatePickupInput } from '../api/pickup';
import { getWasteTypes } from '../api/wasteType';

export function useUpcomingPickups() {
  return useQuery({ queryKey: ['pickups', 'upcoming'], queryFn: getUpcomingPickups });
}

export function usePickupHistory() {
  return useQuery({ queryKey: ['pickups', 'history'], queryFn: getPickupHistory });
}

export function useWasteTypes() {
  return useQuery({ queryKey: ['wasteTypes'], queryFn: getWasteTypes });
}

export function useCreatePickup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePickupInput) => createPickup(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickups', 'upcoming'] });
    },
  });
}

export function useCancelPickup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelPickup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickups'] });
    },
  });
}