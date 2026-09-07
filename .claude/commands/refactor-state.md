---
description: Audit a feature's TanStack Query layer against CLAUDE.md Section 9 and propose a refactor
argument-hint: <feature-name>
---

# Refactor State Management

Target: `$ARGUMENTS`

Server state in this app is managed exclusively by TanStack Query (Section 9) — there is no Redux/RTK Query to consider. This is a read-and-report task — do not edit source files. Only propose changes; apply them only if the user explicitly asks in a follow-up.

## 1. Locate the feature's state layer

Resolve `$ARGUMENTS` to `apps/web/src/features/<feature-name>/` and its paired `apps/web/src/api/<feature-name>Api.ts`. Read the full two-layer chain: fetch functions, query key factory, `useInfiniteQuery`/`useQuery`/`useMutation` hooks, and the domain hook (`useXxxList.ts`) that flattens/derives data for the page.

## 2. Check the query key factory

Per Section 9's three-level pattern (`all` → `lists()`/`detail(id)` → `list()`/exact): does this feature's key factory support invalidating at every useful scope? Are mutations invalidating at the broadest correct scope (`.lists()`, not `.list()`) so future filtered variants are also busted? Flag any manual `setQueryData` used where `invalidateQueries` would be simpler and more consistent with the server.

## 3. Check cross-resource invalidation

If this feature's mutations change state that a *different* query depends on (grep the backend/handler for side effects, not just this feature's own resource), confirm `onSettled`/`onSuccess` invalidates that other query's keys too — not just this resource's own key. Reference the existing `useUpdateCandidateStatusMutation` pattern (invalidates both `candidateKeys.detail(id)` and `candidateStatusHistoryKeys.list(id)`) as the calibration example.

## 4. Check layer boundaries

- Layer 1 (`api/`) — pure async functions, `apiClient` calls, `.data` destructured, no TanStack Query imports.
- Layer 2 (`*Queries.ts`) — query key factory + hooks only, no rendering/derived-state logic.
- Domain hook (`useXxxList.ts`) — `flatMap`/derived state, consumed by the page.
- Flag anything doing the wrong layer's job (e.g. derived-state logic inside `*Queries.ts`, or a component reaching past the domain hook straight into `*Queries.ts`).

## 5. Report findings and propose a refactor (do not apply yet)

List each issue found (file:line) and a concrete proposed fix respecting the layering above. Prefer the smallest change that fixes the actual problem — don't restructure a feature that already follows the pattern correctly just to be thorough.

## 6. Summary

State what was checked, what (if anything) was found, and the proposed refactor — not yet applied.
