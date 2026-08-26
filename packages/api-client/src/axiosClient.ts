import axios from 'axios';
import { API_BASE_URL } from './config';

export interface ServerError {
  message?: string;
  error?: string;  // mock server sends { error: '...' } for non-2xx
  code?: string;
}

// Typed error surfaced to TanStack Query — wraps every non-2xx response
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string | undefined;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }

  get isNotFound()    { return this.statusCode === 404; }
  get isServerError() { return this.statusCode >= 500; }
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// --- Request interceptor (auth headers go here when needed) ---
apiClient.interceptors.request.use((config) => {
  // const token = getToken()
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config;
});

// --- Response interceptor — normalise every error into ApiError ---
// Keeps query/mutation error handlers dealing with one type, not raw AxiosError.
// Per-query business logic (e.g. map 404 → empty state) stays in the query function.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ServerError>(error)) {
      const statusCode = error.response?.status ?? 0;
      const message = error.response?.data?.message ?? error.response?.data?.error ?? error.message;
      const code = error.response?.data?.code;
      return Promise.reject(new ApiError(message, statusCode, code));
    }
    return Promise.reject(error);
  },
);

export default apiClient;
