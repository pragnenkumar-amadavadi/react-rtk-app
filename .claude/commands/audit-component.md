---
description: Audit a component for prop drilling, suggest improvements/refactors, and generate its unit tests
argument-hint: <component-name-or-path>
---

# Component Audit

Target: `$ARGUMENTS`

You are auditing one component in this pnpm+Turborepo workspace (see `CLAUDE.md` for the full architecture — Atomic Design split between `@repo/ui` and `apps/web`, the `pages/` data-boundary, styling and testing conventions). Work through the steps below **in order**. This is a read-and-report task for steps 1–3 — do not edit source files. Step 4 (tests) is the one step where you write a file.

## 1. Locate the component

Resolve `$ARGUMENTS` to a component folder. It may be a bare name (`CandidateCard`), a partial path, or a full path. Search under `packages/ui/src/{atoms,molecules,organisms,templates}` and `apps/web/src/components/pages`. If more than one match exists, ask which one before continuing. Read all of its files: `.types.ts`, `.styled.tsx`, `.component.tsx`, `index.ts`, and any existing `.test.tsx`/`.stories.tsx`.

## 2. Trace prop drilling

Find every place this component is rendered (grep for its import/usage), and walk the chain **up to where each prop is actually consumed**, not just one level:

- For each prop the component receives: does the immediate parent use the value itself, or just forward it untouched to this component (or further down)? A prop forwarded through ≥2 layers without being read at the intermediate layer is drilling.
- For each prop the component *passes down* to children: same check in the other direction — is it read here, or just relayed?
- Note the specific chain (`PageX → TemplateY → OrganismZ → this component`, prop `foo`) and how many hops it survives unread.
- Distinguish real drilling from legitimate pass-through that's idiomatic here — e.g. templates receiving "all data as props" (Section 5) and passing pieces to organisms is expected; flag it only when the same prop crosses 3+ component boundaries unread, or when a callback/id is threaded through purely to satisfy a leaf far below.

## 3. Report findings and suggest a refactor (do not apply yet)

Produce a concise report with:

- **Prop drilling** — each chain found in step 2, with file:line for each hop.
- **Improvements** — anything else notable while you're in this code: missing `styled()` wrapping of raw MUI elements, hardcoded colors instead of `theme.palette`/CSS vars, `sx` used beyond icon-sizing, wrong Atomic Design tier for what the component actually does, barrel-import violations (Section 5's import-direction rules), missing/incorrect branded ID usage (Section 12) if ids cross a boundary here.
- **Suggested refactor** — a concrete proposal to fix the drilling and any structural issues found, respecting:
  - the `types ← styled ← component` import direction,
  - the `@repo/ui` / `apps/web` boundary (presentational tiers never import `features/**`; only `pages/` does),
  - the barrel-export tiers (component barrel for internal imports, package barrel for app-side imports).
  Prefer the smallest fix that removes the drilling — composition (pass the already-rendered child as a prop/children instead of raw data), collocating state closer to where it's used, or a custom hook — over introducing global state unless the drilling genuinely spans unrelated subtrees.

Stop here and let the user confirm before applying any refactor — only proceed to apply it if they explicitly ask.

## 4. Generate test cases

Whether or not a refactor is applied, write/extend the co-located `ComponentName.test.tsx` per `CLAUDE.md` Section 7:

- Use `renderWithTheme` from the package's own `src/tests/utils.tsx` (never bare `render`), imported at the correct relative depth.
- Import the component from `./ComponentName.component` (not the barrel).
- Cover: rendered text/labels/counts, user interactions (`userEvent`), conditional rendering (loading/error/empty states if present), callback invocations (`toHaveBeenCalledTimes`/`toHaveBeenCalledWith`).
- Do not assert on class names or styled-component internals.
- Never call `render`/`renderWithTheme` inside `beforeEach` — call it as the first line of each `it`.
- If the component needs `react-virtuoso` or a TanStack Query hook mocked, follow the exact mocking patterns in Section 7 (eager-render mock / factory-based `jest.mock`, respectively).
- After writing the file, run the package's test command scoped to this file (e.g. `pnpm --filter <ui|web> exec jest <ComponentName>`) and fix any failures before reporting done.

## 5. Summary

End with a short summary: what drilling/issues were found, what refactor you're proposing (not yet applied), and the test file path + pass/fail status of the tests you just wrote.
