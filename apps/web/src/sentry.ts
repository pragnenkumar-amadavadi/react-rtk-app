import * as Sentry from '@sentry/react';

// Isolated for the same reason as @repo/api-client's config.ts: import.meta.env
// is Vite-only syntax Babel can't parse, so this file must never be reachable
// from a Jest-transformed module chain. Only main.tsx imports it.
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) return;
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}
