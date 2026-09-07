---
description: Run the full frontend review checklist (TypeScript strictness, accessibility, responsive design, performance) against changed or specified files
argument-hint: [component-name-or-path | file-list]
---

# Review Checklist

Target: `$ARGUMENTS`

This is a read-and-report task — do not edit source files. Only propose fixes; apply them only if the user explicitly asks in a follow-up. This consolidates the same checks as `/lint-audit`, `/audit-accessibility`, `/audit-responsive`, and `/perf-check` into one report.

## 1. Resolve scope

`$ARGUMENTS` is one of:

- A component name or path — resolve the same way as the other `/audit-*` commands: under `packages/ui/src/{atoms,molecules,organisms,templates}` or `apps/web/src/components/pages`.
- A space-separated list of file paths.
- Empty — default to `git diff --cached --name-only --diff-filter=ACMR` (staged files); if nothing is staged, fall back to `git diff main...HEAD --name-only` (branch changes vs `main`).

Filter the resolved list to `.ts`/`.tsx`/`.js`/`.jsx` files under `apps/web/src`, `packages/ui/src`, `packages/types/src`, or `packages/api-client/src`. If the filtered list is empty, say so and stop — don't run the checks below against an empty scope.

## 2. Automated gates

Determine which package(s) the scoped files fall under and run, scoped to those packages only:

- Lint: `pnpm --filter <pkg> exec eslint <paths>`
- Typecheck: the package's typecheck script (remember `.test.tsx`/`src/tests/**` only type-check via `tsconfig.test.json`, per CLAUDE.md §7/§13)
- Tests: `pnpm --filter <pkg> run test` if any scoped file is a source file with a co-located test, or is itself a test file

Report any lint error, type error, or test failure — map it to the actual rule/config source, same as `/lint-audit` step 3.

## 3. TypeScript strictness — manual diff check

`tsc`/lint catch most strictness violations, but not ones that route *around* strict mode. For each scoped file, check the actual diff (`git diff --cached -- <file>` or `git diff main...HEAD -- <file>`) for **added** lines containing: `any` (as a type annotation, not a variable named "any"), `as any` or other unjustified `as` casts, `@ts-ignore`, `@ts-expect-error`, or a new `eslint-disable` targeting a TypeScript/strictness rule. Quote each and suggest the typed alternative. Pre-existing instances outside the diff aren't this command's concern (CLAUDE.md §3 — don't flag issues you didn't touch).

## 4. Accessibility

For each scoped component file (`.component.tsx`), apply the same checks as `/audit-accessibility` steps 2–4 (semantics/ARIA, keyboard nav, contrast against the theme tokens actually used).

## 5. Responsive design

For each scoped `.styled.tsx`/`.component.tsx` pair, apply the same checks as `/audit-responsive` steps 2–5 (breakpoint convention, overflow/fixed sizing, fluid media/typography, touch targets).

## 6. Performance

Apply the same checks as `/perf-check` steps 2–3, calibrated the same way — don't reflexively recommend `memo`/`useMemo`/`useCallback`, only when that command's payoff test is actually met.

## 7. Report findings (do not apply yet)

Produce one report, grouped by category (TypeScript, Accessibility, Responsive Design, Performance), each finding with file:line, what's wrong, and the fix — same evidence bar as the individual `/audit-*` commands. If a category has nothing to report, say so plainly rather than manufacturing a finding.

## 8. Summary

One short summary: how many issues found per category, and whether any are severe enough to fix before committing (lint/type/test failures, a broken interaction for assistive tech, a layout that will visibly overflow) versus advisory (performance suggestions, minor polish) — not yet applied.
