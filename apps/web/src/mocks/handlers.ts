import { http, HttpResponse, type PathParams } from 'msw';
import { candidates } from './data/candidates';
import { jobs } from './data/jobs';
import type { CandidateFormValues } from '@repo/ui';
import {
  toCandidateId,
  toJobId,
  CANDIDATE_STATUSES,
  type BulkCandidateStatusResult,
  type Candidate,
  type CandidateListResponse,
  type CandidateNote,
  type CandidateStatusHistoryEntry,
  type Application,
  type ApplicantsResponse,
  type ApplicationPayload,
  type ApplicationResponse,
  type JobListResponse,
  type PaginatedResponse,
  type PaginationParams,
  type FindResult,
  type DashboardStats,
} from '@repo/types';

function computeDashboardStats(): DashboardStats {
  const candidateStatusCounts = CANDIDATE_STATUSES.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<Candidate['status'], number>);

  const now = new Date();
  let hiredThisMonth = 0;

  for (const candidate of candidates) {
    candidateStatusCounts[candidate.status] += 1;
    if (candidate.status === 'hired') {
      const appliedDate = new Date(candidate.appliedAt);
      if (
        appliedDate.getFullYear() === now.getFullYear() &&
        appliedDate.getMonth() === now.getMonth()
      ) {
        hiredThisMonth += 1;
      }
    }
  }

  return {
    openCandidates: candidates.length - candidateStatusCounts.hired - candidateStatusCounts.rejected,
    openJobs: jobs.length,
    hiredThisMonth,
    candidateStatusCounts,
  };
}

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

function notFound(message: string) {
  return HttpResponse.json({ message }, { status: 404 });
}

// Mirrors the BE's candidate.controller.ts filtering so MSW (dev:mock + integration
// tests) behaves like the real API. `status` is a single comma-separated value —
// see candidatesApi.ts's fetchCandidates for why (Express 5's default query
// parser doesn't parse bracket/array-style params).
function filterCandidates(items: Candidate[], url: URL): Candidate[] {
  const search = (url.searchParams.get('search') ?? '').trim().toLowerCase();
  const statusFilter = (url.searchParams.get('status') ?? '').split(',').filter(Boolean);

  return items.filter(
    (c) =>
      (!search ||
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.position.toLowerCase().includes(search)) &&
      (statusFilter.length === 0 || statusFilter.includes(c.status)),
  );
}

let nextApplicationId = 1000;
let nextNoteId = 1;
let nextStatusHistoryId = 1;
const candidateNotes: CandidateNote[] = [];
const candidateStatusHistory: CandidateStatusHistoryEntry[] = [];
const jobApplications: Application[] = [];

// Mirrors the BE's candidate.controller.ts recordStatusChange — only a real
// transition is worth a history entry, not a no-op "update" to the same status.
function recordStatusChange(candidate: Candidate, toStatus: Candidate['status']): void {
  if (candidate.status === toStatus) return;
  candidateStatusHistory.push({
    id: nextStatusHistoryId++,
    candidateId: candidate.id,
    fromStatus: candidate.status,
    toStatus,
    changedAt: new Date().toISOString(),
  });
}

export const handlers = [
  http.get('/api/candidates', ({ request }) => {
    const url = new URL(request.url);
    const { page, limit } = getPageParams(url);
    const response: CandidateListResponse = paginate(filterCandidates(candidates, url), page, limit);
    return HttpResponse.json(response);
  }),

  http.get<{ id: string }>('/api/candidates/:id', ({ params }) => {
    const result = findById(candidates, toCandidateId(Number(params.id)));
    if (!result.found) return notFound('Candidate not found');
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
      if (!result.found) return notFound('Candidate not found');

      const { status } = await request.json();
      if (!CANDIDATE_STATUSES.includes(status)) {
        return HttpResponse.json({ message: 'Invalid status' }, { status: 400 });
      }

      recordStatusChange(result.record, status);
      result.record.status = status;
      return HttpResponse.json(result.record);
    },
  ),

  http.patch<PathParams, { ids: number[]; status: Candidate['status'] }>(
    '/api/candidates/bulk-status',
    async ({ request }) => {
      const { ids, status } = await request.json();
      if (!CANDIDATE_STATUSES.includes(status)) {
        return HttpResponse.json({ message: 'Invalid status' }, { status: 400 });
      }

      const byId = new Map(candidates.map((c) => [c.id as number, c]));
      const results: BulkCandidateStatusResult[] = ids.map((id) => {
        const candidate = byId.get(id);
        if (!candidate) return { id: toCandidateId(id), success: false, error: `Candidate with id ${id} not found` };
        recordStatusChange(candidate, status);
        candidate.status = status;
        return { id: toCandidateId(id), success: true, candidate };
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
    if (!result.found) return notFound('Job not found');
    return HttpResponse.json(result.record);
  }),

  http.post<{ jobId: string }, ApplicationPayload>(
    '/api/jobs/:jobId/applications',
    async ({ request, params }) => {
      const jobId = toJobId(Number(params.jobId));
      const job = findById(jobs, jobId);
      if (!job.found) return notFound('Job not found');

      const { name, experience } = await request.json();

      // Mirrors the BE's submitApplication: always create a new Candidate rather
      // than matching by name (the payload carries no stable identity), so a
      // subsequent GET .../applicants reflects this submission in dev:mock too.
      const newCandidate: Candidate = {
        id: toCandidateId(candidates.length ? Math.max(...candidates.map((c) => c.id)) + 1 : 1),
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}+${nextApplicationId}@applicant.example.com`,
        phone: 'Not provided',
        position: job.record.title,
        status: 'applied',
        experience,
        location: job.record.location,
        avatarUrl: `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`,
        appliedAt: new Date().toISOString(),
      };
      candidates.push(newCandidate);

      const application: Application = {
        id: nextApplicationId++,
        jobId,
        candidateId: newCandidate.id,
        status: 'pending',
        appliedAt: new Date().toISOString(),
      };
      jobApplications.push(application);

      const response: ApplicationResponse = {
        id: application.id,
        jobId: application.jobId,
        status: application.status,
        appliedAt: application.appliedAt,
      };
      return HttpResponse.json(response, { status: 201 });
    },
  ),

  http.get<{ id: string }>('/api/jobs/:id/applicants', ({ params }) => {
    const jobId = toJobId(Number(params.id));
    const job = findById(jobs, jobId);
    if (!job.found) return notFound('Job not found');

    const applicantIds = new Set(
      jobApplications.filter((a) => a.jobId === jobId).map((a) => a.candidateId),
    );
    const applicants = candidates.filter((c) => applicantIds.has(c.id));
    const response: ApplicantsResponse = { data: applicants, total: applicants.length };
    return HttpResponse.json(response);
  }),

  http.get<{ id: string }>('/api/candidates/:id/notes', ({ params }) => {
    const candidateId = toCandidateId(Number(params.id));
    if (!findById(candidates, candidateId).found) {
      return notFound('Candidate not found');
    }

    const sorted = candidateNotes
      .filter((n) => n.candidateId === candidateId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return HttpResponse.json(sorted);
  }),

  http.post<{ id: string }, { body: string }>(
    '/api/candidates/:id/notes',
    async ({ request, params }) => {
      const candidateId = toCandidateId(Number(params.id));
      if (!findById(candidates, candidateId).found) {
        return notFound('Candidate not found');
      }

      const { body } = await request.json();
      if (!body || !body.trim()) {
        return HttpResponse.json({ message: 'Missing required field: body' }, { status: 400 });
      }

      const newNote: CandidateNote = {
        id: nextNoteId++,
        candidateId,
        body,
        createdAt: new Date().toISOString(),
      };
      candidateNotes.push(newNote);
      return HttpResponse.json(newNote, { status: 201 });
    },
  ),

  http.get<{ id: string }>('/api/candidates/:id/status-history', ({ params }) => {
    const candidateId = toCandidateId(Number(params.id));
    if (!findById(candidates, candidateId).found) {
      return notFound('Candidate not found');
    }

    const sorted = candidateStatusHistory
      .filter((h) => h.candidateId === candidateId)
      .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
    return HttpResponse.json(sorted);
  }),

  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json(computeDashboardStats());
  }),
];
