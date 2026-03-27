import { create } from 'zustand';
import { supabase, Profile } from '@/lib/supabase';
import * as SecureStore from 'expo-secure-store';

export type UserRole = 'administrador' | 'tecnico' | 'supervisor';

interface AuthState {
  // State
  user: { id: string; email: string } | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  profile: null,
  role: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('[Auth] Starting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[Auth] Login response:', { hasError: !!error, errorMsg: error?.message, userId: data.user?.id });
      if (error) throw error;
      if (!data.user) throw new Error('No user returned from login');

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      set({
        user: { id: data.user.id, email: data.user.email || '' },
        profile: profileData,
        role: profileData.cargo,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        profile: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (data.session?.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profileError) throw profileError;

        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email || '',
          },
          profile: profileData,
          role: profileData.cargo,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          profile: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Auth check failed';
      set({ error: message, isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    set({ isLoading: true, error: null });
    try {
      const currentProfile = get().profile;
      if (!currentProfile) throw new Error('No profile loaded');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', currentProfile.id)
        .select()
        .single();

      if (error) throw error;

      set({
        profile: data,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
