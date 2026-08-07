import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminStats, getAllUsers, getAllPickups, updatePickupStatus } from '../api/admin';
import type { PickupStatus } from '../types';
import { getAllFeedback } from '../api/admin';

export function useAdminStats() {
  return useQuery({ queryKey: ['admin', 'stats'], queryFn: getAdminStats });
}

export function useAdminUsers() {
  return useQuery({ queryKey: ['admin', 'users'], queryFn: getAllUsers });
}

export function useAdminPickups(status?: PickupStatus) {
  return useQuery({
    queryKey: ['admin', 'pickups', status ?? 'all'],
    queryFn: () => getAllPickups(status),
  });
}

export function useUpdatePickupStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PickupStatus }) => updatePickupStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] });
    },
  });
}
export function useAdminFeedback() {
  return useQuery({ queryKey: ['admin', 'feedback'], queryFn: getAllFeedback });
}