# Custom slash commands

Project-local Claude Code commands for this workspace. Each is a `.md` file here; typing `/<filename>` in a Claude Code session run from this repo invokes it. **After adding or editing a command file, restart the Claude Code session** (exit and run `claude` again) — the command list is loaded once at session start, so mid-session edits won't appear in autocomplete until then.

This is the index for commands specifically. See `docs/PROMPT_TEMPLATES.md` for the fuller prompt template library — the same 14 commands/skill below plus copy-paste prompt text for anything not (yet) promoted to a command.

Component-scoped commands (`audit-component`, `generate-story`, `perf-check`, `write-tests`, `audit-accessibility`) take one argument: a component name (e.g. `CandidateCard`) or a path, resolved under `packages/ui/src/{atoms,molecules,organisms,templates}` (and `apps/web/src/components/pages` where applicable). If the name matches more than one component, the command asks which before continuing.

## `/audit-component <name>`

Traces prop drilling across the component's actual render tree (not just one hop), flags other structural issues (missing `styled()` wraps, hardcoded colors, wrong Atomic Design tier, barrel/import-direction violations), and proposes a refactor — **read-only**, it stops for confirmation before changing source. It then writes/extends the co-located `.test.tsx` per `CLAUDE.md` Section 7 conventions and runs it.

Use when: you're about to touch a component and want to know if its prop plumbing or tier placement is already off, or its test coverage is incomplete.

## `/generate-story <name>`

Generates `ComponentName.stories.tsx` for a component in `@repo/ui` (Storybook only lives there — `apps/web`'s `pages/` tier is out of scope and the command will say so rather than generate one). Reads `Props` and the component's conditional branches to figure out which visual states actually exist, matches an existing sibling story's conventions (title format, `fn()` for callback args, `@repo/types` fixtures with branded IDs), and typechecks the result.

Use when: a component was added or changed and its Storybook stories are missing or stale.

## `/perf-check <name>`

Finds every place the component is rendered, checks whether the props it receives are reference-stable across those parents' re-renders, and checks the component's own body for unmemoized expensive work or inline callbacks passed to memoized children. Reports concrete `memo`/`useMemo`/`useCallback` recommendations with the *why* (not reflexive "wrap everything in memo") — **read-only**, stops for confirmation before applying anything. Explicitly says so when a component doesn't need any of these optimizations.

Use when: you suspect a component (usually one in a list, like `CandidateCard`/`JobCard`) is re-rendering more than it needs to, or before adding `memo`/`useMemo` speculatively.

## `/generate-component <name> [tier]`

Scaffolds a new atom/molecule/organism/template with the full `.types.ts`/`.styled.tsx`/`.component.tsx`/`index.ts` layout and wires it into the tier's level barrel. Asks for the tier if omitted or ambiguous, per `CLAUDE.md` Section 5.

Use when: starting a genuinely new presentational component in `@repo/ui`.

## `/write-tests <name>`

Writes or extends the co-located `.test.tsx` for a component, following Section 7's `renderWithTheme`/mocking conventions exactly, then runs it.

Use when: a component has no tests yet, or its tests need extending after a change — without also wanting the full prop-drilling audit `/audit-component` does.

## `/write-integration-test <hook-or-page>`

Writes a `*.integration.test.tsx` for an `apps/web` hook or page, exercising the real API-client/query chain against MSW (`msw/node`), per Section 7's integration-test pattern. Stops if the required Jest MSW infra isn't already in place rather than writing a test doomed to fail.

Use when: you want confidence in the real fetch → query → hook → component chain, not just a hook-mocked unit test.

## `/audit-accessibility <name>`

Checks a component for semantics/ARIA, keyboard navigation, and color-contrast issues against the theme tokens — **read-only**, stops for confirmation before applying anything.

Use when: reviewing a component before shipping, especially interactive ones (dialogs, forms, custom controls).

## `/optimize-bundle [path]`

Builds `apps/web` and reports large chunks, missing route-level code splitting, and inefficient dependency imports — **read-only**.

Use when: the app feels slow to load, or before adding a new heavy dependency.

## `/refactor-state <feature-name>`

Audits a feature's TanStack Query layer (query key factory scope, cross-resource invalidation, layer boundaries) against Section 9 — **read-only**, proposes a refactor rather than applying one.

Use when: a feature's cache invalidation seems off, or its `api/`/`*Queries.ts`/domain-hook layering has drifted.

## `/add-query-hook <resource-name>`

Scaffolds the two-layer TanStack Query architecture (Layer 1 fetch function, Layer 2 query key factory + hooks, domain hook) for a new resource, per Section 9.

Use when: adding server-state support for a resource that doesn't have a query layer yet.

## `/add-route <path>`

Adds a route to `apps/web/src/router/index.tsx` with a fire-and-forget prefetching `loader`, per Section 10.

Use when: a page component and its query hook exist but aren't reachable via routing yet.

## `/add-mock-handler <resource-name>`

Adds an MSW handler and fixture data to `apps/web/src/mocks/`, checking the real `claude-learn-mocks` endpoint contract first, per Section 11.

Use when: a new/changed resource needs mock data support for `dev:mock` or integration tests.

## `/design-type <domain-name>`

Designs a new domain type in `@repo/types`, applying ID branding and `FindResult`-style discriminated unions only where a real boundary risk exists, per Section 12.

Use when: adding a new domain model, before hand-writing an ad-hoc shape inline elsewhere.

## `/lint-audit <path>`

Runs lint/typecheck scoped to a path and explains each failure by the specific rule/config that fired, per Section 13 — **read-only**, never proposes disabling a rule as the default fix.

Use when: cleaning up a path's lint/type errors and wanting the *why*, not just the raw output.
