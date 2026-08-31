---
description: Analyze a component for unnecessary re-renders and suggest React.memo/useMemo/useCallback fixes
argument-hint: <component-name-or-path>
---

# Perf Check

Target: `$ARGUMENTS`

This is a read-and-report task — do not edit source files. Only propose changes; apply them only if the user explicitly asks in a follow-up.

## 1. Locate the component

Resolve `$ARGUMENTS` under `packages/ui/src/{atoms,molecules,organisms,templates}` or `apps/web/src/components/pages`. If more than one match exists, ask which before continuing. Read `.types.ts`, `.styled.tsx`, `.component.tsx`, and (if a page) the feature hook(s) it calls.

## 2. Find every parent that renders it

Grep for the component's usages (same approach as `/audit-component` step 2) and read each render site. For every parent, note:

- **How often the parent itself re-renders** — is it a list item rendered inside `Virtuoso`/`.map()` (re-renders per scroll/update), a route-level page (re-renders on navigation/query refetch), or something rendered once and rarely touched?
- **What gets passed to this component on each parent re-render** — for every prop, is the value stable across renders (a primitive, a `useMemo`/module-level constant, state that only changes when it should) or is it a **new reference every render** (an inline object/array literal, an inline arrow function not wrapped in `useCallback`, a `.filter()`/`.map()`/spread computed inline in JSX)?

## 3. Check the component itself

- Is it already wrapped in `memo()`? If not — is it worth it? `memo` only pays off when (a) the component is expensive to render (non-trivial JSX tree, or renders inside a list/virtualized scroll) **and** (b) its actual prop values are usually stable across the parent's re-renders (per step 2). Wrapping a cheap component, or one that's handed a fresh object/callback every render anyway, adds an overhead-only `Object.is` prop comparison with no payoff — call this out explicitly rather than reflexively recommending `memo` everywhere.
- Inside the component: any expensive computation (sort/filter/reduce over a list, date formatting, derived aggregate) recomputed on every render that isn't gated behind `useMemo`? Only flag it if the computation is non-trivial or runs over a list that scales with data size — don't recommend `useMemo` for a cheap one-liner (the memoization overhead exceeds the savings).
- Any callback defined inline in this component's JSX that's passed down to a **memoized** child? That defeats the child's `memo` — flag it, recommend `useCallback` there specifically (not as a blanket rule for every function in the file).
- If it renders a list, is each item keyed correctly (stable `key`, not array index unless the list is truly static)? A wrong key forces full remounts, which no amount of `memo`/`useMemo` fixes.

## 4. Report findings (do not apply yet)

For each issue found, state:
- **Where** — file:line.
- **Why it causes extra renders/work** — the concrete mechanism (new reference every render breaks `memo`'s comparison; unmemoized computation reruns on unrelated state changes; etc.), not a generic "this is slow."
- **Fix** — the specific wrap (`memo(Component)`, `useMemo(() => ..., [deps])`, `useCallback(() => ..., [deps])`) with correct dependency array, or "no fix needed, this is already fine" if step 3's payoff test fails.

If nothing in the component or its render sites actually causes wasted work, say so plainly — do not manufacture a `useMemo`/`useCallback` recommendation just to have one. Follow this repo's existing usage as the calibration bar (see `CandidateCard.component.tsx`'s `memo()` wrap, `CandidateListView.component.tsx`'s `useMemo` for the per-item selection scan) — those exist because the component sits inside a virtualized, frequently-updated list; don't recommend the same pattern for a component that renders once per page load.

Stop here and let the user confirm before applying any fix.

## 5. Summary

One short summary: how many render sites were checked, what (if anything) was found, and the proposed fix(es) — not yet applied.
