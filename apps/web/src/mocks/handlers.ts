import { http, HttpResponse, type PathParams } from 'msw';
import { candidates } from './data/candidates';
import { jobs } from './data/jobs';
import type { CandidateFormValues } from '@repo/ui';
import {
  toCandidateId,
  toJobId,
  type BulkCandidateStatusResult,
  type Candidate,
  type CandidateListResponse,
  type ApplicationPayload,
  type ApplicationResponse,
  type JobListResponse,
  type PaginatedResponse,
  type PaginationParams,
  type FindResult,
} from '@repo/types';

const VALID_STATUSES: Candidate['status'][] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

function paginate<T>(items: T[], page: number, limit: number): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total: items.length,
    page,
    limit,
    hasMore: page * limit < items.length,
  };
}

function getPageParams(url: URL): PaginationParams {
  return {
    page: Number(url.searchParams.get('page') ?? 1),
    limit: Number(url.searchParams.get('limit') ?? 20),
  };
}

function findById<T extends { id: unknown }>(items: T[], id: T['id']): FindResult<T> {
  const record = items.find((item) => item.id === id);
  return record ? { found: true, record } : { found: false };
}

// Mirrors the BE's candidate.controller.ts filtering so MSW (dev:mock + integration
// tests) behaves like the real API. `status[]` matches axios's default bracket-array
// param serialization for a `status: Candidate['status'][]` query param.
function filterCandidates(items: Candidate[], url: URL): Candidate[] {
  const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
  const statusFilter = url.searchParams.getAll('status[]');

  let filtered = items;
  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.position.toLowerCase().includes(search),
    );
  }
  if (statusFilter.length > 0) {
    filtered = filtered.filter((c) => statusFilter.includes(c.status));
  }
  return filtered;
}

let nextApplicationId = 1000;

export const handlers = [
  http.get('/api/candidates', ({ request }) => {
    const url = new URL(request.url);
    const { page, limit } = getPageParams(url);
    const response: CandidateListResponse = paginate(filterCandidates(candidates, url), page, limit);
    return HttpResponse.json(response);
  }),

  http.get<{ id: string }>('/api/candidates/:id', ({ params }) => {
    const result = findById(candidates, toCandidateId(Number(params.id)));
    if (!result.found) return HttpResponse.json({ message: 'Candidate not found' }, { status: 404 });
    return HttpResponse.json(result.record);
  }),

  http.post<PathParams, CandidateFormValues, Candidate>('/api/candidates', async ({ request }) => {
    const body = await request.json();
    const newCandidate: Candidate = {
      id: toCandidateId(candidates.length ? Math.max(...candidates.map((c) => c.id)) + 1 : 1),
      ...body,
      avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(body.email)}`,
      appliedAt: new Date().toISOString(),
    };
    candidates.unshift(newCandidate);
    return HttpResponse.json(newCandidate, { status: 201 });
  }),

  http.patch<{ id: string }, { status: Candidate['status'] }>(
    '/api/candidates/:id/status',
    async ({ request, params }) => {
      const result = findById(candidates, toCandidateId(Number(params.id)));
      if (!result.found) return HttpResponse.json({ message: 'Candidate not found' }, { status: 404 });

      const { status } = await request.json();
      if (!VALID_STATUSES.includes(status)) {
        return HttpResponse.json({ message: 'Invalid status' }, { status: 400 });
      }

      result.record.status = status;
      return HttpResponse.json(result.record);
    },
  ),

  http.patch<PathParams, { ids: number[]; status: Candidate['status'] }>(
    '/api/candidates/bulk-status',
    async ({ request }) => {
      const { ids, status } = await request.json();
      if (!VALID_STATUSES.includes(status)) {
        return HttpResponse.json({ message: 'Invalid status' }, { status: 400 });
      }

      const results: BulkCandidateStatusResult[] = ids.map((id) => {
        const result = findById(candidates, toCandidateId(id));
        if (!result.found) return { id: toCandidateId(id), success: false, error: `Candidate with id ${id} not found` };
        result.record.status = status;
        return { id: toCandidateId(id), success: true, candidate: result.record };
      });

      return HttpResponse.json({ results });
    },
  ),

  http.get('/api/jobs', ({ request }) => {
    const { page, limit } = getPageParams(new URL(request.url));
    const response: JobListResponse = paginate(jobs, page, limit);
    return HttpResponse.json(response);
  }),

  http.get<{ id: string }>('/api/jobs/:id', ({ params }) => {
    const result = findById(jobs, toJobId(Number(params.id)));
    if (!result.found) return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    return HttpResponse.json(result.record);
  }),

  http.post<{ jobId: string }, ApplicationPayload, ApplicationResponse>(
    '/api/jobs/:jobId/applications',
    async ({ request, params }) => {
      await request.json();
      const response: ApplicationResponse = {
        id: nextApplicationId++,
        jobId: toJobId(Number(params.jobId)),
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };
      return HttpResponse.json(response, { status: 201 });
    },
  ),
];
