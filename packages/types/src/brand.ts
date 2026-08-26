declare const brand: unique symbol;

/**
 * Attaches a nominal tag to a structural type so values from different domains
 * (e.g. a candidate id vs. a job id) can't be assigned to one another by accident,
 * even though they're both plain numbers/strings at runtime.
 */
export type Brand<T, TBrand extends string> = T & { readonly [brand]: TBrand };
