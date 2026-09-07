---
description: Add a route to apps/web's router with a loader that prefetches its query
argument-hint: <path>
---

# Add Route

Target: `$ARGUMENTS`

This edits `apps/web/src/router/index.tsx` (Section 10). Confirm the page component and its query options already exist before wiring the route — if not, say so and suggest the component/query-hook commands needed first rather than half-wiring a broken route.

## 1. Confirm prerequisites

Resolve the target page component (`apps/web/src/components/pages/**`) and the `queryOptions`/`infiniteQueryOptions` object its loader will prefetch (from the matching `*Queries.ts`). If either is missing, stop and name what's missing.

## 2. Add the route

Add a child route entry under the existing route tree in `apps/web/src/router/index.tsx`:
```tsx
{
  path: '<path>',
  element: <TargetPage />,
  loader: (/* { params } if the path has one */) => {
    queryClient.prefetchQuery(targetQueryOptions(/* params.id if applicable */))
    return null
  },
},
```
Use `prefetchInfiniteQuery` instead of `prefetchQuery` if the target uses `infiniteQueryOptions`. **Do not `await` the prefetch** — it must be fire-and-forget so navigation doesn't stall. Import `queryClient` from `@repo/api-client`, not a local instance.

## 3. Wire hover-prefetch if applicable

If this route is reachable from a nav link (`AppNav`) or a list card (`CardLink`), check whether the corresponding `usePrefetchXxx()` hook already exists (Section 10). If not and the user wants hover-prefetch too, mention it as a follow-up — don't add it unasked if the route is reached by direct navigation only (e.g. a settings page with no nav entry).

## 4. Verify

Typecheck, then confirm the route resolves by starting the dev server (or running existing route/component tests) and navigating to `<path>`.

## 5. Summary

State the route added, what it prefetches, and whether hover-prefetch wiring is still needed.
