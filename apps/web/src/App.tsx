import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import CssBaseline from '@mui/material/CssBaseline';
import { CssVarsProvider } from '@mui/material/styles';
import { AppNav, ErrorFallback } from '@repo/ui';
import { usePrefetchCandidates } from './features/candidates/candidateQueries';
import { usePrefetchJobs } from './features/jobs/jobQueries';
import theme from '@repo/ui/theme';

const PerformanceDashboard = import.meta.env.DEV
  ? lazy(() => import('./components/dev/PerformanceDashboard'))
  : null;

export default function App() {
  const prefetchCandidates = usePrefetchCandidates();
  const prefetchJobs = usePrefetchJobs();

  return (
    <CssVarsProvider theme={theme} defaultColorScheme="light">
      <CssBaseline />
      <AppNav onCandidatesHover={prefetchCandidates} onJobsHover={prefetchJobs} />
      <Sentry.ErrorBoundary
        fallback={({ error, resetError }) => (
          <ErrorFallback
            error={error instanceof Error ? error : new Error(String(error))}
            onRetry={resetError}
          />
        )}
      >
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </Sentry.ErrorBoundary>
      {PerformanceDashboard && (
        <Suspense fallback={null}>
          <PerformanceDashboard />
        </Suspense>
      )}
    </CssVarsProvider>
  );
}
