import type { Minutes } from '../lib/time';

export type Role = 'manager' | 'patron' | 'inspector';

export type Scenario = 'default' | 'empty' | 'at-risk' | 'rework' | 'payment-error' | 'ready';

export type JobStatus = 'scheduled' | 'cleaning' | 'inspection' | 'rework' | 'ready';

/** How the job is doing against the guest check-in */
export type Health = 'ok' | 'risk' | 'late';

export type ServiceId =
  | 'turnover'
  | 'refresh'
  | 'midstay-linen'
  | 'midstay'
  | 'linen-only'
  | 'owner';

export interface Property {
  id: string;
  street: string;
  unit: string;
  bedrooms: number; // 0 = studio
  area: number;
  zip: string;
  photo: string;
  access: string;
}

export interface Service {
  id: ServiceId;
  name: string;
  summary: string;
  includes: string[];
  /** Price for a 2-bedroom; scaled by size */
  basePrice2br: number;
  /** Minutes for a 2-bedroom; scaled by size */
  duration2br: number;
  /** Whether it has a room-by-room clean (linen delivery doesn't) */
  hasRooms: boolean;
}

export interface Extras {
  linen: number;
  towels: number;
  kit: number;
}

export type InspectionMark = 'pass' | 'redo';

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
  mark?: InspectionMark;
  redoNote?: string;
  redoPhoto?: string;
  /** Item was sent back and the cleaner has fixed it since */
  fixed?: boolean;
}

export interface Room {
  id: string;
  name: string;
  items: ChecklistItem[];
  photo?: string;
}

export interface MissingItem {
  id: string;
  type: string;
  quantity: number;
  photo?: string;
  at: Minutes;
}

export interface Job {
  id: string;
  propertyId: string;
  serviceId: ServiceId;
  checkout: Minutes;
  checkin: Minutes;
  /** Planned start of cleaning */
  start: Minutes;
  durationMin: number;
  extras: Extras;
  note: string;
  status: JobStatus;
  rooms: Room[];
  patronId: string;
  inspectorId: string;
  price: number;
  missing: MissingItem[];
  rating?: number;
  comment?: string;
  /** When the cleaner last submitted for inspection */
  finishedAt?: Minutes;
  /** Number of times the inspector sent it back */
  reworkCount: number;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
}
