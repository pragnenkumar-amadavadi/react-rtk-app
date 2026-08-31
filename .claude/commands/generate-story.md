---
description: Generate a Storybook story file for a component in @repo/ui
argument-hint: <component-name-or-path>
---

# Generate Story

Target: `$ARGUMENTS`

Storybook lives exclusively in `packages/ui` (see `CLAUDE.md` Section 11) — every component with a story is one of `packages/ui/src/{atoms,molecules,organisms,templates}`. `apps/web`'s `pages/` tier is data-connected and never gets a story.

## 1. Locate the component

Resolve `$ARGUMENTS` to a component folder under `packages/ui/src/{atoms,molecules,organisms,templates}`. If it doesn't exist there (e.g. it's an `apps/web/src/components/pages/**` page), stop and tell the user stories aren't applicable to that tier — do not generate one anyway.

If more than one match exists, ask which before continuing.

Read `.types.ts` (the full `Props` shape), `.component.tsx` (to see what varies visual output — status/variant fields, conditional branches like loading/error/empty, lists that render differently when empty vs populated), and any sibling component's `.stories.tsx` in the same folder tier (atoms/molecules/organisms/templates) to match established patterns for realistic fixture data — reuse `@repo/types` fixtures the same way existing stories do rather than inventing a different shape.

## 2. Write the story file

Create `ComponentName.stories.tsx` in the component's folder, matching these conventions exactly (see existing stories for reference, e.g. `packages/ui/src/molecules/CandidateCard/CandidateCard.stories.tsx`, `packages/ui/src/organisms/AddCandidateDialog/AddCandidateDialog.stories.tsx`):

- Import `type { Meta, StoryObj } from '@storybook/react-vite'`.
- Import the component from `./ComponentName.component` (not the barrel).
- `meta.title` is `'<Tier>/<ComponentName>'` where `<Tier>` is `Atoms`/`Molecules`/`Organisms`/`Templates` matching the folder it's actually in.
- `tags: ['autodocs']` always.
- `parameters: { layout: '...' }` — use `'padded'` for a card/inline component, `'fullscreen'` for a dialog/page-shaped template, or omit `parameters` entirely for a small atom that doesn't need a layout hint (follow what a sibling in the same tier does).
- Any prop that's a callback (`onClose`, `onSubmit`, `onChange`, etc.) goes in `meta.args` using `fn()` imported from `'storybook/test'` — never a hand-rolled `() => {}`.
- Build one or more realistic base fixture objects using real types from `@repo/types` (branded IDs via their constructor, e.g. `toCandidateId(1)`, never a raw number cast).
- Export one named `Story` per meaningfully distinct state the component can render — read from what you saw in `.component.tsx`'s conditional branches:
  - a `Default`/happy-path state,
  - one story per enum-like prop value that changes appearance (status, variant),
  - loading / error / empty states if the component has them,
  - an edge case worth visually checking (e.g. long text overflow, missing optional field) if the component has fields prone to that.
- Do not invent stories for states the component can't actually reach — every story's `args` must be satisfiable by the real `Props` type.

## 3. Verify

Run Storybook's build check for just this story if the package exposes one (e.g. `pnpm --filter ui exec tsc --noEmit` to confirm the story file typechecks against `Props`), or at minimum confirm the file typechecks with the project's existing test/typecheck tooling. Report any type errors and fix them before finishing.

## 4. Summary

State the file path created, the tier/title used, and the list of story names with a one-line note on what each demonstrates.
