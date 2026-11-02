import supabase from './supabaseClient';
import { demoApiFetch } from './demoApi';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const useMock = import.meta.env.VITE_SUPABASE_MOCK === 'true';

export type ApiEnvelope<T> = {
  data: T;
  meta: Record<string, unknown>;
  error: null | { message: string; details?: unknown };
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (useMock) {
    return demoApiFetch(`${API_BASE}${path}`, options) as Promise<T>;
  }
  const token = await getToken();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const contentType = response.headers.get('content-type') ?? '';
  const payload: unknown = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'error' in payload
        ? String((payload as { error: unknown }).error)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

function jsonRequest<T>(path: string, method: string, body?: unknown) {
  return apiFetch<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
  });
}

export const apiClient = {
  get: <T>(path: string, signal?: AbortSignal) => apiFetch<T>(path, { signal }),
  post: <T>(path: string, body?: unknown) => jsonRequest<T>(path, 'POST', body),
  put: <T>(path: string, body?: unknown) => jsonRequest<T>(path, 'PUT', body),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
