// Centralises env-var access so the axiosClient doesn't contain Vite-specific syntax
// directly — makes it straightforward to stub in Jest via moduleNameMapper.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api';
export const USE_MOCKS: boolean = import.meta.env.VITE_ENABLE_MOCKS === 'true';
