import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { api } from '../utils/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => storage.get('auth_user'));
  const [plans, setPlans] = useState(() => storage.get('plans') || []);
  const [darkMode, setDarkMode] = useState(() => storage.get('dark_mode') !== false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    storage.set('dark_mode', darkMode);
  }, [darkMode]);

  // Persist plans locally
  useEffect(() => {
    storage.set('plans', plans);
  }, [plans]);

  // Fetch plans from backend on login or app load
  useEffect(() => {
    const fetchPlans = async () => {
      if (user && user.token) {
        try {
          const data = await api.getPlans();
          // Ensure every plan has a consistent 'id' field
          const normalized = data.map(p => ({ ...p, id: p.id || p._id }));
          setPlans(normalized);
        } catch (err) {
          console.warn('Failed to fetch plans from backend:', err.message);
        }
      }
    };
    fetchPlans();
  }, [user]);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (credentials) => {
    const data = await api.login(credentials);
    const userWithMeta = { ...data.user, token: data.token, loginAt: Date.now() };
    storage.set('auth_user', userWithMeta);
    setUser(userWithMeta);
    
    // Immediately fetch plans after login
    try {
      const fetchedPlans = await api.getPlans(data.token);
      setPlans(fetchedPlans);
    } catch (e) {
      console.warn('Initial plan fetch failed:', e.message);
    }
    
    return userWithMeta;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await api.register(userData);
    const userWithMeta = { ...data.user, token: data.token, loginAt: Date.now() };
    storage.set('auth_user', userWithMeta);
    setUser(userWithMeta);
    return userWithMeta;
  }, []);

  const logout = useCallback(() => {
    storage.remove('auth_user');
    storage.remove('plans');
    setUser(null);
    setPlans([]);
  }, []);

  // Handle unauthorized event globally (placed after logout is defined)
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [logout]);

  // ── Plans ─────────────────────────────────────────────────────────────────

  // Add a plan: save to backend then sync to local state
  const addPlan = useCallback(async (plan) => {
    try {
      const saved = await api.addPlan(plan);
      // Backend returns the saved plan with id mapped
      const planWithId = { ...plan, ...saved, id: saved.id || saved._id || plan.id };
      setPlans((prev) => [planWithId, ...prev]);
      return planWithId;
    } catch (err) {
      // Normalize local ID just in case
      const planWithId = { ...plan, id: plan.id || plan._id };
      console.warn('Could not save plan to backend, saving locally:', err.message);
      setPlans((prev) => [planWithId, ...prev]);
      return planWithId;
    }
  }, []);

  const updatePlan = useCallback(async (id, updates) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      await api.updatePlan(id, updates);
    } catch (err) {
      console.warn('Could not sync plan update to backend:', err.message);
    }
  }, []);

  const deletePlan = useCallback(async (id) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    try {
      await api.deletePlan(id);
    } catch (err) {
      console.warn('Could not delete plan from backend:', err.message);
    }
  }, []);

  const getPlan = useCallback((id) => plans.find((p) => p.id === id), [plans]);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        getPlan,
        darkMode,
        setDarkMode,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
