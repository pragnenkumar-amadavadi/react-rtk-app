---
name: verify-feature
description: Acceptance-check implemented candidate/job-tracker features against their spec (screen behavior, BE endpoint contract, FE data flow). Checks both react-rtk-app (FE) and claude-learn-mocks (BE), runs lint/typecheck/tests, smoke-tests endpoints and UI end-to-end, and reports a pass/fail checklist per criterion. Read-only — never edits code. Use after a feature/* branch or worktree claims a feature is done.
---

# Verify Feature

You are acting as an acceptance tester, not an implementer. **Never edit code in this skill** — only read, run commands, and report. If you find a bug worth fixing, report it; do not fix it yourself unless the user explicitly asks you to in a follow-up.

## 1. Resolve scope

`args` may be a session name (`candidate-pipeline`, `candidate-jobs`, `platform`), a specific feature name (e.g. `"status transitions"`), or empty.

- If a session name is given, verify every feature listed under that session in section 3 below.
- If a specific feature name is given, verify just that one (look it up in section 3 by name).
- If empty, infer the session from the current git branch (`git branch --show-current`) — branches are named `feature/candidate-pipeline`, `feature/candidate-jobs`, `feature/platform`. If that fails, ask which session/feature to check rather than guessing.

## 2. Locate both repos

This product spans two repos, worked on in parallel via matching git worktrees:

- FE: `react-rtk-app` (this repo, or a worktree of it)
- BE: `claude-learn-mocks`

Worktrees live under `/home/pragnen/Pragnen/learn/worktrees/`, named `<repo>-<session>` — e.g. `react-rtk-app-candidate-pipeline` and `claude-learn-mocks-candidate-pipeline` are the matched pair for the `candidate-pipeline` session. From whichever worktree you're invoked in, derive the sibling: same session suffix, other repo name, same `worktrees/` parent. If a matching BE worktree doesn't exist, fall back to `/home/pragnen/Pragnen/learn/claude-learn-mocks` (main) and say so in the report.

## 3. Acceptance criteria by feature

For each feature in scope, work through **every** checklist item below. Each item needs a concrete pass/fail, not "looks fine" — cite the file/line, the command output, or the screenshot that proves it.

### Session: `candidate-pipeline`

**Search & filter**
- [ ] `GET /api/candidates` accepts `search` (matches name/email/position, case-insensitive substring) and `status` query params; filtering happens before the pagination slice in `candidate.controller.ts`
- [ ] Invalid/unknown `status` values don't crash the endpoint (either ignored or 400 — check which, and that it's consistent)
- [ ] `CandidateListParams` (in `@repo/types`) has `search?` and `status?`
- [ ] The query key factory (`candidateKeys.list(...)`) includes the filter params, so two different filters produce two different cache entries — confirm by reading the implementation, not just assuming
- [ ] UI: a filter bar renders above the candidate list — text input + status selector
- [ ] Typing in the search box is debounced (not one request per keystroke — check network requests via `read_network_requests` or the code for a debounce)
- [ ] The "Showing N candidates" count reflects the filtered result, not the total
- [ ] Regression: with no filter applied, the list and infinite scroll still behave exactly as before

**Status transitions**
- [ ] `PATCH /api/candidates/:id/status` exists; 400 on invalid status, 404 on unknown id, 200 + updated candidate on success
- [ ] `CandidateDetailView` shows the current status as an actionable control (not static text) with valid next-stage actions
- [ ] Changing status via the UI updates the detail view AND the list view's cache (navigate back to the list after changing status — the new status must show without a manual refresh)
- [ ] Regression: `AddCandidateDialog` / candidate creation still sets status correctly

**Bulk status actions**
- [ ] `PATCH /api/candidates/bulk-status` accepts `{ ids, status }`, updates matching records, and returns a per-id result (not a single pass/fail) so the FE can show which ids failed
- [ ] UI: checkbox per candidate card; a selection toolbar appears once ≥1 is selected and disappears at 0
- [ ] Bulk action applies to exactly the selected ids and clears selection afterward
- [ ] "Select all" (if implemented) selects only what's currently visible under the active filter, not the entire dataset

**Optimistic updates** (status-change mutation only — do not expect this elsewhere)
- [ ] The status mutation uses `onMutate` / `onError` / `onSettled` with manual `setQueryData`, not `invalidateQueries` — grep the mutation definition to confirm
- [ ] `onMutate` snapshots the previous value and `onError` restores it (a real rollback path, not just an optimistic write with no undo)
- [ ] Force a failure (temporarily stop the BE server, or point the mutation at a bad id) and confirm the UI reverts instead of staying on the optimistic value

### Session: `candidate-jobs`

**Notes & activity timeline**
- [ ] `GET /api/candidates/:id/notes` and `POST /api/candidates/:id/notes` exist; POST validates non-empty body text
- [ ] Notes persist server-side across requests — POST one, then GET, and confirm it's actually there (not just echoed back once)
- [ ] `CandidateNote` type exists in `@repo/types`
- [ ] UI: a notes section on `CandidateDetailView` — input + submit, list of existing notes with timestamps, newest note appears without a manual page reload
- [ ] This session must NOT depend on the status-transitions endpoint from `candidate-pipeline` (that's a separate branch/worktree) — confirm notes work standalone, with no auto-generated "status changed" entries expected yet

**Applicant tracking per job**
- [ ] `POST /api/jobs/:jobId/applications` actually persists — the application is stored, not just built and returned; check by posting then confirming it's retrievable
- [ ] The submitted application creates-or-matches a real `Candidate` record (read `job.controller.ts`'s `submitApplication` — does it still discard `name`/`experience`/`expectedSalary` after this change, or does a candidate now exist for it?)
- [ ] `GET /api/jobs/:id/applicants` returns the joined list of candidates who applied to that job
- [ ] `Application` type exists in `@repo/types`, carrying `JobId` and `CandidateId` (branded, not bare numbers — check against the project's branding convention in `packages/types/src/brand.ts`)
- [ ] UI: `JobDetailView` has an "Applicants (N)" section listing real applicants via `CandidateCard`, each linking to that candidate's detail page
- [ ] A job with zero applicants renders a sane empty state, not a broken/empty list with no message

### Session: `platform`

**Dashboard / pipeline overview**
- [ ] A route (e.g. `/dashboard`) renders and is reachable from `AppNav`
- [ ] Stat tiles show real numbers — cross-check at least one tile's number against the actual candidate/job list length (e.g. curl `/api/candidates?limit=1` for `total`, compare to the tile)
- [ ] The status funnel/breakdown's numbers sum to the total candidate count — if they don't, that's a bug, not a rounding note
- [ ] This session was scoped to candidate-only and job-only stats (no per-job applicant counts — that needs `candidate-jobs`'s work). Confirm the dashboard doesn't silently show zeros or broken data for anything that depends on the other session; if it does, that's a scope leak, flag it
- [ ] Loading and empty states are handled, not just the happy path

**Dark mode toggle**
- [ ] A toggle control exists in `AppNav`, is keyboard-focusable, and has a visible focus state
- [ ] Clicking it switches the whole app to `theme.ts`'s dark palette — check more than one surface (background, primary accent, text) via screenshot in both states, not just the button itself
- [ ] The choice persists across a reload (should come from `CssVarsProvider`'s built-in storage — confirm by reloading the page after toggling, not just trusting that MUI "usually" does this)
- [ ] No component anywhere renders a raw MUI element or a hardcoded color that fails to flip with the theme (spot-check the newest components from this same session, and the new dashboard from above, since those are the most likely to have skipped the CSS-var convention)

## 4. Run the checks

For each feature above:

1. **Static** — read the actual diff (`git diff main...HEAD` in each worktree, or `git log -p` if already merged) and grep for the specific files/functions/types named in the checklist. Don't assume a criterion passes because a similarly-named file exists — read it.
2. **Quality gates** — in the FE worktree: `pnpm exec tsc -b` and `pnpm exec eslint .` (scoped to `apps/web` and/or `packages/ui`/`packages/types` depending on what changed), plus `pnpm run test` for any package with changed source. In the BE worktree: `npx tsc --noEmit` (or `npm run build`) at minimum, since there's no lint/test script configured there today — say so rather than skipping silently.
3. **Dynamic — BE** — start the BE (`pnpm run dev` in the BE worktree, port 8080) and curl the changed/new endpoints directly with both valid and invalid payloads, checking status codes and response shape against the checklist. Kill the server when done.
4. **Dynamic — FE** — start the FE against the real BE (`pnpm run dev`, NOT `dev:mock` — `apps/web/vite.config.ts` proxies `/api` to `localhost:8080`, so the real backend must be running first). Use the Chrome browser tools to actually click through each "UI:" checklist item — don't infer UI correctness from the code alone when a live check is possible. Close tabs and stop both servers when done.
5. **Regression** — for any feature that touches a file another feature also touches (per the brainstorm's file-overlap notes — `CandidateDetailView`, `packages/types/index.ts`, BE `index.ts`), confirm the other feature's behavior in that same file still works.

## 5. Report

Produce a markdown report, one section per feature, structured exactly as:

```
### <Feature name>
- ✅ <criterion> — <one-line evidence: command run, file:line, or what you saw on screen>
- ❌ <criterion> — <what's missing or wrong, specific enough to act on>
- ⚠️ <criterion> — <partially true / worked around / needs a human call>

**Verdict:** SHIP | NEEDS WORK — <the single biggest gap, if any>
```

End with one overall summary line across all features in scope: how many are SHIP vs NEEDS WORK, and — if this session's branch is meant to merge into another — call out anything that will conflict with or depend on a sibling session's changes (check the brainstorm's file-overlap notes: `candidate-jobs`'s notes section shares `CandidateDetailView` with `candidate-pipeline`'s status control; all three sessions may touch their repo's `index.ts`/barrel files).
