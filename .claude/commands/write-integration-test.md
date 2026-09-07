---
description: Write a *.integration.test.tsx exercising the real API-client/query/hook chain against MSW, for a hook or page in apps/web
argument-hint: <hook-or-page-name>
---

# Write Integration Test

Target: `$ARGUMENTS`

This is an `apps/web`-only command — integration testing (real hooks + MSW at the network boundary) is exclusively a `pages/`-tier concern per `CLAUDE.md` Section 7. If `$ARGUMENTS` resolves to something in `packages/ui`, stop and say this doesn't apply there.

## 1. Locate the target

Resolve `$ARGUMENTS` to a feature hook (`apps/web/src/features/*/useXxx.ts`) or a page component (`apps/web/src/components/pages/**`). Read the full chain it depends on: the hook, its `*Queries.ts` (query keys, `useInfiniteQuery`/`useMutation`), the `api/*.ts` fetch function, and the relevant `src/mocks/handlers.ts` entries.

## 2. Check the required Jest infrastructure exists

Before writing the test, confirm `apps/web/jest.config.cjs` already has (do not touch these unless something is actually missing — flag it instead of silently fixing config):
- `moduleNameMapper` pinning `msw`/`msw/node` to their CJS builds.
- `transformIgnorePatterns` allowlisting `\.pnpm`, `rettime`, `until-async`, `@open-draft`, plus a `transform` entry for `.mjs`.
- `src/tests/setup.ts` polyfilling `fetch`/`Request`/`Response`/`Headers`/`FormData`/`ReadableStream`/`TransformStream`/`WritableStream`/`BroadcastChannel`.

If any is missing, report it and stop rather than writing a test that will fail for infra reasons.

## 3. Write the test file

Name it `ComponentOrHookName.integration.test.tsx`, co-located next to the existing hook-mocked `*.test.tsx`. Per Section 7:

- `jest.mock('@repo/api-client/config', () => ({ API_BASE_URL: '/api' }))` — stub **only** this, nothing else in the chain.
- `setupServer(...handlers)` from the shared `src/mocks/handlers.ts`, with `beforeAll(() => server.listen(...))` / `afterEach(() => server.resetHandlers())` / `afterAll(() => server.close())` local to the file.
- Still mock `react-virtuoso` the eager-render way if the component under test renders one.
- Assert on real rendered output driven by MSW responses, not on mocked hook return values.

## 4. Run and fix

Run the new test file (`pnpm --filter web exec jest ComponentOrHookName.integration`). Fix failures before reporting done.

## 5. Summary

State the test file path, which handlers it exercises, and the pass/fail result.
