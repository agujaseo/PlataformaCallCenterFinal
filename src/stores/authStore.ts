import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  role: 'admin' | 'manager' | 'operator' | 'technician' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user, role: data.user?.role as AuthState['role'] });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null });
  },
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    set({ 
      user: session?.user ?? null,
      role: session?.user?.role as AuthState['role'] ?? null,
      loading: false
    });
    
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ 
        user: session?.user ?? null,
        role: session?.user?.role as AuthState['role'] ?? null
      });
    });
  },
}));
