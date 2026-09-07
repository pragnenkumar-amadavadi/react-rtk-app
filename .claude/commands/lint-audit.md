---
description: Run lint/typecheck scoped to a path and explain failures against the shared ESLint/TypeScript config
argument-hint: <path>
---

# Lint & Type-Compliance Audit

Target: `$ARGUMENTS`

This is a read-and-report task — do not edit source files. Only propose fixes; apply them only if the user explicitly asks in a follow-up.

## 1. Resolve scope and package

Determine which package(s) `$ARGUMENTS` falls under (`apps/web` or `packages/ui`) — each has its own `eslint.config.js` spreading `@repo/eslint-config` (Section 13) plus its own tsconfig chain.

## 2. Run the checks

Run lint and typecheck scoped to the path (via Turbo filters, e.g. `pnpm --filter <web|ui> exec eslint <path>` and the package's typecheck script). If the path includes test files, remember they're excluded from the "app" tsconfig and only type-check via `tsconfig.test.json` — check that config explicitly if `.test.tsx` files are in scope.

## 3. Explain each failure

For every lint/type error, don't just paste the raw message — map it to the actual rule/config source: which rule in `@repo/eslint-config` fired and why (e.g. `react-hooks` deps, `jsx-a11y`, `testing-library`'s `no-render-in-lifecycle`), or which `tsconfig` strictness setting a type error violates. If a rule is scoped narrowly (e.g. `testing-library`/`jest-dom` rules only apply to `**/*.test.{ts,tsx}`), note when a failure is unexpected given that scoping — it may signal a misconfigured file location rather than a real violation.

## 4. Propose fixes (do not apply yet)

For each failure, give the specific fix. Never propose disabling a rule (`eslint-disable`) or loosening a tsconfig setting as the fix unless the rule is a clear false positive for this specific case — explain why if you do.

## 5. Summary

State how many lint/type errors were found, grouped by rule/cause, and the proposed fixes — not yet applied.
