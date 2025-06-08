// /services/authService.ts
export async function loginService(payload: { email: string; password: string }) {
  const res = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data;
}

export async function refreshAccessToken() {
  const res = await fetch('/api/refresh-token', {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to refresh token');

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
}

export async function logoutService() {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });
  localStorage.removeItem('accessToken');
}
