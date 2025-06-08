const API_BASE = 'http://localhost:8080/api'; // adjust if needed

const TOKEN_KEY = 'accessToken';

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Login failed');
  }

  const { accessToken } = await res.json();
  localStorage.setItem(TOKEN_KEY, accessToken);
  return accessToken;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = () => !!getToken();