import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { queryClient } from '@repo/api-client';
import {
  candidatesInfiniteQueryOptions,
  candidateDetailQueryOptions,
} from '../features/candidates/candidateQueries';
import {
  jobsInfiniteQueryOptions,
  jobDetailQueryOptions,
} from '../features/jobs/jobQueries';
import { dashboardStatsQueryOptions } from '../features/dashboard/dashboardQueries';
import {
  CandidateListPage,
  CandidateDetailPage,
  JobListPage,
  JobDetailPage,
  ApplicationPage,
  DashboardPage,
} from './lazyPages';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <CandidateListPage />,
        loader: () => {
          queryClient.prefetchInfiniteQuery(candidatesInfiniteQueryOptions);
          return null;
        },
      },
      {
        path: '/candidates/:id',
        element: <CandidateDetailPage />,
        loader: ({ params }) => {
          if (params.id) queryClient.prefetchQuery(candidateDetailQueryOptions(params.id));
          return null;
        },
      },
      {
        path: '/jobs',
        element: <JobListPage />,
        loader: () => {
          queryClient.prefetchInfiniteQuery(jobsInfiniteQueryOptions);
          return null;
        },
      },
      {
        path: '/jobs/:jobId',
        element: <JobDetailPage />,
        loader: ({ params }) => {
          if (params.jobId) queryClient.prefetchQuery(jobDetailQueryOptions(params.jobId));
          return null;
        },
      },
      {
        path: '/jobs/:jobId/apply/:step',
        element: <ApplicationPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
        loader: () => {
          queryClient.prefetchQuery(dashboardStatsQueryOptions);
          return null;
        },
      },
    ],
  },
]);
