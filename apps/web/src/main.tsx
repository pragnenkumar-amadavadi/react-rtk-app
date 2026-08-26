import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { queryClient, USE_MOCKS } from '@repo/api-client';
import { router } from './router';
import { initSentry } from './sentry';

initSentry();

async function enableMocking() {
  if (!USE_MOCKS) return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

// Real-user (field) Core Web Vitals, logged locally — complements the lab
// metrics Lighthouse CI measures against a single simulated load.
async function reportWebVitals() {
  if (!import.meta.env.DEV) return;
  const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
  onCLS(console.log);
  onFCP(console.log);
  onLCP(console.log);
  onTTFB(console.log);
  onINP(console.log);
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

reportWebVitals();

enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
