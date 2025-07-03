import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setToken, removeToken } from '@/lib/auth';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        setToken(token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        removeToken();
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) => 
        set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
); 