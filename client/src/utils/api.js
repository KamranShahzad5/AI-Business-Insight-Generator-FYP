const API_URL = import.meta.env.VITE_API_URL || 'https://ai-business-insight-generator-fyp-2.onrender.com/api';

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

const request = async (url, options = {}) => {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error('Cannot connect to server. Please try again in a moment.');
  }
  let data;
  // ✅ NEW - safe
const text = await res.text();
let data = {};
try {
  data = text ? JSON.parse(text) : {};
} catch {
  throw new Error(`Server returned invalid response (status ${res.status})`);
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

export const api = {
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

export const getMarketResearch = (idea, industry, budget) => {
  const url = import.meta.env.VITE_API_URL || 'https://ai-business-insight-generator-fyp-2.onrender.com/api';
  return fetch(`${url}/market/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, industry, budget }),
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data?.msg || 'Market research failed');
    return data;
  }).catch(err => {
    if (err.message && err.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please try again.');
    }
    throw err;
  });
};
