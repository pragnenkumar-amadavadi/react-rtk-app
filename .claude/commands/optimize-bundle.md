---
description: Analyze the Vite bundle for apps/web and propose code-splitting/lazy-loading/dependency fixes
argument-hint: [path]
---

# Optimize Bundle

Target: `$ARGUMENTS` (optional — a route, page, or feature area to focus on; if omitted, audit the whole `apps/web` bundle)

This is a read-and-report task — do not edit source files. Only propose changes; apply them only if the user explicitly asks in a follow-up.

## 1. Build and inspect

Run `pnpm --filter web run build` and inspect the output chunk sizes (or use an existing bundle-visualizer script if the app already has one — don't add a new dependency for this without asking). Note which chunks are largest and what's driving their size.

## 2. Check route-level splitting

Read `apps/web/src/router/index.tsx` (Section 10). Are all page components statically imported, or are heavier/less-frequently-visited routes already using `React.lazy` + `Suspense`? Flag routes that would benefit from lazy loading — weigh this against the existing loader-based prefetch pattern (Section 10): a lazily-loaded route's `loader` can still fire `prefetchQuery`/`prefetchInfiniteQuery` independently of the component chunk loading, so the two aren't in conflict.

## 3. Check dependency usage

Look for: large libraries imported wholesale where only a small piece is used (check for tree-shakeable named imports vs default/namespace imports), duplicate functionality across dependencies, and dev-only tooling accidentally bundled into production (check `vite.config.ts` and `package.json` dependency vs devDependency placement).

## 4. Check for unnecessary re-fetches inflating perceived load

Not bundle size directly, but related: confirm `staleTime`/prefetch config (Section 9) isn't causing redundant network payload on repeat navigations — call this out separately from actual JS bundle size findings.

## 5. Report findings (do not apply yet)

For each issue: **what** (chunk/dependency/route), **current size impact** (from the build output), **fix** (lazy import, tree-shakeable import path, dependency swap/removal), **expected benefit**. Don't recommend a change whose payoff is negligible relative to its complexity (e.g. don't lazy-split a route that's already small).

## 6. Summary

State the largest chunks found, the proposed fixes ranked by impact, and confirm none have been applied yet.
