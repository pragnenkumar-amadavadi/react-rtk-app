import { lazy } from 'react';

// Imported from each page's own component barrel (not the top barrel) so every
// lazy() call gets its own chunk instead of pulling in the whole component tree.
export const CandidateListPage = lazy(() => import('../components/pages/CandidateListPage'));
export const CandidateDetailPage = lazy(() => import('../components/pages/CandidateDetailPage'));
export const JobListPage = lazy(() => import('../components/pages/JobListPage'));
export const JobDetailPage = lazy(() => import('../components/pages/JobDetailPage'));
export const ApplicationPage = lazy(() => import('../components/pages/ApplicationPage'));
