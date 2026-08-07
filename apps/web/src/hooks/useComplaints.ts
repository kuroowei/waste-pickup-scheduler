import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} from '../api/complaint';
import type { CreateComplaintInput, ComplaintStatus } from '../api/complaint';

export function useMyComplaints() {
  return useQuery({ queryKey: ['complaints', 'mine'], queryFn: getMyComplaints });
}

export function useAllComplaints() {
  return useQuery({ queryKey: ['complaints', 'admin'], queryFn: getAllComplaints });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateComplaintInput) => createComplaint(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ComplaintStatus }) => updateComplaintStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
  });
}