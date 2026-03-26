-- ============================================================================
-- GeoOS — Schema SQL Completo para Supabase
-- Execute este arquivo no Supabase SQL Editor para criar toda a estrutura
-- ============================================================================

-- ============================================================================
-- 1. PERFIS DE USUÁRIO (estende auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nome_completo text not null,
  telefone text,
  cargo text check (cargo in ('administrador', 'tecnico', 'supervisor')),
  matricula text unique,
  ativo boolean default true,
  avatar_url text,
  created_at timestamptz default now()
);

-- ============================================================================
-- 2. OBRAS / PROJETOS
-- ============================================================================
create table if not exists public.obras (
  id uuid default gen_random_uuid() primary key,
  codigo text unique not null,
  nome text not null,
  cliente text not null,
  endereco text,
  cidade text,
  estado text,
  latitude numeric(10,7),
  longitude numeric(10,7),
  status text check (status in ('ativo', 'pausado', 'concluido', 'cancelado')) default 'ativo',
  data_inicio date,
  data_previsao_fim date,
  responsavel_id uuid references public.profiles(id),
  descricao text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 3. TIPOS DE SERVIÇO (levantamento, locação, nivelamento, etc.)
-- ============================================================================
create table if not exists public.tipos_servico (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  descricao text,
  icone text,
  cor text,
  created_at timestamptz default now()
);

-- ============================================================================
-- 4. ORDENS DE SERVIÇO
-- ============================================================================
create table if not exists public.ordens_servico (
  id uuid default gen_random_uuid() primary key,
  numero_os text unique not null,
  obra_id uuid references public.obras(id) not null,
  tipo_servico_id uuid references public.tipos_servico(id),
  tecnico_id uuid references public.profiles(id) not null,
  supervisor_id uuid references public.profiles(id),
  status text check (status in ('pendente', 'em_andamento', 'pausada', 'concluida', 'rejeitada')) default 'pendente',
  titulo text not null,
  descricao text,
  observacoes_campo text,
  data_abertura timestamptz default now(),
  data_inicio_execucao timestamptz,
  data_conclusao timestamptz,
  latitude_inicio numeric(10,7),
  longitude_inicio numeric(10,7),
  latitude_fim numeric(10,7),
  longitude_fim numeric(10,7),
  endereco_campo text,
  clima text,
  assinatura_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- 5. REGISTROS FOTOGRÁFICOS (coração do app)
-- ============================================================================
create table if not exists public.registros_foto (
  id uuid default gen_random_uuid() primary key,
  os_id uuid references public.ordens_servico(id) on delete cascade not null,
  tecnico_id uuid references public.profiles(id) not null,
  foto_url text not null,
  foto_original_url text,
  latitude numeric(10,7) not null,
  longitude numeric(10,7) not null,
  altitude numeric(8,2),
  precisao_gps numeric(6,2),
  endereco_foto text,
  data_hora timestamptz default now(),
  observacao text,
  etapa text,
  sequencia integer,
  overlay_config jsonb,
  created_at timestamptz default now()
);

-- ============================================================================
-- 6. LOG DE HISTÓRICO DA OS
-- ============================================================================
create table if not exists public.historico_os (
  id uuid default gen_random_uuid() primary key,
  os_id uuid references public.ordens_servico(id) on delete cascade,
  usuario_id uuid references public.profiles(id),
  acao text not null,
  descricao text,
  dados_anteriores jsonb,
  dados_novos jsonb,
  created_at timestamptz default now()
);

-- ============================================================================
-- 7. EQUIPES
-- ============================================================================
create table if not exists public.equipes (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  supervisor_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.equipe_membros (
  equipe_id uuid references public.equipes(id) on delete cascade,
  tecnico_id uuid references public.profiles(id) on delete cascade,
  primary key (equipe_id, tecnico_id)
);

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.obras enable row level security;
alter table public.ordens_servico enable row level security;
alter table public.registros_foto enable row level security;
alter table public.historico_os enable row level security;
alter table public.equipes enable row level security;
alter table public.equipe_membros enable row level security;

-- ============================================================================
-- 9. POLÍTICAS RLS
-- ============================================================================

-- Profiles: Admin vê tudo, usuário vê a si mesmo
create policy "Admin vê todos os perfis" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and cargo = 'administrador')
  );

create policy "Usuário vê seu próprio perfil" on public.profiles
  for select using (id = auth.uid());

create policy "Usuário atualiza seu próprio perfil" on public.profiles
  for update using (id = auth.uid());

-- Obras: Admin vê tudo, técnico vê obras de suas OSs
create policy "Admin vê todas as obras" on public.obras
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and cargo = 'administrador')
  );

create policy "Técnico vê obras de suas OSs" on public.obras
  for select using (
    exists (
      select 1 from public.ordens_servico
      where obra_id = obras.id and tecnico_id = auth.uid()
    )
  );

-- Ordens de Serviço: Admin vê tudo, técnico vê suas OSs
create policy "Admin vê todas as OSs" on public.ordens_servico
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and cargo = 'administrador')
  );

create policy "Técnico vê suas OSs" on public.ordens_servico
  for select using (tecnico_id = auth.uid());

create policy "Técnico cria OSs" on public.ordens_servico
  for insert with check (tecnico_id = auth.uid());

create policy "Técnico atualiza suas OSs" on public.ordens_servico
  for update using (tecnico_id = auth.uid());

-- Registros Fotográficos: Admin vê tudo, técnico vê suas fotos
create policy "Admin vê todas as fotos" on public.registros_foto
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and cargo = 'administrador')
  );

create policy "Técnico vê suas fotos" on public.registros_foto
  for select using (tecnico_id = auth.uid());

create policy "Técnico insere suas fotos" on public.registros_foto
  for insert with check (tecnico_id = auth.uid());

-- Histórico: Admin vê tudo, técnico vê histórico de suas OSs
create policy "Admin vê todo histórico" on public.historico_os
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and cargo = 'administrador')
  );

create policy "Técnico vê histórico de suas OSs" on public.historico_os
  for select using (
    exists (
      select 1 from public.ordens_servico
      where id = historico_os.os_id and tecnico_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. STORAGE BUCKET PARA FOTOS
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('fotos-os', 'fotos-os', true)
on conflict (id) do nothing;

-- ============================================================================
-- 11. ÍNDICES PARA PERFORMANCE
-- ============================================================================
create index if not exists idx_ordens_servico_tecnico_id on public.ordens_servico(tecnico_id);
create index if not exists idx_ordens_servico_obra_id on public.ordens_servico(obra_id);
create index if not exists idx_ordens_servico_status on public.ordens_servico(status);
create index if not exists idx_registros_foto_os_id on public.registros_foto(os_id);
create index if not exists idx_registros_foto_tecnico_id on public.registros_foto(tecnico_id);
create index if not exists idx_registros_foto_data_hora on public.registros_foto(data_hora);
create index if not exists idx_historico_os_os_id on public.historico_os(os_id);
create index if not exists idx_obras_status on public.obras(status);

-- ============================================================================
-- 12. DADOS INICIAIS (TIPOS DE SERVIÇO)
-- ============================================================================
insert into public.tipos_servico (nome, descricao, icone, cor)
values
  ('Levantamento Topográfico', 'Levantamento e mapeamento de terreno', 'map', '#FF2020'),
  ('Locação', 'Locação de pontos e alinhamentos', 'location-sharp', '#FBBF24'),
  ('Nivelamento', 'Nivelamento e determinação de cotas', 'water', '#4ADE80'),
  ('Batimetria', 'Levantamento de profundidades', 'water-outline', '#0a7ea4'),
  ('Inspeção', 'Inspeção de estruturas e obras', 'eye', '#F87171'),
  ('Outro', 'Outros tipos de serviço', 'help-circle', '#9BA1A6')
on conflict do nothing;

-- ============================================================================
-- 13. FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para gerar número de OS automaticamente
create or replace function public.gerar_numero_os()
returns text as $$
declare
  v_ano integer;
  v_sequencia integer;
  v_numero_os text;
begin
  v_ano := extract(year from now())::integer;
  
  select coalesce(max(cast(substring(numero_os from 9) as integer)), 0) + 1
  into v_sequencia
  from public.ordens_servico
  where numero_os like 'OS-' || v_ano::text || '-%';
  
  v_numero_os := 'OS-' || v_ano::text || '-' || lpad(v_sequencia::text, 4, '0');
  
  return v_numero_os;
end;
$$ language plpgsql;

-- Função para registrar mudança de status na OS
create or replace function public.registrar_mudanca_os()
returns trigger as $$
begin
  if new.status != old.status then
    insert into public.historico_os (os_id, usuario_id, acao, descricao, dados_anteriores, dados_novos)
    values (
      new.id,
      auth.uid(),
      'mudanca_status',
      'Status alterado de ' || old.status || ' para ' || new.status,
      jsonb_build_object('status', old.status),
      jsonb_build_object('status', new.status)
    );
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger para registrar mudanças de status
create trigger trigger_registrar_mudanca_os
after update on public.ordens_servico
for each row
execute function public.registrar_mudanca_os();

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
