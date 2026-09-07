# Prompt Template Library

A catalog of 15 reusable, project-tailored prompt templates for the frontend work that comes up repeatedly in this pnpm+Turborepo workspace (`apps/web` + `@repo/ui` + friends — see `CLAUDE.md` for the full architecture).

Most templates are promoted to one-click Claude Code slash commands (`.claude/commands/*.md` — see `.claude/commands/README.md` for that index). A few are copy-paste prompt text only, for tasks uncommon enough that a dedicated command isn't worth maintaining. Every template cross-references the `CLAUDE.md` section its conventions come from — read that section for the *why* behind a rule; this doc only tells you *what* to ask for.

`{{double-braced}}` placeholders mean "fill this in" when using the prompt-text form. If a command exists, prefer typing the slash command — it already knows the placeholder values from the rest of your instruction.

## Summary

| # | Template | Command | Section |
|---|---|---|---|
| 1 | [Generate Component](#1-generate-component) | `/generate-component` | §5 |
| 2 | [Create Storybook Story](#2-create-storybook-story) | `/generate-story` | §5, §11 |
| 3 | [Write RTL Unit Tests](#3-write-rtl-unit-tests) | `/write-tests` | §7 |
| 4 | [Write Integration Test](#4-write-integration-test) | `/write-integration-test` | §7 |
| 5 | [Audit Accessibility](#5-audit-accessibility) | `/audit-accessibility` | §5, §6, §13 |
| 6 | [Optimize Bundle](#6-optimize-bundle) | `/optimize-bundle` | §10 |
| 7 | [Refactor State Management](#7-refactor-state-management) | `/refactor-state` | §9 |
| 8 | [Audit Component (prop drilling)](#8-audit-component-prop-drilling) | `/audit-component` | §5 |
| 9 | [Perf Check (re-renders)](#9-perf-check-re-renders) | `/perf-check` | §6 |
| 10 | [Add TanStack Query Hook](#10-add-tanstack-query-hook) | `/add-query-hook` | §9 |
| 11 | [Add Route](#11-add-route) | `/add-route` | §10 |
| 12 | [Add MSW Mock Handler](#12-add-msw-mock-handler) | `/add-mock-handler` | §11 |
| 13 | [Design Domain Type](#13-design-domain-type) | `/design-type` | §12 |
| 14 | [Lint & Type-Compliance Audit](#14-lint--type-compliance-audit) | `/lint-audit` | §13 |
| 15 | [Verify Feature](#15-verify-feature) | skill `verify-feature` | cross-repo |

---

### 1. Generate Component

**Purpose:** Scaffold a new Atomic Design component with the full four-file layout and barrel wiring.
**Command:** `/generate-component {{ComponentName}} {{atom|molecule|organism|template}}`
**Prompt template:**
> Create a new {{tier}} called `{{ComponentName}}` in `@repo/ui` that {{one-line description of what it does}}. Follow the standard four-file layout (`.types.ts`/`.styled.tsx`/`.component.tsx`/`index.ts`) and wire it into the tier's level barrel.

**Notes:** If the tier is ambiguous given the description, expect to be asked to confirm before anything is created (CLAUDE.md §5's "When to ask" rule). Never places anything in `apps/web/src/components/pages/` — that tier needs a data hook, which this template doesn't create.

### 2. Create Storybook Story

**Purpose:** Generate `ComponentName.stories.tsx` covering every visually distinct state the component can render.
**Command:** `/generate-story {{ComponentName}}`
**Prompt template:**
> Generate a Storybook story file for `{{ComponentName}}`, covering its default state plus every conditional branch (status/variant values, loading/error/empty) it actually has.

**Notes:** Storybook lives exclusively in `packages/ui` — will refuse for anything in `apps/web/src/components/pages`.

### 3. Write RTL Unit Tests

**Purpose:** Write or extend a component's co-located Jest + React Testing Library test file.
**Command:** `/write-tests {{ComponentName}}`
**Prompt template:**
> Write unit tests for `{{ComponentName}}` covering {{key behaviors: rendered text, interactions, conditional states, callbacks}}, using `renderWithTheme` and this project's mocking conventions.

**Notes:** Always uses `renderWithTheme`, never `render` inside `beforeEach`. Feature hooks are mocked via a factory `jest.mock()`, never auto-mocked (auto-mock reaches `import.meta.env` and crashes Babel).

### 4. Write Integration Test

**Purpose:** Exercise the real `api-client → api/ → *Queries.ts → hook → component` chain against MSW instead of a mocked hook.
**Command:** `/write-integration-test {{hookOrPageName}}`
**Prompt template:**
> Write a `*.integration.test.tsx` for `{{hookOrPageName}}` that runs the real query/hook chain against MSW (`msw/node`), stubbing only `@repo/api-client/config`.

**Notes:** `apps/web`-only — integration testing is exclusively a `pages/`-tier concern. Stops rather than proceeding if the required Jest MSW polyfills/config aren't already present.

### 5. Audit Accessibility

**Purpose:** Check a component for semantic HTML, ARIA, keyboard navigation, and color-contrast issues.
**Command:** `/audit-accessibility {{ComponentName}}`
**Prompt template:**
> Audit `{{ComponentName}}` for accessibility issues — semantics/ARIA, keyboard navigation, and contrast against the theme tokens it uses. Report only, don't fix yet.

**Notes:** Read-only by default. Distinguishes issues `eslint-plugin-jsx-a11y` would already catch (§13) from ones only a manual read finds (contrast, keyboard-only flows).

### 6. Optimize Bundle

**Purpose:** Find large chunks, missing route-level code splitting, and inefficient dependency imports.
**Command:** `/optimize-bundle [{{path}}]`
**Prompt template:**
> Analyze the `apps/web` production bundle{{, focused on path}} and report opportunities for code-splitting, lazy route loading, or trimming dependency size.

**Notes:** Read-only. Weighs any lazy-loading proposal against the existing loader-based prefetch pattern (§10) — the two aren't in conflict, a lazy route's `loader` can still fire independently of the chunk load.

### 7. Refactor State Management

**Purpose:** Audit a feature's TanStack Query layer for key-factory scope, cross-resource invalidation, and layer-boundary violations.
**Command:** `/refactor-state {{feature-name}}`
**Prompt template:**
> Audit the `{{feature-name}}` feature's TanStack Query layer against CLAUDE.md §9 — key factory scope, cross-resource invalidation, and `api/`/`*Queries.ts`/domain-hook layering. Propose a refactor, don't apply it yet.

**Notes:** Read-only. Checks specifically whether a mutation's `onSettled` invalidates *other* resources' keys too, not just its own (the `useUpdateCandidateStatusMutation` → `candidateStatusHistoryKeys` pattern is the calibration example).

### 8. Audit Component (prop drilling)

**Purpose:** Trace prop drilling across a component's real render tree and flag other structural issues.
**Command:** `/audit-component {{ComponentName}}`
**Notes:** Also writes/extends the component's test file as its final step. See `.claude/commands/README.md` for full behavior — this is an existing command, not new.

### 9. Perf Check (re-renders)

**Purpose:** Find unnecessary re-renders and give calibrated `memo`/`useMemo`/`useCallback` recommendations (or explicitly say none are needed).
**Command:** `/perf-check {{ComponentName}}`
**Notes:** Existing command — see `.claude/commands/README.md`.

### 10. Add TanStack Query Hook

**Purpose:** Scaffold the two-layer query architecture (fetch function, query key factory, hooks, domain hook) for a new resource.
**Command:** `/add-query-hook {{resource-name}}`
**Prompt template:**
> Add TanStack Query support for `{{resource-name}}` — a fetch function in `api/`, a query key factory + hooks in `features/{{resource-name}}/`, following the `candidateQueries.ts` pattern exactly.

**Notes:** Expects the domain type to already exist in `@repo/types` (use Template 13 first if not).

### 11. Add Route

**Purpose:** Add a route with a prefetching loader, per the React Router v7 + TanStack Query prefetch pattern.
**Command:** `/add-route {{path}}`
**Prompt template:**
> Add a route at `{{path}}` rendering `{{PageComponent}}`, with a loader that fire-and-forget prefetches its query.

**Notes:** Requires the page component and its query options to already exist — will name what's missing rather than half-wiring a broken route.

### 12. Add MSW Mock Handler

**Purpose:** Add a mock API handler and fixture data so a resource works under `pnpm --filter web run dev:mock` and in integration tests.
**Command:** `/add-mock-handler {{resource-name}}`
**Prompt template:**
> Add an MSW handler for `{{resource-name}}` to `apps/web/src/mocks/handlers.ts`, matching the real `claude-learn-mocks` endpoint contract, with generated fixture data.

**Notes:** Checks the sibling `claude-learn-mocks` repo for the real contract first — the mock isn't a substitute for that endpoint existing.

### 13. Design Domain Type

**Purpose:** Design a new shared type in `@repo/types`, applying ID branding and discriminated-union lookups only where they earn their keep.
**Command:** `/design-type {{domain-name}}`
**Prompt template:**
> Design the `{{domain-name}}` domain type in `@repo/types` — reuse `PaginatedResponse<T>`/`FindResult<T>` where they fit, and brand its id only if it crosses a real cross-domain boundary.

**Notes:** Extracts shared shapes aggressively (e.g. pagination envelopes) but never merges genuinely distinct domain models "for reuse."

### 14. Lint & Type-Compliance Audit

**Purpose:** Run lint/typecheck on a path and explain each failure by the specific rule/config that fired, not just the raw message.
**Command:** `/lint-audit {{path}}`
**Prompt template:**
> Run lint and typecheck on `{{path}}` and explain each failure by the exact `@repo/eslint-config` rule or tsconfig setting behind it, with a fix — never "just disable the rule."

**Notes:** Read-only. Flags failures that look inconsistent with a rule's stated scope (e.g. a `testing-library` rule firing outside `*.test.tsx`) as a possible file-location issue rather than a real violation.

### 15. Verify Feature

**Purpose:** Acceptance-check a completed feature against its spec across both repos (this FE repo and the sibling `claude-learn-mocks` BE repo) — screen behavior, endpoint contract, and FE data flow — then run lint/typecheck/tests and smoke-test end-to-end.
**Command:** skill `verify-feature` (auto-invoked, or ask for it by name)
**Notes:** Existing skill, read-only — never edits code. Use after a `feature/*` branch or worktree claims a feature is done. See `.claude/skills/verify-feature/SKILL.md` for the full checklist.

---

**Adding a new template:** create the matching `.claude/commands/<name>.md` file (see any existing command for the frontmatter/structure convention), add it to `.claude/commands/README.md`, and add a row + subsection here.
