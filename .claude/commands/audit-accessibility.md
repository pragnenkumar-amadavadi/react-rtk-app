---
description: Audit a component for accessibility issues (semantics, ARIA, keyboard nav, contrast) and propose fixes
argument-hint: <component-name-or-path>
---

# Accessibility Audit

Target: `$ARGUMENTS`

This is a read-and-report task — do not edit source files. Only propose changes; apply them only if the user explicitly asks in a follow-up.

## 1. Locate the component

Resolve `$ARGUMENTS` under `packages/ui/src/{atoms,molecules,organisms,templates}` or `apps/web/src/components/pages`. If more than one match exists, ask which before continuing. Read `.component.tsx` and `.styled.tsx`.

## 2. Check semantics and ARIA

- Interactive elements (`onClick` on a non-button, a `styled(Box)` acting as a control) — should it be a real `<button>`/MUI `ButtonBase`-derived component instead, or does it need `role`/`tabIndex`/keyboard handlers to behave like one?
- Images/icons conveying meaning — `alt` text present and non-redundant; purely decorative icons marked `aria-hidden`.
- Form fields — labels correctly associated (MUI's `label`/`InputLabel` prop wired to the input, not just visually adjacent text).
- Dynamic content (loading/error/empty states, live-updating counts) — does anything need `aria-live` so screen reader users notice the change?
- Dialogs/menus (organisms like `AddCandidateDialog`) — focus trapping and return-focus-on-close are usually handled by MUI's own `Dialog`/`Menu` primitives; flag it only if this component bypasses those primitives with custom markup.

This project already runs `eslint-plugin-jsx-a11y`'s recommended rules (Section 13) — note if a finding would already be caught by `pnpm run lint`, versus something the linter can't see (color contrast, meaningful reading order, keyboard-only flows).

## 3. Check keyboard navigation

Trace every interactive element: reachable via Tab, has a visible focus indicator (don't rely on a removed default outline without a replacement), operable via Enter/Space (buttons) or arrow keys (custom lists/menus), and in a sensible tab order.

## 4. Check color contrast

Compare text/icon colors against their background using the theme tokens actually referenced in `.styled.tsx` (Section 6's CSS var table) — flag any pairing that's visually low-contrast (e.g. `text-secondary` on a light-tinted background) rather than guessing at exact ratios.

## 5. Report findings (do not apply yet)

For each issue: **where** (file:line), **what's wrong**, **why it matters** (which users/assistive tech are affected), **fix** (the specific markup/prop/aria-attribute change). If nothing is wrong, say so plainly.

## 6. Summary

One short summary: how many issues found, by category, and the proposed fixes — not yet applied.
