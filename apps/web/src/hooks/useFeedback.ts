import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFeedback, getMyFeedback } from '../api/feedback';
import type { CreateFeedbackInput } from '../api/feedback';

export function useMyFeedback() {
  return useQuery({ queryKey: ['feedback', 'mine'], queryFn: getMyFeedback });
}

export function useCreateFeedback() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFeedbackInput) => createFeedback(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}