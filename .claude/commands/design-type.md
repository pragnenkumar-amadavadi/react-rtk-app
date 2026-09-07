---
description: Design a new domain type in @repo/types, applying branding/discriminated-union rules only where warranted
argument-hint: <domain-name>
---

# Design Type

Target: `$ARGUMENTS`

This edits/creates files in `packages/types/src/` (Section 12) — the single source of truth for shared types, used by both `apps/web` and `packages/ui`. This is a propose-then-confirm task for anything beyond a clearly net-new file: show the shape before writing if it's non-obvious.

## 1. Check for existing shared shapes first

Before writing anything new, check `packages/types/src/pagination.ts`/`result.ts`/`brand.ts` for a generic that already fits (e.g. `PaginatedResponse<T>` for any list-with-pagination shape). Extract shared shapes aggressively — but never merge two domain models that don't actually share fields just to "reuse" (Section 12's `Candidate`/`Job` example: zero shared fields, correctly separate).

## 2. Define the domain file

Create/extend `packages/types/src/<domain-name>.ts`. If it's a paginated list response, alias the generic rather than hand-writing the envelope: `export type <Domain>ListResponse = PaginatedResponse<<Domain>>`.

## 3. Decide on ID branding

Brand an id only where a real cross-domain mixup is possible (an id passed across a hover-prefetch/detail-lookup boundary, or otherwise handed between functions expecting different domains). Use the `Brand<T, TBrand>` pattern from `brand.ts` and export a constructor (`to<Domain>Id(id: number): <Domain>Id`) rather than letting call sites `as`-cast. Don't brand an id that's never compared against another id type (e.g. an id only ever read, never passed anywhere else).

## 4. Decide on discriminated unions for lookups

If this type will be looked up by id (in a mock handler or elsewhere), consider `FindResult<T>` over a bare `T | undefined` — pairs with the generic `findById<T extends { id: unknown }>` helper, which makes passing the wrong id type a compile error via the `id: T['id']` constraint.

## 5. Verify

Typecheck `packages/types` and anything already importing from it. Confirm no local re-declaration of this shape exists elsewhere in `apps/web`/`packages/ui` that should now import from here instead — grep for it and flag (don't silently delete) any found.

## 6. Summary

State the type(s) added, whether ids were branded (and why/why not), and any existing duplicate shape found elsewhere that should migrate to this one.
