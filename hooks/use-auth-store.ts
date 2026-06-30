import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'household' | 'collector' | 'corporate' | null;

interface AuthState {
  role: UserRole;
  isLoggedIn: boolean;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      isLoggedIn: false,
      setRole: (role) => set({ role, isLoggedIn: role !== null }),
      logout: () => set({ role: null, isLoggedIn: false }),
    }),
    {
      name: 'ecomesh-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
