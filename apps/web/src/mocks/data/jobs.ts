import { toJobId, type Job } from '@repo/types';

const TITLES = ['Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'Product Designer', 'QA Engineer', 'DevOps Engineer', 'Data Analyst', 'Engineering Manager'];
const COMPANIES = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Inc', 'Stark Industries', 'Wayne Enterprises'];
const LOCATIONS = ['New York, NY', 'Austin, TX', 'Remote', 'San Francisco, CA', 'Seattle, WA', 'Chicago, IL'];
const TYPES: Job['type'][] = ['full-time', 'part-time', 'contract', 'remote'];
const REQUIREMENTS_POOL = ['React', 'TypeScript', 'Node.js', 'SQL', 'AWS', 'CI/CD', 'GraphQL', 'Testing'];

const TOTAL = 42;
const BASE_DATE = new Date('2026-01-01T00:00:00.000Z').getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

export const jobs: Job[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: toJobId(i + 1),
  title: TITLES[i % TITLES.length],
  company: COMPANIES[i % COMPANIES.length],
  location: LOCATIONS[i % LOCATIONS.length],
  type: TYPES[i % TYPES.length],
  salary: `$${90 + (i % 60)}k - $${120 + (i % 60)}k`,
  description: `We are looking for a ${TITLES[i % TITLES.length]} to join ${COMPANIES[i % COMPANIES.length]}.`,
  requirements: [
    REQUIREMENTS_POOL[i % REQUIREMENTS_POOL.length],
    REQUIREMENTS_POOL[(i + 1) % REQUIREMENTS_POOL.length],
    REQUIREMENTS_POOL[(i + 2) % REQUIREMENTS_POOL.length],
  ],
  postedAt: new Date(BASE_DATE - i * DAY_MS).toISOString(),
}));
