import { create } from 'zustand';
import { supabase, Obra } from '@/lib/supabase';

interface ObraState {
  // State
  obras: Obra[];
  obraAtiva: Obra | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchObras: (filtro?: Obra['status']) => Promise<void>;
  fetchObraDetalhes: (obraId: string) => Promise<void>;
  criarObra: (dados: Omit<Obra, 'id' | 'created_at' | 'updated_at'>) => Promise<Obra>;
  atualizarObra: (obraId: string, dados: Partial<Obra>) => Promise<void>;
  atualizarStatusObra: (obraId: string, novoStatus: Obra['status']) => Promise<void>;
  clearError: () => void;
}

export const useObraStore = create<ObraState>((set, get) => ({
  // Initial state
  obras: [],
  obraAtiva: null,
  isLoading: false,
  error: null,

  // Actions
  fetchObras: async (filtro?: Obra['status']) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('obras')
        .select('*')
        .order('created_at', { ascending: false });

      if (filtro) {
        query = query.eq('status', filtro);
      }

      const { data, error } = await query;

      if (error) throw error;

      set({ obras: data || [], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  fetchObraDetalhes: async (obraId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .eq('id', obraId)
        .single();

      if (error) throw error;

      set({ obraAtiva: data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  criarObra: async (dados) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('obras')
        .insert([dados])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const obras = get().obras;
      set({ obras: [data, ...obras], isLoading: false });

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Create failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  atualizarObra: async (obraId: string, dados) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('obras')
        .update({ ...dados, updated_at: new Date().toISOString() })
        .eq('id', obraId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const obras = get().obras;
      const obraAtiva = get().obraAtiva;

      set({
        obras: obras.map((o) => (o.id === obraId ? data : o)),
        obraAtiva: obraAtiva?.id === obraId ? data : obraAtiva,
        isLoading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  atualizarStatusObra: async (obraId: string, novoStatus: Obra['status']) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('obras')
        .update({ status: novoStatus, updated_at: new Date().toISOString() })
        .eq('id', obraId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      const obras = get().obras;
      const obraAtiva = get().obraAtiva;

      set({
        obras: obras.map((o) => (o.id === obraId ? data : o)),
        obraAtiva: obraAtiva?.id === obraId ? data : obraAtiva,
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
