---
description: Scaffold a new Atomic Design component (atom/molecule/organism/template) with its full file layout and barrel wiring
argument-hint: <ComponentName> [atom|molecule|organism|template]
---

# Generate Component

Target: `$ARGUMENTS`

This command creates new files. Scaffold exactly the layout `CLAUDE.md` Section 5 describes — no more, no less. If the tier (second argument) is omitted or ambiguous given what the component does, **stop and ask** which tier before creating anything (Section 5's "When to ask" rule).

## 1. Determine the tier

If a tier was given, sanity-check it against Section 5's placement rules (atom = wraps one MUI/HTML element; molecule = composes atoms; organism = complex section with its own interaction logic; template = full-page layout, receives everything as props, fetches nothing). If it doesn't fit, say so and ask which tier is actually correct rather than creating it in the wrong place.

If no tier was given, infer from the component's stated purpose; if genuinely unclear, ask.

Never place this in `apps/web/src/components/pages/` — that tier is reserved for components that call TanStack Query hooks (`features/**`), which this command doesn't create.

## 2. Scaffold the file layout

Create `packages/ui/src/<tier-plural>/<ComponentName>/` with:

- `<ComponentName>.types.ts` — the `Props` interface only. No imports from `.styled.tsx`/`.component.tsx`.
- `<ComponentName>.styled.tsx` — any `styled()` wrappers this component needs, as named exports, importing only from `.types.ts`. Every MUI element used in the component must be wrapped here (Section 6) — never a raw `<Button>`/`<Typography>`/`<Box>` in the component file.
- `<ComponentName>.component.tsx` — the component function, importing from `.types.ts` and `.styled.tsx`. If this component renders other components in `@repo/ui`, import them via their component barrel (`../../atoms/StatusChip`), never the level or top barrel (Section 5's circular-import rule).
- `index.ts` — component barrel: `export { default } from './<ComponentName>.component'; export type { Props } from './<ComponentName>.types';`

Respect the strict import direction: `types ← styled ← component`.

## 3. Wire into the barrels

Add a named export line to the tier's level barrel (`packages/ui/src/<tier-plural>/index.ts`):
```ts
export { default as <ComponentName> } from './<ComponentName>';
export type { Props as <ComponentName>Props } from './<ComponentName>';
```

The top barrel (`packages/ui/src/index.ts`) already re-exports `* from './<tier-plural>'` — confirm that line exists; don't duplicate it.

## 4. Verify

Typecheck the new files (`pnpm --filter ui exec tsc --noEmit`, or the project's existing typecheck script). Fix any errors before finishing. Do not generate a story or test file here — use `/generate-story` and `/write-tests` for those.

## 5. Summary

State the tier chosen (and why, if it was inferred rather than given), the files created, and confirm typecheck passed.
