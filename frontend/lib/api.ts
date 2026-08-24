import type { Company, CreateCompanyInput } from '@/types/company';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    throw new ApiError('Unable to reach the server. Check your connection.', 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      extractErrorMessage(data) ?? `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function extractErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;

  const record = data as Record<string, unknown>;

  if (typeof record.message === 'string') return record.message;
  if (Array.isArray(record.message)) {
    return record.message
      .filter((item): item is string => typeof item === 'string')
      .join(', ');
  }

  return null;
}

export function listCompanies(
  search?: string,
  signal?: AbortSignal,
): Promise<Company[]> {
  const query = search?.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : '';
  return request<Company[]>(`/companies${query}`, { signal }).then((data) => {
    if (!Array.isArray(data)) {
      throw new ApiError('Unexpected response from server.', 500);
    }
    return data;
  });
}

export function createCompany(input: CreateCompanyInput): Promise<Company> {
  return request<Company>('/companies', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function deleteCompany(id: string): Promise<void> {
  return request<void>(`/companies/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
