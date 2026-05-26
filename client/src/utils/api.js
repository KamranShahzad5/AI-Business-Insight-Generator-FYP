// ── Base URL ─────────────────────────────────────────────────────────────────
// Make sure your frontend root .env has: VITE_API_URL=http://localhost:5000/api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Auth helpers ─────────────────────────────────────────────────────────────
const getHeaders = () => {
  try {
    const stored = localStorage.getItem('auth_user');
    const user = stored ? JSON.parse(stored) : null;
    return {
      'Content-Type': 'application/json',
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
};

// ── Generic fetch helper ─────────────────────────────────────────────────────
const request = async (url, options = {}) => {
  const res = await fetch(url, options);
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server error (${res.status})`);
  }
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('plans');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    throw new Error(data?.msg || `Request failed with status ${res.status}`);
  }
  return data;
};

// ── API object ───────────────────────────────────────────────────────────────
export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  register: (userData) =>
    request(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }),

  // ── Plans ─────────────────────────────────────────────────────────────────
  getPlans: () =>
    request(`${API_URL}/plans`, { headers: getHeaders() }),

  addPlan: (plan) =>
    request(`${API_URL}/plans`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(plan),
    }),

  updatePlan: (id, updates) =>
    request(`${API_URL}/plans/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    }),

  deletePlan: (id) =>
    request(`${API_URL}/plans/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }),

  // ── AI ────────────────────────────────────────────────────────────────────
  generateAIPlan: (idea, industry, budget) =>
    request(`${API_URL}/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, industry, budget }),
    }),

  generateAIChat: (message, planContext) =>
    request(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, planContext }),
    }),
};

// ── Market Research ───────────────────────────────────────────────────────
export const getMarketResearch = (idea, industry, budget) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return fetch(`${API_URL}/market/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, industry, budget }),
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.msg || 'Market research failed');
    return data;
  });
};
