export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('harmonny_token');
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
