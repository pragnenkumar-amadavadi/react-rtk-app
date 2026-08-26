/**
 * Tagged result of a lookup, so callers must check `found` before touching
 * `record` — TypeScript narrows the union for you instead of allowing a
 * possibly-undefined value to leak through unchecked.
 */
export type FindResult<T> = { found: true; record: T } | { found: false };
