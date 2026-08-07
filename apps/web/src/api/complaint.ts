import { apiClient } from './client';

export type ComplaintStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

export interface Complaint {
  id: string;
  subject: string;
  message: string;
  status: ComplaintStatus;
  pickupId?: string;
  createdAt: string;
  user?: { id: string; fullName: string; email: string; phone?: string };
}

export interface CreateComplaintInput {
  subject: string;
  message: string;
  pickupId?: string;
}

export async function createComplaint(input: CreateComplaintInput): Promise<Complaint> {
  const { data } = await apiClient.post('/complaints/create', input);
  return data.complaint;
}

export async function getMyComplaints(): Promise<Complaint[]> {
  const { data } = await apiClient.get('/complaints/list');
  return data.complaints;
}

export async function getAllComplaints(): Promise<Complaint[]> {
  const { data } = await apiClient.get('/complaints/admin/list');
  return data.complaints;
}

export async function updateComplaintStatus(id: string, status: ComplaintStatus): Promise<Complaint> {
  const { data } = await apiClient.put(`/complaints/admin/${id}/status`, { status });
  return data.complaint;
}