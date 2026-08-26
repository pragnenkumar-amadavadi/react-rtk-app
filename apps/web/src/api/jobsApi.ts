import { apiClient } from '@repo/api-client';
import type { Job, JobListResponse, JobListParams, ApplicationPayload, ApplicationResponse } from '@repo/types';

export async function fetchJobs(params: JobListParams): Promise<JobListResponse> {
  const { data } = await apiClient.get<JobListResponse>('/jobs', { params });
  return data;
}

export async function fetchJobById(id: string): Promise<Job> {
  const { data } = await apiClient.get<Job>(`/jobs/${id}`);
  return data;
}

export async function submitApplication(
  jobId: string,
  payload: ApplicationPayload,
): Promise<ApplicationResponse> {
  const { data } = await apiClient.post<ApplicationResponse>(`/jobs/${jobId}/applications`, payload);
  return data;
}
