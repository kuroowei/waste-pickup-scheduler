import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDriverPickups, getDriverHistory, updateDriverPickupStatus } from '../api/driver';
export function useDriverPickups() {
  return useQuery({ queryKey: ['driver-pickups'], queryFn: getDriverPickups });
}
export function useDriverHistory() {
  return useQuery({ queryKey: ['driver-history'], queryFn: getDriverHistory });
}
export function useUpdateDriverPickupStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, feedback }: { id: string; status: 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'; feedback?: string }) =>
      updateDriverPickupStatus(id, status, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-pickups'] });
      queryClient.invalidateQueries({ queryKey: ['driver-history'] });
    },
  });
}