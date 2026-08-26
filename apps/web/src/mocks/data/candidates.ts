import { toCandidateId, type Candidate } from '@repo/types';

const FIRST_NAMES = ['Ava', 'Liam', 'Noah', 'Emma', 'Olivia', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas'];
const LAST_NAMES = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson', 'Anderson'];
const POSITIONS = ['Frontend Engineer', 'Backend Engineer', 'Product Designer', 'QA Engineer', 'DevOps Engineer', 'Data Analyst'];
const LOCATIONS = ['New York, NY', 'Austin, TX', 'Remote', 'San Francisco, CA', 'Seattle, WA', 'Chicago, IL'];
const STATUSES: Candidate['status'][] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];

const TOTAL = 45;
const BASE_DATE = new Date('2026-01-01T00:00:00.000Z').getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

export const candidates: Candidate[] = Array.from({ length: TOTAL }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[i % LAST_NAMES.length];
  return {
    id: toCandidateId(i + 1),
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`,
    phone: `555-01${String(i).padStart(2, '0')}`,
    position: POSITIONS[i % POSITIONS.length],
    status: STATUSES[i % STATUSES.length],
    experience: i % 15,
    location: LOCATIONS[i % LOCATIONS.length],
    avatarUrl: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    appliedAt: new Date(BASE_DATE - i * DAY_MS).toISOString(),
  };
});
