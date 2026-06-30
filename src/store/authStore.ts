import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HFAuthState, AuthMethod } from '../types/auth';

interface AuthActions {
  setToken: (token: string, method: AuthMethod) => void;
  clearToken: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const INITIAL: HFAuthState = {
  token: null,
  method: null,
  isConnected: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<HFAuthState & AuthActions>()(
  persist(
    (set) => ({
      ...INITIAL,

      setToken: (token, method) =>
        set({ token, method, isConnected: true, error: null }),

      clearToken: () =>
        set({ token: null, method: null, isConnected: false, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),
    }),
    {
      name: 'devresume-auth',
      partialize: (s) => ({ token: s.token, method: s.method, isConnected: s.isConnected }),
    }
  )
);
