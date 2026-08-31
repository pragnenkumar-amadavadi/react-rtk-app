# Custom slash commands

Project-local Claude Code commands for this workspace. Each is a `.md` file here; typing `/<filename>` in a Claude Code session run from this repo invokes it. **After adding or editing a command file, restart the Claude Code session** (exit and run `claude` again) — the command list is loaded once at session start, so mid-session edits won't appear in autocomplete until then.

All three commands take one argument: a component name (e.g. `CandidateCard`) or a path, resolved under `packages/ui/src/{atoms,molecules,organisms,templates}` (and `apps/web/src/components/pages` where applicable). If the name matches more than one component, the command asks which before continuing.

## `/audit-component <name>`

Traces prop drilling across the component's actual render tree (not just one hop), flags other structural issues (missing `styled()` wraps, hardcoded colors, wrong Atomic Design tier, barrel/import-direction violations), and proposes a refactor — **read-only**, it stops for confirmation before changing source. It then writes/extends the co-located `.test.tsx` per `CLAUDE.md` Section 7 conventions and runs it.

Use when: you're about to touch a component and want to know if its prop plumbing or tier placement is already off, or its test coverage is incomplete.

## `/generate-story <name>`

Generates `ComponentName.stories.tsx` for a component in `@repo/ui` (Storybook only lives there — `apps/web`'s `pages/` tier is out of scope and the command will say so rather than generate one). Reads `Props` and the component's conditional branches to figure out which visual states actually exist, matches an existing sibling story's conventions (title format, `fn()` for callback args, `@repo/types` fixtures with branded IDs), and typechecks the result.

Use when: a component was added or changed and its Storybook stories are missing or stale.

## `/perf-check <name>`

Finds every place the component is rendered, checks whether the props it receives are reference-stable across those parents' re-renders, and checks the component's own body for unmemoized expensive work or inline callbacks passed to memoized children. Reports concrete `memo`/`useMemo`/`useCallback` recommendations with the *why* (not reflexive "wrap everything in memo") — **read-only**, stops for confirmation before applying anything. Explicitly says so when a component doesn't need any of these optimizations.

Use when: you suspect a component (usually one in a list, like `CandidateCard`/`JobCard`) is re-rendering more than it needs to, or before adding `memo`/`useMemo` speculatively.
