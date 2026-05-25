import { create } from 'zustand';

export interface User {
  uid: string;
  email: string;
  display_name: string;
  phone_number?: string;
  farm_name?: string;
  location?: string;
  photo_url?: string;
  role?: string;
  created_at: string;
}

export interface ProfileUpdate {
  display_name?: string;
  phone_number?: string;
  farm_name?: string;
  location?: string;
  photo_url?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, display_name: string, farm_name?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
  updatePassword: (old_password: string, new_password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }
      
      const user = await response.json();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  signup: async (email: string, password: string, display_name: string, farm_name?: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, display_name, farm_name }),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }
      
      const user = await response.json();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },

  updateProfile: async (updates: ProfileUpdate) => {
    const { user } = get();
    if (!user) throw new Error('Non authentifié');

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users/${user.uid}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors de la mise à jour du profil');
    }

    const updatedUser = await response.json();
    set({ user: updatedUser });
  },

  updatePassword: async (old_password: string, new_password: string) => {
    const { user } = get();
    if (!user) throw new Error('Non authentifié');

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/users/${user.uid}/password`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ old_password, new_password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur lors du changement de mot de passe');
    }
  },
}));
