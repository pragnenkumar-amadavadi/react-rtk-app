---
description: Write or extend the co-located RTL/Jest unit test file for a component
argument-hint: <component-name-or-path>
---

# Write Tests

Target: `$ARGUMENTS`

This writes/extends the component's own `.test.tsx` file per `CLAUDE.md` Section 7 — no other files are touched.

## 1. Locate the component

Resolve `$ARGUMENTS` under `packages/ui/src/{atoms,molecules,organisms,templates}` or `apps/web/src/components/pages`. If more than one match exists, ask which before continuing. Read `.types.ts` (the `Props` shape), `.component.tsx` (conditional branches: loading/error/empty states, callbacks, lists), and any existing `.test.tsx` (extend it, don't duplicate what's already covered).

## 2. Identify which package's Jest setup applies

`packages/ui` and `apps/web` each have independent Jest configs and their own `src/tests/utils.tsx`. Use the one belonging to whichever package the component lives in — get the relative import depth right for `renderWithTheme`.

## 3. Write the test file

Follow Section 7 exactly:

- Import the component from `./ComponentName.component` (not the barrel).
- Always use `renderWithTheme`, never bare `render`.
- **Never call `render`/`renderWithTheme` inside `beforeEach`** — call it as the first line of each `it`, even if that repeats the call across tests.
- Cover, from what step 1 found: rendered text/labels/counts, user interactions (`userEvent.click`/`.type`), conditional rendering (loading/error/empty states if present), callback invocations (`toHaveBeenCalledTimes`/`toHaveBeenCalledWith`).
- Do not assert on class names, `styled()` internals, or MUI DOM structure.
- If the component needs `react-virtuoso` mocked, use the eager-render module mock from Section 7. If it (or a page it's part of) uses a feature hook (`useCandidateList`, etc.), mock it with a **factory** `jest.mock()` — never auto-mock, since that reaches `@repo/api-client`'s `import.meta.env` and crashes Babel.

## 4. Run and fix

Run the test file scoped to this package (e.g. `pnpm --filter <ui|web> exec jest <ComponentName>`). Fix any failures before reporting done.

## 5. Summary

State the test file path, what scenarios it covers, and the pass/fail result of the run.
