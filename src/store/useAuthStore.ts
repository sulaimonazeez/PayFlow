import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

/**
 * Phase 1 stub: no real session yet, just enough state for the route guard
 * to branch on. Phase 2 replaces `login`/`logout` with the real mock
 * auth service and persists the session.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
