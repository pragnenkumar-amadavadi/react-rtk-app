---
description: Add an MSW handler (and matching fixture data) for a resource to apps/web's mock API
argument-hint: <resource-name>
---

# Add Mock Handler

Target: `$ARGUMENTS`

This edits `apps/web/src/mocks/handlers.ts` and, if needed, `apps/web/src/mocks/data/*.ts` (Section 11). Ask user for the real endpoint's actual contract first — this command keeps the mock in sync with a real endpoint, it isn't a substitute for one existing.

## 1. Confirm the real endpoint's shape

Ask the user for to get the exact request/response shape, path params, and status codes, rather than guessing.

## 2. Add or extend fixture data

If `apps/web/src/mocks/data/<resource>.ts` doesn't exist, generate a fixture array (not hand-written one-by-one). If it cycles multiple name/word pools by index, give the pools **coprime lengths** so combinations don't silently repeat within a page (Section 11's known pitfall).

## 3. Add the handler

Add to `apps/web/src/mocks/handlers.ts` using MSW v2 `http`/`HttpResponse`, typed with explicit generics — never `as`-cast `request.json()`:
```ts
http.get<{ id: string }>('/api/<resource>/:id', ({ params }) => {
  const result = findById(data, Number(params.id)) // FindResult<T> discriminated union
  if (!result.found) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
  return HttpResponse.json(result.record)
})
```
Use the existing `findById` helper (discriminated `FindResult<T>`) for lookups rather than `array.find()` + undefined-check.

## 4. Verify

Run the app with `pnpm --filter web run dev:mock` and hit the new endpoint through the UI or a quick manual request, confirming the shape matches what `apps/web/src/api/<resource>Api.ts` expects. If integration tests exist for this resource, run them too — they share this same `handlers.ts` via `msw/node`.

## 5. Summary

State the handler(s) added, the fixture file touched (if any), and how it was verified.
