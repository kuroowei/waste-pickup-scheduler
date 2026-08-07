import { apiClient } from './client';

export interface Feedback {
  id: string;
  pickupId: string;
  rating: number;
  comments?: string;
  createdAt: string;
}

export interface CreateFeedbackInput {
  pickupId: string;
  rating: number;
  comments?: string;
}

export async function createFeedback(input: CreateFeedbackInput): Promise<Feedback> {
  const { data } = await apiClient.post('/feedback/create', input);
  return data.feedback;
}

export async function getMyFeedback(): Promise<Feedback[]> {
  const { data } = await apiClient.get('/feedback/list');
  return data.feedback;
}