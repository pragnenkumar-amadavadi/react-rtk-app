# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

**Repository state:** This directory is **not currently a git repository** (no `.git`). Don't suggest `git` commands (commits, branches, hooks) until the user initializes one — treat that as their decision, not something to do proactively.

**Monorepo layout:** This is a **pnpm + Turborepo workspace**, not a single package. Root scripts (`build`, `lint`, `test`, `dev`, etc.) all delegate to `turbo run <task>`, which runs that task in whichever workspace packages define it.

```
apps/
  web/                  ← the Vite React app (package name: "web")
packages/
  types/                ← @repo/types  — shared generic + domain types (brand, pagination, result, candidate, job)
  api-client/           ← @repo/api-client — axios instance, ApiError, QueryClient, env-var access
  ui/                   ← @repo/ui — Atomic Design component library (atoms→templates) + theme + Storybook
  eslint-config/        ← @repo/eslint-config — shared flat-config array
  tsconfig/             ← @repo/tsconfig — shared base + vite-app tsconfig presets
```

**The one hard boundary:** `pages/` (the data-connected tier that calls TanStack Query hooks) stays in `apps/web` — it's the one Atomic Design tier that's allowed to import app-specific business logic (`src/features/**`). Everything below it (`atoms`/`molecules`/`organisms`/`templates`) lives in `@repo/ui` and must never import from `apps/web`. When in doubt about where a file belongs, check which side of that boundary it's on.

Sections below describe the same conventions as a single-package app would, but each names the package the file actually lives in.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 5. Component Structure — Atomic Design

Atomic-Design component tiers are split across a package boundary:

```
packages/ui/src/          ← @repo/ui — presentational tiers, no data fetching
  atoms/          # Single-purpose primitives wrapping MUI or HTML elements
  molecules/      # Composed display units built from atoms
  organisms/      # Complex interactive sections (forms, dialogs, data-heavy lists)
  templates/      # Full-page layouts that receive all data as props (no data fetching)

apps/web/src/components/  ← the one data-connected tier, stays app-side
  pages/          # Data-connected instances — wire TanStack Query hooks into templates
```

**Placement rules:**

- **Atom** — wraps a single MUI/HTML element, no custom sub-components. Example: `StatusChip` (one `<Chip>`).
- **Molecule** — composes atoms into a cohesive display unit. Example: `CandidateCard` (Avatar + StatusChip + icons).
- **Organism** — complex section with its own interaction logic. Example: `AddCandidateDialog` (multi-field form).
- **Template** — full-page layout component; receives everything as props, fetches nothing. Example: `CandidateListView`.
- **Page** — top-level component that calls TanStack Query hooks and passes results to a template. Example: `CandidateListPage`. Lives in `apps/web` because it's the tier that imports `apps/web/src/features/**` — `@repo/ui` must never import from an app.

**File layout:** Each component folder is split into four files by concern, plus optional stories and test files:

```
packages/ui/src/molecules/
  CandidateCard/
    CandidateCard.types.ts        ← interfaces and type aliases only; no imports from styled/component
    CandidateCard.styled.tsx      ← all styled() definitions as named exports; imports from types only
    CandidateCard.component.tsx   ← React component function; imports from types + styled
    CandidateCard.stories.tsx     ← Storybook stories (co-located)
    CandidateCard.test.tsx        ← Jest unit tests (co-located)
    index.ts                      ← component barrel (public entry point for this component)
```

**Import direction is strictly one-way:** `types ← styled ← component`. Never reverse this.

### Barrel export hierarchy

Three tiers of `index.ts` files form a layered public API, all within `packages/ui`:

```
packages/ui/src/
  index.ts                        ← Tier 3 — top barrel: re-exports atoms/molecules/organisms/templates (NOT pages — pages/ isn't part of this package)
  atoms/
    index.ts                      ← Tier 2 — level barrel: re-exports all atoms as named exports
    StatusChip/
      index.ts                    ← Tier 1 — component barrel: default + public types
  molecules/
    index.ts                      ← Tier 2 — level barrel
    CandidateCard/
      index.ts                    ← Tier 1 — component barrel
  ...
```

**Tier 1 — component barrel** (`StatusChip/index.ts`): re-exports the default component and public prop types using `Props` (generic name is fine here):
```ts
export { default } from './StatusChip.component';
export type { Props } from './StatusChip.types';
```

**Tier 2 — level barrel** (`atoms/index.ts`): re-exports each component as a named export. Rename `Props` to `ComponentNameProps` to avoid collisions:
```ts
export { default as StatusChip } from './StatusChip';
export type { Props as StatusChipProps } from './StatusChip';
```

**Tier 3 — top barrel** (`packages/ui/src/index.ts`): re-exports all level barrels:
```ts
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';
```

**What NOT to include in any barrel:** `.styled.tsx` exports are implementation details — never re-export styled components.

### Import rules by context

| Context | Import from |
|---|---|
| `apps/web` importing a component (e.g. a page importing a template) | The package: `import { CandidateListView } from '@repo/ui'` |
| `apps/web`'s `App.tsx` importing `AppNav` or the theme | `import { AppNav } from '@repo/ui'`, `import theme from '@repo/ui/theme'` |
| Component in `packages/ui` importing another component | Component barrel: `import StatusChip from '../../atoms/StatusChip'` |
| Stories file (in `packages/ui`) | Component file: `import CandidateCard from './CandidateCard.component'` |
| Test file (in `packages/ui`) | Component file: `import StatusChip from './StatusChip.component'` |

**Why internal components use the component barrel (not the level or top barrel):** prevents circular imports. `CandidateCard` → `atoms/StatusChip/index.ts` is safe. `CandidateCard` → `atoms/index.ts` → re-exports molecules → `CandidateCard` would be a cycle.

**When to ask:** If a new component could reasonably be a molecule or organism, say which level you chose and why before implementing. If a new component needs data-fetching (a `features/**` hook), it belongs in `apps/web/src/components/pages/`, not `packages/ui` — that's the line that decides which side of the package boundary it's on.

---

## 6. Styling — MUI Styled + Theme (CSS vars)

### Theme setup
- **File:** `packages/ui/src/theme/theme.ts` — single source of truth. Uses `extendTheme` (not `createTheme`). Exposed to `apps/web` via the package's `./theme` export subpath: `import theme from '@repo/ui/theme'`.
- **Provider:** `apps/web/src/App.tsx` wraps the tree in `<CssVarsProvider theme={theme} defaultColorScheme="light">`. Never use `ThemeProvider` or `createTheme`.
- **Color schemes:** palette tokens live under `colorSchemes.light.palette` and `colorSchemes.dark.palette`. Add new palette tokens there, not at the top level.
- **Global base resets:** go in `components.MuiCssBaseline.styleOverrides` inside `theme.ts`. There is no SCSS file.
- **Color scheme toggle:** use the `useColorScheme()` hook from `@mui/material/styles` — it reads/writes the active scheme automatically.

### CSS variables
`CssVarsProvider` exposes every theme token as a CSS variable at runtime. Use these anywhere CSS is accepted:

| Token | CSS variable |
|---|---|
| primary (light `#aa3bff` / dark `#d4b0ff`) | `var(--mui-palette-primary-main)` |
| text-secondary `#6b6375` | `var(--mui-palette-text-secondary)` |
| border `#e5e4e7` | `var(--mui-palette-divider)` |

### Styled components
- **All MUI components in JSX must be wrapped in `styled()`** — never use a raw MUI component (e.g. `<Button>`, `<Typography>`, `<Box>`) directly. Even a wrapper with no extra styles (`styled(Button)({})`) is required.
- **All `styled()` calls live in `.styled.tsx`**, exported as named exports. Nothing is defined inline in `.component.tsx`.
- **Name wrappers semantically** (`PageHeader`, `ContactItem`), never generically (`Wrapper`, `StyledBox`).
- **`sx` only for MUI behavior props** that have no CSS equivalent — primarily icon sizes (`sx={{ fontSize: 14 }}`). Add a comment if the reason isn't obvious.
- **No `style` props. No hardcoded colour values.** Always reference `theme.palette`, `theme.spacing`, `theme.shape`, or `theme.breakpoints` inside `styled()`.
- **Responsive styles** go inside `styled()` via `theme.breakpoints.up(...)`, not via `sx={{ display: { xs: ..., sm: ... } }}`.
- **No SCSS files.** Do not create `.scss` files for any purpose.

---

## 7. Unit Testing — Jest + React Testing Library

Both `apps/web` and `packages/ui` have their own independent Jest setup — each package's tests only cover the files that physically live in it (`apps/web`'s Jest never sees `packages/ui`'s components, and vice versa).

### Stack
- **Runner:** Jest 29 with `jest-environment-jsdom`
- **Helpers:** `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
- **Transformer:** `babel-jest` + Babel 7 (`babel.config.cjs`, one per package) — strips TypeScript, transforms JSX, outputs CommonJS
- **Config:** `jest.config.cjs` per package (`.cjs` required because `"type": "module"` is set in each `package.json`)
- **Scripts:** `pnpm run test`, `pnpm run test:watch`, `pnpm run test:coverage` (run at the root via Turbo, or `--filter` a single package)

### Key config details
- Both packages' `transformIgnorePatterns` allowlist ESM-only deps (MUI, emotion, react-virtuoso, hookform, zod) so babel can transform them, **plus `\.pnpm`** — pnpm nests real packages under `node_modules/.pnpm/<pkg>@<version>/node_modules/<pkg>/...`, giving the path a second `/node_modules/` segment; without allowing `.pnpm` through, the first segment's negative-lookahead fails before the real package name is ever checked, and the file gets skipped.
- `apps/web`'s config additionally allowlists `rettime`/`until-async`/`@open-draft` (msw's ESM transitive deps) — see the integration-test section below.
- `setupFilesAfterEnv` points to each package's own `src/tests/setup.ts`.
  - `apps/web`'s setup polyfills `TextEncoder`/`TextDecoder`, `fetch`/`Request`/`Response`/`ReadableStream`/`BroadcastChannel` (for `msw/node`), plus `matchMedia`/`ResizeObserver`/`IntersectionObserver`.
  - `packages/ui`'s setup is a trimmed copy: `TextEncoder`/`TextDecoder` (react-router-dom needs it at module load) and the `matchMedia`/`ResizeObserver`/`IntersectionObserver` stubs — no msw/fetch polyfills, since MSW/integration testing is exclusively a `pages/`-tier (`apps/web`-only) concern.
- `renderWithTheme` wraps components in `CssVarsProvider + CssBaseline + MemoryRouter` so MUI tokens resolve and router `Link` components render correctly. Each package has its own copy (`apps/web/src/tests/utils.tsx` imports theme from `@repo/ui/theme`; `packages/ui/src/tests/utils.tsx` imports it from the same-package relative `../theme/theme`).
- TypeScript types for tests come from each package's own `tsconfig.test.json` — extends that package's `tsconfig.json`/`tsconfig.app.json` with `"types": ["jest", "@testing-library/jest-dom"]`. Use this tsconfig in your IDE when working on test files. **Test files and `src/tests/**` are excluded from the "app" tsconfig** (`tsconfig.app.json`'s `exclude`) — that project only type-checks shipped source, never test infrastructure, so it can't accidentally depend on ambient Jest/Node globals it doesn't declare.

### Test file layout
Each component folder gets a co-located test file:

```
packages/ui/src/molecules/
  CandidateCard/
    CandidateCard.types.ts
    CandidateCard.styled.tsx
    CandidateCard.component.tsx
    CandidateCard.test.tsx       ← co-located unit test
    CandidateCard.stories.tsx
    index.ts
```

### Shared test utilities
- **`src/tests/setup.ts`** (per package) — global setup (jest-dom matchers + jsdom stubs)
- **`src/tests/utils.tsx`** (per package) — `renderWithTheme(ui)` wraps the component in `CssVarsProvider` + `CssBaseline` so MUI tokens resolve correctly in tests

Always use `renderWithTheme` instead of bare `render`. Path depth depends on which package the test lives in — e.g. from `packages/ui/src/molecules/CandidateCard/`:
```tsx
import { renderWithTheme } from '../../tests/utils'
renderWithTheme(<MyComponent prop="value" />)
```

### What to test
Focus on **behaviour visible to the user**, not implementation details:
- Rendered text, labels, counts
- User interactions (`userEvent.click`, `userEvent.type`)
- Conditional rendering (loading states, error states, empty states)
- Callback invocations (`expect(onClose).toHaveBeenCalledTimes(1)`)

Do **not** assert on CSS class names, `styled()` internals, or MUI component structure.

### Mocking patterns
**Third-party components that don't render in jsdom** (e.g. `react-virtuoso`): mock at the module level to render all items eagerly:
```tsx
jest.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent, components }) => {
    const Footer = components?.Footer
    return (
      <div>
        {data.map((item, i) => <div key={i}>{itemContent(i, item)}</div>)}
        {Footer && <Footer />}
      </div>
    )
  },
}))
```

**Hooks that use TanStack Query / axios** (e.g. `useCandidateList` in page tests, `apps/web`-only): always use a **factory** in `jest.mock()`. Auto-mock (no factory) causes Jest to load the real module chain all the way to `@repo/api-client`'s `axiosClient → config.ts`, which contains `import.meta.env` — a Vite-only syntax that crashes Babel in Jest.

```tsx
// ✅ factory — Jest never loads the real module chain
jest.mock('../../../features/candidates/useCandidateList', () => ({
  useCandidateList: jest.fn(),
}))
// then in each test:
jest.mocked(useCandidateList).mockReturnValue({ candidates: [], isLoading: false, ... })
```

**Never call `render`/`renderWithTheme` inside `beforeEach`** — `eslint-plugin-testing-library`'s `no-render-in-lifecycle` rule forbids it. Call it as the first line of each `it` instead, even if that means repeating the same render call across tests.

### Integration tests — real hooks/API layer, MSW at the network boundary

For tests that should exercise the real `@repo/api-client → apps/web/api → queries → hook → component` chain (not a mocked hook), name the file `*.integration.test.tsx` (co-located in `apps/web`, alongside the existing hook-mocked `*.test.tsx`) and:

- Stub **only** `@repo/api-client`'s `config.ts` (`jest.mock('@repo/api-client/config', () => ({ API_BASE_URL: '/api' }))`) — everything else runs for real. This works because Jest keys mocks by resolved absolute file path: `@repo/api-client/config` and `axiosClient.ts`'s internal `./config` import both resolve to the same file (`packages/api-client/src/config.ts`), so mocking one intercepts the other — which is exactly why that package's `exports` map exposes `"./config"` as its own subpath rather than only `"."` (mocking the whole package would also stub `apiClient`/`queryClient`, breaking the requirement that the real axios chain runs).
- Reuse the same `src/mocks/handlers.ts` used for browser dev-mocking via `msw/node`'s `setupServer(...handlers)`, with `beforeAll(() => server.listen(...))` / `afterEach(() => server.resetHandlers())` / `afterAll(() => server.close())` local to the test file.
- Still mock `react-virtuoso` the eager-render way (see above) — MSW doesn't change that requirement.

This required infrastructure that's easy to lose if `apps/web/jest.config.cjs` is ever touched:
1. **`moduleNameMapper`** pinning `msw`/`msw/node` to their plain CJS builds (`node_modules/msw/lib/{core,node}/index.js`) — Jest's package-`exports` resolution otherwise picks msw's `.mjs` build, which Jest can't execute.
2. **`transformIgnorePatterns`** allowlisting `\.pnpm`, `rettime`, `until-async`, `@open-draft` (msw's ESM-only transitive deps, reached through pnpm's nested store layout) so babel transforms them instead of leaving raw `import`/`export` syntax in place; the `transform` key must also match `.mjs` files (`'^.+\\.mjs$': 'babel-jest'`).
3. **`src/tests/setup.ts`** polyfills `fetch`/`Request`/`Response`/`Headers`/`FormData` (from `undici`), `ReadableStream`/`TransformStream`/`WritableStream` (from `node:stream/web`), and `BroadcastChannel` (from `node:worker_threads`) — jsdom provides none of these, and `msw/node` needs them all. `undici` specifically must be `require()`'d (not statically imported) *after* the `TextEncoder`/`TextDecoder` globals are assigned, because `undici` reads `global.TextEncoder` at its own module-load time and static imports all evaluate before any other code in the file.

---

## 8. HTTP Client — Axios

### Instance (`packages/api-client/src/axiosClient.ts`)

A single shared axios instance lives in the `@repo/api-client` package. This is the only file that imports `axios` directly.

```
packages/api-client/src/
  axiosClient.ts   ← axios instance + interceptors + ApiError class
  config.ts        ← env-var access (import.meta.env) isolated here
  queryClient.ts   ← shared QueryClient instance (see Section 9)
  index.ts         ← barrel: exports apiClient, ApiError, ServerError, queryClient, API_BASE_URL, USE_MOCKS
```

`config.ts` isolates `import.meta.env` (Vite build-time syntax) so `axiosClient.ts` stays Jest-compatible — see **Testing note** below. This still works from inside a package: pnpm symlinks `@repo/api-client` straight to `packages/api-client` (not through `node_modules`), so Vite resolves it as ordinary first-party source and processes `import.meta.env` unchanged.

### `ApiError`

All non-2xx responses are normalised in the response interceptor into `ApiError`. Callers always deal with one type, not raw `AxiosError`.

```ts
export class ApiError extends Error {
  readonly statusCode: number
  readonly code: string | undefined
  get isNotFound()    { return this.statusCode === 404 }
  get isServerError() { return this.statusCode >= 500 }
}
```

The response interceptor uses `axios.isAxiosError<ServerError>(error)` (type-guard) to distinguish HTTP errors from network failures.

### Interceptor responsibilities

| Interceptor | Belongs here |
|---|---|
| Request | Auth headers (`Authorization: Bearer …`) |
| Response (success) | Pass through unchanged — no auto-unwrap |
| Response (error) | Normalise into `ApiError`; log; 401 redirect |
| Response (error) | Per-query business logic (e.g. map 404 → empty) — **NOT here**, put in the query function |

### API layer (`apps/web/src/api/`)

Domain files stay in `apps/web` (they're domain-specific — only this app calls them) and import `{ apiClient }` from `@repo/api-client`. Always destructure `.data` — do **not** auto-unwrap in a transformer (breaks TypeScript inference):

```ts
import { apiClient } from '@repo/api-client'

export async function fetchCandidates(params: CandidateListParams): Promise<CandidateListResponse> {
  const { data } = await apiClient.get<CandidateListResponse>('/candidates', { params })
  return data
}
```

Axios serialises `{ params }` as query string automatically — no manual `URLSearchParams` needed.

### Testing note — `import.meta.env`

`import.meta.env` is Vite build-time syntax that Babel cannot parse. Isolating it in `@repo/api-client`'s `config.ts` means only that one file is problematic. When any test mock chain would transitively reach it (e.g. `useCandidateList → candidateQueries → candidatesApi → @repo/api-client → config`), use a **factory** in `jest.mock()` — see the mocking patterns in **Section 7**.

---

## 9. Server State — TanStack Query v5

Redux / RTK Query have been removed. All server state is managed exclusively by TanStack Query.

### Provider setup

`QueryClient` lives in `packages/api-client/src/queryClient.ts` (module scope, outside the React tree) so it survives HMR and is importable by route loaders without creating import cycles with `main.tsx`.

```ts
// packages/api-client/src/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

`main.tsx` imports it from `@repo/api-client` and wraps the router:

```tsx
import { queryClient } from '@repo/api-client'

<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Two-layer API architecture

```
apps/web/src/
  api/
    candidatesApi.ts        ← plain async fetch functions, no React imports
  features/candidates/
    candidateQueries.ts     ← query key factory + useInfiniteQuery / useMutation hooks
    useCandidateList.ts     ← domain hook consumed by the page component
```

Both layers stay in `apps/web` — they're app-owned business logic, and this is precisely the layer that keeps `apps/web/src/components/pages/**` from moving into `@repo/ui` (pages call these hooks directly).

**Layer 1 — `api/`**: pure async functions that call `apiClient` (from `@repo/api-client`), destructure `.data`, and return typed data. No TanStack Query imports. Errors are automatically normalised to `ApiError` by the axios response interceptor before they reach this layer.

**Layer 2 — `candidateQueries.ts`**: imports the fetch functions and wraps them with `useInfiniteQuery` / `useMutation`. Exports a **query key factory** and the hooks:

```ts
export const candidateKeys = {
  all:   ['candidates'] as const,
  lists: () => [...candidateKeys.all,   'list'] as const,  // invalidates all list variants
  list:  () => [...candidateKeys.lists()]        as const,  // specific list (add params here when filtering is added)
};
```

Three levels let you invalidate at any scope:
- `candidateKeys.all` — every candidate cache entry
- `candidateKeys.lists()` — all list variants (current + future filtered lists)
- `candidateKeys.list()` — one exact list

Always pass `candidateKeys.lists()` (not `.list()`) to `invalidateQueries` after a mutation — this catches future filtered variants automatically.

### `infiniteQueryOptions` factory

Use `infiniteQueryOptions()` to define the query configuration once and share it across `useInfiniteQuery`, `prefetchInfiniteQuery`, and route loaders:

```ts
export const candidatesInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: candidateKeys.lists(),
  queryFn: ({ pageParam }) => fetchCandidates({ page: pageParam as number, limit: LIMIT }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
})

export function useCandidatesQuery() {
  return useInfiniteQuery(candidatesInfiniteQueryOptions) // ← pass the object, not inline options
}
```

Flatten pages in the consuming hook: `data?.pages.flatMap((p) => p.data) ?? []`.

### Mutations

```ts
useMutation({
  mutationFn: createCandidate,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: candidateKeys.lists() }),
})
```

Prefer `invalidateQueries` over manual `setQueryData` for list mutations — simpler and always consistent with the server. Always invalidate at `candidateKeys.lists()` (not `.list()`) so future filtered variants are also busted.

**Cross-resource invalidation:** when a mutation changes state that a *different* query depends on, invalidate that query's key too, not just the mutation's own resource — e.g. updating a candidate's status also appends a status-history entry server-side, so `useUpdateCandidateStatusMutation`'s `onSettled` invalidates both `candidateKeys.detail(id)` and `candidateStatusHistoryKeys.list(id)` (imported from the sibling `candidateStatusHistoryQueries.ts`). Grep for a mutation's side effects on the BE before assuming its own resource's key is the only one to bust.

### What belongs where

| Concern | File |
|---|---|
| HTTP call (axios), error normalisation | `@repo/api-client` (`axiosClient.ts`) + `apps/web/src/api/` |
| Cache config, query keys, hooks | `apps/web/src/features/*/candidateQueries.ts` |
| Domain logic (flatMap, derived state) | `apps/web/src/features/*/useCandidateList.ts` |
| Data rendering | component (`packages/ui` for presentational tiers, `apps/web` for pages) |

---

## 10. Routing — React Router v7

### Setup (`apps/web/src/router/index.tsx`)

`createBrowserRouter` with a nested route tree. `App` is the layout element (provides `CssVarsProvider` + `AppNav` + `<Outlet />`); child routes render inside `Outlet`. Routing stays entirely in `apps/web` — `pages/` never crossed the package boundary, so nothing here changed shape, only `queryClient`'s import source (now `@repo/api-client`).

```tsx
import { queryClient } from '@repo/api-client'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <CandidateListPage />,
        loader: () => {
          // Route-change prefetch: fires during navigation, before the component mounts.
          queryClient.prefetchInfiniteQuery(candidatesInfiniteQueryOptions)
          return null
        },
      },
      {
        path: '/candidates/:id',
        element: <CandidateDetailPage />,
        loader: ({ params }) => {
          if (params.id) queryClient.prefetchQuery(candidateDetailQueryOptions(params.id))
          return null
        },
      },
    ],
  },
])
```

`main.tsx` uses `RouterProvider` instead of `<App />` directly.

### Prefetching patterns

Two complementary patterns keep perceived load time low:

**Route-change prefetch (loader):** fires during navigation and warms the cache before the component mounts. Use `queryClient.prefetchInfiniteQuery(candidatesInfiniteQueryOptions)` in the route `loader`. Returns immediately (fire-and-forget) — do **not** `await` it in the loader or the navigation will stall.

**Hover prefetch (nav link):** fires when the user hovers a nav link, giving a ~100 ms head start on the fetch before the click is registered. Use the `usePrefetchCandidates` hook:

```ts
// candidateQueries.ts (apps/web/src/features/candidates/)
export function usePrefetchCandidates() {
  const queryClient = useQueryClient()
  return () => queryClient.prefetchInfiniteQuery(candidatesInfiniteQueryOptions)
}
```

```tsx
// App.tsx (apps/web) — AppNav itself comes from @repo/ui
import { AppNav } from '@repo/ui'
const prefetchCandidates = usePrefetchCandidates()
<AppNav onCandidatesHover={prefetchCandidates} ... />
```

**Hover prefetch on list cards (detail page):** wrap each card in a `CardLink` (styled router `Link`, defined in `@repo/ui`). Pass `onCardHover` from the page to the template. The page calls `usePrefetchCandidate()` which returns `(id: CandidateId) => void`:

```ts
// candidateQueries.ts (apps/web/src/features/candidates/)
export function usePrefetchCandidate() {
  const queryClient = useQueryClient()
  return (id: CandidateId) => queryClient.prefetchQuery(candidateDetailQueryOptions(String(id)))
}
```

```tsx
// CandidateListPage (apps/web) — CandidateListView comes from @repo/ui
import { CandidateListView } from '@repo/ui'
const prefetchCandidate = usePrefetchCandidate()
<CandidateListView onCardHover={prefetchCandidate} ... />
```

```tsx
// CandidateListView (packages/ui/src/templates/CandidateListView/) — internal, no app import
<CardLink to={`/candidates/${candidate.id}`} onMouseEnter={() => onCardHover(candidate.id)}>
  <CandidateCard candidate={candidate} />
</CardLink>
```

Both patterns are **no-ops when data is already fresh** — `prefetchQuery` / `prefetchInfiniteQuery` check `staleTime` before making a network request. No deduplication logic needed.

### `AppNav` organism

`packages/ui/src/organisms/AppNav/` — sticky top bar with nav links. Receives prefetch callbacks as props (the `apps/web` page/App level supplies them via hooks), keeping the organism free of feature-specific imports — this is what makes it safe for `AppNav` to live in `@repo/ui` while the hooks it's wired to stay in `apps/web`.

---

## 11. Mocking — MSW

`pnpm --filter web run dev:mock` runs the app against fully mocked API responses (no backend needed); plain `pnpm --filter web run dev` is unchanged and hits the real API. Toggle lives entirely behind one env flag — no code branches on "am I mocking." All of this stays in `apps/web` — MSW/mocking is dev/test tooling specific to this app, not shared infrastructure.

**The real API** is `claude-learn-mocks`, a separate sibling repo (typically checked out at `../claude-learn-mocks`) that `apps/web/vite.config.ts` proxies `/api` to at `localhost:8080` for `pnpm run dev`. It has its own CLAUDE.md documenting its route/controller/data conventions. When a feature needs new or changed data (not just new UI over existing data), check that repo for the matching endpoint — `handlers.ts` below is this app's own mock of it and needs the equivalent change to stay in sync, but isn't a substitute for the real endpoint existing.

- **`@repo/api-client`'s `config.ts`** — `export const USE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true'` (isolated here like `API_BASE_URL`, for the same Jest/`import.meta.env` reason).
- **`apps/web/src/main.tsx`** — an async `enableMocking()` gate runs before `createRoot(...).render(...)`; when `USE_MOCKS` is false it's a no-op and never imports `./mocks/browser`, so `pnpm run dev` behavior is provably unchanged.
- **`apps/web/src/mocks/`**:
  - `data/*.ts` — fixture arrays (generated, not hand-written one-by-one). When cycling multiple name/word pools with `i % pool.length`, give the pools **coprime lengths** (or otherwise decorrelate the indices) — same-length pools cycling on the same `i` produce repeating combinations every `lcm` records, which silently duplicates "unique" display names within a single page.
  - `handlers.ts` — MSW v2 `http`/`HttpResponse` handlers, typed with explicit generics (`http.get<{ id: string }>(...)`, `http.post<PathParams, RequestBody, ResponseBody>(...)`) rather than casting `request.json()` with `as`.
  - `browser.ts` — `setupWorker(...handlers)`, imported dynamically only when mocking is enabled.
- **Reused, not duplicated, for tests**: the same `handlers.ts` backs `msw/node`'s `setupServer` in integration tests (see Section 7) — one source of truth for what the mock API returns in both the browser and Jest.

**Known browser quirk:** a **hard page reload** while `dev:mock` is running can occasionally race the service worker's registration — the very first request after reload may bypass MSW and hit whatever's on the real backend port (or fail, if nothing's there). This never affects SPA navigation or query refetches (only the initial hard-load race), and isn't a bug in the handlers — just don't rely on a hard refresh as the way to verify mocking is working.

**Storybook**, unlike MSW, lives in `packages/ui` (see Section 5's package split) — its `.stories.tsx` files are co-located with the components it documents, all of which live in that package.

## 12. Type Architecture

All of `brand.ts`, `pagination.ts`, `result.ts`, `candidate.ts`, and `job.ts` live in **`packages/types/src/`** (`@repo/types`) — not split between app and package. `candidate.ts`/`job.ts` were originally app-local, but once `@repo/ui`'s `CandidateCard`/`JobCard`/`StatusChip` needed them directly (a package can never import upward from an app), they promoted into the one package both `apps/web` and `packages/ui` depend on downward.

- **Extract shared shapes aggressively; never merge distinct domain models.** `CandidateListResponse` and `JobListResponse` were independently hand-written, byte-identical pagination envelopes — that's the wrong kind of duplication. `Candidate` and `Job` themselves share zero fields — merging those into one "list item" type for "reuse" would be the wrong kind of reuse.
  - `packages/types/src/pagination.ts` — `PaginationParams` (`{ page, limit }`) and `PaginatedResponse<T>` (`{ data: T[], total, page, limit, hasMore }`), generic over the item type.
  - Domain files (`candidate.ts`, `job.ts`, same package) re-export thin aliases so call sites keep domain-specific names: `export type CandidateListResponse = PaginatedResponse<Candidate>`, `export type CandidateListParams = PaginationParams`.
- **Branded IDs** (`packages/types/src/brand.ts`): `type Brand<T, TBrand extends string> = T & { readonly [brand]: TBrand }` (using a `declare const brand: unique symbol` key so the tag can't collide). Applied where a real cross-domain mixup is possible — `Candidate.id: CandidateId`, `Job.id`/`ApplicationResponse.jobId: JobId` — each domain file exports a constructor (`toCandidateId(id: number): CandidateId`) rather than letting call sites `as`-cast directly. Any function that used to take a bare `id: number` across a hover-prefetch/detail-lookup boundary (`usePrefetchCandidate`, `onCardHover`, `JobCard`'s `onHover`, etc.) now takes the branded type instead — a `JobId` can no longer be passed where a `CandidateId` is expected, and vice versa. Don't brand ids that don't cross a meaningful boundary (e.g. `ApplicationResponse.id` stays a plain `number` — it's never compared against another id type).
- **Discriminated unions for lookups, not just booleans**: `packages/types/src/result.ts` — `FindResult<T> = { found: true; record: T } | { found: false }`, paired with a generic `findById<T extends { id: unknown }>(items: T[], id: T['id']): FindResult<T>` helper (in `apps/web/src/mocks/handlers.ts`) instead of `array.find() + undefined-check`. The `id: T['id']` constraint means `findById(jobs, someCandidateId)` is a type error, not just a bug waiting to happen.

Everywhere else in the codebase, import these from `@repo/types` — never re-declare or duplicate them locally in `apps/web` or `packages/ui`.

## 13. ESLint Configuration

The shared rule set lives in **`packages/eslint-config`** (`@repo/eslint-config`) as a plain array of flat-config objects — `js.configs.recommended` → `tseslint.configs.strict` → `eslint-plugin-react`'s `flat.recommended` + `flat['jsx-runtime']` → `eslint-plugin-react-hooks`'s `flat.recommended` → `eslint-plugin-react-refresh`'s `vite` config → `eslint-plugin-react-compiler`'s `recommended` → `eslint-plugin-jsx-a11y`'s `flatConfigs.recommended`, plus the test-file-scoped overrides below. Both `apps/web/eslint.config.js` and `packages/ui/eslint.config.js` spread this array and add only what's local to them:

```js
// apps/web/eslint.config.js
import { defineConfig, globalIgnores } from 'eslint/config';
import sharedConfig from '@repo/eslint-config';

export default defineConfig([
  globalIgnores(['dist', 'public/mockServiceWorker.js']),
  ...sharedConfig,
]);
```

```js
// packages/ui/eslint.config.js — Storybook plugin lives here, since Storybook does
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';
import sharedConfig from '@repo/eslint-config';

export default defineConfig([
  globalIgnores(['storybook-static']),
  ...sharedConfig,
  ...storybook.configs['flat/recommended'],
]);
```

- **`tseslint.configs.strict`**, not `strictTypeChecked` — the type-checked variant needs `parserOptions.project` wired to a tsconfig and is noticeably slower; use it only if a specific type-aware rule is actually needed.
- **`eslint-plugin-react`'s `settings.react.version` must be a hardcoded string** (e.g. `'19.2.6'`), never `'detect'` — auto-detection calls `context.getFilename()`, a method ESLint 9+'s flat-config `context` object no longer has, and the whole lint run crashes.
- **`react-refresh/only-export-components` is turned off** for `src/tests/**` and `**/*.test.{ts,tsx}` (in `@repo/eslint-config`, so it applies in both packages) — Vite Fast Refresh never processes Jest's test tree, so the rule is a false positive there (e.g. it flagged `tests/utils.tsx`'s `renderWithTheme` export purely because the file also defines an inline JSX-returning `Wrapper`).
- **`eslint-plugin-testing-library`'s `flat/react` and `eslint-plugin-jest-dom`'s `flat/recommended`** are scoped to `**/*.test.{ts,tsx}` only (neither ships its own `files` glob).
- **`public/mockServiceWorker.js`** (MSW's generated worker, `apps/web`-only) is in `apps/web`'s `globalIgnores` alongside `dist` — never lint vendor/generated files. `packages/ui`'s `globalIgnores` covers `storybook-static` instead.

**TypeScript:** shared compiler options live in `packages/tsconfig` (`@repo/tsconfig`) — `base.json` (common strict settings) and `vite-app.json` (extends `base.json`, adds DOM lib + `vite/client` types + JSX). `apps/web/tsconfig.app.json` and `packages/ui/tsconfig.json` both extend `@repo/tsconfig/vite-app.json`; `apps/web/tsconfig.node.json` extends `@repo/tsconfig/base.json` directly (no DOM/JSX needed for `vite.config.ts`). Each package's `tsconfig.test.json` extends its own `tsconfig.json`/`tsconfig.app.json` and adds Jest types — and each package's "app" tsconfig `exclude`s `src/tests` and `**/*.test.{ts,tsx}`, so test files are only ever type-checked via the `.test.json` variant (which the IDE can be pointed at explicitly), never as part of the production build.

---

## 14. Prompt Template Library

`docs/PROMPT_TEMPLATES.md` catalogs 15 reusable, project-tailored prompt templates for the frontend tasks that come up repeatedly in this workspace. Most are promoted to one-click slash commands in `.claude/commands/`; a couple exist only as copy-paste prompt text in the doc itself.

| # | Template | Command | Section this follows |
|---|---|---|---|
| 1 | Generate Component | `/generate-component` | §5 |
| 2 | Create Storybook Story | `/generate-story` | §5, §11 |
| 3 | Write RTL Unit Tests | `/write-tests` | §7 |
| 4 | Write Integration Test | `/write-integration-test` | §7 |
| 5 | Audit Accessibility | `/audit-accessibility` | §5, §6, §13 |
| 6 | Optimize Bundle | `/optimize-bundle` | §10 |
| 7 | Refactor State Management | `/refactor-state` | §9 |
| 8 | Audit Component (prop drilling) | `/audit-component` | §5 |
| 9 | Perf Check (re-renders) | `/perf-check` | §6 |
| 10 | Add TanStack Query Hook | `/add-query-hook` | §9 |
| 11 | Add Route | `/add-route` | §10 |
| 12 | Add MSW Mock Handler | `/add-mock-handler` | §11 |
| 13 | Design Domain Type | `/design-type` | §12 |
| 14 | Lint & Type-Compliance Audit | `/lint-audit` | §13 |
| 15 | Verify Feature (cross-repo acceptance test) | skill `verify-feature` | — |

**Adding a new template:** create the `.claude/commands/<name>.md` file following the existing frontmatter convention (`description` + `argument-hint`, `Target: \`$ARGUMENTS\``, numbered `##` steps ending in `## N. Summary`), add it to `.claude/commands/README.md`, and add a row + subsection to `docs/PROMPT_TEMPLATES.md`.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
