import type { Brand } from './brand';
import type { PaginatedResponse, PaginationParams } from './pagination';

export type JobId = Brand<number, 'JobId'>;

export function toJobId(id: number): JobId {
  return id as JobId;
}

export interface Job {
  id: JobId;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
}

export type JobListResponse = PaginatedResponse<Job>;

export type JobListParams = PaginationParams;

export interface ApplicationPayload {
  name: string;
  experience: number;
  expectedSalary: number;
}

export interface ApplicationResponse {
  id: number;
  jobId: JobId;
  status: 'pending';
  appliedAt: string;
}
