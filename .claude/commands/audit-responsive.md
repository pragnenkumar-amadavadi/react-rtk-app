---
description: Audit a component for responsive-design issues (breakpoint usage, overflow, touch targets, fluid sizing) and propose fixes
argument-hint: <component-name-or-path>
---

# Responsive Design Audit

Target: `$ARGUMENTS`

This is a read-and-report task — do not edit source files. Only propose changes; apply them only if the user explicitly asks in a follow-up.

## 1. Locate the component

Resolve `$ARGUMENTS` under `packages/ui/src/{atoms,molecules,organisms,templates}` or `apps/web/src/components/pages`. If more than one match exists, ask which before continuing. Read `.styled.tsx` and `.component.tsx` (and any child components it composes, one level deep, since a layout bug is often in the parent even when the symptom shows in the child).

## 2. Check breakpoint convention (CLAUDE.md §6)

- Any `sx={{ ... }}` prop containing breakpoint keys (`xs`/`sm`/`md`/`lg`/`xl`) is a direct violation — responsive styles belong in `styled()` via `theme.breakpoints.up(...)`/`down(...)`/`between(...)`, not `sx`. Flag every instance.
- Where `.styled.tsx` does use breakpoints, confirm it's via `theme.breakpoints.*` (not a hardcoded `@media (min-width: 768px)` string, which drifts from the theme's actual breakpoint values).
- If the component clearly needs to look different across viewport sizes but has **no** breakpoint handling anywhere, that's a finding too — don't only flag existing-but-wrong usage.

## 3. Check for overflow and fixed sizing

- Any hardcoded pixel `width`/`min-width` (in `styled()`) large enough to overflow a narrow viewport (roughly >360px, the smallest common mobile width) without a `max-width: 100%` or breakpoint override.
- Flex containers (`display: flex`) laying out multiple items in a row — do they `flexWrap: wrap` (or switch to `column` below a breakpoint) where content could exceed viewport width, or will they force horizontal scroll on mobile?
- Grid layouts (`display: grid`) — fixed `grid-template-columns` (e.g. `repeat(4, 1fr)`) that doesn't collapse to fewer columns at narrow breakpoints.
- Long unbroken text/data (names, emails, ids) — is there `overflow: hidden` + `text-overflow: ellipsis` (or wrapping), or will it force the container wider than its parent?

## 4. Check fluid media and typography

- `<img>`/icon/avatar elements — do they scale with their container (`max-width: 100%`, or an explicit responsive size) rather than a fixed pixel box that stays oversized on narrow screens or pixelates when it needs to shrink?
- Font sizes — any that should reasonably shrink on mobile (large headings, hero text) but are a single fixed value with no breakpoint override. Don't flag body text or small UI labels that are already appropriately sized at every width — this is about content that visibly doesn't fit or looks disproportionate on a small viewport, not a blanket "use clamp() everywhere" rule.

## 5. Check touch targets and spacing

- Interactive elements (buttons, icon buttons, chips acting as controls) — is the tappable area reasonably sized for touch (MUI's default `IconButton`/`Button` sizing already clears this; only flag a component that shrinks below that via custom padding/`sx`/`styled` overrides).
- Adjacent interactive elements — is there enough spacing between them that a touch target doesn't overlap its neighbor at narrow widths?

## 6. Cross-reference existing responsive patterns

Check how a sibling component in the same tier already handles this (e.g. `CandidateListView`'s card grid, `AppNav`'s breakpoint-driven layout) and calibrate findings against that existing convention rather than inventing a new pattern — flag deviation from the codebase's own precedent as a finding in itself.

## 7. Report findings (do not apply yet)

For each issue: **where** (file:line), **what's wrong**, **at what viewport it breaks** (be concrete — "overflows below ~400px", not "on mobile"), **fix** (the specific `styled()`/breakpoint change). If the component is already responsive and correct, say so plainly rather than manufacturing a finding.

## 8. Summary

One short summary: how many issues found, by category (breakpoint convention / overflow / fluid sizing / touch targets), and the proposed fixes — not yet applied.
