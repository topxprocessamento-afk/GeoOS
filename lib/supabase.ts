import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)');
}

// Custom storage adapter for Supabase Auth
const storage = {
  getItem: async (key: string) => {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Type definitions for database
export type Profile = {
  id: string;
  nome_completo: string;
  telefone?: string;
  cargo: 'administrador' | 'tecnico' | 'supervisor';
  matricula?: string;
  ativo: boolean;
  avatar_url?: string;
  created_at: string;
};

export type Obra = {
  id: string;
  codigo: string;
  nome: string;
  cliente: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  status: 'ativo' | 'pausado' | 'concluido' | 'cancelado';
  data_inicio?: string;
  data_previsao_fim?: string;
  responsavel_id?: string;
  descricao?: string;
  created_at: string;
  updated_at: string;
};

export type TipoServico = {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  cor?: string;
  created_at: string;
};

export type OrdemServico = {
  id: string;
  numero_os: string;
  obra_id: string;
  tipo_servico_id?: string;
  tecnico_id: string;
  supervisor_id?: string;
  status: 'pendente' | 'em_andamento' | 'pausada' | 'concluida' | 'rejeitada';
  titulo: string;
  descricao?: string;
  observacoes_campo?: string;
  data_abertura: string;
  data_inicio_execucao?: string;
  data_conclusao?: string;
  latitude_inicio?: number;
  longitude_inicio?: number;
  latitude_fim?: number;
  longitude_fim?: number;
  endereco_campo?: string;
  clima?: string;
  assinatura_url?: string;
  created_at: string;
  updated_at: string;
};

export type RegistroFoto = {
  id: string;
  os_id: string;
  tecnico_id: string;
  foto_url: string;
  foto_original_url?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  precisao_gps?: number;
  endereco_foto?: string;
  data_hora: string;
  observacao?: string;
  etapa?: string;
  sequencia?: number;
  overlay_config?: Record<string, any>;
  created_at: string;
};

export type HistoricoOS = {
  id: string;
  os_id: string;
  usuario_id?: string;
  acao: string;
  descricao?: string;
  dados_anteriores?: Record<string, any>;
  dados_novos?: Record<string, any>;
  created_at: string;
};

export type Equipe = {
  id: string;
  nome: string;
  supervisor_id?: string;
  created_at: string;
  updated_at: string;
};
