---
description: Scaffold the two-layer TanStack Query architecture (api/ fetch function + query key factory + hook) for a resource
argument-hint: <resource-name>
---

# Add Query Hook

Target: `$ARGUMENTS`

This creates new files following the two-layer architecture in `CLAUDE.md` Section 9. If a query layer for this resource already exists, stop and say so rather than overwriting it — use `/refactor-state` instead.

## 1. Confirm the domain type exists

Check `packages/types/src/` for a type matching this resource (e.g. `<Resource>`, `<Resource>ListResponse`, `<Resource>ListParams`). If it doesn't exist yet, stop and suggest running `/design-type` first — don't invent an ad-hoc type inline.

## 2. Create the fetch function (Layer 1)

`apps/web/src/api/<resource>Api.ts` — a plain async function, no React/TanStack imports:
```ts
import { apiClient } from '@repo/api-client'

export async function fetch<Resource>List(params: <Resource>ListParams): Promise<<Resource>ListResponse> {
  const { data } = await apiClient.get<<Resource>ListResponse>('/<resource>', { params })
  return data
}
```
Always destructure `.data` — never auto-unwrap in a transformer.

## 3. Create the query key factory + hooks (Layer 2)

`apps/web/src/features/<resource>/<resource>Queries.ts` — the three-level key factory plus the query/mutation hooks:
```ts
export const <resource>Keys = {
  all:   ['<resource>'] as const,
  lists: () => [...<resource>Keys.all, 'list'] as const,
  list:  () => [...<resource>Keys.lists()] as const,
}
```
If this is a paginated list, use `infiniteQueryOptions()` (see the `candidatesInfiniteQueryOptions` pattern) so the config is shareable across `useInfiniteQuery`, `prefetchInfiniteQuery`, and route loaders. If it's a single-record lookup, use `queryOptions()` the same way `candidateDetailQueryOptions` does. For any mutation, invalidate at `.lists()` in `onSuccess`/`onSettled` — and check whether this mutation has side effects on a *different* resource's data that also needs invalidating (Section 9's cross-resource invalidation rule).

## 4. Create the domain hook

`apps/web/src/features/<resource>/use<Resource>List.ts` (or equivalent) — flattens `data?.pages.flatMap((p) => p.data) ?? []` and exposes whatever derived shape the page component needs. No JSX here.

## 5. Verify

Typecheck the new files. If a mock backend is used in dev, confirm `apps/web/src/mocks/handlers.ts` has a matching handler — if not, mention `/add-mock-handler` as the next step, don't add it here.

## 6. Summary

List the files created and confirm typecheck passed. Note any follow-up commands (`/add-mock-handler`, `/add-route`) still needed to make this resource usable end-to-end.
