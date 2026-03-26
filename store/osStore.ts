import { create } from 'zustand';
import { supabase, OrdemServico, RegistroFoto } from '@/lib/supabase';

interface OSState {
  // State
  ordens: OrdemServico[];
  osAtiva: OrdemServico | null;
  fotos: RegistroFoto[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrdensDoTecnico: (tecnicoId: string) => Promise<void>;
  fetchOrdensAtivas: () => Promise<void>;
  fetchOSDetalhes: (osId: string) => Promise<void>;
  fetchFotosDaOS: (osId: string) => Promise<void>;
  criarOS: (dados: Omit<OrdemServico, 'id' | 'numero_os' | 'created_at' | 'updated_at'>) => Promise<OrdemServico>;
  atualizarStatusOS: (osId: string, novoStatus: OrdemServico['status']) => Promise<void>;
  adicionarFoto: (foto: Omit<RegistroFoto, 'id' | 'created_at'>) => Promise<RegistroFoto>;
  clearError: () => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  // Initial state
  ordens: [],
  osAtiva: null,
  fotos: [],
  isLoading: false,
  error: null,

  // Actions
  fetchOrdensDoTecnico: async (tecnicoId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('tecnico_id', tecnicoId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ ordens: data || [], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  fetchOrdensAtivas: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .in('status', ['pendente', 'em_andamento', 'pausada'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ ordens: data || [], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  fetchOSDetalhes: async (osId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*')
        .eq('id', osId)
        .single();

      if (error) throw error;

      set({ osAtiva: data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  fetchFotosDaOS: async (osId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('registros_foto')
        .select('*')
        .eq('os_id', osId)
        .order('sequencia', { ascending: true });

      if (error) throw error;

      set({ fotos: data || [], isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Fetch failed';
      set({ error: message, isLoading: false });
    }
  },

  criarOS: async (dados) => {
    set({ isLoading: true, error: null });
    try {
      // Generate OS number
      const ano = new Date().getFullYear();
      const { data: existentes } = await supabase
        .from('ordens_servico')
        .select('numero_os')
        .like('numero_os', `OS-${ano}-%`)
        .order('numero_os', { ascending: false })
        .limit(1);

      let sequencia = 1;
      if (existentes && existentes.length > 0) {
        const ultimoNumero = existentes[0].numero_os.split('-')[2];
        sequencia = parseInt(ultimoNumero) + 1;
      }

      const numeroOS = `OS-${ano}-${String(sequencia).padStart(4, '0')}`;

      const { data, error } = await supabase
        .from('ordens_servico')
        .insert([{ ...dados, numero_os: numeroOS }])
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Create failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  atualizarStatusOS: async (osId: string, novoStatus: OrdemServico['status']) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('ordens_servico')
        .update({ status: novoStatus, updated_at: new Date().toISOString() })
        .eq('id', osId);

      if (error) throw error;

      // Update local state
      const osAtiva = get().osAtiva;
      if (osAtiva && osAtiva.id === osId) {
        set({ osAtiva: { ...osAtiva, status: novoStatus } });
      }

      set({ isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  adicionarFoto: async (foto) => {
    set({ isLoading: true, error: null });
    try {
      // Get current sequence number
      const { data: ultimaFoto } = await supabase
        .from('registros_foto')
        .select('sequencia')
        .eq('os_id', foto.os_id)
        .order('sequencia', { ascending: false })
        .limit(1);

      const sequencia = (ultimaFoto?.[0]?.sequencia || 0) + 1;

      const { data, error } = await supabase
        .from('registros_foto')
        .insert([{ ...foto, sequencia }])
        .select()
        .single();

      if (error) throw error;

      // Update local fotos list
      const fotos = get().fotos;
      set({ fotos: [...fotos, data], isLoading: false });

      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Add photo failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
