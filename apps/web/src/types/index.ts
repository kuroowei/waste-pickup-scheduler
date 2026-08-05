export type Role = 'RESIDENT' | 'ADMIN';

export type PickupStatus =
  | 'PENDING'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'SKIPPED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  address?: string;
  createdAt: string;
}

export interface WasteType {
  id: string;
  name: string;
  description?: string;
}

export interface PickupRequest {
  id: string;
  userId: string;
  wasteTypeId: string;
  wasteType: WasteType;
  pickupDate: string;
  pickupTime: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: PickupStatus;
  notes?: string;
  createdAt: string;
}